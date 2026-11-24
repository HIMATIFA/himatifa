'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
    motion,
    AnimatePresence,
    useScroll,
    useSpring,
    useTransform,
    useInView,
    animate,
    useReducedMotion,
} from 'framer-motion'
import {
    Menu,
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
    Globe,
    HeartHandshake,
    Lightbulb,
    Megaphone,
    CalendarDays,
    MapPin,
    HelpCircle,
    MessageSquareWarning,
    Mail,
    Phone,
    Copyright,
    ArrowUp,
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
    departments,
    DepartmentKey,
    agenda,
    newsData,
    faqData,
    socials,
} from '../data'

/* -------------------------------------------------------------------------
   Helper: Animated Counter Component
   ------------------------------------------------------------------------- */
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

const departmentIcons: Record<DepartmentKey, React.ElementType> = {
    PSDM: Users,
    Deplu: Globe,
    Kepsos: HeartHandshake,
    Ekraf: Lightbulb,
    Medkominfo: Megaphone,
}

/* -------------------------------------------------------------------------
   Main Landing Page (Single export default function with single return)
   ------------------------------------------------------------------------- */
export default function Page() {
    /* 1. Navbar State & Hooks */
    const [mobileOpen, setMobileOpen] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)
    const { scrollYProgress } = useScroll()
    const progressScale = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.4 })

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20)
        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    useEffect(() => {
        document.body.style.overflow = mobileOpen ? 'hidden' : ''
        return () => {
            document.body.style.overflow = ''
        }
    }, [mobileOpen])

    /* 2. Hero Section Hooks */
    const heroRef = useRef<HTMLElement>(null)
    const { scrollYProgress: heroProgress } = useScroll({
        target: heroRef,
        offset: ['start start', 'end start'],
    })
    const heroOpacity = useTransform(heroProgress, [0, 0.8], [1, 0])
    const heroY = useTransform(heroProgress, [0, 1], ['0%', '15%'])

    /* 3. Video Section State & Hooks */
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

    /* 4. BPH Section State */
    const [selectedPerson, setSelectedPerson] = useState<typeof people[number] | null>(null)

    /* 5. Department Section State */
    const [activeDepartment, setActiveDepartment] = useState<DepartmentKey>('PSDM')
    const currentDepartment = departments[activeDepartment]
    const DepartmentIconComponent = departmentIcons[activeDepartment] || Users
    const departmentKeys = Object.keys(departments) as DepartmentKey[]
    const activeDeptIndex = departmentKeys.indexOf(activeDepartment) + 1

    /* 6. FAQ Section State */
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(3)
    const toggleFAQ = (index: number) => {
        setOpenFaqIndex(openFaqIndex === index ? null : index)
    }

    /* 7. Back To Top State & Hooks */
    const [backToTopVisible, setBackToTopVisible] = useState(false)
    const reduceMotion = useReducedMotion()

    useEffect(() => {
        const onScroll = () => setBackToTopVisible(window.scrollY > 600)
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    return (
        <main className="min-h-screen overflow-hidden bg-[#f4f8fc] text-[#0a192f]">
            {/* Background Ambient Glow */}
            <div className="pointer-events-none absolute left-0 top-0 -z-10 h-full w-full overflow-hidden">
                <div className="absolute left-[-10%] top-[-5%] h-[500px] w-[500px] rounded-full bg-blue-400/20 blur-[120px]" />
                <div className="absolute right-[-5%] top-[20%] h-[600px] w-[600px] rounded-full bg-cyan-300/20 blur-[150px]" />
            </div>

            {/* Scroll Progress Bar */}
            <motion.div
                style={{ scaleX: progressScale }}
                className="fixed inset-x-0 top-0 z-[70] h-1 origin-left bg-gradient-to-r from-blue-600 via-sky-400 to-cyan-400"
                aria-hidden
            />

            {/* =========================================================================
                NAVBAR
               ========================================================================= */}
            <header
                className={`fixed inset-x-0 z-50 flex justify-center transition-all duration-500 ease-out ${
                    isScrolled ? 'top-3 sm:top-4 px-4 sm:px-6' : 'top-0 px-0'
                }`}
            >
                <nav
                    className={`flex items-center justify-between transition-all duration-500 ease-out ${
                        isScrolled
                            ? 'w-full max-w-5xl rounded-full border border-slate-200/60 bg-white/90 px-4 sm:px-6 py-2.5 shadow-lg shadow-blue-950/5 backdrop-blur-xl'
                            : 'w-full border-b border-transparent bg-transparent px-6 py-4 sm:px-10'
                    }`}
                >
                    <Link
                        href="/"
                        className="group flex items-center gap-3 transition-transform duration-300 hover:scale-[1.02]"
                    >
                        <Image
                            src="/himatifabg.png"
                            alt="Logo HIMATIFA UMSurabaya"
                            width={38}
                            height={38}
                            className="shrink-0 object-contain transition-transform duration-300 group-hover:rotate-3"
                        />
                        <div className="flex flex-col justify-center">
                            <span
                                className={`text-base font-extrabold leading-none tracking-tight transition-colors ${
                                    isScrolled ? 'text-slate-900' : 'text-white'
                                }`}
                            >
                                HIMATIFA
                            </span>
                            <span
                                className={`mt-0.5 text-[10px] font-medium leading-none tracking-wide transition-colors ${
                                    isScrolled ? 'text-slate-500' : 'text-slate-300'
                                }`}
                            >
                                Himpunan Mahasiswa Informatika
                            </span>
                        </div>
                    </Link>

                    <div className="hidden items-center gap-7 text-[13px] font-semibold lg:flex">
                        {navLinks.map((item) => (
                            <Link
                                key={item.name}
                                href={item.path}
                                className={`relative transition-colors after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:rounded-full after:bg-blue-500 after:transition-all after:duration-300 hover:after:w-full ${
                                    isScrolled ? 'text-slate-600 hover:text-blue-600' : 'text-slate-300 hover:text-white'
                                }`}
                            >
                                {item.name}
                            </Link>
                        ))}
                        <a
                            href="#departemen"
                            className={`relative transition-colors after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:rounded-full after:bg-blue-500 after:transition-all after:duration-300 hover:after:w-full ${
                                isScrolled ? 'text-slate-600 hover:text-blue-600' : 'text-slate-300 hover:text-white'
                            }`}
                        >
                            Departemen
                        </a>
                    </div>

                    <Link
                        href="/ekrafstore"
                        className="hidden items-center rounded-full bg-blue-600 px-5 py-2 text-xs font-bold text-white shadow-md shadow-blue-600/20 transition-all hover:-translate-y-0.5 hover:bg-blue-500 hover:shadow-lg lg:flex"
                    >
                        Ekraf Store <ArrowUpRight className="ml-1 size-3.5" />
                    </Link>

                    <button
                        aria-label={mobileOpen ? 'Tutup menu' : 'Buka menu'}
                        onClick={() => setMobileOpen(true)}
                        className={`rounded-full p-2 lg:hidden transition-colors ${
                            isScrolled ? 'text-slate-700 hover:bg-slate-100' : 'text-white hover:bg-white/10'
                        }`}
                    >
                        <Menu className="size-6" />
                    </button>
                </nav>
            </header>

            {/* Mobile Navigation Drawer */}
            <AnimatePresence>
                {mobileOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            onClick={() => setMobileOpen(false)}
                            className="fixed inset-0 z-[80] bg-slate-950/60 backdrop-blur-sm lg:hidden"
                        />

                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 right-0 z-[90] flex w-full max-w-xs flex-col justify-between bg-slate-900 border-l border-slate-800 p-6 shadow-2xl lg:hidden"
                        >
                            <div>
                                <div className="flex items-center justify-between pb-6 border-b border-slate-800">
                                    <div className="flex items-center gap-2.5">
                                        <Image
                                            src="/himatifabg.png"
                                            alt="Logo HIMATIFA"
                                            width={32}
                                            height={32}
                                            className="object-contain"
                                        />
                                        <div className="flex flex-col">
                                            <span className="text-sm font-extrabold text-white leading-none">HIMATIFA</span>
                                            <span className="text-[9px] font-medium text-slate-400 mt-0.5">UM Surabaya</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setMobileOpen(false)}
                                        className="rounded-full p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                                        aria-label="Tutup menu"
                                    >
                                        <X className="size-5" />
                                    </button>
                                </div>

                                <div className="mt-6 flex flex-col gap-1.5">
                                    {navLinks.map((item, i) => (
                                        <motion.div
                                            key={item.name}
                                            initial={{ opacity: 0, x: 16 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.05 * i }}
                                        >
                                            <Link
                                                onClick={() => setMobileOpen(false)}
                                                href={item.path}
                                                className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-800 hover:text-white active:bg-blue-600/10"
                                            >
                                                {item.name}
                                                <ChevronRight className="size-4 text-slate-500" />
                                            </Link>
                                        </motion.div>
                                    ))}
                                    <motion.div
                                        initial={{ opacity: 0, x: 16 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.05 * navLinks.length }}
                                    >
                                        <a
                                            onClick={() => setMobileOpen(false)}
                                            href="#departemen"
                                            className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-800 hover:text-white active:bg-blue-600/10"
                                        >
                                            Departemen
                                            <ChevronRight className="size-4 text-slate-500" />
                                        </a>
                                    </motion.div>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-slate-800">
                                <Link
                                    onClick={() => setMobileOpen(false)}
                                    href="/ekrafstore"
                                    className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/25 transition-all hover:bg-blue-500 active:scale-[0.98]"
                                >
                                    Ekraf Store <ArrowUpRight className="size-4" />
                                </Link>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

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
                <div className="absolute left-1/2 top-1/3 z-0 -translate-x-1/2 -translate-y-1/2 size-[360px] sm:size-[520px] rounded-full bg-blue-600/15 blur-[120px] pointer-events-none" />

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
                ABOUT SECTION
               ========================================================================= */}
            <section
                id="profil"
                aria-labelledby="profil-heading"
                className="relative mx-auto max-w-7xl scroll-mt-24 bg-[var(--background)] px-4 md:px-6 lg:px-8 py-20 lg:py-28"
            >
                <motion.div
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: '-80px' }}
                    variants={container}
                    className="mb-10 sm:mb-14 max-w-3xl"
                >
                    <motion.div variants={revealStagger} className="flex items-center gap-3 mb-4">
                        <div className="h-[1px] w-6 sm:w-12 bg-[var(--border)]" />
                        <span className="font-mono text-xs font-bold tracking-[0.16em] uppercase text-[var(--primary)]">
                            Tentang Kami
                        </span>
                    </motion.div>

                    <motion.h2
                        id="profil-heading"
                        variants={revealStagger}
                        className="text-[clamp(2rem,4vw,3.25rem)] font-extrabold tracking-[-0.035em] text-[var(--foreground)] leading-[1.08]"
                    >
                        Membangun Ruang Tumbuh untuk <br className="hidden sm:inline" />
                        <span className="text-[var(--primary)]">Talenta Digital Masa Depan</span>
                    </motion.h2>

                    <motion.p
                        variants={revealStagger}
                        className="mt-4 text-[1.125rem] leading-[1.6] text-[var(--muted-foreground)] font-normal tracking-[-0.01em]"
                    >
                        HIMATIFA Universitas Muhammadiyah Surabaya adalah episentrum kolaborasi mahasiswa S1 Informatika. Kami menjembatani teori akademis dengan kebutuhan industri melalui proyek nyata, jejaring profesional, dan kultur kebersamaan.
                    </motion.p>
                </motion.div>

                <motion.div
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: '-60px' }}
                    variants={container}
                    className="grid gap-4 lg:gap-6 lg:grid-cols-12 lg:items-stretch"
                >
                    <motion.div variants={revealStagger} className="lg:col-span-5">
                        <div className="flex h-full flex-col justify-between rounded-3xl border border-[var(--dark-border)] bg-[var(--dark-bg)] p-7 sm:p-9 shadow-[0_12px_36px_-8px_rgba(10,25,47,0.06)]">
                            <div>
                                <div className="inline-flex items-center gap-2 rounded-full bg-[var(--dark-surface)] border border-[var(--dark-border)] px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] font-mono text-[var(--dark-ink)]">
                                    <span className="size-1.5 rounded-full bg-[var(--primary)]" />
                                    Visi Utama
                                </div>

                                <blockquote className="mt-6 text-xl sm:text-2xl font-bold leading-[1.25] tracking-[-0.02em] text-[var(--dark-ink)]">
                                    &ldquo;Menjadi ruang tumbuh bagi talenta digital yang adaptif, kolaboratif, dan solutif bagi peradaban.&rdquo;
                                </blockquote>

                                <p className="mt-4 text-sm leading-[1.6] text-[var(--dark-muted)] font-normal">
                                    Mendorong mahasiswa Informatika untuk aktif bereksplorasi, mengasah kepemimpinan, dan membangun portofolio karya nyata yang diakui secara profesional.
                                </p>
                            </div>

                            <div className="mt-8 pt-6 border-t border-[var(--dark-border)]">
                                <div className="mb-5 flex flex-wrap gap-2 text-xs font-medium font-mono tabular-nums text-[var(--dark-muted)]">
                                    <span className="rounded-md bg-[var(--dark-surface)] px-2.5 py-1 border border-[var(--dark-border)]">
                                        Inovasi Terarah
                                    </span>
                                    <span className="rounded-md bg-[var(--dark-surface)] px-2.5 py-1 border border-[var(--dark-border)]">
                                        Etika & Karakter
                                    </span>
                                    <span className="rounded-md bg-[var(--dark-surface)] px-2.5 py-1 border border-[var(--dark-border)]">
                                        Karya Berdampak
                                    </span>
                                </div>

                                <Link
                                    href="/about"
                                    className="group flex items-center justify-between w-full min-h-[44px] rounded-xl bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-[var(--primary-foreground)] transition-all hover:bg-[var(--primary-hover)] active:scale-[0.98]"
                                >
                                    <span>Pelajari Profil & Filosofi Kami</span>
                                    <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                </Link>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div variants={revealStagger} className="flex flex-col justify-between gap-4 lg:gap-6 lg:col-span-7">
                        {misi.map((item, index) => {
                            const numberStr = String(index + 1).padStart(2, '0')

                            return (
                                <div
                                    key={item.title}
                                    className="group flex flex-col justify-between rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-[#93C5FD] hover:shadow-[0_12px_36px_-8px_rgba(10,25,47,0.06)]"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="grid size-11 shrink-0 place-items-center rounded-xl border border-[var(--border)] bg-[var(--surface-subtle)] text-[var(--foreground)] transition-colors group-hover:bg-[var(--primary)] group-hover:text-[var(--primary-foreground)]">
                                                {index % 3 === 0 && (
                                                    <svg className="size-5" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="2" />
                                                        <path d="M3.5 19C3.5 15.9624 5.96243 13.5 9 13.5C12.0376 13.5 14.5 15.9624 14.5 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                                        <path d="M17 14V7M17 7L14.5 9.5M17 7L19.5 9.5" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                        <path d="M14 19H20" stroke="var(--accent-cyan)" strokeWidth="2" strokeLinecap="round" />
                                                    </svg>
                                                )}
                                                {index % 3 === 1 && (
                                                    <svg className="size-5" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <rect x="2" y="3" width="20" height="18" rx="4" stroke="currentColor" strokeWidth="2" />
                                                        <path d="M8.5 9L5.5 12L8.5 15" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                        <path d="M15.5 9L18.5 12L15.5 15" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                        <path d="M13 8L11 16" stroke="var(--accent-cyan)" strokeWidth="2" strokeLinecap="round" />
                                                    </svg>
                                                )}
                                                {index % 3 === 2 && (
                                                    <svg className="size-5" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <circle cx="12" cy="12" r="3" stroke="var(--primary)" strokeWidth="2" />
                                                        <circle cx="5" cy="6" r="2" stroke="currentColor" strokeWidth="2" />
                                                        <circle cx="19" cy="6" r="2" stroke="currentColor" strokeWidth="2" />
                                                        <circle cx="5" cy="18" r="2" stroke="currentColor" strokeWidth="2" />
                                                        <circle cx="19" cy="18" r="2" stroke="currentColor" strokeWidth="2" />
                                                        <path d="M6.5 7.5L9.8 10.2M17.5 7.5L14.2 10.2M6.5 16.5L9.8 13.8M17.5 16.5L14.2 13.8" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
                                                    </svg>
                                                )}
                                            </div>
                                            <div>
                                                <span className="font-mono text-[12px] font-bold uppercase tracking-[0.16em] text-[var(--primary)]">
                                                    {item.tag}
                                                </span>
                                                <h3 className="text-[1.125rem] font-bold text-[var(--foreground)] tracking-[-0.02em] leading-[1.25]">
                                                    {item.title}
                                                </h3>
                                            </div>
                                        </div>
                                        <span className="font-mono text-xl font-medium tabular-nums text-[var(--border)] transition-colors group-hover:text-[#93C5FD]">
                                            {numberStr}
                                        </span>
                                    </div>
                                    <p className="mt-3 text-[1rem] leading-[1.6] text-[var(--muted-foreground)] font-normal">
                                        {item.desc}
                                    </p>
                                </div>
                            )
                        })}
                    </motion.div>
                </motion.div>
            </section>

            {/* =========================================================================
                VIDEO SECTION
               ========================================================================= */}
            <section id="video-profil" className="relative mx-auto max-w-7xl px-6 pb-24 lg:px-10">
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
            </section>

            {/* =========================================================================
                BPH SECTION
               ========================================================================= */}
            <section id="bph" className="relative mx-auto max-w-7xl scroll-mt-24 px-4 sm:px-6 py-20 lg:px-8 lg:py-28">
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
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-40px' }}
                            transition={{ delay: i * 0.08, duration: 0.4, ease: 'easeOut' }}
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
            </section>

            {/* =========================================================================
                DEPARTMENT SECTION
               ========================================================================= */}
            <section id="departemen" className="mx-auto max-w-7xl scroll-mt-24 px-4 sm:px-6 py-20 lg:px-8 lg:py-28">
                <div className="mb-10 sm:mb-14 max-w-3xl">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="h-[1px] w-6 sm:w-12 bg-blue-600/30" />
                        <span className="text-[10px] sm:text-xs font-bold tracking-[0.25em] uppercase text-blue-600">
                            Struktur Gerak
                        </span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
                        Pilar <span className="text-blue-600">Penggerak Organisasi</span>
                    </h2>
                    <p className="mt-3 text-sm sm:text-base leading-relaxed text-slate-600 font-normal">
                        Lima departemen utama yang menjalankan fungsi strategis HIMATIFA UMSURA dalam pelayanan, pengembangan, dan karya nyata.
                    </p>
                </div>

                <div className="grid gap-6 lg:grid-cols-[260px_1fr] lg:gap-8 items-start">
                    <div className="flex flex-row overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0 gap-2 snap-x hide-scrollbar">
                        {departmentKeys.map((key) => {
                            const isActive = activeDepartment === key
                            return (
                                <button
                                    key={key}
                                    onClick={() => setActiveDepartment(key)}
                                    className={`group shrink-0 snap-start flex items-center justify-between rounded-xl px-4 py-3.5 text-left text-xs sm:text-sm font-semibold transition-all duration-200 ${
                                        isActive
                                            ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                                            : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/80'
                                    }`}
                                >
                                    <span className="whitespace-nowrap font-bold">{key}</span>
                                    <ChevronRight
                                        className={`hidden size-4 transition-transform lg:block ${
                                            isActive ? 'translate-x-0.5 text-white' : 'text-slate-400 group-hover:text-slate-600'
                                        }`}
                                    />
                                </button>
                            )
                        })}
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-9 shadow-sm">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeDepartment}
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -12 }}
                                transition={{ duration: 0.25, ease: 'easeOut' }}
                            >
                                <div className="flex items-start justify-between gap-4 mb-6 sm:mb-8">
                                    <div>
                                        <div className="mb-4 grid size-12 place-items-center rounded-xl border border-blue-100 bg-blue-50 text-blue-600">
                                            <DepartmentIconComponent className="size-6" />
                                        </div>
                                        <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-600">
                                            Departemen {activeDepartment}
                                        </span>
                                        <h3 className="mt-1 text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                                            {currentDepartment.label}
                                        </h3>
                                    </div>
                                    <span className="hidden sm:block text-5xl font-extrabold text-slate-200">
                                        0{activeDeptIndex}
                                    </span>
                                </div>

                                <p className="text-xs sm:text-sm leading-relaxed text-slate-600 font-normal">
                                    {currentDepartment.desc}
                                </p>

                                <div className="mt-8 pt-6 border-t border-slate-100">
                                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3 sm:mb-4">
                                        Program Kerja Unggulan
                                    </h4>
                                    <div className="grid gap-3 sm:grid-cols-3">
                                        {currentDepartment.programs.map((program: string, i: number) => (
                                            <motion.div
                                                key={program}
                                                initial={{ opacity: 0, y: 8 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.05 * i, duration: 0.2 }}
                                                className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-xs sm:text-sm font-semibold text-slate-800 transition-all hover:border-blue-300 hover:bg-blue-50/50"
                                            >
                                                <span className="size-2 rounded-full bg-blue-600 shrink-0" />
                                                <span>{program}</span>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </section>

            {/* =========================================================================
                AGENDA SECTION
               ========================================================================= */}
            <section id="agenda" className="relative bg-[#0a0f1d] px-4 sm:px-6 py-20 text-white lg:px-8 lg:py-28">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-10 sm:mb-14 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-3 mb-3">
                                <div className="h-[1px] w-6 sm:w-12 bg-blue-400/40" />
                                <span className="text-[10px] sm:text-xs font-bold tracking-[0.25em] uppercase text-blue-400">
                                    Kalender Kegiatan
                                </span>
                            </div>
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
                                Agenda <span className="text-blue-500">Mendatang</span>
                            </h2>
                        </div>

                        <Link
                            href="/events"
                            className="group hidden sm:inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-blue-400 transition-colors hover:text-white"
                        >
                            <span>Lihat Semua Agenda</span>
                            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                        </Link>
                    </div>

                    <div className="flex flex-col gap-4">
                        {agenda.map((event, index) => (
                            <motion.div
                                key={event.title}
                                initial={{ opacity: 0, y: 16 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: '-40px' }}
                                transition={{ delay: index * 0.08, duration: 0.4 }}
                                className="group flex flex-col sm:flex-row sm:items-center justify-between gap-5 rounded-2xl border border-slate-800/80 bg-slate-900/50 p-5 sm:p-6 transition-all duration-200 hover:border-slate-700 hover:bg-slate-900"
                            >
                                <div className="flex items-start sm:items-center gap-4 sm:gap-6">
                                    <div className="flex size-16 sm:size-20 shrink-0 flex-col items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10 text-center transition-colors duration-300 group-hover:bg-blue-600 group-hover:border-blue-600">
                                        <span className="text-2xl sm:text-3xl font-extrabold leading-none text-blue-400 group-hover:text-white transition-colors">
                                            {event.date}
                                        </span>
                                        <span className="mt-1 text-[10px] font-bold tracking-widest uppercase text-blue-300 group-hover:text-blue-100 transition-colors">
                                            {event.month}
                                        </span>
                                    </div>

                                    <div className="space-y-1.5">
                                        <h3 className="text-base sm:text-lg font-bold text-white transition-colors group-hover:text-blue-400">
                                            {event.title}
                                        </h3>
                                        <p className="text-xs sm:text-sm leading-relaxed text-slate-400 max-w-2xl font-normal">
                                            {event.desc}
                                        </p>
                                        <div className="flex items-center gap-1.5 pt-1 text-xs font-medium text-slate-400">
                                            <MapPin className="size-3.5 text-blue-400 shrink-0" />
                                            <span>{event.place}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="shrink-0 pt-2 sm:pt-0">
                                    <button
                                        type="button"
                                        className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-slate-700/80 bg-slate-800/60 px-4 py-2.5 text-xs font-semibold text-slate-200 transition-all duration-200 hover:border-slate-500 hover:bg-slate-700 hover:text-white active:scale-[0.98]"
                                    >
                                        <CalendarDays className="size-3.5 text-blue-400" />
                                        <span>Ingatkan Saya</span>
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-8 flex justify-center sm:hidden">
                        <Link
                            href="/events"
                            className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-6 py-3 text-xs font-semibold text-blue-400 transition-colors hover:border-slate-700 hover:text-white"
                        >
                            <span>Lihat Semua Agenda</span>
                            <ArrowRight className="size-4" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* =========================================================================
                NEWS SECTION
               ========================================================================= */}
            <section id="berita" className="relative mx-auto max-w-7xl scroll-mt-24 px-4 sm:px-6 py-20 lg:px-8 lg:py-28">
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
                    {newsData.map((article, i) => (
                        <motion.article
                            key={article.id}
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-40px' }}
                            transition={{ delay: i * 0.08, duration: 0.4, ease: 'easeOut' }}
                            className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:border-blue-300 hover:shadow-md"
                        >
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
            </section>

            {/* =========================================================================
                FAQ SECTION
               ========================================================================= */}
            <section id="faq" className="relative mx-auto max-w-7xl scroll-mt-24 px-4 sm:px-6 py-20 lg:px-8 lg:py-28">
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
                    {faqData.map((item, index) => {
                        const isOpen = openFaqIndex === index

                        return (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 16 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: '-40px' }}
                                transition={{ delay: index * 0.08, duration: 0.4, ease: 'easeOut' }}
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
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.2 }}
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
            </section>

            {/* =========================================================================
                FOOTER
               ========================================================================= */}
            <footer id="footer" className="relative bg-[#0a0f1d] border-t border-slate-800/80 px-4 sm:px-6 pt-16 pb-8 text-white lg:px-8 lg:pt-20">
                <div className="relative mx-auto max-w-7xl">
                    <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
                        <div className="lg:col-span-4 lg:pr-4">
                            <Link href="/" className="group inline-flex items-center gap-3 font-bold">
                                <div className="grid size-10 place-items-center rounded-xl border border-slate-800 bg-slate-900 p-1.5 transition-colors group-hover:border-blue-500/50">
                                    <Image
                                        src="/himatifa1.png"
                                        alt="Logo HIMATIFA UMSURA"
                                        width={28}
                                        height={28}
                                        className="object-contain"
                                    />
                                </div>
                                <span className="text-lg font-extrabold tracking-tight text-white group-hover:text-blue-400 transition-colors">
                                    HIMATIFA UMSURA
                                </span>
                            </Link>

                            <p className="mt-4 text-xs sm:text-sm leading-relaxed text-slate-400 font-normal max-w-sm">
                                Himpunan Mahasiswa Teknik Informatika Universitas Muhammadiyah Surabaya. Bertumbuh, berkolaborasi, dan menghadirkan dampak positif berkelanjutan.
                            </p>

                            <div className="mt-6 flex items-center gap-2.5">
                                {socials.map(({ label, href, icon: Icon }) => (
                                    <Link
                                        key={label}
                                        aria-label={`${label} HIMATIFA`}
                                        href={href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="grid size-9 place-items-center rounded-xl border border-slate-800 bg-slate-900/80 text-slate-400 transition-all duration-200 hover:border-blue-600 hover:bg-blue-600 hover:text-white active:scale-[0.96]"
                                    >
                                        <Icon className="size-4" />
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <div className="lg:col-span-2">
                            <h3 className="mb-4 text-[11px] font-bold uppercase tracking-wider text-slate-300">
                                Navigasi
                            </h3>
                            <ul className="flex flex-col gap-2.5 text-xs sm:text-sm font-medium text-slate-400">
                                {navLinks.map((item) => (
                                    <li key={item.name}>
                                        <Link
                                            href={item.path}
                                            className="inline-block transition-colors hover:text-white"
                                        >
                                            {item.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="lg:col-span-3">
                            <h3 className="mb-4 text-[11px] font-bold uppercase tracking-wider text-slate-300">
                                Layanan Mahasiswa
                            </h3>
                            <ul className="flex flex-col gap-2.5 text-xs sm:text-sm font-medium text-slate-400">
                                <li>
                                    <Link href="/akademik" className="inline-block transition-colors hover:text-white">
                                        Layanan Akademik
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/aspirasi" className="inline-block transition-colors hover:text-white">
                                        Suara Mahasiswa (Aspirasi)
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/showcase" className="inline-block transition-colors hover:text-white">
                                        Showcase Karya Mahasiswa
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        <div className="lg:col-span-3">
                            <h3 className="mb-4 text-[11px] font-bold uppercase tracking-wider text-slate-300">
                                Sekretariat
                            </h3>
                            <ul className="flex flex-col gap-3.5 text-xs sm:text-sm text-slate-400 font-normal">
                                <li className="flex items-start gap-3">
                                    <div className="grid size-8 shrink-0 place-items-center rounded-lg border border-slate-800 bg-slate-900 text-blue-400 mt-0.5">
                                        <MapPin className="size-4" />
                                    </div>
                                    <span className="leading-relaxed">
                                        Gedung G Lt. 3, Universitas Muhammadiyah Surabaya<br />
                                        Jl. Sutorejo No.59, Surabaya 60113
                                    </span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="grid size-8 shrink-0 place-items-center rounded-lg border border-slate-800 bg-slate-900 text-blue-400">
                                        <Mail className="size-4" />
                                    </div>
                                    <a href="mailto:himatifa@um-surabaya.ac.id" className="transition-colors hover:text-white">
                                        himatifa@um-surabaya.ac.id
                                    </a>
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="grid size-8 shrink-0 place-items-center rounded-lg border border-slate-800 bg-slate-900 text-blue-400">
                                        <Phone className="size-4" />
                                    </div>
                                    <a href="tel:+6281234567890" className="transition-colors hover:text-white">
                                        +62 812 3456 7890
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="mt-12 sm:mt-16 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-800/80 pt-6 text-xs text-slate-500 font-medium">
                        <p className="flex items-center gap-1.5">
                            <Copyright className="size-3.5 shrink-0" />
                            <span>{new Date().getFullYear()} HIMATIFA UMSURA. Hak Cipta Dilindungi.</span>
                        </p>
                        <p className="uppercase tracking-wider font-semibold text-[10px] text-slate-400">
                            Dikembangkan oleh Departemen Medkominfo
                        </p>
                    </div>
                </div>
            </footer>

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
