'use client'

import { useState, useEffect, useMemo } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import {
    Plus,
    Edit3,
    Trash2,
    Download,
    ImageOff,
    Search,
    ChevronRight,
    X,
    ExternalLink,
    Eye,
    FileText,
    Tag,
    Loader2,
    Link2
} from 'lucide-react'

export interface BeritaItem {
    id: string
    title: string
    slug: string
    category: string
    author: string
    status: 'Published' | 'Draft' | 'Archived'
    image: string | null
    link: string | null
    excerpt: string | null
    content: string | null
    views: number
    published_at: string
}

interface BeritaForm {
    id?: string
    title: string
    slug: string
    category: string
    author: string
    status: 'Published' | 'Draft' | 'Archived'
    image: string
    link: string
    excerpt: string
    published_at: string
}

function generateSlug(text: string) {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
}

export default function AdminBeritaPage() {
    const [articles, setArticles] = useState<BeritaItem[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)

    const [searchQuery, setSearchQuery] = useState('')
    const [activeTab, setActiveTab] = useState<string>('semua')
    const [selectedItems, setSelectedItems] = useState<string[]>([])

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [formError, setFormError] = useState<string | null>(null)
    const [formData, setFormData] = useState<BeritaForm>({
        title: '',
        slug: '',
        category: 'Liputan Kegiatan',
        author: 'Admin HIMATIFA',
        status: 'Published',
        image: '',
        link: '',
        excerpt: '',
        published_at: new Date().toISOString().split('T')[0],
    })

    const supabase = useMemo(
        () =>
            createBrowserClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
            ),
        []
    )

    const fetchArticles = async () => {
        setIsLoading(true)
        const { data, error } = await supabase
            .from('berita')
            .select('*')
            .order('published_at', { ascending: false })
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Gagal memuat berita:', error.message)
        } else {
            setArticles((data as BeritaItem[]) || [])
        }
        setIsLoading(false)
    }

    useEffect(() => {
        fetchArticles()
    }, [])

    const filteredArticles = useMemo(() => {
        return (articles || []).filter((item) => {
            const statusStr = (item.status || 'Published').toLowerCase()
            const matchesTab = activeTab === 'semua' || statusStr === activeTab

            const query = searchQuery.toLowerCase()
            const matchesSearch =
                (item.title || '').toLowerCase().includes(query) ||
                (item.slug || '').toLowerCase().includes(query) ||
                (item.author || '').toLowerCase().includes(query) ||
                (item.category || '').toLowerCase().includes(query)

            return matchesTab && matchesSearch
        })
    }, [articles, activeTab, searchQuery])

    const getTabCount = (tabKey: string) => {
        if (tabKey === 'semua') return articles.length
        return articles.filter((a) => (a.status || '').toLowerCase() === tabKey).length
    }

    const toggleSelect = (id: string) => {
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

    const openCreateModal = () => {
        setFormError(null)
        setFormData({
            title: '',
            slug: '',
            category: 'Liputan Kegiatan',
            author: 'Admin HIMATIFA',
            status: 'Published',
            image: '',
            link: '',
            excerpt: '',
            published_at: new Date().toISOString().split('T')[0],
        })
        setIsModalOpen(true)
    }

    const openEditModal = (item: BeritaItem) => {
        setFormError(null)
        setFormData({
            id: item.id,
            title: item.title,
            slug: item.slug,
            category: item.category,
            author: item.author,
            status: item.status,
            image: item.image || '',
            link: item.link || '',
            excerpt: item.excerpt || '',
            published_at: item.published_at,
        })
        setIsModalOpen(true)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setFormError(null)
        setIsSaving(true)

        const finalSlug = formData.slug.trim()
            ? generateSlug(formData.slug)
            : generateSlug(formData.title)

        const payload = {
            title: formData.title.trim(),
            slug: finalSlug,
            category: formData.category.trim() || 'Rilis Pers',
            author: formData.author.trim() || 'Admin HIMATIFA',
            status: formData.status,
            image: formData.image.trim() || null,
            link: formData.link.trim() || null,
            excerpt: formData.excerpt.trim() || null,
            published_at: formData.published_at || new Date().toISOString().split('T')[0],
        }

        if (formData.id) {
            const { error } = await supabase
                .from('berita')
                .update(payload)
                .eq('id', formData.id)

            if (error) {
                setFormError(`Gagal memperbarui artikel: ${error.message}`)
                setIsSaving(false)
                return
            }
        } else {
            const { error } = await supabase.from('berita').insert(payload)

            if (error) {
                if (error.code === '23505') {
                    setFormError('Slug URL sudah dipakai artikel lain. Silakan ubah judulnya.')
                } else {
                    setFormError(`Gagal menambahkan artikel: ${error.message}`)
                }
                setIsSaving(false)
                return
            }
        }

        setIsSaving(false)
        setIsModalOpen(false)
        await fetchArticles()
    }

    const handleDelete = async (ids: string[]) => {
        if (!confirm(`Yakin ingin menghapus ${ids.length} artikel ini secara permanen?`)) return

        setIsSaving(true)
        const { error } = await supabase.from('berita').delete().in('id', ids)

        if (error) {
            alert(`Gagal menghapus: ${error.message}`)
        } else {
            setSelectedItems((prev) => prev.filter((id) => !ids.includes(id)))
            await fetchArticles()
        }
        setIsSaving(false)
    }

    const handleBulkStatus = async (status: 'Published' | 'Draft' | 'Archived') => {
        setIsSaving(true)
        const { error } = await supabase
            .from('berita')
            .update({ status })
            .in('id', selectedItems)

        if (error) {
            alert(`Gagal mengubah status: ${error.message}`)
        } else {
            setSelectedItems([])
            await fetchArticles()
        }
        setIsSaving(false)
    }

    const handleExportCSV = () => {
        const headers = ['Judul', 'Slug', 'Kategori', 'Penulis', 'Status', 'Tanggal', 'Tautan Kompasiana', 'Views']
        const rows = filteredArticles.map((a) => [
            `"${a.title.replace(/"/g, '""')}"`,
            a.slug,
            a.category,
            a.author,
            a.status,
            a.published_at,
            a.link || '-',
            a.views,
        ])
        const csvContent =
            'data:text/csv;charset=utf-8,' +
            [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
        const encodedUri = encodeURI(csvContent)
        const link = document.createElement('a')
        link.setAttribute('href', encodedUri)
        link.setAttribute('download', `berita-himatifa-${new Date().toISOString().split('T')[0]}.csv`)
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
                        <span className="text-slate-500">Single Source of Truth</span>
                    </div>
                    <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                        Artikel & Berita Himpunan
                    </h1>
                    <p className="mt-1 text-xs sm:text-sm text-slate-500">
                        Kelola rilis pers Kompasiana dan liputan kegiatan yang tampil otomatis di portal publik.
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
                    <button
                        type="button"
                        onClick={openCreateModal}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-blue-600/10 transition hover:bg-blue-500 active:scale-[0.98] cursor-pointer"
                    >
                        <Plus className="size-4" />
                        <span>Tulis / Impor Berita</span>
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
                <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-blue-200 bg-blue-50/80 px-4 py-3 text-xs shadow-xs">
                    <div className="flex items-center gap-2 text-blue-900 font-semibold">
                        <span className="grid size-5 place-items-center rounded-full bg-blue-600 text-white text-[10px]">
                            {selectedItems.length}
                        </span>
                        <span>Artikel terpilih</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            disabled={isSaving}
                            onClick={() => handleBulkStatus('Published')}
                            className="rounded-lg border border-emerald-200 bg-white px-3 py-1.5 font-semibold text-emerald-700 hover:bg-emerald-50 cursor-pointer"
                        >
                            Publish
                        </button>
                        <button
                            disabled={isSaving}
                            onClick={() => handleBulkStatus('Draft')}
                            className="rounded-lg border border-amber-200 bg-white px-3 py-1.5 font-semibold text-amber-700 hover:bg-amber-50 cursor-pointer"
                        >
                            Jadikan Draft
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
                                        filteredArticles.length > 0 &&
                                        filteredArticles.every((a) => selectedItems.includes(a.id))
                                    }
                                    onChange={toggleSelectAll}
                                    className="size-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                />
                            </th>
                            <th className="px-4 py-3.5 font-bold">Judul Artikel & Sumber</th>
                            <th className="px-4 py-3.5 font-bold">Status</th>
                            <th className="px-4 py-3.5 font-bold">Kategori & Penulis</th>
                            <th className="px-4 py-3.5 font-bold">Tanggal & Tayangan</th>
                            <th className="px-5 py-3.5 text-right font-bold">Aksi</th>
                        </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                        {isLoading ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center">
                                    <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-500">
                                        <Loader2 className="size-4 animate-spin text-blue-600" />
                                        <span>Memuat data berita dari Supabase...</span>
                                    </div>
                                </td>
                            </tr>
                        ) : filteredArticles.length > 0 ? (
                            filteredArticles.map((item) => {
                                const isSelected = selectedItems.includes(item.id)
                                const statusLabel = item.status || 'Published'
                                const isKompasiana = item.link?.toLowerCase().includes('kompasiana.com')

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
                                                <div className="relative grid size-11 shrink-0 place-items-center rounded-xl border border-slate-200 bg-slate-50 text-slate-400 overflow-hidden">
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
                                                    <div className="flex items-center gap-2">
                                                        <p className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                                                            {item.title}
                                                        </p>
                                                        {isKompasiana && (
                                                            <span className="shrink-0 rounded bg-sky-50 border border-sky-200 px-1.5 py-0.5 text-[9px] font-extrabold text-sky-700">
                                                                    Kompasiana
                                                                </span>
                                                        )}
                                                    </div>
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
                                                        {item.published_at}
                                                    </span>
                                                <span className="inline-flex items-center gap-1 text-[11px] text-slate-400">
                                                        <Eye className="size-3" />
                                                    {item.views || 0} tayangan
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
                                                        title="Buka Tautan Kompasiana"
                                                        className="rounded-lg p-1.5 text-slate-400 hover:bg-sky-50 hover:text-sky-600 transition-colors"
                                                    >
                                                        <ExternalLink className="size-4" />
                                                    </a>
                                                )}
                                                <button
                                                    type="button"
                                                    onClick={() => openEditModal(item)}
                                                    title="Edit Artikel"
                                                    className="rounded-lg p-1.5 text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-pointer"
                                                >
                                                    <Edit3 className="size-4" />
                                                </button>
                                                <button
                                                    type="button"
                                                    disabled={isSaving}
                                                    onClick={() => handleDelete([item.id])}
                                                    title="Hapus Artikel"
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
                                            <FileText className="size-6" />
                                        </div>
                                        <p className="text-sm font-bold text-slate-900">
                                            Belum ada artikel berita
                                        </p>
                                        <p className="mt-1 text-xs text-slate-500">
                                            Klik tombol &quot;Tulis / Impor Berita&quot; untuk menambahkan berita atau tautan Kompasiana pertama.
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
                    <span className="text-[11px] text-emerald-600 font-semibold">
                        Tersinkronisasi dengan Supabase
                    </span>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs">
                    <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                            <div>
                                <h2 className="text-lg font-extrabold text-slate-900">
                                    {formData.id ? 'Edit Artikel Berita' : 'Tambah Artikel / Tautan Kompasiana'}
                                </h2>
                                <p className="text-xs text-slate-500">
                                    Perubahan akan langsung memperbarui data di halaman publik HIMATIFA.
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
                                    Judul Berita <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="Contoh: HIMATIFA Sukses Gelar Seminar Nasional Teknologi 2026"
                                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 font-medium text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10"
                                />
                            </div>

                            <div>
                                <label className="mb-1.5 flex items-center gap-1.5 font-bold text-slate-700">
                                    <Link2 className="size-3.5 text-sky-600" />
                                    <span>Tautan Artikel Kompasiana (Opsional)</span>
                                </label>
                                <input
                                    type="url"
                                    value={formData.link}
                                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                                    placeholder="https://www.kompasiana.com/himatifa/..."
                                    className="w-full rounded-xl border border-slate-200 bg-sky-50/30 px-3.5 py-2.5 font-medium text-slate-900 outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-600/10"
                                />
                                <p className="mt-1 text-[11px] text-slate-400">
                                    Isi jika berita ini merujuk atau dipublikasikan di akun Kompasiana HIMATIFA.
                                </p>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="mb-1.5 block font-bold text-slate-700">Kategori</label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 font-medium text-slate-900 outline-none focus:border-blue-600"
                                    >
                                        <option value="Liputan Kegiatan">Liputan Kegiatan</option>
                                        <option value="Rilis Pers">Rilis Pers</option>
                                        <option value="Opini & Artikel">Opini & Artikel</option>
                                        <option value="Prestasi Mahasiswa">Prestasi Mahasiswa</option>
                                        <option value="Pengumuman">Pengumuman</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="mb-1.5 block font-bold text-slate-700">Status Publikasi</label>
                                    <select
                                        value={formData.status}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                status: e.target.value as 'Published' | 'Draft' | 'Archived',
                                            })
                                        }
                                        className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 font-medium text-slate-900 outline-none focus:border-blue-600"
                                    >
                                        <option value="Published">Published (Tampil di Web)</option>
                                        <option value="Draft">Draft (Disimpan Sementara)</option>
                                        <option value="Archived">Archived (Arsip)</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="mb-1.5 block font-bold text-slate-700">Penulis / Divisi</label>
                                    <input
                                        type="text"
                                        value={formData.author}
                                        onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                                        placeholder="Kominfo HIMATIFA"
                                        className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 font-medium text-slate-900 outline-none focus:border-blue-600"
                                    />
                                </div>

                                <div>
                                    <label className="mb-1.5 block font-bold text-slate-700">Tanggal Terbit</label>
                                    <input
                                        type="date"
                                        value={formData.published_at}
                                        onChange={(e) => setFormData({ ...formData, published_at: e.target.value })}
                                        className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 font-medium text-slate-900 outline-none focus:border-blue-600"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="mb-1.5 block font-bold text-slate-700">URL Gambar Thumbnail</label>
                                <input
                                    type="url"
                                    value={formData.image}
                                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                    placeholder="https://..."
                                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 font-medium text-slate-900 outline-none focus:border-blue-600"
                                />
                            </div>

                            <div>
                                <label className="mb-1.5 block font-bold text-slate-700">Ringkasan Singkat (Excerpt)</label>
                                <textarea
                                    rows={3}
                                    value={formData.excerpt}
                                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                    placeholder="Tuliskan paragraf pembuka atau ringkasan berita yang tampil di kartu portal utama..."
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
                                    <span>{formData.id ? 'Simpan Perubahan' : 'Publikasikan Berita'}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
