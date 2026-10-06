'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, type Variants } from 'framer-motion'
import { ArrowLeft, Mail, MapPin, MessageCircle, Send, Copyright } from 'lucide-react'

const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
}

const reveal: Variants = {
    hidden: { opacity: 0, y: 40, filter: 'blur(6px)' },
    show: {
        opacity: 1, y: 0, filter: 'blur(0px)',
        transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
    },
}

const listItem: Variants = {
    hidden: { opacity: 0, scale: 0.95 },
    show: {
        opacity: 1, scale: 1,
        transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
    },
}

export default function ContactPage() {
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        setTimeout(() => setIsSubmitting(false), 2000)
    }

    return (
        <main className="relative min-h-screen overflow-hidden bg-slate-50 px-4 py-12 text-[#0a192f] sm:px-6 lg:px-10 lg:py-20">
            {/* Background Decorations */}
            <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]" />
            <div className="absolute left-[-10%] top-[-10%] -z-10 size-[500px] rounded-full bg-blue-400/20 blur-[120px]" />
            <div className="absolute right-[-5%] top-[20%] -z-10 size-[600px] rounded-full bg-cyan-300/15 blur-[150px]" />

            <div className="relative z-10 mx-auto max-w-6xl">
                <motion.div
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Link
                        href="/"
                        className="group inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/50 px-4 py-2 text-xs font-bold text-slate-500 backdrop-blur-sm transition-all hover:border-blue-300 hover:bg-blue-50 hover:text-[#2563eb]"
                    >
                        <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
                        Kembali ke Beranda
                    </Link>
                </motion.div>

                <motion.div
                    initial="hidden" animate="show" variants={container}
                    className="mb-14 mt-12"
                >
                    <motion.p variants={reveal} className="mb-3 text-xs font-bold uppercase tracking-[.2em] text-[#2563eb]">
                        Hubungi Kami
                    </motion.p>
                    <motion.h1 variants={reveal} className="text-4xl font-black tracking-tight sm:text-6xl">
                        Mari{' '}
                        <span className="relative inline-block bg-gradient-to-r from-[#2563eb] via-sky-400 to-[#2563eb] bg-[length:200%_auto] bg-clip-text text-transparent animate-[gradient-move_4s_linear_infinite]">
                            Terhubung.
                            <svg aria-hidden className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
                                <path d="M2 9C50 3 150 3 198 9" stroke="#2563eb" strokeWidth="4" strokeLinecap="round" opacity="0.4" />
                            </svg>
                        </span>
                    </motion.h1>
                    <motion.p variants={reveal} className="mt-5 max-w-xl text-sm leading-relaxed text-slate-500 sm:text-base">
                        Punya pertanyaan, tawaran kerja sama, atau ingin mengundang delegasi kami? Jangan ragu untuk meninggalkan pesan.
                    </motion.p>
                </motion.div>

                <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
                    <motion.div
                        initial="hidden" animate="show" variants={container}
                        className="flex flex-col gap-5"
                    >
                        <motion.div variants={listItem} className="group rounded-[2.5rem] border border-white/80 bg-white/60 p-8 shadow-xl shadow-blue-900/5 backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:border-blue-200/50 hover:shadow-2xl hover:shadow-blue-900/10">
                            <div className="mb-5 grid size-14 place-items-center rounded-2xl bg-[#0a192f] text-white shadow-inner transition-colors group-hover:bg-[#2563eb] group-hover:shadow-lg group-hover:shadow-blue-500/30">
                                <MapPin className="size-6" />
                            </div>
                            <h3 className="text-xl font-black text-[#0a192f]">Sekretariat HIMATIFA</h3>
                            <p className="mt-3 text-sm leading-relaxed text-slate-500">
                                Gedung G Lantai 2, Kampus Universitas Muhammadiyah Surabaya.<br />
                                Jl. Sutorejo No. 59, Mulyorejo, Surabaya, Jawa Timur 60113.
                            </p>
                        </motion.div>

                        <div className="grid gap-5 sm:grid-cols-2">
                            <motion.a variants={listItem} href="mailto:himatifa@ft.um-surabaya.ac.id" className="group rounded-[2rem] border border-white/80 bg-white/60 p-6 shadow-lg shadow-blue-900/5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-blue-200/50 hover:shadow-xl hover:shadow-blue-900/10">
                                <div className="mb-4 grid size-12 place-items-center rounded-[1rem] bg-blue-50 text-[#2563eb] transition-all group-hover:bg-[#2563eb] group-hover:text-white group-hover:shadow-md group-hover:shadow-blue-500/30">
                                    <Mail className="size-5" />
                                </div>
                                <h3 className="text-[15px] font-extrabold text-[#0a192f]">Email Resmi</h3>
                                <p className="mt-1 text-xs font-medium text-slate-500 line-clamp-1">himatifa@ft.um-surabaya.ac.id</p>
                            </motion.a>

                            <motion.a variants={listItem} href="https://wa.me/6281234567890" target="_blank" rel="noreferrer" className="group rounded-[2rem] border border-white/80 bg-white/60 p-6 shadow-lg shadow-blue-900/5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-green-200/50 hover:shadow-xl hover:shadow-green-900/10">
                                <div className="mb-4 grid size-12 place-items-center rounded-[1rem] bg-green-50 text-green-600 transition-all group-hover:bg-green-500 group-hover:text-white group-hover:shadow-md group-hover:shadow-green-500/30">
                                    <MessageCircle className="size-5" />
                                </div>
                                <h3 className="text-[15px] font-extrabold text-[#0a192f]">WhatsApp (Humas)</h3>
                                <p className="mt-1 text-xs font-medium text-slate-500">+62 812-3456-7890</p>
                            </motion.a>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.3 }}
                        className="rounded-[2.5rem] border border-white/80 bg-white/70 p-6 shadow-xl shadow-blue-900/5 backdrop-blur-xl sm:p-10"
                    >
                        <h2 className="mb-8 text-2xl font-black text-[#0a192f]">Kirim Pesan Langsung</h2>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                            <div className="grid gap-5 sm:grid-cols-2">
                                <div>
                                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">Nama Lengkap</label>
                                    <input type="text" required placeholder="John Doe" className="w-full rounded-2xl border border-white/80 bg-white/50 px-5 py-3.5 text-sm outline-none transition focus:border-[#2563eb] focus:bg-white focus:ring-4 focus:ring-blue-500/10" />
                                </div>
                                <div>
                                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">Instansi / Kampus</label>
                                    <input type="text" placeholder="Opsional" className="w-full rounded-2xl border border-white/80 bg-white/50 px-5 py-3.5 text-sm outline-none transition focus:border-[#2563eb] focus:bg-white focus:ring-4 focus:ring-blue-500/10" />
                                </div>
                            </div>

                            <div>
                                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">Email Balasan</label>
                                <input type="email" required placeholder="john@example.com" className="w-full rounded-2xl border border-white/80 bg-white/50 px-5 py-3.5 text-sm outline-none transition focus:border-[#2563eb] focus:bg-white focus:ring-4 focus:ring-blue-500/10" />
                            </div>

                            <div>
                                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">Isi Pesan</label>
                                <textarea required rows={5} placeholder="Tuliskan tujuan kerja sama atau pertanyaan Anda di sini..." className="w-full resize-none rounded-2xl border border-white/80 bg-white/50 px-5 py-3.5 text-sm outline-none transition focus:border-[#2563eb] focus:bg-white focus:ring-4 focus:ring-blue-500/10" />
                            </div>

                            <button disabled={isSubmitting} type="submit" className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0a192f] py-4 text-sm font-bold text-white shadow-lg transition-all hover:-translate-y-1 hover:bg-[#2563eb] hover:shadow-blue-500/30 disabled:opacity-70 disabled:hover:translate-y-0">
                                {isSubmitting ? (
                                    <span className="size-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                ) : (
                                    <>Kirim Pesan <Send className="size-4" /></>
                                )}
                            </button>
                        </form>
                    </motion.div>
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