import { getFirestore } from '@/backend/lib/firebase-admin/store'
import { UsageToken } from '@/backend/model/usageToken/usageToken'

const usageTokenCollectionName = 'usageToken'

interface SearchQuery {
  usedBy?: string
  usedAtFrom?: Date
  usedAtTo?: Date
}

export async function searchUsageTokens(query: SearchQuery) {
  const firestore = getFirestore()
  const col = firestore.collection(usageTokenCollectionName)
  if (query.usedBy) {
    col.where('usedBy', '==', query.usedBy)
  }
  const snapshot = await col.get()
  const usageTokens: UsageToken[] = []
  snapshot.forEach(doc => {
    const data = doc.data()
    const usageToken = UsageToken.reConstruct(data.id, data.token, data.usedBy, data.usedAt)
    usageTokens.push(usageToken)
  })
  return usageTokens
}

export async function saveUsageToken(usageToken: UsageToken) {
  const firestore = getFirestore()
  const col = firestore.collection(usageTokenCollectionName)
  col.doc(usageToken.id).set(JSON.parse(JSON.stringify(usageToken)))
}
