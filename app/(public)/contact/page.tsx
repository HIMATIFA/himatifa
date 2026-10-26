'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
    motion,
    useScroll,
    useSpring,
    useReducedMotion,
    type Variants
} from 'framer-motion'
import {
    ArrowLeft,
    Mail,
    MapPin,
    MessageCircle,
    Send,
    Copyright,
    ArrowUpRight,
    Sparkles,
    Clock,
    Building2,
    CheckCircle2,
    MessageSquareWarning,
    Phone,
    ArrowUp
} from 'lucide-react'

const inquiryCategories = [
    'Kerja Sama / Sponsor',
    'Undangan Kegiatan / Delegasi',
    'Kunjungan Industri / Media',
    'Pertanyaan Akademik / Umum'
]

const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
}

const reveal: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
    },
}

function BackToTop() {
    const [visible, setVisible] = useState(false)
    const reduce = useReducedMotion()

    useEffect(() => {
        const onScroll = () => setVisible(window.scrollY > 400)
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    if (!visible) return null

    return (
        <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={reduce ? undefined : { y: -2 }}
            whileTap={{ scale: 0.94 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="Kembali ke atas"
            className="fixed bottom-6 right-6 z-50 grid size-11 place-items-center rounded-full bg-[#2563eb] text-white shadow-lg shadow-blue-600/30 transition-colors hover:bg-blue-600 cursor-pointer"
        >
            <ArrowUp className="size-4.5" />
        </motion.button>
    )
}

export default function ContactPage() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState(inquiryCategories[0])

    const { scrollYProgress } = useScroll()
    const progressScale = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.4 })

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsSubmitting(true)
        setTimeout(() => {
            setIsSubmitting(false)
            setIsSubmitted(true)
        }, 1200)
    }

    return (
        <main className="relative min-h-screen bg-[#f8fafc] text-[#0a192f] antialiased selection:bg-blue-100 selection:text-blue-900">
            <motion.div
                style={{ scaleX: progressScale }}
                className="fixed inset-x-0 top-0 z-[60] h-1 origin-left bg-gradient-to-r from-[#2563eb] via-sky-400 to-cyan-400"
                aria-hidden
            />

            <div className="pointer-events-none absolute inset-x-0 top-0 h-96 overflow-hidden">
                <div className="absolute left-1/2 -top-40 -translate-x-1/2 size-[650px] rounded-full bg-gradient-to-b from-blue-100/70 via-indigo-50/40 to-transparent blur-3xl" />
            </div>

            <div className="relative z-10 mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-14">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 pb-6">
                    <Link
                        href="/"
                        className="group inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-xs transition-all hover:border-blue-300 hover:bg-blue-50/50 hover:text-[#2563eb]"
                    >
                        <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
                        <span>Kembali ke Beranda</span>
                    </Link>

                    <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                        <Link href="/" className="hover:text-slate-900 transition-colors">
                            HIMATIFA
                        </Link>
                        <span>/</span>
                        <span className="font-semibold text-[#2563eb]">Kontak & Kerja Sama</span>
                    </div>
                </div>

                <motion.div
                    initial="hidden"
                    animate="show"
                    variants={container}
                    className="mt-12 text-center sm:mt-16"
                >
                    <motion.div
                        variants={reveal}
                        className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/80 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#2563eb]"
                    >
                        <span>Pusat Komunikasi & Kemitraan</span>
                    </motion.div>

                    <motion.h1
                        variants={reveal}
                        className="mt-4 text-3xl font-black tracking-tight text-[#0a192f] sm:text-5xl lg:text-6xl"
                    >
                        Mari Terhubung &{' '}
                        <span className="bg-gradient-to-r from-[#2563eb] to-sky-500 bg-clip-text text-transparent">
                            Berkolaborasi.
                        </span>
                    </motion.h1>

                    <motion.p
                        variants={reveal}
                        className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg"
                    >
                        Pintu komunikasi kami terbuka lebar untuk kolaborasi kemitraan, undangan pembicara, audiensi organisasi, maupun pertanyaan seputar kegiatan HIMATIFA.
                    </motion.p>
                </motion.div>

                <div className="mt-14 grid gap-8 lg:grid-cols-12 lg:items-start">
                    <motion.div
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, margin: '-60px' }}
                        variants={container}
                        className="flex flex-col gap-6 lg:col-span-5"
                    >
                        <motion.div variants={reveal}>
                            <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-[#0c1f38] p-7 text-white shadow-xl sm:p-8">
                                <div
                                    aria-hidden
                                    className="pointer-events-none absolute -bottom-16 -right-16 size-48 rounded-full bg-blue-500/20 blur-3xl"
                                />

                                <div className="flex items-center gap-3">
                                    <div className="grid size-11 place-items-center rounded-xl bg-blue-500/10 border border-blue-400/30 text-blue-300">
                                        <MapPin className="size-5" />
                                    </div>
                                    <div>
                                        <span className="text-[11px] font-bold uppercase tracking-wider text-blue-300">
                                            Lokasi Sekretariat
                                        </span>
                                        <h3 className="text-lg font-bold text-white">Kantor HIMATIFA</h3>
                                    </div>
                                </div>

                                <p className="mt-5 text-sm leading-relaxed text-slate-300">
                                    Gedung G Lantai 3, Fakultas Teknik Universitas Muhammadiyah Surabaya.<br />
                                    Jl. Sutorejo No. 59, Mulyorejo, Surabaya, Jawa Timur 60113.
                                </p>

                                <div className="mt-6 flex items-center gap-2 text-xs font-semibold text-blue-200 border-t border-slate-700/60 pt-4">
                                    <Clock className="size-3.5 text-blue-400" />
                                    <span>Jam Pelayanan: Senin – Jumat (09.00 – 16.30 WIB)</span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Direct Channels Cards */}
                        <motion.div variants={reveal} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                            {/* Email Card */}
                            <a
                                href="mailto:himatifa@um-surabaya.ac.id"
                                className="group flex items-start gap-4 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs transition-all duration-300 hover:border-blue-300 hover:shadow-sm"
                            >
                                <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-blue-50 text-[#2563eb] border border-blue-100 transition-colors group-hover:bg-[#2563eb] group-hover:text-white">
                                    <Mail className="size-5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                        Email Resmi Organisasi
                                    </span>
                                    <h4 className="mt-0.5 text-sm font-bold text-[#0a192f] truncate group-hover:text-[#2563eb] transition-colors">
                                        himatifa@um-surabaya.ac.id
                                    </h4>
                                    <p className="mt-1 text-xs text-slate-500">
                                        Surat resmi, undangan, & proposal kemitraan
                                    </p>
                                </div>
                            </a>

                            {/* WhatsApp Card */}
                            <a
                                href="https://wa.me/6281234567890"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-start gap-4 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs transition-all duration-300 hover:border-emerald-300 hover:shadow-sm"
                            >
                                <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 transition-colors group-hover:bg-emerald-600 group-hover:text-white">
                                    <MessageCircle className="size-5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                        WhatsApp Humas
                                    </span>
                                    <h4 className="mt-0.5 text-sm font-bold text-[#0a192f] group-hover:text-emerald-700 transition-colors">
                                        +62 812-3456-7890
                                    </h4>
                                    <p className="mt-1 text-xs text-slate-500">
                                        Layanan komunikasi cepat perwakilan divisi humas
                                    </p>
                                </div>
                            </a>
                        </motion.div>

                        {/* Aspirasi Callout Card */}
                        <motion.div
                            variants={reveal}
                            className="rounded-2xl border border-blue-100 bg-blue-50/70 p-5 text-xs text-slate-600 sm:p-6"
                        >
                            <div className="flex items-center gap-2 font-bold text-[#2563eb]">
                                <MessageSquareWarning className="size-4" />
                                <span>Punya Keluhan atau Saran Akademik?</span>
                            </div>
                            <p className="mt-1.5 leading-relaxed">
                                Mahasiswa Informatika yang ingin menyampaikan aspirasi, aduan fasilitas, atau masukan prodi secara anonim dapat menggunakan kanal Suara Mahasiswa.
                            </p>
                            <Link
                                href="/aspirasi"
                                className="mt-3 inline-flex items-center gap-1 font-bold text-[#2563eb] hover:text-blue-700 transition-colors"
                            >
                                <span>Buka Layanan Aspirasi</span>
                                <ArrowUpRight className="size-3.5" />
                            </Link>
                        </motion.div>
                    </motion.div>

                    {/* Right Column: Clean Interactive Form */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-60px' }}
                        transition={{ duration: 0.5, delay: 0.15 }}
                        className="rounded-3xl border border-slate-200/90 bg-white p-7 shadow-sm sm:p-10 lg:col-span-7"
                    >
                        <div className="border-b border-slate-100 pb-5">
                            <h2 className="text-xl font-black text-[#0a192f] sm:text-2xl">
                                Formulir Pesan & Kolaborasi
                            </h2>
                            <p className="mt-1 text-xs sm:text-sm text-slate-500">
                                Sampaikan ide kolaborasi, undangan, atau pertanyaan Anda. Tim kami akan merespons melalui email dalam 1-2 hari kerja.
                            </p>
                        </div>

                        {isSubmitted ? (
                            <div className="my-10 rounded-2xl bg-emerald-50 border border-emerald-200 p-8 text-center">
                                <div className="mx-auto grid size-12 place-items-center rounded-full bg-emerald-100 text-emerald-600">
                                    <CheckCircle2 className="size-6" />
                                </div>
                                <h3 className="mt-4 text-lg font-bold text-emerald-900">
                                    Pesan Berhasil Terkirim!
                                </h3>
                                <p className="mt-2 text-xs sm:text-sm text-emerald-700 max-w-md mx-auto leading-relaxed">
                                    Terima kasih telah menghubungi HIMATIFA UMSURA. Tim representatif kami akan segera meninjau pesan Anda dan membalas melalui email yang Anda cantumkan.
                                </p>
                                <button
                                    onClick={() => setIsSubmitted(false)}
                                    className="mt-6 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white transition-colors hover:bg-emerald-700"
                                >
                                    Kirim Pesan Lainnya
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-5">
                                {/* Name & Institution Row */}
                                <div className="grid gap-5 sm:grid-cols-2">
                                    <div>
                                        <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">
                                            Nama Lengkap <span className="text-rose-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="Contoh: Muhammad Rizki"
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-3 focus:ring-blue-100 transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">
                                            Instansi / Organisasi
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Nama instansi atau kampus"
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-3 focus:ring-blue-100 transition-all"
                                        />
                                    </div>
                                </div>

                                {/* Email Address */}
                                <div>
                                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">
                                        Alamat Email Aktif <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        placeholder="nama@email.com"
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-3 focus:ring-blue-100 transition-all"
                                    />
                                </div>

                                {/* Category Selection */}
                                <div>
                                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">
                                        Kategori Kepentingan
                                    </label>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        {inquiryCategories.map((cat) => {
                                            const active = selectedCategory === cat
                                            return (
                                                <button
                                                    key={cat}
                                                    type="button"
                                                    onClick={() => setSelectedCategory(cat)}
                                                    className={`rounded-xl border px-3 py-2.5 text-left text-xs font-semibold transition-all ${
                                                        active
                                                            ? 'border-blue-600 bg-blue-50/80 text-blue-700 ring-1 ring-blue-600'
                                                            : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                                                    }`}
                                                >
                                                    {cat}
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>

                                {/* Message Field */}
                                <div>
                                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">
                                        Isi Pesan / Penjelasan Kolaborasi <span className="text-rose-500">*</span>
                                    </label>
                                    <textarea
                                        required
                                        rows={5}
                                        placeholder="Jelaskan maksud dan tujuan kerja sama, detail acara, atau pertanyaan Anda dengan jelas..."
                                        className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-3 focus:ring-blue-100 transition-all"
                                    />
                                </div>

                                {/* Submit Button */}
                                <button
                                    disabled={isSubmitting}
                                    type="submit"
                                    className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#2563eb] py-3.5 text-xs sm:text-sm font-bold text-white shadow-xs transition-all hover:bg-blue-700 disabled:opacity-70 cursor-pointer"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <span className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                            <span>Mengirim Pesan...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Kirimkan Pesan</span>
                                            <Send className="size-4" />
                                        </>
                                    )}
                                </button>
                            </form>
                        )}
                    </motion.div>
                </div>

                {/* Footer Section */}
                <footer className="mt-20 flex flex-col items-center justify-between gap-4 border-t border-slate-200/80 pt-8 pb-4 text-xs font-medium text-slate-500 sm:flex-row">
                    <p className="flex items-center gap-1.5">
                        <Copyright className="size-3.5" /> {new Date().getFullYear()} HIMATIFA Universitas Muhammadiyah Surabaya.
                    </p>
                    <div className="flex items-center gap-4">
                        <Link href="/" className="hover:text-blue-600 transition-colors">
                            Beranda
                        </Link>
                        <Link href="/about" className="hover:text-blue-600 transition-colors">
                            Profil
                        </Link>
                        <Link href="/news" className="hover:text-blue-600 transition-colors">
                            Berita
                        </Link>
                    </div>
                </footer>
            </div>

            <BackToTop />
        </main>
    )
}
