'use client'

import Link from 'next/link'
import Image from 'next/image'
import {
    motion,
    useScroll,
    useTransform,
    useSpring,
    useReducedMotion,
    type Variants
} from 'framer-motion'
import { ArrowLeft, ArrowUp, Target, Rocket, BookOpen, Sparkles, Fingerprint, Copyright, HeartHandshake } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

const identities = [
    { label: "Nama Resmi", value: "Himpunan Mahasiswa Informatika" },
    { label: "Singkatan", value: "HIMATIFA" },
    { label: "Universitas", value: "Universitas Muhammadiyah Surabaya" },
    { label: "Program Studi", value: "Informatika" },
    { label: "Berdiri", value: "10 Oktober 2020" },
    { label: "Periode Aktif", value: "2026/2027" },
]

const missions = [
    "Memperkuat internal organisasi sebagai fondasi keberlangsungan HIMATIFA.",
    "Meningkatkan kompetensi mahasiswa Informatika melalui program pengembangan terstruktur.",
    "Membangun komunikasi yang baik dengan dosen sebagai mitra akademik.",
    "Mengelola keuangan secara mandiri dan produktif untuk mendukung setiap program kerja.",
    "Memperluas relasi eksternal untuk membuka peluang kolaborasi dan jejaring.",
    "Memperkuat branding HIMATIFA sebagai identitas yang dikenal dan dipercaya.",
    "Menjadikan HIMATIFA sebagai wadah aspirasi, inovasi, kreativitas, dan peluang bagi seluruh mahasiswa."
]

