'use client'

import {
    AnimatePresence,
    motion,
    useInView,
    useScroll,
    useTransform,
    useReducedMotion,
    useMotionValue,
    useSpring,
    type Variants
} from 'framer-motion'
import {
    ArrowRight,
    ArrowUpRight,
    CalendarDays,
    Check,
    ChevronRight,
    ChevronDown,
    CircleUserRound,
    Menu,
    X,
    MapPin,
    Mail,
    Phone,
    Users,
    Globe,
    HeartHandshake,
    Lightbulb,
    Megaphone,
    Sparkles,
    Play,
    Pause,
    Volume2,
    VolumeX,
    ArrowUp,
    Send,
    Copyright,
    HelpCircle,
    MessageCircle,
    MessageSquareWarning
} from 'lucide-react'
import { FaInstagram, FaGithub, FaYoutube } from 'react-icons/fa6'
import { useState, useRef, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'

type DepartmentKey = 'PSDM' | 'Deplu' | 'Kepsos' | 'Ekraf' | 'Medkominfo'

interface DepartmentDetail {
    label: string
    desc: string
    programs: string[]
}

const departments: Record<DepartmentKey, DepartmentDetail> = {
    PSDM: { label: 'Pengembangan Sumber Daya Mahasiswa', desc: 'Membangun ekosistem belajar yang inklusif melalui pengembangan kapasitas, kompetensi, dan karakter mahasiswa Informatika.', programs: ['Study Club', 'Mentoring Akademik', 'Upgrading'] },
    Deplu: { label: 'Departemen Luar Negeri', desc: 'Membuka jejaring kolaborasi strategis antara HIMATIFA, organisasi mahasiswa, dan mitra profesional di luar kampus.', programs: ['Company Visit', 'Collaboration', 'Networking'] },
    Kepsos: { label: 'Kesejahteraan Sosial', desc: 'Menghadirkan dampak positif melalui aksi sosial dan kepedulian yang berkelanjutan bagi civitas dan masyarakat.', programs: ['HIMATIFA Care', 'Donasi Digital', 'Volunteer'] },
    Ekraf: { label: 'Ekonomi Kreatif', desc: 'Mengembangkan potensi wirausaha mahasiswa melalui produk kreatif, strategi bisnis, dan ruang apresiasi karya.', programs: ['Ekraf Store', 'Creative Class', 'Market Day'] },
    Medkominfo: { label: 'Media, Komunikasi, dan Informasi', desc: 'Menghidupkan cerita dan identitas HIMATIFA lewat komunikasi visual yang relevan, jujur, dan berdampak.', programs: ['Content Lab', 'HIMATIFA TV', 'Design Sprint'] },
}

const people = [
    { role: 'Ketua Himpunan', name: 'Vichras Mazcheranou Hafizh', image: '/bpi/vice.png' },
    { role: 'Wakil Ketua', name: 'Andy Bagus Oesmady', image: '/bpi/andi.png' },
    { role: 'Sekretaris', name: 'Aura Rizky Inayah Fadhilah', image: '/bpi/aura.png' },
    { role: 'Bendahara', name: 'Maulidya Dliyaun Najah', image: '/bpi/mau.png' },
]

const navLinks = [
    { name: 'Beranda', path: '/' },
    { name: 'Profil', path: '/about' },
    { name: 'Berita', path: '/news' },
    { name: 'Agenda', path: '/events' },
    { name: 'Kontak', path: '/contact' },
]

const newsData = [
    {
        id: 1,
        title: "Orientasi Studi & Cinta Almamater (OSCAR) 2026",
        date: "19 - 20 September 2026",
        category: "Organisasi",
        summary: "Fakultas Teknik menyelenggarakan kegiatan OSCAR (Orientasi Studi Cinta Akademik dan Almamater) Fakultas Teknik 2026 sebagai rangkaian kegiatan pengenalan bagi mahasiswa.",
        link: "https://www.kompasiana.com/himatifaumsurabaya/6ab2271434777c6eb9130687/orientasi-studi-cinta-almamater-oscar-2026#goog_rewarded",
        image: "https://assets-a2.kompasiana.com/items/album/2026/09/22/whatsapp-image-2026-09-22-at-13-48-58-6ab225e034777c689b74ed35.jpeg?t=o&v=770"
    },
    {
        id: 2,
        title: "Sokong visi Literasi Digital, S1 Informatika UMSURA Gelar AI Ambasador Workshop Di SpInS Interactional School",
        date: "13 Juli 2026",
        category: "Kegiatan",
        summary: "Kolaborasi apik di sektor pendidikan digital kembali ditunjukkan oleh akademisi muda kota Pahlawan. Mahasiswa Program Studi (Prodi) S1 Informatika Universitas Muhammadiyah Surabaya (UMSURA) sukses menyelenggarakan kegiatan pengabdian masyarakat berupa \"AI Ambassador Workshop\" yang bertempat di SpInS Interactional School Surabaya yang diadakan pada tanggal 13 Juli 2026.",
        link: "https://www.kompasiana.com/himatifaumsurabaya/6a577a9cc925c442882752e2/sokong-visi-literasi-digital-s1-informatika-umsura-gelar-ai-ambasador-workshop-di-spins-interactional-school#goog_rewarded",
        image: "https://assets-a2.kompasiana.com/items/album/2026/07/15/whatsapp-image-2026-07-14-at-19-54-41-6a577a32ed64157f6144eea2.jpeg?t=o&v=770"
    },
    {
        id: 3,
        title: "Program Studi Informatika UMSURA Sukses Selenggarakan Seminar Etika Profesi Bersama Alumni Yang Bekerja Di Pemkot Surabaya",
        date: "24 Juni 2026",
        category: "Prestasi",
        summary: "Menghadapi dinamika dunia kerja profesional yang semakin kompleks, Program Studi Informatika Universitas Muhammadiyah Surabaya (Umsura) sukses menyelenggarakan acara \"Seminar Etika Profesi dan Profesionalisme dalam Dunia Informatika\".",
        link: "https://www.kompasiana.com/himatifaumsurabaya/6a3ca800c925c473a8367832/program-studi-informatika-umsura-sukses-selenggarakan-seminar-etika-profesi-bersama-alumni-yang-bekerja-di-pemkot-surabaya#goog_rewarded",
        image: "https://assets-a2.kompasiana.com/items/album/2026/06/25/gemini-generated-image-9x3znf9x3znf9x3z-6a3ca37bed64154f96160e82.png?t=o&v=770"
    }
]

const MISI = [
    { title: 'Kolaborasi Lintas Minat', desc: 'Menghubungkan mahasiswa lintas bidang untuk proyek & riset bersama.' },
    { title: 'Kompetensi Relevan', desc: 'Bootcamp, workshop, dan mentoring sesuai kebutuhan industri.' },
    { title: 'Dampak Berkelanjutan', desc: 'Proker yang memberi manfaat nyata bagi kampus dan masyarakat.' },
]

const STATS = [
    { val: 2020, label: 'Tahun Berdiri', suffix: '', isYear: true },
    { val: 5, label: 'Departemen', suffix: '' },
    { val: 15, label: 'Proker Aktif', suffix: '+' },
]

const AGENDA = [
    { date: '21', month: 'SEP', title: 'OSCAR 2026', desc: 'Opening Student Collaboration & Achievement Recognition', place: 'Auditorium UMSurabaya' },
    { date: '04', month: 'OKT', title: 'Study Club GitHub', desc: 'Level up your workflow, one commit at a time.', place: 'Lab Informatika 2' },
    { date: '18', month: 'OKT', title: 'HIMATIFA Care', desc: 'Berbagi langkah kecil, memberi dampak yang besar.', place: 'Kampung Nelayan Kenjeran' },
]

const SOCIALS = [
    { label: 'Instagram', href: 'https://instagram.com/himatifa_umsurabaya', icon: FaInstagram },
    { label: 'GitHub', href: 'https://github.com/himatifa', icon: FaGithub },
    { label: 'YouTube', href: 'https://youtube.com/@himatifa', icon: FaYoutube },
]

const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
}

