'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import {
    motion,
    useScroll,
    useSpring,
    useReducedMotion,
    type Variants
} from 'framer-motion'
import { newsData, type NewsItem } from '@/app/data'
import {
    Search,
    ArrowUpRight,
    ArrowLeft,
    Calendar,
    Newspaper,
    ArrowUp,
    Copyright,
    X,
    Clock,
    Minus
} from 'lucide-react'

const categories = ["Semua", "Organisasi", "Kegiatan", "Prestasi", "Info Kampus"]

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

export default function NewsPage() {
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('Semua')

    const { scrollYProgress } = useScroll()
    const progressScale = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.4 })

    const publishedNews = useMemo(() => {
        return newsData.filter((article) => article.status === 'Published' || !article.status)
    }, [])

    const filteredNews = useMemo(() => {
        return publishedNews.filter((article) => {
            const matchesCategory = selectedCategory === 'Semua' || article.category === selectedCategory
            const q = searchQuery.toLowerCase().trim()
            const matchesSearch =
                !q ||
                article.title.toLowerCase().includes(q) ||
                article.summary.toLowerCase().includes(q)
            return matchesCategory && matchesSearch
        })
    }, [publishedNews, searchQuery, selectedCategory])

    const featuredArticle = publishedNews[0]

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
                        <span className="font-bold text-slate-900">Kabar & Berita</span>
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
                            Berita & Jurnal Mahasiswa
                        </span>
                    </motion.div>
                    <motion.h1 variants={reveal} className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
                        Kabar, Cerita & <span className="text-blue-600">Jejak Prestasi</span>
                    </motion.h1>
                    <motion.p variants={reveal} className="mt-3 text-sm sm:text-base leading-relaxed text-slate-600 font-normal">
                        Dokumentasi resmi liputan kegiatan, publikasi program kerja, dan rekam jejak prestasi mahasiswa S1 Informatika UMSURA.
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
                                ? publishedNews.length
                                : publishedNews.filter((item) => item.category === category).length

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
                            placeholder="Cari kabar atau topik..."
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

                {selectedCategory === 'Semua' && !searchQuery && featuredArticle && (
                    <motion.section
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, margin: '-60px' }}
                        variants={reveal}
                        className="mt-8"
                    >
                        <div className="mb-3 flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-blue-600">
                            <Minus className="size-3.5" />
                            <span>Sorotan Utama</span>
                        </div>

                        <article className="group relative grid overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs transition hover:border-blue-300 hover:shadow-md lg:grid-cols-12">
                            <div className="relative aspect-16/10 w-full overflow-hidden bg-slate-100 lg:col-span-7 lg:aspect-auto lg:min-h-[360px]">
                                {featuredArticle.image ? (
                                    <img
                                        src={featuredArticle.image}
                                        alt={featuredArticle.title}
                                        className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center bg-slate-100 text-slate-300">
                                        <Newspaper className="size-12" />
                                    </div>
                                )}
                                <div className="absolute left-4 top-4">
                                    <span className="rounded-lg bg-blue-600/90 px-3 py-1 text-xs font-bold text-white shadow-xs backdrop-blur-xs">
                                        {featuredArticle.category}
                                    </span>
                                </div>
                            </div>

                            <div className="flex flex-col justify-between p-6 sm:p-8 lg:col-span-5">
                                <div>
                                    <div className="flex items-center gap-3 text-xs font-medium text-slate-400 border-b border-slate-100 pb-3">
                                        <span className="flex items-center gap-1.5">
                                            <Calendar className="size-3.5 text-blue-600" />
                                            <span>{featuredArticle.date}</span>
                                        </span>
                                        <span>•</span>
                                        <span className="flex items-center gap-1">
                                            <Clock className="size-3.5" />
                                            <span>3 mnt baca</span>
                                        </span>
                                    </div>

                                    <h2 className="mt-4 text-lg font-bold leading-snug text-slate-900 transition-colors group-hover:text-blue-600 sm:text-xl">
                                        {featuredArticle.title}
                                    </h2>

                                    <p className="mt-2.5 text-xs sm:text-sm font-medium leading-relaxed text-slate-500 line-clamp-4">
                                        {featuredArticle.summary}
                                    </p>
                                </div>

                                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                                    <span className="text-[11px] font-bold text-slate-400">
                                        Oleh {featuredArticle.author || 'Divisi Medkominfo'}
                                    </span>

                                    {featuredArticle.link && (
                                        <a
                                            href={featuredArticle.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-blue-600/10 transition hover:bg-blue-500 active:scale-[0.98]"
                                        >
                                            <span>Baca Selengkapnya</span>
                                            <ArrowUpRight className="size-3.5" />
                                        </a>
                                    )}
                                </div>
                            </div>
                        </article>
                    </motion.section>
                )}

                <section className="mt-10">
                    <div className="mb-5 flex items-center justify-between text-xs font-medium text-slate-500">
                        <span>
                            Menampilkan <strong className="text-slate-900">{filteredNews.length}</strong> artikel berita
                            {searchQuery && <span> untuk kata kunci &ldquo;{searchQuery}&rdquo;</span>}
                        </span>
                    </div>

                    {filteredNews.length > 0 ? (
                        <motion.div
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true, margin: '-40px' }}
                            variants={container}
                            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
                        >
                            {filteredNews.map((article) => (
                                <motion.article
                                    key={article.id}
                                    variants={reveal}
                                    className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs transition hover:border-blue-300 hover:shadow-md"
                                >
                                    <div>
                                        <div className="relative aspect-16/10 w-full overflow-hidden bg-slate-100">
                                            {article.image ? (
                                                <img
                                                    src={article.image}
                                                    alt={article.title}
                                                    loading="lazy"
                                                    className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center text-slate-300">
                                                    <Newspaper className="size-10" />
                                                </div>
                                            )}
                                            <div className="absolute left-3 top-3">
                                                <span className="rounded-md bg-white/95 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-600 shadow-xs backdrop-blur-xs">
                                                    {article.category}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="p-5">
                                            <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-100 pb-2.5">
                                                <span className="flex items-center gap-1.5 font-medium">
                                                    <Calendar className="size-3.5 text-blue-600" />
                                                    <span>{article.date}</span>
                                                </span>
                                                <span className="flex items-center gap-1 text-[11px]">
                                                    <Clock className="size-3" />
                                                    <span>3 mnt</span>
                                                </span>
                                            </div>

                                            <h3 className="mt-3 text-sm font-bold leading-snug text-slate-900 transition-colors group-hover:text-blue-600 line-clamp-2">
                                                {article.title}
                                            </h3>

                                            <p className="mt-1.5 text-xs font-medium leading-relaxed text-slate-500 line-clamp-3">
                                                {article.summary}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="px-5 pb-5">
                                        {article.link ? (
                                            <a
                                                href={article.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="group/btn inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 transition"
                                            >
                                                <span>Baca selengkapnya</span>
                                                <ArrowUpRight className="size-3.5 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                                            </a>
                                        ) : (
                                            <span className="text-xs text-slate-400 font-medium">Link artikel tidak tersedia</span>
                                        )}
                                    </div>
                                </motion.article>
                            ))}
                        </motion.div>
                    ) : (
                        <div className="my-10 rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-xs">
                            <div className="mx-auto grid size-12 place-items-center rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 mb-3">
                                <Newspaper className="size-6" />
                            </div>
                            <h3 className="text-base font-bold text-slate-900">
                                Tidak ada berita ditemukan
                            </h3>
                            <p className="mt-1 text-xs text-slate-500 max-w-xs mx-auto font-medium">
                                Coba sesuaikan kata kunci pencarian atau ganti kategori filter.
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
                            Divisi Media & Informasi
                        </span>
                        <h3 className="mt-1 text-xl sm:text-2xl font-extrabold tracking-tight text-white">
                            Punya Kabar Prestasi atau Liputan Proker?
                        </h3>
                        <p className="mt-1.5 text-xs text-slate-300 font-medium leading-relaxed">
                            Kirimkan rilis berita, dokumentasi kegiatan, atau karya mahasiswa untuk dipublikasikan melalui portal resmi HIMATIFA UMSURA.
                        </p>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-2.5 lg:mt-0">
                        <Link
                            href="/contact"
                            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-blue-600/10 transition hover:bg-blue-500 active:scale-[0.98]"
                        >
                            <span>Hubungi Redaksi</span>
                            <ArrowUpRight className="size-3.5" />
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
                        <Link href="/contact" className="hover:text-blue-600 transition">Kontak</Link>
                    </div>
                </footer>
            </div>

            <BackToTop />
        </main>
    )
}