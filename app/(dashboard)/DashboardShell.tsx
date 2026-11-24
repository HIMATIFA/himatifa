'use client'

import { useState } from 'react'
import Sidebar, { type UserRole } from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'

interface DashboardShellProps {
    children: React.ReactNode
    userRole: UserRole
    userName?: string | null
    userEmail?: string | null
}

export default function DashboardShell({
                                           children,
                                           userRole,
                                           userName,
                                           userEmail,
                                       }: DashboardShellProps) {
    const [isCollapsed, setIsCollapsed] = useState(false)
    const [isMobileOpen, setIsMobileOpen] = useState(false)

    const handleToggleSidebar = () => {
        if (typeof window !== 'undefined' && window.innerWidth < 768) {
            setIsMobileOpen((prev) => !prev)
        } else {
            setIsCollapsed((prev) => !prev)
        }
    }

    return (
        <div className="flex h-screen w-full overflow-hidden bg-slate-50/60 font-sans antialiased text-slate-900">
            <Sidebar
                isCollapsed={isCollapsed}
                isMobileOpen={isMobileOpen}
                onCloseMobile={() => setIsMobileOpen(false)}
                userRole={userRole}
                userName={userName}
                userEmail={userEmail}
            />

            <div className="flex flex-1 flex-col overflow-hidden min-w-0">

                <Header
                    onToggleSidebar={handleToggleSidebar}
                    userRole={userRole}
                    userName={userName}
                    userEmail={userEmail}
                />

                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 scrollbar-thin">
                    <div className="mx-auto max-w-7xl w-full">{children}</div>
                </main>
            </div>
        </div>
    )
}
