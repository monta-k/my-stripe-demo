'use client'

import { useSignIn } from '@/lib/firebase/auth'

export function LoginButton() {
  'use client'
  const { handleSignInWithGoogle } = useSignIn()
  return (
    <button
      onClick={handleSignInWithGoogle}
      className="px-4 py-2 border flex gap-2 border-slate-200 rounded-lg text-slate-700 hover:border-slate-400 hover:text-slate-900 hover:shadow transition duration-150 bg-white"
    >
      <img
        className="w-6 h-6"
        src="https://www.svgrepo.com/show/475656/google-color.svg"
        loading="lazy"
        alt="google logo"
      />
      <span>Login with Google</span>
    </button>
  )
}
