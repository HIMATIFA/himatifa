'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import {
    ArrowLeft,
    Check,
    Clock,
    Copy,
    Download,
    MapPin,
    MessageCircle,
    Package,
    AlertTriangle,
    RefreshCw,
    QrCode,
    CreditCard,
    Upload,
    CheckCircle2,
    ExternalLink,
    Loader2
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
    dbStatus?: 'Diproses' | 'Selesai' | 'Batal'
}

const bankAccounts: Record<string, { name: string; number: string; holder: string }> = {
    seabank: { name: 'SeaBank', number: '087762728979', holder: 'HIMATIFA PREMIUM SERVICES' },
    dana: { name: 'DANA E-Wallet', number: '087762728979', holder: 'HIMATIFA PREMIUM SERVICES' },
    bsi: { name: 'Bank Syariah Indonesia (BSI)', number: '7123456789', holder: 'HIMATIFA UMSURA' },
    bca: { name: 'Bank BCA', number: '8012345678', holder: 'HIMATIFA UMSURA' }
}

export default function OrderDetailPage() {
    const params = useParams()
    const rawId = typeof params?.id === 'string' ? decodeURIComponent(params.id) : ''
    const orderId = rawId.toUpperCase()

    const [copiedAccount, setCopiedAccount] = useState(false)
    const [copiedTotal, setCopiedTotal] = useState(false)
    const [orderData, setOrderData] = useState<OrderData | null>(null)
    const [isLoadingOrder, setIsLoadingOrder] = useState(true)

    const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number }>({
        hours: 23,
        minutes: 59,
        seconds: 59
    })
    const [progressPercent, setProgressPercent] = useState(100)
    const [isExpired, setIsExpired] = useState(false)

    const [isCheckingPayment, setIsCheckingPayment] = useState(false)
    const [paymentVerified, setPaymentVerified] = useState(false)
    const [isUploaded, setIsUploaded] = useState(false)

    const supabase = useMemo(
        () =>
            createBrowserClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
            ),
        []
    )

    const fetchOrderFromDb = async () => {
        if (!orderId) return

        let localParsed: OrderData | null = null
        const savedOrder = localStorage.getItem(`himatifa_order_${rawId}`) || localStorage.getItem(`himatifa_order_${orderId}`)
        if (savedOrder) {
            try {
                localParsed = JSON.parse(savedOrder)
            } catch {
                localParsed = null
            }
        }

        const { data: dbRows, error } = await supabase
            .from('ekraf_orders')
            .select('*')
            .ilike('order_code', `${orderId}%`)
            .order('created_at', { ascending: true })

        if (!error && dbRows && dbRows.length > 0) {
            const first = dbRows[0]
            const mappedItems: OrderItem[] = dbRows.map((r) => ({
                id: r.id,
                name: r.product_name,
                price: Number(r.unit_price),
                qty: Number(r.qty)
            }))

            const totalAdmin = dbRows.reduce((s, r) => s + Number(r.admin_fee || 0), 0)
            const totalGrand = dbRows.reduce((s, r) => s + Number(r.total_price || 0), 0)
            const totalBase = Math.max(0, totalGrand - totalAdmin)

            const inferredMethod: PaymentMethod =
                first.payment_method === 'Tunai / QRIS' ? 'qris' : 'transfer'
            const inferredBank = first.payment_method === 'DANA' ? 'dana' : 'seabank'

            setOrderData({
                orderId,
                customerName: first.customer_name,
                customerPhone: first.customer_contact || '-',
                customerEmail: first.customer_email || localParsed?.customerEmail || '-',
                paymentMethod: localParsed?.paymentMethod || inferredMethod,
                selectedBank: localParsed?.selectedBank || inferredBank,
                items: mappedItems,
                baseTotal: totalBase,
                adminFee: totalAdmin,
                grandTotal: totalGrand,
                createdAt: first.created_at,
                dbStatus: first.status
            })

            if (first.status === 'Selesai') {
                setPaymentVerified(true)
            } else if (first.status === 'Batal') {
                setIsExpired(true)
            }
        } else if (localParsed) {
            setOrderData(localParsed)
        }

        setIsLoadingOrder(false)
    }

    useEffect(() => {
        if (!orderId) return

        fetchOrderFromDb()

        const channel = supabase
            .channel(`order-status-${orderId}`)
            .on(
                'postgres_changes',
                { event: 'UPDATE', schema: 'public', table: 'ekraf_orders' },
                () => fetchOrderFromDb()
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [orderId, supabase])

    useEffect(() => {
        const createdAt = orderData?.createdAt ? new Date(orderData.createdAt).getTime() : Date.now()
        const twentyFourHours = 24 * 60 * 60 * 1000
        const expiryTime = createdAt + twentyFourHours

        const updateTimer = () => {
            if (orderData?.dbStatus === 'Batal') {
                setIsExpired(true)
                return
            }

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
    const activePaymentMethod: PaymentMethod = orderData?.paymentMethod || 'transfer'
    const activeBankKey = orderData?.selectedBank || 'seabank'
    const activeBank = bankAccounts[activeBankKey] || bankAccounts.seabank

    const subtotal = orderData
        ? orderData.baseTotal
        : displayItems.reduce((acc, item) => acc + item.price * (item.qty || 1), 0)
    const adminFee = orderData ? orderData.adminFee : 0
    const grandTotal = orderData ? orderData.grandTotal : subtotal + adminFee

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

    const handleCheckPayment = async () => {
        setIsCheckingPayment(true)
        await fetchOrderFromDb()
        setTimeout(() => {
            setIsCheckingPayment(false)
        }, 600)
    }

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setIsUploaded(true)
        }
    }

    if (isLoadingOrder) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-3 text-slate-500">
                <Loader2 className="size-7 animate-spin text-blue-600" />
                <p className="text-xs font-semibold">Memuat detail pesanan {orderId}...</p>
            </div>
        )
    }

    return (
        <main className="min-h-screen bg-slate-50 text-slate-800 selection:bg-blue-100">
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
                        <span className="text-xs font-bold text-slate-500 hidden sm:inline">Status Transaksi:</span>
                        <span
                            className={`rounded-lg px-2.5 py-1 text-xs font-bold ${
                                paymentVerified
                                    ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                                    : isExpired
                                        ? 'bg-red-100 text-red-700 border border-red-200'
                                        : 'bg-amber-100 text-amber-700 border border-amber-200'
                            }`}
                        >
                            {paymentVerified
                                ? '✓ Pembayaran Terverifikasi'
                                : isExpired
                                    ? '✕ Kadaluarsa / Batal'
                                    : 'Menunggu Pembayaran'}
                        </span>
                    </div>
                </div>
            </header>

            <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10 mb-16">
                <div
                    className={`mb-6 overflow-hidden rounded-3xl border p-5 sm:p-7 lg:p-8 shadow-xs transition-colors ${
                        paymentVerified
                            ? 'border-emerald-200 bg-emerald-50/70'
                            : isExpired
                                ? 'border-red-200 bg-red-50/80'
                                : 'border-amber-200 bg-gradient-to-r from-amber-50/90 via-white to-amber-50/70'
                    }`}
                >
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="rounded-md border border-slate-300 bg-white px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase text-slate-700">
                                    ID: {orderId}
                                </span>
                                <span className="rounded-md bg-blue-100 text-blue-700 px-2.5 py-0.5 text-[10px] font-bold uppercase">
                                    {activePaymentMethod === 'qris'
                                        ? 'QRIS Otomatis'
                                        : activePaymentMethod === 'transfer'
                                            ? activeBank.name
                                            : 'COD Sekre'}
                                </span>
                            </div>

                            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                                {paymentVerified
                                    ? 'Pembayaran Berhasil Dikonfirmasi!'
                                    : isExpired
                                        ? 'Pesanan Telah Kadaluarsa / Dibatalkan'
                                        : activePaymentMethod === 'cod'
                                            ? 'Pesanan Siap Diambil di Sekre'
                                            : 'Selesaikan Pembayaran Anda'}
                            </h1>

                            <p className="mt-1 text-xs sm:text-sm text-slate-600 font-normal">
                                {paymentVerified
                                    ? 'Akses akun premium atau jadwal pengambilan telah dikirimkan ke WhatsApp/Email Anda.'
                                    : isExpired
                                        ? 'Pesanan tidak lagi aktif. Silakan pesan ulang produk dari katalog Ekraf Store.'
                                        : activePaymentMethod === 'cod'
                                            ? 'Tunjukkan ID pesanan ini ke pengurus di Sekretariat HIMATIFA Gedung G Lt. 3.'
                                            : `Pembayaran berlaku hingga: ${expiryDateFormatted}`}
                            </p>
                        </div>

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
                    <div className="flex flex-col gap-6">
                        <div className="rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-7 shadow-xs">
                            <h2 className="mb-4 flex items-center gap-2 text-sm sm:text-base font-bold text-slate-900">
                                <Package className="size-4.5 text-blue-600" />
                                <span>Rincian Paket Layanan / Produk</span>
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
                                        <span
                                            className={`text-lg sm:text-xl font-extrabold font-mono ${
                                                isExpired ? 'text-slate-400 line-through' : 'text-blue-600'
                                            }`}
                                        >
                                            Rp {grandTotal.toLocaleString('id-ID')}
                                        </span>
                                        <button
                                            onClick={() => handleCopy(grandTotal.toString(), 'total')}
                                            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
                                            title="Salin Nominal Pas"
                                        >
                                            {copiedTotal ? (
                                                <Check className="size-4 text-emerald-600" />
                                            ) : (
                                                <Copy className="size-4" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-7 shadow-xs">
                            <h2 className="mb-4 flex items-center gap-2 text-sm sm:text-base font-bold text-slate-900">
                                <MapPin className="size-4.5 text-blue-600" />
                                <span>Informasi Pemesan & Pengiriman Akun</span>
                            </h2>

                            <div className="grid gap-3.5 sm:grid-cols-2 text-xs">
                                <div>
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                        Nama Penerima
                                    </span>
                                    <p className="font-bold text-slate-900 mt-0.5">
                                        {orderData?.customerName || 'Mahasiswa UMSURA'}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                        WhatsApp Aktif
                                    </span>
                                    <p className="font-bold text-slate-900 mt-0.5">
                                        {orderData?.customerPhone || '-'}
                                    </p>
                                </div>
                                <div className="sm:col-span-2">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                        Email Akun
                                    </span>
                                    <p className="font-medium text-slate-700 mt-0.5">
                                        {orderData?.customerEmail || '-'}
                                    </p>
                                </div>
                                <div className="sm:col-span-2 border-t border-slate-100 pt-3">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                        Sekretariat Fisik
                                    </span>
                                    <p className="font-semibold text-slate-800 mt-0.5 leading-relaxed">
                                        Sekretariat HIMATIFA UMSURA, Gedung G Lt. 3, Kampus Sutorejo No. 59, Surabaya.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 sm:p-7 text-white shadow-xl">
                        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
                            <div className="flex items-center gap-2">
                                {activePaymentMethod === 'qris' ? (
                                    <QrCode className="size-5 text-blue-400" />
                                ) : (
                                    <CreditCard className="size-5 text-emerald-400" />
                                )}
                                <h3 className="text-base font-bold text-white">
                                    {activePaymentMethod === 'qris'
                                        ? 'Pembayaran QRIS Dinamis'
                                        : activePaymentMethod === 'transfer'
                                            ? `Transfer ${activeBank.name}`
                                            : 'Bayar Tunai di Sekre'}
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
                                    Pesanan dibatalkan atau melewati batas 24 jam. Silakan ulangi pembelian dari katalog
                                    produk.
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
                                <h4 className="text-base font-bold text-white">Lunas & Terverifikasi Admin</h4>
                                <p className="mt-1 text-xs text-slate-300 leading-relaxed">
                                    Admin Ekraf HIMATIFA telah memvalidasi pesanan Anda. Cek pesan masuk di WhatsApp
                                    atau Email untuk detail akun premium Anda.
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
                                {activePaymentMethod === 'qris' && (
                                    <div className="flex flex-col items-center text-center">
                                        <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                                            Scan QRIS berikut dari aplikasi E-Wallet (GoPay, OVO, Dana, ShopeePay) atau
                                            Mobile Banking:
                                        </p>

                                        <div className="w-full max-w-[280px] rounded-2xl bg-white p-4 shadow-lg text-slate-900">
                                            <div className="flex items-center justify-between pb-2 border-b border-slate-200 mb-2">
                                                <div className="text-left">
                                                    <span className="font-extrabold text-xs text-blue-700 tracking-wider">
                                                        QRIS
                                                    </span>
                                                    <span className="text-[9px] text-slate-400 font-bold block">
                                                        PEMBAYARAN DIGITAL
                                                    </span>
                                                </div>
                                                <span className="text-[10px] font-black text-rose-600 bg-rose-50 border border-rose-200 px-1.5 py-0.2 rounded">
                                                    GPN
                                                </span>
                                            </div>

                                            <div className="text-center mb-2">
                                                <p className="text-xs font-extrabold text-slate-900">
                                                    HIMATIFA - EKRAF STORE
                                                </p>
                                                <p className="text-[9px] font-mono text-slate-400">
                                                    NMID: ID1026574233668
                                                </p>
                                            </div>

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

                                            <div className="mt-2.5 rounded-lg bg-slate-50 border border-slate-200 py-1.5 px-2">
                                                <p className="text-[9px] text-slate-400 font-semibold uppercase">
                                                    Total Tagihan Pas
                                                </p>
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
                                                <span>Refresh Status</span>
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {activePaymentMethod === 'transfer' && (
                                    <div>
                                        <p className="text-xs text-slate-300 leading-relaxed mb-4">
                                            Lakukan transfer nominal pas{' '}
                                            <strong className="text-white">
                                                Rp {grandTotal.toLocaleString('id-ID')}
                                            </strong>{' '}
                                            ke rekening resmi HIMATIFA Premium Services berikut:
                                        </p>

                                        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-xs font-bold text-blue-400">{activeBank.name}</span>
                                                <span className="text-[10px] text-emerald-400 font-mono">
                                                    ● Resmi Ekraf
                                                </span>
                                            </div>

                                            <div className="flex items-center justify-between rounded-xl bg-slate-900 border border-slate-800 p-3 my-2">
                                                <span className="font-mono text-lg sm:text-xl font-extrabold text-white tracking-wider">
                                                    {activeBank.number}
                                                </span>
                                                <button
                                                    onClick={() => handleCopy(activeBank.number, 'account')}
                                                    className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-2.5 py-1.5 text-xs font-bold text-white hover:bg-blue-500 transition cursor-pointer"
                                                    title="Salin Nomor"
                                                >
                                                    {copiedAccount ? (
                                                        <Check className="size-3.5" />
                                                    ) : (
                                                        <Copy className="size-3.5" />
                                                    )}
                                                    <span>{copiedAccount ? 'Tersalin' : 'Salin'}</span>
                                                </button>
                                            </div>

                                            <p className="text-xs text-slate-400">
                                                Atas Nama: <strong className="text-white">{activeBank.holder}</strong>
                                            </p>
                                        </div>

                                        <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-950 p-4">
                                            <p className="text-xs font-bold text-white mb-1.5 flex items-center gap-1.5">
                                                <Upload className="size-3.5 text-blue-400" />
                                                <span>Lampirkan Bukti Transfer (Opsional):</span>
                                            </p>
                                            <p className="text-[11px] text-slate-400 mb-3">
                                                Pilih bukti transfer sebelum klik konfirmasi via WhatsApp.
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
                                                        <span>Bukti transfer siap dikirim!</span>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <Upload className="size-5 text-slate-400 mb-1" />
                                                        <span className="text-xs font-semibold text-slate-300">
                                                            Pilih file gambar struk bayar
                                                        </span>
                                                        <span className="text-[10px] text-slate-500">
                                                            Maks. 5 MB (JPG, PNG)
                                                        </span>
                                                    </>
                                                )}
                                            </label>
                                        </div>
                                    </div>
                                )}

                                {activePaymentMethod === 'cod' && (
                                    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 text-xs text-slate-300 leading-relaxed">
                                        <p className="font-bold text-white mb-2">Langkah Pembayaran di Sekre:</p>
                                        <ol className="list-decimal pl-4 space-y-1 text-slate-300">
                                            <li>Kunjungi Gedung G Lt. 3 Sekretariat HIMATIFA UMSURA.</li>
                                            <li>
                                                Tunjukkan kode pesanan <strong>{orderId}</strong>.
                                            </li>
                                            <li>
                                                Bayar nominal pas{' '}
                                                <strong>Rp {grandTotal.toLocaleString('id-ID')}</strong>.
                                            </li>
                                        </ol>
                                    </div>
                                )}

                                <div className="pt-4 border-t border-slate-800">
                                    <a
                                        href={`https://wa.me/6287762728979?text=${encodeURIComponent(
                                            `Halo Admin Ekraf HIMATIFA, saya sudah melakukan pembayaran untuk pesanan ${orderId} atas nama ${
                                                orderData?.customerName || 'Mahasiswa'
                                            } sebesar Rp ${grandTotal.toLocaleString('id-ID')} via ${activePaymentMethod.toUpperCase()} (${
                                                activeBank.name
                                            }). Mohon segera diproses ya kak!`
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