'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import {
    Search,
    Trash2,
    Download,
    ChevronRight,
    X,
    MessageSquare,
    CheckCircle2,
    Clock,
    AlertCircle,
    XCircle,
    Loader2,
    ShieldAlert,
    Send,
    Lightbulb,
    Wrench,
    GraduationCap,
    HeartHandshake,
    User,
    EyeOff
} from 'lucide-react'

export interface AspirasiItem {
    id: string
    ticket_number: string
    sentiment: 'ide' | 'fasilitas' | 'akademik' | 'apresiasi'
    category: string
    is_anonymous: boolean
    sender_name: string | null
    sender_nim: string | null
    message: string
    status: 'Menunggu' | 'Diproses' | 'Selesai' | 'Ditolak'
    admin_title: string | null
    admin_response: string | null
    resolved_at: string | null
    created_at: string
}

const SENTIMENT_META: Record<
    string,
    { label: string; icon: React.ElementType; badgeClass: string }
> = {
    ide: {
        label: 'Ide & Inovasi',
        icon: Lightbulb,
        badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
    },
    fasilitas: {
        label: 'Kendala Fasilitas',
        icon: Wrench,
        badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
    },
    akademik: {
        label: 'Layanan Akademik',
        icon: GraduationCap,
        badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
    },
    apresiasi: {
        label: 'Saran & Apresiasi',
        icon: HeartHandshake,
        badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
}

export default function DashboardAspirasiPage() {
    const router = useRouter()

    const [isCheckingAuth, setIsCheckingAuth] = useState(true)
    const [isAuthorized, setIsAuthorized] = useState(false)

    const [aspirasiList, setAspirasiList] = useState<AspirasiItem[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)

    const [searchQuery, setSearchQuery] = useState('')
    const [activeTab, setActiveTab] = useState<string>('semua')
    const [selectedItems, setSelectedItems] = useState<string[]>([])

    const [activeModalItem, setActiveModalItem] = useState<AspirasiItem | null>(null)
    const [modalStatus, setModalStatus] = useState<AspirasiItem['status']>('Diproses')
    const [modalTitle, setModalTitle] = useState('')
    const [modalResponse, setModalResponse] = useState('')
    const [modalError, setModalError] = useState<string | null>(null)

    const supabase = useMemo(
        () =>
            createBrowserClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
            ),
        []
    )

    useEffect(() => {
        const verifyAdminAccess = async () => {
            setIsCheckingAuth(true)
            const {
                data: { user },
            } = await supabase.auth.getUser()

            if (!user) {
                router.replace('/login')
                return
            }

            const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', user.id)
                .single()

            const role = profile?.role || user.user_metadata?.role

            if (role !== 'admin') {
                setIsAuthorized(false)
                setIsCheckingAuth(false)
                return
            }

            setIsAuthorized(true)
            setIsCheckingAuth(false)
        }

        verifyAdminAccess()
    }, [supabase, router])

    const fetchAspirasi = async () => {
        setIsLoading(true)
        const { data, error } = await supabase
            .from('aspirasi')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Gagal memuat data aspirasi:', error.message)
        } else {
            setAspirasiList((data as AspirasiItem[]) || [])
        }
        setIsLoading(false)
    }

    useEffect(() => {
        if (isAuthorized) {
            fetchAspirasi()
        }
    }, [isAuthorized])

    const filteredAspirasi = useMemo(() => {
        return aspirasiList.filter((item) => {
            const statusStr = (item.status || 'Menunggu').toLowerCase()
            const matchesTab = activeTab === 'semua' || statusStr === activeTab

            const q = searchQuery.toLowerCase()
            const matchesSearch =
                (item.ticket_number || '').toLowerCase().includes(q) ||
                (item.sender_name || '').toLowerCase().includes(q) ||
                (item.sender_nim || '').toLowerCase().includes(q) ||
                (item.category || '').toLowerCase().includes(q) ||
                (item.message || '').toLowerCase().includes(q)

            return matchesTab && matchesSearch
        })
    }, [aspirasiList, activeTab, searchQuery])

    const getTabCount = (tabKey: string) => {
        if (tabKey === 'semua') return aspirasiList.length
        return aspirasiList.filter((a) => (a.status || '').toLowerCase() === tabKey).length
    }

    const toggleSelect = (id: string) => {
        setSelectedItems((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]))
    }

    const toggleSelectAll = () => {
        const currentIds = filteredAspirasi.map((a) => a.id)
        const allSelected = currentIds.length > 0 && currentIds.every((id) => selectedItems.includes(id))
        if (allSelected) {
            setSelectedItems((prev) => prev.filter((id) => !currentIds.includes(id)))
        } else {
            setSelectedItems((prev) => Array.from(new Set([...prev, ...currentIds])))
        }
    }

    const openResponseModal = (item: AspirasiItem) => {
        setModalError(null)
        setActiveModalItem(item)
        setModalStatus(item.status === 'Menunggu' ? 'Diproses' : item.status)
        setModalTitle(item.admin_title || '')
        setModalResponse(item.admin_response || '')
    }

    const handleSaveResponse = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!activeModalItem) return

        setModalError(null)
        setIsSaving(true)

        const isCompleted = modalStatus === 'Selesai'
        const payload = {
            status: modalStatus,
            admin_title: modalTitle.trim() || null,
            admin_response: modalResponse.trim() || null,
            resolved_at: isCompleted
                ? activeModalItem.resolved_at || new Date().toISOString()
                : null,
        }

        const { error } = await supabase
            .from('aspirasi')
            .update(payload)
            .eq('id', activeModalItem.id)

        if (error) {
            setModalError(`Gagal menyimpan tanggapan: ${error.message}`)
            setIsSaving(false)
            return
        }

        setIsSaving(false)
        setActiveModalItem(null)
        await fetchAspirasi()
    }

    const handleDelete = async (ids: string[]) => {
        if (!confirm(`Yakin ingin menghapus ${ids.length} data aspirasi ini secara permanen?`)) return

        setIsSaving(true)
        const { error } = await supabase.from('aspirasi').delete().in('id', ids)

        if (error) {
            alert(`Gagal menghapus aspirasi: ${error.message}`)
        } else {
            setSelectedItems((prev) => prev.filter((id) => !ids.includes(id)))
            await fetchAspirasi()
        }
        setIsSaving(false)
    }

    const handleExportCSV = () => {
        const headers = [
            'Nomor Tiket',
            'Tanggal',
            'Pengirim',
            'NIM',
            'Jenis',
            'Kategori',
            'Pesan Aspirasi',
            'Status',
            'Tanggapan Admin',
        ]
        const rows = filteredAspirasi.map((a) => [
            a.ticket_number,
            new Date(a.created_at).toLocaleDateString('id-ID'),
            `"${(a.is_anonymous ? 'Anonim Mahasiswa' : a.sender_name || '-').replace(/"/g, '""')}"`,
            a.is_anonymous ? '-' : a.sender_nim || '-',
            a.sentiment,
            `"${a.category.replace(/"/g, '""')}"`,
            `"${a.message.replace(/"/g, '""')}"`,
            a.status,
            `"${(a.admin_response || '-').replace(/"/g, '""')}"`,
        ])

        const csvContent =
            'data:text/csv;charset=utf-8,' +
            [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
        const encodedUri = encodeURI(csvContent)
        const link = document.createElement('a')
        link.setAttribute('href', encodedUri)
        link.setAttribute('download', `aspirasi-himatifa-${new Date().toISOString().split('T')[0]}.csv`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    if (isCheckingAuth) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-slate-500">
                <Loader2 className="size-7 animate-spin text-blue-600" />
                <p className="text-xs font-semibold">Memverifikasi hak akses administrator...</p>
            </div>
        )
    }

    if (!isAuthorized) {
        return (
            <div className="mx-auto my-12 max-w-md rounded-2xl border border-rose-200 bg-white p-8 text-center shadow-xs">
                <div className="mx-auto mb-4 grid size-14 place-items-center rounded-2xl bg-rose-50 text-rose-600 border border-rose-100">
                    <ShieldAlert className="size-7" />
                </div>
                <h2 className="text-lg font-extrabold text-slate-900">Akses Ditolak</h2>
                <p className="mt-2 text-xs leading-relaxed text-slate-500">
                    Halaman <strong>Manajemen Aspirasi & Advokasi</strong> hanya dapat diakses oleh akun dengan hak akses <strong>Admin</strong>.
                </p>
                <button
                    onClick={() => router.back()}
                    className="mt-6 inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-semibold text-white hover:bg-slate-800 cursor-pointer"
                >
                    Kembali ke Halaman Sebelumnya
                </button>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-5">
                <div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 mb-1">
                        <span>SIM HIMATIFA</span>
                        <ChevronRight className="size-3 text-slate-400" />
                        <span className="text-slate-500">Advokasi & Kesejahteraan</span>
                    </div>
                    <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                        Kotak Aspirasi Mahasiswa
                    </h1>
                    <p className="mt-1 text-xs sm:text-sm text-slate-500">
                        Tinjau, tindak lanjuti, dan publikasikan tanggapan resmi atas aduan serta gagasan mahasiswa.
                    </p>
                </div>

                <div className="flex items-center gap-2.5">
                    <button
                        type="button"
                        onClick={handleExportCSV}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-xs transition hover:border-slate-300 hover:bg-slate-50 active:scale-[0.98] cursor-pointer"
                    >
                        <Download className="size-4 text-slate-500" />
                        <span>Ekspor CSV</span>
                    </button>
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                            Total Aspirasi
                        </span>
                        <div className="grid size-9 place-items-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
                            <MessageSquare className="size-4.5" />
                        </div>
                    </div>
                    <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold text-slate-900">
                        {aspirasiList.length}
                    </h2>
                    <p className="mt-1 text-[11px] font-medium text-slate-400">Seluruh tiket masuk</p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                            Menunggu Review
                        </span>
                        <div className="grid size-9 place-items-center rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
                            <Clock className="size-4.5" />
                        </div>
                    </div>
                    <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold text-slate-900">
                        {getTabCount('menunggu')}
                    </h2>
                    <p className="mt-1 text-[11px] font-medium text-slate-400">Perlu segera ditanggapi</p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                            Sedang Diproses
                        </span>
                        <div className="grid size-9 place-items-center rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
                            <AlertCircle className="size-4.5" />
                        </div>
                    </div>
                    <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold text-slate-900">
                        {getTabCount('diproses')}
                    </h2>
                    <p className="mt-1 text-[11px] font-medium text-slate-400">Dalam koordinasi prodi/bph</p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                            Selesai & Publik
                        </span>
                        <div className="grid size-9 place-items-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                            <CheckCircle2 className="size-4.5" />
                        </div>
                    </div>
                    <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold text-slate-900">
                        {getTabCount('selesai')}
                    </h2>
                    <p className="mt-1 text-[11px] font-medium text-slate-400">Tampil di transparansi publik</p>
                </div>
            </div>

            <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-3 shadow-xs lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-1 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
                    {['Semua', 'Menunggu', 'Diproses', 'Selesai', 'Ditolak'].map((tab) => {
                        const tabKey = tab.toLowerCase()
                        const isActive = activeTab === tabKey
                        const count = getTabCount(tabKey)

                        return (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tabKey)}
                                className={`flex items-center gap-2 whitespace-nowrap rounded-xl px-3.5 py-2 text-xs font-bold transition-all cursor-pointer ${
                                    isActive
                                        ? 'bg-slate-900 text-white shadow-xs'
                                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                                }`}
                            >
                                <span>{tab}</span>
                                <span
                                    className={`rounded-md px-1.5 py-0.5 text-[10px] font-extrabold ${
                                        isActive ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-500'
                                    }`}
                                >
                                    {count}
                                </span>
                            </button>
                        )
                    })}
                </div>

                <div className="relative w-full lg:w-72">
                    <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Cari tiket, pengirim, kategori, isi..."
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

            {selectedItems.length > 0 && (
                <div className="flex items-center justify-between rounded-xl border border-blue-200 bg-blue-50/80 px-4 py-3 text-xs shadow-xs">
                    <div className="flex items-center gap-2 text-blue-900 font-semibold">
                        <span className="grid size-5 place-items-center rounded-full bg-blue-600 text-white text-[10px]">
                            {selectedItems.length}
                        </span>
                        <span>Aspirasi terpilih</span>
                    </div>
                    <button
                        disabled={isSaving}
                        onClick={() => handleDelete(selectedItems)}
                        className="rounded-lg bg-red-600 px-3 py-1.5 font-semibold text-white hover:bg-red-500 cursor-pointer"
                    >
                        Hapus Terpilih
                    </button>
                </div>
            )}

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead>
                        <tr className="border-b border-slate-200 bg-slate-50/60 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            <th className="w-12 px-5 py-3.5 text-center">
                                <input
                                    type="checkbox"
                                    checked={
                                        filteredAspirasi.length > 0 &&
                                        filteredAspirasi.every((a) => selectedItems.includes(a.id))
                                    }
                                    onChange={toggleSelectAll}
                                    className="size-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                />
                            </th>
                            <th className="px-4 py-3.5 font-bold">Tiket & Pengirim</th>
                            <th className="px-4 py-3.5 font-bold">Jenis & Kategori</th>
                            <th className="px-4 py-3.5 font-bold">Isi Aspirasi</th>
                            <th className="px-4 py-3.5 font-bold">Status</th>
                            <th className="px-5 py-3.5 text-right font-bold">Tindak Lanjut</th>
                        </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                        {isLoading ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center">
                                    <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-500">
                                        <Loader2 className="size-4 animate-spin text-blue-600" />
                                        <span>Memuat daftar aspirasi dari Supabase...</span>
                                    </div>
                                </td>
                            </tr>
                        ) : filteredAspirasi.length > 0 ? (
                            filteredAspirasi.map((item) => {
                                const isSelected = selectedItems.includes(item.id)
                                const sentMeta = SENTIMENT_META[item.sentiment] || SENTIMENT_META.ide
                                const SentIcon = sentMeta.icon

                                return (
                                    <tr
                                        key={item.id}
                                        className={`group transition-colors hover:bg-slate-50/80 ${
                                            isSelected ? 'bg-blue-50/30' : ''
                                        }`}
                                    >
                                        <td className="px-5 py-4 text-center">
                                            <input
                                                type="checkbox"
                                                checked={isSelected}
                                                onChange={() => toggleSelect(item.id)}
                                                className="size-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                            />
                                        </td>

                                        <td className="px-4 py-4">
                                            <div className="space-y-1">
                                                    <span className="font-mono text-[11px] font-extrabold text-blue-600">
                                                        {item.ticket_number}
                                                    </span>
                                                <div className="flex items-center gap-1.5 font-bold text-slate-900">
                                                    {item.is_anonymous ? (
                                                        <>
                                                            <EyeOff className="size-3.5 text-slate-400" />
                                                            <span className="text-slate-600 italic">Anonim Mahasiswa</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <User className="size-3.5 text-slate-400" />
                                                            <span>{item.sender_name || 'Mahasiswa'}</span>
                                                        </>
                                                    )}
                                                </div>
                                                <p className="text-[11px] text-slate-400">
                                                    {!item.is_anonymous && item.sender_nim
                                                        ? `NIM: ${item.sender_nim} • `
                                                        : ''}
                                                    {new Date(item.created_at).toLocaleDateString('id-ID', {
                                                        day: '2-digit',
                                                        month: 'short',
                                                        year: 'numeric',
                                                    })}
                                                </p>
                                            </div>
                                        </td>

                                        <td className="px-4 py-4">
                                            <div className="flex flex-col gap-1.5">
                                                    <span
                                                        className={`inline-flex w-fit items-center gap-1.5 rounded-lg border px-2 py-0.5 text-[10px] font-bold ${sentMeta.badgeClass}`}
                                                    >
                                                        <SentIcon className="size-3" />
                                                        {sentMeta.label}
                                                    </span>
                                                <span className="text-[11px] font-semibold text-slate-600">
                                                        {item.category}
                                                    </span>
                                            </div>
                                        </td>

                                        <td className="px-4 py-4 max-w-sm">
                                            <p className="line-clamp-2 text-xs text-slate-700 leading-relaxed">
                                                {item.message}
                                            </p>
                                            {item.admin_response && (
                                                <p className="mt-1 line-clamp-1 text-[11px] font-semibold text-emerald-700">
                                                    Balasan: {item.admin_response}
                                                </p>
                                            )}
                                        </td>

                                        <td className="px-4 py-4">
                                                <span
                                                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold border ${
                                                        item.status === 'Selesai'
                                                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                                            : item.status === 'Diproses'
                                                                ? 'bg-blue-50 text-blue-700 border-blue-200'
                                                                : item.status === 'Ditolak'
                                                                    ? 'bg-rose-50 text-rose-700 border-rose-200'
                                                                    : 'bg-amber-50 text-amber-700 border-amber-200'
                                                    }`}
                                                >
                                                    {item.status}
                                                </span>
                                        </td>

                                        <td className="px-5 py-4 text-right">
                                            <div className="flex items-center justify-end gap-1.5">
                                                <button
                                                    type="button"
                                                    onClick={() => openResponseModal(item)}
                                                    className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-1.5 text-[11px] font-bold text-blue-700 border border-blue-100 hover:bg-blue-600 hover:text-white transition-colors cursor-pointer"
                                                >
                                                    <Send className="size-3" />
                                                    <span>Tanggapi</span>
                                                </button>
                                                <button
                                                    type="button"
                                                    disabled={isSaving}
                                                    onClick={() => handleDelete([item.id])}
                                                    title="Hapus Aspirasi"
                                                    className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
                                                >
                                                    <Trash2 className="size-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })
                        ) : (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center">
                                    <div className="mx-auto flex max-w-xs flex-col items-center justify-center">
                                        <div className="grid size-12 place-items-center rounded-2xl bg-slate-100 text-slate-400 mb-3">
                                            <MessageSquare className="size-6" />
                                        </div>
                                        <p className="text-sm font-bold text-slate-900">
                                            Tidak ada aspirasi ditemukan
                                        </p>
                                        <p className="mt-1 text-xs text-slate-500">
                                            Belum ada aspirasi masuk pada filter status ini.
                                        </p>
                                    </div>
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>

                <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 px-5 py-3 text-xs text-slate-500 font-medium">
                    <span>
                        Menampilkan <strong className="text-slate-800">{filteredAspirasi.length}</strong> dari{' '}
                        <strong className="text-slate-800">{aspirasiList.length}</strong> total aspirasi
                    </span>
                    <span className="text-[11px] text-emerald-600 font-semibold">
                        Akses Khusus Admin • Tersinkronisasi
                    </span>
                </div>
            </div>

            {activeModalItem && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs">
                    <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                            <div>
                                <span className="font-mono text-xs font-extrabold text-blue-600">
                                    {activeModalItem.ticket_number}
                                </span>
                                <h2 className="text-lg font-extrabold text-slate-900">
                                    Tindak Lanjut & Tanggapan Resmi
                                </h2>
                            </div>
                            <button
                                onClick={() => setActiveModalItem(null)}
                                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
                            >
                                <X className="size-5" />
                            </button>
                        </div>

                        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-1.5 text-xs">
                            <div className="flex items-center justify-between text-[11px] text-slate-500">
                                <span className="font-bold text-slate-800">
                                    {activeModalItem.is_anonymous
                                        ? 'Anonim Mahasiswa'
                                        : `${activeModalItem.sender_name} (${activeModalItem.sender_nim || '-'})`}
                                </span>
                                <span>{activeModalItem.category}</span>
                            </div>
                            <p className="text-slate-700 leading-relaxed italic">
                                &quot;{activeModalItem.message}&quot;
                            </p>
                        </div>

                        {modalError && (
                            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-semibold text-red-700">
                                {modalError}
                            </div>
                        )}

                        <form onSubmit={handleSaveResponse} className="mt-5 space-y-4 text-xs">
                            <div>
                                <label className="mb-1.5 block font-bold text-slate-700">
                                    Status Penanganan
                                </label>
                                <select
                                    value={modalStatus}
                                    onChange={(e) =>
                                        setModalStatus(e.target.value as AspirasiItem['status'])
                                    }
                                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 font-semibold text-slate-900 outline-none focus:border-blue-600"
                                >
                                    <option value="Menunggu">Menunggu</option>
                                    <option value="Diproses">Diproses (Sedang Dikoordinasikan)</option>
                                    <option value="Selesai">Selesai (Tampilkan di Transparansi Publik)</option>
                                    <option value="Ditolak">Ditolak / Tidak Valid</option>
                                </select>
                            </div>

                            <div>
                                <label className="mb-1.5 block font-bold text-slate-700">
                                    Judul Ringkasan Advokasi (Untuk Kartu Transparansi Publik)
                                </label>
                                <input
                                    type="text"
                                    value={modalTitle}
                                    onChange={(e) => setModalTitle(e.target.value)}
                                    placeholder="Contoh: Perbaikan Wi-Fi & AC Lab Komputer Lt. 4"
                                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 font-medium text-slate-900 outline-none focus:border-blue-600"
                                />
                            </div>

                            <div>
                                <label className="mb-1.5 block font-bold text-slate-700">
                                    Tanggapan / Hasil Tindak Lanjut Resmi <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    required
                                    rows={4}
                                    value={modalResponse}
                                    onChange={(e) => setModalResponse(e.target.value)}
                                    placeholder="Tuliskan hasil koordinasi dengan prodi, fakultas, atau langkah penyelesaian dari pengurus HIMATIFA..."
                                    className="w-full rounded-xl border border-slate-200 p-3.5 font-medium text-slate-900 outline-none focus:border-blue-600"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-2.5 border-t border-slate-100 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setActiveModalItem(null)}
                                    className="rounded-xl border border-slate-200 px-4 py-2.5 font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 font-bold text-white shadow-md shadow-blue-600/10 hover:bg-blue-500 disabled:opacity-50 cursor-pointer"
                                >
                                    {isSaving && <Loader2 className="size-4 animate-spin" />}
                                    <span>Simpan Tanggapan</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
