'use client'

import { useRouter } from 'next/navigation'
export function HomeButton() {
  const router = useRouter()
  return <button onClick={() => router.push('/')}>← HOME</button>
}
