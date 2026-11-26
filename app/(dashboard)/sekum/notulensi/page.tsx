'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { createBrowserClient } from '@supabase/ssr'
import {
    ClipboardList,
    Plus,
    Search,
    X,
    Trash2,
    CheckCircle2,
    XCircle,
    Sparkles,
    Calendar,
    Users,
    Tag,
    Eye,
    FileDown,
    UserCheck,
    MessageSquare,
    ChevronRight,
    Loader2,
    ShieldAlert,
    Pencil
} from 'lucide-react'

export type NotulensiCategory = 'Rapat Pleno' | 'Rapat BPH' | 'Rapat Evaluasi' | 'Rapat Koordinasi'

export interface NotulensiItem {
    id: string
    notulensi_code: string
    title: string
    category: NotulensiCategory
    meeting_date: string
    leader: string
    attendees_count: number
    summary: string
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

export default function SekumNotulensiPage() {
    const router = useRouter()

    const [isCheckingAuth, setIsCheckingAuth] = useState(true)
    const [isAuthorized, setIsAuthorized] = useState(false)
    const [currentUserId, setCurrentUserId] = useState<string | null>(null)

    const [notulensiList, setNotulensiList] = useState<NotulensiItem[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)

    const [activeTab, setActiveTab] = useState<string>('Semua')
    const [searchQuery, setSearchQuery] = useState<string>('')

    const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null)
    const [isFormModalOpen, setIsFormModalOpen] = useState<boolean>(false)
    const [editingItem, setEditingItem] = useState<NotulensiItem | null>(null)
    const [selectedNotulensi, setSelectedNotulensi] = useState<NotulensiItem | null>(null)

    const [formTitle, setFormTitle] = useState('')
    const [formCategory, setFormCategory] = useState<NotulensiCategory>('Rapat Pleno')
    const [formDate, setFormDate] = useState(() => new Date().toISOString().split('T')[0])
    const [formLeader, setFormLeader] = useState('')
    const [formAttendees, setFormAttendees] = useState('')
    const [formSummary, setFormSummary] = useState('')

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

    const fetchNotulensi = async () => {
        setIsLoading(true)
        const { data, error } = await supabase
            .from('notulensi_rapat')
            .select('*')
            .order('meeting_date', { ascending: false })
            .order('created_at', { ascending: false })

        if (!error && data) {
            setNotulensiList(
                data.map((row) => ({
                    ...row,
                    attendees_count: Number(row.attendees_count) || 0
                })) as NotulensiItem[]
            )
        }
        setIsLoading(false)
    }

    useEffect(() => {
        if (!isAuthorized) return

        fetchNotulensi()

        const channel = supabase
            .channel('notulensi-rapat-realtime')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'notulensi_rapat' },
                () => fetchNotulensi()
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [isAuthorized, supabase])

    const { totalRapat, totalBphPleno, totalPesertaAkumulasi } = useMemo(() => {
        const total = notulensiList.length
        const bphPleno = notulensiList.filter(
            (n) => n.category === 'Rapat BPH' || n.category === 'Rapat Pleno'
        ).length
        const pesertaSum = notulensiList.reduce((acc, curr) => acc + curr.attendees_count, 0)

        return { totalRapat: total, totalBphPleno: bphPleno, totalPesertaAkumulasi: pesertaSum }
    }, [notulensiList])

    const categories: ('Semua' | NotulensiCategory)[] = [
        'Semua',
        'Rapat Pleno',
        'Rapat BPH',
        'Rapat Evaluasi',
        'Rapat Koordinasi'
    ]

    const openCreateModal = () => {
        setEditingItem(null)
        setFormTitle('')
        setFormCategory('Rapat Pleno')
        setFormDate(new Date().toISOString().split('T')[0])
        setFormLeader('')
        setFormAttendees('')
        setFormSummary('')
        setIsFormModalOpen(true)
    }

    const openEditModal = (item: NotulensiItem) => {
        setEditingItem(item)
        setFormTitle(item.title)
        setFormCategory(item.category)
        setFormDate(item.meeting_date || new Date().toISOString().split('T')[0])
        setFormLeader(item.leader)
        setFormAttendees(String(item.attendees_count))
        setFormSummary(item.summary)
        setIsFormModalOpen(true)
    }

