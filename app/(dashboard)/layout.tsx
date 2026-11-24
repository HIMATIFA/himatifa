import { redirect } from 'next/navigation'
import { createClient } from '../utils/supabase/server'
import DashboardShell from './DashboardShell'
import { type UserRole } from '@/components/layout/Sidebar'

export default async function DashboardLayout({
                                                  children,
                                              }: {
    children: React.ReactNode
}) {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('role, full_name')
        .eq('id', user.id)
        .single()

    if (!profile) {
        redirect('/login')
    }

    return (
        <DashboardShell
            userRole={profile.role as UserRole}
            userName={profile.full_name}
            userEmail={user.email}
        >
            {children}
        </DashboardShell>
    )
}