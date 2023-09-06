import { NextResponse } from 'next/server'
import { verifyAuth } from '@/backend/lib/auth/middleware'
import { STRIPE_BASIC_PLAN_ID, STRIPE_USAGE_TOKEN_PLAN_ID, stripe } from '@/backend/lib/stripe'
import { subscriptionRepository } from '@/backend/infrastructure/respository'

export async function POST(request: Request) {
  const result = await verifyAuth(request)
  if (result.isFailure) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const subscription = await subscriptionRepository.getSubscription(result.value.firebaseAuthId)
  if (subscription?.isActiveSubscription()) return NextResponse.json({ error: 'Already Subscribed' }, { status: 400 })

  const protocol = request.headers.get('x-forwarded-proto') || 'http'
  const hostname = request.headers.get('host') || ''
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price: STRIPE_BASIC_PLAN_ID,
        quantity: 1
      },
      {
        price: STRIPE_USAGE_TOKEN_PLAN_ID
      }
    ],
    mode: 'subscription',
    success_url: `${protocol}://${hostname}/checkout/success`,
    cancel_url: `${protocol}://${hostname}/checkout/cancel`,
    customer: subscription?.stripeCustomerId,
    subscription_data: {
      metadata: {
        userId: result.value.firebaseAuthId
      }
    },
    metadata: {
      userId: result.value.firebaseAuthId
    }
  })

  if (!session.url) {
    NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    return
  }

  return NextResponse.redirect(session.url, { status: 303 })
}
