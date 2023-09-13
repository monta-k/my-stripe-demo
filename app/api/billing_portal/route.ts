import { NextResponse } from 'next/server'
import { verifyAuth } from '@/backend/lib/auth/middleware'
import { stripe } from '@/backend/lib/stripe'
import { subscriptionRepository } from '@/backend/infrastructure/respository'

export async function POST(request: Request) {
  const result = await verifyAuth(request)
  if (result.isFailure) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const subscription = await subscriptionRepository.getSubscription(result.value.firebaseAuthId)
  if (!subscription) return NextResponse.json({ error: 'No Subscription' }, { status: 400 })

  const protocol = request.headers.get('x-forwarded-proto') || 'http'
  const hostname = request.headers.get('host') || ''
  const session = await stripe.billingPortal.sessions.create({
    return_url: `${protocol}://${hostname}`,
    customer: subscription.stripeCustomerId
  })

  if (!session.url) {
    NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    return
  }

  return NextResponse.redirect(session.url, { status: 303 })
}
