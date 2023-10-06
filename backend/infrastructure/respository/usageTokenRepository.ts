import { getFirestore } from '@/backend/lib/firebase-admin/store'
import { UsageToken } from '@/backend/model/usageToken/usageToken'

const usageTokenCollectionName = 'usageToken'

export async function saveUsageToken(usageToken: UsageToken) {
  const firestore = getFirestore()
  const col = firestore.collection(usageTokenCollectionName)
  col.doc(usageToken.id).set(JSON.parse(JSON.stringify(usageToken)))
}
