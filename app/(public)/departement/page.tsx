'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
    motion,
    useScroll,
    useSpring,
    useReducedMotion,
    type Variants,
} from 'framer-motion'
import {
    Users,
    Globe,
    HeartHandshake,
    Lightbulb,
    Megaphone,
    ArrowLeft,
    ArrowUp,
    ArrowRight,
    Calendar,
    CheckCircle2,
    Shield,
    Sparkles,
    GraduationCap,
    Layers,
} from 'lucide-react'
import { departments, DepartmentKey } from '@/app/data'

interface DepartmentMember {
    name: string
    role: 'Ketua Departemen' | 'Sekretaris Departemen' | 'Anggota Departemen'
    cohort: string
    focus: string
    image: string
}

interface DepartmentVisualInfo {
    image: string
    badge: string
    tagline: string
    divisionFocus: string
}

const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.04, delayChildren: 0.02 } },
}

const reveal: Variants = {
    hidden: { opacity: 0, y: 6 },
    show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.25, ease: 'easeOut' },
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

const departmentIcons: Record<DepartmentKey, React.ElementType> = {
    PSDM: Users,
    Deplu: Globe,
    Kepsos: HeartHandshake,
    Ekraf: Lightbulb,
    Medkominfo: Megaphone,
}

const departmentVisuals: Record<DepartmentKey, DepartmentVisualInfo> = {
    PSDM: {
        image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&auto=format&fit=crop&q=80',
        badge: 'Kapasitas & Kaderisasi',
        tagline: 'Mencetak Talenta Digital yang Berdaya Saing & Berkarakter',
        divisionFocus: 'Fokus pada peningkatan soft-skill, hard-skill, dan iklim mentoring sesama mahasiswa.',
    },
    Deplu: {
        image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&auto=format&fit=crop&q=80',
        badge: 'Relasi & Kemitraan',
        tagline: 'Membangun Jejaring Lintas Kampus & Kolaborasi Industri',
        divisionFocus: 'Menghubungkan civitas HIMATIFA dengan dunia usaha, industri, dan forum himpunan nasional.',
    },
    Kepsos: {
        image: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=1200&auto=format&fit=crop&q=80',
        badge: 'Pengabdian & Kepedulian',
        tagline: 'Mengabdi dengan Hati, Menghadirkan Dampak Nyata',
        divisionFocus: 'Implementasi aksi sosial, tanggap kepedulian mahasiswa, dan literasi teknologi ke masyarakat.',
    },
    Ekraf: {
        image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&auto=format&fit=crop&q=80',
        badge: 'Kemandirian Finansial',
        tagline: 'Inkubasi Wirausaha & Produk Kreatif Berkelanjutan',
        divisionFocus: 'Mengembangkan unit usaha resmi himpunan, official merchandise, dan literasi entrepreneurship.',
    },
    Medkominfo: {
        image: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=1200&auto=format&fit=crop&q=80',
        badge: 'Media & Syiar Digital',
        tagline: 'Pusat Publikasi Visual, Informasi & Branding Organisasi',
        divisionFocus: 'Mengelola kanal komunikasi publik, konten kreatif, video dokumenter, dan platform web himpunan.',
    },
}

