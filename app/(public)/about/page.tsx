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
    ArrowLeft,
    ArrowUp,
    Sparkles,
    Target,
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
    ArrowRight,
    Compass
} from 'lucide-react'

const identities = [
    { label: "Nama Resmi", value: "Himpunan Mahasiswa Informatika", icon: Building2 },
    { label: "Nama Singkat", value: "HIMATIFA", icon: Award },
    { label: "Institusi", value: "Universitas Muhammadiyah Surabaya", icon: Building2 },
    { label: "Program Studi", value: "S1 Informatika", icon: GraduationCap },
    { label: "Tanggal Berdiri", value: "10 Oktober 2020", icon: Calendar },
    { label: "Periode Kepengurusan", value: "2026 / 2027", icon: ShieldCheck },
]

const missions = [
    {
        number: "01",
        category: "Tata Kelola Internal",
        title: "Fondasi Organisasi Kokoh",
        desc: "Memperkuat soliditas dan manajemen internal organisasi sebagai fondasi keberlanjutan roda kepengurusan HIMATIFA.",
        icon: ShieldCheck,
    },
    {
        number: "02",
        category: "Kapasitas Mahasiswa",
        title: "Pengembangan Kompetensi",
        desc: "Meningkatkan kemampuan teknikal dan soft skills mahasiswa Informatika melalui program pelatihan, bootcamp, dan study club terstruktur.",
        icon: GraduationCap,
    },
    {
        number: "03",
        category: "Kemitraan Akademik",
        title: "Sinergi Dosen & Kampus",
        desc: "Membangun komunikasi konstruktif dengan jajaran dosen dan program studi sebagai mitra strategis dalam pengembangan akademik.",
        icon: Handshake,
    },
    {
        number: "04",
        category: "Kemandirian Finansial",
        title: "Pengelolaan Produktif",
        desc: "Mengelola keuangan secara mandiri, transparan, dan produktif melalui divisi ekonomi kreatif untuk menopang agenda kerja.",
        icon: Wallet,
    },
    {
        number: "05",
        category: "Jejaring Eksternal",
        title: "Relasi & Kolaborasi Industri",
        desc: "Memperluas kemitraan strategis dengan organisasi kemahasiswaan lain, komunitas teknologi, dan mitra industri profesional.",
        icon: Globe,
    },
    {
        number: "06",
        category: "Komunikasi Publik",
        title: "Penguatan Citra & Branding",
        desc: "Membangun citra positif HIMATIFA sebagai wadah mahasiswa yang progresif, relevan, dan terpercaya di ranah digital.",
        icon: Megaphone,
    },
    {
        number: "07",
        category: "Pemberdayaan Mahasiswa",
        title: "Inkubasi Aspirasi & Karya",
        desc: "Menjadikan himpunan sebagai rumah yang responsif terhadap aspirasi, kreativitas, inovasi, serta peluang bagi seluruh anggota.",
        icon: Lightbulb,
    },
]

const filosofiLogo = [
    {
        image: "/logo_1.png",
        title: "Microchip Processor",
        badge: "Pola Pikir & Inovasi",
        description: "Melambangkan pola pikir dan gerak mahasiswa Informatika yang selalu berada di garda terdepan dalam inovasi, adaptasi teknologi, dan pemecahan masalah secara logis."
    },
    {
        image: "/logo_2.png",
        title: "Lingkaran & Dua Garis",
        badge: "Fondasi & Integritas",
        description: "Lingkaran luar bermakna awal kelahiran himpunan yang bersih dan tulus. Lingkaran dalam melambangkan ranah Informatika, diapit dua garis yang mencerminkan keteguhan memegang dua kalimat syahadat."
    },
    {
        image: "/logo_3.png",
        title: "10 Cabang Sirkuit",
        badge: "Sejarah & Keberagaman",
        description: "Sepuluh cabang merepresentasikan tanggal berdirinya HIMATIFA pada 10 Oktober 2020, sekaligus mengilustrasikan keberagaman latar belakang mahasiswa yang terintegrasi dalam satu harmoni gerak."
    },
    {
        image: "/logo_4.png",
        title: "Tipografi Melingkar",
        badge: "Solidaritas Bersatu",
        description: "Tulisan yang melingkar secara utuh menggambarkan komitmen seluruh fungsionaris dan anggota untuk senantiasa bergandengan tangan, saling mendukung, dan kuat menghadapi dinamika zaman."
    },
    {
        image: "/logo_5.png",
        title: "Matahari Muhammadiyah",
        badge: "Identitas & Nilai Luhur",
        description: "Terletak di poros tengah lambang, menegaskan bahwa HIMATIFA tumbuh dan bernaung di bawah naungan Universitas Muhammadiyah Surabaya dengan membawa misi pencerahan dan kemaslahatan."
    }
]

