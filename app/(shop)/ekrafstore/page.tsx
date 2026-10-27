'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
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
    Star,
    X
} from 'lucide-react'
import {
    digitalProducts,
    techServices,
    storeContainer,
    storeItemVariant,
    ProductVariant
} from './data'

const productIconMap: Record<string, React.ElementType> = {
    Bot: Bot,
    Sparkles: Sparkles,
    Film: Film,
    Tv: Tv,
    Palette: Palette,
    Scissors: Scissors,
    ImageIcon: ImageIcon,
    BookOpen: BookOpen,
}

const techIconMap: Record<string, React.ElementType> = {
    MonitorSmartphone: MonitorSmartphone,
    Cpu: Cpu,
    Server: Server,
    Wrench: Wrench,
}

export default function EkrafStorePage() {
    const [isScrolled, setIsScrolled] = useState(false)
    const [selectedItem, setSelectedItem] = useState<{ category: string; variant: ProductVariant } | null>(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedTag, setSelectedTag] = useState<string>('Semua')
    const [cartCount, setCartCount] = useState(0)

    const updateCartCount = () => {
        const savedCart = localStorage.getItem('himatifa_cart')
        if (savedCart) {
            try {
                const parsed = JSON.parse(savedCart)
                const total = parsed.reduce((sum: number, item: { qty: number }) => sum + item.qty, 0)
                setCartCount(total)
            } catch {
                setCartCount(0)
            }
        } else {
            setCartCount(0)
        }
    }

    useEffect(() => {
        updateCartCount()
        const handleScroll = () => setIsScrolled(window.scrollY > 20)
        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const filteredProducts = useMemo(() => {
        const query = searchQuery.trim().toLowerCase()
        return digitalProducts.filter((product) => {
            const matchesSearch =
                query === '' ||
                product.category.toLowerCase().includes(query) ||
                product.variants.some((v) => v.name.toLowerCase().includes(query))
            const matchesTag = selectedTag === 'Semua' || product.tag === selectedTag
            return matchesSearch && matchesTag
        })
    }, [searchQuery, selectedTag])

    const handleAddToCart = (category: string, variant: ProductVariant) => {
        const savedCart = localStorage.getItem('himatifa_cart')
        const currentCart = savedCart ? JSON.parse(savedCart) : []

        const itemId = `${category}-${variant.name}`
        const existingIndex = currentCart.findIndex((item: { id: string }) => item.id === itemId)

        if (existingIndex > -1) {
            currentCart[existingIndex].qty += 1
        } else {
            currentCart.push({
                id: itemId,
                category,
                name: variant.name,
                price: variant.price,
                priceLabel: variant.priceLabel,
                qty: 1,
                selected: true
            })
        }

        localStorage.setItem('himatifa_cart', JSON.stringify(currentCart))
        updateCartCount()
        setSelectedItem({ category, variant })
    }

    return (
        <main className="relative min-h-screen bg-slate-50 text-slate-800 selection:bg-blue-100">
            {/* Header Navigation */}
            <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4 sm:px-6 lg:px-8 pointer-events-none">
                <motion.nav
                    animate={{
                        maxWidth: isScrolled ? '768px' : '1280px',
                        backgroundColor: isScrolled ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.85)',
                    }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                    className={`pointer-events-auto flex w-full items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 shadow-sm backdrop-blur-md transition-shadow ${
                        isScrolled ? 'shadow-md' : ''
                    }`}
                >
                    <Link
                        href="/"
                        className="group flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs sm:text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 hover:text-blue-600"
                    >
                        <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
                        <span>Kembali</span>
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
                                    <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="Cari produk digital..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-1.5 pl-9 pr-4 text-xs font-medium outline-none transition focus:border-blue-600 focus:bg-white"
                                    />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <Link
                        href="/ekrafstore/cart"
                        className="group flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition-all hover:bg-blue-500 active:scale-[0.98]"
                    >
                        <ShoppingCart className="size-4" />
                        <span className="hidden sm:inline">Keranjang</span>
                        <span className="flex size-4 items-center justify-center rounded-full bg-white text-[10px] font-bold text-blue-600">
                            {cartCount}
                        </span>
                    </Link>
                </motion.nav>
            </header>

            <div className="relative z-10 mx-auto max-w-7xl px-4 pb-20 pt-28 sm:px-6 lg:px-8">
                {/* Hero Banner */}
                <motion.div
                    initial="hidden"
                    animate="show"
                    variants={storeContainer}
                    className="mb-10 overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 sm:p-10 shadow-sm"
                >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
                        <div className="max-w-2xl">
                            <motion.div variants={storeItemVariant} className="flex items-center gap-3 mb-3">
                                <div className="h-[1px] w-6 sm:w-12 bg-blue-600/30" />
                                <span className="text-[10px] sm:text-xs font-bold tracking-[0.25em] uppercase text-blue-600">
                                    EKRAF STORE OFFICIAL
                                </span>
                            </motion.div>

                            <motion.h1
                                variants={storeItemVariant}
                                className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight"
                            >
                                Lisensi Digital & <span className="text-blue-600">Layanan Hardware</span>
                            </motion.h1>

                            <motion.p
                                variants={storeItemVariant}
                                className="mt-3 text-xs sm:text-sm leading-relaxed text-slate-600 font-normal"
                            >
                                Ekosistem penyediaan lisensi software premium terjangkau, jasa perbaikan perangkat cerdas, dan konsultasi pengembangan proyek teknologi mahasiswa S1 Informatika UMSURA.
                            </motion.p>
                        </div>

                        <motion.div
                            variants={storeItemVariant}
                            className="grid grid-cols-2 gap-3 sm:flex lg:flex-col shrink-0"
                        >
                            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/80 p-3.5">
                                <div className="grid size-10 shrink-0 place-items-center rounded-lg border border-blue-100 bg-blue-50 text-blue-600">
                                    <ShieldCheck className="size-5" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-900">100% Bergaransi</p>
                                    <p className="text-[10px] text-slate-500 font-normal">Aman & Terpercaya</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/80 p-3.5">
                                <div className="grid size-10 shrink-0 place-items-center rounded-lg border border-blue-100 bg-blue-50 text-blue-600">
                                    <Clock className="size-5" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-900">Proses Cepat</p>
                                    <p className="text-[10px] text-slate-500 font-normal">Respon Admin Instant</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Filter & Search Bar */}
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="relative w-full sm:max-w-xs">
                        <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Cari produk atau varian..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-xs sm:text-sm font-medium outline-none transition focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                        />
                    </div>

                    <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-hide">
                        {['Semua', 'AI Tools', 'Streaming', 'Creative'].map((tag) => (
                            <button
                                key={tag}
                                onClick={() => setSelectedTag(tag)}
                                className={`shrink-0 rounded-xl px-4 py-2 text-xs font-semibold transition-all duration-200 ${
                                    selectedTag === tag
                                        ? 'bg-blue-600 text-white shadow-sm'
                                        : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
                                }`}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Products Grid (Diperbaiki dengan key unik agar animasi Framer Motion dipicu ulang) */}
                <motion.div
                    key={`${selectedTag}-${searchQuery}`}
                    variants={storeContainer}
                    initial="hidden"
                    animate="show"
                    className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                >
                    {filteredProducts.map((product) => {
                        const IconComponent = productIconMap[product.iconName] || Bot

                        return (
                            <motion.div
                                key={product.category}
                                variants={storeItemVariant}
                                className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:border-blue-300 hover:shadow-md"
                            >
                                <div className="flex items-center gap-3.5 p-5 pb-4 border-b border-slate-100">
                                    <div className="grid size-11 shrink-0 place-items-center rounded-xl border border-blue-100 bg-blue-50 text-blue-600">
                                        <IconComponent className="size-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-bold text-slate-900 line-clamp-1">
                                            {product.category}
                                        </h3>
                                        <span className="text-[10px] font-semibold uppercase tracking-wider text-blue-600">
                                            {product.tag}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex flex-1 flex-col gap-2 p-4">
                                    {product.variants.map((variant) => (
                                        <div
                                            key={variant.name}
                                            className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/70 p-3 transition-colors hover:border-blue-200 hover:bg-blue-50/40"
                                        >
                                            <div className="pr-2 flex-1 min-w-0">
                                                <div className="flex items-center gap-1.5">
                                                    <p className="text-xs font-semibold text-slate-800 truncate">
                                                        {variant.name}
                                                    </p>
                                                    {variant.isPopular && (
                                                        <Star className="size-3 fill-amber-400 text-amber-400 shrink-0" />
                                                    )}
                                                </div>
                                                <p className="mt-0.5 text-xs font-bold text-blue-600">
                                                    {variant.priceLabel}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => handleAddToCart(product.category, variant)}
                                                className="grid size-8 shrink-0 place-items-center rounded-lg bg-white border border-slate-200 text-slate-700 transition-all hover:bg-blue-600 hover:border-blue-600 hover:text-white active:scale-95"
                                                title="Tambah ke Keranjang"
                                            >
                                                <ShoppingCart className="size-3.5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )
                    })}
                </motion.div>

                {filteredProducts.length === 0 && (
                    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white py-16 px-4 text-center">
                        <div className="mb-3 grid size-12 place-items-center rounded-xl bg-slate-100 text-slate-400">
                            <Search className="size-6" />
                        </div>
                        <h3 className="text-base font-bold text-slate-900">Produk Tidak Ditemukan</h3>
                        <p className="mt-1 text-xs text-slate-500 font-normal">
                            Coba gunakan kata kunci lain atau pilih filter kategori yang berbeda.
                        </p>
                    </div>
                )}

                {/* Tech Clinic & Services Section */}
                <section className="mt-20 pt-16 border-t border-slate-200">
                    <div className="mb-10 max-w-3xl">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="h-[1px] w-6 sm:w-12 bg-blue-600/30" />
                            <span className="text-[10px] sm:text-xs font-bold tracking-[0.25em] uppercase text-blue-600">
                                Layanan Teknis
                            </span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
                            Tech Clinic <span className="text-blue-600">& Software Services</span>
                        </h2>
                        <p className="mt-3 text-xs sm:text-sm leading-relaxed text-slate-600 font-normal">
                            Solusi perbaikan hardware, instalasi sistem, hingga pengembangan proyek perangkat lunak profesional.
                        </p>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {techServices.map((svc) => {
                            const IconComponent = techIconMap[svc.iconName] || Wrench

                            return (
                                <div
                                    key={svc.id}
                                    className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:border-blue-300 hover:shadow-md"
                                >
                                    <div className="mb-4 grid size-11 place-items-center rounded-xl border border-blue-100 bg-blue-50 text-blue-600">
                                        <IconComponent className="size-5" />
                                    </div>
                                    <h3 className="text-base font-bold text-slate-900 mb-2">
                                        {svc.title}
                                    </h3>
                                    <p className="flex-1 text-xs leading-relaxed text-slate-600 font-normal mb-4">
                                        {svc.desc}
                                    </p>

                                    <div className="mb-5 flex flex-wrap gap-1.5">
                                        {svc.stack.slice(0, 3).map((tech) => (
                                            <span
                                                key={tech}
                                                className="rounded-md bg-slate-100 border border-slate-200/80 px-2 py-0.5 text-[10px] font-semibold text-slate-600"
                                            >
                                                {tech}
                                            </span>
                                        ))}
                                        {svc.stack.length > 3 && (
                                            <span className="rounded-md bg-slate-100 border border-slate-200/80 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                                                +{svc.stack.length - 3}
                                            </span>
                                        )}
                                    </div>

                                    <a
                                        href="https://wa.me/6287762728979?text=Halo%20Admin,%20saya%20ingin%20konsultasi%20mengenai%20layanan%20Tech%20Clinic%20HIMATIFA."
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white transition-all hover:bg-blue-500 active:scale-[0.98]"
                                    >
                                        <span>Konsultasi Services</span>
                                        <MessageCircle className="size-3.5" />
                                    </a>
                                </div>
                            )
                        })}
                    </div>
                </section>

                {/* Footer Bar */}
                <footer className="mt-20 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-200 pt-8 text-xs text-slate-500 font-medium">
                    <p className="flex items-center gap-1.5">
                        <Copyright className="size-3.5 shrink-0" />
                        <span>2026 HIMATIFA UMSURA. Hak Cipta Dilindungi.</span>
                    </p>
                    <p className="uppercase tracking-wider font-semibold text-[10px] text-slate-400">
                        Dikembangkan oleh Departemen Ekraf & Medkominfo
                    </p>
                </footer>
            </div>

            {/* Modal Cart Notification */}
            <AnimatePresence>
                {selectedItem && (
                    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedItem(null)}
                            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 16 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 16 }}
                            transition={{ duration: 0.2, ease: 'easeOut' }}
                            className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl bg-white p-6 shadow-2xl"
                        >
                            <button
                                onClick={() => setSelectedItem(null)}
                                className="absolute right-4 top-4 flex size-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
                            >
                                <X className="size-4" />
                            </button>

                            <div className="flex flex-col items-center text-center">
                                <div className="mb-3 grid size-12 place-items-center rounded-xl bg-blue-50 text-blue-600">
                                    <CheckCircle2 className="size-6" />
                                </div>

                                <h3 className="text-lg font-bold text-slate-900">Ditambahkan ke Keranjang</h3>

                                <div className="mt-4 w-full rounded-xl border border-slate-200 bg-slate-50 p-4 text-left flex items-center justify-between">
                                    <div className="pr-3 min-w-0">
                                        <p className="text-[10px] font-semibold uppercase tracking-wider text-blue-600">
                                            {selectedItem.category}
                                        </p>
                                        <p className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                                            {selectedItem.variant.name}
                                        </p>
                                    </div>
                                    <p className="text-sm font-extrabold text-blue-600 shrink-0">
                                        {selectedItem.variant.priceLabel}
                                    </p>
                                </div>

                                <div className="mt-6 flex w-full flex-col gap-2.5">
                                    <Link
                                        href="/ekrafstore/cart"
                                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-xs sm:text-sm font-semibold text-white transition-all hover:bg-blue-500 active:scale-[0.98]"
                                    >
                                        <span>Lihat Keranjang</span>
                                        <ArrowRight className="size-4" />
                                    </Link>
                                    <button
                                        onClick={() => setSelectedItem(null)}
                                        className="w-full rounded-xl border border-slate-200 bg-white py-3 text-xs sm:text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
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