import { cookies } from 'next/headers'
import { Workspace } from '../api/_type/workspace'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getWorkspaces } from '@/lib/api'

async function fetchWorkspaces() {
  const cookieStore = cookies()
  const idToken = cookieStore.get('idToken')?.value || ''
  const res = await getWorkspaces(idToken)

  const workspaces: Workspace[] = await res.json()
  if (workspaces.length < 1) {
    redirect('/workspaces/create')
  }
  return workspaces
}

export default async function Checkout() {
  const workspaces = await fetchWorkspaces()
  return (
    <div className="min-h-screen flex-col flex items-center justify-between">
      <div className="m-auto text-center">
        <div className="mb-5">
          {workspaces.map(workspace => (
            <div className="mb-3">
              <Link href={`/workspaces/${workspace.id}`}>{workspace.name}</Link>
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
