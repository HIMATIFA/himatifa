'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { CircleUserRound } from 'lucide-react'
import { people } from './data'

export function BphSection() {
    return (
        <section id="bph" className="bg-white/40 px-6 py-24 lg:px-10">
            <div className="mx-auto max-w-7xl">
                <div className="mb-16 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                    <div>
                        <p className="mb-3 text-xs font-bold uppercase tracking-[.2em] text-[#2563eb]">
                            Badan Pengurus Harian
                        </p>
                        <h2 className="text-4xl font-black tracking-tight text-[#0a192f] sm:text-5xl">
                            Pemimpin HIMATIFA<br />
                            <span className="bg-gradient-to-r from-[#2563eb] to-sky-400 bg-clip-text text-transparent">
                                2026.
                            </span>
                        </h2>
                    </div>
                    <p className="max-w-xs text-sm leading-6 text-slate-500">
                        Satu visi, empat peran, dan energi yang sama untuk membuat perubahan.
                    </p>
                </div>

                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {people.map((person, i) => (
                        <motion.div
                            key={person.name}
                            initial={{ opacity: 0, y: 32 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-60px' }}
                            transition={{ delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                            whileHover={{ y: -8 }}
                            className="group rounded-[2rem] border border-white/80 bg-white/60 p-3 text-center shadow-lg shadow-blue-900/5 backdrop-blur-xl"
                        >
                            <div className="relative -mt-1 overflow-hidden rounded-[1.5rem] bg-blue-100">
                                <Image
                                    src={person.image}
                                    alt={person.name}
                                    width={300}
                                    height={330}
                                    className="aspect-[.9] w-full object-cover grayscale transition duration-500 group-hover:scale-105 group-hover:grayscale-0"
                                />
                                <div className="absolute inset-x-3 bottom-3 flex translate-y-12 justify-center gap-2 transition-transform duration-300 group-hover:translate-y-0">
                                    <a
                                        aria-label={`Profil ${person.name}`}
                                        href="#footer"
                                        className="grid size-8 place-items-center rounded-full bg-white/90 text-[#2563eb] shadow transition hover:bg-[#2563eb] hover:text-white"
                                    >
                                        <CircleUserRound className="size-3.5" />
                                    </a>
                                </div>
                            </div>
                            <p className="mt-5 text-[10px] font-bold uppercase tracking-[.2em] text-[#2563eb]">
                                {person.role}
                            </p>
                            <h3 className="pb-3 pt-1 text-lg font-extrabold text-[#0a192f]">{person.name}</h3>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
