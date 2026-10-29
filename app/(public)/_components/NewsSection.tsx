'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { newsData } from '../../data'

export function NewsSection() {
    return (
        <section id="berita" className="relative mx-auto max-w-7xl scroll-mt-24 px-4 sm:px-6 py-20 lg:px-8 lg:py-28">
            <div className="mb-10 sm:mb-14 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-3">
                        <div className="h-[1px] w-6 sm:w-12 bg-blue-600/30" />
                        <span className="text-[10px] sm:text-xs font-bold tracking-[0.25em] uppercase text-blue-600">
                            Berita Terbaru
                        </span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900">
                        Kabar <span className="text-blue-600">Terbaru</span>
                    </h2>
                </div>

                <Link
                    href="/news"
                    className="group hidden sm:inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-blue-600 transition-colors hover:text-blue-700"
                >
                    <span>Lihat Semua Kabar</span>
                    <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {newsData.map((article, i) => (
                    <motion.article
                        key={article.id}
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-40px' }}
                        transition={{ delay: i * 0.08, duration: 0.4, ease: 'easeOut' }}
                        className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:border-blue-300 hover:shadow-md"
                    >
                        <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                            <img
                                src={article.image}
                                alt={article.title}
                                loading="lazy"
                                className="size-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                            />
                            <span className="absolute left-3 top-3 rounded-md bg-slate-900/80 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
                                {article.category}
                            </span>
                        </div>

                        <div className="flex flex-1 flex-col p-5 sm:p-6">
                            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
                                {article.date}
                            </span>

                            <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug transition-colors group-hover:text-blue-600 line-clamp-2">
                                {article.title}
                            </h3>

                            <p className="mt-2.5 flex-1 text-xs sm:text-sm leading-relaxed text-slate-600 font-normal line-clamp-3">
                                {article.summary}
                            </p>

                            <div className="mt-6 pt-4 border-t border-slate-100">
                                <a
                                    href={article.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-blue-600 transition-colors hover:text-blue-700"
                                >
                                    <span>Baca Selengkapnya</span>
                                    <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                </a>
                            </div>
                        </div>
                    </motion.article>
                ))}
            </div>

            <div className="mt-8 flex justify-center sm:hidden">
                <Link
                    href="/news"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-xs sm:text-sm font-semibold text-white transition-all hover:bg-blue-500 active:scale-[0.98]"
                >
                    <span>Lihat Semua Kabar</span>
                    <ArrowRight className="size-4" />
                </Link>
            </div>
        </section>
    )
}
