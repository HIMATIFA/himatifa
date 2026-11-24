'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Receipt, ArrowRight } from 'lucide-react'

export default function BendumLpjRedirectPage() {
    const router = useRouter()

    useEffect(() => {
        router.replace('/sekum/lpj')
    }, [router])

    return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center">
            <div className="grid size-12 place-items-center rounded-2xl bg-blue-50 text-blue-600 mb-3">
                <Receipt className="size-6" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Mengalihkan ke Modul LPJ Sekum...</h2>
            <p className="mt-1 text-xs text-slate-500 max-w-sm">
                Manajemen LPJ kini dipusatkan di bawah Sekretariat (Sekum).
            </p>
            <Link
                href="/sekum/lpj"
                className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-500 transition"
            >
                <span>Buka Modul LPJ Sekum</span>
                <ArrowRight className="size-3.5" />
            </Link>
        </div>
    )
}
