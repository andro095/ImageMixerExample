import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const isLogin = request.nextUrl.pathname.startsWith('/login')
  const isAuth = request.nextUrl.pathname.startsWith('/auth')
  const isPay = request.nextUrl.pathname.startsWith('/pay')

  if (!user && !isLogin && !isAuth) {
    // no user, potentially respond by redirecting the user to the login page
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  if (user) {
    // Query subscriptions table
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('status')
      .eq('user_id', user.id)
      .single()

    const hasActiveSubscription = subscription?.status === 'active'

    if (!hasActiveSubscription && !isPay && !isLogin && !isAuth) {
      // Redirect to /pay if no active subscription
      const url = request.nextUrl.clone()
      url.pathname = '/pay'
      return NextResponse.redirect(url)
    }

    if (hasActiveSubscription && (isLogin || isPay)) {
      // Redirect to home if they have an active subscription and try to access login or pay
      const url = request.nextUrl.clone()
      url.pathname = '/'
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}
