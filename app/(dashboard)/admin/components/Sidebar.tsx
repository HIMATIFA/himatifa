'use client'

import {
    LayoutDashboard,
    Newspaper,
    CalendarDays,
    Users,
    Settings,
    Image as ImageIcon,
    BarChart3,
    Folders,
    LogOut,
    Sparkles
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface SidebarProps {
    isCollapsed: boolean
}

export default function Sidebar({ isCollapsed }: SidebarProps) {
    const pathname = usePathname()

    const isActive = (path: string) => {
        if (path === '/admin') return pathname === '/admin'
        return pathname.startsWith(path)
    }

    const navSections = [
        {
            title: 'Overview',
            items: [
                { id: 'dashboard', label: 'Dashboard Overview', path: '/admin', icon: LayoutDashboard },
                { id: 'analytics', label: 'Site Analytics', path: '/admin/analytics', icon: BarChart3 },
            ]
        },
        {
            title: 'Content Management',
            items: [
                { id: 'berita', label: 'Artikel & Berita', path: '/admin/berita', icon: Newspaper, count: 4 },
                { id: 'agenda', label: 'Agenda Kegiatan', path: '/admin/agenda', icon: CalendarDays, count: 5 },
                { id: 'bph', label: 'Struktur BPH', path: '/admin/bph', icon: Users },
                { id: 'kategori', label: 'Kategori Modul', path: '/admin/kategori', icon: Folders },
            ]
        },
        {
            title: 'System',
            items: [
                { id: 'media', label: 'Media Library', path: '/admin/media', icon: ImageIcon },
                { id: 'pengaturan', label: 'Pengaturan Web', path: '/admin/pengaturan', icon: Settings },
            ]
        }
    ]

    return (
        <aside
            className={`flex shrink-0 flex-col border-r border-slate-200 bg-white transition-all duration-300 ease-in-out ${
                isCollapsed ? 'w-20' : 'w-[280px]'
            }`}
        >
            <div
                className={`flex h-16 shrink-0 items-center border-b border-slate-100 ${
                    isCollapsed ? 'justify-center px-2' : 'gap-3 px-6'
                }`}
            >
                <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-blue-600 font-extrabold text-white shadow-xs">
                    <span>H</span>
                </div>
                {!isCollapsed && (
                    <div className="overflow-hidden whitespace-nowrap">
                        <h1 className="text-xs font-black tracking-wider text-slate-900 uppercase">
                            SIM HIMATIFA
                        </h1>
                        <p className="text-[10px] font-semibold text-slate-400">Workspace Admin</p>
                    </div>
                )}
            </div>

            <div className="flex-1 overflow-y-auto px-3 py-5 scrollbar-none space-y-6">
                {navSections.map((section, idx) => (
                    <div key={idx}>
                        {!isCollapsed && (
                            <p className="mb-2 px-3 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                                {section.title}
                            </p>
                        )}
                        <div className="space-y-1">
                            {section.items.map((item) => {
                                const active = isActive(item.path)

                                return (
                                    <Link
                                        key={item.id}
                                        href={item.path}
                                        title={isCollapsed ? item.label : undefined}
                                        className={`group/btn flex items-center rounded-xl py-2.5 text-xs font-bold transition-all ${
                                            isCollapsed ? 'justify-center px-0' : 'justify-between px-3'
                                        } ${
                                            active
                                                ? 'bg-blue-50 text-blue-600 shadow-2xs'
                                                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                        }`}
                                    >
                                        <div className={`flex items-center ${isCollapsed ? '' : 'gap-3'}`}>
                                            <item.icon
                                                className={`size-4 shrink-0 transition-colors ${
                                                    active
                                                        ? 'text-blue-600'
                                                        : 'text-slate-400 group-hover/btn:text-slate-600'
                                                }`}
                                            />
                                            {!isCollapsed && <span>{item.label}</span>}
                                        </div>

                                        {!isCollapsed && item.count !== undefined && (
                                            <span
                                                className={`rounded-md px-1.5 py-0.5 text-[10px] font-extrabold ${
                                                    active
                                                        ? 'bg-blue-100 text-blue-700'
                                                        : 'bg-slate-100 text-slate-500'
                                                }`}
                                            >
                                                {item.count}
                                            </span>
                                        )}
                                    </Link>
                                )
                            })}
                        </div>
                    </div>
                ))}
            </div>

            <div className="border-t border-slate-100 p-3">
                <div
                    className={`flex items-center rounded-xl p-2 transition-colors hover:bg-slate-50 ${
                        isCollapsed ? 'justify-center' : 'gap-3'
                    }`}
                >
                    <div className="size-9 shrink-0 overflow-hidden rounded-full border border-slate-200 bg-slate-100">
                        <img
                            src="https://api.dicebear.com/7.x/notionists/svg?seed=Arya"
                            alt="User Avatar"
                            className="size-full object-cover"
                        />
                    </div>
                    {!isCollapsed && (
                        <>
                            <div className="flex-1 overflow-hidden">
                                <p className="truncate text-xs font-bold text-slate-900">Muhammad Arya</p>
                                <p className="truncate text-[10px] font-medium text-slate-400">
                                    Super Administrator
                                </p>
                            </div>
                            <Link
                                href="/login"
                                title="Keluar dari akun"
                                className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 transition"
                            >
                                <LogOut className="size-4" />
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </aside>
    )
}