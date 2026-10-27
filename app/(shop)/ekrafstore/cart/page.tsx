'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
    ArrowLeft,
    Minus,
    Plus,
    Trash2,
    ShoppingBag,
    CheckSquare2,
    Square,
    ShieldCheck,
    ArrowRight
} from 'lucide-react'

export interface CartItem {
    id: string
    category: string
    name: string
    price: number
    priceLabel: string
    qty: number
    selected: boolean
}

export default function CartPage() {
    const [items, setItems] = useState<CartItem[]>([])
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        const loadCart = () => {
            try {
                const savedCart = localStorage.getItem('himatifa_cart')
                if (savedCart) {
                    setItems(JSON.parse(savedCart))
                } else {
                    setItems([])
                }
            } catch (err) {
                console.error('Gagal memuat keranjang:', err)
                setItems([])
            } finally {
                setIsLoaded(true)
            }
        }

        loadCart()
        window.addEventListener('storage', loadCart)
        return () => window.removeEventListener('storage', loadCart)
    }, [])

    const updateCart = (newItems: CartItem[]) => {
        setItems(newItems)
        localStorage.setItem('himatifa_cart', JSON.stringify(newItems))
    }

    const { total, selectedCount } = useMemo(() => {
        return items.reduce(
            (acc, item) => {
                if (item.selected) {
                    acc.total += item.price * item.qty
                    acc.selectedCount += item.qty
                }
                return acc
            },
            { total: 0, selectedCount: 0 }
        )
    }, [items])

    const isAllSelected = items.length > 0 && items.every((item) => item.selected)

    const updateQty = (id: string, delta: number) => {
        const updated = items.map((item) => {
            if (item.id === id) {
                const newQty = item.qty + delta
                if (newQty >= 1) {
                    return { ...item, qty: newQty }
                }
            }
            return item
        })
        updateCart(updated)
    }

    const toggleSelect = (id: string) => {
        const updated = items.map((item) =>
            item.id === id ? { ...item, selected: !item.selected } : item
        )
        updateCart(updated)
    }

    const toggleSelectAll = () => {
        const newState = !isAllSelected
        const updated = items.map((item) => ({ ...item, selected: newState }))
        updateCart(updated)
    }

    const removeItem = (id: string) => {
        const updated = items.filter((item) => item.id !== id)
        updateCart(updated)
    }

    const removeSelected = () => {
        const updated = items.filter((item) => !item.selected)
        updateCart(updated)
    }

    if (!isLoaded) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="size-8 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
            </div>
        )
    }

    return (
        <main className="min-h-screen bg-slate-50 text-slate-800 selection:bg-blue-100">
            <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 px-4 py-4 backdrop-blur-md sm:px-6 lg:px-8">
                <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <Link
                            href="/ekrafstore"
                            className="grid size-9 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-100 hover:text-blue-600"
                        >
                            <ArrowLeft className="size-4" />
                        </Link>
                        <div>
                            <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                                Keranjang Belanja
                            </h1>
                            <p className="text-xs text-slate-500 font-normal">
                                {items.length} Barang Tersimpan
                            </p>
                        </div>
                    </div>

                    <div className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                        <ShieldCheck className="size-4 text-blue-600" />
                        <span>Transaksi Aman & Terverifikasi</span>
                    </div>
                </div>
            </header>

            <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10 mb-28 lg:mb-12">
                {items.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white py-20 px-4 text-center shadow-sm"
                    >
                        <div className="mb-4 grid size-16 place-items-center rounded-xl bg-blue-50 text-blue-600">
                            <ShoppingBag className="size-8" />
                        </div>
                        <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                            Keranjangmu Masih Kosong
                        </h2>
                        <p className="mt-1.5 text-xs sm:text-sm text-slate-500 max-w-sm font-normal">
                            Temukan lisensi aplikasi digital, kebutuhan akademik, dan merchandise resmi HIMATIFA UMSURA.
                        </p>
                        <Link
                            href="/ekrafstore"
                            className="mt-6 rounded-xl bg-blue-600 px-6 py-3 text-xs sm:text-sm font-semibold text-white transition-all hover:bg-blue-500 active:scale-[0.98]"
                        >
                            Mulai Belanja Sekarang
                        </Link>
                    </motion.div>
                ) : (
                    <div className="grid gap-6 lg:grid-cols-12 lg:items-start lg:gap-8">
                        <div className="lg:col-span-8 flex flex-col gap-4">
                            <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                                <button
                                    onClick={toggleSelectAll}
                                    className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-slate-800 hover:text-blue-600 transition-colors"
                                >
                                    {isAllSelected ? (
                                        <CheckSquare2 className="size-5 text-blue-600" />
                                    ) : (
                                        <Square className="size-5 text-slate-300" />
                                    )}
                                    <span>Pilih Semua Barang ({items.length})</span>
                                </button>

                                {selectedCount > 0 && (
                                    <button
                                        onClick={removeSelected}
                                        className="text-xs sm:text-sm font-semibold text-red-600 hover:text-red-700 transition-colors"
                                    >
                                        Hapus Terpilih
                                    </button>
                                )}
                            </div>

                            <div className="flex flex-col gap-3">
                                <AnimatePresence>
                                    {items.map((item) => (
                                        <motion.div
                                            key={item.id}
                                            layout
                                            initial={{ opacity: 0, y: 12 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95, height: 0, marginBottom: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm transition-all hover:border-blue-300"
                                        >
                                            <button
                                                onClick={() => toggleSelect(item.id)}
                                                className="mt-1 shrink-0 text-slate-400 hover:text-blue-600 transition-colors"
                                            >
                                                {item.selected ? (
                                                    <CheckSquare2 className="size-5 text-blue-600" />
                                                ) : (
                                                    <Square className="size-5 text-slate-300" />
                                                )}
                                            </button>

                                            <div className="aspect-square size-20 sm:size-24 shrink-0 rounded-xl bg-slate-100 border border-slate-200/80 flex items-center justify-center text-slate-400">
                                                <ShoppingBag className="size-7" />
                                            </div>

                                            <div className="flex flex-1 flex-col justify-between">
                                                <div>
                                                    <div className="flex justify-between gap-2">
                                                        <h3 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-2">
                                                            {item.name}
                                                        </h3>
                                                        <button
                                                            onClick={() => removeItem(item.id)}
                                                            className="text-slate-400 hover:text-red-600 transition-colors sm:hidden"
                                                        >
                                                            <Trash2 className="size-4" />
                                                        </button>
                                                    </div>
                                                    <span className="mt-1 inline-block rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-blue-600">
                                                        {item.category}
                                                    </span>
                                                    <p className="mt-2 text-xs sm:text-sm font-extrabold text-blue-600">
                                                        {item.priceLabel || `Rp ${item.price.toLocaleString('id-ID')}`}
                                                    </p>
                                                </div>

                                                <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-100">
                                                    <button
                                                        onClick={() => removeItem(item.id)}
                                                        className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-red-600 transition-colors"
                                                    >
                                                        <Trash2 className="size-3.5" />
                                                        <span>Hapus</span>
                                                    </button>

                                                    <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-1 ml-auto">
                                                        <button
                                                            onClick={() => updateQty(item.id, -1)}
                                                            disabled={item.qty <= 1}
                                                            className="grid size-6 place-items-center rounded-lg bg-white border border-slate-200 text-slate-700 shadow-xs disabled:opacity-40"
                                                        >
                                                            <Minus className="size-3" />
                                                        </button>
                                                        <span className="w-6 text-center text-xs font-bold text-slate-800">
                                                            {item.qty}
                                                        </span>
                                                        <button
                                                            onClick={() => updateQty(item.id, 1)}
                                                            className="grid size-6 place-items-center rounded-lg bg-white border border-slate-200 text-slate-700 shadow-xs disabled:opacity-40"
                                                        >
                                                            <Plus className="size-3" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        </div>

                        <div className="lg:sticky lg:top-24 lg:col-span-4">
                            <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
                                <h3 className="mb-4 text-sm sm:text-base font-bold text-slate-900">
                                    Ringkasan Belanja
                                </h3>

                                <div className="flex flex-col gap-3 text-xs sm:text-sm border-b border-slate-100 pb-4">
                                    <div className="flex justify-between text-slate-600">
                                        <span>Total Harga ({selectedCount} Barang)</span>
                                        <span className="font-semibold text-slate-900">
                                            Rp {total.toLocaleString('id-ID')}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-slate-600">
                                        <span>Diskon Produk</span>
                                        <span className="font-semibold text-emerald-600">Rp 0</span>
                                    </div>
                                </div>

                                <div className="mt-4 flex items-center justify-between">
                                    <span className="text-xs sm:text-sm font-bold text-slate-900">Total Tagihan</span>
                                    <span className="text-base sm:text-lg font-extrabold text-blue-600">
                                        Rp {total.toLocaleString('id-ID')}
                                    </span>
                                </div>

                                <Link
                                    href={selectedCount > 0 ? '/ekrafstore/checkout' : '#'}
                                    className={`mt-6 hidden w-full items-center justify-center gap-2 rounded-xl py-3 text-xs sm:text-sm font-semibold text-white transition-all lg:flex ${
                                        selectedCount > 0
                                            ? 'bg-blue-600 hover:bg-blue-500 active:scale-[0.98]'
                                            : 'bg-slate-300 cursor-not-allowed'
                                    }`}
                                >
                                    <span>Lanjut ke Pembayaran ({selectedCount})</span>
                                    <ArrowRight className="size-4" />
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {items.length > 0 && (
                <div className="fixed inset-x-0 bottom-0 z-50 flex items-center justify-between border-t border-slate-200 bg-white px-4 py-3.5 shadow-md lg:hidden">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                            Total Tagihan
                        </span>
                        <span className="text-base font-extrabold text-blue-600">
                            Rp {total.toLocaleString('id-ID')}
                        </span>
                    </div>
                    <Link
                        href={selectedCount > 0 ? '/ekrafstore/checkout' : '#'}
                        className={`inline-flex items-center gap-1.5 rounded-xl px-5 py-2.5 text-xs font-semibold text-white transition-all ${
                            selectedCount > 0
                                ? 'bg-blue-600 active:scale-[0.98]'
                                : 'bg-slate-300 cursor-not-allowed'
                        }`}
                    >
                        <span>Checkout ({selectedCount})</span>
                        <ArrowRight className="size-3.5" />
                    </Link>
                </div>
            )}
        </main>
    )
}
