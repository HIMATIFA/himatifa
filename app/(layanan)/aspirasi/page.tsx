'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
    ArrowLeft,
    MessageSquareWarning,
    Send,
    ShieldAlert,
    Copyright,
    CheckCircle2,
    Sparkles
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

            setTimeout(() => setIsSuccess(false), 5000)
        }, 1500)
    }

    return (
        <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 sm:px-6 lg:px-10 lg:py-12 font-sans selection:bg-blue-500 selection:text-white">
            <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                <div className="absolute -left-32 -top-32 size-[500px] rounded-full bg-blue-400/20 blur-[140px]" />
                <div className="absolute right-0 top-1/4 size-[600px] rounded-full bg-indigo-400/15 blur-[160px]" />
                <div className="absolute bottom-10 left-1/3 size-[400px] rounded-full bg-emerald-400/15 blur-[130px]" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-60" />
            </div>

            <div className="mx-auto max-w-3xl">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
                    <Link className="group inline-flex items-center gap-2.5 text-sm font-bold text-slate-500 transition hover:text-blue-600" href="/">
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
                    className="mt-10 mb-12 text-center"
                >
                    <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/20">
                        <MessageSquareWarning className="size-8" />
                    </div>
                    <h1 className="text-4xl font-black tracking-tight sm:text-5xl text-slate-900">
                        Suara <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Mahasiswa.</span>
                    </h1>
                    <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-slate-500 font-medium">
                        Sampaikan kritik, saran, atau keluhan seputar fasilitas, layanan akademik, dan kegiatan HIMATIFA. Suara lo sangat berarti untuk evaluasi kami.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <div className="relative overflow-hidden rounded-[2.5rem] border border-white/60 bg-white/70 p-6 shadow-xl shadow-blue-900/5 backdrop-blur-xl sm:p-10">
                        <AnimatePresence mode="wait">
                            {isSuccess ? (
                                <motion.div
                                    key="success"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="flex flex-col items-center justify-center py-12 text-center"
                                >
                                    <div className="mb-6 flex size-20 items-center justify-center rounded-full bg-emerald-50 border border-emerald-100">
                                        <CheckCircle2 className="size-10 text-emerald-500" />
                                    </div>
                                    <h3 className="text-2xl font-black tracking-tight text-slate-900">Aspirasi Terkirim!</h3>
                                    <p className="mt-3 max-w-sm text-sm font-medium text-slate-500">
                                        Terima kasih atas partisipasi lo. Pesan telah masuk ke dalam kotak suara pengurus dan akan segera ditindaklanjuti.
                                    </p>
                                    <button
                                        onClick={() => setIsSuccess(false)}
                                        className="mt-8 flex items-center gap-2 rounded-xl bg-slate-100 px-5 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-200 hover:text-slate-900"
                                    >
                                        <Sparkles className="size-4" /> Kirim Aspirasi Lainnya
                                    </button>
                                </motion.div>
                            ) : (
                                <motion.form
                                    key="form"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    onSubmit={handleSubmit}
                                    className="grid gap-6"
                                >
                                    <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all focus-within:border-blue-300 focus-within:ring-4 focus-within:ring-blue-500/10">
                                        <div className="flex items-center gap-4">
                                            <div className={`flex size-10 items-center justify-center rounded-full transition-colors ${isAnonymous ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-400'}`}>
                                                <ShieldAlert className="size-5" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-900">Kirim sebagai Anonim</p>
                                                <p className="mt-0.5 text-xs font-medium text-slate-500">Identitas lo akan dirahasiakan sepenuhnya.</p>
                                            </div>
                                        </div>
                                        <label className="relative inline-flex cursor-pointer items-center">
                                            <input type="checkbox" className="peer sr-only" checked={isAnonymous} onChange={() => setIsAnonymous(!isAnonymous)} />
                                            <div className="peer h-7 w-12 rounded-full bg-slate-200 after:absolute after:left-[2px] after:top-[2px] after:h-6 after:w-6 after:rounded-full after:border after:border-slate-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-indigo-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 transition-colors"></div>
                                        </label>
                                    </div>

                                    <AnimatePresence>
                                        {!isAnonymous && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="grid gap-6 overflow-hidden sm:grid-cols-2"
                                            >
                                                <div>
                                                    <label className="mb-2 block text-[11px] font-extrabold uppercase tracking-wider text-slate-500">Nama Lengkap</label>
                                                    <input type="text" required={!isAnonymous} placeholder="Masukkan nama..." className="w-full rounded-xl border border-slate-200 bg-white/80 px-4 py-3.5 text-sm font-medium text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10" />
                                                </div>
                                                <div>
                                                    <label className="mb-2 block text-[11px] font-extrabold uppercase tracking-wider text-slate-500">NIM</label>
                                                    <input type="text" required={!isAnonymous} placeholder="Contoh: 20241337" className="w-full rounded-xl border border-slate-200 bg-white/80 px-4 py-3.5 text-sm font-medium text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10" />
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    <div>
                                        <label className="mb-2 block text-[11px] font-extrabold uppercase tracking-wider text-slate-500">Kategori Laporan</label>
                                        <div className="relative">
                                            <select className="w-full appearance-none rounded-xl border border-slate-200 bg-white/80 px-4 py-3.5 text-sm font-medium text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10">
                                                <option value="akademik">Layanan Akademik & Perkuliahan</option>
                                                <option value="fasilitas">Fasilitas Kampus & Laboratorium</option>
                                                <option value="organisasi">Kegiatan Organisasi & Acara</option>
                                                <option value="lainnya">Topik Lainnya</option>
                                            </select>
                                            <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                                                <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-[11px] font-extrabold uppercase tracking-wider text-slate-500">Detail Pesan / Aspirasi</label>
                                        <textarea required rows={5} placeholder="Ceritakan sedetail mungkin hal yang ingin lo sampaikan..." className="w-full resize-none rounded-xl border border-slate-200 bg-white/80 px-4 py-3.5 text-sm font-medium text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10" />
                                    </div>

                                    <button
                                        disabled={isSubmitting}
                                        type="submit"
                                        className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-4 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:shadow-blue-600/30 hover:scale-[1.01] active:scale-95 disabled:pointer-events-none disabled:opacity-70"
                                    >
                                        {isSubmitting ? (
                                            <span className="size-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                        ) : (
                                            <>Kirim Aspirasi <Send className="size-4" /></>
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