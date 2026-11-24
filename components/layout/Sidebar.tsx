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
    FileText,
    ClipboardList,
    Wallet,
    Receipt,
    Store,
    FileCheck2,
    X,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export type UserRole = 'admin' | 'sekum' | 'bendum' | 'ekraf'

interface NavItem {
    id: string
    label: string
    path: string
    icon: React.ElementType
    roles?: UserRole[]
    count?: number
}

interface NavSection {
    title: string
    roles: UserRole[]
    items: NavItem[]
}

interface SidebarProps {
    isCollapsed: boolean
    isMobileOpen?: boolean
    onCloseMobile?: () => void
    userRole?: UserRole
}

export default function Sidebar({
    isCollapsed,
    isMobileOpen = false,
    onCloseMobile,
    userRole = 'admin',
}: SidebarProps) {
    const pathname = usePathname()

    const isActive = (path: string) => {
        if (path === '/admin') return pathname === '/admin'
        return pathname.startsWith(path)
    }

    const masterNavSections: NavSection[] = [
        {
            title: 'Overview',
            roles: ['admin', 'sekum', 'bendum', 'ekraf'],
            items: [
                { id: 'dashboard', label: 'Dashboard Overview', path: '/admin', icon: LayoutDashboard },
                { id: 'analytics', label: 'Site Analytics', path: '/admin/analytics', icon: BarChart3, roles: ['admin'] },
            ],
        },
        {
            title: 'Sekretariat (Sekum)',
            roles: ['admin', 'sekum'],
            items: [
                { id: 'surat', label: 'Persuratan & SK', path: '/sekum/surat', icon: FileText, count: 3 },
                { id: 'notulensi', label: 'Notulensi Rapat', path: '/sekum/notulensi', icon: ClipboardList },
                { id: 'presensi', label: 'Presensi Pengurus', path: '/sekum/presensi', icon: FileCheck2 },
            ],
        },
        {
            title: 'Keuangan (Bendum)',
            roles: ['admin', 'bendum'],
            items: [
                { id: 'kas', label: 'Kas Organisasi', path: '/bendum/kas', icon: Wallet },
                { id: 'lpj', label: 'LPJ & Anggaran', path: '/bendum/lpj', icon: Receipt },
            ],
        },
        {
            title: 'Ekonomi Kreatif',
            roles: ['admin', 'ekraf', 'bendum'],
            items: [
                { id: 'adminekraf', label: 'Manajemen Ekraf', path: '/adminekraf', icon: Store, count: 4 },
            ],
        },
        {
            title: 'Content & Media',
            roles: ['admin'],
            items: [
                { id: 'berita', label: 'Artikel & Berita', path: '/admin/berita', icon: Newspaper, count: 6 },
                { id: 'agenda', label: 'Agenda Kegiatan', path: '/admin/agenda', icon: CalendarDays, count: 5 },
                { id: 'bph', label: 'Struktur BPH', path: '/admin/bph', icon: Users },
                { id: 'kategori', label: 'Kategori Modul', path: '/admin/kategori', icon: Folders },
            ],
        },
        {
            title: 'System',
            roles: ['admin'],
            items: [
                { id: 'media', label: 'Media Library', path: '/admin/media', icon: ImageIcon },
                { id: 'pengaturan', label: 'Pengaturan Web', path: '/admin/pengaturan', icon: Settings },
            ],
        },
    ]

    const filteredSections = masterNavSections
        .filter((section) => section.roles.includes(userRole))
        .map((section) => ({
            ...section,
            items: section.items.filter((item) => !item.roles || item.roles.includes(userRole)),
        }))

    const renderNavContent = (collapsed: boolean, onNavClick?: () => void) => (
        <>
            <div
                className={`flex h-16 shrink-0 items-center justify-between border-b border-slate-100 ${
                    collapsed ? 'justify-center px-2' : 'gap-3 px-6'
                }`}
            >
                <div className="flex items-center gap-3">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-blue-600 font-extrabold text-white shadow-xs">
                        <span>H</span>
                    </div>
                    {!collapsed && (
                        <div className="overflow-hidden whitespace-nowrap">
                            <h1 className="text-xs font-black tracking-wider text-slate-900 uppercase">
                                SIM HIMATIFA
                            </h1>
                            <p className="text-[10px] font-semibold text-slate-400">Workspace Management</p>
                        </div>
                    )}
                </div>

                {/* Close Button for mobile drawer */}
                {onNavClick && (
                    <button
                        onClick={onCloseMobile}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-900 md:hidden"
                        aria-label="Tutup menu"
                    >
                        <X className="size-5" />
                    </button>
                )}
            </div>

            <div className="flex-1 overflow-y-auto px-3 py-5 scrollbar-none space-y-6">
                {filteredSections.map((section, idx) => (
                    <div key={idx}>
                        {!collapsed && (
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
                                        onClick={onNavClick}
                                        title={collapsed ? item.label : undefined}
                                        className={`group/btn flex items-center rounded-xl py-2.5 text-xs font-bold transition-all ${
                                            collapsed ? 'justify-center px-0' : 'justify-between px-3'
                                        } ${
                                            active
                                                ? 'bg-blue-50 text-blue-600 shadow-2xs'
                                                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                        }`}
                                    >
                                        <div className={`flex items-center ${collapsed ? '' : 'gap-3'}`}>
                                            <item.icon
                                                className={`size-4 shrink-0 transition-colors ${
                                                    active
                                                        ? 'text-blue-600'
                                                        : 'text-slate-400 group-hover/btn:text-slate-600'
                                                }`}
                                            />
                                            {!collapsed && <span>{item.label}</span>}
                                        </div>

                                        {!collapsed && item.count !== undefined && (
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
                        collapsed ? 'justify-center' : 'gap-3'
                    }`}
                >
                    <div className="size-9 shrink-0 overflow-hidden rounded-full border border-slate-200 bg-slate-100">
                        <img
                            src="https://api.dicebear.com/7.x/notionists/svg?seed=Arya"
                            alt="User Avatar"
                            className="size-full object-cover"
                        />
                    </div>
                    {!collapsed && (
                        <>
                            <div className="flex-1 overflow-hidden">
                                <p className="truncate text-xs font-bold text-slate-900">Muhammad Arya</p>
                                <p className="truncate text-[10px] font-medium text-slate-400 capitalize">
                                    {userRole === 'admin' ? 'Super Administrator' : `Pengurus (${userRole})`}
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
        </>
    )

    return (
        <>
            {/* 1. Desktop & Tablet Sidebar */}
            <aside
                className={`hidden md:flex shrink-0 flex-col border-r border-slate-200 bg-white transition-all duration-300 ease-in-out ${
                    isCollapsed ? 'w-20' : 'w-[280px]'
                }`}
            >
                {renderNavContent(isCollapsed)}
            </aside>

            {/* 2. Mobile Drawer & Backdrop */}
            {isMobileOpen && (
                <div className="fixed inset-0 z-50 flex md:hidden">
                    <div
                        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
                        onClick={onCloseMobile}
                    />
                    <aside className="relative flex w-[280px] max-w-[85vw] flex-col bg-white shadow-2xl z-10">
                        {renderNavContent(false, onCloseMobile)}
                    </aside>
                </div>
            )}
        </>
    )
}
