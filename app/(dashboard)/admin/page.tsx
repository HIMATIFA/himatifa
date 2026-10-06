'use client'

import { motion } from 'framer-motion'
import {
    Users,
    FileText,
    Eye,
    Clock,
    ArrowUpRight,
    ArrowDownRight,
    MessageSquare,
    Activity
} from 'lucide-react'

// Data Dummy untuk Statistik
const stats = [
    {
        title: 'Total Artikel',
        value: '142',
        trend: '+12%',
        isPositive: true,
        icon: FileText,
        color: 'text-blue-600',
        bg: 'bg-blue-50',
    },
    {
        title: 'Total Kunjungan',
        value: '24.5K',
        trend: '+18%',
        isPositive: true,
        icon: Eye,
        color: 'text-emerald-600',
        bg: 'bg-emerald-50',
    },
    {
        title: 'Pengguna Aktif',
        value: '840',
        trend: '-2%',
        isPositive: false,
        icon: Users,
        color: 'text-indigo-600',
        bg: 'bg-indigo-50',
    },
    {
        title: 'Menunggu Review',
        value: '12',
        trend: 'Perlu dicek',
        isPositive: true,
        icon: Clock,
        color: 'text-amber-600',
        bg: 'bg-amber-50',
    },
]

// Data Dummy untuk Aktivitas Terakhir
const recentActivities = [
    {
        id: 1,
        user: 'Arya Putra',
        role: 'Sekretaris',
        action: 'mengunggah dokumen baru',
        target: 'Proposal VIBRANUM 2026',
        time: '10 menit yang lalu',
        avatar: 'AP'
    },
    {
        id: 2,
        user: 'Nadia Salsabila',
        role: 'Jurnalis',
        action: 'menerbitkan artikel',
        target: 'Tech Talk: Masa Depan AI',
        time: '1 jam yang lalu',
        avatar: 'NS'
    },
    {
        id: 3,
        user: 'Budi Santoso',
        role: 'Bendum',
        action: 'memperbarui laporan',
        target: 'Keuangan Bulan Oktober',
        time: '3 jam yang lalu',
        avatar: 'BS'
    },
    {
        id: 4,
        user: 'Sistem',
        role: 'Auto-Backup',
        action: 'menyelesaikan',
        target: 'Pencadangan Database Mingguan',
        time: 'Kemarin, 23:00',
        avatar: 'SI'
    },
]

export default function AdminDashboardPage() {
    return (
        <div className="animate-in fade-in duration-500">
            {/* Header Dashboard */}
            <div className="mb-8">
                <h1 className="text-3xl font-black text-slate-900">Dashboard Overview</h1>
                <p className="mt-1 text-sm text-slate-500">Ringkasan statistik dan aktivitas sistem HIMATIFA hari ini.</p>
            </div>

            {/* Area Card Statistik */}
            <div className="mb-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, index) => {
                    const Icon = stat.icon
                    return (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
                        >
                            <div className="flex items-center justify-between">
                                <div className={`grid size-12 place-items-center rounded-xl ${stat.bg} ${stat.color}`}>
                                    <Icon className="size-6" />
                                </div>
                                <div className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${stat.isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                    {stat.isPositive && stat.trend !== 'Perlu dicek' ? <ArrowUpRight className="size-3" /> : null}
                                    {!stat.isPositive ? <ArrowDownRight className="size-3" /> : null}
                                    {stat.trend}
                                </div>
                            </div>
                            <div className="mt-4">
                                <p className="text-sm font-semibold text-slate-500">{stat.title}</p>
                                <p className="mt-1 text-3xl font-black text-slate-900">{stat.value}</p>
                            </div>
                        </motion.div>
                    )
                })}
            </div>

            {/* Area Bawah: Aktivitas & Diskusi */}
            <div className="grid gap-6 lg:grid-cols-3">

                {/* Aktivitas Terakhir (Mengambil 2 Kolom) */}
                <div className="col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-4">
                        <div className="flex items-center gap-3">
                            <div className="grid size-10 place-items-center rounded-lg bg-blue-50 text-blue-600">
                                <Activity className="size-5" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">Aktivitas Terakhir</h3>
                                <p className="text-xs text-slate-500">Log aktivitas pengguna dalam 24 jam terakhir</p>
                            </div>
                        </div>
                        <button className="text-xs font-bold text-blue-600 hover:text-blue-700">Lihat Semua</button>
                    </div>

                    <div className="space-y-6">
                        {recentActivities.map((activity) => (
                            <div key={activity.id} className="flex items-start gap-4">
                                <div className="grid size-10 shrink-0 place-items-center rounded-full bg-slate-100 text-sm font-black text-slate-600">
                                    {activity.avatar}
                                </div>
                                <div className="flex-1 space-y-1">
                                    <p className="text-sm text-slate-700">
                                        <span className="font-bold text-slate-900">{activity.user}</span>{' '}
                                        {activity.action}{' '}
                                        <span className="font-semibold text-blue-600">{activity.target}</span>
                                    </p>
                                    <div className="flex items-center gap-2 text-xs text-slate-400">
                                        <span>{activity.role}</span>
                                        <span>•</span>
                                        <span>{activity.time}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Info Singkat / Tugas Samping (1 Kolom) */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="mb-6 flex items-center gap-3 border-b border-slate-100 pb-4">
                        <div className="grid size-10 place-items-center rounded-lg bg-amber-50 text-amber-600">
                            <MessageSquare className="size-5" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">Diskusi Terbaru</h3>
                            <p className="text-xs text-slate-500">Komentar pada artikel</p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                            <p className="text-xs font-bold text-slate-900">Bima - <span className="font-normal text-slate-500">Pada artikel "Tech Talk AI"</span></p>
                            <p className="mt-2 text-sm text-slate-600">"Wah materinya sangat insightfull, ditunggu event selanjutnya kak!"</p>
                            <div className="mt-3 flex gap-2">
                                <button className="rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors">Balas</button>
                                <button className="rounded-lg px-3 py-1.5 text-xs font-bold text-slate-400 hover:text-red-600 transition-colors">Hapus</button>
                            </div>
                        </div>

                        <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                            <p className="text-xs font-bold text-slate-900">Rina - <span className="font-normal text-slate-500">Pada artikel "Open Recruitment"</span></p>
                            <p className="mt-2 text-sm text-slate-600">"Untuk formulir pendaftarannya bisa diakses dimana ya?"</p>
                            <div className="mt-3 flex gap-2">
                                <button className="rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors">Balas</button>
                                <button className="rounded-lg px-3 py-1.5 text-xs font-bold text-slate-400 hover:text-red-600 transition-colors">Hapus</button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}
