'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import {
    ArrowLeft,
    Check,
    CreditCard,
    MapPin,
    QrCode,
    Store,
    Info,
    ShieldCheck,
    Mail,
    Phone,
    User,
    ArrowRight,
    AlertCircle,
    Clock,
    Loader2
} from 'lucide-react'

type PaymentMethod = 'qris' | 'transfer' | 'cod'

interface CartItem {
    id: string
    productId?: string | null
    name?: string
    title?: string
    price: number
    qty?: number
    quantity?: number
    category?: string
    selected?: boolean
}

interface BankOption {
    id: string
    name: string
    badgeColor: string
}

const bankList: BankOption[] = [
    { id: 'seabank', name: 'SeaBank (087762728979)', badgeColor: 'bg-orange-500' },
    { id: 'dana', name: 'DANA (087762728979)', badgeColor: 'bg-sky-500' },
    { id: 'bsi', name: 'Bank BSI', badgeColor: 'bg-teal-600' },
    { id: 'bca', name: 'Bank BCA', badgeColor: 'bg-blue-700' }
]

export default function CheckoutPage() {
    const router = useRouter()
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('transfer')
    const [selectedBank, setSelectedBank] = useState<string>('seabank')
    const [baseTotal, setBaseTotal] = useState(0)
    const [itemCount, setItemCount] = useState(0)
    const [cartItems, setCartItems] = useState<CartItem[]>([])

    const [customerName, setCustomerName] = useState('')
    const [customerPhone, setCustomerPhone] = useState('')
    const [customerEmail, setCustomerEmail] = useState('')

    const [errors, setErrors] = useState<{ name?: boolean; phone?: boolean; email?: boolean }>({})
    const [formError, setFormError] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const supabase = useMemo(
        () =>
            createBrowserClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
            ),
        []
    )

    useEffect(() => {
        const savedCart = localStorage.getItem('himatifa_cart')
        if (savedCart) {
            try {
                const parsed: CartItem[] = JSON.parse(savedCart)
                const selected = parsed.filter((item) => item.selected !== false)

                const itemsToOrder = selected.map((item) => ({
                    id: item.id,
                    productId: item.productId || null,
                    name: item.name || item.title || 'Produk HIMATIFA',
                    price: item.price,
                    qty: item.qty || item.quantity || 1,
                    category: item.category || 'Ekraf'
                }))

                setCartItems(itemsToOrder)

                const total = itemsToOrder.reduce((sum, item) => sum + item.price * item.qty, 0)
                const count = itemsToOrder.reduce((sum, item) => sum + item.qty, 0)
                setBaseTotal(total)
                setItemCount(count)
            } catch {
                setBaseTotal(0)
                setItemCount(0)
                setCartItems([])
            }
        }
    }, [])

    const adminFee = paymentMethod === 'qris' ? 1000 : 0
    const grandTotal = baseTotal + adminFee

    const mapDbPaymentMethod = (): 'SeaBank' | 'DANA' | 'Tunai / QRIS' => {
        if (paymentMethod === 'transfer') {
            if (selectedBank === 'dana') return 'DANA'
            return 'SeaBank'
        }
        return 'Tunai / QRIS'
    }

    const handleCreateOrder = async () => {
        const newErrors: { name?: boolean; phone?: boolean; email?: boolean } = {}
        if (!customerName.trim()) newErrors.name = true
        if (!customerPhone.trim()) newErrors.phone = true
        if (!customerEmail.trim()) newErrors.email = true

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            setFormError(
                'Mohon lengkapi seluruh informasi pemesan (Nama, No. WhatsApp, dan Email) sebelum membuat pesanan.'
            )
            window.scrollTo({ top: 100, behavior: 'smooth' })
            return
        }

        if (cartItems.length === 0) {
            setFormError('Keranjang belanja Anda kosong. Silakan pilih produk terlebih dahulu.')
            return
        }

        setErrors({})
        setFormError('')
        setIsSubmitting(true)

        const randomOrderNum = `ORD-${Math.floor(100000 + Math.random() * 900000)}`
        const dbPaymentMethod = mapDbPaymentMethod()
        const todayIso = new Date().toISOString().split('T')[0]

        const orderRows = cartItems.map((item, idx) => {
            const subOrderCode = idx === 0 ? randomOrderNum : `${randomOrderNum}-${idx + 1}`
            const itemAdminFee = idx === 0 ? adminFee : 0
            return {
                order_code: subOrderCode,
                customer_name: customerName.trim(),
                customer_contact: customerPhone.trim(),
                customer_email: customerEmail.trim(),
                payment_method: dbPaymentMethod,
                product_id: item.productId || null,
                product_name: item.name || 'Layanan HIMATIFA',
                qty: item.qty || 1,
                unit_price: item.price,
                admin_fee: itemAdminFee,
                total_price: item.price * (item.qty || 1) + itemAdminFee,
                order_date: todayIso,
                status: 'Diproses'
            }
        })

        const { error } = await supabase.from('ekraf_orders').insert(orderRows)

        if (error) {
            setFormError(`Gagal mengirim pesanan ke server: ${error.message}`)
            setIsSubmitting(false)
            return
        }

        const orderPayload = {
            orderId: randomOrderNum,
            customerName: customerName.trim(),
            customerPhone: customerPhone.trim(),
            customerEmail: customerEmail.trim(),
            paymentMethod,
            selectedBank,
            items: cartItems,
            baseTotal,
            adminFee,
            grandTotal,
            createdAt: new Date().toISOString()
        }

        localStorage.setItem(`himatifa_order_${randomOrderNum}`, JSON.stringify(orderPayload))
        localStorage.removeItem('himatifa_cart')
        router.push(`/ekrafstore/orders/${randomOrderNum}`)
    }

    return (
        <main className="min-h-screen bg-slate-50 text-slate-800 selection:bg-blue-100">
            <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 px-4 py-4 backdrop-blur-md sm:px-6 lg:px-8">
                <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <Link
                            href="/ekrafstore/cart"
                            className="grid size-9 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-100 hover:text-blue-600"
                        >
                            <ArrowLeft className="size-4" />
                        </Link>
                        <div>
                            <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                                Checkout Pesanan
                            </h1>
                            <p className="text-xs text-slate-500 font-normal">Selesaikan Informasi & Pembayaran</p>
                        </div>
                    </div>

                    <div className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                        <ShieldCheck className="size-4 text-blue-600" />
                        <span>Pembayaran Aman 100%</span>
                    </div>
                </div>
            </header>

            <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10 mb-28 lg:mb-12">
                <div className="grid gap-6 lg:grid-cols-12 lg:items-start lg:gap-8">
                    <div className="lg:col-span-8 flex flex-col gap-6">
                        <div className="flex items-start gap-3 rounded-2xl border border-blue-200 bg-blue-50/70 p-4 sm:p-5">
                            <Info className="size-5 shrink-0 text-blue-600 mt-0.5" />
                            <div className="text-xs sm:text-sm leading-relaxed text-slate-700 font-normal">
                                <strong className="font-semibold text-slate-900">Catatan Pengiriman:</strong> Akses
                                aplikasi premium (ChatGPT, Gemini Plus, Netflix, Canva Pro, dll.) akan dikirimkan langsung
                                ke WhatsApp/Email Anda dalam 5–15 menit setelah pembayaran diverifikasi.
                            </div>
                        </div>

                        {formError && (
                            <div className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-xs sm:text-sm text-red-700 shadow-sm">
                                <AlertCircle className="size-5 shrink-0 text-red-600" />
                                <span className="font-medium">{formError}</span>
                            </div>
                        )}

                        <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7 shadow-sm">
                            <h2 className="mb-5 flex items-center gap-2 text-sm sm:text-base font-bold text-slate-900">
                                <MapPin className="size-4.5 text-blue-600" />
                                <span>Informasi Pemesan & Kontak</span>
                            </h2>

                            <form className="grid gap-4 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
                                <div className="sm:col-span-2">
                                    <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                                        Nama Lengkap <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <User
                                            className={`absolute left-3.5 top-1/2 size-4 -translate-y-1/2 ${
                                                errors.name ? 'text-red-400' : 'text-slate-400'
                                            }`}
                                        />
                                        <input
                                            type="text"
                                            required
                                            value={customerName}
                                            onChange={(e) => {
                                                setCustomerName(e.target.value)
                                                if (errors.name) setErrors((prev) => ({ ...prev, name: false }))
                                            }}
                                            placeholder="Masukkan nama lengkap Anda..."
                                            className={`w-full rounded-xl border py-2.5 pl-10 pr-4 text-xs sm:text-sm font-medium outline-none transition ${
                                                errors.name
                                                    ? 'border-red-500 bg-red-50/50 text-red-900 focus:border-red-600'
                                                    : 'border-slate-200 bg-slate-50 focus:border-blue-600 focus:bg-white'
                                            }`}
                                        />
                                    </div>
                                    {errors.name && (
                                        <p className="mt-1 text-[11px] font-semibold text-red-500">
                                            Nama lengkap wajib diisi.
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                                        Nomor WhatsApp <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <Phone
                                            className={`absolute left-3.5 top-1/2 size-4 -translate-y-1/2 ${
                                                errors.phone ? 'text-red-400' : 'text-slate-400'
                                            }`}
                                        />
                                        <input
                                            type="tel"
                                            required
                                            value={customerPhone}
                                            onChange={(e) => {
                                                setCustomerPhone(e.target.value)
                                                if (errors.phone) setErrors((prev) => ({ ...prev, phone: false }))
                                            }}
                                            placeholder="08xxxxxxxxxx"
                                            className={`w-full rounded-xl border py-2.5 pl-10 pr-4 text-xs sm:text-sm font-medium outline-none transition ${
                                                errors.phone
                                                    ? 'border-red-500 bg-red-50/50 text-red-900 focus:border-red-600'
                                                    : 'border-slate-200 bg-slate-50 focus:border-blue-600 focus:bg-white'
                                            }`}
                                        />
                                    </div>
                                    {errors.phone && (
                                        <p className="mt-1 text-[11px] font-semibold text-red-500">
                                            Nomor WhatsApp wajib diisi.
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                                        Email Aktif (Untuk Invite Akun) <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <Mail
                                            className={`absolute left-3.5 top-1/2 size-4 -translate-y-1/2 ${
                                                errors.email ? 'text-red-400' : 'text-slate-400'
                                            }`}
                                        />
                                        <input
                                            type="email"
                                            required
                                            value={customerEmail}
                                            onChange={(e) => {
                                                setCustomerEmail(e.target.value)
                                                if (errors.email) setErrors((prev) => ({ ...prev, email: false }))
                                            }}
                                            placeholder="email@gmail.com"
                                            className={`w-full rounded-xl border py-2.5 pl-10 pr-4 text-xs sm:text-sm font-medium outline-none transition ${
                                                errors.email
                                                    ? 'border-red-500 bg-red-50/50 text-red-900 focus:border-red-600'
                                                    : 'border-slate-200 bg-slate-50 focus:border-blue-600 focus:bg-white'
                                            }`}
                                        />
                                    </div>
                                    {errors.email && (
                                        <p className="mt-1 text-[11px] font-semibold text-red-500">
                                            Email aktif wajib diisi.
                                        </p>
                                    )}
                                </div>
                            </form>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7 shadow-sm">
                            <h2 className="mb-5 text-sm sm:text-base font-bold text-slate-900">
                                Pilih Metode Pembayaran
                            </h2>

                            <div className="grid gap-3 sm:grid-cols-3">
                                {[
                                    {
                                        id: 'transfer',
                                        label: 'SeaBank / DANA Resmi',
                                        desc: 'Bebas admin ke 087762728979',
                                        icon: CreditCard
                                    },
                                    {
                                        id: 'qris',
                                        label: 'QRIS Dinamis (24 Jam)',
                                        desc: 'Scan instan semua E-Wallet & Bank',
                                        icon: QrCode
                                    },
                                    {
                                        id: 'cod',
                                        label: 'Bayar di Sekre',
                                        desc: 'Tunai di Sekretariat HIMATIFA G.3',
                                        icon: Store
                                    }
                                ].map((method) => {
                                    const isSelected = paymentMethod === method.id
                                    return (
                                        <button
                                            key={method.id}
                                            onClick={() => setPaymentMethod(method.id as PaymentMethod)}
                                            className={`relative flex flex-col items-start gap-3 rounded-xl border-2 p-4 text-left transition-all duration-200 cursor-pointer ${
                                                isSelected
                                                    ? 'border-blue-600 bg-blue-50/40'
                                                    : 'border-slate-200 bg-white hover:border-slate-300'
                                            }`}
                                        >
                                            <div className="flex w-full items-center justify-between">
                                                <div
                                                    className={`grid size-9 place-items-center rounded-lg ${
                                                        isSelected
                                                            ? 'bg-blue-600 text-white'
                                                            : 'bg-slate-100 text-slate-600'
                                                    }`}
                                                >
                                                    <method.icon className="size-4.5" />
                                                </div>
                                                {isSelected && (
                                                    <div className="grid size-5 place-items-center rounded-full bg-blue-600 text-white">
                                                        <Check className="size-3" />
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <p
                                                    className={`text-xs sm:text-sm font-bold ${
                                                        isSelected ? 'text-blue-600' : 'text-slate-900'
                                                    }`}
                                                >
                                                    {method.label}
                                                </p>
                                                <p className="text-[10px] text-slate-500 font-normal mt-0.5">
                                                    {method.desc}
                                                </p>
                                            </div>
                                        </button>
                                    )
                                })}
                            </div>

                            {paymentMethod !== 'cod' && (
                                <div className="mt-3.5 flex items-center gap-2 rounded-xl border border-amber-200/80 bg-amber-50/60 p-3 text-xs text-amber-900 font-medium">
                                    <Clock className="size-4 shrink-0 text-amber-600" />
                                    <span>
                                        <strong>Masa Berlaku 24 Jam:</strong> Tagihan otomatis kadaluarsa jika tidak
                                        diselesaikan dalam 24 jam.
                                    </span>
                                </div>
                            )}

                            {paymentMethod === 'transfer' && (
                                <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
                                    <p className="mb-3 text-xs font-semibold text-slate-700">
                                        Pilih Tujuan Transfer Resmi Ekraf HIMATIFA:
                                    </p>
                                    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                                        {bankList.map((bank) => {
                                            const isBankSelected = selectedBank === bank.id
                                            return (
                                                <button
                                                    key={bank.id}
                                                    onClick={() => setSelectedBank(bank.id)}
                                                    className={`flex items-center justify-between rounded-xl border px-3.5 py-2.5 transition-all cursor-pointer ${
                                                        isBankSelected
                                                            ? 'border-blue-600 bg-white shadow-xs ring-1 ring-blue-600'
                                                            : 'border-slate-200 bg-white hover:border-slate-300'
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-2.5">
                                                        <span className={`size-2.5 rounded-full ${bank.badgeColor}`} />
                                                        <span className="text-xs font-bold text-slate-800">
                                                            {bank.name}
                                                        </span>
                                                    </div>
                                                    {isBankSelected && (
                                                        <Check className="size-3.5 text-blue-600 shrink-0" />
                                                    )}
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="lg:sticky lg:top-24 lg:col-span-4">
                        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 text-white shadow-md">
                            <h3 className="mb-4 text-sm sm:text-base font-bold text-white">Rincian Pembayaran</h3>

                            <div className="flex flex-col gap-3 border-b border-slate-800 pb-4 text-xs sm:text-sm text-slate-300 font-normal">
                                <div className="flex justify-between">
                                    <span>Total Subtotal ({itemCount} Barang)</span>
                                    <span className="font-semibold text-white font-mono">
                                        Rp {baseTotal.toLocaleString('id-ID')}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Biaya Layanan</span>
                                    <span className="font-semibold text-white font-mono">
                                        {adminFee > 0 ? `Rp ${adminFee.toLocaleString('id-ID')}` : 'Gratis (Rp 0)'}
                                    </span>
                                </div>
                            </div>

                            <div className="mt-4">
                                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                    Total Tagihan Akhir
                                </span>
                                <p className="mt-1 text-2xl sm:text-3xl font-extrabold text-white font-mono">
                                    Rp {grandTotal.toLocaleString('id-ID')}
                                </p>
                            </div>

                            <button
                                onClick={handleCreateOrder}
                                disabled={isSubmitting || cartItems.length === 0}
                                className="mt-6 hidden w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-xs sm:text-sm font-semibold text-white transition-all hover:bg-blue-500 active:scale-[0.98] disabled:opacity-50 lg:flex cursor-pointer"
                            >
                                {isSubmitting ? (
                                    <Loader2 className="size-4 animate-spin" />
                                ) : (
                                    <>
                                        <span>Konfirmasi & Buat Pesanan</span>
                                        <ArrowRight className="size-4" />
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="fixed inset-x-0 bottom-0 z-50 flex items-center justify-between border-t border-slate-200 bg-white px-4 py-3.5 shadow-md lg:hidden">
                <div className="flex flex-col">
                    <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                        Total Pembayaran
                    </span>
                    <span className="text-base font-extrabold text-blue-600 font-mono">
                        Rp {grandTotal.toLocaleString('id-ID')}
                    </span>
                </div>
                <button
                    onClick={handleCreateOrder}
                    disabled={isSubmitting || cartItems.length === 0}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
                >
                    {isSubmitting ? <Loader2 className="size-3.5 animate-spin" /> : <span>Buat Pesanan</span>}
                    <ArrowRight className="size-3.5" />
                </button>
            </div>
        </main>
    )
}