    const handleSaveNotulensi = async (e: React.FormEvent) => {
        e.preventDefault()

        const countNum = parseInt(formAttendees, 10)
        if (!formTitle.trim() || !formLeader.trim() || isNaN(countNum) || countNum <= 0 || !formSummary.trim()) {
            showToast('Mohon isi semua bidang formulir dengan benar!', 'error')
            return
        }

        setIsSaving(true)

        if (editingItem) {
            const { error } = await supabase
                .from('notulensi_rapat')
                .update({
                    title: formTitle.trim(),
                    category: formCategory,
                    meeting_date: formDate,
                    leader: formLeader.trim(),
                    attendees_count: countNum,
                    summary: formSummary.trim()
                })
                .eq('id', editingItem.id)

            if (error) {
                showToast(`Gagal memperbarui notulensi: ${error.message}`, 'error')
                setIsSaving(false)
                return
            }

            showToast(`Notulensi "${formTitle.trim()}" berhasil diperbarui.`)
        } else {
            const randomNum = Math.floor(100 + Math.random() * 900)
            const generatedCode = `NOT-${randomNum}`

            const { error } = await supabase.from('notulensi_rapat').insert({
                notulensi_code: generatedCode,
                title: formTitle.trim(),
                category: formCategory,
                meeting_date: formDate,
                leader: formLeader.trim(),
                attendees_count: countNum,
                summary: formSummary.trim(),
                created_by: currentUserId
            })

            if (error) {
                showToast(`Gagal menyimpan notulensi: ${error.message}`, 'error')
                setIsSaving(false)
                return
            }

            showToast(`Notulensi "${formTitle.trim()}" berhasil ditambahkan.`)
        }

        setIsSaving(false)
        setIsFormModalOpen(false)
        await fetchNotulensi()
    }

    const handleDelete = async (item: NotulensiItem) => {
        if (!confirm(`Apakah Anda yakin ingin menghapus notulensi "${item.title}"?`)) return

        const { error } = await supabase.from('notulensi_rapat').delete().eq('id', item.id)
        if (error) {
            showToast(`Gagal menghapus notulensi: ${error.message}`, 'error')
        } else {
            if (selectedNotulensi?.id === item.id) setSelectedNotulensi(null)
            showToast(`Notulensi "${item.title}" telah dihapus.`, 'info')
            await fetchNotulensi()
        }
    }

    const handleDownloadNotulensi = (item: NotulensiItem) => {
        const content = [
            'DOKUMEN NOTULENSI RAPAT - HIMATIFA',
            `Kode Arsip      : ${item.notulensi_code}`,
            `Judul Rapat     : ${item.title}`,
            `Jenis Rapat     : ${item.category}`,
            `Tanggal         : ${formatTanggalID(item.meeting_date)}`,
            `Pimpinan Rapat  : ${item.leader}`,
            `Jumlah Hadir    : ${item.attendees_count} Pengurus`,
            '----------------------------------------------------',
            'POIN PEMBAHASAN & KEPUTUSAN RAPAT:',
            '',
            item.summary,
            '',
            `Diunduh melalui SIM HIMATIFA pada ${new Date().toLocaleDateString('id-ID')}`
        ].join('\n')

        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `${item.notulensi_code}_${item.title.replace(/[^a-zA-Z0-9]/g, '_')}.txt`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)

