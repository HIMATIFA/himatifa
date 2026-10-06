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
import { Search, ArrowUpRight, ArrowLeft, Calendar, Sparkles, Newspaper, ArrowUp, Copyright } from 'lucide-react'

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
    },
    {
        id: 4,
        title: "15 Mahasiswa Universitas Muhammadiyah Surabaya Raih Gelar Double Degree Di ST.John's University Taiwan",
        date: "6 Juni 2026",
        category: "Kegiatan",
        summary: "Sebanyak 15 mahasiswa Fakultas Teknik Universitas Muhammadiyah Surabaya (UMSurabaya) kembali menorehkan prestasi membanggakan di tingkat internasional. Mahasiswa yang berasal dari Program Studi Informatika, Teknik Sipil, Teknik Elektro, dan Teknik Industri tersebut resmi diwisuda dalam Program Double Degree di St. John's University, Taiwan.",
        link: "https://www.kompasiana.com/himatifaumsurabaya/6a2a176634777c358c691712/15-mahasiswa-universitas-muhammadiyah-surabaya-raih-gelar-double-gegree-di-st-john-s-university-taiwan#goog_rewarded",
        image: "https://assets-a2.kompasiana.com/items/album/2026/06/11/whatsapp-image-2026-06-10-at-19-37-27-1-6a2a14e6ed64156b23343f33.jpeg?t=o&v=770"
    },
    {
        id: 5,
        title: "Kuliah Tamu Telkomsat Collaboration : Membuka Wawasan Karier Mahasiswa Informatika",
        date: "6 Juni 2026",
        category: "Kegiatan",
        summary: "Dalam rangka mendukung pengembangan wawasan industri dan kesiapan karier mahasiswa, Himpunan Mahasiswa Informatika (HIMATIFA) Universitas Muhammadiyah Surabaya menyelenggarakan kegiatan Kuliah Tamu Telkomsat Collaboration Internship.",
        link: "https://www.kompasiana.com/himatifaumsurabaya/6984a566ed6415589c317344/kuliah-tamu-telkomsat-collaboration-membuka-wawasan-karier-mahasiswa-infomatika#goog_rewarded",
        image: "https://assets-a2.kompasiana.com/items/album/2026/02/05/img-8176-6984a528c925c4219d2b50d3.jpg?t=o&v=770"
    },
    {
        id: 6,
        title: "MIDNIGHT - Makrab 2025",
        date: "10 Mei 2026",
        category: "Kegiatan",
        summary: "Kegiatan Malam Keakraban (Makrab) MIDNIGHT 2025 menjadi momentum penting bagi mahasiswa Informatika lintas angkatan untuk mempererat hubungan kebersamaan serta menumbuhkan rasa solidaritas antar mahasiswa Informatika.",
        link: "https://www.kompasiana.com/himatifaumsurabaya/6984979fc925c439f74f2662/midnight-makrab-2025#goog_rewarded",
        image: "https://assets-a2.kompasiana.com/items/album/2026/02/05/img-20260111-wa0031-jpg-69849754c925c436a44c9c63.jpeg?t=o&v=770"
    }
]

const categories = ["Semua", "Organisasi", "Kegiatan", "Prestasi"]

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

