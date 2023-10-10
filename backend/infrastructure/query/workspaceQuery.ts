import { getFirestore, Query, DocumentReference } from '@/backend/lib/firebase-admin/store'
import { Workspace } from '@/backend/model/workspace/workspace'

const workspaceCollectionName = 'workspace'

interface GetQuery {
  memberAuthId?: string
}

export async function getWorkspace(workspaceId: string, queryParams?: GetQuery) {
  const firestore = getFirestore()
  let col: DocumentReference | Query = firestore.collection(workspaceCollectionName).where('id', '==', workspaceId)
  if (queryParams?.memberAuthId) {
    col = col.where('memberAuthIds', 'array-contains', queryParams.memberAuthId)
  }
  const snapshot = await col.get()
  if (snapshot.empty) {
    return null
  }
  const data = snapshot.docs[0].data()
  const workspace = Workspace.reConstruct(data.id, data.name, data.members, data.invitations, data.createdAt)
  return workspace
}

interface SearchQuery {
  memberAuthId?: string
  invitationEmail?: string
}

export async function searchWorkspaces(queryParams: SearchQuery) {
  const firestore = getFirestore()
  let col: DocumentReference | Query = firestore.collection(workspaceCollectionName)
  if (queryParams.memberAuthId) {
    col = col.where('memberAuthIds', 'array-contains', queryParams.memberAuthId)
  }
  if (queryParams.invitationEmail) {
    col = col.where('invitations', 'array-contains', queryParams.invitationEmail)
  }
  const snapshot = await col.get()
  const workspaces: Workspace[] = []
  snapshot.forEach(doc => {
    const data = doc.data()
    const workspace = Workspace.reConstruct(data.id, data.name, data.members, data.invitations, data.createdAt)
    workspaces.push(workspace)
  })
  return workspaces
}
