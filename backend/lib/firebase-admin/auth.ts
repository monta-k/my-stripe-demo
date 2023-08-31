import * as admin from 'firebase-admin'
import 'firebase/auth'
import { IncomingMessage } from 'http'
import { z } from 'zod'
import { cert } from './cert'

const ENV = process.env.APP_ENV || ''
const idTokenHeaderName = 'authorization'

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

class Cache {
  static auth: admin.auth.Auth
}

export function getFirebaseAdmin(): admin.auth.Auth {
  if (Cache.auth) {
    return Cache.auth
  }
  if (admin.apps.length === 0) {
    admin.initializeApp({ credential: admin.credential.cert(cert) })
  }

  Cache.auth = admin.auth()
  return Cache.auth
}

// たぶん、EitherやResult入れた方が良い
export async function verifyFirebaseAuth(idToken: string): Promise<FirebaseAuthData> {
  if (idToken) {
    const firebaseAdmin = getFirebaseAdmin()
    try {
      const verified = await firebaseAdmin.verifyIdToken(idToken)

      const userData = await firebaseAdmin.getUser(verified.uid)

      return FirebaseAuthData.parse({
        firebaseAuthId: verified.uid,
        firebaseAuthName: userData.displayName || '',
        firebaseAuthEmail: userData.email || '',
        photoURL: userData.photoURL || null
      } as FirebaseAuthData)
    } catch (e) {
      console.log(e)
      throw new FirebaseAuthError(ErrorType.enum.FirebaseAuthError)
    }
  }
  throw new FirebaseAuthError(ErrorType.enum.ParseError)
}
