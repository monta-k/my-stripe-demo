import { constructStripeEvent, stripeCustomerSubscriptionCreatedEvent } from '@/backend/lib/stripe'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  let eventData
  try {
    eventData = await constructStripeEvent(request, stripeCustomerSubscriptionCreatedEvent)
  } catch (err) {
    return NextResponse.json({ error: 'Failed to construct stripe event' }, { status: 401 })
  }

  console.log(eventData)
  return NextResponse.json({ received: true })
}
