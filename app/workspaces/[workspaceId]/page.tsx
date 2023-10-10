import { relativeFetch } from '@/lib/fetch'
import { cookies } from 'next/headers'
import { UsageToken } from '../../api/_type/usageToken'
import { revalidateTag } from 'next/cache'
import { TokenForm } from './_TokenForm'
import { redirect } from 'next/navigation'
import { Subscription } from '../../api/_type/subscription'

async function fetchSubscription() {
  const cookieStore = cookies()
  const idToken = cookieStore.get('idToken')?.value
  const res = await relativeFetch('/api/me/subscription', {
    headers: { authorization: `Bearer ${idToken}` },
    next: { tags: ['subscription'] }
  })
  if (res.status === 404) redirect('/checkout')

  const subscription: Subscription = await res.json()
  if (!subscription.isActive) redirect('/checkout')
  return subscription
}

async function fetchTokens(usedAtFrom: Date, usedAtTo: Date) {
  const cookieStore = cookies()
  const idToken = cookieStore.get('idToken')?.value
  const res = await relativeFetch(`/api/me/usageTokens?usedAtFrom=${usedAtFrom}&usedAtTo=${usedAtTo}`, {
    headers: { authorization: `Bearer ${idToken}` },
    next: { tags: ['tokens'] }
  })
  const tokens: UsageToken[] = await res.json()
  return tokens
}

async function createToken(formData: FormData) {
  'use server'
  const token = formData.get('token')
  if (!token) return
  const cookieStore = cookies()
  const idToken = cookieStore.get('idToken')?.value
  const res = await relativeFetch('/api/me/usageTokens', {
    method: 'POST',
    headers: { authorization: `Bearer ${idToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ token: Number(token) })
  })
  console.log(res.status)
  revalidateTag('tokens')
}

async function handleManageBillingPortal() {
  'use server'
  const cookieStore = cookies()
  const idToken = cookieStore.get('idToken')?.value
  const res = await relativeFetch('/api/billing_portal', {
    method: 'POST',
    redirect: 'manual',
    headers: { authorization: `Bearer ${idToken}` }
  })
  const redirectUrl = res.headers.get('location')
  if (res.status !== 303 || !redirectUrl) return
  redirect(redirectUrl)
}

export default async function TokenPage() {
  'use client'
  const subscription = await fetchSubscription()
  const tokens = await fetchTokens(subscription.currentPeriodStartedAt, subscription.currentPeriodEndAt)
  return (
    <div className="min-h-screen flex-col flex items-center justify-between p-10">
      <div className="m-auto">
        <TokenForm tokens={tokens} handleSubmit={createToken} />
      </div>
      <div>
        <form action={handleManageBillingPortal}>
          <button
            className="shadow text-black bg-white focus:shadow-outline focus:outline-none py-2 px-4 rounded"
            type="submit"
          >
            支払いを管理する
          </button>
        </form>
      </div>
    </div>
  )
}
