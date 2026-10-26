'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { newsData } from './data'

export function NewsSection() {
    return (
        <section id="berita" className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
            <div className="mb-14 flex items-end justify-between">
                <div>
                    <p className="mb-3 text-xs font-bold uppercase tracking-[.2em] text-[#2563eb]">
                        Cerita Terbaru
                    </p>
                    <h2 className="text-4xl font-black tracking-tight text-[#0a192f] sm:text-5xl">
                        Kabar{' '}
                        <span className="bg-gradient-to-r from-[#2563eb] to-sky-400 bg-clip-text text-transparent">
                            Terbaru.
                        </span>
                    </h2>
                </div>
                <Link
                    href="/news"
                    className="group hidden text-sm font-bold text-[#2563eb] transition-colors hover:text-blue-700 sm:flex sm:items-center"
                >
                    Semua kabar{' '}
                    <ArrowRight className="ml-1.5 size-4 transition-transform group-hover:translate-x-1" />
                </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {newsData.map((article, i) => (
                    <motion.article
                        key={article.id}
                        initial={{ opacity: 0, y: 32 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-60px' }}
                        transition={{ delay: i * 0.12, duration: 0.6 }}
                        className="group flex flex-col overflow-hidden rounded-[1.7rem] border border-white/80 bg-white/60 shadow-lg shadow-blue-900/5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-blue-900/10"
                    >
                        <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100 sm:aspect-video">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={article.image}
                                alt={article.title}
                                loading="lazy"
                                className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                            />
                            <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-[.15em] text-[#2563eb] shadow backdrop-blur">
                                {article.category}
                            </span>
                        </div>
                        <div className="flex flex-1 flex-col p-6 sm:p-7">
                            <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-4">
                                <span className="text-[10px] font-bold uppercase tracking-[.18em] text-[#2563eb]">
                                    {article.category}
                                </span>
                                <span className="text-xs font-medium text-slate-400">
                                    {article.date}
                                </span>
                            </div>
                            <h3 className="text-xl font-extrabold leading-tight text-[#0a192f] transition-colors group-hover:text-[#2563eb] line-clamp-2">
                                {article.title}
                            </h3>
                            <p className="mt-3 flex-1 text-[15px] leading-relaxed text-slate-600 line-clamp-3">
                                {article.summary}
                            </p>
                            <a
                                href={article.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-6 inline-flex w-fit items-center text-sm font-bold text-[#2563eb] transition-all hover:gap-2 group-hover:text-blue-700"
                            >
                                Baca selengkapnya <ArrowUpRight className="ml-1.5 size-4" />
                            </a>
                        </div>
                    </motion.article>
                ))}
            </div>

            <div className="mt-10 flex justify-center sm:hidden">
                <Link
                    href="/news"
                    className="flex w-full items-center justify-center rounded-full bg-[#2563eb] px-6 py-3.5 text-sm font-bold text-white shadow-md transition hover:bg-blue-700"
                >
                    Lihat Semua Kabar <ArrowRight className="ml-2 size-4" />
                </Link>
            </div>
        </section>
    )
}
