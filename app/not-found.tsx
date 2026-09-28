import Link from 'next/link'
import { ArrowLeft, SearchX } from 'lucide-react'

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f4f8fc] px-6 text-[#0a192f]">
      {/* Background Ornaments (Sama dengan page.tsx) */}
      <div className="absolute left-[-10%] top-[-5%] h-125 w-125 rounded-full bg-blue-400/20 blur-[120px]" />
      <div className="absolute right-[-5%] top-[20%] h-150 w-150 rounded-full bg-cyan-300/20 blur-[150px]" />

      {/* Glassmorphism Card */}
      <div className="relative z-10 w-full max-w-lg rounded-[2.5rem] border border-white/80 bg-white/60 p-10 text-center shadow-lg shadow-blue-900/5 backdrop-blur-xl sm:p-14">
        
        <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-[1.5rem] bg-blue-100/50 text-[#2563eb] shadow-inner">
          <SearchX className="size-10" />
        </div>
        
        <h1 className="text-6xl font-black tracking-tight text-[#0a192f] sm:text-7xl">404</h1>
        <p className="mt-3 text-xl font-extrabold tracking-tight text-[#2563eb]">Route Not Defined</p>
        
        <p className="mt-4 text-sm leading-6 text-slate-500">
          Waduh! Sepertinya URL yang lo tuju salah alamat atau halamannya udah di-<i>drop</i>. Yuk kembali ke jalan yang benar.
        </p>
        
        <div className="mt-10">
          <Link 
            href="/" 
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#2563eb] px-8 py-3.5 text-sm font-bold text-white shadow-xl shadow-blue-600/20 transition-all hover:-translate-y-1 hover:bg-blue-700"
          >
            <ArrowLeft className="size-4" /> Kembali ke Beranda
          </Link>
        </div>
      </div>
    </main>
  )
}