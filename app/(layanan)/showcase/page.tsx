'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { showcaseProjects, type ProjectItem } from '@/app/data'
import {
    ArrowLeft,
    ExternalLink,
    MonitorSmartphone,
    Sparkles,
    Copyright,
    Code2
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

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
}

const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] }
    }
}

export default function ShowcasePage() {
    return (
        <main className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased relative overflow-hidden">
            <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] opacity-40" />

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
                <motion.div
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-600 shadow-xs transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 active:scale-[0.98]"
                    >
                        <ArrowLeft className="size-3.5" />
                        <span>Kembali ke Beranda</span>
                    </Link>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="mt-8 mb-10 sm:mb-14 max-w-3xl"
                >
                    <div className="flex items-center gap-3 mb-3">
                        <div className="h-[1px] w-6 sm:w-12 bg-blue-600/30" />
                        <span className="text-[10px] sm:text-xs font-bold tracking-[0.25em] uppercase text-blue-600">
                            Hall of Fame & Showcase
                        </span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
                        Karya Digital <span className="text-blue-600">Mahasiswa</span>
                    </h1>
                    <p className="mt-3 text-sm sm:text-base leading-relaxed text-slate-600 font-normal">
                        Ruang apresiasi untuk inovasi perangkat lunak, aplikasi bergerak, dan riset teknologi yang lahir dari mahasiswa S1 Informatika UMSURA.
                    </p>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
                >
                    {showcaseProjects.map((project) => (
                        <motion.div
                            key={project.id}
                            variants={cardVariants}
                            className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs transition-all duration-200 hover:border-slate-300 hover:shadow-md"
                        >
                            <div>
                                <div className="relative aspect-16/10 w-full overflow-hidden bg-slate-100 border-b border-slate-100">
                                    <div className="flex h-full w-full items-center justify-center bg-slate-100 text-slate-300">
                                        <MonitorSmartphone className="size-12" />
                                    </div>

                                    {project.image && (
                                        <Image
                                            src={project.image}
                                            alt={project.title}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                                            onError={(e) => {
                                                e.currentTarget.style.display = 'none'
                                            }}
                                        />
                                    )}
                                </div>

                                <div className="p-5 sm:p-6">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-[11px] font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2.5 py-0.5 rounded-md">
                                            {project.developer}
                                        </span>
                                    </div>

                                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                                        {project.title}
                                    </h3>

                                    <p className="mt-2 text-xs font-medium leading-relaxed text-slate-500 line-clamp-3">
                                        {project.desc}
                                    </p>

                                    <div className="mt-4 flex flex-wrap gap-1.5">
                                        {project.tags.map((tag) => (
                                            <span
                                                key={tag}
                                                className="rounded-md bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-600"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-2">
                                <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                                    {project.repo && project.repo !== '#' && (
                                        <a
                                            href={project.repo}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-900 py-2.5 text-xs font-semibold text-white transition hover:bg-slate-800 active:scale-[0.98]"
                                        >
                                            <GithubIcon className="size-3.5" />
                                            <span>Repository</span>
                                        </a>
                                    )}
                                    <a
                                        href={project.link}
                                        className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-semibold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50/50 hover:text-blue-600 active:scale-[0.98]"
                                    >
                                        <span>Live Demo</span>
                                        <ExternalLink className="size-3 text-slate-400" />
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                <motion.footer
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mt-16 flex flex-col items-center justify-between gap-3 border-t border-slate-200 pt-6 sm:flex-row text-xs text-slate-400 font-medium"
                >
                    <p className="flex items-center gap-1.5">
                        <Copyright className="size-3.5" /> 2026 HIMATIFA UMSURA
                    </p>
                    <p>Dikembangkan oleh Departemen Medkominfo</p>
                </motion.footer>
            </div>
        </main>
    )
}
