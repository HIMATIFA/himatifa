'use client'

import { useState, useEffect, useMemo } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import {
    Download,
    TrendingUp,
    TrendingDown,
    Users,
    Eye,
    Clock,
    MousePointerClick,
    Globe,
    Smartphone,
    Monitor,
    Tablet,
    ArrowUpRight,
    FileText,
    ChevronRight,
    BarChart3,
    Loader2
} from 'lucide-react'

interface PageViewRow {
    id: string
    path: string
    page_title: string | null
    category: string | null
    visitor_id: string
    session_id: string
    referrer: string | null
    device: string | null
    duration_seconds: number | null
    created_at: string
}

interface BeritaPopulerRow {
    id: string
    title: string
    category: string
    views: number
}

interface EventPopulerRow {
    id: string
    title: string
    category: string
    status: string
}

const HARI_ID = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']

function formatDuration(seconds: number): string {
    if (!seconds || seconds <= 0) return '0m 0s'
    const mins = Math.floor(seconds / 60)
    const secs = Math.round(seconds % 60)
    return `${mins}m ${secs}s`
}

function calcGrowth(current: number, previous: number): { label: string; isPositive: boolean } {
    if (previous === 0) {
        return current > 0
            ? { label: '+100%', isPositive: true }
            : { label: '0.0%', isPositive: true }
    }
    const diff = ((current - previous) / previous) * 100
    const sign = diff >= 0 ? '+' : ''
    return {
        label: `${sign}${diff.toFixed(1)}%`,
        isPositive: diff >= 0,
    }
}

