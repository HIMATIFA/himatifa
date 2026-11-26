'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { createBrowserClient } from '@supabase/ssr'
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
    FileDown,
    Calendar,
    Sparkles,
    Tag,
    Eye,
    ChevronRight,
    Loader2,
    ShieldAlert
} from 'lucide-react'

export type SuratCategory = 'Proposal' | 'LPJ' | 'Surat Keluar' | 'Surat Masuk' | 'SK'
export type SuratStatus = 'Menunggu' | 'Terverifikasi' | 'Ditolak'

export interface ArchiveDocument {
    id: string
    doc_code: string
    title: string
    category: SuratCategory
    uploader: string
    uploaded_date: string
    file_size: string
    file_path: string | null
    file_url: string | null
    status: SuratStatus
    created_at: string
}

const formatTanggalID = (isoDate: string): string => {
    if (!isoDate) return '-'
    const d = new Date(`${isoDate}T00:00:00`)
    if (isNaN(d.getTime())) return isoDate
    return d.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    })
}

export default function SekumSuratPage() {
    const router = useRouter()

    const [isCheckingAuth, setIsCheckingAuth] = useState(true)
    const [isAuthorized, setIsAuthorized] = useState(false)
    const [currentUserId, setCurrentUserId] = useState<string | null>(null)
    const [currentUserName, setCurrentUserName] = useState<string>('Sekretaris Umum')

    const [archives, setArchives] = useState<ArchiveDocument[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isUploading, setIsUploading] = useState(false)

    const [activeTab, setActiveTab] = useState<string>('Semua')
    const [searchQuery, setSearchQuery] = useState<string>('')

    const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null)
    const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false)
    const [selectedDoc, setSelectedDoc] = useState<ArchiveDocument | null>(null)

    const [uploadTitle, setUploadTitle] = useState('')
    const [uploadCategory, setUploadCategory] = useState<SuratCategory>('Proposal')
    const [uploadFile, setUploadFile] = useState<File | null>(null)

    const supabase = useMemo(
        () =>
            createBrowserClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
            ),
        []
    )

    const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
        setToast({ message, type })
        setTimeout(() => setToast(null), 3500)
    }

    useEffect(() => {
        const checkAccess = async () => {
            setIsCheckingAuth(true)
            const {
                data: { user }
            } = await supabase.auth.getUser()

            if (!user) {
                router.replace('/login')
                return
            }

            setCurrentUserId(user.id)

            const { data: profile } = await supabase
                .from('profiles')
                .select('role, full_name')
                .eq('id', user.id)
                .single()

            const role = profile?.role || user.user_metadata?.role

            if (role !== 'sekum' && role !== 'admin') {
                setIsAuthorized(false)
                setIsCheckingAuth(false)
                return
            }

            if (profile?.full_name) {
                setCurrentUserName(profile.full_name)
            } else if (role === 'admin') {
                setCurrentUserName('Administrator')
            }

            setIsAuthorized(true)
            setIsCheckingAuth(false)
        }

        checkAccess()
    }, [supabase, router])

    const fetchArchives = async () => {
        setIsLoading(true)
        const { data, error } = await supabase
            .from('surat_archives')
            .select('*')
            .order('created_at', { ascending: false })

        if (!error && data) {
            setArchives(data as ArchiveDocument[])
        }
        setIsLoading(false)
    }

    useEffect(() => {
        if (!isAuthorized) return

        fetchArchives()

        const channel = supabase
            .channel('surat-archives-realtime')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'surat_archives' },
                () => fetchArchives()
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [isAuthorized, supabase])

    const { totalDocs, totalProposalLPJ, totalSurat, totalPending } = useMemo(() => {
        const total = archives.length
        const propLpj = archives.filter((d) => d.category === 'Proposal' || d.category === 'LPJ').length
        const surat = archives.filter(
            (d) => d.category === 'Surat Keluar' || d.category === 'Surat Masuk' || d.category === 'SK'
        ).length
        const pending = archives.filter((d) => d.status === 'Menunggu').length

        return { totalDocs: total, totalProposalLPJ: propLpj, totalSurat: surat, totalPending: pending }
    }, [archives])

    const categories: ('Semua' | SuratCategory)[] = [
        'Semua',
        'Proposal',
        'LPJ',
        'Surat Keluar',
        'Surat Masuk',
        'SK'
    ]

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!uploadTitle.trim()) {
            showToast('Mohon isi judul dokumen!', 'error')
            return
        }

        if (uploadFile) {
            if (uploadFile.type !== 'application/pdf') {
                showToast('Format berkas harus berupa PDF (.pdf)!', 'error')
                return
            }
            if (uploadFile.size > 10 * 1024 * 1024) {
                showToast('Ukuran file maksimal 10 MB!', 'error')
                return
            }
        }

        setIsUploading(true)

        let filePath: string | null = null
        let fileUrl: string | null = null
        let sizeStr = '0.0 MB'

        if (uploadFile) {
            sizeStr = `${(uploadFile.size / (1024 * 1024)).toFixed(2)} MB`
            const safeName = uploadFile.name.replace(/[^a-zA-Z0-9._-]/g, '_')
            filePath = `${uploadCategory.toLowerCase().replace(/\s+/g, '-')}/${Date.now()}_${safeName}`

            const { error: uploadError } = await supabase.storage
                .from('sekum-arsip')
                .upload(filePath, uploadFile, {
                    contentType: 'application/pdf',
                    upsert: false
                })

            if (uploadError) {
                showToast(`Gagal mengunggah PDF: ${uploadError.message}`, 'error')
                setIsUploading(false)
                return
            }

            const { data: publicUrlData } = supabase.storage.from('sekum-arsip').getPublicUrl(filePath)
            fileUrl = publicUrlData.publicUrl
        }

        const randomNum = Math.floor(100 + Math.random() * 900)
        const docCode = `DOC-${randomNum}`

        const { error: insertError } = await supabase.from('surat_archives').insert({
            doc_code: docCode,
            title: uploadTitle.trim(),
            category: uploadCategory,
            uploader: currentUserName,
            uploaded_date: new Date().toISOString().split('T')[0],
            file_size: sizeStr,
            file_path: filePath,
            file_url: fileUrl,
            status: 'Menunggu',
            created_by: currentUserId
        })

        if (insertError) {
            if (filePath) {
                await supabase.storage.from('sekum-arsip').remove([filePath])
            }
            showToast(`Gagal menyimpan arsip: ${insertError.message}`, 'error')
            setIsUploading(false)
            return
        }

        setIsUploading(false)
        setIsUploadModalOpen(false)
        setUploadTitle('')
        setUploadFile(null)
        showToast(`Dokumen "${uploadTitle.trim()}" berhasil diunggah dan menunggu verifikasi.`)
        await fetchArchives()
    }

    const handleDelete = async (doc: ArchiveDocument) => {
        if (!confirm(`Apakah Anda yakin ingin menghapus "${doc.title}" (${doc.doc_code})?`)) return

        if (doc.file_path) {
            await supabase.storage.from('sekum-arsip').remove([doc.file_path])
        }

        const { error } = await supabase.from('surat_archives').delete().eq('id', doc.id)
        if (error) {
            showToast(`Gagal menghapus dokumen: ${error.message}`, 'error')
        } else {
            if (selectedDoc?.id === doc.id) setSelectedDoc(null)
            showToast(`Dokumen "${doc.title}" telah dihapus dari arsip.`, 'info')
            await fetchArchives()
        }
    }

    const handleVerifyStatus = async (doc: ArchiveDocument, newStatus: SuratStatus) => {
        const { error } = await supabase
            .from('surat_archives')
            .update({ status: newStatus })
            .eq('id', doc.id)

        if (error) {
            showToast(`Gagal memperbarui status: ${error.message}`, 'error')
            return
        }

        if (selectedDoc?.id === doc.id) {
            setSelectedDoc({ ...selectedDoc, status: newStatus })
        }
        showToast(`Status dokumen diperbarui menjadi "${newStatus}".`)
        await fetchArchives()
    }

    const handleDownloadDoc = (doc: ArchiveDocument) => {
        if (doc.file_url) {
            window.open(doc.file_url, '_blank', 'noopener,noreferrer')
            showToast(`Membuka berkas ${doc.title}...`, 'info')
        } else {
            showToast('Berkas PDF tidak dilampirkan pada entri arsip ini.', 'error')
        }
    }

    const filteredArchives = useMemo(() => {
        return archives.filter((doc) => {
            const matchesTab = activeTab === 'Semua' || doc.category === activeTab
            const matchesSearch =
                doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                doc.uploader.toLowerCase().includes(searchQuery.toLowerCase()) ||
                doc.doc_code.toLowerCase().includes(searchQuery.toLowerCase())
            return matchesTab && matchesSearch
        })
    }, [archives, activeTab, searchQuery])

    if (isCheckingAuth) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-slate-500">
                <Loader2 className="size-7 animate-spin text-blue-600" />
                <p className="text-xs font-semibold">Memverifikasi hak akses Sekretaris Umum...</p>
            </div>
        )
    }

    if (!isAuthorized) {
        return (
            <div className="mx-auto my-12 max-w-md rounded-2xl border border-rose-200 bg-white p-8 text-center shadow-xs">
                <div className="mx-auto mb-4 grid size-14 place-items-center rounded-2xl bg-rose-50 text-rose-600 border border-rose-100">
                    <ShieldAlert className="size-7" />
                </div>
                <h2 className="text-lg font-extrabold text-slate-900">Akses Terbatas</h2>
                <p className="mt-2 text-xs leading-relaxed text-slate-500">
                    Modul <strong>Persuratan & SK</strong> hanya dapat diakses oleh <strong>Sekretaris Umum (Sekum)</strong> dan <strong>Administrator</strong>.
                </p>
                <button
                    onClick={() => router.back()}
                    className="mt-6 inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-semibold text-white hover:bg-slate-800 cursor-pointer"
                >
                    Kembali
                </button>
            </div>
        )
    }

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
                    type="button"
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
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                            Total Dokumentasi
                        </span>
                        <div className="grid size-9 place-items-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
                            <Archive className="size-4.5" />
                        </div>
                    </div>
                    <p className="text-xl font-extrabold text-slate-900">{totalDocs} Berkas</p>
                    <p className="mt-0.5 text-[11px] text-slate-500 font-medium">Tersimpan secara digital</p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                            Proposal & LPJ
                        </span>
                        <div className="grid size-9 place-items-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                            <FolderKanban className="size-4.5" />
                        </div>
                    </div>
                    <p className="text-xl font-extrabold text-slate-900">{totalProposalLPJ} Berkas</p>
                    <p className="mt-0.5 text-[11px] text-slate-500 font-medium">Laporan program kerja</p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                            Surat & SK Resmi
                        </span>
                        <div className="grid size-9 place-items-center rounded-xl bg-sky-50 text-sky-600 border border-sky-100">
                            <FileText className="size-4.5" />
                        </div>
                    </div>
                    <p className="text-xl font-extrabold text-slate-900">{totalSurat} Dokumen</p>
                    <p className="mt-0.5 text-[11px] text-slate-500 font-medium">Surat masuk, keluar & SK</p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                            Perlu Verifikasi
                        </span>
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
                            placeholder="Cari nama dokumen, kode, atau uploader..."
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
                        {isLoading ? (
                            <tr>
                                <td colSpan={6} className="py-12 text-center">
                                    <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-500">
                                        <Loader2 className="size-4 animate-spin text-blue-600" />
                                        <span>Memuat arsip persuratan dari Supabase...</span>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            filteredArchives.map((doc) => (
                                <tr key={doc.id} className="group transition hover:bg-slate-50/80">
                                    <td className="py-3.5 px-3">
                                        <div className="flex items-center gap-3">
                                            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600 border border-red-100 font-bold text-xs">
                                                <FileText className="size-4" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900 group-hover:text-blue-600 transition">
                                                    {doc.title}
                                                </p>
                                                <span className="font-mono text-[10px] font-semibold text-slate-400">
                                                        {doc.doc_code}
                                                    </span>
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
                                            <Calendar className="size-3 text-slate-400" />{' '}
                                            {formatTanggalID(doc.uploaded_date)}
                                        </p>
                                        <p className="text-[10px] text-slate-400 font-mono font-semibold">
                                            {doc.file_size}
                                        </p>
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
                                                type="button"
                                                title="Lihat Detail"
                                                onClick={() => setSelectedDoc(doc)}
                                                className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-800 cursor-pointer"
                                            >
                                                <Eye className="size-4" />
                                            </button>
                                            <button
                                                type="button"
                                                title={doc.file_url ? 'Unduh / Buka PDF' : 'Tidak ada file PDF'}
                                                onClick={() => handleDownloadDoc(doc)}
                                                className="rounded-lg p-1.5 text-slate-400 transition hover:bg-blue-50 hover:text-blue-600 cursor-pointer"
                                            >
                                                <FileDown className="size-4" />
                                            </button>
                                            <button
                                                type="button"
                                                title="Hapus Dokumen"
                                                onClick={() => handleDelete(doc)}
                                                className="rounded-lg p-1.5 text-slate-400 transition hover:bg-red-50 hover:text-red-600 cursor-pointer"
                                            >
                                                <Trash2 className="size-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>

                    {!isLoading && filteredArchives.length === 0 && (
                        <div className="py-12 text-center">
                            <Archive className="mx-auto size-8 text-slate-300" />
                            <p className="mt-2 text-xs font-semibold text-slate-500">
                                Tidak ada arsip dokumen yang sesuai dengan pencarian.
                            </p>
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
                                    <span className="font-mono text-[10px] font-bold text-blue-600">
                                        {selectedDoc.doc_code}
                                    </span>
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
                                    <span className="font-bold text-slate-900">
                                        {formatTanggalID(selectedDoc.uploaded_date)}
                                    </span>
                                </div>
                                <div className="flex justify-between py-1 border-b border-slate-100">
                                    <span className="text-slate-400 font-medium">Ukuran Berkas:</span>
                                    <span className="font-mono font-bold text-slate-900">{selectedDoc.file_size}</span>
                                </div>

                                <div className="pt-4 flex flex-wrap gap-2">
                                    {selectedDoc.status === 'Menunggu' && (
                                        <>
                                            <button
                                                type="button"
                                                onClick={() => handleVerifyStatus(selectedDoc, 'Terverifikasi')}
                                                className="flex-1 rounded-xl bg-emerald-600 py-2.5 text-xs font-semibold text-white hover:bg-emerald-500 transition cursor-pointer"
                                            >
                                                Verifikasi
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleVerifyStatus(selectedDoc, 'Ditolak')}
                                                className="rounded-xl bg-red-50 border border-red-200 px-3.5 py-2.5 text-xs font-semibold text-red-700 hover:bg-red-100 transition cursor-pointer"
                                            >
                                                Tolak
                                            </button>
                                        </>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            handleDownloadDoc(selectedDoc)
                                            setSelectedDoc(null)
                                        }}
                                        className="flex-1 rounded-xl bg-blue-600 py-2.5 text-xs font-semibold text-white hover:bg-blue-500 transition cursor-pointer"
                                    >
                                        {selectedDoc.file_url ? 'Buka / Unduh PDF' : 'Berkas Tanpa PDF'}
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

                            <form onSubmit={handleUpload} className="mt-5 space-y-4">
                                <div>
                                    <label className="mb-1 block text-xs font-semibold text-slate-700">
                                        Judul Dokumen <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
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
                                        Pilih Berkas PDF <span className="text-red-500">*</span>
                                    </label>
                                    <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-6 text-center transition hover:border-blue-600 hover:bg-blue-50/30">
                                        <FileBox className="size-8 text-slate-400" />
                                        <p className="mt-2 text-xs font-bold text-slate-800">
                                            {uploadFile ? uploadFile.name : 'Klik atau seret berkas PDF ke sini'}
                                        </p>
                                        <p className="mt-0.5 text-[10px] text-slate-400 font-medium">
                                            Maksimal ukuran file 10 MB (.pdf)
                                        </p>
                                        <input
                                            type="file"
                                            accept=".pdf,application/pdf"
                                            required
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
                                        type="submit"
                                        disabled={isUploading}
                                        className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-blue-600/10 transition hover:bg-blue-500 active:scale-[0.98] disabled:opacity-50 cursor-pointer"
                                    >
                                        {isUploading ? (
                                            <Loader2 className="size-4 animate-spin" />
                                        ) : (
                                            <CheckCircle2 className="size-4" />
                                        )}
                                        <span>{isUploading ? 'Mengunggah...' : 'Simpan Arsip'}</span>
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}