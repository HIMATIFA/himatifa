'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, CalendarDays, MapPin } from 'lucide-react'
import { agenda} from '../../data'

export function AgendaSection() {
    return (
        <section id="agenda" className="relative bg-[#0a0f1d] px-4 sm:px-6 py-20 text-white lg:px-8 lg:py-28">
            <div className="mx-auto max-w-7xl">
                <div className="mb-10 sm:mb-14 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-3">
                            <div className="h-[1px] w-6 sm:w-12 bg-blue-400/40" />
                            <span className="text-[10px] sm:text-xs font-bold tracking-[0.25em] uppercase text-blue-400">
                                Kalender Kegiatan
                            </span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
                            Agenda <span className="text-blue-500">Mendatang</span>
                        </h2>
                    </div>

                    <Link
                        href="/events"
                        className="group hidden sm:inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-blue-400 transition-colors hover:text-white"
                    >
                        <span>Lihat Semua Agenda</span>
                        <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                </div>

                <div className="flex flex-col gap-4">
                    {agenda.map((event, index) => (
                        <motion.div
                            key={event.title}
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-40px' }}
                            transition={{ delay: index * 0.08, duration: 0.4 }}
                            className="group flex flex-col sm:flex-row sm:items-center justify-between gap-5 rounded-2xl border border-slate-800/80 bg-slate-900/50 p-5 sm:p-6 transition-all duration-200 hover:border-slate-700 hover:bg-slate-900"
                        >
                            <div className="flex items-start sm:items-center gap-4 sm:gap-6">
                                <div className="flex size-16 sm:size-20 shrink-0 flex-col items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10 text-center transition-colors duration-300 group-hover:bg-blue-600 group-hover:border-blue-600">
                                    <span className="text-2xl sm:text-3xl font-extrabold leading-none text-blue-400 group-hover:text-white transition-colors">
                                        {event.date}
                                    </span>
                                    <span className="mt-1 text-[10px] font-bold tracking-widest uppercase text-blue-300 group-hover:text-blue-100 transition-colors">
                                        {event.month}
                                    </span>
                                </div>

                                <div className="space-y-1.5">
                                    <h3 className="text-base sm:text-lg font-bold text-white transition-colors group-hover:text-blue-400">
                                        {event.title}
                                    </h3>
                                    <p className="text-xs sm:text-sm leading-relaxed text-slate-400 max-w-2xl font-normal">
                                        {event.desc}
                                    </p>
                                    <div className="flex items-center gap-1.5 pt-1 text-xs font-medium text-slate-400">
                                        <MapPin className="size-3.5 text-blue-400 shrink-0" />
                                        <span>{event.place}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="shrink-0 pt-2 sm:pt-0">
                                <button
                                    type="button"
                                    className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-slate-700/80 bg-slate-800/60 px-4 py-2.5 text-xs font-semibold text-slate-200 transition-all duration-200 hover:border-slate-500 hover:bg-slate-700 hover:text-white active:scale-[0.98]"
                                >
                                    <CalendarDays className="size-3.5 text-blue-400" />
                                    <span>Ingatkan Saya</span>
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-8 flex justify-center sm:hidden">
                    <Link
                        href="/events"
                        className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-6 py-3 text-xs font-semibold text-blue-400 transition-colors hover:border-slate-700 hover:text-white"
                    >
                        <span>Lihat Semua Agenda</span>
                        <ArrowRight className="size-4" />
                    </Link>
                </div>
            </div>
        </section>
    )
}