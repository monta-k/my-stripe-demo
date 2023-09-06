import Stripe from 'stripe'

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || ''
export const STRIPE_SUBSCRIPTION_CREATED_WEBHOOK_SECRET = process.env.STRIPE_SUBSCRIPTION_CREATED_WEBHOOK_SECRET || ''
export const STRIPE_SUBSCRIPTION_DELETED_WEBHOOK_SECRET = process.env.STRIPE_SUBSCRIPTION_DELETED_WEBHOOK_SECRET || ''
export const STRIPE_BASIC_PLAN_ID = process.env.STRIPE_BASIC_PLAN_ID || ''
export const STRIPE_USAGE_TOKEN_PLAN_ID = process.env.STRIPE_USAGE_TOKEN_PLAN_ID || ''

export const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: '2023-08-16' })
