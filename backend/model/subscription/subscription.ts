import { IdValue, Id } from '../common/id'

export class Subscription {
  id: IdValue
  userId: string
  stripeSubscriptionId: string
  stripeSubscriptionItemId: string
  startedAt: Date
  currentPeriodStartedAt: Date
  currentPeriodEndAt: Date

  private constructor(
    id: IdValue,
    userId: string,
    stripeSubscriptionId: string,
    stripeSubscriptionItemId: string,
    startedAt: Date,
    currentPeriodStartedAt: Date,
    currentPeriodEndAt: Date
  ) {
    this.id = id
    this.userId = userId
    this.stripeSubscriptionId = stripeSubscriptionId
    this.stripeSubscriptionItemId = stripeSubscriptionItemId
    this.startedAt = startedAt
    this.currentPeriodStartedAt = currentPeriodStartedAt
    this.currentPeriodEndAt = currentPeriodEndAt
  }

  public static create(
    userId: string,
    stripeSubscriptionId: string,
    stripeSubscriptionItemId: string,
    startedAt: Date,
    currentPeriodStartedAt: Date,
    currentPeriodEndAt: Date
  ): Subscription {
    const id = new Id().value
    return new Subscription(
      id,
      userId,
      stripeSubscriptionId,
      stripeSubscriptionItemId,
      startedAt,
      currentPeriodStartedAt,
      currentPeriodEndAt
    )
  }

  public static reConstruct(
    id: IdValue,
    userId: string,
    stripeSubscriptionId: string,
    stripeSubscriptionItemId: string,
    startedAt: Date,
    currentPeriodStartedAt: Date,
    currentPeriodEndAt: Date
  ): Subscription {
    return new Subscription(
      id,
      userId,
      stripeSubscriptionId,
      stripeSubscriptionItemId,
      startedAt,
      currentPeriodStartedAt,
      currentPeriodEndAt
    )
  }
}
