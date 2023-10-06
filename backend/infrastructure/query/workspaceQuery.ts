import { getFirestore, Query, DocumentReference } from '@/backend/lib/firebase-admin/store'
import { Workspace } from '@/backend/model/workspace/workspace'

const workspaceCollectionName = 'workspace'

interface SearchQuery {
  memberAuthId?: string
}

export async function searchWorkspaces(queryParams: SearchQuery) {
  const firestore = getFirestore()
  let col: DocumentReference | Query = firestore.collection(workspaceCollectionName)
  if (queryParams.memberAuthId) {
    col = col.where('memberAuthIds', 'array-contains', queryParams.memberAuthId)
  }
  const snapshot = await col.get()
  const workspaces: Workspace[] = []
  snapshot.forEach(doc => {
    const data = doc.data()
    const workspace = Workspace.reConstruct(data.id, data.name, data.memberAuthIds, data.createdAt)
    workspaces.push(workspace)
  })
  return workspaces
}
