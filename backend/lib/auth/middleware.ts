import { verifyFirebaseAuth } from '@/backend/lib/firebase-admin/auth'

export async function verifyAuth(request: Request) {
  const idToken = request.headers.get('authorization')?.replace('Bearer ', '')
  if (!idToken) {
    throw new Error('No IDToken')
  }
  try {
    return await verifyFirebaseAuth(idToken)
  } catch {
    throw new Error('Unauthorized')
  }
}
