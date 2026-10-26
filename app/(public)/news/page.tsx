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

interface NewsItem {
    id: number
    title: string
    date: string
    category: string
    summary: string
    link: string
    image: string
    readTime?: string
}

const newsData: NewsItem[] = [
    {
        id: 1,
        title: "Orientasi Studi & Cinta Almamater (OSCAR) 2026",
        date: "19 - 20 September 2026",
        category: "Organisasi",
        summary: "Fakultas Teknik menyelenggarakan kegiatan OSCAR (Orientasi Studi Cinta Akademik dan Almamater) Fakultas Teknik 2026 sebagai rangkaian kegiatan pengenalan bagi mahasiswa baru.",
        link: "https://www.kompasiana.com/himatifaumsurabaya/6ab2271434777c6eb9130687/orientasi-studi-cinta-almamater-oscar-2026#goog_rewarded",
        image: "https://assets-a2.kompasiana.com/items/album/2026/09/22/whatsapp-image-2026-09-22-at-13-48-58-6ab225e034777c689b74ed35.jpeg?t=o&v=770",
        readTime: "3 mnt baca"
    },
    {
        id: 2,
        title: "Sokong visi Literasi Digital, S1 Informatika UMSURA Gelar AI Ambasador Workshop Di SpInS Interactional School",
        date: "13 Juli 2026",
        category: "Kegiatan",
        summary: "Kolaborasi apik di sektor pendidikan digital kembali ditunjukkan oleh akademisi muda kota Pahlawan. Mahasiswa Program Studi S1 Informatika Universitas Muhammadiyah Surabaya sukses menyelenggarakan kegiatan pengabdian masyarakat berupa AI Ambassador Workshop.",
        link: "https://www.kompasiana.com/himatifaumsurabaya/6a577a9cc925c442882752e2/sokong-visi-literasi-digital-s1-informatika-umsura-gelar-ai-ambasador-workshop-di-spins-interactional-school#goog_rewarded",
        image: "https://assets-a2.kompasiana.com/items/album/2026/07/15/whatsapp-image-2026-07-14-at-19-54-41-6a577a32ed64157f6144eea2.jpeg?t=o&v=770",
        readTime: "4 mnt baca"
    },
    {
        id: 3,
        title: "Program Studi Informatika UMSURA Sukses Selenggarakan Seminar Etika Profesi Bersama Alumni Yang Bekerja Di Pemkot Surabaya",
        date: "24 Juni 2026",
        category: "Prestasi",
        summary: "Menghadapi dinamika dunia kerja profesional yang semakin kompleks, Program Studi Informatika Universitas Muhammadiyah Surabaya sukses menyelenggarakan acara Seminar Etika Profesi dan Profesionalisme dalam Dunia Informatika.",
        link: "https://www.kompasiana.com/himatifaumsurabaya/6a3ca800c925c473a8367832/program-studi-informatika-umsura-sukses-selenggarakan-seminar-etika-profesi-bersama-alumni-yang-bekerja-di-pemkot-surabaya#goog_rewarded",
        image: "https://assets-a2.kompasiana.com/items/album/2026/06/25/gemini-generated-image-9x3znf9x3znf9x3z-6a3ca37bed64154f96160e82.png?t=o&v=770",
        readTime: "3 mnt baca"
    },
    {
        id: 4,
        title: "15 Mahasiswa Universitas Muhammadiyah Surabaya Raih Gelar Double Degree Di ST.John's University Taiwan",
        date: "6 Juni 2026",
        category: "Kegiatan",
        summary: "Sebanyak 15 mahasiswa Fakultas Teknik Universitas Muhammadiyah Surabaya kembali menorehkan prestasi membanggakan di tingkat internasional dengan menyelesaikan program Double Degree di St. John's University, Taiwan.",
        link: "https://www.kompasiana.com/himatifaumsurabaya/6a2a176634777c358c691712/15-mahasiswa-universitas-muhammadiyah-surabaya-raih-gelar-double-gegree-di-st-john-s-university-taiwan#goog_rewarded",
        image: "https://assets-a2.kompasiana.com/items/album/2026/06/11/whatsapp-image-2026-06-10-at-19-37-27-1-6a2a14e6ed64156b23343f33.jpeg?t=o&v=770",
        readTime: "4 mnt baca"
    },
    {
        id: 5,
        title: "Kuliah Tamu Telkomsat Collaboration : Membuka Wawasan Karier Mahasiswa Informatika",
        date: "6 Juni 2026",
        category: "Kegiatan",
        summary: "Dalam rangka mendukung pengembangan wawasan industri dan kesiapan karier mahasiswa, HIMATIFA menyelenggarakan kegiatan Kuliah Tamu kolaborasi Telkomsat untuk akselerasi karier teknologi telekomunikasi satelit.",
        link: "https://www.kompasiana.com/himatifaumsurabaya/6984a566ed6415589c317344/kuliah-tamu-telkomsat-collaboration-membuka-wawasan-karier-mahasiswa-infomatika#goog_rewarded",
        image: "https://assets-a2.kompasiana.com/items/album/2026/02/05/img-8176-6984a528c925c4219d2b50d3.jpg?t=o&v=770",
        readTime: "3 mnt baca"
    },
    {
        id: 6,
        title: "MIDNIGHT - Makrab 2025",
        date: "10 Mei 2026",
        category: "Kegiatan",
        summary: "Kegiatan Malam Keakraban (Makrab) MIDNIGHT 2025 menjadi momentum berharga bagi mahasiswa Informatika lintas angkatan untuk mempererat hubungan kekeluargaan serta menumbuhkan solidaritas tinggi.",
        link: "https://www.kompasiana.com/himatifaumsurabaya/6984979fc925c439f74f2662/midnight-makrab-2025#goog_rewarded",
        image: "https://assets-a2.kompasiana.com/items/album/2026/02/05/img-20260111-wa0031-jpg-69849754c925c436a44c9c63.jpeg?t=o&v=770",
        readTime: "2 mnt baca"
    }
]

