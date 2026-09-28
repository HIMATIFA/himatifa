import Link from 'next/link'
import { ArrowLeft, Target, Lightbulb, Users, ShieldCheck, Rocket } from 'lucide-react'
import Image from 'next/image'

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#f4f8fc] px-4 py-8 text-[#0a192f] sm:px-6 lg:px-10 lg:py-12">
      <div className="fixed left-[-10%] top-[-5%] -z-10 h-125 w-125 rounded-full bg-blue-400/20 blur-[120px]" />
      <div className="fixed right-[-5%] top-[20%] -z-10 h-150 w-150 rounded-full bg-cyan-300/20 blur-[150px]" />

      <div className="mx-auto max-w-6xl">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 transition-colors hover:text-[#2563eb]">
          <ArrowLeft className="size-4" /> Beranda
        </Link>

        {/* Hero Section */}
        <div className="mt-8 mb-16 text-center">
          <p className="mb-3 text-xs font-bold uppercase tracking-[.2em] text-[#2563eb]">Profil Organisasi</p>
          <h1 className="text-4xl font-black tracking-tight sm:text-6xl">Lebih dari Sekadar <br /><span className="text-[#2563eb]">Himpunan.</span></h1>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
            Himpunan Mahasiswa Teknik Informatika (HIMATIFA) Universitas Muhammadiyah Surabaya adalah wadah pergerakan, eksplorasi, dan kolaborasi bagi seluruh talenta digital di lingkungan kampus.
          </p>
        </div>

        {/* Visi & Misi */}
        <div className="grid gap-8 md:grid-cols-[1fr_1.5fr]">
          <div className="rounded-[2.5rem] bg-[#071426] p-8 text-white shadow-xl lg:p-10">
            <div className="mb-6 grid size-14 place-items-center rounded-2xl bg-white/10 text-blue-300">
              <Target className="size-7" />
            </div>
            <h2 className="text-2xl font-black tracking-tight">Visi Kami</h2>
            <p className="mt-4 text-sm leading-relaxed text-blue-100/70">
              Menjadi ruang tumbuh yang adaptif dan inovatif bagi talenta digital masa depan, serta mewujudkan ekosistem mahasiswa Informatika yang berani bereksplorasi, saling terhubung, dan menciptakan solusi bermakna.
            </p>
          </div>

          <div className="flex flex-col justify-center rounded-[2.5rem] border border-white/80 bg-white/60 p-8 shadow-lg shadow-blue-900/5 backdrop-blur-xl lg:p-10">
            <div className="mb-6 flex items-center gap-4">
              <div className="grid size-12 place-items-center rounded-2xl bg-blue-100 text-[#2563eb]">
                <Rocket className="size-6" />
              </div>
              <h2 className="text-2xl font-black tracking-tight text-[#0a192f]">Misi Utama</h2>
            </div>
            <ul className="flex flex-col gap-5">
              {[
                'Membangun budaya kolaborasi lintas minat dalam bidang teknologi informasi.',
                'Meningkatkan kompetensi teknis dan non-teknis mahasiswa agar relevan dengan kebutuhan industri.',
                'Menghadirkan dampak sosial yang berkelanjutan melalui inovasi digital dan pengabdian masyarakat.',
                'Menyediakan fasilitas dan advokasi untuk kesejahteraan civitas akademika Informatika.'
              ].map((misi, idx) => (
                <li key={idx} className="flex gap-4">
                  <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-[#2563eb] text-[10px] font-bold text-white shadow-md">{idx + 1}</span>
                  <span className="text-sm leading-relaxed text-slate-600">{misi}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Core Values */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-black tracking-tight sm:text-3xl">Nilai-Nilai <span className="text-[#2563eb]">Penggerak.</span></h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {[
              { title: 'Inovasi', icon: Lightbulb, desc: 'Selalu mencari cara baru untuk memecahkan masalah dengan teknologi.' },
              { title: 'Kolaborasi', icon: Users, desc: 'Sinergi antar mahasiswa, dosen, dan mitra profesional.' },
              { title: 'Integritas', icon: ShieldCheck, desc: 'Menjunjung tinggi etika, kejujuran, dan tanggung jawab akademik.' },
            ].map((val) => (
              <div key={val.title} className="rounded-[2rem] border border-white/80 bg-white/60 p-8 text-center shadow-lg shadow-blue-900/5 backdrop-blur-xl transition hover:-translate-y-1">
                <div className="mx-auto mb-5 grid size-16 place-items-center rounded-2xl bg-blue-50 text-[#2563eb]">
                  <val.icon className="size-8" />
                </div>
                <h3 className="text-lg font-extrabold text-[#0a192f]">{val.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}