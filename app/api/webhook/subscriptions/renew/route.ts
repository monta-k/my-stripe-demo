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

  console.log(eventData)
  const firestore = getFirestore()
  const col = firestore.collection('stripeInvoiceEvent')
  await col.doc(eventData.id).set(JSON.parse(JSON.stringify(eventData)))
  return NextResponse.json({ received: true })
}
