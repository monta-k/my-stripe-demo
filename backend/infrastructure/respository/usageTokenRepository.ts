import { getFirestore, Query, DocumentReference } from '@/backend/lib/firebase-admin/store'
import { UsageToken } from '@/backend/model/usageToken/usageToken'

const usageTokenCollectionName = 'usageToken'

interface SearchQuery {
  usedBy?: string
  usedAtFrom?: Date
  usedAtTo?: Date
}

export async function searchUsageTokens(queryParams: SearchQuery) {
  const firestore = getFirestore()
  let col: DocumentReference | Query = firestore.collection(usageTokenCollectionName)
  if (queryParams.usedBy) {
    col = col.where('usedBy', '==', queryParams.usedBy)
  }
  if (queryParams.usedAtFrom) {
    col = col.where('usedAt', '>=', queryParams.usedAtFrom.getTime())
  }
  if (queryParams.usedAtTo) {
    col = col.where('usedAt', '<=', queryParams.usedAtTo.getTime())
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
