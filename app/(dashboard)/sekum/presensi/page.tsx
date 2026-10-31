'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    initialAttendanceData,
    type AttendanceRecord,
    type AttendanceSessionStatus
} from '@/app/data'
import {
    UserCheck,
    ShieldCheck,
    Plus,
    Search,
    X,
    Trash2,
    CheckCircle2,
    Clock,
    XCircle,
    Sparkles,
    Calendar,
    Users,
    Eye,
    Percent,
    AlertCircle,
    Download, ChevronRight
} from 'lucide-react'

export default function SekumPresensiPage() {
    const [attendanceList, setAttendanceList] = useState<AttendanceRecord[]>(initialAttendanceData)
    const [statusFilter, setStatusFilter] = useState<'Semua' | AttendanceSessionStatus>('Semua')
    const [searchQuery, setSearchQuery] = useState<string>('')

    const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null)
    const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false)
    const [selectedRecord, setSelectedRecord] = useState<AttendanceRecord | null>(null)

    const [formEventName, setFormEventName] = useState('')
    const [formTotalMembers, setFormTotalMembers] = useState('40')
    const [formPresentCount, setFormPresentCount] = useState('')
    const [formPermissionCount, setFormPermissionCount] = useState('0')
    const [formSickCount, setFormSickCount] = useState('0')
    const [formAbsentCount, setFormAbsentCount] = useState('0')

    const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
        setToast({ message, type })
        setTimeout(() => setToast(null), 3500)
    }

    const { totalSessions, activeSessions, averageAttendanceRate } = useMemo(() => {
        const total = attendanceList.length
        const active = attendanceList.filter(a => a.status === 'Berlangsung').length

        let sumRate = 0
        attendanceList.forEach(item => {
            if (item.totalMembers > 0) {
                sumRate += (item.presentCount / item.totalMembers) * 100
            }
        })
        const avgRate = total > 0 ? (sumRate / total).toFixed(1) : '0'

        return { totalSessions: total, activeSessions: active, averageAttendanceRate: avgRate }
    }, [attendanceList])

    const handleAddRecord = () => {
        const total = parseInt(formTotalMembers, 10)
        const present = parseInt(formPresentCount, 10)
        const perm = parseInt(formPermissionCount, 10) || 0
        const sick = parseInt(formSickCount, 10) || 0
        const abs = parseInt(formAbsentCount, 10) || 0

        if (!formEventName.trim() || isNaN(total) || isNaN(present) || total <= 0) {
            showToast('Mohon isi nama agenda dan jumlah kehadiran dengan benar!', 'error')
            return
        }

        const newRecord: AttendanceRecord = {
            id: `PRES-00${attendanceList.length + 1}`,
            eventName: formEventName,
            date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
            totalMembers: total,
            presentCount: present,
            permissionCount: perm,
            sickCount: sick,
            absentCount: abs,
            status: 'Berlangsung'
        }

        setAttendanceList([newRecord, ...attendanceList])
        setIsAddModalOpen(false)
        setFormEventName('')
        setFormPresentCount('')
        showToast(`Sesi presensi "${newRecord.eventName}" berhasil dibuka.`)
    }

    const handleToggleSessionStatus = (id: string, currentStatus: AttendanceSessionStatus) => {
        const newStatus: AttendanceSessionStatus = currentStatus === 'Berlangsung' ? 'Selesai' : 'Berlangsung'
        setAttendanceList(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a))
        if (selectedRecord?.id === id) {
            setSelectedRecord({ ...selectedRecord, status: newStatus })
        }
        showToast(`Sesi presensi ${id} diubah menjadi "${newStatus}".`)
    }

    const handleDelete = (id: string, eventName: string) => {
        if (confirm(`Apakah Anda yakin ingin menghapus rekap presensi "${eventName}"?`)) {
            setAttendanceList(attendanceList.filter(a => a.id !== id))
            if (selectedRecord?.id === id) setSelectedRecord(null)
            showToast(`Rekap presensi "${eventName}" telah dihapus.`, 'info')
        }
    }

    const filteredAttendance = useMemo(() => {
        return attendanceList.filter((item) => {
            const matchesStatus = statusFilter === 'Semua' || item.status === statusFilter
            const matchesSearch =
                item.eventName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.id.toLowerCase().includes(searchQuery.toLowerCase())
            return matchesStatus && matchesSearch
        })
    }, [attendanceList, statusFilter, searchQuery])

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
                        <span className="text-slate-500">Sekretariat Umum (Sekum)</span>
                    </div>
                    <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                        Presensi & Kehadiran <span className="text-blue-600">Pengurus</span>
                    </h1>
                    <p className="mt-1 text-xs sm:text-sm text-slate-500">
                        Rekapitulasi tingkat partisipasi pengurus pada rapat pleno, rapat BPH, dan kegiatan himpunan.
                    </p>
                </div>

                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-blue-600/10 transition hover:bg-blue-500 active:scale-[0.98] cursor-pointer shrink-0"
                >
                    <Plus className="size-4" />
                    <span>Buka Sesi Presensi Baru</span>
                </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Total Sesi Teragenda</span>
                        <div className="grid size-9 place-items-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
                            <UserCheck className="size-4.5" />
                        </div>
                    </div>
                    <p className="text-xl font-extrabold text-slate-900">{totalSessions} Sesi Rapat</p>
                    <p className="mt-0.5 text-[11px] text-slate-500 font-medium">{activeSessions} sesi sedang berlangsung</p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Rata-Rata Kehadiran</span>
                        <div className="grid size-9 place-items-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                            <Percent className="size-4.5" />
                        </div>
                    </div>
                    <p className="text-xl font-extrabold text-emerald-600">{averageAttendanceRate}%</p>
                    <p className="mt-0.5 text-[11px] text-slate-500 font-medium">Persentase partisipasi pengurus</p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Status Sesi Aktif</span>
                        <div className="grid size-9 place-items-center rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
                            <Clock className="size-4.5" />
                        </div>
                    </div>
                    <p className="text-xl font-extrabold text-slate-900">{activeSessions} Sesi Terbuka</p>
                    <p className="mt-0.5 text-[11px] text-slate-500 font-medium">Presensi digital dapat diisi</p>
                </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between border-b border-slate-100 pb-4">
                    <div className="flex gap-1 rounded-xl bg-slate-100 p-1 text-xs font-semibold">
                        {(['Semua', 'Berlangsung', 'Selesai'] as const).map((st) => (
                            <button
                                key={st}
                                onClick={() => setStatusFilter(st)}
                                className={`rounded-lg px-3 py-1.5 transition cursor-pointer whitespace-nowrap ${
                                    statusFilter === st
                                        ? 'bg-white text-blue-600 shadow-xs'
                                        : 'text-slate-600 hover:text-slate-900'
                                }`}
                            >
                                {st}
                            </button>
                        ))}
                    </div>

                    <div className="relative flex-1 lg:max-w-xs">
                        <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Cari nama agenda rapat..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2 pl-9 pr-8 text-xs font-medium text-slate-900 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/10"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            >
                                <X className="size-3.5" />
                            </button>
                        )}
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-600">
                        <thead className="border-b border-slate-200 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 bg-slate-50/50">
                        <tr>
                            <th className="py-3 px-3">Nama Agenda & Kode</th>
                            <th className="py-3 px-3">Tanggal Pelaksanaan</th>
                            <th className="py-3 px-3">Persentase Hadir</th>
                            <th className="py-3 px-3">Rincian Status</th>
                            <th className="py-3 px-3">Sesi Presensi</th>
                            <th className="py-3 px-3 text-right">Aksi</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                        {filteredAttendance.map((item) => {
                            const rate = ((item.presentCount / item.totalMembers) * 100).toFixed(0)

                            return (
                                <tr key={item.id} className="group transition hover:bg-slate-50/80">
                                    <td className="py-3.5 px-3">
                                        <div className="flex items-center gap-3">
                                            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100 font-bold text-xs">
                                                <Users className="size-4" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900 group-hover:text-blue-600 transition">{item.eventName}</p>
                                                <span className="font-mono text-[10px] font-semibold text-slate-400">{item.id}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-3.5 px-3 whitespace-nowrap">
                                        <p className="flex items-center gap-1 text-slate-700 font-medium">
                                            <Calendar className="size-3 text-slate-400" /> {item.date}
                                        </p>
                                    </td>
                                    <td className="py-3.5 px-3 whitespace-nowrap">
                                        <div className="w-28">
                                            <div className="flex items-center justify-between text-[11px] font-bold mb-1">
                                                <span className="text-slate-900">{rate}%</span>
                                                <span className="text-slate-400">{item.presentCount}/{item.totalMembers}</span>
                                            </div>
                                            <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full transition-all ${
                                                        Number(rate) >= 80 ? 'bg-emerald-500' : Number(rate) >= 60 ? 'bg-amber-500' : 'bg-red-500'
                                                    }`}
                                                    style={{ width: `${rate}%` }}
                                                />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-3.5 px-3 whitespace-nowrap">
                                        <div className="flex items-center gap-1.5 text-[10px] font-bold">
                                            <span className="rounded-md bg-emerald-50 text-emerald-700 px-1.5 py-0.5 border border-emerald-200">H: {item.presentCount}</span>
                                            <span className="rounded-md bg-blue-50 text-blue-700 px-1.5 py-0.5 border border-blue-200">I: {item.permissionCount}</span>
                                            <span className="rounded-md bg-amber-50 text-amber-700 px-1.5 py-0.5 border border-amber-200">S: {item.sickCount}</span>
                                            <span className="rounded-md bg-red-50 text-red-700 px-1.5 py-0.5 border border-red-200">A: {item.absentCount}</span>
                                        </div>
                                    </td>
                                    <td className="py-3.5 px-3 whitespace-nowrap">
                                        {item.status === 'Berlangsung' ? (
                                            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200 px-2.5 py-0.5 text-[10px] font-bold text-amber-700">
                                                    <Clock className="size-3 animate-pulse" />
                                                    <span>Berlangsung</span>
                                                </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">
                                                    <CheckCircle2 className="size-3" />
                                                    <span>Selesai</span>
                                                </span>
                                        )}
                                    </td>
                                    <td className="py-3.5 px-3 text-right whitespace-nowrap">
                                        <div className="flex items-center justify-end gap-1">
                                            <button
                                                title="Lihat Detail Rekap"
                                                onClick={() => setSelectedRecord(item)}
                                                className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-800 cursor-pointer"
                                            >
                                                <Eye className="size-4" />
                                            </button>
                                            <button
                                                title="Hapus Rekap"
                                                onClick={() => handleDelete(item.id, item.eventName)}
                                                className="rounded-lg p-1.5 text-slate-400 transition hover:bg-red-50 hover:text-red-600 cursor-pointer"
                                            >
                                                <Trash2 className="size-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                        </tbody>
                    </table>

                    {filteredAttendance.length === 0 && (
                        <div className="py-12 text-center">
                            <UserCheck className="mx-auto size-8 text-slate-300" />
                            <p className="mt-2 text-xs font-semibold text-slate-500">Tidak ada rekap presensi yang sesuai dengan pencarian.</p>
                        </div>
                    )}
                </div>
            </div>

            <AnimatePresence>
                {selectedRecord && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedRecord(null)}
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
                                    <span className="font-mono text-[10px] font-bold text-blue-600">{selectedRecord.id}</span>
                                    <h3 className="text-base font-bold text-slate-900">{selectedRecord.eventName}</h3>
                                </div>
                                <button
                                    onClick={() => setSelectedRecord(null)}
                                    className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition cursor-pointer"
                                >
                                    <X className="size-4.5" />
                                </button>
                            </div>

                            <div className="mt-4 space-y-3 text-xs">
                                <div className="flex justify-between py-1 border-b border-slate-100">
                                    <span className="text-slate-400 font-medium">Tanggal Sesi:</span>
                                    <span className="font-bold text-slate-900">{selectedRecord.date}</span>
                                </div>
                                <div className="flex justify-between py-1 border-b border-slate-100">
                                    <span className="text-slate-400 font-medium">Total Anggota Himpunan:</span>
                                    <span className="font-bold text-slate-900">{selectedRecord.totalMembers} Pengurus</span>
                                </div>
                                <div className="grid grid-cols-2 gap-2 pt-2">
                                    <div className="rounded-xl bg-emerald-50 p-2.5 text-center border border-emerald-100">
                                        <p className="text-[10px] font-bold text-emerald-600 uppercase">Hadir</p>
                                        <p className="text-lg font-black text-emerald-700">{selectedRecord.presentCount}</p>
                                    </div>
                                    <div className="rounded-xl bg-blue-50 p-2.5 text-center border border-blue-100">
                                        <p className="text-[10px] font-bold text-blue-600 uppercase">Izin</p>
                                        <p className="text-lg font-black text-blue-700">{selectedRecord.permissionCount}</p>
                                    </div>
                                    <div className="rounded-xl bg-amber-50 p-2.5 text-center border border-amber-100">
                                        <p className="text-[10px] font-bold text-amber-600 uppercase">Sakit</p>
                                        <p className="text-lg font-black text-amber-700">{selectedRecord.sickCount}</p>
                                    </div>
                                    <div className="rounded-xl bg-red-50 p-2.5 text-center border border-red-100">
                                        <p className="text-[10px] font-bold text-red-600 uppercase">Tanpa Ket.</p>
                                        <p className="text-lg font-black text-red-700">{selectedRecord.absentCount}</p>
                                    </div>
                                </div>

                                <div className="pt-4 flex gap-2">
                                    <button
                                        onClick={() => handleToggleSessionStatus(selectedRecord.id, selectedRecord.status)}
                                        className="flex-1 rounded-xl bg-slate-900 py-2.5 text-xs font-semibold text-white hover:bg-slate-800 transition cursor-pointer"
                                    >
                                        {selectedRecord.status === 'Berlangsung' ? 'Tutup Sesi Presensi' : 'Buka Kembali Sesi'}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isAddModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsAddModalOpen(false)}
                            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.98, y: 12 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.98, y: 12 }}
                            className="relative z-10 w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-xl sm:p-8"
                        >
                            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                                <div className="flex items-center gap-2.5 font-bold text-slate-900 text-base">
                                    <div className="grid size-8 place-items-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
                                        <Plus className="size-4" />
                                    </div>
                                    <span>Buka Sesi Presensi Baru</span>
                                </div>
                                <button
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition cursor-pointer"
                                >
                                    <X className="size-4.5" />
                                </button>
                            </div>

                            <div className="mt-5 space-y-4">
                                <div>
                                    <label className="mb-1 block text-xs font-semibold text-slate-700">
                                        Nama Agenda Rapat / Kegiatan <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formEventName}
                                        onChange={(e) => setFormEventName(e.target.value)}
                                        placeholder="Contoh: Rapat Pleno Persiapan Dies Natalis 2026"
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 px-3.5 text-xs font-medium text-slate-900 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/10"
                                    />
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="mb-1 block text-xs font-semibold text-slate-700">
                                            Total Anggota Target <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            value={formTotalMembers}
                                            onChange={(e) => setFormTotalMembers(e.target.value)}
                                            placeholder="40"
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 px-3.5 text-xs font-bold text-slate-900 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/10"
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-1 block text-xs font-semibold text-slate-700">
                                            Jumlah Hadir Saat Ini <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            value={formPresentCount}
                                            onChange={(e) => setFormPresentCount(e.target.value)}
                                            placeholder="32"
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 px-3.5 text-xs font-bold text-slate-900 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/10"
                                        />
                                    </div>
                                </div>

                                <div className="grid gap-3 grid-cols-3">
                                    <div>
                                        <label className="mb-1 block text-[11px] font-semibold text-slate-600">Izin</label>
                                        <input
                                            type="number"
                                            value={formPermissionCount}
                                            onChange={(e) => setFormPermissionCount(e.target.value)}
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2 px-3 text-xs font-bold text-slate-900 outline-none transition focus:border-blue-600"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-[11px] font-semibold text-slate-600">Sakit</label>
                                        <input
                                            type="number"
                                            value={formSickCount}
                                            onChange={(e) => setFormSickCount(e.target.value)}
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2 px-3 text-xs font-bold text-slate-900 outline-none transition focus:border-blue-600"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-[11px] font-semibold text-slate-600">Tanpa Ket.</label>
                                        <input
                                            type="number"
                                            value={formAbsentCount}
                                            onChange={(e) => setFormAbsentCount(e.target.value)}
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2 px-3 text-xs font-bold text-slate-900 outline-none transition focus:border-blue-600"
                                        />
                                    </div>
                                </div>

                                <div className="mt-6 flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
                                    <button
                                        type="button"
                                        onClick={() => setIsAddModalOpen(false)}
                                        className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleAddRecord}
                                        className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-blue-600/10 transition hover:bg-blue-500 active:scale-[0.98] cursor-pointer"
                                    >
                                        <CheckCircle2 className="size-4" />
                                        <span>Mulai Sesi Presensi</span>
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