'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
    ArrowLeft,
    Minus,
    Plus,
    Trash2,
    ShoppingBag,
    CheckSquare2,
    Square
} from 'lucide-react'

interface CartItem {
    id: number
    name: string
    price: number
    qty: number
    category: string
    selected: boolean
    stock: number
}

export default function CartPage() {
    const [items, setItems] = useState<CartItem[]>([
        { id: 1, name: 'Jaket Himatifa 2026', price: 185000, qty: 1, category: 'Apparel', selected: true, stock: 50 },
        { id: 2, name: 'Lanyard Premium', price: 25000, qty: 2, category: 'Aksesoris', selected: true, stock: 15 },
    ])

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

    const isAllSelected = items.length > 0 && items.every(item => item.selected)

    const updateQty = (id: number, delta: number) => {
        setItems(items.map(item => {
            if (item.id === id) {
                const newQty = item.qty + delta
                if (newQty >= 1 && newQty <= item.stock) {
                    return { ...item, qty: newQty }
                }
            }
            return item
        }))
    }

    const toggleSelect = (id: number) => {
        setItems(items.map(item => item.id === id ? { ...item, selected: !item.selected } : item))
    }

    const toggleSelectAll = () => {
        const newState = !isAllSelected
        setItems(items.map(item => ({ ...item, selected: newState })))
    }

    const removeItem = (id: number) => {
        setItems(items.filter(item => item.id !== id))
    }

    const removeSelected = () => {
        setItems(items.filter(item => !item.selected))
    }

    return (
        <main className="min-h-screen bg-[#f8fafc] text-slate-800 selection:bg-blue-200">

            <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/60 px-4 py-4 sm:px-6 lg:px-10">
                <div className="mx-auto flex max-w-6xl items-center gap-4">
                    <Link href="/ekrafstore" className="grid size-10 place-items-center rounded-full bg-slate-100 text-slate-600 transition-colors hover:bg-slate-200 hover:text-[#2563eb]">
                        <ArrowLeft className="size-5" />
                    </Link>
                    <div>
                        <h1 className="text-lg font-black tracking-tight text-slate-900">Keranjang Belanja</h1>
                        <p className="text-xs font-medium text-slate-500">{items.length} Barang</p>
                    </div>
                </div>
            </header>

            <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-10 lg:py-8 mb-32 lg:mb-10">

                {items.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white py-24 px-4 text-center"
                    >
                        <div className="mb-5 grid size-20 place-items-center rounded-full bg-slate-100 text-slate-400">
                            <ShoppingBag className="size-8" />
                        </div>
                        <h2 className="text-xl font-black text-slate-800">Keranjangmu masih kosong</h2>
                        <p className="mt-2 text-sm text-slate-500 max-w-sm">Temukan berbagai merchandise dan kebutuhan digital menarik di Ekrafstore.</p>
                        <Link href="/ekrafstore" className="mt-8 rounded-full bg-[#2563eb] px-8 py-3.5 text-sm font-bold text-white transition-all hover:bg-blue-700 shadow-lg shadow-blue-500/30">
                            Mulai Belanja
                        </Link>
                    </motion.div>
                ) : (
                    <div className="grid gap-6 lg:grid-cols-12 lg:items-start lg:gap-8">

                        <div className="lg:col-span-8 flex flex-col gap-4">

                            <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                                <button onClick={toggleSelectAll} className="flex items-center gap-3 text-sm font-bold text-slate-700 hover:text-[#2563eb]">
                                    {isAllSelected ? <CheckSquare2 className="size-5 text-[#2563eb]" /> : <Square className="size-5 text-slate-400" />}
                                    Pilih Semua
                                </button>
                                {selectedCount > 0 && (
                                    <button onClick={removeSelected} className="text-sm font-bold text-red-500 hover:text-red-600">
                                        Hapus
                                    </button>
                                )}
                            </div>

                            <div className="flex flex-col gap-4">
                                <AnimatePresence>
                                    {items.map((item) => (
                                        <motion.div
                                            key={item.id}
                                            layout
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.95, height: 0, marginBottom: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:border-[#2563eb]/30"
                                        >
                                            <button onClick={() => toggleSelect(item.id)} className="mt-3 shrink-0">
                                                {item.selected ? <CheckSquare2 className="size-5 text-[#2563eb]" /> : <Square className="size-5 text-slate-300" />}
                                            </button>

                                            <div className="aspect-square size-20 sm:size-24 shrink-0 rounded-xl bg-slate-100 border border-slate-100" />

                                            <div className="flex flex-1 flex-col justify-between">
                                                <div>
                                                    <div className="flex justify-between gap-2">
                                                        <h3 className="text-sm sm:text-base font-extrabold text-slate-800 line-clamp-2">{item.name}</h3>
                                                        <button onClick={() => removeItem(item.id)} className="text-slate-400 hover:text-red-500 sm:hidden">
                                                            <Trash2 className="size-4" />
                                                        </button>
                                                    </div>
                                                    <span className="mt-1 inline-block rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-slate-500">
                            {item.category}
                          </span>
                                                    <p className="mt-2 text-sm sm:text-base font-black text-[#2563eb]">Rp {item.price.toLocaleString('id-ID')}</p>
                                                </div>

                                                <div className="mt-3 flex items-center justify-between">
                                                    <button onClick={() => removeItem(item.id)} className="hidden items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-red-500 sm:flex">
                                                        <Trash2 className="size-3.5" /> Hapus
                                                    </button>

                                                    <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-1 ml-auto">
                                                        <button
                                                            onClick={() => updateQty(item.id, -1)}
                                                            disabled={item.qty <= 1}
                                                            className="grid size-6 place-items-center rounded bg-white text-slate-600 shadow-sm disabled:opacity-50"
                                                        >
                                                            <Minus className="size-3" />
                                                        </button>
                                                        <span className="w-5 text-center text-xs font-bold">{item.qty}</span>
                                                        <button
                                                            onClick={() => updateQty(item.id, 1)}
                                                            disabled={item.qty >= item.stock}
                                                            className="grid size-6 place-items-center rounded bg-white text-slate-600 shadow-sm disabled:opacity-50"
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

                        <div className="lg:sticky lg:top-24 lg:col-span-4 flex flex-col gap-4">

                            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                                <h3 className="mb-4 text-base font-extrabold text-slate-800">Ringkasan Belanja</h3>

                                <div className="flex flex-col gap-3 text-sm border-b border-slate-100 pb-4">
                                    <div className="flex justify-between text-slate-500">
                                        <span>Total Harga ({selectedCount} Barang)</span>
                                        <span className="font-semibold text-slate-700">Rp {total.toLocaleString('id-ID')}</span>
                                    </div>
                                    <div className="flex justify-between text-slate-500">
                                        <span>Total Diskon Barang</span>
                                        <span className="font-semibold text-green-500">- Rp 0</span>
                                    </div>
                                </div>

                                <div className="mt-4 flex items-center justify-between">
                                    <span className="text-sm font-extrabold text-slate-800">Total Tagihan</span>
                                    <span className="text-xl font-black text-[#2563eb]">Rp {total.toLocaleString('id-ID')}</span>
                                </div>

                                <button
                                    disabled={selectedCount === 0}
                                    className="mt-6 hidden w-full rounded-full bg-[#2563eb] py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition-all hover:bg-blue-700 disabled:bg-slate-300 disabled:shadow-none lg:block"
                                >
                                    Beli ({selectedCount})
                                </button>
                            </div>
                        </div>

                    </div>
                )}
            </div>

            {items.length > 0 && (
                <div className="fixed inset-x-0 bottom-0 z-50 flex items-center justify-between border-t border-slate-200 bg-white px-4 py-3 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] lg:hidden">
                    <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-500">Total Tagihan</span>
                        <span className="text-lg font-black text-[#2563eb]">Rp {total.toLocaleString('id-ID')}</span>
                    </div>
                    <Link
                        href={selectedCount > 0 ? "/ekrafstore/checkout" : "#"}
                        className={`rounded-full px-8 py-3 text-sm font-bold text-white transition-all ${
                            selectedCount > 0
                                ? 'bg-[#2563eb] shadow-lg shadow-blue-500/30 active:scale-95'
                                : 'bg-slate-300 cursor-not-allowed'
                        }`}
                    >
                        Beli ({selectedCount})
                    </Link>
                </div>
            )}
        </main>
    )
}