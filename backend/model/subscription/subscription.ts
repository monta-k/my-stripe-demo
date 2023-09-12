import { IdValue, Id } from '../common/id'

const subscriptionStatusAcrive = 'active'
const subscriptionStatusCanceled = 'canceled'
type SubscriptionStatus = typeof subscriptionStatusAcrive | typeof subscriptionStatusCanceled

export class Subscription {
  id: IdValue
  userId: string
  stripeCustomerId: string
  stripeSubscriptionId: string
  stripeBasicPlanSubscriptionItemId: string
  stripeUsageTokenPlanSubscriptionItemId: string
  status: SubscriptionStatus
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
    status: SubscriptionStatus,
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
    this.status = status
    this.startedAt = startedAt
    this.currentPeriodStartedAt = currentPeriodStartedAt
    this.currentPeriodEndAt = currentPeriodEndAt
  }

  private isAcriveStatus(): boolean {
    return this.status === subscriptionStatusAcrive
  }

  public isActiveSubscription(): boolean {
    const now = new Date().getTime()
    return this.isAcriveStatus() && this.currentPeriodStartedAt <= now && now <= this.currentPeriodEndAt
  }

  public cancelSubscription(): void {
    this.status = subscriptionStatusCanceled
  }

  public renew(currentPeriodStartedAt: number, currentPeriodEndAt: number): void {
    if (!this.isAcriveStatus()) throw new Error('subscription is not active')

    this.currentPeriodStartedAt = currentPeriodStartedAt
    this.currentPeriodEndAt = currentPeriodEndAt
  }

  public resubscribe(
    stripeSubscriptionId: string,
    stripeBasicPlanSubscriptionItemId: string,
    stripeUsageTokenPlanSubscriptionItemId: string,
    currentPeriodStartedAt: number,
    currentPeriodEndAt: number
  ): void {
    if (this.isAcriveStatus()) throw new Error('subscription is already active')

    this.status = subscriptionStatusAcrive
    this.stripeSubscriptionId = stripeSubscriptionId
    this.stripeBasicPlanSubscriptionItemId = stripeBasicPlanSubscriptionItemId
    this.stripeUsageTokenPlanSubscriptionItemId = stripeUsageTokenPlanSubscriptionItemId
    this.currentPeriodStartedAt = currentPeriodStartedAt
    this.currentPeriodEndAt = currentPeriodEndAt
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
      subscriptionStatusAcrive,
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
    status: SubscriptionStatus,
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
      status,
      startedAt,
      currentPeriodStartedAt,
      currentPeriodEndAt
    )
  }
}
