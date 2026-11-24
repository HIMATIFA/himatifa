import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const roleHomePaths: Record<string, string> = {
    admin: '/admin',
    sekum: '/sekum/surat',
    bendum: '/bendum/kas',
    adminekraf: '/adminekraf',
}

const roleAllowedPrefixes: Record<string, string[]> = {
    sekum: ['/sekum'],
    bendum: ['/bendum'],
    adminekraf: ['/adminekraf'],
}

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({ request })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) =>
                        request.cookies.set(name, value)
                    )
                    supabaseResponse = NextResponse.next({ request })
                    cookiesToSet.forEach(({ name, value, options }) => {
                        const { maxAge, expires, ...sessionOptions } = options
                        supabaseResponse.cookies.set(name, value, sessionOptions)
                    })
                },
            },
        }
    )

    const {
        data: { user },
    } = await supabase.auth.getUser()

    const pathname = request.nextUrl.pathname

    const protectedPrefixes = ['/admin', '/sekum', '/bendum', '/adminekraf']
    const isProtectedRoute = protectedPrefixes.some((prefix) =>
        pathname.startsWith(prefix)
    )

    if (!user && isProtectedRoute) {
        const url = request.nextUrl.clone()
        url.pathname = '/login'
        return NextResponse.redirect(url)
    }

    if (user && (isProtectedRoute || pathname === '/login')) {
        const { data: profile, error } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single()

        if (error || !profile?.role) {
            await supabase.auth.signOut()
            const url = request.nextUrl.clone()
            url.pathname = '/login'
            return NextResponse.redirect(url)
        }

        const role = profile.role === 'ekraf' ? 'adminekraf' : profile.role
        const homePath = roleHomePaths[role] || '/login'

        if (pathname === '/login') {
            const url = request.nextUrl.clone()
            url.pathname = homePath
            return NextResponse.redirect(url)
        }

        if (role !== 'admin') {
            const allowedPrefixes = roleAllowedPrefixes[role] || []
            const isAllowed = allowedPrefixes.some((prefix) =>
                pathname.startsWith(prefix)
            )

            if (!isAllowed) {
                const url = request.nextUrl.clone()
                url.pathname = homePath
                return NextResponse.redirect(url)
            }
        }
    }

    return supabaseResponse
}