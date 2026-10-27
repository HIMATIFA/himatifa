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
import {
    ArrowLeft,
    CalendarDays,
    MapPin,
    Users,
    ArrowRight,
    ArrowUp,
    Copyright,
    Clock,
    Sparkles,
    Search,
    X,
    CalendarPlus,
    CheckCircle2,
    ExternalLink
} from 'lucide-react'

interface EventItem {
    id: number
    date: string
    month: string
    year: string
    title: string
    time: string
    location: string
    category: 'Akademik' | 'Sosial' | 'Kreatif' | 'Organisasi'
    status: 'Pendaftaran Dibuka' | 'Segera Hadir' | 'Selesai'
    desc: string
    speaker?: string
    capacity?: string
}

const eventsData: EventItem[] = [
    {
        id: 1,
        date: '04',
        month: 'OKT',
        year: '2026',
        title: 'Study Club: GitHub & Modern Web Workflow',
        time: '13:00 - 15:30 WIB',
        location: 'Lab Komputer Terpadu 2, Gedung G Lt. 3',
        category: 'Akademik',
        status: 'Pendaftaran Dibuka',
        desc: 'Sesi hands-on belajar Git version control, kolaborasi open source di GitHub, dan best practices workflow pengembangan web modern.',
        speaker: 'Tim Riset & Edukasi PSDM',
        capacity: '40 Kursi Terbatas'
    },
    {
        id: 2,
        date: '18',
        month: 'OKT',
        year: '2026',
        title: 'HIMATIFA Care: Literasi & Pengabdian Masyarakat',
        time: '08:00 - 13:00 WIB',
        location: 'Kampung Nelayan Kenjeran & Panti Asuhan Surabaya',
        category: 'Sosial',
        status: 'Pendaftaran Dibuka',
        desc: 'Aksi sosial kemasyarakatan dan lokakarya pengenalan dasar komputer bagi anak-anak pesisir untuk mendukung pemerataan literasi digital.',
        speaker: 'Divisi Kesejahteraan Sosial (Kepsos)',
        capacity: 'Relawan Terbuka'
    },
    {
        id: 3,
        date: '10',
        month: 'NOV',
        year: '2026',
        title: 'Tech Clinic x Market Day HIMATIFA 2026',
        time: '09:00 - 16:00 WIB',
        location: 'Plaza Fakultas Teknik UMSurabaya',
        category: 'Kreatif',
        status: 'Segera Hadir',
        desc: 'Layanan gratis pembersihan hardware, instalasi OS, konsultasi software untuk civitas kampus, serta pameran produk kewirausahaan mahasiswa.',
        speaker: 'Kolaborasi Divisi Ekraf & PSDM',
        capacity: 'Umum & Bebas Registrasi'
    },
    {
        id: 4,
        date: '21',
        month: 'SEP',
        year: '2026',
        title: 'OSCAR 2026: Orientasi Studi & Kolaborasi Angkatan',
        time: '07:30 - 16:00 WIB',
        location: 'Auditorium UMSurabaya, Kampus Sutorejo',
        category: 'Organisasi',
        status: 'Selesai',
        desc: 'Penyambutan mahasiswa baru S1 Teknik Informatika, pengenalan kultur akademis, pameran komunitas himpunan, dan awarding inspiratif.',
        speaker: 'Panitia Pelaksana OSCAR 2026',
        capacity: 'Mahasiswa Baru 2026'
    }
]

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
            className="fixed bottom-6 right-6 z-50 grid size-11 place-items-center rounded-full bg-[#2563eb] text-white shadow-lg shadow-blue-600/30 transition-colors hover:bg-blue-600 cursor-pointer"
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
            const matchesSearch = !q ||
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
                        <span className="font-semibold text-[#2563eb]">Kalender Kegiatan</span>
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
                        <span>Agenda & Aktivitas Himpunan</span>
                    </motion.div>

                    <motion.h1
                        variants={reveal}
                        className="mt-4 text-3xl font-black tracking-tight text-[#0a192f] sm:text-5xl lg:text-6xl"
                    >
                        Jadwal Acara &{' '}
                        <span className="bg-gradient-to-r from-[#2563eb] to-sky-500 bg-clip-text text-transparent">
                            Kegiatan Mendatang.
                        </span>
                    </motion.h1>

                    <motion.p
                        variants={reveal}
                        className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg"
                    >
                        Ikuti workshop teknologi, bakti sosial, agenda pengkaderan, hingga diskusi interaktif bersama mahasiswa Informatika UMSURA.
                    </motion.p>
                </motion.div>

                <motion.div
                    initial="hidden"
                    animate="show"
                    variants={reveal}
                    className="mt-12 flex flex-col gap-4 rounded-2xl border border-slate-200/90 bg-white p-3 shadow-xs sm:flex-row sm:items-center sm:justify-between sm:p-4"
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
                                    className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
                                        isSelected
                                            ? 'bg-[#2563eb] text-white shadow-xs'
                                            : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                                    }`}
                                >
                                    <span>{category}</span>
                                    <span
                                        className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
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
                            className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2 pl-9 pr-8 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-3 focus:ring-blue-100 transition-all"
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

                <section className="mt-10">
                    <div className="mb-6 flex items-center justify-between text-xs font-semibold text-slate-500">
                        <span>
                            Menampilkan <strong className="text-[#0a192f]">{filteredEvents.length}</strong> agenda kegiatan
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
                                        className={`group relative flex flex-col justify-between rounded-2xl border bg-white p-6 shadow-xs transition-all duration-300 hover:border-blue-300 hover:shadow-md md:flex-row md:items-center md:gap-6 ${
                                            isDone
                                                ? 'border-slate-200/60 opacity-75'
                                                : 'border-slate-200/90'
                                        }`}
                                    >
                                        <div className="flex items-start gap-4 sm:gap-5 flex-1">
                                            <div className="flex flex-col items-center justify-center shrink-0 size-20 rounded-2xl border border-slate-200 bg-slate-50/90 text-center transition-colors group-hover:border-blue-200 group-hover:bg-blue-50/60">
                                                <span className="text-2xl font-black text-[#0a192f] leading-none group-hover:text-[#2563eb] transition-colors">
                                                    {event.date}
                                                </span>
                                                <span className="mt-1 text-[11px] font-bold uppercase tracking-wider text-slate-500 group-hover:text-blue-600 transition-colors">
                                                    {event.month}
                                                </span>
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <span className="rounded-md bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#2563eb] border border-blue-100">
                                                        {event.category}
                                                    </span>

                                                    <span
                                                        className={`rounded-md px-2.5 py-0.5 text-[10px] font-semibold ${
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
                                                        <span className="text-[11px] text-slate-400 hidden sm:inline">
                                                            • {event.capacity}
                                                        </span>
                                                    )}
                                                </div>

                                                <h3 className="mt-2 text-lg font-bold text-[#0a192f] group-hover:text-[#2563eb] transition-colors sm:text-xl">
                                                    {event.title}
                                                </h3>

                                                <p className="mt-1 text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
                                                    {event.desc}
                                                </p>

                                                <div className="mt-4 flex flex-wrap items-center gap-y-2 gap-x-4 text-xs font-medium text-slate-500">
                                                    <span className="flex items-center gap-1.5">
                                                        <Clock className="size-3.5 text-[#2563eb]" />
                                                        <span>{event.time}</span>
                                                    </span>
                                                    <span className="flex items-center gap-1.5">
                                                        <MapPin className="size-3.5 text-[#2563eb]" />
                                                        <span>{event.location}</span>
                                                    </span>
                                                    {event.speaker && (
                                                        <span className="flex items-center gap-1.5 text-slate-400">
                                                            <Users className="size-3.5" />
                                                            <span>{event.speaker}</span>
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4 md:mt-0 md:border-t-0 md:pt-0 md:flex-col md:items-end md:shrink-0">
                                            {isRegistrationOpen && (
                                                <button
                                                    onClick={() => setActiveModalEvent(event)}
                                                    className="inline-flex w-full sm:w-auto items-center justify-center gap-1.5 rounded-xl bg-[#2563eb] px-4 py-2.5 text-xs font-bold text-white transition-all hover:bg-blue-700 shadow-xs cursor-pointer"
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
                                                    className="inline-flex w-full sm:w-auto items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 transition-all hover:border-blue-300 hover:bg-blue-50/50 hover:text-[#2563eb]"
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
                        <div className="my-12 rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-xs">
                            <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-blue-50 text-[#2563eb]">
                                <CalendarDays className="size-8" />
                            </div>
                            <h3 className="mt-4 text-lg font-bold text-[#0a192f]">
                                Tidak Ada Agenda yang Cocok
                            </h3>
                            <p className="mt-1 text-sm text-slate-500 max-w-sm mx-auto">
                                Coba sesuaikan kata kunci pencarian atau ubah filter kategori agenda Anda.
                            </p>
                            <button
                                onClick={() => {
                                    setSearchQuery('')
                                    setSelectedCategory('Semua')
                                }}
                                className="mt-5 rounded-xl bg-blue-50 px-5 py-2.5 text-xs font-bold text-[#2563eb] transition-colors hover:bg-[#2563eb] hover:text-white cursor-pointer"
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
                    className="mt-20 rounded-3xl border border-slate-800 bg-[#071426] p-8 text-white shadow-xl sm:p-10 lg:flex lg:items-center lg:justify-between"
                >
                    <div className="max-w-xl">
                        <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                            Kolaborasi & Kemitraan Acara
                        </span>
                        <h3 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl text-white">
                            Ingin Mengadakan Acara Bersama HIMATIFA?
                        </h3>
                        <p className="mt-2 text-sm text-slate-300 leading-relaxed">
                            Kami terbuka untuk kolaborasi seminar teknologi, campus visit perusahaan, kompetisi hackathon, maupun workshop edukasi industri.
                        </p>
                    </div>

                    <div className="mt-6 flex flex-wrap gap-3 lg:mt-0">
                        <Link
                            href="/contact"
                            className="inline-flex items-center gap-2 rounded-xl bg-[#2563eb] px-5 py-3 text-xs font-bold text-white shadow-md transition-all hover:bg-blue-500"
                        >
                            <span>Ajukan Kerja Sama Acara</span>
                            <ArrowRight className="size-4" />
                        </Link>
                    </div>
                </motion.div>

                <footer className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-slate-200/80 pt-8 pb-4 text-xs font-medium text-slate-500 sm:flex-row">
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
                            Warta
                        </Link>
                        <Link href="/contact" className="hover:text-blue-600 transition-colors">
                            Kontak
                        </Link>
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
                            initial={{ opacity: 0, scale: 0.95, y: 16 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 16 }}
                            className="relative z-10 w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl sm:p-8"
                        >
                            <button
                                onClick={() => setActiveModalEvent(null)}
                                className="absolute right-5 top-5 grid size-8 place-items-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                            >
                                <X className="size-4" />
                            </button>

                            {registeredSuccess ? (
                                <div className="py-8 text-center">
                                    <div className="mx-auto grid size-12 place-items-center rounded-full bg-emerald-100 text-emerald-600">
                                        <CheckCircle2 className="size-6" />
                                    </div>
                                    <h3 className="mt-4 text-xl font-bold text-emerald-950">
                                        Registrasi Diterima!
                                    </h3>
                                    <p className="mt-2 text-xs sm:text-sm text-slate-600">
                                        Terima kasih telah mendaftar pada acara <strong>{activeModalEvent.title}</strong>. Konfirmasi jadwal telah dikirimkan.
                                    </p>
                                </div>
                            ) : (
                                <div>
                                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#2563eb]">
                                        Registrasi Partisipan
                                    </span>
                                    <h3 className="mt-1 text-xl font-black text-[#0a192f]">
                                        {activeModalEvent.title}
                                    </h3>
                                    <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-500 border-b border-slate-100 pb-4">
                                        <span className="flex items-center gap-1">
                                            <CalendarDays className="size-3.5 text-[#2563eb]" />
                                            {activeModalEvent.date} {activeModalEvent.month} {activeModalEvent.year}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock className="size-3.5 text-[#2563eb]" />
                                            {activeModalEvent.time}
                                        </span>
                                    </div>

                                    <form onSubmit={handleRegisterSubmit} className="mt-5 flex flex-col gap-4">
                                        <div>
                                            <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-600">
                                                Nama Lengkap
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                placeholder="Nama lengkap peserta"
                                                className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-2.5 text-xs sm:text-sm text-slate-900 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-3 focus:ring-blue-100 transition-all"
                                            />
                                        </div>

                                        <div>
                                            <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-600">
                                                NIM / Mahasiswa Angkatan
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                placeholder="Contoh: 202410370311xxx"
                                                className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-2.5 text-xs sm:text-sm text-slate-900 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-3 focus:ring-blue-100 transition-all"
                                            />
                                        </div>

                                        <div>
                                            <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-600">
                                                No. WhatsApp (Untuk Konfirmasi)
                                            </label>
                                            <input
                                                type="tel"
                                                required
                                                placeholder="08123456789"
                                                className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-2.5 text-xs sm:text-sm text-slate-900 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-3 focus:ring-blue-100 transition-all"
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#2563eb] py-3 text-xs sm:text-sm font-bold text-white shadow-xs hover:bg-blue-700 transition-colors cursor-pointer"
                                        >
                                            Konfirmasi Pendaftaran
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
