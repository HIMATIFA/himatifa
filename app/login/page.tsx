'use client'

import { useState, useActionState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import {
    ArrowLeft,
    Lock,
    Mail,
    Eye,
    EyeOff,
    LogIn,
    AlertCircle,
    ShieldCheck,
    CheckCircle2,
    KeyRound
} from 'lucide-react'
import { loginAction } from '../actions/auth'

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false)
    const [state, formAction, isPending] = useActionState(loginAction, null)

    return (
        <main className="relative min-h-screen w-full overflow-x-hidden bg-slate-50 selection:bg-blue-100">
            <div className="grid min-h-screen w-full lg:grid-cols-12">
                {/* Left Branding Panel (Desktop Only) */}
                <div className="relative hidden lg:flex lg:col-span-5 flex-col justify-between bg-slate-900 p-10 lg:p-12 text-white">
                    <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 via-slate-900 to-slate-950 pointer-events-none" />
                    <div className="absolute inset-0 feed-grid-hero opacity-25 pointer-events-none" />

                    <div className="relative z-10">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-300 transition-colors hover:text-white"
                        >
                            <ArrowLeft className="size-4 text-blue-400" />
                            <span>Kembali ke Beranda Utama</span>
                        </Link>
                    </div>

                    <div className="relative z-10 my-8">
                        <div className="mb-5 flex size-13 items-center justify-center rounded-2xl border border-slate-700/80 bg-slate-800/90 p-3 shadow-inner">
                            <Image
                                src="/himatifa1.png"
                                alt="Logo HIMATIFA"
                                width={40}
                                height={40}
                                className="h-auto w-full object-contain brightness-0 invert"
                            />
                        </div>

                        <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 px-3.5 py-1 text-xs font-bold text-blue-400 uppercase tracking-wider mb-4">
                            <ShieldCheck className="size-4" /> Portal Pengurus Internal
                        </div>

                        <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl leading-tight">
                            Sistem Informasi <br />
                            <span className="text-blue-500">HIMATIFA</span> UMSURA
                        </h2>

                        <p className="mt-3 text-xs sm:text-sm leading-relaxed text-slate-400 font-normal max-w-sm">
                            Platform terpadu dengan pembagian hak akses otomatis untuk <strong>Admin Utama</strong>, <strong>Sekum</strong>, <strong>Bendum</strong>, dan <strong>Admin Ekraf</strong>.
                        </p>

                        <div className="mt-6 flex flex-col gap-2.5 border-t border-slate-800/80 pt-5 text-xs text-slate-300">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="size-3.5 text-emerald-400 shrink-0" />
                                <span><strong>Sekum</strong>: LPJ, Persuratan, Presensi, Notulensi</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="size-3.5 text-emerald-400 shrink-0" />
                                <span><strong>Bendum</strong>: Manajemen Kas Organisasi</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="size-3.5 text-emerald-400 shrink-0" />
                                <span><strong>Admin Ekraf</strong>: Manajemen Toko & Order</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="size-3.5 text-emerald-400 shrink-0" />
                                <span><strong>Admin</strong>: Kontrol Penuh Seluruh Modul</span>
                            </div>
                        </div>
                    </div>

                    <div className="relative z-10 text-xs text-slate-500 font-medium">
                        &copy; 2026 HIMATIFA UMSURA &bull; Departemen Medkominfo
                    </div>
                </div>

                {/* Right Login Form Panel */}
                <div className="relative flex w-full flex-col justify-between bg-white p-6 sm:p-10 lg:col-span-7 lg:p-12 min-h-screen">
                    <div className="absolute inset-0 feed-grid-squares opacity-30 pointer-events-none" />

                    {/* Mobile Header Link */}
                    <div className="relative z-10 flex items-center justify-between lg:hidden mb-6">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 transition-colors hover:text-slate-900"
                        >
                            <ArrowLeft className="size-4 text-blue-600" />
                            <span>Beranda</span>
                        </Link>
                        <div className="flex items-center gap-2">
                            <Image
                                src="/himatifa1.png"
                                alt="Logo HIMATIFA"
                                width={26}
                                height={26}
                                className="h-auto w-6.5 object-contain"
                            />
                            <span className="text-xs font-bold text-slate-900">SIM HIMATIFA</span>
                        </div>
                    </div>

                    <div className="relative z-10 mx-auto w-full max-w-md my-auto py-4">
                        <div className="mb-8">
                            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-blue-600 uppercase tracking-wider mb-1.5">
                                <KeyRound className="size-3.5" /> Autentikasi Pengurus
                            </span>
                            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                                Masuk ke Portal Internal
                            </h1>
                            <p className="mt-1.5 text-xs sm:text-sm text-slate-500">
                                Gunakan akun resmi pengurus HIMATIFA. Sistem akan otomatis mengarahkan Anda ke dashboard sesuai divisi.
                            </p>
                        </div>

                        {/* Error Notification */}
                        <AnimatePresence>
                            {state?.error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -6 }}
                                    className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-700"
                                >
                                    <AlertCircle className="size-4 shrink-0 text-red-600 mt-0.5" />
                                    <span className="font-semibold">{state.error}</span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Credentials Form */}
                        <form action={formAction} className="flex flex-col gap-4">
                            <div>
                                <label htmlFor="email" className="mb-1.5 block text-xs font-semibold text-slate-700">
                                    Email Pengurus
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        required
                                        placeholder="nama@himatifa.org"
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 pl-10 pr-4 text-xs font-medium text-slate-900 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/10"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="password" className="mb-1.5 block text-xs font-semibold text-slate-700">
                                    Kata Sandi
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        id="password"
                                        name="password"
                                        required
                                        placeholder="••••••••••••"
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 pl-10 pr-10 text-xs font-medium text-slate-900 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-700 cursor-pointer"
                                    >
                                        {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                                    </button>
                                </div>
                            </div>

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={isPending}
                                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-xs font-semibold text-white shadow-md shadow-blue-600/15 transition-all hover:bg-blue-500 active:scale-[0.98] disabled:opacity-60 cursor-pointer"
                                >
                                    {isPending ? (
                                        <span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                                    ) : (
                                        <>
                                            <span>Masuk ke Sistem</span>
                                            <LogIn className="size-4" />
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="relative z-10 text-center text-[11px] text-slate-400 font-medium mt-6">
                        &copy; 2026 HIMATIFA UMSURA &bull; Sistem Informasi Manajemen Pengurus
                    </div>
                </div>
            </div>
        </main>
    )
}
