'use client'

import { LayoutDashboard, Newspaper, CalendarDays, Users, Settings, Image as ImageIcon, BarChart3, Folders, LogOut } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface SidebarProps {
    isCollapsed: boolean
}

export default function Sidebar({ isCollapsed }: SidebarProps) {
    const pathname = usePathname()

    const isActive = (path: string) => pathname === path

    return (
        <aside className={`flex shrink-0 flex-col border-r border-slate-200 bg-white transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-[280px]'}`}>
            {/* Logo Area */}
            <div className={`flex h-20 shrink-0 items-center border-b border-slate-100 ${isCollapsed ? 'justify-center px-2' : 'gap-3 px-6'}`}>
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 shadow-inner">
                    <span className="text-lg font-black text-white">H</span>
                </div>
                {!isCollapsed && (
                    <div className="overflow-hidden whitespace-nowrap">
                        <h1 className="text-sm font-black tracking-tight text-slate-900">HIMATIFA CMS</h1>
                        <p className="text-[10px] font-bold text-slate-400">Workspace Management</p>
                    </div>
                )}
            </div>

            {/* Menu Area */}
            <div className="flex-1 overflow-y-auto px-3 py-6">
                {/* Overview */}
                <div className="mb-6">
                    {!isCollapsed && (
                        <p className="mb-2 px-3 text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Overview</p>
                    )}
                    <Link
                        href="/admin"
                        title={isCollapsed ? "Dashboard" : undefined}
                        className={`flex items-center rounded-lg py-2.5 text-sm font-semibold transition-all ${isCollapsed ? 'justify-center px-0' : 'gap-3 px-3'} ${isActive('/admin') ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                    >
                        <LayoutDashboard className="size-[18px] shrink-0" />
                        {!isCollapsed && <span>Dashboard</span>}
                    </Link>
                    <Link
                        href="/admin/analytics"
                        title={isCollapsed ? "Site Analytics" : undefined}
                        className={`mt-1 flex items-center rounded-lg py-2.5 text-sm font-semibold transition-all ${isCollapsed ? 'justify-center px-0' : 'gap-3 px-3'} ${isActive('/admin/analytics') ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                    >
                        <BarChart3 className="size-[18px] shrink-0" />
                        {!isCollapsed && <span>Site Analytics</span>}
                    </Link>
                </div>

                {/* Content Management */}
                <div className="mb-6">
                    {!isCollapsed && (
                        <p className="mb-2 px-3 text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Content Management</p>
                    )}
                    {[
                        { id: 'berita', label: 'Artikel & Berita', icon: Newspaper, count: 4 },
                        { id: 'agenda', label: 'Agenda Kegiatan', icon: CalendarDays, count: 4 },
                        { id: 'bph', label: 'Struktur BPH', icon: Users },
                        { id: 'kategori', label: 'Kategori Modul', icon: Folders },
                    ].map((item) => {
                        const itemPath = `/admin/${item.id}`
                        return (
                            <Link
                                key={item.id}
                                href={itemPath}
                                title={isCollapsed ? item.label : undefined}
                                className={`group/btn mt-1 flex items-center rounded-lg py-2.5 text-sm font-semibold transition-all ${isCollapsed ? 'justify-center px-0' : 'justify-between px-3'} ${isActive(itemPath) ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                            >
                                <div className={`flex items-center ${isCollapsed ? '' : 'gap-3'}`}>
                                    <item.icon className={`size-[18px] shrink-0 ${isActive(itemPath) ? 'text-blue-700' : 'text-slate-400 group-hover/btn:text-slate-600'}`} />
                                    {!isCollapsed && <span>{item.label}</span>}
                                </div>
                                {!isCollapsed && item.count !== undefined && (
                                    <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${isActive(itemPath) ? 'bg-blue-200/50 text-blue-800' : 'bg-slate-100 text-slate-500'}`}>
                                        {item.count}
                                    </span>
                                )}
                            </Link>
                        )
                    })}
                </div>

                {/* System */}
                <div>
                    {!isCollapsed && (
                        <p className="mb-2 px-3 text-[10px] font-extrabold uppercase tracking-widest text-slate-400">System</p>
                    )}
                    <Link
                        href="/admin/media"
                        title={isCollapsed ? "Media Library" : undefined}
                        className={`flex items-center rounded-lg py-2.5 text-sm font-semibold transition-all ${isCollapsed ? 'justify-center px-0' : 'gap-3 px-3'} ${isActive('/admin/media') ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                    >
                        <ImageIcon className="size-[18px] shrink-0" />
                        {!isCollapsed && <span>Media Library</span>}
                    </Link>
                    <Link
                        href="/admin/pengaturan"
                        title={isCollapsed ? "Pengaturan Web" : undefined}
                        className={`mt-1 flex items-center rounded-lg py-2.5 text-sm font-semibold transition-all ${isCollapsed ? 'justify-center px-0' : 'gap-3 px-3'} ${isActive('/admin/pengaturan') ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                    >
                        <Settings className="size-[18px] shrink-0" />
                        {!isCollapsed && <span>Pengaturan Web</span>}
                    </Link>
                </div>
            </div>

            {/* Profile Footer */}
            <div className="border-t border-slate-200 p-3">
                <div className={`flex cursor-pointer items-center rounded-xl p-2 transition-colors hover:bg-slate-50 ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
                    <div className="size-10 shrink-0 overflow-hidden rounded-full border border-slate-300 bg-slate-200">
                        <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Arya" alt="User Avatar" className="size-full object-cover" />
                    </div>
                    {!isCollapsed && (
                        <>
                            <div className="flex-1 overflow-hidden">
                                <p className="truncate text-sm font-bold text-slate-900">Muhammad Arya</p>
                                <p className="truncate text-xs font-medium text-slate-500">Super Administrator</p>
                            </div>
                            <LogOut className="size-5 shrink-0 text-slate-400 transition-colors hover:text-red-500" />
                        </>
                    )}
                </div>
            </div>
        </aside>
    )
}