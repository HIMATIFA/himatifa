'use client'

import { useState } from 'react'
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
    Sparkles
} from 'lucide-react'

export default function AdminAnalyticsPage() {
    const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d')

    const chartData = [
        { day: 'Sen', visitors: 1200, pageviews: 3400 },
        { day: 'Sel', visitors: 1900, pageviews: 4200 },
        { day: 'Rab', visitors: 1500, pageviews: 3800 },
        { day: 'Kam', visitors: 2800, pageviews: 6100 },
        { day: 'Jum', visitors: 2200, pageviews: 5300 },
        { day: 'Sab', visitors: 3400, pageviews: 7800 },
        { day: 'Min', visitors: 2900, pageviews: 6400 },
    ]

    const maxChartValue = 8000

    const trafficSources = [
        { name: 'Instagram Linktree (HIMATIFA)', percentage: 58, visits: '8.4k', color: 'bg-blue-600' },
        { name: 'Pencarian Organik (Google)', percentage: 24, visits: '3.5k', color: 'bg-indigo-500' },
        { name: 'Akses Langsung (Direct URL)', percentage: 12, visits: '1.7k', color: 'bg-sky-500' },
        { name: 'Grup WhatsApp / Media Sosial', percentage: 6, visits: '870', color: 'bg-slate-400' },
    ]

    const topContents = [
        { title: 'Tech Talk 2026: Menguasai Agentic AI', category: 'Workshop', views: '3,420', growth: '+24%' },
        { title: 'Pengumuman Hasil Seleksi Panitia VIBRANUM', category: 'Pengumuman', views: '2,890', growth: '+18%' },
        { title: 'OSCAR (Olimpiade Siswa Cerdas) 2026', category: 'Agenda Event', views: '2,150', growth: '+12%' },
        { title: 'Open Recruitment Pengurus Periode 2027', category: 'Info Kampus', views: '1,940', growth: '+5%' },
    ]

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
                        Pantau statistik statistik kunjungan, tren interaksi, dan jangkauan konten portal HIMATIFA.
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
                                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                                    timeRange === item.id
                                        ? 'bg-slate-900 text-white shadow-xs'
                                        : 'text-slate-500 hover:text-slate-900'
                                }`}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>

                    <button className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-xs transition hover:border-slate-300 hover:bg-slate-50 active:scale-[0.98]">
                        <Download className="size-4 text-slate-500" />
                        <span>Unduh Laporan</span>
                    </button>
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                    { label: 'Total Pengunjung', value: '14,520', change: '+14.2%', isPositive: true, icon: Users, sub: 'Pengunjung Unik' },
                    { label: 'Total Tayangan', value: '36,700', change: '+8.5%', isPositive: true, icon: Eye, sub: 'Pageviews Halaman' },
                    { label: 'Rata-Rata Sesi', value: '2m 45s', change: '+3.1%', isPositive: true, icon: Clock, sub: 'Durasi Kunjungan' },
                    { label: 'Rasio Pantulan', value: '34.2%', change: '-2.4%', isPositive: true, icon: MousePointerClick, sub: 'Bounce Rate' },
                ].map((card, idx) => (
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
                            <h2 className="text-base font-bold text-slate-900">Grafik Tren Trafik Minggu Ini</h2>
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
                    {chartData.map((item, index) => {
                        const pageviewHeight = Math.min((item.pageviews / maxChartValue) * 100, 100)
                        const visitorHeight = Math.min((item.visitors / maxChartValue) * 100, 100)

                        return (
                            <div
                                key={index}
                                className="group relative flex flex-1 flex-col items-center h-full justify-end"
                            >
                                <div className="absolute -top-14 z-20 hidden rounded-xl bg-slate-900 px-3 py-1.5 text-[11px] font-semibold text-white shadow-lg group-hover:block transition-all whitespace-nowrap">
                                    <p className="text-blue-300">{item.pageviews.toLocaleString()} pageviews</p>
                                    <p className="text-slate-300">{item.visitors.toLocaleString()} pengunjung</p>
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
                            <p className="text-xs text-slate-500">Asal rujukan pengunjung yang mengakses situs.</p>
                        </div>
                        <div className="grid size-9 place-items-center rounded-xl bg-slate-100 text-slate-500">
                            <Globe className="size-4.5" />
                        </div>
                    </div>

                    <div className="space-y-4">
                        {trafficSources.map((source, idx) => (
                            <div key={idx} className="space-y-1.5">
                                <div className="flex justify-between text-xs font-bold">
                                    <span className="text-slate-800">{source.name}</span>
                                    <span className="text-slate-900 font-extrabold">
                                        {source.visits} <span className="text-slate-400 font-medium">({source.percentage}%)</span>
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
                            <p className="text-xl font-extrabold text-slate-900">68%</p>
                            <p className="mt-0.5 text-xs font-semibold text-slate-500">Smartphone</p>
                        </div>

                        <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4 transition-all hover:bg-slate-50">
                            <div className="mx-auto mb-2 grid size-10 place-items-center rounded-xl bg-indigo-100 text-indigo-600">
                                <Monitor className="size-5" />
                            </div>
                            <p className="text-xl font-extrabold text-slate-900">28%</p>
                            <p className="mt-0.5 text-xs font-semibold text-slate-500">Desktop / PC</p>
                        </div>

                        <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4 transition-all hover:bg-slate-50">
                            <div className="mx-auto mb-2 grid size-10 place-items-center rounded-xl bg-sky-100 text-sky-600">
                                <Tablet className="size-5" />
                            </div>
                            <p className="text-xl font-extrabold text-slate-900">4%</p>
                            <p className="mt-0.5 text-xs font-semibold text-slate-500">Tablet / iPad</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
                <div className="border-b border-slate-200 bg-slate-50/50 px-5 py-4">
                    <h2 className="text-base font-bold text-slate-900">Konten & Artikel Terpopuler</h2>
                    <p className="text-xs text-slate-500">Halaman berita dan agenda dengan interaksi pengunjung tertinggi.</p>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead>
                        <tr className="border-b border-slate-200 bg-slate-50/60 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            <th className="px-5 py-3.5 font-bold">Judul Konten</th>
                            <th className="px-4 py-3.5 font-bold">Kategori</th>
                            <th className="px-4 py-3.5 font-bold">Total Views</th>
                            <th className="px-5 py-3.5 text-right font-bold">Pertumbuhan</th>
                        </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                        {topContents.map((content, idx) => (
                            <tr key={idx} className="transition-colors hover:bg-slate-50/80">
                                <td className="px-5 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="grid size-8 shrink-0 place-items-center rounded-lg border border-slate-200 bg-slate-50 text-slate-400">
                                            <FileText className="size-4" />
                                        </div>
                                        <span className="font-bold text-slate-900 hover:text-blue-600 transition-colors cursor-pointer">
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
                                        <span className="inline-flex items-center gap-1 font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md text-[11px]">
                                            {content.growth} <ArrowUpRight className="size-3" />
                                        </span>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}