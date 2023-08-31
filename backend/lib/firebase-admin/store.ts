import * as admin from 'firebase-admin'
import 'firebase/auth'
import { getFirestore as internalGetFireStore } from 'firebase-admin/firestore'
import { cert, getFirebaseAdmin } from './cert'

export function getFirestore(): admin.firestore.Firestore {
  getFirebaseAdmin()

  const firestoreClient = internalGetFireStore()
  return firestoreClient
}
