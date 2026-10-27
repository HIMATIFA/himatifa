'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
    ArrowLeft,
    Check,
    Clock,
    Copy,
    Download,
    MapPin,
    MessageCircle,
    Package,
    Receipt,
    ShieldCheck
} from 'lucide-react'

interface OrderItem {
    id: number
    name: string
    price: number
    qty: number
    category: string
}

export default function OrderDetailPage() {
    const params = useParams()
    const rawId = typeof params?.id === 'string' ? params.id : 'ORD123'
    const orderId = rawId.toUpperCase()

    const [copied, setCopied] = useState(false)

    const items: OrderItem[] = [
        { id: 1, name: 'Jaket Himatifa 2026', price: 185000, qty: 1, category: 'Apparel' },
        { id: 2, name: 'Lanyard Premium', price: 25000, qty: 2, category: 'Aksesoris' },
    ]

    const subtotal = items.reduce((acc, item) => acc + item.price * item.qty, 0)
    const adminFee = 0
    const grandTotal = subtotal + adminFee

    const handleCopyAccount = () => {
        navigator.clipboard.writeText('7123456789')
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <main className="min-h-screen bg-slate-50 text-slate-800 selection:bg-blue-100">
            <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 px-4 py-4 backdrop-blur-md sm:px-6 lg:px-8">
                <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
                    <Link
                        href="/ekrafstore"
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs sm:text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 hover:text-blue-600"
                    >
                        <ArrowLeft className="size-4" />
                        <span>Kembali ke Toko</span>
                    </Link>

                    <button className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-xs transition-colors hover:bg-slate-50 hover:text-blue-600">
                        <Download className="size-3.5 text-blue-600" />
                        <span>Unduh Invoice</span>
                    </button>
                </div>
            </header>

            <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10 mb-16">
                <div className="mb-6 overflow-hidden rounded-2xl border border-amber-200 bg-amber-50/60 p-6 sm:p-8 shadow-sm">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <span className="inline-block rounded-md border border-amber-300 bg-amber-100/80 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-800 mb-2">
                                ID Pesanan: HMTF-{orderId}
                            </span>
                            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                                Menunggu Pembayaran
                            </h1>
                            <p className="mt-1 text-xs sm:text-sm text-slate-600 font-normal">
                                Selesaikan pembayaran sebelum <strong className="font-semibold text-slate-900">27 Sep 2026, 14:00 WIB</strong>.
                            </p>
                        </div>
                        <div className="grid size-12 sm:size-14 shrink-0 place-items-center rounded-xl border border-amber-300 bg-white text-amber-600 shadow-xs">
                            <Clock className="size-6 sm:size-7" />
                        </div>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr] lg:items-start">
                    <div className="flex flex-col gap-6">
                        <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7 shadow-sm">
                            <h2 className="mb-5 flex items-center gap-2 text-sm sm:text-base font-bold text-slate-900">
                                <Package className="size-4.5 text-blue-600" />
                                <span>Rincian Produk</span>
                            </h2>

                            <div className="flex flex-col gap-4 border-b border-slate-100 pb-5">
                                {items.map((item) => (
                                    <div key={item.id} className="flex items-center justify-between gap-4">
                                        <div className="flex items-center gap-3.5">
                                            <div className="size-14 shrink-0 rounded-xl bg-slate-100 border border-slate-200/80 flex items-center justify-center text-slate-400">
                                                <Package className="size-5" />
                                            </div>
                                            <div>
                                                <p className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-1">
                                                    {item.name}
                                                </p>
                                                <span className="text-[10px] font-semibold uppercase tracking-wider text-blue-600">
                                                    {item.category}
                                                </span>
                                                <p className="text-xs text-slate-500 font-normal mt-0.5">
                                                    {item.qty} × Rp {item.price.toLocaleString('id-ID')}
                                                </p>
                                            </div>
                                        </div>
                                        <span className="text-xs sm:text-sm font-extrabold text-slate-900 shrink-0">
                                            Rp {(item.qty * item.price).toLocaleString('id-ID')}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-5 flex flex-col gap-2.5 text-xs sm:text-sm">
                                <div className="flex justify-between text-slate-600 font-normal">
                                    <span>Subtotal Produk</span>
                                    <span className="font-semibold text-slate-900">
                                        Rp {subtotal.toLocaleString('id-ID')}
                                    </span>
                                </div>
                                <div className="flex justify-between text-slate-600 font-normal">
                                    <span>Biaya Layanan</span>
                                    <span className="font-semibold text-emerald-600">Gratis</span>
                                </div>
                                <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
                                    <span className="font-bold text-slate-900">Total Tagihan</span>
                                    <span className="text-lg sm:text-xl font-extrabold text-blue-600">
                                        Rp {grandTotal.toLocaleString('id-ID')}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7 shadow-sm">
                            <h2 className="mb-5 flex items-center gap-2 text-sm sm:text-base font-bold text-slate-900">
                                <MapPin className="size-4.5 text-blue-600" />
                                <span>Informasi Pengambilan / Penerima</span>
                            </h2>

                            <div className="grid gap-4 sm:grid-cols-2 text-xs sm:text-sm">
                                <div>
                                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                        Nama Penerima
                                    </p>
                                    <p className="mt-1 font-bold text-slate-900">
                                        Muhammad Arya <span className="text-slate-500 font-normal">(20261337001)</span>
                                    </p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                        Kontak WhatsApp
                                    </p>
                                    <p className="mt-1 font-bold text-slate-900">
                                        0812-3456-7890
                                    </p>
                                </div>
                                <div className="sm:col-span-2">
                                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                        Lokasi Pengambilan
                                    </p>
                                    <p className="mt-1 font-semibold text-slate-800 leading-relaxed">
                                        Sekretariat HIMATIFA UMSura, Gedung G Lt. 3, Kampus Sutorejo.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 sm:p-7 text-white shadow-md">
                        <h3 className="mb-4 flex items-center gap-2 text-sm sm:text-base font-bold text-white">
                            <Receipt className="size-4.5 text-blue-400" />
                            <span>Instruksi Pembayaran</span>
                        </h3>

                        <p className="text-xs sm:text-sm leading-relaxed text-slate-300 font-normal">
                            Transfer sesuai nominal tagihan ke rekening resmi berikut:
                        </p>

                        <div className="mt-5 rounded-xl border border-slate-800 bg-slate-950 p-4">
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-blue-400">
                                Bank BSI (Bank Syariah Indonesia)
                            </span>
                            <div className="mt-2 flex items-center justify-between">
                                <p className="text-xl sm:text-2xl font-extrabold tracking-wider text-white">
                                    7123 4567 89
                                </p>
                                <button
                                    onClick={handleCopyAccount}
                                    className="flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1.5 text-xs font-semibold text-slate-300 transition-colors hover:border-blue-500 hover:text-white"
                                    title="Salin No. Rekening"
                                >
                                    {copied ? (
                                        <>
                                            <Check className="size-3.5 text-emerald-400" />
                                            <span className="text-emerald-400">Tersalin</span>
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="size-3.5 text-blue-400" />
                                            <span>Salin</span>
                                        </>
                                    )}
                                </button>
                            </div>
                            <p className="mt-1 text-xs text-slate-400 font-normal">
                                a.n. HIMATIFA UMSurabaya
                            </p>
                        </div>

                        <div className="mt-6 border-t border-slate-800 pt-5">
                            <div className="flex items-center gap-2 text-xs text-slate-300 mb-4">
                                <ShieldCheck className="size-4 text-blue-400 shrink-0" />
                                <span>Konfirmasi manual untuk pemrosesan cepat.</span>
                            </div>

                            <a
                                href={`https://wa.me/6281234567890?text=Halo%20Admin,%20saya%20ingin%20konfirmasi%20pembayaran%20pesanan%20HMTF-${orderId}`}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-xs sm:text-sm font-semibold text-white transition-all hover:bg-blue-500 active:scale-[0.98]"
                            >
                                <MessageCircle className="size-4" />
                                <span>Konfirmasi via WhatsApp</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}