import { IdValue, Id } from '../common/id'

export class Subscription {
  id: IdValue
  userId: string
  stripeSubscriptionId: string
  stripeBasicPlanSubscriptionItemId: string
  stripeUsageTokenPlanSubscriptionItemId: string
  startedAt: Date
  currentPeriodStartedAt: Date
  currentPeriodEndAt: Date

  private constructor(
    id: IdValue,
    userId: string,
    stripeSubscriptionId: string,
    stripeBasicPlanSubscriptionItemId: string,
    stripeUsageTokenPlanSubscriptionItemId: string,
    startedAt: Date,
    currentPeriodStartedAt: Date,
    currentPeriodEndAt: Date
  ) {
    this.id = id
    this.userId = userId
    this.stripeSubscriptionId = stripeSubscriptionId
    this.stripeBasicPlanSubscriptionItemId = stripeBasicPlanSubscriptionItemId
    this.stripeUsageTokenPlanSubscriptionItemId = stripeUsageTokenPlanSubscriptionItemId
    this.startedAt = startedAt
    this.currentPeriodStartedAt = currentPeriodStartedAt
    this.currentPeriodEndAt = currentPeriodEndAt
  }

  public static create(
    userId: string,
    stripeSubscriptionId: string,
    stripeBasicPlanSubscriptionItemId: string,
    stripeUsageTokenPlanSubscriptionItemId: string,
    startedAt: Date,
    currentPeriodStartedAt: Date,
    currentPeriodEndAt: Date
  ): Subscription {
    const id = new Id().value
    return new Subscription(
      id,
      userId,
      stripeSubscriptionId,
      stripeBasicPlanSubscriptionItemId,
      stripeUsageTokenPlanSubscriptionItemId,
      startedAt,
      currentPeriodStartedAt,
      currentPeriodEndAt
    )
  }

  public static reConstruct(
    id: IdValue,
    userId: string,
    stripeSubscriptionId: string,
    stripeBasicPlanSubscriptionItemId: string,
    stripeUsageTokenPlanSubscriptionItemId: string,
    startedAt: Date,
    currentPeriodStartedAt: Date,
    currentPeriodEndAt: Date
  ): Subscription {
    return new Subscription(
      id,
      userId,
      stripeSubscriptionId,
      stripeBasicPlanSubscriptionItemId,
      stripeUsageTokenPlanSubscriptionItemId,
      startedAt,
      currentPeriodStartedAt,
      currentPeriodEndAt
    )
  }
}
