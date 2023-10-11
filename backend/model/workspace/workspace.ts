import { IdValue, Id } from '../common/id'
import { Member } from './member'

export class Workspace {
  id: IdValue
  name: string
  members: Member[]
  invitations: string[]
  createdAt: number

  private constructor(id: IdValue, name: string, members: Member[], invitations: string[], createdAt: number) {
    this.id = id
    this.name = name
    this.members = members
    this.invitations = invitations
    this.createdAt = createdAt
  }

  public static create(name: string, createdMemberAuthId: string): Workspace {
    const id = new Id().value
    const now = new Date().getTime()
    const owner = Member.createOwner(id, createdMemberAuthId)
    if (name.length < 1) throw new Error('workspace name is too short')
    if (name.length > 100) throw new Error('workspace name is too long')
    return new Workspace(id, name, [owner], [], now)
  }

  public static reConstruct(
    id: IdValue,
    name: string,
    members: Member[],
    invitations: [],
    createdAt: number
  ): Workspace {
    return new Workspace(id, name, members, invitations, createdAt)
  }

  private findMember(memberId: string): Member | null {
    return this.members.find(member => member.id === memberId) || null
  }

  private existInvitation(email: string): boolean {
    return this.invitations.some(invitation => invitation === email)
  }

  public isMember(memerId: string): boolean {
    return this.members.some(member => member.id === memerId)
  }

  public addInvitation(email: string, invitedBy: Member) {
    if (!(this.isMember(invitedBy.id) && invitedBy.isOwner())) throw new Error('Only this workspace owner can invite')
    if (this.existInvitation(email)) throw new Error('This email is already invited')
    this.invitations.push(email)
  }

  public acceptInvitation(email: string, authId: string) {
    if (!this.existInvitation(email)) throw new Error('This email is not invited')
    const newMember = Member.createGeneralMember(this.id, authId)
    this.members.push(newMember)
    this.invitations = this.invitations.filter(invitation => invitation !== email)
  }

  public removeInvitation(email: string) {
    if (!this.existInvitation(email)) throw new Error('This email is not invited')
    this.invitations = this.invitations.filter(invitation => invitation !== email)
  }

  public removeMember(memberId: string, removedBy: Member) {
    if (!(this.isMember(removedBy.id) && removedBy.isOwner()))
      throw new Error('Only this workspace owner can remove member')
    const removeMember = this.findMember(memberId)
    if (!removeMember) throw new Error('This member is not exist')
    if (removeMember.isOwner()) throw new Error('This member is owner')
    this.members = this.members.filter(member => member.id !== memberId)
  }
}
