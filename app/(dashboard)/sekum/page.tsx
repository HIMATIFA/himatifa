'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    FileText,
    Archive,
    Calendar,
    FileDown,
    Plus,
    Search,
    X,
    FolderKanban,
    MoreVertical,
    Trash2,
    FileBox,
    CheckCircle2,
    ArrowLeft
} from 'lucide-react'
import Link from 'next/link'

interface ArchiveDocument {
    id: string
    title: string
    category: 'Proposal' | 'LPJ' | 'Surat Keluar' | 'Surat Masuk' | 'SK'
    uploader: string
    date: string
    size: string
    status: 'Terverifikasi' | 'Menunggu'
}

const initialArchives: ArchiveDocument[] = [
    { id: '1', title: 'Proposal VIBRANUM 2026', category: 'Proposal', uploader: 'Arya Putra', date: '12 Okt 2026', size: '2.4 MB', status: 'Terverifikasi' },
    { id: '2', title: 'LPJ Seminar Nasional AI', category: 'LPJ', uploader: 'Divisi Keilmuan', date: '05 Okt 2026', size: '4.1 MB', status: 'Terverifikasi' },
    { id: '3', title: '112/B/HIMA/IX/2026 - Undangan BEM', category: 'Surat Keluar', uploader: 'Sekretaris', date: '24 Sep 2026', size: '850 KB', status: 'Terverifikasi' },
    { id: '4', title: '012/SK/HIMA/VIII/2026 - Susunan BPH', category: 'SK', uploader: 'Ketua Umum', date: '15 Ags 2026', size: '1.2 MB', status: 'Terverifikasi' },
    { id: '5', title: 'Surat Peminjaman Gedung Teater', category: 'Surat Keluar', uploader: 'Sekretaris', date: '10 Ags 2026', size: '500 KB', status: 'Menunggu' },
]

