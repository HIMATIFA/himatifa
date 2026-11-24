'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
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
    Crown,
    FileText,
    Wallet,
    Store,
    Sparkles,
    Check,
    ChevronRight,
    UserCheck
} from 'lucide-react'
import { type UserRole } from '../../components/layout/Sidebar'

interface RolePreset {
    role: UserRole
    title: string
    subtitle: string
    email: string
    icon: React.ElementType
    color: string
    bgLight: string
    borderActive: string
    badge: string
    privileges: string[]
    targetPath: string
}

const rolePresets: RolePreset[] = [
    {
        role: 'admin',
        title: 'Super Administrator',
        subtitle: 'Akses penuh ke semua modul sistem',
        email: 'admin@himatifa.org',
        icon: Crown,
        color: 'text-blue-600',
        bgLight: 'bg-blue-50/70',
        borderActive: 'border-blue-600 ring-2 ring-blue-600/20 bg-blue-50/40',
        badge: 'Full Access',
        privileges: ['Dashboard Overview', 'Site Analytics', 'Artikel & Berita', 'Agenda & BPH', 'Akses Semua Modul Divisi'],
        targetPath: '/admin'
    },
    {
        role: 'sekum',
        title: 'Sekretaris Umum (Sekum)',
        subtitle: 'Fokus administrasi, LPJ, & persuratan',
        email: 'sekum@himatifa.org',
        icon: FileText,
        color: 'text-indigo-600',
        bgLight: 'bg-indigo-50/70',
        borderActive: 'border-indigo-600 ring-2 ring-indigo-600/20 bg-indigo-50/40',
        badge: 'Sekretariat',
        privileges: ['LPJ & Anggaran Kegiatan', 'Persuratan & SK', 'Presensi Pengurus', 'Notulensi Rapat'],
        targetPath: '/sekum/surat'
    },
    {
        role: 'bendum',
        title: 'Bendahara Umum (Bendum)',
        subtitle: 'Khusus pencatatan & keuangan kas',
        email: 'bendum@himatifa.org',
        icon: Wallet,
        color: 'text-emerald-600',
        bgLight: 'bg-emerald-50/70',
        borderActive: 'border-emerald-600 ring-2 ring-emerald-600/20 bg-emerald-50/40',
        badge: 'Keuangan',
        privileges: ['Kas Organisasi (Uang Masuk/Keluar)', 'Pencatatan Saldo Riil'],
        targetPath: '/bendum/kas'
    },
    {
        role: 'adminekraf',
        title: 'Admin Ekonomi Kreatif',
        subtitle: 'Khusus penjualan & stok toko ekraf',
        email: 'ekraf@himatifa.org',
        icon: Store,
        color: 'text-amber-600',
        bgLight: 'bg-amber-50/70',
        borderActive: 'border-amber-600 ring-2 ring-amber-600/20 bg-amber-50/40',
        badge: 'Manajemen Ekraf',
        privileges: ['Katalog Produk Merchandise', 'Kelola Pesanan Masuk', 'Update Stok Ekraf'],
        targetPath: '/adminekraf'
    }
]

