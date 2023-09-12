import { subscriptionRepository } from '@/backend/infrastructure/respository'
import { getFirestore } from '@/backend/lib/firebase-admin/store'
import { constructStripeEvent, stripeInvoicePaymentSucceededEvent } from '@/backend/lib/stripe'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  let eventData
  try {
    eventData = await constructStripeEvent(request, stripeInvoicePaymentSucceededEvent)
  } catch (err) {
    return NextResponse.json({ error: 'Failed to construct stripe event' }, { status: 401 })
  }

  // debug
  console.log(eventData)
  const firestore = getFirestore()
  const col = firestore.collection('stripeInvoiceEvent')
  await col.doc(eventData.id).set(JSON.parse(JSON.stringify(eventData)))

  if (eventData.billing_reason === 'subscription_cycle') {
    const userId = eventData.subscription_details?.metadata?.userId
    if (!userId) return NextResponse.json({ error: 'userId not found' }, { status: 400 })

    const subscription = await subscriptionRepository.getSubscription(userId)
    if (!subscription) return NextResponse.json({ error: 'subscription not found' }, { status: 400 })

    subscription.renew(eventData.period_start * 1000, eventData.period_end * 1000)
    await subscriptionRepository.saveSubscription(subscription)
  }
  return NextResponse.json({ received: true })
}
