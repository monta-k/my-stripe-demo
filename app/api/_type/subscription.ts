export interface Subscription {
  id: string
  workspaceId: string
  stripeSubscriptionId: string
  stripeBasicPlanSubscriptionItemId: string
  stripeUsageTokenPlanSubscriptionItemId: string
  isActive: boolean
  startedAt: Date
  currentPeriodStartedAt: Date
  currentPeriodEndAt: Date
}
