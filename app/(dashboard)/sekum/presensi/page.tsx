'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { createBrowserClient } from '@supabase/ssr'
import { QRCodeSVG } from 'qrcode.react'
import {
    UserCheck,
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
    Download,
    ChevronRight,
    QrCode,
    Copy,
    Check,
    Loader2,
    ShieldAlert,
    ExternalLink
} from 'lucide-react'

export type AttendanceSessionStatus = 'Berlangsung' | 'Selesai'
export type EntryStatus = 'Hadir' | 'Izin' | 'Sakit'

export interface PresensiEntry {
    id: string
    session_id: string
    full_name: string
    nim: string
    division: string
    attendance_status: EntryStatus
    notes: string | null
    checked_in_at: string
}

export interface PresensiSession {
    id: string
    session_code: string
    event_name: string
    session_date: string
    total_members: number
    status: AttendanceSessionStatus
    created_at: string
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

export default function SekumPresensiPage() {
    const router = useRouter()

    const [isCheckingAuth, setIsCheckingAuth] = useState(true)
    const [isAuthorized, setIsAuthorized] = useState(false)
    const [currentUserId, setCurrentUserId] = useState<string | null>(null)
    const [originUrl, setOriginUrl] = useState('')

    const [sessions, setSessions] = useState<PresensiSession[]>([])
    const [entries, setEntries] = useState<PresensiEntry[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)

    const [statusFilter, setStatusFilter] = useState<'Semua' | AttendanceSessionStatus>('Semua')
    const [searchQuery, setSearchQuery] = useState('')

    const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null)
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null)
    const [qrSession, setQrSession] = useState<PresensiSession | null>(null)
    const [copiedLink, setCopiedLink] = useState(false)

    const [formEventName, setFormEventName] = useState('')
    const [formDate, setFormDate] = useState(() => new Date().toISOString().split('T')[0])
    const [formTotalMembers, setFormTotalMembers] = useState('40')

    const supabase = useMemo(
        () =>
            createBrowserClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
            ),
        []
    )

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setOriginUrl(window.location.origin)
        }
    }, [])

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

    const fetchPresensiData = async () => {
        const [sessionRes, entryRes] = await Promise.all([
            supabase
                .from('presensi_sessions')
                .select('*')
                .order('session_date', { ascending: false })
                .order('created_at', { ascending: false }),
            supabase
                .from('presensi_entries')
                .select('*')
                .order('checked_in_at', { ascending: false })
        ])

        if (!sessionRes.error && sessionRes.data) {
            setSessions(sessionRes.data as PresensiSession[])
        }
        if (!entryRes.error && entryRes.data) {
            setEntries(entryRes.data as PresensiEntry[])
        }
        setIsLoading(false)
    }

    useEffect(() => {
        if (!isAuthorized) return

        fetchPresensiData()

        const channel = supabase
            .channel('sekum-presensi-realtime')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'presensi_sessions' },
                () => fetchPresensiData()
            )
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'presensi_entries' },
                () => fetchPresensiData()
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [isAuthorized, supabase])

    const enrichedSessions = useMemo(() => {
        return sessions.map((session) => {
            const sessionEntries = entries.filter((e) => e.session_id === session.id)
            const presentCount = sessionEntries.filter((e) => e.attendance_status === 'Hadir').length
            const permissionCount = sessionEntries.filter((e) => e.attendance_status === 'Izin').length
            const sickCount = sessionEntries.filter((e) => e.attendance_status === 'Sakit').length
            const totalRecorded = presentCount + permissionCount + sickCount
            const absentCount = Math.max(0, session.total_members - totalRecorded)

            return {
                ...session,
                entries: sessionEntries,
                presentCount,
                permissionCount,
                sickCount,
                absentCount
            }
        })
    }, [sessions, entries])

    const selectedRecord = useMemo(
        () => enrichedSessions.find((s) => s.id === selectedRecordId) || null,
        [enrichedSessions, selectedRecordId]
    )

    const { totalSessions, activeSessions, averageAttendanceRate } = useMemo(() => {
        const total = enrichedSessions.length
        const active = enrichedSessions.filter((a) => a.status === 'Berlangsung').length

        let sumRate = 0
        enrichedSessions.forEach((item) => {
            if (item.total_members > 0) {
                sumRate += Math.min(100, (item.presentCount / item.total_members) * 100)
            }
        })
        const avgRate = total > 0 ? (sumRate / total).toFixed(1) : '0'

        return { totalSessions: total, activeSessions: active, averageAttendanceRate: avgRate }
    }, [enrichedSessions])

    const handleAddRecord = async (e: React.FormEvent) => {
        e.preventDefault()

        const total = parseInt(formTotalMembers, 10)
        if (!formEventName.trim() || isNaN(total) || total <= 0) {
            showToast('Mohon isi nama agenda dan target jumlah anggota dengan benar!', 'error')
            return
        }

        setIsSaving(true)
        const randomCode = Math.random().toString(36).substring(2, 7).toUpperCase()
        const sessionCode = `PRES-${randomCode}`

        const { data, error } = await supabase
            .from('presensi_sessions')
            .insert({
                session_code: sessionCode,
                event_name: formEventName.trim(),
                session_date: formDate,
                total_members: total,
                status: 'Berlangsung',
                created_by: currentUserId
            })
            .select()
            .single()

        if (error) {
            showToast(`Gagal membuat sesi presensi: ${error.message}`, 'error')
            setIsSaving(false)
            return
        }

        setIsSaving(false)
        setIsAddModalOpen(false)
        setFormEventName('')
        showToast(`Sesi presensi "${data.event_name}" dibuka!`)
        await fetchPresensiData()

        setQrSession(data as PresensiSession)
    }

    const handleToggleSessionStatus = async (id: string, currentStatus: AttendanceSessionStatus) => {
        const newStatus: AttendanceSessionStatus = currentStatus === 'Berlangsung' ? 'Selesai' : 'Berlangsung'
        const { error } = await supabase
            .from('presensi_sessions')
            .update({ status: newStatus })
            .eq('id', id)

        if (error) {
            showToast(`Gagal mengubah status: ${error.message}`, 'error')
            return
        }

        if (qrSession?.id === id) {
            setQrSession({ ...qrSession, status: newStatus })
        }
        showToast(`Status sesi presensi diubah menjadi "${newStatus}".`)
        await fetchPresensiData()
    }

    const handleDelete = async (id: string, eventName: string) => {
        if (!confirm(`Apakah Anda yakin ingin menghapus sesi presensi "${eventName}" beserta seluruh data kehadirannya?`)) {
            return
        }

        const { error } = await supabase.from('presensi_sessions').delete().eq('id', id)
        if (error) {
            showToast(`Gagal menghapus sesi: ${error.message}`, 'error')
        } else {
            if (selectedRecordId === id) setSelectedRecordId(null)
            if (qrSession?.id === id) setQrSession(null)
            showToast(`Rekap presensi "${eventName}" telah dihapus.`, 'info')
            await fetchPresensiData()
        }
    }

    const handleDeleteEntry = async (entryId: string, fullName: string) => {
        if (!confirm(`Hapus data kehadiran atas nama "${fullName}"?`)) return
        const { error } = await supabase.from('presensi_entries').delete().eq('id', entryId)
        if (!error) {
            showToast(`Data kehadiran ${fullName} dihapus.`, 'info')
            await fetchPresensiData()
        }
    }

    const handleExportSessionCsv = (record: (typeof enrichedSessions)[number]) => {
        const rows = [
            'No,Nama Lengkap,NIM,Departemen,Status Kehadiran,Waktu Scan,Keterangan',
            ...record.entries.map((entry, idx) => {
                const timeStr = new Date(entry.checked_in_at).toLocaleTimeString('id-ID', {
                    hour: '2-digit',
                    minute: '2-digit'
                })
                return `${idx + 1},"${entry.full_name.replace(/"/g, '""')}","${entry.nim}","${entry.division}","${
                    entry.attendance_status
                }","${timeStr}","${(entry.notes || '-').replace(/"/g, '""')}"`
            })
        ].join('\n')

        const blob = new Blob([rows], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `Presensi_${record.session_code}_${record.event_name.replace(/[^a-zA-Z0-9]/g, '_')}.csv`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
    }

    const handleCopyLink = (code: string) => {
        const url = `${originUrl}/presensi/${code}`
        navigator.clipboard.writeText(url)
        setCopiedLink(true)
        setTimeout(() => setCopiedLink(false), 2000)
        showToast('Tautan presensi berhasil disalin!', 'info')
    }

    const filteredAttendance = useMemo(() => {
        return enrichedSessions.filter((item) => {
            const matchesStatus = statusFilter === 'Semua' || item.status === statusFilter
            const matchesSearch =
                item.event_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.session_code.toLowerCase().includes(searchQuery.toLowerCase())
            return matchesStatus && matchesSearch
        })
    }, [enrichedSessions, statusFilter, searchQuery])

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
                    Modul <strong>Presensi Pengurus</strong> hanya dapat dikelola oleh <strong>Sekretaris Umum (Sekum)</strong> dan <strong>Administrator</strong>.
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
                        <span className="text-slate-500">Sekretariat Umum (Sekum)</span>
                    </div>
                    <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                        Presensi QR & Kehadiran <span className="text-blue-600">Pengurus</span>
                    </h1>
                    <p className="mt-1 text-xs sm:text-sm text-slate-500">
                        Buat sesi rapat, tampilkan QR Code untuk di-scan pengurus, dan pantau kehadiran secara real-time.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => setIsAddModalOpen(true)}
                    className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-blue-600/10 transition hover:bg-blue-500 active:scale-[0.98] cursor-pointer shrink-0"
                >
                    <QrCode className="size-4" />
                    <span>Buka Sesi QR Baru</span>
                </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                            Total Sesi Teragenda
                        </span>
                        <div className="grid size-9 place-items-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
                            <UserCheck className="size-4.5" />
                        </div>
                    </div>
                    <p className="text-xl font-extrabold text-slate-900">{totalSessions} Sesi Rapat</p>
                    <p className="mt-0.5 text-[11px] text-slate-500 font-medium">{activeSessions} sesi sedang berlangsung</p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                            Rata-Rata Kehadiran
                        </span>
                        <div className="grid size-9 place-items-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                            <Percent className="size-4.5" />
                        </div>
                    </div>
                    <p className="text-xl font-extrabold text-emerald-600">{averageAttendanceRate}%</p>
                    <p className="mt-0.5 text-[11px] text-slate-500 font-medium">Persentase partisipasi pengurus</p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                            Status Sesi QR Aktif
                        </span>
                        <div className="grid size-9 place-items-center rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
                            <Clock className="size-4.5" />
                        </div>
                    </div>
                    <p className="text-xl font-extrabold text-slate-900">{activeSessions} Sesi Terbuka</p>
                    <p className="mt-0.5 text-[11px] text-slate-500 font-medium">Siap menerima scan QR pengurus</p>
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
                            placeholder="Cari nama agenda atau kode..."
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
                            <th className="py-3 px-3">Tanggal</th>
                            <th className="py-3 px-3">Persentase Hadir</th>
                            <th className="py-3 px-3">Rincian Status</th>
                            <th className="py-3 px-3">Sesi QR</th>
                            <th className="py-3 px-3 text-right">Aksi</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                        {isLoading ? (
                            <tr>
                                <td colSpan={6} className="py-12 text-center">
                                    <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-500">
                                        <Loader2 className="size-4 animate-spin text-blue-600" />
                                        <span>Memuat sesi presensi dari Supabase...</span>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            filteredAttendance.map((item) => {
                                const rate = Math.min(
                                    100,
                                    Math.round((item.presentCount / item.total_members) * 100)
                                )

                                return (
                                    <tr key={item.id} className="group transition hover:bg-slate-50/80">
                                        <td className="py-3.5 px-3">
                                            <div className="flex items-center gap-3">
                                                <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100 font-bold text-xs">
                                                    <Users className="size-4" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900 group-hover:text-blue-600 transition">
                                                        {item.event_name}
                                                    </p>
                                                    <span className="font-mono text-[10px] font-semibold text-slate-400">
                                                            {item.session_code}
                                                        </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3.5 px-3 whitespace-nowrap">
                                            <p className="flex items-center gap-1 text-slate-700 font-medium">
                                                <Calendar className="size-3 text-slate-400" />{' '}
                                                {formatTanggalID(item.session_date)}
                                            </p>
                                        </td>
                                        <td className="py-3.5 px-3 whitespace-nowrap">
                                            <div className="w-28">
                                                <div className="flex items-center justify-between text-[11px] font-bold mb-1">
                                                    <span className="text-slate-900">{rate}%</span>
                                                    <span className="text-slate-400">
                                                            {item.presentCount}/{item.total_members}
                                                        </span>
                                                </div>
                                                <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full transition-all ${
                                                            rate >= 80
                                                                ? 'bg-emerald-500'
                                                                : rate >= 60
                                                                    ? 'bg-amber-500'
                                                                    : 'bg-red-500'
                                                        }`}
                                                        style={{ width: `${rate}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3.5 px-3 whitespace-nowrap">
                                            <div className="flex items-center gap-1.5 text-[10px] font-bold">
                                                    <span className="rounded-md bg-emerald-50 text-emerald-700 px-1.5 py-0.5 border border-emerald-200">
                                                        H: {item.presentCount}
                                                    </span>
                                                <span className="rounded-md bg-blue-50 text-blue-700 px-1.5 py-0.5 border border-blue-200">
                                                        I: {item.permissionCount}
                                                    </span>
                                                <span className="rounded-md bg-amber-50 text-amber-700 px-1.5 py-0.5 border border-amber-200">
                                                        S: {item.sickCount}
                                                    </span>
                                                <span className="rounded-md bg-red-50 text-red-700 px-1.5 py-0.5 border border-red-200">
                                                        A: {item.absentCount}
                                                    </span>
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
                                            <div className="flex items-center justify-end gap-1.5">
                                                <button
                                                    type="button"
                                                    title="Tampilkan QR Code Presensi"
                                                    onClick={() => setQrSession(item)}
                                                    className="inline-flex items-center gap-1 rounded-lg bg-blue-50 border border-blue-200 px-2.5 py-1 text-[11px] font-bold text-blue-700 transition hover:bg-blue-600 hover:text-white cursor-pointer"
                                                >
                                                    <QrCode className="size-3.5" />
                                                    <span>QR Code</span>
                                                </button>
                                                <button
                                                    type="button"
                                                    title="Lihat Daftar Nama Hadir"
                                                    onClick={() => setSelectedRecordId(item.id)}
                                                    className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-800 cursor-pointer"
                                                >
                                                    <Eye className="size-4" />
                                                </button>
                                                <button
                                                    type="button"
                                                    title="Hapus Rekap"
                                                    onClick={() => handleDelete(item.id, item.event_name)}
                                                    className="rounded-lg p-1.5 text-slate-400 transition hover:bg-red-50 hover:text-red-600 cursor-pointer"
                                                >
                                                    <Trash2 className="size-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })
                        )}
                        </tbody>
                    </table>

                    {!isLoading && filteredAttendance.length === 0 && (
                        <div className="py-12 text-center">
                            <UserCheck className="mx-auto size-8 text-slate-300" />
                            <p className="mt-2 text-xs font-semibold text-slate-500">
                                Belum ada sesi presensi yang dibuat.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <AnimatePresence>
                {qrSession && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setQrSession(null)}
                            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.96, y: 12 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.96, y: 12 }}
                            className="relative z-10 w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-2xl sm:p-8"
                        >
                            <button
                                onClick={() => setQrSession(null)}
                                className="absolute right-4 top-4 rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition cursor-pointer"
                            >
                                <X className="size-5" />
                            </button>

                            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 border border-blue-200 px-3 py-1 font-mono text-[11px] font-extrabold text-blue-700">
                                {qrSession.session_code}
                            </span>
                            <h3 className="mt-2 text-lg font-extrabold text-slate-900">{qrSession.event_name}</h3>
                            <p className="mt-1 text-xs text-slate-500">
                                Arahkan kamera HP pengurus ke QR Code di bawah untuk mengisi daftar hadir
                            </p>

                            <div className="mx-auto my-6 flex w-fit flex-col items-center justify-center rounded-2xl border-2 border-dashed border-blue-200 bg-slate-50 p-5">
                                <QRCodeSVG
                                    value={`${originUrl}/presensi/${qrSession.session_code}`}
                                    size={210}
                                    level="H"
                                    includeMargin={true}
                                />
                                <p className="mt-2 font-mono text-[11px] font-bold text-slate-500">
                                    {originUrl}/presensi/{qrSession.session_code}
                                </p>
                            </div>

                            <div className="mb-4 flex items-center justify-center gap-2">
                                <span
                                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
                                        qrSession.status === 'Berlangsung'
                                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                            : 'bg-red-50 text-red-700 border border-red-200'
                                    }`}
                                >
                                    {qrSession.status === 'Berlangsung'
                                        ? 'Sesi Terbuka (Menerima Scan)'
                                        : 'Sesi Ditutup'}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-2.5">
                                <button
                                    type="button"
                                    onClick={() => handleCopyLink(qrSession.session_code)}
                                    className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                                >
                                    {copiedLink ? <Check className="size-4 text-emerald-600" /> : <Copy className="size-4" />}
                                    <span>{copiedLink ? 'Tersalin!' : 'Salin Tautan'}</span>
                                </button>
                                <a
                                    href={`/presensi/${qrSession.session_code}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white hover:bg-blue-500 transition"
                                >
                                    <ExternalLink className="size-4" />
                                    <span>Buka Form</span>
                                </a>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {selectedRecord && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedRecordId(null)}
                            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.98, y: 12 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.98, y: 12 }}
                            className="relative z-10 w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-xl"
                        >
                            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                <div>
                                    <span className="font-mono text-[10px] font-bold text-blue-600">
                                        {selectedRecord.session_code}
                                    </span>
                                    <h3 className="text-base font-bold text-slate-900">{selectedRecord.event_name}</h3>
                                </div>
                                <button
                                    onClick={() => setSelectedRecordId(null)}
                                    className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition cursor-pointer"
                                >
                                    <X className="size-4.5" />
                                </button>
                            </div>

                            <div className="mt-4 space-y-4 text-xs">
                                <div className="grid grid-cols-4 gap-2">
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

                                <div className="max-h-64 overflow-y-auto rounded-xl border border-slate-200">
                                    <table className="w-full text-left text-xs">
                                        <thead className="sticky top-0 bg-slate-50 border-b border-slate-200 text-[10px] font-extrabold uppercase text-slate-400">
                                        <tr>
                                            <th className="py-2.5 px-3">Nama & NIM</th>
                                            <th className="py-2.5 px-3">Departemen</th>
                                            <th className="py-2.5 px-3">Status</th>
                                            <th className="py-2.5 px-3 text-right">Waktu</th>
                                            <th className="py-2.5 px-2"></th>
                                        </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                        {selectedRecord.entries.map((entry) => (
                                            <tr key={entry.id} className="hover:bg-slate-50">
                                                <td className="py-2.5 px-3">
                                                    <p className="font-bold text-slate-900">{entry.full_name}</p>
                                                    <p className="font-mono text-[10px] text-slate-400">{entry.nim}</p>
                                                </td>
                                                <td className="py-2.5 px-3 text-slate-600 font-medium">
                                                    {entry.division}
                                                </td>
                                                <td className="py-2.5 px-3">
                                                        <span
                                                            className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                                                                entry.attendance_status === 'Hadir'
                                                                    ? 'bg-emerald-50 text-emerald-700'
                                                                    : entry.attendance_status === 'Izin'
                                                                        ? 'bg-blue-50 text-blue-700'
                                                                        : 'bg-amber-50 text-amber-700'
                                                            }`}
                                                        >
                                                            {entry.attendance_status}
                                                        </span>
                                                </td>
                                                <td className="py-2.5 px-3 text-right font-mono text-[10px] text-slate-400">
                                                    {new Date(entry.checked_in_at).toLocaleTimeString('id-ID', {
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </td>
                                                <td className="py-2.5 px-2 text-right">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDeleteEntry(entry.id, entry.full_name)}
                                                        className="p-1 text-slate-300 hover:text-red-600 cursor-pointer"
                                                        title="Hapus entri"
                                                    >
                                                        <Trash2 className="size-3.5" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        {selectedRecord.entries.length === 0 && (
                                            <tr>
                                                <td colSpan={5} className="py-8 text-center text-slate-400">
                                                    Belum ada pengurus yang melakukan scan QR pada sesi ini.
                                                </td>
                                            </tr>
                                        )}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="pt-2 flex flex-wrap gap-2">
                                    <button
                                        type="button"
                                        onClick={() => handleExportSessionCsv(selectedRecord)}
                                        className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                                    >
                                        <Download className="size-4" />
                                        <span>Export CSV</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleToggleSessionStatus(selectedRecord.id, selectedRecord.status)
                                        }
                                        className="flex-1 rounded-xl bg-slate-900 py-2.5 text-xs font-semibold text-white hover:bg-slate-800 transition cursor-pointer"
                                    >
                                        {selectedRecord.status === 'Berlangsung'
                                            ? 'Tutup Sesi Presensi'
                                            : 'Buka Kembali Sesi'}
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
                                        <QrCode className="size-4" />
                                    </div>
                                    <span>Buka Sesi Presensi QR Baru</span>
                                </div>
                                <button
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition cursor-pointer"
                                >
                                    <X className="size-4.5" />
                                </button>
                            </div>

                            <form onSubmit={handleAddRecord} className="mt-5 space-y-4">
                                <div>
                                    <label className="mb-1 block text-xs font-semibold text-slate-700">
                                        Nama Agenda Rapat / Kegiatan <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formEventName}
                                        onChange={(e) => setFormEventName(e.target.value)}
                                        placeholder="Contoh: Rapat Pleno Persiapan Dies Natalis 2026"
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 px-3.5 text-xs font-medium text-slate-900 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/10"
                                    />
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="mb-1 block text-xs font-semibold text-slate-700">
                                            Tanggal Pelaksanaan
                                        </label>
                                        <input
                                            type="date"
                                            required
                                            value={formDate}
                                            onChange={(e) => setFormDate(e.target.value)}
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 px-3.5 text-xs font-medium text-slate-900 outline-none transition focus:border-blue-600 focus:bg-white"
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-1 block text-xs font-semibold text-slate-700">
                                            Total Pengurus Aktif <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            required
                                            min={1}
                                            value={formTotalMembers}
                                            onChange={(e) => setFormTotalMembers(e.target.value)}
                                            placeholder="40"
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 px-3.5 text-xs font-bold text-slate-900 outline-none transition focus:border-blue-600 focus:bg-white"
                                        />
                                    </div>
                                </div>

                                <p className="rounded-xl bg-blue-50/70 border border-blue-100 p-3 text-[11px] text-blue-700 leading-relaxed">
                                    Setelah sesi dibuat, sistem akan langsung menghasilkan <strong>QR Code unik</strong> yang bisa di-scan pengurus untuk mencatat kehadiran otomatis ke database.
                                </p>

                                <div className="mt-6 flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
                                    <button
                                        type="button"
                                        onClick={() => setIsAddModalOpen(false)}
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
                                        <span>Buat Sesi & Tampilkan QR</span>
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