'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { createBrowserClient } from '@supabase/ssr'
import {
    ArrowLeft,
    ArrowRight,
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
    X,
    Send,
    Headphones,
    Check,
    ShoppingBag,
    Shirt,
    Zap,
    ExternalLink,
    HelpCircle,
    Minus,
    Loader2
} from 'lucide-react'
import {
    digitalProducts,
    techServices,
    storeContainer,
    storeItemVariant,
    ProductVariant
} from './data'

interface DbEkrafProduct {
    id: string
    sku: string
    name: string
    category: 'AI & Produktivitas' | 'Streaming & Hiburan' | 'Desain & Editing' | 'Merchandise'
    variant_info: string | null
    stock: number
    price: number
    sales_count: number
}

interface GroupedProductCard {
    groupKey: string
    title: string
    tag: string
    iconName: string
    variants: Array<ProductVariant & { dbProductId?: string; stock: number }>
}

const productIconMap: Record<string, React.ElementType> = {
    Bot,
    Sparkles,
    Film,
    Tv,
    Palette,
    Scissors,
    ImageIcon,
    BookOpen,
    ShoppingBag,
    Shirt
}

const techIconMap: Record<string, React.ElementType> = {
    MonitorSmartphone,
    Cpu,
    Server,
    Wrench
}

const csFaqPresets = [
    {
        q: 'Berapa lama aktivasi akun premium?',
        a: 'Aktivasi rata-rata hanya 5-15 menit setelah pembayaran terverifikasi kak! Akun langsung dikirimkan ke WhatsApp atau Email Anda.'
    },
    {
        q: 'Bagaimana sistem garansi akun?',
        a: 'Semua produk bergaransi penuh 100%! Jika terjadi kendala login sebelum masa aktif berakhir, kami siap bantu reset atau ganti akun baru secara gratis.'
    },
    {
        q: 'Metode pembayaran apa saja yang didukung?',
        a: 'Mendukung SeaBank (087762728979), DANA (087762728979), QRIS instan, serta Transfer Bank dengan batas bayar 24 jam.'
    },
    {
        q: 'Kapan PDH & Lanyard siap diambil?',
        a: 'Untuk Pre-Order PDH estimasi produksi 2-3 minggu. Untuk Lanyard ready stock bisa langsung diambil di Sekretariat HIMATIFA Gedung G Lt. 3.'
    }
]

const resolveBrandAndIcon = (name: string, category: string): { brandTitle: string; iconName: string } => {
    const lower = name.toLowerCase()
    if (lower.includes('chatgpt')) return { brandTitle: 'ChatGPT Plus / Go', iconName: 'Bot' }
    if (lower.includes('gemini')) return { brandTitle: 'Google Gemini Plus', iconName: 'Sparkles' }
    if (lower.includes('netflix')) return { brandTitle: 'Netflix Premium', iconName: 'Film' }
    if (lower.includes('vidio')) return { brandTitle: 'Vidio Platinum', iconName: 'Tv' }
    if (lower.includes('canva')) return { brandTitle: 'Canva Pro', iconName: 'Palette' }
    if (lower.includes('capcut')) return { brandTitle: 'CapCut Pro', iconName: 'Scissors' }
    if (lower.includes('lightroom')) return { brandTitle: 'Adobe Lightroom', iconName: 'ImageIcon' }
    if (lower.includes('wattpad')) return { brandTitle: 'Wattpad Premium+', iconName: 'BookOpen' }
    if (category === 'Merchandise') return { brandTitle: 'Merchandise HIMATIFA', iconName: 'Shirt' }
    return { brandTitle: name.split('-')[0].trim(), iconName: 'ShoppingBag' }
}

