import { verifyAuth } from '@/backend/lib/auth/middleware'
import { NextResponse } from 'next/server'
import { subscriptionRepository } from '@/backend/infrastructure/respository'
import { Subscription } from '../../_type/subscription'

export async function GET(request: Request) {
  const result = await verifyAuth(request)
  if (result.isFailure) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const user = result.value
  const subscription = await subscriptionRepository.getSubscription(user.firebaseAuthId)

  const res: Subscription = {
    id: subscription.id,
    userId: subscription.userId,
    stripeSubscriptionId: subscription.stripeSubscriptionId,
    stripeBasicPlanSubscriptionItemId: subscription.stripeBasicPlanSubscriptionItemId,
    stripeUsageTokenPlanSubscriptionItemId: subscription.stripeUsageTokenPlanSubscriptionItemId,
    startedAt: subscription.startedAt,
    currentPeriodStartedAt: subscription.currentPeriodStartedAt,
    currentPeriodEndAt: subscription.currentPeriodEndAt
  }
  return NextResponse.json(res)
}
