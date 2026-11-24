'use client'

import { useState } from 'react'
import { ChevronRight, Menu, Maximize, Minimize, ExternalLink, Globe, Shield } from 'lucide-react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { type UserRole, roleDetails } from './Sidebar'

interface HeaderProps {
    onToggleSidebar: () => void
    userRole?: UserRole
    onRoleChange?: (role: UserRole) => void
}

export default function Header({ onToggleSidebar, userRole = 'admin', onRoleChange }: HeaderProps) {
    const pathname = usePathname()
    const [isFullscreen, setIsFullscreen] = useState(false)

    const menuTitles: Record<string, string> = {
        admin: 'Dashboard Overview',
        analytics: 'Site Analytics',
        berita: 'Artikel & Berita',
        agenda: 'Agenda Kegiatan',
        bph: 'Struktur BPH',
        kategori: 'Kategori Modul',
        media: 'Media Library',
        pengaturan: 'Pengaturan Web',
        surat: 'Persuratan & SK',
        presensi: 'Presensi Pengurus',
        notulensi: 'Notulensi Rapat',
        lpj: 'LPJ & Anggaran Kegiatan',
        kas: 'Kas Organisasi',
        adminekraf: 'Manajemen Ekraf'
    }

    const segments = pathname.split('/').filter(Boolean)
    const currentSlug = segments[segments.length - 1] || 'admin'
    const pageTitle = menuTitles[currentSlug] || currentSlug.replace(/-/g, ' ')

    const normalizedRole = userRole === 'ekraf' ? 'adminekraf' : userRole
    const profile = roleDetails[normalizedRole] || roleDetails.admin

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
        <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white/80 px-4 sm:px-6 lg:px-8 backdrop-blur-md">
            <div className="flex items-center gap-3">
                <button
                    onClick={onToggleSidebar}
                    className="rounded-xl border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50 hover:text-slate-900 active:scale-95 cursor-pointer"
                    aria-label="Toggle Sidebar"
                >
                    <Menu className="size-4.5" />
                </button>

                <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                    <span className="hidden sm:inline">SIM HIMATIFA</span>
                    <ChevronRight className="hidden size-3 text-slate-300 sm:inline" />
                    <span className="font-bold capitalize text-slate-900">{pageTitle}</span>
                </div>
            </div>

            <div className="flex items-center gap-2.5">
                {/* Active Role Badge */}
                <div className={`hidden sm:inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold ${profile.badgeBg}`}>
                    <Shield className="size-3.5" />
                    <span>Peran: {profile.title}</span>
                </div>

                <button
                    onClick={toggleFullScreen}
                    className="rounded-xl border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50 hover:text-slate-900 active:scale-95 cursor-pointer"
                    aria-label="Toggle Fullscreen"
                    title={isFullscreen ? 'Keluar Layar Penuh' : 'Layar Penuh'}
                >
                    {isFullscreen ? <Minimize className="size-4" /> : <Maximize className="size-4" />}
                </button>

                <Link
                    href="/"
                    target="_blank"
                    className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-bold text-white transition hover:bg-slate-800 active:scale-95"
                >
                    <Globe className="size-3.5" />
                    <span className="hidden sm:inline">Portal Utama</span>
                    <ExternalLink className="size-3 text-slate-400" />
                </Link>
            </div>
        </header>
    )
}
