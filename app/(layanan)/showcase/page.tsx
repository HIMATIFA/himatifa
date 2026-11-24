'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence, type Variants } from 'framer-motion'
import { showcaseProjects, type ProjectItem } from '@/app/data'
import {
    ArrowLeft,
    ExternalLink,
    MonitorSmartphone,
    Sparkles,
    Copyright,
    Search,
    X,
    Heart,
    UploadCloud,
    Check,
    Layers,
    Share2
} from 'lucide-react'

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
    >
        <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
        <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
)

const categories = [
    { id: 'all', label: 'Semua Karya' },
    { id: 'web', label: 'Web Application' },
    { id: 'mobile', label: 'Mobile App' },
    { id: 'iot', label: 'IoT & Hardware' }
]

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.08 }
    }
}

const cardVariants: Variants = {
    hidden: { opacity: 0, y: 16 },
    show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
    }
}

export default function ShowcasePage() {
    const [searchQuery, setSearchQuery] = useState('')
    const [activeCategory, setActiveCategory] = useState('all')
    const [likes, setLikes] = useState<Record<number, number>>({ 1: 42, 2: 29, 3: 35 })
    const [hasLiked, setHasLiked] = useState<Record<number, boolean>>({})
    const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null)
    const [showSubmitModal, setShowSubmitModal] = useState(false)
    const [shareToast, setShareToast] = useState(false)

    const toggleLike = (id: number, e: React.MouseEvent) => {
        e.stopPropagation()
        setHasLiked((prev) => {
            const current = !!prev[id]
            setLikes((l) => ({
                ...l,
                [id]: (l[id] || 0) + (current ? -1 : 1)
            }))
            return { ...prev, [id]: !current }
        })
    }

    const handleShare = (project: ProjectItem, e: React.MouseEvent) => {
        e.stopPropagation()
        navigator.clipboard.writeText(`${window.location.origin}/showcase#${project.id}`)
        setShareToast(true)
        setTimeout(() => setShareToast(false), 2000)
    }

    const filteredProjects = useMemo(() => {
        return showcaseProjects.filter((p) => {
            // Category filter
            if (activeCategory === 'web') {
                const isWeb = p.tags.some((t) => ['Next.js', 'Web', 'React', 'Tailwind'].includes(t))
                if (!isWeb) return false
            }
            if (activeCategory === 'mobile') {
                const isMobile = p.tags.some((t) => ['Capacitor', 'Mobile', 'Flutter'].includes(t))
                if (!isMobile) return false
            }
            if (activeCategory === 'iot') {
                const isIot = p.tags.some((t) => ['ESP32', 'C++', 'I2C Sensors', 'Hardware'].includes(t))
                if (!isIot) return false
            }

            // Search query filter
            if (!searchQuery.trim()) return true
            const query = searchQuery.toLowerCase()
            const matchTitle = p.title.toLowerCase().includes(query)
            const matchDev = p.developer.toLowerCase().includes(query)
            const matchDesc = p.desc.toLowerCase().includes(query)
            const matchTags = p.tags.some((t) => t.toLowerCase().includes(query))

            return matchTitle || matchDev || matchDesc || matchTags
        })
    }, [searchQuery, activeCategory])

    return (
        <main className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased relative overflow-hidden">
            {/* Background Grid Pattern Decoration */}
            <div className="absolute inset-0 -z-10 feed-grid-squares opacity-40 pointer-events-none" />

            {/* Ambient Glow Orbs */}
            <div className="absolute top-20 right-1/4 -z-10 size-[420px] rounded-full bg-blue-400/10 blur-[130px] pointer-events-none" />
            <div className="absolute top-96 left-12 -z-10 size-[360px] rounded-full bg-indigo-400/10 blur-[120px] pointer-events-none" />

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
                {/* Back Link */}
                <motion.div
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white/90 px-3.5 py-2 text-xs font-semibold text-slate-600 shadow-xs backdrop-blur-xs transition hover:border-slate-300 hover:bg-white hover:text-slate-900 active:scale-[0.98]"
                    >
                        <ArrowLeft className="size-3.5" />
                        <span>Kembali ke Beranda</span>
                    </Link>
                </motion.div>

                {/* Hero Header */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.05 }}
                    className="mt-8 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6"
                >
                    <div className="max-w-3xl">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="h-[1px] w-6 sm:w-12 bg-blue-600/40" />
                            <span className="text-[10px] sm:text-xs font-bold tracking-[0.25em] uppercase text-blue-600">
                                Galeri Karya & Inovasi Teknologi
                            </span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
                            Showcase <span className="text-blue-600">Mahasiswa</span>
                        </h1>
                        <p className="mt-3 text-sm sm:text-base leading-relaxed text-slate-600 font-normal">
                            Eksplorasi portofolio aplikasi, solusi Internet of Things, dan karya inovatif yang dikembangkan oleh mahasiswa S1 Informatika UMSURA.
                        </p>
                    </div>

                    <button
                        onClick={() => setShowSubmitModal(true)}
                        className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-xs transition hover:bg-blue-500 active:scale-[0.98] cursor-pointer"
                    >
                        <UploadCloud className="size-4" />
                        <span>Ajukan Karyamu</span>
                    </button>
                </motion.div>

                {/* Search & Filter Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="mb-8 flex flex-col gap-4 rounded-2xl border border-slate-200/90 bg-white/90 p-3 sm:p-4 shadow-xs backdrop-blur-xs"
                >
                    <div className="relative">
                        <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Cari berdasarkan judul aplikasi, nama pengembang, atau teknologi (e.g. Next.js, IoT)..."
                            className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 pl-10 pr-9 text-xs sm:text-sm font-medium text-slate-900 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/10 placeholder:text-slate-400"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-700"
                            >
                                <X className="size-3.5" />
                            </button>
                        )}
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100">
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id)}
                                className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
                                    activeCategory === cat.id
                                        ? 'bg-blue-600 text-white shadow-xs'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
                                }`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* Share Toast */}
                <AnimatePresence>
                    {shareToast && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="fixed top-6 right-6 z-50 flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white shadow-lg"
                        >
                            <Check className="size-4 text-emerald-400" />
                            <span>Tautan showcase disalin ke clipboard!</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Showcase Cards Grid */}
                {filteredProjects.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white/60 p-12 text-center backdrop-blur-xs">
                        <div className="grid size-12 place-items-center rounded-xl bg-slate-100 text-slate-400 mb-3">
                            <Layers className="size-6" />
                        </div>
                        <h3 className="text-base font-bold text-slate-800">Karya Tidak Ditemukan</h3>
                        <p className="mt-1 text-xs text-slate-500 max-w-sm">
                            Tidak ada proyek yang sesuai dengan kata kunci &quot;{searchQuery}&quot;. Silakan coba filter lainnya.
                        </p>
                        <button
                            onClick={() => {
                                setSearchQuery('')
                                setActiveCategory('all')
                            }}
                            className="mt-4 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-blue-600 hover:bg-slate-50 transition"
                        >
                            Reset Filter
                        </button>
                    </div>
                ) : (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
                    >
                        {filteredProjects.map((project) => (
                            <motion.div
                                key={project.id}
                                variants={cardVariants}
                                onClick={() => setSelectedProject(project)}
                                className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs transition-all duration-200 hover:border-blue-300 hover:shadow-md cursor-pointer"
                            >
                                <div>
                                    {/* Project Preview Image */}
                                    <div className="relative aspect-16/10 w-full overflow-hidden bg-slate-100 border-b border-slate-100">
                                        <div className="flex h-full w-full items-center justify-center bg-slate-100 text-slate-300">
                                            <MonitorSmartphone className="size-12" />
                                        </div>

                                        {project.image && (
                                            <Image
                                                src={project.image}
                                                alt={project.title}
                                                fill
                                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                                onError={(e) => {
                                                    e.currentTarget.style.display = 'none'
                                                }}
                                            />
                                        )}

                                        {/* Floating Like Button */}
                                        <button
                                            onClick={(e) => toggleLike(project.id, e)}
                                            className={`absolute top-3 right-3 flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold backdrop-blur-md transition-all shadow-xs ${
                                                hasLiked[project.id]
                                                    ? 'bg-rose-500 text-white'
                                                    : 'bg-white/90 text-slate-700 hover:bg-white hover:text-rose-500'
                                            }`}
                                        >
                                            <Heart className={`size-3.5 ${hasLiked[project.id] ? 'fill-white' : ''}`} />
                                            <span>{likes[project.id] || 0}</span>
                                        </button>
                                    </div>

                                    {/* Project Info */}
                                    <div className="p-5 sm:p-6">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-[11px] font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2.5 py-0.5 rounded-md">
                                                {project.developer}
                                            </span>
                                            <button
                                                onClick={(e) => handleShare(project, e)}
                                                className="text-slate-400 hover:text-slate-700 p-1"
                                                title="Bagikan Tautan"
                                            >
                                                <Share2 className="size-3.5" />
                                            </button>
                                        </div>

                                        <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                                            {project.title}
                                        </h3>

                                        <p className="mt-2 text-xs font-medium leading-relaxed text-slate-500 line-clamp-3">
                                            {project.desc}
                                        </p>

                                        {/* Tech Stack Tags */}
                                        <div className="mt-4 flex flex-wrap gap-1.5">
                                            {project.tags.map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-2">
                                    <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                                        {project.repo && project.repo !== '#' && (
                                            <a
                                                href={project.repo}
                                                target="_blank"
                                                rel="noreferrer"
                                                onClick={(e) => e.stopPropagation()}
                                                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-slate-900 py-2.5 text-xs font-semibold text-white transition hover:bg-slate-800 active:scale-[0.98]"
                                            >
                                                <GithubIcon className="size-3.5" />
                                                <span>Repository</span>
                                            </a>
                                        )}
                                        <a
                                            href={project.link}
                                            target="_blank"
                                            rel="noreferrer"
                                            onClick={(e) => e.stopPropagation()}
                                            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-semibold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50/50 hover:text-blue-600 active:scale-[0.98]"
                                        >
                                            <span>Live Demo</span>
                                            <ExternalLink className="size-3 text-slate-400" />
                                        </a>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}

                {/* Detail Project Modal */}
                <AnimatePresence>
                    {selectedProject && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-xl overflow-hidden"
                            >
                                <button
                                    onClick={() => setSelectedProject(null)}
                                    className="absolute top-4 right-4 rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                                >
                                    <X className="size-5" />
                                </button>

                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-[11px] font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2.5 py-0.5 rounded-md">
                                        {selectedProject.developer}
                                    </span>
                                    <span className="text-xs text-slate-400 font-mono">
                                        ID #{selectedProject.id}
                                    </span>
                                </div>

                                <h2 className="text-xl font-bold text-slate-900">
                                    {selectedProject.title}
                                </h2>

                                <p className="mt-3 text-xs sm:text-sm font-medium leading-relaxed text-slate-600">
                                    {selectedProject.desc}
                                </p>

                                <div className="mt-4">
                                    <span className="text-xs font-bold text-slate-700 block mb-2">
                                        Teknologi & Framework:
                                    </span>
                                    <div className="flex flex-wrap gap-1.5">
                                        {selectedProject.tags.map((t) => (
                                            <span
                                                key={t}
                                                className="rounded-md bg-blue-50 border border-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700"
                                            >
                                                {t}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="mt-6 flex items-center gap-3 pt-4 border-t border-slate-100">
                                    {selectedProject.repo && selectedProject.repo !== '#' && (
                                        <a
                                            href={selectedProject.repo}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-900 py-2.5 text-xs font-semibold text-white hover:bg-slate-800 transition"
                                        >
                                            <GithubIcon className="size-4" />
                                            <span>Buka Repository</span>
                                        </a>
                                    )}
                                    <a
                                        href={selectedProject.link}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 py-2.5 text-xs font-semibold text-white hover:bg-blue-500 transition"
                                    >
                                        <ExternalLink className="size-4" />
                                        <span>Buka Demo</span>
                                    </a>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* Submit Project Guide Modal */}
                <AnimatePresence>
                    {showSubmitModal && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl"
                            >
                                <button
                                    onClick={() => setShowSubmitModal(false)}
                                    className="absolute top-4 right-4 rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                                >
                                    <X className="size-5" />
                                </button>

                                <div className="grid size-12 place-items-center rounded-xl bg-blue-50 text-blue-600 mb-4">
                                    <Sparkles className="size-6" />
                                </div>

                                <h2 className="text-xl font-bold text-slate-900">
                                    Ajukan Karyamu ke Showcase!
                                </h2>
                                <p className="mt-1 text-xs text-slate-500">
                                    Dapatkan pengakuan dan publikasi karya Anda di situs resmi HIMATIFA UMSURA.
                                </p>

                                <div className="mt-4 space-y-2.5 text-xs text-slate-600">
                                    <div className="flex items-start gap-2">
                                        <div className="grid size-4 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-600 mt-0.5">
                                            <Check className="size-2.5" />
                                        </div>
                                        <span>Mahasiswa aktif S1 Informatika UMSURA.</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <div className="grid size-4 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-600 mt-0.5">
                                            <Check className="size-2.5" />
                                        </div>
                                        <span>Proyek berupa aplikasi web, mobile, IoT, atau AI yang berfungsi.</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <div className="grid size-4 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-600 mt-0.5">
                                            <Check className="size-2.5" />
                                        </div>
                                        <span>Menyertakan screenshot antarmuka & tautan GitHub / demo publik.</span>
                                    </div>
                                </div>

                                <div className="mt-6 flex flex-col gap-2">
                                    <a
                                        href="https://wa.me/6281234567890?text=Halo%20Admin%20HIMATIFA,%20saya%20ingin%20mengajukan%20karya%20proyek%20untuk%20Showcase%20Mahasiswa."
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-2.5 text-xs font-semibold text-white hover:bg-blue-500 transition"
                                    >
                                        <span>Hubungi Tim Kurasi via WhatsApp</span>
                                        <ExternalLink className="size-3.5" />
                                    </a>
                                    <button
                                        onClick={() => setShowSubmitModal(false)}
                                        className="rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
                                    >
                                        Tutup
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* Footer */}
                <motion.footer
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="mt-16 flex flex-col items-center justify-between gap-3 border-t border-slate-200 pt-6 sm:flex-row text-xs text-slate-400 font-medium"
                >
                    <p className="flex items-center gap-1.5">
                        <Copyright className="size-3.5" /> 2026 HIMATIFA UMSURA
                    </p>
                    <p>Departemen Media, Komunikasi & Informasi (Medkominfo)</p>
                </motion.footer>
            </div>
        </main>
    )
}
