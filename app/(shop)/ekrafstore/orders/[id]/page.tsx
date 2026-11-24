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
    RefreshCw,
    QrCode,
    CreditCard,
    Upload,
    CheckCircle2,
    Calendar,
    ChevronDown,
    ExternalLink,
    Store
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

const bankAccounts: Record<string, { name: string; number: string; holder: string; color: string }> = {
    bsi: { name: 'Bank Syariah Indonesia (BSI)', number: '7123456789', holder: 'HIMATIFA UMSURA', color: 'text-teal-600 bg-teal-50 border-teal-200' },
    mandiri: { name: 'Bank Mandiri', number: '1420012345678', holder: 'HIMATIFA UMSURA', color: 'text-blue-700 bg-blue-50 border-blue-200' },
    bca: { name: 'Bank BCA', number: '8012345678', holder: 'HIMATIFA UMSURA', color: 'text-blue-600 bg-blue-50 border-blue-200' },
    bri: { name: 'Bank BRI', number: '002101001234530', holder: 'HIMATIFA UMSURA', color: 'text-sky-700 bg-sky-50 border-sky-200' },
    seabank: { name: 'SeaBank', number: '90123456789', holder: 'a.n. HIMATIFA STORE', color: 'text-orange-600 bg-orange-50 border-orange-200' },
    gopay: { name: 'GoPay / DANA E-Wallet', number: '081234567890', holder: 'a.n. HIMATIFA STORE', color: 'text-cyan-600 bg-cyan-50 border-cyan-200' },
    dana: { name: 'DANA E-Wallet', number: '081234567890', holder: 'a.n. HIMATIFA STORE', color: 'text-sky-600 bg-sky-50 border-sky-200' },
}

