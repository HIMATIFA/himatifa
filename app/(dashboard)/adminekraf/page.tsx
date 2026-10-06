'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Package,
    ShoppingBag,
    DollarSign,
    Plus,
    Search,
    Trash2,
    ArrowLeft,
    X,
    ShieldCheck,
    CheckCircle2,
    Clock,
    XCircle,
    Tag,
    Boxes,
    TrendingUp,
    Store,
    Sparkles,
    ArrowUpRight
} from 'lucide-react'
import Link from 'next/link'

interface Product {
    id: string
    name: string
    category: string
    stock: number
    price: number
    salesCount: number
    sku: string
}

type OrderStatus = 'Diproses' | 'Selesai' | 'Batal'

interface Order {
    id: string
    customerName: string
    productName: string
    qty: number
    totalPrice: number
    date: string
    status: OrderStatus
}

const formatRupiah = (val: number): string => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0
    }).format(val)
}

const initialProducts: Product[] = [
    { id: 'p-1', sku: 'EKR-001', name: 'Lanyard HIMATIFA Eksklusif', category: 'Merchandise', stock: 45, price: 35000, salesCount: 112 },
    { id: 'p-2', sku: 'EKR-002', name: 'PDH Resmi HIMATIFA 2026', category: 'Pakaian', stock: 8, price: 165000, salesCount: 88 },
    { id: 'p-3', sku: 'EKR-003', name: 'Gantungan Kunci Acrylic Logo', category: 'Merchandise', stock: 80, price: 12000, salesCount: 150 },
    { id: 'p-4', sku: 'EKR-004', name: 'Sticker Pack Informatika (5 Pcs)', category: 'Aksesoris', stock: 120, price: 15000, salesCount: 210 },
    { id: 'p-5', sku: 'EKR-005', name: 'Tote Bag Kanvas Premium HIMATIFA', category: 'Tas', stock: 0, price: 55000, salesCount: 40 }
]

const initialOrders: Order[] = [
    { id: 'ORD-1001', customerName: 'Rizky Febrian', productName: 'Lanyard HIMATIFA Eksklusif', qty: 2, totalPrice: 70000, date: '25 Sep 2026', status: 'Diproses' },
    { id: 'ORD-1002', customerName: 'Siti Nurhaliza', productName: 'PDH Resmi HIMATIFA 2026', qty: 1, totalPrice: 165000, date: '24 Sep 2026', status: 'Selesai' },
    { id: 'ORD-1003', customerName: 'Ahmad Dahlan', productName: 'Sticker Pack Informatika (5 Pcs)', qty: 3, totalPrice: 45000, date: '24 Sep 2026', status: 'Selesai' },
    { id: 'ORD-1004', customerName: 'Budi Santoso', productName: 'Tote Bag Kanvas Premium HIMATIFA', qty: 1, totalPrice: 55000, date: '22 Sep 2026', status: 'Batal' }
]

const categories = ['Semua', 'Merchandise', 'Pakaian', 'Aksesoris', 'Tas']

