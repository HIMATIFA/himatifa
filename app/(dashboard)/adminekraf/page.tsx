'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { createBrowserClient } from '@supabase/ssr'
import {
    Package,
    ShoppingBag,
    DollarSign,
    Plus,
    Search,
    Trash2,
    X,
    CheckCircle2,
    Clock,
    XCircle,
    Tag,
    Boxes,
    TrendingUp,
    Sparkles,
    ArrowUpRight,
    ChevronRight,
    Pencil,
    BarChart3,
    Download,
    Loader2,
    ShieldAlert,
    Calculator,
    Wallet
} from 'lucide-react'

export type EkrafCategory =
    | 'AI & Produktivitas'
    | 'Streaming & Hiburan'
    | 'Desain & Editing'
    | 'Merchandise'

export type OrderStatus = 'Diproses' | 'Selesai' | 'Batal'
export type PaymentMethod = 'SeaBank' | 'DANA' | 'Tunai / QRIS'

export interface EkrafProduct {
    id: string
    sku: string
    name: string
    category: EkrafCategory
    variant_info: string | null
    stock: number
    price: number
    cost_price: number
    sales_count: number
    created_at: string
}

export interface EkrafOrder {
    id: string
    order_code: string
    customer_name: string
    customer_contact: string | null
    payment_method: PaymentMethod
    product_id: string | null
    product_name: string
    qty: number
    unit_price: number
    total_price: number
    order_date: string
    status: OrderStatus
    created_at: string
}

const EKRAF_CATEGORIES: ('Semua' | EkrafCategory)[] = [
    'Semua',
    'AI & Produktivitas',
    'Streaming & Hiburan',
    'Desain & Editing',
    'Merchandise'
]

const formatRupiah = (val: number): string => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0
    }).format(val)
}

const formatTanggalID = (isoDate: string): string => {
    if (!isoDate) return '-'
    const d = new Date(`${isoDate}T00:00:00`)
    if (isNaN(d.getTime())) return isoDate
    return d.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    })
}

