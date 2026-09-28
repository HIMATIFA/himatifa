'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertOctagon, RefreshCcw, Home, Terminal } from 'lucide-react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error ke console atau layanan tracking seperti Sentry di production
    console.error('Runtime Error caught by app/error.tsx:', error)
  }, [error])

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-[#f8fafc] p-6 font-sans text-slate-900 selection:bg-red-100 selection:text-red-900">
      
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/50 animate-in fade-in zoom-in-95 duration-300">
        
        {/* Header Section */}
        <div className="flex flex-col items-center border-b border-slate-100 bg-red-50/50 px-6 py-8 text-center">
          <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-red-100 text-red-600 ring-8 ring-red-50">
            <AlertOctagon className="size-8 stroke-[2.5]" />
          </div>
          <h1 className="text-xl font-black tracking-tight text-slate-900">Oops! Terjadi Kesalahan</h1>
          <p className="mt-2 text-sm font-medium text-slate-500">
            Sistem mendeteksi adanya masalah saat merender halaman ini.
          </p>
        </div>

        {/* Developer Context (Hanya tampil jika ada pesan error) */}
        <div className="bg-slate-50 px-6 py-4">
          <div className="mb-2 flex items-center gap-2">
            <Terminal className="size-4 text-slate-400" />
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
              Diagnostic Log
            </span>
          </div>
          <div className="rounded-lg border border-red-100 bg-red-50/50 p-3 text-left">
            <p className="font-mono text-xs text-red-600 break-words font-medium">
              {error.message || "Unknown Application Error"}
            </p>
            {error.digest && (
              <p className="mt-1.5 font-mono text-[10px] text-red-400">
                Digest ID: {error.digest}
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 p-6">
          <button
            onClick={() => reset()}
            className="group flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white transition-all hover:bg-slate-800 hover:shadow-lg hover:shadow-slate-900/20 active:scale-95"
          >
            <RefreshCcw className="size-4 transition-transform group-hover:rotate-180 duration-500" />
            Coba Muat Ulang
          </button>
          
          <Link
            href="/"
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition-all hover:bg-slate-50 hover:text-slate-900 active:scale-95"
          >
            <Home className="size-4 text-slate-400" />
            Kembali ke Beranda Publik
          </Link>
        </div>
      </div>
      
      {/* Footer Branding */}
      <div className="mt-8 text-center opacity-60">
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
          HIMATIFA Workspace System
        </p>
      </div>
      
    </div>
  )
}