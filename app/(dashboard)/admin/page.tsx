'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { createBrowserClient } from '@supabase/ssr'
import {
    Users,
    FileText,
    Eye,
    Calendar,
    ArrowUpRight,
    Activity,
    Plus,
    ChevronRight,
    ShieldCheck,
    CheckCircle2,
    Loader2,
    Clock,
    MapPin,
    ExternalLink
} from 'lucide-react'

interface BeritaSummary {
    id: string
    title: string
    category: string
    status: string
    views: number
    author?: string | null
    created_at: string
}

interface EventSummary {
    id: string
    title: string
    category: string
    date: string
    location?: string | null
    status: string
    created_at: string
}

interface MemberSummary {
    id: string
    name: string
    role: string
    division: string
    status: string
    created_at: string
}

interface PageViewSummary {
    id: string
    visitor_id: string
    created_at: string
}

interface FeedActivity {
    id: string
    avatar: string
    user: string
    action: string
    target: string
    role: string
    time: string
    timestamp: number
}

function timeAgo(dateString: string): string {
    const now = Date.now()
    const past = new Date(dateString).getTime()
    if (isNaN(past)) return 'Baru saja'
    const diffSec = Math.max(1, Math.floor((now - past) / 1000))

    if (diffSec < 60) return `${diffSec} detik lalu`
    const diffMin = Math.floor(diffSec / 60)
    if (diffMin < 60) return `${diffMin} menit lalu`
    const diffHour = Math.floor(diffMin / 60)
    if (diffHour < 24) return `${diffHour} jam lalu`
    const diffDay = Math.floor(diffHour / 24)
    if (diffDay < 30) return `${diffDay} hari lalu`
    return new Date(dateString).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    })
}

function getInitials(name: string): string {
    return name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((n) => n[0]?.toUpperCase() || '')
        .join('') || 'HM'
}

