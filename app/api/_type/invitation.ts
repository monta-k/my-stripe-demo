import * as z from 'zod'

export interface Invitation {
  workspaceId: string
  email: string
}

export const PostInvitationParams = z.object({
  email: z.string().email()
})
