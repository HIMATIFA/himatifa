'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
    ArrowLeft,
    ExternalLink,
    MonitorSmartphone,
    Sparkles,
    Copyright,
    HeartHandshake
} from 'lucide-react'

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

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.15 }
    }
}

const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    show: {
        opacity: 1,
        y: 0,
        transition: { type: "spring", stiffness: 80, damping: 15 }
    }
}

export default function ShowcasePage() {
    return (
        <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 sm:px-6 lg:px-10 lg:py-12 font-sans selection:bg-blue-500 selection:text-white relative overflow-hidden">
            <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                <div className="absolute -left-32 -top-32 size-[500px] rounded-full bg-blue-400/20 blur-[140px]" />
                <div className="absolute right-0 top-1/4 size-[600px] rounded-full bg-cyan-400/15 blur-[160px]" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-60" />
            </div>

            <div className="mx-auto max-w-7xl relative z-10">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
                    <Link
                        href="/"
                        className="group inline-flex items-center gap-2.5 text-sm font-bold text-slate-500 transition hover:text-blue-600"
                    >
                        <div className="flex size-8 items-center justify-center rounded-xl bg-white border border-slate-200 group-hover:bg-blue-50 group-hover:border-blue-200 transition">
                            <ArrowLeft className="size-4" />
                        </div>
                        Kembali ke Beranda
                    </Link>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="mt-8 mb-14"
                >
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-200/80 bg-blue-50/80 px-4 py-1.5 backdrop-blur-md shadow-sm">
                        <Sparkles className="size-3.5 text-blue-600" />
                        <span className="text-xs font-extrabold uppercase tracking-wider text-blue-600">Hall of Fame</span>
                    </div>
                    <h1 className="text-4xl font-black tracking-tight text-slate-900 sm:text-6xl">
                        Karya Digital <br />
                        <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 bg-clip-text text-transparent">
              Mahasiswa.
            </span>
                    </h1>
                    <p className="mt-5 max-w-xl text-sm leading-relaxed text-slate-500 sm:text-base font-medium">
                        Ruang apresiasi untuk inovasi, aplikasi, dan riset teknologi yang lahir dari tangan-tangan kreatif mahasiswa S1 Informatika UMSURA.
                    </p>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
                >
                    {projects.map((project) => (
                        <motion.div
                            key={project.id}
                            variants={cardVariants}
                            whileHover={{ y: -8 }}
                            className="group flex flex-col overflow-hidden rounded-[2.5rem] border border-white/80 bg-white/70 shadow-xl shadow-blue-900/5 backdrop-blur-xl transition-all hover:bg-white/90"
                        >
                            <div className="relative aspect-[4/3] w-full bg-slate-100 overflow-hidden">
                                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 to-slate-100 text-slate-300">
                                    <MonitorSmartphone className="size-16" />
                                </div>

                                <Image
                                    src={project.image}
                                    alt={project.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105 z-10"
                                    onError={(e) => { e.currentTarget.style.display = 'none' }} // Sembunyikan jika error
                                />

                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent z-20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                            </div>

                            <div className="flex flex-1 flex-col p-6 sm:p-8">
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-blue-600">
                  {project.developer}
                </span>
                                <h3 className="mt-2 text-xl font-black text-slate-900 line-clamp-1">{project.title}</h3>
                                <p className="mt-3 text-sm leading-relaxed text-slate-500 line-clamp-3 font-medium">
                                    {project.desc}
                                </p>

                                <div className="mt-5 flex flex-wrap gap-2">
                                    {project.tags.map(tag => (
                                        <span
                                            key={tag}
                                            className="rounded-lg bg-blue-50/80 px-3 py-1.5 text-[11px] font-bold text-blue-700 border border-blue-100/50"
                                        >
                      {tag}
                    </span>
                                    ))}
                                </div>

                                <div className="mt-auto pt-8">
                                    <div className="flex items-center gap-3">
                                        <a
                                            href={project.repo}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-900 py-3 text-xs font-bold text-white transition hover:bg-slate-800 hover:shadow-lg hover:shadow-slate-900/20"
                                        >
                                            <GithubIcon className="size-4" /> <span>Repo</span>
                                        </a>
                                        <a
                                            href={project.link}
                                            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-3 text-xs font-bold text-slate-700 transition hover:border-blue-500 hover:text-blue-600 hover:shadow-sm"
                                        >
                                            <span>Live Demo</span> <ExternalLink className="size-3.5" />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                <motion.footer
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="mt-20 flex flex-col items-center justify-between gap-3 border-t border-slate-200/60 pb-4 pt-8 sm:flex-row"
                >
                    <p className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
                        <Copyright className="size-3.5" /> {new Date().getFullYear()} HIMATIFA UMSURA
                    </p>
                    <p className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
                        CREATED by MEDKOMINFO
                    </p>
                </motion.footer>
            </div>
        </main>
    )
}