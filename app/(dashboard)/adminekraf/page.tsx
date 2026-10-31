'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    initialEkrafProducts,
    initialEkrafOrders,
    ekrafCategories,
    type EkrafProduct,
    type EkrafOrder,
    type OrderStatus
} from '@/app/data'
import {
    Package,
    ShoppingBag,
    DollarSign,
    Plus,
    Search,
    Trash2,
    X,
    ShieldCheck,
    CheckCircle2,
    Clock,
    XCircle,
    Tag,
    Boxes,
    TrendingUp,
    Sparkles,
    ArrowUpRight, ChevronRight
} from 'lucide-react'

const formatRupiah = (val: number): string => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0
    }).format(val)
}

export default function AdminEkrafPage() {
    const [activeTab, setActiveTab] = useState<'produk' | 'pesanan'>('produk')
    const [products, setProducts] = useState<EkrafProduct[]>(initialEkrafProducts)
    const [orders, setOrders] = useState<EkrafOrder[]>(initialEkrafOrders)
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

        const newProd: EkrafProduct = {
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
        <div className="space-y-6 font-sans">
            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, y: -16, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -16, scale: 0.98 }}
                        className="fixed top-6 right-6 z-50 flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-lg"
                    >
                        {toast.type === 'success' && <CheckCircle2 className="size-4.5 text-emerald-600"/>}
                        {toast.type === 'error' && <XCircle className="size-4.5 text-red-600"/>}
                        {toast.type === 'info' && <Sparkles className="size-4.5 text-blue-600"/>}
                        <span className="text-xs font-semibold text-slate-700">{toast.message}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center border-b border-slate-200 pb-5">
                <div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 mb-1">
                        <span>SIM HIMATIFA</span>
                        <ChevronRight className="size-3 text-slate-400" />
                        <span className="text-slate-500">Bidang Ekonomi Kreatif & Usaha Mandiri</span>
                    </div>
                    <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                        Manajemen Ekonomi <span className="text-blue-600">Kreatif</span>
                    </h1>
                    <p className="mt-1 text-xs sm:text-sm text-slate-500">
                        Kelola inventaris merchandise resmi HIMATIFA, pantau ketersediaan stok, dan perbarui status pesanan.
                    </p>
                </div>

                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-blue-600/10 transition hover:bg-blue-500 active:scale-[0.98] cursor-pointer shrink-0"
                >
                    <Plus className="size-4" />
                    <span>Tambah Produk Baru</span>
                </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                    {
                        label: 'Total Katalog Aktif',
                        value: totalActiveProducts.toString(),
                        subText: `${lowStockCount} produk stok menipis`,
                        icon: Package,
                        badge: '+2 Baru',
                        badgeColor: 'text-blue-700 bg-blue-50 border-blue-200'
                    },
                    {
                        label: 'Pesanan Masuk',
                        value: totalOrdersThisMonth.toString(),
                        subText: 'Transaksi bulan ini',
                        icon: ShoppingBag,
                        badge: '92% Diproses',
                        badgeColor: 'text-amber-700 bg-amber-50 border-amber-200'
                    },
                    {
                        label: 'Pendapatan Kotor',
                        value: formatRupiah(grossRevenue),
                        subText: 'Akumulasi status selesai',
                        icon: DollarSign,
                        badge: '+18.4%',
                        badgeColor: 'text-emerald-700 bg-emerald-50 border-emerald-200'
                    },
                    {
                        label: 'Item Terjual',
                        value: `${products.reduce((acc, curr) => acc + curr.salesCount, 0)} Pcs`,
                        subText: 'Total penjualan akumulatif',
                        icon: TrendingUp,
                        badge: 'Popular',
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
                                <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-extrabold ${stat.badgeColor}`}>
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
                    <div className="flex gap-1 rounded-xl bg-slate-100 p-1 text-xs font-semibold">
                        <button
                            onClick={() => { setActiveTab('produk'); setSearchQuery('') }}
                            className={`flex items-center gap-2 rounded-lg px-3.5 py-2 transition cursor-pointer ${
                                activeTab === 'produk'
                                    ? 'bg-white text-blue-600 shadow-xs'
                                    : 'text-slate-600 hover:text-slate-900'
                            }`}
                        >
                            <Boxes className="size-4" />
                            <span>Katalog Produk ({products.length})</span>
                        </button>
                        <button
                            onClick={() => { setActiveTab('pesanan'); setSearchQuery('') }}
                            className={`flex items-center gap-2 rounded-lg px-3.5 py-2 transition cursor-pointer ${
                                activeTab === 'pesanan'
                                    ? 'bg-white text-blue-600 shadow-xs'
                                    : 'text-slate-600 hover:text-slate-900'
                            }`}
                        >
                            <ShoppingBag className="size-4" />
                            <span>Daftar Pesanan ({orders.length})</span>
                        </button>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        {activeTab === 'produk' && (
                            <div className="hidden sm:flex items-center gap-1 overflow-x-auto rounded-xl bg-slate-100 p-1">
                                {ekrafCategories.map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => setSelectedCategory(cat)}
                                        className={`rounded-lg px-3 py-1.5 text-[11px] font-bold transition cursor-pointer ${
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

                        <div className="relative flex-1 sm:w-64">
                            <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder={activeTab === 'produk' ? 'Cari nama atau SKU...' : 'Cari ID atau pemesan...'}
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
                </div>

                {activeTab === 'produk' && (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs text-slate-600">
                            <thead className="border-b border-slate-200 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 bg-slate-50/50">
                            <tr>
                                <th className="py-3 px-3">SKU & Informasi Produk</th>
                                <th className="py-3 px-3">Kategori</th>
                                <th className="py-3 px-3">Ketersediaan Stok</th>
                                <th className="py-3 px-3">Harga Jual</th>
                                <th className="py-3 px-3 text-right">Aksi</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                            {filteredProducts.map((product) => (
                                <tr key={product.id} className="group transition hover:bg-slate-50/80">
                                    <td className="py-3.5 px-3">
                                        <div className="flex items-center gap-3">
                                            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100 font-bold text-xs">
                                                {product.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900 group-hover:text-blue-600 transition">{product.name}</p>
                                                <span className="font-mono text-[10px] font-semibold text-slate-400">{product.sku}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-3.5 px-3">
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
                                                <span className="text-slate-500">{product.stock} pcs</span>
                                            </div>
                                            <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full transition-all ${
                                                        product.stock > 15 ? 'bg-emerald-500' : product.stock > 0 ? 'bg-amber-500' : 'bg-red-500'
                                                    }`}
                                                    style={{ width: `${Math.min((product.stock / 100) * 100, 100)}%` }}
                                                />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-3.5 px-3 font-mono font-bold text-slate-900">
                                        {formatRupiah(product.price)}
                                    </td>
                                    <td className="py-3.5 px-3 text-right whitespace-nowrap">
                                        <button
                                            title="Hapus Produk"
                                            onClick={() => handleDeleteProduct(product.id, product.name)}
                                            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-red-50 hover:text-red-600 cursor-pointer"
                                        >
                                            <Trash2 className="size-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                        {filteredProducts.length === 0 && (
                            <div className="py-12 text-center">
                                <Package className="mx-auto size-8 text-slate-300" />
                                <p className="mt-2 text-xs font-semibold text-slate-500">Tidak ada produk yang sesuai dengan pencarian.</p>
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
                                <th className="py-3 px-3">Detail Item</th>
                                <th className="py-3 px-3">Total Bayar</th>
                                <th className="py-3 px-3">Status Pesanan</th>
                                <th className="py-3 px-3 text-right">Update Status</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                            {filteredOrders.map((order) => (
                                <tr key={order.id} className="group transition hover:bg-slate-50/80">
                                    <td className="py-3.5 px-3 whitespace-nowrap">
                                        <p className="font-mono text-xs font-bold text-blue-600">{order.id}</p>
                                        <p className="text-[10px] text-slate-400 font-medium">{order.date}</p>
                                    </td>
                                    <td className="py-3.5 px-3 font-bold text-slate-900">
                                        {order.customerName}
                                    </td>
                                    <td className="py-3.5 px-3">
                                        <p className="font-semibold text-slate-800">{order.productName}</p>
                                        <p className="text-[10px] text-slate-400 font-medium">Qty: {order.qty} pcs</p>
                                    </td>
                                    <td className="py-3.5 px-3 font-mono font-bold text-slate-900">
                                        {formatRupiah(order.totalPrice)}
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
                                            onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value as OrderStatus)}
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
                    </div>
                )}
            </div>

            <AnimatePresence>
                {isAddModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsAddModalOpen(false)}
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
                                    <span>Publikasikan Produk Baru</span>
                                </div>
                                <button
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition cursor-pointer"
                                >
                                    <X className="size-4.5" />
                                </button>
                            </div>

                            <div className="mt-5 space-y-4">
                                <div>
                                    <label className="mb-1 block text-xs font-semibold text-slate-700">
                                        Nama Produk <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={newProductName}
                                        onChange={(e) => setNewProductName(e.target.value)}
                                        placeholder="Contoh: Hoodie Ekraf HIMATIFA 2026"
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 px-3.5 text-xs font-medium text-slate-900 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/10"
                                    />
                                </div>

                                <div>
                                    <label className="mb-1 block text-xs font-semibold text-slate-700">
                                        Kategori Produk
                                    </label>
                                    <select
                                        value={newProductCategory}
                                        onChange={(e) => setNewProductCategory(e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 px-3.5 text-xs font-semibold text-slate-900 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/10 cursor-pointer"
                                    >
                                        <option value="Merchandise">Merchandise</option>
                                        <option value="Pakaian">Pakaian</option>
                                        <option value="Aksesoris">Aksesoris</option>
                                        <option value="Tas">Tas & Pouch</option>
                                    </select>
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="mb-1 block text-xs font-semibold text-slate-700">
                                            Jumlah Stok <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                value={newProductStock}
                                                onChange={(e) => setNewProductStock(e.target.value)}
                                                placeholder="50"
                                                className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 pl-3.5 pr-12 text-xs font-bold text-slate-900 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/10"
                                            />
                                            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[11px] font-bold text-slate-400">
                                                Pcs
                                            </span>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="mb-1 block text-xs font-semibold text-slate-700">
                                            Harga Jual <span className="text-red-500">*</span>
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
                                                className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 pl-9 pr-3.5 text-xs font-mono font-bold text-slate-900 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/10"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
                                    <button
                                        type="button"
                                        onClick={() => setIsAddModalOpen(false)}
                                        className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition cursor-pointer"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleAddProduct}
                                        className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-blue-600/10 transition hover:bg-blue-500 active:scale-[0.98] cursor-pointer"
                                    >
                                        <Plus className="size-4" />
                                        <span>Publikasikan Produk</span>
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}