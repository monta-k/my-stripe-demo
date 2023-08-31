import * as z from 'zod'

export interface UsageToken {
  id: string
  token: number
  usedBy: string
  usedAt: Date
}

export const PostUsageTokenParams = z.object({
  token: z.number().positive()
})