const categories = ["Semua", "Organisasi", "Kegiatan", "Prestasi"]

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

export default function NewsPage() {
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('Semua')

    const { scrollYProgress } = useScroll()
    const progressScale = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.4 })

    const filteredNews = useMemo(() => {
        return newsData.filter((article) => {
            const matchesCategory = selectedCategory === 'Semua' || article.category === selectedCategory
            const q = searchQuery.toLowerCase().trim()
            const matchesSearch = !q ||
                article.title.toLowerCase().includes(q) ||
                article.summary.toLowerCase().includes(q)
            return matchesCategory && matchesSearch
        })
    }, [searchQuery, selectedCategory])

    const featuredArticle = newsData[0]

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
                        <span className="font-semibold text-[#2563eb]">Kabar & Berita</span>
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
                        <span>Berita & Jurnal Mahasiswa</span>
                    </motion.div>

                    <motion.h1
                        variants={reveal}
                        className="mt-4 text-3xl font-black tracking-tight text-[#0a192f] sm:text-5xl lg:text-6xl"
                    >
                        Kabar, Cerita &{' '}
                        <span className="bg-gradient-to-r from-[#2563eb] to-sky-500 bg-clip-text text-transparent">
                            Jejak Prestasi.
                        </span>
                    </motion.h1>

                    <motion.p
                        variants={reveal}
                        className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg"
                    >
                        Dokumentasi resmi liputan kegiatan, publikasi program kerja, dan rekam jejak prestasi mahasiswa S1 Informatika UMSURA.
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
                                ? newsData.length
                                : newsData.filter((item) => item.category === category).length

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
                            placeholder="Cari kabar atau topik..."
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

                {selectedCategory === 'Semua' && !searchQuery && (
                    <motion.section
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, margin: '-60px' }}
                        variants={reveal}
                        className="mt-10"
                    >
                        <div className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#2563eb]">
                            <Minus className="size-3.5" />
                            <span>Sorotan Utama</span>
                        </div>

                        <article className="group relative grid overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-sm transition-all duration-300 hover:border-blue-300 hover:shadow-md lg:grid-cols-12">
                            <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 lg:col-span-7 lg:aspect-auto lg:min-h-[380px]">
                                <img
                                    src={featuredArticle.image}
                                    alt={featuredArticle.title}
                                    className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute left-4 top-4">
                                    <span className="rounded-lg bg-blue-600/90 px-3 py-1 text-xs font-bold text-white shadow-xs backdrop-blur-xs">
                                        {featuredArticle.category}
                                    </span>
                                </div>
                            </div>

                            <div className="flex flex-col justify-between p-6 sm:p-8 lg:col-span-5 lg:p-10">
                                <div>
                                    <div className="flex items-center gap-3 text-xs font-medium text-slate-400 border-b border-slate-100 pb-4">
                                        <span className="flex items-center gap-1.5">
                                            <Calendar className="size-3.5 text-[#2563eb]" />
                                            <span>{featuredArticle.date}</span>
                                        </span>
                                        <span>•</span>
                                        <span className="flex items-center gap-1">
                                            <Clock className="size-3.5" />
                                            <span>{featuredArticle.readTime}</span>
                                        </span>
                                    </div>

                                    <h2 className="mt-4 text-xl font-black leading-snug text-[#0a192f] transition-colors group-hover:text-[#2563eb] sm:text-2xl">
                                        {featuredArticle.title}
                                    </h2>

                                    <p className="mt-3 text-sm leading-relaxed text-slate-600 line-clamp-4">
                                        {featuredArticle.summary}
                                    </p>
                                </div>

                                <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
                                    <span className="text-xs font-semibold text-slate-500">
                                        Sumber: Kompasiana HIMATIFA
                                    </span>

                                    <a
                                        href={featuredArticle.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 rounded-xl bg-[#2563eb] px-4 py-2 text-xs font-bold text-white transition-all hover:bg-blue-700 hover:shadow-xs"
                                    >
                                        <span>Baca Berita</span>
                                        <ArrowUpRight className="size-3.5" />
                                    </a>
                                </div>
                            </div>
                        </article>
                    </motion.section>
                )}

                <section className="mt-12">
                    <div className="mb-6 flex items-center justify-between">
                        <div className="text-xs font-semibold text-slate-500">
                            Menampilkan <span className="font-bold text-[#0a192f]">{filteredNews.length}</span> artikel berita
                            {searchQuery && <span> dengan kata kunci &ldquo;{searchQuery}&rdquo;</span>}
                        </div>
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
                                    className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-md"
                                >
                                    <div>
                                        <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                                            <img
                                                src={article.image}
                                                alt={article.title}
                                                loading="lazy"
                                                className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                            <div className="absolute left-3 top-3">
                                                <span className="rounded-md bg-white/95 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#2563eb] shadow-xs backdrop-blur-xs">
                                                    {article.category}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="p-5 sm:p-6">
                                            <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-100 pb-3">
                                                <span className="flex items-center gap-1.5 font-medium">
                                                    <Calendar className="size-3.5 text-blue-500" />
                                                    <span>{article.date}</span>
                                                </span>
                                                <span className="flex items-center gap-1 text-[11px]">
                                                    <Clock className="size-3" />
                                                    <span>{article.readTime ?? '3 mnt'}</span>
                                                </span>
                                            </div>

                                            <h3 className="mt-3 text-base font-bold leading-snug text-[#0a192f] transition-colors group-hover:text-[#2563eb] line-clamp-2">
                                                {article.title}
                                            </h3>

                                            <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-600 line-clamp-3">
                                                {article.summary}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="px-5 pb-5 sm:px-6 sm:pb-6">
                                        <a
                                            href={article.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group/btn inline-flex items-center gap-1.5 text-xs font-bold text-[#2563eb] transition-colors hover:text-blue-700"
                                        >
                                            <span>Baca selengkapnya</span>
                                            <ArrowUpRight className="size-3.5 transition-transform duration-200 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                                        </a>
                                    </div>
                                </motion.article>
                            ))}
                        </motion.div>
                    ) : (
                        <div className="my-12 rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-xs">
                            <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-blue-50 text-[#2563eb]">
                                <Newspaper className="size-8" />
                            </div>
                            <h3 className="mt-4 text-lg font-bold text-[#0a192f]">
                                Tidak ada berita yang cocok
                            </h3>
                            <p className="mt-1 text-sm text-slate-500 max-w-sm mx-auto">
                                Kami tidak menemukan artikel dengan kata kunci atau filter kategori yang Anda pilih.
                            </p>
                            <button
                                onClick={() => {
                                    setSearchQuery('')
                                    setSelectedCategory('Semua')
                                }}
                                className="mt-5 rounded-xl bg-blue-50 px-5 py-2.5 text-xs font-bold text-[#2563eb] transition-colors hover:bg-[#2563eb] hover:text-white"
                            >
                                Reset Pencarian
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
                            Divisi Media & Informasi
                        </span>
                        <h3 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl text-white">
                            Punya Kabar Prestasi atau Liputan Proker?
                        </h3>
                        <p className="mt-2 text-sm text-slate-300 leading-relaxed">
                            Kirimkan rilis berita, dokumentasi kegiatan, atau karya mahasiswa untuk dipublikasikan melalui kanal resmi HIMATIFA UMSURA.
                        </p>
                    </div>

                    <div className="mt-6 flex flex-wrap gap-3 lg:mt-0">
                        <Link
                            href="/contact"
                            className="inline-flex items-center gap-2 rounded-xl bg-[#2563eb] px-5 py-3 text-xs font-bold text-white shadow-md transition-all hover:bg-blue-500"
                        >
                            <span>Hubungi Redaksi Medkom</span>
                            <ArrowUpRight className="size-4" />
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
                        <Link href="/contact" className="hover:text-blue-600 transition-colors">
                            Kontak
                        </Link>
                    </div>
                </footer>
            </div>

            <BackToTop />
        </main>
    )
}
