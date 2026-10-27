'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
    ArrowLeft,
    Check,
    CreditCard,
    MapPin,
    QrCode,
    Store,
    Info,
    Building2,
    ShieldCheck,
    Mail,
    Phone,
    User,
    ArrowRight
} from 'lucide-react'

type PaymentMethod = 'qris' | 'transfer' | 'cod'

interface BankOption {
    id: string
    name: string
    color: string
}

const bankList: BankOption[] = [
    { id: 'bca', name: 'BCA', color: 'text-blue-600' },
    { id: 'mandiri', name: 'Mandiri', color: 'text-blue-800' },
    { id: 'bri', name: 'BRI', color: 'text-blue-700' },
    { id: 'bni', name: 'BNI', color: 'text-orange-500' },
    { id: 'bsi', name: 'BSI', color: 'text-teal-600' },
    { id: 'cimb', name: 'CIMB Niaga', color: 'text-red-600' },
    { id: 'permata', name: 'Permata', color: 'text-green-600' },
]

export default function CheckoutPage() {
    const router = useRouter()
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('qris')
    const [selectedBank, setSelectedBank] = useState<string>('bca')
    const [baseTotal, setBaseTotal] = useState(0)
    const [itemCount, setItemCount] = useState(0)

    useEffect(() => {
        const savedCart = localStorage.getItem('himatifa_cart')
        if (savedCart) {
            try {
                const parsed = JSON.parse(savedCart)
                const selected = parsed.filter((item: { selected: boolean }) => item.selected)
                const total = selected.reduce((sum: number, item: { price: number; qty: number }) => sum + item.price * item.qty, 0)
                const count = selected.reduce((sum: number, item: { qty: number }) => sum + item.qty, 0)
                setBaseTotal(total)
                setItemCount(count)
            } catch {
                setBaseTotal(0)
                setItemCount(0)
            }
        }
    }, [])

    const adminFee = paymentMethod === 'qris' ? 1500 : paymentMethod === 'transfer' ? 2500 : 0
    const grandTotal = baseTotal + adminFee

    const handleCreateOrder = () => {
        const randomOrderNum = Math.floor(100000 + Math.random() * 900000).toString()
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
                            <p className="text-xs text-slate-500 font-normal">
                                Selesaikan Informasi & Pembayaran
                            </p>
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
                                <strong className="font-semibold text-slate-900">Catatan Pengiriman:</strong> Akses produk digital (Lisensi/Akun Premium) akan dikirim langsung via WhatsApp/Email. Untuk produk fisik (Merchandise), silakan ambil langsung di Sekretariat HIMATIFA.
                            </div>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7 shadow-sm">
                            <h2 className="mb-5 flex items-center gap-2 text-sm sm:text-base font-bold text-slate-900">
                                <MapPin className="size-4.5 text-blue-600" />
                                <span>Informasi Pemesan & Kontak</span>
                            </h2>

                            <form className="grid gap-4 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
                                <div className="sm:col-span-2">
                                    <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                                        Nama Lengkap
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="text"
                                            placeholder="Masukkan nama lengkap Anda..."
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-xs sm:text-sm font-medium outline-none transition focus:border-blue-600 focus:bg-white"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                                        Nomor WhatsApp
                                    </label>
                                    <div className="relative">
                                        <Phone className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="tel"
                                            placeholder="08xxxxxxxxxx"
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-xs sm:text-sm font-medium outline-none transition focus:border-blue-600 focus:bg-white"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                                        Email Aktif
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="email"
                                            placeholder="email@domain.com"
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-xs sm:text-sm font-medium outline-none transition focus:border-blue-600 focus:bg-white"
                                        />
                                    </div>
                                </div>
                            </form>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7 shadow-sm">
                            <h2 className="mb-5 text-sm sm:text-base font-bold text-slate-900">
                                Pilih Metode Pembayaran
                            </h2>

                            <div className="grid gap-3 sm:grid-cols-3">
                                {[
                                    { id: 'qris', label: 'QRIS Instant', desc: 'Verifikasi Otomatis', icon: QrCode },
                                    { id: 'transfer', label: 'Transfer Bank', desc: 'Virtual Account', icon: CreditCard },
                                    { id: 'cod', label: 'Bayar di Sekre', desc: 'Cash / Pengambilan Direct', icon: Store },
                                ].map((method) => {
                                    const isSelected = paymentMethod === method.id

                                    return (
                                        <button
                                            key={method.id}
                                            onClick={() => setPaymentMethod(method.id as PaymentMethod)}
                                            className={`relative flex flex-col items-start gap-3 rounded-xl border-2 p-4 text-left transition-all duration-200 ${
                                                isSelected
                                                    ? 'border-blue-600 bg-blue-50/40'
                                                    : 'border-slate-200 bg-white hover:border-slate-300'
                                            }`}
                                        >
                                            <div className="flex w-full items-center justify-between">
                                                <div
                                                    className={`grid size-9 place-items-center rounded-lg ${
                                                        isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
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
                                                <p className={`text-xs sm:text-sm font-bold ${isSelected ? 'text-blue-600' : 'text-slate-900'}`}>
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

                            {paymentMethod === 'transfer' && (
                                <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
                                    <p className="mb-3 text-xs font-semibold text-slate-700">
                                        Pilih Bank Tujuan Transfer:
                                    </p>
                                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                                        {bankList.map((bank) => {
                                            const isBankSelected = selectedBank === bank.id
                                            return (
                                                <button
                                                    key={bank.id}
                                                    onClick={() => setSelectedBank(bank.id)}
                                                    className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-left transition-all ${
                                                        isBankSelected
                                                            ? 'border-blue-600 bg-white shadow-xs'
                                                            : 'border-slate-200 bg-white hover:border-slate-300'
                                                    }`}
                                                >
                                                    <Building2 className={`size-4 shrink-0 ${isBankSelected ? 'text-blue-600' : 'text-slate-400'}`} />
                                                    <span className={`text-xs font-bold ${bank.color}`}>
                                                        {bank.name}
                                                    </span>
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
                            <h3 className="mb-4 text-sm sm:text-base font-bold text-white">
                                Rincian Pembayaran
                            </h3>

                            <div className="flex flex-col gap-3 border-b border-slate-800 pb-4 text-xs sm:text-sm text-slate-300 font-normal">
                                <div className="flex justify-between">
                                    <span>Total Subtotal ({itemCount} Barang)</span>
                                    <span className="font-semibold text-white">
                                        Rp {baseTotal.toLocaleString('id-ID')}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Biaya Layanan</span>
                                    <span className="font-semibold text-white">
                                        {adminFee > 0 ? `Rp ${adminFee.toLocaleString('id-ID')}` : 'Gratis'}
                                    </span>
                                </div>
                            </div>

                            <div className="mt-4">
                                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                    Total Tagihan Akhir
                                </span>
                                <p className="mt-1 text-2xl sm:text-3xl font-extrabold text-white">
                                    Rp {grandTotal.toLocaleString('id-ID')}
                                </p>
                            </div>

                            <button
                                onClick={handleCreateOrder}
                                className="mt-6 hidden w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-xs sm:text-sm font-semibold text-white transition-all hover:bg-blue-500 active:scale-[0.98] lg:flex"
                            >
                                <span>Konfirmasi & Buat Pesanan</span>
                                <ArrowRight className="size-4" />
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
                    <span className="text-base font-extrabold text-blue-600">
                        Rp {grandTotal.toLocaleString('id-ID')}
                    </span>
                </div>
                <button
                    onClick={handleCreateOrder}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white transition-all active:scale-[0.98]"
                >
                    <span>Buat Pesanan</span>
                    <ArrowRight className="size-3.5" />
                </button>
            </div>
        </main>
    )
}