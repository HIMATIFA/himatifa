'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Mail, MapPin, MessageCircle, Phone, Send } from 'lucide-react'

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setTimeout(() => setIsSubmitting(false), 2000)
  }

  return (
    <main className="min-h-screen bg-[#f4f8fc] px-4 py-8 text-[#0a192f] sm:px-6 lg:px-10 lg:py-12">
      <div className="fixed right-[-5%] top-[20%] -z-10 h-150 w-150 rounded-full bg-cyan-300/20 blur-[150px]" />
      
      <div className="mx-auto max-w-6xl">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 transition-colors hover:text-[#2563eb]">
          <ArrowLeft className="size-4" /> Beranda
        </Link>

        <div className="mt-8 mb-14">
          <p className="mb-3 text-xs font-bold uppercase tracking-[.2em] text-[#2563eb]">Hubungi Kami</p>
          <h1 className="text-4xl font-black tracking-tight sm:text-6xl">Mari <span className="text-[#2563eb]">Terhubung.</span></h1>
          <p className="mt-5 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
            Punya pertanyaan, tawaran kerja sama, atau ingin mengundang delegasi kami? Jangan ragu untuk meninggalkan pesan.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
          
          {/* Informasi Kontak */}
          <div className="flex flex-col gap-5">
            <div className="group rounded-[2rem] border border-white/80 bg-white/60 p-6 shadow-lg shadow-blue-900/5 backdrop-blur-xl transition hover:-translate-y-1">
              <div className="mb-4 grid size-12 place-items-center rounded-2xl bg-blue-100 text-[#2563eb]">
                <MapPin className="size-6" />
              </div>
              <h3 className="text-lg font-black text-[#0a192f]">Sekretariat HIMATIFA</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">
                Gedung G Lantai 2, Kampus Universitas Muhammadiyah Surabaya.<br />
                Jl. Sutorejo No. 59, Mulyorejo, Surabaya, Jawa Timur 60113.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <a href="mailto:himatifa@ft.um-surabaya.ac.id" className="group rounded-[2rem] border border-white/80 bg-white/60 p-6 shadow-lg shadow-blue-900/5 backdrop-blur-xl transition hover:-translate-y-1 hover:border-blue-200">
                <div className="mb-4 grid size-10 place-items-center rounded-xl bg-blue-50 text-[#2563eb] transition group-hover:bg-[#2563eb] group-hover:text-white">
                  <Mail className="size-5" />
                </div>
                <h3 className="text-sm font-extrabold text-[#0a192f]">Email Resmi</h3>
                <p className="mt-1 text-xs text-slate-500 line-clamp-1">himatifa@ft.um-surabaya.ac.id</p>
              </a>

              <a href="https://wa.me/6281234567890" target="_blank" rel="noreferrer" className="group rounded-[2rem] border border-white/80 bg-white/60 p-6 shadow-lg shadow-blue-900/5 backdrop-blur-xl transition hover:-translate-y-1 hover:border-green-200">
                <div className="mb-4 grid size-10 place-items-center rounded-xl bg-green-50 text-green-600 transition group-hover:bg-green-500 group-hover:text-white">
                  <MessageCircle className="size-5" />
                </div>
                <h3 className="text-sm font-extrabold text-[#0a192f]">WhatsApp (Humas)</h3>
                <p className="mt-1 text-xs text-slate-500">+62 812-3456-7890</p>
              </a>
            </div>
          </div>

          {/* Form Kontak */}
          <div className="rounded-[2.5rem] border border-white/80 bg-white/60 p-6 shadow-xl shadow-blue-900/5 backdrop-blur-xl sm:p-10">
            <h2 className="mb-6 text-2xl font-black text-[#0a192f]">Kirim Pesan Langsung</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">Nama Lengkap</label>
                  <input type="text" required placeholder="John Doe" className="w-full rounded-xl border border-white/80 bg-white/50 px-4 py-3 text-sm outline-none transition focus:border-[#2563eb] focus:bg-white focus:ring-4 focus:ring-blue-500/10" />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">Instansi / Kampus</label>
                  <input type="text" placeholder="Opsional" className="w-full rounded-xl border border-white/80 bg-white/50 px-4 py-3 text-sm outline-none transition focus:border-[#2563eb] focus:bg-white focus:ring-4 focus:ring-blue-500/10" />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">Email Balasan</label>
                <input type="email" required placeholder="john@example.com" className="w-full rounded-xl border border-white/80 bg-white/50 px-4 py-3 text-sm outline-none transition focus:border-[#2563eb] focus:bg-white focus:ring-4 focus:ring-blue-500/10" />
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">Isi Pesan</label>
                <textarea required rows={4} placeholder="Tuliskan tujuan kerja sama atau pertanyaan Anda di sini..." className="w-full resize-none rounded-xl border border-white/80 bg-white/50 px-4 py-3 text-sm outline-none transition focus:border-[#2563eb] focus:bg-white focus:ring-4 focus:ring-blue-500/10" />
              </div>

              <button disabled={isSubmitting} type="submit" className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#0a192f] py-4 text-sm font-bold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:bg-[#2563eb] disabled:opacity-70 disabled:hover:translate-y-0">
                {isSubmitting ? (
                  <span className="size-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <>Kirim Pesan <Send className="size-4" /></>
                )}
              </button>
            </form>
          </div>
          
        </div>
      </div>
    </main>
  )
}