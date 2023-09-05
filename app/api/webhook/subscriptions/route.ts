import { subscriptionRepository } from '@/backend/infrastructure/respository'
import {
  STRIPE_BASIC_PLAN_ID,
  STRIPE_USAGE_TOKEN_PLAN_ID,
  constructStripeEvent,
  stripeCustomerSubscriptionCreatedEvent
} from '@/backend/lib/stripe'
import { Subscription } from '@/backend/model/subscription/subscription'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  let eventData
  try {
    eventData = await constructStripeEvent(request, stripeCustomerSubscriptionCreatedEvent)
  } catch (err) {
    return NextResponse.json({ error: 'Failed to construct stripe event' }, { status: 401 })
  }

  const basicPlanSubscriptionItemId = eventData.items.data.find(data => data.plan.id === STRIPE_BASIC_PLAN_ID)?.id
  const usageTokenPlanSubscriptionItemId = eventData.items.data.find(
    data => data.plan.id === STRIPE_USAGE_TOKEN_PLAN_ID
  )?.id

  if (!basicPlanSubscriptionItemId || !usageTokenPlanSubscriptionItemId)
    return NextResponse.json({ error: 'subscription plan not found' }, { status: 400 })

  const subscription = Subscription.create(
    eventData.metadata.userId,
    eventData.id,
    basicPlanSubscriptionItemId,
    usageTokenPlanSubscriptionItemId,
    eventData.start_date,
    eventData.current_period_start,
    eventData.current_period_end
  )
  await subscriptionRepository.saveSubscription(subscription)

  return NextResponse.json({ received: true })
}
