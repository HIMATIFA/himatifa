'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { createBrowserClient } from '@supabase/ssr'
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
    Loader2,
} from 'lucide-react'

const DEFAULT_AVATAR = '/default.jpeg'

type DepartmentKey = 'PSDM' | 'MEDKOMINFO' | 'EKRAF' | 'KEPSOS' | 'DEPLU'

interface PengurusSupabase {
    id: string
    name: string
    nim: string
    angkatan: string
    role: string
    division: string
    period: string
    status: string
    image: string | null
}

interface DepartmentInfo {
    key: DepartmentKey
    dbDivision: string
    label: string
    badge: string
    tagline: string
    desc: string
    divisionFocus: string
    image: string
    programs: string[]
}

const DEPARTMENT_CONFIG: Record<DepartmentKey, DepartmentInfo> = {
    PSDM: {
        key: 'PSDM',
        dbDivision: 'PSDM (Pengembangan Sumber Daya Mahasiswa)',
        label: 'Pengembangan Sumber Daya Mahasiswa',
        badge: 'Kaderisasi & Internal',
        tagline: 'Membangun solidaritas, kepemimpinan, dan karakter unggul mahasiswa Informatika.',
        desc: 'Departemen PSDM berfokus pada pembinaan internal organisasi, kaderisasi mahasiswa baru, serta penguatan kapasitas soft-skill dan kepemimpinan pengurus maupun anggota HIMATIFA.',
        divisionFocus: 'Kaderisasi mahasiswa baru, upgrading pengurus, dan pemetaan potensi SDM Informatika.',
        image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
        programs: ['LKMM Pra-TD & Kaderisasi', 'Upgrading Pengurus', 'Forum Aspirasi Mahasiswa'],
    },
    MEDKOMINFO: {
        key: 'MEDKOMINFO',
        dbDivision: 'MEDKOMINFO (Media Komunikasi dan Informasi)',
        label: 'Media Komunikasi dan Informasi',
        badge: 'Branding & Publikasi',
        tagline: 'Menjadi wajah digital dan jembatan informasi kreatif HIMATIFA UMSURA.',
        desc: 'Departemen MEDKOMINFO bertanggung jawab atas pengelolaan identitas visual, publikasi kegiatan, jurnalistik kampus, serta pengembangan media sosial dan portal informasi himpunan.',
        divisionFocus: 'Desain komunikasi visual, dokumentasi kegiatan, rilis pers, dan manajemen media digital.',
        image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80',
        programs: ['Branding & Feed Kreatif', 'Liputan & Rilis Pers', 'Podcast & Konten Edukasi'],
    },
    EKRAF: {
        key: 'EKRAF',
        dbDivision: 'EKRAF (Ekonomi Kreatif)',
        label: 'Ekonomi Kreatif',
        badge: 'Kewirausahaan & Produk',
        tagline: 'Mendorong kemandirian finansial organisasi melalui inovasi produk dan technopreneurship.',
        desc: 'Departemen EKRAF mengelola unit usaha himpunan, produksi atribut resmi (PDH & merchandise), serta menumbuhkan jiwa kewirausahaan berbasis teknologi di kalangan mahasiswa.',
        divisionFocus: 'Pengadaan PDH/atribut, pengelolaan dana usaha kreatif, dan inkubasi technopreneur.',
        image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1200&q=80',
        programs: ['Official Merch & PDH', 'HIMATIFA Store / Danus', 'Workshop Technopreneur'],
    },
    KEPSOS: {
        key: 'KEPSOS',
        dbDivision: 'KEPSOS (Kepedulian Sosial)',
        label: 'Kepedulian Sosial',
        badge: 'Pengabdian & Sosial',
        tagline: 'Menghadirkan manfaat nyata ilmu Informatika bagi masyarakat dan lingkungan sekitar.',
        desc: 'Departemen KEPSOS menginisiasi gerakan sosial, tanggap bencana, bakti masyarakat, serta program literasi digital untuk membangun kepekaan sosial mahasiswa.',
        divisionFocus: 'Bakti sosial masyarakat, aksi tanggap kemanusiaan, dan pengabdian berbasis teknologi.',
        image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=1200&q=80',
        programs: ['HIMATIFA Berbagi', 'Bakti Sosial & Desa Binaan', 'Aksi Tanggap Bencana'],
    },
    DEPLU: {
        key: 'DEPLU',
        dbDivision: 'DEPLU (Luar Negeri)',
        label: 'Hubungan Luar Negeri',
        badge: 'Relasi & Eksternal',
        tagline: 'Memperluas jejaring kemitraan strategis antar-institusi, komunitas, dan industri.',
        desc: 'Departemen DEPLU berperan sebagai representasi eksternal himpunan dalam menjalin studi banding, delegasi forum nasional (Permikomnas), serta kerja sama lintas kampus dan industri.',
        divisionFocus: 'Studi banding antar-himpunan, delegasi eksternal, dan kemitraan strategis.',
        image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=1200&q=80',
        programs: ['Studi Banding Himpunan', 'Delegasi Permikomnas', 'Kunjungan Industri & Mitra'],
    },
}

