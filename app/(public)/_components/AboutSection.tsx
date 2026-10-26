'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import {
    ArrowUpRight,
    Sparkles,
    Users,
    Code2,
    HeartHandshake,
    ShieldCheck
} from 'lucide-react'
import { container, revealStagger, STATS } from './data'

function Counter({ target, suffix, isYear }: { target: number; suffix?: string; isYear?: boolean }) {
    const ref = useRef<HTMLSpanElement>(null)
    const inView = useInView(ref, { once: true, margin: '-60px' })
    const reduce = useReducedMotion()
    const [display, setDisplay] = useState(0)

    useEffect(() => {
        if (!inView) return
        if (reduce) {
            setDisplay(target)
            return
        }
        const duration = 1400
        const start = performance.now()
        let raf: number
        const tick = (now: number) => {
            const p = Math.min((now - start) / duration, 1)
            const eased = 1 - Math.pow(1 - p, 3)
            setDisplay(Math.round(eased * target))
            if (p < 1) raf = requestAnimationFrame(tick)
        }
        raf = requestAnimationFrame(tick)
        return () => cancelAnimationFrame(raf)
    }, [inView, target, reduce])

    return (
        <span ref={ref} className="tabular-nums" aria-label={isYear ? String(target) : `${target}${suffix ?? ''}`}>
            {isYear ? display : `${display}${suffix ?? ''}`}
        </span>
    )
}

const pillars = [
    {
        number: '01',
        title: 'Kolaborasi Lintas Minat',
        desc: 'Menghubungkan mahasiswa dengan beragam minat studi untuk proyek riset, kompetisi teknologi, dan eksplorasi karya kolektif.',
        tag: 'Sinergi Mahasiswa',
        icon: Users,
    },
    {
        number: '02',
        title: 'Kompetensi Relevan Industri',
        desc: 'Akselerasi keahlian teknis melalui bootcamp intensif, study club terarah, dan mentoring langsung berstandar industri digital.',
        tag: 'Technical Mastery',
        icon: Code2,
    },
    {
        number: '03',
        title: 'Dampak Berkelanjutan',
        desc: 'Menginisiasi aksi sosial nyata, literasi teknologi sekolah, dan pengabdian masyarakat yang memberi manfaat konkret.',
        tag: 'Kontribusi Sosial',
        icon: HeartHandshake,
    },
]

