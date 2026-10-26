'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion'
import { Menu, X, ArrowUpRight } from 'lucide-react'
import { navLinks } from './data'

export function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)

    const { scrollYProgress } = useScroll()
    const progressScale = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.4 })

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20)
        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    useEffect(() => {
        document.body.style.overflow = mobileOpen ? 'hidden' : ''
        return () => {
            document.body.style.overflow = ''
        }
    }, [mobileOpen])

    return (
        <>
            <motion.div
                style={{ scaleX: progressScale }}
                className="fixed inset-x-0 top-0 z-[60] h-1 origin-left bg-gradient-to-r from-[#2563eb] via-sky-400 to-cyan-400"
                aria-hidden
            />

            <header
                className={`fixed inset-x-0 z-50 flex justify-center transition-all duration-500 ease-out ${
                    isScrolled ? 'top-4 px-4 sm:px-6' : 'top-0 px-0'
                }`}
            >
                <nav
                    className={`flex items-center justify-between transition-all duration-500 ease-out ${
                        isScrolled
                            ? 'w-full max-w-5xl rounded-full border border-slate-200/60 bg-white/90 px-5 py-2 shadow-lg shadow-blue-900/5 backdrop-blur-xl'
                            : 'w-full border-b border-transparent bg-transparent px-6 py-4 sm:px-10'
                    }`}
                >
                    <Link
                        href="/"
                        className={`flex items-center gap-2 font-black tracking-tight transition-transform hover:scale-105 ${
                            isScrolled ? 'text-[#0a192f]' : 'text-white'
                        }`}
                    >
                        <Image
                            src="/himatifabg.png"
                            alt="Logo HIMATIFA UMSurabaya"
                            width={40}
                            height={40}
                            className="object-contain transition-all duration-500"
                        />
                        <span>HIMATIFA</span>
                    </Link>

                    <div className="hidden items-center gap-7 text-[13px] font-semibold lg:flex">
                        {navLinks.map((item) => (
                            <Link
                                key={item.name}
                                href={item.path}
                                className={`relative transition-colors after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:rounded-full after:bg-blue-500 after:transition-all after:duration-300 hover:after:w-full ${
                                    isScrolled ? 'text-slate-600 hover:text-blue-600' : 'text-slate-300 hover:text-white'
                                }`}
                            >
                                {item.name}
                            </Link>
                        ))}
                        <a
                            href="#departemen"
                            className={`relative transition-colors after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:rounded-full after:bg-blue-500 after:transition-all after:duration-300 hover:after:w-full ${
                                isScrolled ? 'text-slate-600 hover:text-blue-600' : 'text-slate-300 hover:text-white'
                            }`}
                        >
                            Departemen
                        </a>
                    </div>

                    <Link
                        href="/ekrafstore"
                        className="hidden items-center rounded-full bg-blue-600 px-5 py-2 text-xs font-bold text-white shadow-md shadow-blue-600/20 transition-all hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-lg lg:flex"
                    >
                        Ekraf Store <ArrowUpRight className="ml-1 size-3.5" />
                    </Link>

                    <button
                        aria-label={mobileOpen ? 'Tutup menu' : 'Buka menu'}
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className={`rounded-full p-2 lg:hidden transition-colors ${
                            isScrolled ? 'text-slate-700 hover:bg-slate-100' : 'text-white hover:bg-white/20'
                        }`}
                    >
                        {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
                    </button>
                </nav>
            </header>

            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -16, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -16, scale: 0.98 }}
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                        className="fixed inset-x-4 top-20 z-40 flex flex-col gap-1 rounded-2xl border border-slate-200/60 bg-white/95 p-5 shadow-xl backdrop-blur-xl lg:hidden"
                    >
                        {navLinks.map((item, i) => (
                            <motion.div
                                key={item.name}
                                initial={{ opacity: 0, x: -12 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.05 * i }}
                            >
                                <Link
                                    onClick={() => setMobileOpen(false)}
                                    href={item.path}
                                    className="block rounded-xl px-3 py-2.5 font-semibold text-slate-700 transition-colors hover:bg-blue-50 hover:text-[#2563eb]"
                                >
                                    {item.name}
                                </Link>
                            </motion.div>
                        ))}
                        <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.28 }}>
                            <a
                                onClick={() => setMobileOpen(false)}
                                href="#departemen"
                                className="block rounded-xl px-3 py-2.5 font-semibold text-slate-700 transition-colors hover:bg-blue-50 hover:text-[#2563eb]"
                            >
                                Departemen
                            </a>
                        </motion.div>

                        <hr className="my-2 border-slate-200" />
                        <Link
                            onClick={() => setMobileOpen(false)}
                            href="/ekrafstore"
                            className="flex items-center justify-center gap-2 rounded-xl bg-[#2563eb] py-3 text-sm font-bold text-white shadow-md shadow-blue-600/20 transition-transform active:scale-95"
                        >
                            Ekraf Store <ArrowUpRight className="size-4" />
                        </Link>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