const heroContainer: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
}

const revealStagger: Variants = {
    hidden: { opacity: 0, y: 40, filter: 'blur(6px)' },
    show: {
        opacity: 1, y: 0, filter: 'blur(0px)',
        transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
    },
}

const heroItem: Variants = {
    hidden: { opacity: 0, y: 32 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
}

const reveal = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.65 } } }

function GlassCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
    return <div className={`rounded-[2rem] border border-white/80 bg-white/60 shadow-lg shadow-blue-900/5 backdrop-blur-xl ${className}`}>{children}</div>
}

function Counter({ target, suffix, isYear }: { target: number; suffix?: string; isYear?: boolean }) {
    const ref = useRef<HTMLSpanElement>(null)
    const inView = useInView(ref, { once: true, margin: '-80px' })
    const reduce = useReducedMotion()
    const [display, setDisplay] = useState(0)

    useEffect(() => {
        if (!inView) return
        if (reduce) { setDisplay(target); return }
        const duration = 1600
        const start = performance.now()
        let raf: number
        const tick = (now: number) => {
            const p = Math.min((now - start) / duration, 1)
            const eased = 1 - Math.pow(1 - p, 3)
            setDisplay(Math.round(eased * target))
            if (p < 1) raf = requestAnimationFrame(tick)
        }
        raf = requestAnimationFrame(tick)
        return () => cancelAnimationFrame(raf)
    }, [inView, target, reduce])

    return (
        <span ref={ref} className="tabular-nums" aria-label={isYear ? String(target) : `${target}${suffix ?? ''}`}>
            {isYear ? display : `${display}${inView ? (suffix ?? '') : ''}`}
        </span>
    )
}

function MagneticLink({ children, href }: { children: React.ReactNode; href: string }) {
    const ref = useRef<HTMLAnchorElement>(null)
    const reduce = useReducedMotion()
    const x = useMotionValue(0)
    const y = useMotionValue(0)
    const sx = useSpring(x, { stiffness: 180, damping: 16 })
    const sy = useSpring(y, { stiffness: 180, damping: 16 })

    const handleMove = useCallback((e: React.MouseEvent) => {
        if (reduce || !ref.current) return
        const r = ref.current.getBoundingClientRect()
        x.set((e.clientX - r.left - r.width / 2) * 0.3)
        y.set((e.clientY - r.top - r.height / 2) * 0.3)
    }, [reduce, x, y])

    return (
        <motion.div style={{ x: sx, y: sy }} className="inline-block">
            <Link
                ref={ref}
                href={href}
                onMouseMove={handleMove}
                onMouseLeave={() => { x.set(0); y.set(0) }}
                className="group relative inline-flex w-fit items-center gap-2 overflow-hidden rounded-full bg-[#2563eb] px-7 py-3 text-sm font-bold text-white transition-colors duration-300 hover:bg-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2"
                aria-label="Baca profil lengkap himpunan"
            >
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                {children}
                <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:rotate-45" />
            </Link>
        </motion.div>
    )
}

function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
    const reduce = useReducedMotion()
    const rx = useMotionValue(0)
    const ry = useMotionValue(0)
    const srx = useSpring(rx, { stiffness: 220, damping: 20 })
    const sry = useSpring(ry, { stiffness: 220, damping: 20 })

    return (
        <motion.div
            style={{ rotateX: srx, rotateY: sry, transformStyle: 'preserve-3d', perspective: 800 }}
            onMouseMove={(e) => {
                if (reduce) return
                const r = e.currentTarget.getBoundingClientRect()
                ry.set(((e.clientX - r.left) / r.width - 0.5) * 6)
                rx.set(-((e.clientY - r.top) / r.height - 0.5) * 6)
            }}
            onMouseLeave={() => { rx.set(0); ry.set(0) }}
            className={className}
        >
            {children}
        </motion.div>
    )
}

function SectionHeading({ eyebrow, title, highlight, dark = false, center = false }: {
    eyebrow: string; title: string; highlight: string; dark?: boolean; center?: boolean
}) {
    return (
        <motion.div
            initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}
            variants={container} className={center ? 'text-center' : ''}
        >
            <motion.p
                variants={revealStagger}
                className={`mb-3 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-bold uppercase tracking-[.2em] backdrop-blur ${
                    dark
                        ? 'border-blue-500/30 bg-blue-500/10 text-blue-400'
                        : 'border-blue-200/60 bg-blue-50/60 text-[#2563eb]'
                }`}
            >
                <Sparkles className="size-3.5" /> {eyebrow}
            </motion.p>
            <motion.h2
                variants={revealStagger}
                className={`text-4xl font-black tracking-tight sm:text-5xl ${dark ? 'text-white' : 'text-[#0a192f]'}`}
            >
                {title}{' '}
                <span className={dark ? 'text-blue-400' : 'relative inline-block bg-gradient-to-r from-[#2563eb] via-sky-400 to-[#2563eb] bg-[length:200%_auto] bg-clip-text text-transparent animate-[gradient-move_4s_linear_infinite]'}>
                    {highlight}
                    {!dark && (
                        <svg aria-hidden className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
                            <path d="M2 9C50 3 150 3 198 9" stroke="#2563eb" strokeWidth="4" strokeLinecap="round" opacity="0.4" />
                        </svg>
                    )}
                </span>
            </motion.h2>
        </motion.div>
    )
}

