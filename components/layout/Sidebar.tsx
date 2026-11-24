'use client'

import { useState } from 'react'
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
    ChevronDown,
    ShieldCheck
} from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

export type UserRole = 'admin' | 'sekum' | 'bendum' | 'adminekraf' | 'ekraf'

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
    onRoleChange?: (role: UserRole) => void
}

export const roleDetails: Record<string, { name: string; title: string; badgeBg: string; textColor: string; avatar: string; homePath: string }> = {
    admin: {
        name: 'Muhammad Arya',
        title: 'Super Administrator',
        badgeBg: 'bg-blue-100 text-blue-700 border-blue-200',
        textColor: 'text-blue-600',
        avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Arya',
        homePath: '/admin'
    },
    sekum: {
        name: 'Nabila Khansa',
        title: 'Sekretaris Umum',
        badgeBg: 'bg-indigo-100 text-indigo-700 border-indigo-200',
        textColor: 'text-indigo-600',
        avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Nabila',
        homePath: '/sekum/surat'
    },
    bendum: {
        name: 'Ahmad Fajar',
        title: 'Bendahara Umum',
        badgeBg: 'bg-emerald-100 text-emerald-700 border-emerald-200',
        textColor: 'text-emerald-600',
        avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Fajar',
        homePath: '/bendum/kas'
    },
    adminekraf: {
        name: 'Rizky Pratama',
        title: 'Admin Ekraf',
        badgeBg: 'bg-amber-100 text-amber-700 border-amber-200',
        textColor: 'text-amber-600',
        avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Rizky',
        homePath: '/adminekraf'
    },
    ekraf: {
        name: 'Rizky Pratama',
        title: 'Admin Ekraf',
        badgeBg: 'bg-amber-100 text-amber-700 border-amber-200',
        textColor: 'text-amber-600',
        avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Rizky',
        homePath: '/adminekraf'
    }
}

