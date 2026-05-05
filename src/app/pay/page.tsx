'use client'

import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'

export default function PayPage() {
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUserId(user.id)
      }
    })
  }, [])

  return (
    <div className="min-h-screen bg-white text-black flex flex-col items-center justify-center p-8">
      <div className="max-w-md w-full border border-black p-8 text-center space-y-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <h1 className="text-3xl font-bold uppercase tracking-widest">Upgrade to Pro</h1>
        <p className="text-lg">
          Get unlimited access to AI Image Mixer for just $9.99/month.
        </p>
        
        {userId ? (
          <a
            href={`${process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK_URL}?client_reference_id=${userId}`}
            className="block w-full py-4 bg-black text-white font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors"
          >
            Subscribe Now
          </a>
        ) : (
          <div className="py-4 border border-black text-black font-bold uppercase tracking-widest animate-pulse">
            Loading...
          </div>
        )}
      </div>
    </div>
  )
}