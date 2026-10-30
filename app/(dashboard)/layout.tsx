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

    return (
        <div className="flex h-screen w-full overflow-hidden bg-slate-50/60 font-sans antialiased text-slate-900">
            <Sidebar isCollapsed={isCollapsed} />

            <div className="flex flex-1 flex-col overflow-hidden">
                <Header onToggleSidebar={() => setIsCollapsed(!isCollapsed)} />

                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 scrollbar-thin">
                    <div className="mx-auto max-w-7xl">{children}</div>
                </main>
            </div>
        </div>
    )
}
