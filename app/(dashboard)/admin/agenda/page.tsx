'use client'

import { useState, useEffect, useMemo } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import {
    Plus,
    Edit3,
    Trash2,
    Download,
    Calendar,
    MapPin,
    Clock,
    Search,
    CalendarDays,
    ChevronRight,
    Tag,
    X,
    Loader2
} from 'lucide-react'

export interface AgendaItem {
    id: string
    title: string
    type: string
    status: 'Akan Datang' | 'Berlangsung' | 'Selesai' | 'Draft'
    date: string
    time: string
    location: string
    division: string
    description: string | null
}

interface AgendaForm {
    id?: string
    title: string
    type: string
    status: 'Akan Datang' | 'Berlangsung' | 'Selesai' | 'Draft'
    date: string
    time: string
    location: string
    division: string
    description: string
}

function formatTanggalAgenda(dateStr: string) {
    if (!dateStr) return '-'
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) return dateStr
    return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    })
}

export default function AdminAgendaPage() {
    const [agendas, setAgendas] = useState<AgendaItem[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)

    const [searchQuery, setSearchQuery] = useState('')
    const [activeTab, setActiveTab] = useState<string>('semua')
    const [selectedItems, setSelectedItems] = useState<string[]>([])

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [formError, setFormError] = useState<string | null>(null)
    const [formData, setFormData] = useState<AgendaForm>({
        title: '',
        type: 'Program Kerja',
        status: 'Akan Datang',
        date: new Date().toISOString().split('T')[0],
        time: '08:00 - Selesai',
        location: 'Kampus UMSurabaya',
        division: 'BPH HIMATIFA',
        description: '',
    })

    const supabase = useMemo(
        () =>
            createBrowserClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
            ),
        []
    )

    const fetchAgendas = async () => {
        setIsLoading(true)
        const { data, error } = await supabase
            .from('agenda')
            .select('*')
            .order('date', { ascending: false })
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Gagal memuat agenda:', error.message)
        } else {
            setAgendas((data as AgendaItem[]) || [])
        }
        setIsLoading(false)
    }

    useEffect(() => {
        fetchAgendas()
    }, [])

    const filteredAgendas = useMemo(() => {
        return (agendas || []).filter((item) => {
            const statusStr = (item.status || 'Akan Datang').toLowerCase()
            const targetTab = activeTab.replace('-', ' ')
            const matchesTab = activeTab === 'semua' || statusStr === targetTab

            const titleStr = (item.title || '').toLowerCase()
            const locStr = (item.location || '').toLowerCase()
            const divStr = (item.division || '').toLowerCase()
            const typeStr = (item.type || '').toLowerCase()
            const query = searchQuery.toLowerCase()

            const matchesSearch =
                titleStr.includes(query) ||
                locStr.includes(query) ||
                divStr.includes(query) ||
                typeStr.includes(query)

            return matchesTab && matchesSearch
        })
    }, [agendas, activeTab, searchQuery])

    const getTabCount = (tabKey: string) => {
        if (tabKey === 'semua') return agendas.length
        const targetTab = tabKey.replace('-', ' ')
        return agendas.filter((a) => (a.status || '').toLowerCase() === targetTab).length
    }

    const toggleSelect = (id: string) => {
        setSelectedItems((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]))
    }

    const toggleSelectAll = () => {
        const currentFilteredIds = filteredAgendas.map((a) => a.id)
        const isAllSelected =
            currentFilteredIds.length > 0 &&
            currentFilteredIds.every((id) => selectedItems.includes(id))

        if (isAllSelected) {
            setSelectedItems((prev) => prev.filter((id) => !currentFilteredIds.includes(id)))
        } else {
            setSelectedItems((prev) => Array.from(new Set([...prev, ...currentFilteredIds])))
        }
    }

    const openCreateModal = () => {
        setFormError(null)
        setFormData({
            title: '',
            type: 'Program Kerja',
            status: 'Akan Datang',
            date: new Date().toISOString().split('T')[0],
            time: '08:00 - Selesai',
            location: 'Kampus UMSurabaya',
            division: 'BPH HIMATIFA',
            description: '',
        })
        setIsModalOpen(true)
    }

    const openEditModal = (item: AgendaItem) => {
        setFormError(null)
        setFormData({
            id: item.id,
            title: item.title,
            type: item.type || 'Program Kerja',
            status: item.status,
            date: item.date,
            time: item.time || '08:00 - Selesai',
            location: item.location || 'Kampus UMSurabaya',
            division: item.division || 'BPH HIMATIFA',
            description: item.description || '',
        })
        setIsModalOpen(true)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setFormError(null)
        setIsSaving(true)

        const payload = {
            title: formData.title.trim(),
            type: formData.type.trim() || 'Program Kerja',
            status: formData.status,
            date: formData.date,
            time: formData.time.trim() || '08:00 - Selesai',
            location: formData.location.trim() || 'Kampus UMSurabaya',
            division: formData.division.trim() || 'BPH HIMATIFA',
            description: formData.description.trim() || null,
        }

        if (formData.id) {
            const { error } = await supabase
                .from('agenda')
                .update(payload)
                .eq('id', formData.id)

            if (error) {
                setFormError(`Gagal memperbarui agenda: ${error.message}`)
                setIsSaving(false)
                return
            }
        } else {
            const { error } = await supabase.from('agenda').insert(payload)

            if (error) {
                setFormError(`Gagal menambahkan agenda: ${error.message}`)
                setIsSaving(false)
                return
            }
        }

        setIsSaving(false)
        setIsModalOpen(false)
        await fetchAgendas()
    }

    const handleDelete = async (ids: string[]) => {
        if (!confirm(`Yakin ingin menghapus ${ids.length} agenda ini secara permanen?`)) return

        setIsSaving(true)
        const { error } = await supabase.from('agenda').delete().in('id', ids)

        if (error) {
            alert(`Gagal menghapus agenda: ${error.message}`)
        } else {
            setSelectedItems((prev) => prev.filter((id) => !ids.includes(id)))
            await fetchAgendas()
        }
        setIsSaving(false)
    }

    const handleBulkStatus = async (status: 'Akan Datang' | 'Berlangsung' | 'Selesai' | 'Draft') => {
        setIsSaving(true)
        const { error } = await supabase
            .from('agenda')
            .update({ status })
            .in('id', selectedItems)

        if (error) {
            alert(`Gagal mengubah status: ${error.message}`)
        } else {
            setSelectedItems([])
            await fetchAgendas()
        }
        setIsSaving(false)
    }

    const handleExportCSV = () => {
        const headers = ['Nama Agenda', 'Tipe', 'Status', 'Tanggal', 'Waktu', 'Lokasi', 'Pelaksana / Divisi', 'Keterangan']
        const rows = filteredAgendas.map((a) => [
            `"${a.title.replace(/"/g, '""')}"`,
            a.type,
            a.status,
            a.date,
            `"${a.time.replace(/"/g, '""')}"`,
            `"${a.location.replace(/"/g, '""')}"`,
            `"${a.division.replace(/"/g, '""')}"`,
            `"${(a.description || '-').replace(/"/g, '""')}"`,
        ])
        const csvContent =
            'data:text/csv;charset=utf-8,' +
            [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
        const encodedUri = encodeURI(csvContent)
        const link = document.createElement('a')
        link.setAttribute('href', encodedUri)
        link.setAttribute('download', `agenda-himatifa-${new Date().toISOString().split('T')[0]}.csv`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-5">
                <div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 mb-1">
                        <span>SIM HIMATIFA</span>
                        <ChevronRight className="size-3 text-slate-400" />
                        <span className="text-slate-500">Modul Administrasi</span>
                    </div>
                    <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                        Agenda & Kegiatan Organisasi
                    </h1>
                    <p className="mt-1 text-xs sm:text-sm text-slate-500">
                        Kelola penjadwalan program kerja, rapat internal, serta agenda kegiatan mahasiswa.
                    </p>
                </div>

                <div className="flex items-center gap-2.5">
                    <button
                        type="button"
                        onClick={handleExportCSV}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-xs transition hover:border-slate-300 hover:bg-slate-50 active:scale-[0.98] cursor-pointer"
                    >
                        <Download className="size-4 text-slate-500" />
                        <span>Ekspor Kalender</span>
                    </button>
                    <button
                        type="button"
                        onClick={openCreateModal}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-blue-600/10 transition hover:bg-blue-500 active:scale-[0.98] cursor-pointer"
                    >
                        <Plus className="size-4" />
                        <span>Tambah Agenda</span>
                    </button>
                </div>
            </div>

            <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-3 shadow-xs lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-1 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
                    {['Semua', 'Akan Datang', 'Berlangsung', 'Selesai', 'Draft'].map((tab) => {
                        const tabKey = tab.toLowerCase().replace(' ', '-')
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
                        placeholder="Cari agenda, lokasi, divisi..."
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
                <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-blue-200 bg-blue-50/80 px-4 py-3 text-xs shadow-xs">
                    <div className="flex items-center gap-2 text-blue-900 font-semibold">
                        <span className="grid size-5 place-items-center rounded-full bg-blue-600 text-white text-[10px]">
                            {selectedItems.length}
                        </span>
                        <span>Agenda terpilih</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <button
                            disabled={isSaving}
                            onClick={() => handleBulkStatus('Berlangsung')}
                            className="rounded-lg border border-rose-200 bg-white px-3 py-1.5 font-semibold text-rose-700 hover:bg-rose-50 cursor-pointer"
                        >
                            Set Berlangsung
                        </button>
                        <button
                            disabled={isSaving}
                            onClick={() => handleBulkStatus('Selesai')}
                            className="rounded-lg border border-emerald-200 bg-white px-3 py-1.5 font-semibold text-emerald-700 hover:bg-emerald-50 cursor-pointer"
                        >
                            Set Selesai
                        </button>
                        <button
                            disabled={isSaving}
                            onClick={() => handleDelete(selectedItems)}
                            className="rounded-lg bg-red-600 px-3 py-1.5 font-semibold text-white hover:bg-red-500 cursor-pointer"
                        >
                            Hapus Terpilih
                        </button>
                    </div>
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
                                        filteredAgendas.length > 0 &&
                                        filteredAgendas.every((a) => selectedItems.includes(a.id))
                                    }
                                    onChange={toggleSelectAll}
                                    className="size-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                />
                            </th>
                            <th className="px-4 py-3.5 font-bold">Nama & Tipe Agenda</th>
                            <th className="px-4 py-3.5 font-bold">Status</th>
                            <th className="px-4 py-3.5 font-bold">Jadwal & Lokasi</th>
                            <th className="px-4 py-3.5 font-bold">Pelaksana</th>
                            <th className="px-5 py-3.5 text-right font-bold">Aksi</th>
                        </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                        {isLoading ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center">
                                    <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-500">
                                        <Loader2 className="size-4 animate-spin text-blue-600" />
                                        <span>Memuat jadwal agenda dari Supabase...</span>
                                    </div>
                                </td>
                            </tr>
                        ) : filteredAgendas.length > 0 ? (
                            filteredAgendas.map((item) => {
                                const isSelected = selectedItems.includes(item.id)
                                const statusLabel = item.status || 'Akan Datang'

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
                                            <div className="flex items-start gap-3">
                                                <div className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-xl border border-slate-200 bg-slate-50 text-slate-500 group-hover:border-blue-200 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                                                    <CalendarDays className="size-4.5" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                                        {item.title}
                                                    </p>
                                                    <div className="mt-1 flex flex-wrap items-center gap-2">
                                                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-400">
                                                                <Tag className="size-3" />
                                                                {item.type || 'Program Kerja'}
                                                            </span>
                                                        {item.description && (
                                                            <span className="text-[10px] text-slate-400 line-clamp-1 max-w-xs">
                                                                    • {item.description}
                                                                </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-4 py-4">
                                                <span
                                                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold border ${
                                                        statusLabel === 'Selesai'
                                                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                                            : statusLabel === 'Berlangsung'
                                                                ? 'bg-rose-50 text-rose-700 border-rose-200'
                                                                : statusLabel === 'Akan Datang'
                                                                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                                                                    : 'bg-slate-100 text-slate-600 border-slate-200'
                                                    }`}
                                                >
                                                    <span
                                                        className={`size-1.5 rounded-full ${
                                                            statusLabel === 'Selesai'
                                                                ? 'bg-emerald-500'
                                                                : statusLabel === 'Berlangsung'
                                                                    ? 'bg-rose-500 animate-pulse'
                                                                    : statusLabel === 'Akan Datang'
                                                                        ? 'bg-blue-500'
                                                                        : 'bg-slate-400'
                                                        }`}
                                                    />
                                                    {statusLabel}
                                                </span>
                                        </td>

                                        <td className="px-4 py-4">
                                            <div className="flex flex-col gap-1 text-slate-600">
                                                <div className="flex items-center gap-2 font-semibold text-slate-800">
                                                    <Calendar className="size-3.5 text-slate-400 shrink-0" />
                                                    <span>{formatTanggalAgenda(item.date)}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-slate-500">
                                                    <Clock className="size-3.5 text-slate-400 shrink-0" />
                                                    <span>{item.time || '08:00 - Selesai'}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-slate-500">
                                                    <MapPin className="size-3.5 text-slate-400 shrink-0" />
                                                    <span className="max-w-[180px] truncate">
                                                            {item.location || 'Kampus UMSurabaya'}
                                                        </span>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-4 py-4">
                                                <span className="inline-flex rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-bold text-slate-700">
                                                    {item.division || 'BPH HIMATIFA'}
                                                </span>
                                        </td>

                                        <td className="px-5 py-4 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <button
                                                    type="button"
                                                    onClick={() => openEditModal(item)}
                                                    title="Edit Agenda"
                                                    className="rounded-lg p-1.5 text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-pointer"
                                                >
                                                    <Edit3 className="size-4" />
                                                </button>
                                                <button
                                                    type="button"
                                                    disabled={isSaving}
                                                    onClick={() => handleDelete([item.id])}
                                                    title="Hapus Agenda"
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
                                            <Calendar className="size-6" />
                                        </div>
                                        <p className="text-sm font-bold text-slate-900">
                                            Belum ada agenda terjadwal
                                        </p>
                                        <p className="mt-1 text-xs text-slate-500">
                                            Klik tombol &quot;Tambah Agenda&quot; untuk menjadwalkan program kerja atau rapat pengurus.
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
                        Menampilkan <strong className="text-slate-800">{filteredAgendas.length}</strong> dari{' '}
                        <strong className="text-slate-800">{agendas.length}</strong> total agenda
                    </span>
                    <span className="text-[11px] text-emerald-600 font-semibold">
                        Tersimpan di Supabase
                    </span>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs">
                    <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                            <div>
                                <h2 className="text-lg font-extrabold text-slate-900">
                                    {formData.id ? 'Edit Agenda Kegiatan' : 'Tambah Agenda Kegiatan Baru'}
                                </h2>
                                <p className="text-xs text-slate-500">
                                    Catat jadwal kegiatan, rapat internal, atau program kerja HIMATIFA.
                                </p>
                            </div>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
                            >
                                <X className="size-5" />
                            </button>
                        </div>

                        {formError && (
                            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-semibold text-red-700">
                                {formError}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-xs">
                            <div>
                                <label className="mb-1.5 block font-bold text-slate-700">
                                    Nama Agenda / Kegiatan <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="Contoh: Rapat Kerja Pengurus & Upgrading HIMATIFA"
                                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 font-medium text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10"
                                />
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="mb-1.5 block font-bold text-slate-700">Tipe Kegiatan</label>
                                    <select
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                        className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 font-medium text-slate-900 outline-none focus:border-blue-600"
                                    >
                                        <option value="Program Kerja">Program Kerja</option>
                                        <option value="Rapat Internal">Rapat Internal</option>
                                        <option value="Seminar / Workshop">Seminar / Workshop</option>
                                        <option value="Lomba / Kompetisi">Lomba / Kompetisi</option>
                                        <option value="Pengabdian Masyarakat">Pengabdian Masyarakat</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="mb-1.5 block font-bold text-slate-700">Status Pelaksanaan</label>
                                    <select
                                        value={formData.status}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                status: e.target.value as AgendaForm['status'],
                                            })
                                        }
                                        className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 font-medium text-slate-900 outline-none focus:border-blue-600"
                                    >
                                        <option value="Akan Datang">Akan Datang</option>
                                        <option value="Berlangsung">Berlangsung</option>
                                        <option value="Selesai">Selesai</option>
                                        <option value="Draft">Draft (Rencana)</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="mb-1.5 block font-bold text-slate-700">
                                        Tanggal Pelaksanaan <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        required
                                        value={formData.date}
                                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                        className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 font-medium text-slate-900 outline-none focus:border-blue-600"
                                    />
                                </div>

                                <div>
                                    <label className="mb-1.5 block font-bold text-slate-700">Waktu</label>
                                    <input
                                        type="text"
                                        value={formData.time}
                                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                        placeholder="08:00 - 15:00 WIB"
                                        className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 font-medium text-slate-900 outline-none focus:border-blue-600"
                                    />
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="mb-1.5 block font-bold text-slate-700">Lokasi / Tempat</label>
                                    <input
                                        type="text"
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                        placeholder="Auditorium Gedung G UMSurabaya"
                                        className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 font-medium text-slate-900 outline-none focus:border-blue-600"
                                    />
                                </div>

                                {/* Pelaksana / Divisi */}
                                <div>
                                    <label className="mb-1.5 block font-bold text-slate-700">Pelaksana / Divisi</label>
                                    <input
                                        type="text"
                                        value={formData.division}
                                        onChange={(e) => setFormData({ ...formData, division: e.target.value })}
                                        placeholder="Contoh: Divisi Ristek / BPH"
                                        className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 font-medium text-slate-900 outline-none focus:border-blue-600"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="mb-1.5 block font-bold text-slate-700">Catatan / Keterangan (Opsional)</label>
                                <textarea
                                    rows={3}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Tambahkan detail singkat, dresscode, atau target peserta..."
                                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 font-medium text-slate-900 outline-none focus:border-blue-600"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-2.5 border-t border-slate-100 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
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
                                    <span>{formData.id ? 'Simpan Perubahan' : 'Simpan Agenda'}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}