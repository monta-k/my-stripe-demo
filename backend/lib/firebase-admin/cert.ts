import * as admin from 'firebase-admin'
import 'firebase/auth'

export const cert = {
  projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
  clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/gm, '\n')
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
