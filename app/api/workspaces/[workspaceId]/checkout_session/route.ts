import { NextResponse } from 'next/server'
import { verifyAuth } from '@/backend/lib/auth/middleware'
import { STRIPE_BASIC_PLAN_ID, STRIPE_USAGE_TOKEN_PLAN_ID, stripe } from '@/backend/lib/stripe'
import { subscriptionRepository } from '@/backend/infrastructure/respository'
import { workspaceQuery } from '@/backend/infrastructure/query'

export async function POST(request: Request, { params }: { params: { workspaceId: string } }) {
  const result = await verifyAuth(request)
  if (result.isFailure) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { workspaceId } = params
  if (!workspaceId) {
    return NextResponse.json({ error: 'workspaceId is invalid' }, { status: 400 })
  }

  const workspace = await workspaceQuery.getWorkspace(workspaceId)
  if (!workspace?.members.some(member => member.authId === result.value.firebaseAuthId))
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const subscription = await subscriptionRepository.getSubscription(workspace.id)
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
    success_url: `${protocol}://${hostname}/workspaces/${workspaceId}/checkout/success`,
    cancel_url: `${protocol}://${hostname}/workspaces/${workspaceId}/checkout/cancel`,
    customer: subscription?.stripeCustomerId,
    subscription_data: {
      metadata: {
        workspaceId: workspace.id
      }
    },
    metadata: {
      workspaceId: workspace.id
    }
  })

  if (!session.url) {
    NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    return
  }

  return NextResponse.redirect(session.url, { status: 303 })
}
