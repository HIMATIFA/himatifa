'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { aspirasiCategories } from '@/app/data'
import {
    ArrowLeft,
    MessageSquareWarning,
    Send,
    ShieldAlert,
    Copyright,
    CheckCircle2,
    Sparkles,
    ChevronDown,
    User,
    Hash
} from 'lucide-react'

export default function AspirasiPage() {
    const [isAnonymous, setIsAnonymous] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        setTimeout(() => {
            setIsSubmitting(false)
            setIsSuccess(true)
        }, 1200)
    }

    return (
        <main className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased relative overflow-hidden">
            <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] opacity-40" />

            <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
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
                    className="mt-8 mb-10 sm:mb-12 max-w-2xl"
                >
                    <div className="flex items-center gap-3 mb-3">
                        <div className="h-[1px] w-6 sm:w-12 bg-blue-600/30" />
                        <span className="text-[10px] sm:text-xs font-bold tracking-[0.25em] uppercase text-blue-600">
                            Pusat Aspirasi & Keluhan
                        </span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
                        Suara <span className="text-blue-600">Mahasiswa</span>
                    </h1>
                    <p className="mt-3 text-sm sm:text-base leading-relaxed text-slate-600 font-normal">
                        Sampaikan kritik konstruktif, saran, atau keluhan seputar fasilitas, layanan akademik, serta kegiatan HIMATIFA UMSURA.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
                        <AnimatePresence mode="wait">
                            {isSuccess ? (
                                <motion.div
                                    key="success"
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.98 }}
                                    className="flex flex-col items-center justify-center py-10 text-center"
                                >
                                    <div className="mb-4 grid size-16 place-items-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                                        <CheckCircle2 className="size-8" />
                                    </div>
                                    <h2 className="text-xl font-bold text-slate-900">
                                        Aspirasi Berhasil Terkirim!
                                    </h2>
                                    <p className="mt-2 max-w-md text-xs sm:text-sm font-medium leading-relaxed text-slate-500">
                                        Terima kasih atas partisipasi Anda. Pesan telah masuk ke dalam sistem verifikasi pengurus dan akan segera ditindaklanjuti.
                                    </p>
                                    <button
                                        onClick={() => setIsSuccess(false)}
                                        className="mt-6 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-900 active:scale-[0.98]"
                                    >
                                        <Sparkles className="size-4 text-blue-600" />
                                        <span>Kirim Aspirasi Lainnya</span>
                                    </button>
                                </motion.div>
                            ) : (
                                <motion.form
                                    key="form"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    onSubmit={handleSubmit}
                                    className="space-y-6"
                                >
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
                                                    Identitas pribadi Anda tidak akan dicatat oleh sistem.
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

                                    <AnimatePresence>
                                        {!isAnonymous && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="grid gap-5 overflow-hidden sm:grid-cols-2 pt-1"
                                            >
                                                <div>
                                                    <label className="mb-2 block text-xs font-semibold text-slate-700">
                                                        Nama Lengkap
                                                    </label>
                                                    <div className="relative">
                                                        <User className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                                                        <input
                                                            type="text"
                                                            required={!isAnonymous}
                                                            placeholder="Masukkan nama lengkap Anda..."
                                                            className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 pl-10 pr-4 text-xs font-medium text-slate-900 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/10"
                                                        />
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="mb-2 block text-xs font-semibold text-slate-700">
                                                        NIM (Nomor Induk Mahasiswa)
                                                    </label>
                                                    <div className="relative">
                                                        <Hash className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                                                        <input
                                                            type="text"
                                                            required={!isAnonymous}
                                                            placeholder="Contoh: 20230140001"
                                                            className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 pl-10 pr-4 text-xs font-medium text-slate-900 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/10"
                                                        />
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    <div>
                                        <label className="mb-2 block text-xs font-semibold text-slate-700">
                                            Kategori Laporan / Masukan
                                        </label>
                                        <div className="relative">
                                            <select className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 pl-4 pr-10 text-xs font-medium text-slate-900 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/10 cursor-pointer">
                                                {aspirasiCategories.map((cat) => (
                                                    <option key={cat.value} value={cat.value}>
                                                        {cat.label}
                                                    </option>
                                                ))}
                                            </select>
                                            <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-xs font-semibold text-slate-700">
                                            Detail Pesan & Aspirasi
                                        </label>
                                        <textarea
                                            required
                                            rows={5}
                                            placeholder="Tuliskan saran, kritik, atau keluhan Anda secara jelas dan objektif..."
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 text-xs font-medium text-slate-900 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/10"
                                        />
                                    </div>

                                    <button
                                        disabled={isSubmitting}
                                        type="submit"
                                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-xs font-semibold text-white shadow-md shadow-blue-600/10 transition hover:bg-blue-500 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                                    >
                                        {isSubmitting ? (
                                            <span className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                        ) : (
                                            <>
                                                <span>Kirim Aspirasi</span>
                                                <Send className="size-3.5" />
                                            </>
                                        )}
                                    </button>
                                </motion.form>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>

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