import { cookies } from 'next/headers'
import { UsageToken } from '../../api/_type/usageToken'
import { revalidateTag } from 'next/cache'
import { TokenForm } from './_TokenForm'
import { redirect } from 'next/navigation'
import { Subscription } from '../../api/_type/subscription'
import { getSubscription, getUsageTokenTag, getUsageTokens, postBillingPortal, postUsageToken } from '@/lib/api'

async function fetchSubscription(workspaceId: string) {
  const cookieStore = cookies()
  const idToken = cookieStore.get('idToken')?.value || ''
  const res = await getSubscription(idToken, workspaceId)
  if (res.status === 404) redirect(`/workspaces/${workspaceId}/checkout`)

  const subscription: Subscription = await res.json()
  if (!subscription.isActive) redirect(`/workspaces/${workspaceId}/checkout`)
  return subscription
}

async function fetchTokens(workspaceId: string, usedAtFrom: Date, usedAtTo: Date) {
  const cookieStore = cookies()
  const idToken = cookieStore.get('idToken')?.value || ''
  const res = await getUsageTokens(idToken, workspaceId, usedAtFrom, usedAtTo)
  const tokens: UsageToken[] = await res.json()
  return tokens
}

export default async function TokenPage({ params }: { params: { workspaceId: string } }) {
  const workspaceId = params.workspaceId
  async function handleManageBillingPortal() {
    'use server'
    const cookieStore = cookies()
    const idToken = cookieStore.get('idToken')?.value || ''
    const res = await postBillingPortal(idToken, workspaceId)
    const redirectUrl = res.headers.get('location')
    if (res.status !== 303 || !redirectUrl) return
    redirect(redirectUrl)
  }
  async function createToken(formData: FormData) {
    'use server'
    const token = formData.get('token')
    if (!token) return
    const cookieStore = cookies()
    const idToken = cookieStore.get('idToken')?.value || ''
    await postUsageToken(idToken, workspaceId, Number(token))
    revalidateTag(getUsageTokenTag)
  }
  async function redirectMemberPage() {
    'use server'
    redirect(`/workspaces/${workspaceId}/members`)
  }
  const subscription = await fetchSubscription(workspaceId)
  const tokens = await fetchTokens(workspaceId, subscription.currentPeriodStartedAt, subscription.currentPeriodEndAt)
  return (
    <div className="min-h-screen flex-col flex items-center justify-between p-10">
      <div className="m-auto">
        <TokenForm tokens={tokens} handleSubmit={createToken} />
      </div>
      <div className="flex gap-5">
        <form action={handleManageBillingPortal}>
          <button
            className="shadow text-black bg-white focus:shadow-outline focus:outline-none py-2 px-4 rounded"
            type="submit"
          >
            支払いを管理する
          </button>
        </form>
        <form action={redirectMemberPage}>
          <button
            className="shadow text-black bg-white focus:shadow-outline focus:outline-none py-2 px-4 rounded"
            type="submit"
          >
            メンバーを管理する
          </button>
        </form>
      </div>
    </div>
  )
}
