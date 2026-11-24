'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
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
    UserCheck,
    Search,
    X,
    Check,
    HelpCircle,
    ChevronRight,
    Sparkles,
    Clock,
    FileBadge,
    ExternalLink
} from 'lucide-react'

// Steppers alur pengajuan
const academicWorkflows = [
    {
        id: 'kp',
        title: 'Alur Kerja Praktik (KP)',
        subtitle: 'Tahapan pengajuan hingga seminar KP untuk semester 6/7',
        steps: [
            {
                step: '01',
                title: 'Verifikasi Syarat SKS',
                desc: 'Minimal menempuh 90 SKS dan telah lulus mata kuliah prasyarat dengan nilai memadai.'
            },
            {
                step: '02',
                title: 'Surat Pengantar & Instansi',
                desc: 'Mengajukan permohonan surat pengantar KP dari fakultas ke perusahaan/instansi tujuan.'
            },
            {
                step: '03',
                title: 'Pelaksanaan & Logbook',
                desc: 'Menjalani magang 1-3 bulan dengan mengisi logbook kegiatan yang diverifikasi mentor.'
            },
            {
                step: '04',
                title: 'Laporan & Seminar KP',
                desc: 'Menyusun laporan akhir sesuai pedoman dan melaksanakan seminar presentasi hasil.'
            }
        ]
    },
    {
        id: 'ta',
        title: 'Alur Tugas Akhir (Skripsi)',
        subtitle: 'Panduan proposal, bimbingan, hingga pendadaran kelulusan',
        steps: [
            {
                step: '01',
                title: 'Pengajuan Topik & Proposal',
                desc: 'Konsultasi ide penelitian dengan calon dosen pembimbing dan submit form pengajuan judul.'
            },
            {
                step: '02',
                title: 'Seminar Proposal (Sempro)',
                desc: 'Mempresentasikan rancangan penelitian bab 1-3 di hadapan dewan dosen penguji.'
            },
            {
                step: '03',
                title: 'Riset & Bimbingan Intensif',
                desc: 'Implementasi sistem/penelitian dengan minimal 8 kali catatan kartu bimbingan resmi.'
            },
            {
                step: '04',
                title: 'Sidang Pendadaran & Yudisium',
                desc: 'Ujian komprehensif skripsi, revisi akhir, penyerahan naskah, dan verifikasi yudisium.'
            }
        ]
    }
]

const categories = [
    { id: 'all', label: 'Semua Layanan' },
    { id: 'krs', label: 'KRS & Jadwal' },
    { id: 'kp', label: 'Kerja Praktik' },
    { id: 'ta', label: 'Tugas Akhir / Skripsi' },
    { id: 'surat', label: 'Surat & Berkas' }
]

