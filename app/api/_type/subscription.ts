export interface Subscription {
  id: string
  userId: string
  stripeSubscriptionId: string
  stripeBasicPlanSubscriptionItemId: string
  stripeUsageTokenPlanSubscriptionItemId: string
  startedAt: Date
  currentPeriodStartedAt: Date
  currentPeriodEndAt: Date
}
