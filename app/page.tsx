import { relativeFetch } from '@/lib/fetch'
import { cookies } from 'next/headers'
import { UsageToken } from './api/_type/usageToken'
import { revalidateTag } from 'next/cache'
import { TokenForm } from './_TokenForm'
import { redirect } from 'next/navigation'
import { Subscription } from './api/_type/subscription'

async function fetchSubscription() {
  const cookieStore = cookies()
  const idToken = cookieStore.get('idToken')?.value
  const res = await relativeFetch('/api/me/subscription', {
    headers: { authorization: `Bearer ${idToken}` },
    next: { tags: ['subscription'] }
  })
  if (res.status === 404) redirect('/checkout')

  const now = new Date()
  const subscription: Subscription = await res.json()
  const currentPeriodStartedAt = new Date(subscription.currentPeriodStartedAt)
  const currentPeriodEndAt = new Date(subscription.currentPeriodEndAt)
  if (now < currentPeriodStartedAt || now > currentPeriodEndAt) redirect('/checkout')
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

export default async function TokenPage() {
  'use client'
  const subscription = await fetchSubscription()
  const tokens = await fetchTokens(subscription.currentPeriodStartedAt, subscription.currentPeriodEndAt)
  return (
    <div className="min-h-screen flex-col flex items-center justify-between">
      <div className="m-auto">
        <TokenForm tokens={tokens} handleSubmit={createToken} />
      </div>
    </div>
  )
}
