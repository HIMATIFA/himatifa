'use client'

import { useState } from 'react'
import Sidebar from '../../components/Sidebar'
import Header from '../../components/Header'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [isCollapsed, setIsCollapsed] = useState(false)

    return (
        <div className="flex h-screen w-full bg-[#f8fafc]">
            <Sidebar isCollapsed={isCollapsed} />
            <main className="flex flex-1 flex-col overflow-hidden">
                <Header onToggleSidebar={() => setIsCollapsed(!isCollapsed)} />
                <div className="flex-1 overflow-y-auto p-8">
                    {children}
                </div>
            </main>
        </div>
    )
}