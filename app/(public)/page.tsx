'use client'

import { AnimatePresence, motion, useInView } from 'framer-motion'
import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Check,
  ChevronRight,
  Code2,
  Globe2,
  CircleUserRound,
  MessageCircle,
  Mail,
  MapPin,
  Menu,
  Users,
  X,
  Zap,
} from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

type DepartmentKey = 'PSDM' | 'Deplu' | 'Kepsos' | 'Ekraf' | 'Medkominfo'

interface DepartmentDetail {
  label: string
  desc: string
  programs: string[]
}

const departments: Record<DepartmentKey, DepartmentDetail> = {
  PSDM: { label: 'Pengembangan Sumber Daya Mahasiswa', desc: 'Membangun ekosistem belajar yang inklusif melalui pengembangan kapasitas, kompetensi, dan karakter mahasiswa Informatika.', programs: ['Study Club', 'Mentoring Akademik', 'Upgrading'] },
  Deplu: { label: 'Departemen Luar Negeri', desc: 'Membuka jejaring kolaborasi strategis antara HIMATIFA, organisasi mahasiswa, dan mitra profesional di luar kampus.', programs: ['Company Visit', 'Collaboration', 'Networking'] },
  Kepsos: { label: 'Kesejahteraan Sosial', desc: 'Menghadirkan dampak positif melalui aksi sosial dan kepedulian yang berkelanjutan bagi civitas dan masyarakat.', programs: ['HIMATIFA Care', 'Donasi Digital', 'Volunteer'] },
  Ekraf: { label: 'Ekonomi Kreatif', desc: 'Mengembangkan potensi wirausaha mahasiswa melalui produk kreatif, strategi bisnis, dan ruang apresiasi karya.', programs: ['Ekraf Store', 'Creative Class', 'Market Day'] },
  Medkominfo: { label: 'Media, Komunikasi, dan Informasi', desc: 'Menghidupkan cerita dan identitas HIMATIFA lewat komunikasi visual yang relevan, jujur, dan berdampak.', programs: ['Content Lab', 'HIMATIFA TV', 'Design Sprint'] },
}

const people = [
  { role: 'Ketua Himpunan', name: 'Vichras Mazcheranou Hafizh', image: '/bpi/vice.png' },
  { role: 'Wakil Ketua', name: 'Andy Bagus Oesmady', image: '/bpi/andi.png' },
  { role: 'Sekretaris', name: 'Aura Rizky Inayah Fadhilah', image: '/bpi/aura.png' },
  { role: 'Bendahara', name: 'Maulidya Dliyaun Najah', image: '/bpi/mau.png' },
]

const navLinks = [
  { name: 'Beranda', path: '/' },
  { name: 'Profil', path: '/about' },
  { name: 'Berita', path: '/news' },
  { name: 'Agenda', path: '/events' },
  { name: 'Kontak', path: '/contact' },
]

const reveal = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.65 } } }

function GlassCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-[2rem] border border-white/80 bg-white/60 shadow-lg shadow-blue-900/5 backdrop-blur-xl ${className}`}>{children}</div>
}

export default function Page() {
  const [activeDepartment, setActiveDepartment] = useState<DepartmentKey>('PSDM')
  const [mobileOpen, setMobileOpen] = useState(false)
  const current = departments[activeDepartment]

  const videoRef = useRef<HTMLVideoElement>(null)
  const isVideoInView = useInView(videoRef, { margin: "-100px" })

  useEffect(() => {
    if (videoRef.current) {
      if (isVideoInView) {
        videoRef.current.play().catch((err: unknown) => console.log("Autoplay ditunda oleh browser:", err))
      } else {
        videoRef.current.pause()
      }
    }
  }, [isVideoInView])

  return (
    <main className="min-h-screen overflow-hidden bg-[#f4f8fc] text-[#0a192f]">
      <div className="absolute left-0 top-0 -z-10 h-full w-full overflow-hidden">
        <div className="absolute left-[-10%] top-[-5%] h-125 w-125 rounded-full bg-blue-400/20 blur-[120px]" />
        <div className="absolute right-[-5%] top-[20%] h-150 w-150 rounded-full bg-cyan-300/20 blur-[150px]" />
      </div>

      <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6 lg:px-10">
        <nav className="mx-auto flex max-w-7xl items-center justify-between rounded-full border border-white/70 bg-white/60 px-4 py-3 shadow-lg shadow-blue-900/5 backdrop-blur-xl sm:px-6">
          <Link href="/" className="flex items-center gap-2 font-black tracking-tight text-[#0a192f] transition-transform hover:scale-105">
            <Image 
              src="/himatifabg.png" 
              alt="Logo HIMATIFA UMSurabaya" 
              width={64} 
              height={64} 
              className="object-contain" 
            />
            HIMATIFA
          </Link>
          
          <div className="hidden items-center gap-7 text-[13px] font-semibold text-slate-600 lg:flex">
            {navLinks.map((item) => (
              <Link key={item.name} href={item.path} className="transition-colors hover:text-[#2563eb]">{item.name}</Link>
            ))}
            {/* Scroll Link Khusus Departemen */}
            <a href="#departemen" className="transition-colors hover:text-[#2563eb]">Departemen</a>
          </div>
          
          <Link href="/ekrafstore" className="hidden items-center rounded-full bg-[#2563eb] px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-600/20 transition-transform hover:-translate-y-0.5 lg:flex">
            Ekraf Store <ArrowUpRight className="ml-1 inline size-3.5" />
          </Link>

          <button aria-label={mobileOpen ? 'Tutup menu' : 'Buka menu'} onClick={() => setMobileOpen(!mobileOpen)} className="rounded-full p-2 lg:hidden">
            {mobileOpen ? <X /> : <Menu />}
          </button>
        </nav>

        {mobileOpen && (
          <div className="mx-2 mt-2 flex flex-col gap-3 rounded-3xl border border-white/70 bg-white/90 p-5 shadow-xl backdrop-blur-xl lg:hidden">
            {navLinks.map((item) => (
              <Link onClick={() => setMobileOpen(false)} key={item.name} href={item.path} className="font-semibold text-slate-700 hover:text-[#2563eb]">{item.name}</Link>
            ))}
            <a onClick={() => setMobileOpen(false)} href="#departemen" className="font-semibold text-slate-700 hover:text-[#2563eb]">Departemen</a>
            
            <hr className="my-1 border-slate-200" />
            <Link 
              onClick={() => setMobileOpen(false)} 
              href="/ekrafstore" 
              className="flex items-center justify-center gap-2 rounded-xl bg-[#2563eb] py-3 text-sm font-bold text-white shadow-md shadow-blue-600/20 active:scale-95 transition-transform"
            >
              Ekraf Store <ArrowUpRight className="size-4" />
            </Link>
          </div>
        )}
      </header>

      <section id="beranda" className="relative mx-auto grid min-h-190 max-w-7xl items-center gap-14 px-6 pb-20 pt-36 lg:grid-cols-[1.05fr_.95fr] lg:px-10">
        <motion.div initial="hidden" animate="show" variants={reveal}>
          <h1 className="max-w-3xl text-5xl font-black leading-[1.02] tracking-[-0.055em] sm:text-7xl">Inovasi Tanpa Batas,<br /><span className="text-[#2563eb]">Sinergi S1 Informatika.</span></h1>
          <p className="mt-7 max-w-xl text-base leading-7 text-slate-500 sm:text-lg">Wadah kolaborasi mahasiswa Informatika Universitas Muhammadiyah Surabaya untuk mengasah kompetensi teknis dan berdaya saing global.</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/about" className="rounded-full bg-[#2563eb] px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-blue-600/20 transition-all hover:-translate-y-1 hover:bg-blue-700">Kenali HIMATIFA <ArrowRight className="ml-2 inline size-4" /></Link>
            <Link href="/events" className="rounded-full border border-slate-200 bg-white/50 px-6 py-3.5 text-sm font-bold text-slate-700 backdrop-blur transition-all hover:-translate-y-1 hover:border-blue-200 hover:text-[#2563eb]">Jelajahi Agenda</Link>
          </div>
          <div className="mt-12 flex items-center gap-4 text-sm text-slate-500">
            <div className="flex -space-x-2">
              {people.slice(0, 3).map((p) => <img key={p.name} src={p.image} alt="Pengurus HIMATIFA" className="size-8 rounded-full border-2 border-white object-cover" />)}
            </div>
            <span><strong className="text-[#0a192f]">500+</strong> mahasiswa bertumbuh bersama</span>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: .92, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: .8, delay: .15 }} className="relative mx-auto w-full max-w-125">
          <div className="absolute -left-10 top-16 size-24 rounded-full bg-cyan-300/30 blur-2xl" /><div className="absolute -right-4 bottom-0 size-32 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="relative rotate-2 rounded-[2rem] border border-white/80 bg-white/50 p-3 shadow-2xl shadow-blue-900/10 backdrop-blur-xl">
            <div className="overflow-hidden rounded-2xl bg-[#0d2442] p-5 text-white">
              <div className="mb-10 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold">
                  <Image 
                    src="/himatifa1.png" 
                    alt="Logo HIMATIFA" 
                    width={32} 
                    height={32} 
                    className="object-contain brightness-0 invert" 
                  />
                  HIMATIFA
                  <span className="ml-2 rounded-full bg-white/10 px-2 py-1 text-[9px] font-normal text-blue-200">DASHBOARD</span>
                </div>
                <div className="flex gap-1"><span className="size-2 rounded-full bg-red-400" /><span className="size-2 rounded-full bg-yellow-400" /><span className="size-2 rounded-full bg-green-400" /></div>
              </div>
              <div className="mb-4 text-3xl font-black tracking-tight">Build something<br /><span className="text-blue-300">meaningful.</span></div>
              <p className="max-w-xs text-xs leading-5 text-blue-100/60">Temukan ruang untuk belajar, berkarya, dan memberi dampak bersama.</p>
              <div className="mt-10 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-white/10 p-4"><Users className="mb-5 size-4 text-blue-300" /><p className="text-2xl font-bold">15+</p><p className="text-[10px] text-blue-100/60">Program kerja</p></div>
                <div className="rounded-2xl bg-blue-500 p-4"><Zap className="mb-5 size-4" /><p className="text-2xl font-bold">2026</p><p className="text-[10px] text-blue-100/70">Kabinet sinergi</p></div>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-7 -left-9 rounded-2xl border border-white/80 bg-white/80 p-4 shadow-xl backdrop-blur-xl">
            <div className="mb-2 flex items-center gap-2 text-[10px] font-bold text-slate-500"><span className="size-2 rounded-full bg-green-500" /> ACTIVE COMMUNITY</div>
            <p className="text-sm font-bold">Your ideas matter.</p>
          </div>
        </motion.div>
      </section>

      <section id="profil" className="relative mx-auto max-w-7xl px-6 py-24 lg:px-10">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={reveal} className="mb-12 text-center">
          <p className="mb-3 text-xs font-bold uppercase tracking-[.2em] text-[#2563eb]">Tentang kami</p>
          <h2 className="text-4xl font-black tracking-tight sm:text-5xl">Lebih dari Sekadar<br /><span>Himpunan.</span></h2>
        </motion.div>
        <div className="grid auto-rows-[230px] gap-4 md:grid-cols-3">
          <GlassCard className="relative overflow-hidden md:col-span-2 md:row-span-2">
            <div className="absolute inset-0 bg-[url('/profil-bg.jpg')] bg-cover bg-center opacity-25 mix-blend-multiply" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a192f] via-[#0a192f]/60 to-transparent" />
            <div className="relative flex h-full flex-col justify-end p-7 text-white sm:p-10">
              <span className="mb-3 text-xs font-bold uppercase tracking-[.2em] text-blue-200">01 / Visi kami</span>
              <h3 className="max-w-lg text-3xl font-black tracking-tight sm:text-4xl">Menjadi ruang tumbuh bagi talenta digital masa depan.</h3>
              <p className="mt-3 max-w-xl text-sm leading-6 text-white/70">Mendorong mahasiswa Informatika untuk berani bereksplorasi, saling terhubung, dan menciptakan solusi yang bermakna.</p>
              <Link href="/about" className="mt-6 w-fit rounded-full bg-[#2563eb] px-6 py-2 text-sm font-bold text-white transition hover:bg-blue-700">Baca Visi & Misi</Link>
            </div>
          </GlassCard>
          <GlassCard className="p-7">
            <span className="text-xs font-bold uppercase tracking-[.2em] text-[#2563eb]">02 / Misi</span>
            <h3 className="mt-5 text-xl font-extrabold">Tumbuh bersama.</h3>
            <ul className="mt-5 flex flex-col gap-3 text-sm text-slate-500">
              {['Kolaborasi lintas minat', 'Kompetensi yang relevan', 'Dampak yang berkelanjutan'].map((item) => (
                <li key={item} className="flex items-center gap-2"><span className="grid size-5 place-items-center rounded-full bg-blue-100 text-[#2563eb]"><Check className="size-3" /></span>{item}</li>
              ))}
            </ul>
          </GlassCard>
          <GlassCard className="grid grid-cols-3 items-center gap-2 p-6 md:flex md:flex-col md:items-start md:justify-between">
            <span className="text-xs font-bold uppercase tracking-[.2em] text-[#2563eb]">03 / Dalam angka</span>
            <div className="md:mt-auto"><div className="text-2xl font-black">2020</div><p className="text-xs text-slate-500">Tahun berdiri</p></div>
            <div><div className="text-2xl font-black">5</div><p className="text-xs text-slate-500">Departemen</p></div>
            <div><div className="text-2xl font-black">15<span className="text-[#2563eb]">+</span></div><p className="text-xs text-slate-500">Proker aktif</p></div>
          </GlassCard>
        </div>
      </section>

      <section id="video-profil" className="relative mx-auto max-w-7xl px-6 pb-24 lg:px-10">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={reveal}>
          <div className="mb-12 text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-[.2em] text-[#2563eb]">Mengenal Lebih Dekat</p>
            <h2 className="text-4xl font-black tracking-tight sm:text-5xl">Video Profil <br /><span>HIMATIFA.</span></h2>
          </div>
          <div className="relative mx-auto w-full max-w-5xl overflow-hidden rounded-[2.5rem] border border-white/80 bg-white/40 p-3 shadow-2xl shadow-blue-900/10 backdrop-blur-xl">
            <div className="group relative aspect-video w-full overflow-hidden rounded-[1.8rem] bg-slate-900">
              <video 
                ref={videoRef}
                src="/oscar.mp4"
                loop
                playsInline
                className="size-full object-cover opacity-70 transition duration-700 group-hover:scale-105 group-hover:opacity-40" 
              />
              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div>
                  <h3 className="text-2xl font-bold">After Movie OSCAR 2026</h3>
                  <p className="mt-1 text-sm text-blue-100/80">Dokumenter Perjalanan S1 Informatika UMSurabaya</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <section id="bph" className="bg-white/40 px-6 py-24 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-[.2em] text-[#2563eb]">Badan Pengurus Harian</p>
              <h2 className="text-4xl font-black tracking-tight sm:text-5xl">Pemimpin HIMATIFA<br /><span>2026.</span></h2>
            </div>
            <p className="max-w-xs text-sm leading-6 text-slate-500">Satu visi, empat peran, dan energi yang sama untuk membuat perubahan.</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {people.map((person) => (
              <motion.div key={person.name} whileHover={{ y: -8 }} className="group rounded-[2rem] border border-white/80 bg-white/60 p-3 text-center shadow-lg shadow-blue-900/5 backdrop-blur-xl">
                <div className="relative -mt-1 overflow-hidden rounded-[1.5rem] bg-blue-100">
                  <img src={person.image} alt={person.name} className="aspect-[.9] w-full object-cover grayscale transition duration-500 group-hover:scale-105 group-hover:grayscale-0" />
                  <div className="absolute inset-x-3 bottom-3 flex translate-y-12 justify-center gap-2 transition-transform duration-300 group-hover:translate-y-0">
                    <a aria-label={`${person.name} di LinkedIn`} href="#footer" className="grid size-8 place-items-center rounded-full bg-white/90 text-[#2563eb] hover:bg-[#2563eb] hover:text-white"><CircleUserRound className="size-3.5" /></a>
                  </div>
                </div>
                <p className="mt-5 text-[10px] font-bold uppercase tracking-[.2em] text-[#2563eb]">{person.role}</p>
                <h3 className="pb-3 pt-1 text-lg font-extrabold">{person.name}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="departemen" className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
        <div className="mb-14">
          <p className="mb-3 text-xs font-bold uppercase tracking-[.2em] text-[#2563eb]">Struktur gerak</p>
          <h2 className="text-4xl font-black tracking-tight sm:text-5xl">Pilar <span>Penggerak.</span></h2>
        </div>
        <div className="grid gap-5 lg:grid-cols-[.35fr_.65fr]">
          <div className="flex flex-col gap-2">
            {(Object.keys(departments) as DepartmentKey[]).map((name) => (
              <button key={name} onClick={() => setActiveDepartment(name)} className={`group flex items-center justify-between rounded-2xl border-l-2 px-5 py-4 text-left text-sm font-bold transition-all ${activeDepartment === name ? 'border-[#2563eb] bg-white/70 text-[#2563eb] shadow-md' : 'border-transparent text-slate-500 hover:bg-white/50 hover:text-[#0a192f]'}`}>
                <span>{name}</span>
                <ChevronRight className={`size-4 transition-transform ${activeDepartment === name ? 'translate-x-1' : 'opacity-0 group-hover:opacity-100'}`} />
              </button>
            ))}
          </div>
          <GlassCard className="min-h-[340px] p-7 sm:p-10">
            <AnimatePresence mode="wait">
              <motion.div key={activeDepartment} initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }} transition={{ duration: .25 }}>
                <div className="mb-12 flex items-start justify-between">
                  <div>
                    <div className="mb-4 grid size-12 place-items-center rounded-2xl bg-blue-100 text-[#2563eb]"><Code2 /></div>
                    <p className="text-xs font-bold uppercase tracking-[.18em] text-[#2563eb]">Departemen {activeDepartment}</p>
                    <h3 className="mt-2 max-w-md text-2xl font-black tracking-tight sm:text-3xl">{current.label}</h3>
                  </div>
                  <span className="hidden text-6xl font-black text-blue-100 sm:block">0{Object.keys(departments).indexOf(activeDepartment) + 1}</span>
                </div>
                <p className="max-w-2xl text-sm leading-7 text-slate-500">{current.desc}</p>
                <div className="mt-8 grid gap-3 sm:grid-cols-3">
                  {current.programs.map((program: string) => (
                    <div key={program} className="rounded-2xl border border-slate-100 bg-white/60 p-4 text-sm font-bold shadow-sm"><span className="mb-4 block size-2 rounded-full bg-[#2563eb]" />{program}</div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </GlassCard>
        </div>
      </section>

      <section id="agenda" className="bg-[#0a192f] px-6 py-24 text-white lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 flex items-end justify-between">
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-[.2em] text-blue-300">Kalender kegiatan</p>
              <h2 className="text-4xl font-black tracking-tight text-white sm:text-5xl">Agenda <span className="text-blue-300">Terdekat.</span></h2>
            </div>
            <Link href="/events" className="hidden text-sm font-bold text-blue-300 hover:text-white sm:block">Lihat semua <ArrowRight className="ml-1 inline size-4" /></Link>
          </div>
          <div className="flex flex-col">
            {[{ date: '21', month: 'SEP', title: 'OSCAR 2026', desc: 'Opening Student Collaboration & Achievement Recognition', place: 'Auditorium UMSurabaya' }, { date: '04', month: 'OKT', title: 'Study Club GitHub', desc: 'Level up your workflow, one commit at a time.', place: 'Lab Informatika 2' }, { date: '18', month: 'OKT', title: 'HIMATIFA Care', desc: 'Berbagi langkah kecil, memberi dampak yang besar.', place: 'Kampung Nelayan Kenjeran' }].map((event) => (
              <div key={event.title} className="group grid gap-6 border-t border-white/10 py-7 md:grid-cols-[100px_1fr_auto] md:items-center">
                <div className="grid size-[72px] place-items-center rounded-2xl bg-blue-500 transition-colors group-hover:bg-[#2563eb] text-center">
                  <div>
                    <div className="text-2xl font-black leading-none">{event.date}</div>
                    <div className="mt-1 text-[10px] font-bold tracking-widest text-blue-100">{event.month}</div>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-extrabold">{event.title}</h3>
                  <p className="mt-1 text-sm text-blue-100/60">{event.desc}</p>
                  <p className="mt-3 flex items-center gap-1 text-xs text-blue-200/80"><MapPin className="size-3.5" /> {event.place}</p>
                </div>
                <button className="w-fit rounded-full border border-white/20 px-4 py-2 text-xs font-bold text-blue-100 transition hover:border-blue-300 hover:bg-white/5 hover:text-white">Add to Calendar <CalendarDays className="ml-1 inline size-3.5" /></button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="berita" className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
        <div className="mb-14 flex items-end justify-between">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[.2em] text-[#2563eb]">Cerita terbaru</p>
            <h2 className="text-4xl font-black tracking-tight sm:text-5xl">Kabar <span>Terbaru.</span></h2>
          </div>
          <Link href="/news" className="hidden text-sm font-bold text-[#2563eb] sm:block">Semua kabar <ArrowRight className="ml-1 inline size-4" /></Link>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {[{ tag: 'Organisasi', title: 'Merawat ruang tumbuh lewat kolaborasi', text: 'HIMATIFA membuka semester baru dengan semangat dan cara pandang yang lebih segar.', image: '/berita-1.jpg' }, { tag: 'Prestasi', title: 'Dari kampus untuk panggung global', text: 'Cerita mahasiswa Informatika yang berani membawa karya ke level berikutnya.', image: '/berita-2.jpg' }, { tag: 'Kegiatan', title: 'Belajar tidak harus sendirian', text: 'Mengenal lebih dekat komunitas belajar yang membuat proses jadi menyenangkan.', image: '/berita-3.jpg' }].map((article) => (
            <article key={article.title} className="group overflow-hidden rounded-[1.7rem] border border-white/80 bg-white/60 shadow-lg shadow-blue-900/5 backdrop-blur-xl">
              <div className="aspect-video overflow-hidden">
                <img src={article.image} alt={article.title} className="size-full object-cover transition duration-500 group-hover:scale-105" />
              </div>
              <div className="p-6">
                <span className="text-[10px] font-bold uppercase tracking-[.18em] text-[#2563eb]">{article.tag}</span>
                <h3 className="mt-3 text-xl font-extrabold leading-tight">{article.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-500">{article.text}</p>
                <Link href="/news" className="mt-5 inline-block text-sm font-bold text-[#2563eb] transition-all hover:gap-2">Baca selengkapnya <ArrowUpRight className="ml-1 inline size-4" /></Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <footer id="footer" className="bg-[#071426] px-6 py-16 text-white lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-[1.4fr_.7fr_1fr]">
          <div>
            <Link href="/" className="flex items-center gap-2 font-black tracking-tight">
              <Image 
                src="/himatifa1.png" 
                alt="Logo HIMATIFA UMSurabaya" 
                width={64} 
                height={64} 
                className="object-contain brightness-0 invert" 
              />
              HIMATIFA
            </Link>
            <p className="mt-5 max-w-xs text-sm leading-6 text-blue-100/60">Himpunan Mahasiswa Teknik Informatika Universitas Muhammadiyah Surabaya.</p>
            <div className="mt-6 flex gap-2">
              <Link aria-label="Instagram HIMATIFA" href="/contact" className="grid size-9 place-items-center rounded-full bg-white/10 transition hover:bg-[#2563eb]"><Globe2 className="size-4" /></Link>
              <Link aria-label="Facebook HIMATIFA" href="/contact" className="grid size-9 place-items-center rounded-full bg-white/10 transition hover:bg-[#2563eb]"><MessageCircle className="size-4" /></Link>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-bold">Jelajahi</h3>
            <div className="mt-5 flex flex-col gap-3 text-sm text-blue-100/60">
              <Link href="/about" className="hover:text-white">Tentang kami</Link>
              <a href="#bph" className="hover:text-white">BPH 2026</a>
              <a href="#departemen" className="hover:text-white">Departemen</a>
              <Link href="/news" className="hover:text-white">Berita</Link>
              <Link href="/events" className="hover:text-white">Agenda</Link>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-bold">Mari terhubung</h3>
            <a href="mailto:himatifa@ft.um-surabaya.ac.id" className="mt-5 flex items-center gap-2 text-sm text-blue-100/60 hover:text-white"><Mail className="size-4 text-blue-300" /> himatifa@ft.um-surabaya.ac.id</a>
            <p className="mt-4 flex items-start gap-2 text-sm leading-6 text-blue-100/60"><MapPin className="mt-1 size-4 shrink-0 text-blue-300" />Jl. Sutorejo No. 59, Surabaya</p>
            <Link href="/contact" className="mt-4 inline-block text-xs font-bold text-blue-300 hover:text-white">
              Buka Halaman Kontak →
            </Link>
          </div>
        </div>
        <div className="mx-auto mt-14 max-w-7xl border-t border-white/10 pt-6 text-xs text-blue-100/40">© 2026 HIMATIFA Universitas Muhammadiyah Surabaya</div>
      </footer>
    </main>
  )
}