'use client'

import { useState } from 'react'
import Link from 'next/link'
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
    User
} from 'lucide-react'

const bankList = [
    { id: 'bca', name: 'BCA', color: 'text-blue-600' },
    { id: 'mandiri', name: 'Mandiri', color: 'text-blue-800' },
    { id: 'bri', name: 'BRI', color: 'text-blue-700' },
    { id: 'bni', name: 'BNI', color: 'text-orange-500' },
    { id: 'bsi', name: 'BSI', color: 'text-teal-600' },
    { id: 'cimb', name: 'CIMB Niaga', color: 'text-red-600' },
    { id: 'permata', name: 'Permata', color: 'text-green-600' },
]

export default function CheckoutPage() {
    const [paymentMethod, setPaymentMethod] = useState<'qris' | 'transfer' | 'cod'>('qris')
    const [selectedBank, setSelectedBank] = useState<string>('bca')

    return (
        <main className="min-h-screen bg-[#f8fafc] text-slate-800 selection:bg-blue-200">

            <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/60 px-4 py-4 sm:px-6 lg:px-10">
                <div className="mx-auto flex max-w-6xl items-center gap-4">
                    <Link href="/ekrafstore/cart" className="grid size-10 place-items-center rounded-full bg-slate-100 text-slate-600 transition-colors hover:bg-slate-200 hover:text-[#2563eb]">
                        <ArrowLeft className="size-5" />
                    </Link>
                    <div>
                        <h1 className="text-lg font-black tracking-tight text-slate-900">Checkout</h1>
                        <p className="text-xs font-medium text-slate-500">Selesaikan pesananmu</p>
                    </div>
                </div>
            </header>

            <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-10 lg:py-8 mb-32 lg:mb-10">
                <div className="grid gap-6 lg:grid-cols-12 lg:items-start lg:gap-8">
                    <div className="lg:col-span-8 flex flex-col gap-6">
                        <div className="flex items-start gap-3 rounded-2xl border border-blue-200 bg-blue-50/50 p-4">
                            <Info className="size-5 shrink-0 text-[#2563eb] mt-0.5" />
                            <div>
                                <h3 className="text-sm font-bold text-slate-800">Catatan Pengiriman</h3>
                                <p className="mt-1 text-xs leading-relaxed text-slate-600">
                                    Untuk <strong>Produk Digital (Akun Premium/Lisensi)</strong>, akses akan dikirimkan otomatis melalui WhatsApp atau Email yang Anda daftarkan di bawah.
                                    Untuk produk fisik (Merchandise), silakan pilih opsi pengambilan di Sekre HIMATIFA.
                                </p>
                            </div>
                        </div>

                        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
                            <h2 className="mb-6 flex items-center gap-2 text-base font-extrabold text-slate-800">
                                <MapPin className="size-5 text-[#2563eb]" /> Informasi Kontak & Pengiriman
                            </h2>

                            <form className="grid gap-5 sm:grid-cols-2">
                                <div className="sm:col-span-2">
                                    <label className="mb-2 block text-xs font-bold text-slate-600">Nama Lengkap</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                                        <input type="text" placeholder="Masukkan nama..." className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition-all focus:border-[#2563eb] focus:bg-white focus:ring-2 focus:ring-blue-500/20" />
                                    </div>
                                </div>

                                <div>
                                    <label className="mb-2 block text-xs font-bold text-slate-600">Nomor WhatsApp</label>
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                                        <input type="tel" placeholder="08..." className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition-all focus:border-[#2563eb] focus:bg-white focus:ring-2 focus:ring-blue-500/20" />
                                    </div>
                                </div>

                                <div>
                                    <label className="mb-2 block text-xs font-bold text-slate-600">Email (Untuk Produk Digital)</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                                        <input type="email" placeholder="email@contoh.com" className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition-all focus:border-[#2563eb] focus:bg-white focus:ring-2 focus:ring-blue-500/20" />
                                    </div>
                                </div>

                            </form>
                        </div>

                        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
                            <h2 className="mb-6 text-base font-extrabold text-slate-800">Metode Pembayaran</h2>

                            <div className="grid gap-3 sm:grid-cols-3">
                                {[
                                    { id: 'qris', label: 'QRIS', desc: 'Otomatis dicek', icon: QrCode },
                                    { id: 'transfer', label: 'Transfer Bank', desc: 'Virtual Account', icon: CreditCard },
                                    { id: 'cod', label: 'Bayar di Sekre', desc: 'Cash / Langsung', icon: Store },
                                ].map((method) => (
                                    <button
                                        key={method.id}
                                        onClick={() => setPaymentMethod(method.id as any)}
                                        className={`relative flex flex-col items-start gap-3 rounded-2xl border-2 p-4 text-left transition-all ${
                                            paymentMethod === method.id
                                                ? 'border-[#2563eb] bg-blue-50/50'
                                                : 'border-slate-100 bg-slate-50 hover:border-blue-200 hover:bg-white'
                                        }`}
                                    >
                                        <div className="flex w-full items-center justify-between">
                                            <div className={`grid size-10 place-items-center rounded-xl ${paymentMethod === method.id ? 'bg-[#2563eb] text-white' : 'bg-white text-slate-500 shadow-sm'}`}>
                                                <method.icon className="size-5" />
                                            </div>
                                            {paymentMethod === method.id && (
                                                <div className="grid size-5 place-items-center rounded-full bg-[#2563eb] text-white">
                                                    <Check className="size-3" />
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <p className={`text-sm font-bold ${paymentMethod === method.id ? 'text-[#2563eb]' : 'text-slate-700'}`}>{method.label}</p>
                                            <p className="text-[10px] text-slate-500 mt-0.5">{method.desc}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>

                            {paymentMethod === 'transfer' && (
                                <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 animate-in fade-in slide-in-from-top-2">
                                    <p className="mb-3 text-xs font-bold text-slate-600">Pilih Bank Tujuan</p>
                                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                                        {bankList.map((bank) => (
                                            <button
                                                key={bank.id}
                                                onClick={() => setSelectedBank(bank.id)}
                                                className={`flex items-center gap-2 rounded-xl border p-3 transition-all ${
                                                    selectedBank === bank.id
                                                        ? 'border-[#2563eb] bg-white shadow-sm ring-1 ring-[#2563eb]'
                                                        : 'border-slate-200 bg-white hover:border-blue-300'
                                                }`}
                                            >
                                                <Building2 className={`size-4 ${selectedBank === bank.id ? 'text-[#2563eb]' : 'text-slate-400'}`} />
                                                <span className={`text-xs font-bold ${bank.color}`}>{bank.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="lg:sticky lg:top-24 lg:col-span-4 flex flex-col gap-4">
                        <div className="rounded-3xl bg-[#0a192f] p-6 text-white shadow-xl sm:p-8">
                            <h3 className="mb-6 text-base font-extrabold text-white">Ringkasan Pesanan</h3>

                            <div className="flex flex-col gap-3 border-b border-white/10 pb-4 text-sm text-slate-300">
                                <div className="flex justify-between">
                                    <span>Total Harga (3 Barang)</span>
                                    <span className="font-semibold text-white">Rp 235.000</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Biaya Admin</span>
                                    <span className="font-semibold text-white">
                    {paymentMethod === 'qris' ? 'Rp 1.500' : paymentMethod === 'transfer' ? 'Rp 2.500' : 'Gratis'}
                  </span>
                                </div>
                            </div>

                            <div className="mt-6">
                                <p className="text-xs font-bold uppercase tracking-wider text-blue-300">Total Tagihan</p>
                                <p className="mt-1 text-3xl font-black text-white">
                                    Rp {(235000 + (paymentMethod === 'qris' ? 1500 : paymentMethod === 'transfer' ? 2500 : 0)).toLocaleString('id-ID')}
                                </p>
                            </div>

                            <div className="mt-6 flex items-center gap-2 rounded-xl bg-white/10 p-3 text-xs text-blue-100 backdrop-blur-sm">
                                <ShieldCheck className="size-4 shrink-0 text-blue-400" />
                                <p>Pembayaran 100% aman dan terverifikasi.</p>
                            </div>

                            <button className="mt-8 hidden w-full items-center justify-center gap-2 rounded-full bg-[#2563eb] py-4 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition-all hover:-translate-y-0.5 hover:bg-blue-600 lg:flex">
                                Buat Pesanan Sekarang
                            </button>
                        </div>
                    </div>

                </div>
            </div>

            <div className="fixed inset-x-0 bottom-0 z-50 flex items-center justify-between border-t border-slate-200 bg-white px-4 py-3 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] lg:hidden">
                <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-500">Total Tagihan</span>
                    <span className="text-lg font-black text-[#2563eb]">
            Rp {(235000 + (paymentMethod === 'qris' ? 1500 : paymentMethod === 'transfer' ? 2500 : 0)).toLocaleString('id-ID')}
          </span>
                </div>
                <button className="rounded-full bg-[#2563eb] px-8 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/30 transition-all active:scale-95">
                    Buat Pesanan
                </button>
            </div>
        </main>
    )
}