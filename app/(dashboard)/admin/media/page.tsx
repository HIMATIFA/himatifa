'use client'

import { useState, useMemo } from 'react'
import {
    UploadCloud,
    Trash2,
    Search,
    Image as ImageIcon,
    FileText,
    Video,
    Copy,
    HardDrive,
    ChevronRight,
    X,
    Check,
    CheckSquare,
    ExternalLink
} from 'lucide-react'

interface MediaItem {
    id: number
    name: string
    type: 'Gambar' | 'Dokumen' | 'Video'
    size: string
    date: string
    url?: string
}

export default function AdminMediaPage() {
    const [searchQuery, setSearchQuery] = useState('')
    const [activeTab, setActiveTab] = useState<string>('semua')
    const [selectedItems, setSelectedItems] = useState<number[]>([])
    const [copiedId, setCopiedId] = useState<number | null>(null)

    const [mediaFiles] = useState<MediaItem[]>([
        { id: 1, name: 'poster-oscar-2026.jpg', type: 'Gambar', size: '2.4 MB', date: '04 Okt 2026', url: 'https://images.unsplash.com/photo-1540317580384-e5d43616b9aa?w=500&q=80' },
        { id: 2, name: 'logo-himatifa-utama.png', type: 'Gambar', size: '450 KB', date: '01 Okt 2026', url: 'https://images.unsplash.com/photo-1614332287897-cdc485fa562d?w=500&q=80' },
        { id: 3, name: 'pedoman-organisasi-2026.pdf', type: 'Dokumen', size: '5.1 MB', date: '28 Sep 2026' },
        { id: 4, name: 'dokumentasi-makrab-maba.jpg', type: 'Gambar', size: '3.2 MB', date: '25 Sep 2026', url: 'https://images.unsplash.com/photo-1523580494112-071d192c9e1d?w=500&q=80' },
        { id: 5, name: 'teaser-pendelegasian-kmhe.mp4', type: 'Video', size: '18.5 MB', date: '20 Sep 2026' },
        { id: 6, name: 'surat-undangan-bph-inti.pdf', type: 'Dokumen', size: '800 KB', date: '15 Sep 2026' },
    ])

    const filteredMedia = useMemo(() => {
        return mediaFiles.filter((item) => {
            const typeStr = (item.type || 'Gambar').toLowerCase()
            const matchesTab = activeTab === 'semua' || typeStr === activeTab

            const query = searchQuery.toLowerCase()
            const nameStr = (item.name || '').toLowerCase()

            return matchesTab && nameStr.includes(query)
        })
    }, [mediaFiles, activeTab, searchQuery])

    const getTabCount = (tabKey: string) => {
        if (tabKey === 'semua') return mediaFiles.length
        return mediaFiles.filter((m) => (m.type || '').toLowerCase() === tabKey).length
    }

    const toggleSelect = (id: number) => {
        setSelectedItems((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]))
    }

    const toggleSelectAll = () => {
        const currentFilteredIds = filteredMedia.map((m) => m.id)
        const isAllSelected =
            currentFilteredIds.length > 0 &&
            currentFilteredIds.every((id) => selectedItems.includes(id))

        if (isAllSelected) {
            setSelectedItems((prev) => prev.filter((id) => !currentFilteredIds.includes(id)))
        } else {
            setSelectedItems((prev) => Array.from(new Set([...prev, ...currentFilteredIds])))
        }
    }

    const handleCopyLink = (id: number, name: string) => {
        setCopiedId(id)
        navigator.clipboard?.writeText(`https://himatifa.org/media/${name}`)
        setTimeout(() => setCopiedId(null), 2000)
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-5">
                <div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 mb-1">
                        <span>SIM HIMATIFA</span>
                        <ChevronRight className="size-3 text-slate-400" />
                        <span className="text-slate-500">Penyimpanan Digital</span>
                    </div>
                    <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                        Pustaka Media (Media Library)
                    </h1>
                    <p className="mt-1 text-xs sm:text-sm text-slate-500">
                        Kelola galeri gambar, lampiran dokumen, dan aset media publikasi portal.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="hidden items-center gap-3 rounded-xl border border-slate-200 bg-white px-3.5 py-2 shadow-xs sm:flex">
                        <div className="grid size-8 place-items-center rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
                            <HardDrive className="size-4" />
                        </div>
                        <div className="flex flex-col">
                            <div className="flex items-center justify-between gap-6 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                <span>Penyimpanan</span>
                                <span className="text-blue-600 font-extrabold">4.5 / 10 GB</span>
                            </div>
                            <div className="mt-1 h-1.5 w-32 overflow-hidden rounded-full bg-slate-100">
                                <div className="h-full w-[45%] rounded-full bg-blue-600" />
                            </div>
                        </div>
                    </div>

                    <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-blue-600/10 transition hover:bg-blue-500 active:scale-[0.98]">
                        <UploadCloud className="size-4" />
                        <span>Unggah Berkas</span>
                    </button>
                </div>
            </div>

            <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-3 shadow-xs lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-1 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
                    {['Semua', 'Gambar', 'Dokumen', 'Video'].map((tab) => {
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

                <div className="flex items-center gap-2">
                    <button
                        onClick={toggleSelectAll}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                    >
                        <CheckSquare
                            className={`size-3.5 ${
                                filteredMedia.length > 0 &&
                                filteredMedia.every((m) => selectedItems.includes(m.id))
                                    ? 'text-blue-600'
                                    : 'text-slate-400'
                            }`}
                        />
                        <span>Pilih Semua</span>
                    </button>

                    <div className="relative w-full lg:w-64">
                        <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Cari nama berkas..."
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
            </div>

            {selectedItems.length > 0 && (
                <div className="flex items-center justify-between rounded-xl border border-blue-200 bg-blue-50/80 px-4 py-3 text-xs shadow-xs">
                    <div className="flex items-center gap-2 text-blue-900 font-semibold">
                        <span className="grid size-5 place-items-center rounded-full bg-blue-600 text-white text-[10px]">
                            {selectedItems.length}
                        </span>
                        <span>Berkas dipilih</span>
                    </div>
                    <button className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 font-semibold text-white hover:bg-red-500 transition">
                        <Trash2 className="size-3.5" />
                        <span>Hapus Terpilih</span>
                    </button>
                </div>
            )}

            {filteredMedia.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                    {filteredMedia.map((item) => {
                        const isSelected = selectedItems.includes(item.id)
                        const isCopied = copiedId === item.id

                        return (
                            <div
                                key={item.id}
                                className={`group relative flex flex-col overflow-hidden rounded-2xl border transition-all ${
                                    isSelected
                                        ? 'border-blue-600 bg-blue-50/20 ring-2 ring-blue-600/20'
                                        : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs'
                                }`}
                            >
                                <button
                                    onClick={() => toggleSelect(item.id)}
                                    className={`absolute left-3 top-3 z-20 grid size-6 place-items-center rounded-lg border transition-all ${
                                        isSelected
                                            ? 'border-blue-600 bg-blue-600 text-white'
                                            : 'border-slate-300 bg-white/90 text-transparent opacity-0 group-hover:opacity-100 hover:border-slate-400'
                                    }`}
                                >
                                    <Check className="size-3.5 stroke-[3]" />
                                </button>

                                <div className="relative aspect-4/3 w-full overflow-hidden bg-slate-50 border-b border-slate-100">
                                    {item.type === 'Gambar' && item.url ? (
                                        <img
                                            src={item.url}
                                            alt={item.name}
                                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full flex-col items-center justify-center text-slate-300">
                                            {item.type === 'Dokumen' ? (
                                                <FileText className="size-10 text-slate-400" />
                                            ) : item.type === 'Video' ? (
                                                <Video className="size-10 text-slate-400" />
                                            ) : (
                                                <ImageIcon className="size-10 text-slate-400" />
                                            )}
                                        </div>
                                    )}

                                    <div className="absolute inset-0 flex items-center justify-center gap-2 bg-slate-900/40 opacity-0 backdrop-blur-xs transition-opacity group-hover:opacity-100">
                                        <button
                                            onClick={() => handleCopyLink(item.id, item.name)}
                                            className="rounded-xl bg-white p-2 text-slate-700 shadow-md transition hover:bg-blue-600 hover:text-white"
                                            title="Salin URL"
                                        >
                                            {isCopied ? <Check className="size-4 text-emerald-600" /> : <Copy className="size-4" />}
                                        </button>
                                        <button
                                            className="rounded-xl bg-white p-2 text-slate-700 shadow-md transition hover:bg-red-600 hover:text-white"
                                            title="Hapus Berkas"
                                        >
                                            <Trash2 className="size-4" />
                                        </button>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1 p-3.5">
                                    <p
                                        className="truncate text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors"
                                        title={item.name}
                                    >
                                        {item.name}
                                    </p>
                                    <div className="flex items-center justify-between text-[11px] font-medium text-slate-400">
                                        <span>{item.date}</span>
                                        <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-600">
                                            {item.size}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center">
                    <div className="grid size-12 place-items-center rounded-2xl bg-slate-100 text-slate-400 mb-3">
                        <ImageIcon className="size-6" />
                    </div>
                    <p className="text-sm font-bold text-slate-900">Tidak ada berkas media ditemukan</p>
                    <p className="mt-1 text-xs text-slate-500">
                        Coba gunakan kata kunci pencarian lain atau unggah berkas baru ke pustaka.
                    </p>
                </div>
            )}
        </div>
    )
}