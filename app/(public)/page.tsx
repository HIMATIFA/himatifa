'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
    motion,
    AnimatePresence,
    useScroll,
    useTransform,
    useInView,
    animate,
    useReducedMotion,
} from 'framer-motion'
import {
    X,
    ArrowUpRight,
    ArrowRight,
    ChevronRight,
    ChevronDown,
    Play,
    Pause,
    Volume2,
    VolumeX,
    ZoomIn,
    Users,
    CalendarDays,
    Calendar,
    Clock,
    MapPin,
    HelpCircle,
    MessageSquareWarning,
    ArrowUp,
    Sparkles,
    Code2,
    Award,
} from 'lucide-react'
import {
    navLinks,
    heroContainer,
    heroItem,
    stats,
    container,
    reveal,
    revealStagger,
    misi,
    people,
    agenda,
    newsData,
    faqData,
} from '../data'

interface CounterProps {
    target: number
    suffix?: string
    isYear?: boolean
    duration?: number
}

function Counter({ target, suffix = '', isYear = false, duration = 2 }: CounterProps) {
    const ref = useRef<HTMLSpanElement>(null)
    const isInView = useInView(ref, { once: true, margin: '-40px' })
    const [count, setCount] = useState(isYear ? Math.max(0, target - 15) : 0)

    useEffect(() => {
        if (!isInView) return

        const startValue = isYear ? Math.max(0, target - 15) : 0

        const controls = animate(startValue, target, {
            duration: duration,
            ease: [0.16, 1, 0.3, 1],
            onUpdate: (latest) => {
                setCount(Math.floor(latest))
            },
        })

        return () => controls.stop()
    }, [isInView, target, isYear, duration])

    return (
        <span ref={ref}>
            {count}
            {suffix}
        </span>
    )
}

