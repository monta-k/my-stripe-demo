import { subscriptionRepository } from '@/backend/infrastructure/respository'
import { constructStripeEvent, stripeCustomerSubscriptionCreatedEvent } from '@/backend/lib/stripe'
import { Subscription } from '@/backend/model/subscription/subscription'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

export async function POST(request: Request) {
  let eventData: Stripe.Subscription
  try {
    eventData = await constructStripeEvent(request, stripeCustomerSubscriptionCreatedEvent)
  } catch (err) {
    return NextResponse.json({ error: 'Failed to construct stripe event' }, { status: 401 })
  }

  for (const item of eventData.items.data) {
    const subscription = Subscription.create(
      eventData.id,
      eventData.metadata.userId,
      item.id,
      new Date(eventData.start_date * 1000),
      new Date(eventData.current_period_start * 1000),
      new Date(eventData.current_period_end * 1000)
    )
    await subscriptionRepository.saveSubscription(subscription)
  }

  return NextResponse.json({ received: true })
}
