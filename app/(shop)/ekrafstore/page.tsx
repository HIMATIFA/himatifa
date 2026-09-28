'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Cpu,
  MessageCircle,
  MonitorSmartphone,
  Server,
  ShoppingCart,
  Wrench,
  X,
  Zap,
  Search,
  Bot,
  Film,
  Palette,
  Scissors,
  Sparkles,
  Tv,
  Image as ImageIcon,
  BookOpen,
  ShieldCheck,
  Clock
} from 'lucide-react'
import Link from 'next/link'

// --- Tipe Data ---
interface ProductVariant {
  name: string
  price: number
  priceLabel: string
}

interface DigitalProduct {
  category: string
  tag: 'AI Tools' | 'Streaming' | 'Creative'
  icon: React.ReactNode
  variants: ProductVariant[]
}

interface TechService {
  id: string
  title: string
  icon: React.ReactNode
  desc: string
  stack: string[]
}

// --- Data Layanan Digital ---
const digitalProducts: DigitalProduct[] = [
  {
    category: 'ChatGPT',
    tag: 'AI Tools',
    icon: <Bot className="size-6 text-emerald-400" />,
    variants: [
      { name: 'Private - Full (1 Bln Plan Go)', price: 52500, priceLabel: 'Rp 52.500' },
      { name: 'Private - Full (3 Bln Plan Go)', price: 60000, priceLabel: 'Rp 60.000' },
      { name: 'Private - 24 Jam (1 Bln Plan Plus)', price: 35500, priceLabel: 'Rp 35.500' },
      { name: 'Private - 24 Jam (3 Bln Plan Go)', price: 50000, priceLabel: 'Rp 50.000' },
    ]
  },
  {
    category: 'Gemini Plus',
    tag: 'AI Tools',
    icon: <Sparkles className="size-6 text-blue-400" />,
    variants: [
      { name: 'Gemini Plus Bergaransi (1 Bulan)', price: 15000, priceLabel: 'Rp 15.000' },
      { name: 'Gemini Plus Bergaransi (6 Bulan)', price: 15000, priceLabel: 'Rp 15.000' },
    ]
  },
  {
    category: 'Netflix Premium',
    tag: 'Streaming',
    icon: <Film className="size-6 text-red-500" />,
    variants: [
      { name: '1 Profile 1 User (1 Hari)', price: 8000, priceLabel: 'Rp 8.000' },
      { name: '1 Profile 1 User (7 Hari)', price: 15500, priceLabel: 'Rp 15.500' },
      { name: '1 Profile 1 User (1 Bulan)', price: 30000, priceLabel: 'Rp 30.000' },
      { name: 'Semi Private (1 Bulan)', price: 35000, priceLabel: 'Rp 35.000' },
      { name: '1 Profile 2 User (1 Bulan)', price: 20000, priceLabel: 'Rp 20.000' },
    ]
  },
  {
    category: 'Vidio Platinum',
    tag: 'Streaming',
    icon: <Tv className="size-6 text-red-400" />,
    variants: [
      { name: 'Private (1 Bulan Mobile)', price: 30500, priceLabel: 'Rp 30.500' },
      { name: 'Private (1 Bulan All Dev)', price: 40500, priceLabel: 'Rp 40.500' },
      { name: 'Private TV Only (1 Tahun)', price: 15000, priceLabel: 'Rp 15.000' },
    ]
  },
  {
    category: 'Canva Pro',
    tag: 'Creative',
    icon: <Palette className="size-6 text-cyan-400" />,
    variants: [
      { name: 'Private & Invite (1 Bulan)', price: 10000, priceLabel: 'Rp 10.000' },
      { name: 'Private & Invite (6 Bulan)', price: 15000, priceLabel: 'Rp 15.000' },
      { name: 'Private & Invite (9 Bulan)', price: 25000, priceLabel: 'Rp 25.000' },
      { name: 'Private & Invite (1 Tahun)', price: 30000, priceLabel: 'Rp 30.000' },
    ]
  },
  {
    category: 'CapCut Pro',
    tag: 'Creative',
    icon: <Scissors className="size-6 text-slate-200" />,
    variants: [
      { name: 'Private (7 Hari)', price: 15500, priceLabel: 'Rp 15.500' },
      { name: 'Private (1 Bulan)', price: 35500, priceLabel: 'Rp 35.500' },
    ]
  },
  {
    category: 'Lightroom',
    tag: 'Creative',
    icon: <ImageIcon className="size-6 text-sky-400" />,
    variants: [
      { name: 'Sharing (1 Bulan)', price: 10000, priceLabel: 'Rp 10.000' },
      { name: 'Sharing (1 Tahun)', price: 15500, priceLabel: 'Rp 15.500' },
    ]
  },
  {
    category: 'Wattpad Premium+',
    tag: 'Streaming',
    icon: <BookOpen className="size-6 text-orange-400" />,
    variants: [
      { name: 'Private (1 Bulan)', price: 15500, priceLabel: 'Rp 15.500' },
      { name: 'Sharing (1 Bulan)', price: 10500, priceLabel: 'Rp 10.500' },
      { name: 'Sharing (1 Tahun)', price: 15500, priceLabel: 'Rp 15.500' },
    ]
  }
]

