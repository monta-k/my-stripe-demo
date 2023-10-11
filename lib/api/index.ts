import { relativeFetch } from './client'

export async function getMe(idToken: string, workspaceId: string) {
  return await relativeFetch(`/api/workspaces/${workspaceId}/me`, { headers: { authorization: `Bearer ${idToken}` } })
}

export async function postCheckoutSession(idToken: string, workspaceId: string) {
  return await relativeFetch(`/api/workspaces/${workspaceId}/checkout_session`, {
    method: 'POST',
    redirect: 'manual',
    headers: { authorization: `Bearer ${idToken}` }
  })
}

export async function postBillingPortal(idToken: string, workspaceId: string) {
  return await relativeFetch(`/api/workspaces/${workspaceId}/billing_portal`, {
    method: 'POST',
    redirect: 'manual',
    headers: { authorization: `Bearer ${idToken}` }
  })
}

export async function getWorkspaces(idToken: string) {
  return await relativeFetch('/api/workspaces', {
    headers: { authorization: `Bearer ${idToken}` }
  })
}

export const getWorkspaceTag = 'workspace'
export async function getWorkspace(idToken: string, workspaceId: string) {
  return await relativeFetch(`/api/workspaces/${workspaceId}`, {
    headers: { authorization: `Bearer ${idToken}` },
    next: { tags: [getWorkspaceTag] }
  })
}

export async function postWorkspace(idToken: string, name: string) {
  return await relativeFetch('/api/workspaces', {
    method: 'POST',
    headers: { authorization: `Bearer ${idToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ name })
  })
}

export async function deleteMember(idToken: string, workspaceId: string, memberId: string) {
  return await relativeFetch(`/api/workspaces/${workspaceId}/members/${memberId}`, {
    method: 'DELETE',
    headers: { authorization: `Bearer ${idToken}`, 'Content-Type': 'application/json' }
  })
}

export async function getInvitations(idToken: string) {
  return await relativeFetch('/api/invitations', {
    headers: { authorization: `Bearer ${idToken}` }
  })
}

export async function postInvitation(idToken: string, workspaceId: string, email: string) {
  return await relativeFetch(`/api/workspaces/${workspaceId}/invitations`, {
    method: 'POST',
    headers: { authorization: `Bearer ${idToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  })
}

export async function postInvitationAccept(idToken: string, workspaceId: string) {
  return await relativeFetch(`/api/workspaces/${workspaceId}/invitations/accept`, {
    method: 'POST',
    headers: { authorization: `Bearer ${idToken}`, 'Content-Type': 'application/json' }
  })
}

export const getSubscriptionTag = 'subscription'
export async function getSubscription(idToken: string, workspaceId: string) {
  return await relativeFetch(`/api/workspaces/${workspaceId}/subscription`, {
    headers: { authorization: `Bearer ${idToken}` },
    next: { tags: [getSubscriptionTag] }
  })
}

export const getUsageTokenTag = 'tokens'
export async function getUsageTokens(idToken: string, workspaceId: string, usedAtFrom?: Date, usedAtTo?: Date) {
  return await relativeFetch(
    `/api/workspaces/${workspaceId}/usageTokens?usedAtFrom=${usedAtFrom}&usedAtTo=${usedAtTo}`,
    {
      headers: { authorization: `Bearer ${idToken}` },
      next: { tags: [getUsageTokenTag] }
    }
  )
}

export async function postUsageToken(idToken: string, workspaceId: string, token: number) {
  return await relativeFetch(`/api/workspaces/${workspaceId}/usageTokens`, {
    method: 'POST',
    headers: { authorization: `Bearer ${idToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ token })
  })
}
