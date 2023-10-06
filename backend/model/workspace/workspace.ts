import { IdValue, Id } from '../common/id'
import { Member } from './member'

export class Workspace {
  id: IdValue
  name: string
  members: Member[]
  createdAt: number

  private constructor(id: IdValue, name: string, members: Member[], createdAt: number) {
    this.id = id
    this.name = name
    this.members = members
    this.createdAt = createdAt
  }

  public static create(name: string, createdMemberAuthId: string): Workspace {
    const id = new Id().value
    const now = new Date().getTime()
    const owner = Member.createOwner(createdMemberAuthId)
    if (name.length < 1) throw new Error('workspace name is too short')
    if (name.length > 100) throw new Error('workspace name is too long')
    return new Workspace(id, name, [owner], now)
  }

  public static reConstruct(id: IdValue, name: string, members: Member[], createdAt: number): Workspace {
    return new Workspace(id, name, members, createdAt)
  }
}
