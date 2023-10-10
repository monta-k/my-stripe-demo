import { postWorkspace } from '@/lib/api'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

async function createWorkspace(formData: FormData) {
  'use server'
  const name = formData.get('name')
  if (!name) return
  const cookieStore = cookies()
  const idToken = cookieStore.get('idToken')?.value || ''
  await postWorkspace(idToken, name.toString())
  redirect('/workspaces')
}

export default async function TokenPage() {
  return (
    <div className="min-h-screen flex-col flex items-center justify-between p-10">
      <div className="m-auto">
        <form action={createWorkspace}>
          <div className="md:flex md:items-center mb-6">
            <div className="md:w-2/3">
              <input
                className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white"
                name="name"
                type="text"
                placeholder="ワークスペース名"
              />
            </div>
            <button
              className="ml-2 shadow text-black bg-white focus:shadow-outline focus:outline-none py-2 px-4 rounded"
              type="submit"
            >
              作成する
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
