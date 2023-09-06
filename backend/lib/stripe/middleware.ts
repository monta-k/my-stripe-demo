import Stripe from 'stripe'
import { STRIPE_SUBSCRIPTION_CREATED_WEBHOOK_SECRET, STRIPE_SUBSCRIPTION_DELETED_WEBHOOK_SECRET, stripe } from './const'

export const stripeCustomerSubscriptionCreatedEvent = 'customer.subscription.created'
export const stripeCustomerSubscriptionDeletedEvent = 'customer.subscription.deleted'
export const stripeInvoiceCreatedEvent = 'invoice.created'

type StripeEventType =
  | typeof stripeCustomerSubscriptionCreatedEvent
  | typeof stripeCustomerSubscriptionDeletedEvent
  | typeof stripeInvoiceCreatedEvent
type StripeEventReturn<T> = T extends
  | typeof stripeCustomerSubscriptionCreatedEvent
  | typeof stripeCustomerSubscriptionDeletedEvent
  ? Stripe.Subscription
  : T extends typeof stripeInvoiceCreatedEvent
  ? Stripe.Invoice
  : never

const stripeWebhookSecrets: Record<StripeEventType, string> = {
  [stripeCustomerSubscriptionCreatedEvent]: STRIPE_SUBSCRIPTION_CREATED_WEBHOOK_SECRET,
  [stripeCustomerSubscriptionDeletedEvent]: STRIPE_SUBSCRIPTION_DELETED_WEBHOOK_SECRET,
  [stripeInvoiceCreatedEvent]: ''
}

export async function constructStripeEvent<T extends StripeEventType>(
  request: Request,
  eventType: T
): Promise<StripeEventReturn<T>> {
  const signature = request.headers.get('stripe-signature') || ''
  const body = await request.arrayBuffer()

  const webhookSecret = stripeWebhookSecrets[eventType]

  const event = stripe.webhooks.constructEvent(Buffer.from(body), signature, webhookSecret)
  if (event.type !== eventType) throw new Error('Invalid Stripe event type')

  switch (event.type) {
    case stripeCustomerSubscriptionCreatedEvent:
    case stripeCustomerSubscriptionDeletedEvent:
    case stripeInvoiceCreatedEvent:
      return event.data.object as StripeEventReturn<T>
    default:
      throw new Error('Unhandled Stripe event type')
  }
}
