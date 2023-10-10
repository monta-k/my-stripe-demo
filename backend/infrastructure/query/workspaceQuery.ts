import { getFirestore, Query, DocumentReference } from '@/backend/lib/firebase-admin/store'
import { Workspace } from '@/backend/model/workspace/workspace'

const workspaceCollectionName = 'workspace'

interface SearchQuery {
  memberAuthId?: string
}

export async function getWorkspace(workspaceId: string) {
  const firestore = getFirestore()
  const col = firestore.collection(workspaceCollectionName)
  const snapshot = await col.where('id', '==', workspaceId).get()
  if (snapshot.empty) {
    return null
  }
  const data = snapshot.docs[0].data()
  const workspace = Workspace.reConstruct(data.id, data.name, data.members, data.createdAt)
  return workspace
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
