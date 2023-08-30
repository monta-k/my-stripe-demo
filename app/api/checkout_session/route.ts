import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || ''
const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: '2023-08-16' })

export async function POST(request: Request) {
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
    cancel_url: `${protocol}://${hostname}/checkout/cancel`
  })

  if (!session.url) {
    NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    return
  }

  return NextResponse.redirect(session.url, { status: 303 })
}
