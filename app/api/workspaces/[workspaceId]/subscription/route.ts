import { verifyAuth } from '@/backend/lib/auth/middleware'
import { NextResponse } from 'next/server'
import { subscriptionRepository } from '@/backend/infrastructure/respository'
import { Subscription } from '../../../_type/subscription'
import { workspaceQuery } from '@/backend/infrastructure/query'

export async function GET(request: Request, { params }: { params: { workspaceId: string } }) {
  const result = await verifyAuth(request)
  if (result.isFailure) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { workspaceId } = params
  if (!workspaceId) {
    return NextResponse.json({ error: 'workspaceId is invalid' }, { status: 400 })
  }

  const workspace = await workspaceQuery.getWorkspace(workspaceId)
  if (!workspace?.members.some(member => member.authId === result.value.firebaseAuthId))
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const subscription = await subscriptionRepository.getSubscription(workspace.id)
  if (!subscription) {
    return NextResponse.json({ error: 'Subscription not found' }, { status: 404 })
  }

  const res: Subscription = {
    id: subscription.id,
    workspaceId: subscription.workspaceId,
    stripeSubscriptionId: subscription.stripeSubscriptionId,
    stripeBasicPlanSubscriptionItemId: subscription.stripeBasicPlanSubscriptionItemId,
    stripeUsageTokenPlanSubscriptionItemId: subscription.stripeUsageTokenPlanSubscriptionItemId,
    isActive: subscription.isActiveSubscription(),
    startedAt: new Date(subscription.startedAt),
    currentPeriodStartedAt: new Date(subscription.currentPeriodStartedAt),
    currentPeriodEndAt: new Date(subscription.currentPeriodEndAt)
  }
  return NextResponse.json(res)
}
