'use client'

import { useState, useMemo } from 'react'
import { Plus, Edit3, Trash2, Download, CheckSquare, ImageOff, Image as ImageIcon, Search } from 'lucide-react'

interface Article {
    id: number
    title: string
    slug: string
    cat: string
    author: string
    status: 'Published' | 'Draft' | 'Archived'
    date: string
    views: string
    img: boolean
}

export default function AdminBeritaPage() {
    // State lokal untuk menggantikan prop dari layout
    const [searchQuery, setSearchQuery] = useState('')
    const [activeTab, setActiveTab] = useState<string>('semua')
    const [selectedItems, setSelectedItems] = useState<number[]>([])

    // Data Dummy
    const [articles] = useState<Article[]>([
        { id: 1, title: 'HIMATIFA Sukses Gelar OSCAR 2026', slug: 'himatifa-sukses-gelar-oscar-2026', cat: 'Event', author: 'Divisi Kominfo', status: 'Published', date: '25 Sep 2026', views: '1.2k', img: true },
        { id: 2, title: 'Pendelegasian KMHE 2026 Siap Berangkat', slug: 'kmhe-2026-pendelegasian', cat: 'Prestasi', author: 'Arya Putra', status: 'Draft', date: '22 Sep 2026', views: '-', img: false },
        { id: 3, title: 'Open Recruitment Pengurus Baru Periode 2027', slug: 'oprec-pengurus-2027', cat: 'Info Kampus', author: 'Sekretaris Umum', status: 'Published', date: '18 Sep 2026', views: '3.4k', img: true },
        { id: 4, title: 'Workshop AI & Web3 Development', slug: 'workshop-ai-web3', cat: 'Event', author: 'Divisi Keilmuan', status: 'Archived', date: '10 Sep 2026', views: '856', img: true },
    ])

    // Logika Filter
    const filteredArticles = useMemo(() => {
        return articles.filter((item) => {
            const matchesTab = activeTab === 'semua' || item.status.toLowerCase() === activeTab
            const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.author.toLowerCase().includes(searchQuery.toLowerCase())

            return matchesTab && matchesSearch
        })
    }, [articles, activeTab, searchQuery])

    // Fungsi Pilih Item
    const toggleSelect = (id: number) => {
        setSelectedItems((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id])
    }

    const toggleSelectAll = () => {
        const currentFilteredIds = filteredArticles.map((a) => a.id)
        const isAllSelected = currentFilteredIds.length > 0 && currentFilteredIds.every((id) => selectedItems.includes(id))

        if (isAllSelected) {
            setSelectedItems((prev) => prev.filter((id) => !currentFilteredIds.includes(id)))
        } else {
            setSelectedItems((prev) => Array.from(new Set([...prev, ...currentFilteredIds])))
        }
    }

    return (
        <div className="mx-auto max-w-7xl animate-in fade-in duration-300">
            {/* Page Header */}
            <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
                <div>
                    <h2 className="text-2xl font-black tracking-tight text-slate-900">Artikel & Berita</h2>
                    <p className="mt-1 text-sm font-medium text-slate-500">Kelola publikasi, press release, dan pengumuman himpunan.</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50">
                        <Download className="size-4" /> Export CSV
                    </button>
                    <button className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-600/20 transition-all hover:bg-blue-700 hover:shadow-blue-600/30 active:scale-95">
                        <Plus className="size-4" /> Tulis Artikel Baru
                    </button>
                </div>
            </div>

            {/* Tabs & Search Filter */}
            <div className="mb-6 flex flex-col justify-between gap-4 rounded-xl border border-slate-200 bg-white p-2 shadow-sm md:flex-row md:items-center">
                <div className="flex gap-1 overflow-x-auto p-1">
                    {['Semua', 'Published', 'Draft', 'Archived'].map((tab) => {
                        const tabKey = tab.toLowerCase()
                        return (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tabKey)}
                                className={`rounded-lg px-4 py-2 text-sm font-bold transition-all ${
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

                {/* Local Search Bar */}
                <div className="relative px-2 pb-2 md:w-72 md:pb-0 md:pr-2">
                    <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400 md:top-1/2" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Cari artikel, slug, penulis..."
                        className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-4 text-sm font-medium outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                    />
                </div>
            </div>

            {/* Bulk Actions (Muncul jika ada yang di-checklist) */}
            {selectedItems.length > 0 && (
                <div className="mb-4 flex items-center justify-between rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 animate-in slide-in-from-top-2">
                    <span className="text-sm font-bold text-blue-700">{selectedItems.length} artikel dipilih</span>
                    <div className="flex gap-2">
                        <button className="rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50">Ubah Kategori</button>
                        <button className="rounded-lg bg-red-100 px-3 py-1.5 text-xs font-bold text-red-600 shadow-sm hover:bg-red-200">Hapus Terpilih</button>
                    </div>
                </div>
            )}

            {/* Table Area */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600">
                        <thead className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-extrabold uppercase tracking-widest text-slate-500">
                        <tr>
                            <th className="w-12 px-6 py-4">
                                <button onClick={toggleSelectAll} className="outline-none">
                                    <CheckSquare className={`size-[18px] transition-colors ${
                                        filteredArticles.length > 0 && filteredArticles.every((a) => selectedItems.includes(a.id))
                                            ? 'text-blue-600'
                                            : 'text-slate-400 hover:text-slate-600'
                                    }`} />
                                </button>
                            </th>
                            <th className="px-4 py-4">Judul Artikel & Media</th>
                            <th className="px-4 py-4">Status</th>
                            <th className="px-4 py-4">Kategori / Penulis</th>
                            <th className="px-4 py-4">Statistik</th>
                            <th className="px-6 py-4 text-right">Aksi</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                        {filteredArticles.length > 0 ? (
                            filteredArticles.map((item) => (
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
                                        <div className="flex items-center gap-4">
                                            <div className="grid size-12 shrink-0 place-items-center rounded-xl border border-slate-100 bg-slate-50 text-slate-400">
                                                {item.img ? <ImageIcon className="size-5" /> : <ImageOff className="size-5 opacity-50" />}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900">{item.title}</p>
                                                <p className="mt-0.5 text-[11px] font-medium text-slate-400">/{item.slug}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4">
                                            <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ${
                                                item.status === 'Published' ? 'bg-emerald-100 text-emerald-700' :
                                                    item.status === 'Draft' ? 'bg-amber-100 text-amber-700' :
                                                        'bg-slate-100 text-slate-600'
                                            }`}>
                                                {item.status}
                                            </span>
                                    </td>
                                    <td className="px-4 py-4">
                                        <p className="font-semibold text-slate-900">{item.cat}</p>
                                        <p className="mt-0.5 text-xs text-slate-500">{item.author}</p>
                                    </td>
                                    <td className="px-4 py-4">
                                        <p className="font-semibold text-slate-900">{item.date}</p>
                                        <p className="mt-0.5 text-xs text-slate-500">{item.views} views</p>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                                            <button className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-blue-50 hover:text-blue-600">
                                                <Edit3 className="size-4" />
                                            </button>
                                            <button className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600">
                                                <Trash2 className="size-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                                    <p className="font-medium">Tidak ada artikel yang cocok dengan pencarian.</p>
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
