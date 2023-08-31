import { verifyAuth } from '@/backend/lib/auth/middleware'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const result = await verifyAuth(request)
  if (result.isFailure) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return NextResponse.json(result.value)
}
