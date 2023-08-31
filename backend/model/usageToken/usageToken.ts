import { IdValue, Id } from '../common/id'

export class UsageToken {
  id: IdValue
  token: number
  usedBy: string
  usedAt: Date

  private constructor(id: IdValue, token: number, usedBy: string, usedAt: Date) {
    this.id = id
    this.token = token
    this.usedBy = usedBy
    this.usedAt = usedAt
  }

  public static create(token: number, usedBy: string): UsageToken {
    const id = new Id().value
    const usedAt = new Date()
    return new UsageToken(id, token, usedBy, usedAt)
  }

  public static reConstruct(id: IdValue, token: number, usedBy: string, usedAt: Date): UsageToken {
    return new UsageToken(id, token, usedBy, usedAt)
  }
}
