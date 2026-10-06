'use client'

import { useState } from 'react'
import { ChevronRight, Menu, Maximize, Minimize } from 'lucide-react'
import { usePathname } from 'next/navigation'

interface HeaderProps {
    onToggleSidebar: () => void
}

export default function Header({ onToggleSidebar }: HeaderProps) {
    const pathname = usePathname()
    const [isFullscreen, setIsFullscreen] = useState(false)

    const segments = pathname.split('/')
    const currentMenu = segments[segments.length - 1] || 'dashboard'

    const toggleFullScreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch((err) => {
                console.error(`Error attempting to enable fullscreen: ${err.message}`)
            })
            setIsFullscreen(true)
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen()
                setIsFullscreen(false)
            }
        }
    }

    return (
        <header className="sticky top-0 z-10 flex h-20 shrink-0 items-center justify-between border-b border-slate-200 bg-white/80 px-8 backdrop-blur-xl">
            <div className="flex items-center gap-4">
                <button
                    onClick={onToggleSidebar}
                    className="rounded-lg border border-slate-200 p-2.5 text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-900 active:scale-95"
                    aria-label="Toggle Sidebar"
                >
                    <Menu className="size-[18px]" />
                </button>

                <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                    <span>Workspace</span>
                    <ChevronRight className="size-4 text-slate-400" />
                    <span className="font-bold capitalize text-slate-900">
                        {currentMenu.replace(/-/g, ' ')}
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <button
                    onClick={toggleFullScreen}
                    className="rounded-full border border-slate-200 p-2.5 text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-900 active:scale-95"
                    aria-label="Toggle Fullscreen"
                >
                    {isFullscreen ? (
                        <Minimize className="size-[18px]" />
                    ) : (
                        <Maximize className="size-[18px]" />
                    )}
                </button>

                <button className="rounded-full bg-slate-900 px-5 py-2 text-sm font-bold text-white transition-all hover:bg-slate-800 hover:shadow-lg hover:shadow-slate-900/20 active:scale-95">
                    Live Preview
                </button>
            </div>
        </header>
    )
}