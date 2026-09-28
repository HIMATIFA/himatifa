import Link from 'next/link'
import { ArrowLeft, ArrowUpRight, Search } from 'lucide-react'

const newsData = [
  { 
    id: 1, 
    tag: 'Prestasi', 
    title: 'Tim Mahasiswa Informatika Unjuk Gigi di Ajang Gemastik XIX', 
    date: '15 Agu 2026', 
    desc: 'Pengembangan platform digital cerdas membawa perwakilan mahasiswa S1 Informatika bersaing di kompetisi TIK tingkat nasional.', 
    image: '/berita-1.jpg' 
  },
  { 
    id: 2, 
    tag: 'Kegiatan', 
    title: 'Sukses Gelar OSCAR 2026: Sinergi Menyambut Mahasiswa Baru', 
    date: '22 Sep 2026', 
    desc: 'Rangkaian acara penyambutan mahasiswa baru berlangsung meriah dengan semangat kolaborasi dan inovasi.', 
    image: '/berita-2.jpg' 
  },
  { 
    id: 3, 
    tag: 'Riset & Dev', 
    title: 'Eksplorasi Teknologi AR untuk Media Edukasi Interaktif', 
    date: '10 Sep 2026', 
    desc: 'Kolaborasi antar mahasiswa dalam merancang purwarupa aplikasi pendidikan yang mengintegrasikan animasi dan sistem pemindaian cerdas.', 
    image: '/berita-3.jpg' 
  },
  { 
    id: 4, 
    tag: 'Organisasi', 
    title: 'Rapat Kerja BPH 2026: Menyatukan Visi Satu Tahun ke Depan', 
    date: '02 Sep 2026', 
    desc: 'Pembahasan strategis program kerja tiap departemen untuk memastikan dampak positif bagi civitas akademika.', 
    image: '/berita-4.jpg' 
  }
]

export default function NewsPage() {
  return (
    <main className="min-h-screen bg-[#f4f8fc] px-4 py-8 text-[#0a192f] sm:px-6 lg:px-10 lg:py-12">
      <div className="fixed left-[-10%] top-[-5%] -z-10 h-125 w-125 rounded-full bg-blue-400/20 blur-[120px]" />
      
      <div className="mx-auto max-w-7xl">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 transition-colors hover:text-[#2563eb]">
          <ArrowLeft className="size-4" /> Beranda
        </Link>

        <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between mb-14">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[.2em] text-[#2563eb]">Jurnal Himatifa</p>
            <h1 className="text-4xl font-black tracking-tight sm:text-6xl">Kabar <span className="text-[#2563eb]">Terbaru.</span></h1>
          </div>
          
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Cari berita atau artikel..." 
              className="w-full rounded-full border border-white/80 bg-white/60 py-3 pl-12 pr-4 text-sm font-medium outline-none backdrop-blur-xl transition focus:border-[#2563eb] focus:bg-white focus:ring-4 focus:ring-blue-500/10"
            />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {newsData.map((article) => (
            <article key={article.id} className="group flex flex-col overflow-hidden rounded-[2rem] border border-white/80 bg-white/60 shadow-lg shadow-blue-900/5 backdrop-blur-xl transition hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-900/10">
              <div className="aspect-video w-full overflow-hidden bg-slate-200">
                {/* Ganti src dengan {article.image} saat gambar aslinya sudah siap */}
                <div className="size-full bg-[#0a192f]/5 transition duration-500 group-hover:scale-105" />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-[.18em] text-[#2563eb]">{article.tag}</span>
                  <span className="text-xs font-semibold text-slate-400">{article.date}</span>
                </div>
                <h3 className="text-xl font-extrabold leading-tight text-[#0a192f]">{article.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-500 line-clamp-3">{article.desc}</p>
                <div className="mt-auto pt-6">
                  <Link href={`/news/${article.id}`} className="inline-flex items-center text-sm font-bold text-[#2563eb] transition hover:gap-2">
                    Baca selengkapnya <ArrowUpRight className="ml-1 size-4" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  )
}