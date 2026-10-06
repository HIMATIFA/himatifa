'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
    ArrowLeft,
    BookOpen,
    Briefcase,
    CalendarDays,
    Download,
    FileCheck2,
    FileText,
    GraduationCap,
    Link2,
    Copyright,
    UserCheck
} from 'lucide-react'

export default function AkademikPage() {
    const cards = [
        {
            title: 'KRS & Perkuliahan',
            description: 'Informasi jadwal kuliah, panduan pengisian Kartu Rencana Studi (KRS), dan kalender akademik semester berjalan.',
            icon: CalendarDays,
            iconBg: 'bg-blue-100 text-blue-600',
            hoverBorder: 'hover:border-blue-500 hover:text-blue-600',
            links: [
                { label: 'Kalender Akademik 2026/2027', href: '#', isDownload: true },
                { label: 'SOP Pengisian KRS Online', href: '#', isDownload: false }
            ]
        },
        {
            title: 'Kerja Praktik & Magang',
            description: 'Panduan pelaksanaan magang, syarat penyusunan laporan, dan kebijakan konversi SKS untuk kegiatan magang mandiri saat libur semester.',
            icon: Briefcase,
            iconBg: 'bg-blue-600 text-white shadow-md shadow-blue-500/20',
            isHighlight: true,
            links: [
                { label: 'Panduan Konversi Magang Mandiri', href: '#', isCheck: true },
                { label: 'Form Pengajuan Kerja Praktik', href: '#', isDownload: true }
            ],
            contacts: [
                { name: 'Bu Tining', role: 'Administrasi & Persetujuan' },
                { name: 'Pak Ashr', role: 'Konversi SKS & Kurikulum' }
            ]
        },
        {
            title: 'Tugas Akhir / Skripsi',
            description: 'Prosedur pendaftaran proposal, format penulisan skripsi terbaru, dan alur pendaftaran sidang pendadaran.',
            icon: GraduationCap,
            iconBg: 'bg-indigo-100 text-indigo-600',
            hoverBorder: 'hover:border-indigo-500 hover:text-indigo-600',
            links: [
                { label: 'Template Penulisan Proposal', href: '#', isDownload: true },
                { label: 'Alur Pendaftaran Sidang', href: '#', isDownload: false }
            ]
        },
        {
            title: 'Administrasi Surat',
            description: 'Layanan pengajuan surat pengantar observasi, surat izin penelitian, dan dokumen kebutuhan akademik lainnya.',
            icon: FileText,
            iconBg: 'bg-emerald-100 text-emerald-600',
            hoverBorder: 'hover:border-emerald-500 hover:text-emerald-600',
            links: [
                { label: 'Form Surat Pengantar Observasi', href: '#', isDownload: false },
                { label: 'Form Surat Izin Penelitian', href: '#', isDownload: false }
            ]
        }
    ]

    return (
        <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 sm:px-6 lg:px-10 lg:py-12 font-sans selection:bg-blue-500 selection:text-white relative overflow-hidden">
            <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                <div className="absolute -left-32 -top-32 size-[500px] rounded-full bg-blue-400/20 blur-[140px]" />
                <div className="absolute right-0 top-1/4 size-[600px] rounded-full bg-cyan-400/15 blur-[160px]" />
                <div className="absolute bottom-10 left-1/3 size-[400px] rounded-full bg-indigo-400/15 blur-[130px]" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-60" />
            </div>

            <div className="mx-auto max-w-6xl relative z-10">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
                    <Link
                        href="/"
                        className="group inline-flex items-center gap-2.5 text-sm font-bold text-slate-500 transition hover:text-blue-600"
                    >
                        <div className="flex size-8 items-center justify-center rounded-xl bg-white border border-slate-200 group-hover:bg-blue-50 group-hover:border-blue-200 transition">
                            <ArrowLeft className="size-4" />
                        </div>
                        Kembali ke Beranda
                    </Link>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="mt-8 mb-14"
                >
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-200/80 bg-blue-50/80 px-4 py-1.5 backdrop-blur-md shadow-sm">
                        <BookOpen className="size-3.5 text-blue-600" />
                        <span className="text-xs font-extrabold uppercase tracking-wider text-blue-600">Pusat Informasi</span>
                    </div>
                    <h1 className="text-4xl font-black tracking-tight text-slate-900 sm:text-6xl">
                        Layanan <br />
                        <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 bg-clip-text text-transparent">
              Akademik.
            </span>
                    </h1>
                    <p className="mt-5 max-w-xl text-sm leading-relaxed text-slate-500 sm:text-base font-medium">
                        Akses cepat untuk panduan perkuliahan, administrasi Kerja Praktik, syarat Tugas Akhir, hingga kalender akademik S1 Informatika UMSURA.
                    </p>
                </motion.div>

                <div className="grid gap-6 md:grid-cols-2">
                    {cards.map((card, idx) => {
                        const Icon = card.icon

                        return (
                            <motion.div
                                key={card.title}
                                initial={{ opacity: 0, y: 24 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.15 + idx * 0.1 }}
                                whileHover={{ y: -4 }}
                                className={`group relative overflow-hidden rounded-[2.5rem] p-6 sm:p-8 backdrop-blur-xl transition-all duration-300 ${
                                    card.isHighlight
                                        ? 'border border-blue-200/80 bg-gradient-to-br from-blue-50/80 via-white/80 to-indigo-50/60 shadow-xl shadow-blue-900/5'
                                        : 'border border-white/80 bg-white/70 shadow-xl shadow-blue-900/5 hover:bg-white/90'
                                }`}
                            >
                                {card.isHighlight && (
                                    <div className="absolute -right-10 -top-10 size-44 rounded-full bg-blue-400/20 blur-2xl pointer-events-none" />
                                )}

                                <div className="relative z-10 flex flex-col h-full justify-between">
                                    <div>
                                        <div className={`mb-6 grid size-14 place-items-center rounded-2xl ${card.iconBg}`}>
                                            <Icon className="size-7" />
                                        </div>
                                        <h2 className="text-xl font-black text-slate-900">{card.title}</h2>
                                        <p className="mt-2 text-sm leading-relaxed text-slate-500 font-medium">
                                            {card.description}
                                        </p>
                                    </div>

                                    <div className="mt-6 space-y-3">
                                        <div className="flex flex-col gap-2.5">
                                            {card.links.map((link) => (
                                                <a
                                                    key={link.label}
                                                    href={link.href}
                                                    className={`flex items-center justify-between rounded-xl border px-4 py-3 text-sm font-bold transition ${
                                                        link.isCheck
                                                            ? 'border-blue-100 bg-white text-slate-900 shadow-sm hover:border-blue-300 hover:text-blue-600'
                                                            : `border-slate-100 bg-white/60 text-slate-600 shadow-sm ${card.hoverBorder || 'hover:border-blue-500 hover:text-blue-600'}`
                                                    }`}
                                                >
                                                    <span>{link.label}</span>
                                                    {link.isCheck ? (
                                                        <FileCheck2 className="size-4 text-blue-600" />
                                                    ) : link.isDownload ? (
                                                        <Download className="size-4 transition-transform group-hover:translate-y-0.5" />
                                                    ) : (
                                                        <Link2 className="size-4" />
                                                    )}
                                                </a>
                                            ))}
                                        </div>

                                        {card.contacts && (
                                            <div className="mt-4 rounded-2xl border border-blue-100/80 bg-white/80 p-4 text-xs shadow-sm">
                                                <div className="flex items-center gap-1.5 font-extrabold text-slate-700 mb-2">
                                                    <UserCheck className="size-4 text-blue-600" />
                                                    <span>Koordinator & Konsultasi KP:</span>
                                                </div>
                                                <ul className="space-y-1.5 text-slate-500 font-medium pl-1">
                                                    {card.contacts.map((contact) => (
                                                        <li key={contact.name} className="flex items-center justify-between">
                                                            <span className="font-bold text-slate-700">{contact.name}</span>
                                                            <span className="text-[11px] text-slate-400">({contact.role})</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        )
                    })}
                </div>

                <motion.footer
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="mt-16 flex flex-col items-center justify-between gap-3 border-t border-slate-200/60 pb-4 pt-8 sm:flex-row"
                >
                    <p className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
                        <Copyright className="size-3.5" /> 2026 HIMATIFA UMSURA
                    </p>
                    <p className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
                        Created by MEDKOMINFO
                    </p>
                </motion.footer>
            </div>
        </main>
    )
}