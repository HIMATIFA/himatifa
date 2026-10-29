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
import { inquiryCategories } from '@/app/data'
import {
    ArrowLeft,
    Mail,
    MapPin,
    MessageCircle,
    Send,
    Copyright,
    ArrowUpRight,
    Clock,
    CheckCircle2,
    MessageSquareWarning,
    ArrowUp
} from 'lucide-react'

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
            className="fixed bottom-6 right-6 z-50 grid size-11 place-items-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-500 cursor-pointer"
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
        <main className="relative min-h-screen bg-slate-50 text-slate-900 font-sans antialiased selection:bg-blue-100 selection:text-blue-900">
            <motion.div
                style={{ scaleX: progressScale }}
                className="fixed inset-x-0 top-0 z-50 h-1 origin-left bg-blue-600"
                aria-hidden
            />

            <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] opacity-40" />

            <div className="relative z-10 mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
                <motion.div
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                    className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-6"
                >
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-600 shadow-xs transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 active:scale-[0.98]"
                    >
                        <ArrowLeft className="size-3.5" />
                        <span>Kembali ke Beranda</span>
                    </Link>

                    <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                        <Link href="/" className="hover:text-slate-700 transition">
                            HIMATIFA
                        </Link>
                        <span>/</span>
                        <span className="font-bold text-slate-900">Kontak & Kerja Sama</span>
                    </div>
                </motion.div>

                <motion.div
                    initial="hidden"
                    animate="show"
                    variants={container}
                    className="mt-8 mb-10 sm:mb-14 max-w-3xl"
                >
                    <motion.div variants={reveal} className="flex items-center gap-3 mb-3">
                        <div className="h-[1px] w-6 sm:w-12 bg-blue-600/30" />
                        <span className="text-[10px] sm:text-xs font-bold tracking-[0.25em] uppercase text-blue-600">
                            Pusat Komunikasi & Kemitraan
                        </span>
                    </motion.div>
                    <motion.h1 variants={reveal} className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
                        Mari Terhubung & <span className="text-blue-600">Berkolaborasi</span>
                    </motion.h1>
                    <motion.p variants={reveal} className="mt-3 text-sm sm:text-base leading-relaxed text-slate-600 font-normal">
                        Kanal komunikasi terbuka untuk kemitraan, permohonan delegasi, audiensi organisasi, maupun pertanyaan seputar kegiatan HIMATIFA UMSURA.
                    </motion.p>
                </motion.div>

                <div className="grid gap-6 lg:grid-cols-12 lg:items-start">
                    <motion.div
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, margin: '-60px' }}
                        variants={container}
                        className="flex flex-col gap-4 lg:col-span-5"
                    >
                        <motion.div variants={reveal}>
                            <div className="relative overflow-hidden rounded-2xl border border-slate-900 bg-slate-900 p-6 sm:p-7 text-white shadow-xs">
                                <div className="flex items-center gap-3">
                                    <div className="grid size-10 place-items-center rounded-xl bg-blue-500/10 border border-blue-400/20 text-blue-400">
                                        <MapPin className="size-5" />
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-400">
                                            Lokasi Sekretariat
                                        </span>
                                        <h3 className="text-base font-bold text-white">Kantor HIMATIFA</h3>
                                    </div>
                                </div>

                                <p className="mt-4 text-xs sm:text-sm leading-relaxed text-slate-300 font-medium">
                                    Gedung G Lantai 3, FT Universitas Muhammadiyah Surabaya.<br />
                                    Jl. Sutorejo No. 59, Mulyorejo, Surabaya, Jawa Timur 60113.
                                </p>

                                <div className="mt-5 flex items-center gap-2 text-xs font-semibold text-slate-400 border-t border-slate-800 pt-4">
                                    <Clock className="size-3.5 text-blue-400" />
                                    <span>Jam Pelayanan: Senin – Jumat (09.00 – 16.30 WIB)</span>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div variants={reveal} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                            <a
                                href="mailto:himatifa@um-surabaya.ac.id"
                                className="group flex items-start gap-3.5 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs transition hover:border-blue-300 hover:shadow-sm"
                            >
                                <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                    <Mail className="size-4.5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                                        Email Resmi Organisasi
                                    </span>
                                    <h4 className="mt-0.5 text-xs sm:text-sm font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                                        himatifa@um-surabaya.ac.id
                                    </h4>
                                    <p className="mt-0.5 text-[11px] text-slate-500 font-medium">
                                        Surat resmi, undangan, & proposal kemitraan
                                    </p>
                                </div>
                            </a>

                            <a
                                href="https://wa.me/6281234567890"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-start gap-3.5 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs transition hover:border-emerald-300 hover:shadow-sm"
                            >
                                <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                                    <MessageCircle className="size-4.5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                                        WhatsApp Humas
                                    </span>
                                    <h4 className="mt-0.5 text-xs sm:text-sm font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                                        +62 812-3456-7890
                                    </h4>
                                    <p className="mt-0.5 text-[11px] text-slate-500 font-medium">
                                        Layanan komunikasi cepat perwakilan humas
                                    </p>
                                </div>
                            </a>
                        </motion.div>

                        <motion.div
                            variants={reveal}
                            className="rounded-2xl border border-blue-100 bg-blue-50/70 p-4 text-xs text-slate-600 sm:p-5"
                        >
                            <div className="flex items-center gap-2 font-bold text-blue-900">
                                <MessageSquareWarning className="size-4 text-blue-600" />
                                <span>Punya Keluhan atau Masukan Akademik?</span>
                            </div>
                            <p className="mt-1.5 leading-relaxed text-slate-600 font-medium">
                                Mahasiswa Informatika yang ingin menyampaikan aspirasi, aduan fasilitas, atau saran prodi dapat menggunakan layanan Suara Mahasiswa.
                            </p>
                            <Link
                                href="/aspirasi"
                                className="mt-2.5 inline-flex items-center gap-1 font-bold text-blue-600 hover:text-blue-700 transition"
                            >
                                <span>Buka Layanan Aspirasi</span>
                                <ArrowUpRight className="size-3.5" />
                            </Link>
                        </motion.div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-60px' }}
                        transition={{ duration: 0.5, delay: 0.15 }}
                        className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs lg:col-span-7"
                    >
                        <div className="border-b border-slate-100 pb-4">
                            <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
                                Formulir Pesan & Kolaborasi
                            </h2>
                            <p className="mt-1 text-xs text-slate-500 font-medium">
                                Sampaikan rencana kerja sama, undangan, atau pertanyaan Anda. Tim representatif kami akan merespons dalam 1-2 hari kerja.
                            </p>
                        </div>

                        {isSubmitted ? (
                            <div className="my-8 rounded-xl bg-emerald-50 border border-emerald-200 p-6 text-center">
                                <div className="mx-auto grid size-12 place-items-center rounded-xl bg-emerald-100 text-emerald-600 mb-3">
                                    <CheckCircle2 className="size-6" />
                                </div>
                                <h3 className="text-base font-bold text-emerald-900">
                                    Pesan Berhasil Terkirim!
                                </h3>
                                <p className="mt-1.5 text-xs text-emerald-700 max-w-md mx-auto font-medium leading-relaxed">
                                    Terima kasih telah menghubungi HIMATIFA UMSURA. Tim perwakilan kami akan segera mengulas pesan Anda dan memberikan konfirmasi melalui email.
                                </p>
                                <button
                                    onClick={() => setIsSubmitted(false)}
                                    className="mt-5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-emerald-500 active:scale-[0.98]"
                                >
                                    Kirim Pesan Lainnya
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-4">
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                                            Nama Lengkap <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="Masukkan nama lengkap Anda..."
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 px-3.5 text-xs font-medium text-slate-900 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/10"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                                            Instansi / Organisasi
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Nama instansi atau universitas..."
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 px-3.5 text-xs font-medium text-slate-900 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/10"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                                        Alamat Email Aktif <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        placeholder="nama@domain.com"
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 px-3.5 text-xs font-medium text-slate-900 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/10"
                                    />
                                </div>

                                <div>
                                    <label className="mb-1.5 block text-xs font-semibold text-slate-700">
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
                                                    className={`rounded-xl border px-3 py-2 text-left text-xs font-semibold transition-all ${
                                                        active
                                                            ? 'border-blue-600 bg-blue-50 text-blue-700'
                                                            : 'border-slate-200 bg-slate-50/70 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                                                    }`}
                                                >
                                                    {cat}
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>

                                <div>
                                    <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                                        Isi Pesan & Penjelasan Kolaborasi <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        required
                                        rows={5}
                                        placeholder="Jelaskan maksud dan tujuan kerja sama, detail acara, atau pertanyaan Anda..."
                                        className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 text-xs font-medium text-slate-900 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/10"
                                    />
                                </div>

                                <button
                                    disabled={isSubmitting}
                                    type="submit"
                                    className="mt-1 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-xs font-semibold text-white shadow-md shadow-blue-600/10 transition hover:bg-blue-500 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <span className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                            <span>Mengirim Pesan...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Kirimkan Pesan</span>
                                            <Send className="size-3.5" />
                                        </>
                                    )}
                                </button>
                            </form>
                        )}
                    </motion.div>
                </div>

                <footer className="mt-16 flex flex-col items-center justify-between gap-3 border-t border-slate-200 pt-6 pb-4 text-xs font-medium text-slate-400 sm:flex-row">
                    <p className="flex items-center gap-1.5">
                        <Copyright className="size-3.5" /> {new Date().getFullYear()} HIMATIFA Universitas Muhammadiyah Surabaya.
                    </p>
                    <div className="flex items-center gap-4 text-slate-500">
                        <Link href="/" className="hover:text-blue-600 transition">Beranda</Link>
                        <Link href="/about" className="hover:text-blue-600 transition">Profil</Link>
                        <Link href="/news" className="hover:text-blue-600 transition">Berita</Link>
                    </div>
                </footer>
            </div>

            <BackToTop />
        </main>
    )
}