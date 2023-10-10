import { verifyAuth } from '@/backend/lib/auth/middleware'
import { NextResponse } from 'next/server'
import { PostUsageTokenParams, UsageToken } from '../../../_type/usageToken'
import { UsageToken as UsageTokenModel } from '@/backend/model/usageToken/usageToken'
import { usageTokenQuery, workspaceQuery } from '@/backend/infrastructure/query'
import { subscriptionRepository, usageTokenRepository } from '@/backend/infrastructure/respository'
import { stripe } from '@/backend/lib/stripe'

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

  const { searchParams } = new URL(request.url)
  const usedAtFrom = searchParams.get('usedAtFrom')
  const usedAtTo = searchParams.get('usedAtTo')
  const usageTokens = await usageTokenQuery.searchUsageTokens({
    workspaceId: workspaceId ?? undefined,
    usedAtFrom: usedAtFrom ? new Date(usedAtFrom) : undefined,
    usedAtTo: usedAtTo ? new Date(usedAtTo) : undefined
  })

  const res: UsageToken[] = usageTokens.map(usageToken => ({
    id: usageToken.id,
    token: usageToken.token,
    usedBy: usageToken.usedBy,
    usedAt: new Date(usageToken.usedAt)
  }))
  return NextResponse.json(res)
}

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
  const member = workspace.members.find(member => member.authId === result.value.firebaseAuthId)
  if (!member) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const postParamsResult = PostUsageTokenParams.safeParse(body)
  if (!postParamsResult.success) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const subscription = await subscriptionRepository.getSubscription(workspace.id)
  if (!subscription?.isActiveSubscription()) {
    return NextResponse.json({ error: 'Subscription is not active' }, { status: 400 })
  }

  const usageToken = UsageTokenModel.create(workspace.id, postParamsResult.data.token, member.id)
  await usageTokenRepository.saveUsageToken(usageToken)

  await stripe.subscriptionItems.createUsageRecord(subscription.stripeUsageTokenPlanSubscriptionItemId, {
    quantity: usageToken.token,
    timestamp: Math.floor(usageToken.usedAt / 1000),
    action: 'set'
  })

  return NextResponse.json({ message: 'ok' }, { status: 201 })
}