const departmentMembers: Record<DepartmentKey, DepartmentMember[]> = {
    PSDM: [
        {
            name: 'Fajar Dwi Santoso',
            role: 'Ketua Departemen',
            cohort: 'Angkatan 2023',
            focus: 'Kepemimpinan & Tata Kelola Kaderisasi',
            image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&auto=format&fit=crop&q=80',
        },
        {
            name: 'Nabila Putri Az-Zahra',
            role: 'Sekretaris Departemen',
            cohort: 'Angkatan 2024',
            focus: 'Administrasi, Notulensi & Database Anggota',
            image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&auto=format&fit=crop&q=80',
        },
        {
            name: 'Arya Budi Pratama',
            role: 'Anggota Departemen',
            cohort: 'Angkatan 2023',
            focus: 'Mentoring Mahasiswa & Alur Pengkaderan',
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80',
        },
        {
            name: 'Dimas Rizky Ramadhan',
            role: 'Anggota Departemen',
            cohort: 'Angkatan 2024',
            focus: 'Kurikulum Workshop & Bootcamp Pemrograman',
            image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=80',
        },
        {
            name: 'Cinta Laura Maharani',
            role: 'Anggota Departemen',
            cohort: 'Angkatan 2025',
            focus: 'Pendampingan & Keakraban Mahasiswa Baru',
            image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
        },
        {
            name: 'Gilang Fauzan Hakim',
            role: 'Anggota Departemen',
            cohort: 'Angkatan 2025',
            focus: 'Monitoring & Evaluasi Aktivitas Belajar',
            image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&auto=format&fit=crop&q=80',
        },
    ],
    Deplu: [
        {
            name: 'Rayhan Zaidan Akbar',
            role: 'Ketua Departemen',
            cohort: 'Angkatan 2023',
            focus: 'Strategi Kemitraan Industri & Eksternal Kampus',
            image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&auto=format&fit=crop&q=80',
        },
        {
            name: 'Alisya Khairunnisa',
            role: 'Sekretaris Departemen',
            cohort: 'Angkatan 2024',
            focus: 'Korespondensi Eksternal & Hubungan Tamu',
            image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=80',
        },
        {
            name: 'Farhan Maulana',
            role: 'Anggota Departemen',
            cohort: 'Angkatan 2023',
            focus: 'Program Company Visit & Kerja Sama Magang',
            image: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=600&auto=format&fit=crop&q=80',
        },
        {
            name: 'Zahra Aulia Rahma',
            role: 'Anggota Departemen',
            cohort: 'Angkatan 2024',
            focus: 'Jejaring Studi Banding Antar-Himpunan',
            image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&auto=format&fit=crop&q=80',
        },
        {
            name: 'Kevin Ananta Wijaya',
            role: 'Anggota Departemen',
            cohort: 'Angkatan 2025',
            focus: 'Pendelegasian Kompetisi & Forum Mahasiswa',
            image: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=600&auto=format&fit=crop&q=80',
        },
        {
            name: 'Tiara Salsabila',
            role: 'Anggota Departemen',
            cohort: 'Angkatan 2025',
            focus: 'Public Relations & Dokumentasi Hubungan Luar',
            image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80',
        },
    ],
    Kepsos: [
        {
            name: 'Ilham Wahyudi',
            role: 'Ketua Departemen',
            cohort: 'Angkatan 2023',
            focus: 'Inisiasi Pengabdian & Manajemen Bakti Sosial',
            image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&auto=format&fit=crop&q=80',
        },
        {
            name: 'Safira Annisa',
            role: 'Sekretaris Departemen',
            cohort: 'Angkatan 2024',
            focus: 'Pencatatan Donasi & Notulensi Kegiatan Sosial',
            image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&auto=format&fit=crop&q=80',
        },
        {
            name: 'Bagas Saputra',
            role: 'Anggota Departemen',
            cohort: 'Angkatan 2023',
            focus: 'Program Literasi Digital bagi Warga Sekitar',
            image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&auto=format&fit=crop&q=80',
        },
        {
            name: 'Maya Indah Lestari',
            role: 'Anggota Departemen',
            cohort: 'Angkatan 2024',
            focus: 'Koordinator Posko & Bantuan Kemanusiaan',
            image: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=600&auto=format&fit=crop&q=80',
        },
        {
            name: 'Rio Fernando',
            role: 'Anggota Departemen',
            cohort: 'Angkatan 2025',
            focus: 'Logistik Lapangan & Pendataan Relawan',
            image: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=600&auto=format&fit=crop&q=80',
        },
        {
            name: 'Dewi Anggraini',
            role: 'Anggota Departemen',
            cohort: 'Angkatan 2025',
            focus: 'Advokasi Sosial & Kesejahteraan Mahasiswa',
            image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&auto=format&fit=crop&q=80',
        },
    ],
    Ekraf: [
        {
            name: 'Danendra Putra',
            role: 'Ketua Departemen',
            cohort: 'Angkatan 2023',
            focus: 'Strategi Finansial & Inovasi Bisnis Kreatif',
            image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=80',
        },
        {
            name: 'Hanifah Nurul Izzah',
            role: 'Sekretaris Departemen',
            cohort: 'Angkatan 2024',
            focus: 'Pembukuan Kas Toko & Rekap Inventaris Produk',
            image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&auto=format&fit=crop&q=80',
        },
        {
            name: 'Rafi Ahmad Syahputra',
            role: 'Anggota Departemen',
            cohort: 'Angkatan 2023',
            focus: 'Desain Merchandise Resmi & Identitas Apparel',
            image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&auto=format&fit=crop&q=80',
        },
        {
            name: 'Anisa Rahmawati',
            role: 'Anggota Departemen',
            cohort: 'Angkatan 2024',
            focus: 'Pemasaran Digital & Kampanye Penjualan',
            image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&auto=format&fit=crop&q=80',
        },
        {
            name: 'Aditya Surya Pratama',
            role: 'Anggota Departemen',
            cohort: 'Angkatan 2025',
            focus: 'Pengelolaan Toko Fisik & Logistik Pengiriman',
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80',
        },
        {
            name: 'Vina Melinda',
            role: 'Anggota Departemen',
            cohort: 'Angkatan 2025',
            focus: 'Layanan Pemesanan & Promosi Katalog Kreatif',
            image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&auto=format&fit=crop&q=80',
        },
    ],
    Medkominfo: [
        {
            name: 'Haidar Ali Mukhtar',
            role: 'Ketua Departemen',
            cohort: 'Angkatan 2023',
            focus: 'Direksi Kreatif & Kebijakan Media Digital',
            image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&auto=format&fit=crop&q=80',
        },
        {
            name: 'Clarissa Aurelia',
            role: 'Sekretaris Departemen',
            cohort: 'Angkatan 2024',
            focus: 'Jadwal Editorial Publikasi & Arsip Dokumentasi',
            image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=80',
        },
        {
            name: 'Fachri Alamsyah',
            role: 'Anggota Departemen',
            cohort: 'Angkatan 2023',
            focus: 'Pengembangan & Pemeliharaan Website Himpunan',
            image: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=600&auto=format&fit=crop&q=80',
        },
        {
            name: 'Salma Nabilla',
            role: 'Anggota Departemen',
            cohort: 'Angkatan 2024',
            focus: 'Desain Grafis Konten Feed & Ilustrasi Info',
            image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
        },
        {
            name: 'Iqbal Ramadhan',
            role: 'Anggota Departemen',
            cohort: 'Angkatan 2024',
            focus: 'Videografi, Motion Graphic & Video Aftermovie',
            image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=80',
        },
        {
            name: 'Rizky Pratama',
            role: 'Anggota Departemen',
            cohort: 'Angkatan 2025',
            focus: 'Copywriting & Interaksi Komunitas Media Sosial',
            image: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=600&auto=format&fit=crop&q=80',
        },
    ],
}

