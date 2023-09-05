import { verifyAuth } from '@/backend/lib/auth/middleware'
import { NextResponse } from 'next/server'
import { PostUsageTokenParams, UsageToken } from '../../_type/usageToken'
import { UsageToken as UsageTokenModel } from '@/backend/model/usageToken/usageToken'
import { subscriptionRepository, usageTokenRepository } from '@/backend/infrastructure/respository'
import { STRIPE_USAGE_TOKEN_PLAN_ID, stripe } from '@/backend/lib/stripe'

export async function GET(request: Request) {
  const result = await verifyAuth(request)
  if (result.isFailure) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const user = result.value
  const { searchParams } = new URL(request.url)
  const usedAtFrom = searchParams.get('usedAtFrom')
  const usedAtTo = searchParams.get('usedAtTo')
  const usageTokens = await usageTokenRepository.searchUsageTokens({
    usedBy: user.firebaseAuthId,
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

export async function POST(request: Request) {
  const result = await verifyAuth(request)
  if (result.isFailure) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const user = result.value
  const body = await request.json()
  const postParamsResult = PostUsageTokenParams.safeParse(body)
  if (!postParamsResult.success) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const subscription = await subscriptionRepository.getSubscription(user.firebaseAuthId)
  if (!subscription?.isActive()) {
    return NextResponse.json({ error: 'Subscription is not active' }, { status: 400 })
  }

  const usageToken = UsageTokenModel.create(postParamsResult.data.token, user.firebaseAuthId)
  await usageTokenRepository.saveUsageToken(usageToken)

  await stripe.subscriptionItems.createUsageRecord(subscription.stripeUsageTokenPlanSubscriptionItemId, {
    quantity: usageToken.token,
    timestamp: usageToken.usedAt / 1000,
    action: 'set'
  })

  return NextResponse.json({ message: 'ok' }, { status: 201 })
}
