import { getFirestore } from '@/backend/lib/firebase-admin/store'
import { Workspace } from '@/backend/model/workspace/workspace'

const workspaceCollectionName = 'workspace'

function toDBWorkspace(workspace: Workspace) {
  const memberAuthIds = workspace.members.map(({ authId }) => authId)
  return { ...workspace, memberAuthIds }
}

export async function saveWorksapce(workspace: Workspace) {
  const firestore = getFirestore()
  const col = firestore.collection(workspaceCollectionName)
  const dbWorkspace = toDBWorkspace(workspace)
  return col.doc(dbWorkspace.id).set(JSON.parse(JSON.stringify(dbWorkspace)))
}
