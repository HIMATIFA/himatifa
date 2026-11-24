'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createServerClient } from '@supabase/ssr'
import { createClient } from '../utils/supabase/server'

const roleRedirects: Record<string, string> = {
    admin: '/admin',
    sekum: '/sekum/surat',
    bendum: '/bendum/kas',
    adminekraf: '/adminekraf',
}

export async function loginAction(prevState: { error: string } | null, formData: FormData) {
    const supabase = await createClient()

    const email = (formData.get('email') as string || '').trim()
    const password = (formData.get('password') as string || '')

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (authError || !authData.user || !authData.session) {
        console.error('LOGIN AUTH ERROR:', authError?.message)
        return { error: 'Email atau kata sandi salah. Silakan periksa kembali.' }
    }

    const authedSupabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            global: {
                headers: {
                    Authorization: `Bearer ${authData.session.access_token}`,
                },
            },
            cookies: {
                getAll() { return [] },
                setAll() {},
            },
        }
    )

    const { data: profile, error: profileError } = await authedSupabase
        .from('profiles')
        .select('role')
        .eq('id', authData.user.id)
        .single()

    if (profileError || !profile) {
        console.error('PROFILE QUERY ERROR:', profileError)
        await supabase.auth.signOut()
        return { error: 'Data hak akses pengurus tidak ditemukan. Hubungi Admin.' }
    }

    const targetPath = roleRedirects[profile.role] || '/admin'

    revalidatePath('/', 'layout')
    redirect(targetPath)
}

export async function logoutAction() {
    const supabase = await createClient()
    await supabase.auth.signOut()

    revalidatePath('/', 'layout')
    redirect('/login')
}