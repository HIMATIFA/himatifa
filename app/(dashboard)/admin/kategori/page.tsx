'use client'

import { useState, useMemo } from 'react'
import { Plus, Edit3, Trash2, Download, CheckSquare, Search, Tag, Folders, FileText, Calendar, Hash } from 'lucide-react'

interface Category {
    id: number
    name: string
    slug: string
    type: 'Berita' | 'Agenda' | 'Umum'
    itemCount: number
    description: string
    color: string
}

export default function AdminKategoriPage() {
    const [searchQuery, setSearchQuery] = useState('')
    const [activeTab, setActiveTab] = useState<string>('semua')
    const [selectedItems, setSelectedItems] = useState<number[]>([])

    const [categories] = useState<Category[]>([
        { id: 1, name: 'Event & Acara', slug: 'event-acara', type: 'Agenda', itemCount: 18, description: 'Kegiatan seminar, workshop, dan kompetisi himpunan.', color: 'bg-blue-100 text-blue-700' },
        { id: 2, name: 'Prestasi', slug: 'prestasi', type: 'Berita', itemCount: 12, description: 'Pencapaian dan kejuaraan mahasiswa Informatika.', color: 'bg-amber-100 text-amber-700' },
        { id: 3, name: 'Info Kampus', slug: 'info-kampus', type: 'Umum', itemCount: 25, description: 'Pengumuman resmi akademik dan fakultas.', color: 'bg-emerald-100 text-emerald-700' },
        { id: 4, name: 'Rapat Internal', slug: 'rapat-internal', type: 'Agenda', itemCount: 9, description: 'Agenda konsolidasi BPH dan pengurus divisi.', color: 'bg-purple-100 text-purple-700' },
        { id: 5, name: 'Pers Release', slug: 'press-release', type: 'Berita', itemCount: 14, description: 'Publikasi resmi liputan kegiatan HIMATIFA.', color: 'bg-rose-100 text-rose-700' },
    ])

    const filteredCategories = useMemo(() => {
        return categories.filter((item) => {
            const matchesTab = activeTab === 'semua' || item.type.toLowerCase() === activeTab
            const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.description.toLowerCase().includes(searchQuery.toLowerCase())

            return matchesTab && matchesSearch
        })
    }, [categories, activeTab, searchQuery])

    const toggleSelect = (id: number) => {
        setSelectedItems((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id])
    }

    const toggleSelectAll = () => {
        const currentFilteredIds = filteredCategories.map((c) => c.id)
        const isAllSelected = currentFilteredIds.length > 0 && currentFilteredIds.every((id) => selectedItems.includes(id))

        if (isAllSelected) {
            setSelectedItems((prev) => prev.filter((id) => !currentFilteredIds.includes(id)))
        } else {
            setSelectedItems((prev) => Array.from(new Set([...prev, ...currentFilteredIds])))
        }
    }

    return (
        <div className="mx-auto max-w-7xl animate-in fade-in duration-300">
            <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
                <div>
                    <h2 className="text-2xl font-black tracking-tight text-slate-900">Kategori Konten</h2>
                    <p className="mt-1 text-sm font-medium text-slate-500">Kelola taksonomi dan pengelompokan untuk berita, artikel, dan agenda.</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50">
                        <Download className="size-4" /> Export CSV
                    </button>
                    <button className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-600/20 transition-all hover:bg-blue-700 hover:shadow-blue-600/30 active:scale-95">
                        <Plus className="size-4" /> Tambah Kategori
                    </button>
                </div>
            </div>

            <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Total Kategori</span>
                        <div className="grid size-9 place-items-center rounded-xl bg-blue-50 text-blue-600">
                            <Folders className="size-4" />
                        </div>
                    </div>
                    <h3 className="mt-3 text-3xl font-black text-slate-900">{categories.length}</h3>
                    <p className="mt-1 text-[11px] font-medium text-slate-400">Aktif di sistem</p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Kategori Berita</span>
                        <div className="grid size-9 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
                            <FileText className="size-4" />
                        </div>
                    </div>
                    <h3 className="mt-3 text-3xl font-black text-slate-900">
                        {categories.filter(c => c.type === 'Berita' || c.type === 'Umum').length}
                    </h3>
                    <p className="mt-1 text-[11px] font-medium text-slate-400">Terhubung ke artikel</p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Kategori Agenda</span>
                        <div className="grid size-9 place-items-center rounded-xl bg-amber-50 text-amber-600">
                            <Calendar className="size-4" />
                        </div>
                    </div>
                    <h3 className="mt-3 text-3xl font-black text-slate-900">
                        {categories.filter(c => c.type === 'Agenda' || c.type === 'Umum').length}
                    </h3>
                    <p className="mt-1 text-[11px] font-medium text-slate-400">Terhubung ke jadwal event</p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Total Terkait</span>
                        <div className="grid size-9 place-items-center rounded-xl bg-purple-50 text-purple-600">
                            <Hash className="size-4" />
                        </div>
                    </div>
                    <h3 className="mt-3 text-3xl font-black text-slate-900">
                        {categories.reduce((acc, curr) => acc + curr.itemCount, 0)}
                    </h3>
                    <p className="mt-1 text-[11px] font-medium text-slate-400">Total item terpublikasi</p>
                </div>
            </div>

            <div className="mb-6 flex flex-col justify-between gap-4 rounded-xl border border-slate-200 bg-white p-2 shadow-sm md:flex-row md:items-center">
                <div className="flex gap-1 overflow-x-auto p-1">
                    {['Semua', 'Berita', 'Agenda', 'Umum'].map((tab) => {
                        const tabKey = tab.toLowerCase()
                        return (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tabKey)}
                                className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-bold transition-all ${
                                    activeTab === tabKey
                                        ? 'bg-slate-100 text-slate-900 shadow-sm'
                                        : 'text-slate-500 hover:text-slate-900'
                                }`}
                            >
                                {tab}
                            </button>
                        )
                    })}
                </div>

                <div className="relative px-2 pb-2 md:w-72 md:pb-0 md:pr-2">
                    <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400 md:top-1/2" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Cari kategori, slug, deskripsi..."
                        className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-4 text-sm font-medium outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                    />
                </div>
            </div>

            {selectedItems.length > 0 && (
                <div className="mb-4 flex items-center justify-between rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 animate-in slide-in-from-top-2">
                    <span className="text-sm font-bold text-blue-700">{selectedItems.length} kategori dipilih</span>
                    <div className="flex gap-2">
                        <button className="rounded-lg bg-red-100 px-3 py-1.5 text-xs font-bold text-red-600 shadow-sm hover:bg-red-200">Hapus Terpilih</button>
                    </div>
                </div>
            )}

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600">
                        <thead className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-extrabold uppercase tracking-widest text-slate-500">
                        <tr>
                            <th className="w-12 px-6 py-4">
                                <button onClick={toggleSelectAll} className="outline-none">
                                    <CheckSquare className={`size-[18px] transition-colors ${
                                        filteredCategories.length > 0 && filteredCategories.every((a) => selectedItems.includes(a.id))
                                            ? 'text-blue-600'
                                            : 'text-slate-400 hover:text-slate-600'
                                    }`} />
                                </button>
                            </th>
                            <th className="px-4 py-4">Nama Kategori</th>
                            <th className="px-4 py-4">Modul Terkait</th>
                            <th className="px-4 py-4">Jumlah Konten</th>
                            <th className="px-4 py-4">Deskripsi</th>
                            <th className="px-6 py-4 text-right">Aksi</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                        {filteredCategories.length > 0 ? (
                            filteredCategories.map((item) => (
                                <tr
                                    key={item.id}
                                    className={`group transition-colors hover:bg-slate-50/80 ${selectedItems.includes(item.id) ? 'bg-blue-50/30' : ''}`}
                                >
                                    <td className="px-6 py-4">
                                        <button onClick={() => toggleSelect(item.id)} className="outline-none">
                                            <CheckSquare className={`size-[18px] transition-colors ${
                                                selectedItems.includes(item.id)
                                                    ? 'text-blue-600'
                                                    : 'text-slate-300 group-hover:text-slate-400'
                                            }`} />
                                        </button>
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="grid size-10 shrink-0 place-items-center rounded-xl border border-slate-100 bg-slate-50 text-slate-400">
                                                <Tag className="size-4" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900">{item.name}</p>
                                                <p className="mt-0.5 font-mono text-[11px] font-medium text-slate-400">/{item.slug}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4">
                                            <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ${item.color}`}>
                                                {item.type}
                                            </span>
                                    </td>
                                    <td className="px-4 py-4 font-semibold text-slate-900">
                                        {item.itemCount} item
                                    </td>
                                    <td className="px-4 py-4 max-w-xs truncate text-xs text-slate-500">
                                        {item.description}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                                            <button className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-blue-50 hover:text-blue-600" title="Edit Kategori">
                                                <Edit3 className="size-4" />
                                            </button>
                                            <button className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600" title="Hapus Kategori">
                                                <Trash2 className="size-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                                    <div className="flex flex-col items-center justify-center">
                                        <Tag className="mb-3 size-10 text-slate-300" />
                                        <p className="font-medium text-slate-900">Kategori tidak ditemukan.</p>
                                        <p className="mt-1 text-xs text-slate-500">Coba kata kunci lain atau buat kategori baru.</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
