import * as z from 'zod'

interface Member {
  id: string
  authId: string
  role: string
  createdAt: Date
}

export interface Workspace {
  id: string
  name: string
  members: Member[]
  createdAt: Date
}

export const PostWorkspaceParams = z.object({
  name: z.string().min(1).max(100)
})
