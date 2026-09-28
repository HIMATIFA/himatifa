'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Check, CreditCard, MapPin, QrCode, Store } from 'lucide-react'

export default function CheckoutPage() {
  const [paymentMethod, setPaymentMethod] = useState<'qris' | 'transfer' | 'cod'>('qris')

  return (
    <main className="min-h-screen bg-[#f4f8fc] px-4 py-8 text-[#0a192f] sm:px-6 lg:px-10 lg:py-12">
      <div className="absolute right-[-5%] top-[20%] -z-10 h-150 w-150 rounded-full bg-cyan-300/20 blur-[150px]" />
      
      <div className="mx-auto max-w-5xl">
        <Link href="/ekrafstore/cart" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 transition-colors hover:text-[#2563eb]">
          <ArrowLeft className="size-4" /> Kembali ke Keranjang
        </Link>

        <div className="mt-8 mb-10">
          <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Selesaikan <span className="text-[#2563eb]">Pesanan.</span></h1>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
          
          <div className="flex flex-col gap-6">
            {/* Data Pemesan */}
            <div className="rounded-[2rem] border border-white/80 bg-white/60 p-6 shadow-lg shadow-blue-900/5 backdrop-blur-xl sm:p-8">
              <h2 className="mb-6 flex items-center gap-2 text-lg font-extrabold"><MapPin className="size-5 text-[#2563eb]" /> Data Pengambilan</h2>
              <form className="grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">Nama Lengkap</label>
                  <input type="text" placeholder="Masukkan nama..." className="w-full rounded-2xl border border-white/80 bg-white/50 px-4 py-3 text-sm outline-none transition-all focus:border-[#2563eb] focus:bg-white focus:ring-4 focus:ring-blue-500/10" />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">NIM</label>
                  <input type="text" placeholder="Contoh: 20261337001" className="w-full rounded-2xl border border-white/80 bg-white/50 px-4 py-3 text-sm outline-none transition-all focus:border-[#2563eb] focus:bg-white focus:ring-4 focus:ring-blue-500/10" />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">No. WhatsApp</label>
                  <input type="text" placeholder="08..." className="w-full rounded-2xl border border-white/80 bg-white/50 px-4 py-3 text-sm outline-none transition-all focus:border-[#2563eb] focus:bg-white focus:ring-4 focus:ring-blue-500/10" />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">Catatan Khusus (Opsional)</label>
                  <textarea rows={3} placeholder="Contoh: Ukuran jaket L ya kak..." className="w-full resize-none rounded-2xl border border-white/80 bg-white/50 px-4 py-3 text-sm outline-none transition-all focus:border-[#2563eb] focus:bg-white focus:ring-4 focus:ring-blue-500/10" />
                </div>
              </form>
            </div>

            {/* Metode Pembayaran */}
            <div className="rounded-[2rem] border border-white/80 bg-white/60 p-6 shadow-lg shadow-blue-900/5 backdrop-blur-xl sm:p-8">
              <h2 className="mb-6 text-lg font-extrabold">Metode Pembayaran</h2>
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  { id: 'qris', label: 'QRIS', icon: QrCode },
                  { id: 'transfer', label: 'Transfer Bank', icon: CreditCard },
                  { id: 'cod', label: 'Bayar di Sekre', icon: Store },
                ].map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id as any)}
                    className={`relative flex flex-col items-center gap-3 rounded-2xl border-2 p-4 transition-all ${paymentMethod === method.id ? 'border-[#2563eb] bg-blue-50/50 text-[#2563eb]' : 'border-white/80 bg-white/50 text-slate-500 hover:border-blue-200 hover:bg-white'}`}
                  >
                    {paymentMethod === method.id && <div className="absolute right-2 top-2 rounded-full bg-[#2563eb] p-0.5 text-white"><Check className="size-3" /></div>}
                    <method.icon className="size-6" />
                    <span className="text-xs font-bold">{method.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="h-fit rounded-[2rem] bg-[#071426] p-6 text-white shadow-xl sm:p-8">
            <h3 className="mb-6 text-lg font-extrabold text-white">Pembayaran</h3>
            <div className="flex justify-between border-b border-white/10 pb-4 text-sm text-blue-100/60">
              <span>Total Belanja</span>
              <span className="font-bold text-white">Rp 235.000</span>
            </div>
            <div className="mt-6">
              <p className="text-xs font-bold uppercase tracking-wider text-blue-200">Total Dibayar</p>
              <p className="mt-1 text-3xl font-black text-white">Rp 235.000</p>
            </div>
            
            <button className="mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-[#2563eb] py-4 text-sm font-bold shadow-xl shadow-blue-600/20 transition-all hover:-translate-y-0.5 hover:bg-blue-600">
              Buat Pesanan
            </button>
            <p className="mt-4 text-center text-[10px] leading-relaxed text-blue-100/40">
              Dengan membuat pesanan, lo setuju dengan syarat dan ketentuan Ekraf Store Himatifa.
            </p>
          </div>
          
        </div>
      </div>
    </main>
  )
}