export default function Sidebar({
    isCollapsed,
    isMobileOpen = false,
    onCloseMobile,
    userRole = 'admin',
    onRoleChange
}: SidebarProps) {
    const pathname = usePathname()
    const router = useRouter()
    const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false)

    // Normalize ekraf to adminekraf
    const normalizedRole: UserRole = userRole === 'ekraf' ? 'adminekraf' : userRole
    const currentProfile = roleDetails[normalizedRole] || roleDetails.admin

    const isActive = (path: string) => {
        if (path === '/admin') return pathname === '/admin'
        return pathname.startsWith(path)
    }

    // Role-based Nav Sections strictly mapped
    const masterNavSections: NavSection[] = [
        {
            title: 'Overview',
            roles: ['admin'],
            items: [
                { id: 'dashboard', label: 'Dashboard Overview', path: '/admin', icon: LayoutDashboard },
                { id: 'analytics', label: 'Site Analytics', path: '/admin/analytics', icon: BarChart3 },
            ],
        },
        {
            title: 'Sekretariat (Sekum)',
            roles: ['admin', 'sekum'],
            items: [
                { id: 'lpj', label: 'LPJ & Anggaran', path: '/sekum/lpj', icon: Receipt },
                { id: 'surat', label: 'Persuratan & SK', path: '/sekum/surat', icon: FileText, count: 3 },
                { id: 'presensi', label: 'Presensi Pengurus', path: '/sekum/presensi', icon: FileCheck2 },
                { id: 'notulensi', label: 'Notulensi Rapat', path: '/sekum/notulensi', icon: ClipboardList },
            ],
        },
        {
            title: 'Keuangan (Bendum)',
            roles: ['admin', 'bendum'],
            items: [
                { id: 'kas', label: 'Kas Organisasi', path: '/bendum/kas', icon: Wallet },
            ],
        },
        {
            title: 'Ekonomi Kreatif',
            roles: ['admin', 'adminekraf', 'ekraf'],
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
        .filter((section) => section.roles.includes(normalizedRole))
        .map((section) => ({
            ...section,
            items: section.items.filter((item) => !item.roles || item.roles.includes(normalizedRole)),
        }))
        .filter((section) => section.items.length > 0)

    const handleSwitchRole = (newRole: UserRole) => {
        setIsRoleDropdownOpen(false)
        if (typeof window !== 'undefined') {
            localStorage.setItem('himatifa_user_role', newRole)
        }
        if (onRoleChange) {
            onRoleChange(newRole)
        }
        // Redirect to new role's primary landing page
        const target = roleDetails[newRole]?.homePath || '/admin'
        router.push(target)
    }

    const handleLogout = () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('himatifa_user_role')
            localStorage.removeItem('himatifa_user_email')
            localStorage.removeItem('himatifa_user_name')
        }
        router.push('/login')
    }

    const renderNavContent = (collapsed: boolean, onNavClick?: () => void) => (
        <>
            {/* Header Brand */}
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
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-900 md:hidden cursor-pointer"
                        aria-label="Tutup menu"
                    >
                        <X className="size-5" />
                    </button>
                )}
            </div>

            {/* Quick Simulation Role Badge & Switcher */}
            {!collapsed && (
                <div className="px-3 pt-3">
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                            className="flex w-full items-center justify-between rounded-xl border border-slate-200/90 bg-slate-50/80 px-3 py-2 text-left transition hover:border-blue-300 hover:bg-blue-50/40 cursor-pointer"
                        >
                            <div className="flex items-center gap-2 overflow-hidden">
                                <ShieldCheck className="size-4 shrink-0 text-blue-600" />
                                <div className="truncate">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Akses Peran</p>
                                    <p className="text-xs font-bold text-slate-900 truncate">{currentProfile.title}</p>
                                </div>
                            </div>
                            <ChevronDown className="size-3.5 text-slate-400 shrink-0" />
                        </button>

                        {isRoleDropdownOpen && (
                            <div className="absolute left-0 right-0 top-full mt-1.5 z-50 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl">
                                <p className="px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                                    Ganti Simulasi Peran:
                                </p>
                                {(['admin', 'sekum', 'bendum', 'adminekraf'] as UserRole[]).map((r) => {
                                    const prof = roleDetails[r]
                                    const isCurrent = normalizedRole === r
                                    return (
                                        <button
                                            key={r}
                                            onClick={() => handleSwitchRole(r)}
                                            className={`flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-xs transition cursor-pointer ${
                                                isCurrent ? 'bg-blue-50 font-bold text-blue-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                            }`}
                                        >
                                            <span>{prof.title}</span>
                                            {isCurrent && <span className="text-[10px] font-bold text-blue-600">Aktif</span>}
                                        </button>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Nav Menu Items */}
            <div className="flex-1 overflow-y-auto px-3 py-4 scrollbar-none space-y-5">
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

            {/* Profile Footer */}
            <div className="border-t border-slate-100 p-3">
                <div
                    className={`flex items-center rounded-xl p-2 transition-colors hover:bg-slate-50 ${
                        collapsed ? 'justify-center' : 'gap-3'
                    }`}
                >
                    <div className="size-9 shrink-0 overflow-hidden rounded-full border border-slate-200 bg-slate-100">
                        <img
                            src={currentProfile.avatar}
                            alt="User Avatar"
                            className="size-full object-cover"
                        />
                    </div>
                    {!collapsed && (
                        <>
                            <div className="flex-1 overflow-hidden">
                                <p className="truncate text-xs font-bold text-slate-900">{currentProfile.name}</p>
                                <p className="truncate text-[10px] font-semibold text-slate-400">
                                    {currentProfile.title}
                                </p>
                            </div>
                            <button
                                onClick={handleLogout}
                                title="Keluar dari akun simulasi"
                                className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 transition cursor-pointer"
                            >
                                <LogOut className="size-4" />
                            </button>
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
