const BASE_PATH = process.env.BASE_PATH || 'http://localhost:3000'

export async function relativeFetch(relativeUrl: string, init?: RequestInit) {
  const url = `${BASE_PATH}${relativeUrl}`
  return await fetch(url, init)
}
