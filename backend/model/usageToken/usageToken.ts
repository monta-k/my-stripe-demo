import { IdValue, Id } from '../common/id'

export class UsageToken {
  id: IdValue
  workspaceId: string
  token: number
  usedBy: string
  usedAt: number

  private constructor(id: IdValue, workspaceId: string, token: number, usedBy: string, usedAt: number) {
    this.id = id
    this.workspaceId = workspaceId
    this.token = token
    this.usedBy = usedBy
    this.usedAt = usedAt
  }

  public static create(workspaceId: string, token: number, usedBy: string): UsageToken {
    const id = new Id().value
    const usedAt = new Date().getTime()
    return new UsageToken(id, workspaceId, token, usedBy, usedAt)
  }

  public static reConstruct(
    id: IdValue,
    workspaceId: string,
    token: number,
    usedBy: string,
    usedAt: number
  ): UsageToken {
    return new UsageToken(id, workspaceId, token, usedBy, usedAt)
  }
}