function BackToTop() {
    const [visible, setVisible] = useState(false)
    const reduce = useReducedMotion()

    useEffect(() => {
        const onScroll = () => setVisible(window.scrollY > 600)
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    return (
        <AnimatePresence>
            {visible && (
                <motion.button
                    initial={{ opacity: 0, scale: 0.6, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.6, y: 20 }}
                    whileHover={reduce ? undefined : { y: -3 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    aria-label="Kembali ke atas"
                    className="fixed bottom-6 right-6 z-50 grid size-12 place-items-center rounded-full bg-[#2563eb] text-white shadow-xl shadow-blue-600/30 transition-colors hover:bg-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
                >
                    <ArrowUp className="size-5" />
                </motion.button>
            )}
        </AnimatePresence>
    )
}

const faqData = [
    {
        id: 1,
        question: "Apa itu HIMATIFA UMSURA?",
        answer: "HIMATIFA (Himpunan Mahasiswa Teknik Informatika) UMSURA adalah organisasi mahasiswa yang berfokus pada pengembangan potensi akademik, non-akademik, serta penampung aspirasi seluruh mahasiswa Teknik Informatika Universitas Muhammadiyah Surabaya."
    },
    {
        id: 2,
        question: "Bagaimana cara bergabung menjadi pengurus HIMATIFA?",
        answer: "Pendaftaran pengurus (Open Recruitment) biasanya dibuka pada awal periode kepengurusan baru. Informasi pendaftaran, persyaratan, dan alur seleksi akan diumumkan secara resmi melalui website ini dan akun Instagram HIMATIFA."
    },
    {
        id: 3,
        question: "Apakah mahasiswa non-pengurus bisa mengikuti kegiatan HIMATIFA?",
        answer: "Tentu saja! Sebagian besar kegiatan seperti workshop, seminar teknologi, kompetisi, dan program pengabdian masyarakat terbuka untuk seluruh mahasiswa Teknik Informatika maupun umum."
    },
    {
        id: 4,
        question: "Bagaimana cara menyalurkan keluhan atau saran terkait akademik/fasilitas?",
        answer: "Kamu bisa menyampaikannya secara langsung melalui menu 'Aspirasi' di website ini. Kamu juga dapat memilih untuk mengirimkannya secara anonim demi kenyamanan dan kerahasiaan identitas."
    },
    {
        id: 5,
        question: "Di mana saya bisa melihat jadwal kegiatan dan berita terbaru?",
        answer: "Seluruh update kegiatan, agenda mendatang, dan berita resmi dapat kamu akses secara berkala melalui bagian 'Kabar Terbaru' di beranda atau halaman 'News'."
    }
]

export default function Page() {
    const [activeDepartment, setActiveDepartment] = useState<DepartmentKey>('PSDM')
    const [mobileOpen, setMobileOpen] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)
    const current = departments[activeDepartment]

    const [openIndex, setOpenIndex] = useState<number | null>(3)

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index)
    }

    const videoRef = useRef<HTMLVideoElement>(null)
    const isVideoInView = useInView(videoRef, { margin: "-100px" })
    const [isPlaying, setIsPlaying] = useState(true)
    const [isMuted, setIsMuted] = useState(true)

    const [email, setEmail] = useState('')
    const [subscribed, setSubscribed] = useState(false)

    const { scrollYProgress } = useScroll()
    const progressScale = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.4 })

    const visiRef = useRef<HTMLDivElement>(null)
    const { scrollYProgress: visiProgress } = useScroll({ target: visiRef, offset: ['start end', 'end start'] })
    const bgY = useTransform(visiProgress, [0, 1], ['-8%', '8%'])

    const heroRef = useRef<HTMLElement>(null)
    const { scrollYProgress: heroProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
    const heroOpacity = useTransform(heroProgress, [0, 0.8], [1, 0])
    const heroY = useTransform(heroProgress, [0, 1], ['0%', '20%'])

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20)
        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    useEffect(() => {
        document.body.style.overflow = mobileOpen ? 'hidden' : ''
        return () => { document.body.style.overflow = '' }
    }, [mobileOpen])

    useEffect(() => {
        if (videoRef.current) {
            if (isVideoInView && isPlaying) {
                videoRef.current.play().catch((err: unknown) => console.log("Autoplay ditunda oleh browser:", err))
            } else {
                videoRef.current.pause()
            }
        }
    }, [isVideoInView, isPlaying])

    const togglePlay = useCallback(() => {
        if (!videoRef.current) return
        if (isPlaying) {
            videoRef.current.pause()
            setIsPlaying(false)
        } else {
            videoRef.current.play().catch(() => {})
            setIsPlaying(true)
        }
    }, [isPlaying])

    const toggleMute = useCallback(() => {
        if (!videoRef.current) return
        const next = !isMuted
        videoRef.current.muted = next
        setIsMuted(next)
    }, [isMuted])

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault()
        if (!email.includes('@')) return
        setSubscribed(true)
        setEmail('')
        setTimeout(() => setSubscribed(false), 4000)
    }

    return (
        <main className="min-h-screen overflow-hidden bg-[#f4f8fc] text-[#0a192f]">
            <motion.div
                style={{ scaleX: progressScale }}
                className="fixed inset-x-0 top-0 z-[60] h-1 origin-left bg-gradient-to-r from-[#2563eb] via-sky-400 to-cyan-400"
                aria-hidden
            />

            <div className="absolute left-0 top-0 -z-10 h-full w-full overflow-hidden">
                <div className="absolute left-[-10%] top-[-5%] h-125 w-125 rounded-full bg-blue-400/20 blur-[120px]" />
                <div className="absolute right-[-5%] top-[20%] h-150 w-150 rounded-full bg-cyan-300/20 blur-[150px]" />
            </div>

            <header className={`fixed inset-x-0 z-50 flex justify-center transition-all duration-500 ease-out ${isScrolled ? 'top-4 px-4 sm:px-6' : 'top-0 px-0'}`}>
                <nav
                    className={`flex items-center justify-between transition-all duration-500 ease-out ${
                        isScrolled
                            ? 'w-full max-w-5xl rounded-full border border-slate-200/60 bg-white/90 px-5 py-2 shadow-lg shadow-blue-900/5 backdrop-blur-xl'
                            : 'w-full border-b border-transparent bg-transparent px-6 py-4 sm:px-10'
                    }`}
                >
                    <Link href="/" className={`flex items-center gap-2 font-black tracking-tight transition-transform hover:scale-105 ${isScrolled ? 'text-[#0a192f]' : 'text-white'}`}>
                        <Image
                            src="/himatifabg.png"
                            alt="Logo HIMATIFA UMSurabaya"
                            width={40}
                            height={40}
                            className="object-contain transition-all duration-500"
                        />
                        HIMATIFA
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

                    <Link href="/ekrafstore" className="hidden items-center rounded-full bg-blue-600 px-5 py-2 text-xs font-bold text-white shadow-md shadow-blue-600/20 transition-all hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-lg lg:flex">
                        Ekraf Store <ArrowUpRight className="ml-1 size-3.5" />
                    </Link>

                    <button
                        aria-label={mobileOpen ? 'Tutup menu' : 'Buka menu'}
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className={`rounded-full p-2 lg:hidden transition-colors ${isScrolled ? 'text-slate-700 hover:bg-slate-100' : 'text-white hover:bg-white/20'}`}
                    >
                        {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
                    </button>
                </nav>
            </header>

            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -16, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -16, scale: 0.98 }}
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                        className="fixed inset-x-4 top-20 z-40 flex flex-col gap-1 rounded-2xl border border-slate-200/60 bg-white/95 p-5 shadow-xl backdrop-blur-xl lg:hidden"
                    >
                        {navLinks.map((item, i) => (
                            <motion.div
                                key={item.name}
                                initial={{ opacity: 0, x: -12 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.05 * i }}
                            >
                                <Link
                                    onClick={() => setMobileOpen(false)}
                                    href={item.path}
                                    className="block rounded-xl px-3 py-2.5 font-semibold text-slate-700 transition-colors hover:bg-blue-50 hover:text-[#2563eb]"
                                >
                                    {item.name}
                                </Link>
                            </motion.div>
                        ))}
                        <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.28 }}>
                            <a
                                onClick={() => setMobileOpen(false)}
                                href="#departemen"
                                className="block rounded-xl px-3 py-2.5 font-semibold text-slate-700 transition-colors hover:bg-blue-50 hover:text-[#2563eb]"
                            >
                                Departemen
                            </a>
                        </motion.div>

                        <hr className="my-2 border-slate-200" />
                        <Link
                            onClick={() => setMobileOpen(false)}
                            href="/ekrafstore"
                            className="flex items-center justify-center gap-2 rounded-xl bg-[#2563eb] py-3 text-sm font-bold text-white shadow-md shadow-blue-600/20 transition-transform active:scale-95"
                        >
                            Ekraf Store <ArrowUpRight className="size-4" />
                        </Link>
                    </motion.div>
                )}
            </AnimatePresence>

            <section
                id="beranda"
                ref={heroRef}
                className="relative flex min-h-[90vh] w-full flex-col items-center justify-center overflow-hidden px-6 pb-20 pt-32 text-center lg:px-10"
                style={{
                    backgroundImage: "url('/bg.webp')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >
                <div className="absolute inset-0 z-0 bg-slate-950/70 bg-gradient-to-b from-slate-900/70 to-slate-950/95" />

                <motion.div
                    initial="hidden"
                    animate="show"
                    variants={heroContainer}
                    style={{ opacity: heroOpacity, y: heroY }}
                    className="relative z-10 flex w-full max-w-7xl flex-col items-center"
                >
                    <motion.h1 variants={heroItem} className="max-w-4xl text-5xl font-extrabold leading-tight tracking-tight text-white sm:text-6xl lg:text-7xl">
                        Inovasi Tanpa Batas,<br />
                        <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400 bg-[length:200%_auto] animate-[gradient-move_5s_linear_infinite] bg-clip-text text-transparent">Sinergi S1 Informatika.</span>
                    </motion.h1>

                    <motion.p variants={heroItem} className="mt-6 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
                        Wadah kolaborasi mahasiswa Informatika Universitas Muhammadiyah Surabaya untuk mengasah kompetensi teknis dan berdaya saing global.
                    </motion.p>

                    <motion.div variants={heroItem} className="mt-10 flex flex-wrap items-center justify-center gap-4">
                        <Link href="/about" className="group flex items-center rounded-full bg-blue-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition-all hover:-translate-y-0.5 hover:bg-blue-500 hover:shadow-xl hover:shadow-blue-500/30">
                            Kenali HIMATIFA <ArrowRight className="ml-2 size-4 transition-transform duration-300 group-hover:translate-x-1" />
                        </Link>
                        <Link href="/events" className="rounded-full border border-slate-400/30 bg-white/10 px-8 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-white/40 hover:bg-white/20">
                            Jelajahi Agenda
                        </Link>
                    </motion.div>

                    <motion.div variants={heroItem} className="mt-10 flex items-center justify-center gap-4 text-sm font-medium text-slate-300">
                        <div className="flex -space-x-3">
                            {people.slice(0, 3).map((p) => (
                                <img
                                    key={p.name}
                                    src={p.image}
                                    alt="Pengurus HIMATIFA"
                                    className="size-10 rounded-full border-2 border-slate-900 object-cover shadow-sm transition-transform hover:-translate-y-1 hover:scale-110"
                                />
                            ))}
                            <span className="grid size-10 place-items-center rounded-full border-2 border-slate-900 bg-blue-600 text-xs font-black text-white">500+</span>
                        </div>
                        <span>Lebih dari <strong className="text-white">500+</strong> mahasiswa</span>
                    </motion.div>
                </motion.div>

                <motion.a
                    href="#profil"
                    aria-label="Scroll ke bawah"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.4 }}
                    className="absolute bottom-8 z-10 flex flex-col items-center gap-1.5 text-slate-400 transition-colors hover:text-white"
                >
                    <span className="text-[10px] font-bold uppercase tracking-[.2em]">Scroll</span>
                    <motion.span animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}>
                        <ChevronDown className="size-5" />
                    </motion.span>
                </motion.a>
            </section>

            <section
                id="profil"
                aria-labelledby="profil-heading"
                className="relative mx-auto max-w-7xl scroll-mt-24 px-6 py-24 lg:px-10 lg:py-32"
            >
                <div aria-hidden className="pointer-events-none absolute -top-20 left-1/2 -z-10 size-[600px] -translate-x-1/2 rounded-full bg-[#2563eb]/10 blur-[120px]" />

                <motion.div
                    initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}
                    variants={container} className="mb-14 text-center"
                >
                    <motion.p variants={revealStagger} className="mb-3 text-xs font-bold uppercase tracking-[.2em] text-[#2563eb]">
                        Tentang Kami
                    </motion.p>
                    <motion.h2
                        id="profil-heading"
                        variants={revealStagger}
                        className="text-4xl font-black tracking-tight text-[#0a192f] sm:text-5xl lg:text-6xl"
                    >
                        Lebih dari Sekadar{' '}
                        <span className="relative inline-block bg-gradient-to-r from-[#2563eb] via-sky-400 to-[#2563eb] bg-[length:200%_auto] bg-clip-text text-transparent animate-[gradient-move_4s_linear_infinite]">
                            Himpunan.
                            <svg aria-hidden className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
                                <path d="M2 9C50 3 150 3 198 9" stroke="#2563eb" strokeWidth="4" strokeLinecap="round" opacity="0.4" />
                            </svg>
                        </span>
                    </motion.h2>
                </motion.div>

                <motion.div
                    initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }}
                    variants={container}
                    className="grid gap-5 lg:grid-cols-3"
                >
                    <motion.div variants={revealStagger} className="lg:col-span-2">
                        <GlassCard className="group relative flex min-h-[360px] flex-col justify-end overflow-hidden rounded-3xl p-7 text-white sm:p-10">
                            <div ref={visiRef} className="absolute inset-0 overflow-hidden">
                                <motion.div style={{ y: bgY }} className="absolute -inset-y-[10%] inset-x-0 bg-[url('/profil-bg.jpg')] bg-cover bg-center opacity-40 mix-blend-multiply" />
                            </div>
                            <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-[#0a192f] via-[#0a192f]/80 to-transparent" />
                            <div aria-hidden className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-gradient-to-br from-blue-500/10 to-transparent" />

                            <div className="relative z-10">
                                <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-blue-200 backdrop-blur-sm">
                                    <span className="size-1.5 animate-pulse rounded-full bg-blue-300" /> Visi Kami
                                </p>
                                <h3 className="max-w-xl text-3xl font-black tracking-tight sm:text-4xl">
                                    Menjadi ruang tumbuh bagi{' '}
                                    <span className="bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">talenta digital.</span>
                                </h3>
                                <p className="mt-3 max-w-md text-sm leading-6 text-white/70">
                                    Mendorong mahasiswa Informatika untuk berani bereksplorasi, saling terhubung, dan menciptakan solusi yang bermakna.
                                </p>
                                <div className="mt-7">
                                    <MagneticLink href="/about">Baca Selengkapnya</MagneticLink>
                                </div>
                            </div>
                        </GlassCard>
                    </motion.div>

                    <motion.div variants={revealStagger}>
                        <TiltCard className="h-full">
                            <GlassCard className="flex h-full flex-col justify-center rounded-3xl p-7 sm:p-8">
                                <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#2563eb]">Misi Kami</p>
                                <h3 className="text-2xl font-extrabold text-[#0a192f]">Tumbuh bersama.</h3>
                                <ul className="mt-7 flex flex-col gap-5">
                                    {MISI.map((item, i) => (
                                        <motion.li
                                            key={item.title}
                                            initial={{ opacity: 0, x: 24 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: 0.2 + i * 0.12, duration: 0.5 }}
                                            className="group -m-3 flex items-start gap-4 rounded-2xl p-3 transition-colors hover:bg-blue-50/60"
                                        >
                                            <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-blue-100 text-[#2563eb] shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:rounded-xl">
                                                <Check className="size-5" strokeWidth={3} />
                                            </span>
                                            <span>
                                                <span className="block text-sm font-bold text-[#0a192f]">{item.title}</span>
                                                <span className="mt-0.5 block text-xs leading-5 text-slate-500">{item.desc}</span>
                                            </span>
                                        </motion.li>
                                    ))}
                                </ul>
                            </GlassCard>
                        </TiltCard>
                    </motion.div>
                </motion.div>

                <motion.div
                    initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }}
                    variants={container}
                    className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3"
                >
                    {STATS.map((stat) => (
                        <motion.div key={stat.label} variants={revealStagger}>
                            <GlassCard className="group relative flex flex-col items-center overflow-hidden rounded-3xl p-8 text-center transition-transform duration-300 hover:-translate-y-1.5">
                                <div aria-hidden className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-[radial-gradient(circle_at_50%_0%,rgba(37,99,235,0.12),transparent_70%)]" />
                                <div className="text-5xl font-black tracking-tight text-[#2563eb] lg:text-6xl">
                                    <Counter target={stat.val} suffix={stat.suffix} isYear={stat.isYear} />
                                </div>
                                <p className="mt-3 text-xs font-bold uppercase tracking-[.2em] text-slate-500">{stat.label}</p>
                                <span aria-hidden className="mt-5 h-1 w-10 rounded-full bg-blue-200 transition-all duration-500 group-hover:w-20 group-hover:bg-[#2563eb]" />
                            </GlassCard>
                        </motion.div>
                    ))}
                </motion.div>
            </section>

            <section id="video-profil" className="relative mx-auto max-w-7xl px-6 pb-24 lg:px-10">
                <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={reveal}>
                    <div className="mb-12 text-center">
                        <p className="mb-3 text-xs font-bold uppercase tracking-[.2em] text-[#2563eb]">Mengenal Lebih Dekat</p>
                        <h2 className="text-4xl font-black tracking-tight sm:text-5xl">Video Profil <br /><span>HIMATIFA.</span></h2>
                    </div>
                    <div className="relative mx-auto w-full max-w-5xl overflow-hidden rounded-[2.5rem] border border-white/80 bg-white/40 p-3 shadow-2xl shadow-blue-900/10 backdrop-blur-xl">
                        <div className="group relative aspect-video w-full overflow-hidden rounded-[1.8rem] bg-slate-900">
                            <video
                                ref={videoRef}
                                src="/oscar.mp4"
                                loop
                                playsInline
                                muted={isMuted}
                                className="size-full object-cover opacity-70 transition duration-700 group-hover:scale-105 group-hover:opacity-40"
                            />
                            <div className="absolute bottom-5 right-5 flex gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                <button
                                    onClick={togglePlay}
                                    aria-label={isPlaying ? 'Pause video' : 'Play video'}
                                    className="grid size-10 place-items-center rounded-full bg-white/90 text-[#0a192f] shadow-lg backdrop-blur transition-transform hover:scale-105 active:scale-95"
                                >
                                    {isPlaying ? <Pause className="size-4" /> : <Play className="size-4" />}
                                </button>
                                <button
                                    onClick={toggleMute}
                                    aria-label={isMuted ? 'Nyalakan suara' : 'Matikan suara'}
                                    className="grid size-10 place-items-center rounded-full bg-white/90 text-[#0a192f] shadow-lg backdrop-blur transition-transform hover:scale-105 active:scale-95"
                                >
                                    {isMuted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
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

            <section id="bph" className="bg-white/40 px-6 py-24 lg:px-10">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-16 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                        <div>
                            <p className="mb-3 text-xs font-bold uppercase tracking-[.2em] text-[#2563eb]">Badan Pengurus Harian</p>
                            <h2 className="text-4xl font-black tracking-tight sm:text-5xl">Pemimpin HIMATIFA<br /><span>2026.</span></h2>
                        </div>
                        <p className="max-w-xs text-sm leading-6 text-slate-500">Satu visi, empat peran, dan energi yang sama untuk membuat perubahan.</p>
                    </div>
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {people.map((person, i) => (
                            <motion.div
                                key={person.name}
                                initial={{ opacity: 0, y: 32 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: '-60px' }}
                                transition={{ delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                                whileHover={{ y: -8 }}
                                className="group rounded-[2rem] border border-white/80 bg-white/60 p-3 text-center shadow-lg shadow-blue-900/5 backdrop-blur-xl"
                            >
                                <div className="relative -mt-1 overflow-hidden rounded-[1.5rem] bg-blue-100">
                                    <img src={person.image} alt={person.name} className="aspect-[.9] w-full object-cover grayscale transition duration-500 group-hover:scale-105 group-hover:grayscale-0" />
                                    <div className="absolute inset-x-3 bottom-3 flex translate-y-12 justify-center gap-2 transition-transform duration-300 group-hover:translate-y-0">
                                        <a aria-label={`Profil ${person.name}`} href="#footer" className="grid size-8 place-items-center rounded-full bg-white/90 text-[#2563eb] shadow transition hover:bg-[#2563eb] hover:text-white"><CircleUserRound className="size-3.5" /></a>
                                    </div>
                                </div>
                                <p className="mt-5 text-[10px] font-bold uppercase tracking-[.2em] text-[#2563eb]">{person.role}</p>
                                <h3 className="pb-3 pt-1 text-lg font-extrabold">{person.name}</h3>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <section id="departemen" className="mx-auto max-w-7xl scroll-mt-24 px-6 py-24 lg:px-10">
                <div className="mb-14">
                    <p className="mb-3 text-xs font-bold uppercase tracking-[.2em] text-[#2563eb]">Struktur gerak</p>
                    <h2 className="text-4xl font-black tracking-tight sm:text-5xl">Pilar <span className="bg-gradient-to-r from-[#2563eb] to-sky-400 bg-clip-text text-transparent">Penggerak.</span></h2>
                </div>

                <div className="grid gap-8 lg:grid-cols-[.35fr_.65fr] lg:gap-10">

                    <div className="flex flex-row overflow-x-auto pb-4 lg:flex-col lg:overflow-visible lg:pb-0 gap-2 snap-x hide-scrollbar">
                        {(Object.keys(departments) as DepartmentKey[]).map((name) => (
                            <button
                                key={name}
                                onClick={() => setActiveDepartment(name)}
                                className={`group shrink-0 snap-start flex items-center justify-between rounded-2xl border-l-2 px-5 py-3.5 text-left text-sm font-bold transition-all sm:py-4 ${
                                    activeDepartment === name
                                        ? 'border-[#2563eb] bg-white/80 text-[#2563eb] shadow-md ring-1 ring-blue-900/5'
                                        : 'border-transparent text-slate-500 hover:bg-white/50 hover:text-[#0a192f]'
                                }`}
                            >
                                <span className="whitespace-nowrap">{name}</span>
                                <ChevronRight className={`hidden size-4 transition-transform lg:block ${
                                    activeDepartment === name ? 'translate-x-1' : 'opacity-0 group-hover:opacity-100'
                                }`} />
                            </button>
                        ))}
                    </div>

                    <GlassCard className="min-h-[340px] p-7 sm:p-10">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeDepartment}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3, ease: "easeOut" }}
                            >
                                <div className="mb-10 flex items-start justify-between">
                                    <div>
                                        <div className="mb-5 grid size-14 place-items-center rounded-2xl bg-blue-100 text-[#2563eb] shadow-sm">
                                            {activeDepartment === 'PSDM' && <Users className="size-6" />}
                                            {activeDepartment === 'Deplu' && <Globe className="size-6" />}
                                            {activeDepartment === 'Kepsos' && <HeartHandshake className="size-6" />}
                                            {activeDepartment === 'Ekraf' && <Lightbulb className="size-6" />}
                                            {activeDepartment === 'Medkominfo' && <Megaphone className="size-6" />}
                                        </div>
                                        <p className="text-xs font-bold uppercase tracking-[.18em] text-[#2563eb]">
                                            Departemen {activeDepartment}
                                        </p>
                                        <h3 className="mt-2 max-w-md text-2xl font-black tracking-tight text-[#0a192f] sm:text-3xl">
                                            {current.label}
                                        </h3>
                                    </div>
                                    <span className="hidden text-7xl font-black text-slate-100 sm:block">
                            0{Object.keys(departments).indexOf(activeDepartment) + 1}
                        </span>
                                </div>

                                <p className="max-w-2xl text-[15px] leading-relaxed text-slate-600">
                                    {current.desc}
                                </p>

                                <div className="mt-8 grid gap-4 sm:grid-cols-3">
                                    {current.programs.map((program: string, i: number) => (
                                        <motion.div
                                            key={program}
                                            initial={{ opacity: 0, y: 12 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.15 + i * 0.08 }}
                                            className="relative overflow-hidden rounded-2xl border border-slate-200/60 bg-white/80 p-4 text-sm font-bold text-[#0a192f] shadow-sm transition-all hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
                                        >
                                            <span className="mb-3 block size-2.5 rounded-full bg-[#2563eb] shadow-[0_0_8px_rgba(37,99,235,0.4)]" />
                                            {program}
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </GlassCard>
                </div>
            </section>

            <section id="agenda" className="bg-[#0a192f] px-6 py-24 text-white lg:px-10">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-14 flex items-end justify-between">
                        <div>
                            <p className="mb-3 text-xs font-bold uppercase tracking-[.2em] text-blue-400">Kalender kegiatan</p>
                            <h2 className="text-4xl font-black tracking-tight text-white sm:text-5xl">
                                Agenda <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">Terdekat.</span>
                            </h2>
                        </div>
                        <Link href="/events" className="group hidden text-sm font-bold text-blue-400 transition hover:text-white sm:flex sm:items-center">
                            Lihat semua <ArrowRight className="ml-1.5 size-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </div>

                    <div className="flex flex-col gap-2">
                        {AGENDA.map((event, index) => (
                            <motion.div
                                key={event.title}
                                initial={{ opacity: 0, x: -24 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: '-40px' }}
                                transition={{ delay: index * 0.1, duration: 0.55 }}
                                className={`group grid gap-5 rounded-2xl border border-transparent p-4 transition-all hover:border-white/10 hover:bg-white/[0.03] md:grid-cols-[auto_1fr_auto] md:items-center md:gap-8 md:p-6 ${index !== 0 ? 'border-t-white/10 rounded-none hover:rounded-2xl' : ''}`}
                            >
                                <div className="grid size-[76px] place-items-center rounded-2xl bg-blue-600/20 text-center shadow-inner transition-colors group-hover:bg-[#2563eb]">
                                    <div>
                                        <div className="text-2xl font-black leading-none text-blue-400 group-hover:text-white transition-colors">{event.date}</div>
                                        <div className="mt-1 text-[10px] font-bold tracking-widest text-blue-200 group-hover:text-blue-100 transition-colors">{event.month}</div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-xl font-extrabold text-white transition-colors group-hover:text-blue-400">{event.title}</h3>
                                    <p className="mt-1.5 text-sm leading-relaxed text-blue-100/60">{event.desc}</p>
                                    <p className="mt-4 flex items-center gap-1.5 text-xs font-medium text-slate-400">
                                        <MapPin className="size-3.5 text-blue-400" /> {event.place}
                                    </p>
                                </div>

                                <button className="mt-2 w-fit rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-xs font-bold text-blue-200 backdrop-blur-sm transition-all hover:scale-105 hover:border-blue-400 hover:bg-blue-600 hover:text-white hover:shadow-[0_0_15px_rgba(37,99,235,0.4)] md:mt-0">
                                    Add to Calendar <CalendarDays className="ml-1.5 inline size-3.5" />
                                </button>
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-10 flex justify-center sm:hidden">
                        <Link href="/events" className="flex w-full items-center justify-center rounded-full border border-blue-500/30 bg-blue-500/10 px-6 py-3 text-sm font-bold text-blue-400 transition hover:bg-blue-500 hover:text-white">
                            Lihat Semua Agenda <ArrowRight className="ml-2 size-4" />
                        </Link>
                    </div>
                </div>
            </section>

            <section id="berita" className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
                <div className="mb-14 flex items-end justify-between">
                    <div>
                        <p className="mb-3 text-xs font-bold uppercase tracking-[.2em] text-[#2563eb]">Cerita terbaru</p>
                        <h2 className="text-4xl font-black tracking-tight sm:text-5xl">Kabar <span className="bg-gradient-to-r from-[#2563eb] to-sky-400 bg-clip-text text-transparent">Terbaru.</span></h2>
                    </div>
                    <Link href="/news" className="group hidden text-sm font-bold text-[#2563eb] transition-colors hover:text-blue-700 sm:flex sm:items-center">
                        Semua kabar <ArrowRight className="ml-1.5 size-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    {newsData.map((article, i) => (
                        <motion.article
                            key={article.id}
                            initial={{ opacity: 0, y: 32 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-60px' }}
                            transition={{ delay: i * 0.12, duration: 0.6 }}
                            className="group flex flex-col overflow-hidden rounded-[1.7rem] border border-white/80 bg-white/60 shadow-lg shadow-blue-900/5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-blue-900/10"
                        >
                            <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100 sm:aspect-video">
                                <img
                                    src={article.image}
                                    alt={article.title}
                                    loading="lazy"
                                    className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                />
                                <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-[.15em] text-[#2563eb] shadow backdrop-blur">
                                    {article.category}
                                </span>
                            </div>
                            <div className="flex flex-1 flex-col p-6 sm:p-7">
                                <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-4">
                                    <span className="text-[10px] font-bold uppercase tracking-[.18em] text-[#2563eb]">
                            {article.category}
                        </span>
                                    <span className="text-xs font-medium text-slate-400">
                            {article.date}
                        </span>
                                </div>
                                <h3 className="text-xl font-extrabold leading-tight text-[#0a192f] transition-colors group-hover:text-[#2563eb] line-clamp-2">
                                    {article.title}
                                </h3>
                                <p className="mt-3 flex-1 text-[15px] leading-relaxed text-slate-600 line-clamp-3">
                                    {article.summary}
                                </p>
                                <a
                                    href={article.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-6 inline-flex w-fit items-center text-sm font-bold text-[#2563eb] transition-all hover:gap-2 group-hover:text-blue-700"
                                >
                                    Baca selengkapnya <ArrowUpRight className="ml-1.5 size-4" />
                                </a>
                            </div>
                        </motion.article>
                    ))}
                </div>

                <div className="mt-10 flex justify-center sm:hidden">
                    <Link href="/news" className="flex w-full items-center justify-center rounded-full bg-[#2563eb] px-6 py-3.5 text-sm font-bold text-white shadow-md transition hover:bg-blue-700">
                        Lihat Semua Kabar <ArrowRight className="ml-2 size-4" />
                    </Link>
                </div>
            </section>

            <section id="faq" className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
                {/* Header Section */}
                <div className="mb-14 text-center">
                    <p className="mb-3 text-xs font-bold uppercase tracking-[.2em] text-[#2563eb]">
                        Pertanyaan umum
                    </p>
                    <h2 className="text-4xl font-black tracking-tight sm:text-5xl text-[#0a192f]">
                        Sering <span className="bg-gradient-to-r from-[#2563eb] to-sky-400 bg-clip-text text-transparent">Ditanyakan.</span>
                    </h2>
                    <p className="mx-auto mt-4 max-w-xl text-sm font-medium leading-relaxed text-slate-500">
                        Punya pertanyaan seputar HIMATIFA, kegiatan kampus, atau ingin menyampaikan keluhan? Temukan jawabannya di bawah ini.
                    </p>
                </div>

                {/* Accordion FAQ Container */}
                <div className="mx-auto max-w-3xl space-y-4">
                    {faqData.map((item, index) => {
                        const isOpen = openIndex === index

                        return (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: '-40px' }}
                                transition={{ delay: index * 0.08, duration: 0.5 }}
                                className={`overflow-hidden rounded-[1.5rem] border transition-all duration-300 ${
                                    isOpen
                                        ? 'border-blue-200 bg-white/90 shadow-xl shadow-blue-900/5 backdrop-blur-xl'
                                        : 'border-white/80 bg-white/60 shadow-md shadow-blue-900/5 backdrop-blur-xl hover:bg-white/80'
                                }`}
                            >
                                <button
                                    onClick={() => toggleFAQ(index)}
                                    className="flex w-full items-center justify-between gap-4 p-6 text-left transition-colors"
                                    aria-expanded={isOpen}
                                >
                                    <div className="flex items-center gap-3.5">
                                        <div
                                            className={`flex size-9 shrink-0 items-center justify-center rounded-xl transition-colors ${
                                                isOpen ? 'bg-blue-100 text-[#2563eb]' : 'bg-slate-100 text-slate-500'
                                            }`}
                                        >
                                            <HelpCircle className="size-5" />
                                        </div>
                                        <span className="text-base font-bold text-[#0a192f] sm:text-lg">
                    {item.question}
                  </span>
                                    </div>
                                    <div
                                        className={`flex size-8 shrink-0 items-center justify-center rounded-full border border-slate-200/60 bg-white transition-transform duration-300 ${
                                            isOpen ? 'rotate-180 bg-blue-50 border-blue-200 text-[#2563eb]' : 'text-slate-400'
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
                                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                                        >
                                            <div className="border-t border-slate-100 px-6 pb-6 pt-4 text-sm leading-relaxed text-slate-600 sm:px-7 sm:text-[15px]">
                                                {item.answer}

                                                {/* Tautan Khusus Aspirasi pada FAQ No. 4 */}
                                                {item.hasLink && (
                                                    <div className="mt-4">
                                                        <Link
                                                            href="/aspirasi"
                                                            className="inline-flex items-center gap-2 rounded-xl bg-blue-50 px-4 py-2.5 text-xs font-bold text-[#2563eb] transition hover:bg-blue-100 hover:text-blue-700"
                                                        >
                                                            <MessageSquareWarning className="size-4" />
                                                            Buka Layanan Suara Mahasiswa
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
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="mx-auto mt-12 max-w-3xl rounded-[2rem] border border-blue-100 bg-gradient-to-r from-blue-50/80 via-indigo-50/50 to-sky-50/80 p-6 shadow-sm backdrop-blur-md sm:flex sm:items-center sm:justify-between sm:p-8"
                >
                    <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
                        <div className="flex size-12 items-center justify-center rounded-2xl bg-[#2563eb] text-white shadow-md shadow-blue-500/20">
                            <MessageSquareWarning className="size-6" />
                        </div>
                        <div>
                            <h4 className="text-base font-bold text-[#0a192f]">Punya keluhan atau masukan fasilitas?</h4>
                            <p className="mt-0.5 text-xs font-medium text-slate-500">Suara kamu membantu perbaikan fasilitas & layanan akademik.</p>
                        </div>
                    </div>
                    <Link
                        href="/aspirasi"
                        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#2563eb] px-5 py-3 text-xs font-bold text-white shadow-md transition-all hover:bg-blue-700 hover:shadow-lg sm:mt-0 sm:w-auto shrink-0"
                    >
                        Sampaikan Aspirasi <ArrowRight className="size-4" />
                    </Link>
                </motion.div>
            </section>

            <footer id="footer" className="relative bg-[#071426] px-6 pb-8 pt-20 text-white lg:px-10">
                <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
                <div aria-hidden className="pointer-events-none absolute -top-24 left-1/2 h-64 w-[700px] -translate-x-1/2 rounded-full bg-[#2563eb]/10 blur-[100px]" />

                <div className="relative mx-auto max-w-7xl">
                    <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">

                        <div className="lg:col-span-4 lg:pr-6">
                            <Link href="/" className="group flex w-fit items-center gap-3 font-black tracking-tight">
                    <span className="grid size-12 place-items-center rounded-2xl bg-white/5 ring-1 ring-white/10 transition-all duration-300 group-hover:bg-[#2563eb]/20 group-hover:ring-blue-500/50">
                        <Image
                            src="/himatifa1.png"
                            alt="Logo HIMATIFA UMSurabaya"
                            width={32}
                            height={32}
                            className="object-contain transition-transform duration-500 group-hover:scale-110"
                        />
                    </span>
                                <span className="text-xl tracking-wide text-white transition-colors group-hover:text-blue-400">
                        HIMATIFA
                    </span>
                            </Link>
                            <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-blue-100/60">
                                Himpunan Mahasiswa Teknik Informatika Universitas Muhammadiyah Surabaya. Bertumbuh, berkolaborasi, dan memberikan dampak.
                            </p>
                            <div className="mt-8 flex flex-wrap gap-3">
                                {SOCIALS.map(({ label, href, icon: Icon }) => (
                                    <Link
                                        key={label}
                                        aria-label={`${label} HIMATIFA`}
                                        href={href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="grid size-11 place-items-center rounded-xl bg-white/5 text-slate-300 ring-1 ring-white/10 transition-all duration-300 hover:-translate-y-1.5 hover:bg-[#2563eb] hover:text-white hover:ring-blue-500/40 hover:shadow-lg hover:shadow-blue-600/20"
                                    >
                                        <Icon className="size-4.5" />
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <div className="lg:col-span-2">
                            <h3 className="mb-6 text-xs font-black uppercase tracking-[.25em] text-white/90">Tautan</h3>
                            <ul className="flex flex-col gap-3.5 text-[14.5px] font-medium text-blue-100/60">
                                {navLinks.map((item) => (
                                    <li key={item.name}>
                                        <Link
                                            href={item.path}
                                            className="group inline-flex items-center gap-2 transition-colors hover:text-white"
                                        >
                                            <span className="h-px w-0 bg-blue-500 transition-all duration-300 group-hover:w-4" />
                                            {item.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="lg:col-span-3">
                            <h3 className="mb-6 text-xs font-black uppercase tracking-[.25em] text-white/90">Layanan</h3>
                            <ul className="flex flex-col gap-3.5 text-[14.5px] font-medium text-blue-100/60">
                                <li>
                                    <Link href="/akademik" className="group inline-flex items-center gap-2 transition-colors hover:text-white">
                                        <span className="h-px w-0 bg-blue-500 transition-all duration-300 group-hover:w-4" />
                                        Layanan Akademik
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/aspirasi" className="group inline-flex items-center gap-2 transition-colors hover:text-white">
                                        <span className="h-px w-0 bg-blue-500 transition-all duration-300 group-hover:w-4" />
                                        Suara Mahasiswa
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/showcase" className="group inline-flex items-center gap-2 transition-colors hover:text-white">
                                        <span className="h-px w-0 bg-blue-500 transition-all duration-300 group-hover:w-4" />
                                        Karya Mahasiswa
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        <div className="lg:col-span-3">
                            <h3 className="mb-6 text-xs font-black uppercase tracking-[.25em] text-white/90">Hubungi Kami</h3>
                            <ul className="flex flex-col gap-5 text-sm text-blue-100/60">
                                <li className="group flex items-start gap-4 transition-colors hover:text-white">
                        <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-white/5 ring-1 ring-white/10 transition-colors group-hover:bg-[#2563eb]/20 group-hover:ring-blue-500/50">
                            <MapPin className="size-4 text-blue-400" />
                        </span>
                                    <span className="text-[13px] leading-relaxed">
                            Gedung G Lt. 3, Universitas Muhammadiyah Surabaya<br />
                            Jl. Sutorejo No.59, Surabaya, Jawa Timur 60113
                        </span>
                                </li>
                                <li className="group flex items-center gap-4 transition-colors hover:text-white">
                        <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-white/5 ring-1 ring-white/10 transition-colors group-hover:bg-[#2563eb]/20 group-hover:ring-blue-500/50">
                            <Mail className="size-4 text-blue-400" />
                        </span>
                                    <a href="mailto:himatifa@um-surabaya.ac.id">
                                        himatifa@um-surabaya.ac.id
                                    </a>
                                </li>
                                <li className="group flex items-center gap-4 transition-colors hover:text-white">
                        <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-white/5 ring-1 ring-white/10 transition-colors group-hover:bg-[#2563eb]/20 group-hover:ring-blue-500/50">
                            <Phone className="size-4 text-blue-400" />
                        </span>
                                    <a href="tel:+6281234567890" className="tracking-wider">
                                        +62 812 3456 7890
                                    </a>
                                </li>
                            </ul>
                        </div>

                    </div>

                    <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
                        <p className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
                            <Copyright className="size-3.5" /> {new Date().getFullYear()} HIMATIFA UMSURA. Seluruh hak cipta dilindungi.
                        </p>
                        <p className="text-xs font-medium text-slate-400">
                            CREATED by MEDKOMINFO
                        </p>
                    </div>
                </div>
            </footer>

            <BackToTop />
        </main>
    )
}
