'use client'

import { useState } from 'react'
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
    CheckCircle2
} from 'lucide-react'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [rememberMe, setRememberMe] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setErrorMsg('')

        setTimeout(() => {
            setIsLoading(false)
            if (email !== 'admin@himatifa.org') {
                setErrorMsg('Email atau kata sandi tidak terdaftar di sistem SIM.')
            }
        }, 1200)
    }

    return (
        <main className="relative min-h-screen w-full overflow-x-hidden bg-white selection:bg-blue-100">
            <div className="grid min-h-screen w-full lg:grid-cols-12">
                <div className="relative hidden lg:flex lg:col-span-5 flex-col justify-between bg-slate-900 p-10 lg:p-14 text-white">
                    <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 via-slate-900 to-slate-950 pointer-events-none" />

                    <div className="relative z-10">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-300 transition-colors hover:text-white"
                        >
                            <ArrowLeft className="size-4 text-blue-400" />
                            <span>Kembali ke Beranda</span>
                        </Link>
                    </div>

                    <div className="relative z-10 my-10 lg:my-0">
                        <div className="mb-6 flex size-14 items-center justify-center rounded-2xl border border-slate-700/80 bg-slate-800/90 p-3 shadow-inner">
                            <Image
                                src="/himatifa1.png"
                                alt="Logo HIMATIFA"
                                width={44}
                                height={44}
                                className="h-auto w-full object-contain brightness-0 invert"
                            />
                        </div>

                        <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 px-3.5 py-1 text-xs font-bold text-blue-400 uppercase tracking-wider mb-4">
                            <ShieldCheck className="size-4" /> Portal Internal Pengurus
                        </div>

                        <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl leading-tight">
                            Sistem Informasi <br className="hidden lg:block" />
                            <span className="text-blue-500">HIMATIFA</span>
                        </h2>

                        <p className="mt-4 text-xs sm:text-sm leading-relaxed text-slate-400 font-normal max-w-md">
                            Pusat kendali administrasi, pengelolaan inventaris, serta layanan data terpadu mahasiswa Informatika UMSURA.
                        </p>

                        <div className="mt-8 flex flex-col gap-3.5 border-t border-slate-800/80 pt-6 text-xs sm:text-sm text-slate-300">
                            <div className="flex items-center gap-2.5">
                                <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
                                <span>Akses terenkripsi & aman</span>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
                                <span>Manajemen inventaris & data pengurus</span>
                            </div>
                        </div>
                    </div>

                    <div className="relative z-10 text-xs text-slate-500 font-medium">
                        &copy; 2026 HIMATIFA UMSURA
                    </div>
                </div>

                <div className="relative flex w-full flex-col justify-between lg:justify-center bg-white p-6 sm:p-12 lg:col-span-7 lg:p-16 min-h-screen lg:min-h-0">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-40 pointer-events-none" />

                    <div className="relative z-10 flex items-center justify-between lg:hidden mb-8">
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
                                width={28}
                                height={28}
                                className="h-auto w-7 object-contain"
                            />
                            <span className="text-xs font-bold text-slate-900">SIM HIMATIFA</span>
                        </div>
                    </div>

                    <div className="relative z-10 mx-auto w-full max-w-md my-auto">
                        <div className="mb-8">
                            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                                Selamat Datang
                            </h1>
                            <p className="mt-2 text-xs sm:text-sm text-slate-500">
                                Masukkan akun kredensial Anda untuk mengakses SIM.
                            </p>
                        </div>

                        <AnimatePresence>
                            {errorMsg && (
                                <motion.div
                                    initial={{ opacity: 0, y: -6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -6 }}
                                    className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-xs sm:text-sm text-red-700"
                                >
                                    <AlertCircle className="size-4 shrink-0 text-red-600 mt-0.5" />
                                    <span className="font-semibold">{errorMsg}</span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <form onSubmit={handleLogin} className="flex flex-col gap-5">
                            <div>
                                <label htmlFor="email" className="mb-2 block text-xs sm:text-sm font-semibold text-slate-700">
                                    Email Akses
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 size-4.5 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="email"
                                        id="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="pengurus@himatifa.org"
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-3 pl-11 pr-4 text-xs sm:text-sm font-medium text-slate-900 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/10"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="password" className="mb-2 block text-xs sm:text-sm font-semibold text-slate-700">
                                    Kata Sandi
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 size-4.5 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        id="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••••••"
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-3 pl-11 pr-11 text-xs sm:text-sm font-medium text-slate-900 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-700"
                                    >
                                        {showPassword ? <EyeOff className="size-4.5" /> : <Eye className="size-4.5" />}
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center justify-between text-xs sm:text-sm pt-1">
                                <label className="flex cursor-pointer items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                        className="size-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="font-medium text-slate-600">Ingat Saya</span>
                                </label>

                                <button
                                    type="button"
                                    className="font-semibold text-blue-600 transition-colors hover:text-blue-700 hover:underline"
                                >
                                    Lupa Kata Sandi?
                                </button>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 text-xs sm:text-sm font-semibold text-white shadow-md shadow-blue-600/20 transition-all hover:bg-blue-500 active:scale-[0.98] disabled:opacity-60"
                            >
                                {isLoading ? (
                                    <span className="size-4.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                                ) : (
                                    <>
                                        <span>Masuk ke Sistem</span>
                                        <LogIn className="size-4.5" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    <div className="relative z-10 text-center text-[11px] text-slate-400 font-medium lg:hidden mt-8">
                        &copy; 2026 HIMATIFA UMSURA
                    </div>
                </div>

            </div>
        </main>
    )
}