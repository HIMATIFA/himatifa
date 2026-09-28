'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react'

export default function CartPage() {
  const [items, setItems] = useState([
    { id: 1, name: 'Jaket Himatifa 2026', price: 185000, qty: 1, category: 'Apparel' },
    { id: 2, name: 'Lanyard Premium', price: 25000, qty: 2, category: 'Aksesoris' },
  ])

  const updateQty = (id: number, delta: number) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const newQty = item.qty + delta
        return { ...item, qty: newQty > 0 ? newQty : 1 }
      }
      return item
    }))
  }

  const subtotal = items.reduce((acc, item) => acc + (item.price * item.qty), 0)

  return (
    <main className="min-h-screen bg-[#f4f8fc] px-4 py-8 text-[#0a192f] sm:px-6 lg:px-10 lg:py-12">
      <div className="absolute left-[-10%] top-[-5%] -z-10 h-125 w-125 rounded-full bg-blue-400/20 blur-[120px]" />
      
      <div className="mx-auto max-w-5xl">
        <Link href="/ekrafstore" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 transition-colors hover:text-[#2563eb]">
          <ArrowLeft className="size-4" /> Lanjut Belanja
        </Link>

        <div className="mt-8 mb-10">
          <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Keranjang <span className="text-[#2563eb]">Belanja.</span></h1>
          <p className="mt-2 text-sm text-slate-500">Periksa kembali item merchandise pilihan lo sebelum checkout.</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
          {/* Item List */}
          <div className="flex flex-col gap-4">
            {items.map((item) => (
              <div key={item.id} className="flex flex-col gap-4 rounded-[2rem] border border-white/80 bg-white/60 p-4 shadow-lg shadow-blue-900/5 backdrop-blur-xl sm:flex-row sm:items-center p-5">
                <div className="aspect-square w-24 shrink-0 rounded-2xl bg-slate-200" />
                <div className="flex flex-1 flex-col justify-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#2563eb]">{item.category}</span>
                  <h3 className="text-lg font-extrabold text-[#0a192f]">{item.name}</h3>
                  <p className="mt-1 font-bold text-slate-500">Rp {item.price.toLocaleString('id-ID')}</p>
                </div>
                
                <div className="flex items-center justify-between sm:flex-col sm:items-end sm:gap-4">
                  <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-white/50 p-1 backdrop-blur-sm">
                    <button onClick={() => updateQty(item.id, -1)} className="grid size-8 place-items-center rounded-full bg-white text-slate-600 shadow-sm hover:bg-slate-50 hover:text-[#2563eb]"><Minus className="size-3" /></button>
                    <span className="w-4 text-center text-sm font-bold">{item.qty}</span>
                    <button onClick={() => updateQty(item.id, 1)} className="grid size-8 place-items-center rounded-full bg-white text-slate-600 shadow-sm hover:bg-slate-50 hover:text-[#2563eb]"><Plus className="size-3" /></button>
                  </div>
                  <button className="text-sm font-bold text-red-500 transition-colors hover:text-red-700 flex items-center gap-1">
                    <Trash2 className="size-4" /> <span className="sm:hidden">Hapus</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="sticky top-24 h-fit rounded-[2rem] border border-white/80 bg-white/60 p-6 shadow-lg shadow-blue-900/5 backdrop-blur-xl sm:p-8">
            <h3 className="mb-6 flex items-center gap-2 text-lg font-extrabold"><ShoppingBag className="size-5 text-[#2563eb]" /> Ringkasan Pesanan</h3>
            
            <div className="flex flex-col gap-3 border-b border-slate-200/60 pb-6 text-sm">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal ({items.reduce((a, b) => a + b.qty, 0)} item)</span>
                <span className="font-bold text-[#0a192f]">Rp {subtotal.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Biaya Layanan</span>
                <span className="font-bold text-[#0a192f]">Gratis</span>
              </div>
            </div>
            
            <div className="mt-6 flex items-end justify-between">
              <span className="text-sm font-bold text-slate-500">Total Tagihan</span>
              <span className="text-2xl font-black text-[#2563eb]">Rp {subtotal.toLocaleString('id-ID')}</span>
            </div>

            <Link href="/ekrafstore/checkout" className="mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-[#2563eb] py-4 text-sm font-bold text-white shadow-xl shadow-blue-600/20 transition-all hover:-translate-y-0.5 hover:bg-blue-700">
              Checkout Sekarang <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}