export default function LoginPage() {
    const router = useRouter()
    const [selectedRole, setSelectedRole] = useState<RolePreset>(rolePresets[0])
    const [email, setEmail] = useState(rolePresets[0].email)
    const [password, setPassword] = useState('password123')
    const [rememberMe, setRememberMe] = useState(true)
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')
    const [successMsg, setSuccessMsg] = useState('')

    // Pilih simulasi peran dari preset
    const handleSelectPreset = (preset: RolePreset) => {
        setSelectedRole(preset)
        setEmail(preset.email)
        setPassword('password123')
        setErrorMsg('')
    }

    const executeLogin = (rolePreset: RolePreset) => {
        setIsLoading(true)
        setErrorMsg('')
        setSuccessMsg(`Berhasil login sebagai ${rolePreset.title}...`)

        setTimeout(() => {
            if (typeof window !== 'undefined') {
                localStorage.setItem('himatifa_user_role', rolePreset.role)
                localStorage.setItem('himatifa_user_email', rolePreset.email)
                localStorage.setItem('himatifa_user_name', rolePreset.title)
                document.cookie = `himatifa_role=${rolePreset.role}; path=/; max-age=86400`
            }
            router.push(rolePreset.targetPath)
        }, 750)
    }

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        // Cari preset berdasarkan email yang diketik
        const matched = rolePresets.find(
            (p) => p.email.toLowerCase() === email.trim().toLowerCase()
        )

        if (matched) {
            executeLogin(matched)
        } else {
            // Jika email custom, gunakan selected role saat ini
            executeLogin(selectedRole)
        }
    }

    const IconComponent = selectedRole.icon

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
                            <ShieldCheck className="size-4" /> Multi-Role Simulation Portal
                        </div>

                        <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl leading-tight">
                            Sistem Informasi <br />
                            <span className="text-blue-500">HIMATIFA</span> UMSURA
                        </h2>

                        <p className="mt-3 text-xs sm:text-sm leading-relaxed text-slate-400 font-normal max-w-sm">
                            Platform terpadu dengan pembagian hak akses terisolasi untuk <strong>Admin Utama</strong>, <strong>Sekum</strong>, <strong>Bendum</strong>, dan <strong>Admin Ekraf</strong>.
                        </p>

                        <div className="mt-6 flex flex-col gap-2.5 border-t border-slate-800/80 pt-5 text-xs text-slate-300">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="size-3.5 text-emerald-400 shrink-0" />
                                <span><strong>Sekum</strong>: LPJ, Persuratan, Presensi, Notulensi</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="size-3.5 text-emerald-400 shrink-0" />
                                <span><strong>Bendum</strong>: Manajemen Kas Organisasi Saja</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="size-3.5 text-emerald-400 shrink-0" />
                                <span><strong>Admin Ekraf</strong>: Manajemen Toko & Order Saja</span>
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

                {/* Right Form & Simulation Panel */}
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

                    <div className="relative z-10 mx-auto w-full max-w-xl my-auto py-4">
                        <div className="mb-6">
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 uppercase tracking-wider mb-1.5">
                                <Sparkles className="size-3.5" /> Simulasi Hak Akses
                            </span>
                            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                                Masuk ke Portal Internal
                            </h1>
                            <p className="mt-1 text-xs sm:text-sm text-slate-500">
                                Pilih peran pengurus di bawah ini untuk mensimulasikan batasan akses dashboard yang sesuai.
                            </p>
                        </div>

                        {/* Interactive Role Selector Cards */}
                        <div className="mb-6">
                            <label className="mb-2 block text-xs font-bold text-slate-700">
                                Pilih Simulasi Akun Peran:
                            </label>
                            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                                {rolePresets.map((preset) => {
                                    const Icon = preset.icon
                                    const isSelected = selectedRole.role === preset.role

                                    return (
                                        <button
                                            key={preset.role}
                                            type="button"
                                            onClick={() => handleSelectPreset(preset)}
                                            className={`group relative flex flex-col items-start justify-between rounded-xl border p-3 text-left transition cursor-pointer ${
                                                isSelected
                                                    ? preset.borderActive
                                                    : 'border-slate-200 bg-slate-50/60 hover:border-slate-300 hover:bg-slate-100/60'
                                            }`}
                                        >
                                            <div className="flex w-full items-center justify-between mb-2">
                                                <div className={`grid size-7.5 place-items-center rounded-lg ${preset.bgLight} ${preset.color}`}>
                                                    <Icon className="size-4" />
                                                </div>
                                                {isSelected && (
                                                    <div className="grid size-4.5 place-items-center rounded-full bg-blue-600 text-white">
                                                        <Check className="size-3" />
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-slate-900 leading-tight">
                                                    {preset.title.split(' ')[0]}
                                                </p>
                                                <span className="text-[10px] font-medium text-slate-500">
                                                    {preset.badge}
                                                </span>
                                            </div>
                                        </button>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Selected Role Privilege Summary Box */}
                        <motion.div
                            key={selectedRole.role}
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-6 rounded-2xl border border-slate-200 bg-slate-50/70 p-4"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <IconComponent className={`size-4 ${selectedRole.color}`} />
                                    <span className="text-xs font-bold text-slate-900">
                                        Peran: {selectedRole.title}
                                    </span>
                                </div>
                                <span className="rounded-md bg-white border border-slate-200 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                                    Menuju: {selectedRole.targetPath}
                                </span>
                            </div>
                            <div className="flex flex-wrap gap-1.5 mt-2">
                                {selectedRole.privileges.map((priv) => (
                                    <span
                                        key={priv}
                                        className="rounded-md bg-white border border-slate-200 px-2 py-0.5 text-[10px] font-semibold text-slate-700 shadow-2xs"
                                    >
                                        &bull; {priv}
                                    </span>
                                ))}
                            </div>
                        </motion.div>

                        {/* Notifications */}
                        <AnimatePresence>
                            {errorMsg && (
                                <motion.div
                                    initial={{ opacity: 0, y: -6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -6 }}
                                    className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-700"
                                >
                                    <AlertCircle className="size-4 shrink-0 text-red-600 mt-0.5" />
                                    <span className="font-semibold">{errorMsg}</span>
                                </motion.div>
                            )}
                            {successMsg && (
                                <motion.div
                                    initial={{ opacity: 0, y: -6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -6 }}
                                    className="mb-5 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs text-emerald-700"
                                >
                                    <CheckCircle2 className="size-4 shrink-0 text-emerald-600 mt-0.5" />
                                    <span className="font-semibold">{successMsg}</span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Credentials Form */}
                        <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
                            <div>
                                <label htmlFor="email" className="mb-1.5 block text-xs font-semibold text-slate-700">
                                    Email Akses
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="email"
                                        id="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="pengurus@himatifa.org"
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
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••••••"
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 pl-10 pr-10 text-xs font-medium text-slate-900 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-700"
                                    >
                                        {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center justify-between text-xs pt-1">
                                <label className="flex cursor-pointer items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                        className="size-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="font-medium text-slate-600">Simpan status login</span>
                                </label>

                                <span className="text-[11px] text-slate-400">
                                    Mode: Simulasi Prototipe
                                </span>
                            </div>

                            <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex w-full sm:flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-xs font-semibold text-white shadow-md shadow-blue-600/15 transition-all hover:bg-blue-500 active:scale-[0.98] disabled:opacity-60 cursor-pointer"
                                >
                                    {isLoading ? (
                                        <span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                                    ) : (
                                        <>
                                            <span>Masuk sebagai {selectedRole.title.split(' ')[0]}</span>
                                            <LogIn className="size-4" />
                                        </>
                                    )}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => executeLogin(selectedRole)}
                                    disabled={isLoading}
                                    className="flex w-full sm:w-auto items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-900 active:scale-[0.98] cursor-pointer"
                                >
                                    <Sparkles className="size-3.5 text-blue-600" />
                                    <span>Instan Masuk</span>
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
