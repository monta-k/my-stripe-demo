import { IdValue, Id } from '../common/id'

export class UsageToken {
  id: IdValue
  token: number
  usedBy: string
  usedAt: number

  private constructor(id: IdValue, token: number, usedBy: string, usedAt: number) {
    this.id = id
    this.token = token
    this.usedBy = usedBy
    this.usedAt = usedAt
  }

  public static create(token: number, usedBy: string): UsageToken {
    const id = new Id().value
    const usedAt = new Date().getTime()
    return new UsageToken(id, token, usedBy, usedAt)
  }

  public static reConstruct(id: IdValue, token: number, usedBy: string, usedAt: number): UsageToken {
    return new UsageToken(id, token, usedBy, usedAt)
  }
}