export default function DepartmentPage() {
    const { scrollYProgress } = useScroll()
    const progressScale = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.4 })
    const [selectedDepartment, setSelectedDepartment] = useState<DepartmentKey>('PSDM')

    const currentDept = departments[selectedDepartment]
    const currentVisual = departmentVisuals[selectedDepartment]
    const DeptIcon = departmentIcons[selectedDepartment] || Users
    const departmentKeys = Object.keys(departments) as DepartmentKey[]
    const currentMembers = departmentMembers[selectedDepartment] || []
    const activeIndex = departmentKeys.indexOf(selectedDepartment) + 1

    return (
        <main className="relative min-h-screen bg-transparent text-slate-900 font-sans antialiased selection:bg-blue-100 selection:text-blue-900">
            {/* Scroll Progress Bar */}
            <motion.div
                style={{ scaleX: progressScale }}
                className="fixed inset-x-0 top-0 z-50 h-1 origin-left bg-gradient-to-r from-blue-600 via-sky-400 to-indigo-600"
                aria-hidden
            />

            {/* Container Max Width 6xl */}
            <div className="relative z-10 mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
                {/* 1. Top Navigation & Breadcrumbs */}
                <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 pb-6"
                >
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200/80 bg-white/90 px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-xs backdrop-blur-sm transition hover:border-blue-300 hover:bg-white hover:text-blue-600 active:scale-[0.98]"
                    >
                        <ArrowLeft className="size-3.5" />
                        <span>Kembali ke Beranda</span>
                    </Link>

                    <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                        <Link href="/" className="hover:text-slate-700 transition">
                            HIMATIFA
                        </Link>
                        <span>/</span>
                        <span className="font-bold text-slate-900">Departemen</span>
                    </div>
                </motion.div>

                {/* 2. Hero Header Section */}
                <motion.div
                    initial="hidden"
                    animate="show"
                    variants={container}
                    className="mt-8 mb-10 sm:mb-12 max-w-3xl"
                >
                    <motion.div variants={reveal} className="inline-flex items-center gap-2.5 rounded-full border border-blue-200/80 bg-blue-50/80 px-3.5 py-1.5 text-xs font-bold text-blue-700 mb-4 backdrop-blur-sm shadow-xs">
                        <span className="size-2 rounded-full bg-blue-600 animate-pulse" />
                        <span className="tracking-wide uppercase text-[10px]">Struktur Departemen & Fungsionaris</span>
                    </motion.div>
                    <motion.h1
                        variants={reveal}
                        className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight"
                    >
                        Lima Pilar Gerak <span className="feed-text-gradient">HIMATIFA</span>
                    </motion.h1>
                    <motion.p
                        variants={reveal}
                        className="mt-3.5 text-sm sm:text-base leading-relaxed text-slate-600 font-normal"
                    >
                        Jelajahi profil visual departemen beserta susunan fungsionaris aktif yang terdiri dari Ketua Departemen, Sekretaris Departemen, dan Anggota Departemen periode 2026/2027.
                    </motion.p>
                </motion.div>

                <div className="feed-line-gradient my-6 opacity-70" />

                {/* 3. Filter Tab Menu (Pilihan Departemen) */}
                <motion.div
                    initial="hidden"
                    animate="show"
                    variants={reveal}
                    className="mt-6 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-3 shadow-xs sm:flex-row sm:items-center sm:justify-between sm:p-4"
                >
                    <div className="flex flex-wrap items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
                        {departmentKeys.map((dept) => {
                            const isSelected = selectedDepartment === dept
                            const Icon = departmentIcons[dept]

                            return (
                                <button
                                    key={dept}
                                    onClick={() => setSelectedDepartment(dept)}
                                    className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition-all cursor-pointer ${
                                        isSelected
                                            ? 'bg-blue-600 text-white shadow-xs'
                                            : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                                    }`}
                                >
                                    <Icon className="size-3.5" />
                                    <span>{dept}</span>
                                    <span
                                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                                            isSelected ? 'bg-white/20 text-white' : 'bg-slate-200/70 text-slate-500'
                                        }`}
                                    >
                                        6 Anggota
                                    </span>
                                </button>
                            )
                        })}
                    </div>

                    <div className="text-xs font-semibold text-slate-500 hidden sm:block">
                        Fokus: <span className="text-blue-600 font-bold">{currentVisual.badge}</span>
                    </div>
                </motion.div>

                {/* 4. Departemen Showcase & Foto Departemen Banner */}
                <motion.div
                    key={`showcase-${selectedDepartment}`}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35 }}
                    className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
                >
                    <div className="grid lg:grid-cols-12 gap-0">
                        {/* Foto Visual Departemen (Representatif) */}
                        <div className="relative min-h-[260px] sm:min-h-[320px] lg:col-span-5 overflow-hidden bg-slate-900">
                            <Image
                                src={currentVisual.image}
                                alt={`Dokumentasi dan Aktivitas Departemen ${selectedDepartment}`}
                                fill
                                sizes="(max-width: 1024px) 100vw, 42vw"
                                className="object-cover object-center transition-transform duration-700 hover:scale-105"
                                priority
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-slate-950/20 lg:bg-gradient-to-r lg:from-transparent lg:to-slate-950/30" />

                            {/* Badge Foto Departemen */}
                            <div className="absolute top-4 left-4 z-10 flex items-center gap-2 rounded-xl bg-slate-900/80 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md border border-white/20">
                                <DeptIcon className="size-4 text-blue-400" />
                                <span>Foto Kegiatan {selectedDepartment}</span>
                            </div>

                            <div className="absolute bottom-4 left-4 right-4 z-10 text-white">
                                <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-300">
                                    Visi Gerak Departemen
                                </span>
                                <p className="text-xs sm:text-sm font-medium text-slate-100 line-clamp-2 mt-0.5">
                                    {currentVisual.tagline}
                                </p>
                            </div>
                        </div>

                        {/* Deskripsi & Program Kerja Departemen */}
                        <div className="p-6 sm:p-8 lg:col-span-7 flex flex-col justify-between">
                            <div>
                                <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-100">
                                    <div className="flex items-center gap-3">
                                        <div className="grid size-11 place-items-center rounded-xl bg-blue-50 text-blue-600">
                                            <DeptIcon className="size-5.5" />
                                        </div>
                                        <div>
                                            <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-600">
                                                Departemen 0{activeIndex} • HIMATIFA
                                            </span>
                                            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">
                                                {currentDept.label}
                                            </h2>
                                        </div>
                                    </div>
                                    <span className="font-mono text-3xl sm:text-4xl font-black text-slate-200 select-none">
                                        0{activeIndex}
                                    </span>
                                </div>

                                <p className="mt-4 text-xs sm:text-sm leading-relaxed text-slate-600 font-normal">
                                    {currentDept.desc}
                                </p>

                                <div className="mt-3 rounded-xl bg-slate-50 border border-slate-100 p-3 text-xs text-slate-600">
                                    <span className="font-bold text-slate-800">Cakupan Peran: </span>
                                    {currentVisual.divisionFocus}
                                </div>
                            </div>

                            {/* Program Kerja Unggulan */}
                            <div className="mt-6 pt-4 border-t border-slate-100">
                                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-3">
                                    <Calendar className="size-3.5 text-blue-600" />
                                    Program Kerja Unggulan
                                </span>
                                <div className="grid gap-2.5 sm:grid-cols-3">
                                    {currentDept.programs.map((prog) => (
                                        <div
                                            key={prog}
                                            className="flex items-center gap-2 rounded-xl border border-slate-200/70 bg-white p-2.5 text-xs font-semibold text-slate-800 shadow-xs"
                                        >
                                            <span className="size-1.5 rounded-full bg-blue-600 shrink-0" />
                                            <span className="leading-snug">{prog}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* 5. ANGGOTA DEPARTEMEN SECTION (Foto & Struktur: Ketua, Sekretaris, Anggota) */}
                <div className="mt-12 sm:mt-16">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8">
                        <div>
                            <div className="flex items-center gap-2 text-blue-600 text-[10px] font-extrabold uppercase tracking-wider mb-1">
                                <Sparkles className="size-3.5" />
                                <span>Susunan Pengurus Departemen</span>
                            </div>
                            <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">
                                6 Anggota Fungsionaris Departemen {selectedDepartment}
                            </h3>
                            <p className="mt-1 text-xs sm:text-sm text-slate-500">
                                Terdiri dari 1 Ketua Departemen, 1 Sekretaris Departemen, dan 4 Anggota Departemen.
                            </p>
                        </div>

                        <span className="inline-flex items-center gap-1.5 self-start sm:self-auto rounded-full bg-blue-50 border border-blue-200/60 px-3.5 py-1.5 text-xs font-bold text-blue-700">
                            <CheckCircle2 className="size-3.5 text-blue-600" />
                            <span>1 Ketua • 1 Sekretaris • 4 Anggota</span>
                        </span>
                    </div>

                    {/* Grid 6 Anggota dengan Foto Potret (Responsive 1 col mobile, 2 col tablet, 3 col desktop) */}
                    <motion.div
                        key={`members-grid-${selectedDepartment}`}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
                    >
                        {currentMembers.map((member) => {
                            const isHead = member.role === 'Ketua Departemen'
                            const isSecretary = member.role === 'Sekretaris Departemen'

                            return (
                                <div
                                    key={member.name}
                                    className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border bg-white p-4 transition-all duration-300 hover:-translate-y-1 ${
                                        isHead
                                            ? 'border-blue-300 shadow-sm ring-1 ring-blue-500/20 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-600/10'
                                            : isSecretary
                                            ? 'border-slate-200 shadow-xs hover:border-blue-300 hover:shadow-md'
                                            : 'border-slate-200/80 shadow-xs hover:border-slate-300 hover:shadow-md'
                                    }`}
                                >
                                    <div>
                                        {/* Foto Potret Anggota */}
                                        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-slate-100 mb-4">
                                            <Image
                                                src={member.image}
                                                alt={`Foto ${member.name} - ${member.role}`}
                                                fill
                                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                                className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-40 group-hover:opacity-20 transition-opacity" />

                                            {/* Badge Angkatan (Top Right) */}
                                            <div className="absolute top-3 right-3 rounded-lg bg-slate-900/75 px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur-md border border-white/20">
                                                {member.cohort}
                                            </div>

                                            {/* Badge Peran (Bottom Left) */}
                                            <div className="absolute bottom-3 left-3">
                                                <span
                                                    className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[10px] font-bold tracking-wide uppercase shadow-sm ${
                                                        isHead
                                                            ? 'bg-blue-600 text-white'
                                                            : isSecretary
                                                            ? 'bg-white text-blue-700 border border-blue-200'
                                                            : 'bg-white text-slate-700 border border-slate-200'
                                                    }`}
                                                >
                                                    <Shield className="size-3" />
                                                    {member.role}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Info Nama & Fokus */}
                                        <div className="px-1">
                                            <h4 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                                                {member.name}
                                            </h4>
                                            <p className="mt-1.5 text-xs text-slate-500 font-normal leading-relaxed line-clamp-2">
                                                {member.focus}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Footer Info Anggota */}
                                    <div className="mt-4 pt-3 border-t border-slate-100 px-1 flex items-center justify-between text-[11px] text-slate-400">
                                        <span className="flex items-center gap-1.5 font-medium text-slate-500">
                                            <GraduationCap className="size-3.5 text-blue-600" />
                                            <span>S1 Informatika</span>
                                        </span>
                                        <span className="font-mono text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                                            {selectedDepartment}
                                        </span>
                                    </div>
                                </div>
                            )
                        })}
                    </motion.div>
                </div>

                {/* 6. Bottom Banner Kolaborasi */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="mt-16 sm:mt-20 rounded-2xl border border-slate-900 bg-slate-900 p-6 sm:p-8 text-white shadow-xs lg:flex lg:items-center lg:justify-between"
                >
                    <div className="max-w-xl">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-400">
                            Kolaborasi Antar-Departemen
                        </span>
                        <h3 className="mt-1 text-xl sm:text-2xl font-extrabold tracking-tight text-white">
                            Punya Gagasan Program untuk HIMATIFA?
                        </h3>
                        <p className="mt-1.5 text-xs text-slate-300 font-medium leading-relaxed">
                            Kami selalu terbuka untuk berkolaborasi dengan mahasiswa, dosen, mitra industri, dan komunitas dalam menciptakan karya yang berdampak nyata.
                        </p>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-2.5 lg:mt-0">
                        <Link
                            href="/contact"
                            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-blue-600/10 transition hover:bg-blue-500 active:scale-[0.98]"
                        >
                            <span>Hubungi Pengurus</span>
                            <ArrowRight className="size-3.5" />
                        </Link>
                    </div>
                </motion.div>
            </div>

            <BackToTop />
        </main>
    )
}
