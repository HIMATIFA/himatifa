'use client'

import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence, type Variants } from 'framer-motion'
import {
    ArrowLeft,
    ArrowRight,
    CheckCircle2,
    Cpu,
    MessageCircle,
    MonitorSmartphone,
    Server,
    ShoppingCart,
    Wrench,
    Zap,
    Search,
    Bot,
    Film,
    Palette,
    Scissors,
    Sparkles,
    Tv,
    Image as ImageIcon,
    BookOpen,
    ShieldCheck,
    Clock,
    Copyright,
    TrendingUp,
    Star,
    X
} from 'lucide-react'
import Link from 'next/link'

interface ProductVariant {
    name: string
    price: number
    priceLabel: string
    isPopular?: boolean
}

interface DigitalProduct {
    category: string
    tag: 'AI Tools' | 'Streaming' | 'Creative'
    icon: React.ReactNode
    variants: ProductVariant[]
}

interface TechService {
    id: string
    title: string
    icon: React.ReactNode
    desc: string
    stack: string[]
}

const digitalProducts: DigitalProduct[] = [
    {
        category: 'ChatGPT',
        tag: 'AI Tools',
        icon: <Bot className="size-6 text-emerald-500" />,
        variants: [
            { name: 'Private Full (1 Bln Go)', price: 52500, priceLabel: 'Rp 52.500', isPopular: true },
            { name: 'Private Full (3 Bln Go)', price: 60000, priceLabel: 'Rp 60.000' },
            { name: 'Private 24 Jam (1 Bln Plus)', price: 35500, priceLabel: 'Rp 35.500' },
            { name: 'Private 24 Jam (3 Bln Go)', price: 50000, priceLabel: 'Rp 50.000' },
        ]
    },
    {
        category: 'Gemini Plus',
        tag: 'AI Tools',
        icon: <Sparkles className="size-6 text-blue-500" />,
        variants: [
            { name: 'Bergaransi (1 Bulan)', price: 15000, priceLabel: 'Rp 15.000' },
            { name: 'Bergaransi (6 Bulan)', price: 75000, priceLabel: 'Rp 75.000', isPopular: true },
        ]
    },
    {
        category: 'Netflix Premium',
        tag: 'Streaming',
        icon: <Film className="size-6 text-red-600" />,
        variants: [
            { name: '1 Profile 1 User (1 Hari)', price: 8000, priceLabel: 'Rp 8.000' },
            { name: '1 Profile 1 User (7 Hari)', price: 15500, priceLabel: 'Rp 15.500' },
            { name: '1 Profile 1 User (1 Bulan)', price: 30000, priceLabel: 'Rp 30.000', isPopular: true },
            { name: 'Semi Private (1 Bulan)', price: 35000, priceLabel: 'Rp 35.000' },
        ]
    },
    {
        category: 'Vidio Platinum',
        tag: 'Streaming',
        icon: <Tv className="size-6 text-red-500" />,
        variants: [
            { name: 'Private (1 Bln Mobile)', price: 30500, priceLabel: 'Rp 30.500' },
            { name: 'Private (1 Bln All Dev)', price: 40500, priceLabel: 'Rp 40.500', isPopular: true },
            { name: 'Private TV Only (1 Thn)', price: 150000, priceLabel: 'Rp 150.000' },
        ]
    },
    {
        category: 'Canva Pro',
        tag: 'Creative',
        icon: <Palette className="size-6 text-cyan-500" />,
        variants: [
            { name: 'Private & Invite (1 Bln)', price: 10000, priceLabel: 'Rp 10.000' },
            { name: 'Private & Invite (6 Bln)', price: 15000, priceLabel: 'Rp 15.000' },
            { name: 'Private & Invite (1 Thn)', price: 30000, priceLabel: 'Rp 30.000', isPopular: true },
        ]
    },
    {
        category: 'CapCut Pro',
        tag: 'Creative',
        icon: <Scissors className="size-6 text-slate-700" />,
        variants: [
            { name: 'Private (7 Hari)', price: 15500, priceLabel: 'Rp 15.500' },
            { name: 'Private (1 Bulan)', price: 35500, priceLabel: 'Rp 35.500', isPopular: true },
        ]
    },
    {
        category: 'Lightroom',
        tag: 'Creative',
        icon: <ImageIcon className="size-6 text-sky-500" />,
        variants: [
            { name: 'Sharing (1 Bulan)', price: 10000, priceLabel: 'Rp 10.000' },
            { name: 'Sharing (1 Tahun)', price: 15500, priceLabel: 'Rp 15.500', isPopular: true },
        ]
    },
    {
        category: 'Wattpad Premium+',
        tag: 'Streaming',
        icon: <BookOpen className="size-6 text-orange-500" />,
        variants: [
            { name: 'Private (1 Bulan)', price: 15500, priceLabel: 'Rp 15.500' },
            { name: 'Sharing (1 Bulan)', price: 10500, priceLabel: 'Rp 10.500' },
            { name: 'Sharing (1 Tahun)', price: 15500, priceLabel: 'Rp 15.500', isPopular: true },
        ]
    }
]