// --- Data Layanan Hardware & Software ---
const techServices: TechService[] = [
  {
    id: 'web-dev',
    title: 'Web & App Development',
    icon: <MonitorSmartphone className="size-6 text-blue-500" />,
    desc: 'Pengembangan platform modern yang cepat, responsif, dan scalable untuk kebutuhan bisnis, akademik, maupun startup.',
    stack: ['Next.js', 'React', 'Tailwind CSS', 'Supabase', 'TypeScript']
  },
  {
    id: 'iot-dev',
    title: 'IoT & Embedded Systems',
    icon: <Cpu className="size-6 text-blue-500" />,
    desc: 'Rancang bangun purwarupa hardware pintar, integrasi sensor cerdas, dan sistem telemetri berbasis dashboard real-time.',
    stack: ['ESP32', 'Arduino', 'C++', 'BLE', 'Sensor Integration']
  },
  {
    id: 'ai-ml',
    title: 'AI & Machine Learning',
    icon: <Server className="size-6 text-blue-500" />,
    desc: 'Implementasi model prediktif, analisis data tingkat lanjut, dan integrasi generative AI untuk otomasi sistem cerdas.',
    stack: ['Python', 'Gemini API', 'PyTorch', 'Vector Database']
  },
  {
    id: 'repair',
    title: 'Servis Laptop & HP',
    icon: <Wrench className="size-6 text-blue-500" />,
    desc: 'Perawatan perangkat keras, instalasi OS, pembersihan komponen, ganti pasta termal, hingga optimalisasi performa perangkat.',
    stack: ['Hardware Cleaning', 'OS Install', 'Thermal Paste', 'Troubleshooting']
  }
]

