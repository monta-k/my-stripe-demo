import { IdValue, Id } from '../common/id'

const ownerRole = 'owner'
const generalRole = 'general'
type MemberRole = typeof ownerRole | typeof generalRole

export class Member {
  id: IdValue
  authId: string
  role: MemberRole
  createdAt: number

  private constructor(id: IdValue, authId: string, role: MemberRole, createdAt: number) {
    this.id = id
    this.authId = authId
    this.role = role
    this.createdAt = createdAt
  }

  public static createOwner(authId: string): Member {
    const id = new Id().value
    const now = new Date().getTime()
    return new Member(id, authId, ownerRole, now)
  }

  public static createGeneralMember(authId: string): Member {
    const id = new Id().value
    const now = new Date().getTime()
    return new Member(id, authId, generalRole, now)
  }

  public static reConstruct(id: IdValue, authId: string, role: MemberRole, createdAt: number): Member {
    return new Member(id, authId, role, createdAt)
  }
}
