'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
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
    ShieldCheck,
    AlertTriangle,
    RefreshCw
} from 'lucide-react'

type PaymentMethod = 'qris' | 'transfer' | 'cod'

interface OrderItem {
    id: number | string
    name: string
    price: number
    qty: number
    category?: string
}

interface OrderData {
    orderId: string
    customerName: string
    customerPhone: string
    customerEmail: string
    paymentMethod: PaymentMethod
    selectedBank?: string
    items?: OrderItem[]
    baseTotal: number
    adminFee: number
    grandTotal: number
    createdAt: string
}

const bankAccounts: Record<string, { name: string; number: string; holder: string }> = {
    bca: { name: 'Bank BCA', number: '8012345678', holder: 'HIMATIFA UMSurabaya' },
    mandiri: { name: 'Bank Mandiri', number: '1420012345678', holder: 'HIMATIFA UMSurabaya' },
    bri: { name: 'Bank BRI', number: '002101001234530', holder: 'HIMATIFA UMSurabaya' },
    bni: { name: 'Bank BNI', number: '0123456789', holder: 'HIMATIFA UMSurabaya' },
    bsi: { name: 'Bank Syariah Indonesia (BSI)', number: '7123456789', holder: 'HIMATIFA UMSurabaya' },
    gopay: { name: 'GoPay', number: '081234567890', holder: 'a.n. HIMATIFA STORE' },
    dana: { name: 'DANA', number: '081234567890', holder: 'a.n. HIMATIFA STORE' },
    seabank: { name: 'SeaBank', number: '90123456789', holder: 'a.n. HIMATIFA STORE' },
}

