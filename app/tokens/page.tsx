import { relativeFetch } from '@/lib/fetch'
import { cookies } from 'next/headers'
import { UsageToken } from '../api/_type/usageToken'
import { useMemo, useRef } from 'react'
import { revalidateTag } from 'next/cache'
import { TokenForm } from './_TokenForm'

async function fetchTokens() {
  const cookieStore = cookies()
  const idToken = cookieStore.get('idToken')?.value
  const res = await relativeFetch('/api/me/usageTokens', {
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
  await relativeFetch('/api/me/usageTokens', {
    method: 'POST',
    headers: { authorization: `Bearer ${idToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ token: Number(token) })
  })
  revalidateTag('tokens')
}

export default async function TokenPage() {
  'use client'
  const tokens = await fetchTokens()
  return (
    <div className="min-h-screen flex-col flex items-center justify-between">
      <div className="m-auto">
        <TokenForm tokens={tokens} handleSubmit={createToken} />
      </div>
    </div>
  )
}
