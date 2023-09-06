import { IdValue, Id } from '../common/id'

export class Subscription {
  id: IdValue
  userId: string
  stripeCustomerId: string
  stripeSubscriptionId: string
  stripeBasicPlanSubscriptionItemId: string
  stripeUsageTokenPlanSubscriptionItemId: string
  startedAt: number
  currentPeriodStartedAt: number
  currentPeriodEndAt: number

  private constructor(
    id: IdValue,
    userId: string,
    stripeCustomerId: string,
    stripeSubscriptionId: string,
    stripeBasicPlanSubscriptionItemId: string,
    stripeUsageTokenPlanSubscriptionItemId: string,
    startedAt: number,
    currentPeriodStartedAt: number,
    currentPeriodEndAt: number
  ) {
    this.id = id
    this.userId = userId
    this.stripeCustomerId = stripeCustomerId
    this.stripeSubscriptionId = stripeSubscriptionId
    this.stripeBasicPlanSubscriptionItemId = stripeBasicPlanSubscriptionItemId
    this.stripeUsageTokenPlanSubscriptionItemId = stripeUsageTokenPlanSubscriptionItemId
    this.startedAt = startedAt
    this.currentPeriodStartedAt = currentPeriodStartedAt
    this.currentPeriodEndAt = currentPeriodEndAt
  }

  public isActive(): boolean {
    const now = new Date().getTime()
    return this.currentPeriodStartedAt <= now && now <= this.currentPeriodEndAt
  }

  public static create(
    userId: string,
    stripeCustomerId: string,
    stripeSubscriptionId: string,
    stripeBasicPlanSubscriptionItemId: string,
    stripeUsageTokenPlanSubscriptionItemId: string,
    startedAt: number,
    currentPeriodStartedAt: number,
    currentPeriodEndAt: number
  ): Subscription {
    const id = new Id().value
    return new Subscription(
      id,
      userId,
      stripeCustomerId,
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
    stripeCustomerId: string,
    stripeSubscriptionId: string,
    stripeBasicPlanSubscriptionItemId: string,
    stripeUsageTokenPlanSubscriptionItemId: string,
    startedAt: number,
    currentPeriodStartedAt: number,
    currentPeriodEndAt: number
  ): Subscription {
    return new Subscription(
      id,
      userId,
      stripeCustomerId,
      stripeSubscriptionId,
      stripeBasicPlanSubscriptionItemId,
      stripeUsageTokenPlanSubscriptionItemId,
      startedAt,
      currentPeriodStartedAt,
      currentPeriodEndAt
    )
  }
}
