import { subscriptionRepository } from '@/backend/infrastructure/respository'
import { constructStripeEvent, stripeCustomerSubscriptionDeletedEvent } from '@/backend/lib/stripe'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  let eventData
  try {
    eventData = await constructStripeEvent(request, stripeCustomerSubscriptionDeletedEvent)
  } catch (err) {
    return NextResponse.json({ error: 'Failed to construct stripe event' }, { status: 401 })
  }

  const subscription = await subscriptionRepository.getSubscription(eventData.metadata.workspaceId)
  if (!subscription) return NextResponse.json({ error: 'subscription not found' }, { status: 400 })

  subscription.cancelSubscription()

  await subscriptionRepository.saveSubscription(subscription)

  return NextResponse.json({ received: true })
}
