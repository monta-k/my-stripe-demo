import 'firebase/auth'
import { z } from 'zod'
import { getFirebaseAdmin } from './cert'

export const FirebaseAuthData = z.object({
  firebaseAuthId: z.string(),
  firebaseAuthName: z.string(),
  firebaseAuthEmail: z.string(),
  photoURL: z.string().nullable()
})
export type FirebaseAuthData = z.infer<typeof FirebaseAuthData>

export const ErrorType = z.enum(['ParseError', 'FirebaseAuthError', 'PermissionError'])
export type ErrorType = z.infer<typeof ErrorType>

export class FirebaseAuthError extends Error {
  errorType: ErrorType
  constructor(errorType: ErrorType) {
    const message =
      errorType === ErrorType.enum.ParseError
        ? 'ヘッダーから認証情報の取り出しに失敗しました'
        : 'FirebaseAuthの認証に失敗しました'
    super(message)
    this.errorType = errorType
  }
}

export async function verifyFirebaseAuth(idToken: string): Promise<FirebaseAuthData> {
  if (idToken) {
    try {
      const firebaseAdmin = getFirebaseAdmin()
      const verified = await firebaseAdmin.verifyIdToken(idToken)

      const userData = await firebaseAdmin.getUser(verified.uid)

      return FirebaseAuthData.parse({
        firebaseAuthId: verified.uid,
        firebaseAuthName: userData.displayName || '',
        firebaseAuthEmail: userData.email || '',
        photoURL: userData.photoURL || null
      } as FirebaseAuthData)
    } catch (e) {
      throw new FirebaseAuthError(ErrorType.enum.FirebaseAuthError)
    }
  }
  throw new FirebaseAuthError(ErrorType.enum.ParseError)
}
