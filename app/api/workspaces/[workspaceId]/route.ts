import { verifyAuth } from '@/backend/lib/auth/middleware'
import { NextResponse } from 'next/server'
import { workspaceQuery } from '@/backend/infrastructure/query'
import { Workspace } from '../../_type/workspace'

export async function GET(request: Request, { params }: { params: { workspaceId: string } }) {
  const result = await verifyAuth(request)
  if (result.isFailure) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const user = result.value
  const workspace = await workspaceQuery.getWorkspace(params.workspaceId, { memberAuthId: user.firebaseAuthId })
  if (!workspace) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const res: Workspace = {
    id: workspace.id,
    name: workspace.name,
    members: workspace.members.map(member => ({
      id: member.id,
      authId: member.authId,
      role: member.role,
      createdAt: new Date(member.createdAt)
    })),
    invitations: workspace.invitations,
    createdAt: new Date(workspace.createdAt)
  }
  return NextResponse.json(res)
}
