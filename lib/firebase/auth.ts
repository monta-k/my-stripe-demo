import { useState, useCallback } from 'react'
import { auth } from './client'
import { setTokenToCookie, removeTokenFromCookie, getTokenFromCookie } from '../cookie'
import { GoogleAuthProvider, signInWithPopup, signOut, User } from 'firebase/auth'
import { useRouter } from 'next/navigation'

export const useAuthCookie = () => {
  return getTokenFromCookie()?.idToken
}

export const useSignIn = () => {
  const [errorMessage] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const router = useRouter()

  const handleSignInWithGoogle = useCallback(async () => {
    setIsLoading(true)
    await signInWithPopup(auth, new GoogleAuthProvider())
      .then(async result => {
        const user = result.user
        if (!user) {
          throw new Error(`authentication error`)
        }
        const idToken = await user.getIdToken()
        const { refreshToken, uid } = user
        setTokenToCookie({ idToken, refreshToken, uid })
        await router.push('/workspaces')
      })
      .catch(error => {
        // ポップアップがキャンセルされた場合はエラーを無視する
        // ウィンドウを閉じたり、Googleボタンを連打した場合にも反応する
        if (error.code == 'auth/cancelled-popup-request' || error.code == 'auth/popup-closed-by-user') {
          return
        }
        throw error
      })
      .finally(() => setIsLoading(false))
  }, [router])

  return {
    handleSignInWithGoogle,
    isLoading,
    errorMessage
  }
}

export const useSignOut = () => {
  const router = useRouter()
  const handleSignOut = () => {
    signOut(auth)
      .then(async () => {
        // Sign-out successful.
        removeTokenFromCookie()
        router.push('/login')
      })
      .catch(error => {
        // An error happened.
        console.error(error)
      })
  }
  return { handleSignOut }
}
