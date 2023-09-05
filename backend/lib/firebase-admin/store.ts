import * as admin from 'firebase-admin'
import 'firebase/auth'
import { getFirestore as internalGetFireStore } from 'firebase-admin/firestore'
import { getFirebaseAdmin } from './cert'
export { Query, DocumentReference } from 'firebase-admin/firestore'

export function getFirestore(): admin.firestore.Firestore {
  getFirebaseAdmin()

  const firestoreClient = internalGetFireStore()
  return firestoreClient
}
