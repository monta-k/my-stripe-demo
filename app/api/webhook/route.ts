import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || ''
const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: '2023-08-16' })
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || ''

export async function POST(request: Request) {
  const signature = request.headers.get('stripe-signature') || ''
  const body = await request.arrayBuffer()

  let event
  try {
    event = stripe.webhooks.constructEvent(Buffer.from(body), signature, STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    return NextResponse.json({ error: 'Webhook Error' }, { status: 401 })
  }

  switch (event.type) {
    case 'customer.subscription.created':
      handleSubscriptionCreated(event.data.object)
  }

  return NextResponse.json({ received: true })
}

function handleSubscriptionCreated(subscription: Stripe.Event.Data.Object) {
  console.log(subscription)
}
