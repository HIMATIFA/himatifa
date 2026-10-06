'use client'

import { useState } from 'react'
import {
    Download,
    Calendar,
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
    FileText
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
        { name: 'Akses Langsung (Direct URL)', percentage: 12, visits: '1.7k', color: 'bg-sky-400' },
        { name: 'Grup WhatsApp / Media Sosial Lain', percentage: 6, visits: '870', color: 'bg-slate-400' },
    ]

    const topContents = [
        { title: 'Tech Talk 2026: Menguasai Agentic AI', category: 'Workshop', views: '3,420', growth: '+24%' },
        { title: 'Pengumuman Hasil Seleksi Panitia VIBRANUM', category: 'Pengumuman', views: '2,890', growth: '+18%' },
        { title: 'OSCAR (Olimpiade Siswa Cerdas) 2026', category: 'Agenda Event', views: '2,150', growth: '+12%' },
        { title: 'Open Recruitment Pengurus Periode 2027', category: 'Info Kampus', views: '1,940', growth: '+5%' },
    ]

    return (
        <div className="mx-auto max-w-7xl animate-in fade-in duration-300">
            <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
                <div>
                    <h2 className="text-2xl font-black tracking-tight text-slate-900">Site Analytics</h2>
                    <p className="mt-1 text-sm font-medium text-slate-500">Pantau performa trafik, statistik pengunjung, dan jangkauan konten HIMATIFA.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
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
                                        ? 'bg-slate-100 text-slate-900 shadow-sm'
                                        : 'text-slate-500 hover:text-slate-900'
                                }`}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>

                    <button className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50">
                        <Download className="size-4" /> Unduh Laporan
                    </button>
                </div>
            </div>

            <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                    { label: 'Total Pengunjung', value: '14,520', change: '+14.2%', isPositive: true, icon: Users, sub: 'Pengunjung Unik' },
                    { label: 'Total Tayangan', value: '36,700', change: '+8.5%', isPositive: true, icon: Eye, sub: 'Pageviews' },
                    { label: 'Rata-Rata Sesi', value: '2m 45s', change: '+3.1%', isPositive: true, icon: Clock, sub: 'Waktu di Situs' },
                    { label: 'Rasio Pantulan', value: '34.2%', change: '-2.4%', isPositive: true, icon: MousePointerClick, sub: 'Bounce Rate' },
                ].map((card, idx) => (
                    <div key={idx} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-slate-300">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">{card.label}</span>
                            <div className="grid size-9 place-items-center rounded-xl bg-blue-50 text-blue-600">
                                <card.icon className="size-4" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-baseline justify-between">
                            <h3 className="text-3xl font-black text-slate-900">{card.value}</h3>
                            <span className={`flex items-center gap-0.5 text-xs font-bold ${card.isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                                {card.isPositive ? <TrendingUp className="size-3.5" /> : <TrendingDown className="size-3.5" />}
                                {card.change}
                            </span>
                        </div>
                        <p className="mt-1 text-[11px] font-medium text-slate-400">{card.sub} vs bulan lalu</p>
                    </div>
                ))}
            </div>

            <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-6 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                    <div>
                        <h3 className="text-lg font-bold text-slate-900">Grafik Tren Trafik Website</h3>
                        <p className="text-xs font-medium text-slate-500">Perbandingan Pengunjung Unik dan Total Pageviews mingguan.</p>
                    </div>
                    <div className="flex items-center gap-4 text-xs font-bold">
                        <div className="flex items-center gap-2">
                            <span className="size-3 rounded-full bg-blue-600"></span> Total Pageviews
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="size-3 rounded-full bg-indigo-300"></span> Pengunjung Unik
                        </div>
                    </div>
                </div>

                <div className="flex h-64 items-end gap-3 pt-6 sm:gap-6">
                    {chartData.map((item, index) => {
                        const pageviewHeight = (item.pageviews / maxChartValue) * 100
                        const visitorHeight = (item.visitors / maxChartValue) * 100

                        return (
                            <div key={index} className="group relative flex flex-1 flex-col items-center h-full justify-end">
                                <div className="absolute -top-12 z-10 hidden rounded-lg bg-slate-900 px-2.5 py-1 text-[11px] font-bold text-white shadow-lg group-hover:block transition-all">
                                    <p>{item.pageviews.toLocaleString()} views</p>
                                    <p className="text-slate-400">{item.visitors.toLocaleString()} pengunjung</p>
                                </div>

                                <div className="flex w-full items-end justify-center gap-1.5 h-full">
                                    <div
                                        style={{ height: `${pageviewHeight}%` }}
                                        className="w-full max-w-[24px] rounded-t-lg bg-blue-600 transition-all duration-500 group-hover:bg-blue-700"
                                    />
                                    <div
                                        style={{ height: `${visitorHeight}%` }}
                                        className="w-full max-w-[24px] rounded-t-lg bg-indigo-300 transition-all duration-500 group-hover:bg-indigo-400"
                                    />
                                </div>

                                <span className="mt-3 text-xs font-bold text-slate-500">{item.day}</span>
                            </div>
                        )
                    })}
                </div>
            </div>

            <div className="mb-8 grid gap-8 lg:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h3 className="text-base font-bold text-slate-900">Sumber Trafik</h3>
                            <p className="text-xs text-slate-500">Darimana pengunjung menemukan website HIMATIFA.</p>
                        </div>
                        <Globe className="size-5 text-slate-400" />
                    </div>

                    <div className="space-y-4">
                        {trafficSources.map((source, idx) => (
                            <div key={idx} className="space-y-1.5">
                                <div className="flex justify-between text-xs font-bold">
                                    <span className="text-slate-700">{source.name}</span>
                                    <span className="text-slate-900">{source.visits} ({source.percentage}%)</span>
                                </div>
                                <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                                    <div
                                        className={`h-full rounded-full ${source.color} transition-all duration-500`}
                                        style={{ width: `${source.percentage}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h3 className="text-base font-bold text-slate-900">Perangkat Pengguna</h3>
                            <p className="text-xs text-slate-500">Jenis perangkat yang digunakan oleh audiens.</p>
                        </div>
                        <Smartphone className="size-5 text-slate-400" />
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">
                            <div className="mx-auto mb-2 grid size-10 place-items-center rounded-xl bg-blue-100 text-blue-600">
                                <Smartphone className="size-5" />
                            </div>
                            <p className="text-xl font-black text-slate-900">68%</p>
                            <p className="mt-0.5 text-xs font-semibold text-slate-500">Mobile / Smartphone</p>
                        </div>

                        <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">
                            <div className="mx-auto mb-2 grid size-10 place-items-center rounded-xl bg-indigo-100 text-indigo-600">
                                <Monitor className="size-5" />
                            </div>
                            <p className="text-xl font-black text-slate-900">28%</p>
                            <p className="mt-0.5 text-xs font-semibold text-slate-500">Desktop / PC</p>
                        </div>

                        <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">
                            <div className="mx-auto mb-2 grid size-10 place-items-center rounded-xl bg-slate-200 text-slate-600">
                                <Tablet className="size-5" />
                            </div>
                            <p className="text-xl font-black text-slate-900">4%</p>
                            <p className="mt-0.5 text-xs font-semibold text-slate-500">Tablet / iPad</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 px-6 py-4">
                    <h3 className="text-base font-bold text-slate-900">Konten Paling Banyak Dilihat</h3>
                    <p className="text-xs text-slate-500">Artikel & agenda kegiatan dengan jumlah tayangan tertinggi.</p>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600">
                        <thead className="bg-slate-50/50 text-[11px] font-extrabold uppercase tracking-widest text-slate-500 border-b border-slate-100">
                        <tr>
                            <th className="px-6 py-4">Judul Konten</th>
                            <th className="px-4 py-4">Kategori</th>
                            <th className="px-4 py-4">Total Views</th>
                            <th className="px-6 py-4 text-right">Pertumbuhan</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                        {topContents.map((content, idx) => (
                            <tr key={idx} className="transition-colors hover:bg-slate-50/80">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <FileText className="size-4 shrink-0 text-slate-400" />
                                        <span className="font-bold text-slate-900">{content.title}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-4">
                                        <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">
                                            {content.category}
                                        </span>
                                </td>
                                <td className="px-4 py-4 font-semibold text-slate-900">
                                    {content.views} views
                                </td>
                                <td className="px-6 py-4 text-right">
                                        <span className="inline-flex items-center gap-1 font-bold text-emerald-600">
                                            {content.growth} <ArrowUpRight className="size-3.5" />
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
