import { verifyAuth } from '@/backend/lib/auth/middleware'
import { NextResponse } from 'next/server'
import { PostUsageTokenParams, UsageToken } from '../../_type/usageToken'
import { UsageToken as UsageTokenModel } from '@/backend/model/usageToken/usageToken'
import { usageTokenRepository } from '@/backend/infrastructure/respository'

export async function GET(request: Request) {
  const result = await verifyAuth(request)
  if (result.isFailure) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const user = result.value
  const usageTokens = await usageTokenRepository.searchUsageTokens({ usedBy: user.firebaseAuthId })

  const res: UsageToken[] = usageTokens.map(usageToken => ({
    id: usageToken.id,
    token: usageToken.token,
    usedBy: usageToken.usedBy,
    usedAt: usageToken.usedAt
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

  const usageToken = UsageTokenModel.create(postParamsResult.data.token, user.firebaseAuthId)
  usageTokenRepository.saveUsageToken(usageToken)

  return NextResponse.json({ message: 'ok' }, { status: 201 })
}