export default function SekumPage() {
    const [archives, setArchives] = useState<ArchiveDocument[]>(initialArchives)
    const [activeTab, setActiveTab] = useState<string>('Semua')
    const [searchQuery, setSearchQuery] = useState<string>('')

    const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false)
    const [uploadSubject, setUploadSubject] = useState('')
    const [uploadCategory, setUploadCategory] = useState('Proposal')

    const filteredArchives = useMemo(() => {
        return archives.filter((doc) => {
            const matchesTab = activeTab === 'Semua' || doc.category === activeTab
            const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                doc.uploader.toLowerCase().includes(searchQuery.toLowerCase())
            return matchesTab && matchesSearch
        })
    }, [archives, activeTab, searchQuery])

    const totalDocs = archives.length
    const totalProposalLPJ = archives.filter(d => d.category === 'Proposal' || d.category === 'LPJ').length
    const totalSurat = archives.filter(d => d.category === 'Surat Keluar' || d.category === 'Surat Masuk').length

    const categories = ['Semua', 'Proposal', 'LPJ', 'Surat Keluar', 'Surat Masuk', 'SK']

    const handleUpload = () => {
        if (!uploadSubject.trim()) {
            alert('Mohon isi nama dokumen!')
            return
        }

        const newDoc: ArchiveDocument = {
            id: `doc-${Date.now()}`,
            title: uploadSubject,
            category: uploadCategory as any,
            uploader: 'Sekretaris',
            date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
            size: '0 KB',
            status: 'Menunggu'
        }

        setArchives([newDoc, ...archives])
        setIsUploadModalOpen(false)
        setUploadSubject('')
    }

    return (
        <main className="min-h-screen bg-[#f4f8fc] text-[#0a192f] selection:bg-blue-200">
            <div className="fixed left-0 top-0 -z-10 h-full w-full overflow-hidden">
                <div className="absolute -left-20 -top-20 h-[450px] w-[450px] rounded-full bg-blue-300/20 blur-[120px]" />
                <div className="absolute right-0 top-1/3 h-[500px] w-[500px] rounded-full bg-emerald-200/20 blur-[140px]" />
            </div>

            <header className="fixed inset-x-0 top-0 z-50 flex flex-col items-center px-4 pt-4 sm:px-6 lg:px-10">
                <nav className="flex w-full max-w-7xl items-center justify-between rounded-full border border-slate-200/60 bg-white/90 px-4 py-2.5 shadow-sm backdrop-blur-xl">
                    <Link
                        href="/"
                        className="group flex items-center gap-2 rounded-full p-2 text-sm font-bold tracking-tight text-slate-600 transition-colors hover:bg-slate-100 hover:text-[#2563eb]"
                    >
                        <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
                        <span className="hidden sm:inline">Kembali</span>
                    </Link>

                    <div className="hidden flex-1 px-4 md:block">
                        <div className="relative mx-auto max-w-sm">
                            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Cari dokumen arsip..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full rounded-full border-none bg-slate-100 py-1.5 pl-9 pr-4 text-xs font-medium outline-none focus:ring-2 focus:ring-[#2563eb]/20"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-xs font-black text-[#2563eb]">
                        <Archive className="size-4 shrink-0" />
                        <span>SEKUM HIMATIFA</span>
                    </div>
                </nav>
            </header>

            <div className="mx-auto max-w-7xl px-6 pb-24 pt-32 lg:px-10">
                <header className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                            Administrasi <span className="text-[#2563eb]">Sekretaris.</span>
                        </h1>
                        <p className="mt-1 text-sm text-slate-500">
                            Kelola arsip surat, proposal, LPJ, dan repositori dokumen digital secara rapi.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <button
                            onClick={() => setIsUploadModalOpen(true)}
                            className="flex items-center gap-2 rounded-2xl bg-[#2563eb] px-5 py-3 text-xs font-bold text-white shadow-xl shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700"
                        >
                            <Plus className="size-4" /> Unggah Arsip Baru
                        </button>
                    </div>
                </header>

                <div className="mb-8 grid gap-5 sm:grid-cols-3">
                    <div className="flex items-center gap-5 rounded-[2rem] border border-white/80 bg-white/80 p-6 shadow-xl shadow-blue-900/5 backdrop-blur-xl">
                        <div className="grid size-14 shrink-0 place-items-center rounded-2xl bg-blue-50 text-[#2563eb]">
                            <Archive className="size-6" />
                        </div>
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Arsip</p>
                            <p className="mt-1 font-mono text-2xl font-black text-[#0a192f]">
                                {totalDocs} <span className="text-sm font-semibold text-slate-500">dokumen</span>
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-5 rounded-[2rem] border border-white/80 bg-white/80 p-6 shadow-xl shadow-blue-900/5 backdrop-blur-xl">
                        <div className="grid size-14 shrink-0 place-items-center rounded-2xl bg-emerald-50 text-emerald-600">
                            <FolderKanban className="size-6" />
                        </div>
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Proposal & LPJ</p>
                            <p className="mt-1 font-mono text-2xl font-black text-[#0a192f]">
                                {totalProposalLPJ} <span className="text-sm font-semibold text-slate-500">berkas</span>
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-5 rounded-[2rem] border border-white/80 bg-white/80 p-6 shadow-xl shadow-blue-900/5 backdrop-blur-xl">
                        <div className="grid size-14 shrink-0 place-items-center rounded-2xl bg-amber-50 text-amber-600">
                            <FileText className="size-6" />
                        </div>
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Surat & SK</p>
                            <p className="mt-1 font-mono text-2xl font-black text-[#0a192f]">
                                {totalSurat} <span className="text-sm font-semibold text-slate-500">surat</span>
                            </p>
                        </div>
                    </div>
                </div>

                <section className="rounded-[2.5rem] border border-white/80 bg-white/80 p-6 shadow-xl shadow-blue-900/5 backdrop-blur-xl sm:p-8">
                    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                            <div className="grid size-10 place-items-center rounded-2xl bg-blue-50 text-[#2563eb]">
                                <FileBox className="size-5" />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-[#0a192f]">Direktori Dokumen</h2>
                                <p className="text-xs font-medium text-slate-400">Repositori file administrasi organisasi</p>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                            <div className="flex gap-1 overflow-x-auto rounded-xl bg-slate-100 p-1 text-xs font-bold hide-scrollbar">
                                {categories.map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`whitespace-nowrap rounded-lg px-3 py-1.5 transition ${
                                            activeTab === tab ? 'bg-white text-[#2563eb] shadow-sm' : 'text-slate-500 hover:text-slate-800'
                                        }`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>

                            <div className="relative md:hidden">
                                <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Cari dokumen..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full rounded-xl border border-slate-200/80 bg-slate-50/50 pl-10 pr-4 py-2 text-xs font-medium outline-none transition focus:border-[#2563eb] focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-600">
                            <thead className="border-b border-slate-100 text-[11px] uppercase tracking-wider text-slate-400">
                            <tr>
                                <th className="pb-3.5 px-2 font-extrabold">Nama Dokumen</th>
                                <th className="pb-3.5 px-4 font-extrabold">Kategori</th>
                                <th className="pb-3.5 px-4 font-extrabold">Diunggah Oleh</th>
                                <th className="pb-3.5 px-4 font-extrabold">Waktu & Info</th>
                                <th className="pb-3.5 px-2 text-right font-extrabold">Aksi</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                            {filteredArchives.map((doc) => (
                                <tr key={doc.id} className="group transition hover:bg-slate-50/80">
                                    <td className="py-4 px-2">
                                        <div className="flex items-center gap-3">
                                            <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-red-50 text-red-500">
                                                <FileText className="size-4" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-[#0a192f]">{doc.title}</p>
                                                <div className="mt-1 flex items-center gap-1.5">
                                                    {doc.status === 'Terverifikasi' ? (
                                                        <><CheckCircle2 className="size-3 text-emerald-500" /> <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Terverifikasi</span></>
                                                    ) : (
                                                        <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">Menunggu</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4 whitespace-nowrap">
                                            <span className="rounded-md bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                                                {doc.category}
                                            </span>
                                    </td>
                                    <td className="py-4 px-4 whitespace-nowrap font-semibold text-slate-700">
                                        {doc.uploader}
                                    </td>
                                    <td className="py-4 px-4 whitespace-nowrap">
                                        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                                            <Calendar className="size-3.5" /> {doc.date}
                                        </div>
                                        <p className="mt-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">{doc.size} PDF</p>
                                    </td>
                                    <td className="py-4 px-2 text-right whitespace-nowrap">
                                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button title="Unduh Berkas" className="rounded-lg p-2 text-slate-400 hover:bg-blue-50 hover:text-[#2563eb]">
                                                <FileDown className="size-4" />
                                            </button>
                                            <button title="Hapus" className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600">
                                                <Trash2 className="size-4" />
                                            </button>
                                            <button className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-900">
                                                <MoreVertical className="size-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredArchives.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="py-12 text-center">
                                        <Archive className="mx-auto size-8 text-slate-300" />
                                        <p className="mt-2 text-sm font-bold text-slate-400">Tidak ada arsip yang ditemukan.</p>
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>

            <AnimatePresence>
                {isUploadModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsUploadModalOpen(false)}
                            className="absolute inset-0 bg-[#0a192f]/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-lg overflow-hidden rounded-[2.5rem] border border-white/80 bg-white/95 p-6 shadow-2xl backdrop-blur-2xl sm:p-8"
                        >
                            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                                <div className="flex items-center gap-2 font-black text-[#0a192f]">
                                    <Plus className="size-5 text-[#2563eb]" /> Unggah Dokumen Arsip
                                </div>
                                <button
                                    onClick={() => setIsUploadModalOpen(false)}
                                    className="rounded-full bg-slate-100 p-2 text-slate-500 hover:bg-slate-200 transition"
                                >
                                    <X className="size-4" />
                                </button>
                            </div>

                            <div className="mt-6 space-y-4">
                                <div>
                                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">
                                        Nama / Judul Dokumen <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={uploadSubject}
                                        onChange={(e) => setUploadSubject(e.target.value)}
                                        placeholder="Contoh: Proposal Dies Natalis 2026"
                                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3.5 text-sm font-medium outline-none transition focus:border-[#2563eb] focus:bg-white focus:ring-2 focus:ring-[#2563eb]/20"
                                    />
                                </div>

                                <div>
                                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">
                                        Kategori Arsip
                                    </label>
                                    <select
                                        value={uploadCategory}
                                        onChange={(e) => setUploadCategory(e.target.value)}
                                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3.5 text-sm font-bold outline-none transition focus:border-[#2563eb] focus:bg-white focus:ring-2 focus:ring-[#2563eb]/20"
                                    >
                                        <option value="Proposal">Proposal Kegiatan</option>
                                        <option value="LPJ">LPJ Kegiatan</option>
                                        <option value="Surat Keluar">Surat Keluar</option>
                                        <option value="Surat Masuk">Surat Masuk</option>
                                        <option value="SK">Surat Keputusan (SK)</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">
                                        Pilih Berkas (PDF)
                                    </label>
                                    <div className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-8 text-center transition hover:border-[#2563eb] hover:bg-blue-50/50">
                                        <FileBox className="size-8 text-slate-400" />
                                        <p className="mt-3 text-sm font-bold text-[#0a192f]">Klik atau seret berkas ke sini</p>
                                        <p className="mt-1 text-xs text-slate-500">Maksimal ukuran file 10 MB (.pdf)</p>
                                    </div>
                                </div>

                                <button
                                    onClick={handleUpload}
                                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#2563eb] py-4 text-sm font-bold text-white shadow-xl shadow-blue-600/20 transition hover:bg-blue-700"
                                >
                                    <CheckCircle2 className="size-4" /> Simpan Arsip
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </main>
    )
}