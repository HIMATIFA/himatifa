'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { academicServices, type AcademicServiceItem } from '@/app/data'
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
    const getCardIcon = (iconType: AcademicServiceItem['iconType']) => {
        switch (iconType) {
            case 'calendar':
                return CalendarDays
            case 'briefcase':
                return Briefcase
            case 'graduation':
                return GraduationCap
            case 'fileText':
                return FileText
            default:
                return BookOpen
        }
    }

    return (
        <main className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased relative overflow-hidden">
            <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] opacity-40" />

            <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
                <motion.div
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-600 shadow-xs transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 active:scale-[0.98]"
                    >
                        <ArrowLeft className="size-3.5" />
                        <span>Kembali ke Beranda</span>
                    </Link>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="mt-8 mb-10 sm:mb-14 max-w-3xl"
                >
                    <div className="flex items-center gap-3 mb-3">
                        <div className="h-[1px] w-6 sm:w-12 bg-blue-600/30" />
                        <span className="text-[10px] sm:text-xs font-bold tracking-[0.25em] uppercase text-blue-600">
                            Pusat Layanan & Informasi
                        </span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
                        Layanan <span className="text-blue-600">Akademik</span>
                    </h1>
                    <p className="mt-3 text-sm sm:text-base leading-relaxed text-slate-600 font-normal">
                        Akses cepat dan terpadu untuk panduan perkuliahan, administrasi Kerja Praktik, syarat Tugas Akhir, hingga kalender akademik S1 Informatika UMSURA.
                    </p>
                </motion.div>

                <div className="grid gap-6 md:grid-cols-2">
                    {academicServices.map((card, idx) => {
                        const Icon = getCardIcon(card.iconType)

                        return (
                            <motion.div
                                key={card.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: 0.15 + idx * 0.08 }}
                                className={`group relative flex flex-col justify-between rounded-2xl border p-6 transition-all duration-200 ${
                                    card.isHighlight
                                        ? 'border-blue-300 bg-white shadow-md ring-1 ring-blue-500/10'
                                        : 'border-slate-200 bg-white shadow-xs hover:border-slate-300 hover:shadow-sm'
                                }`}
                            >
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <div className={`grid size-11 place-items-center rounded-xl ${card.iconBg}`}>
                                            <Icon className="size-5.5" />
                                        </div>
                                        {card.isHighlight && (
                                            <span className="rounded-full bg-blue-50 border border-blue-200 px-2.5 py-0.5 text-[10px] font-extrabold text-blue-700 uppercase tracking-wider">
                                                Prioritas
                                            </span>
                                        )}
                                    </div>

                                    <h2 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                        {card.title}
                                    </h2>
                                    <p className="mt-1.5 text-xs font-medium leading-relaxed text-slate-500">
                                        {card.description}
                                    </p>
                                </div>

                                <div className="mt-6 space-y-3 pt-4 border-t border-slate-100">
                                    <div className="flex flex-col gap-2">
                                        {card.links.map((link) => (
                                            <a
                                                key={link.label}
                                                href={link.href}
                                                className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-xs font-semibold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50/50 hover:text-blue-700 active:scale-[0.99]"
                                            >
                                                <span>{link.label}</span>
                                                {link.isCheck ? (
                                                    <FileCheck2 className="size-4 text-blue-600" />
                                                ) : link.isDownload ? (
                                                    <Download className="size-4 text-slate-400 group-hover:text-blue-600" />
                                                ) : (
                                                    <Link2 className="size-4 text-slate-400" />
                                                )}
                                            </a>
                                        ))}
                                    </div>

                                    {card.contacts && (
                                        <div className="mt-3 rounded-xl border border-blue-100 bg-blue-50/50 p-3.5 text-xs">
                                            <div className="flex items-center gap-1.5 font-bold text-blue-900 mb-2">
                                                <UserCheck className="size-3.5 text-blue-600" />
                                                <span>Koordinator & Konsultasi KP:</span>
                                            </div>
                                            <ul className="space-y-1 text-slate-600 font-medium">
                                                {card.contacts.map((contact) => (
                                                    <li key={contact.name} className="flex items-center justify-between text-[11px]">
                                                        <span className="font-bold text-slate-800">{contact.name}</span>
                                                        <span className="text-slate-500">({contact.role})</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )
                    })}
                </div>

                <motion.footer
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mt-16 flex flex-col items-center justify-between gap-3 border-t border-slate-200 pt-6 sm:flex-row text-xs text-slate-400 font-medium"
                >
                    <p className="flex items-center gap-1.5">
                        <Copyright className="size-3.5" /> 2026 HIMATIFA UMSURA
                    </p>
                    <p>Dikembangkan oleh Departemen Medkominfo</p>
                </motion.footer>
            </div>
        </main>
    )
}