export default function EkrafStorePage() {
  const [selectedItem, setSelectedItem] = useState<{ category: string; variant: ProductVariant } | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTag, setSelectedTag] = useState<string>('Semua')

  const filteredProducts = useMemo(() => {
    return digitalProducts.filter((product) => {
      const matchesSearch =
        product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.variants.some((v) => v.name.toLowerCase().includes(searchQuery.toLowerCase()))
      const matchesTag = selectedTag === 'Semua' || product.tag === selectedTag
      return matchesSearch && matchesTag
    })
  }, [searchQuery, selectedTag])

  return (
    <main className="min-h-screen bg-[#f4f8fc] text-[#0a192f] selection:bg-blue-200">
      {/* Background Meshes */}
      <div className="fixed left-0 top-0 -z-10 h-full w-full overflow-hidden">
        <div className="absolute left-[-10%] top-[-5%] h-[500px] w-[500px] rounded-full bg-blue-400/20 blur-[120px]" />
        <div className="absolute right-[-5%] top-[20%] h-[600px] w-[600px] rounded-full bg-cyan-300/20 blur-[150px]" />
      </div>

      {/* Header Nav */}
      <header className="fixed inset-x-0 top-0 z-40 px-4 pt-4 sm:px-6 lg:px-10">
        <nav className="mx-auto flex max-w-7xl items-center justify-between rounded-full border border-white/70 bg-white/60 px-5 py-3 shadow-lg shadow-blue-900/5 backdrop-blur-xl">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-black tracking-tight text-[#0a192f] transition hover:text-[#2563eb]"
          >
            <ArrowLeft className="size-4" /> Kembali
          </Link>
          
          {/* LINK KE KERANJANG DI SINI */}
          <Link href="/ekrafstore/cart" className="flex items-center gap-3 font-bold tracking-tight text-[#2563eb] transition-all hover:scale-105 hover:text-blue-700">
            <span className="relative flex size-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex size-2.5 rounded-full bg-green-500"></span>
            </span>
            <span className="flex items-center gap-1.5 text-sm font-black">
              <ShoppingCart className="size-4" /> KERANJANG
            </span>
          </Link>
        </nav>
      </header>

      <div className="mx-auto max-w-7xl px-6 pb-24 pt-36 lg:px-10">
        {/* Hero Section */}
        <div className="mb-14 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/80 px-4 py-1.5 backdrop-blur">
            <Zap className="size-3.5 text-blue-600" />
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Layanan Digital & Hardware Official</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight sm:text-6xl">
            Satu Pintu untuk<br />
            <span className="text-[#2563eb]">Kebutuhan Digitalmu.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-slate-500 text-sm sm:text-base">
            Lisensi premium ramah kantong mahasiswa, hingga perbaikan hardware dan riset sistem cerdas oleh divisi Ekraf HIMATIFA.
          </p>

          {/* Stats Bar */}
          <div className="mx-auto mt-8 flex max-w-2xl flex-wrap items-center justify-center gap-6 rounded-2xl border border-white/80 bg-white/40 p-4 backdrop-blur-md shadow-sm">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
              <ShieldCheck className="size-4 text-blue-500" /> 100% Bergaransi
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
              <Clock className="size-4 text-blue-500" /> Proses {"<"} 15 Menit
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
              <CheckCircle2 className="size-4 text-blue-500" /> Quality Verified
            </div>
          </div>
        </div>

        {/* Catalog Section */}
        <section className="mb-24">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-black tracking-tight sm:text-3xl">
                Premium <span className="text-[#2563eb]">Services.</span>
              </h2>
              <p className="text-xs font-semibold text-slate-500 mt-1">Pilih kategori atau gunakan pencarian instan.</p>
            </div>

            {/* Controls: Search & Tags */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari aplikasi..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-slate-200/80 bg-white/80 pl-10 pr-4 py-2 text-xs font-medium outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 sm:w-56"
                />
              </div>

              <div className="flex flex-wrap gap-1.5">
                {['Semua', 'AI Tools', 'Streaming', 'Creative'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(tag)}
                    className={`rounded-xl px-3 py-2 text-xs font-bold transition ${
                      selectedTag === tag
                        ? 'bg-[#0a192f] text-white shadow-md'
                        : 'bg-white/60 text-slate-600 hover:bg-white hover:text-blue-600'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Product Cards Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {filteredProducts.map((product) => (
              <div
                key={product.category}
                className="flex flex-col overflow-hidden rounded-[2rem] border border-white/80 bg-white/60 p-1 shadow-lg shadow-blue-900/5 backdrop-blur-xl transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="rounded-[1.7rem] bg-[#0a192f] p-5 text-white flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400">{product.tag}</span>
                    <h3 className="text-lg font-black">{product.category}</h3>
                  </div>
                  <div className="grid size-10 place-items-center rounded-xl bg-white/10">{product.icon}</div>
                </div>

                <div className="flex flex-1 flex-col gap-2 p-4">
                  {product.variants.map((variant) => (
                    <button
                      key={variant.name}
                      onClick={() => setSelectedItem({ category: product.category, variant })}
                      className="group flex items-center justify-between rounded-xl border border-slate-100 bg-white/50 p-3 text-left transition hover:border-blue-200 hover:bg-blue-50"
                    >
                      <div className="pr-2">
                        <p className="text-xs font-bold text-slate-700 group-hover:text-[#2563eb]">{variant.name}</p>
                        <p className="mt-0.5 text-[11px] font-semibold text-slate-500">{variant.priceLabel}</p>
                      </div>
                      <div className="grid size-7 shrink-0 place-items-center rounded-lg bg-slate-100 transition group-hover:bg-blue-600 group-hover:text-white">
                        <ShoppingCart className="size-3.5" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white/40 p-12 text-center">
              <p className="text-sm font-bold text-slate-500">Layanan tidak ditemukan untuk kata kunci tersebut.</p>
            </div>
          )}
        </section>

        {/* Section 2: Hardware & Tech Clinic */}
        <section>
          <div className="mb-10">
            <p className="mb-2 text-xs font-bold uppercase tracking-[.2em] text-[#2563eb]">HIMATIFA Tech Clinic</p>
            <h2 className="text-2xl font-black tracking-tight sm:text-3xl">
              Hardware & <span className="text-[#2563eb]">Software Solutions.</span>
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {techServices.map((svc) => (
              <div
                key={svc.id}
                className="group relative overflow-hidden rounded-[2rem] border border-white/80 bg-white/60 p-7 shadow-lg shadow-blue-900/5 backdrop-blur-xl transition hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-900/10"
              >
                <div className="absolute right-0 top-0 -mr-8 -mt-8 size-32 rounded-full bg-blue-100/50 blur-2xl transition group-hover:bg-blue-200/50" />
                <div className="relative z-10 flex items-start gap-5">
                  <div className="grid size-14 shrink-0 place-items-center rounded-2xl bg-blue-100/80 shadow-inner">
                    {svc.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-extrabold text-[#0a192f]">{svc.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-500">{svc.desc}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {svc.stack.map((tech) => (
                        <span
                          key={tech}
                          className="rounded-full border border-blue-100 bg-white/80 px-3 py-1 text-[10px] font-bold text-blue-600 shadow-sm backdrop-blur"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    <a
                      href="https://wa.me/6287762728979?text=Halo%20Admin,%20saya%20ingin%20konsultasi%20mengenai%20layanan%20Tech%20Clinic%20HIMATIFA."
                      target="_blank"
                      rel="noreferrer"
                      className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#2563eb] transition hover:gap-3"
                    >
                      Konsultasi Sekarang <MessageCircle className="size-4" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Add To Cart Success Modal */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedItem(null)}
              className="absolute inset-0 bg-[#0a192f]/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-sm overflow-hidden rounded-[2.5rem] border border-white/80 bg-white/90 shadow-2xl backdrop-blur-2xl"
            >
              <div className="p-8 text-center">
                <div className="mx-auto mb-5 grid size-16 place-items-center rounded-2xl bg-green-100 text-green-500 shadow-inner">
                  <CheckCircle2 className="size-8" />
                </div>
                
                <h3 className="text-xl font-black text-[#0a192f]">Berhasil Ditambahkan!</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-500">
                  <strong className="text-[#2563eb]">{selectedItem.category} - {selectedItem.variant.name}</strong> telah masuk ke keranjang belanja Anda.
                </p>

                <div className="mt-8 flex flex-col gap-3">
                  <Link 
                    href="/ekrafstore/cart" 
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#2563eb] py-3.5 text-sm font-bold text-white shadow-xl shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700"
                  >
                    Lihat Keranjang <ArrowRight className="size-4" />
                  </Link>
                  <button 
                    onClick={() => setSelectedItem(null)} 
                    className="w-full rounded-xl border border-slate-200 bg-white/50 py-3.5 text-sm font-bold text-slate-600 transition hover:bg-slate-50 hover:text-[#2563eb]"
                  >
                    Lanjut Belanja
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  )
}