const techServices: TechService[] = [
    {
        id: 'web-dev',
        title: 'Web & App Development',
        icon: <MonitorSmartphone className="size-6 text-[#2563eb]" />,
        desc: 'Pengembangan platform modern yang cepat, responsif, dan scalable untuk kebutuhan bisnis, akademik, maupun startup.',
        stack: ['Next.js', 'React', 'Tailwind', 'Supabase', 'TypeScript']
    },
    {
        id: 'iot-dev',
        title: 'IoT & Embedded Systems',
        icon: <Cpu className="size-6 text-[#2563eb]" />,
        desc: 'Rancang bangun purwarupa hardware pintar, integrasi sensor cerdas, dan sistem telemetri berbasis dashboard real-time.',
        stack: ['ESP32', 'Arduino', 'C++', 'BLE', 'Sensor']
    },
    {
        id: 'ai-ml',
        title: 'AI & Machine Learning',
        icon: <Server className="size-6 text-[#2563eb]" />,
        desc: 'Implementasi model prediktif, analisis data tingkat lanjut, dan integrasi generative AI untuk otomasi sistem cerdas.',
        stack: ['Python', 'Gemini API', 'PyTorch', 'Vector DB']
    },
    {
        id: 'repair',
        title: 'Servis Laptop & HP',
        icon: <Wrench className="size-6 text-[#2563eb]" />,
        desc: 'Perawatan perangkat keras, instalasi OS, pembersihan komponen, ganti pasta termal, hingga optimalisasi performa perangkat.',
        stack: ['Cleaning', 'OS Install', 'Thermal Paste', 'Troubleshooting']
    }
]

const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
}

const itemVariant: Variants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
}

