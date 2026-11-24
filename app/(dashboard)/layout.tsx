'use client'

import { useState, useEffect } from 'react'
import Sidebar, { type UserRole } from '../../components/layout/Sidebar'
import Header from '../../components/layout/Header'

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [isCollapsed, setIsCollapsed] = useState(false)
    const [isMobileOpen, setIsMobileOpen] = useState(false)
    const [userRole, setUserRole] = useState<UserRole>('admin')

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedRole = localStorage.getItem('himatifa_user_role') as UserRole
            if (savedRole) {
                setUserRole(savedRole)
            }
        }
    }, [])

    const handleRoleChange = (newRole: UserRole) => {
        setUserRole(newRole)
        if (typeof window !== 'undefined') {
            localStorage.setItem('himatifa_user_role', newRole)
        }
    }

    const handleToggleSidebar = () => {
        if (typeof window !== 'undefined' && window.innerWidth < 768) {
            setIsMobileOpen((prev) => !prev)
        } else {
            setIsCollapsed((prev) => !prev)
        }
    }

    return (
        <div className="flex h-screen w-full overflow-hidden bg-slate-50/60 font-sans antialiased text-slate-900">
            {/* Sidebar dengan dukungan desktop collapse, mobile flyout, dan role filter */}
            <Sidebar
                isCollapsed={isCollapsed}
                isMobileOpen={isMobileOpen}
                onCloseMobile={() => setIsMobileOpen(false)}
                userRole={userRole}
                onRoleChange={handleRoleChange}
            />

            <div className="flex flex-1 flex-col overflow-hidden min-w-0">
                <Header
                    onToggleSidebar={handleToggleSidebar}
                    userRole={userRole}
                    onRoleChange={handleRoleChange}
                />

                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 scrollbar-thin">
                    <div className="mx-auto max-w-7xl w-full">{children}</div>
                </main>
            </div>
        </div>
    )
}
