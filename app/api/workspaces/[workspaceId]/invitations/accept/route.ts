import { verifyAuth } from '@/backend/lib/auth/middleware'
import { NextResponse } from 'next/server'
import { workspaceQuery } from '@/backend/infrastructure/query'
import { subscriptionRepository, worksapceRepository } from '@/backend/infrastructure/respository'
import { stripe } from '@/backend/lib/stripe'

export async function POST(request: Request, { params }: { params: { workspaceId: string } }) {
  const result = await verifyAuth(request)
  if (result.isFailure) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { workspaceId } = params
  if (!workspaceId) {
    return NextResponse.json({ error: 'workspaceId is invalid' }, { status: 400 })
  }

  const workspace = await workspaceQuery.getWorkspace(workspaceId)
  if (!workspace) return NextResponse.json({ error: 'Workspace not found' }, { status: 404 })

  const subscription = await subscriptionRepository.getSubscription(workspace.id)
  if (!subscription?.isActiveSubscription()) {
    workspace.removeInvitation(result.value.firebaseAuthEmail)
    await worksapceRepository.saveWorksapce(workspace)
    return NextResponse.json({ error: 'Subscription is not active' }, { status: 400 })
  }

  workspace.acceptInvitation(result.value.firebaseAuthEmail, result.value.firebaseAuthId)
  await worksapceRepository.saveWorksapce(workspace)

  const stripeSubscription = await stripe.subscriptions.retrieve(subscription.stripeSubscriptionId)
  // const stripeSubscriptionEndDate = new Date(stripeSubscription.current_period_end * 1000)
  // 日割りを行うための計算
  // const protationDate = Math.floor(
  //   new Date().setHours(
  //     stripeSubscriptionEndDate.getHours(),
  //     stripeSubscriptionEndDate.getMinutes(),
  //     stripeSubscriptionEndDate.getSeconds()
  //   ) / 1000
  // )
  await stripe.subscriptions.update(stripeSubscription.id, {
    items: [
      {
        id: subscription.stripeBasicPlanSubscriptionItemId,
        quantity: workspace.members.length
      }
    ],
    proration_behavior: 'none'
    // proration_date: protationDate
  })

  return NextResponse.json({ message: 'ok' }, { status: 201 })
}
