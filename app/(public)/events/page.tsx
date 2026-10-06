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
import { ArrowLeft, CalendarDays, MapPin, Users, ArrowRight, ArrowUp, Copyright } from 'lucide-react'

const eventsData = [
    {
        id: 1,
        date: '04',
        month: 'OKT',
        title: 'Study Club: GitHub & Web Dev',
        time: '13:00 - 15:00 WIB',
        location: 'Lab Komputer Terpadu 2',
        type: 'Akademik',
        desc: 'Sesi belajar bersama membahas version control system dan framework modern untuk pengembangan web.'
    },
    {
        id: 2,
        date: '18',
        month: 'OKT',
        title: 'HIMATIFA Care: Bakti Sosial',
        time: '08:00 - Selesai',
        location: 'Panti Asuhan Muhammadiyah, Surabaya',
        type: 'Sosial',
        desc: 'Kegiatan pengabdian masyarakat oleh Departemen Kesejahteraan Sosial sebagai bentuk kepedulian civitas Informatika.'
    },
    {
        id: 3,
        date: '10',
        month: 'NOV',
        title: 'Tech Clinic x Market Day',
        time: '09:00 - 16:00 WIB',
        location: 'Plaza Fakultas Teknik UMSurabaya',
        type: 'Ekraf & PSDM',
        desc: 'Layanan servis laptop gratis untuk mahasiswa teknik sekaligus bazar produk kreatif mahasiswa Informatika.'
    }
]

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

function BackToTop() {
    const [visible, setVisible] = useState(false)
    const reduce = useReducedMotion()

    useEffect(() => {
        const onScroll = () => setVisible(window.scrollY > 500)
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    return (
        <motion.button
            initial={false}
            animate={visible ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.6, y: 20 }}
            whileHover={reduce ? undefined : { y: -3 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="Kembali ke atas"
            className="fixed bottom-6 right-6 z-50 grid size-12 place-items-center rounded-full bg-[#2563eb] text-white shadow-xl shadow-blue-600/30 transition-colors hover:bg-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
        >
            <ArrowUp className="size-5" />
        </motion.button>
    )
}

export default function EventsPage() {
    const { scrollYProgress } = useScroll()
    const progressScale = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.4 })

    return (
        <main className="relative min-h-screen overflow-hidden bg-slate-50 px-4 py-12 text-[#0a192f] sm:px-6 lg:px-10 lg:py-20">
            <motion.div
                style={{ scaleX: progressScale }}
                className="fixed inset-x-0 top-0 z-[60] h-1 origin-left bg-gradient-to-r from-[#2563eb] via-sky-400 to-cyan-400"
                aria-hidden
            />

            <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]" />
            <div className="absolute left-[-10%] top-[-10%] -z-10 size-[500px] rounded-full bg-blue-400/20 blur-[120px]" />
            <div className="absolute right-[-5%] top-[20%] -z-10 size-[600px] rounded-full bg-cyan-300/15 blur-[150px]" />

            <div className="relative z-10 mx-auto max-w-4xl">
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
                    className="mb-16 mt-12 text-center"
                >
                    <motion.p variants={reveal} className="mb-3 text-xs font-bold uppercase tracking-[.2em] text-[#2563eb]">
                        Kalender Kegiatan
                    </motion.p>
                    <motion.h1 variants={reveal} className="text-4xl font-black tracking-tight sm:text-6xl">
                        Agenda{' '}
                        <span className="relative inline-block bg-gradient-to-r from-[#2563eb] via-sky-400 to-[#2563eb] bg-[length:200%_auto] bg-clip-text text-transparent animate-[gradient-move_4s_linear_infinite]">
                            HIMATIFA.
                            <svg aria-hidden className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
                                <path d="M2 9C50 3 150 3 198 9" stroke="#2563eb" strokeWidth="4" strokeLinecap="round" opacity="0.4" />
                            </svg>
                        </span>
                    </motion.h1>
                    <motion.p variants={reveal} className="mx-auto mt-6 max-w-xl text-[15px] leading-relaxed text-slate-500">
                        Jangan sampai kelewatan momen penting. Simpan jadwalnya dan ikut ambil bagian dalam setiap keseruan acara S1 Informatika UMSURA.
                    </motion.p>
                </motion.div>

                <motion.div
                    initial="hidden" animate="show" variants={container}
                    className="flex flex-col gap-6"
                >
                    {eventsData.map((event) => (
                        <motion.div
                            key={event.id}
                            variants={listItem}
                            className="group relative flex flex-col gap-6 overflow-hidden rounded-[2.5rem] border border-white/80 bg-white/70 p-6 shadow-xl shadow-blue-900/5 backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:border-blue-200/50 hover:shadow-2xl hover:shadow-blue-900/10 sm:flex-row sm:items-center sm:p-8"
                        >
                            <div className="grid size-24 shrink-0 place-items-center rounded-[1.5rem] bg-[#0a192f] text-center text-white shadow-inner transition-all duration-500 group-hover:scale-105 group-hover:bg-[#2563eb] group-hover:shadow-lg group-hover:shadow-blue-500/30">
                                <div>
                                    <div className="text-3xl font-black leading-none">{event.date}</div>
                                    <div className="mt-1.5 text-[10px] font-bold tracking-[0.2em] text-blue-200 transition-colors group-hover:text-white">{event.month}</div>
                                </div>
                            </div>

                            <div className="flex-1">
                                <span className="mb-3 inline-block rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-[#2563eb]">
                                    {event.type}
                                </span>
                                <h3 className="text-2xl font-extrabold leading-tight text-[#0a192f] transition-colors group-hover:text-[#2563eb]">
                                    {event.title}
                                </h3>
                                <p className="mt-2 text-[14.5px] leading-relaxed text-slate-500">
                                    {event.desc}
                                </p>

                                <div className="mt-5 flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-500">
                                    <div className="flex items-center gap-1.5 rounded-lg bg-slate-100/80 px-3 py-2 transition-colors group-hover:bg-blue-50/50 group-hover:text-slate-600">
                                        <CalendarDays className="size-4 text-[#2563eb]" /> {event.time}
                                    </div>
                                    <div className="flex items-center gap-1.5 rounded-lg bg-slate-100/80 px-3 py-2 transition-colors group-hover:bg-blue-50/50 group-hover:text-slate-600">
                                        <MapPin className="size-4 text-[#2563eb]" /> {event.location}
                                    </div>
                                </div>
                            </div>

                            <div className="shrink-0 border-t border-slate-200/60 pt-5 sm:border-l sm:border-t-0 sm:pl-8 sm:pt-0">
                                <button className="group/btn flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-6 py-4 text-sm font-bold text-[#2563eb] shadow-sm ring-1 ring-slate-200 transition-all hover:bg-[#2563eb] hover:text-white hover:ring-[#2563eb] hover:shadow-lg hover:shadow-blue-500/30 sm:w-auto">
                                    <Users className="size-4" />
                                    <span>Daftar Acara</span>
                                    <ArrowRight className="size-4 origin-left transition-transform group-hover/btn:scale-110" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
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

            <BackToTop />
        </main>
    )
}