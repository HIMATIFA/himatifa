'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
    ArrowUpRight,
    Users,
    Code2,
    HeartHandshake
} from 'lucide-react'
import { container, revealStagger, misi } from '../../data'

const pillarIcons = [Users, Code2, HeartHandshake]

export function AboutSection() {
    return (
        <section
            id="profil"
            aria-labelledby="profil-heading"
            className="relative mx-auto max-w-7xl scroll-mt-24 px-4 sm:px-6 py-20 lg:px-8 lg:py-28"
        >
            <motion.div
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: '-80px' }}
                variants={container}
                className="mb-10 sm:mb-14 max-w-3xl"
            >
                <motion.div variants={revealStagger} className="flex items-center gap-3 mb-3">
                    <div className="h-[1px] w-6 sm:w-12 bg-blue-600/30" />
                    <span className="text-[10px] sm:text-xs font-bold tracking-[0.25em] uppercase text-blue-600">
                        Tentang Kami
                    </span>
                </motion.div>

                <motion.h2
                    id="profil-heading"
                    variants={revealStagger}
                    className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight"
                >
                    Membangun Ruang Tumbuh untuk <br className="hidden sm:inline" />
                    <span className="text-blue-600">Talenta Digital Masa Depan</span>
                </motion.h2>

                <motion.p
                    variants={revealStagger}
                    className="mt-3 text-sm sm:text-base leading-relaxed text-slate-600 font-normal"
                >
                    HIMATIFA Universitas Muhammadiyah Surabaya adalah episentrum kolaborasi mahasiswa S1 Informatika. Kami menjembatani teori akademis dengan kebutuhan industri melalui proyek nyata, jejaring profesional, dan kultur kebersamaan.
                </motion.p>
            </motion.div>

            <motion.div
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: '-60px' }}
                variants={container}
                className="grid gap-6 lg:grid-cols-12 lg:items-stretch"
            >
                <motion.div variants={revealStagger} className="lg:col-span-5">
                    <div className="flex h-full flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900 p-7 sm:p-9 text-white shadow-md">
                        <div>
                            <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 border border-blue-400/20 px-3 py-1 text-xs font-medium uppercase tracking-wider text-blue-400">
                                <span className="size-1.5 rounded-full bg-blue-400" />
                                Visi Utama
                            </div>

                            <blockquote className="mt-6 text-xl sm:text-2xl font-bold leading-snug tracking-tight text-slate-100">
                                &ldquo;Menjadi ruang tumbuh bagi talenta digital yang adaptif, kolaboratif, dan solutif bagi peradaban.&rdquo;
                            </blockquote>

                            <p className="mt-4 text-xs sm:text-sm leading-relaxed text-slate-300 font-normal">
                                Mendorong mahasiswa Informatika untuk aktif bereksplorasi, mengasah kepemimpinan, dan membangun portofolio karya nyata yang diakui secara profesional.
                            </p>
                        </div>

                        <div className="mt-8 pt-6 border-t border-slate-800">
                            <div className="mb-5 flex flex-wrap gap-2 text-xs font-medium text-slate-300">
                                <span className="rounded-md bg-slate-800 px-2.5 py-1 border border-slate-700">
                                    Inovasi Terarah
                                </span>
                                <span className="rounded-md bg-slate-800 px-2.5 py-1 border border-slate-700">
                                    Etika & Karakter
                                </span>
                                <span className="rounded-md bg-slate-800 px-2.5 py-1 border border-slate-700">
                                    Karya Berdampak
                                </span>
                            </div>

                            <Link
                                href="/about"
                                className="group flex items-center justify-between w-full rounded-xl bg-blue-600 px-5 py-3 text-xs sm:text-sm font-semibold text-white transition-all hover:bg-blue-500 active:scale-[0.98]"
                            >
                                <span>Pelajari Profil & Filosofi Kami</span>
                                <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                            </Link>
                        </div>
                    </div>
                </motion.div>

                <motion.div variants={revealStagger} className="flex flex-col justify-between gap-4 lg:col-span-7">
                    {misi.map((item, index) => {
                        const Icon = pillarIcons[index % pillarIcons.length]
                        const numberStr = String(index + 1).padStart(2, '0')

                        return (
                            <div
                                key={item.title}
                                className="group flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm transition-all duration-200 hover:border-blue-300 hover:shadow-md"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex items-center gap-3.5">
                                        <div className="grid size-11 shrink-0 place-items-center rounded-xl border border-blue-100 bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                                            <Icon className="size-5" />
                                        </div>
                                        <div>
                                            <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-600">
                                                {item.tag}
                                            </span>
                                            <h3 className="text-base sm:text-lg font-bold text-slate-900">
                                                {item.title}
                                            </h3>
                                        </div>
                                    </div>
                                    <span className="text-xl font-extrabold text-slate-300 group-hover:text-blue-300 transition-colors">
                                        {numberStr}
                                    </span>
                                </div>
                                <p className="mt-3 text-xs sm:text-sm leading-relaxed text-slate-600 font-normal">
                                    {item.desc}
                                </p>
                            </div>
                        )
                    })}
                </motion.div>
            </motion.div>
        </section>
    )
}