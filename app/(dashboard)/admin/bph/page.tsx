'use client'

import { useState, useEffect, useMemo } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import {
    Plus,
    Edit3,
    Trash2,
    Download,
    Search,
    Shield,
    ShieldAlert,
    GraduationCap,
    ChevronRight,
    X,
    Users,
    Loader2,
    UserCheck,
    Link2,
    Upload
} from 'lucide-react'

const defaultAvatar = '/default.jpeg'

const jabatanOptions = [
    'Ketua Himpunan',
    'Wakil Ketua Himpunan',
    'Sekretaris Himpunan',
    'Bendahara Himpunan',
    'Ketua Departement',
    'Sekretaris Departement',
    'Anggota Department',
] as const

const bphIntiRoles = [
    'Ketua Himpunan',
    'Wakil Ketua Himpunan',
    'Sekretaris Himpunan',
    'Bendahara Himpunan',
]

const departemenOptions = [
    'PSDM (Pengembangan Sumber Daya Mahasiswa)',
    'MEDKOMINFO (Media Komunikasi dan Informasi)',
    'EKRAF (Ekonomi Kreatif)',
    'KEPSOS (Kepedulian Sosial)',
    'DEPLU (Luar Negeri)',
] as const

export interface PengurusItem {
    id: string
    name: string
    nim: string
    angkatan: string
    role: string
    division: string
    period: string
    status: 'Aktif' | 'Cuti' | 'Demisioner'
    image: string | null
}

interface PengurusForm {
    id?: string
    name: string
    nim: string
    angkatan: string
    role: string
    division: string
    period: string
    status: 'Aktif' | 'Cuti' | 'Demisioner'
    image: string
}

function normalizeImageUrl(url: string | null | undefined): string {
    if (!url || !url.trim()) return defaultAvatar
    const trimmed = url.trim()

    const fileMatch = trimmed.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/)
    if (fileMatch && fileMatch[1]) {
        return `https://drive.google.com/thumbnail?id=${fileMatch[1]}&sz=w1000`
    }

    const idMatch = trimmed.match(/drive\.google\.com\/(?:open|uc)\?.*id=([a-zA-Z0-9_-]+)/)
    if (idMatch && idMatch[1]) {
        return `https://drive.google.com/thumbnail?id=${idMatch[1]}&sz=w1000`
    }

    return trimmed
}

