import { cookies } from 'next/headers'
import { postCheckoutSession } from '@/lib/api'
import { redirect } from 'next/navigation'

export default async function Checkout({ params }: { params: { workspaceId: string } }) {
  const workspaceId = params.workspaceId
  async function handleCheckoutSession() {
    'use server'
    const cookieStore = cookies()
    const idToken = cookieStore.get('idToken')?.value || ''
    const res = await postCheckoutSession(idToken, workspaceId)
    const redirectUrl = res.headers.get('location')
    if (res.status !== 303 || !redirectUrl) return
    redirect(redirectUrl)
  }
  return (
    <div className="min-h-screen flex-col flex items-center justify-between">
      <div className="m-auto">
        <form action={handleCheckoutSession}>
          <button className="rounded border p-2" type="submit" role="link">
            Basicプランに加入する
          </button>
        </form>
      </div>
    </div>
  )
}
