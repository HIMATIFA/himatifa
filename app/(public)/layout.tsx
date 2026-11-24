'use client'

import '../feed.css'
import { usePathname } from 'next/navigation'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

export default function Layout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const isHomePage = pathname === '/'

    return (
        <div className="relative min-h-screen bg-slate-50/90 text-slate-900 selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden">
            {/* =========================================================================
                GLOBAL DECORATIONS (GRID KOTAK-KOTAK & GRADIENT ORBS)
               ========================================================================= */}
            {/* 1. Background Grid Garis Kotak-Kotak (Crisp & Visible) */}
            <div className="fixed inset-0 pointer-events-none -z-10 feed-grid-squares opacity-90 feed-grid-masked" />

            {/* 2. Gradient Ambient Glow Orbs (Biru, Sky, Indigo) */}
            <div className="fixed pointer-events-none -z-10 -top-32 -left-32 size-[520px] rounded-full bg-blue-500/15 blur-[120px]" />
            <div className="fixed pointer-events-none -z-10 top-1/3 -right-32 size-[600px] rounded-full bg-indigo-500/12 blur-[130px]" />
            <div className="fixed pointer-events-none -z-10 -bottom-32 left-1/4 size-[500px] rounded-full bg-sky-400/15 blur-[120px]" />

            {/* 3. Top Accent Line Bar */}
            <div className="fixed top-0 inset-x-0 h-[2.5px] bg-gradient-to-r from-blue-600 via-sky-400 to-indigo-600 z-50 pointer-events-none opacity-90" />

            {/* Konten Halaman */}
            <div className="relative z-10 flex flex-col min-h-screen">
                {isHomePage && <Navbar />}
                <div className="flex-1">
                    {children}
                </div>
                <Footer />
            </div>
        </div>
    )
}