export default function OrderDetailPage() {
    const params = useParams()
    const rawId = typeof params?.id === 'string' ? params.id : ''
    const orderId = rawId.toUpperCase()

    const [copied, setCopied] = useState(false)
    const [orderData, setOrderData] = useState<OrderData | null>(null)
    const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number }>({ hours: 23, minutes: 59, seconds: 59 })
    const [isExpired, setIsExpired] = useState(false)

    useEffect(() => {
        if (!rawId) return
        const savedOrder = localStorage.getItem(`himatifa_order_${rawId}`)
        if (savedOrder) {
            try {
                const parsed: OrderData = JSON.parse(savedOrder)
                setOrderData(parsed)
            } catch {
                setOrderData(null)
            }
        }
    }, [rawId])

    useEffect(() => {
        const createdAt = orderData?.createdAt ? new Date(orderData.createdAt).getTime() : Date.now()
        const expiryTime = createdAt + 24 * 60 * 60 * 1000

        const updateTimer = () => {
            const now = Date.now()
            const diff = expiryTime - now

            if (diff <= 0) {
                setIsExpired(true)
                setTimeLeft({ hours: 0, minutes: 0, seconds: 0 })
            } else {
                const hours = Math.floor(diff / (1000 * 60 * 60))
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
                const seconds = Math.floor((diff % (1000 * 60)) / 1000)
                setTimeLeft({ hours, minutes, seconds })
            }
        }

        updateTimer()
        const timer = setInterval(updateTimer, 1000)

        return () => clearInterval(timer)
    }, [orderData])

    const displayItems: OrderItem[] = orderData?.items || []

    const activePaymentMethod: PaymentMethod = orderData?.paymentMethod || 'qris'
    const activeBankKey = orderData?.selectedBank || 'bsi'
    const activeBank = bankAccounts[activeBankKey] || bankAccounts.bsi

    const subtotal = orderData ? orderData.baseTotal : displayItems.reduce((acc, item) => acc + item.price * item.qty, 0)
    const adminFee = orderData ? orderData.adminFee : (activePaymentMethod === 'qris' ? 1500 : activePaymentMethod === 'transfer' ? 2500 : 0)
    const grandTotal = orderData ? orderData.grandTotal : subtotal + adminFee

    const handleCopyAccount = (text: string) => {
        navigator.clipboard.writeText(text)
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

                    <button
                        disabled={isExpired}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-xs transition-colors hover:bg-slate-50 hover:text-blue-600 disabled:opacity-50"
                    >
                        <Download className="size-3.5 text-blue-600" />
                        <span>Unduh Invoice</span>
                    </button>
                </div>
            </header>

            <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10 mb-16">
                <div className={`mb-6 overflow-hidden rounded-2xl border p-6 sm:p-8 shadow-sm transition-colors ${
                    isExpired
                        ? 'border-red-200 bg-red-50/70'
                        : 'border-amber-200 bg-amber-50/60'
                }`}>
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <span className={`inline-block rounded-md border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider mb-2 ${
                                isExpired
                                    ? 'border-red-300 bg-red-100 text-red-800'
                                    : 'border-amber-300 bg-amber-100 text-amber-800'
                            }`}>
                                ID Pesanan: HMTF-{orderId}
                            </span>
                            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                                {isExpired
                                    ? 'Pesanan Kadaluarsa'
                                    : activePaymentMethod === 'cod'
                                        ? 'Pesanan Terkonfirmasi'
                                        : 'Menunggu Pembayaran'}
                            </h1>
                            <p className="mt-1 text-xs sm:text-sm text-slate-600 font-normal">
                                {isExpired
                                    ? 'Batas waktu pembayaran pesanan ini telah habis. Silakan buat pesanan baru.'
                                    : activePaymentMethod === 'cod'
                                        ? 'Silakan lakukan pembayaran tunai saat pengambilan barang di Sekre.'
                                        : 'Selesaikan pembayaran sebelum batas waktu berakhir.'}
                            </p>
                        </div>

                        {!isExpired && activePaymentMethod !== 'cod' && (
                            <div className="flex items-center gap-2 rounded-xl border border-amber-300 bg-white p-3 shadow-xs">
                                <Clock className="size-5 text-amber-600 shrink-0" />
                                <div className="font-mono text-sm font-bold text-slate-900">
                                    <span>{String(timeLeft.hours).padStart(2, '0')}</span>:
                                    <span>{String(timeLeft.minutes).padStart(2, '0')}</span>:
                                    <span>{String(timeLeft.seconds).padStart(2, '0')}</span>
                                </div>
                            </div>
                        )}

                        {isExpired && (
                            <div className="grid size-12 sm:size-14 shrink-0 place-items-center rounded-xl border border-red-300 bg-white text-red-600 shadow-xs">
                                <AlertTriangle className="size-6 sm:size-7" />
                            </div>
                        )}
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
                                {displayItems.length > 0 ? (
                                    displayItems.map((item, idx) => (
                                        <div key={item.id || idx} className="flex items-center justify-between gap-4">
                                            <div className="flex items-center gap-3.5">
                                                <div className="size-14 shrink-0 rounded-xl bg-slate-100 border border-slate-200/80 flex items-center justify-center text-slate-400">
                                                    <Package className="size-5" />
                                                </div>
                                                <div>
                                                    <p className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-1">
                                                        {item.name}
                                                    </p>
                                                    {item.category && (
                                                        <span className="text-[10px] font-semibold uppercase tracking-wider text-blue-600">
                                                            {item.category}
                                                        </span>
                                                    )}
                                                    <p className="text-xs text-slate-500 font-normal mt-0.5">
                                                        {item.qty} × Rp {item.price.toLocaleString('id-ID')}
                                                    </p>
                                                </div>
                                            </div>
                                            <span className="text-xs sm:text-sm font-extrabold text-slate-900 shrink-0">
                                                Rp {(item.qty * item.price).toLocaleString('id-ID')}
                                            </span>
                                        </div>
                                    ))
                                ) : (
                                    <p className="py-4 text-center text-xs text-slate-500 font-normal">
                                        Tidak ada rincian produk yang ditemukan untuk pesanan ini.
                                    </p>
                                )}
                            </div>

                            <div className="mt-5 flex flex-col gap-2.5 text-xs sm:text-sm">
                                <div className="flex justify-between text-slate-600 font-normal">
                                    <span>Subtotal Produk</span>
                                    <span className="font-semibold text-slate-900">
                                        Rp {subtotal.toLocaleString('id-ID')}
                                    </span>
                                </div>
                                <div className="flex justify-between text-slate-600 font-normal">
                                    <span>Biaya Layanan ({activePaymentMethod.toUpperCase()})</span>
                                    <span className="font-semibold text-slate-900">
                                        {adminFee > 0 ? `Rp ${adminFee.toLocaleString('id-ID')}` : 'Gratis'}
                                    </span>
                                </div>
                                <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
                                    <span className="font-bold text-slate-900">Total Tagihan</span>
                                    <span className={`text-lg sm:text-xl font-extrabold ${isExpired ? 'text-slate-400 line-through' : 'text-blue-600'}`}>
                                        Rp {grandTotal.toLocaleString('id-ID')}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7 shadow-sm">
                            <h2 className="mb-5 flex items-center gap-2 text-sm sm:text-base font-bold text-slate-900">
                                <MapPin className="size-4.5 text-blue-600" />
                                <span>Informasi Pemesan & Pengambilan</span>
                            </h2>

                            <div className="grid gap-4 sm:grid-cols-2 text-xs sm:text-sm">
                                <div>
                                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                        Nama Pemesan
                                    </p>
                                    <p className="mt-1 font-bold text-slate-900">
                                        {orderData?.customerName || '-'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                        Kontak WhatsApp
                                    </p>
                                    <p className="mt-1 font-bold text-slate-900">
                                        {orderData?.customerPhone || '-'}
                                    </p>
                                </div>
                                <div className="sm:col-span-2">
                                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                        Email Kontak
                                    </p>
                                    <p className="mt-1 font-semibold text-slate-800">
                                        {orderData?.customerEmail || '-'}
                                    </p>
                                </div>
                                <div className="sm:col-span-2 border-t border-slate-100 pt-3 mt-1">
                                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                        Lokasi Pengambilan Barang
                                    </p>
                                    <p className="mt-1 font-semibold text-slate-800 leading-relaxed">
                                        Sekretariat HIMATIFA UMSurabaya, Gedung G Lt. 3, Kampus Sutorejo.
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

                        {isExpired ? (
                            <div className="rounded-xl border border-red-950 bg-red-900/30 p-5 text-center">
                                <AlertTriangle className="size-8 text-red-400 mx-auto mb-2" />
                                <h4 className="text-sm font-bold text-white">Waktu Pembayaran Habis</h4>
                                <p className="mt-1 text-xs text-slate-300">
                                    Pesanan ini telah kadaluarsa. Silakan lakukan pemesanan ulang dari katalog produk.
                                </p>
                                <Link
                                    href="/ekrafstore"
                                    className="mt-4 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white transition-all hover:bg-blue-500"
                                >
                                    <RefreshCw className="size-3.5" />
                                    <span>Pesan Ulang Produk</span>
                                </Link>
                            </div>
                        ) : (
                            <>
                                {activePaymentMethod === 'qris' && (
                                    <div className="flex flex-col items-center text-center">
                                        <p className="text-xs text-slate-300 font-normal mb-4">
                                            Scan QRIS berikut menggunakan M-Banking atau E-Wallet (GoPay, OVO, Dana, ShopeePay, BCA, dll).
                                        </p>

                                        <div className="rounded-2xl border border-slate-700 bg-white p-3 shadow-md text-slate-900">
                                            <div className="text-center mb-2">
                                                <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">
                                                    QRIS HIMATIFA
                                                </p>
                                                <p className="text-xs font-black">HIMATIFA - ELECTRONICS</p>
                                                <p className="text-[9px] font-mono text-slate-500">NMID: ID1026574233668</p>
                                            </div>
                                            <Image
                                                src="/qris.png"
                                                alt="QRIS HIMATIFA"
                                                width={240}
                                                height={320}
                                                className="h-auto w-56 rounded-xl object-contain mx-auto"
                                                priority
                                            />
                                        </div>

                                        <a
                                            href="/qris.png"
                                            download={`QRIS_HIMATIFA_${orderId}.png`}
                                            className="mt-4 inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-200 transition-colors hover:bg-slate-700 hover:text-white"
                                        >
                                            <Download className="size-3.5 text-blue-400" />
                                            <span>Simpan Kode QR</span>
                                        </a>
                                    </div>
                                )}

                                {activePaymentMethod === 'transfer' && (
                                    <div>
                                        <p className="text-xs text-slate-300 font-normal">
                                            Silakan transfer nominal pas <strong className="text-white">Rp {grandTotal.toLocaleString('id-ID')}</strong> ke rekening/account berikut:
                                        </p>

                                        <div className="mt-5 rounded-xl border border-slate-800 bg-slate-950 p-4">
                                            <span className="text-[10px] font-semibold uppercase tracking-wider text-blue-400">
                                                {activeBank.name}
                                            </span>
                                            <div className="mt-2 flex items-center justify-between">
                                                <p className="text-xl sm:text-2xl font-extrabold tracking-wider text-white">
                                                    {activeBank.number}
                                                </p>
                                                <button
                                                    onClick={() => handleCopyAccount(activeBank.number)}
                                                    className="flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1.5 text-xs font-semibold text-slate-300 transition-colors hover:border-blue-500 hover:text-white"
                                                    title="Salin Nomor"
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
                                                {activeBank.holder}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {activePaymentMethod === 'cod' && (
                                    <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
                                        <p className="font-bold text-white mb-2">Metode Pembayaran Tunai (COD):</p>
                                        <ol className="list-decimal pl-4 space-y-1.5 text-slate-300 font-normal">
                                            <li>Kunjungi Sekretariat HIMATIFA Gedung G Lt. 3.</li>
                                            <li>Tunjukkan <strong>ID Pesanan: HMTF-{orderId}</strong> kepada pengurus yang bertugas.</li>
                                            <li>Lakukan pembayaran secara pas nominal <strong>Rp {grandTotal.toLocaleString('id-ID')}</strong>.</li>
                                            <li>Ambil barang pesanan Anda.</li>
                                        </ol>
                                    </div>
                                )}

                                <div className="mt-6 border-t border-slate-800 pt-5">
                                    <div className="flex items-center gap-2 text-xs text-slate-300 mb-4">
                                        <ShieldCheck className="size-4 text-blue-400 shrink-0" />
                                        <span>Konfirmasi untuk mempercepat proses verifikasi.</span>
                                    </div>

                                    <a
                                        href={`https://wa.me/6281234567890?text=Halo%20Admin%20HIMATIFA,%20saya%20ingin%20konfirmasi%20pembayaran%20pesanan%20HMTF-${orderId}%20sebesar%20Rp%20${grandTotal.toLocaleString('id-ID')}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-xs sm:text-sm font-semibold text-white transition-all hover:bg-blue-500 active:scale-[0.98]"
                                    >
                                        <MessageCircle className="size-4" />
                                        <span>Konfirmasi via WhatsApp</span>
                                    </a>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </main>
    )
}