export default function AdminEkrafPage() {
    const router = useRouter()

    const [isCheckingAuth, setIsCheckingAuth] = useState(true)
    const [isAuthorized, setIsAuthorized] = useState(false)
    const [currentUserId, setCurrentUserId] = useState<string | null>(null)

    const [products, setProducts] = useState<EkrafProduct[]>([])
    const [orders, setOrders] = useState<EkrafOrder[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)

    const [activeTab, setActiveTab] = useState<'produk' | 'pesanan' | 'analitik'>('produk')
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCategory, setSelectedCategory] = useState<'Semua' | EkrafCategory>('Semua')
    const [orderStatusFilter, setOrderStatusFilter] = useState<'Semua' | OrderStatus>('Semua')

    const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null)
    const [isProductModalOpen, setIsProductModalOpen] = useState(false)
    const [editingProduct, setEditingProduct] = useState<EkrafProduct | null>(null)
    const [isOrderModalOpen, setIsOrderModalOpen] = useState(false)

    const [formProdName, setFormProdName] = useState('')
    const [formProdCategory, setFormProdCategory] = useState<EkrafCategory>('AI & Produktivitas')
    const [formProdVariant, setFormProdVariant] = useState('')
    const [formProdStock, setFormProdStock] = useState('')
    const [formProdPrice, setFormProdPrice] = useState('')
    const [formProdCostPrice, setFormProdCostPrice] = useState('')

    const [formCustName, setFormCustName] = useState('')
    const [formCustContact, setFormCustContact] = useState('')
    const [formPaymentMethod, setFormPaymentMethod] = useState<PaymentMethod>('DANA')
    const [formOrderProductId, setFormOrderProductId] = useState('')
    const [formOrderQty, setFormOrderQty] = useState('1')
    const [formOrderStatus, setFormOrderStatus] = useState<OrderStatus>('Selesai')

    const supabase = useMemo(
        () =>
            createBrowserClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
            ),
        []
    )

    const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
        setToast({ message, type })
        setTimeout(() => setToast(null), 3500)
    }

    useEffect(() => {
        const checkAccess = async () => {
            setIsCheckingAuth(true)
            const {
                data: { user }
            } = await supabase.auth.getUser()

            if (!user) {
                router.replace('/login')
                return
            }

            setCurrentUserId(user.id)

            const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', user.id)
                .single()

            const role = profile?.role || user.user_metadata?.role

            if (role !== 'adminekraf' && role !== 'admin') {
                setIsAuthorized(false)
                setIsCheckingAuth(false)
                return
            }

            setIsAuthorized(true)
            setIsCheckingAuth(false)
        }

        checkAccess()
    }, [supabase, router])

    const fetchEkrafData = async () => {
        const [prodRes, orderRes] = await Promise.all([
            supabase
                .from('ekraf_products')
                .select('*')
                .order('category', { ascending: true })
                .order('sku', { ascending: true }),
            supabase
                .from('ekraf_orders')
                .select('*')
                .order('order_date', { ascending: false })
                .order('created_at', { ascending: false })
        ])

        if (!prodRes.error && prodRes.data) {
            const mappedProds = prodRes.data.map((p) => ({
                ...p,
                stock: Number(p.stock),
                price: Number(p.price),
                cost_price: Number(p.cost_price || 0),
                sales_count: Number(p.sales_count || 0)
            })) as EkrafProduct[]
            setProducts(mappedProds)
            if (mappedProds.length > 0 && !formOrderProductId) {
                setFormOrderProductId(mappedProds[0].id)
            }
        }

        if (!orderRes.error && orderRes.data) {
            const mappedOrders = orderRes.data.map((o) => ({
                ...o,
                qty: Number(o.qty),
                unit_price: Number(o.unit_price),
                total_price: Number(o.total_price)
            })) as EkrafOrder[]
            setOrders(mappedOrders)
        }

        setIsLoading(false)
    }

    useEffect(() => {
        if (!isAuthorized) return

        fetchEkrafData()

        const channel = supabase
            .channel('adminekraf-realtime')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'ekraf_products' },
                () => fetchEkrafData()
            )
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'ekraf_orders' },
                () => fetchEkrafData()
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [isAuthorized, supabase])

    const analytics = useMemo(() => {
        const activeProds = products.length
        const lowStock = products.filter((p) => p.stock <= 10).length
        const completedOrders = orders.filter((o) => o.status === 'Selesai')
        const pendingOrders = orders.filter((o) => o.status === 'Diproses')

        const grossRevenue = completedOrders.reduce((sum, o) => sum + o.total_price, 0)
        const pendingRevenue = pendingOrders.reduce((sum, o) => sum + o.total_price, 0)

        const productCostMap = new Map(products.map((p) => [p.id, p.cost_price]))
        const totalCostOfGoods = completedOrders.reduce((sum, o) => {
            const unitCost = o.product_id ? productCostMap.get(o.product_id) || 0 : 0
            return sum + unitCost * o.qty
        }, 0)
        const netProfit = Math.max(0, grossRevenue - totalCostOfGoods)

        const totalItemsSold = completedOrders.reduce((sum, o) => sum + o.qty, 0)
        const averageOrderValue =
            completedOrders.length > 0 ? Math.round(grossRevenue / completedOrders.length) : 0
        const inventoryValuation = products.reduce((sum, p) => sum + p.stock * p.price, 0)

        // Grafik Pendapatan 7 Hari / Tanggal Transaksi Terakhir
        const dailyMap = new Map<string, { label: string; revenue: number; count: number }>()
        const sortedCompleted = [...completedOrders].sort((a, b) =>
            a.order_date.localeCompare(b.order_date)
        )

        sortedCompleted.forEach((order) => {
            const existing = dailyMap.get(order.order_date)
            const shortLabel = new Date(`${order.order_date}T00:00:00`).toLocaleDateString('id-ID', {
                day: '2-digit',
                month: 'short'
            })
            if (existing) {
                existing.revenue += order.total_price
                existing.count += order.qty
            } else {
                dailyMap.set(order.order_date, {
                    label: shortLabel,
                    revenue: order.total_price,
                    count: order.qty
                })
            }
        })

        const chartSeries = Array.from(dailyMap.values()).slice(-7)
        const maxChartRevenue = Math.max(...chartSeries.map((c) => c.revenue), 1)

        const categoryList: EkrafCategory[] = [
            'AI & Produktivitas',
            'Streaming & Hiburan',
            'Desain & Editing',
            'Merchandise'
        ]
        const categoryStats = categoryList.map((cat) => {
            const catProducts = products.filter((p) => p.category === cat)
            const catProductIds = new Set(catProducts.map((p) => p.id))
            const catRevenue = completedOrders
                .filter((o) => o.product_id && catProductIds.has(o.product_id))
                .reduce((sum, o) => sum + o.total_price, 0)
            const catUnits = completedOrders
                .filter((o) => o.product_id && catProductIds.has(o.product_id))
                .reduce((sum, o) => sum + o.qty, 0)

            return {
                category: cat,
                revenue: catRevenue,
                units: catUnits,
                percentage: grossRevenue > 0 ? Math.round((catRevenue / grossRevenue) * 100) : 0
            }
        })

        const seabankTotal = completedOrders
            .filter((o) => o.payment_method === 'SeaBank')
            .reduce((sum, o) => sum + o.total_price, 0)
        const danaTotal = completedOrders
            .filter((o) => o.payment_method === 'DANA')
            .reduce((sum, o) => sum + o.total_price, 0)

        return {
            activeProds,
            lowStock,
            totalOrdersCount: orders.length,
            completedOrdersCount: completedOrders.length,
            grossRevenue,
            pendingRevenue,
            netProfit,
            totalItemsSold,
            averageOrderValue,
            inventoryValuation,
            chartSeries,
            maxChartRevenue,
            categoryStats,
            seabankTotal,
            danaTotal
        }
    }, [products, orders])

    const openCreateProductModal = () => {
        setEditingProduct(null)
        setFormProdName('')
        setFormProdCategory('AI & Produktivitas')
        setFormProdVariant('Private — Bergaransi')
        setFormProdStock('50')
        setFormProdPrice('')
        setFormProdCostPrice('')
        setIsProductModalOpen(true)
    }

    const openEditProductModal = (prod: EkrafProduct) => {
        setEditingProduct(prod)
        setFormProdName(prod.name)
        setFormProdCategory(prod.category)
        setFormProdVariant(prod.variant_info || '')
        setFormProdStock(String(prod.stock))
        setFormProdPrice(String(prod.price))
        setFormProdCostPrice(String(prod.cost_price || 0))
        setIsProductModalOpen(true)
    }

    const handleSaveProduct = async (e: React.FormEvent) => {
        e.preventDefault()

        const stockNum = parseInt(formProdStock, 10)
        const priceNum = parseInt(formProdPrice, 10)
        const costNum = parseInt(formProdCostPrice, 10) || 0

        if (!formProdName.trim() || isNaN(stockNum) || stockNum < 0 || isNaN(priceNum) || priceNum < 0) {
            showToast('Mohon isi nama layanan/produk, stok, dan harga jual dengan benar!', 'error')
            return
        }

        setIsSaving(true)

        if (editingProduct) {
            const { error } = await supabase
                .from('ekraf_products')
                .update({
                    name: formProdName.trim(),
                    category: formProdCategory,
                    variant_info: formProdVariant.trim() || null,
                    stock: stockNum,
                    price: priceNum,
                    cost_price: costNum
                })
                .eq('id', editingProduct.id)

            if (error) {
                showToast(`Gagal memperbarui produk: ${error.message}`, 'error')
                setIsSaving(false)
                return
            }

            showToast(`Layanan "${formProdName.trim()}" berhasil diperbarui.`)
        } else {
            const randomNum = Math.floor(100 + Math.random() * 900)
            const sku = `EKR-${randomNum}`

            const { error } = await supabase.from('ekraf_products').insert({
                sku,
                name: formProdName.trim(),
                category: formProdCategory,
                variant_info: formProdVariant.trim() || null,
                stock: stockNum,
                price: priceNum,
                cost_price: costNum,
                sales_count: 0,
                created_by: currentUserId
            })

            if (error) {
                showToast(`Gagal menambahkan produk: ${error.message}`, 'error')
                setIsSaving(false)
                return
            }

            showToast(`Produk "${formProdName.trim()}" (${sku}) berhasil dipublikasikan.`)
        }

        setIsSaving(false)
        setIsProductModalOpen(false)
        await fetchEkrafData()
    }

    const handleDeleteProduct = async (prod: EkrafProduct) => {
        if (!confirm(`Apakah Anda yakin ingin menghapus "${prod.name}" (${prod.sku})?`)) return

        const { error } = await supabase.from('ekraf_products').delete().eq('id', prod.id)
        if (error) {
            showToast(`Gagal menghapus produk: ${error.message}`, 'error')
        } else {
            showToast(`Produk "${prod.name}" telah dihapus.`, 'info')
            await fetchEkrafData()
        }
    }

    const handleCreateOrder = async (e: React.FormEvent) => {
        e.preventDefault()

        const selectedProd = products.find((p) => p.id === formOrderProductId)
        const qtyNum = parseInt(formOrderQty, 10)

        if (!formCustName.trim() || !selectedProd || isNaN(qtyNum) || qtyNum <= 0) {
            showToast('Mohon lengkapi nama pemesan, paket layanan, dan jumlah!', 'error')
            return
        }

        if (formOrderStatus === 'Selesai' && selectedProd.stock < qtyNum) {
            showToast(`Slot/Stok "${selectedProd.name}" tidak mencukupi (tersisa ${selectedProd.stock}).`, 'error')
            return
        }

        setIsSaving(true)
        const orderCode = `ORD-${Math.floor(1000 + Math.random() * 9000)}`
        const totalPrice = selectedProd.price * qtyNum

        const { error } = await supabase.from('ekraf_orders').insert({
            order_code: orderCode,
            customer_name: formCustName.trim(),
            customer_contact: formCustContact.trim() || null,
            payment_method: formPaymentMethod,
            product_id: selectedProd.id,
            product_name: selectedProd.name,
            qty: qtyNum,
            unit_price: selectedProd.price,
            total_price: totalPrice,
            order_date: new Date().toISOString().split('T')[0],
            status: formOrderStatus,
            created_by: currentUserId
        })

        if (error) {
            showToast(`Gagal mencatat pesanan: ${error.message}`, 'error')
            setIsSaving(false)
            return
        }

        setIsSaving(false)
        setIsOrderModalOpen(false)
        setFormCustName('')
        setFormCustContact('')
        setFormOrderQty('1')
        showToast(`Pesanan ${orderCode} berhasil dicatat!`)
        await fetchEkrafData()
    }

    const handleUpdateOrderStatus = async (order: EkrafOrder, newStatus: OrderStatus) => {
        const { error } = await supabase
            .from('ekraf_orders')
            .update({ status: newStatus })
            .eq('id', order.id)

        if (error) {
            showToast(`Gagal memperbarui pesanan: ${error.message}`, 'error')
            return
        }

        showToast(`Status pesanan ${order.order_code} diperbarui menjadi "${newStatus}".`)
        await fetchEkrafData()
    }

    const handleExportSalesCsv = () => {
        const rows = [
            'Kode Order,Tanggal,Pemesan,Kontak,Pembayaran,Paket/Produk,Qty,Harga Satuan,Total Bayar,Status',
            ...orders.map(
                (o) =>
                    `"${o.order_code}","${o.order_date}","${o.customer_name.replace(/"/g, '""')}","${
                        o.customer_contact || '-'
                    }","${o.payment_method}","${o.product_name.replace(/"/g, '""')}",${o.qty},${
                        o.unit_price
                    },${o.total_price},"${o.status}"`
            )
        ].join('\n')

        const blob = new Blob([rows], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `Laporan_Penjualan_Ekraf_HIMATIFA_${new Date().toISOString().split('T')[0]}.csv`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
        showToast('Laporan penjualan Ekraf berhasil diunduh!', 'info')
    }

    const filteredProducts = useMemo(() => {
        return products.filter((p) => {
            const matchesSearch =
                p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (p.variant_info || '').toLowerCase().includes(searchQuery.toLowerCase())
            const matchesCategory = selectedCategory === 'Semua' || p.category === selectedCategory
            return matchesSearch && matchesCategory
        })
    }, [products, searchQuery, selectedCategory])

    const filteredOrders = useMemo(() => {
        return orders.filter((o) => {
            const matchesStatus = orderStatusFilter === 'Semua' || o.status === orderStatusFilter
            const matchesSearch =
                o.order_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                o.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                o.product_name.toLowerCase().includes(searchQuery.toLowerCase())
            return matchesStatus && matchesSearch
        })
    }, [orders, orderStatusFilter, searchQuery])

    if (isCheckingAuth) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-slate-500">
                <Loader2 className="size-7 animate-spin text-blue-600" />
                <p className="text-xs font-semibold">Memverifikasi hak akses Bidang Ekonomi Kreatif...</p>
            </div>
        )
    }

    if (!isAuthorized) {
        return (
            <div className="mx-auto my-12 max-w-md rounded-2xl border border-rose-200 bg-white p-8 text-center shadow-xs">
                <div className="mx-auto mb-4 grid size-14 place-items-center rounded-2xl bg-rose-50 text-rose-600 border border-rose-100">
                    <ShieldAlert className="size-7" />
                </div>
                <h2 className="text-lg font-extrabold text-slate-900">Akses Terbatas</h2>
                <p className="mt-2 text-xs leading-relaxed text-slate-500">
                    Halaman ini hanya dapat dikelola oleh <strong>Admin Ekraf</strong> dan <strong>Administrator</strong>.
                </p>
                <button
                    onClick={() => router.back()}
                    className="mt-6 inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-semibold text-white hover:bg-slate-800 cursor-pointer"
                >
                    Kembali
                </button>
            </div>
        )
    }

    return (
        <div className="space-y-6 font-sans">
            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, y: -16, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -16, scale: 0.98 }}
                        className="fixed top-6 right-6 z-50 flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-lg"
                    >
                        {toast.type === 'success' && <CheckCircle2 className="size-4.5 text-emerald-600" />}
                        {toast.type === 'error' && <XCircle className="size-4.5 text-red-600" />}
                        {toast.type === 'info' && <Sparkles className="size-4.5 text-blue-600" />}
                        <span className="text-xs font-semibold text-slate-700">{toast.message}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center border-b border-slate-200 pb-5">
                <div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 mb-1">
                        <span>SIM HIMATIFA</span>
                        <ChevronRight className="size-3 text-slate-400" />
                        <span className="text-slate-500">HIMATIFA Premium Services & Ekraf</span>
                    </div>
                    <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                        Manajemen Ekonomi <span className="text-blue-600">Kreatif</span>
                    </h1>
                    <p className="mt-1 text-xs sm:text-sm text-slate-500">
                        Kelola pricelist aplikasi premium & merchandise, pantau pesanan masuk, dan analitik penghasilan.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                    <button
                        type="button"
                        onClick={() => setIsOrderModalOpen(true)}
                        disabled={products.length === 0}
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 shadow-2xs transition hover:bg-slate-50 disabled:opacity-50 cursor-pointer"
                    >
                        <ShoppingBag className="size-4 text-blue-600" />
                        <span>Catat Pesanan</span>
                    </button>
                    <button
                        type="button"
                        onClick={openCreateProductModal}
                        className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-blue-600/10 transition hover:bg-blue-500 active:scale-[0.98] cursor-pointer"
                    >
                        <Plus className="size-4" />
                        <span>Tambah Paket / Produk</span>
                    </button>
                </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-blue-100 bg-blue-50/60 px-4 py-3 text-xs">
                <div className="flex items-center gap-2.5">
                    <div className="grid size-8 place-items-center rounded-xl bg-blue-600 text-white">
                        <Wallet className="size-4" />
                    </div>
                    <div>
                        <p className="font-bold text-slate-900">Kanal Pembayaran Resmi HIMATIFA Premium Services</p>
                        <p className="text-[11px] text-slate-600">
                            SeaBank: <strong className="font-mono text-slate-900">087762728979</strong> &bull; DANA:{' '}
                            <strong className="font-mono text-slate-900">087762728979</strong> &bull; Admin WA:{' '}
                            <strong className="font-mono text-blue-700">087762728979</strong>
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3 font-mono text-[11px] font-bold">
                    <span className="rounded-lg bg-white px-2.5 py-1 border border-slate-200 text-amber-700">
                        SeaBank: {formatRupiah(analytics.seabankTotal)}
                    </span>
                    <span className="rounded-lg bg-white px-2.5 py-1 border border-slate-200 text-sky-700">
                        DANA: {formatRupiah(analytics.danaTotal)}
                    </span>
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                    {
                        label: 'Total Paket & Produk',
                        value: `${analytics.activeProds} Item`,
                        subText: `${analytics.lowStock} item slot/stok menipis (<=10)`,
                        icon: Package,
                        badge: formatRupiah(analytics.inventoryValuation),
                        badgeColor: 'text-blue-700 bg-blue-50 border-blue-200'
                    },
                    {
                        label: 'Pesanan Masuk',
                        value: `${analytics.totalOrdersCount} Order`,
                        subText: `${analytics.completedOrdersCount} pesanan telah selesai`,
                        icon: ShoppingBag,
                        badge:
                            analytics.totalOrdersCount > 0
                                ? `${Math.round(
                                    (analytics.completedOrdersCount / analytics.totalOrdersCount) * 100
                                )}% Selesai`
                                : '0% Selesai',
                        badgeColor: 'text-amber-700 bg-amber-50 border-amber-200'
                    },
                    {
                        label: 'Pendapatan Kotor',
                        value: formatRupiah(analytics.grossRevenue),
                        subText: `Estimasi profit bersih: ${formatRupiah(analytics.netProfit)}`,
                        icon: DollarSign,
                        badge: 'Tervalidasi',
                        badgeColor: 'text-emerald-700 bg-emerald-50 border-emerald-200'
                    },
                    {
                        label: 'Akun / Item Terjual',
                        value: `${analytics.totalItemsSold} Pcs`,
                        subText: `Rata-rata order: ${formatRupiah(analytics.averageOrderValue)}`,
                        icon: TrendingUp,
                        badge: 'Akumulatif',
                        badgeColor: 'text-sky-700 bg-sky-50 border-sky-200'
                    }
                ].map((stat) => {
                    const Icon = stat.icon
                    return (
                        <div
                            key={stat.label}
                            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition hover:border-slate-300"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div className="grid size-10 place-items-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
                                    <Icon className="size-5" />
                                </div>
                                <span
                                    className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-extrabold ${stat.badgeColor}`}
                                >
                                    <ArrowUpRight className="size-3" />
                                    {stat.badge}
                                </span>
                            </div>
                            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{stat.label}</p>
                            <p className="mt-1 text-xl font-extrabold text-slate-900">{stat.value}</p>
                            <p className="mt-0.5 text-[11px] text-slate-500 font-medium">{stat.subText}</p>
                        </div>
                    )
                })}
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between border-b border-slate-100 pb-4">
                    <div className="flex flex-wrap gap-1 rounded-xl bg-slate-100 p-1 text-xs font-semibold">
                        <button
                            onClick={() => {
                                setActiveTab('produk')
                                setSearchQuery('')
                            }}
                            className={`flex items-center gap-2 rounded-lg px-3.5 py-2 transition cursor-pointer ${
                                activeTab === 'produk'
                                    ? 'bg-white text-blue-600 shadow-xs'
                                    : 'text-slate-600 hover:text-slate-900'
                            }`}
                        >
                            <Boxes className="size-4" />
                            <span>Katalog Pricelist ({products.length})</span>
                        </button>
                        <button
                            onClick={() => {
                                setActiveTab('pesanan')
                                setSearchQuery('')
                            }}
                            className={`flex items-center gap-2 rounded-lg px-3.5 py-2 transition cursor-pointer ${
                                activeTab === 'pesanan'
                                    ? 'bg-white text-blue-600 shadow-xs'
                                    : 'text-slate-600 hover:text-slate-900'
                            }`}
                        >
                            <ShoppingBag className="size-4" />
                            <span>Daftar Pesanan ({orders.length})</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('analitik')}
                            className={`flex items-center gap-2 rounded-lg px-3.5 py-2 transition cursor-pointer ${
                                activeTab === 'analitik'
                                    ? 'bg-white text-blue-600 shadow-xs'
                                    : 'text-slate-600 hover:text-slate-900'
                            }`}
                        >
                            <BarChart3 className="size-4" />
                            <span>Grafik & Perhitungan</span>
                        </button>
                    </div>

                    {activeTab !== 'analitik' ? (
                        <div className="flex flex-wrap items-center gap-3">
                            {activeTab === 'produk' && (
                                <div className="hidden xl:flex items-center gap-1 overflow-x-auto rounded-xl bg-slate-100 p-1">
                                    {EKRAF_CATEGORIES.map((cat) => (
                                        <button
                                            key={cat}
                                            onClick={() => setSelectedCategory(cat)}
                                            className={`rounded-lg px-2.5 py-1.5 text-[11px] font-bold transition cursor-pointer whitespace-nowrap ${
                                                selectedCategory === cat
                                                    ? 'bg-white text-blue-600 shadow-xs'
                                                    : 'text-slate-500 hover:text-slate-900'
                                            }`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {activeTab === 'pesanan' && (
                                <div className="hidden sm:flex items-center gap-1 rounded-xl bg-slate-100 p-1">
                                    {(['Semua', 'Diproses', 'Selesai', 'Batal'] as const).map((st) => (
                                        <button
                                            key={st}
                                            onClick={() => setOrderStatusFilter(st)}
                                            className={`rounded-lg px-2.5 py-1.5 text-[11px] font-bold transition cursor-pointer ${
                                                orderStatusFilter === st
                                                    ? 'bg-white text-blue-600 shadow-xs'
                                                    : 'text-slate-500 hover:text-slate-900'
                                            }`}
                                        >
                                            {st}
                                        </button>
                                    ))}
                                </div>
                            )}

                            <div className="relative flex-1 sm:w-64">
                                <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder={
                                        activeTab === 'produk'
                                            ? 'Cari layanan, paket, atau SKU...'
                                            : 'Cari kode order atau pemesan...'
                                    }
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2 pl-9 pr-8 text-xs font-medium text-slate-900 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/10"
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery('')}
                                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                    >
                                        <X className="size-3.5" />
                                    </button>
                                )}
                            </div>
                        </div>
                    ) : (
                        <button
                            type="button"
                            onClick={handleExportSalesCsv}
                            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                        >
                            <Download className="size-4 text-blue-600" />
                            <span>Export Laporan Penjualan (CSV)</span>
                        </button>
                    )}
                </div>

                {activeTab === 'produk' && (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs text-slate-600">
                            <thead className="border-b border-slate-200 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 bg-slate-50/50">
                            <tr>
                                <th className="py-3 px-3">SKU & Nama Layanan / Paket</th>
                                <th className="py-3 px-3">Kategori</th>
                                <th className="py-3 px-3">Slot / Stok</th>
                                <th className="py-3 px-3">Harga Jual & Modal</th>
                                <th className="py-3 px-3">Terjual</th>
                                <th className="py-3 px-3 text-right">Aksi</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="py-12 text-center">
                                        <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-500">
                                            <Loader2 className="size-4 animate-spin text-blue-600" />
                                            <span>Memuat katalog layanan dari Supabase...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredProducts.map((product) => (
                                    <tr key={product.id} className="group transition hover:bg-slate-50/80">
                                        <td className="py-3.5 px-3">
                                            <div className="flex items-center gap-3">
                                                <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100 font-bold text-xs">
                                                    {product.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900 group-hover:text-blue-600 transition">
                                                        {product.name}
                                                    </p>
                                                    <div className="flex items-center gap-2 mt-0.5">
                                                            <span className="font-mono text-[10px] font-semibold text-slate-400">
                                                                {product.sku}
                                                            </span>
                                                        {product.variant_info && (
                                                            <span className="text-[10px] font-medium text-blue-600 bg-blue-50 px-1.5 py-0.2 rounded">
                                                                    {product.variant_info}
                                                                </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3.5 px-3 whitespace-nowrap">
                                                <span className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-700 border border-slate-200">
                                                    <Tag className="size-3 text-blue-600" />
                                                    {product.category}
                                                </span>
                                        </td>
                                        <td className="py-3.5 px-3 whitespace-nowrap">
                                            <div className="w-28">
                                                <div className="flex items-center justify-between text-[11px] font-bold mb-1">
                                                    {product.stock > 15 ? (
                                                        <span className="text-emerald-600">Tersedia</span>
                                                    ) : product.stock > 0 ? (
                                                        <span className="text-amber-600">Menipis</span>
                                                    ) : (
                                                        <span className="text-red-600">Habis</span>
                                                    )}
                                                    <span className="text-slate-500">{product.stock} slot</span>
                                                </div>
                                                <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full transition-all ${
                                                            product.stock > 15
                                                                ? 'bg-emerald-500'
                                                                : product.stock > 0
                                                                    ? 'bg-amber-500'
                                                                    : 'bg-red-500'
                                                        }`}
                                                        style={{
                                                            width: `${Math.min((product.stock / 100) * 100, 100)}%`
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3.5 px-3 whitespace-nowrap">
                                            <p className="font-mono font-bold text-slate-900">
                                                {formatRupiah(product.price)}
                                            </p>
                                            {product.cost_price > 0 && (
                                                <p className="font-mono text-[10px] text-slate-400">
                                                    Modal: {formatRupiah(product.cost_price)}
                                                </p>
                                            )}
                                        </td>
                                        <td className="py-3.5 px-3 font-bold text-slate-700 whitespace-nowrap">
                                            {product.sales_count} pcs
                                        </td>
                                        <td className="py-3.5 px-3 text-right whitespace-nowrap">
                                            <div className="flex items-center justify-end gap-1">
                                                <button
                                                    type="button"
                                                    title="Edit Layanan / Harga / Stok"
                                                    onClick={() => openEditProductModal(product)}
                                                    className="rounded-lg p-1.5 text-slate-400 transition hover:bg-blue-50 hover:text-blue-600 cursor-pointer"
                                                >
                                                    <Pencil className="size-4" />
                                                </button>
                                                <button
                                                    type="button"
                                                    title="Hapus Paket"
                                                    onClick={() => handleDeleteProduct(product)}
                                                    className="rounded-lg p-1.5 text-slate-400 transition hover:bg-red-50 hover:text-red-600 cursor-pointer"
                                                >
                                                    <Trash2 className="size-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </table>

                        {!isLoading && filteredProducts.length === 0 && (
                            <div className="py-12 text-center">
                                <Package className="mx-auto size-8 text-slate-300" />
                                <p className="mt-2 text-xs font-semibold text-slate-500">
                                    Tidak ada paket layanan yang sesuai dengan filter atau pencarian.
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'pesanan' && (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs text-slate-600">
                            <thead className="border-b border-slate-200 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 bg-slate-50/50">
                            <tr>
                                <th className="py-3 px-3">ID Order & Tanggal</th>
                                <th className="py-3 px-3">Nama Pemesan</th>
                                <th className="py-3 px-3">Detail Paket</th>
                                <th className="py-3 px-3">Metode & Total</th>
                                <th className="py-3 px-3">Status</th>
                                <th className="py-3 px-3 text-right">Update Status</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                            {filteredOrders.map((order) => (
                                <tr key={order.id} className="group transition hover:bg-slate-50/80">
                                    <td className="py-3.5 px-3 whitespace-nowrap">
                                        <p className="font-mono text-xs font-bold text-blue-600">
                                            {order.order_code}
                                        </p>
                                        <p className="text-[10px] text-slate-400 font-medium">
                                            {formatTanggalID(order.order_date)}
                                        </p>
                                    </td>
                                    <td className="py-3.5 px-3">
                                        <p className="font-bold text-slate-900">{order.customer_name}</p>
                                        {order.customer_contact && (
                                            <p className="text-[10px] text-slate-400">{order.customer_contact}</p>
                                        )}
                                    </td>
                                    <td className="py-3.5 px-3">
                                        <p className="font-semibold text-slate-800">{order.product_name}</p>
                                        <p className="text-[10px] text-slate-400 font-medium">
                                            Qty: {order.qty} × {formatRupiah(order.unit_price)}
                                        </p>
                                    </td>
                                    <td className="py-3.5 px-3 whitespace-nowrap">
                                        <p className="font-mono font-bold text-slate-900">
                                            {formatRupiah(order.total_price)}
                                        </p>
                                        <span className="inline-block mt-0.5 rounded bg-slate-100 px-1.5 py-0.2 text-[10px] font-bold text-slate-600">
                                                via {order.payment_method}
                                            </span>
                                    </td>
                                    <td className="py-3.5 px-3 whitespace-nowrap">
                                        {order.status === 'Selesai' && (
                                            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">
                                                    <CheckCircle2 className="size-3" />
                                                    <span>Selesai</span>
                                                </span>
                                        )}
                                        {order.status === 'Diproses' && (
                                            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200 px-2.5 py-0.5 text-[10px] font-bold text-amber-700">
                                                    <Clock className="size-3" />
                                                    <span>Diproses</span>
                                                </span>
                                        )}
                                        {order.status === 'Batal' && (
                                            <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 border border-red-200 px-2.5 py-0.5 text-[10px] font-bold text-red-700">
                                                    <XCircle className="size-3" />
                                                    <span>Batal</span>
                                                </span>
                                        )}
                                    </td>
                                    <td className="py-3.5 px-3 text-right whitespace-nowrap">
                                        <select
                                            value={order.status}
                                            onChange={(e) =>
                                                handleUpdateOrderStatus(order, e.target.value as OrderStatus)
                                            }
                                            className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 outline-none transition focus:border-blue-600 cursor-pointer"
                                        >
                                            <option value="Diproses">Diproses</option>
                                            <option value="Selesai">Selesai</option>
                                            <option value="Batal">Batal</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>

                        {filteredOrders.length === 0 && (
                            <div className="py-12 text-center">
                                <ShoppingBag className="mx-auto size-8 text-slate-300" />
                                <p className="mt-2 text-xs font-semibold text-slate-500">
                                    Belum ada data pesanan yang sesuai.
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'analitik' && (
                    <div className="space-y-6">
                        <div className="grid gap-6 lg:grid-cols-3">
                            <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-slate-50/40 p-5">
                                <div className="mb-4 flex items-center justify-between">
                                    <div>
                                        <h3 className="text-sm font-extrabold text-slate-900">
                                            Grafik Tren Pendapatan Penjualan
                                        </h3>
                                        <p className="text-[11px] text-slate-500">
                                            Akumulasi transaksi berstatus <strong>Selesai</strong> per tanggal
                                        </p>
                                    </div>
                                    <span className="rounded-lg bg-emerald-50 border border-emerald-200 px-2.5 py-1 font-mono text-xs font-bold text-emerald-700">
                                        {formatRupiah(analytics.grossRevenue)}
                                    </span>
                                </div>

                                {analytics.chartSeries.length === 0 ? (
                                    <div className="flex h-52 flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white text-center">
                                        <BarChart3 className="size-8 text-slate-300" />
                                        <p className="mt-2 text-xs font-semibold text-slate-500">
                                            Belum ada pesanan selesai untuk ditampilkan dalam grafik.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="mt-6 flex h-56 items-end justify-around gap-3 rounded-xl border border-slate-200 bg-white px-4 pt-8 pb-4">
                                        {analytics.chartSeries.map((bar) => {
                                            const heightPct = Math.max(
                                                12,
                                                Math.round((bar.revenue / analytics.maxChartRevenue) * 100)
                                            )
                                            return (
                                                <div
                                                    key={bar.label}
                                                    className="group flex h-full flex-1 flex-col items-center justify-end gap-2"
                                                >
                                                    <span className="font-mono text-[10px] font-bold text-slate-600 opacity-80 group-hover:text-blue-600">
                                                        {formatRupiah(bar.revenue).replace('Rp', '').trim()}
                                                    </span>
                                                    <div className="flex w-full max-w-12 flex-1 items-end">
                                                        <motion.div
                                                            initial={{ height: 0 }}
                                                            animate={{ height: `${heightPct}%` }}
                                                            transition={{ duration: 0.45 }}
                                                            className="w-full rounded-t-xl bg-gradient-to-t from-blue-600 to-sky-400 shadow-xs group-hover:from-blue-700 group-hover:to-blue-500"
                                                        />
                                                    </div>
                                                    <div className="text-center">
                                                        <p className="text-[11px] font-bold text-slate-700">
                                                            {bar.label}
                                                        </p>
                                                        <p className="text-[10px] text-slate-400">
                                                            {bar.count} item
                                                        </p>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                )}
                            </div>

                            <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4">
                                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                                    <div className="grid size-8 place-items-center rounded-xl bg-blue-50 text-blue-600">
                                        <Calculator className="size-4" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-extrabold text-slate-900">
                                            Ringkasan Perhitungan
                                        </h3>
                                        <p className="text-[10px] text-slate-400">Kalkulasi real-time database</p>
                                    </div>
                                </div>

                                <div className="space-y-3 text-xs">
                                    <div className="flex items-center justify-between py-1 border-b border-slate-100">
                                        <span className="text-slate-500">Omzet Selesai (Gross):</span>
                                        <span className="font-mono font-bold text-slate-900">
                                            {formatRupiah(analytics.grossRevenue)}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between py-1 border-b border-slate-100">
                                        <span className="text-slate-500">Potensi Order Diproses:</span>
                                        <span className="font-mono font-bold text-amber-600">
                                            {formatRupiah(analytics.pendingRevenue)}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between py-1 border-b border-slate-100">
                                        <span className="text-slate-500">Estimasi Laba Bersih:</span>
                                        <span className="font-mono font-extrabold text-emerald-600">
                                            {formatRupiah(analytics.netProfit)}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between py-1 border-b border-slate-100">
                                        <span className="text-slate-500">Rata-rata Nilai Order:</span>
                                        <span className="font-mono font-bold text-slate-900">
                                            {formatRupiah(analytics.averageOrderValue)}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between py-1">
                                        <span className="text-slate-500">Valuasi Sisa Slot/Stok:</span>
                                        <span className="font-mono font-bold text-blue-600">
                                            {formatRupiah(analytics.inventoryValuation)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white p-5">
                            <h3 className="mb-4 text-sm font-extrabold text-slate-900">
                                Kontribusi Penjualan per Kategori Layanan & Produk
                            </h3>
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                {analytics.categoryStats.map((item) => (
                                    <div
                                        key={item.category}
                                        className="rounded-xl border border-slate-200 bg-slate-50/50 p-4"
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-extrabold text-slate-800">
                                                {item.category}
                                            </span>
                                            <span className="rounded-md bg-blue-50 px-2 py-0.5 font-mono text-[11px] font-bold text-blue-700">
                                                {item.percentage}%
                                            </span>
                                        </div>
                                        <p className="mt-2 font-mono text-base font-extrabold text-slate-900">
                                            {formatRupiah(item.revenue)}
                                        </p>
                                        <p className="mt-0.5 text-[11px] text-slate-500">{item.units} item terjual</p>
                                        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                                            <div
                                                className="h-full rounded-full bg-blue-600 transition-all"
                                                style={{ width: `${item.percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <AnimatePresence>
                {isProductModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsProductModalOpen(false)}
                            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.98, y: 12 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.98, y: 12 }}
                            className="relative z-10 w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-xl sm:p-8"
                        >
                            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                                <div className="flex items-center gap-2.5 font-bold text-slate-900 text-base">
                                    <div className="grid size-8 place-items-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
                                        <Package className="size-4" />
                                    </div>
                                    <span>
                                        {editingProduct
                                            ? `Edit Paket (${editingProduct.sku})`
                                            : 'Tambah Paket Layanan / Produk'}
                                    </span>
                                </div>
                                <button
                                    onClick={() => setIsProductModalOpen(false)}
                                    className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition cursor-pointer"
                                >
                                    <X className="size-4.5" />
                                </button>
                            </div>

                            <form onSubmit={handleSaveProduct} className="mt-5 space-y-4">
                                <div>
                                    <label className="mb-1 block text-xs font-semibold text-slate-700">
                                        Nama Layanan / Produk <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formProdName}
                                        onChange={(e) => setFormProdName(e.target.value)}
                                        placeholder="Contoh: Spotify Premium - 1 Bulan (Individual)"
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 px-3.5 text-xs font-medium text-slate-900 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/10"
                                    />
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="mb-1 block text-xs font-semibold text-slate-700">
                                            Kategori
                                        </label>
                                        <select
                                            value={formProdCategory}
                                            onChange={(e) => setFormProdCategory(e.target.value as EkrafCategory)}
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 px-3.5 text-xs font-semibold text-slate-900 outline-none transition focus:border-blue-600 focus:bg-white cursor-pointer"
                                        >
                                            <option value="AI & Produktivitas">AI & Produktivitas</option>
                                            <option value="Streaming & Hiburan">Streaming & Hiburan</option>
                                            <option value="Desain & Editing">Desain & Editing</option>
                                            <option value="Merchandise">Merchandise</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="mb-1 block text-xs font-semibold text-slate-700">
                                            Tipe & Garansi
                                        </label>
                                        <input
                                            type="text"
                                            value={formProdVariant}
                                            onChange={(e) => setFormProdVariant(e.target.value)}
                                            placeholder="Private — Bergaransi"
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 px-3.5 text-xs font-medium text-slate-900 outline-none transition focus:border-blue-600 focus:bg-white"
                                        />
                                    </div>
                                </div>

                                <div className="grid gap-4 sm:grid-cols-3">
                                    <div>
                                        <label className="mb-1 block text-xs font-semibold text-slate-700">
                                            Slot / Stok <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            required
                                            min={0}
                                            value={formProdStock}
                                            onChange={(e) => setFormProdStock(e.target.value)}
                                            placeholder="50"
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 px-3 text-xs font-bold text-slate-900 outline-none transition focus:border-blue-600 focus:bg-white"
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-1 block text-xs font-semibold text-slate-700">
                                            Harga Jual <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            required
                                            min={0}
                                            value={formProdPrice}
                                            onChange={(e) => setFormProdPrice(e.target.value)}
                                            placeholder="15500"
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 px-3 text-xs font-mono font-bold text-slate-900 outline-none transition focus:border-blue-600 focus:bg-white"
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-1 block text-xs font-semibold text-slate-700">
                                            Harga Modal
                                        </label>
                                        <input
                                            type="number"
                                            min={0}
                                            value={formProdCostPrice}
                                            onChange={(e) => setFormProdCostPrice(e.target.value)}
                                            placeholder="10000"
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 px-3 text-xs font-mono font-bold text-slate-900 outline-none transition focus:border-blue-600 focus:bg-white"
                                        />
                                    </div>
                                </div>

                                <div className="mt-6 flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
                                    <button
                                        type="button"
                                        onClick={() => setIsProductModalOpen(false)}
                                        className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition cursor-pointer"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSaving}
                                        className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-blue-600/10 transition hover:bg-blue-500 active:scale-[0.98] disabled:opacity-50 cursor-pointer"
                                    >
                                        {isSaving ? (
                                            <Loader2 className="size-4 animate-spin" />
                                        ) : (
                                            <CheckCircle2 className="size-4" />
                                        )}
                                        <span>{editingProduct ? 'Simpan Perubahan' : 'Publikasikan'}</span>
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isOrderModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOrderModalOpen(false)}
                            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.98, y: 12 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.98, y: 12 }}
                            className="relative z-10 w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-xl sm:p-8"
                        >
                            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                                <div className="flex items-center gap-2.5 font-bold text-slate-900 text-base">
                                    <div className="grid size-8 place-items-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
                                        <ShoppingBag className="size-4" />
                                    </div>
                                    <span>Catat Transaksi Penjualan</span>
                                </div>
                                <button
                                    onClick={() => setIsOrderModalOpen(false)}
                                    className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition cursor-pointer"
                                >
                                    <X className="size-4.5" />
                                </button>
                            </div>

                            <form onSubmit={handleCreateOrder} className="mt-5 space-y-4">
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="mb-1 block text-xs font-semibold text-slate-700">
                                            Nama Pemesan <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formCustName}
                                            onChange={(e) => setFormCustName(e.target.value)}
                                            placeholder="Contoh: Nabila Putri"
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 px-3.5 text-xs font-medium text-slate-900 outline-none focus:border-blue-600 focus:bg-white"
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-1 block text-xs font-semibold text-slate-700">
                                            No. WhatsApp / Email Akun
                                        </label>
                                        <input
                                            type="text"
                                            value={formCustContact}
                                            onChange={(e) => setFormCustContact(e.target.value)}
                                            placeholder="0812xxxx / email@gmail.com"
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 px-3.5 text-xs font-medium text-slate-900 outline-none focus:border-blue-600 focus:bg-white"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="mb-1 block text-xs font-semibold text-slate-700">
                                        Pilih Paket Layanan / Produk <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={formOrderProductId}
                                        onChange={(e) => setFormOrderProductId(e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 px-3.5 text-xs font-semibold text-slate-900 outline-none focus:border-blue-600 focus:bg-white cursor-pointer"
                                    >
                                        {products.map((p) => (
                                            <option key={p.id} value={p.id}>
                                                {p.name} — {formatRupiah(p.price)} (Sisa: {p.stock})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="grid gap-4 sm:grid-cols-3">
                                    <div>
                                        <label className="mb-1 block text-xs font-semibold text-slate-700">
                                            Jumlah <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            required
                                            min={1}
                                            value={formOrderQty}
                                            onChange={(e) => setFormOrderQty(e.target.value)}
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 px-3.5 text-xs font-bold text-slate-900 outline-none focus:border-blue-600 focus:bg-white"
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-1 block text-xs font-semibold text-slate-700">
                                            Pembayaran
                                        </label>
                                        <select
                                            value={formPaymentMethod}
                                            onChange={(e) => setFormPaymentMethod(e.target.value as PaymentMethod)}
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 px-3 text-xs font-semibold text-slate-900 outline-none focus:border-blue-600 focus:bg-white cursor-pointer"
                                        >
                                            <option value="DANA">DANA (087762728979)</option>
                                            <option value="SeaBank">SeaBank (087762728979)</option>
                                            <option value="Tunai / QRIS">Tunai / QRIS</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="mb-1 block text-xs font-semibold text-slate-700">
                                            Status
                                        </label>
                                        <select
                                            value={formOrderStatus}
                                            onChange={(e) => setFormOrderStatus(e.target.value as OrderStatus)}
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 px-3 text-xs font-semibold text-slate-900 outline-none focus:border-blue-600 focus:bg-white cursor-pointer"
                                        >
                                            <option value="Selesai">Selesai</option>
                                            <option value="Diproses">Diproses</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="mt-6 flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
                                    <button
                                        type="button"
                                        onClick={() => setIsOrderModalOpen(false)}
                                        className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSaving}
                                        className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-blue-600/10 transition hover:bg-blue-500 active:scale-[0.98] disabled:opacity-50 cursor-pointer"
                                    >
                                        {isSaving ? (
                                            <Loader2 className="size-4 animate-spin" />
                                        ) : (
                                            <CheckCircle2 className="size-4" />
                                        )}
                                        <span>Simpan Transaksi</span>
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}