const DEPARTMENT_KEYS: DepartmentKey[] = ['PSDM', 'MEDKOMINFO', 'EKRAF', 'KEPSOS', 'DEPLU']

const departmentIcons: Record<DepartmentKey, React.ElementType> = {
    PSDM: Users,
    MEDKOMINFO: Megaphone,
    EKRAF: Lightbulb,
    KEPSOS: HeartHandshake,
    DEPLU: Globe,
}

const ROLE_ORDER: Record<string, number> = {
    'Ketua Departement': 1,
    'Sekretaris Departement': 2,
    'Anggota Department': 3,
}

function normalizeImageUrl(url: string | null | undefined): string {
    if (!url || !url.trim()) return DEFAULT_AVATAR
    const trimmed = url.trim()

    const fileMatch = trimmed.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/)
    if (fileMatch && fileMatch[1]) {
        return `https://drive.google.com/thumbnail?id=${fileMatch[1]}&sz=w1000`
    }

    const idMatch = trimmed.match(/drive\.google\.com\/(?:open|uc)\?.*id=([a-zA-Z0-9_-]+)/)
    if (idMatch && idMatch[1]) {
        return `https://drive.google.com/thumbnail?id=${idMatch[1]}&sz=w1000`
    }

    return trimmed
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

export default function DepartmentPage() {
    const { scrollYProgress } = useScroll()
    const progressScale = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.4 })

    const [selectedDepartment, setSelectedDepartment] = useState<DepartmentKey>('PSDM')
    const [allMembers, setAllMembers] = useState<PengurusSupabase[]>([])
    const [isLoading, setIsLoading] = useState(true)

    const supabase = useMemo(
        () =>
            createBrowserClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
            ),
        []
    )

    useEffect(() => {
        const fetchMembers = async () => {
            setIsLoading(true)
            const { data, error } = await supabase
                .from('bph_members')
                .select('*')
                .neq('status', 'Demisioner')
                .order('created_at', { ascending: true })

            if (error) {
                console.error('Gagal memuat anggota departemen:', error.message)
            } else {
                setAllMembers((data as PengurusSupabase[]) || [])
            }
            setIsLoading(false)
        }

        fetchMembers()
    }, [supabase])

    const membersByDept = useMemo(() => {
        const grouped: Record<DepartmentKey, PengurusSupabase[]> = {
            PSDM: [],
            MEDKOMINFO: [],
            EKRAF: [],
            KEPSOS: [],
            DEPLU: [],
        }

        allMembers.forEach((member) => {
            const divUpper = (member.division || '').toUpperCase()
            for (const key of DEPARTMENT_KEYS) {
                if (divUpper.startsWith(key)) {
                    grouped[key].push(member)
                    break
                }
            }
        })

        for (const key of DEPARTMENT_KEYS) {
            grouped[key].sort((a, b) => {
                const orderA = ROLE_ORDER[a.role] ?? 99
                const orderB = ROLE_ORDER[b.role] ?? 99
                if (orderA !== orderB) return orderA - orderB
                return a.name.localeCompare(b.name)
            })
        }

        return grouped
    }, [allMembers])

    const currentDept = DEPARTMENT_CONFIG[selectedDepartment]
    const DeptIcon = departmentIcons[selectedDepartment] || Users
    const currentMembers = membersByDept[selectedDepartment] || []
    const activeIndex = DEPARTMENT_KEYS.indexOf(selectedDepartment) + 1

    const ketuaCount = currentMembers.filter((m) => m.role === 'Ketua Departement').length
    const sekreCount = currentMembers.filter((m) => m.role === 'Sekretaris Departement').length
    const anggotaCount = currentMembers.filter((m) => m.role === 'Anggota Department').length

    return (
        <main className="relative min-h-screen bg-transparent text-slate-900 font-sans antialiased selection:bg-blue-100 selection:text-blue-900">
            <motion.div
                style={{ scaleX: progressScale }}
                className="fixed inset-x-0 top-0 z-50 h-1 origin-left bg-gradient-to-r from-blue-600 via-sky-400 to-indigo-600"
                aria-hidden
            />

            <div className="relative z-10 mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
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
                        Jelajahi profil departemen beserta susunan fungsionaris aktif yang terdiri dari Ketua Departemen, Sekretaris Departemen, dan Anggota Departemen periode 2026/2027.
                    </motion.p>
                </motion.div>

                <div className="feed-line-gradient my-6 opacity-70" />

                <motion.div
                    initial="hidden"
                    animate="show"
                    variants={reveal}
                    className="mt-6 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-3 shadow-xs sm:flex-row sm:items-center sm:justify-between sm:p-4"
                >
                    <div className="flex flex-wrap items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
                        {DEPARTMENT_KEYS.map((dept) => {
                            const isSelected = selectedDepartment === dept
                            const Icon = departmentIcons[dept]
                            const count = membersByDept[dept]?.length || 0

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
                                        {isLoading ? '...' : `${count} Anggota`}
                                    </span>
                                </button>
                            )
                        })}
                    </div>

                    <div className="text-xs font-semibold text-slate-500 hidden sm:block">
                        Fokus: <span className="text-blue-600 font-bold">{currentDept.badge}</span>
                    </div>
                </motion.div>

                <motion.div
                    key={`showcase-${selectedDepartment}`}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35 }}
                    className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
                >
                    <div className="grid lg:grid-cols-12 gap-0">
                        <div className="relative min-h-[260px] sm:min-h-[320px] lg:col-span-5 overflow-hidden bg-slate-900">
                            <img
                                src={currentDept.image}
                                alt={`Dokumentasi Departemen ${selectedDepartment}`}
                                className="size-full object-cover object-center transition-transform duration-700 hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-slate-950/20 lg:bg-gradient-to-r lg:from-transparent lg:to-slate-950/30" />

                            <div className="absolute top-4 left-4 z-10 flex items-center gap-2 rounded-xl bg-slate-900/80 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md border border-white/20">
                                <DeptIcon className="size-4 text-blue-400" />
                                <span>Departemen {selectedDepartment}</span>
                            </div>

                            <div className="absolute bottom-4 left-4 right-4 z-10 text-white">
                                <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-300">
                                    Visi Gerak Departemen
                                </span>
                                <p className="text-xs sm:text-sm font-medium text-slate-100 line-clamp-2 mt-0.5">
                                    {currentDept.tagline}
                                </p>
                            </div>
                        </div>

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
                                    {currentDept.divisionFocus}
                                </div>
                            </div>

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

                <div className="mt-12 sm:mt-16">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8">
                        <div>
                            <div className="flex items-center gap-2 text-blue-600 text-[10px] font-extrabold uppercase tracking-wider mb-1">
                                <Sparkles className="size-3.5" />
                                <span>Susunan Pengurus Departemen</span>
                            </div>
                            <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">
                                {currentMembers.length} Anggota Fungsionaris Departemen {selectedDepartment}
                            </h3>
                            <p className="mt-1 text-xs sm:text-sm text-slate-500">
                                Terdiri dari {ketuaCount} Ketua Departemen, {sekreCount} Sekretaris Departemen, dan {anggotaCount} Anggota Departemen.
                            </p>
                        </div>

                        <span className="inline-flex items-center gap-1.5 self-start sm:self-auto rounded-full bg-blue-50 border border-blue-200/60 px-3.5 py-1.5 text-xs font-bold text-blue-700">
                            <CheckCircle2 className="size-3.5 text-blue-600" />
                            <span>
                                {ketuaCount} Ketua • {sekreCount} Sekretaris • {anggotaCount} Anggota
                            </span>
                        </span>
                    </div>

                    {isLoading ? (
                        <div className="my-12 flex flex-col items-center justify-center gap-3 text-slate-500">
                            <Loader2 className="size-7 animate-spin text-blue-600" />
                            <p className="text-xs font-semibold">Memuat struktur fungsionaris dari database...</p>
                        </div>
                    ) : currentMembers.length > 0 ? (
                        <motion.div
                            key={`members-grid-${selectedDepartment}`}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
                        >
                            {currentMembers.map((member) => {
                                const isHead = member.role === 'Ketua Departement'
                                const isSecretary = member.role === 'Sekretaris Departement'
                                const displayRole = member.role.replace('Departement', 'Departemen')
                                const avatarSrc = normalizeImageUrl(member.image)

                                return (
                                    <div
                                        key={member.id}
                                        className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border bg-white p-4 transition-all duration-300 hover:-translate-y-1 ${
                                            isHead
                                                ? 'border-blue-300 shadow-sm ring-1 ring-blue-500/20 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-600/10'
                                                : isSecretary
                                                    ? 'border-slate-200 shadow-xs hover:border-blue-300 hover:shadow-md'
                                                    : 'border-slate-200/80 shadow-xs hover:border-slate-300 hover:shadow-md'
                                        }`}
                                    >
                                        <div>
                                            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-slate-100 mb-4">
                                                <img
                                                    src={avatarSrc}
                                                    alt={`Foto ${member.name} - ${displayRole}`}
                                                    onError={(e) => {
                                                        e.currentTarget.src = DEFAULT_AVATAR
                                                    }}
                                                    className="size-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-40 group-hover:opacity-20 transition-opacity" />

                                                <div className="absolute top-3 right-3 rounded-lg bg-slate-900/75 px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur-md border border-white/20">
                                                    Angkatan {member.angkatan}
                                                </div>

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
                                                        {displayRole}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="px-1">
                                                <h4 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                                                    {member.name}
                                                </h4>
                                                <p className="mt-1 text-xs text-slate-500 font-medium">
                                                    Periode Kepengurusan {member.period}
                                                </p>
                                            </div>
                                        </div>

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
                    ) : (
                        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
                            <p className="text-sm font-bold text-slate-700">
                                Belum ada data anggota aktif untuk departemen {selectedDepartment}.
                            </p>
                        </div>
                    )}
                </div>

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