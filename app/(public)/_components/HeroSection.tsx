'use client'

import { useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, ChevronDown } from 'lucide-react'
import { people, heroContainer, heroItem } from './data'

export function HeroSection() {
    const heroRef = useRef<HTMLElement>(null)
    const { scrollYProgress: heroProgress } = useScroll({
        target: heroRef,
        offset: ['start start', 'end start']
    })
    const heroOpacity = useTransform(heroProgress, [0, 0.8], [1, 0])
    const heroY = useTransform(heroProgress, [0, 1], ['0%', '20%'])

    return (
        <section
            id="beranda"
            ref={heroRef}
            className="relative flex min-h-[90vh] w-full flex-col items-center justify-center overflow-hidden px-6 pb-20 pt-32 text-center lg:px-10"
            style={{
                backgroundImage: "url('/bg.webp')",
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
            <div className="absolute inset-0 z-0 bg-slate-950/70 bg-gradient-to-b from-slate-900/70 to-slate-950/95" />

            <motion.div
                initial="hidden"
                animate="show"
                variants={heroContainer}
                style={{ opacity: heroOpacity, y: heroY }}
                className="relative z-10 flex w-full max-w-7xl flex-col items-center"
            >
                <motion.h1
                    variants={heroItem}
                    className="max-w-4xl text-5xl font-extrabold leading-tight tracking-tight text-white sm:text-6xl lg:text-7xl"
                >
                    Inovasi Tanpa Batas,<br />
                    <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400 bg-[length:200%_auto] animate-[gradient-move_5s_linear_infinite] bg-clip-text text-transparent">
                        Sinergi S1 Informatika.
                    </span>
                </motion.h1>

                <motion.p
                    variants={heroItem}
                    className="mt-6 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg"
                >
                    Wadah kolaborasi mahasiswa Informatika Universitas Muhammadiyah Surabaya untuk mengasah kompetensi teknis dan berdaya saing global.
                </motion.p>

                <motion.div variants={heroItem} className="mt-10 flex flex-wrap items-center justify-center gap-4">
                    <Link
                        href="/about"
                        className="group flex items-center rounded-full bg-blue-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition-all hover:-translate-y-0.5 hover:bg-blue-500 hover:shadow-xl hover:shadow-blue-500/30"
                    >
                        Kenali HIMATIFA{' '}
                        <ArrowRight className="ml-2 size-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                    <Link
                        href="/events"
                        className="rounded-full border border-slate-400/30 bg-white/10 px-8 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-white/40 hover:bg-white/20"
                    >
                        Jelajahi Agenda
                    </Link>
                </motion.div>

                <motion.div
                    variants={heroItem}
                    className="mt-10 flex items-center justify-center gap-4 text-sm font-medium text-slate-300"
                >
                    <div className="flex -space-x-3">
                        {people.slice(0, 3).map((p) => (
                            <Image
                                key={p.name}
                                src={p.image}
                                alt={p.name}
                                width={40}
                                height={40}
                                className="size-10 rounded-full border-2 border-slate-900 object-cover shadow-sm transition-transform hover:-translate-y-1 hover:scale-110"
                            />
                        ))}
                        <span className="grid size-10 place-items-center rounded-full border-2 border-slate-900 bg-blue-600 text-xs font-black text-white">
                            500+
                        </span>
                    </div>
                    <span>
                        Lebih dari <strong className="text-white">500+</strong> mahasiswa
                    </span>
                </motion.div>
            </motion.div>

            <motion.a
                href="#profil"
                aria-label="Scroll ke bawah"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.4 }}
                className="absolute bottom-8 z-10 flex flex-col items-center gap-1.5 text-slate-400 transition-colors hover:text-white"
            >
                <span className="text-[10px] font-bold uppercase tracking-[.2em]">Scroll</span>
                <motion.span
                    animate={{ y: [0, 6, 0] }}
                    transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
                >
                    <ChevronDown className="size-5" />
                </motion.span>
            </motion.a>
        </section>
    )
}
