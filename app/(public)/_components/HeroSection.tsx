'use client'

import { useRef, useEffect, useState } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform, useInView, animate } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { heroContainer, heroItem, stats } from './data'

interface CounterProps {
    target: number
    suffix?: string
    isYear?: boolean
    duration?: number
}

function Counter({ target, suffix = '', isYear = false, duration = 2 }: CounterProps) {
    const ref = useRef<HTMLSpanElement>(null)
    const isInView = useInView(ref, { once: true, margin: '-40px' })
    const [count, setCount] = useState(isYear ? Math.max(0, target - 15) : 0)

    useEffect(() => {
        if (!isInView) return

        const startValue = isYear ? Math.max(0, target - 15) : 0

        const controls = animate(startValue, target, {
            duration: duration,
            ease: [0.16, 1, 0.3, 1],
            onUpdate: (latest) => {
                setCount(Math.floor(latest))
            },
        })

        return () => controls.stop()
    }, [isInView, target, isYear, duration])

    return (
        <span ref={ref}>
            {count}
            {suffix}
        </span>
    )
}

export function HeroSection() {
    const heroRef = useRef<HTMLElement>(null)
    const { scrollYProgress: heroProgress } = useScroll({
        target: heroRef,
        offset: ['start start', 'end start']
    })
    const heroOpacity = useTransform(heroProgress, [0, 0.8], [1, 0])
    const heroY = useTransform(heroProgress, [0, 1], ['0%', '15%'])

    return (
        <section
            id="beranda"
            ref={heroRef}
            className="relative flex min-h-[100dvh] w-full flex-col items-center justify-center overflow-hidden bg-[#0a0f1d] px-4 sm:px-6 pb-16 sm:pb-20 pt-28 sm:pt-32"
        >
            <div
                className="absolute inset-0 z-0 bg-cover bg-center opacity-80 mix-blend-luminosity"
                style={{ backgroundImage: `url('/bg.webp')` }}
            />
            <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#0a0f1d]/60 via-[#0a0f1d]/85 to-[#0a0f1d]" />
            <div className="absolute left-1/2 top-1/3 z-0 -translate-x-1/2 -translate-y-1/2 size-[360px] sm:size-[520px] rounded-full bg-blue-600/15 blur-[120px] pointer-events-none" />

            <motion.div
                initial="hidden"
                animate="show"
                variants={heroContainer}
                style={{ opacity: heroOpacity, y: heroY }}
                className="relative z-10 flex w-full max-w-4xl flex-col items-center text-center mt-2 sm:mt-6"
            >
                <motion.div variants={heroItem} className="flex items-center justify-center gap-3 mb-4 sm:mb-5">
                    <div className="h-[1px] w-6 sm:w-12 bg-blue-400/40" />
                    <span className="text-[10px] sm:text-xs font-bold tracking-[0.25em] uppercase text-blue-400">
                        HIMATIFA UMSURA
                    </span>
                    <div className="h-[1px] w-6 sm:w-12 bg-blue-400/40" />
                </motion.div>

                <motion.h1
                    variants={heroItem}
                    className="text-3xl xs:text-4xl sm:text-6xl md:text-6xl font-extrabold text-white leading-[1.15] tracking-tight mb-2 sm:mb-3"
                >
                    HIMPUNAN MAHASISWA <br />
                    <span className="text-blue-500">INFORMATIKA</span>
                </motion.h1>

                <motion.p
                    variants={heroItem}
                    className="text-xs sm:text-sm md:text-base font-semibold text-slate-300 mb-6 sm:mb-7 tracking-[0.18em] uppercase"
                >
                    Universitas Muhammadiyah Surabaya
                </motion.p>

                <motion.p
                    variants={heroItem}
                    className="text-xs sm:text-sm md:text-base leading-relaxed text-slate-300/90 max-w-xl mb-8 sm:mb-9 font-normal px-2"
                >
                    Wadah kolaborasi mahasiswa Informatika Universitas Muhammadiyah Surabaya untuk mengasah kompetensi teknis dan berdaya saing global.
                </motion.p>

                <motion.div
                    variants={heroItem}
                    className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto px-4 sm:px-0"
                >
                    <Link
                        href="/about"
                        className="group w-full sm:w-auto px-7 py-3.5 bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-semibold rounded-full transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2"
                    >
                        Profil HIMATIFA
                        <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                    <Link
                        href="/events"
                        className="w-full sm:w-auto px-7 py-3.5 bg-slate-900/60 border border-slate-700/80 hover:border-slate-500 text-slate-200 text-xs sm:text-sm font-medium rounded-full transition-all duration-200 hover:bg-slate-800/80 active:scale-[0.98] flex justify-center text-center backdrop-blur-sm"
                    >
                        Lihat Agenda
                    </Link>
                </motion.div>

                <motion.div
                    variants={heroItem}
                    className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-10 w-full max-w-3xl mt-12 sm:mt-16 pt-8 border-t border-slate-800/80"
                >
                    {stats.map(s => (
                        <div key={s.label} className="flex flex-col items-center">
                            <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                                <Counter target={s.val} suffix={s.suffix} isYear={s.isYear} />
                            </div>
                            <div className="text-[10px] sm:text-xs mt-1 text-slate-400 uppercase tracking-wider font-medium text-center">
                                {s.label}
                            </div>
                        </div>
                    ))}
                </motion.div>
            </motion.div>
        </section>
    )
}