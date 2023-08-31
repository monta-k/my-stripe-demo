import { FirebaseAuthData, verifyFirebaseAuth } from '@/backend/lib/firebase-admin/auth'
import { Failure, Result, Success } from '../result'

export async function verifyAuth(request: Request): Promise<Result<FirebaseAuthData, Error>> {
  const idToken = request.headers.get('authorization')?.replace('Bearer ', '')
  if (!idToken) {
    return new Failure(new Error('No IDToken'))
  }
  try {
    const user = await verifyFirebaseAuth(idToken)
    return new Success(user)
  } catch {
    return new Failure(new Error('Unauthorized'))
  }
}
