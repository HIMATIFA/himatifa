'use client'

import { useState, useMemo } from 'react'
import { UploadCloud, Trash2, Search, Image as ImageIcon, FileText, Video, Copy, CheckSquare, HardDrive } from 'lucide-react'

interface MediaItem {
    id: number
    name: string
    type: 'Gambar' | 'Dokumen' | 'Video'
    size: string
    date: string
    url: string
}

export default function AdminMediaPage() {
    const [searchQuery, setSearchQuery] = useState('')
    const [activeTab, setActiveTab] = useState<string>('semua')
    const [selectedItems, setSelectedItems] = useState<number[]>([])

    const [mediaFiles] = useState<MediaItem[]>([
        { id: 1, name: 'poster-oscar-2026.jpg', type: 'Gambar', size: '2.4 MB', date: '04 Okt 2026', url: 'https://images.unsplash.com/photo-1540317580384-e5d43616b9aa?w=500&q=80' },
        { id: 2, name: 'logo-himatifa-utama.png', type: 'Gambar', size: '450 KB', date: '01 Okt 2026', url: 'https://images.unsplash.com/photo-1614332287897-cdc485fa562d?w=500&q=80' },
        { id: 3, name: 'pedoman-organisasi.pdf', type: 'Dokumen', size: '5.1 MB', date: '28 Sep 2026', url: '' },
        { id: 4, name: 'dokumentasi-makrab.jpg', type: 'Gambar', size: '3.2 MB', date: '25 Sep 2026', url: 'https://images.unsplash.com/photo-1523580494112-071d192c9e1d?w=500&q=80' },
        { id: 5, name: 'teaser-kmhe.mp4', type: 'Video', size: '18.5 MB', date: '20 Sep 2026', url: '' },
        { id: 6, name: 'surat-undangan-bph.pdf', type: 'Dokumen', size: '800 KB', date: '15 Sep 2026', url: '' },
    ])

    const filteredMedia = useMemo(() => {
        return mediaFiles.filter((item) => {
            const matchesTab = activeTab === 'semua' || item.type.toLowerCase() === activeTab
            const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase())

            return matchesTab && matchesSearch
        })
    }, [mediaFiles, activeTab, searchQuery])

    const toggleSelect = (id: number) => {
        setSelectedItems((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id])
    }

    const toggleSelectAll = () => {
        const currentFilteredIds = filteredMedia.map((m) => m.id)
        const isAllSelected = currentFilteredIds.length > 0 && currentFilteredIds.every((id) => selectedItems.includes(id))

        if (isAllSelected) {
            setSelectedItems((prev) => prev.filter((id) => !currentFilteredIds.includes(id)))
        } else {
            setSelectedItems((prev) => Array.from(new Set([...prev, ...currentFilteredIds])))
        }
    }

    const handleCopyLink = (name: string) => {
        alert(`Link file ${name} berhasil disalin ke clipboard!`)
    }

    return (
        <div className="mx-auto max-w-7xl animate-in fade-in duration-300">
            <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
                <div>
                    <h2 className="text-2xl font-black tracking-tight text-slate-900">Media Library</h2>
                    <p className="mt-1 text-sm font-medium text-slate-500">Kelola gambar, dokumen, dan aset digital untuk website.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="hidden items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-2 shadow-sm md:flex">
                        <HardDrive className="size-5 text-blue-500" />
                        <div className="flex flex-col">
                            <div className="flex items-center justify-between gap-4 text-[10px] font-extrabold uppercase tracking-widest text-slate-500">
                                <span>Storage</span>
                                <span className="text-blue-600">45%</span>
                            </div>
                            <div className="mt-1 h-1.5 w-32 overflow-hidden rounded-full bg-slate-100">
                                <div className="h-full w-[45%] rounded-full bg-blue-500" />
                            </div>
                        </div>
                    </div>

                    <button className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-600/20 transition-all hover:bg-blue-700 hover:shadow-blue-600/30 active:scale-95">
                        <UploadCloud className="size-4" /> Unggah File
                    </button>
                </div>
            </div>

            <div className="mb-6 flex flex-col justify-between gap-4 rounded-xl border border-slate-200 bg-white p-2 shadow-sm md:flex-row md:items-center">
                <div className="flex gap-1 overflow-x-auto p-1">
                    {['Semua', 'Gambar', 'Dokumen', 'Video'].map((tab) => {
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

                <div className="flex items-center gap-2">
                    <button
                        onClick={toggleSelectAll}
                        className="flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-bold text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-900"
                    >
                        <CheckSquare className={`size-4 ${selectedItems.length > 0 ? 'text-blue-600' : ''}`} />
                        Pilih Semua
                    </button>
                    <div className="relative w-full px-2 pb-2 md:w-64 md:pb-0 md:pr-2">
                        <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400 md:top-1/2" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Cari nama file..."
                            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-4 text-sm font-medium outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                        />
                    </div>
                </div>
            </div>

            {selectedItems.length > 0 && (
                <div className="mb-4 flex items-center justify-between rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 animate-in slide-in-from-top-2">
                    <span className="text-sm font-bold text-blue-700">{selectedItems.length} file dipilih</span>
                    <button className="flex items-center gap-2 rounded-lg bg-red-100 px-3 py-1.5 text-xs font-bold text-red-600 shadow-sm hover:bg-red-200">
                        <Trash2 className="size-3.5" /> Hapus Terpilih
                    </button>
                </div>
            )}

            {filteredMedia.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                    {filteredMedia.map((item) => {
                        const isSelected = selectedItems.includes(item.id)

                        return (
                            <div
                                key={item.id}
                                className={`group relative flex flex-col overflow-hidden rounded-2xl border transition-all ${
                                    isSelected ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md'
                                }`}
                            >
                                <button
                                    onClick={() => toggleSelect(item.id)}
                                    className={`absolute left-3 top-3 z-10 grid size-6 place-items-center rounded-md border backdrop-blur-md transition-all ${
                                        isSelected ? 'border-blue-500 bg-blue-500 text-white' : 'border-white/50 bg-white/30 text-transparent opacity-0 hover:bg-white/50 group-hover:opacity-100'
                                    }`}
                                >
                                    <CheckSquare className="size-4" />
                                </button>

                                <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-50">
                                    {item.type === 'Gambar' && item.url ? (
                                        <img src={item.url} alt={item.name} className="size-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                    ) : (
                                        <div className="flex size-full flex-col items-center justify-center text-slate-300">
                                            {item.type === 'Dokumen' ? <FileText className="size-12" /> : item.type === 'Video' ? <Video className="size-12" /> : <ImageIcon className="size-12" />}
                                        </div>
                                    )}

                                    <div className="absolute inset-0 flex items-center justify-center gap-2 bg-slate-900/40 opacity-0 backdrop-blur-[2px] transition-opacity group-hover:opacity-100">
                                        <button onClick={() => handleCopyLink(item.name)} className="rounded-full bg-white p-2 text-slate-700 shadow-lg transition-transform hover:scale-110 hover:text-blue-600" title="Salin URL">
                                            <Copy className="size-4" />
                                        </button>
                                        <button className="rounded-full bg-white p-2 text-slate-700 shadow-lg transition-transform hover:scale-110 hover:text-red-600" title="Hapus File">
                                            <Trash2 className="size-4" />
                                        </button>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1 p-3">
                                    <p className="truncate text-xs font-bold text-slate-900" title={item.name}>
                                        {item.name}
                                    </p>
                                    <div className="flex items-center justify-between text-[11px] font-medium text-slate-500">
                                        <span>{item.date}</span>
                                        <span>{item.size}</span>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 py-20 text-center">
                    <div className="mb-4 grid size-16 place-items-center rounded-full bg-white shadow-sm">
                        <ImageIcon className="size-8 text-slate-300" />
                    </div>
                    <p className="font-bold text-slate-900">Tidak ada file ditemukan</p>
                    <p className="mt-1 text-sm text-slate-500">Coba ubah kata kunci pencarian atau unggah file baru.</p>
                </div>
            )}
        </div>
    )
}