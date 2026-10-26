'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, CalendarDays, MapPin } from 'lucide-react'
import { AGENDA } from './data'

export function AgendaSection() {
    return (
        <section id="agenda" className="bg-[#0a192f] px-6 py-24 text-white lg:px-10">
            <div className="mx-auto max-w-7xl">
                <div className="mb-14 flex items-end justify-between">
                    <div>
                        <p className="mb-3 text-xs font-bold uppercase tracking-[.2em] text-blue-400">
                            Kalender Kegiatan
                        </p>
                        <h2 className="text-4xl font-black tracking-tight text-white sm:text-5xl">
                            Agenda{' '}
                            <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                                Terdekat.
                            </span>
                        </h2>
                    </div>
                    <Link
                        href="/events"
                        className="group hidden text-sm font-bold text-blue-400 transition hover:text-white sm:flex sm:items-center"
                    >
                        Lihat semua{' '}
                        <ArrowRight className="ml-1.5 size-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>

                <div className="flex flex-col gap-2">
                    {AGENDA.map((event, index) => (
                        <motion.div
                            key={event.title}
                            initial={{ opacity: 0, x: -24 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: '-40px' }}
                            transition={{ delay: index * 0.1, duration: 0.55 }}
                            className={`group grid gap-5 rounded-2xl border border-transparent p-4 transition-all hover:border-white/10 hover:bg-white/[0.03] md:grid-cols-[auto_1fr_auto] md:items-center md:gap-8 md:p-6 ${
                                index !== 0 ? 'border-t-white/10 rounded-none hover:rounded-2xl' : ''
                            }`}
                        >
                            <div className="grid size-[76px] place-items-center rounded-2xl bg-blue-600/20 text-center shadow-inner transition-colors group-hover:bg-[#2563eb]">
                                <div>
                                    <div className="text-2xl font-black leading-none text-blue-400 group-hover:text-white transition-colors">
                                        {event.date}
                                    </div>
                                    <div className="mt-1 text-[10px] font-bold tracking-widest text-blue-200 group-hover:text-blue-100 transition-colors">
                                        {event.month}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-xl font-extrabold text-white transition-colors group-hover:text-blue-400">
                                    {event.title}
                                </h3>
                                <p className="mt-1.5 text-sm leading-relaxed text-blue-100/60">
                                    {event.desc}
                                </p>
                                <p className="mt-4 flex items-center gap-1.5 text-xs font-medium text-slate-400">
                                    <MapPin className="size-3.5 text-blue-400" /> {event.place}
                                </p>
                            </div>

                            <button
                                type="button"
                                className="mt-2 w-fit rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-xs font-bold text-blue-200 backdrop-blur-sm transition-all hover:scale-105 hover:border-blue-400 hover:bg-blue-600 hover:text-white hover:shadow-[0_0_15px_rgba(37,99,235,0.4)] md:mt-0"
                            >
                                Add to Calendar <CalendarDays className="ml-1.5 inline size-3.5" />
                            </button>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-10 flex justify-center sm:hidden">
                    <Link
                        href="/events"
                        className="flex w-full items-center justify-center rounded-full border border-blue-500/30 bg-blue-500/10 px-6 py-3 text-sm font-bold text-blue-400 transition hover:bg-blue-500 hover:text-white"
                    >
                        Lihat Semua Agenda <ArrowRight className="ml-2 size-4" />
                    </Link>
                </div>
            </div>
        </section>
    )
}
