import { Member } from '@/app/api/_type/workspace'
import { workspaceQuery } from '@/backend/infrastructure/query'
import { verifyAuth } from '@/backend/lib/auth/middleware'
import { NextResponse } from 'next/server'

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
  const member = workspace?.members.find(member => member.authId === result.value.firebaseAuthId)
  if (!member) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const res: Member = {
    id: member.id,
    authId: member.authId,
    role: member.role,
    createdAt: new Date(member.createdAt)
  }

  return NextResponse.json(res)
}
