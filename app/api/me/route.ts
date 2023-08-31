import { verifyAuth } from '@/backend/lib/auth/middleware'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const user = await verifyAuth(request)
    return NextResponse.json(user)
  } catch {
    NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    return
  }
}
