'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion'
import { Menu, X, ArrowUpRight, ChevronRight } from 'lucide-react'
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
            {/* Scroll Progress Bar */}
            <motion.div
                style={{ scaleX: progressScale }}
                className="fixed inset-x-0 top-0 z-[70] h-1 origin-left bg-gradient-to-r from-blue-600 via-sky-400 to-cyan-400"
                aria-hidden
            />

            {/* Header Header Container */}
            <header
                className={`fixed inset-x-0 z-50 flex justify-center transition-all duration-500 ease-out ${
                    isScrolled ? 'top-3 sm:top-4 px-4 sm:px-6' : 'top-0 px-0'
                }`}
            >
                <nav
                    className={`flex items-center justify-between transition-all duration-500 ease-out ${
                        isScrolled
                            ? 'w-full max-w-5xl rounded-full border border-slate-200/60 bg-white/90 px-4 sm:px-6 py-2.5 shadow-lg shadow-blue-950/5 backdrop-blur-xl'
                            : 'w-full border-b border-transparent bg-transparent px-6 py-4 sm:px-10'
                    }`}
                >
                    {/* Logo & Identity */}
                    <Link
                        href="/"
                        className="group flex items-center gap-3 transition-transform duration-300 hover:scale-[1.02]"
                    >
                        <Image
                            src="/himatifabg.png"
                            alt="Logo HIMATIFA UMSurabaya"
                            width={38}
                            height={38}
                            className="shrink-0 object-contain transition-transform duration-300 group-hover:rotate-3"
                        />
                        <div className="flex flex-col justify-center">
                            <span
                                className={`text-base font-extrabold leading-none tracking-tight transition-colors ${
                                    isScrolled ? 'text-slate-900' : 'text-white'
                                }`}
                            >
                                HIMATIFA
                            </span>
                            <span
                                className={`mt-0.5 text-[10px] font-medium leading-none tracking-wide transition-colors ${
                                    isScrolled ? 'text-slate-500' : 'text-slate-300'
                                }`}
                            >
                                Himpunan Mahasiswa Informatika
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Navigation Links */}
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

                    {/* CTA Button Desktop */}
                    <Link
                        href="/ekrafstore"
                        className="hidden items-center rounded-full bg-blue-600 px-5 py-2 text-xs font-bold text-white shadow-md shadow-blue-600/20 transition-all hover:-translate-y-0.5 hover:bg-blue-500 hover:shadow-lg lg:flex"
                    >
                        Ekraf Store <ArrowUpRight className="ml-1 size-3.5" />
                    </Link>

                    {/* Mobile Hamburger Button */}
                    <button
                        aria-label={mobileOpen ? 'Tutup menu' : 'Buka menu'}
                        onClick={() => setMobileOpen(true)}
                        className={`rounded-full p-2 lg:hidden transition-colors ${
                            isScrolled ? 'text-slate-700 hover:bg-slate-100' : 'text-white hover:bg-white/10'
                        }`}
                    >
                        <Menu className="size-6" />
                    </button>
                </nav>
            </header>

            {/* Mobile Slide-Over Drawer */}
            <AnimatePresence>
                {mobileOpen && (
                    <>
                        {/* Backdrop Overlay */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            onClick={() => setMobileOpen(false)}
                            className="fixed inset-0 z-[80] bg-slate-950/60 backdrop-blur-sm lg:hidden"
                        />

                        {/* Side Drawer Panel */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 right-0 z-[90] flex w-full max-w-xs flex-col justify-between bg-slate-900 border-l border-slate-800 p-6 shadow-2xl lg:hidden"
                        >
                            {/* Drawer Header */}
                            <div>
                                <div className="flex items-center justify-between pb-6 border-b border-slate-800">
                                    <div className="flex items-center gap-2.5">
                                        <Image
                                            src="/himatifabg.png"
                                            alt="Logo HIMATIFA"
                                            width={32}
                                            height={32}
                                            className="object-contain"
                                        />
                                        <div className="flex flex-col">
                                            <span className="text-sm font-extrabold text-white leading-none">HIMATIFA</span>
                                            <span className="text-[9px] font-medium text-slate-400 mt-0.5">UM Surabaya</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setMobileOpen(false)}
                                        className="rounded-full p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                                        aria-label="Tutup menu"
                                    >
                                        <X className="size-5" />
                                    </button>
                                </div>

                                {/* Drawer Links */}
                                <div className="mt-6 flex flex-col gap-1.5">
                                    {navLinks.map((item, i) => (
                                        <motion.div
                                            key={item.name}
                                            initial={{ opacity: 0, x: 16 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.05 * i }}
                                        >
                                            <Link
                                                onClick={() => setMobileOpen(false)}
                                                href={item.path}
                                                className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-800 hover:text-white active:bg-blue-600/10"
                                            >
                                                {item.name}
                                                <ChevronRight className="size-4 text-slate-500" />
                                            </Link>
                                        </motion.div>
                                    ))}
                                    <motion.div
                                        initial={{ opacity: 0, x: 16 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.05 * navLinks.length }}
                                    >
                                        <a
                                            onClick={() => setMobileOpen(false)}
                                            href="#departemen"
                                            className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-800 hover:text-white active:bg-blue-600/10"
                                        >
                                            Departemen
                                            <ChevronRight className="size-4 text-slate-500" />
                                        </a>
                                    </motion.div>
                                </div>
                            </div>

                            {/* Drawer Footer CTA */}
                            <div className="pt-6 border-t border-slate-800">
                                <Link
                                    onClick={() => setMobileOpen(false)}
                                    href="/ekrafstore"
                                    className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/25 transition-all hover:bg-blue-500 active:scale-[0.98]"
                                >
                                    Ekraf Store <ArrowUpRight className="size-4" />
                                </Link>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    )
}