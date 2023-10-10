import { verifyAuth } from '@/backend/lib/auth/middleware'
import { NextResponse } from 'next/server'
import { Workspace as WorksapceModel } from '@/backend/model/workspace/workspace'
import { workspaceQuery } from '@/backend/infrastructure/query'
import { PostWorkspaceParams, Workspace } from '../_type/workspace'
import { worksapceRepository } from '@/backend/infrastructure/respository'

export async function GET(request: Request) {
  const result = await verifyAuth(request)
  if (result.isFailure) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const user = result.value
  const workspaces = await workspaceQuery.searchWorkspaces({ memberAuthId: user.firebaseAuthId })

  const res: Workspace[] = workspaces.map(workspace => ({
    id: workspace.id,
    name: workspace.name,
    members: workspace.members.map(member => ({
      id: member.id,
      authId: member.authId,
      role: member.role,
      createdAt: new Date(member.createdAt)
    })),
    createdAt: new Date(workspace.createdAt)
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
  const postParamsResult = PostWorkspaceParams.safeParse(body)
  if (!postParamsResult.success) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const workspace = WorksapceModel.create(postParamsResult.data.name, user.firebaseAuthId)
  await worksapceRepository.saveWorksapce(workspace)

  return NextResponse.json({ message: 'ok' }, { status: 201 })
}
