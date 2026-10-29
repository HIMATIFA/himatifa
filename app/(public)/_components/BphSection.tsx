'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ZoomIn } from 'lucide-react'
import { people } from '../../data'

export function BphSection() {
    const [selectedPerson, setSelectedPerson] = useState<typeof people[number] | null>(null)

    return (
        <section id="bph" className="relative mx-auto max-w-7xl scroll-mt-24 px-4 sm:px-6 py-20 lg:px-8 lg:py-28">
            <div className="mb-10 sm:mb-14 max-w-3xl">
                <div className="flex items-center gap-3 mb-3">
                    <div className="h-[1px] w-6 sm:w-12 bg-blue-600/30" />
                    <span className="text-[10px] sm:text-xs font-bold tracking-[0.25em] uppercase text-blue-600">
                        Badan Pengurus Harian
                    </span>
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
                    Nakhoda Kepengurusan <span className="text-blue-600">HIMATIFA</span>
                </h2>
                <p className="mt-3 text-sm sm:text-base leading-relaxed text-slate-600 font-normal">
                    Satu visi, empat peran strategis, dan komitmen bersama untuk menggerakkan organisasi secara berkelanjutan.
                </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {people.map((person, i) => (
                    <motion.div
                        key={person.name}
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-40px' }}
                        transition={{ delay: i * 0.08, duration: 0.4, ease: 'easeOut' }}
                        onClick={() => setSelectedPerson(person)}
                        className="group cursor-pointer flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm transition-all duration-200 hover:border-blue-300 hover:shadow-md"
                    >
                        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-slate-100">
                            <Image
                                src={person.image}
                                alt={person.name}
                                fill
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                className="object-cover object-top transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-slate-900/30 opacity-0 transition-opacity duration-200 group-hover:opacity-100 flex items-center justify-center">
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-slate-900 shadow-md backdrop-blur-sm">
                                    <ZoomIn className="size-3.5 text-blue-600" />
                                    <span>Lihat Detail</span>
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-col items-center text-center pt-4 pb-2 px-1">
                            <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-600">
                                {person.role}
                            </span>
                            <h3 className="mt-1 text-sm sm:text-base font-bold text-slate-900 leading-snug">
                                {person.name}
                            </h3>
                        </div>
                    </motion.div>
                ))}
            </div>

            <AnimatePresence>
                {selectedPerson && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedPerson(null)}
                            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm"
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            transition={{ duration: 0.2, ease: 'easeOut' }}
                            className="relative z-10 w-full max-w-sm sm:max-w-md overflow-hidden rounded-2xl bg-white p-4 sm:p-5 shadow-2xl"
                        >
                            <button
                                onClick={() => setSelectedPerson(null)}
                                className="absolute right-4 top-4 z-20 flex size-8 items-center justify-center rounded-full bg-slate-900/60 text-white backdrop-blur-md transition-colors hover:bg-slate-900"
                                aria-label="Tutup detail foto"
                            >
                                <X className="size-4" />
                            </button>

                            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-slate-100">
                                <Image
                                    src={selectedPerson.image}
                                    alt={selectedPerson.name}
                                    fill
                                    sizes="(max-width: 640px) 90vw, 400px"
                                    className="object-cover object-top"
                                    priority
                                />
                            </div>

                            <div className="pt-4 text-center">
                                <span className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                                    {selectedPerson.role}
                                </span>
                                <h3 className="mt-1 text-lg sm:text-xl font-bold text-slate-900">
                                    {selectedPerson.name}
                                </h3>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </section>
    )
}