'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    initialArchiveDocuments,
    type ArchiveDocument,
    type SuratCategory,
    type SuratStatus
} from '@/app/data'
import {
    Archive,
    FileText,
    FolderKanban,
    Plus,
    Search,
    X,
    Trash2,
    FileBox,
    CheckCircle2,
    Clock,
    XCircle,
    ShieldCheck,
    FileDown,
    Calendar,
    Sparkles,
    Tag,
    Eye, ChevronRight
} from 'lucide-react'

export default function SekumSuratPage() {
    const [archives, setArchives] = useState<ArchiveDocument[]>(initialArchiveDocuments)
    const [activeTab, setActiveTab] = useState<string>('Semua')
    const [searchQuery, setSearchQuery] = useState<string>('')

    const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null)
    const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false)
    const [selectedDoc, setSelectedDoc] = useState<ArchiveDocument | null>(null)

    const [uploadTitle, setUploadTitle] = useState('')
    const [uploadCategory, setUploadCategory] = useState<SuratCategory>('Proposal')
    const [uploadFile, setUploadFile] = useState<File | null>(null)

    const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
        setToast({ message, type })
        setTimeout(() => setToast(null), 3500)
    }

    const { totalDocs, totalProposalLPJ, totalSurat, totalPending } = useMemo(() => {
        const total = archives.length
        const propLpj = archives.filter(d => d.category === 'Proposal' || d.category === 'LPJ').length
        const surat = archives.filter(d => d.category === 'Surat Keluar' || d.category === 'Surat Masuk' || d.category === 'SK').length
        const pending = archives.filter(d => d.status === 'Menunggu').length

        return { totalDocs: total, totalProposalLPJ: propLpj, totalSurat: surat, totalPending: pending }
    }, [archives])

    const categories = ['Semua', 'Proposal', 'LPJ', 'Surat Keluar', 'Surat Masuk', 'SK']

    const handleUpload = () => {
        if (!uploadTitle.trim()) {
            showToast('Mohon isi nama dokumen!', 'error')
            return
        }

        const sizeStr = uploadFile ? `${(uploadFile.size / (1024 * 1024)).toFixed(1)} MB` : '1.5 MB'

        const newDoc: ArchiveDocument = {
            id: `DOC-00${archives.length + 1}`,
            title: uploadTitle,
            category: uploadCategory,
            uploader: 'Sekretaris Umum',
            date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
            size: sizeStr,
            status: 'Menunggu'
        }

        setArchives([newDoc, ...archives])
        setIsUploadModalOpen(false)
        setUploadTitle('')
        setUploadFile(null)
        showToast(`Dokumen "${newDoc.title}" berhasil diunggah dan menunggu verifikasi.`)
    }

    const handleDelete = (id: string, title: string) => {
        if (confirm(`Apakah Anda yakin ingin menghapus "${title}"?`)) {
            setArchives(archives.filter(d => d.id !== id))
            if (selectedDoc?.id === id) setSelectedDoc(null)
            showToast(`Dokumen "${title}" telah dihapus dari arsip.`, 'info')
        }
    }

    const handleVerifyStatus = (id: string, newStatus: SuratStatus) => {
        setArchives(prev => prev.map(d => d.id === id ? { ...d, status: newStatus } : d))
        if (selectedDoc?.id === id) setSelectedDoc({ ...selectedDoc, status: newStatus })
        showToast(`Status dokumen diperbarui menjadi "${newStatus}".`)
    }

    const filteredArchives = useMemo(() => {
        return archives.filter((doc) => {
            const matchesTab = activeTab === 'Semua' || doc.category === activeTab
            const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                doc.uploader.toLowerCase().includes(searchQuery.toLowerCase()) ||
                doc.id.toLowerCase().includes(searchQuery.toLowerCase())
            return matchesTab && matchesSearch
        })
    }, [archives, activeTab, searchQuery])

    return (
        <div className="space-y-6 font-sans">
            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, y: -16, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -16, scale: 0.98 }}
                        className="fixed top-6 right-6 z-50 flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-lg"
                    >
                        {toast.type === 'success' && <CheckCircle2 className="size-4.5 text-emerald-600" />}
                        {toast.type === 'error' && <XCircle className="size-4.5 text-red-600" />}
                        {toast.type === 'info' && <Sparkles className="size-4.5 text-blue-600" />}
                        <span className="text-xs font-semibold text-slate-700">{toast.message}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center border-b border-slate-200 pb-5">
                <div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 mb-1">
                        <span>SIM HIMATIFA</span>
                        <ChevronRight className="size-3 text-slate-400" />
                        <span className="text-slate-500">Sekretariat Umum (Sekum)</span>
                    </div>
                    <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                        Persuratan & <span className="text-blue-600">SK Himpunan</span>
                    </h1>
                    <p className="mt-1 text-xs text-slate-500 font-medium">
                        Kelola arsip surat masuk/keluar, proposal proker, LPJ, dan repositori Surat Keputusan (SK) resmi.
                    </p>
                </div>

                <button
                    onClick={() => setIsUploadModalOpen(true)}
                    className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-blue-600/10 transition hover:bg-blue-500 active:scale-[0.98] cursor-pointer shrink-0"
                >
                    <Plus className="size-4" />
                    <span>Unggah Arsip Baru</span>
                </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Total Dokumentasi</span>
                        <div className="grid size-9 place-items-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
                            <Archive className="size-4.5" />
                        </div>
                    </div>
                    <p className="text-xl font-extrabold text-slate-900">{totalDocs} Berkas</p>
                    <p className="mt-0.5 text-[11px] text-slate-500 font-medium">Tersimpan secara digital</p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Proposal & LPJ</span>
                        <div className="grid size-9 place-items-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                            <FolderKanban className="size-4.5" />
                        </div>
                    </div>
                    <p className="text-xl font-extrabold text-slate-900">{totalProposalLPJ} Berkas</p>
                    <p className="mt-0.5 text-[11px] text-slate-500 font-medium">Laporan program kerja</p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Surat & SK Resmi</span>
                        <div className="grid size-9 place-items-center rounded-xl bg-sky-50 text-sky-600 border border-sky-100">
                            <FileText className="size-4.5" />
                        </div>
                    </div>
                    <p className="text-xl font-extrabold text-slate-900">{totalSurat} Dokumen</p>
                    <p className="mt-0.5 text-[11px] text-slate-500 font-medium">Surat masuk, keluar & SK</p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Perlu Verifikasi</span>
                        <div className="grid size-9 place-items-center rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
                            <Clock className="size-4.5" />
                        </div>
                    </div>
                    <p className="text-xl font-extrabold text-amber-600">{totalPending} Dokumen</p>
                    <p className="mt-0.5 text-[11px] text-slate-500 font-medium">Menunggu persetujuan Sekum</p>
                </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between border-b border-slate-100 pb-4">
                    <div className="flex gap-1 overflow-x-auto rounded-xl bg-slate-100 p-1 text-xs font-semibold">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveTab(cat)}
                                className={`rounded-lg px-3 py-1.5 transition cursor-pointer whitespace-nowrap ${
                                    activeTab === cat
                                        ? 'bg-white text-blue-600 shadow-xs'
                                        : 'text-slate-600 hover:text-slate-900'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    <div className="relative flex-1 lg:max-w-xs">
                        <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Cari nama dokumen atau uploader..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
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

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-600">
                        <thead className="border-b border-slate-200 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 bg-slate-50/50">
                        <tr>
                            <th className="py-3 px-3">Nama Dokumen & ID</th>
                            <th className="py-3 px-3">Kategori</th>
                            <th className="py-3 px-3">Diunggah Oleh</th>
                            <th className="py-3 px-3">Tanggal & Ukuran</th>
                            <th className="py-3 px-3">Status Verifikasi</th>
                            <th className="py-3 px-3 text-right">Aksi</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                        {filteredArchives.map((doc) => (
                            <tr key={doc.id} className="group transition hover:bg-slate-50/80">
                                <td className="py-3.5 px-3">
                                    <div className="flex items-center gap-3">
                                        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600 border border-red-100 font-bold text-xs">
                                            <FileText className="size-4" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900 group-hover:text-blue-600 transition">{doc.title}</p>
                                            <span className="font-mono text-[10px] font-semibold text-slate-400">{doc.id}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-3.5 px-3 whitespace-nowrap">
                                        <span className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-700 border border-slate-200">
                                            <Tag className="size-3 text-blue-600" />
                                            {doc.category}
                                        </span>
                                </td>
                                <td className="py-3.5 px-3 font-semibold text-slate-800 whitespace-nowrap">
                                    {doc.uploader}
                                </td>
                                <td className="py-3.5 px-3 whitespace-nowrap">
                                    <p className="flex items-center gap-1 text-slate-700 font-medium">
                                        <Calendar className="size-3 text-slate-400" /> {doc.date}
                                    </p>
                                    <p className="text-[10px] text-slate-400 font-mono font-semibold">{doc.size}</p>
                                </td>
                                <td className="py-3.5 px-3 whitespace-nowrap">
                                    {doc.status === 'Terverifikasi' && (
                                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">
                                                <CheckCircle2 className="size-3" />
                                                <span>Terverifikasi</span>
                                            </span>
                                    )}
                                    {doc.status === 'Menunggu' && (
                                        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200 px-2.5 py-0.5 text-[10px] font-bold text-amber-700">
                                                <Clock className="size-3" />
                                                <span>Menunggu</span>
                                            </span>
                                    )}
                                    {doc.status === 'Ditolak' && (
                                        <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 border border-red-200 px-2.5 py-0.5 text-[10px] font-bold text-red-700">
                                                <XCircle className="size-3" />
                                                <span>Ditolak</span>
                                            </span>
                                    )}
                                </td>
                                <td className="py-3.5 px-3 text-right whitespace-nowrap">
                                    <div className="flex items-center justify-end gap-1">
                                        <button
                                            title="Lihat Detail"
                                            onClick={() => setSelectedDoc(doc)}
                                            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-800 cursor-pointer"
                                        >
                                            <Eye className="size-4" />
                                        </button>
                                        <button
                                            title="Unduh Dokumen"
                                            onClick={() => showToast(`Mengunduh berkas ${doc.title}...`, 'info')}
                                            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-blue-50 hover:text-blue-600 cursor-pointer"
                                        >
                                            <FileDown className="size-4" />
                                        </button>
                                        <button
                                            title="Hapus Dokumen"
                                            onClick={() => handleDelete(doc.id, doc.title)}
                                            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-red-50 hover:text-red-600 cursor-pointer"
                                        >
                                            <Trash2 className="size-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                    {filteredArchives.length === 0 && (
                        <div className="py-12 text-center">
                            <Archive className="mx-auto size-8 text-slate-300" />
                            <p className="mt-2 text-xs font-semibold text-slate-500">Tidak ada arsip dokumen yang sesuai dengan pencarian.</p>
                        </div>
                    )}
                </div>
            </div>

            <AnimatePresence>
                {selectedDoc && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedDoc(null)}
                            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.98, y: 12 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.98, y: 12 }}
                            className="relative z-10 w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl"
                        >
                            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                <div>
                                    <span className="font-mono text-[10px] font-bold text-blue-600">{selectedDoc.id}</span>
                                    <h3 className="text-base font-bold text-slate-900">{selectedDoc.title}</h3>
                                </div>
                                <button
                                    onClick={() => setSelectedDoc(null)}
                                    className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition cursor-pointer"
                                >
                                    <X className="size-4.5" />
                                </button>
                            </div>

                            <div className="mt-4 space-y-3 text-xs">
                                <div className="flex justify-between py-1 border-b border-slate-100">
                                    <span className="text-slate-400 font-medium">Kategori:</span>
                                    <span className="font-bold text-slate-900">{selectedDoc.category}</span>
                                </div>
                                <div className="flex justify-between py-1 border-b border-slate-100">
                                    <span className="text-slate-400 font-medium">Pengunggah:</span>
                                    <span className="font-bold text-slate-900">{selectedDoc.uploader}</span>
                                </div>
                                <div className="flex justify-between py-1 border-b border-slate-100">
                                    <span className="text-slate-400 font-medium">Tanggal Upload:</span>
                                    <span className="font-bold text-slate-900">{selectedDoc.date}</span>
                                </div>
                                <div className="flex justify-between py-1 border-b border-slate-100">
                                    <span className="text-slate-400 font-medium">Ukuran Berkas:</span>
                                    <span className="font-mono font-bold text-slate-900">{selectedDoc.size}</span>
                                </div>

                                <div className="pt-4 flex gap-2">
                                    {selectedDoc.status === 'Menunggu' && (
                                        <button
                                            onClick={() => handleVerifyStatus(selectedDoc.id, 'Terverifikasi')}
                                            className="flex-1 rounded-xl bg-emerald-600 py-2.5 text-xs font-semibold text-white hover:bg-emerald-500 transition cursor-pointer"
                                        >
                                            Verifikasi Dokumen
                                        </button>
                                    )}
                                    <button
                                        onClick={() => {
                                            showToast(`Mengunduh ${selectedDoc.title}...`, 'info')
                                            setSelectedDoc(null)
                                        }}
                                        className="flex-1 rounded-xl bg-blue-600 py-2.5 text-xs font-semibold text-white hover:bg-blue-500 transition cursor-pointer"
                                    >
                                        Unduh Berkas
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isUploadModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsUploadModalOpen(false)}
                            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.98, y: 12 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.98, y: 12 }}
                            className="relative z-10 w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-xl sm:p-8"
                        >
                            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                                <div className="flex items-center gap-2.5 font-bold text-slate-900 text-base">
                                    <div className="grid size-8 place-items-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
                                        <Plus className="size-4" />
                                    </div>
                                    <span>Unggah Dokumen Arsip Baru</span>
                                </div>
                                <button
                                    onClick={() => setIsUploadModalOpen(false)}
                                    className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition cursor-pointer"
                                >
                                    <X className="size-4.5" />
                                </button>
                            </div>

                            <div className="mt-5 space-y-4">
                                <div>
                                    <label className="mb-1 block text-xs font-semibold text-slate-700">
                                        Judul Dokumen <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={uploadTitle}
                                        onChange={(e) => setUploadTitle(e.target.value)}
                                        placeholder="Contoh: Proposal Dies Natalis 2026"
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 px-3.5 text-xs font-medium text-slate-900 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/10"
                                    />
                                </div>

                                <div>
                                    <label className="mb-1 block text-xs font-semibold text-slate-700">
                                        Kategori Arsip
                                    </label>
                                    <select
                                        value={uploadCategory}
                                        onChange={(e) => setUploadCategory(e.target.value as SuratCategory)}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 px-3.5 text-xs font-semibold text-slate-900 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/10 cursor-pointer"
                                    >
                                        <option value="Proposal">Proposal Kegiatan</option>
                                        <option value="LPJ">LPJ Kegiatan</option>
                                        <option value="Surat Keluar">Surat Keluar</option>
                                        <option value="Surat Masuk">Surat Masuk</option>
                                        <option value="SK">Surat Keputusan (SK)</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="mb-1 block text-xs font-semibold text-slate-700">
                                        Pilih Berkas PDF
                                    </label>
                                    <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-6 text-center transition hover:border-blue-600 hover:bg-blue-50/30">
                                        <FileBox className="size-8 text-slate-400" />
                                        <p className="mt-2 text-xs font-bold text-slate-800">
                                            {uploadFile ? uploadFile.name : 'Klik atau seret berkas ke sini'}
                                        </p>
                                        <p className="mt-0.5 text-[10px] text-slate-400 font-medium">Maksimal ukuran file 10 MB (.pdf)</p>
                                        <input
                                            type="file"
                                            accept=".pdf"
                                            className="hidden"
                                            onChange={(e) => {
                                                if (e.target.files && e.target.files[0]) {
                                                    setUploadFile(e.target.files[0])
                                                }
                                            }}
                                        />
                                    </label>
                                </div>

                                <div className="mt-6 flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
                                    <button
                                        type="button"
                                        onClick={() => setIsUploadModalOpen(false)}
                                        className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleUpload}
                                        className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-blue-600/10 transition hover:bg-blue-500 active:scale-[0.98] cursor-pointer"
                                    >
                                        <CheckCircle2 className="size-4" />
                                        <span>Simpan Arsip</span>
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}