export default function AdminBPHPage() {
    const [members, setMembers] = useState<PengurusItem[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)

    const [searchQuery, setSearchQuery] = useState('')
    const [activeTab, setActiveTab] = useState<string>('semua')
    const [selectedItems, setSelectedItems] = useState<string[]>([])

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [formError, setFormError] = useState<string | null>(null)
    const [uploadMode, setUploadMode] = useState<'url' | 'file'>('url')
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [previewFileUrl, setPreviewFileUrl] = useState<string | null>(null)

    const [formData, setFormData] = useState<PengurusForm>({
        name: '',
        nim: '',
        angkatan: '2024',
        role: 'Anggota Department',
        division: departemenOptions[0],
        period: '2026/2027',
        status: 'Aktif',
        image: defaultAvatar,
    })

    const supabase = useMemo(
        () =>
            createBrowserClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
            ),
        []
    )

    const fetchMembers = async () => {
        setIsLoading(true)
        const { data, error } = await supabase
            .from('bph_members')
            .select('*')
            .order('created_at', { ascending: true })

        if (error) {
            console.error('Gagal memuat data pengurus:', error.message)
        } else {
            const roleOrder = new Map<string, number>(jabatanOptions.map((r, idx) => [r, idx]))
            const sorted = ((data as PengurusItem[]) || []).sort((a, b) => {
                const orderA = roleOrder.get(a.role) ?? 99
                const orderB = roleOrder.get(b.role) ?? 99
                if (orderA !== orderB) return orderA - orderB
                return a.name.localeCompare(b.name)
            })
            setMembers(sorted)
        }
        setIsLoading(false)
    }

    useEffect(() => {
        fetchMembers()
    }, [])

    const filteredMembers = useMemo(() => {
        return (members || []).filter((item) => {
            const statusStr = (item.status || 'Aktif').toLowerCase()
            const matchesTab = activeTab === 'semua' || statusStr === activeTab

            const query = searchQuery.toLowerCase()
            const nameStr = (item.name || '').toLowerCase()
            const nimStr = (item.nim || '').toLowerCase()
            const angkatanStr = (item.angkatan || '').toLowerCase()
            const divisionStr = (item.division || '').toLowerCase()
            const roleStr = (item.role || '').toLowerCase()

            const matchesSearch =
                nameStr.includes(query) ||
                nimStr.includes(query) ||
                angkatanStr.includes(query) ||
                divisionStr.includes(query) ||
                roleStr.includes(query)

            return matchesTab && matchesSearch
        })
    }, [members, activeTab, searchQuery])

    const getTabCount = (tabKey: string) => {
        if (tabKey === 'semua') return members.length
        return members.filter((m) => (m.status || '').toLowerCase() === tabKey).length
    }

    const toggleSelect = (id: string) => {
        setSelectedItems((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]))
    }

    const toggleSelectAll = () => {
        const currentFilteredIds = filteredMembers.map((m) => m.id)
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
        setUploadMode('url')
        setSelectedFile(null)
        setPreviewFileUrl(null)
        setFormData({
            name: '',
            nim: '',
            angkatan: '2024',
            role: 'Anggota Department',
            division: departemenOptions[0],
            period: '2026/2027',
            status: 'Aktif',
            image: '',
        })
        setIsModalOpen(true)
    }

    const openEditModal = (item: PengurusItem) => {
        setFormError(null)
        setUploadMode('url')
        setSelectedFile(null)
        setPreviewFileUrl(null)
        setFormData({
            id: item.id,
            name: item.name,
            nim: item.nim || '',
            angkatan: item.angkatan || '2024',
            role: item.role,
            division: item.division || 'BPH Inti',
            period: item.period || '2026/2027',
            status: item.status,
            image: item.image === defaultAvatar ? '' : item.image || '',
        })
        setIsModalOpen(true)
    }

    const handleNimChange = (val: string) => {
        const clean = val.trim()
        const yearPrefix = clean.slice(0, 4)
        const validYears = ['2020', '2021', '2022', '2023', '2024', '2025', '2026']
        setFormData((prev) => ({
            ...prev,
            nim: val,
            angkatan: validYears.includes(yearPrefix) ? yearPrefix : prev.angkatan,
        }))
    }

    const handleRoleChange = (newRole: string) => {
        const isInti = bphIntiRoles.includes(newRole)
        setFormData((prev) => ({
            ...prev,
            role: newRole,
            division: isInti
                ? 'BPH Inti'
                : prev.division === 'BPH Inti'
                    ? departemenOptions[0]
                    : prev.division,
        }))
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        if (file.size > 3 * 1024 * 1024) {
            setFormError('Ukuran foto maksimal 3 MB.')
            return
        }
        setFormError(null)
        setSelectedFile(file)
        setPreviewFileUrl(URL.createObjectURL(file))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setFormError(null)
        setIsSaving(true)

        let finalImageUrl: string = formData.image.trim()
            ? normalizeImageUrl(formData.image)
            : defaultAvatar

        if (uploadMode === 'file' && selectedFile) {
            const fileExt = selectedFile.name.split('.').pop() || 'jpg'
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`

            const { error: uploadError } = await supabase.storage
                .from('pengurus')
                .upload(fileName, selectedFile, { upsert: true })

            if (uploadError) {
                setFormError(`Gagal mengunggah foto: ${uploadError.message}`)
                setIsSaving(false)
                return
            }

            const { data: publicUrlData } = supabase.storage
                .from('pengurus')
                .getPublicUrl(fileName)

            finalImageUrl = publicUrlData.publicUrl
        }

        const payload = {
            name: formData.name.trim(),
            nim: formData.nim.trim(),
            angkatan: formData.angkatan.trim() || '2024',
            role: formData.role,
            division: bphIntiRoles.includes(formData.role)
                ? 'BPH Inti'
                : formData.division.trim() || departemenOptions[0],
            period: formData.period.trim() || '2026/2027',
            status: formData.status,
            image: finalImageUrl,
        }

        if (formData.id) {
            const { error } = await supabase
                .from('bph_members')
                .update(payload)
                .eq('id', formData.id)

            if (error) {
                setFormError(`Gagal memperbarui pengurus: ${error.message}`)
                setIsSaving(false)
                return
            }
        } else {
            const { error } = await supabase.from('bph_members').insert(payload)

            if (error) {
                setFormError(`Gagal menambahkan pengurus: ${error.message}`)
                setIsSaving(false)
                return
            }
        }

        setIsSaving(false)
        setIsModalOpen(false)
        await fetchMembers()
    }

    const handleDelete = async (ids: string[]) => {
        if (!confirm(`Yakin ingin menghapus ${ids.length} data pengurus ini secara permanen?`)) return

        setIsSaving(true)
        const { error } = await supabase.from('bph_members').delete().in('id', ids)

        if (error) {
            alert(`Gagal menghapus pengurus: ${error.message}`)
        } else {
            setSelectedItems((prev) => prev.filter((id) => !ids.includes(id)))
            await fetchMembers()
        }
        setIsSaving(false)
    }

    const handleBulkStatus = async (status: 'Aktif' | 'Cuti' | 'Demisioner') => {
        setIsSaving(true)
        const { error } = await supabase
            .from('bph_members')
            .update({ status })
            .in('id', selectedItems)

        if (error) {
            alert(`Gagal mengubah status: ${error.message}`)
        } else {
            setSelectedItems([])
            await fetchMembers()
        }
        setIsSaving(false)
    }

    const handleExportCSV = () => {
        const headers = ['Nama Lengkap', 'NIM', 'Angkatan', 'Jabatan', 'Departemen', 'Periode', 'Status']
        const rows = filteredMembers.map((m) => [
            `"${m.name.replace(/"/g, '""')}"`,
            m.nim,
            m.angkatan,
            `"${m.role}"`,
            `"${m.division.replace(/"/g, '""')}"`,
            m.period,
            m.status,
        ])
        const csvContent =
            'data:text/csv;charset=utf-8,' +
            [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
        const encodedUri = encodeURI(csvContent)
        const link = document.createElement('a')
        link.setAttribute('href', encodedUri)
        link.setAttribute('download', `pengurus-himatifa-${new Date().toISOString().split('T')[0]}.csv`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    const modalPreviewImage =
        uploadMode === 'file' && previewFileUrl
            ? previewFileUrl
            : normalizeImageUrl(formData.image)

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-5">
                <div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 mb-1">
                        <span>SIM HIMATIFA</span>
                        <ChevronRight className="size-3 text-slate-400" />
                        <span className="text-slate-500">Modul Keanggotaan</span>
                    </div>
                    <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                        Struktur BPH & Pengurus
                    </h1>
                    <p className="mt-1 text-xs sm:text-sm text-slate-500">
                        Kelola keanggotaan Badan Pengurus Harian, NIM, angkatan, departemen, serta status demisioner.
                    </p>
                </div>

                <div className="flex items-center gap-2.5">
                    <button
                        type="button"
                        onClick={handleExportCSV}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-xs transition hover:border-slate-300 hover:bg-slate-50 active:scale-[0.98] cursor-pointer"
                    >
                        <Download className="size-4 text-slate-500" />
                        <span>Ekspor Data</span>
                    </button>
                    <button
                        type="button"
                        onClick={openCreateModal}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-blue-600/10 transition hover:bg-blue-500 active:scale-[0.98] cursor-pointer"
                    >
                        <Plus className="size-4" />
                        <span>Tambah Pengurus</span>
                    </button>
                </div>
            </div>

            <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-3 shadow-xs lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-1 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
                    {['Semua', 'Aktif', 'Cuti', 'Demisioner'].map((tab) => {
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
                        placeholder="Cari nama, NIM, angkatan, dept..."
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
                        <span>Pengurus terpilih</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <button
                            disabled={isSaving}
                            onClick={() => handleBulkStatus('Aktif')}
                            className="rounded-lg border border-emerald-200 bg-white px-3 py-1.5 font-semibold text-emerald-700 hover:bg-emerald-50 cursor-pointer"
                        >
                            Set Aktif
                        </button>
                        <button
                            disabled={isSaving}
                            onClick={() => handleBulkStatus('Demisioner')}
                            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer"
                        >
                            Set Demisioner
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
                                        filteredMembers.length > 0 &&
                                        filteredMembers.every((m) => selectedItems.includes(m.id))
                                    }
                                    onChange={toggleSelectAll}
                                    className="size-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                />
                            </th>
                            <th className="px-4 py-3.5 font-bold">Profil Pengurus</th>
                            <th className="px-4 py-3.5 font-bold">Status</th>
                            <th className="px-4 py-3.5 font-bold">Jabatan & Departemen</th>
                            <th className="px-4 py-3.5 font-bold">Angkatan & Periode</th>
                            <th className="px-5 py-3.5 text-right font-bold">Aksi</th>
                        </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                        {isLoading ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center">
                                    <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-500">
                                        <Loader2 className="size-4 animate-spin text-blue-600" />
                                        <span>Memuat data pengurus dari Supabase...</span>
                                    </div>
                                </td>
                            </tr>
                        ) : filteredMembers.length > 0 ? (
                            filteredMembers.map((item) => {
                                const isSelected = selectedItems.includes(item.id)
                                const statusLabel = item.status || 'Aktif'
                                const isInti = bphIntiRoles.includes(item.role)
                                const avatarSrc = normalizeImageUrl(item.image)

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
                                            <div className="flex items-center gap-3">
                                                <div className="relative grid size-11 shrink-0 place-items-center overflow-hidden rounded-full border border-slate-200 bg-slate-100">
                                                    <img
                                                        src={avatarSrc}
                                                        alt={item.name}
                                                        onError={(e) => {
                                                            e.currentTarget.src = defaultAvatar
                                                        }}
                                                        className="h-full w-full object-cover"
                                                    />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                                        {item.name}
                                                    </p>
                                                    <p className="mt-0.5 font-mono text-[11px] font-medium text-slate-400">
                                                        NIM: {item.nim || '-'}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-4 py-4">
                                                <span
                                                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold border ${
                                                        statusLabel === 'Aktif'
                                                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                                            : statusLabel === 'Cuti'
                                                                ? 'bg-amber-50 text-amber-700 border-amber-200'
                                                                : 'bg-slate-100 text-slate-600 border-slate-200'
                                                    }`}
                                                >
                                                    <span
                                                        className={`size-1.5 rounded-full ${
                                                            statusLabel === 'Aktif'
                                                                ? 'bg-emerald-500'
                                                                : statusLabel === 'Cuti'
                                                                    ? 'bg-amber-500'
                                                                    : 'bg-slate-400'
                                                        }`}
                                                    />
                                                    {statusLabel}
                                                </span>
                                        </td>

                                        <td className="px-4 py-4">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-1.5 font-semibold text-slate-900">
                                                    {isInti ? (
                                                        <Shield className="size-3.5 text-blue-600 shrink-0" />
                                                    ) : (
                                                        <ShieldAlert className="size-3.5 text-slate-400 shrink-0" />
                                                    )}
                                                    <span>{item.role}</span>
                                                </div>
                                                <span className="text-[11px] text-slate-500">
                                                        {item.division}
                                                    </span>
                                            </div>
                                        </td>

                                        <td className="px-4 py-4">
                                            <div className="flex flex-col gap-1">
                                                    <span className="inline-flex w-fit items-center rounded bg-blue-50 px-1.5 py-0.5 text-[10px] font-bold text-blue-700 border border-blue-100">
                                                        Angkatan {item.angkatan || '-'}
                                                    </span>
                                                <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
                                                    <GraduationCap className="size-3.5 text-slate-400 shrink-0" />
                                                    <span>{item.period}</span>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-5 py-4 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <button
                                                    type="button"
                                                    onClick={() => openEditModal(item)}
                                                    title="Edit Profil Pengurus"
                                                    className="rounded-lg p-1.5 text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-pointer"
                                                >
                                                    <Edit3 className="size-4" />
                                                </button>
                                                <button
                                                    type="button"
                                                    disabled={isSaving}
                                                    onClick={() => handleDelete([item.id])}
                                                    title="Hapus Pengurus"
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
                                            <Users className="size-6" />
                                        </div>
                                        <p className="text-sm font-bold text-slate-900">
                                            Belum ada data pengurus
                                        </p>
                                        <p className="mt-1 text-xs text-slate-500">
                                            Klik tombol &quot;Tambah Pengurus&quot; untuk menambahkan struktur BPH dan departemen.
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
                        Menampilkan <strong className="text-slate-800">{filteredMembers.length}</strong> dari{' '}
                        <strong className="text-slate-800">{members.length}</strong> total pengurus
                    </span>
                    <span className="text-[11px] text-emerald-600 font-semibold">
                        Tersinkronisasi dengan Supabase
                    </span>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs">
                    <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                            <div className="flex items-center gap-2.5">
                                <div className="grid size-9 place-items-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
                                    <UserCheck className="size-4.5" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-extrabold text-slate-900">
                                        {formData.id ? 'Edit Data Pengurus' : 'Tambah Pengurus Baru'}
                                    </h2>
                                    <p className="text-xs text-slate-500">
                                        Lengkapi nama, NIM, angkatan, jabatan struktural, departemen, dan foto pengurus.
                                    </p>
                                </div>
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
                                    Nama Lengkap <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Contoh: Vichras Mazcheranou Hafizh"
                                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 font-medium text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10"
                                />
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="mb-1.5 block font-bold text-slate-700">
                                        NIM <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.nim}
                                        onChange={(e) => handleNimChange(e.target.value)}
                                        placeholder="Contoh: 20241337039"
                                        className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 font-mono font-medium text-slate-900 outline-none focus:border-blue-600"
                                    />
                                </div>

                                <div>
                                    <label className="mb-1.5 block font-bold text-slate-700">
                                        Angkatan <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={formData.angkatan}
                                        onChange={(e) => setFormData({ ...formData, angkatan: e.target.value })}
                                        className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 font-medium text-slate-900 outline-none focus:border-blue-600"
                                    >
                                        <option value="2021">2021</option>
                                        <option value="2022">2022</option>
                                        <option value="2023">2023</option>
                                        <option value="2024">2024</option>
                                        <option value="2025">2025</option>
                                        <option value="2026">2026</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="mb-1.5 block font-bold text-slate-700">
                                        Jabatan <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={formData.role}
                                        onChange={(e) => handleRoleChange(e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 font-medium text-slate-900 outline-none focus:border-blue-600"
                                    >
                                        {jabatanOptions.map((jabatan) => (
                                            <option key={jabatan} value={jabatan}>
                                                {jabatan}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="mb-1.5 block font-bold text-slate-700">
                                        Departemen
                                    </label>
                                    {bphIntiRoles.includes(formData.role) ? (
                                        <input
                                            type="text"
                                            disabled
                                            value="BPH Inti"
                                            className="w-full rounded-xl border border-slate-200 bg-slate-100 px-3.5 py-2.5 font-semibold text-slate-500"
                                        />
                                    ) : (
                                        <select
                                            value={formData.division}
                                            onChange={(e) => setFormData({ ...formData, division: e.target.value })}
                                            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 font-medium text-slate-900 outline-none focus:border-blue-600"
                                        >
                                            {departemenOptions.map((dept) => (
                                                <option key={dept} value={dept}>
                                                    {dept}
                                                </option>
                                            ))}
                                        </select>
                                    )}
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="mb-1.5 block font-bold text-slate-700">
                                        Periode Kepengurusan
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.period}
                                        onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                                        placeholder="Contoh: 2026/2027"
                                        className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 font-medium text-slate-900 outline-none focus:border-blue-600"
                                    />
                                </div>

                                <div>
                                    <label className="mb-1.5 block font-bold text-slate-700">
                                        Status Kepengurusan
                                    </label>
                                    <select
                                        value={formData.status}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                status: e.target.value as PengurusForm['status'],
                                            })
                                        }
                                        className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 font-medium text-slate-900 outline-none focus:border-blue-600"
                                    >
                                        <option value="Aktif">Aktif</option>
                                        <option value="Cuti">Cuti</option>
                                        <option value="Demisioner">Demisioner</option>
                                    </select>
                                </div>
                            </div>

                            <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 space-y-3">
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                    <label className="font-bold text-slate-700">
                                        Foto Pengurus (Opsional — Default: /default.jpeg)
                                    </label>

                                    <div className="inline-flex rounded-lg border border-slate-200 bg-white p-0.5">
                                        <button
                                            type="button"
                                            onClick={() => setUploadMode('url')}
                                            className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-bold transition cursor-pointer ${
                                                uploadMode === 'url'
                                                    ? 'bg-slate-900 text-white'
                                                    : 'text-slate-600 hover:text-slate-900'
                                            }`}
                                        >
                                            <Link2 className="size-3" />
                                            <span>Link URL / GDrive</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setUploadMode('file')}
                                            className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-bold transition cursor-pointer ${
                                                uploadMode === 'file'
                                                    ? 'bg-slate-900 text-white'
                                                    : 'text-slate-600 hover:text-slate-900'
                                            }`}
                                        >
                                            <Upload className="size-3" />
                                            <span>Upload Manual</span>
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="size-16 shrink-0 overflow-hidden rounded-full border-2 border-white bg-slate-200 shadow-xs">
                                        <img
                                            src={modalPreviewImage}
                                            alt="Pratinjau Foto"
                                            onError={(e) => {
                                                e.currentTarget.src = defaultAvatar
                                            }}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>

                                    <div className="flex-1">
                                        {uploadMode === 'url' ? (
                                            <div>
                                                <input
                                                    type="url"
                                                    value={formData.image}
                                                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                                    placeholder="Tempel link Google Drive atau URL gambar..."
                                                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 font-medium text-slate-900 outline-none focus:border-blue-600"
                                                />
                                                <p className="mt-1 text-[11px] text-slate-400">
                                                    Jika pakai Google Drive, pastikan akses file disetel ke &quot;Siapa saja yang memiliki link&quot;. Kosongkan untuk foto default.
                                                </p>
                                            </div>
                                        ) : (
                                            <div>
                                                <input
                                                    type="file"
                                                    accept="image/png, image/jpeg, image/webp"
                                                    onChange={handleFileChange}
                                                    className="block w-full text-xs text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-blue-600 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-white hover:file:bg-blue-500 cursor-pointer"
                                                />
                                                <p className="mt-1 text-[11px] text-slate-400">
                                                    Format JPG, PNG, atau WEBP (maksimal 3 MB).
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
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
                                    <span>{formData.id ? 'Simpan Perubahan' : 'Simpan Pengurus'}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}