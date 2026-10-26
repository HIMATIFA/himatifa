'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    ChevronRight,
    Users,
    Globe,
    HeartHandshake,
    Lightbulb,
    Megaphone
} from 'lucide-react'
import { departments, DepartmentKey } from './data'

export function DepartmentSection() {
    const [activeDepartment, setActiveDepartment] = useState<DepartmentKey>('PSDM')
    const current = departments[activeDepartment]

    return (
        <section id="departemen" className="mx-auto max-w-7xl scroll-mt-24 px-6 py-24 lg:px-10">
            <div className="mb-14">
                <p className="mb-3 text-xs font-bold uppercase tracking-[.2em] text-[#2563eb]">
                    Struktur Gerak
                </p>
                <h2 className="text-4xl font-black tracking-tight text-[#0a192f] sm:text-5xl">
                    Pilar{' '}
                    <span className="bg-gradient-to-r from-[#2563eb] to-sky-400 bg-clip-text text-transparent">
                        Penggerak.
                    </span>
                </h2>
            </div>

            <div className="grid gap-8 lg:grid-cols-[.35fr_.65fr] lg:gap-10">
                <div className="flex flex-row overflow-x-auto pb-4 lg:flex-col lg:overflow-visible lg:pb-0 gap-2 snap-x hide-scrollbar">
                    {(Object.keys(departments) as DepartmentKey[]).map((name) => (
                        <button
                            key={name}
                            onClick={() => setActiveDepartment(name)}
                            className={`group shrink-0 snap-start flex items-center justify-between rounded-2xl border-l-2 px-5 py-3.5 text-left text-sm font-bold transition-all sm:py-4 ${
                                activeDepartment === name
                                    ? 'border-[#2563eb] bg-white text-[#2563eb] shadow-md ring-1 ring-blue-900/5'
                                    : 'border-transparent text-slate-500 hover:bg-white/60 hover:text-[#0a192f]'
                            }`}
                        >
                            <span className="whitespace-nowrap">{name}</span>
                            <ChevronRight
                                className={`hidden size-4 transition-transform lg:block ${
                                    activeDepartment === name ? 'translate-x-1' : 'opacity-0 group-hover:opacity-100'
                                }`}
                            />
                        </button>
                    ))}
                </div>

                <div className="min-h-[340px] rounded-3xl border border-white/80 bg-white/70 p-7 shadow-lg shadow-blue-900/5 backdrop-blur-xl sm:p-10">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeDepartment}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3, ease: 'easeOut' }}
                        >
                            <div className="mb-10 flex items-start justify-between">
                                <div>
                                    <div className="mb-5 grid size-14 place-items-center rounded-2xl bg-blue-100 text-[#2563eb] shadow-sm">
                                        {activeDepartment === 'PSDM' && <Users className="size-6" />}
                                        {activeDepartment === 'Deplu' && <Globe className="size-6" />}
                                        {activeDepartment === 'Kepsos' && <HeartHandshake className="size-6" />}
                                        {activeDepartment === 'Ekraf' && <Lightbulb className="size-6" />}
                                        {activeDepartment === 'Medkominfo' && <Megaphone className="size-6" />}
                                    </div>
                                    <p className="text-xs font-bold uppercase tracking-[.18em] text-[#2563eb]">
                                        Departemen {activeDepartment}
                                    </p>
                                    <h3 className="mt-2 max-w-md text-2xl font-black tracking-tight text-[#0a192f] sm:text-3xl">
                                        {current.label}
                                    </h3>
                                </div>
                                <span className="hidden text-7xl font-black text-slate-100 sm:block">
                                    0{Object.keys(departments).indexOf(activeDepartment) + 1}
                                </span>
                            </div>

                            <p className="max-w-2xl text-[15px] leading-relaxed text-slate-600">
                                {current.desc}
                            </p>

                            <div className="mt-8 grid gap-4 sm:grid-cols-3">
                                {current.programs.map((program: string, i: number) => (
                                    <motion.div
                                        key={program}
                                        initial={{ opacity: 0, y: 12 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.15 + i * 0.08 }}
                                        className="relative overflow-hidden rounded-2xl border border-slate-200/60 bg-white/90 p-4 text-sm font-bold text-[#0a192f] shadow-sm transition-all hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
                                    >
                                        <span className="mb-3 block size-2.5 rounded-full bg-[#2563eb] shadow-[0_0_8px_rgba(37,99,235,0.4)]" />
                                        {program}
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </section>
    )
}
