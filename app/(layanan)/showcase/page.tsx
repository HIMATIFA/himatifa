import Link from 'next/link'
import { ArrowLeft, ExternalLink, MonitorSmartphone, Sparkles } from 'lucide-react'
import Image from 'next/image'

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
)

const projects = [
  {
    id: 1,
    title: 'Kerjakarsa',
    developer: 'Tim Gemastik XIX',
    desc: 'Platform cerdas yang menghubungkan klien dengan pekerja lepas, dilengkapi fitur escrow payment dan live location tracking.',
    tags: ['Next.js', 'Supabase', 'Tailwind'],
    link: '#',
    repo: 'https://github.com/muhammadarya-ums/kerjakarsa',
    image: '/showcase-1.jpg'
  },
  {
    id: 2,
    title: 'NusAR',
    developer: 'Divisi RnD Himatifa',
    desc: 'Aplikasi edukasi interaktif berbasis mobile yang mengintegrasikan animasi dan sistem pemindaian cerdas untuk materi pembelajaran.',
    tags: ['Capacitor', 'Mobile', 'Education'],
    link: '#',
    repo: 'https://github.com/muhammadarya-ums/NusAR',
    image: '/showcase-2.jpg' 
  },
  {
    id: 3,
    title: 'Smart Medical IoT',
    developer: 'Study Club Hardware',
    desc: 'Purwarupa sistem pemantauan medis menggunakan mikrokontroler dengan integrasi sensor oksimetri dan tekanan presisi tinggi.',
    tags: ['ESP32', 'C++', 'I2C Sensors'],
    link: '#',
    repo: '#',
    image: '/showcase-3.jpg'
  }
]

export default function ShowcasePage() {
  return (
    <main className="min-h-screen bg-[#f4f8fc] px-4 py-8 text-[#0a192f] sm:px-6 lg:px-10 lg:py-12">
      <div className="fixed left-[-10%] top-[-5%] -z-10 h-125 w-125 rounded-full bg-blue-400/20 blur-[120px]" />
      <div className="fixed right-[-5%] top-[20%] -z-10 h-150 w-150 rounded-full bg-cyan-300/20 blur-[150px]" />

      <div className="mx-auto max-w-7xl">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 transition-colors hover:text-[#2563eb]">
          <ArrowLeft className="size-4" /> Beranda
        </Link>

        <div className="mt-8 mb-14">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/80 px-4 py-1.5 backdrop-blur">
            <Sparkles className="size-3.5 text-blue-600" />
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Hall of Fame</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight sm:text-6xl">Karya Digital <br /><span className="text-[#2563eb]">Mahasiswa.</span></h1>
          <p className="mt-5 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
            Ruang apresiasi untuk inovasi, aplikasi, dan riset teknologi yang lahir dari tangan-tangan kreatif mahasiswa S1 Informatika UMSurabaya.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <div key={project.id} className="group flex flex-col overflow-hidden rounded-[2rem] border border-white/80 bg-white/60 shadow-lg shadow-blue-900/5 backdrop-blur-xl transition hover:-translate-y-1 hover:shadow-xl">
              <div className="aspect-video w-full bg-[#0a192f] relative overflow-hidden">
                <div className="absolute inset-0 bg-blue-500/10 mix-blend-overlay transition group-hover:bg-transparent" />
                {/* Fallback pattern jika gambar belum ada */}
                <div className="flex h-full w-full items-center justify-center text-blue-100/20">
                  <MonitorSmartphone className="size-12" />
                </div>
              </div>
              
              <div className="flex flex-1 flex-col p-6">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#2563eb]">{project.developer}</span>
                <h3 className="mt-1 text-xl font-black text-[#0a192f]">{project.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-500 line-clamp-3">{project.desc}</p>
                
                <div className="mt-5 flex flex-wrap gap-2">
                  {project.tags.map(tag => (
                    <span key={tag} className="rounded-full bg-blue-50 px-3 py-1 text-[10px] font-bold text-[#2563eb]">{tag}</span>
                  ))}
                </div>

                <div className="mt-8 flex items-center gap-3 pt-4 border-t border-slate-100">
                  <a href={project.repo} target="_blank" rel="noreferrer" className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#0a192f] py-2.5 text-xs font-bold text-white transition hover:bg-slate-800">
                    {/* Menggunakan GithubIcon*/}
                    <GithubIcon className="size-4" /> Repository
                  </a>
                  <a href={project.link} className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-bold text-slate-600 transition hover:border-[#2563eb] hover:text-[#2563eb]">
                    Live Demo <ExternalLink className="size-4" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}