const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
}

const reveal: Variants = {
    hidden: { opacity: 0, y: 24 },
    show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
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

export default function AboutPage() {
    const { scrollYProgress } = useScroll()
    const progressScale = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.4 })
    const logoSectionRef = useRef<HTMLDivElement>(null)

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
                        <span className="font-semibold text-[#2563eb]">Profil Organisasi</span>
                    </div>
                </div>

                <motion.div
                    initial="hidden"
                    animate="show"
                    variants={container}
                    className="mt-12 text-center sm:mt-16"
                >
                    <motion.div variants={reveal} className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/80 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#2563eb]">
                        <span>Profil & Visi Misi Resmi</span>
                    </motion.div>

                    <motion.h1
                        variants={reveal}
                        className="mt-4 text-3xl font-black tracking-tight text-[#0a192f] sm:text-5xl lg:text-6xl"
                    >
                        Mengenal Lebih Dekat{' '}
                        <span className="bg-gradient-to-r from-[#2563eb] to-sky-500 bg-clip-text text-transparent">
                            HIMATIFA.
                        </span>
                    </motion.h1>

                    <motion.p
                        variants={reveal}
                        className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg"
                    >
                        Himpunan Mahasiswa Informatika Universitas Muhammadiyah Surabaya adalah ruang tumbuh kolaboratif yang menaungi aspirasi, karya teknologi, dan pembinaan karakter insan akademis.
                    </motion.p>
                </motion.div>

                <motion.div
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: '-60px' }}
                    variants={container}
                    className="mt-14 grid gap-6 lg:grid-cols-12 lg:items-stretch"
                >
                    <motion.div variants={reveal} className="lg:col-span-7">
                        <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-slate-800 bg-[#0c1f38] p-8 text-white shadow-xl sm:p-10">
                            <div
                                aria-hidden
                                className="pointer-events-none absolute -bottom-20 -right-20 size-60 rounded-full bg-blue-500/20 blur-3xl"
                            />

                            <div>
                                <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-blue-300">
                                    <span>Visi Kepengurusan</span>
                                </div>

                                <blockquote className="mt-6 text-xl font-bold leading-relaxed tracking-tight text-white sm:text-2xl lg:text-3xl">
                                    &ldquo;Menjadikan HIMATIFA sebagai organisasi mahasiswa Informatika yang unggul, solid, dan berdaya saing dalam pengembangan aspirasi, kreativitas, dan kompetensi mahasiswa.&rdquo;
                                </blockquote>

                                <p className="mt-4 text-sm leading-relaxed text-slate-300">
                                    Berkomitmen menghadirkan ekosistem yang sehat bagi mahasiswa untuk mengasah nalar kritis, keterampilan teknis, dan kepekaan sosial dalam menjawab tantangan era digital.
                                </p>
                            </div>

                            <div className="mt-8 border-t border-slate-700/60 pt-6">
                                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                    Tiga Pilar Utama Visi:
                                </span>
                                <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold text-blue-100">
                                    <span className="rounded-lg bg-white/5 border border-white/10 px-3 py-1.5">
                                        1. Keunggulan Akademis & Praktis
                                    </span>
                                    <span className="rounded-lg bg-white/5 border border-white/10 px-3 py-1.5">
                                        2. Soliditas Kekeluargaan
                                    </span>
                                    <span className="rounded-lg bg-white/5 border border-white/10 px-3 py-1.5">
                                        3. Daya Saing Kompetitif
                                    </span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div variants={reveal} className="lg:col-span-5">
                        <div className="flex h-full flex-col justify-between rounded-3xl border border-slate-200/90 bg-white p-7 shadow-sm sm:p-8">
                            <div>
                                <div className="flex items-center gap-3.5 border-b border-slate-100 pb-5">
                                    <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-blue-50 border border-blue-100">
                                        <Image
                                            src="/logo.png"
                                            alt="Logo HIMATIFA"
                                            width={36}
                                            height={36}
                                            className="object-contain"
                                        />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-[#0a192f]">Identitas Organisasi</h2>
                                        <p className="text-xs font-medium text-slate-500">Legalitas & data institusional</p>
                                    </div>
                                </div>

                                <dl className="mt-5 divide-y divide-slate-100">
                                    {identities.map((item) => {
                                        const Icon = item.icon
                                        return (
                                            <div key={item.label} className="flex items-center justify-between py-2.5 text-xs sm:text-sm">
                                                <dt className="flex items-center gap-2 text-slate-500">
                                                    <Icon className="size-3.5 text-slate-400" />
                                                    <span>{item.label}</span>
                                                </dt>
                                                <dd className="font-semibold text-slate-900 text-right">
                                                    {item.value}
                                                </dd>
                                            </div>
                                        )
                                    })}
                                </dl>
                            </div>

                            <div className="mt-6 rounded-2xl bg-slate-50 p-4 border border-slate-100 text-xs text-slate-600">
                                <span className="font-bold text-[#0a192f] block mb-1">Sekretariat Resmi:</span>
                                Gedung G Lantai 3, Fakultas Teknik Universitas Muhammadiyah Surabaya, Jl. Sutorejo No. 59, Surabaya.
                            </div>
                        </div>
                    </motion.div>
                </motion.div>

                <section className="mt-20">
                    <motion.div
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, margin: '-60px' }}
                        variants={container}
                        className="text-center"
                    >
                        <motion.div variants={reveal} className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/80 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#2563eb]">
                            <span>Misi & Arah Pergerakan</span>
                        </motion.div>
                        <motion.h2
                            variants={reveal}
                            className="mt-3 text-3xl font-black tracking-tight text-[#0a192f] sm:text-4xl"
                        >
                            7 Misi Strategis Organisasi
                        </motion.h2>
                        <motion.p
                            variants={reveal}
                            className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base"
                        >
                            Panduan operasional dan peta jalan komprehensif dalam merealisasikan program kerja yang berdampak nyata.
                        </motion.p>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, margin: '-40px' }}
                        variants={container}
                        className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
                    >
                        {missions.map((misi) => {
                            const Icon = misi.icon
                            return (
                                <motion.div
                                    key={misi.number}
                                    variants={reveal}
                                    className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-md"
                                >
                                    <div>
                                        <div className="flex items-center justify-between">
                                            <div className="grid size-10 place-items-center rounded-xl bg-blue-50 text-[#2563eb] border border-blue-100 transition-colors group-hover:bg-[#2563eb] group-hover:text-white">
                                                <Icon className="size-4.5" />
                                            </div>
                                            <span className="text-xl font-black text-slate-200 group-hover:text-blue-200 transition-colors">
                                                {misi.number}
                                            </span>
                                        </div>

                                        <span className="mt-4 inline-block text-[11px] font-bold uppercase tracking-wider text-[#2563eb]">
                                            {misi.category}
                                        </span>

                                        <h3 className="mt-1 text-base font-bold text-[#0a192f]">
                                            {misi.title}
                                        </h3>

                                        <p className="mt-2 text-sm leading-relaxed text-slate-600">
                                            {misi.desc}
                                        </p>
                                    </div>
                                </motion.div>
                            )
                        })}
                    </motion.div>
                </section>

                <section ref={logoSectionRef} className="mt-24 scroll-mt-20">
                    <motion.div
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, margin: '-60px' }}
                        variants={container}
                        className="text-center"
                    >
                        <motion.div variants={reveal} className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/80 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#2563eb]">
                            <span>Identitas Visual</span>
                        </motion.div>
                        <motion.h2
                            variants={reveal}
                            className="mt-3 text-3xl font-black tracking-tight text-[#0a192f] sm:text-4xl"
                        >
                            Filosofi Lambang HIMATIFA
                        </motion.h2>
                        <motion.p
                            variants={reveal}
                            className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base"
                        >
                            Setiap lekuk garis dan elemen visual dalam lambang memiliki makna filosofis yang merefleksikan identitas, sejarah, dan nilai luhur organisasi.
                        </motion.p>
                    </motion.div>

                    <div className="mt-12 grid gap-8 lg:grid-cols-12 lg:items-start">
                        <div className="lg:col-span-5 lg:sticky lg:top-24">
                            <div className="overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-8 text-center shadow-sm">
                                <div className="relative mx-auto flex size-52 items-center justify-center rounded-3xl bg-slate-50 border border-slate-100 p-6">
                                    <Image
                                        src="/logo.png"
                                        alt="Lambang Lengkap HIMATIFA"
                                        width={180}
                                        height={180}
                                        className="object-contain transition-transform duration-500 hover:scale-105"
                                        priority
                                    />
                                </div>

                                <h3 className="mt-6 text-xl font-extrabold text-[#0a192f]">
                                    Lambang Resmi HIMATIFA
                                </h3>
                                <p className="mt-1 text-xs font-semibold text-slate-500">
                                    Ditetapkan sejak 10 Oktober 2020
                                </p>

                                <div className="mt-6 rounded-2xl bg-blue-50/70 p-4 border border-blue-100 text-left text-xs leading-relaxed text-slate-600">
                                    <p className="font-bold text-[#2563eb] mb-1">Prinsip Desain:</p>
                                    Kesatuan simbol sirkuit digital dan lambang persyarikatan merepresentasikan harmonisasi keilmuan teknologi komputasi dengan nilai-nilai akhlakul karimah.
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-4 lg:col-span-7">
                            {filosofiLogo.map((item, idx) => (
                                <motion.div
                                    key={item.title}
                                    initial={{ opacity: 0, y: 16 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.4, delay: idx * 0.08 }}
                                    className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all duration-300 hover:border-blue-300 hover:shadow-sm sm:p-6"
                                >
                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                                        <div className="grid size-16 shrink-0 place-items-center rounded-2xl border border-slate-100 bg-slate-50 p-2.5 transition-transform duration-300 group-hover:scale-105 group-hover:bg-blue-50">
                                            <Image
                                                src={item.image}
                                                alt={item.title}
                                                width={48}
                                                height={48}
                                                className="size-12 object-contain"
                                            />
                                        </div>

                                        <div className="flex-1">
                                            <div className="flex flex-wrap items-center justify-between gap-2">
                                                <h4 className="text-base font-bold text-[#0a192f] transition-colors group-hover:text-[#2563eb]">
                                                    {item.title}
                                                </h4>
                                                <span className="rounded-md bg-blue-50 px-2.5 py-0.5 text-[11px] font-bold text-[#2563eb] border border-blue-100">
                                                    {item.badge}
                                                </span>
                                            </div>
                                            <p className="mt-2 text-sm leading-relaxed text-slate-600">
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
                    className="mt-20 rounded-3xl border border-slate-800 bg-[#071426] p-8 text-white shadow-xl sm:p-10 lg:flex lg:items-center lg:justify-between"
                >
                    <div className="max-w-xl">
                        <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                            Terhubung Bersama Kami
                        </span>
                        <h3 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl text-white">
                            Siap Bersinergi & Menciptakan Dampak Nyata?
                        </h3>
                        <p className="mt-2 text-sm text-slate-300 leading-relaxed">
                            Buka ruang diskusi, sampaikan gagasan kolaborasi, atau ikuti kegiatan pengembangan mahasiswa terkini.
                        </p>
                    </div>

                    <div className="mt-6 flex flex-wrap gap-3 lg:mt-0">
                        <Link
                            href="/events"
                            className="inline-flex items-center gap-2 rounded-xl bg-[#2563eb] px-5 py-3 text-xs font-bold text-white shadow-md transition-all hover:bg-blue-500"
                        >
                            <span>Jelajahi Agenda</span>
                            <ArrowRight className="size-4" />
                        </Link>
                        <Link
                            href="/contact"
                            className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-white/5 px-5 py-3 text-xs font-bold text-white transition-all hover:bg-white/10"
                        >
                            <span>Hubungi Pengurus</span>
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
                        <Link href="/news" className="hover:text-blue-600 transition-colors">
                            Berita
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
