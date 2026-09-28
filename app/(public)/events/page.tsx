import Link from 'next/link'
import { ArrowLeft, CalendarDays, MapPin, Users } from 'lucide-react'

const eventsData = [
  { 
    id: 1, 
    date: '04', 
    month: 'OKT', 
    title: 'Study Club: GitHub & Web Dev', 
    time: '13:00 - 15:00 WIB', 
    location: 'Lab Komputer Terpadu 2', 
    type: 'Akademik',
    desc: 'Sesi belajar bersama membahas version control system dan framework modern untuk pengembangan web.' 
  },
  { 
    id: 2, 
    date: '18', 
    month: 'OKT', 
    title: 'HIMATIFA Care: Bakti Sosial', 
    time: '08:00 - Selesai', 
    location: 'Panti Asuhan Muhammadiyah, Surabaya', 
    type: 'Sosial',
    desc: 'Kegiatan pengabdian masyarakat oleh Departemen Kesejahteraan Sosial sebagai bentuk kepedulian civitas Informatika.' 
  },
  { 
    id: 3, 
    date: '10', 
    month: 'NOV', 
    title: 'Tech Clinic x Market Day', 
    time: '09:00 - 16:00 WIB', 
    location: 'Plaza Fakultas Teknik UMSurabaya', 
    type: 'Ekraf & PSDM',
    desc: 'Layanan servis laptop gratis untuk mahasiswa teknik sekaligus bazar produk kreatif mahasiswa Informatika.' 
  }
]

export default function EventsPage() {
  return (
    <main className="min-h-screen bg-[#f4f8fc] px-4 py-8 text-[#0a192f] sm:px-6 lg:px-10 lg:py-12">
      <div className="fixed right-[-5%] top-[20%] -z-10 h-150 w-150 rounded-full bg-cyan-300/20 blur-[150px]" />
      
      <div className="mx-auto max-w-4xl">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 transition-colors hover:text-[#2563eb]">
          <ArrowLeft className="size-4" /> Beranda
        </Link>

        <div className="mt-8 mb-14 text-center">
          <p className="mb-3 text-xs font-bold uppercase tracking-[.2em] text-[#2563eb]">Kalender Kegiatan</p>
          <h1 className="text-4xl font-black tracking-tight sm:text-6xl">Agenda <span className="text-[#2563eb]">Himatifa.</span></h1>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
            Jangan sampai kelewatan momen penting. Simpan jadwalnya dan ikut ambil bagian dalam setiap keseruan acara S1 Informatika.
          </p>
        </div>

        <div className="flex flex-col gap-6">
          {eventsData.map((event) => (
            <div key={event.id} className="group relative flex flex-col gap-6 overflow-hidden rounded-[2rem] border border-white/80 bg-white/60 p-6 shadow-lg shadow-blue-900/5 backdrop-blur-xl transition hover:-translate-y-1 sm:flex-row sm:items-center sm:p-8">
              
              {/* Date Badge */}
              <div className="grid size-24 shrink-0 place-items-center rounded-[1.5rem] bg-[#0a192f] text-white transition-colors group-hover:bg-[#2563eb]">
                <div className="text-center">
                  <div className="text-3xl font-black leading-none">{event.date}</div>
                  <div className="mt-1 text-xs font-bold tracking-widest text-blue-200">{event.month}</div>
                </div>
              </div>

              {/* Event Info */}
              <div className="flex-1">
                <span className="mb-2 inline-block rounded-full bg-blue-100/50 px-3 py-1 text-[10px] font-bold text-[#2563eb]">{event.type}</span>
                <h3 className="text-2xl font-extrabold text-[#0a192f]">{event.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{event.desc}</p>
                
                <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-500">
                  <div className="flex items-center gap-1.5"><CalendarDays className="size-4 text-blue-400" /> {event.time}</div>
                  <div className="flex items-center gap-1.5"><MapPin className="size-4 text-blue-400" /> {event.location}</div>
                </div>
              </div>

              {/* CTA Action */}
              <div className="shrink-0 sm:pl-4 border-t border-slate-100 sm:border-l sm:border-t-0 pt-4 sm:pt-0">
                <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#2563eb] shadow-sm ring-1 ring-slate-200 transition hover:bg-[#2563eb] hover:text-white hover:ring-[#2563eb]">
                  <Users className="size-4" /> Daftar Acara
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}