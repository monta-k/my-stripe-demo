import Stripe from 'stripe'
import { STRIPE_WEBHOOK_SECRET, stripe } from './const'

export const stripeCustomerSubscriptionCreatedEvent = 'customer.subscription.created'
export const stripeInvoiceCreatedEvent = 'invoice.created'

type StripeEventType = typeof stripeCustomerSubscriptionCreatedEvent | typeof stripeInvoiceCreatedEvent
type StripeEventReturn<T> = T extends typeof stripeCustomerSubscriptionCreatedEvent
  ? Stripe.Subscription
  : T extends typeof stripeInvoiceCreatedEvent
  ? Stripe.Invoice
  : never

export async function constructStripeEvent<T extends StripeEventType>(
  request: Request,
  eventType: T
): Promise<StripeEventReturn<T>> {
  const signature = request.headers.get('stripe-signature') || ''
  const body = await request.arrayBuffer()

  const event = stripe.webhooks.constructEvent(Buffer.from(body), signature, STRIPE_WEBHOOK_SECRET)
  if (event.type !== eventType) throw new Error('Invalid Stripe event type')

  switch (event.type) {
    case stripeCustomerSubscriptionCreatedEvent:
      return event.data.object as StripeEventReturn<T>
    case stripeInvoiceCreatedEvent:
      return event.data.object as StripeEventReturn<T>
    default:
      throw new Error('Unhandled Stripe event type')
  }
}