export function AboutSection() {
    return (
        <section
            id="profil"
            aria-labelledby="profil-heading"
            className="relative mx-auto max-w-7xl scroll-mt-24 px-6 py-24 lg:px-10 lg:py-28"
        >
            {/* Ambient Background Accent */}
            <div
                aria-hidden
                className="pointer-events-none absolute -top-12 left-1/2 -z-10 h-96 w-full max-w-4xl -translate-x-1/2 rounded-full bg-blue-100/60 blur-[130px]"
            />

            {/* Header Section */}
            <motion.div
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: '-80px' }}
                variants={container}
                className="mx-auto max-w-3xl text-center"
            >
                <motion.div variants={revealStagger} className="inline-flex items-center gap-2 rounded-full border border-blue-200/80 bg-blue-50/80 px-4 py-1.5 text-xs font-bold uppercase tracking-[.2em] text-[#2563eb]">
                    <Sparkles className="size-3.5" />
                    <span>Tentang HIMATIFA</span>
                </motion.div>

                <motion.h2
                    id="profil-heading"
                    variants={revealStagger}
                    className="mt-4 text-3xl font-black tracking-tight text-[#0a192f] sm:text-5xl lg:text-[42px] lg:leading-[1.15]"
                >
                    Membangun Ruang Tumbuh untuk{' '}
                    <span className="relative inline-block bg-gradient-to-r from-[#2563eb] via-sky-500 to-[#2563eb] bg-[length:200%_auto] bg-clip-text text-transparent animate-[gradient-move_4s_linear_infinite]">
                        Talenta Digital Masa Depan.
                    </span>
                </motion.h2>

                <motion.p
                    variants={revealStagger}
                    className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg"
                >
                    HIMATIFA Universitas Muhammadiyah Surabaya adalah episentrum kolaborasi mahasiswa S1 Informatika. Kami menjembatani teori akademis dengan kebutuhan industri melalui proyek nyata, jejaring profesional, dan kultur kebersamaan.
                </motion.p>
            </motion.div>

            {/* 2-Column Showcase */}
            <motion.div
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: '-60px' }}
                variants={container}
                className="mt-14 grid gap-8 lg:grid-cols-12 lg:items-stretch"
            >
                {/* Left Column: Vision & Identity Manifesto */}
                <motion.div variants={revealStagger} className="lg:col-span-5">
                    <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-slate-800/80 bg-gradient-to-br from-[#0c1f38] via-[#0a192f] to-[#071322] p-8 text-white shadow-xl sm:p-10">
                        {/* Decorative subtle pattern */}
                        <div
                            aria-hidden
                            className="pointer-events-none absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:20px_20px] opacity-[0.07]"
                        />
                        <div
                            aria-hidden
                            className="pointer-events-none absolute -bottom-24 -right-24 size-64 rounded-full bg-blue-500/20 blur-3xl"
                        />

                        <div className="relative z-10">
                            <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-blue-300">
                                <span className="size-1.5 animate-pulse rounded-full bg-cyan-400" />
                                Visi Utama
                            </div>

                            <blockquote className="mt-6 text-2xl font-black leading-snug tracking-tight text-white sm:text-3xl">
                                &ldquo;Menjadi ruang tumbuh bagi talenta digital yang adaptif, kolaboratif, dan solutif bagi peradaban.&rdquo;
                            </blockquote>

                            <p className="mt-4 text-sm leading-relaxed text-slate-300">
                                Mendorong mahasiswa Informatika untuk aktif bereksplorasi, mengasah kepemimpinan, dan membangun portofolio karya nyata yang diakui secara profesional.
                            </p>
                        </div>

                        <div className="relative z-10 mt-8 pt-6 border-t border-white/10">
                            <div className="mb-6 flex flex-wrap gap-2 text-xs font-semibold text-blue-200">
                                <span className="rounded-lg bg-white/5 px-2.5 py-1 border border-white/10">
                                    Inovasi Terarah
                                </span>
                                <span className="rounded-lg bg-white/5 px-2.5 py-1 border border-white/10">
                                    Etika & Karakter
                                </span>
                                <span className="rounded-lg bg-white/5 px-2.5 py-1 border border-white/10">
                                    Karya Berdampak
                                </span>
                            </div>

                            <Link
                                href="/about"
                                className="group inline-flex items-center justify-between w-full rounded-2xl bg-[#2563eb] px-5 py-3.5 text-sm font-bold text-white transition-all hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-600/30"
                            >
                                <span>Pelajari Profil & Filosofi Kami</span>
                                <ArrowUpRight className="size-4.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                            </Link>
                        </div>
                    </div>
                </motion.div>

                {/* Right Column: 3 Pillars (Misi) */}
                <motion.div variants={revealStagger} className="flex flex-col justify-between gap-4 lg:col-span-7">
                    {pillars.map((pillar) => {
                        const Icon = pillar.icon
                        return (
                            <div
                                key={pillar.number}
                                className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white/80 p-6 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-md sm:p-7"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex items-center gap-3.5">
                                        <div className="grid size-12 shrink-0 place-items-center rounded-xl border border-blue-100 bg-blue-50 text-[#2563eb] transition-colors group-hover:bg-[#2563eb] group-hover:text-white">
                                            <Icon className="size-5" />
                                        </div>
                                        <div>
                                            <span className="text-[11px] font-bold uppercase tracking-wider text-[#2563eb]">
                                                {pillar.tag}
                                            </span>
                                            <h3 className="text-lg font-bold text-[#0a192f] sm:text-xl">
                                                {pillar.title}
                                            </h3>
                                        </div>
                                    </div>
                                    <span className="text-2xl font-black text-slate-200 group-hover:text-blue-200 transition-colors">
                                        {pillar.number}
                                    </span>
                                </div>
                                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                                    {pillar.desc}
                                </p>
                            </div>
                        )
                    })}
                </motion.div>
            </motion.div>

            {/* Bottom Unified Metrics Bar */}
            <motion.div
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: '-40px' }}
                variants={revealStagger}
                className="mt-8 rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-sm backdrop-blur-md sm:p-8"
            >
                <div className="grid grid-cols-2 gap-6 divide-y divide-slate-100 sm:grid-cols-4 sm:divide-y-0 sm:divide-x">
                    {STATS.map((stat, idx) => (
                        <div
                            key={stat.label}
                            className={`flex flex-col items-center text-center ${
                                idx > 0 ? 'pt-4 sm:pt-0 sm:pl-6' : ''
                            }`}
                        >
                            <div className="text-3xl font-black tracking-tight text-[#2563eb] sm:text-4xl lg:text-5xl">
                                <Counter target={stat.val} suffix={stat.suffix} isYear={stat.isYear} />
                            </div>
                            <span className="mt-1 text-xs font-bold uppercase tracking-wider text-[#0a192f]">
                                {stat.label}
                            </span>
                            <span className="mt-0.5 text-xs text-slate-500">
                                {stat.subtext}
                            </span>
                        </div>
                    ))}
                </div>
            </motion.div>
        </section>
    )
}
