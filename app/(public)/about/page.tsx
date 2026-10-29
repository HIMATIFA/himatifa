'use client'

import { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
    motion,
    useScroll,
    useSpring,
    useReducedMotion,
    type Variants
} from 'framer-motion'
import {
    identitiesData,
    missionsData,
    filosofiLogoData,
    type IdentityItem,
    type MissionItem
} from '@/app/data'
import {
    ArrowLeft,
    ArrowUp,
    ShieldCheck,
    GraduationCap,
    Handshake,
    Wallet,
    Globe,
    Megaphone,
    Lightbulb,
    Building2,
    Calendar,
    Award,
    Copyright,
    ArrowRight
} from 'lucide-react'

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

export default function AboutPage() {
    const { scrollYProgress } = useScroll()
    const progressScale = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.4 })
    const logoSectionRef = useRef<HTMLDivElement>(null)

    const getIdentityIcon = (iconType: IdentityItem['iconType']) => {
        switch (iconType) {
            case 'building': return Building2
            case 'award': return Award
            case 'graduation': return GraduationCap
            case 'calendar': return Calendar
            default: return ShieldCheck
        }
    }

    const getMissionIcon = (iconType: MissionItem['iconType']) => {
        switch (iconType) {
            case 'graduation': return GraduationCap
            case 'handshake': return Handshake
            case 'wallet': return Wallet
            case 'globe': return Globe
            case 'megaphone': return Megaphone
            case 'lightbulb': return Lightbulb
            default: return ShieldCheck
        }
    }

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
                        <span className="font-bold text-slate-900">Profil Organisasi</span>
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
                            Profil & Visi Misi Resmi
                        </span>
                    </motion.div>
                    <motion.h1 variants={reveal} className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
                        Mengenal Lebih Dekat <span className="text-blue-600">HIMATIFA</span>
                    </motion.h1>
                    <motion.p variants={reveal} className="mt-3 text-sm sm:text-base leading-relaxed text-slate-600 font-normal">
                        Himpunan Mahasiswa Informatika Universitas Muhammadiyah Surabaya adalah ruang tumbuh kolaboratif yang menaungi aspirasi, karya teknologi, dan pembinaan karakter insan akademis.
                    </motion.p>
                </motion.div>

                <motion.div
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: '-60px' }}
                    variants={container}
                    className="grid gap-6 lg:grid-cols-12 lg:items-stretch"
                >
                    <motion.div variants={reveal} className="lg:col-span-7">
                        <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-slate-900 bg-slate-900 p-6 sm:p-8 text-white shadow-xs">
                            <div>
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 border border-blue-400/20 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-blue-400">
                                    Visi Kepengurusan
                                </span>

                                <blockquote className="mt-5 text-lg font-bold leading-relaxed tracking-tight text-white sm:text-2xl">
                                    &ldquo;Menjadikan HIMATIFA sebagai organisasi mahasiswa Informatika yang unggul, solid, dan berdaya saing dalam pengembangan aspirasi, kreativitas, dan kompetensi mahasiswa.&rdquo;
                                </blockquote>

                                <p className="mt-3 text-xs sm:text-sm leading-relaxed text-slate-300 font-medium">
                                    Berkomitmen menghadirkan ekosistem yang sehat bagi mahasiswa untuk mengasah nalar kritis, keterampilan teknis, dan kepekaan sosial dalam menjawab tantangan era digital.
                                </p>
                            </div>

                            <div className="mt-8 border-t border-slate-800 pt-5">
                                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                                    Tiga Pilar Utama Visi:
                                </span>
                                <div className="mt-2.5 flex flex-wrap gap-2 text-xs font-semibold text-blue-200">
                                    <span className="rounded-lg bg-white/5 border border-white/10 px-3 py-1 text-[11px]">
                                        1. Keunggulan Akademis & Praktis
                                    </span>
                                    <span className="rounded-lg bg-white/5 border border-white/10 px-3 py-1 text-[11px]">
                                        2. Soliditas Kekeluargaan
                                    </span>
                                    <span className="rounded-lg bg-white/5 border border-white/10 px-3 py-1 text-[11px]">
                                        3. Daya Saing Kompetitif
                                    </span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div variants={reveal} className="lg:col-span-5">
                        <div className="flex h-full flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
                            <div>
                                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                                    <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-blue-50 border border-blue-100 text-blue-600">
                                        <Image
                                            src="/logo.png"
                                            alt="Logo HIMATIFA"
                                            width={32}
                                            height={32}
                                            className="object-contain"
                                        />
                                    </div>
                                    <div>
                                        <h2 className="text-base font-bold text-slate-900">Identitas Organisasi</h2>
                                        <p className="text-xs text-slate-400 font-medium">Legalitas & data institusional</p>
                                    </div>
                                </div>

                                <dl className="mt-4 divide-y divide-slate-100">
                                    {identitiesData.map((item) => {
                                        const Icon = getIdentityIcon(item.iconType)
                                        return (
                                            <div key={item.label} className="flex items-center justify-between py-2 text-xs">
                                                <dt className="flex items-center gap-2 text-slate-500 font-medium">
                                                    <Icon className="size-3.5 text-slate-400" />
                                                    <span>{item.label}</span>
                                                </dt>
                                                <dd className="font-bold text-slate-900 text-right">
                                                    {item.value}
                                                </dd>
                                            </div>
                                        )
                                    })}
                                </dl>
                            </div>

                            <div className="mt-5 rounded-xl bg-slate-50 p-3.5 border border-slate-200/60 text-xs text-slate-600">
                                <span className="font-bold text-slate-900 block mb-0.5">Sekretariat Resmi:</span>
                                Gedung G Lantai 3, FT UMSURA, Jl. Sutorejo No. 59, Surabaya.
                            </div>
                        </div>
                    </motion.div>
                </motion.div>

                <section className="mt-16 sm:mt-20">
                    <motion.div
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, margin: '-60px' }}
                        variants={container}
                        className="mb-8"
                    >
                        <motion.div variants={reveal} className="flex items-center gap-3 mb-2">
                            <div className="h-[1px] w-6 sm:w-12 bg-blue-600/30" />
                            <span className="text-[10px] sm:text-xs font-bold tracking-[0.25em] uppercase text-blue-600">
                                Misi & Arah Pergerakan
                            </span>
                        </motion.div>
                        <motion.h2 variants={reveal} className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900">
                            7 Misi Strategis Organisasi
                        </motion.h2>
                        <motion.p variants={reveal} className="mt-2 text-xs sm:text-sm text-slate-600 font-medium max-w-xl">
                            Panduan operasional dan peta jalan komprehensif dalam merealisasikan program kerja yang berdampak nyata.
                        </motion.p>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, margin: '-40px' }}
                        variants={container}
                        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
                    >
                        {missionsData.map((misi) => {
                            const Icon = getMissionIcon(misi.iconType)
                            return (
                                <motion.div
                                    key={misi.number}
                                    variants={reveal}
                                    className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition hover:border-blue-300 hover:shadow-sm"
                                >
                                    <div>
                                        <div className="flex items-center justify-between">
                                            <div className="grid size-9 place-items-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                                                <Icon className="size-4" />
                                            </div>
                                            <span className="text-lg font-extrabold text-slate-300 group-hover:text-blue-200 transition-colors">
                                                {misi.number}
                                            </span>
                                        </div>

                                        <span className="mt-3 inline-block text-[10px] font-extrabold uppercase tracking-wider text-blue-600">
                                            {misi.category}
                                        </span>

                                        <h3 className="mt-0.5 text-sm font-bold text-slate-900">
                                            {misi.title}
                                        </h3>

                                        <p className="mt-1.5 text-xs font-medium leading-relaxed text-slate-500">
                                            {misi.desc}
                                        </p>
                                    </div>
                                </motion.div>
                            )
                        })}
                    </motion.div>
                </section>

                <section ref={logoSectionRef} className="mt-16 sm:mt-24">
                    <motion.div
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, margin: '-60px' }}
                        variants={container}
                        className="mb-8"
                    >
                        <motion.div variants={reveal} className="flex items-center gap-3 mb-2">
                            <div className="h-[1px] w-6 sm:w-12 bg-blue-600/30" />
                            <span className="text-[10px] sm:text-xs font-bold tracking-[0.25em] uppercase text-blue-600">
                                Identitas Visual
                            </span>
                        </motion.div>
                        <motion.h2 variants={reveal} className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900">
                            Filosofi Lambang HIMATIFA
                        </motion.h2>
                        <motion.p variants={reveal} className="mt-2 text-xs sm:text-sm text-slate-600 font-medium max-w-xl">
                            Setiap elemen visual dalam lambang merefleksikan identitas, sejarah, dan nilai luhur organisasi.
                        </motion.p>
                    </motion.div>

                    <div className="grid gap-6 lg:grid-cols-12 lg:items-start">
                        <div className="lg:col-span-5 lg:sticky lg:top-24">
                            <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-xs">
                                <div className="relative mx-auto flex size-44 items-center justify-center rounded-2xl bg-slate-50 border border-slate-100 p-4">
                                    <Image
                                        src="/logo.png"
                                        alt="Lambang Lengkap HIMATIFA"
                                        width={150}
                                        height={150}
                                        className="object-contain"
                                        priority
                                    />
                                </div>

                                <h3 className="mt-4 text-base font-bold text-slate-900">
                                    Lambang Resmi HIMATIFA
                                </h3>
                                <p className="mt-0.5 text-xs font-semibold text-slate-400">
                                    Ditetapkan sejak 10 Oktober 2020
                                </p>

                                <div className="mt-4 rounded-xl bg-blue-50/70 p-3.5 border border-blue-100 text-left text-xs leading-relaxed text-slate-600">
                                    <p className="font-bold text-blue-700 mb-0.5">Prinsip Desain:</p>
                                    Kesatuan simbol sirkuit digital dan lambang persyarikatan merepresentasikan harmonisasi keilmuan komputasi dengan nilai-nilai luhur.
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 lg:col-span-7">
                            {filosofiLogoData.map((item, idx) => (
                                <motion.div
                                    key={item.title}
                                    initial={{ opacity: 0, y: 16 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.4, delay: idx * 0.08 }}
                                    className="group rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xs transition hover:border-blue-300"
                                >
                                    <div className="flex flex-col gap-3.5 sm:flex-row sm:items-start">
                                        <div className="grid size-12 shrink-0 place-items-center rounded-xl border border-slate-100 bg-slate-50 p-2 group-hover:bg-blue-50 group-hover:border-blue-100 transition">
                                            <Image
                                                src={item.image}
                                                alt={item.title}
                                                width={36}
                                                height={36}
                                                className="size-9 object-contain"
                                            />
                                        </div>

                                        <div className="flex-1">
                                            <div className="flex flex-wrap items-center justify-between gap-2">
                                                <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                                    {item.title}
                                                </h4>
                                                <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-extrabold text-blue-700 border border-blue-100">
                                                    {item.badge}
                                                </span>
                                            </div>
                                            <p className="mt-1.5 text-xs font-medium leading-relaxed text-slate-500">
                                                {item.description}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
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
                            Terhubung Bersama Kami
                        </span>
                        <h3 className="mt-1 text-xl sm:text-2xl font-extrabold tracking-tight text-white">
                            Siap Bersinergi & Menciptakan Dampak Nyata?
                        </h3>
                        <p className="mt-1.5 text-xs text-slate-300 font-medium leading-relaxed">
                            Buka ruang diskusi, sampaikan gagasan kolaborasi, atau ikuti kegiatan pengembangan mahasiswa terkini.
                        </p>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-2.5 lg:mt-0">
                        <Link
                            href="/events"
                            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-blue-600/10 transition hover:bg-blue-500 active:scale-[0.98]"
                        >
                            <span>Jelajahi Agenda</span>
                            <ArrowRight className="size-3.5" />
                        </Link>
                        <Link
                            href="/contact"
                            className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-white/5 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-white/10 active:scale-[0.98]"
                        >
                            <span>Hubungi Pengurus</span>
                        </Link>
                    </div>
                </motion.div>

                <footer className="mt-16 flex flex-col items-center justify-between gap-3 border-t border-slate-200 pt-6 pb-4 text-xs font-medium text-slate-400 sm:flex-row">
                    <p className="flex items-center gap-1.5">
                        <Copyright className="size-3.5" /> {new Date().getFullYear()} HIMATIFA UMSURA
                    </p>
                    <div className="flex items-center gap-4 text-slate-500">
                        <Link href="/" className="hover:text-blue-600 transition">Beranda</Link>
                        <Link href="/news" className="hover:text-blue-600 transition">Berita</Link>
                        <Link href="/contact" className="hover:text-blue-600 transition">Kontak</Link>
                    </div>
                </footer>
            </div>

            <BackToTop />
        </main>
    )
}