export default function NewsPage() {
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('Semua')

    const { scrollYProgress } = useScroll()
    const progressScale = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.4 })

    const filteredNews = useMemo(() => {
        return newsData.filter((article) => {
            const matchesCategory = selectedCategory === 'Semua' || article.category === selectedCategory
            const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                article.summary.toLowerCase().includes(searchQuery.toLowerCase())
            return matchesCategory && matchesSearch
        })
    }, [searchQuery, selectedCategory])

    const featuredArticle = newsData[0]

    return (
        <main className="relative min-h-screen overflow-hidden bg-slate-50 px-4 py-12 text-[#0a192f] sm:px-6 lg:px-10 lg:py-20">
            <motion.div
                style={{ scaleX: progressScale }}
                className="fixed inset-x-0 top-0 z-[60] h-1 origin-left bg-gradient-to-r from-[#2563eb] via-sky-400 to-cyan-400"
                aria-hidden
            />

            <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]" />
            <div className="absolute left-[-10%] top-[-5%] -z-10 size-[500px] rounded-full bg-blue-400/20 blur-[120px]" />
            <div className="absolute right-[-5%] top-[20%] -z-10 size-[600px] rounded-full bg-cyan-300/15 blur-[150px]" />

            <div className="relative z-10 mx-auto max-w-7xl">
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
                    className="mb-12 mt-12 text-center"
                >
                    <motion.p
                        variants={reveal}
                        className="mb-3 text-xs font-bold uppercase tracking-[.2em] text-[#2563eb]"
                    >
                        Jurnal HIMATIFA
                    </motion.p>
                    <motion.h1
                        variants={reveal}
                        className="text-4xl font-black tracking-tight sm:text-6xl"
                    >
                        Kabar &{' '}
                        <span className="relative inline-block bg-gradient-to-r from-[#2563eb] via-sky-400 to-[#2563eb] bg-[length:200%_auto] bg-clip-text text-transparent animate-[gradient-move_4s_linear_infinite]">
                            Berita.
                            <svg aria-hidden className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
                                <path d="M2 9C50 3 150 3 198 9" stroke="#2563eb" strokeWidth="4" strokeLinecap="round" opacity="0.4" />
                            </svg>
                        </span>
                    </motion.h1>
                    <motion.p variants={reveal} className="mx-auto mt-6 max-w-2xl text-[15px] leading-relaxed text-slate-500">
                        Ikuti perkembangan terbaru, pencapaian prestasi, serta berbagai aktivitas seputar kegiatan mahasiswa Informatika UMSURA.
                    </motion.p>
                </motion.div>

                <motion.div
                    initial="hidden" animate="show" variants={reveal}
                    className="mb-16 flex flex-col gap-4 rounded-[2.5rem] border border-white/80 bg-white/60 p-4 shadow-xl shadow-blue-900/5 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between lg:px-6"
                >
                    <div className="flex flex-wrap gap-2">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`rounded-full px-5 py-2.5 text-xs font-bold transition-all ${
                                    selectedCategory === category
                                        ? 'bg-[#2563eb] text-white shadow-lg shadow-blue-500/30'
                                        : 'bg-white/50 text-slate-500 hover:bg-blue-50 hover:text-[#2563eb]'
                                }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    <div className="relative w-full sm:w-80">
                        <Search className="absolute left-4 top-1/2 size-4.5 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Cari berita..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full rounded-full border border-slate-200/60 bg-white/50 pl-11 pr-4 py-2.5 text-sm text-[#0a192f] placeholder-slate-400 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                        />
                    </div>
                </motion.div>

                {selectedCategory === 'Semua' && !searchQuery && (
                    <motion.div
                        initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }} variants={reveal}
                        className="mb-16"
                    >
                        <p className="mb-5 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#2563eb]">
                            <Sparkles className="size-4" /> Berita Utama
                        </p>
                        <article className="group relative grid overflow-hidden rounded-[2.5rem] border border-white/80 bg-white/70 shadow-xl shadow-blue-900/5 backdrop-blur-xl lg:grid-cols-12">
                            <div className="relative aspect-video w-full overflow-hidden lg:col-span-7 lg:aspect-auto">
                                <img
                                    src={featuredArticle.image}
                                    alt={featuredArticle.title}
                                    className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                            </div>
                            <div className="flex flex-col justify-between p-8 sm:p-10 lg:col-span-5">
                                <div>
                                    <div className="mb-5 flex items-center justify-between border-b border-slate-200/60 pb-5">
                                        <span className="rounded-full bg-blue-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-[#2563eb] ring-1 ring-blue-100">
                                            {featuredArticle.category}
                                        </span>
                                        <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
                                            <Calendar className="size-3.5" /> {featuredArticle.date}
                                        </span>
                                    </div>
                                    <h2 className="text-2xl font-black leading-tight text-[#0a192f] transition-colors group-hover:text-[#2563eb] sm:text-3xl">
                                        {featuredArticle.title}
                                    </h2>
                                    <p className="mt-4 text-[14.5px] leading-relaxed text-slate-500 line-clamp-4">
                                        {featuredArticle.summary}
                                    </p>
                                </div>
                                <a
                                    href={featuredArticle.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-[#0a192f] px-5 py-2.5 text-xs font-bold text-white transition-all hover:bg-[#2563eb] hover:shadow-lg hover:shadow-blue-500/30"
                                >
                                    Baca Selengkapnya <ArrowUpRight className="size-4" />
                                </a>
                            </div>
                        </article>
                    </motion.div>
                )}

                {filteredNews.length > 0 ? (
                    <motion.div
                        initial="hidden" whileInView="show" viewport={{ once: true, margin: '-40px' }} variants={container}
                        className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
                    >
                        {filteredNews.map((article) => (
                            <motion.article
                                key={article.id}
                                variants={listItem}
                                className="group flex flex-col overflow-hidden rounded-[2rem] border border-white/80 bg-white/70 shadow-lg shadow-blue-900/5 backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:border-blue-200/50 hover:shadow-2xl hover:shadow-blue-900/10"
                            >
                                <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
                                    <img
                                        src={article.image}
                                        alt={article.title}
                                        loading="lazy"
                                        className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                    />
                                </div>
                                <div className="flex flex-1 flex-col p-6 sm:p-8">
                                    <div className="mb-5 flex items-center justify-between border-b border-slate-200/60 pb-4">
                                        <span className="text-[10px] font-black uppercase tracking-[.18em] text-[#2563eb]">
                                            {article.category}
                                        </span>
                                        <span className="text-xs font-semibold text-slate-400">
                                            {article.date}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-extrabold leading-snug text-[#0a192f] transition-colors group-hover:text-[#2563eb] line-clamp-2">
                                        {article.title}
                                    </h3>
                                    <p className="mt-3 flex-1 text-[14px] leading-relaxed text-slate-500 line-clamp-3">
                                        {article.summary}
                                    </p>
                                    <a
                                        href={article.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-6 inline-flex w-fit items-center text-xs font-bold text-[#2563eb] transition-all hover:gap-2 group-hover:text-blue-700"
                                    >
                                        Baca selengkapnya <ArrowUpRight className="ml-1 size-3.5" />
                                    </a>
                                </div>
                            </motion.article>
                        ))}
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                        className="my-16 rounded-[2.5rem] border border-white/80 bg-white/50 py-16 text-center shadow-xl shadow-blue-900/5 backdrop-blur-xl"
                    >
                        <div className="mx-auto grid size-20 place-items-center rounded-3xl bg-blue-100/50 text-[#2563eb]">
                            <Newspaper className="size-10" />
                        </div>
                        <h3 className="mt-6 text-xl font-black text-[#0a192f]">Berita tidak ditemukan</h3>
                        <p className="mt-2 text-[15px] text-slate-500">Coba kata kunci lain atau ubah filter kategori pencarian Anda.</p>
                        <button
                            onClick={() => { setSearchQuery(''); setSelectedCategory('Semua'); }}
                            className="mt-6 rounded-full bg-blue-50 px-6 py-2.5 text-xs font-bold text-[#2563eb] transition-colors hover:bg-[#2563eb] hover:text-white"
                        >
                            Reset Pencarian
                        </button>
                    </motion.div>
                )}

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