import { IdValue, Id } from '../common/id'

const ownerRole = 'owner'
const generalRole = 'general'
type MemberRole = typeof ownerRole | typeof generalRole

export class Member {
  id: IdValue
  workspaceId: string
  authId: string
  role: MemberRole
  createdAt: number

  private constructor(id: IdValue, workspaceId: string, authId: string, role: MemberRole, createdAt: number) {
    this.id = id
    this.workspaceId = workspaceId
    this.authId = authId
    this.role = role
    this.createdAt = createdAt
  }

  public static createOwner(workspaceId: string, authId: string): Member {
    const id = new Id().value
    const now = new Date().getTime()
    return new Member(id, workspaceId, authId, ownerRole, now)
  }

  public static createGeneralMember(workspaceId: string, authId: string): Member {
    const id = new Id().value
    const now = new Date().getTime()
    return new Member(id, workspaceId, authId, generalRole, now)
  }

  public static reConstruct(
    id: IdValue,
    workspaceId: string,
    authId: string,
    role: MemberRole,
    createdAt: number
  ): Member {
    return new Member(id, workspaceId, authId, role, createdAt)
  }

  public isOwner(): boolean {
    return this.role === ownerRole
  }
}