export default function AkademikPage() {
    const [searchQuery, setSearchQuery] = useState('')
    const [activeCategory, setActiveCategory] = useState('all')
    const [copiedUrl, setCopiedUrl] = useState<string | null>(null)
    const [activeWorkflow, setActiveWorkflow] = useState<'kp' | 'ta'>('kp')

    const handleCopy = (text: string, e: React.MouseEvent) => {
        e.preventDefault()
        navigator.clipboard.writeText(text)
        setCopiedUrl(text)
        setTimeout(() => setCopiedUrl(null), 2000)
    }

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

    const filteredServices = useMemo(() => {
        return academicServices.filter((service) => {
            // Category filter
            if (activeCategory === 'krs' && service.iconType !== 'calendar') return false
            if (activeCategory === 'kp' && service.iconType !== 'briefcase') return false
            if (activeCategory === 'ta' && service.iconType !== 'graduation') return false
            if (activeCategory === 'surat' && service.iconType !== 'fileText') return false

            // Search query filter
            if (!searchQuery.trim()) return true
            const query = searchQuery.toLowerCase()
            const matchTitle = service.title.toLowerCase().includes(query)
            const matchDesc = service.description.toLowerCase().includes(query)
            const matchLinks = service.links.some((l) => l.label.toLowerCase().includes(query))
            const matchContacts = service.contacts?.some((c) => c.name.toLowerCase().includes(query))

            return matchTitle || matchDesc || matchLinks || matchContacts
        })
    }, [searchQuery, activeCategory])

    const currentWorkflowData = academicWorkflows.find((w) => w.id === activeWorkflow) || academicWorkflows[0]

    return (
        <main className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased relative overflow-hidden">
            {/* Background Decor: Clean Grid Pattern with subtle opacity */}
            <div className="absolute inset-0 -z-10 feed-grid-squares opacity-40 pointer-events-none" />

            {/* Ambient subtle glow orbs */}
            <div className="absolute top-16 left-1/4 -z-10 size-[420px] rounded-full bg-blue-400/10 blur-[120px] pointer-events-none" />
            <div className="absolute top-96 right-10 -z-10 size-[360px] rounded-full bg-indigo-400/10 blur-[130px] pointer-events-none" />

            <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
                {/* Back Link */}
                <motion.div
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white/90 px-3.5 py-2 text-xs font-semibold text-slate-600 shadow-xs backdrop-blur-xs transition hover:border-slate-300 hover:bg-white hover:text-slate-900 active:scale-[0.98]"
                    >
                        <ArrowLeft className="size-3.5" />
                        <span>Kembali ke Beranda</span>
                    </Link>
                </motion.div>

                {/* Hero Header */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.05 }}
                    className="mt-8 mb-8 max-w-3xl"
                >
                    <div className="flex items-center gap-3 mb-3">
                        <div className="h-[1px] w-6 sm:w-12 bg-blue-600/40" />
                        <span className="text-[10px] sm:text-xs font-bold tracking-[0.25em] uppercase text-blue-600">
                            Pusat Layanan & Dokumen Resmi
                        </span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
                        Layanan <span className="text-blue-600">Akademik</span>
                    </h1>
                    <p className="mt-3 text-sm sm:text-base leading-relaxed text-slate-600 font-normal">
                        Akses mandiri dokumen kurikulum, formulir Kerja Praktik, template proposal skripsi, serta kalender akademik resmi S1 Informatika UMSURA.
                    </p>
                </motion.div>

                {/* Search & Category Filter Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="mb-8 flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white/90 p-3 sm:p-4 shadow-xs backdrop-blur-sm"
                >
                    <div className="relative">
                        <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Cari dokumen, panduan KP, template proposal, atau koordinator..."
                            className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 pl-10 pr-9 text-xs sm:text-sm font-medium text-slate-900 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/10 placeholder:text-slate-400"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-700"
                            >
                                <X className="size-3.5" />
                            </button>
                        )}
                    </div>

                    {/* Category Filter Pills */}
                    <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100">
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id)}
                                className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
                                    activeCategory === cat.id
                                        ? 'bg-blue-600 text-white shadow-xs'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
                                }`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* Copied Notification Toast */}
                <AnimatePresence>
                    {copiedUrl && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="fixed top-6 right-6 z-50 flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white shadow-lg"
                        >
                            <Check className="size-4 text-emerald-400" />
                            <span>Tautan berhasil disalin ke clipboard!</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Academic Cards Grid */}
                {filteredServices.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white/60 p-12 text-center backdrop-blur-xs">
                        <div className="grid size-12 place-items-center rounded-xl bg-slate-100 text-slate-400 mb-3">
                            <Search className="size-6" />
                        </div>
                        <h3 className="text-base font-bold text-slate-800">Dokumen Tidak Ditemukan</h3>
                        <p className="mt-1 text-xs text-slate-500 max-w-sm">
                            Tidak ada dokumen yang sesuai dengan kata kunci &quot;{searchQuery}&quot;. Silakan coba kata kunci lain.
                        </p>
                        <button
                            onClick={() => {
                                setSearchQuery('')
                                setActiveCategory('all')
                            }}
                            className="mt-4 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-blue-600 hover:bg-slate-50 transition"
                        >
                            Reset Pencarian
                        </button>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2">
                        {filteredServices.map((card, idx) => {
                            const Icon = getCardIcon(card.iconType)

                            return (
                                <motion.div
                                    key={card.id}
                                    initial={{ opacity: 0, y: 16 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.35, delay: idx * 0.06 }}
                                    className={`group relative flex flex-col justify-between rounded-2xl border p-6 transition-all duration-200 ${
                                        card.isHighlight
                                            ? 'border-blue-300 bg-white shadow-md ring-1 ring-blue-500/10'
                                            : 'border-slate-200/90 bg-white/95 shadow-xs hover:border-blue-200 hover:shadow-sm'
                                    }`}
                                >
                                    <div>
                                        <div className="flex items-center justify-between mb-4">
                                            <div className={`grid size-11 place-items-center rounded-xl ${card.iconBg}`}>
                                                <Icon className="size-5.5" />
                                            </div>
                                            {card.isHighlight ? (
                                                <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 border border-blue-200 px-2.5 py-0.5 text-[10px] font-extrabold text-blue-700 uppercase tracking-wider">
                                                    <Sparkles className="size-3 text-blue-600" />
                                                    Prioritas Semester
                                                </span>
                                            ) : (
                                                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-semibold text-slate-500">
                                                    Tersedia Online
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
                                                <div
                                                    key={link.label}
                                                    className="group/link flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 text-xs font-semibold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50/60 hover:text-blue-700"
                                                >
                                                    <div className="flex items-center gap-2">
                                                        {link.isCheck ? (
                                                            <FileCheck2 className="size-4 text-blue-600" />
                                                        ) : link.isDownload ? (
                                                            <Download className="size-4 text-slate-400 group-hover/link:text-blue-600" />
                                                        ) : (
                                                            <Link2 className="size-4 text-slate-400 group-hover/link:text-blue-600" />
                                                        )}
                                                        <span>{link.label}</span>
                                                    </div>

                                                    <div className="flex items-center gap-1.5">
                                                        <button
                                                            onClick={(e) => handleCopy(window.location.origin + link.href, e)}
                                                            title="Salin tautan dokumen"
                                                            className="rounded-lg p-1 text-slate-400 hover:bg-white hover:text-slate-700 transition"
                                                        >
                                                            <Link2 className="size-3.5" />
                                                        </button>
                                                        <a
                                                            href={link.href}
                                                            className="rounded-lg bg-white border border-slate-200 px-2 py-1 text-[11px] font-bold text-blue-600 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition"
                                                        >
                                                            Akses
                                                        </a>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {card.contacts && (
                                            <div className="mt-3 rounded-xl border border-blue-100 bg-blue-50/50 p-3.5 text-xs">
                                                <div className="flex items-center gap-1.5 font-bold text-blue-900 mb-2">
                                                    <UserCheck className="size-3.5 text-blue-600" />
                                                    <span>Koordinator & Konsultasi Resmi:</span>
                                                </div>
                                                <ul className="space-y-1.5 text-slate-600 font-medium">
                                                    {card.contacts.map((contact) => (
                                                        <li key={contact.name} className="flex items-center justify-between text-[11px]">
                                                            <span className="font-bold text-slate-800">{contact.name}</span>
                                                            <span className="text-slate-500 font-normal">({contact.role})</span>
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
                )}

                {/* Interactive Alur Pengajuan (KP vs Skripsi) */}
                <motion.section
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4 }}
                    className="mt-14 rounded-2xl border border-slate-200/90 bg-white/95 p-6 sm:p-8 shadow-xs"
                >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-100">
                        <div>
                            <div className="flex items-center gap-2 text-blue-600 text-xs font-bold uppercase tracking-wider mb-1">
                                <Clock className="size-3.5" />
                                <span>Panduan Langkah Bertahap</span>
                            </div>
                            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                                Alur Resmi Pelaksanaan Akademik
                            </h2>
                            <p className="mt-1 text-xs text-slate-500">
                                Ikuti tahapan resmi agar proses administrasi Anda berjalan lancar tanpa hambatan.
                            </p>
                        </div>

                        {/* Workflow Toggle Buttons */}
                        <div className="inline-flex rounded-xl border border-slate-200 bg-slate-50 p-1">
                            <button
                                onClick={() => setActiveWorkflow('kp')}
                                className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition cursor-pointer ${
                                    activeWorkflow === 'kp'
                                        ? 'bg-white text-blue-600 shadow-xs'
                                        : 'text-slate-600 hover:text-slate-900'
                                }`}
                            >
                                Kerja Praktik (KP)
                            </button>
                            <button
                                onClick={() => setActiveWorkflow('ta')}
                                className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition cursor-pointer ${
                                    activeWorkflow === 'ta'
                                        ? 'bg-white text-blue-600 shadow-xs'
                                        : 'text-slate-600 hover:text-slate-900'
                                }`}
                            >
                                Tugas Akhir (TA)
                            </button>
                        </div>
                    </div>

                    {/* Step Cards */}
                    <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {currentWorkflowData.steps.map((st) => (
                            <div
                                key={st.step}
                                className="relative flex flex-col justify-between rounded-xl border border-slate-100 bg-slate-50/60 p-4 transition hover:border-blue-200 hover:bg-blue-50/30"
                            >
                                <div>
                                    <span className="font-mono text-xs font-extrabold text-blue-600 bg-blue-100/70 px-2 py-0.5 rounded-md">
                                        Langkah {st.step}
                                    </span>
                                    <h4 className="mt-3 text-sm font-bold text-slate-900">
                                        {st.title}
                                    </h4>
                                    <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                                        {st.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.section>

                {/* Quick Help & FAQ Callout */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4 }}
                    className="mt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50/80 via-white to-blue-50/60 p-5 sm:p-6 shadow-xs"
                >
                    <div className="flex items-start gap-3.5">
                        <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-blue-600 text-white">
                            <HelpCircle className="size-5" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-slate-900">
                                Mengalami Kendala Berkas atau Validasi Nilai?
                            </h3>
                            <p className="mt-0.5 text-xs text-slate-600">
                                Anda dapat berkonsultasi langsung ke Seksi Akademik Prodi Informatika atau menyampaikan masukan via portal suara mahasiswa.
                            </p>
                        </div>
                    </div>
                    <Link
                        href="/aspirasi"
                        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-xs transition hover:bg-blue-500 active:scale-[0.98]"
                    >
                        <span>Sampaikan via Aspirasi</span>
                        <ChevronRight className="size-3.5" />
                    </Link>
                </motion.div>

                {/* Footer */}
                <motion.footer
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
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
