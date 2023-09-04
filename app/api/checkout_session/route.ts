import { NextResponse } from 'next/server'
import { verifyAuth } from '@/backend/lib/auth/middleware'
import { stripe } from '@/backend/lib/stripe'

export async function POST(request: Request) {
  const result = await verifyAuth(request)
  if (result.isFailure) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const protocol = request.headers.get('x-forwarded-proto') || 'http'
  const hostname = request.headers.get('host') || ''
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price: 'price_1NkLPMKFMJFtb6h8ExhR7aUy',
        quantity: 1
      },
      {
        price: 'price_1NkLabKFMJFtb6h8ZZKgKMnp'
      }
    ],
    mode: 'subscription',
    success_url: `${protocol}://${hostname}/checkout/success`,
    cancel_url: `${protocol}://${hostname}/checkout/cancel`,
    metadata: {
      userId: result.value.firebaseAuthId
    }
  })

  if (!session.url) {
    NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    return
  }

  return NextResponse.redirect(session.url, { status: 303 })
}
