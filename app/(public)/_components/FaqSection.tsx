'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { HelpCircle, ChevronDown, MessageSquareWarning, ArrowRight } from 'lucide-react'
import { faqData } from './data'

export function FaqSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(3)

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index)
    }

    return (
        <section id="faq" className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
            <div className="mb-14 text-center">
                <p className="mb-3 text-xs font-bold uppercase tracking-[.2em] text-[#2563eb]">
                    Pertanyaan Umum
                </p>
                <h2 className="text-4xl font-black tracking-tight text-[#0a192f] sm:text-5xl">
                    Sering{' '}
                    <span className="bg-gradient-to-r from-[#2563eb] to-sky-400 bg-clip-text text-transparent">
                        Ditanyakan.
                    </span>
                </h2>
                <p className="mx-auto mt-4 max-w-xl text-sm font-medium leading-relaxed text-slate-500">
                    Punya pertanyaan seputar HIMATIFA, kegiatan kampus, atau ingin menyampaikan keluhan? Temukan jawabannya di bawah ini.
                </p>
            </div>

            <div className="mx-auto max-w-3xl space-y-4">
                {faqData.map((item, index) => {
                    const isOpen = openIndex === index

                    return (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-40px' }}
                            transition={{ delay: index * 0.08, duration: 0.5 }}
                            className={`overflow-hidden rounded-[1.5rem] border transition-all duration-300 ${
                                isOpen
                                    ? 'border-blue-200 bg-white/90 shadow-xl shadow-blue-900/5 backdrop-blur-xl'
                                    : 'border-white/80 bg-white/60 shadow-md shadow-blue-900/5 backdrop-blur-xl hover:bg-white/80'
                            }`}
                        >
                            <button
                                onClick={() => toggleFAQ(index)}
                                className="flex w-full items-center justify-between gap-4 p-6 text-left transition-colors"
                                aria-expanded={isOpen}
                            >
                                <div className="flex items-center gap-3.5">
                                    <div
                                        className={`flex size-9 shrink-0 items-center justify-center rounded-xl transition-colors ${
                                            isOpen ? 'bg-blue-100 text-[#2563eb]' : 'bg-slate-100 text-slate-500'
                                        }`}
                                    >
                                        <HelpCircle className="size-5" />
                                    </div>
                                    <span className="text-base font-bold text-[#0a192f] sm:text-lg">
                                        {item.question}
                                    </span>
                                </div>
                                <div
                                    className={`flex size-8 shrink-0 items-center justify-center rounded-full border border-slate-200/60 bg-white transition-transform duration-300 ${
                                        isOpen ? 'rotate-180 bg-blue-50 border-blue-200 text-[#2563eb]' : 'text-slate-400'
                                    }`}
                                >
                                    <ChevronDown className="size-4" />
                                </div>
                            </button>

                            <AnimatePresence initial={false}>
                                {isOpen && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                                    >
                                        <div className="border-t border-slate-100 px-6 pb-6 pt-4 text-sm leading-relaxed text-slate-600 sm:px-7 sm:text-[15px]">
                                            {item.answer}

                                            {item.hasLink && (
                                                <div className="mt-4">
                                                    <Link
                                                        href="/aspirasi"
                                                        className="inline-flex items-center gap-2 rounded-xl bg-blue-50 px-4 py-2.5 text-xs font-bold text-[#2563eb] transition hover:bg-blue-100 hover:text-blue-700"
                                                    >
                                                        <MessageSquareWarning className="size-4" />
                                                        Buka Layanan Suara Mahasiswa
                                                        <ArrowRight className="size-3.5" />
                                                    </Link>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    )
                })}
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mx-auto mt-12 max-w-3xl rounded-[2rem] border border-blue-100 bg-gradient-to-r from-blue-50/80 via-indigo-50/50 to-sky-50/80 p-6 shadow-sm backdrop-blur-md sm:flex sm:items-center sm:justify-between sm:p-8"
            >
                <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
                    <div className="flex size-12 items-center justify-center rounded-2xl bg-[#2563eb] text-white shadow-md shadow-blue-500/20">
                        <MessageSquareWarning className="size-6" />
                    </div>
                    <div>
                        <h4 className="text-base font-bold text-[#0a192f]">Punya keluhan atau masukan fasilitas?</h4>
                        <p className="mt-0.5 text-xs font-medium text-slate-500">
                            Suara kamu membantu perbaikan fasilitas & layanan akademik.
                        </p>
                    </div>
                </div>
                <Link
                    href="/aspirasi"
                    className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#2563eb] px-5 py-3 text-xs font-bold text-white shadow-md transition-all hover:bg-blue-700 hover:shadow-lg sm:mt-0 sm:w-auto shrink-0"
                >
                    Sampaikan Aspirasi <ArrowRight className="size-4" />
                </Link>
            </motion.div>
        </section>
    )
}
