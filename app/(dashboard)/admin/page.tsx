'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
    dashboardStats as initialStats,
    recentActivities as initialActivities,
    recentDiscussions as initialDiscussions,
    type DashboardStat,
    type ActivityItem,
    type DiscussionItem
} from '@/app/data'
import {
    Users,
    FileText,
    Eye,
    Clock,
    ArrowUpRight,
    ArrowDownRight,
    MessageSquare,
    Activity,
    Plus,
    ChevronRight,
    Sparkles,
    ShieldCheck,
    CheckCircle2
} from 'lucide-react'

export default function AdminDashboardPage() {
    const [stats] = useState<DashboardStat[]>(initialStats)
    const [activities] = useState<ActivityItem[]>(initialActivities)
    const [discussions, setDiscussions] = useState<DiscussionItem[]>(initialDiscussions)

    const handleDeleteDiscussion = (id: number) => {
        setDiscussions((prev) => prev.filter((d) => d.id !== id))
    }

    const getStatIcon = (index: number) => {
        switch (index) {
            case 0:
                return { icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-100' }
            case 1:
                return { icon: Eye, color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-100' }
            case 2:
                return { icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50 border-indigo-100' }
            default:
                return { icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-100' }
        }
    }

    return (
        <div className="space-y-6">
            {/* Header */}
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
                        Pantau indikator kinerja utama, statistik pengunjung, serta aktivitas terbaru pengurus.
                    </p>
                </div>

                <div className="flex items-center gap-2.5">
                    <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-blue-600/10 transition hover:bg-blue-500 active:scale-[0.98]">
                        <Plus className="size-4" />
                        <span>Buat Agenda Baru</span>
                    </button>
                </div>
            </div>

            {/* Metric Cards Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, index) => {
                    const iconConfig = getStatIcon(index)
                    const Icon = iconConfig.icon

                    return (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.08, duration: 0.3 }}
                            className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition hover:border-slate-300"
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                    {stat.title}
                                </span>
                                <div
                                    className={`grid size-9 place-items-center rounded-xl border ${iconConfig.bg} ${iconConfig.color}`}
                                >
                                    <Icon className="size-4.5" />
                                </div>
                            </div>

                            <div className="mt-4 flex items-baseline justify-between">
                                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                                    {stat.value}
                                </h2>
                                <span
                                    className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[11px] font-extrabold ${
                                        stat.isPositive
                                            ? 'bg-emerald-50 text-emerald-700'
                                            : 'bg-amber-50 text-amber-700'
                                    }`}
                                >
                                    {stat.isPositive ? (
                                        <ArrowUpRight className="size-3" />
                                    ) : (
                                        <ArrowDownRight className="size-3" />
                                    )}
                                    {stat.trend}
                                </span>
                            </div>
                            <p className="mt-1 text-[11px] font-medium text-slate-400">{stat.subtext}</p>
                        </motion.div>
                    )
                })}
            </div>

            {/* Main Section Grid */}
            <div className="grid gap-6 lg:grid-cols-12">
                {/* Left Column: Recent Activity Log (8 cols) */}
                <div className="lg:col-span-8 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs">
                    <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-4">
                        <div className="flex items-center gap-3">
                            <div className="grid size-9 place-items-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
                                <Activity className="size-4.5" />
                            </div>
                            <div>
                                <h2 className="text-base font-bold text-slate-900">Aktivitas Terakhir Pengurus</h2>
                                <p className="text-xs text-slate-500">Log operasional dan publikasi dalam 24 jam terakhir.</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-5">
                        {activities.map((activity) => (
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
                </div>

                {/* Right Column: Discussions & System Health (4 cols) */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                    {/* Diskusi & Komentar */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs">
                        <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-4">
                            <div className="flex items-center gap-3">
                                <div className="grid size-9 place-items-center rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
                                    <MessageSquare className="size-4.5" />
                                </div>
                                <div>
                                    <h2 className="text-base font-bold text-slate-900">Aspirasi & Diskusi</h2>
                                    <p className="text-xs text-slate-500">Ulasan publik terbaru.</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            {discussions.length > 0 ? (
                                discussions.map((item) => (
                                    <div
                                        key={item.id}
                                        className="rounded-xl border border-slate-100 bg-slate-50/70 p-3.5 space-y-2"
                                    >
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="font-bold text-slate-900">{item.author}</span>
                                            <span className="text-[10px] text-slate-400">{item.time}</span>
                                        </div>
                                        <p className="text-xs text-slate-600 leading-relaxed italic">
                                            "{item.content}"
                                        </p>
                                        <div className="flex items-center justify-between pt-1 text-[11px]">
                                            <span className="font-semibold text-slate-400 truncate max-w-[140px]">
                                                {item.targetTitle}
                                            </span>
                                            <div className="flex items-center gap-2">
                                                <button className="font-semibold text-blue-600 hover:text-blue-700">
                                                    Balas
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteDiscussion(item.id)}
                                                    className="font-semibold text-slate-400 hover:text-red-600"
                                                >
                                                    Hapus
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-xs text-slate-400 text-center py-4">
                                    Belum ada diskusi baru hari ini.
                                </p>
                            )}
                        </div>
                    </div>

                    {/* System Status Card */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                        <div className="flex items-center gap-3">
                            <div className="grid size-9 place-items-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                                <ShieldCheck className="size-4.5" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-900">Status Sistem SIM</p>
                                <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                                    <CheckCircle2 className="size-3" /> Semua Layanan Normal
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}