        showToast(`Berkas notulensi ${item.notulensi_code} berhasil diunduh.`, 'info')
    }

    const filteredNotulensi = useMemo(() => {
        return notulensiList.filter((item) => {
            const matchesTab = activeTab === 'Semua' || item.category === activeTab
            const matchesSearch =
                item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.leader.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.notulensi_code.toLowerCase().includes(searchQuery.toLowerCase())
            return matchesTab && matchesSearch
        })
    }, [notulensiList, activeTab, searchQuery])

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
                    Modul <strong>Notulensi Rapat</strong> hanya dapat dikelola oleh <strong>Sekretaris Umum (Sekum)</strong> dan <strong>Administrator</strong>.
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
                        Notulensi & Hasil <span className="text-blue-600">Rapat</span>
                    </h1>
                    <p className="mt-1 text-xs sm:text-sm text-slate-500">
                        Dokumentasi poin pembahasan, keputusan, dan ketetapan agenda rapat pengurus HIMATIFA.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={openCreateModal}
                    className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-blue-600/10 transition hover:bg-blue-500 active:scale-[0.98] cursor-pointer shrink-0"
                >
                    <Plus className="size-4" />
                    <span>Buat Notulensi Baru</span>
                </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                            Total Notulensi Terarsip
                        </span>
                        <div className="grid size-9 place-items-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
                            <ClipboardList className="size-4.5" />
                        </div>
                    </div>
                    <p className="text-xl font-extrabold text-slate-900">{totalRapat} Catatan Rapat</p>
                    <p className="mt-0.5 text-[11px] text-slate-500 font-medium">Tersimpan dalam database</p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                            Rapat BPH & Pleno
                        </span>
                        <div className="grid size-9 place-items-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                            <Users className="size-4.5" />
                        </div>
                    </div>
                    <p className="text-xl font-extrabold text-slate-900">{totalBphPleno} Pertemuan</p>
                    <p className="mt-0.5 text-[11px] text-slate-500 font-medium">Agenda resmi BPH & Pleno</p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                            Total Kehadiran Peserta
                        </span>
                        <div className="grid size-9 place-items-center rounded-xl bg-sky-50 text-sky-600 border border-sky-100">
                            <UserCheck className="size-4.5" />
                        </div>
                    </div>
                    <p className="text-xl font-extrabold text-slate-900">{totalPesertaAkumulasi} Pengurus</p>
                    <p className="mt-0.5 text-[11px] text-slate-500 font-medium">Akumulasi peserta hadir</p>
                </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between border-b border-slate-100 pb-4">
                    <div className="flex gap-1 overflow-x-auto rounded-xl bg-slate-100 p-1 text-xs font-semibold">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveTab(cat)}
                                className={`rounded-lg px-3 py-1.5 transition cursor-pointer whitespace-nowrap ${
                                    activeTab === cat
                                        ? 'bg-white text-blue-600 shadow-xs'
                                        : 'text-slate-600 hover:text-slate-900'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    <div className="relative flex-1 lg:max-w-xs">
                        <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Cari judul, kode, atau pimpinan..."
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
                            <th className="py-3 px-3">Judul Rapat & Kode</th>
                            <th className="py-3 px-3">Jenis Rapat</th>
                            <th className="py-3 px-3">Pimpinan Rapat</th>
                            <th className="py-3 px-3">Tanggal & Hadir</th>
                            <th className="py-3 px-3 text-right">Aksi</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                        {isLoading ? (
                            <tr>
                                <td colSpan={5} className="py-12 text-center">
                                    <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-500">
                                        <Loader2 className="size-4 animate-spin text-blue-600" />
                                        <span>Memuat arsip notulensi dari Supabase...</span>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            filteredNotulensi.map((item) => (
                                <tr key={item.id} className="group transition hover:bg-slate-50/80">
                                    <td className="py-3.5 px-3">
                                        <div className="flex items-center gap-3">
                                            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100 font-bold text-xs">
                                                <MessageSquare className="size-4" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900 group-hover:text-blue-600 transition">
                                                    {item.title}
                                                </p>
                                                <span className="font-mono text-[10px] font-semibold text-slate-400">
                                                        {item.notulensi_code}
                                                    </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-3.5 px-3 whitespace-nowrap">
                                            <span className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-700 border border-slate-200">
                                                <Tag className="size-3 text-blue-600" />
                                                {item.category}
                                            </span>
                                    </td>
                                    <td className="py-3.5 px-3 font-semibold text-slate-800 whitespace-nowrap">
                                        {item.leader}
                                    </td>
                                    <td className="py-3.5 px-3 whitespace-nowrap">
                                        <p className="flex items-center gap-1 text-slate-700 font-medium">
                                            <Calendar className="size-3 text-slate-400" /> {formatTanggalID(item.meeting_date)}
                                        </p>
                                        <p className="text-[10px] text-blue-600 font-semibold">
                                            {item.attendees_count} Pengurus Hadir
                                        </p>
                                    </td>
                                    <td className="py-3.5 px-3 text-right whitespace-nowrap">
                                        <div className="flex items-center justify-end gap-1">
                                            <button
                                                type="button"
                                                title="Lihat Detail"
                                                onClick={() => setSelectedNotulensi(item)}
                                                className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-800 cursor-pointer"
                                            >
                                                <Eye className="size-4" />
                                            </button>
                                            <button
                                                type="button"
                                                title="Edit Notulensi"
                                                onClick={() => openEditModal(item)}
                                                className="rounded-lg p-1.5 text-slate-400 transition hover:bg-amber-50 hover:text-amber-600 cursor-pointer"
                                            >
                                                <Pencil className="size-4" />
                                            </button>
                                            <button
                                                type="button"
                                                title="Unduh Berkas Notulensi"
                                                onClick={() => handleDownloadNotulensi(item)}
                                                className="rounded-lg p-1.5 text-slate-400 transition hover:bg-blue-50 hover:text-blue-600 cursor-pointer"
                                            >
                                                <FileDown className="size-4" />
                                            </button>
                                            <button
                                                type="button"
                                                title="Hapus"
                                                onClick={() => handleDelete(item)}
                                                className="rounded-lg p-1.5 text-slate-400 transition hover:bg-red-50 hover:text-red-600 cursor-pointer"
                                            >
                                                <Trash2 className="size-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>

                    {!isLoading && filteredNotulensi.length === 0 && (
                        <div className="py-12 text-center">
                            <ClipboardList className="mx-auto size-8 text-slate-300" />
                            <p className="mt-2 text-xs font-semibold text-slate-500">
                                Tidak ada notulensi yang cocok dengan pencarian.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <AnimatePresence>
                {selectedNotulensi && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedNotulensi(null)}
                            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.98, y: 12 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.98, y: 12 }}
                            className="relative z-10 w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-xl"
                        >
                            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                <div>
                                    <span className="font-mono text-[10px] font-bold text-blue-600">
                                        {selectedNotulensi.notulensi_code}
                                    </span>
                                    <h3 className="text-base font-bold text-slate-900">{selectedNotulensi.title}</h3>
                                </div>
                                <button
                                    onClick={() => setSelectedNotulensi(null)}
                                    className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition cursor-pointer"
                                >
                                    <X className="size-4.5" />
                                </button>
                            </div>

                            <div className="mt-4 space-y-3 text-xs">
                                <div className="flex justify-between py-1 border-b border-slate-100">
                                    <span className="text-slate-400 font-medium">Jenis Rapat:</span>
                                    <span className="font-bold text-slate-900">{selectedNotulensi.category}</span>
                                </div>
                                <div className="flex justify-between py-1 border-b border-slate-100">
                                    <span className="text-slate-400 font-medium">Pimpinan Rapat:</span>
                                    <span className="font-bold text-slate-900">{selectedNotulensi.leader}</span>
                                </div>
                                <div className="flex justify-between py-1 border-b border-slate-100">
                                    <span className="text-slate-400 font-medium">Tanggal Pelaksanaan:</span>
                                    <span className="font-bold text-slate-900">
                                        {formatTanggalID(selectedNotulensi.meeting_date)}
                                    </span>
                                </div>
                                <div className="flex justify-between py-1 border-b border-slate-100">
                                    <span className="text-slate-400 font-medium">Jumlah Peserta Hadir:</span>
                                    <span className="font-bold text-emerald-600">
                                        {selectedNotulensi.attendees_count} Pengurus
                                    </span>
                                </div>
                                <div className="py-1">
                                    <span className="text-slate-400 font-medium block mb-1">Poin Ringkasan Hasil Rapat:</span>
                                    <div className="max-h-56 overflow-y-auto whitespace-pre-line rounded-xl bg-slate-50 p-3 text-slate-700 border border-slate-100 leading-relaxed font-medium">
                                        {selectedNotulensi.summary}
                                    </div>
                                </div>

                                <div className="pt-4 flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            handleDownloadNotulensi(selectedNotulensi)
                                            setSelectedNotulensi(null)
                                        }}
                                        className="w-full rounded-xl bg-blue-600 py-2.5 text-xs font-semibold text-white hover:bg-blue-500 transition cursor-pointer"
                                    >
                                        Unduh Berkas Notulensi
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isFormModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsFormModalOpen(false)}
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
                                        {editingItem ? <Pencil className="size-4" /> : <Plus className="size-4" />}
                                    </div>
                                    <span>{editingItem ? 'Edit Notulensi Rapat' : 'Catat Notulensi Rapat Baru'}</span>
                                </div>
                                <button
                                    onClick={() => setIsFormModalOpen(false)}
                                    className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition cursor-pointer"
                                >
                                    <X className="size-4.5" />
                                </button>
                            </div>

                            <form onSubmit={handleSaveNotulensi} className="mt-5 space-y-4">
                                <div>
                                    <label className="mb-1 block text-xs font-semibold text-slate-700">
                                        Judul / Topik Utama Rapat <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formTitle}
                                        onChange={(e) => setFormTitle(e.target.value)}
                                        placeholder="Contoh: Rapat Pleno Evaluasi Proker VIBRANUM 2026"
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 px-3.5 text-xs font-medium text-slate-900 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/10"
                                    />
                                </div>

                                <div className="grid gap-4 sm:grid-cols-3">
                                    <div>
                                        <label className="mb-1 block text-xs font-semibold text-slate-700">
                                            Tanggal Rapat
                                        </label>
                                        <input
                                            type="date"
                                            required
                                            value={formDate}
                                            onChange={(e) => setFormDate(e.target.value)}
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 px-3 text-xs font-medium text-slate-900 outline-none transition focus:border-blue-600 focus:bg-white"
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-1 block text-xs font-semibold text-slate-700">
                                            Jenis Rapat
                                        </label>
                                        <select
                                            value={formCategory}
                                            onChange={(e) => setFormCategory(e.target.value as NotulensiCategory)}
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 px-3 text-xs font-semibold text-slate-900 outline-none transition focus:border-blue-600 focus:bg-white cursor-pointer"
                                        >
                                            <option value="Rapat Pleno">Rapat Pleno</option>
                                            <option value="Rapat BPH">Rapat BPH</option>
                                            <option value="Rapat Evaluasi">Rapat Evaluasi</option>
                                            <option value="Rapat Koordinasi">Rapat Koordinasi</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="mb-1 block text-xs font-semibold text-slate-700">
                                            Jumlah Hadir <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            required
                                            min={1}
                                            value={formAttendees}
                                            onChange={(e) => setFormAttendees(e.target.value)}
                                            placeholder="Contoh: 30"
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 px-3.5 text-xs font-bold text-slate-900 outline-none transition focus:border-blue-600 focus:bg-white"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="mb-1 block text-xs font-semibold text-slate-700">
                                        Pimpinan Rapat <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formLeader}
                                        onChange={(e) => setFormLeader(e.target.value)}
                                        placeholder="Contoh: Muhammad Arya (Ketum)"
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 px-3.5 text-xs font-medium text-slate-900 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/10"
                                    />
                                </div>

                                <div>
                                    <label className="mb-1 block text-xs font-semibold text-slate-700">
                                        Poin Hasil Rapat / Kesimpulan <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        rows={4}
                                        required
                                        value={formSummary}
                                        onChange={(e) => setFormSummary(e.target.value)}
                                        placeholder="Tuliskan poin-poin keputusan utama hasil rapat..."
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50/70 p-3 text-xs font-medium text-slate-900 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/10 resize-none"
                                    />
                                </div>

                                <div className="mt-6 flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
                                    <button
                                        type="button"
                                        onClick={() => setIsFormModalOpen(false)}
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
                                        <span>{editingItem ? 'Simpan Perubahan' : 'Simpan Notulensi'}</span>
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