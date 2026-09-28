'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, MessageSquareWarning, Send, ShieldAlert } from 'lucide-react'

export default function AspirasiPage() {
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setTimeout(() => setIsSubmitting(false), 2000)
  }

  return (
    <main className="min-h-screen bg-[#f4f8fc] px-4 py-8 text-[#0a192f] sm:px-6 lg:px-10 lg:py-12">
      <div className="fixed left-[-10%] top-[-5%] -z-10 h-125 w-125 rounded-full bg-blue-400/20 blur-[120px]" />
      <div className="fixed right-[-5%] top-[20%] -z-10 h-150 w-150 rounded-full bg-cyan-300/20 blur-[150px]" />

      <div className="mx-auto max-w-4xl">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 transition-colors hover:text-[#2563eb]">
          <ArrowLeft className="size-4" /> Beranda
        </Link>

        <div className="mt-8 mb-10 text-center">
          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl bg-blue-100/50 text-[#2563eb] shadow-inner">
            <MessageSquareWarning className="size-8" />
          </div>
          <h1 className="text-4xl font-black tracking-tight sm:text-5xl">Suara <span className="text-[#2563eb]">Mahasiswa.</span></h1>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-slate-500">
            Sampaikan kritik, saran, atau keluhan seputar fasilitas, layanan akademik, dan kegiatan Himatifa. Suara lo sangat berarti untuk evaluasi kami.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="overflow-hidden rounded-[2.5rem] border border-white/80 bg-white/60 p-6 shadow-xl shadow-blue-900/5 backdrop-blur-xl sm:p-10">
          
          {/* Toggle Anonymous */}
          <div className="mb-8 flex items-center justify-between rounded-2xl border border-blue-100 bg-blue-50/50 p-4">
            <div className="flex items-center gap-3">
              <ShieldAlert className={`size-5 ${isAnonymous ? 'text-emerald-500' : 'text-slate-400'}`} />
              <div>
                <p className="text-sm font-bold text-[#0a192f]">Kirim sebagai Anonim</p>
                <p className="text-xs text-slate-500">Identitas lo akan disembunyikan dari pengurus.</p>
              </div>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input type="checkbox" className="peer sr-only" checked={isAnonymous} onChange={() => setIsAnonymous(!isAnonymous)} />
              <div className="peer h-6 w-11 rounded-full bg-slate-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-[#2563eb] peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300"></div>
            </label>
          </div>

          <div className="grid gap-6">
            {!isAnonymous && (
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">Nama Lengkap</label>
                  <input type="text" required placeholder="Masukkan nama..." className="w-full rounded-xl border border-white/80 bg-white/50 px-4 py-3.5 text-sm outline-none transition focus:border-[#2563eb] focus:bg-white focus:ring-4 focus:ring-blue-500/10" />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">NIM</label>
                  <input type="text" required placeholder="Contoh: 20241337..." className="w-full rounded-xl border border-white/80 bg-white/50 px-4 py-3.5 text-sm outline-none transition focus:border-[#2563eb] focus:bg-white focus:ring-4 focus:ring-blue-500/10" />
                </div>
              </div>
            )}

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">Kategori Laporan</label>
              <select className="w-full rounded-xl border border-white/80 bg-white/50 px-4 py-3.5 text-sm outline-none transition focus:border-[#2563eb] focus:bg-white focus:ring-4 focus:ring-blue-500/10">
                <option value="akademik">Layanan Akademik & Perkuliahan</option>
                <option value="fasilitas">Fasilitas Kampus & Lab</option>
                <option value="organisasi">Kegiatan Himatifa</option>
                <option value="lainnya">Lainnya</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">Detail Pesan / Aspirasi</label>
              <textarea required rows={5} placeholder="Ceritakan sedetail mungkin hal yang ingin lo sampaikan..." className="w-full resize-none rounded-xl border border-white/80 bg-white/50 px-4 py-3.5 text-sm outline-none transition focus:border-[#2563eb] focus:bg-white focus:ring-4 focus:ring-blue-500/10" />
            </div>

            <button disabled={isSubmitting} type="submit" className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#2563eb] py-4 text-sm font-bold text-white shadow-xl shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700 disabled:opacity-70 disabled:hover:translate-y-0">
              {isSubmitting ? (
                <span className="size-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <>Kirim Aspirasi <Send className="size-4" /></>
              )}
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}