export default function EkrafStorePage() {
    const [isScrolled, setIsScrolled] = useState(false)
    const [selectedItem, setSelectedItem] = useState<{ category: string; variant: ProductVariant } | null>(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedTag, setSelectedTag] = useState<string>('Semua')

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20)
        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const filteredProducts = useMemo(() => {
        return digitalProducts.filter((product) => {
            const matchesSearch =
                product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.variants.some((v) => v.name.toLowerCase().includes(searchQuery.toLowerCase()))
            const matchesTag = selectedTag === 'Semua' || product.tag === selectedTag
            return matchesSearch && matchesTag
        })
    }, [searchQuery, selectedTag])

    return (
        <main className="relative min-h-screen bg-[#f8fafc] text-slate-800 selection:bg-blue-200">
            <motion.header
                className="fixed inset-x-0 top-0 z-50 flex flex-col items-center px-4 pt-4 sm:px-6 lg:px-10 pointer-events-none transition-all duration-300"
            >
                <motion.nav
                    animate={{
                        maxWidth: isScrolled ? "768px" : "1280px",
                        backgroundColor: isScrolled ? "rgba(255, 255, 255, 0.95)" : "rgba(255, 255, 255, 0.7)",
                        y: isScrolled ? 0 : 0
                    }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className={`pointer-events-auto flex w-full items-center justify-between rounded-full border border-slate-200/60 px-4 py-2.5 backdrop-blur-xl transition-shadow ${
                        isScrolled ? 'shadow-lg shadow-slate-200/50' : 'shadow-sm'
                    }`}
                >
                    <Link
                        href="/"
                        className="group flex items-center gap-2 rounded-full p-2 text-sm font-bold tracking-tight text-slate-600 transition-colors hover:bg-slate-100 hover:text-[#2563eb]"
                    >
                        <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
                        <span className={isScrolled ? 'hidden sm:inline' : 'inline'}>Kembali</span>
                    </Link>

                    <AnimatePresence>
                        {isScrolled && (
                            <motion.div
                                initial={{ opacity: 0, width: 0 }}
                                animate={{ opacity: 1, width: 'auto' }}
                                exit={{ opacity: 0, width: 0 }}
                                className="hidden flex-1 px-4 md:block"
                            >
                                <div className="relative mx-auto max-w-sm">
                                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="Cari produk..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full rounded-full border-none bg-slate-100 py-1.5 pl-9 pr-4 text-xs font-medium outline-none focus:ring-2 focus:ring-[#2563eb]/20"
                                    />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <Link href="/ekrafstore/cart" className="group flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 font-bold tracking-tight text-[#2563eb] transition-all hover:bg-[#2563eb] hover:text-white">
                        <ShoppingCart className="size-4 transition-transform group-hover:-rotate-12 shrink-0" />
                        <span className={`text-xs ${isScrolled ? 'hidden sm:inline' : 'inline'}`}>Keranjang</span>
                        <span className="flex size-4 items-center justify-center rounded-full bg-[#2563eb] text-[9px] text-white group-hover:bg-white group-hover:text-[#2563eb]">0</span>
                    </Link>
                </motion.nav>
            </motion.header>

            <div className="relative z-10 mx-auto max-w-7xl px-4 pb-24 pt-32 sm:px-6 lg:px-10">
                <motion.div
                    initial="hidden"
                    animate="show"
                    variants={container}
                    className="mb-10 overflow-hidden rounded-3xl bg-white p-6 shadow-sm border border-slate-100 sm:p-10 relative"
                >
                    <div className="absolute right-0 top-0 -mr-20 -mt-20 size-72 rounded-full bg-gradient-to-br from-blue-100 to-transparent blur-3xl" />

                    <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
                        <div className="max-w-xl">
                            <motion.div variants={itemVariant} className="mb-4 flex items-center gap-2">
                                <span className="flex items-center gap-1.5 rounded-full bg-red-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-red-600">
                                    <TrendingUp className="size-3" /> E-Commerce Official
                                </span>
                            </motion.div>
                            <motion.h1 variants={itemVariant} className="text-3xl font-black tracking-tight text-slate-900 sm:text-5xl lg:leading-[1.1]">
                                Kebutuhan Digital & <span className="text-[#2563eb]">Hardware Mahasiswa.</span>
                            </motion.h1>
                            <motion.p variants={itemVariant} className="mt-4 text-sm leading-relaxed text-slate-500 sm:text-base">
                                Temukan lisensi aplikasi premium dengan harga terjangkau, layanan servis perangkat cerdas, hingga riset teknologi bersama HIMATIFA.
                            </motion.p>
                        </div>

                        <motion.div variants={itemVariant} className="grid grid-cols-2 gap-3 sm:grid-cols-1 md:w-64 shrink-0">
                            <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-3">
                                <div className="grid size-10 shrink-0 place-items-center rounded-full bg-blue-100 text-blue-600"><ShieldCheck className="size-5" /></div>
                                <div><p className="text-xs font-bold text-slate-700">100% Aman</p><p className="text-[10px] text-slate-500">Garansi Penuh</p></div>
                            </div>
                            <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-3">
                                <div className="grid size-10 shrink-0 place-items-center rounded-full bg-green-100 text-green-600"><Clock className="size-5" /></div>
                                <div><p className="text-xs font-bold text-slate-700">Fast Respon</p><p className="text-[10px] text-slate-500">Proses Cepat</p></div>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>

                <div className="flex flex-col gap-8 lg:flex-row">

                    <div className="flex-1">
                        <div className="sticky top-20 z-30 -mx-4 mb-6 bg-[#f8fafc]/90 px-4 py-3 backdrop-blur-md sm:static sm:mx-0 sm:bg-transparent sm:px-0 sm:py-0 sm:backdrop-blur-none">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <div className="relative w-full sm:max-w-xs">
                                    <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="Cari aplikasi atau varian..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm font-medium outline-none transition focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20"
                                    />
                                </div>

                                <div className="flex w-full overflow-x-auto pb-1 scrollbar-hide sm:w-auto sm:pb-0">
                                    <div className="flex gap-2">
                                        {['Semua', 'AI Tools', 'Streaming', 'Creative'].map((tag) => (
                                            <button
                                                key={tag}
                                                onClick={() => setSelectedTag(tag)}
                                                className={`whitespace-nowrap rounded-lg px-4 py-2 text-xs font-bold transition-all ${
                                                    selectedTag === tag
                                                        ? 'bg-[#2563eb] text-white shadow-md shadow-blue-500/20'
                                                        : 'bg-white text-slate-600 border border-slate-200 hover:border-[#2563eb] hover:text-[#2563eb]'
                                                }`}
                                            >
                                                {tag}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <motion.div
                            variants={container}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true, margin: "-50px" }}
                            className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
                        >
                            {filteredProducts.map((product) => (
                                <motion.div
                                    key={product.category}
                                    variants={itemVariant}
                                    className="group flex flex-col overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-sm transition-all duration-300 hover:border-[#2563eb]/30 hover:shadow-xl hover:shadow-[#2563eb]/5"
                                >
                                    <div className="flex items-start gap-4 p-5 pb-3">
                                        <div className="grid size-12 shrink-0 place-items-center rounded-xl bg-slate-50 border border-slate-100">
                                            {product.icon}
                                        </div>
                                        <div>
                                            <h3 className="font-extrabold text-slate-800 line-clamp-1">{product.category}</h3>
                                            <span className="mt-1 inline-block rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-slate-500">
                                                {product.tag}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="h-px w-full bg-slate-100" />

                                    <div className="flex flex-1 flex-col gap-2 p-4">
                                        {product.variants.map((variant) => (
                                            <div
                                                key={variant.name}
                                                className="flex items-center justify-between rounded-xl border border-slate-100 bg-white p-3 transition-colors hover:border-blue-100 hover:bg-blue-50/50"
                                            >
                                                <div className="pr-3 flex-1">
                                                    <div className="flex items-center gap-1.5">
                                                        <p className="text-xs font-bold text-slate-700 line-clamp-1">{variant.name}</p>
                                                        {variant.isPopular && (
                                                            <Star className="size-3 fill-orange-400 text-orange-400 shrink-0" />
                                                        )}
                                                    </div>
                                                    <p className="mt-1 text-xs font-black text-[#2563eb]">{variant.priceLabel}</p>
                                                </div>
                                                <button
                                                    onClick={() => setSelectedItem({ category: product.category, variant })}
                                                    className="grid size-8 shrink-0 place-items-center rounded-lg bg-slate-100 text-slate-600 transition-all hover:bg-[#2563eb] hover:text-white active:scale-95"
                                                    title="Tambah ke Keranjang"
                                                >
                                                    <ShoppingCart className="size-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>

                        {filteredProducts.length === 0 && (
                            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white py-20 px-4 text-center">
                                <div className="mb-4 grid size-12 place-items-center rounded-full bg-slate-100"><Search className="size-5 text-slate-400" /></div>
                                <h3 className="text-lg font-bold text-slate-800">Produk Tidak Ditemukan</h3>
                                <p className="mt-1 text-sm text-slate-500">Coba gunakan kata kunci atau kategori lain.</p>
                            </div>
                        )}
                    </div>
                </div>

                <section className="mt-16 pt-16 border-t border-slate-200/60">
                    <div className="mb-8 flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-black tracking-tight text-slate-900">Tech Clinic <span className="text-[#2563eb]">& Services</span></h2>
                            <p className="mt-1 text-sm text-slate-500">Layanan perbaikan hardware dan pembuatan software.</p>
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {techServices.map((svc) => (
                            <div
                                key={svc.id}
                                className="group relative flex flex-col overflow-hidden rounded-2xl bg-white border border-slate-200 p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-[#2563eb]/30 hover:shadow-lg"
                            >
                                <div className="mb-4 grid size-12 place-items-center rounded-xl bg-blue-50 text-[#2563eb] transition-transform group-hover:scale-110">
                                    {svc.icon}
                                </div>
                                <h3 className="mb-2 text-sm font-extrabold text-slate-800">{svc.title}</h3>
                                <p className="mb-4 flex-1 text-xs leading-relaxed text-slate-500 line-clamp-3">{svc.desc}</p>

                                <div className="mb-5 flex flex-wrap gap-1.5">
                                    {svc.stack.slice(0, 3).map((tech) => (
                                        <span key={tech} className="rounded bg-slate-100 px-1.5 py-0.5 text-[9px] font-semibold text-slate-600">
                                            {tech}
                                        </span>
                                    ))}
                                    {svc.stack.length > 3 && (
                                        <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[9px] font-semibold text-slate-600">+{svc.stack.length - 3}</span>
                                    )}
                                </div>

                                <a
                                    href="https://wa.me/6287762728979?text=Halo%20Admin,%20saya%20ingin%20konsultasi%20mengenai%20layanan%20Tech%20Clinic%20HIMATIFA."
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-50 py-2.5 text-xs font-bold text-slate-700 transition-colors group-hover:bg-[#2563eb] group-hover:text-white"
                                >
                                    Konsultasi <MessageCircle className="size-3.5" />
                                </a>
                            </div>
                        ))}
                    </div>
                </section>

                <footer className="mt-20 flex flex-col items-center justify-between gap-3 border-t border-slate-200 pb-4 pt-8 sm:flex-row">
                    <p className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
                        <Copyright className="size-3.5" /> 2026 HIMATIFA UMSURA
                    </p>
                    <p className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
                        Created by MEDKOMINFO
                    </p>
                </footer>
            </div>

            <AnimatePresence>
                {selectedItem && (
                    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedItem(null)}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, y: "100%" }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="relative w-full max-w-md overflow-hidden rounded-t-[2rem] sm:rounded-3xl bg-white p-6 pb-10 sm:pb-6 shadow-2xl z-10"
                        >
                            <button
                                onClick={() => setSelectedItem(null)}
                                className="absolute right-4 top-4 grid size-8 place-items-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
                            >
                                <X className="size-4" />
                            </button>

                            <div className="flex flex-col items-center text-center mt-2">
                                <div className="mb-4 grid size-16 place-items-center rounded-full bg-green-100 text-green-600">
                                    <CheckCircle2 className="size-8" />
                                </div>

                                <h3 className="text-xl font-black text-slate-900">Dimasukkan ke Keranjang</h3>

                                <div className="mt-4 w-full rounded-2xl border border-slate-100 bg-slate-50 p-4 text-left flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{selectedItem.category}</p>
                                        <p className="font-bold text-slate-800 line-clamp-1">{selectedItem.variant.name}</p>
                                    </div>
                                    <p className="font-black text-[#2563eb]">{selectedItem.variant.priceLabel}</p>
                                </div>

                                <div className="mt-6 flex w-full flex-col gap-3">
                                    <Link
                                        href="/ekrafstore/cart"
                                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#2563eb] py-3.5 text-sm font-bold text-white transition-all hover:bg-blue-700 active:scale-95"
                                    >
                                        Lihat Keranjang <ArrowRight className="size-4" />
                                    </Link>
                                    <button
                                        onClick={() => setSelectedItem(null)}
                                        className="w-full rounded-xl border border-slate-200 bg-white py-3.5 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-50 hover:text-[#2563eb]"
                                    >
                                        Lanjut Belanja
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </main>
    )
}