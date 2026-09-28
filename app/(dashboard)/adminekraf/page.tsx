'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Package,
  ShoppingBag,
  DollarSign,
  Plus,
  Search,
  Edit,
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
  Store
} from 'lucide-react'
import Link from 'next/link'

// --- Tipe Data ---
interface Product {
  id: string
  name: string
  category: string
  stock: number
  price: number
  salesCount: number
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

// --- Helper Formatter Rupiah ---
const formatRupiah = (val: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(val)
}

// --- Initial Data ---
const initialProducts: Product[] = [
  { id: 'p-1', name: 'Lanyard HIMATIFA Eksklusif', category: 'Merchandise', stock: 45, price: 35000, salesCount: 112 },
  { id: 'p-2', name: 'PDH Resmi HIMATIFA 2026', category: 'Pakaian', stock: 12, price: 165000, salesCount: 88 },
  { id: 'p-3', name: 'Gantungan Kunci Acryclic Logo', category: 'Merchandise', stock: 80, price: 12000, salesCount: 150 },
  { id: 'p-4', name: 'Sticker Pack Informatika (5 Pcs)', category: 'Aksesoris', stock: 120, price: 15000, salesCount: 210 },
  { id: 'p-5', name: 'Tote Bag Kanvas Premium HIMATIFA', category: 'Tas', stock: 25, price: 55000, salesCount: 40 }
]

const initialOrders: Order[] = [
  { id: 'ORD-1001', customerName: 'Rizky Febrian', productName: 'Lanyard HIMATIFA Eksklusif', qty: 2, totalPrice: 70000, date: '25 Sep 2026', status: 'Diproses' },
  { id: 'ORD-1002', customerName: 'Siti Nurhaliza', productName: 'PDH Resmi HIMATIFA 2026', qty: 1, totalPrice: 165000, date: '24 Sep 2026', status: 'Selesai' },
  { id: 'ORD-1003', customerName: 'Ahmad Dahlan', productName: 'Sticker Pack Informatika (5 Pcs)', qty: 3, totalPrice: 45000, date: '24 Sep 2026', status: 'Selesai' },
  { id: 'ORD-1004', customerName: 'Budi Santoso', productName: 'Tote Bag Kanvas Premium HIMATIFA', qty: 1, totalPrice: 55000, date: '22 Sep 2026', status: 'Batal' }
]

export default function AdminEkrafPage() {
  // --- States ---
  const [activeTab, setActiveTab] = useState<'produk' | 'pesanan'>('produk')
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [orders, setOrders] = useState<Order[]>(initialOrders)
  const [searchQuery, setSearchQuery] = useState('')

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  
  // Form Add Product State
  const [newProductName, setNewProductName] = useState('')
  const [newProductCategory, setNewProductCategory] = useState('Merchandise')
  const [newProductStock, setNewProductStock] = useState('')
  const [newProductPrice, setNewProductPrice] = useState('')

  // --- Dynamic Stats Calculations ---
  const { totalActiveProducts, totalOrdersThisMonth, grossRevenue } = useMemo(() => {
    const activeProds = products.length
    const totalOrders = orders.length
    const revenue = orders
      .filter((o) => o.status === 'Selesai')
      .reduce((sum, o) => sum + o.totalPrice, 0)

    return {
      totalActiveProducts: activeProds,
      totalOrdersThisMonth: totalOrders,
      grossRevenue: revenue
    }
  }, [products, orders])

  // --- Handlers ---
  const handleAddProduct = () => {
    const stockNum = parseInt(newProductStock, 10)
    const priceNum = parseFloat(newProductPrice)

    if (!newProductName.trim() || isNaN(stockNum) || isNaN(priceNum)) {
      alert('Mohon isi semua bidang formulir dengan benar!')
      return
    }

    const newProd: Product = {
      id: `p-${Date.now()}`,
      name: newProductName,
      category: newProductCategory,
      stock: stockNum,
      price: priceNum,
      salesCount: 0
    }

    setProducts([newProd, ...products])

    // Reset Form
    setNewProductName('')
    setNewProductStock('')
    setNewProductPrice('')
    setIsAddModalOpen(false)
  }

  const handleDeleteProduct = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus produk ini dari katalog?')) {
      setProducts(products.filter((p) => p.id !== id))
    }
  }

  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders(
      orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    )
  }

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [products, searchQuery])

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter(
      (o) =>
        o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.productName.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [orders, searchQuery])

  return (
    <main className="min-h-screen bg-[#f4f8fc] text-[#0a192f] selection:bg-blue-200">
      {/* Background Meshes */}
      <div className="fixed left-0 top-0 -z-10 h-full w-full overflow-hidden">
        <div className="absolute -left-20 -top-20 h-[450px] w-[450px] rounded-full bg-blue-300/20 blur-[120px]" />
        <div className="absolute right-0 top-1/3 h-[500px] w-[500px] rounded-full bg-orange-200/20 blur-[140px]" />
      </div>

      {/* Header Navigation */}
      <header className="fixed inset-x-0 top-0 z-40 px-4 pt-4 sm:px-6 lg:px-10">
        <nav className="mx-auto flex max-w-7xl items-center justify-between rounded-full border border-white/80 bg-white/70 px-5 py-3 shadow-lg shadow-blue-900/5 backdrop-blur-xl">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-black tracking-tight text-[#0a192f] transition hover:text-[#2563eb]"
          >
            <ArrowLeft className="size-4" /> Kembali Dashboard
          </Link>
          <div className="flex items-center gap-2 text-sm font-black text-[#2563eb]">
            <Store className="size-4" />
            <span>EKRAF STORE HIMATIFA</span>
          </div>
        </nav>
      </header>

      <div className="mx-auto max-w-7xl px-6 pb-24 pt-32 lg:px-10">
        {/* Page Header */}
        <header className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/80 px-3.5 py-1 backdrop-blur">
              <ShieldCheck className="size-3.5 text-[#2563eb]" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#2563eb]">
                Manajemen Kewirausahaan & Merchandising
              </span>
            </div>
            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
              Ekraf <span className="text-[#2563eb]">Dashboard.</span>
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Kelola katalog produk, inventaris stok, dan pantau pesanan Ekraf Store secara terpusat.
            </p>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 rounded-2xl bg-[#2563eb] px-5 py-3 text-xs font-bold text-white shadow-xl shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700"
          >
            <Plus className="size-4" /> Tambah Produk Baru
          </button>
        </header>

        {/* Dynamic Statistics Grid */}
        <div className="mb-8 grid gap-5 sm:grid-cols-3">
          {[
            {
              label: 'Total Produk Aktif',
              value: totalActiveProducts.toString(),
              subText: 'Produk siap dipesan',
              icon: Package,
              color: 'text-blue-600',
              bg: 'bg-blue-100/80'
            },
            {
              label: 'Pesanan Masuk',
              value: totalOrdersThisMonth.toString(),
              subText: 'Transaksi bulan ini',
              icon: ShoppingBag,
              color: 'text-amber-600',
              bg: 'bg-amber-100/80'
            },
            {
              label: 'Pendapatan Kotor (Selesai)',
              value: formatRupiah(grossRevenue),
              subText: 'Akumulasi transaksi berhasil',
              icon: DollarSign,
              color: 'text-emerald-600',
              bg: 'bg-emerald-100/80'
            }
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-[2.5rem] border border-white/80 bg-white/80 p-6 shadow-xl shadow-blue-900/5 backdrop-blur-xl transition hover:shadow-2xl"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{stat.label}</p>
                  <p className="mt-2 text-2xl font-black text-[#0a192f] sm:text-3xl">{stat.value}</p>
                  <p className="mt-1 text-xs font-semibold text-slate-400">{stat.subText}</p>
                </div>
                <div className={`grid size-12 place-items-center rounded-2xl ${stat.bg} ${stat.color} shadow-inner`}>
                  <stat.icon className="size-6" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Data Table Container */}
        <section className="rounded-[2.5rem] border border-white/80 bg-white/80 p-6 shadow-xl shadow-blue-900/5 backdrop-blur-xl sm:p-8">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-5">
            {/* Navigation Tabs */}
            <div className="flex gap-2 rounded-2xl bg-slate-100 p-1.5 text-xs font-bold">
              <button
                onClick={() => setActiveTab('produk')}
                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 transition ${
                  activeTab === 'produk'
                    ? 'bg-white text-[#2563eb] shadow-md'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Boxes className="size-4" /> Katalog Produk ({products.length})
              </button>
              <button
                onClick={() => setActiveTab('pesanan')}
                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 transition ${
                  activeTab === 'pesanan'
                    ? 'bg-white text-[#2563eb] shadow-md'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <ShoppingBag className="size-4" /> Daftar Pesanan ({orders.length})
              </button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder={activeTab === 'produk' ? 'Cari produk/kategori...' : 'Cari pesanan/pembeli...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-2xl border border-slate-200/80 bg-slate-50/50 pl-10 pr-4 py-2.5 text-xs font-medium outline-none transition focus:border-[#2563eb] focus:bg-white focus:ring-2 focus:ring-blue-500/20 sm:w-64"
              />
            </div>
          </div>

          {/* TAB 1: Katalog Produk */}
          {activeTab === 'produk' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="border-b border-slate-100 text-[11px] uppercase tracking-wider text-slate-400">
                  <tr>
                    <th className="pb-3.5 font-extrabold">Nama Produk</th>
                    <th className="pb-3.5 font-extrabold">Kategori</th>
                    <th className="pb-3.5 font-extrabold">Status Stok</th>
                    <th className="pb-3.5 font-extrabold">Harga</th>
                    <th className="pb-3.5 font-extrabold text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="group transition hover:bg-slate-50/80">
                      <td className="py-4">
                        <p className="font-bold text-[#0a192f]">{product.name}</p>
                        <p className="text-[11px] text-slate-400">Terjual: {product.salesCount} pcs</p>
                      </td>
                      <td className="py-4">
                        <span className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-2.5 py-1 text-[10px] font-bold text-blue-700 border border-blue-200/50">
                          <Tag className="size-3" /> {product.category}
                        </span>
                      </td>
                      <td className="py-4 whitespace-nowrap">
                        {product.stock > 15 ? (
                          <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700 border border-emerald-200/50">
                            {product.stock} Tersedia
                          </span>
                        ) : product.stock > 0 ? (
                          <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2.5 py-1 text-[10px] font-bold text-amber-700 border border-amber-200/50">
                            Menipis ({product.stock})
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-md bg-red-50 px-2.5 py-1 text-[10px] font-bold text-red-700 border border-red-200/50">
                            Habis
                          </span>
                        )}
                      </td>
                      <td className="py-4 font-mono font-bold text-[#0a192f]">
                        {formatRupiah(product.price)}
                      </td>
                      <td className="py-4 text-right whitespace-nowrap">
                        <button
                          title="Hapus Produk"
                          onClick={() => handleDeleteProduct(product.id)}
                          className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-500"
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
                  <p className="mt-2 text-sm font-bold text-slate-400">Tidak ada produk yang cocok ditemukan.</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Daftar Pesanan */}
          {activeTab === 'pesanan' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="border-b border-slate-100 text-[11px] uppercase tracking-wider text-slate-400">
                  <tr>
                    <th className="pb-3.5 font-extrabold">ID & Tanggal</th>
                    <th className="pb-3.5 font-extrabold">Pembeli & Item</th>
                    <th className="pb-3.5 font-extrabold">Total Transaksi</th>
                    <th className="pb-3.5 font-extrabold">Status Pesanan</th>
                    <th className="pb-3.5 font-extrabold text-right">Ubah Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="group transition hover:bg-slate-50/80">
                      <td className="py-4 whitespace-nowrap">
                        <p className="font-mono text-xs font-bold text-[#0a192f]">{order.id}</p>
                        <p className="text-[11px] text-slate-400">{order.date}</p>
                      </td>
                      <td className="py-4">
                        <p className="font-bold text-[#0a192f]">{order.customerName}</p>
                        <p className="text-xs font-medium text-slate-400">
                          {order.productName} ({order.qty}x)
                        </p>
                      </td>
                      <td className="py-4 font-mono font-bold text-[#0a192f]">
                        {formatRupiah(order.totalPrice)}
                      </td>
                      <td className="py-4 whitespace-nowrap">
                        {order.status === 'Selesai' && (
                          <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700 border border-emerald-200/50">
                            <CheckCircle2 className="size-3" /> Selesai
                          </span>
                        )}
                        {order.status === 'Diproses' && (
                          <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2.5 py-1 text-[10px] font-bold text-amber-700 border border-amber-200/50">
                            <Clock className="size-3" /> Diproses
                          </span>
                        )}
                        {order.status === 'Batal' && (
                          <span className="inline-flex items-center gap-1 rounded-md bg-red-50 px-2.5 py-1 text-[10px] font-bold text-red-700 border border-red-200/50">
                            <XCircle className="size-3" /> Batal
                          </span>
                        )}
                      </td>
                      <td className="py-4 text-right whitespace-nowrap">
                        <select
                          value={order.status}
                          onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value as OrderStatus)}
                          className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold outline-none transition focus:border-blue-500 focus:bg-white"
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
                  <p className="mt-2 text-sm font-bold text-slate-400">Tidak ada pesanan yang sesuai pencarian.</p>
                </div>
              )}
            </div>
          )}
        </section>
      </div>

      {/* Modal Tambah Produk Baru */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddModalOpen(false)}
              className="absolute inset-0 bg-[#0a192f]/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg overflow-hidden rounded-[2.5rem] border border-white/80 bg-white/95 p-6 shadow-2xl backdrop-blur-2xl sm:p-8"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2 font-black text-[#0a192f]">
                  <Package className="size-5 text-[#2563eb]" /> Tambah Produk Ekraf
                </div>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="rounded-full bg-slate-100 p-2 text-slate-500 hover:bg-slate-200 transition"
                >
                  <X className="size-4" />
                </button>
              </div>

              <div className="mt-6 space-y-4">
                {/* Nama Produk */}
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">
                    Nama Produk <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newProductName}
                    onChange={(e) => setNewProductName(e.target.value)}
                    placeholder="Cth: Polo Shirt HIMATIFA"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3.5 text-sm font-medium outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                {/* Kategori */}
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">
                    Kategori Produk
                  </label>
                  <select
                    value={newProductCategory}
                    onChange={(e) => setNewProductCategory(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3.5 text-sm font-bold outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="Merchandise">Merchandise</option>
                    <option value="Pakaian">Pakaian</option>
                    <option value="Aksesoris">Aksesoris</option>
                    <option value="Tas">Tas & Pouch</option>
                  </select>
                </div>

                {/* Stok & Harga */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">
                      Jumlah Stok <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={newProductStock}
                      onChange={(e) => setNewProductStock(e.target.value)}
                      placeholder="Cth: 50"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3.5 text-sm font-bold outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">
                      Harga Jual (Rp) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={newProductPrice}
                      onChange={(e) => setNewProductPrice(e.target.value)}
                      placeholder="Cth: 45000"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3.5 text-sm font-mono font-bold outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                </div>

                <button
                  onClick={handleAddProduct}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#2563eb] py-4 text-sm font-bold text-white shadow-xl shadow-blue-600/20 transition hover:bg-blue-700"
                >
                  <Plus className="size-4" /> Publisir Produk ke Store
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  )
}