'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { aspirasiCategories } from '@/app/data'
import {
    ArrowLeft,
    Send,
    ShieldAlert,
    Copyright,
    CheckCircle2,
    Sparkles,
    User,
    Hash,
    Lightbulb,
    Wrench,
    GraduationCap,
    HeartHandshake,
    Eye,
    Copy,
    Check,
    TrendingUp,
    Clock,
    ShieldCheck
} from 'lucide-react'

// Tipe Masukan / Sentiment
const sentimentOptions = [
    {
        id: 'ide',
        label: 'Ide & Inovasi',
        icon: Lightbulb,
        color: 'text-amber-500 bg-amber-50 border-amber-200'
    },
    {
        id: 'fasilitas',
        label: 'Kendala Fasilitas',
        icon: Wrench,
        color: 'text-rose-500 bg-rose-50 border-rose-200'
    },
    {
        id: 'akademik',
        label: 'Layanan Akademik',
        icon: GraduationCap,
        color: 'text-blue-500 bg-blue-50 border-blue-200'
    },
    {
        id: 'apresiasi',
        label: 'Saran & Apresiasi',
        icon: HeartHandshake,
        color: 'text-emerald-500 bg-emerald-50 border-emerald-200'
    }
]

// Aspirasi terselesaikan sebagai bukti transparansi
const resolvedAspirations = [
    {
        id: 'res-1',
        category: 'Fasilitas & Lab',
        title: 'Penambahan Stopkontak di Meja Lab Pemrograman 3',
        response: 'Telah diajukan ke Bagian Sarpras FT. 12 unit stopkontak tambahan telah dipasang dan aktif digunakan.',
        date: '14 Feb 2026',
        status: 'Tuntas'
    },
    {
        id: 'res-2',
        category: 'Layanan Akademik',
        title: 'Kejelasan Jadwal Pengganti Praktikum Basis Data',
        response: 'Diskusikan bersama Asisten Lab & Dosen Pengampu. Jadwal pengganti fix telah dipublikasikan di portal akademik.',
        date: '02 Feb 2026',
        status: 'Tuntas'
    },
    {
        id: 'res-3',
        category: 'Organisasi HIMATIFA',
        title: 'Permintaan Bootcamp Git & GitHub untuk Maba 2025',
        response: 'Departemen RnD telah menggelar workshop "Hands-on Git Essentials" dengan 60 peserta aktif.',
        date: '18 Jan 2026',
        status: 'Tuntas'
    }
]

