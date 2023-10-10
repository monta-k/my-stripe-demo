import { verifyAuth } from '@/backend/lib/auth/middleware'
import { NextResponse } from 'next/server'
import { workspaceQuery } from '@/backend/infrastructure/query'
import { Invitation } from '@/app/api/_type/invitation'

export async function GET(request: Request) {
  const result = await verifyAuth(request)
  if (result.isFailure) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const workspaces = await workspaceQuery.searchWorkspaces({ invitationEmail: result.value.firebaseAuthEmail })

  const res: Invitation[] = workspaces.map(workspace => ({
    workspaceId: workspace.id,
    email: result.value.firebaseAuthEmail
  }))

  return NextResponse.json(res)
}
