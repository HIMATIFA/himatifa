'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    initialLpjData,
    type LpjItem,
    type LpjStatus
} from '@/app/data'
import {
    Receipt,
    ShieldCheck,
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
    RotateCcw, ChevronRight
} from 'lucide-react'

const formatRupiah = (val: number): string => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0
    }).format(val)
}

export default function BendumLpjPage() {
    const [lpjList, setLpjList] = useState<LpjItem[]>(initialLpjData)
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState<'Semua' | LpjStatus>('Semua')

    const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null)
    const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false)
    const [selectedLpj, setSelectedLpj] = useState<LpjItem | null>(null)

    const [formTitle, setFormTitle] = useState('')
    const [formDivision, setFormDivision] = useState('Departemen PSDM')
    const [formBudgetPlanned, setFormBudgetPlanned] = useState('')
    const [formBudgetUsed, setFormBudgetUsed] = useState('')

    const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
        setToast({ message, type })
        setTimeout(() => setToast(null), 3500)
    }

    const { totalPlanned, totalUsed, pendingCount, approvedCount } = useMemo(() => {
        let planned = 0
        let used = 0
        let pending = 0
        let approved = 0

        lpjList.forEach((item) => {
            planned += item.budgetPlanned
            used += item.budgetUsed
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

    const handleUpdateStatus = (id: string, newStatus: LpjStatus) => {
        setLpjList((prev) =>
            prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
        )
        if (selectedLpj && selectedLpj.id === id) {
            setSelectedLpj({ ...selectedLpj, status: newStatus })
        }
        showToast(`Status LPJ ${id} diperbarui menjadi "${newStatus}".`)
    }

    const handleAddLpj = () => {
        const plannedNum = parseFloat(formBudgetPlanned)
        const usedNum = parseFloat(formBudgetUsed) || 0

        if (!formTitle.trim() || isNaN(plannedNum) || plannedNum <= 0) {
            showToast('Mohon isi judul dan estimasi anggaran dengan benar!', 'error')
            return
        }

        const newLpj: LpjItem = {
            id: `LPJ-2026-00${lpjList.length + 1}`,
            title: formTitle,
            division: formDivision,
            submittedDate: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
            budgetPlanned: plannedNum,
            budgetUsed: usedNum,
            status: 'Menunggu Verifikasi',
            notes: 'Berkas baru diunggah dan siap diverifikasi oleh Bendum.'
        }

        setLpjList([newLpj, ...lpjList])
        setFormTitle('')
        setFormBudgetPlanned('')
        setFormBudgetUsed('')
        setIsSubmitModalOpen(false)
        showToast(`LPJ "${newLpj.title}" berhasil diajukan.`)
    }

    const filteredLpj = useMemo(() => {
        return lpjList.filter((item) => {
            const matchesSearch =
                item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.division.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.id.toLowerCase().includes(searchQuery.toLowerCase())
            const matchesStatus = statusFilter === 'Semua' ? true : item.status === statusFilter
            return matchesSearch && matchesStatus
        })
    }, [lpjList, searchQuery, statusFilter])

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
                        <span className="text-slate-500">Bendahara Umum (Bendum)</span>
                    </div>
                    <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                        LPJ & Verification <span className="text-blue-600">Anggaran</span>
                    </h1>
                    <p className="mt-1 text-xs sm:text-sm text-slate-500">
                        Verifikasi kelayakan Laporan Pertanggungjawaban (LPJ) dan pertanggungjawaban nota belanja proker.
                    </p>
                </div>

                <button
                    onClick={() => setIsSubmitModalOpen(true)}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-blue-600/10 transition hover:bg-blue-500 active:scale-[0.98] cursor-pointer shrink-0"
                >
                    <Plus className="size-4" />
                    <span>Adukan LPJ Baru</span>
                </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Total Proker Terdata</span>
                        <div className="grid size-9 place-items-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
                            <Receipt className="size-4.5" />
                        </div>
                    </div>
                    <p className="text-xl font-extrabold text-slate-900">{lpjList.length} Berkas</p>
                    <p className="mt-0.5 text-[11px] text-slate-500 font-medium">{approvedCount} disetujui Bendum</p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Perlu Verifikasi</span>
                        <div className="grid size-9 place-items-center rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
                            <Clock className="size-4.5" />
                        </div>
                    </div>
                    <p className="text-xl font-extrabold text-amber-600">{pendingCount} Pengajuan</p>
                    <p className="mt-0.5 text-[11px] text-slate-500 font-medium">Menunggu pemeriksaan nota</p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Rencana Anggaran (RAB)</span>
                        <div className="grid size-9 place-items-center rounded-xl bg-slate-100 text-slate-600 border border-slate-200">
                            <FileSpreadsheet className="size-4.5" />
                        </div>
                    </div>
                    <p className="font-mono text-xl font-extrabold text-slate-900">{formatRupiah(totalPlanned)}</p>
                    <p className="mt-0.5 text-[11px] text-slate-500 font-medium">Akumulasi pengajuan awal</p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Realisasi Pengeluaran</span>
                        <div className="grid size-9 place-items-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                            <CheckCircle2 className="size-4.5" />
                        </div>
                    </div>
                    <p className="font-mono text-xl font-extrabold text-emerald-600">{formatRupiah(totalUsed)}</p>
                    <p className="mt-0.5 text-[11px] text-slate-500 font-medium">Total dana terpakai resmi</p>
                </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-2">
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
                            placeholder="Cari proker atau divisi..."
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
                            <th className="py-3 px-3">Anggaran (RAB vs Pakai)</th>
                            <th className="py-3 px-3">Status Verifikasi</th>
                            <th className="py-3 px-3 text-right">Aksi & Keputusan</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                        {filteredLpj.map((item) => (
                            <tr key={item.id} className="group transition hover:bg-slate-50/80">
                                <td className="py-3.5 px-3">
                                    <p className="font-mono text-[10px] font-bold text-blue-600">{item.id}</p>
                                    <p className="font-bold text-slate-900 group-hover:text-blue-600 transition">{item.title}</p>
                                    <span className="text-[10px] text-slate-400 font-medium">Diajukan: {item.submittedDate}</span>
                                </td>
                                <td className="py-3.5 px-3">
                                        <span className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-700 border border-slate-200">
                                            <Building className="size-3 text-blue-600" />
                                            {item.division}
                                        </span>
                                </td>
                                <td className="py-3.5 px-3 font-mono">
                                    <p className="font-bold text-slate-900">{formatRupiah(item.budgetPlanned)}</p>
                                    <p className="text-[10px] text-emerald-600 font-semibold">Real: {formatRupiah(item.budgetUsed)}</p>
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
                                            onClick={() => setSelectedLpj(item)}
                                            className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                                        >
                                            Detail
                                        </button>
                                        {item.status === 'Menunggu Verifikasi' && (
                                            <>
                                                <button
                                                    onClick={() => handleUpdateStatus(item.id, 'Disetujui')}
                                                    title="Setujui LPJ"
                                                    className="rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200 p-1.5 hover:bg-emerald-600 hover:text-white transition cursor-pointer"
                                                >
                                                    <Check className="size-3.5" />
                                                </button>
                                                <button
                                                    onClick={() => handleUpdateStatus(item.id, 'Revisi')}
                                                    title="Minta Revisi"
                                                    className="rounded-lg bg-amber-50 text-amber-600 border border-amber-200 p-1.5 hover:bg-amber-600 hover:text-white transition cursor-pointer"
                                                >
                                                    <RotateCcw className="size-3.5" />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                    {filteredLpj.length === 0 && (
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
                                    <span className="font-mono text-[10px] font-bold text-blue-600">{selectedLpj.id}</span>
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
                                    <span className="font-mono font-bold text-slate-900">{formatRupiah(selectedLpj.budgetPlanned)}</span>
                                </div>
                                <div className="flex justify-between py-1 border-b border-slate-100">
                                    <span className="text-slate-400 font-medium">Realisasi Dana:</span>
                                    <span className="font-mono font-bold text-emerald-600">{formatRupiah(selectedLpj.budgetUsed)}</span>
                                </div>
                                <div className="py-1">
                                    <span className="text-slate-400 font-medium block mb-1">Catatan Bendum:</span>
                                    <p className="rounded-xl bg-slate-50 p-3 text-slate-600 border border-slate-100 leading-relaxed font-medium">
                                        {selectedLpj.notes || 'Belum ada catatan khusus.'}
                                    </p>
                                </div>

                                <div className="pt-4 flex gap-2">
                                    <button
                                        onClick={() => handleUpdateStatus(selectedLpj.id, 'Disetujui')}
                                        className="flex-1 rounded-xl bg-emerald-600 py-2.5 text-xs font-semibold text-white hover:bg-emerald-500 transition cursor-pointer"
                                    >
                                        Setujui LPJ
                                    </button>
                                    <button
                                        onClick={() => handleUpdateStatus(selectedLpj.id, 'Revisi')}
                                        className="flex-1 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 py-2.5 text-xs font-semibold hover:bg-amber-100 transition cursor-pointer"
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
                                    <span>Pengajuan LPJ / Anggaran Baru</span>
                                </div>
                                <button
                                    onClick={() => setIsSubmitModalOpen(false)}
                                    className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition cursor-pointer"
                                >
                                    <X className="size-4.5" />
                                </button>
                            </div>

                            <div className="mt-4 space-y-3.5">
                                <div>
                                    <label className="mb-1 block text-xs font-semibold text-slate-700">
                                        Judul Program Kerja <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formTitle}
                                        onChange={(e) => setFormTitle(e.target.value)}
                                        placeholder="Contoh: LPJ Web Design Competition 2026"
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
                                        <option value="Departemen Pengmas">Departemen Luar Negeri</option>
                                        <option value="Departemen Medkominfo">Departemen Medkominfo</option>
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
                                            value={formBudgetPlanned}
                                            onChange={(e) => setFormBudgetPlanned(e.target.value)}
                                            placeholder="3000000"
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 px-3.5 text-xs font-mono font-bold text-slate-900 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/10"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-xs font-semibold text-slate-700">
                                            Realisasi Dana (Rp)
                                        </label>
                                        <input
                                            type="number"
                                            value={formBudgetUsed}
                                            onChange={(e) => setFormBudgetUsed(e.target.value)}
                                            placeholder="2850000"
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 px-3.5 text-xs font-mono font-bold text-slate-900 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/10"
                                        />
                                    </div>
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
                                        type="button"
                                        onClick={handleAddLpj}
                                        className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-blue-600/10 transition hover:bg-blue-500 active:scale-[0.98] cursor-pointer"
                                    >
                                        <CheckCircle2 className="size-4" />
                                        <span>Kirim Pengajuan</span>
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}