export default function AspirasiPage() {
    const [isAnonymous, setIsAnonymous] = useState(false)
    const [selectedSentiment, setSelectedSentiment] = useState('ide')
    const [name, setName] = useState('')
    const [nim, setNim] = useState('')
    const [category, setCategory] = useState(aspirasiCategories[0]?.value || 'akademik')
    const [message, setMessage] = useState('')
    const [showPreview, setShowPreview] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [ticketNumber, setTicketNumber] = useState('')
    const [isCopied, setIsCopied] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (message.trim().length < 15) return

        setIsSubmitting(true)
        setTimeout(() => {
            const randomCode = Math.floor(1000 + Math.random() * 9000)
            setTicketNumber(`ASP-2026-${randomCode}`)
            setIsSubmitting(false)
            setIsSuccess(true)
        }, 1100)
    }

    const handleCopyTicket = () => {
        navigator.clipboard.writeText(ticketNumber)
        setIsCopied(true)
        setTimeout(() => setIsCopied(false), 2000)
    }

    const resetForm = () => {
        setIsSuccess(false)
        setMessage('')
        setName('')
        setNim('')
        setIsAnonymous(false)
        setSelectedSentiment('ide')
        setShowPreview(false)
    }

    return (
        <main className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased relative overflow-hidden">
            {/* Background Grid Decoration */}
            <div className="absolute inset-0 -z-10 feed-grid-squares opacity-40 pointer-events-none" />

            {/* Ambient Subtle Glow */}
            <div className="absolute top-20 right-1/4 -z-10 size-[380px] rounded-full bg-blue-400/10 blur-[130px] pointer-events-none" />
            <div className="absolute bottom-40 left-10 -z-10 size-[360px] rounded-full bg-indigo-400/10 blur-[120px] pointer-events-none" />

            <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
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
                    className="mt-8 mb-8 max-w-2xl"
                >
                    <div className="flex items-center gap-3 mb-3">
                        <div className="h-[1px] w-6 sm:w-12 bg-blue-600/40" />
                        <span className="text-[10px] sm:text-xs font-bold tracking-[0.25em] uppercase text-blue-600">
                            Pusat Aspirasi & Advokasi Mahasiswa
                        </span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
                        Suara <span className="text-blue-600">Mahasiswa</span>
                    </h1>
                    <p className="mt-3 text-sm sm:text-base leading-relaxed text-slate-600 font-normal">
                        Kanal terbuka dan terpercaya bagi seluruh mahasiswa S1 Informatika UMSURA untuk menyuarakan kritik membangun, solusi fasilitas, atau gagasan program kerja.
                    </p>
                </motion.div>

                {/* Impact Stat Counters */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4"
                >
                    <div className="rounded-2xl border border-slate-200/90 bg-white/90 p-4 shadow-xs backdrop-blur-xs">
                        <div className="flex items-center gap-2 text-blue-600 mb-1">
                            <TrendingUp className="size-4" />
                            <span className="text-[11px] font-bold uppercase tracking-wider">Aspirasi Masuk</span>
                        </div>
                        <div className="text-2xl font-extrabold text-slate-900">148+</div>
                        <p className="text-[11px] text-slate-500 font-medium mt-0.5">Sepanjang periode 2025/2026</p>
                    </div>

                    <div className="rounded-2xl border border-slate-200/90 bg-white/90 p-4 shadow-xs backdrop-blur-xs">
                        <div className="flex items-center gap-2 text-emerald-600 mb-1">
                            <ShieldCheck className="size-4" />
                            <span className="text-[11px] font-bold uppercase tracking-wider">Tindak Lanjut</span>
                        </div>
                        <div className="text-2xl font-extrabold text-slate-900">98.4%</div>
                        <p className="text-[11px] text-slate-500 font-medium mt-0.5">Diteruskan & diselesaikan</p>
                    </div>

                    <div className="col-span-2 sm:col-span-1 rounded-2xl border border-slate-200/90 bg-white/90 p-4 shadow-xs backdrop-blur-xs">
                        <div className="flex items-center gap-2 text-indigo-600 mb-1">
                            <Clock className="size-4" />
                            <span className="text-[11px] font-bold uppercase tracking-wider">Waktu Tanggapan</span>
                        </div>
                        <div className="text-2xl font-extrabold text-slate-900">1-2 Hari</div>
                        <p className="text-[11px] text-slate-500 font-medium mt-0.5">Hari kerja departemen advokasi</p>
                    </div>
                </motion.div>

                {/* Main Form Box */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: 0.15 }}
                >
                    <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white/95 p-6 sm:p-8 shadow-xs backdrop-blur-xs">
                        <AnimatePresence mode="wait">
                            {isSuccess ? (
                                <motion.div
                                    key="success"
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.98 }}
                                    className="flex flex-col items-center justify-center py-8 text-center"
                                >
                                    <div className="mb-4 grid size-16 place-items-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200">
                                        <CheckCircle2 className="size-8" />
                                    </div>
                                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                                        Aspirasi Anda Berhasil Terkirim!
                                    </h2>
                                    <p className="mt-2 max-w-md text-xs sm:text-sm font-medium leading-relaxed text-slate-600">
                                        Terima kasih atas kontribusi Anda membangun himpunan dan prodi yang lebih baik. Pengurus Departemen Advokasi akan segera mereview pesan ini.
                                    </p>

                                    {/* Ticket Box */}
                                    <div className="mt-6 flex flex-col items-center rounded-xl border border-slate-200 bg-slate-50 p-4 max-w-sm w-full">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                                            Nomor Tiket Aduan Anda
                                        </span>
                                        <div className="mt-1 flex items-center gap-2">
                                            <span className="font-mono text-base font-extrabold text-blue-600">
                                                {ticketNumber}
                                            </span>
                                            <button
                                                onClick={handleCopyTicket}
                                                className="rounded-lg p-1 text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition"
                                                title="Salin Nomor Tiket"
                                            >
                                                {isCopied ? <Check className="size-4 text-emerald-600" /> : <Copy className="size-4" />}
                                            </button>
                                        </div>
                                        <p className="mt-1 text-[11px] text-slate-400">
                                            Simpan kode ini jika ingin memverifikasi progres dengan pengurus.
                                        </p>
                                    </div>

                                    <button
                                        onClick={resetForm}
                                        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-xs transition hover:bg-blue-500 active:scale-[0.98] cursor-pointer"
                                    >
                                        <Sparkles className="size-4" />
                                        <span>Kirim Aspirasi Lainnya</span>
                                    </button>
                                </motion.div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Sentiment Selector */}
                                    <div>
                                        <label className="mb-2 block text-xs font-bold text-slate-800">
                                            1. Pilih Jenis Masukan
                                        </label>
                                        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                                            {sentimentOptions.map((opt) => {
                                                const Icon = opt.icon
                                                const isSelected = selectedSentiment === opt.id
                                                return (
                                                    <button
                                                        type="button"
                                                        key={opt.id}
                                                        onClick={() => setSelectedSentiment(opt.id)}
                                                        className={`flex flex-col items-center gap-2 rounded-xl border p-3 text-center transition cursor-pointer ${
                                                            isSelected
                                                                ? 'border-blue-600 bg-blue-50/70 text-blue-700 shadow-xs ring-1 ring-blue-600/20'
                                                                : 'border-slate-200 bg-slate-50/50 text-slate-600 hover:border-slate-300 hover:bg-slate-100/60'
                                                        }`}
                                                    >
                                                        <div className={`grid size-8 place-items-center rounded-lg border ${opt.color}`}>
                                                            <Icon className="size-4" />
                                                        </div>
                                                        <span className="text-[11px] font-bold leading-tight">
                                                            {opt.label}
                                                        </span>
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    </div>

                                    {/* Anonymous Switcher */}
                                    <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/70 p-4 transition">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className={`grid size-9 place-items-center rounded-lg border transition-colors ${
                                                    isAnonymous
                                                        ? 'bg-blue-50 text-blue-600 border-blue-200'
                                                        : 'bg-white text-slate-400 border-slate-200'
                                                }`}
                                            >
                                                <ShieldAlert className="size-4.5" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-slate-900">
                                                    Kirim sebagai Anonim
                                                </p>
                                                <p className="mt-0.5 text-[11px] font-medium text-slate-500">
                                                    Identitas pribadi Anda tidak akan dicatat maupun disebarluaskan.
                                                </p>
                                            </div>
                                        </div>

                                        <label className="relative inline-flex cursor-pointer items-center">
                                            <input
                                                type="checkbox"
                                                className="sr-only peer"
                                                checked={isAnonymous}
                                                onChange={() => setIsAnonymous(!isAnonymous)}
                                            />
                                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                        </label>
                                    </div>

                                    {/* Identity Inputs (if not anonymous) */}
                                    <AnimatePresence>
                                        {!isAnonymous && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="grid gap-4 overflow-hidden sm:grid-cols-2 pt-1"
                                            >
                                                <div>
                                                    <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                                                        Nama Lengkap
                                                    </label>
                                                    <div className="relative">
                                                        <User className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                                                        <input
                                                            type="text"
                                                            required={!isAnonymous}
                                                            value={name}
                                                            onChange={(e) => setName(e.target.value)}
                                                            placeholder="Nama mahasiswa..."
                                                            className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 pl-10 pr-4 text-xs font-medium text-slate-900 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/10"
                                                        />
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                                                        NIM (Nomor Induk Mahasiswa)
                                                    </label>
                                                    <div className="relative">
                                                        <Hash className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                                                        <input
                                                            type="text"
                                                            required={!isAnonymous}
                                                            value={nim}
                                                            onChange={(e) => setNim(e.target.value)}
                                                            placeholder="Contoh: 20240140001"
                                                            className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 pl-10 pr-4 text-xs font-medium text-slate-900 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/10"
                                                        />
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* Category Select */}
                                    <div>
                                        <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                                            2. Kategori Aspirasi
                                        </label>
                                        <div className="relative">
                                            <select
                                                value={category}
                                                onChange={(e) => setCategory(e.target.value)}
                                                className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 pl-4 pr-10 text-xs font-medium text-slate-900 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/10 cursor-pointer"
                                            >
                                                {aspirasiCategories.map((cat) => (
                                                    <option key={cat.value} value={cat.value}>
                                                        {cat.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    {/* Message Textarea with Dynamic Char Counter */}
                                    <div>
                                        <div className="flex items-center justify-between mb-1.5">
                                            <label className="text-xs font-semibold text-slate-700">
                                                3. Rincian Masukan & Rekomendasi Solusi
                                            </label>
                                            <span className={`text-[11px] font-mono ${message.length < 15 ? 'text-amber-500' : 'text-slate-400'}`}>
                                                {message.length} / 500 karakter {message.length < 15 && '(min. 15)'}
                                            </span>
                                        </div>
                                        <textarea
                                            required
                                            rows={5}
                                            maxLength={500}
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            placeholder="Deskripsikan saran, kendala teknis fasilitas lab, atau aspirasi perkuliahan secara santun, jelas, dan faktual..."
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 text-xs font-medium text-slate-900 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/10"
                                        />
                                    </div>

                                    {/* Interactive Live Preview Toggle */}
                                    <div>
                                        <button
                                            type="button"
                                            onClick={() => setShowPreview(!showPreview)}
                                            className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
                                        >
                                            <Eye className="size-3.5" />
                                            <span>{showPreview ? 'Sembunyikan Pratinjau' : 'Lihat Pratinjau Tampilan Pesan'}</span>
                                        </button>

                                        <AnimatePresence>
                                            {showPreview && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    className="mt-3 overflow-hidden rounded-xl border border-blue-200 bg-blue-50/40 p-4"
                                                >
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="text-[10px] font-bold text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded-md uppercase">
                                                            {selectedSentiment.toUpperCase()}
                                                        </span>
                                                        <span className="text-[11px] font-medium text-slate-500">
                                                            Pengirim: {isAnonymous ? 'Anonim Mahasiswa' : name || 'Nama Anda'}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs font-medium text-slate-700 italic">
                                                        &quot;{message || 'Belum ada rincian pesan...'}&quot;
                                                    </p>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        disabled={isSubmitting || message.trim().length < 15}
                                        type="submit"
                                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-xs font-semibold text-white shadow-md shadow-blue-600/10 transition hover:bg-blue-500 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                    >
                                        {isSubmitting ? (
                                            <span className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                        ) : (
                                            <>
                                                <span>Kirim Aspirasi Resmi</span>
                                                <Send className="size-3.5" />
                                            </>
                                        )}
                                    </button>
                                </form>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>

                {/* Transparansi Publik: Aspirasi Terselesaikan */}
                <motion.section
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4 }}
                    className="mt-14"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">
                                Transparansi Advokasi & Aspirasi Selesai
                            </h3>
                            <p className="text-xs text-slate-500">
                                Catatan aspirasi mahasiswa yang telah ditindaklanjuti secara nyata bersama pimpinan prodi dan fakultas.
                            </p>
                        </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-3">
                        {resolvedAspirations.map((item) => (
                            <div
                                key={item.id}
                                className="flex flex-col justify-between rounded-xl border border-slate-200/90 bg-white/90 p-4 shadow-xs"
                            >
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                                            {item.category}
                                        </span>
                                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                                            <Check className="size-3" />
                                            {item.status}
                                        </span>
                                    </div>
                                    <h4 className="text-xs font-bold text-slate-800 leading-snug">
                                        {item.title}
                                    </h4>
                                    <p className="mt-2 text-[11px] leading-relaxed text-slate-600">
                                        {item.response}
                                    </p>
                                </div>
                                <div className="mt-3 pt-2.5 border-t border-slate-100 text-[10px] font-medium text-slate-400">
                                    Diselesaikan: {item.date}
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.section>

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
                    <p>Departemen Advokasi & Kesejahteraan Mahasiswa</p>
                </motion.footer>
            </div>
        </main>
    )
}
