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

const departmentIcons: Record<DepartmentKey, React.ElementType> = {
    PSDM: Users,
    Deplu: Globe,
    Kepsos: HeartHandshake,
    Ekraf: Lightbulb,
    Medkominfo: Megaphone,
}

export function DepartmentSection() {
    const [activeDepartment, setActiveDepartment] = useState<DepartmentKey>('PSDM')
    const current = departments[activeDepartment]
    const IconComponent = departmentIcons[activeDepartment] || Users
    const departmentKeys = Object.keys(departments) as DepartmentKey[]
    const activeIndex = departmentKeys.indexOf(activeDepartment) + 1

    return (
        <section id="departemen" className="mx-auto max-w-7xl scroll-mt-24 px-4 sm:px-6 py-20 lg:px-8 lg:py-28">
            <div className="mb-10 sm:mb-14 max-w-3xl">
                <div className="flex items-center gap-3 mb-3">
                    <div className="h-[1px] w-6 sm:w-12 bg-blue-600/30" />
                    <span className="text-[10px] sm:text-xs font-bold tracking-[0.25em] uppercase text-blue-600">
                        Struktur Gerak
                    </span>
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
                    Pilar <span className="text-blue-600">Penggerak Organisasi</span>
                </h2>
                <p className="mt-3 text-sm sm:text-base leading-relaxed text-slate-600 font-normal">
                    Lima departemen utama yang menjalankan fungsi strategis HIMATIFA UMSURA dalam pelayanan, pengembangan, dan karya nyata.
                </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-[260px_1fr] lg:gap-8 items-start">
                <div className="flex flex-row overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0 gap-2 snap-x hide-scrollbar">
                    {departmentKeys.map((key) => {
                        const isActive = activeDepartment === key
                        return (
                            <button
                                key={key}
                                onClick={() => setActiveDepartment(key)}
                                className={`group shrink-0 snap-start flex items-center justify-between rounded-xl px-4 py-3.5 text-left text-xs sm:text-sm font-semibold transition-all duration-200 ${
                                    isActive
                                        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                                        : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/80'
                                }`}
                            >
                                <span className="whitespace-nowrap font-bold">{key}</span>
                                <ChevronRight
                                    className={`hidden size-4 transition-transform lg:block ${
                                        isActive ? 'translate-x-0.5 text-white' : 'text-slate-400 group-hover:text-slate-600'
                                    }`}
                                />
                            </button>
                        )
                    })}
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-9 shadow-sm">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeDepartment}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -12 }}
                            transition={{ duration: 0.25, ease: 'easeOut' }}
                        >
                            <div className="flex items-start justify-between gap-4 mb-6 sm:mb-8">
                                <div>
                                    <div className="mb-4 grid size-12 place-items-center rounded-xl border border-blue-100 bg-blue-50 text-blue-600">
                                        <IconComponent className="size-6" />
                                    </div>
                                    <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-600">
                                        Departemen {activeDepartment}
                                    </span>
                                    <h3 className="mt-1 text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                                        {current.label}
                                    </h3>
                                </div>
                                <span className="hidden sm:block text-5xl font-extrabold text-slate-200">
                                    0{activeIndex}
                                </span>
                            </div>

                            <p className="text-xs sm:text-sm leading-relaxed text-slate-600 font-normal">
                                {current.desc}
                            </p>

                            <div className="mt-8 pt-6 border-t border-slate-100">
                                <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3 sm:mb-4">
                                    Program Kerja Unggulan
                                </h4>
                                <div className="grid gap-3 sm:grid-cols-3">
                                    {current.programs.map((program: string, i: number) => (
                                        <motion.div
                                            key={program}
                                            initial={{ opacity: 0, y: 8 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.05 * i, duration: 0.2 }}
                                            className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-xs sm:text-sm font-semibold text-slate-800 transition-all hover:border-blue-300 hover:bg-blue-50/50"
                                        >
                                            <span className="size-2 rounded-full bg-blue-600 shrink-0" />
                                            <span>{program}</span>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </section>
    )
}