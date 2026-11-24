'use client'

import { useState } from 'react'
import Sidebar from '../../components/layout/Sidebar'
import Header from '../../components/layout/Header'

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
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
            {/* Sidebar dengan dukungan desktop collapse & mobile flyout */}
            <Sidebar
                isCollapsed={isCollapsed}
                isMobileOpen={isMobileOpen}
                onCloseMobile={() => setIsMobileOpen(false)}
            />

            <div className="flex flex-1 flex-col overflow-hidden min-w-0">
                <Header onToggleSidebar={handleToggleSidebar} />

                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 scrollbar-thin">
                    <div className="mx-auto max-w-7xl w-full">{children}</div>
                </main>
            </div>
        </div>
    )
}
