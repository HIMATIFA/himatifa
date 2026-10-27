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
        <section id="faq" className="relative mx-auto max-w-7xl scroll-mt-24 px-4 sm:px-6 py-20 lg:px-8 lg:py-28">
            <div className="mb-10 sm:mb-14 max-w-3xl">
                <div className="flex items-center gap-3 mb-3">
                    <div className="h-[1px] w-6 sm:w-12 bg-blue-600/30" />
                    <span className="text-[10px] sm:text-xs font-bold tracking-[0.25em] uppercase text-blue-600">
                        Pertanyaan Umum
                    </span>
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
                    Sering <span className="text-blue-600">Ditanyakan</span>
                </h2>
                <p className="mt-3 text-sm sm:text-base leading-relaxed text-slate-600 font-normal">
                    Punya pertanyaan seputar HIMATIFA UMSURA, kegiatan kampus, atau ingin menyampaikan keluhan? Temukan jawabannya di bawah ini.
                </p>
            </div>

            <div className="mx-auto max-w-3xl space-y-3.5">
                {faqData.map((item, index) => {
                    const isOpen = openIndex === index

                    return (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-40px' }}
                            transition={{ delay: index * 0.08, duration: 0.4, ease: 'easeOut' }}
                            className={`overflow-hidden rounded-2xl border transition-all duration-200 ${
                                isOpen
                                    ? 'border-blue-300 bg-white shadow-md'
                                    : 'border-slate-200 bg-white shadow-sm hover:border-slate-300'
                            }`}
                        >
                            <button
                                onClick={() => toggleFAQ(index)}
                                className="flex w-full items-center justify-between gap-4 p-5 sm:p-6 text-left transition-colors"
                                aria-expanded={isOpen}
                            >
                                <div className="flex items-center gap-3.5">
                                    <div
                                        className={`flex size-9 shrink-0 items-center justify-center rounded-xl transition-colors ${
                                            isOpen ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-600'
                                        }`}
                                    >
                                        <HelpCircle className="size-5" />
                                    </div>
                                    <span className="text-base sm:text-lg font-bold text-slate-900">
                                        {item.question}
                                    </span>
                                </div>
                                <div
                                    className={`flex size-8 shrink-0 items-center justify-center rounded-full border transition-all duration-200 ${
                                        isOpen
                                            ? 'rotate-180 border-blue-300 bg-blue-50 text-blue-600'
                                            : 'border-slate-200 text-slate-400'
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
                                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                                    >
                                        <div className="border-t border-slate-100 px-5 sm:px-6 pb-6 pt-4 text-xs sm:text-sm leading-relaxed text-slate-600 font-normal">
                                            {item.answer}

                                            {item.hasLink && (
                                                <div className="mt-4 pt-2">
                                                    <Link
                                                        href="/aspirasi"
                                                        className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-semibold text-blue-600 transition-all hover:bg-blue-600 hover:text-white"
                                                    >
                                                        <MessageSquareWarning className="size-4" />
                                                        <span>Buka Layanan Suara Mahasiswa</span>
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
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="mx-auto mt-12 max-w-3xl rounded-2xl border border-slate-800 bg-slate-900 p-6 sm:p-8 text-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-6"
            >
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
                        <MessageSquareWarning className="size-5" />
                    </div>
                    <div>
                        <h4 className="text-base font-bold text-white">Punya keluhan atau masukan fasilitas?</h4>
                        <p className="mt-1 text-xs sm:text-sm text-slate-300 font-normal">
                            Suara kamu sangat berharga untuk perbaikan fasilitas & layanan akademik.
                        </p>
                    </div>
                </div>
                <Link
                    href="/aspirasi"
                    className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-xs sm:text-sm font-semibold text-white transition-all hover:bg-blue-500 active:scale-[0.98]"
                >
                    <span>Sampaikan Aspirasi</span>
                    <ArrowRight className="size-4" />
                </Link>
            </motion.div>
        </section>
    )
}