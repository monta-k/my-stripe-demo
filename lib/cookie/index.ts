import { GetServerSidePropsContext, NextPageContext } from 'next'
import { parseCookies, setCookie, destroyCookie } from 'nookies'
import { ParsedUrlQuery } from 'querystring'

type Credential = {
  idToken: string
  refreshToken: string
  uid: string
}

export const IDTokenCookieName = 'idToken'
export const RefreshTokenCookieName = 'refreshToken'
export const UIDCookieName = 'uid'

export const getTokenFromCookie = (
  ctx?: GetServerSidePropsContext<ParsedUrlQuery> | NextPageContext
): Partial<Credential> => {
  const { idToken, refreshToken, uid } = parseCookies(ctx) as unknown as Partial<Credential>
  if (idToken && refreshToken && uid) {
    return { idToken, refreshToken, uid }
  }
  return {}
}

export const setTokenToCookie = (
  cred: Credential,
  ctx?: GetServerSidePropsContext<ParsedUrlQuery> | NextPageContext
) => {
  setCookie(ctx, IDTokenCookieName, cred.idToken, {
    maxAge: 30 * 24 * 60 * 60, // 30 days
    path: '/'
  })
  setCookie(ctx, RefreshTokenCookieName, cred.refreshToken, {
    maxAge: 30 * 24 * 60 * 60, // 30 days
    path: '/'
  })
  setCookie(ctx, UIDCookieName, cred.uid, {
    maxAge: 30 * 24 * 60 * 60, // 30 days
    path: '/'
  })
}

export const removeTokenFromCookie = (ctx?: GetServerSidePropsContext<ParsedUrlQuery> | NextPageContext) => {
  destroyCookie(ctx, IDTokenCookieName, {
    path: '/' // THE KEY IS TO SET THE SAME PATH
  })
  destroyCookie(ctx, RefreshTokenCookieName, {
    path: '/' // THE KEY IS TO SET THE SAME PATH
  })
  destroyCookie(ctx, UIDCookieName, {
    path: '/' // THE KEY IS TO SET THE SAME PATH
  })
}
