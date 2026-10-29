'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import {
    motion,
    useScroll,
    useSpring,
    useReducedMotion,
    type Variants,
    AnimatePresence
} from 'framer-motion'
import { eventsData, type EventItem } from '@/app/data'
import {
    ArrowLeft,
    CalendarDays,
    MapPin,
    Users,
    ArrowRight,
    ArrowUp,
    Copyright,
    Clock,
    Search,
    X,
    CalendarPlus,
    CheckCircle2
} from 'lucide-react'

const categories = ['Semua', 'Akademik', 'Sosial', 'Kreatif', 'Organisasi']

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

function makeGoogleCalendarUrl(event: EventItem) {
    const text = encodeURIComponent(event.title)
    const details = encodeURIComponent(`${event.desc}\n\nDiselenggarakan oleh: HIMATIFA UMSURA\nWaktu: ${event.time}`)
    const location = encodeURIComponent(event.location)
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&details=${details}&location=${location}`
}

export default function EventsPage() {
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('Semua')
    const [activeModalEvent, setActiveModalEvent] = useState<EventItem | null>(null)
    const [registeredSuccess, setRegisteredSuccess] = useState(false)

    const { scrollYProgress } = useScroll()
    const progressScale = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.4 })

    const filteredEvents = useMemo(() => {
        return eventsData.filter((event) => {
            const matchesCat = selectedCategory === 'Semua' || event.category === selectedCategory
            const q = searchQuery.toLowerCase().trim()
            const matchesSearch =
                !q ||
                event.title.toLowerCase().includes(q) ||
                event.desc.toLowerCase().includes(q) ||
                event.location.toLowerCase().includes(q)
            return matchesCat && matchesSearch
        })
    }, [searchQuery, selectedCategory])

    const handleRegisterSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setRegisteredSuccess(true)
        setTimeout(() => {
            setRegisteredSuccess(false)
            setActiveModalEvent(null)
        }, 1800)
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
                        <span className="font-bold text-slate-900">Kalender Kegiatan</span>
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
                            Agenda & Aktivitas Himpunan
                        </span>
                    </motion.div>
                    <motion.h1 variants={reveal} className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
                        Jadwal Acara & <span className="text-blue-600">Kegiatan Mendatang</span>
                    </motion.h1>
                    <motion.p variants={reveal} className="mt-3 text-sm sm:text-base leading-relaxed text-slate-600 font-normal">
                        Ikuti workshop teknologi, bakti sosial, agenda pengkaderan, hingga diskusi interaktif bersama mahasiswa S1 Informatika UMSURA.
                    </motion.p>
                </motion.div>

                <motion.div
                    initial="hidden"
                    animate="show"
                    variants={reveal}
                    className="mt-8 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-3 shadow-xs sm:flex-row sm:items-center sm:justify-between sm:p-4"
                >
                    <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                        {categories.map((category) => {
                            const isSelected = selectedCategory === category
                            const count = category === 'Semua'
                                ? eventsData.length
                                : eventsData.filter((e) => e.category === category).length

                            return (
                                <button
                                    key={category}
                                    onClick={() => setSelectedCategory(category)}
                                    className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all cursor-pointer ${
                                        isSelected
                                            ? 'bg-blue-600 text-white shadow-xs'
                                            : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                                    }`}
                                >
                                    <span>{category}</span>
                                    <span
                                        className={`rounded-full px-1.5 py-0.2 text-[10px] font-extrabold ${
                                            isSelected ? 'bg-white/20 text-white' : 'bg-slate-200/70 text-slate-500'
                                        }`}
                                    >
                                        {count}
                                    </span>
                                </button>
                            )
                        })}
                    </div>

                    <div className="relative w-full sm:w-72">
                        <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Cari acara atau tempat..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2 pl-9 pr-8 text-xs sm:text-sm text-slate-900 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/10"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                aria-label="Hapus pencarian"
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                            >
                                <X className="size-3.5" />
                            </button>
                        )}
                    </div>
                </motion.div>

                <section className="mt-8">
                    <div className="mb-4 flex items-center justify-between text-xs font-medium text-slate-500">
                        <span>
                            Menampilkan <strong className="text-slate-900">{filteredEvents.length}</strong> agenda kegiatan
                            {searchQuery && <span> dengan kata kunci &ldquo;{searchQuery}&rdquo;</span>}
                        </span>
                    </div>

                    {filteredEvents.length > 0 ? (
                        <motion.div
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true, margin: '-40px' }}
                            variants={container}
                            className="flex flex-col gap-4"
                        >
                            {filteredEvents.map((event) => {
                                const isRegistrationOpen = event.status === 'Pendaftaran Dibuka'
                                const isDone = event.status === 'Selesai'

                                return (
                                    <motion.article
                                        key={event.id}
                                        variants={reveal}
                                        className={`group relative flex flex-col justify-between rounded-2xl border bg-white p-5 sm:p-6 shadow-xs transition hover:border-blue-300 hover:shadow-md md:flex-row md:items-center md:gap-6 ${
                                            isDone ? 'border-slate-200/70 opacity-80' : 'border-slate-200'
                                        }`}
                                    >
                                        <div className="flex items-start gap-4 flex-1">
                                            <div className="flex flex-col items-center justify-center shrink-0 size-16 sm:size-20 rounded-2xl border border-slate-200 bg-slate-50 text-center transition group-hover:border-blue-200 group-hover:bg-blue-50/60">
                                                <span className="text-xl sm:text-2xl font-black text-slate-900 leading-none group-hover:text-blue-600 transition-colors">
                                                    {event.date}
                                                </span>
                                                <span className="mt-1 text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-slate-500 group-hover:text-blue-600 transition-colors">
                                                    {event.month}
                                                </span>
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-700 border border-blue-100">
                                                        {event.category}
                                                    </span>

                                                    <span
                                                        className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                                                            event.status === 'Pendaftaran Dibuka'
                                                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                                : event.status === 'Segera Hadir'
                                                                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                                                    : 'bg-slate-100 text-slate-500 border border-slate-200'
                                                        }`}
                                                    >
                                                        {event.status}
                                                    </span>

                                                    {event.capacity && (
                                                        <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
                                                            • {event.capacity}
                                                        </span>
                                                    )}
                                                </div>

                                                <h3 className="mt-2 text-base sm:text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                                    {event.title}
                                                </h3>

                                                <p className="mt-1 text-xs font-medium leading-relaxed text-slate-500 max-w-2xl line-clamp-2">
                                                    {event.desc}
                                                </p>

                                                <div className="mt-3 flex flex-wrap items-center gap-y-1.5 gap-x-4 text-xs font-medium text-slate-500">
                                                    <span className="flex items-center gap-1.5">
                                                        <Clock className="size-3.5 text-blue-600" />
                                                        <span>{event.time}</span>
                                                    </span>
                                                    <span className="flex items-center gap-1.5">
                                                        <MapPin className="size-3.5 text-blue-600" />
                                                        <span>{event.location}</span>
                                                    </span>
                                                    {event.speaker && (
                                                        <span className="flex items-center gap-1.5 text-slate-400 hidden lg:flex">
                                                            <Users className="size-3.5" />
                                                            <span>{event.speaker}</span>
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3 md:mt-0 md:border-t-0 md:pt-0 md:flex-col md:items-end md:shrink-0">
                                            {isRegistrationOpen && (
                                                <button
                                                    onClick={() => setActiveModalEvent(event)}
                                                    className="inline-flex w-full sm:w-auto items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-blue-600/10 transition hover:bg-blue-500 active:scale-[0.98] cursor-pointer"
                                                >
                                                    <span>Daftar Acara</span>
                                                    <ArrowRight className="size-3.5" />
                                                </button>
                                            )}

                                            {!isDone && (
                                                <a
                                                    href={makeGoogleCalendarUrl(event)}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex w-full sm:w-auto items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50/50 hover:text-blue-600 active:scale-[0.98]"
                                                >
                                                    <CalendarPlus className="size-3.5" />
                                                    <span>Simpan Kalender</span>
                                                </a>
                                            )}

                                            {isDone && (
                                                <span className="text-xs font-semibold text-slate-400 py-1">
                                                    Kegiatan Terlaksana
                                                </span>
                                            )}
                                        </div>
                                    </motion.article>
                                )
                            })}
                        </motion.div>
                    ) : (
                        <div className="my-10 rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-xs">
                            <div className="mx-auto grid size-12 place-items-center rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 mb-3">
                                <CalendarDays className="size-6" />
                            </div>
                            <h3 className="text-base font-bold text-slate-900">
                                Tidak ada agenda ditemukan
                            </h3>
                            <p className="mt-1 text-xs text-slate-500 max-w-xs mx-auto font-medium">
                                Coba sesuaikan pencarian atau ganti filter kategori acara.
                            </p>
                            <button
                                onClick={() => {
                                    setSearchQuery('')
                                    setSelectedCategory('Semua')
                                }}
                                className="mt-4 rounded-xl bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition"
                            >
                                Reset Filter
                            </button>
                        </div>
                    )}
                </section>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="mt-16 sm:mt-20 rounded-2xl border border-slate-900 bg-slate-900 p-6 sm:p-8 text-white shadow-xs lg:flex lg:items-center lg:justify-between"
                >
                    <div className="max-w-xl">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-400">
                            Kolaborasi & Kemitraan Acara
                        </span>
                        <h3 className="mt-1 text-xl sm:text-2xl font-extrabold tracking-tight text-white">
                            Ingin Mengadakan Acara Bersama HIMATIFA?
                        </h3>
                        <p className="mt-1.5 text-xs text-slate-300 font-medium leading-relaxed">
                            Kami terbuka untuk kolaborasi seminar teknologi, campus visit perusahaan, kompetisi hackathon, maupun workshop edukasi industri.
                        </p>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-2.5 lg:mt-0">
                        <Link
                            href="/contact"
                            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-blue-600/10 transition hover:bg-blue-500 active:scale-[0.98]"
                        >
                            <span>Ajukan Kerja Sama</span>
                            <ArrowRight className="size-3.5" />
                        </Link>
                    </div>
                </motion.div>

                <footer className="mt-16 flex flex-col items-center justify-between gap-3 border-t border-slate-200 pt-6 pb-4 text-xs font-medium text-slate-400 sm:flex-row">
                    <p className="flex items-center gap-1.5">
                        <Copyright className="size-3.5" /> {new Date().getFullYear()} HIMATIFA Universitas Muhammadiyah Surabaya.
                    </p>
                    <div className="flex items-center gap-4 text-slate-500">
                        <Link href="/" className="hover:text-blue-600 transition">Beranda</Link>
                        <Link href="/about" className="hover:text-blue-600 transition">Profil</Link>
                        <Link href="/news" className="hover:text-blue-600 transition">Berita</Link>
                        <Link href="/contact" className="hover:text-blue-600 transition">Kontak</Link>
                    </div>
                </footer>
            </div>

            <AnimatePresence>
                {activeModalEvent && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setActiveModalEvent(null)}
                            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.98, y: 12 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.98, y: 12 }}
                            className="relative z-10 w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-xl sm:p-8"
                        >
                            <button
                                onClick={() => setActiveModalEvent(null)}
                                className="absolute right-4 top-4 grid size-8 place-items-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
                            >
                                <X className="size-4" />
                            </button>

                            {registeredSuccess ? (
                                <div className="py-8 text-center">
                                    <div className="mx-auto grid size-12 place-items-center rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 mb-3">
                                        <CheckCircle2 className="size-6" />
                                    </div>
                                    <h3 className="text-base font-bold text-slate-900">
                                        Registrasi Berhasil!
                                    </h3>
                                    <p className="mt-1.5 text-xs text-slate-500 font-medium">
                                        Terima kasih telah mendaftar pada acara <strong>{activeModalEvent.title}</strong>. Informasi konfirmasi telah dikirimkan.
                                    </p>
                                </div>
                            ) : (
                                <div>
                                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600">
                                        Registrasi Partisipan
                                    </span>
                                    <h3 className="mt-1 text-lg font-bold text-slate-900">
                                        {activeModalEvent.title}
                                    </h3>
                                    <div className="mt-2.5 flex flex-wrap gap-3 text-xs text-slate-500 font-medium border-b border-slate-100 pb-3">
                                        <span className="flex items-center gap-1">
                                            <CalendarDays className="size-3.5 text-blue-600" />
                                            {activeModalEvent.date} {activeModalEvent.month} {activeModalEvent.year}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock className="size-3.5 text-blue-600" />
                                            {activeModalEvent.time}
                                        </span>
                                    </div>

                                    <form onSubmit={handleRegisterSubmit} className="mt-4 flex flex-col gap-3.5">
                                        <div>
                                            <label className="mb-1 block text-xs font-semibold text-slate-700">
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
                                            <label className="mb-1 block text-xs font-semibold text-slate-700">
                                                NIM / Angkatan <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                placeholder="Contoh: 20240140001"
                                                className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 px-3.5 text-xs font-medium text-slate-900 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/10"
                                            />
                                        </div>

                                        <div>
                                            <label className="mb-1 block text-xs font-semibold text-slate-700">
                                                Nomor WhatsApp <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="tel"
                                                required
                                                placeholder="Contoh: 081234567890"
                                                className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 px-3.5 text-xs font-medium text-slate-900 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/10"
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-xs font-semibold text-white shadow-md shadow-blue-600/10 transition hover:bg-blue-500 active:scale-[0.98] cursor-pointer"
                                        >
                                            <span>Konfirmasi Pendaftaran</span>
                                        </button>
                                    </form>
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <BackToTop />
        </main>
    )
}