export default function AdminEkrafPage() {
    const [activeTab, setActiveTab] = useState<'produk' | 'pesanan'>('produk')
    const [products, setProducts] = useState<Product[]>(initialProducts)
    const [orders, setOrders] = useState<Order[]>(initialOrders)
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('Semua')

    const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null)
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)

    const [newProductName, setNewProductName] = useState('')
    const [newProductCategory, setNewProductCategory] = useState('Merchandise')
    const [newProductStock, setNewProductStock] = useState('')
    const [newProductPrice, setNewProductPrice] = useState('')

    const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
        setToast({ message, type })
        setTimeout(() => setToast(null), 3500)
    }

    const { totalActiveProducts, totalOrdersThisMonth, grossRevenue, lowStockCount } = useMemo(() => {
        const activeProds = products.length
        const totalOrders = orders.length
        const revenue = orders
            .filter((o) => o.status === 'Selesai')
            .reduce((sum, o) => sum + o.totalPrice, 0)
        const lowStock = products.filter((p) => p.stock <= 10).length

        return { totalActiveProducts: activeProds, totalOrdersThisMonth: totalOrders, grossRevenue: revenue, lowStockCount: lowStock }
    }, [products, orders])

    const handleAddProduct = () => {
        const stockNum = parseInt(newProductStock, 10)
        const priceNum = parseFloat(newProductPrice)

        if (!newProductName.trim() || isNaN(stockNum) || isNaN(priceNum)) {
            showToast('Mohon isi semua bidang formulir dengan benar!', 'error')
            return
        }

        const newProd: Product = {
            id: `p-${Date.now()}`,
            sku: `EKR-00${products.length + 1}`,
            name: newProductName,
            category: newProductCategory,
            stock: stockNum,
            price: priceNum,
            salesCount: 0
        }

        setProducts([newProd, ...products])
        setNewProductName('')
        setNewProductStock('')
        setNewProductPrice('')
        setIsAddModalOpen(false)
        showToast(`Produk "${newProd.name}" berhasil ditambahkan.`)
    }

    const handleDeleteProduct = (id: string, name: string) => {
        if (confirm(`Apakah Anda yakin ingin menghapus "${name}"?`)) {
            setProducts(products.filter((p) => p.id !== id))
            showToast(`Produk "${name}" telah dihapus.`, 'info')
        }
    }

    const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
        setOrders(orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)))
        showToast(`Status pesanan ${orderId} diperbarui menjadi "${newStatus}".`)
    }

    const filteredProducts = useMemo(() => {
        return products.filter((p) => {
            const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.sku.toLowerCase().includes(searchQuery.toLowerCase())
            const matchesCategory = selectedCategory === 'Semua' || p.category === selectedCategory
            return matchesSearch && matchesCategory
        })
    }, [products, searchQuery, selectedCategory])

    const filteredOrders = useMemo(() => {
        return orders.filter(
            (o) => o.id.toLowerCase().includes(searchQuery.toLowerCase()) || o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) || o.productName.toLowerCase().includes(searchQuery.toLowerCase())
        )
    }, [orders, searchQuery])

    return (
        <main className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-500 selection:text-white font-sans">
            <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                <div className="absolute -left-32 -top-32 size-[500px] rounded-full bg-blue-400/20 blur-[140px]" />
                <div className="absolute right-0 top-1/4 size-[600px] rounded-full bg-indigo-400/15 blur-[160px]" />
                <div className="absolute bottom-10 left-1/3 size-[400px] rounded-full bg-emerald-400/15 blur-[130px]" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-60" />
            </div>

            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        className="fixed top-6 right-6 z-50 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white/95 px-5 py-3.5 shadow-xl backdrop-blur-xl"
                    >
                        {toast.type === 'success' && <CheckCircle2 className="size-5 text-emerald-500"/>}
                        {toast.type === 'error' && <XCircle className="size-5 text-rose-500"/>}
                        {toast.type === 'info' && <Sparkles className="size-5 text-blue-500"/>}
                        <span className="text-sm font-semibold text-slate-700">{toast.message}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            <header className="fixed inset-x-0 top-0 z-40 px-4 pt-4 sm:px-6 lg:px-10">
                <nav className="mx-auto flex max-w-7xl items-center justify-between rounded-2xl border border-white/60 bg-white/70 px-5 py-3 shadow-sm backdrop-blur-xl">
                    <Link className="group flex items-center gap-2.5 text-sm font-bold tracking-wide text-slate-600 transition hover:text-slate-900" href="/">
                        <div className="flex size-7 items-center justify-center rounded-lg bg-slate-100 border border-slate-200 group-hover:bg-blue-600 group-hover:border-blue-500 transition">
                            <ArrowLeft className="size-3.5 text-slate-500 group-hover:text-white"/>
                        </div>
                        <span>Dashboard Utama</span>
                    </Link>

                    <div className="flex items-center gap-3">
                        <div className="hidden sm:flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1">
                            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">Ekraf Store Active</span>
                        </div>

                        <div className="flex items-center gap-2 rounded-xl bg-blue-50 border border-blue-200 px-3 py-1.5 text-xs font-bold text-blue-700">
                            <Store className="size-4"/>
                            <span>Sistem Merchandising</span>
                        </div>
                    </div>
                </nav>
            </header>

            <div className="mx-auto max-w-7xl px-4 sm:px-6 pb-24 pt-32 lg:px-10">
                <section className="mb-8 flex flex-col justify-between gap-6 md:flex-row md:items-end border-b border-slate-200 pb-8">
                    <div>
                        <div className="mb-3 inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-3.5 py-1.5">
                            <ShieldCheck className="size-4 text-blue-600"/>
                            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700">
                Bidang Ekonomi Kreatif & Usaha Mandiri
              </span>
                        </div>
                        <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                            Ekraf <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 bg-clip-text text-transparent">Management</span>
                        </h1>
                        <p className="mt-3 text-sm text-slate-500 max-w-2xl leading-relaxed">
                            Pantau arus inventaris merchandise resmi HIMATIFA, kelola transaksi pembelian mahasiswa, dan optimalkan pendapatan harian organisasi.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:shadow-blue-600/30 hover:scale-[1.02] active:scale-95"
                        >
                            <Plus className="size-4"/> Tambah Produk
                        </button>
                    </div>
                </section>

                <section className="mb-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {[
                        {
                            label: 'Total Katalog Aktif',
                            value: totalActiveProducts.toString(),
                            subText: `${lowStockCount} produk stok menipis`,
                            icon: Package,
                            gradient: 'from-blue-500 to-indigo-600',
                            badge: '+2 produk baru',
                            badgeColor: 'text-blue-700 bg-blue-50 border-blue-200'
                        },
                        {
                            label: 'Pesanan Masuk',
                            value: totalOrdersThisMonth.toString(),
                            subText: 'Transaksi bulan ini',
                            icon: ShoppingBag,
                            gradient: 'from-amber-500 to-orange-500',
                            badge: '92% diproses',
                            badgeColor: 'text-amber-700 bg-amber-50 border-amber-200'
                        },
                        {
                            label: 'Pendapatan Kotor',
                            value: formatRupiah(grossRevenue),
                            subText: 'Akumulasi status selesai',
                            icon: DollarSign,
                            gradient: 'from-emerald-500 to-teal-500',
                            badge: '+18.4%',
                            badgeColor: 'text-emerald-700 bg-emerald-50 border-emerald-200'
                        },
                        {
                            label: 'Item Terjual',
                            value: products.reduce((acc, curr) => acc + curr.salesCount, 0).toString() + ' Pcs',
                            subText: 'Total penjualan akumulatif',
                            icon: TrendingUp,
                            gradient: 'from-sky-500 to-blue-500',
                            badge: 'Popular',
                            badgeColor: 'text-sky-700 bg-sky-50 border-sky-200'
                        }
                    ].map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.08 }}
                            className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow-md"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className={`flex size-11 items-center justify-center rounded-xl bg-gradient-to-br ${stat.gradient} text-white shadow-sm`}>
                                    <stat.icon className="size-5.5" />
                                </div>
                                <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${stat.badgeColor}`}>
                  <ArrowUpRight className="size-3"/> {stat.badge}
                </span>
                            </div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{stat.label}</p>
                            <p className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900">{stat.value}</p>
                            <p className="mt-1 text-xs text-slate-500">{stat.subText}</p>
                        </motion.div>
                    ))}
                </section>

                <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
                    <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between border-b border-slate-100 pb-5">
                        <div className="flex gap-1.5 rounded-xl bg-slate-50 p-1.5 border border-slate-200 text-sm font-bold">
                            <button
                                onClick={() => { setActiveTab('produk'); setSearchQuery('') }}
                                className={`flex items-center gap-2 rounded-lg px-4 py-2 transition ${
                                    activeTab === 'produk'
                                        ? 'bg-white text-blue-600 shadow-sm border border-slate-200'
                                        : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                                }`}
                            >
                                <Boxes className="size-4"/> Katalog ({products.length})
                            </button>
                            <button
                                onClick={() => { setActiveTab('pesanan'); setSearchQuery('') }}
                                className={`flex items-center gap-2 rounded-lg px-4 py-2 transition ${
                                    activeTab === 'pesanan'
                                        ? 'bg-white text-blue-600 shadow-sm border border-slate-200'
                                        : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                                }`}
                            >
                                <ShoppingBag className="size-4"/> Pesanan ({orders.length})
                            </button>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            {activeTab === 'produk' && (
                                <div className="hidden sm:flex items-center gap-1 overflow-x-auto rounded-xl bg-slate-50 p-1 border border-slate-200">
                                    {categories.map((cat) => (
                                        <button
                                            key={cat}
                                            onClick={() => setSelectedCategory(cat)}
                                            className={`rounded-lg px-3 py-1.5 text-[11px] font-bold transition ${
                                                selectedCategory === cat
                                                    ? 'bg-white text-blue-600 border border-slate-200 shadow-sm'
                                                    : 'text-slate-500 hover:text-slate-900'
                                            }`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            )}

                            <div className="relative flex-1 sm:w-64">
                                <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400"/>
                                <input
                                    type="text"
                                    placeholder={activeTab === 'produk' ? 'Cari produk...' : 'Cari pesanan...'}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-8 py-2 text-sm font-medium text-slate-900 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:bg-white"
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery('')}
                                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                    >
                                        <X className="size-3.5"/>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {activeTab === 'produk' && (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-slate-600">
                                <thead className="border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-500">
                                <tr>
                                    <th className="pb-3 px-3 font-extrabold">SKU & Item Info</th>
                                    <th className="pb-3 px-3 font-extrabold">Kategori</th>
                                    <th className="pb-3 px-3 font-extrabold">Ketersediaan Stok</th>
                                    <th className="pb-3 px-3 font-extrabold">Harga Jual</th>
                                    <th className="pb-3 px-3 font-extrabold text-right">Aksi</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                {filteredProducts.map((product) => (
                                    <tr key={product.id} className="group transition hover:bg-slate-50">
                                        <td className="py-4 px-3">
                                            <div className="flex items-center gap-3">
                                                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 border border-slate-200 text-blue-600 font-bold text-sm">
                                                    {product.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900 group-hover:text-blue-600 transition">{product.name}</p>
                                                    <span className="font-mono text-[11px] font-semibold text-slate-500">{product.sku}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-3">
                        <span className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-700 border border-slate-200">
                          <Tag className="size-3 text-blue-500"/> {product.category}
                        </span>
                                        </td>
                                        <td className="py-4 px-3 whitespace-nowrap">
                                            <div className="w-32">
                                                <div className="flex items-center justify-between text-[11px] font-bold mb-1">
                                                    {product.stock > 15 ? (
                                                        <span className="text-emerald-600">Tersedia</span>
                                                    ) : product.stock > 0 ? (
                                                        <span className="text-amber-600">Menipis</span>
                                                    ) : (
                                                        <span className="text-rose-600">Habis</span>
                                                    )}
                                                    <span className="text-slate-500">{product.stock} pcs</span>
                                                </div>
                                                <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full transition-all ${
                                                            product.stock > 15 ? 'bg-emerald-500' : product.stock > 0 ? 'bg-amber-500' : 'bg-rose-500'
                                                        }`}
                                                        style={{ width: `${Math.min((product.stock / 100) * 100, 100)}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-3 font-mono font-bold text-slate-900">
                                            {formatRupiah(product.price)}
                                        </td>
                                        <td className="py-4 px-3 text-right whitespace-nowrap">
                                            <button
                                                title="Hapus Produk"
                                                onClick={() => handleDeleteProduct(product.id, product.name)}
                                                className="rounded-lg p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
                                            >
                                                <Trash2 className="size-4"/>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                            {filteredProducts.length === 0 && (
                                <div className="py-16 text-center">
                                    <Package className="mx-auto size-10 text-slate-300"/>
                                    <p className="mt-3 text-sm font-bold text-slate-500">Tidak ada produk yang sesuai dengan kriteria pencarian.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'pesanan' && (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-slate-600">
                                <thead className="border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-500">
                                <tr>
                                    <th className="pb-3 px-3 font-extrabold">ID Order & Waktu</th>
                                    <th className="pb-3 px-3 font-extrabold">Pemesan</th>
                                    <th className="pb-3 px-3 font-extrabold">Detail Item</th>
                                    <th className="pb-3 px-3 font-extrabold">Total Bayar</th>
                                    <th className="pb-3 px-3 font-extrabold">Status</th>
                                    <th className="pb-3 px-3 font-extrabold text-right">Aksi</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                {filteredOrders.map((order) => (
                                    <tr key={order.id} className="group transition hover:bg-slate-50">
                                        <td className="py-4 px-3 whitespace-nowrap">
                                            <p className="font-mono text-xs font-bold text-blue-600">{order.id}</p>
                                            <p className="text-[11px] text-slate-500">{order.date}</p>
                                        </td>
                                        <td className="py-4 px-3">
                                            <p className="font-bold text-slate-900">{order.customerName}</p>
                                        </td>
                                        <td className="py-4 px-3">
                                            <p className="text-sm font-semibold text-slate-700">{order.productName}</p>
                                            <p className="text-[11px] text-slate-500">Kuantitas: {order.qty} pcs</p>
                                        </td>
                                        <td className="py-4 px-3 font-mono font-bold text-slate-900">
                                            {formatRupiah(order.totalPrice)}
                                        </td>
                                        <td className="py-4 px-3 whitespace-nowrap">
                                            {order.status === 'Selesai' && (
                                                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-[11px] font-bold text-emerald-700">
                            <CheckCircle2 className="size-3.5"/> Selesai
                          </span>
                                            )}
                                            {order.status === 'Diproses' && (
                                                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200 px-3 py-1 text-[11px] font-bold text-amber-700">
                            <Clock className="size-3.5"/> Diproses
                          </span>
                                            )}
                                            {order.status === 'Batal' && (
                                                <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 border border-rose-200 px-3 py-1 text-[11px] font-bold text-rose-700">
                            <XCircle className="size-3.5"/> Batal
                          </span>
                                            )}
                                        </td>
                                        <td className="py-4 px-3 text-right whitespace-nowrap">
                                            <select
                                                value={order.status}
                                                onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value as OrderStatus)}
                                                className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 outline-none transition focus:border-blue-500"
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
                        </div>
                    )}
                </section>
            </div>

            <AnimatePresence>
                {isAddModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsAddModalOpen(false)}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl sm:p-8"
                        >
                            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                                <div className="flex items-center gap-2.5 font-bold text-slate-900 text-base">
                                    <div className="flex size-8 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
                                        <Package className="size-4"/>
                                    </div>
                                    <span>Publikasikan Produk Baru</span>
                                </div>
                                <button
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition"
                                >
                                    <X className="size-5"/>
                                </button>
                            </div>

                            <div className="mt-6 space-y-4">
                                <div>
                                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">
                                        Nama Produk <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={newProductName}
                                        onChange={(e) => setNewProductName(e.target.value)}
                                        placeholder="Cth: Hoodie Ekraf HIMATIFA 2026"
                                        className="w-full rounded-xl border border-slate-300 bg-white p-3 text-sm font-medium text-slate-900 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">
                                        Kategori Produk
                                    </label>
                                    <select
                                        value={newProductCategory}
                                        onChange={(e) => setNewProductCategory(e.target.value)}
                                        className="w-full rounded-xl border border-slate-300 bg-white p-3 text-sm font-semibold text-slate-900 outline-none transition focus:border-blue-500"
                                    >
                                        <option value="Merchandise">Merchandise</option>
                                        <option value="Pakaian">Pakaian</option>
                                        <option value="Aksesoris">Aksesoris</option>
                                        <option value="Tas">Tas & Pouch</option>
                                    </select>
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">
                                            Jumlah Stok <span className="text-rose-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                value={newProductStock}
                                                onChange={(e) => setNewProductStock(e.target.value)}
                                                placeholder="50"
                                                className="w-full rounded-xl border border-slate-300 bg-white p-3 pr-12 text-sm font-bold text-slate-900 outline-none transition focus:border-blue-500"
                                            />
                                            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                        Unit
                      </span>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">
                                            Harga Jual <span className="text-rose-500">*</span>
                                        </label>
                                        <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                        Rp
                      </span>
                                            <input
                                                type="number"
                                                value={newProductPrice}
                                                onChange={(e) => setNewProductPrice(e.target.value)}
                                                placeholder="45000"
                                                className="w-full rounded-xl border border-slate-300 bg-white p-3 pl-10 text-sm font-mono font-bold text-slate-900 outline-none transition focus:border-blue-500"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 flex items-center justify-end gap-3 pt-5 border-t border-slate-100">
                                    <button
                                        type="button"
                                        onClick={() => setIsAddModalOpen(false)}
                                        className="rounded-xl px-4 py-2.5 text-sm font-bold text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleAddProduct}
                                        className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-700 active:scale-95"
                                    >
                                        <Plus className="size-4"/> Publisir ke Katalog
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