const filosofiLogo = [
    {
        image: "logo_3.png",
        title: "10 Cabang Sirkuit",
        description: "Jumlah sepuluh cabang yang mengelilingi melambangkan tanggal kelahiran HIMATIFA yaitu 10 Oktober 2020. Banyaknya cabang ini juga bermaksud bahwa seluruh mahasiswa dalam himpunan berasal dari latar belakang yang berbeda-beda."
    },
    {
        image: "logo_4.png",
        title: "Tulisan Melingkar",
        description: "Tulisan yang dibuat mengelilingi logo bertujuan agar seluruh anggota terus bergandengan tangan dan bersatu agar kuat dalam menjalankan roda organisasi."
    },
    {
        image: "logo_2.png",
        title: "Lingkaran & Dua Garis",
        description: "Lingkaran putih besar di luar bermakna HIMATIFA adalah himpunan yang baru lahir, masih putih, dan bersih. Lingkaran kecil di dalam menandakan lingkup jurusan Informatika, sedangkan dua garis di dalamnya melambangkan 2 kalimat syahadat."
    },
    {
        image: "logo_1.png",
        title: "Microchip Processor",
        description: "Melambangkan pola pikir di dalam jurusan Informatika yang selalu berada di paling terdepan dalam inovasi dan perkembangan teknologi."
    },
    {
        image: "logo_5.png",
        title: "Logo Muhammadiyah",
        description: "Terletak di bagian tengah yang melambangkan bahwa HIMATIFA berada dan bernaung di bawah lingkup Universitas Muhammadiyah Surabaya."
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
    hidden: { opacity: 0, x: -24 },
    show: {
        opacity: 1, x: 0,
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

export default function AboutPage() {
    const reduce = useReducedMotion()

    const { scrollYProgress } = useScroll()
    const progressScale = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.4 })

    const logoRef = useRef<HTMLDivElement>(null)
    const { scrollYProgress: logoProgress } = useScroll({ target: logoRef, offset: ['start end', 'end start'] })
    const logoRotate = useTransform(logoProgress, [0, 1], [-6, 6])

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

            <div className="relative z-10 mx-auto max-w-6xl">
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
                    <motion.p
                        variants={reveal}
                        className="mb-3 text-xs font-bold uppercase tracking-[.2em] text-[#2563eb]"
                    >
                        Profil HIMATIFA
                    </motion.p>
                    <motion.h1
                        variants={reveal}
                        className="text-4xl font-black tracking-tight sm:text-6xl"
                    >
                        Mengenal{' '}
                        <span className="relative inline-block bg-gradient-to-r from-[#2563eb] via-sky-400 to-[#2563eb] bg-[length:200%_auto] bg-clip-text text-transparent animate-[gradient-move_4s_linear_infinite]">
                            Himpunan Kami.
                            <svg aria-hidden className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
                                <path d="M2 9C50 3 150 3 198 9" stroke="#2563eb" strokeWidth="4" strokeLinecap="round" opacity="0.4" />
                            </svg>
                        </span>
                    </motion.h1>
                    <motion.div variants={container} className="mx-auto mt-6 max-w-3xl space-y-4 text-[15px] leading-relaxed text-slate-500">
                        <motion.p variants={reveal}>
                            HIMATIFA (Himpunan Mahasiswa Teknik Informatika) adalah organisasi kemahasiswaan resmi yang menaungi seluruh mahasiswa Program Studi Teknik Informatika di Universitas Muhammadiyah Surabaya.
                        </motion.p>
                        <motion.p variants={reveal}>
                            Sebagai wadah aspirasi dan kreativitas, HIMATIFA berperan menjembatani mahasiswa dengan pihak kampus, mengembangkan kompetensi di bidang teknologi informasi, serta membangun jaringan yang luas baik di tingkat internal maupun eksternal. HIMATIFA menjadi rumah bagi mahasiswa Informatika UMSURA untuk tumbuh, berkarya, dan berkompetisi.
                        </motion.p>
                    </motion.div>
                </motion.div>

                <motion.div
                    initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}
                    variants={container}
                    className="grid gap-8 lg:grid-cols-[1.5fr_1fr]"
                >
                    <div className="flex flex-col gap-6">
                        <motion.div variants={reveal}>
                            <div className="group relative overflow-hidden rounded-[2.5rem] bg-[#071426] p-8 text-white shadow-2xl transition-transform duration-500 hover:-translate-y-1 lg:p-10">
                                <div aria-hidden className="absolute -right-10 -top-10 size-40 rounded-full bg-blue-500/20 blur-3xl transition-all duration-500 group-hover:bg-blue-500/30 group-hover:scale-125" />
                                <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-400/60 to-transparent" />
                                <div className="relative z-10">
                                    <div className="mb-6 flex items-center gap-4">
                                        <div className="grid size-12 place-items-center rounded-2xl bg-white/10 text-blue-300 backdrop-blur-sm ring-1 ring-white/20 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                                            <Target className="size-6" />
                                        </div>
                                        <h2 className="text-3xl font-black tracking-tight">Visi Kami</h2>
                                    </div>
                                    <motion.blockquote
                                        initial={{ opacity: 0 }}
                                        whileInView={{ opacity: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.3, duration: 0.8 }}
                                        className="relative border-l-4 border-blue-500/50 pl-5 text-[16px] font-medium italic leading-relaxed text-blue-100/80"
                                    >
                                        "Menjadikan HIMATIFA sebagai organisasi mahasiswa Informatika yang unggul, solid, dan berdaya saing dalam pengembangan aspirasi, kreativitas, dan kompetensi mahasiswa."
                                    </motion.blockquote>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div variants={reveal}>
                            <div className="flex flex-col justify-center rounded-[2.5rem] border border-white/80 bg-white/70 p-8 shadow-xl shadow-blue-900/5 backdrop-blur-xl transition-all duration-500 hover:border-blue-200/50 hover:shadow-2xl hover:shadow-blue-900/10 lg:p-10">
                                <div className="mb-8 flex items-center gap-4">
                                    <div className="grid size-12 place-items-center rounded-2xl bg-blue-100 text-[#2563eb] transition-transform duration-300 hover:scale-110 hover:-rotate-6">
                                        <Rocket className="size-6" />
                                    </div>
                                    <h2 className="text-3xl font-black tracking-tight text-[#0a192f]">Misi Utama</h2>
                                </div>
                                <motion.ul
                                    initial="hidden" whileInView="show" viewport={{ once: true, margin: '-40px' }}
                                    variants={container}
                                    className="relative flex flex-col gap-5"
                                >
                                    <span aria-hidden className="absolute bottom-4 left-[11px] top-4 w-px bg-gradient-to-b from-blue-200 via-blue-300 to-transparent" />
                                    {missions.map((misi, idx) => (
                                        <motion.li key={idx} variants={listItem} className="group relative flex items-start gap-4">
                                            <span className="relative z-10 mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-blue-50 text-[10px] font-black text-[#2563eb] ring-1 ring-blue-100 transition-all duration-300 group-hover:bg-[#2563eb] group-hover:text-white group-hover:ring-blue-500 group-hover:shadow-md group-hover:shadow-blue-500/30">
                                                {idx + 1}
                                            </span>
                                            <span className="text-[14.5px] leading-relaxed text-slate-600 transition-colors group-hover:text-[#0a192f]">
                                                {misi}
                                            </span>
                                        </motion.li>
                                    ))}
                                </motion.ul>
                            </div>
                        </motion.div>
                    </div>

                    <motion.div variants={reveal} className="flex flex-col gap-6">
                        <div className="group relative flex flex-col items-center overflow-hidden rounded-[2.5rem] border border-white/80 bg-white/70 p-10 text-center shadow-xl shadow-blue-900/5 backdrop-blur-xl transition-all duration-500 hover:border-blue-200/50 hover:shadow-2xl">
                            <div aria-hidden className="pointer-events-none absolute -top-16 left-1/2 size-64 -translate-x-1/2 rounded-full bg-blue-400/15 blur-[60px] transition-opacity duration-500 group-hover:opacity-100" />
                            <div className="relative mb-6 flex items-center justify-center">
                                <Image
                                    src="/logo.png"
                                    alt="Logo HIMATIFA"
                                    width={120}
                                    height={120}
                                    className="relative object-contain transition-transform duration-500 group-hover:scale-110"
                                />
                            </div>
                            <h3 className="text-2xl font-black text-[#0a192f]">HIMATIFA</h3>
                            <p className="mt-1 text-xs font-black uppercase tracking-widest text-[#2563eb]">UMSURA</p>
                        </div>
                        <div className="flex flex-col rounded-[2.5rem] border border-white/80 bg-white/70 p-8 shadow-xl shadow-blue-900/5 backdrop-blur-xl transition-all duration-500 hover:border-blue-200/50 hover:shadow-2xl lg:p-10">
                            <div className="mb-6 flex items-center gap-3 border-b border-slate-200/60 pb-5">
                                <div className="grid size-9 place-items-center rounded-xl bg-blue-100 text-[#2563eb]">
                                    <BookOpen className="size-4.5" />
                                </div>
                                <h3 className="text-lg font-extrabold text-[#0a192f]">Identitas Organisasi</h3>
                            </div>
                            <dl className="flex flex-col gap-5">
                                {identities.map((row) => (
                                    <div key={row.label} className="group -mx-2 flex items-baseline justify-between gap-4 rounded-xl px-2 py-1 transition-colors hover:bg-blue-50/60">
                                        <dt className="text-[11px] font-bold uppercase tracking-wider text-slate-400 transition-colors group-hover:text-[#2563eb]">
                                            {row.label}
                                        </dt>
                                        <dd className="text-right text-sm font-semibold text-slate-700">
                                            {row.value}
                                        </dd>
                                    </div>
                                ))}
                            </dl>
                        </div>
                    </motion.div>
                </motion.div>

                <motion.div
                    initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}
                    variants={reveal}
                    className="mt-16 rounded-[3rem] border border-white/80 bg-white/50 p-8 shadow-xl shadow-blue-900/5 backdrop-blur-2xl lg:p-12"
                >
                    <div className="grid items-start gap-12 lg:grid-cols-[1fr_1.5fr] lg:gap-16">
                        <div ref={logoRef} className="relative mx-auto w-full max-w-sm lg:sticky lg:top-24">
                            <div ref={logoRef} className="relative mx-auto w-full max-w-sm lg:sticky lg:top-24">
                                <motion.div
                                    style={reduce ? undefined : { rotate: logoRotate }}
                                    className="relative grid aspect-square place-items-center rounded-[3rem] border border-white bg-transparent p-8"
                                >
                                    <div aria-hidden className="absolute inset-3 rounded-[2.5rem] bg-[conic-gradient(from_180deg,transparent_0%,rgba(37,99,235,0.08)_25%,transparent_50%,rgba(56,189,248,0.08)_75%,transparent_100%)]" />
                                    <Image
                                        src="/logo.png"
                                        alt="Logo Utama HIMATIFA"
                                        width={260}
                                        height={260}
                                        className="object-contain transition-transform duration-700 hover:scale-105"
                                    />
                                </motion.div>
                            </div>
                        </div>

                        <div>
                            <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true }} className="mb-10">
                                <motion.p variants={reveal} className="mb-3 text-xs font-bold uppercase tracking-[.2em] text-[#2563eb]">
                                    Makna Lambang
                                </motion.p>
                                <motion.h2 variants={reveal} className="text-3xl font-black tracking-tight sm:text-4xl">
                                    Arti di Balik <span className="bg-gradient-to-r from-[#2563eb] to-sky-400 bg-clip-text text-transparent">Lambang HIMATIFA.</span>
                                </motion.h2>
                                <motion.p variants={reveal} className="mt-4 text-[15px] leading-relaxed text-slate-500">
                                    Setiap elemen visual dalam lambang HIMATIFA memiliki makna filosofis yang mendalam, menggambarkan sejarah, komitmen, dan identitas organisasi.
                                </motion.p>
                            </motion.div>

                            <motion.ol
                                initial="hidden" whileInView="show" viewport={{ once: true, margin: '-40px' }}
                                variants={container}
                                className="relative flex flex-col gap-6"
                            >
                                <span aria-hidden className="absolute bottom-6 left-[31px] top-2 w-px bg-gradient-to-b from-blue-200 via-blue-300 to-transparent" />
                                {filosofiLogo.map((item, i) => (
                                    <motion.li key={item.title} variants={listItem} className="group relative flex gap-5">
                                        <span className="relative z-10 grid size-16 shrink-0 place-items-center">
                                            <Image
                                                src={item.image}
                                                alt={item.title}
                                                width={56}
                                                height={56}
                                                className="size-14 object-contain drop-shadow-md transition-transform duration-300 group-hover:scale-110"
                                            />
                                         </span>

                                        <div className="rounded-2xl border border-transparent p-4 -m-4 transition-all duration-300 group-hover:border-white group-hover:bg-white/60 group-hover:shadow-lg group-hover:shadow-blue-900/5">
                                            <div className="flex items-center gap-2.5">
                                                <h3 className="text-lg font-extrabold text-[#0a192f] transition-colors group-hover:text-[#2563eb]">
                                                    {item.title}
                                                </h3>
                                                <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-black text-[#2563eb] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                                    0{i + 1}
                                                </span>
                                            </div>
                                            <p className="mt-2 text-sm leading-relaxed text-slate-600">
                                                {item.description}
                                            </p>
                                        </div>
                                    </motion.li>
                                ))}
                            </motion.ol>
                        </div>
                    </div>
                </motion.div>

                <motion.footer
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="mt-16 flex flex-col items-center justify-between gap-3 border-t border-slate-200/60 pb-4 pt-8 sm:flex-row"
                >
                    <p className="flex items-center gap-1.5 text-xs text-slate-400">
                        <Copyright className="size-3.5" /> 2026 HIMATIFA UMSURA
                    </p>
                    <p className="flex items-center gap-1.5 text-xs text-slate-400">
                        Created by MEDKOMINFO
                    </p>
                </motion.footer>
            </div>

            <BackToTop />
        </main>
    )
}