'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Lock, Mail, Eye, EyeOff, LogIn } from 'lucide-react'

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Fungsi simulasi loading (Nanti ganti dengan fungsi Supabase lo)
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 2000)
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f4f8fc] px-4 py-12 text-[#0a192f] sm:px-6 lg:px-8">
      {/* Background Ornaments */}
      <div className="absolute left-[-10%] top-[-5%] h-125 w-125 rounded-full bg-blue-400/20 blur-[120px]" />
      <div className="absolute right-[-5%] top-[20%] h-150 w-150 rounded-full bg-cyan-300/20 blur-[150px]" />

      {/* Main Glass Container */}
      <div className="relative z-10 flex w-full max-w-[1000px] flex-col overflow-hidden rounded-[2.5rem] border border-white/80 bg-white/60 shadow-2xl shadow-blue-900/10 backdrop-blur-xl md:flex-row">
        
        {/* Left Side - Branding (Dark Mode) */}
        <div className="relative flex w-full flex-col justify-between bg-[#071426] p-10 text-white md:w-5/12 lg:p-12">
          {/* Overlay Background */}
          <div className="absolute inset-0 bg-[url('/profil-bg.jpg')] bg-cover bg-center opacity-10 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#071426] via-[#071426]/80 to-transparent" />
          
          <div className="relative z-10">
            <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold tracking-tight text-blue-200 transition-transform hover:-translate-x-1 hover:text-white">
              <ArrowLeft className="size-4" /> Beranda Publik
            </Link>
          </div>

          <div className="relative z-10 mt-20 md:mt-0">
            <Image 
              src="/himatifa1.png" 
              alt="Logo HIMATIFA" 
              width={64} 
              height={64} 
              className="mb-6 object-contain brightness-0 invert" 
            />
            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
              Sistem<br /><span className="text-[#2563eb]">Informasi</span><br />Manajemen.
            </h2>
            <p className="mt-5 max-w-sm text-sm leading-6 text-blue-100/60">
              Portal eksklusif pengurus HIMATIFA Universitas Muhammadiyah Surabaya untuk mengelola data, administrasi, dan layanan mahasiswa.
            </p>
          </div>
        </div>

        {/* Right Side - Form Login */}
        <div className="w-full p-10 md:w-7/12 lg:p-14">
          <div className="mb-10">
            <h1 className="text-3xl font-black tracking-tight">Selamat Datang</h1>
            <p className="mt-2 text-sm text-slate-500">Silakan masuk menggunakan kredensial pengurus Anda.</p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-6">
            
            {/* Email Input */}
            <div className="group relative">
              <label htmlFor="email" className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">Email Akses</label>
              <div className="relative flex items-center">
                <Mail className="absolute left-4 size-5 text-slate-400 transition-colors group-focus-within:text-[#2563eb]" />
                <input 
                  type="email" 
                  id="email"
                  required
                  placeholder="pengurus@himatifa.um-surabaya.ac.id" 
                  className="w-full rounded-2xl border border-white/80 bg-white/50 py-3.5 pl-12 pr-4 text-sm font-medium text-[#0a192f] outline-none backdrop-blur-sm transition-all focus:border-[#2563eb] focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="group relative">
              <label htmlFor="password" className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">Kata Sandi</label>
              <div className="relative flex items-center">
                <Lock className="absolute left-4 size-5 text-slate-400 transition-colors group-focus-within:text-[#2563eb]" />
                <input 
                  type={showPassword ? "text" : "password"} 
                  id="password"
                  required
                  placeholder="••••••••••••" 
                  className="w-full rounded-2xl border border-white/80 bg-white/50 py-3.5 pl-12 pr-12 text-sm font-medium text-[#0a192f] outline-none backdrop-blur-sm transition-all focus:border-[#2563eb] focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 text-slate-400 transition-colors hover:text-[#0a192f]"
                >
                  {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                </button>
              </div>
            </div>

            {/* Options */}
            <div className="flex items-center justify-between">
              <label className="flex cursor-pointer items-center gap-2">
                <input type="checkbox" className="size-4 rounded border-slate-300 text-[#2563eb] focus:ring-[#2563eb]" />
                <span className="text-xs font-bold text-slate-500">Ingat Saya</span>
              </label>
              <button type="button" className="text-xs font-bold text-[#2563eb] hover:underline">
                Lupa sandi?
              </button>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={isLoading}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-[#2563eb] py-4 text-sm font-bold text-white shadow-xl shadow-blue-600/20 transition-all hover:-translate-y-0.5 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
            >
              {isLoading ? (
                <span className="size-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <>Autentikasi Sistem <LogIn className="size-4" /></>
              )}
            </button>
          </form>

        </div>
      </div>
    </main>
  )
}