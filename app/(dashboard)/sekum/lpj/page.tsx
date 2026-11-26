'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { createBrowserClient } from '@supabase/ssr'
import {
    Receipt,
    Plus,
    Search,
    FileText,
    CheckCircle2,
    Clock,
    XCircle,
    AlertCircle,
    X,
    FileSpreadsheet,
    Building,
    Sparkles,
    Check,
    RotateCcw,
    ChevronRight,
    Loader2,
    ShieldAlert,
    Trash2
} from 'lucide-react'

export type LpjStatus = 'Menunggu Verifikasi' | 'Disetujui' | 'Revisi' | 'Ditolak'

export interface LpjItem {
    id: string
    lpj_code: string
    title: string
    division: string
    submitted_date: string
    budget_planned: number
    budget_used: number
    status: LpjStatus
    notes: string | null
    created_at: string
}

const formatRupiah = (val: number): string => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0
    }).format(val)
}

const formatTanggalID = (isoDate: string): string => {
    if (!isoDate) return '-'
    const d = new Date(`${isoDate}T00:00:00`)
    if (isNaN(d.getTime())) return isoDate
    return d.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    })
}

export default function SekumLpjPage() {
    const router = useRouter()

    const [isCheckingAuth, setIsCheckingAuth] = useState(true)
    const [isAuthorized, setIsAuthorized] = useState(false)
    const [currentUserId, setCurrentUserId] = useState<string | null>(null)

    const [lpjList, setLpjList] = useState<LpjItem[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)

    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState<'Semua' | LpjStatus>('Semua')

    const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null)
    const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false)
    const [selectedLpj, setSelectedLpj] = useState<LpjItem | null>(null)
    const [detailNotes, setDetailNotes] = useState('')

    const [formTitle, setFormTitle] = useState('')
    const [formDivision, setFormDivision] = useState('Departemen PSDM')
    const [formBudgetPlanned, setFormBudgetPlanned] = useState('')
    const [formBudgetUsed, setFormBudgetUsed] = useState('')
    const [formNotes, setFormNotes] = useState('')

    const supabase = useMemo(
        () =>
            createBrowserClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
            ),
        []
    )

    const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
        setToast({ message, type })
        setTimeout(() => setToast(null), 3500)
    }

    useEffect(() => {
        const checkAccess = async () => {
            setIsCheckingAuth(true)
            const {
                data: { user }
            } = await supabase.auth.getUser()

            if (!user) {
                router.replace('/login')
                return
            }

            setCurrentUserId(user.id)

            const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', user.id)
                .single()

            const role = profile?.role || user.user_metadata?.role

            if (role !== 'sekum' && role !== 'admin') {
                setIsAuthorized(false)
                setIsCheckingAuth(false)
                return
            }

            setIsAuthorized(true)
            setIsCheckingAuth(false)
        }

        checkAccess()
    }, [supabase, router])

    const fetchLpjList = async () => {
        setIsLoading(true)
        const { data, error } = await supabase
            .from('lpj_submissions')
            .select('*')
            .order('created_at', { ascending: false })

        if (!error && data) {
            setLpjList(
                data.map((row) => ({
                    ...row,
                    budget_planned: Number(row.budget_planned) || 0,
                    budget_used: Number(row.budget_used) || 0
                })) as LpjItem[]
            )
        }
        setIsLoading(false)
    }

    useEffect(() => {
        if (!isAuthorized) return

        fetchLpjList()

        const channel = supabase
            .channel('lpj-submissions-realtime')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'lpj_submissions' },
                () => fetchLpjList()
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [isAuthorized, supabase])

    const { totalPlanned, totalUsed, pendingCount, approvedCount } = useMemo(() => {
        let planned = 0
        let used = 0
        let pending = 0
        let approved = 0

        lpjList.forEach((item) => {
            planned += item.budget_planned
            used += item.budget_used
            if (item.status === 'Menunggu Verifikasi') pending++
            if (item.status === 'Disetujui') approved++
        })

        return {
            totalPlanned: planned,
            totalUsed: used,
            pendingCount: pending,
            approvedCount: approved
        }
    }, [lpjList])

    const openDetailModal = (item: LpjItem) => {
        setSelectedLpj(item)
        setDetailNotes(item.notes || '')
    }

    const handleUpdateStatus = async (item: LpjItem, newStatus: LpjStatus, customNotes?: string) => {
        setIsSaving(true)
        const updatedNotes = customNotes !== undefined ? customNotes : item.notes

        const { error } = await supabase
            .from('lpj_submissions')
            .update({
                status: newStatus,
                notes: updatedNotes
            })
            .eq('id', item.id)

        if (error) {
            showToast(`Gagal memperbarui status: ${error.message}`, 'error')
            setIsSaving(false)
            return
        }

        if (selectedLpj && selectedLpj.id === item.id) {
            setSelectedLpj({ ...selectedLpj, status: newStatus, notes: updatedNotes })
        }

        setIsSaving(false)
        showToast(`Status ${item.lpj_code} diperbarui menjadi "${newStatus}".`)
        await fetchLpjList()
    }

    const handleAddLpj = async (e: React.FormEvent) => {
        e.preventDefault()

        const plannedNum = Math.round(parseFloat(formBudgetPlanned))
        const usedNum = Math.round(parseFloat(formBudgetUsed)) || 0

        if (!formTitle.trim() || isNaN(plannedNum) || plannedNum <= 0) {
            showToast('Mohon isi judul dan estimasi anggaran dengan benar!', 'error')
            return
        }

        setIsSaving(true)
        const randomNum = Math.floor(100 + Math.random() * 900)
        const generatedCode = `LPJ-2026-${randomNum}`

        const { error } = await supabase.from('lpj_submissions').insert({
            lpj_code: generatedCode,
            title: formTitle.trim(),
            division: formDivision,
            submitted_date: new Date().toISOString().split('T')[0],
            budget_planned: plannedNum,
            budget_used: usedNum,
            status: 'Menunggu Verifikasi',
            notes: formNotes.trim() || 'Berkas baru diunggah dan siap diverifikasi oleh Sekretariat / BPH.',
            created_by: currentUserId
        })

        if (error) {
            showToast(`Gagal mendaftarkan LPJ: ${error.message}`, 'error')
            setIsSaving(false)
            return
        }

        setIsSaving(false)
        setFormTitle('')
        setFormBudgetPlanned('')
        setFormBudgetUsed('')
        setFormNotes('')
        setIsSubmitModalOpen(false)
        showToast(`LPJ "${formTitle.trim()}" berhasil didaftarkan ke sistem.`)
        await fetchLpjList()
    }

    const handleDeleteLpj = async (item: LpjItem) => {
        if (!confirm(`Hapus arsip LPJ "${item.title}" (${item.lpj_code})?`)) return

        const { error } = await supabase.from('lpj_submissions').delete().eq('id', item.id)
        if (error) {
            showToast(`Gagal menghapus LPJ: ${error.message}`, 'error')
        } else {
            if (selectedLpj?.id === item.id) setSelectedLpj(null)
            showToast(`Berkas ${item.lpj_code} berhasil dihapus.`, 'info')
            await fetchLpjList()
        }
    }

    const filteredLpj = useMemo(() => {
        return lpjList.filter((item) => {
            const matchesSearch =
                item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.division.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.lpj_code.toLowerCase().includes(searchQuery.toLowerCase())
            const matchesStatus = statusFilter === 'Semua' ? true : item.status === statusFilter
            return matchesSearch && matchesStatus
        })
    }, [lpjList, searchQuery, statusFilter])

    if (isCheckingAuth) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-slate-500">
                <Loader2 className="size-7 animate-spin text-blue-600" />
                <p className="text-xs font-semibold">Memverifikasi hak akses Sekretaris Umum...</p>
            </div>
        )
    }

    if (!isAuthorized) {
        return (
            <div className="mx-auto my-12 max-w-md rounded-2xl border border-rose-200 bg-white p-8 text-center shadow-xs">
                <div className="mx-auto mb-4 grid size-14 place-items-center rounded-2xl bg-rose-50 text-rose-600 border border-rose-100">
                    <ShieldAlert className="size-7" />
                </div>
                <h2 className="text-lg font-extrabold text-slate-900">Akses Terbatas</h2>
                <p className="mt-2 text-xs leading-relaxed text-slate-500">
                    Modul <strong>Manajemen LPJ</strong> hanya dapat dikelola oleh <strong>Sekretaris Umum (Sekum)</strong> dan <strong>Administrator</strong>.
                </p>
                <button
                    onClick={() => router.back()}
                    className="mt-6 inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-semibold text-white hover:bg-slate-800 cursor-pointer"
                >
                    Kembali
                </button>
            </div>
        )
    }

    return (
        <div className="space-y-6 font-sans">
            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, y: -16, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -16, scale: 0.98 }}
                        className="fixed top-6 right-6 z-50 flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-lg"
                    >
                        {toast.type === 'success' && <CheckCircle2 className="size-4.5 text-emerald-600" />}
                        {toast.type === 'error' && <XCircle className="size-4.5 text-red-600" />}
                        {toast.type === 'info' && <Sparkles className="size-4.5 text-blue-600" />}
                        <span className="text-xs font-semibold text-slate-700">{toast.message}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center border-b border-slate-200 pb-5">
                <div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 mb-1">
                        <span>SIM HIMATIFA</span>
                        <ChevronRight className="size-3 text-slate-400" />
                        <span className="text-slate-500">Sekretaris Umum (Sekum)</span>
                    </div>
                    <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                        Manajemen LPJ & <span className="text-blue-600">Pertanggungjawaban</span>
                    </h1>
                    <p className="mt-1 text-xs sm:text-sm text-slate-500">
                        Perekaman, pengarsipan, dan verifikasi berkas Laporan Pertanggungjawaban (LPJ) kegiatan seluruh departemen.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => setIsSubmitModalOpen(true)}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-blue-600/10 transition hover:bg-blue-500 active:scale-[0.98] cursor-pointer shrink-0"
                >
                    <Plus className="size-4" />
                    <span>Upload LPJ Baru</span>
                </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Total LPJ Terdata</span>
                        <div className="grid size-9 place-items-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
                            <Receipt className="size-4.5" />
                        </div>
                    </div>
                    <p className="text-xl font-extrabold text-slate-900">{lpjList.length} Berkas</p>
                    <p className="mt-0.5 text-[11px] text-slate-500 font-medium">{approvedCount} tervalidasi lengkap</p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Menunggu Verifikasi</span>
                        <div className="grid size-9 place-items-center rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
                            <Clock className="size-4.5" />
                        </div>
                    </div>
                    <p className="text-xl font-extrabold text-amber-600">{pendingCount} Pengajuan</p>
                    <p className="mt-0.5 text-[11px] text-slate-500 font-medium">Perlu review berkas & nota</p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Total Anggaran (RAB)</span>
                        <div className="grid size-9 place-items-center rounded-xl bg-slate-100 text-slate-600 border border-slate-200">
                            <FileSpreadsheet className="size-4.5" />
                        </div>
                    </div>
                    <p className="font-mono text-xl font-extrabold text-slate-900">{formatRupiah(totalPlanned)}</p>
                    <p className="mt-0.5 text-[11px] text-slate-500 font-medium">Akumulasi rencana proker</p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Realisasi Dana Digunakan</span>
                        <div className="grid size-9 place-items-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                            <CheckCircle2 className="size-4.5" />
                        </div>
                    </div>
                    <p className="font-mono text-xl font-extrabold text-emerald-600">{formatRupiah(totalUsed)}</p>
                    <p className="mt-0.5 text-[11px] text-slate-500 font-medium">Total pengeluaran riil</p>
                </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold text-slate-700">Filter Status:</span>
                        <div className="flex flex-wrap gap-1 rounded-xl bg-slate-100 p-1 text-xs font-semibold">
                            {(['Semua', 'Menunggu Verifikasi', 'Disetujui', 'Revisi', 'Ditolak'] as const).map((st) => (
                                <button
                                    key={st}
                                    onClick={() => setStatusFilter(st)}
                                    className={`rounded-lg px-3 py-1 transition cursor-pointer ${
                                        statusFilter === st ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                                    }`}
                                >
                                    {st}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="relative flex-1 sm:w-64">
                        <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Cari proker, kode, atau divisi..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-1.5 pl-8 pr-3 text-xs font-medium text-slate-900 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/10"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-600">
                        <thead className="border-b border-slate-200 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 bg-slate-50/50">
                        <tr>
                            <th className="py-3 px-3">ID & Judul LPJ</th>
                            <th className="py-3 px-3">Pelaksana / Divisi</th>
                            <th className="py-3 px-3">Anggaran (RAB vs Real)</th>
                            <th className="py-3 px-3">Status Verifikasi</th>
                            <th className="py-3 px-3 text-right">Aksi & Keputusan</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                        {isLoading ? (
                            <tr>
                                <td colSpan={5} className="py-12 text-center">
                                    <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-500">
                                        <Loader2 className="size-4 animate-spin text-blue-600" />
                                        <span>Memuat arsip LPJ dari Supabase...</span>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            filteredLpj.map((item) => (
                                <tr key={item.id} className="group transition hover:bg-slate-50/80">
                                    <td className="py-3.5 px-3">
                                        <p className="font-mono text-[10px] font-bold text-blue-600">{item.lpj_code}</p>
                                        <p className="font-bold text-slate-900 group-hover:text-blue-600 transition">{item.title}</p>
                                        <span className="text-[10px] text-slate-400 font-medium">
                                                Diajukan: {formatTanggalID(item.submitted_date)}
                                            </span>
                                    </td>
                                    <td className="py-3.5 px-3">
                                            <span className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-700 border border-slate-200">
                                                <Building className="size-3 text-blue-600" />
                                                {item.division}
                                            </span>
                                    </td>
                                    <td className="py-3.5 px-3 font-mono">
                                        <p className="font-bold text-slate-900">{formatRupiah(item.budget_planned)}</p>
                                        <p className="text-[10px] text-emerald-600 font-semibold">
                                            Real: {formatRupiah(item.budget_used)}
                                        </p>
                                    </td>
                                    <td className="py-3.5 px-3 whitespace-nowrap">
                                        {item.status === 'Disetujui' && (
                                            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">
                                                    <CheckCircle2 className="size-3" />
                                                    <span>Disetujui</span>
                                                </span>
                                        )}
                                        {item.status === 'Menunggu Verifikasi' && (
                                            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200 px-2.5 py-0.5 text-[10px] font-bold text-amber-700">
                                                    <Clock className="size-3" />
                                                    <span>Menunggu Verifikasi</span>
                                                </span>
                                        )}
                                        {item.status === 'Revisi' && (
                                            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 border border-blue-200 px-2.5 py-0.5 text-[10px] font-bold text-blue-700">
                                                    <AlertCircle className="size-3" />
                                                    <span>Perlu Revisi</span>
                                                </span>
                                        )}
                                        {item.status === 'Ditolak' && (
                                            <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 border border-red-200 px-2.5 py-0.5 text-[10px] font-bold text-red-700">
                                                    <XCircle className="size-3" />
                                                    <span>Ditolak</span>
                                                </span>
                                        )}
                                    </td>
                                    <td className="py-3.5 px-3 text-right whitespace-nowrap">
                                        <div className="flex items-center justify-end gap-1.5">
                                            <button
                                                type="button"
                                                onClick={() => openDetailModal(item)}
                                                className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                                            >
                                                Detail
                                            </button>
                                            {item.status === 'Menunggu Verifikasi' && (
                                                <>
                                                    <button
                                                        type="button"
                                                        disabled={isSaving}
                                                        onClick={() => handleUpdateStatus(item, 'Disetujui')}
                                                        title="Validasi & Setujui LPJ"
                                                        className="rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200 p-1.5 hover:bg-emerald-600 hover:text-white transition cursor-pointer"
                                                    >
                                                        <Check className="size-3.5" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        disabled={isSaving}
                                                        onClick={() => handleUpdateStatus(item, 'Revisi')}
                                                        title="Minta Revisi Berkas"
                                                        className="rounded-lg bg-amber-50 text-amber-600 border border-amber-200 p-1.5 hover:bg-amber-600 hover:text-white transition cursor-pointer"
                                                    >
                                                        <RotateCcw className="size-3.5" />
                                                    </button>
                                                </>
                                            )}
                                            <button
                                                type="button"
                                                disabled={isSaving}
                                                onClick={() => handleDeleteLpj(item)}
                                                title="Hapus Berkas LPJ"
                                                className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 transition cursor-pointer"
                                            >
                                                <Trash2 className="size-3.5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>

                    {!isLoading && filteredLpj.length === 0 && (
                        <div className="py-12 text-center">
                            <FileText className="mx-auto size-8 text-slate-300" />
                            <p className="mt-2 text-xs font-semibold text-slate-500">Tidak ada data LPJ yang cocok.</p>
                        </div>
                    )}
                </div>
            </div>

            <AnimatePresence>
                {selectedLpj && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedLpj(null)}
                            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.98, y: 12 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.98, y: 12 }}
                            className="relative z-10 w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl"
                        >
                            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                <div>
                                    <span className="font-mono text-[10px] font-bold text-blue-600">{selectedLpj.lpj_code}</span>
                                    <h3 className="text-base font-bold text-slate-900">{selectedLpj.title}</h3>
                                </div>
                                <button
                                    onClick={() => setSelectedLpj(null)}
                                    className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition cursor-pointer"
                                >
                                    <X className="size-4.5" />
                                </button>
                            </div>

                            <div className="mt-4 space-y-3 text-xs">
                                <div className="flex justify-between py-1 border-b border-slate-100">
                                    <span className="text-slate-400 font-medium">Pelaksana:</span>
                                    <span className="font-bold text-slate-900">{selectedLpj.division}</span>
                                </div>
                                <div className="flex justify-between py-1 border-b border-slate-100">
                                    <span className="text-slate-400 font-medium">Rencana Anggaran (RAB):</span>
                                    <span className="font-mono font-bold text-slate-900">
                                        {formatRupiah(selectedLpj.budget_planned)}
                                    </span>
                                </div>
                                <div className="flex justify-between py-1 border-b border-slate-100">
                                    <span className="text-slate-400 font-medium">Realisasi Dana:</span>
                                    <span className="font-mono font-bold text-emerald-600">
                                        {formatRupiah(selectedLpj.budget_used)}
                                    </span>
                                </div>
                                <div className="py-1">
                                    <label className="text-slate-600 font-bold block mb-1.5">
                                        Catatan Verifikasi Sekretariat:
                                    </label>
                                    <textarea
                                        rows={3}
                                        value={detailNotes}
                                        onChange={(e) => setDetailNotes(e.target.value)}
                                        placeholder="Tuliskan catatan pemeriksaan berkas, lampiran nota, atau poin revisi..."
                                        className="w-full rounded-xl bg-slate-50 p-3 text-slate-700 border border-slate-200 leading-relaxed font-medium outline-none focus:border-blue-600 focus:bg-white"
                                    />
                                </div>

                                <div className="pt-3 flex gap-2">
                                    <button
                                        type="button"
                                        disabled={isSaving}
                                        onClick={() => handleUpdateStatus(selectedLpj, 'Disetujui', detailNotes)}
                                        className="flex-1 rounded-xl bg-emerald-600 py-2.5 text-xs font-semibold text-white hover:bg-emerald-500 transition cursor-pointer disabled:opacity-50"
                                    >
                                        Setujui LPJ
                                    </button>
                                    <button
                                        type="button"
                                        disabled={isSaving}
                                        onClick={() => handleUpdateStatus(selectedLpj, 'Revisi', detailNotes)}
                                        className="flex-1 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 py-2.5 text-xs font-semibold hover:bg-amber-100 transition cursor-pointer disabled:opacity-50"
                                    >
                                        Minta Revisi
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isSubmitModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsSubmitModalOpen(false)}
                            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.98, y: 12 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.98, y: 12 }}
                            className="relative z-10 w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-xl"
                        >
                            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                <div className="flex items-center gap-2 font-bold text-slate-900 text-base">
                                    <Receipt className="size-4 text-blue-600" />
                                    <span>Pendaftaran LPJ Kegiatan Baru</span>
                                </div>
                                <button
                                    onClick={() => setIsSubmitModalOpen(false)}
                                    className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition cursor-pointer"
                                >
                                    <X className="size-4.5" />
                                </button>
                            </div>

                            <form onSubmit={handleAddLpj} className="mt-4 space-y-3.5">
                                <div>
                                    <label className="mb-1 block text-xs font-semibold text-slate-700">
                                        Judul Program Kerja / LPJ <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formTitle}
                                        onChange={(e) => setFormTitle(e.target.value)}
                                        placeholder="Contoh: LPJ Informatics Skill Upgrade 2026"
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 px-3.5 text-xs font-medium text-slate-900 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/10"
                                    />
                                </div>

                                <div>
                                    <label className="mb-1 block text-xs font-semibold text-slate-700">
                                        Divisi / Departemen Pelaksana
                                    </label>
                                    <select
                                        value={formDivision}
                                        onChange={(e) => setFormDivision(e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 px-3.5 text-xs font-semibold text-slate-900 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/10 cursor-pointer"
                                    >
                                        <option value="Departemen PSDM">Departemen PSDM</option>
                                        <option value="Departemen Pengmas">Departemen Pengmas</option>
                                        <option value="Departemen Medkominfo">Departemen Medkominfo</option>
                                        <option value="Departemen RnD">Departemen RnD</option>
                                        <option value="Departemen Advokasi">Departemen Advokasi</option>
                                        <option value="Internal / Sekum">Internal / Sekum</option>
                                    </select>
                                </div>

                                <div className="grid gap-3 sm:grid-cols-2">
                                    <div>
                                        <label className="mb-1 block text-xs font-semibold text-slate-700">
                                            Rencana Anggaran (Rp) <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            required
                                            min={1}
                                            value={formBudgetPlanned}
                                            onChange={(e) => setFormBudgetPlanned(e.target.value)}
                                            placeholder="3500000"
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 px-3.5 text-xs font-mono font-bold text-slate-900 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/10"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-xs font-semibold text-slate-700">
                                            Realisasi Pengeluaran (Rp)
                                        </label>
                                        <input
                                            type="number"
                                            min={0}
                                            value={formBudgetUsed}
                                            onChange={(e) => setFormBudgetUsed(e.target.value)}
                                            placeholder="3200000"
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 px-3.5 text-xs font-mono font-bold text-slate-900 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/10"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="mb-1 block text-xs font-semibold text-slate-700">
                                        Catatan Awal / Tautan Berkas (Opsional)
                                    </label>
                                    <input
                                        type="text"
                                        value={formNotes}
                                        onChange={(e) => setFormNotes(e.target.value)}
                                        placeholder="Contoh: Berkas fisik & link Google Drive sudah diserahkan"
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 px-3.5 text-xs font-medium text-slate-900 outline-none transition focus:border-blue-600 focus:bg-white"
                                    />
                                </div>

                                <div className="mt-5 flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                                    <button
                                        type="button"
                                        onClick={() => setIsSubmitModalOpen(false)}
                                        className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSaving}
                                        className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-blue-600/10 transition hover:bg-blue-500 active:scale-[0.98] disabled:opacity-50 cursor-pointer"
                                    >
                                        {isSaving ? (
                                            <Loader2 className="size-4 animate-spin" />
                                        ) : (
                                            <CheckCircle2 className="size-4" />
                                        )}
                                        <span>Simpan & Verifikasi</span>
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}