export default function EkrafStoreClient() {
    const [isScrolled, setIsScrolled] = useState(false)
    const [selectedItem, setSelectedItem] = useState<{ category: string; variantName: string } | null>(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedTag, setSelectedTag] = useState<string>('Semua')
    const [cartCount, setCartCount] = useState(0)

    const [dbProducts, setDbProducts] = useState<DbEkrafProduct[]>([])
    const [isLoadingCatalog, setIsLoadingCatalog] = useState(true)

    const [isCsOpen, setIsCsOpen] = useState(false)
    const [chatMessages, setChatMessages] = useState<Array<{ sender: 'cs' | 'user'; text: string; time: string }>>([
        {
            sender: 'cs',
            text: 'Halo Mahasiswa Umsurabaya! 👋 Ada yang bisa kami bantu seputar aplikasi premium (ChatGPT, Gemini, Netflix, Canva), merchandise PDH, atau konfirmasi pembayaran?',
            time: 'Online'
        }
    ])
    const [inputMessage, setInputMessage] = useState('')
    const [isCsTyping, setIsCsTyping] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const supabase = useMemo(
        () =>
            createBrowserClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
            ),
        []
    )

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

    const fetchCatalog = async () => {
        const { data, error } = await supabase
            .from('ekraf_products')
            .select('id, sku, name, category, variant_info, stock, price, sales_count')
            .order('sku', { ascending: true })

        if (!error && data) {
            setDbProducts(
                data.map((row) => ({
                    ...row,
                    stock: Number(row.stock),
                    price: Number(row.price),
                    sales_count: Number(row.sales_count || 0)
                })) as DbEkrafProduct[]
            )
        }
        setIsLoadingCatalog(false)
    }

    useEffect(() => {
        updateCartCount()
        fetchCatalog()

        const channel = supabase
            .channel('public-ekraf-catalog')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'ekraf_products' },
                () => fetchCatalog()
            )
            .subscribe()

        const handleScroll = () => setIsScrolled(window.scrollY > 20)
        window.addEventListener('scroll', handleScroll, { passive: true })

        return () => {
            supabase.removeChannel(channel)
            window.removeEventListener('scroll', handleScroll)
        }
    }, [supabase])

    useEffect(() => {
        if (isCsOpen) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
        }
    }, [chatMessages, isCsOpen, isCsTyping])

    const catalogGroups: GroupedProductCard[] = useMemo(() => {
        if (dbProducts.length > 0) {
            const grouped = new Map<string, GroupedProductCard>()

            dbProducts.forEach((item) => {
                const { brandTitle, iconName } = resolveBrandAndIcon(item.name, item.category)
                const cleanVariantName = item.name.includes('-')
                    ? item.name.split('-').slice(1).join('-').trim()
                    : item.variant_info || item.name

                const variantEntry = {
                    dbProductId: item.id,
                    name: cleanVariantName,
                    price: item.price,
                    priceLabel: `Rp ${item.price.toLocaleString('id-ID')}`,
                    isPopular: item.sales_count >= 5 || item.name.toLowerCase().includes('1 bulan'),
                    stock: item.stock
                }

                const existing = grouped.get(brandTitle)
                if (existing) {
                    existing.variants.push(variantEntry)
                } else {
                    grouped.set(brandTitle, {
                        groupKey: brandTitle,
                        title: brandTitle,
                        tag: item.category,
                        iconName,
                        variants: [variantEntry]
                    })
                }
            })

            return Array.from(grouped.values())
        }

        return digitalProducts.map((p) => ({
            groupKey: p.category,
            title: p.category,
            tag: p.tag,
            iconName: p.iconName,
            variants: p.variants.map((v) => ({ ...v, stock: 50 }))
        }))
    }, [dbProducts])

    const filteredProducts = useMemo(() => {
        const query = searchQuery.trim().toLowerCase()
        return catalogGroups.filter((product) => {
            const matchesSearch =
                query === '' ||
                product.title.toLowerCase().includes(query) ||
                product.tag.toLowerCase().includes(query) ||
                product.variants.some((v) => v.name.toLowerCase().includes(query))
            const matchesTag = selectedTag === 'Semua' || product.tag === selectedTag
            return matchesSearch && matchesTag
        })
    }, [catalogGroups, searchQuery, selectedTag])

    const handleAddToCart = (
        brandTitle: string,
        variant: ProductVariant & { dbProductId?: string; stock: number }
    ) => {
        if (variant.stock <= 0) return

        const savedCart = localStorage.getItem('himatifa_cart')
        const currentCart = savedCart ? JSON.parse(savedCart) : []

        const itemId = variant.dbProductId || `${brandTitle}-${variant.name}`
        const fullDisplayName = `${brandTitle} - ${variant.name}`
        const existingIndex = currentCart.findIndex((item: { id: string }) => item.id === itemId)

        if (existingIndex > -1) {
            currentCart[existingIndex].qty = Math.min(variant.stock, currentCart[existingIndex].qty + 1)
        } else {
            currentCart.push({
                id: itemId,
                productId: variant.dbProductId || null,
                category: brandTitle,
                name: fullDisplayName,
                price: variant.price,
                priceLabel: variant.priceLabel,
                qty: 1,
                maxStock: variant.stock,
                selected: true
            })
        }

        localStorage.setItem('himatifa_cart', JSON.stringify(currentCart))
        updateCartCount()
        setSelectedItem({ category: brandTitle, variantName: variant.name })
        setTimeout(() => setSelectedItem(null), 2500)
    }

    const handleSendCsMessage = (userText: string) => {
        if (!userText.trim()) return

        const now = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
        setChatMessages((prev) => [...prev, { sender: 'user', text: userText, time: now }])
        setInputMessage('')
        setIsCsTyping(true)

        const matchedFaq = csFaqPresets.find(
            (f) =>
                userText.toLowerCase().includes(f.q.toLowerCase().split(' ')[0]) ||
                f.q.toLowerCase().includes(userText.toLowerCase())
        )

        setTimeout(() => {
            setIsCsTyping(false)
            const replyText = matchedFaq
                ? matchedFaq.a
                : 'Terima kasih pertanyaannya kak! Pesan ini telah diteruskan ke Admin Penjualan Ekraf HIMATIFA. Anda juga bisa langsung chat kami di WhatsApp (0877-6272-8979) untuk respons lebih cepat.'

            setChatMessages((prev) => [
                ...prev,
                {
                    sender: 'cs',
                    text: replyText,
                    time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
                }
            ])
        }, 650)
    }

    const categories = ['Semua', 'AI & Produktivitas', 'Streaming & Hiburan', 'Desain & Editing', 'Merchandise']

    return (
        <main className="relative min-h-screen bg-slate-50 text-slate-800 selection:bg-blue-100 overflow-x-hidden">
            <div className="absolute inset-0 -z-10 feed-grid-squares opacity-35 pointer-events-none" />
            <div className="absolute top-20 left-1/4 -z-10 size-[320px] sm:size-[420px] rounded-full bg-blue-400/10 blur-[130px] pointer-events-none" />
            <div className="absolute top-96 right-10 -z-10 size-[280px] sm:size-[380px] rounded-full bg-indigo-400/10 blur-[140px] pointer-events-none" />

            <header className="fixed inset-x-0 top-0 z-40 flex justify-center px-3 pt-3 sm:px-6 lg:px-8 pointer-events-none">
                <motion.nav
                    animate={{
                        maxWidth: isScrolled ? '768px' : '1280px',
                        backgroundColor: isScrolled ? 'rgba(255, 255, 255, 0.96)' : 'rgba(255, 255, 255, 0.90)'
                    }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                    className={`pointer-events-auto flex w-full items-center justify-between rounded-2xl border border-slate-200/90 px-3 py-2 sm:px-4 sm:py-2.5 shadow-xs backdrop-blur-md transition-shadow ${
                        isScrolled ? 'shadow-md' : ''
                    }`}
                >
                    <Link
                        href="/"
                        className="group flex items-center gap-1.5 sm:gap-2 rounded-xl px-2.5 py-1.5 text-xs sm:text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 hover:text-blue-600"
                    >
                        <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
                        <span>Beranda</span>
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
                                        placeholder="Cari ChatGPT, Netflix, Canva..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-1.5 pl-9 pr-4 text-xs font-medium outline-none transition focus:border-blue-600 focus:bg-white"
                                    />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="flex items-center gap-1.5 sm:gap-2">
                        <button
                            onClick={() => setIsCsOpen(true)}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 sm:px-3 sm:py-2 text-xs font-semibold text-slate-700 shadow-2xs transition hover:border-blue-300 hover:text-blue-600 active:scale-95 cursor-pointer"
                        >
                            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="hidden sm:inline">CS Ekraf</span>
                            <Headphones className="size-3.5 sm:hidden" />
                        </button>

                        <Link
                            href="/ekrafstore/cart"
                            className="group flex items-center gap-1.5 sm:gap-2 rounded-xl bg-blue-600 px-3 py-1.5 sm:px-4 sm:py-2 text-xs font-semibold text-white shadow-xs transition-all hover:bg-blue-500 active:scale-[0.98]"
                        >
                            <ShoppingCart className="size-4" />
                            <span className="hidden sm:inline">Keranjang</span>
                            <span className="flex size-4.5 items-center justify-center rounded-full bg-white text-[10px] font-bold text-blue-600">
                                {cartCount}
                            </span>
                        </Link>
                    </div>
                </motion.nav>
            </header>

            <AnimatePresence>
                {selectedItem && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        className="fixed top-16 right-4 sm:top-20 sm:right-6 z-50 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-white p-3.5 sm:p-4 shadow-xl max-w-sm"
                    >
                        <div className="grid size-8 sm:size-9 place-items-center rounded-xl bg-emerald-50 text-emerald-600 shrink-0">
                            <Check className="size-4 sm:size-5" />
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-xs font-bold text-slate-900">Ditambahkan ke Keranjang!</p>
                            <p className="text-[11px] text-slate-500 truncate">
                                {selectedItem.category} &bull; {selectedItem.variantName}
                            </p>
                        </div>
                        <Link
                            href="/ekrafstore/cart"
                            className="rounded-xl bg-blue-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-500 transition shrink-0 ml-1"
                        >
                            Lihat
                        </Link>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="relative z-10 mx-auto max-w-7xl px-4 pb-24 pt-20 sm:px-6 lg:px-8 sm:pt-24">
                <motion.div
                    initial="hidden"
                    animate="show"
                    variants={storeContainer}
                    className="mb-8 overflow-hidden rounded-3xl border border-slate-200/90 bg-white/95 p-5 sm:p-8 lg:p-10 shadow-xs backdrop-blur-xs"
                >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 sm:gap-8">
                        <div className="max-w-2xl">
                            <motion.div variants={storeItemVariant} className="flex items-center gap-2 sm:gap-3 mb-2.5">
                                <div className="h-[1px] w-6 sm:w-10 bg-blue-600/40" />
                                <span className="text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase text-blue-600">
                                    HIMATIFA PREMIUM SERVICES &bull; EKRAF STORE
                                </span>
                            </motion.div>

                            <motion.h1
                                variants={storeItemVariant}
                                className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight"
                            >
                                Aplikasi Premium & <span className="text-blue-600">Merchandise Resmi</span>
                            </motion.h1>

                            <motion.p
                                variants={storeItemVariant}
                                className="mt-2.5 text-xs sm:text-sm leading-relaxed text-slate-600 font-normal"
                            >
                                Akses akun premium AI (ChatGPT, Gemini Plus), streaming hiburan (Netflix, Vidio, Wattpad), software kreatif (Canva Pro, Lightroom, CapCut Pro), hingga atribut resmi dengan harga mahasiswa dan <strong>100% bergaransi</strong>.
                            </motion.p>

                            <motion.div variants={storeItemVariant} className="mt-5 flex flex-wrap items-center gap-2.5 sm:gap-3">
                                <button
                                    onClick={() => setIsCsOpen(true)}
                                    className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-xs transition hover:bg-blue-500 active:scale-95 cursor-pointer"
                                >
                                    <Headphones className="size-4" />
                                    <span>Konsultasi CS Ekraf</span>
                                </button>
                                <a
                                    href="#layanan-jasa"
                                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-900 active:scale-95"
                                >
                                    <span>Jasa IT & Servis Laptop</span>
                                    <ArrowRight className="size-3.5" />
                                </a>
                            </motion.div>
                        </div>

                        <motion.div
                            variants={storeItemVariant}
                            className="grid grid-cols-2 gap-2.5 sm:gap-3 sm:flex lg:flex-col shrink-0"
                        >
                            <div className="flex items-center gap-2.5 sm:gap-3 rounded-2xl border border-slate-200/90 bg-slate-50/80 p-3 sm:p-3.5">
                                <div className="grid size-9 sm:size-10 shrink-0 place-items-center rounded-xl border border-blue-100 bg-blue-50 text-blue-600">
                                    <ShieldCheck className="size-4.5 sm:size-5" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-900">Garansi Penuh</p>
                                    <p className="text-[10px] text-slate-500 font-medium">Reset / Ganti Baru</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2.5 sm:gap-3 rounded-2xl border border-slate-200/90 bg-slate-50/80 p-3 sm:p-3.5">
                                <div className="grid size-9 sm:size-10 shrink-0 place-items-center rounded-xl border border-blue-100 bg-blue-50 text-blue-600">
                                    <Clock className="size-4.5 sm:size-5" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-900">Proses Kilat</p>
                                    <p className="text-[10px] text-slate-500 font-medium">Aktif 5 - 15 Menit</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>

                <div className="mb-6 flex flex-col gap-3.5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="relative w-full sm:max-w-xs">
                        <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Cari ChatGPT, Netflix, Canva..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-8 text-xs sm:text-sm font-medium outline-none transition focus:border-blue-600 focus:ring-1 focus:ring-blue-600 shadow-2xs"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            >
                                <X className="size-3.5" />
                            </button>
                        )}
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedTag(cat)}
                                className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition cursor-pointer whitespace-nowrap ${
                                    selectedTag === cat
                                        ? 'bg-blue-600 text-white shadow-xs'
                                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {isLoadingCatalog ? (
                    <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white py-16 text-slate-500">
                        <Loader2 className="size-7 animate-spin text-blue-600 mb-2" />
                        <p className="text-xs font-semibold">Memuat katalog HIMATIFA Premium Services...</p>
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-white/70 p-10 text-center">
                        <ShoppingBag className="size-10 text-slate-300 mx-auto mb-3" />
                        <h3 className="text-sm font-bold text-slate-800">Produk Tidak Ditemukan</h3>
                        <p className="mt-1 text-xs text-slate-500">
                            Tidak ada produk yang cocok dengan pencarian &quot;{searchQuery}&quot;.
                        </p>
                        <button
                            onClick={() => {
                                setSearchQuery('')
                                setSelectedTag('Semua')
                            }}
                            className="mt-4 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-blue-600 hover:bg-slate-50 transition"
                        >
                            Reset Filter
                        </button>
                    </div>
                ) : (
                    <motion.div
                        variants={storeContainer}
                        initial="hidden"
                        animate="show"
                        className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                    >
                        {filteredProducts.map((product) => {
                            const Icon = productIconMap[product.iconName] || Bot

                            return (
                                <motion.div
                                    key={product.groupKey}
                                    variants={storeItemVariant}
                                    className="group flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-xs transition-all duration-200 hover:border-blue-300 hover:shadow-md"
                                >
                                    <div>
                                        <div className="flex items-center justify-between mb-3.5">
                                            <div className="grid size-10 sm:size-11 place-items-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100/80 transition-transform group-hover:scale-105">
                                                <Icon className="size-5 sm:size-5.5" />
                                            </div>
                                            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                                                {product.tag}
                                            </span>
                                        </div>

                                        <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                            {product.title}
                                        </h3>
                                        <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                                            Tersedia {product.variants.length} opsi paket
                                        </p>

                                        <div className="mt-3.5 space-y-2">
                                            {product.variants.map((v) => {
                                                const isOutOfStock = v.stock <= 0
                                                return (
                                                    <div
                                                        key={v.dbProductId || v.name}
                                                        className={`flex items-center justify-between rounded-xl border p-2 sm:p-2.5 transition ${
                                                            isOutOfStock
                                                                ? 'border-slate-100 bg-slate-100/60 opacity-60'
                                                                : 'border-slate-100 bg-slate-50/60 hover:border-blue-200 hover:bg-blue-50/30'
                                                        }`}
                                                    >
                                                        <div className="overflow-hidden pr-2">
                                                            <div className="flex items-center gap-1.5">
                                                                <p className="text-xs font-semibold text-slate-800 truncate">
                                                                    {v.name}
                                                                </p>
                                                                {v.isPopular && !isOutOfStock && (
                                                                    <span className="shrink-0 rounded-md bg-amber-50 border border-amber-200 px-1.5 py-0.2 text-[9px] font-extrabold text-amber-700">
                                                                        Favorit
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div className="flex items-center gap-2 mt-0.5">
                                                                <p className="text-xs font-bold text-blue-600 font-mono">
                                                                    {v.priceLabel}
                                                                </p>
                                                                <span className="text-[10px] text-slate-400">
                                                                    {isOutOfStock ? '• Habis' : `• Sisa ${v.stock}`}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        <button
                                                            onClick={() => handleAddToCart(product.title, v)}
                                                            disabled={isOutOfStock}
                                                            title={isOutOfStock ? 'Slot Habis' : 'Tambahkan ke Keranjang'}
                                                            className="grid size-8 shrink-0 place-items-center rounded-lg bg-blue-600 text-white shadow-2xs transition hover:bg-blue-500 active:scale-95 disabled:bg-slate-300 cursor-pointer disabled:cursor-not-allowed"
                                                        >
                                                            <ShoppingCart className="size-3.5" />
                                                        </button>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>

                                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
                                        <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                                            <Check className="size-3" /> Bergaransi
                                        </span>
                                        <span>SeaBank & DANA Ready</span>
                                    </div>
                                </motion.div>
                            )
                        })}
                    </motion.div>
                )}

                <motion.section
                    id="layanan-jasa"
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4 }}
                    className="mt-14 sm:mt-16 rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-8 lg:p-10 shadow-xs"
                >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-slate-100">
                        <div>
                            <div className="flex items-center gap-2 text-blue-600 text-xs font-bold uppercase tracking-wider mb-1">
                                <Zap className="size-3.5" />
                                <span>Unit Riset & Layanan Teknis</span>
                            </div>
                            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                                Layanan Pengembangan IT & Servis Hardware
                            </h2>
                            <p className="mt-1 text-xs text-slate-500">
                                Dikerjakan langsung oleh mahasiswa berprestasi dan pengurus RnD HIMATIFA UMSURA.
                            </p>
                        </div>

                        <button
                            onClick={() => setIsCsOpen(true)}
                            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white hover:bg-slate-800 transition active:scale-95 cursor-pointer"
                        >
                            <span>Konsultasi Proyek</span>
                            <ArrowRight className="size-3.5" />
                        </button>
                    </div>

                    <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {techServices.map((srv) => {
                            const Icon = techIconMap[srv.iconName] || Wrench
                            return (
                                <div
                                    key={srv.id}
                                    className="flex flex-col justify-between rounded-2xl border border-slate-100 bg-slate-50/60 p-4 sm:p-5 transition hover:border-blue-200 hover:bg-blue-50/30"
                                >
                                    <div>
                                        <div className="grid size-10 place-items-center rounded-xl bg-white text-blue-600 border border-slate-200 mb-3">
                                            <Icon className="size-5" />
                                        </div>
                                        <h4 className="text-sm font-bold text-slate-900">{srv.title}</h4>
                                        <p className="mt-1.5 text-xs text-slate-500 leading-relaxed font-normal">
                                            {srv.desc}
                                        </p>
                                    </div>

                                    <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap gap-1">
                                        {srv.stack.map((st) => (
                                            <span
                                                key={st}
                                                className="rounded-md bg-white border border-slate-200 px-1.5 py-0.5 text-[10px] font-semibold text-slate-600"
                                            >
                                                {st}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </motion.section>

                <footer className="mt-14 sm:mt-16 flex flex-col items-center justify-between gap-3 border-t border-slate-200 pt-6 sm:flex-row text-xs text-slate-400 font-medium">
                    <p className="flex items-center gap-1.5">
                        <Copyright className="size-3.5" /> 2026 EKRAF STORE &bull; HIMATIFA UMSURA
                    </p>
                    <p>Departemen Ekonomi Kreatif & Kemitraan Usaha</p>
                </footer>
            </div>

            <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40">
                <button
                    onClick={() => setIsCsOpen(!isCsOpen)}
                    className="group flex items-center gap-2 rounded-full bg-blue-600 px-3.5 py-2.5 sm:px-4 sm:py-3 text-xs sm:text-sm font-bold text-white shadow-xl shadow-blue-600/30 transition-all hover:bg-blue-500 hover:scale-105 active:scale-95 cursor-pointer"
                    aria-label="Buka Chat Customer Service"
                >
                    <div className="relative">
                        <Headphones className="size-4.5" />
                        <span className="absolute -top-1 -right-1 size-2 rounded-full bg-emerald-400 ring-2 ring-blue-600 animate-pulse" />
                    </div>
                    <span>{isCsOpen ? 'Tutup Chat' : 'Chat CS'}</span>
                </button>
            </div>

            <AnimatePresence>
                {isCsOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 24, scale: 0.94 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 24, scale: 0.94 }}
                        transition={{ duration: 0.22, ease: 'easeOut' }}
                        className="fixed bottom-16 right-4 sm:bottom-20 sm:right-6 z-50 flex w-[calc(100vw-32px)] sm:w-[380px] md:w-[400px] h-[520px] max-h-[78vh] flex-col rounded-2xl border border-slate-200/90 bg-white shadow-2xl shadow-slate-900/25 overflow-hidden"
                    >
                        <div className="flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 text-white">
                            <div className="flex items-center gap-2.5">
                                <div className="relative">
                                    <div className="grid size-8 place-items-center rounded-lg bg-white/15 text-white font-extrabold border border-white/20 text-xs">
                                        CS
                                    </div>
                                    <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full bg-emerald-400 ring-2 ring-blue-600" />
                                </div>
                                <div>
                                    <h3 className="text-xs font-bold text-white leading-tight">CS Ekraf HIMATIFA</h3>
                                    <p className="text-[10px] text-blue-100 font-medium">Online &bull; WA: 0877-6272-8979</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => setIsCsOpen(false)}
                                    title="Sembunyikan Chat"
                                    className="rounded-lg p-1 text-white/80 hover:bg-white/10 hover:text-white transition cursor-pointer"
                                >
                                    <Minus className="size-4" />
                                </button>
                                <button
                                    onClick={() => setIsCsOpen(false)}
                                    title="Tutup Chat"
                                    className="rounded-lg p-1 text-white/80 hover:bg-white/10 hover:text-white transition cursor-pointer"
                                >
                                    <X className="size-4" />
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-3.5 space-y-3 bg-slate-50/70 text-xs scrollbar-thin">
                            {chatMessages.map((msg, idx) => (
                                <div
                                    key={idx}
                                    className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                                >
                                    <div
                                        className={`max-w-[85%] rounded-2xl p-2.5 sm:p-3 leading-relaxed shadow-2xs ${
                                            msg.sender === 'user'
                                                ? 'bg-blue-600 text-white rounded-br-xs'
                                                : 'bg-white border border-slate-200/90 text-slate-800 rounded-bl-xs'
                                        }`}
                                    >
                                        <p className="text-xs font-medium">{msg.text}</p>
                                    </div>
                                    <span className="mt-0.5 text-[9px] text-slate-400 px-1 font-mono">{msg.time}</span>
                                </div>
                            ))}

                            {isCsTyping && (
                                <div className="flex items-center gap-1.5 text-slate-400 text-xs italic">
                                    <span className="size-1.5 rounded-full bg-blue-600 animate-bounce" />
                                    <span>CS sedang mengetik balasan...</span>
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        <div className="border-t border-slate-100 bg-white p-2.5">
                            <p className="mb-1.5 text-[9px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                                <HelpCircle className="size-3 text-blue-600" /> Pertanyaan Cepat:
                            </p>
                            <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto scrollbar-none">
                                {csFaqPresets.map((faq, i) => (
                                    <button
                                        key={i}
                                        onClick={() => handleSendCsMessage(faq.q)}
                                        className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-medium text-slate-700 transition hover:border-blue-300 hover:bg-blue-50/60 hover:text-blue-700 cursor-pointer text-left"
                                    >
                                        {faq.q}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="border-t border-slate-100 bg-white p-3">
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault()
                                    handleSendCsMessage(inputMessage)
                                }}
                                className="flex items-center gap-1.5"
                            >
                                <input
                                    type="text"
                                    value={inputMessage}
                                    onChange={(e) => setInputMessage(e.target.value)}
                                    placeholder="Ketik pertanyaan Anda..."
                                    className="flex-1 rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-xs font-medium text-slate-900 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-1 focus:ring-blue-600"
                                />
                                <button
                                    type="submit"
                                    disabled={!inputMessage.trim()}
                                    className="grid size-8.5 shrink-0 place-items-center rounded-xl bg-blue-600 text-white shadow-2xs transition hover:bg-blue-500 disabled:opacity-40 cursor-pointer"
                                >
                                    <Send className="size-3.5" />
                                </button>
                            </form>

                            <div className="mt-2 flex items-center justify-between text-[10px] pt-1.5 border-t border-slate-100">
                                <span className="text-slate-400">Butuh respon kilat?</span>
                                <a
                                    href={`https://wa.me/6287762728979?text=${encodeURIComponent(
                                        inputMessage ||
                                        'Halo Admin CS Ekraf HIMATIFA, saya ingin bertanya seputar pemesanan di Ekraf Store.'
                                    )}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1 font-bold text-emerald-600 hover:text-emerald-700"
                                >
                                    <MessageCircle className="size-3" />
                                    <span>Lanjut ke WhatsApp</span>
                                    <ExternalLink className="size-2.5" />
                                </a>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    )
}
