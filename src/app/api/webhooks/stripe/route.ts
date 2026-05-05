import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: Request) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET || !process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: 'Missing Stripe configuration' }, { status: 400 })
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
  }

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const session = event.data.object as any

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        if (session.mode === 'subscription') {
          const userId = session.client_reference_id
          const subscriptionId = session.subscription
          if (userId && subscriptionId) {
            await supabaseAdmin.from('subscriptions').insert({
              user_id: userId,
              stripe_subscription_id: subscriptionId,
              status: 'active',
            })
          }
        }
        break
      }
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscriptionId = session.id
        const status = session.status
        await supabaseAdmin
          .from('subscriptions')
          .update({ status })
          .eq('stripe_subscription_id', subscriptionId)
        break
      }
      default:
        console.log(`Unhandled event type ${event.type}`)
    }
  } catch (err) {
    console.error('Error processing webhook', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}