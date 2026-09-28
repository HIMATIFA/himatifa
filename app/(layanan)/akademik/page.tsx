import Link from 'next/link'
import { ArrowLeft, BookOpen, Briefcase, CalendarDays, Download, FileCheck2, FileText, GraduationCap, Link2 } from 'lucide-react'

export default function AkademikPage() {
  return (
    <main className="min-h-screen bg-[#f4f8fc] px-4 py-8 text-[#0a192f] sm:px-6 lg:px-10 lg:py-12">
      {/* Background Ornaments */}
      <div className="fixed left-[-10%] top-[-5%] -z-10 h-125 w-125 rounded-full bg-blue-400/20 blur-[120px]" />
      <div className="fixed right-[-5%] top-[20%] -z-10 h-150 w-150 rounded-full bg-cyan-300/20 blur-[150px]" />

      <div className="mx-auto max-w-6xl">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 transition-colors hover:text-[#2563eb]">
          <ArrowLeft className="size-4" /> Beranda
        </Link>

        {/* Header Section */}
        <div className="mt-8 mb-14">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/80 px-4 py-1.5 backdrop-blur">
            <BookOpen className="size-3.5 text-blue-600" />
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Pusat Informasi</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight sm:text-6xl">Layanan <br /><span className="text-[#2563eb]">Akademik.</span></h1>
          <p className="mt-5 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
            Akses cepat untuk panduan perkuliahan, administrasi Kerja Praktik, syarat Tugas Akhir, hingga kalender akademik S1 Informatika UMSurabaya.
          </p>
        </div>

        {/* Main Grid Content */}
        <div className="grid gap-6 md:grid-cols-2">
          
          {/* Card 1: KRS & Perkuliahan */}
          <div className="group rounded-[2rem] border border-white/80 bg-white/60 p-6 shadow-lg shadow-blue-900/5 backdrop-blur-xl transition hover:-translate-y-1 sm:p-8">
            <div className="mb-6 grid size-14 place-items-center rounded-2xl bg-blue-100 text-[#2563eb]">
              <CalendarDays className="size-7" />
            </div>
            <h2 className="text-xl font-black text-[#0a192f]">KRS & Perkuliahan</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">Informasi jadwal kuliah, panduan pengisian Kartu Rencana Studi (KRS), dan kalender akademik semester berjalan.</p>
            
            <div className="mt-6 flex flex-col gap-3">
              <a href="#" className="flex items-center justify-between rounded-xl border border-slate-100 bg-white/50 p-3 text-sm font-bold text-slate-600 transition hover:border-[#2563eb] hover:text-[#2563eb]">
                Kalender Akademik 2026/2027 <Download className="size-4" />
              </a>
              <a href="#" className="flex items-center justify-between rounded-xl border border-slate-100 bg-white/50 p-3 text-sm font-bold text-slate-600 transition hover:border-[#2563eb] hover:text-[#2563eb]">
                SOP Pengisian KRS Online <Link2 className="size-4" />
              </a>
            </div>
          </div>

          {/* Card 2: Kerja Praktik & Magang (Highlighted) */}
          <div className="group relative overflow-hidden rounded-[2rem] border border-[#2563eb]/20 bg-blue-50/50 p-6 shadow-lg shadow-blue-900/5 backdrop-blur-xl transition hover:-translate-y-1 sm:p-8">
            <div className="absolute -right-10 -top-10 size-40 rounded-full bg-blue-200/30 blur-2xl" />
            <div className="relative z-10">
              <div className="mb-6 grid size-14 place-items-center rounded-2xl bg-[#2563eb] text-white shadow-md">
                <Briefcase className="size-7" />
              </div>
              <h2 className="text-xl font-black text-[#0a192f]">Kerja Praktik & Magang</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">Panduan pelaksanaan magang, syarat penyusunan laporan, dan kebijakan konversi SKS untuk kegiatan magang mandiri saat libur semester.</p>
              
              <div className="mt-6 flex flex-col gap-3">
                <a href="#" className="flex items-center justify-between rounded-xl bg-white p-3 text-sm font-bold text-[#0a192f] shadow-sm transition hover:text-[#2563eb]">
                  Panduan Konversi Magang Mandiri <FileCheck2 className="size-4 text-[#2563eb]" />
                </a>
                <a href="#" className="flex items-center justify-between rounded-xl border border-slate-200 bg-white/50 p-3 text-sm font-bold text-slate-600 transition hover:border-[#2563eb] hover:text-[#2563eb]">
                  Form Pengajuan Kerja Praktik <Download className="size-4" />
                </a>
              </div>
              
              {/* Kontak Dosen Pembimbing / Koordinator */}
              <div className="mt-6 rounded-xl border border-blue-100 bg-white/60 p-4 text-xs">
                <p className="font-bold text-slate-700">Koordinator & Konsultasi KP:</p>
                <ul className="mt-2 space-y-1 text-slate-500">
                  <li className="flex items-center gap-2">• Bu Tining (Administrasi & Persetujuan)</li>
                  <li className="flex items-center gap-2">• Pak Ashr (Konversi SKS & Kurikulum)</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Card 3: Tugas Akhir / Skripsi */}
          <div className="group rounded-[2rem] border border-white/80 bg-white/60 p-6 shadow-lg shadow-blue-900/5 backdrop-blur-xl transition hover:-translate-y-1 sm:p-8">
            <div className="mb-6 grid size-14 place-items-center rounded-2xl bg-indigo-100 text-indigo-600">
              <GraduationCap className="size-7" />
            </div>
            <h2 className="text-xl font-black text-[#0a192f]">Tugas Akhir / Skripsi</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">Prosedur pendaftaran proposal, format penulisan skripsi terbaru, dan alur pendaftaran sidang pendadaran.</p>
            
            <div className="mt-6 flex flex-col gap-3">
              <a href="#" className="flex items-center justify-between rounded-xl border border-slate-100 bg-white/50 p-3 text-sm font-bold text-slate-600 transition hover:border-indigo-500 hover:text-indigo-600">
                Template Penulisan Proposal <Download className="size-4" />
              </a>
              <a href="#" className="flex items-center justify-between rounded-xl border border-slate-100 bg-white/50 p-3 text-sm font-bold text-slate-600 transition hover:border-indigo-500 hover:text-indigo-600">
                Alur Pendaftaran Sidang <Link2 className="size-4" />
              </a>
            </div>
          </div>

          {/* Card 4: Administrasi Surat */}
          <div className="group rounded-[2rem] border border-white/80 bg-white/60 p-6 shadow-lg shadow-blue-900/5 backdrop-blur-xl transition hover:-translate-y-1 sm:p-8">
            <div className="mb-6 grid size-14 place-items-center rounded-2xl bg-emerald-100 text-emerald-600">
              <FileText className="size-7" />
            </div>
            <h2 className="text-xl font-black text-[#0a192f]">Administrasi Surat</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">Layanan pengajuan surat pengantar observasi, surat izin penelitian, dan dokumen kebutuhan akademik lainnya.</p>
            
            <div className="mt-6 flex flex-col gap-3">
              <a href="#" className="flex items-center justify-between rounded-xl border border-slate-100 bg-white/50 p-3 text-sm font-bold text-slate-600 transition hover:border-emerald-500 hover:text-emerald-600">
                Form Surat Pengantar Observasi <Link2 className="size-4" />
              </a>
              <a href="#" className="flex items-center justify-between rounded-xl border border-slate-100 bg-white/50 p-3 text-sm font-bold text-slate-600 transition hover:border-emerald-500 hover:text-emerald-600">
                Form Surat Izin Penelitian <Link2 className="size-4" />
              </a>
            </div>
          </div>

        </div>
      </div>
    </main>
  )
}