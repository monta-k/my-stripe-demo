import { cookies } from 'next/headers'
import { revalidateTag } from 'next/cache'
import { InvitationForm } from './_InvitationForm'
import { redirect } from 'next/navigation'
import { deleteMember, getSubscription, getWorkspace, getWorkspaceTag, postInvitation } from '@/lib/api'
import { Workspace } from '@/app/api/_type/workspace'
import { Subscription } from '@/app/api/_type/subscription'

async function fetchSubscription(workspaceId: string) {
  const cookieStore = cookies()
  const idToken = cookieStore.get('idToken')?.value || ''
  const res = await getSubscription(idToken, workspaceId)
  if (res.status === 404) redirect(`/workspaces/${workspaceId}/checkout`)

  const subscription: Subscription = await res.json()
  if (!subscription.isActive) redirect(`/workspaces/${workspaceId}/checkout`)
  return subscription
}

async function fetchWorkspace(workspaceId: string) {
  const cookieStore = cookies()
  const idToken = cookieStore.get('idToken')?.value || ''
  const res = await getWorkspace(idToken, workspaceId)
  if (res.status === 404) redirect(`/login`)

  const workspace: Workspace = await res.json()
  return workspace
}

export default async function MemberPage({ params }: { params: { workspaceId: string } }) {
  'use server'
  const workspaceId = params.workspaceId
  await fetchSubscription(workspaceId)
  const workspace = await fetchWorkspace(workspaceId)
  async function inviteMember(workspace: Workspace, formData: FormData) {
    'use server'
    const email = formData.get('email')
    if (!email) return
    if (workspace.members.some(member => member.id === email.toString())) return
    const cookieStore = cookies()
    const idToken = cookieStore.get('idToken')?.value || ''
    await postInvitation(idToken, workspace.id, email.toString())
    revalidateTag(getWorkspaceTag)
  }
  function removeMember(workspaceId: string, memberId: string) {
    return async function () {
      'use server'
      const cookieStore = cookies()
      const idToken = cookieStore.get('idToken')?.value || ''
      await deleteMember(idToken, workspaceId, memberId)
      revalidateTag(getWorkspaceTag)
    }
  }
  return (
    <div className="min-h-screen flex-col flex items-center justify-between text-center p-10">
      <div>
        <p>メンバー一覧</p>
        <div className="mt-2">
          {workspace.members.map(member => (
            <div key={member.id} className="flex gap-3">
              <p>{member.id}</p>
              {member.role !== 'owner' && (
                <form action={removeMember(workspace.id, member.id)}>
                  <button>削除</button>
                </form>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-5">
        <p>招待一覧</p>
        <div className="mt-2">
          {workspace.invitations.map(invitation => (
            <p key={invitation}>{invitation}</p>
          ))}
        </div>
      </div>
      <div>
        <InvitationForm workspace={workspace} handleSubmit={inviteMember} />
      </div>
    </div>
  )
}
