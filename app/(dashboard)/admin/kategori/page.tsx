'use client'

import { useState, useMemo } from 'react'
import { categoriesData as initialCategories, type CategoryItem } from '@/app/data'
import {
    Plus,
    Edit3,
    Trash2,
    Download,
    Search,
    Tag,
    Folders,
    FileText,
    Calendar,
    Hash,
    ChevronRight,
    X
} from 'lucide-react'

export default function AdminKategoriPage() {
    const [searchQuery, setSearchQuery] = useState('')
    const [activeTab, setActiveTab] = useState<string>('semua')
    const [selectedItems, setSelectedItems] = useState<number[]>([])
    const [categories] = useState<CategoryItem[]>(initialCategories)

    const filteredCategories = useMemo(() => {
        return categories.filter((item) => {
            const typeStr = (item.type || 'Umum').toLowerCase()
            const matchesTab = activeTab === 'semua' || typeStr === activeTab

            const query = searchQuery.toLowerCase()
            const nameStr = (item.name || '').toLowerCase()
            const slugStr = (item.slug || '').toLowerCase()
            const descStr = (item.description || '').toLowerCase()

            const matchesSearch =
                nameStr.includes(query) ||
                slugStr.includes(query) ||
                descStr.includes(query)

            return matchesTab && matchesSearch
        })
    }, [categories, activeTab, searchQuery])

    const getTabCount = (tabKey: string) => {
        if (tabKey === 'semua') return categories.length
        return categories.filter((c) => (c.type || '').toLowerCase() === tabKey).length
    }

    const toggleSelect = (id: number) => {
        setSelectedItems((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]))
    }

    const toggleSelectAll = () => {
        const currentFilteredIds = filteredCategories.map((c) => c.id)
        const isAllSelected =
            currentFilteredIds.length > 0 &&
            currentFilteredIds.every((id) => selectedItems.includes(id))

        if (isAllSelected) {
            setSelectedItems((prev) => prev.filter((id) => !currentFilteredIds.includes(id)))
        } else {
            setSelectedItems((prev) => Array.from(new Set([...prev, ...currentFilteredIds])))
        }
    }

    const totalItemsCount = useMemo(() => {
        return categories.reduce((acc, curr) => acc + (curr.itemCount || 0), 0)
    }, [categories])

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-5">
                <div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 mb-1">
                        <span>SIM HIMATIFA</span>
                        <ChevronRight className="size-3 text-slate-400" />
                        <span className="text-slate-500">Taksonomi Konten</span>
                    </div>
                    <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                        Kategori & Taksonomi
                    </h1>
                    <p className="mt-1 text-xs sm:text-sm text-slate-500">
                        Kelola pengelompokan modul berita, agenda kegiatan, dan pengumuman himpunan.
                    </p>
                </div>

                <div className="flex items-center gap-2.5">
                    <button className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-xs transition hover:border-slate-300 hover:bg-slate-50 active:scale-[0.98]">
                        <Download className="size-4 text-slate-500" />
                        <span>Ekspor CSV</span>
                    </button>
                    <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-blue-600/10 transition hover:bg-blue-500 active:scale-[0.98]">
                        <Plus className="size-4" />
                        <span>Tambah Kategori</span>
                    </button>
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                            Total Kategori
                        </span>
                        <div className="grid size-9 place-items-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
                            <Folders className="size-4.5" />
                        </div>
                    </div>
                    <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                        {categories.length}
                    </h2>
                    <p className="mt-1 text-[11px] font-medium text-slate-400">Aktif di taksonomi</p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                            Kategori Berita
                        </span>
                        <div className="grid size-9 place-items-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                            <FileText className="size-4.5" />
                        </div>
                    </div>
                    <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                        {categories.filter((c) => c.type === 'Berita' || c.type === 'Umum').length}
                    </h2>
                    <p className="mt-1 text-[11px] font-medium text-slate-400">Terhubung ke publikasi</p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                            Kategori Agenda
                        </span>
                        <div className="grid size-9 place-items-center rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
                            <Calendar className="size-4.5" />
                        </div>
                    </div>
                    <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                        {categories.filter((c) => c.type === 'Agenda' || c.type === 'Umum').length}
                    </h2>
                    <p className="mt-1 text-[11px] font-medium text-slate-400">Terhubung ke jadwal event</p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                            Total Konten
                        </span>
                        <div className="grid size-9 place-items-center rounded-xl bg-purple-50 text-purple-600 border border-purple-100">
                            <Hash className="size-4.5" />
                        </div>
                    </div>
                    <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                        {totalItemsCount}
                    </h2>
                    <p className="mt-1 text-[11px] font-medium text-slate-400">Item terpublikasi</p>
                </div>
            </div>

            <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-3 shadow-xs lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-1 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
                    {['Semua', 'Berita', 'Agenda', 'Umum'].map((tab) => {
                        const tabKey = tab.toLowerCase()
                        const isActive = activeTab === tabKey
                        const count = getTabCount(tabKey)

                        return (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tabKey)}
                                className={`flex items-center gap-2 whitespace-nowrap rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
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
                        placeholder="Cari kategori, slug, deskripsi..."
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
                        <span>Kategori terpilih</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="rounded-lg bg-red-600 px-3 py-1.5 font-semibold text-white hover:bg-red-500">
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
                                        filteredCategories.length > 0 &&
                                        filteredCategories.every((c) => selectedItems.includes(c.id))
                                    }
                                    onChange={toggleSelectAll}
                                    className="size-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                />
                            </th>
                            <th className="px-4 py-3.5 font-bold">Nama Kategori</th>
                            <th className="px-4 py-3.5 font-bold">Modul Terkait</th>
                            <th className="px-4 py-3.5 font-bold">Jumlah Konten</th>
                            <th className="px-4 py-3.5 font-bold">Deskripsi</th>
                            <th className="px-5 py-3.5 text-right font-bold">Aksi</th>
                        </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                        {filteredCategories.length > 0 ? (
                            filteredCategories.map((item, index) => {
                                const isSelected = selectedItems.includes(item.id)

                                return (
                                    <tr
                                        key={item.id ?? `cat-${index}`}
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
                                                <div className="grid size-9 shrink-0 place-items-center rounded-xl border border-slate-200 bg-slate-50 text-slate-500 group-hover:border-blue-200 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                                                    <Tag className="size-4" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                                        {item.name}
                                                    </p>
                                                    <p className="mt-0.5 font-mono text-[11px] font-medium text-slate-400">
                                                        /{item.slug}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-4 py-4">
                                                <span
                                                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold border ${
                                                        item.color || 'bg-slate-100 text-slate-700 border-slate-200'
                                                    }`}
                                                >
                                                    {item.type}
                                                </span>
                                        </td>

                                        <td className="px-4 py-4 font-bold text-slate-900">
                                            {item.itemCount}{' '}
                                            <span className="text-slate-400 font-normal">item</span>
                                        </td>

                                        <td className="px-4 py-4 max-w-xs truncate text-slate-500">
                                            {item.description}
                                        </td>

                                        <td className="px-5 py-4 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <button
                                                    title="Edit Kategori"
                                                    className="rounded-lg p-1.5 text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                                >
                                                    <Edit3 className="size-4" />
                                                </button>
                                                <button
                                                    title="Hapus Kategori"
                                                    className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
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
                                            <Tag className="size-6" />
                                        </div>
                                        <p className="text-sm font-bold text-slate-900">
                                            Kategori tidak ditemukan
                                        </p>
                                        <p className="mt-1 text-xs text-slate-500">
                                            Coba periksa kata kunci pencarian atau buat kategori baru.
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
                        Menampilkan <strong className="text-slate-800">{filteredCategories.length}</strong> dari{' '}
                        <strong className="text-slate-800">{categories.length}</strong> total kategori
                    </span>
                    <span className="text-[11px] text-slate-400">Terakhir diperbarui hari ini</span>
                </div>
            </div>
        </div>
    )
}