export default function Page() {
    const heroRef = useRef<HTMLElement>(null)
    const { scrollYProgress: heroProgress } = useScroll({
        target: heroRef,
        offset: ['start start', 'end start'],
    })
    const heroOpacity = useTransform(heroProgress, [0, 0.8], [1, 0])
    const heroY = useTransform(heroProgress, [0, 1], ['0%', '15%'])

    const videoRef = useRef<HTMLVideoElement>(null)
    const isVideoInView = useInView(videoRef, { margin: '-100px' })
    const [isVideoPlaying, setIsVideoPlaying] = useState(true)
    const [isVideoMuted, setIsVideoMuted] = useState(true)

    useEffect(() => {
        if (videoRef.current) {
            if (isVideoInView && isVideoPlaying) {
                videoRef.current.play().catch((err: unknown) => console.log('Autoplay ditunda oleh browser:', err))
            } else {
                videoRef.current.pause()
            }
        }
    }, [isVideoInView, isVideoPlaying])

    const toggleVideoPlay = useCallback(() => {
        if (!videoRef.current) return
        if (isVideoPlaying) {
            videoRef.current.pause()
            setIsVideoPlaying(false)
        } else {
            videoRef.current.play().catch(() => {})
            setIsVideoPlaying(true)
        }
    }, [isVideoPlaying])

    const toggleVideoMute = useCallback(() => {
        if (!videoRef.current) return
        const next = !isVideoMuted
        videoRef.current.muted = next
        setIsVideoMuted(next)
    }, [isVideoMuted])

    const [selectedPerson, setSelectedPerson] = useState<typeof people[number] | null>(null)

    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0)
    const toggleFAQ = (index: number) => {
        setOpenFaqIndex(openFaqIndex === index ? null : index)
    }

    const [backToTopVisible, setBackToTopVisible] = useState(false)
    const reduceMotion = useReducedMotion()

    useEffect(() => {
        const onScroll = () => setBackToTopVisible(window.scrollY > 600)
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    return (
        <main className="min-h-screen overflow-hidden bg-transparent text-[#0a192f]">
            <div className="pointer-events-none absolute inset-0 -z-10 feed-grid-squares opacity-80" />
            <div className="pointer-events-none absolute left-0 top-0 -z-10 h-full w-full overflow-hidden">
                <div className="feed-glow-orb-primary -left-20 top-20 size-[500px]" />
                <div className="feed-glow-orb-secondary -right-20 top-[40%] size-[600px]" />
            </div>

            {/* =========================================================================
                HERO SECTION
               ========================================================================= */}
            <section
                id="beranda"
                ref={heroRef}
                className="relative flex min-h-[100dvh] w-full flex-col items-center justify-center overflow-hidden bg-[#0a0f1d] px-4 sm:px-6 pb-16 sm:pb-20 pt-28 sm:pt-32"
            >
                <div
                    className="absolute inset-0 z-0 bg-cover bg-center opacity-80 mix-blend-luminosity"
                    style={{ backgroundImage: `url('/bg.webp')` }}
                />
                <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#0a0f1d]/60 via-[#0a0f1d]/85 to-[#0a0f1d]" />
                <div className="absolute inset-0 z-0 feed-grid-hero opacity-30 pointer-events-none" />
                <div className="absolute bottom-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-blue-400/25 to-transparent z-10" />
                <div className="absolute left-1/2 top-1/3 z-0 -translate-x-1/2 -translate-y-1/2 size-[360px] sm:size-[520px] rounded-full bg-blue-600/15 blur-[130px] pointer-events-none" />

                <motion.div
                    initial="hidden"
                    animate="show"
                    variants={heroContainer}
                    style={{ opacity: heroOpacity, y: heroY }}
                    className="relative z-10 flex w-full max-w-4xl flex-col items-center text-center mt-2 sm:mt-6"
                >
                    <motion.div variants={heroItem} className="flex items-center justify-center gap-3 mb-4 sm:mb-5">
                        <div className="h-[1px] w-6 sm:w-12 bg-blue-400/40" />
                        <span className="text-[10px] sm:text-xs font-bold tracking-[0.25em] uppercase text-blue-400">
                            HIMATIFA UMSURA
                        </span>
                        <div className="h-[1px] w-6 sm:w-12 bg-blue-400/40" />
                    </motion.div>

                    <motion.h1
                        variants={heroItem}
                        className="text-3xl xs:text-4xl sm:text-6xl md:text-6xl font-extrabold text-white leading-[1.15] tracking-tight mb-2 sm:mb-3"
                    >
                        HIMPUNAN MAHASISWA <br />
                        <span className="text-blue-500">INFORMATIKA</span>
                    </motion.h1>

                    <motion.p
                        variants={heroItem}
                        className="text-xs sm:text-sm md:text-base font-semibold text-slate-300 mb-6 sm:mb-7 tracking-[0.18em] uppercase"
                    >
                        Universitas Muhammadiyah Surabaya
                    </motion.p>

                    <motion.p
                        variants={heroItem}
                        className="text-xs sm:text-sm md:text-base leading-relaxed text-slate-300/90 max-w-xl mb-8 sm:mb-9 font-normal px-2"
                    >
                        Wadah kolaborasi mahasiswa Informatika Universitas Muhammadiyah Surabaya untuk mengasah kompetensi teknis dan berdaya saing global.
                    </motion.p>

                    <motion.div
                        variants={heroItem}
                        className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto px-4 sm:px-0"
                    >
                        <Link
                            href="/about"
                            className="group w-full sm:w-auto px-7 py-3.5 bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-semibold rounded-full transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2"
                        >
                            Profil HIMATIFA
                            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                        </Link>
                        <Link
                            href="/events"
                            className="w-full sm:w-auto px-7 py-3.5 bg-slate-900/60 border border-slate-700/80 hover:border-slate-500 text-slate-200 text-xs sm:text-sm font-medium rounded-full transition-all duration-200 hover:bg-slate-800/80 active:scale-[0.98] flex justify-center text-center backdrop-blur-sm"
                        >
                            Lihat Agenda
                        </Link>
                    </motion.div>

                    <motion.div
                        variants={heroItem}
                        className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-10 w-full max-w-3xl mt-12 sm:mt-16 pt-8 border-t border-slate-800/80"
                    >
                        {stats.map((s) => (
                            <div key={s.label} className="flex flex-col items-center">
                                <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                                    <Counter target={s.val} suffix={s.suffix} isYear={s.isYear} />
                                </div>
                                <div className="text-[10px] sm:text-xs mt-1 text-slate-400 uppercase tracking-wider font-medium text-center">
                                    {s.label}
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </motion.div>
            </section>

            {/* =========================================================================
                ABOUT SECTION (Background dengan Opacity agar Grid Tembus)
               ========================================================================= */}
            <section
                id="profil"
                aria-labelledby="profil-heading"
                className="relative scroll-mt-24 feed-section-white border-b border-slate-200/60 py-16 sm:py-20 lg:py-28"
            >
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, margin: '-80px' }}
                        variants={container}
                        className="mb-12 sm:mb-16 max-w-3xl"
                    >
                    <motion.div variants={revealStagger} className="inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-xs font-bold text-blue-600 shadow-xs mb-4">
                        <div className="h-[1px] w-6 sm:w-12 bg-blue-600/30" />
                        <span className="text-[10px] sm:text-xs font-bold tracking-[0.25em] uppercase text-blue-600">
                            Profil & Identitas HIMATIFA
                        </span>
                    </motion.div>

                    <motion.h2
                        id="profil-heading"
                        variants={revealStagger}
                        className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]"
                    >
                        Ruang Tumbuh Kolaboratif <br className="hidden sm:inline" />
                        <span className="text-blue-600">Talenta Digital Masa Depan</span>
                    </motion.h2>

                    <motion.p
                        variants={revealStagger}
                        className="mt-4 text-sm sm:text-base leading-relaxed text-slate-600 font-normal"
                    >
                        Episentrum kreativitas, riset teknologi, dan pembinaan karakter mahasiswa S1 Informatika Universitas Muhammadiyah Surabaya dalam menjawab tantangan era digital.
                    </motion.p>
                </motion.div>

                <motion.div
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: '-60px' }}
                    variants={container}
                    className="grid gap-8 lg:grid-cols-12 lg:items-stretch"
                >
                    {/* Visual Card Showcase with Real Image */}
                    <motion.div variants={revealStagger} className="lg:col-span-5 flex flex-col">
                        <div className="group relative flex-1 min-h-[380px] sm:min-h-[440px] w-full overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-3 shadow-xl shadow-blue-950/5 transition-all duration-300 hover:border-blue-300 hover:shadow-2xl hover:shadow-blue-900/10 flex flex-col justify-between">
                            {/* Background Image Container */}
                            <div className="absolute inset-0 z-0 overflow-hidden rounded-2xl">
                                <Image
                                    src="/bg.webp"
                                    alt="Dokumentasi Mahasiswa HIMATIFA UMSURA"
                                    fill
                                    sizes="(max-width: 1024px) 100vw, 40vw"
                                    className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                                    priority
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-slate-950/20" />
                            </div>

                            {/* Floating Badge: Top Left */}
                            <div className="relative z-10 flex items-center justify-between">
                                <div className="inline-flex items-center gap-2.5 rounded-2xl border border-white/60 bg-white/90 px-3.5 py-2 shadow-lg shadow-slate-950/10 backdrop-blur-md">
                                    <Image
                                        src="/himatifabg.png"
                                        alt="Logo HIMATIFA"
                                        width={28}
                                        height={28}
                                        className="object-contain"
                                    />
                                    <div className="flex flex-col">
                                        <span className="text-xs font-extrabold text-slate-900 leading-none">HIMATIFA</span>
                                        <span className="text-[9px] font-semibold text-blue-600 mt-0.5">S1 Informatika</span>
                                    </div>
                                </div>

                                <div className="rounded-full bg-blue-600/90 px-3 py-1 text-[11px] font-bold text-white shadow-md backdrop-blur-sm">
                                    Aktif & Progresif
                                </div>
                            </div>

                            {/* Overlay Content: Bottom */}
                            <div className="relative z-10 mt-auto pt-16">
                                <div className="rounded-2xl border border-white/20 bg-slate-900/80 p-5 backdrop-blur-md text-white">
                                    <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-wider mb-1.5">
                                        <Award className="size-4" />
                                        <span>Est. 10 Oktober 2020</span>
                                    </div>
                                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
                                        Wadah sinergi mahasiswa Informatika UM Surabaya dalam menumbuhkan inovasi karya, kepemimpinan, dan jejaring teknologi nasional.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Description & Pillars: Right Column */}
                    <motion.div variants={revealStagger} className="lg:col-span-7 flex flex-col justify-between gap-6">
                        {/* Brief Description Card */}
                        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">
                                Sekilas Tentang Organisasi
                            </span>
                            <h3 className="mt-1.5 text-xl sm:text-2xl font-bold tracking-tight text-slate-900 leading-snug">
                                Rumah Bertumbuh untuk Talenta Informatika yang Adaptif & Berkarakter
                            </h3>
                            <p className="mt-3.5 text-xs sm:text-sm leading-relaxed text-slate-600 font-normal">
                                Himpunan Mahasiswa Informatika (HIMATIFA) Universitas Muhammadiyah Surabaya adalah organisasi mahasiswa tingkat program studi yang menaungi seluruh aktivitas, aspirasi, dan akselerasi potensi mahasiswa S1 Informatika. Kami hadir sebagai inkubator pengembangan kompetensi teknologi, integritas etika, dan jejaring profesional yang siap bersaing di kancah global.
                            </p>

                            {/* 3 Core Pillars */}
                            <div className="mt-6 pt-6 border-t border-slate-100 grid gap-3.5 sm:grid-cols-3">
                                <div className="rounded-2xl border border-slate-200/70 bg-slate-50/80 p-4 transition-all duration-200 hover:border-blue-300 hover:bg-blue-50/40">
                                    <div className="grid size-9 place-items-center rounded-xl bg-blue-100 text-blue-600 mb-3">
                                        <Code2 className="size-4.5" />
                                    </div>
                                    <h4 className="text-sm font-bold text-slate-900 leading-tight">Inovasi Teknologi</h4>
                                    <p className="mt-1 text-[11px] leading-relaxed text-slate-600 font-normal">
                                        Mengasah kecakapan software engineering, AI, dan riset praktis berbasis proyek nyata.
                                    </p>
                                </div>

                                <div className="rounded-2xl border border-slate-200/70 bg-slate-50/80 p-4 transition-all duration-200 hover:border-blue-300 hover:bg-blue-50/40">
                                    <div className="grid size-9 place-items-center rounded-xl bg-blue-100 text-blue-600 mb-3">
                                        <Users className="size-4.5" />
                                    </div>
                                    <h4 className="text-sm font-bold text-slate-900 leading-tight">Soliditas Keluarga</h4>
                                    <p className="mt-1 text-[11px] leading-relaxed text-slate-600 font-normal">
                                        Menciptakan ruang inklusif yang saling membimbing dan menguatkan antar-generasi.
                                    </p>
                                </div>

                                <div className="rounded-2xl border border-slate-200/70 bg-slate-50/80 p-4 transition-all duration-200 hover:border-blue-300 hover:bg-blue-50/40">
                                    <div className="grid size-9 place-items-center rounded-xl bg-blue-100 text-blue-600 mb-3">
                                        <Award className="size-4.5" />
                                    </div>
                                    <h4 className="text-sm font-bold text-slate-900 leading-tight">Daya Saing Global</h4>
                                    <p className="mt-1 text-[11px] leading-relaxed text-slate-600 font-normal">
                                        Mendorong partisipasi kompetisi nasional, sertifikasi kompetensi, dan jejaring industri.
                                    </p>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col sm:flex-row items-center gap-3">
                                <Link
                                    href="/about"
                                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-xs sm:text-sm font-semibold text-white shadow-md shadow-blue-600/20 transition-all hover:bg-blue-500 active:scale-[0.98]"
                                >
                                    <span>Pelajari Profil & Filosofi Kami</span>
                                    <ArrowRight className="size-4" />
                                </Link>

                                <Link
                                    href="/departement"
                                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-xs sm:text-sm font-semibold text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 active:scale-[0.98]"
                                >
                                    <span>Lihat Struktur Departemen</span>
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
                </div>
            </section>

            {/* =========================================================================
                VIDEO SECTION (Background dengan Opacity agar Grid Tembus)
               ========================================================================= */}
            <section id="video-profil" className="relative feed-section-blue border-b border-blue-200/50 py-16 sm:py-20 lg:py-24">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={reveal}>
                    <div className="mb-12 text-center">
                        <h2 className="text-4xl font-black tracking-tight sm:text-5xl text-[#0a192f]">
                            Video Profil <br />
                            <span className="bg-gradient-to-r from-[#2563eb] to-sky-400 bg-clip-text text-transparent">
                                HIMATIFA.
                            </span>
                        </h2>
                    </div>

                    <div className="relative mx-auto w-full max-w-5xl overflow-hidden rounded-[2.5rem] border border-white/80 bg-white/60 p-3 shadow-2xl shadow-blue-900/10 backdrop-blur-xl">
                        <div className="group relative aspect-video w-full overflow-hidden rounded-[1.8rem] bg-slate-900">
                            <video
                                ref={videoRef}
                                src="/oscar.mp4"
                                loop
                                playsInline
                                muted={isVideoMuted}
                                className="size-full object-cover opacity-70 transition duration-700 group-hover:scale-105 group-hover:opacity-40"
                            />
                            <div className="absolute bottom-5 right-5 flex gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                <button
                                    onClick={toggleVideoPlay}
                                    aria-label={isVideoPlaying ? 'Pause video' : 'Play video'}
                                    className="grid size-10 place-items-center rounded-full bg-white/90 text-[#0a192f] shadow-lg backdrop-blur transition-transform hover:scale-105 active:scale-95"
                                >
                                    {isVideoPlaying ? <Pause className="size-4" /> : <Play className="size-4" />}
                                </button>
                                <button
                                    onClick={toggleVideoMute}
                                    aria-label={isVideoMuted ? 'Nyalakan suara' : 'Matikan suara'}
                                    className="grid size-10 place-items-center rounded-full bg-white/90 text-[#0a192f] shadow-lg backdrop-blur transition-transform hover:scale-105 active:scale-95"
                                >
                                    {isVideoMuted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
                                </button>
                            </div>
                            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                <div>
                                    <h3 className="text-2xl font-bold">After Movie OSCAR 2026</h3>
                                    <p className="mt-1 text-sm text-blue-100/80">Dokumenter Perjalanan S1 Informatika UMSURA</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
                </div>
            </section>

            {/* =========================================================================
                BPH SECTION (Background dengan Opacity agar Grid Tembus)
               ========================================================================= */}
            <section id="bph" className="relative scroll-mt-24 feed-section-white border-b border-slate-200/60 py-16 sm:py-20 lg:py-28">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-10 sm:mb-14 max-w-3xl">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="h-[1px] w-6 sm:w-12 bg-blue-600/30" />
                        <span className="text-[10px] sm:text-xs font-bold tracking-[0.25em] uppercase text-blue-600">
                            Badan Pengurus Harian
                        </span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
                        Nakhoda Kepengurusan <span className="text-blue-600">HIMATIFA</span>
                    </h2>
                    <p className="mt-3 text-sm sm:text-base leading-relaxed text-slate-600 font-normal">
                        Satu visi, empat peran strategis, dan komitmen bersama untuk menggerakkan organisasi secara berkelanjutan.
                    </p>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {people.map((person, i) => (
                        <motion.div
                            key={person.name}
                            initial={{ opacity: 0, y: 6 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-20px' }}
                            transition={{ delay: i * 0.04, duration: 0.25, ease: 'easeOut' }}
                            onClick={() => setSelectedPerson(person)}
                            className="group cursor-pointer flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm transition-all duration-200 hover:border-blue-300 hover:shadow-md"
                        >
                            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-slate-100">
                                <Image
                                    src={person.image}
                                    alt={person.name}
                                    fill
                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                    className="object-cover object-top transition-transform duration-300 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-slate-900/30 opacity-0 transition-opacity duration-200 group-hover:opacity-100 flex items-center justify-center">
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-slate-900 shadow-md backdrop-blur-sm">
                                        <ZoomIn className="size-3.5 text-blue-600" />
                                        <span>Lihat Detail</span>
                                    </span>
                                </div>
                            </div>

                            <div className="flex flex-col items-center text-center pt-4 pb-2 px-1">
                                <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-600">
                                    {person.role}
                                </span>
                                <h3 className="mt-1 text-sm sm:text-base font-bold text-slate-900 leading-snug">
                                    {person.name}
                                </h3>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <AnimatePresence>
                    {selectedPerson && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setSelectedPerson(null)}
                                className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm"
                            />

                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                transition={{ duration: 0.2, ease: 'easeOut' }}
                                className="relative z-10 w-full max-w-sm sm:max-w-md overflow-hidden rounded-2xl bg-white p-4 sm:p-5 shadow-2xl"
                            >
                                <button
                                    onClick={() => setSelectedPerson(null)}
                                    className="absolute right-4 top-4 z-20 flex size-8 items-center justify-center rounded-full bg-slate-900/60 text-white backdrop-blur-md transition-colors hover:bg-slate-900"
                                    aria-label="Tutup detail foto"
                                >
                                    <X className="size-4" />
                                </button>

                                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-slate-100">
                                    <Image
                                        src={selectedPerson.image}
                                        alt={selectedPerson.name}
                                        fill
                                        sizes="(max-width: 640px) 90vw, 400px"
                                        className="object-cover object-top"
                                        priority
                                    />
                                </div>

                                <div className="pt-4 text-center">
                                    <span className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                                        {selectedPerson.role}
                                    </span>
                                    <h3 className="mt-1 text-lg sm:text-xl font-bold text-slate-900">
                                        {selectedPerson.name}
                                    </h3>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
                </div>
            </section>

            {/* =========================================================================
                AGENDA SECTION (Background dengan Opacity agar Grid Tembus)
               ========================================================================= */}
            <section id="agenda" className="relative scroll-mt-24 feed-section-blue border-b border-blue-200/50 py-16 sm:py-20 lg:py-28">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-10 sm:mb-14 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-3 mb-3">
                                <div className="h-[1px] w-6 sm:w-12 bg-blue-600/30" />
                                <span className="text-[10px] sm:text-xs font-bold tracking-[0.25em] uppercase text-blue-600">
                                    Kalender Kegiatan
                                </span>
                            </div>
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
                                Agenda <span className="text-blue-600">Mendatang</span>
                            </h2>
                            <p className="mt-3 text-sm sm:text-base leading-relaxed text-slate-600 font-normal max-w-2xl">
                                Ikuti beragam kegiatan akademik, workshop teknologi, pengabdian, dan ajang kolaborasi mahasiswa Informatika UM Surabaya.
                            </p>
                        </div>

                        <Link
                            href="/events"
                            className="group hidden sm:inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-blue-600 transition-colors hover:text-blue-700"
                        >
                            <span>Lihat Semua Agenda</span>
                            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                        </Link>
                    </div>

                    <div className="grid gap-6 md:grid-cols-3">
                        {agenda.slice(0, 3).map((event, index) => {
                            const dayNumber = event.date.trim().split(' ')[0] || '01'

                            return (
                                <motion.div
                                    key={event.title}
                                    initial={{ opacity: 0, y: 6 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: '-20px' }}
                                    transition={{ delay: index * 0.04, duration: 0.25, ease: 'easeOut' }}
                                    className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white/95 p-5 sm:p-6 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-400 hover:shadow-xl hover:shadow-blue-900/10"
                                >
                                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-sky-400 to-indigo-600 rounded-t-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                                    <div>
                                        {/* Header Kartu: Date Box & Badges */}
                                        <div className="flex items-start justify-between gap-3 mb-4">
                                            <div className="flex size-14 shrink-0 flex-col items-center justify-center rounded-xl bg-blue-50 border border-blue-200/80 text-center transition-colors group-hover:bg-blue-600 group-hover:border-blue-600">
                                                <span className="text-xl font-black leading-none text-blue-600 group-hover:text-white transition-colors">
                                                    {dayNumber}
                                                </span>
                                                <span className="mt-1 text-[10px] font-extrabold tracking-wider uppercase text-blue-700 group-hover:text-blue-100 transition-colors">
                                                    {event.month}
                                                </span>
                                            </div>

                                            <div className="flex flex-col items-end gap-1.5">
                                                <span className="rounded-full bg-blue-50 border border-blue-200/60 px-2.5 py-0.5 text-[10px] font-bold text-blue-700">
                                                    {event.type || 'Event'}
                                                </span>
                                                <span className="text-[10px] font-semibold text-slate-400">
                                                    {event.status}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Judul & Deskripsi */}
                                        <div className="space-y-2">
                                            <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug transition-colors group-hover:text-blue-600 line-clamp-2">
                                                {event.title}
                                            </h3>
                                            <p className="text-xs sm:text-sm leading-relaxed text-slate-600 font-normal line-clamp-2">
                                                {event.desc}
                                            </p>
                                        </div>

                                        {/* Waktu & Lokasi */}
                                        <div className="mt-4 pt-3.5 border-t border-slate-100 space-y-1.5 text-xs text-slate-500">
                                            <div className="flex items-center gap-2">
                                                <Clock className="size-3.5 text-blue-600 shrink-0" />
                                                <span>{event.time}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <MapPin className="size-3.5 text-blue-600 shrink-0" />
                                                <span className="truncate">{event.place}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Footer */}
                                    <div className="mt-5 pt-3.5 border-t border-slate-100">
                                        <Link
                                            href="/events"
                                            className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-semibold text-slate-700 transition-all duration-200 hover:border-blue-600 hover:bg-blue-600 hover:text-white active:scale-[0.98]"
                                        >
                                            <CalendarDays className="size-3.5" />
                                            <span>Lihat Jadwal Lengkap</span>
                                        </Link>
                                    </div>
                                </motion.div>
                            )
                        })}
                    </div>

                    <div className="mt-8 flex justify-center sm:hidden">
                        <Link
                            href="/events"
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-xs font-semibold text-white shadow-md shadow-blue-600/10 transition-colors hover:bg-blue-500"
                        >
                            <span>Lihat Semua Agenda</span>
                            <ArrowRight className="size-4" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* =========================================================================
                NEWS SECTION (Background dengan Opacity agar Grid Tembus)
               ========================================================================= */}
            <section id="berita" className="relative scroll-mt-24 feed-section-white border-b border-slate-200/60 py-16 sm:py-20 lg:py-28">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-10 sm:mb-14 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-3">
                            <div className="h-[1px] w-6 sm:w-12 bg-blue-600/30" />
                            <span className="text-[10px] sm:text-xs font-bold tracking-[0.25em] uppercase text-blue-600">
                                Berita Terbaru
                            </span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900">
                            Kabar <span className="text-blue-600">Terbaru</span>
                        </h2>
                    </div>

                    <Link
                        href="/news"
                        className="group hidden sm:inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-blue-600 transition-colors hover:text-blue-700"
                    >
                        <span>Lihat Semua Kabar</span>
                        <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    {newsData.slice(0, 3).map((article, i) => (
                        <motion.article
                            key={article.id}
                            initial={{ opacity: 0, y: 6 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-20px' }}
                            transition={{ delay: i * 0.04, duration: 0.25, ease: 'easeOut' }}
                            className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-400 hover:shadow-xl hover:shadow-blue-900/10"
                        >
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-sky-400 to-indigo-600 z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                            <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                                <img
                                    src={article.image}
                                    alt={article.title}
                                    loading="lazy"
                                    className="size-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                                />
                                <span className="absolute left-3 top-3 rounded-md bg-slate-900/80 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
                                    {article.category}
                                </span>
                            </div>

                            <div className="flex flex-1 flex-col p-5 sm:p-6">
                                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
                                    {article.date}
                                </span>

                                <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug transition-colors group-hover:text-blue-600 line-clamp-2">
                                    {article.title}
                                </h3>

                                <p className="mt-2.5 flex-1 text-xs sm:text-sm leading-relaxed text-slate-600 font-normal line-clamp-3">
                                    {article.summary}
                                </p>

                                <div className="mt-6 pt-4 border-t border-slate-100">
                                    <a
                                        href={article.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-blue-600 transition-colors hover:text-blue-700"
                                    >
                                        <span>Baca Selengkapnya</span>
                                        <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                    </a>
                                </div>
                            </div>
                        </motion.article>
                    ))}
                </div>

                <div className="mt-8 flex justify-center sm:hidden">
                    <Link
                        href="/news"
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-xs sm:text-sm font-semibold text-white transition-all hover:bg-blue-500 active:scale-[0.98]"
                    >
                        <span>Lihat Semua Kabar</span>
                        <ArrowRight className="size-4" />
                    </Link>
                </div>
                </div>
            </section>

            {/* =========================================================================
                FAQ SECTION (Background dengan Opacity agar Grid Tembus)
               ========================================================================= */}
            <section id="faq" className="relative scroll-mt-24 feed-section-slate border-b border-slate-200/60 py-16 sm:py-20 lg:py-28">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-10 sm:mb-14 max-w-3xl">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="h-[1px] w-6 sm:w-12 bg-blue-600/30" />
                        <span className="text-[10px] sm:text-xs font-bold tracking-[0.25em] uppercase text-blue-600">
                            Pertanyaan Umum
                        </span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
                        Sering <span className="text-blue-600">Ditanyakan</span>
                    </h2>
                    <p className="mt-3 text-sm sm:text-base leading-relaxed text-slate-600 font-normal">
                        Punya pertanyaan seputar HIMATIFA UMSURA, kegiatan kampus, atau ingin menyampaikan keluhan? Temukan jawabannya di bawah ini.
                    </p>
                </div>

                <div className="mx-auto max-w-3xl space-y-3.5">
                    {faqData.slice(0, 3).map((item, index) => {
                        const isOpen = openFaqIndex === index

                        return (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 6 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: '-20px' }}
                                transition={{ delay: index * 0.04, duration: 0.25, ease: 'easeOut' }}
                                className={`overflow-hidden rounded-2xl border transition-all duration-200 ${
                                    isOpen
                                        ? 'border-blue-300 bg-white shadow-md'
                                        : 'border-slate-200 bg-white shadow-sm hover:border-slate-300'
                                }`}
                            >
                                <button
                                    onClick={() => toggleFAQ(index)}
                                    className="flex w-full items-center justify-between gap-4 p-5 sm:p-6 text-left transition-colors"
                                    aria-expanded={isOpen}
                                >
                                    <div className="flex items-center gap-3.5">
                                        <div
                                            className={`flex size-9 shrink-0 items-center justify-center rounded-xl transition-colors ${
                                                isOpen ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-600'
                                            }`}
                                        >
                                            <HelpCircle className="size-5" />
                                        </div>
                                        <span className="text-base sm:text-lg font-bold text-slate-900">
                                            {item.question}
                                        </span>
                                    </div>
                                    <div
                                        className={`flex size-8 shrink-0 items-center justify-center rounded-full border transition-all duration-200 ${
                                            isOpen
                                                ? 'rotate-180 border-blue-300 bg-blue-50 text-blue-600'
                                                : 'border-slate-200 text-slate-400'
                                        }`}
                                    >
                                        <ChevronDown className="size-4" />
                                    </div>
                                </button>

                                <AnimatePresence initial={false}>
                                    {isOpen && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.25, ease: 'easeInOut' }}
                                        >
                                            <div className="border-t border-slate-100 px-5 sm:px-6 pb-6 pt-4 text-xs sm:text-sm leading-relaxed text-slate-600 font-normal">
                                                {item.answer}

                                                {item.hasLink && (
                                                    <div className="mt-4 pt-2">
                                                        <Link
                                                            href="/aspirasi"
                                                            className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-semibold text-blue-600 transition-all hover:bg-blue-600 hover:text-white"
                                                        >
                                                            <MessageSquareWarning className="size-4" />
                                                            <span>Buka Layanan Suara Mahasiswa</span>
                                                            <ArrowRight className="size-3.5" />
                                                        </Link>
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        )
                    })}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.25, delay: 0.05 }}
                    className="mx-auto mt-12 max-w-3xl rounded-2xl border border-slate-800 bg-slate-900 p-6 sm:p-8 text-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-6"
                >
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
                        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
                            <MessageSquareWarning className="size-5" />
                        </div>
                        <div>
                            <h4 className="text-base font-bold text-white">Punya keluhan atau masukan fasilitas?</h4>
                            <p className="mt-1 text-xs sm:text-sm text-slate-300 font-normal">
                                Suara kamu sangat berharga untuk perbaikan fasilitas & layanan akademik.
                            </p>
                        </div>
                    </div>
                    <Link
                        href="/aspirasi"
                        className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-xs sm:text-sm font-semibold text-white transition-all hover:bg-blue-500 active:scale-[0.98]"
                    >
                        <span>Sampaikan Aspirasi</span>
                        <ArrowRight className="size-4" />
                    </Link>
                </motion.div>
                </div>
            </section>

            {/* =========================================================================
                BACK TO TOP BUTTON
               ========================================================================= */}
            <AnimatePresence>
                {backToTopVisible && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0.6, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.6, y: 20 }}
                        whileHover={reduceMotion ? undefined : { y: -3 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        aria-label="Kembali ke atas"
                        className="fixed bottom-6 right-6 z-50 grid size-12 place-items-center rounded-full bg-[#2563eb] text-white shadow-xl shadow-blue-600/30 transition-colors hover:bg-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 cursor-pointer"
                    >
                        <ArrowUp className="size-5" />
                    </motion.button>
                )}
            </AnimatePresence>
        </main>
    )
}
