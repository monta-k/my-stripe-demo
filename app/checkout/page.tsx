import { cookies } from 'next/headers'
import { relativeFetch } from '@/lib/fetch'
import { redirect } from 'next/navigation'

async function handleCheckoutSession() {
  'use server'
  const cookieStore = cookies()
  const idToken = cookieStore.get('idToken')?.value
  const res = await relativeFetch('/api/checkout_session', {
    method: 'POST',
    redirect: 'manual',
    headers: { authorization: `Bearer ${idToken}` }
  })
  const redirectUrl = res.headers.get('location')
  if (res.status !== 303 || !redirectUrl) return
  redirect(redirectUrl)
}

export default async function Checkout() {
  return (
    <div className="mt-5 mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-2 lg:text-left">
      <form action={handleCheckoutSession}>
        <button className="rounded border p-2" type="submit" role="link">
          Basicプランに加入する
        </button>
      </form>
    </div>
  )
}
