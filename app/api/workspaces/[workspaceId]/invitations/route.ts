import { verifyAuth } from '@/backend/lib/auth/middleware'
import { NextResponse } from 'next/server'
import { workspaceQuery } from '@/backend/infrastructure/query'
import { subscriptionRepository, worksapceRepository } from '@/backend/infrastructure/respository'
import { PostInvitationParams } from '@/app/api/_type/invitation'

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
  const postParamsResult = PostInvitationParams.safeParse(body)
  if (!postParamsResult.success) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const subscription = await subscriptionRepository.getSubscription(workspace.id)
  if (!subscription?.isActiveSubscription()) {
    return NextResponse.json({ error: 'Subscription is not active' }, { status: 400 })
  }

  workspace.addInvitation(postParamsResult.data.email, member)
  await worksapceRepository.saveWorksapce(workspace)

  return NextResponse.json({ message: 'ok' }, { status: 201 })
}
