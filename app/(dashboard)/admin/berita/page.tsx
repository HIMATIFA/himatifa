'use client'

import { useState, useMemo } from 'react'
import { newsData as initialNews, type NewsItem } from '@/app/data'
import {
    Plus,
    Edit3,
    Trash2,
    Download,
    ImageOff,
    Image as ImageIcon,
    Search,
    ChevronRight,
    X,
    ExternalLink,
    Eye,
    FileText,
    Tag
} from 'lucide-react'

export default function AdminBeritaPage() {
    const [searchQuery, setSearchQuery] = useState('')
    const [activeTab, setActiveTab] = useState<string>('semua')
    const [selectedItems, setSelectedItems] = useState<number[]>([])
    const [articles] = useState<NewsItem[]>(initialNews)

    const filteredArticles = useMemo(() => {
        return articles.filter((item) => {
            const statusStr = (item.status || 'Published').toLowerCase()
            const matchesTab = activeTab === 'semua' || statusStr === activeTab

            const query = searchQuery.toLowerCase()
            const titleStr = (item.title || '').toLowerCase()
            const slugStr = (item.slug || '').toLowerCase()
            const authorStr = (item.author || '').toLowerCase()
            const categoryStr = (item.category || '').toLowerCase()

            const matchesSearch =
                titleStr.includes(query) ||
                slugStr.includes(query) ||
                authorStr.includes(query) ||
                categoryStr.includes(query)

            return matchesTab && matchesSearch
        })
    }, [articles, activeTab, searchQuery])

    const getTabCount = (tabKey: string) => {
        if (tabKey === 'semua') return articles.length
        return articles.filter((a) => (a.status || '').toLowerCase() === tabKey).length
    }

    const toggleSelect = (id: number) => {
        setSelectedItems((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]))
    }

    const toggleSelectAll = () => {
        const currentFilteredIds = filteredArticles.map((a) => a.id)
        const isAllSelected =
            currentFilteredIds.length > 0 &&
            currentFilteredIds.every((id) => selectedItems.includes(id))

        if (isAllSelected) {
            setSelectedItems((prev) => prev.filter((id) => !currentFilteredIds.includes(id)))
        } else {
            setSelectedItems((prev) => Array.from(new Set([...prev, ...currentFilteredIds])))
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-5">
                <div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 mb-1">
                        <span>SIM HIMATIFA</span>
                        <ChevronRight className="size-3 text-slate-400" />
                        <span className="text-slate-500">Modul Publikasi</span>
                    </div>
                    <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                        Artikel & Berita Himpunan
                    </h1>
                    <p className="mt-1 text-xs sm:text-sm text-slate-500">
                        Kelola rilis pers, liputan kegiatan, serta pengumuman publikasi HIMATIFA.
                    </p>
                </div>

                <div className="flex items-center gap-2.5">
                    <button className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-xs transition hover:border-slate-300 hover:bg-slate-50 active:scale-[0.98]">
                        <Download className="size-4 text-slate-500" />
                        <span>Ekspor CSV</span>
                    </button>
                    <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-blue-600/10 transition hover:bg-blue-500 active:scale-[0.98]">
                        <Plus className="size-4" />
                        <span>Tulis Artikel Baru</span>
                    </button>
                </div>
            </div>

            <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-3 shadow-xs lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-1 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
                    {['Semua', 'Published', 'Draft', 'Archived'].map((tab) => {
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
                        placeholder="Cari artikel, slug, penulis..."
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
                        <span>Artikel terpilih</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="rounded-lg border border-blue-200 bg-white px-3 py-1.5 font-semibold text-slate-700 hover:bg-slate-50">
                            Ubah Status
                        </button>
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
                                        filteredArticles.length > 0 &&
                                        filteredArticles.every((a) => selectedItems.includes(a.id))
                                    }
                                    onChange={toggleSelectAll}
                                    className="size-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                />
                            </th>
                            <th className="px-4 py-3.5 font-bold">Judul Artikel & Media</th>
                            <th className="px-4 py-3.5 font-bold">Status</th>
                            <th className="px-4 py-3.5 font-bold">Kategori & Penulis</th>
                            <th className="px-4 py-3.5 font-bold">Statistik</th>
                            <th className="px-5 py-3.5 text-right font-bold">Aksi</th>
                        </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                        {filteredArticles.length > 0 ? (
                            filteredArticles.map((item, index) => {
                                const isSelected = selectedItems.includes(item.id)
                                const statusLabel = item.status || 'Published'

                                return (
                                    <tr
                                        key={item.id ?? `article-${index}`}
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
                                                <div className="relative grid size-10 shrink-0 place-items-center rounded-xl border border-slate-200 bg-slate-50 text-slate-400 overflow-hidden">
                                                    {item.image ? (
                                                        <img
                                                            src={item.image}
                                                            alt={item.title}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        <ImageOff className="size-4 text-slate-300" />
                                                    )}
                                                </div>
                                                <div className="max-w-md">
                                                    <p className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                                                        {item.title}
                                                    </p>
                                                    <p className="mt-0.5 text-[11px] font-mono text-slate-400 truncate">
                                                        /{item.slug}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-4 py-4">
                                                <span
                                                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold border ${
                                                        statusLabel === 'Published'
                                                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                                            : statusLabel === 'Draft'
                                                                ? 'bg-amber-50 text-amber-700 border-amber-200'
                                                                : 'bg-slate-100 text-slate-600 border-slate-200'
                                                    }`}
                                                >
                                                    <span
                                                        className={`size-1.5 rounded-full ${
                                                            statusLabel === 'Published'
                                                                ? 'bg-emerald-500'
                                                                : statusLabel === 'Draft'
                                                                    ? 'bg-amber-500'
                                                                    : 'bg-slate-400'
                                                        }`}
                                                    />
                                                    {statusLabel}
                                                </span>
                                        </td>

                                        <td className="px-4 py-4">
                                            <div className="flex flex-col gap-0.5">
                                                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-800">
                                                        <Tag className="size-3 text-slate-400" />
                                                        {item.category}
                                                    </span>
                                                <span className="text-[11px] text-slate-400">
                                                        Oleh: {item.author || 'Admin'}
                                                    </span>
                                            </div>
                                        </td>

                                        <td className="px-4 py-4">
                                            <div className="flex flex-col gap-0.5">
                                                    <span className="text-xs font-bold text-slate-800">
                                                        {item.date}
                                                    </span>
                                                <span className="inline-flex items-center gap-1 text-[11px] text-slate-400">
                                                        <Eye className="size-3" />
                                                    {item.views || '0'} tayangan
                                                    </span>
                                            </div>
                                        </td>

                                        <td className="px-5 py-4 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                {item.link && (
                                                    <a
                                                        href={item.link}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        title="Buka Tautan Asli"
                                                        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                                                    >
                                                        <ExternalLink className="size-4" />
                                                    </a>
                                                )}
                                                <button
                                                    title="Edit Artikel"
                                                    className="rounded-lg p-1.5 text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                                >
                                                    <Edit3 className="size-4" />
                                                </button>
                                                <button
                                                    title="Hapus Artikel"
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
                                            <FileText className="size-6" />
                                        </div>
                                        <p className="text-sm font-bold text-slate-900">
                                            Artikel tidak ditemukan
                                        </p>
                                        <p className="mt-1 text-xs text-slate-500">
                                            Coba periksa kata kunci pencarian atau ubah filter status artikel.
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
                        Menampilkan <strong className="text-slate-800">{filteredArticles.length}</strong> dari{' '}
                        <strong className="text-slate-800">{articles.length}</strong> total artikel
                    </span>
                    <span className="text-[11px] text-slate-400">Terakhir diperbarui hari ini</span>
                </div>
            </div>
        </div>
    )
}