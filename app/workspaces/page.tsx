import { cookies } from 'next/headers'
import { Workspace } from '../api/_type/workspace'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getInvitations, getWorkspaces, postInvitationAccept, postWorkspace } from '@/lib/api'
import { Invitation } from '../api/_type/invitation'

async function fetchWorkspaces() {
  const cookieStore = cookies()
  const idToken = cookieStore.get('idToken')?.value || ''
  const res = await getWorkspaces(idToken)

  const workspaces: Workspace[] = await res.json()
  return workspaces
}

async function fetchInvitations() {
  const cookieStore = cookies()
  const idToken = cookieStore.get('idToken')?.value || ''
  const res = await getInvitations(idToken)

  const invitations: Invitation[] = await res.json()
  return invitations
}

export default async function Checkout() {
  const workspaces = await fetchWorkspaces()
  const invitations = await fetchInvitations()
  if (workspaces.length < 1 && invitations.length < 1) redirect('/workspaces/create')
  function acceptInvitation(workspaceId: string) {
    return async function () {
      'use server'
      const cookieStore = cookies()
      const idToken = cookieStore.get('idToken')?.value || ''
      await postInvitationAccept(idToken, workspaceId)
      redirect(`/workspaces/${workspaceId}`)
    }
  }
  return (
    <div className="min-h-screen flex-col flex items-center justify-between">
      <div className="m-auto text-center">
        <div className="mb-5">
          <p>参加ワークスペース一覧</p>
          {workspaces.map(workspace => (
            <div className="mb-3">
              <Link href={`/workspaces/${workspace.id}`}>{workspace.name}</Link>
            </div>
          ))}
        </div>
        <div className="mb-5">
          <p>招待一覧</p>
          {invitations.map(invitation => (
            <div className="mb-3 flex gap-3">
              <p>{invitation.workspaceId}</p>
              <form action={acceptInvitation(invitation.workspaceId)}>
                <button type="submit">参加する</button>
              </form>
            </div>
          ))}
        </div>
        <div>
          <Link href="/workspaces/create">ワークスペースを作成する</Link>
        </div>
      </div>
    </div>
  )
}