export default function AdminAnalyticsPage() {
    const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d')
    const [viewsData, setViewsData] = useState<PageViewRow[]>([])
    const [topBerita, setTopBerita] = useState<BeritaPopulerRow[]>([])
    const [recentEvents, setRecentEvents] = useState<EventPopulerRow[]>([])
    const [isLoading, setIsLoading] = useState(true)

    const supabase = useMemo(
        () =>
            createBrowserClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
            ),
        []
    )

    const daysCount = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90

    useEffect(() => {
        const fetchAnalytics = async () => {
            setIsLoading(true)

            const sinceDate = new Date()
            sinceDate.setDate(sinceDate.getDate() - daysCount * 2)

            const [viewsRes, beritaRes, eventsRes] = await Promise.all([
                supabase
                    .from('page_views')
                    .select('*')
                    .gte('created_at', sinceDate.toISOString())
                    .order('created_at', { ascending: true }),
                supabase
                    .from('berita')
                    .select('id, title, category, views')
                    .eq('status', 'Published')
                    .order('views', { ascending: false })
                    .limit(5),
                supabase
                    .from('events')
                    .select('id, title, category, status')
                    .order('created_at', { ascending: false })
                    .limit(3),
            ])

            if (!viewsRes.error && viewsRes.data) {
                setViewsData(viewsRes.data as PageViewRow[])
            }
            if (!beritaRes.error && beritaRes.data) {
                setTopBerita(beritaRes.data as BeritaPopulerRow[])
            }
            if (!eventsRes.error && eventsRes.data) {
                setRecentEvents(eventsRes.data as EventPopulerRow[])
            }

            setIsLoading(false)
        }

        fetchAnalytics()
    }, [supabase, daysCount])

    const analytics = useMemo(() => {
        const now = new Date()
        const currentStart = new Date(now)
        currentStart.setDate(now.getDate() - daysCount)

        const currentRows = viewsData.filter((r) => new Date(r.created_at) >= currentStart)
        const prevRows = viewsData.filter((r) => new Date(r.created_at) < currentStart)

        const totalPageviews = currentRows.length
        const prevPageviews = prevRows.length

        const uniqueVisitors = new Set(currentRows.map((r) => r.visitor_id)).size
        const prevUniqueVisitors = new Set(prevRows.map((r) => r.visitor_id)).size

        const totalDuration = currentRows.reduce((sum, r) => sum + (r.duration_seconds || 0), 0)
        const avgDuration = totalPageviews > 0 ? totalDuration / totalPageviews : 0

        const prevTotalDuration = prevRows.reduce((sum, r) => sum + (r.duration_seconds || 0), 0)
        const prevAvgDuration = prevPageviews > 0 ? prevTotalDuration / prevPageviews : 0

        const sessionCounts = new Map<string, number>()
        currentRows.forEach((r) => {
            sessionCounts.set(r.session_id, (sessionCounts.get(r.session_id) || 0) + 1)
        })
        const totalSessions = sessionCounts.size
        const singlePageSessions = Array.from(sessionCounts.values()).filter((c) => c === 1).length
        const bounceRate = totalSessions > 0 ? (singlePageSessions / totalSessions) * 100 : 0

        const prevSessionCounts = new Map<string, number>()
        prevRows.forEach((r) => {
            prevSessionCounts.set(r.session_id, (prevSessionCounts.get(r.session_id) || 0) + 1)
        })
        const prevTotalSessions = prevSessionCounts.size
        const prevSingleSessions = Array.from(prevSessionCounts.values()).filter((c) => c === 1).length
        const prevBounceRate = prevTotalSessions > 0 ? (prevSingleSessions / prevTotalSessions) * 100 : 0

        const pvGrowth = calcGrowth(totalPageviews, prevPageviews)
        const visGrowth = calcGrowth(uniqueVisitors, prevUniqueVisitors)
        const durGrowth = calcGrowth(avgDuration, prevAvgDuration)
        const bounceDiff = bounceRate - prevBounceRate

        const kpiCards = [
            {
                label: 'Total Pengunjung',
                value: uniqueVisitors.toLocaleString('id-ID'),
                change: visGrowth.label,
                isPositive: visGrowth.isPositive,
                icon: Users,
                sub: 'Pengunjung Unik',
            },
            {
                label: 'Total Tayangan',
                value: totalPageviews.toLocaleString('id-ID'),
                change: pvGrowth.label,
                isPositive: pvGrowth.isPositive,
                icon: Eye,
                sub: 'Pageviews Halaman',
            },
            {
                label: 'Rata-Rata Sesi',
                value: formatDuration(avgDuration),
                change: durGrowth.label,
                isPositive: durGrowth.isPositive,
                icon: Clock,
                sub: 'Durasi Kunjungan',
            },
            {
                label: 'Rasio Pantulan',
                value: `${bounceRate.toFixed(1)}%`,
                change: `${bounceDiff >= 0 ? '+' : ''}${bounceDiff.toFixed(1)}%`,
                isPositive: bounceDiff <= 0,
                icon: MousePointerClick,
                sub: 'Bounce Rate',
            },
        ]

        const chartDays: { day: string; visitors: number; pageviews: number }[] = []
        for (let i = 6; i >= 0; i--) {
            const d = new Date()
            d.setDate(d.getDate() - i)
            const dateKey = d.toISOString().split('T')[0]
            const dayName = HARI_ID[d.getDay()]

            const dayRows = viewsData.filter((r) => r.created_at.startsWith(dateKey))
            const dayVisitors = new Set(dayRows.map((r) => r.visitor_id)).size

            chartDays.push({
                day: dayName,
                visitors: dayVisitors,
                pageviews: dayRows.length,
            })
        }

        const maxChartVal = Math.max(10, ...chartDays.map((d) => Math.max(d.pageviews, d.visitors)))

        const externalRows = currentRows.filter((r) => r.referrer !== 'Navigasi Internal Portal')
        const sourceBase = externalRows.length > 0 ? externalRows : currentRows
        const sourceMap = new Map<string, number>()

        sourceBase.forEach((r) => {
            const key = r.referrer || 'Akses Langsung (Direct URL)'
            sourceMap.set(key, (sourceMap.get(key) || 0) + 1)
        })

        const colors = ['bg-blue-600', 'bg-indigo-500', 'bg-sky-500', 'bg-slate-400']
        const trafficSources = Array.from(sourceMap.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 4)
            .map(([name, count], idx) => ({
                name,
                visits: count.toLocaleString('id-ID'),
                percentage: sourceBase.length > 0 ? Math.round((count / sourceBase.length) * 100) : 0,
                color: colors[idx % colors.length],
            }))

        let mobileCount = 0
        let desktopCount = 0
        let tabletCount = 0

        currentRows.forEach((r) => {
            if (r.device === 'Desktop / PC') desktopCount++
            else if (r.device === 'Tablet / iPad') tabletCount++
            else mobileCount++
        })

        const totalDev = currentRows.length
        const devices = {
            mobile: totalDev > 0 ? Math.round((mobileCount / totalDev) * 100) : 0,
            desktop: totalDev > 0 ? Math.round((desktopCount / totalDev) * 100) : 0,
            tablet: totalDev > 0 ? Math.round((tabletCount / totalDev) * 100) : 0,
        }

        const pageMap = new Map<string, { title: string; category: string; current: number; prev: number }>()

        currentRows.forEach((r) => {
            const key = r.path
            const existing = pageMap.get(key) || {
                title: r.page_title || r.path,
                category: r.category || 'Halaman Publik',
                current: 0,
                prev: 0,
            }
            existing.current++
            pageMap.set(key, existing)
        })

        prevRows.forEach((r) => {
            const existing = pageMap.get(r.path)
            if (existing) existing.prev++
        })

        const trackedPages = Array.from(pageMap.values()).map((item) => {
            const g = calcGrowth(item.current, item.prev)
            return {
                title: item.title,
                category: item.category,
                viewsCount: item.current,
                views: item.current.toLocaleString('id-ID'),
                growth: g.label,
                isPositive: g.isPositive,
            }
        })

        const beritaItems = topBerita.map((b) => ({
            title: b.title,
            category: b.category || 'Berita',
            viewsCount: b.views || 0,
            views: (b.views || 0).toLocaleString('id-ID'),
            growth: 'Artikel',
            isPositive: true,
        }))

        const eventItems = recentEvents.map((e) => ({
            title: e.title,
            category: e.category || 'Agenda Event',
            viewsCount: 1,
            views: '1',
            growth: e.status || 'Agenda',
            isPositive: true,
        }))

        const topContents = [...trackedPages, ...beritaItems, ...eventItems]
            .sort((a, b) => b.viewsCount - a.viewsCount)
            .slice(0, 7)

        return {
            kpiCards,
            chartDays,
            maxChartVal,
            trafficSources,
            devices,
            topContents,
        }
    }, [viewsData, topBerita, recentEvents, daysCount])

    const handleExportReport = () => {
        const lines: string[] = [
            `LAPORAN TRAFIK & PERFORMA PORTAL HIMATIFA (${daysCount} HARI TERAKHIR)`,
            '',
            'RINGKASAN METRIK,NILAI,PERTUMBUHAN',
            ...analytics.kpiCards.map((c) => `"${c.label}","${c.value}","${c.change}"`),
            '',
            'SUMBER TRAFIK,KUNJUNGAN,PERSENTASE',
            ...analytics.trafficSources.map((s) => `"${s.name}","${s.visits}","${s.percentage}%"`),
            '',
            'KONTEN & HALAMAN TERPOPULER,KATEGORI,TOTAL VIEWS',
            ...analytics.topContents.map(
                (item) => `"${item.title.replace(/"/g, '""')}","${item.category}","${item.views}"`
            ),
        ]

        const csvContent = 'data:text/csv;charset=utf-8,' + lines.join('\n')
        const encodedUri = encodeURI(csvContent)
        const link = document.createElement('a')
        link.setAttribute('href', encodedUri)
        link.setAttribute('download', `laporan-analitik-himatifa-${timeRange}-${new Date().toISOString().split('T')[0]}.csv`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-5">
                <div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 mb-1">
                        <span>SIM HIMATIFA</span>
                        <ChevronRight className="size-3 text-slate-400" />
                        <span className="text-slate-500">Modul Analitik</span>
                    </div>
                    <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                        Performa & Trafik Situs
                    </h1>
                    <p className="mt-1 text-xs sm:text-sm text-slate-500">
                        Pantau statistik kunjungan real-time, sumber rujukan (Instagram/Google), dan jangkauan konten HIMATIFA.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                    <div className="flex rounded-xl border border-slate-200 bg-white p-1 shadow-xs">
                        {[
                            { id: '7d', label: '7 Hari' },
                            { id: '30d', label: '30 Hari' },
                            { id: '90d', label: '90 Hari' },
                        ].map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setTimeRange(item.id as '7d' | '30d' | '90d')}
                                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                                    timeRange === item.id
                                        ? 'bg-slate-900 text-white shadow-xs'
                                        : 'text-slate-500 hover:text-slate-900'
                                }`}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>

                    <button
                        type="button"
                        onClick={handleExportReport}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-xs transition hover:border-slate-300 hover:bg-slate-50 active:scale-[0.98] cursor-pointer"
                    >
                        <Download className="size-4 text-slate-500" />
                        <span>Unduh Laporan</span>
                    </button>
                </div>
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white py-20 text-slate-500">
                    <Loader2 className="size-7 animate-spin text-blue-600 mb-2" />
                    <p className="text-xs font-semibold">Mengagregasi data trafik dari Supabase...</p>
                </div>
            ) : (
                <>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {analytics.kpiCards.map((card, idx) => (
                            <div
                                key={idx}
                                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-all hover:border-slate-300"
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                        {card.label}
                                    </span>
                                    <div className="grid size-9 place-items-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
                                        <card.icon className="size-4.5" />
                                    </div>
                                </div>

                                <div className="mt-3 flex items-baseline justify-between">
                                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                                        {card.value}
                                    </h2>
                                    <span
                                        className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[11px] font-extrabold ${
                                            card.isPositive ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                                        }`}
                                    >
                                        {card.isPositive ? (
                                            <TrendingUp className="size-3" />
                                        ) : (
                                            <TrendingDown className="size-3" />
                                        )}
                                        {card.change}
                                    </span>
                                </div>
                                <p className="mt-1 text-[11px] font-medium text-slate-400">{card.sub} vs periode lalu</p>
                            </div>
                        ))}
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs">
                        <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                            <div>
                                <div className="flex items-center gap-2">
                                    <BarChart3 className="size-5 text-blue-600" />
                                    <h2 className="text-base font-bold text-slate-900">Grafik Tren Trafik 7 Hari Terakhir</h2>
                                </div>
                                <p className="mt-0.5 text-xs font-medium text-slate-500">
                                    Perbandingan Tayangan Halaman (Pageviews) dan Pengunjung Unik per hari.
                                </p>
                            </div>

                            <div className="flex items-center gap-4 text-xs font-bold">
                                <div className="flex items-center gap-2">
                                    <span className="size-3 rounded-md bg-blue-600" />
                                    <span className="text-slate-700">Total Pageviews</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="size-3 rounded-md bg-indigo-300" />
                                    <span className="text-slate-700">Pengunjung Unik</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex h-64 items-end gap-2 pt-8 sm:gap-6 border-b border-slate-100 pb-2">
                            {analytics.chartDays.map((item, index) => {
                                const pageviewHeight =
                                    item.pageviews > 0
                                        ? Math.max(Math.min((item.pageviews / analytics.maxChartVal) * 100, 100), 6)
                                        : 2
                                const visitorHeight =
                                    item.visitors > 0
                                        ? Math.max(Math.min((item.visitors / analytics.maxChartVal) * 100, 100), 6)
                                        : 2

                                return (
                                    <div
                                        key={index}
                                        className="group relative flex flex-1 flex-col items-center h-full justify-end"
                                    >
                                        <div className="absolute -top-14 z-20 hidden rounded-xl bg-slate-900 px-3 py-1.5 text-[11px] font-semibold text-white shadow-lg group-hover:block transition-all whitespace-nowrap">
                                            <p className="text-blue-300">{item.pageviews.toLocaleString('id-ID')} pageviews</p>
                                            <p className="text-slate-300">{item.visitors.toLocaleString('id-ID')} pengunjung</p>
                                        </div>

                                        <div className="flex w-full items-end justify-center gap-1.5 h-full px-1">
                                            <div
                                                style={{ height: `${pageviewHeight}%` }}
                                                className="w-full max-w-[20px] rounded-t-lg bg-blue-600 transition-all duration-300 group-hover:bg-blue-500"
                                            />
                                            <div
                                                style={{ height: `${visitorHeight}%` }}
                                                className="w-full max-w-[20px] rounded-t-lg bg-indigo-300 transition-all duration-300 group-hover:bg-indigo-400"
                                            />
                                        </div>

                                        <span className="mt-3 text-xs font-bold text-slate-500">{item.day}</span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-2">
                        <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs">
                            <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-4">
                                <div>
                                    <h2 className="text-base font-bold text-slate-900">Kanal & Sumber Trafik</h2>
                                    <p className="text-xs text-slate-500">Asal rujukan pengunjung (Instagram, Google, Direct, dll).</p>
                                </div>
                                <div className="grid size-9 place-items-center rounded-xl bg-slate-100 text-slate-500">
                                    <Globe className="size-4.5" />
                                </div>
                            </div>

                            {analytics.trafficSources.length > 0 ? (
                                <div className="space-y-4">
                                    {analytics.trafficSources.map((source, idx) => (
                                        <div key={idx} className="space-y-1.5">
                                            <div className="flex justify-between text-xs font-bold">
                                                <span className="text-slate-800">{source.name}</span>
                                                <span className="text-slate-900 font-extrabold">
                                                    {source.visits}{' '}
                                                    <span className="text-slate-400 font-medium">({source.percentage}%)</span>
                                                </span>
                                            </div>
                                            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                                                <div
                                                    className={`h-full rounded-full ${source.color} transition-all duration-500`}
                                                    style={{ width: `${source.percentage}%` }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="py-8 text-center text-xs font-medium text-slate-400">
                                    Belum ada data rujukan trafik pada rentang waktu ini.
                                </p>
                            )}
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs">
                            <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-4">
                                <div>
                                    <h2 className="text-base font-bold text-slate-900">Perangkat Pengguna</h2>
                                    <p className="text-xs text-slate-500">Kategori perangkat yang digunakan audiens.</p>
                                </div>
                                <div className="grid size-9 place-items-center rounded-xl bg-slate-100 text-slate-500">
                                    <Smartphone className="size-4.5" />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-3 text-center">
                                <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4 transition-all hover:bg-slate-50">
                                    <div className="mx-auto mb-2 grid size-10 place-items-center rounded-xl bg-blue-100 text-blue-600">
                                        <Smartphone className="size-5" />
                                    </div>
                                    <p className="text-xl font-extrabold text-slate-900">{analytics.devices.mobile}%</p>
                                    <p className="mt-0.5 text-xs font-semibold text-slate-500">Smartphone</p>
                                </div>

                                <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4 transition-all hover:bg-slate-50">
                                    <div className="mx-auto mb-2 grid size-10 place-items-center rounded-xl bg-indigo-100 text-indigo-600">
                                        <Monitor className="size-5" />
                                    </div>
                                    <p className="text-xl font-extrabold text-slate-900">{analytics.devices.desktop}%</p>
                                    <p className="mt-0.5 text-xs font-semibold text-slate-500">Desktop / PC</p>
                                </div>

                                <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4 transition-all hover:bg-slate-50">
                                    <div className="mx-auto mb-2 grid size-10 place-items-center rounded-xl bg-sky-100 text-sky-600">
                                        <Tablet className="size-5" />
                                    </div>
                                    <p className="text-xl font-extrabold text-slate-900">{analytics.devices.tablet}%</p>
                                    <p className="mt-0.5 text-xs font-semibold text-slate-500">Tablet / iPad</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
                        <div className="border-b border-slate-200 bg-slate-50/50 px-5 py-4">
                            <h2 className="text-base font-bold text-slate-900">Konten & Halaman Terpopuler</h2>
                            <p className="text-xs text-slate-500">Halaman web, artikel berita, dan agenda kegiatan dengan interaksi tertinggi.</p>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead>
                                <tr className="border-b border-slate-200 bg-slate-50/60 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                    <th className="px-5 py-3.5 font-bold">Judul Konten / Halaman</th>
                                    <th className="px-4 py-3.5 font-bold">Kategori</th>
                                    <th className="px-4 py-3.5 font-bold">Total Views</th>
                                    <th className="px-5 py-3.5 text-right font-bold">Tren / Status</th>
                                </tr>
                                </thead>

                                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                                {analytics.topContents.length > 0 ? (
                                    analytics.topContents.map((content, idx) => (
                                        <tr key={idx} className="transition-colors hover:bg-slate-50/80">
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="grid size-8 shrink-0 place-items-center rounded-lg border border-slate-200 bg-slate-50 text-slate-400">
                                                        <FileText className="size-4" />
                                                    </div>
                                                    <span className="font-bold text-slate-900">
                                                            {content.title}
                                                        </span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4">
                                                    <span className="inline-flex rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-bold text-slate-700">
                                                        {content.category}
                                                    </span>
                                            </td>
                                            <td className="px-4 py-4 font-bold text-slate-900">
                                                {content.views} <span className="text-slate-400 font-normal">views</span>
                                            </td>
                                            <td className="px-5 py-4 text-right">
                                                    <span
                                                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-bold ${
                                                            content.isPositive
                                                                ? 'text-emerald-600 bg-emerald-50'
                                                                : 'text-rose-600 bg-rose-50'
                                                        }`}
                                                    >
                                                        {content.growth} <ArrowUpRight className="size-3" />
                                                    </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="px-5 py-10 text-center text-xs text-slate-400">
                                            Belum ada data kunjungan tercatat. Coba buka halaman beranda, berita, atau departemen lalu muat ulang halaman ini.
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}