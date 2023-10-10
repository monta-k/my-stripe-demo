import { cookies } from 'next/headers'
import { revalidateTag } from 'next/cache'
import { InvitationForm } from './_InvitationForm'
import { redirect } from 'next/navigation'
import { getWorkspace, getWorkspaceTag, postInvitation } from '@/lib/api'
import { Workspace } from '@/app/api/_type/workspace'

async function fetchWorkspace(workspaceId: string) {
  const cookieStore = cookies()
  const idToken = cookieStore.get('idToken')?.value || ''
  const res = await getWorkspace(idToken, workspaceId)
  if (res.status === 404) redirect(`/login`)

  const workspace: Workspace = await res.json()
  return workspace
}

export default async function TokenPage({ params }: { params: { workspaceId: string } }) {
  const workspaceId = params.workspaceId
  const workspace = await fetchWorkspace(workspaceId)
  async function inviteMember(formData: FormData) {
    'use server'
    const email = formData.get('email')
    if (!email) return
    if (workspace.members.some(member => member.id === email.toString())) return
    const cookieStore = cookies()
    const idToken = cookieStore.get('idToken')?.value || ''
    await postInvitation(idToken, workspaceId, email.toString())
    revalidateTag(getWorkspaceTag)
  }
  return (
    <div className="min-h-screen flex-col flex items-center justify-between text-center p-10">
      <div>
        <p>メンバー一覧</p>
        <div className="mt-2">
          {workspace.members.map(member => (
            <p>{member.id}</p>
          ))}
        </div>
      </div>
      <div className="mt-5">
        <p>招待一覧</p>
        <div className="mt-2">
          {workspace.invitations.map(invitation => (
            <p>{invitation}</p>
          ))}
        </div>
      </div>
      <div>
        <InvitationForm handleSubmit={inviteMember} />
      </div>
    </div>
  )
}