export default function AdminDashboardPage() {
    const [beritaList, setBeritaList] = useState<BeritaSummary[]>([])
    const [eventList, setEventList] = useState<EventSummary[]>([])
    const [memberList, setMemberList] = useState<MemberSummary[]>([])
    const [pageViews, setPageViews] = useState<PageViewSummary[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [dbConnected, setDbConnected] = useState(true)

    const supabase = useMemo(
        () =>
            createBrowserClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
            ),
        []
    )

    useEffect(() => {
        const fetchDashboardData = async () => {
            setIsLoading(true)

            const [beritaRes, eventsRes, membersRes, viewsRes] = await Promise.all([
                supabase
                    .from('berita')
                    .select('id, title, category, status, views, created_at')
                    .order('created_at', { ascending: false }),
                supabase
                    .from('events')
                    .select('id, title, category, date, location, status, created_at')
                    .order('created_at', { ascending: false }),
                supabase
                    .from('bph_members')
                    .select('id, name, role, division, status, created_at')
                    .order('created_at', { ascending: false }),
                supabase
                    .from('page_views')
                    .select('id, visitor_id, created_at')
                    .order('created_at', { ascending: false })
                    .limit(1000),
            ])

            if (beritaRes.error && eventsRes.error && membersRes.error) {
                setDbConnected(false)
            } else {
                setDbConnected(true)
            }

            if (!beritaRes.error && beritaRes.data) setBeritaList(beritaRes.data as BeritaSummary[])
            if (!eventsRes.error && eventsRes.data) setEventList(eventsRes.data as EventSummary[])
            if (!membersRes.error && membersRes.data) setMemberList(membersRes.data as MemberSummary[])
            if (!viewsRes.error && viewsRes.data) setPageViews(viewsRes.data as PageViewSummary[])

            setIsLoading(false)
        }

        fetchDashboardData()
    }, [supabase])

    const stats = useMemo(() => {
        const publishedBerita = beritaList.filter((b) => b.status === 'Published').length
        const draftBerita = beritaList.filter((b) => b.status !== 'Published').length

        const artikelViews = beritaList.reduce((acc, b) => acc + (b.views || 0), 0)
        const totalTayangan = pageViews.length + artikelViews
        const uniqueVisitors = new Set(pageViews.map((v) => v.visitor_id)).size

        const activeMembers = memberList.filter((m) => m.status === 'Aktif').length
        const activeEvents = eventList.filter((e) => e.status !== 'Selesai').length

        return [
            {
                title: 'Artikel Terpublikasi',
                value: publishedBerita.toLocaleString('id-ID'),
                trend: `${draftBerita} Draft`,
                subtext: `Total ${beritaList.length} artikel di database`,
                icon: FileText,
                color: 'text-blue-600',
                bg: 'bg-blue-50 border-blue-100',
                href: '/admin/berita',
            },
            {
                title: 'Total Tayangan Portal',
                value: totalTayangan.toLocaleString('id-ID'),
                trend: `${uniqueVisitors} Unik`,
                subtext: 'Gabungan pageviews situs & baca berita',
                icon: Eye,
                color: 'text-emerald-600',
                bg: 'bg-emerald-50 border-emerald-100',
                href: '/admin/analytics',
            },
            {
                title: 'Pengurus BPH Aktif',
                value: activeMembers.toLocaleString('id-ID'),
                trend: '2026/2027',
                subtext: `Dari ${memberList.length} fungsionaris terdaftar`,
                icon: Users,
                color: 'text-indigo-600',
                bg: 'bg-indigo-50 border-indigo-100',
                href: '/admin/bph',
            },
            {
                title: 'Agenda Kegiatan',
                value: activeEvents.toLocaleString('id-ID'),
                trend: `${eventList.length} Total`,
                subtext: 'Program kerja aktif & mendatang',
                icon: Calendar,
                color: 'text-amber-600',
                bg: 'bg-amber-50 border-amber-100',
                href: '/admin/agenda',
            },
        ]
    }, [beritaList, eventList, memberList, pageViews])

    const recentActivities = useMemo<FeedActivity[]>(() => {
        const items: FeedActivity[] = []

        beritaList.slice(0, 4).forEach((b) => {
            items.push({
                id: `berita-${b.id}`,
                avatar: 'BR',
                user: 'Redaksi MEDKOMINFO',
                action: b.status === 'Published' ? 'memublikasikan berita' : 'menyimpan draf berita',
                target: b.title,
                role: b.category || 'Berita',
                time: timeAgo(b.created_at),
                timestamp: new Date(b.created_at).getTime(),
            })
        })

        eventList.slice(0, 4).forEach((e) => {
            items.push({
                id: `event-${e.id}`,
                avatar: 'AG',
                user: 'Panitia & Pengurus',
                action: 'menambahkan agenda kegiatan',
                target: e.title,
                role: e.category || 'Agenda',
                time: timeAgo(e.created_at),
                timestamp: new Date(e.created_at).getTime(),
            })
        })

        memberList.slice(0, 3).forEach((m) => {
            items.push({
                id: `member-${m.id}`,
                avatar: getInitials(m.name),
                user: m.name,
                action: 'terdaftar sebagai',
                target: `${m.role} (${m.division})`,
                role: 'Keanggotaan BPH',
                time: timeAgo(m.created_at),
                timestamp: new Date(m.created_at).getTime(),
            })
        })

        return items.sort((a, b) => b.timestamp - a.timestamp).slice(0, 6)
    }, [beritaList, eventList, memberList])

    const upcomingEvents = useMemo(() => {
        return eventList.filter((e) => e.status !== 'Selesai').slice(0, 4)
    }, [eventList])

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-5">
                <div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 mb-1">
                        <span>SIM HIMATIFA</span>
                        <ChevronRight className="size-3 text-slate-400" />
                        <span className="text-slate-500">Pusat Kendali Admin</span>
                    </div>
                    <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                        Ringkasan Dashboard
                    </h1>
                    <p className="mt-1 text-xs sm:text-sm text-slate-500">
                        Pantau indikator kinerja utama, statistik pengunjung, serta aktivitas terbaru pengurus periode 2026/2027.
                    </p>
                </div>

                <div className="flex items-center gap-2.5">
                    <Link
                        href="/admin/berita"
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-xs transition hover:border-slate-300 hover:bg-slate-50 active:scale-[0.98]"
                    >
                        <FileText className="size-4 text-slate-500" />
                        <span>Tulis Berita</span>
                    </Link>
                    <Link
                        href="/admin/agenda"
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-blue-600/10 transition hover:bg-blue-500 active:scale-[0.98]"
                    >
                        <Plus className="size-4" />
                        <span>Buat Agenda Baru</span>
                    </Link>
                </div>
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white py-20 text-slate-500">
                    <Loader2 className="size-7 animate-spin text-blue-600 mb-2" />
                    <p className="text-xs font-semibold">Menyinkronkan ringkasan dashboard dari Supabase...</p>
                </div>
            ) : (
                <>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {stats.map((stat, index) => {
                            const Icon = stat.icon

                            return (
                                <motion.div
                                    key={stat.title}
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.06, duration: 0.25 }}
                                >
                                    <Link
                                        href={stat.href}
                                        className="group flex h-full flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition hover:border-blue-300 hover:shadow-sm"
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-blue-600 transition-colors">
                                                {stat.title}
                                            </span>
                                            <div
                                                className={`grid size-9 place-items-center rounded-xl border ${stat.bg} ${stat.color}`}
                                            >
                                                <Icon className="size-4.5" />
                                            </div>
                                        </div>

                                        <div className="mt-4 flex items-baseline justify-between">
                                            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                                                {stat.value}
                                            </h2>
                                            <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-extrabold text-emerald-700">
                                                <ArrowUpRight className="size-3" />
                                                {stat.trend}
                                            </span>
                                        </div>
                                        <p className="mt-1 text-[11px] font-medium text-slate-400">{stat.subtext}</p>
                                    </Link>
                                </motion.div>
                            )
                        })}
                    </div>

                    <div className="grid gap-6 lg:grid-cols-12">
                        <div className="lg:col-span-8 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs">
                            <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-4">
                                <div className="flex items-center gap-3">
                                    <div className="grid size-9 place-items-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
                                        <Activity className="size-4.5" />
                                    </div>
                                    <div>
                                        <h2 className="text-base font-bold text-slate-900">Aktivitas Terakhir Pengurus</h2>
                                        <p className="text-xs text-slate-500">Pembaruan konten berita, agenda, dan struktur organisasi di Supabase.</p>
                                    </div>
                                </div>
                                <Link
                                    href="/admin/analytics"
                                    className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700"
                                >
                                    <span>Lihat Analitik</span>
                                    <ExternalLink className="size-3.5" />
                                </Link>
                            </div>

                            {recentActivities.length > 0 ? (
                                <div className="space-y-5">
                                    {recentActivities.map((activity) => (
                                        <div key={activity.id} className="flex items-start gap-3.5">
                                            <div className="grid size-9 shrink-0 place-items-center rounded-full bg-slate-100 font-extrabold text-xs text-slate-700 border border-slate-200">
                                                {activity.avatar}
                                            </div>
                                            <div className="flex-1 space-y-1">
                                                <p className="text-xs leading-relaxed text-slate-700">
                                                    <strong className="font-bold text-slate-900">{activity.user}</strong>{' '}
                                                    <span className="text-slate-600">{activity.action}</span>{' '}
                                                    <span className="font-semibold text-blue-600">{activity.target}</span>
                                                </p>
                                                <div className="flex items-center gap-2 text-[11px] text-slate-400 font-medium">
                                                    <span>{activity.role}</span>
                                                    <span>•</span>
                                                    <span>{activity.time}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="py-10 text-center text-xs font-medium text-slate-400">
                                    Belum ada aktivitas tercatat di database.
                                </p>
                            )}
                        </div>

                        <div className="lg:col-span-4 flex flex-col gap-6">
                            <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs">
                                <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="grid size-9 place-items-center rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
                                            <Calendar className="size-4.5" />
                                        </div>
                                        <div>
                                            <h2 className="text-base font-bold text-slate-900">Agenda Aktif</h2>
                                            <p className="text-xs text-slate-500">Jadwal kegiatan terdekat.</p>
                                        </div>
                                    </div>
                                    <Link
                                        href="/admin/agenda"
                                        className="text-[11px] font-bold text-blue-600 hover:underline"
                                    >
                                        Semua
                                    </Link>
                                </div>

                                <div className="flex flex-col gap-3">
                                    {upcomingEvents.length > 0 ? (
                                        upcomingEvents.map((ev) => (
                                            <div
                                                key={ev.id}
                                                className="rounded-xl border border-slate-100 bg-slate-50/70 p-3.5 space-y-1.5"
                                            >
                                                <div className="flex items-center justify-between gap-2 text-xs">
                                                    <span className="font-bold text-slate-900 line-clamp-1">
                                                        {ev.title}
                                                    </span>
                                                    <span className="shrink-0 rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 border border-blue-100">
                                                        {ev.status}
                                                    </span>
                                                </div>
                                                <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
                                                    <span className="inline-flex items-center gap-1">
                                                        <Clock className="size-3 text-slate-400" />
                                                        {ev.date}
                                                    </span>
                                                    {ev.location && (
                                                        <span className="inline-flex items-center gap-1 truncate max-w-[140px]">
                                                            <MapPin className="size-3 text-slate-400" />
                                                            {ev.location}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-xs text-slate-400 text-center py-4">
                                            Belum ada agenda aktif saat ini.
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                                <div className="flex items-center gap-3">
                                    <div className="grid size-9 place-items-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                                        <ShieldCheck className="size-4.5" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-900">Status Sistem SIM</p>
                                        <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                                            <CheckCircle2 className="size-3" />{' '}
                                            {dbConnected ? 'Supabase Terhubung & Normal' : 'Memeriksa Koneksi Database'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}