export default function OrderDetailPage() {
    const params = useParams()
    const rawId = typeof params?.id === 'string' ? params.id : ''
    const orderId = rawId.toUpperCase()

    const [copiedAccount, setCopiedAccount] = useState(false)
    const [copiedTotal, setCopiedTotal] = useState(false)
    const [orderData, setOrderData] = useState<OrderData | null>(null)
    const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number }>({ hours: 23, minutes: 59, seconds: 59 })
    const [progressPercent, setProgressPercent] = useState(100)
    const [isExpired, setIsExpired] = useState(false)

    // Payment Verification Simulation
    const [isCheckingPayment, setIsCheckingPayment] = useState(false)
    const [paymentVerified, setPaymentVerified] = useState(false)

    // Upload receipt state
    const [proofFile, setProofFile] = useState<string | null>(null)
    const [isUploaded, setIsUploaded] = useState(false)

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

    // Countdown Timer 24 Jam
    useEffect(() => {
        const createdAt = orderData?.createdAt ? new Date(orderData.createdAt).getTime() : Date.now()
        const twentyFourHours = 24 * 60 * 60 * 1000
        const expiryTime = createdAt + twentyFourHours

        const updateTimer = () => {
            const now = Date.now()
            const diff = expiryTime - now

            if (diff <= 0) {
                setIsExpired(true)
                setTimeLeft({ hours: 0, minutes: 0, seconds: 0 })
                setProgressPercent(0)
            } else {
                const hours = Math.floor(diff / (1000 * 60 * 60))
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
                const seconds = Math.floor((diff % (1000 * 60)) / 1000)
                setTimeLeft({ hours, minutes, seconds })
                setProgressPercent((diff / twentyFourHours) * 100)
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

    const subtotal = orderData ? orderData.baseTotal : displayItems.reduce((acc, item) => acc + item.price * (item.qty || 1), 0)
    const adminFee = orderData ? orderData.adminFee : (activePaymentMethod === 'qris' ? 1500 : activePaymentMethod === 'transfer' ? 2500 : 0)
    const grandTotal = orderData ? orderData.grandTotal : subtotal + adminFee

    // Calculate expiry date formatted
    const expiryDateFormatted = orderData?.createdAt
        ? new Date(new Date(orderData.createdAt).getTime() + 24 * 60 * 60 * 1000).toLocaleString('id-ID', {
              weekday: 'long',
              day: 'numeric',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
          }) + ' WIB'
        : '24 Jam sejak pemesanan'

    const handleCopy = (text: string, type: 'account' | 'total') => {
        navigator.clipboard.writeText(text)
        if (type === 'account') {
            setCopiedAccount(true)
            setTimeout(() => setCopiedAccount(false), 2000)
        } else {
            setCopiedTotal(true)
            setTimeout(() => setCopiedTotal(false), 2000)
        }
    }

    const handleCheckPayment = () => {
        setIsCheckingPayment(true)
        setTimeout(() => {
            setIsCheckingPayment(false)
            setPaymentVerified(true)
        }, 1500)
    }

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setProofFile(URL.createObjectURL(file))
            setIsUploaded(true)
        }
    }

    return (
        <main className="min-h-screen bg-slate-50 text-slate-800 selection:bg-blue-100">
            {/* Header */}
            <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 px-4 py-3.5 backdrop-blur-md sm:px-6 lg:px-8">
                <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
                    <Link
                        href="/ekrafstore"
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs sm:text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 hover:text-blue-600 active:scale-95"
                    >
                        <ArrowLeft className="size-4" />
                        <span>Kembali ke Katalog</span>
                    </Link>

                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-500 hidden sm:inline">
                            Status Transaksi:
                        </span>
                        <span className={`rounded-lg px-2.5 py-1 text-xs font-bold ${
                            paymentVerified
                                ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                                : isExpired
                                    ? 'bg-red-100 text-red-700 border border-red-200'
                                    : 'bg-amber-100 text-amber-700 border border-amber-200'
                        }`}>
                            {paymentVerified ? '✓ Pembayaran Terverifikasi' : isExpired ? '✕ Kadaluarsa' : 'Menunggu Pembayaran'}
                        </span>
                    </div>
                </div>
            </header>

            <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10 mb-16">
                {/* Status & 24-Hour Expiry Banner */}
                <div className={`mb-6 overflow-hidden rounded-3xl border p-5 sm:p-7 lg:p-8 shadow-xs transition-colors ${
                    paymentVerified
                        ? 'border-emerald-200 bg-emerald-50/70'
                        : isExpired
                            ? 'border-red-200 bg-red-50/80'
                            : 'border-amber-200 bg-gradient-to-r from-amber-50/90 via-white to-amber-50/70'
                }`}>
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="rounded-md border border-slate-300 bg-white px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase text-slate-700">
                                    ID: HMTF-{orderId}
                                </span>
                                <span className="rounded-md bg-blue-100 text-blue-700 px-2.5 py-0.5 text-[10px] font-bold uppercase">
                                    {activePaymentMethod === 'qris' ? 'QRIS Otomatis' : activePaymentMethod === 'transfer' ? 'Transfer Bank' : 'COD Sekre'}
                                </span>
                            </div>

                            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                                {paymentVerified
                                    ? 'Pembayaran Berhasil Dikonfirmasi!'
                                    : isExpired
                                        ? 'Pesanan Telah Kadaluarsa (24 Jam Habis)'
                                        : activePaymentMethod === 'cod'
                                            ? 'Pesanan Siap Diambil di Sekre'
                                            : 'Selesaikan Pembayaran Anda'}
                            </h1>

                            <p className="mt-1 text-xs sm:text-sm text-slate-600 font-normal">
                                {paymentVerified
                                    ? 'Akses produk digital atau jadwal pengambilan telah dikirimkan ke WhatsApp Anda.'
                                    : isExpired
                                        ? 'Batas waktu 24 jam telah berakhir. Silakan pesan ulang produk dari katalog Ekraf Store.'
                                        : activePaymentMethod === 'cod'
                                            ? 'Tunjukkan ID pesanan ini ke pengurus di Sekretariat HIMATIFA Gedung G Lt. 3.'
                                            : `Pembayaran berlaku hingga: ${expiryDateFormatted}`}
                            </p>
                        </div>

                        {/* 24-Hour Countdown Box */}
                        {!isExpired && !paymentVerified && activePaymentMethod !== 'cod' && (
                            <div className="flex flex-col items-center sm:items-end shrink-0">
                                <div className="flex items-center gap-2 rounded-2xl border border-amber-300 bg-white p-3.5 shadow-sm">
                                    <Clock className="size-5 text-amber-600 animate-pulse" />
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                            Sisa Waktu Bayar
                                        </p>
                                        <div className="font-mono text-base font-extrabold text-slate-900 tracking-wider">
                                            <span>{String(timeLeft.hours).padStart(2, '0')}</span>h :{' '}
                                            <span>{String(timeLeft.minutes).padStart(2, '0')}</span>m :{' '}
                                            <span>{String(timeLeft.seconds).padStart(2, '0')}</span>s
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full bg-amber-200 h-1.5 rounded-full mt-2 overflow-hidden">
                                    <div
                                        className="bg-amber-600 h-full transition-all duration-1000"
                                        style={{ width: `${progressPercent}%` }}
                                    />
                                </div>
                            </div>
                        )}

                        {paymentVerified && (
                            <div className="grid size-14 shrink-0 place-items-center rounded-2xl bg-emerald-600 text-white shadow-md">
                                <CheckCircle2 className="size-8" />
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-[1.4fr_1.1fr] lg:items-start">
                    {/* Left Column: Product Details & Customer Info */}
                    <div className="flex flex-col gap-6">
                        {/* Order Items */}
                        <div className="rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-7 shadow-xs">
                            <h2 className="mb-4 flex items-center gap-2 text-sm sm:text-base font-bold text-slate-900">
                                <Package className="size-4.5 text-blue-600" />
                                <span>Rincian Barang / Layanan</span>
                            </h2>

                            <div className="flex flex-col gap-3.5 border-b border-slate-100 pb-5">
                                {displayItems.length > 0 ? (
                                    displayItems.map((item, idx) => (
                                        <div key={item.id || idx} className="flex items-center justify-between gap-4">
                                            <div className="flex items-center gap-3">
                                                <div className="grid size-12 shrink-0 place-items-center rounded-xl bg-slate-50 border border-slate-200 text-blue-600">
                                                    <Package className="size-5" />
                                                </div>
                                                <div>
                                                    <p className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-1">
                                                        {item.name}
                                                    </p>
                                                    <p className="text-[11px] text-slate-400 mt-0.5">
                                                        {item.qty || 1} &times; Rp {item.price.toLocaleString('id-ID')}
                                                    </p>
                                                </div>
                                            </div>
                                            <span className="text-xs sm:text-sm font-extrabold text-slate-900 shrink-0 font-mono">
                                                Rp {((item.qty || 1) * item.price).toLocaleString('id-ID')}
                                            </span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-4 text-center text-xs text-slate-400">
                                        Data pesanan siap diproses.
                                    </div>
                                )}
                            </div>

                            {/* Cost Breakdown */}
                            <div className="mt-4 space-y-2 text-xs">
                                <div className="flex justify-between text-slate-500">
                                    <span>Subtotal Produk</span>
                                    <span className="font-semibold text-slate-800 font-mono">
                                        Rp {subtotal.toLocaleString('id-ID')}
                                    </span>
                                </div>
                                <div className="flex justify-between text-slate-500">
                                    <span>Biaya Transaksi ({activePaymentMethod.toUpperCase()})</span>
                                    <span className="font-semibold text-slate-800 font-mono">
                                        {adminFee > 0 ? `Rp ${adminFee.toLocaleString('id-ID')}` : 'Gratis (Rp 0)'}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-sm">
                                    <span className="font-bold text-slate-900">Total Pembayaran Pas</span>
                                    <div className="flex items-center gap-2">
                                        <span className={`text-lg sm:text-xl font-extrabold font-mono ${isExpired ? 'text-slate-400 line-through' : 'text-blue-600'}`}>
                                            Rp {grandTotal.toLocaleString('id-ID')}
                                        </span>
                                        <button
                                            onClick={() => handleCopy(grandTotal.toString(), 'total')}
                                            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                                            title="Salin Nominal Pas"
                                        >
                                            {copiedTotal ? <Check className="size-4 text-emerald-600" /> : <Copy className="size-4" />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Customer Information */}
                        <div className="rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-7 shadow-xs">
                            <h2 className="mb-4 flex items-center gap-2 text-sm sm:text-base font-bold text-slate-900">
                                <MapPin className="size-4.5 text-blue-600" />
                                <span>Informasi Kontak & Pengambilan</span>
                            </h2>

                            <div className="grid gap-3.5 sm:grid-cols-2 text-xs">
                                <div>
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Nama Penerima</span>
                                    <p className="font-bold text-slate-900 mt-0.5">{orderData?.customerName || 'Mahasiswa UMSURA'}</p>
                                </div>
                                <div>
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">WhatsApp Aktif</span>
                                    <p className="font-bold text-slate-900 mt-0.5">{orderData?.customerPhone || '08xxxxxxxxxx'}</p>
                                </div>
                                <div className="sm:col-span-2">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Email Akun</span>
                                    <p className="font-medium text-slate-700 mt-0.5">{orderData?.customerEmail || 'email@umsurabaya.ac.id'}</p>
                                </div>
                                <div className="sm:col-span-2 border-t border-slate-100 pt-3">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Lokasi Penyerahan Fisik</span>
                                    <p className="font-semibold text-slate-800 mt-0.5 leading-relaxed">
                                        Sekretariat HIMATIFA UMSURA, Gedung G Lt. 3, Kampus Sutorejo No. 59, Surabaya.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Payment Instructions (QRIS vs Transfer 24 Jam) */}
                    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 sm:p-7 text-white shadow-xl">
                        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
                            <div className="flex items-center gap-2">
                                {activePaymentMethod === 'qris' ? (
                                    <QrCode className="size-5 text-blue-400" />
                                ) : (
                                    <CreditCard className="size-5 text-emerald-400" />
                                )}
                                <h3 className="text-base font-bold text-white">
                                    {activePaymentMethod === 'qris' ? 'Pembayaran QRIS Dinamis' : activePaymentMethod === 'transfer' ? 'Transfer Bank (24 Jam)' : 'Bayar Tunai di Sekre'}
                                </h3>
                            </div>
                            <span className="rounded-md bg-slate-800 border border-slate-700 px-2 py-0.5 text-[10px] font-mono font-bold text-blue-400">
                                24H EXPIRY
                            </span>
                        </div>

                        {isExpired ? (
                            <div className="rounded-2xl border border-red-900/50 bg-red-950/40 p-6 text-center">
                                <AlertTriangle className="size-10 text-red-400 mx-auto mb-3" />
                                <h4 className="text-sm font-bold text-white">Batas Waktu Pembayaran Habis</h4>
                                <p className="mt-1 text-xs text-slate-300 leading-relaxed">
                                    Pesanan otomatis dibatalkan karena melewati batas 24 jam. Silakan ulangi pembelian dari katalog produk.
                                </p>
                                <Link
                                    href="/ekrafstore"
                                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-blue-500 transition"
                                >
                                    <RefreshCw className="size-3.5" />
                                    <span>Pesan Ulang Produk</span>
                                </Link>
                            </div>
                        ) : paymentVerified ? (
                            <div className="rounded-2xl border border-emerald-800 bg-emerald-950/40 p-6 text-center">
                                <CheckCircle2 className="size-10 text-emerald-400 mx-auto mb-3" />
                                <h4 className="text-base font-bold text-white">Lunas & Terverifikasi</h4>
                                <p className="mt-1 text-xs text-slate-300 leading-relaxed">
                                    Admin penjualan telah memvalidasi pembayaran Anda. Silakan hubungi CS jika membutuhkan bantuan lanjutan.
                                </p>
                                <Link
                                    href="/ekrafstore"
                                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-2.5 text-xs font-semibold text-white hover:bg-slate-700 transition"
                                >
                                    <span>Kembali Belanja</span>
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-5">
                                {/* QRIS Generation Box */}
                                {activePaymentMethod === 'qris' && (
                                    <div className="flex flex-col items-center text-center">
                                        <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                                            Scan QRIS berikut dari aplikasi e-wallet apa pun (GoPay, OVO, Dana, ShopeePay) atau Mobile Banking (BCA, Mandiri, BSI, BRI).
                                        </p>

                                        {/* Dynamic Styled Indonesian QRIS Canvas Card */}
                                        <div className="w-full max-w-[280px] rounded-2xl bg-white p-4 shadow-lg text-slate-900">
                                            {/* QRIS Header */}
                                            <div className="flex items-center justify-between pb-2 border-b border-slate-200 mb-2">
                                                <div className="text-left">
                                                    <span className="font-extrabold text-xs text-blue-700 tracking-wider">QRIS</span>
                                                    <span className="text-[9px] text-slate-400 font-bold block">PEMBAYARAN DIGITAL</span>
                                                </div>
                                                <span className="text-[10px] font-black text-rose-600 bg-rose-50 border border-rose-200 px-1.5 py-0.2 rounded">
                                                    GPN
                                                </span>
                                            </div>

                                            {/* Merchant Info */}
                                            <div className="text-center mb-2">
                                                <p className="text-xs font-extrabold text-slate-900">HIMATIFA - MERCHANDISE</p>
                                                <p className="text-[9px] font-mono text-slate-400">NMID: ID1026574233668 &bull; AIN: 0001</p>
                                            </div>

                                            {/* Generated QR Code Preview */}
                                            <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-white border border-slate-200 p-2 flex items-center justify-center">
                                                <Image
                                                    src="/qris.png"
                                                    alt="Generated QRIS HIMATIFA"
                                                    width={220}
                                                    height={220}
                                                    className="size-full object-contain"
                                                    priority
                                                />
                                            </div>

                                            {/* Order Nominal Badge on QRIS */}
                                            <div className="mt-2.5 rounded-lg bg-slate-50 border border-slate-200 py-1.5 px-2">
                                                <p className="text-[9px] text-slate-400 font-semibold uppercase">Total Tagihan Pas</p>
                                                <p className="font-mono text-sm font-black text-blue-600">
                                                    Rp {grandTotal.toLocaleString('id-ID')}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                                            <a
                                                href="/qris.png"
                                                download={`QRIS_HIMATIFA_${orderId}.png`}
                                                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 hover:text-white transition"
                                            >
                                                <Download className="size-3.5 text-blue-400" />
                                                <span>Unduh Kode QR</span>
                                            </a>
                                            <button
                                                onClick={handleCheckPayment}
                                                disabled={isCheckingPayment}
                                                className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-blue-500 transition cursor-pointer"
                                            >
                                                {isCheckingPayment ? (
                                                    <span className="size-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                                ) : (
                                                    <CheckCircle2 className="size-3.5" />
                                                )}
                                                <span>Cek Status Bayar</span>
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Bank Transfer 24-Hour Expiry Box */}
                                {activePaymentMethod === 'transfer' && (
                                    <div>
                                        <p className="text-xs text-slate-300 leading-relaxed mb-4">
                                            Lakukan transfer nominal pas <strong className="text-white">Rp {grandTotal.toLocaleString('id-ID')}</strong> sebelum 24 jam ke nomor rekening resmi berikut:
                                        </p>

                                        {/* Bank Account Card */}
                                        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-xs font-bold text-blue-400">
                                                    {activeBank.name}
                                                </span>
                                                <span className="text-[10px] text-slate-400 font-mono">
                                                    Status: Online
                                                </span>
                                            </div>

                                            <div className="flex items-center justify-between rounded-xl bg-slate-900 border border-slate-800 p-3 my-2">
                                                <span className="font-mono text-lg sm:text-xl font-extrabold text-white tracking-wider">
                                                    {activeBank.number}
                                                </span>
                                                <button
                                                    onClick={() => handleCopy(activeBank.number, 'account')}
                                                    className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-2.5 py-1.5 text-xs font-bold text-white hover:bg-blue-500 transition"
                                                    title="Salin Nomor Rekening"
                                                >
                                                    {copiedAccount ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                                                    <span>{copiedAccount ? 'Tersalin' : 'Salin'}</span>
                                                </button>
                                            </div>

                                            <p className="text-xs text-slate-400">
                                                Atas Nama: <strong className="text-white">{activeBank.holder}</strong>
                                            </p>
                                        </div>

                                        {/* Upload Proof of Transfer (Interactive) */}
                                        <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-950 p-4">
                                            <p className="text-xs font-bold text-white mb-1.5 flex items-center gap-1.5">
                                                <Upload className="size-3.5 text-blue-400" />
                                                <span>Unggah Bukti Transfer (Opsional):</span>
                                            </p>
                                            <p className="text-[11px] text-slate-400 mb-3">
                                                Unggah tangkapan layar struk/m-banking untuk mempercepat verifikasi otomatis.
                                            </p>

                                            <label className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-700 bg-slate-900/60 p-4 text-center cursor-pointer hover:border-blue-500 transition">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleFileUpload}
                                                    className="hidden"
                                                />
                                                {isUploaded ? (
                                                    <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                                                        <CheckCircle2 className="size-4" />
                                                        <span>Bukti transfer berhasil dipilih!</span>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <Upload className="size-5 text-slate-400 mb-1" />
                                                        <span className="text-xs font-semibold text-slate-300">Pilih file gambar struk bayar</span>
                                                        <span className="text-[10px] text-slate-500">Maks. 5 MB (JPG, PNG)</span>
                                                    </>
                                                )}
                                            </label>
                                        </div>
                                    </div>
                                )}

                                {/* Cash / COD Info */}
                                {activePaymentMethod === 'cod' && (
                                    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 text-xs text-slate-300 leading-relaxed">
                                        <p className="font-bold text-white mb-2">Langkah Pembayaran di Sekre:</p>
                                        <ol className="list-decimal pl-4 space-y-1 text-slate-300">
                                            <li>Kunjungi Gedung G Lt. 3 Sekretariat HIMATIFA UMSURA.</li>
                                            <li>Tunjukkan kode pesanan <strong>HMTF-{orderId}</strong>.</li>
                                            <li>Bayar nominal pas <strong>Rp {grandTotal.toLocaleString('id-ID')}</strong>.</li>
                                        </ol>
                                    </div>
                                )}

                                {/* WhatsApp Instant Confirmation Link */}
                                <div className="pt-4 border-t border-slate-800">
                                    <a
                                        href={`https://wa.me/6281234567890?text=${encodeURIComponent(
                                            `Halo Admin Ekraf HIMATIFA, saya sudah melakukan pembayaran untuk pesanan HMTF-${orderId} sebesar Rp ${grandTotal.toLocaleString('id-ID')} via ${activePaymentMethod.toUpperCase()} (${activeBank.name}). Mohon diverifikasi.`
                                        )}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-xs sm:text-sm font-bold text-white transition hover:bg-emerald-500 active:scale-[0.98]"
                                    >
                                        <MessageCircle className="size-4" />
                                        <span>Konfirmasi via WhatsApp Resmi</span>
                                        <ExternalLink className="size-3.5" />
                                    </a>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    )
}
