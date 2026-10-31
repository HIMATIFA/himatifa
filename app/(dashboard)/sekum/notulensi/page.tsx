'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    initialNotulensiData,
    type NotulensiItem,
    type NotulensiCategory
} from '@/app/data'
import {
    ClipboardList,
    ShieldCheck,
    Plus,
    Search,
    X,
    Trash2,
    CheckCircle2,
    Clock,
    XCircle,
    Sparkles,
    Calendar,
    Users,
    Tag,
    Eye,
    FileDown,
    UserCheck,
    FileText,
    MessageSquare, ChevronRight
} from 'lucide-react'

export default function SekumNotulensiPage() {
    const [notulensiList, setNotulensiList] = useState<NotulensiItem[]>(initialNotulensiData)
    const [activeTab, setActiveTab] = useState<string>('Semua')
    const [searchQuery, setSearchQuery] = useState<string>('')

    const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null)
    const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false)
    const [selectedNotulensi, setSelectedNotulensi] = useState<NotulensiItem | null>(null)

    const [formTitle, setFormTitle] = useState('')
    const [formCategory, setFormCategory] = useState<NotulensiCategory>('Rapat Pleno')
    const [formLeader, setFormLeader] = useState('')
    const [formAttendees, setFormAttendees] = useState('')
    const [formSummary, setFormSummary] = useState('')

    const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
        setToast({ message, type })
        setTimeout(() => setToast(null), 3500)
    }

    const { totalRapat, totalBphPleno, totalPesertaAkumulasi } = useMemo(() => {
        const total = notulensiList.length
        const bphPleno = notulensiList.filter(n => n.category === 'Rapat BPH' || n.category === 'Rapat Pleno').length
        const pesertaSum = notulensiList.reduce((acc, curr) => acc + curr.attendeesCount, 0)

        return { totalRapat: total, totalBphPleno: bphPleno, totalPesertaAkumulasi: pesertaSum }
    }, [notulensiList])

    const categories = ['Semua', 'Rapat Pleno', 'Rapat BPH', 'Rapat Evaluasi', 'Rapat Koordinasi']

    const handleAddNotulensi = () => {
        const countNum = parseInt(formAttendees, 10)

        if (!formTitle.trim() || !formLeader.trim() || isNaN(countNum) || countNum <= 0 || !formSummary.trim()) {
            showToast('Mohon isi semua bidang formulir dengan benar!', 'error')
            return
        }

        const newNotulensi: NotulensiItem = {
            id: `NOT-00${notulensiList.length + 1}`,
            title: formTitle,
            category: formCategory,
            date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
            leader: formLeader,
            attendeesCount: countNum,
            summary: formSummary,
            fileSize: '1.0 MB'
        }

        setNotulensiList([newNotulensi, ...notulensiList])
        setIsAddModalOpen(false)
        setFormTitle('')
        setFormLeader('')
        setFormAttendees('')
        setFormSummary('')
        showToast(`Notulensi "${newNotulensi.title}" berhasil ditambahkan.`)
    }

    const handleDelete = (id: string, title: string) => {
        if (confirm(`Apakah Anda yakin ingin menghapus notulensi "${title}"?`)) {
            setNotulensiList(notulensiList.filter(n => n.id !== id))
            if (selectedNotulensi?.id === id) setSelectedNotulensi(null)
            showToast(`Notulensi "${title}" telah dihapus.`, 'info')
        }
    }

    const filteredNotulensi = useMemo(() => {
        return notulensiList.filter((item) => {
            const matchesTab = activeTab === 'Semua' || item.category === activeTab
            const matchesSearch =
                item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.leader.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.id.toLowerCase().includes(searchQuery.toLowerCase())
            return matchesTab && matchesSearch
        })
    }, [notulensiList, activeTab, searchQuery])

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
                        Notulensi & Hasil <span className="text-blue-600">Rapat</span>
                    </h1>
                    <p className="mt-1 text-xs sm:text-sm text-slate-500">
                        Dokumentasi poin pembahasan, keputusan, dan ketetapan agenda rapat pengurus HIMATIFA.
                    </p>
                </div>

                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-blue-600/10 transition hover:bg-blue-500 active:scale-[0.98] cursor-pointer shrink-0"
                >
                    <Plus className="size-4" />
                    <span>Buat Notulensi Baru</span>
                </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Total Notulensi Terarsip</span>
                        <div className="grid size-9 place-items-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
                            <ClipboardList className="size-4.5" />
                        </div>
                    </div>
                    <p className="text-xl font-extrabold text-slate-900">{totalRapat} Catatan Rapat</p>
                    <p className="mt-0.5 text-[11px] text-slate-500 font-medium">Tersimpan dalam sistem</p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Rapat BPH & Pleno</span>
                        <div className="grid size-9 place-items-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                            <Users className="size-4.5" />
                        </div>
                    </div>
                    <p className="text-xl font-extrabold text-slate-900">{totalBphPleno} Pertemuan</p>
                    <p className="mt-0.5 text-[11px] text-slate-500 font-medium">Agendanya resmi BPH & Pleno</p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Total Kehadiran Peserta</span>
                        <div className="grid size-9 place-items-center rounded-xl bg-sky-50 text-sky-600 border border-sky-100">
                            <UserCheck className="size-4.5" />
                        </div>
                    </div>
                    <p className="text-xl font-extrabold text-slate-900">{totalPesertaAkumulasi} Pengurus</p>
                    <p className="mt-0.5 text-[11px] text-slate-500 font-medium">Akumulasi peserta hadir</p>
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
                            placeholder="Cari judul atau pemimipian rapat..."
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
                            <th className="py-3 px-3">Judul Rapat & Kode</th>
                            <th className="py-3 px-3">Jenis Rapat</th>
                            <th className="py-3 px-3">Pimpinan Rapat</th>
                            <th className="py-3 px-3">Tanggal & Hadir</th>
                            <th className="py-3 px-3 text-right">Aksi</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                        {filteredNotulensi.map((item) => (
                            <tr key={item.id} className="group transition hover:bg-slate-50/80">
                                <td className="py-3.5 px-3">
                                    <div className="flex items-center gap-3">
                                        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100 font-bold text-xs">
                                            <MessageSquare className="size-4" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900 group-hover:text-blue-600 transition">{item.title}</p>
                                            <span className="font-mono text-[10px] font-semibold text-slate-400">{item.id}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-3.5 px-3 whitespace-nowrap">
                                        <span className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-700 border border-slate-200">
                                            <Tag className="size-3 text-blue-600" />
                                            {item.category}
                                        </span>
                                </td>
                                <td className="py-3.5 px-3 font-semibold text-slate-800 whitespace-nowrap">
                                    {item.leader}
                                </td>
                                <td className="py-3.5 px-3 whitespace-nowrap">
                                    <p className="flex items-center gap-1 text-slate-700 font-medium">
                                        <Calendar className="size-3 text-slate-400" /> {item.date}
                                    </p>
                                    <p className="text-[10px] text-blue-600 font-semibold">{item.attendeesCount} Pengurus Hadir</p>
                                </td>
                                <td className="py-3.5 px-3 text-right whitespace-nowrap">
                                    <div className="flex items-center justify-end gap-1">
                                        <button
                                            title="Lihat Detail"
                                            onClick={() => setSelectedNotulensi(item)}
                                            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-800 cursor-pointer"
                                        >
                                            <Eye className="size-4" />
                                        </button>
                                        <button
                                            title="Unduh Berkas Notulensi"
                                            onClick={() => showToast(`Mengunduh notulensi ${item.id}...`, 'info')}
                                            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-blue-50 hover:text-blue-600 cursor-pointer"
                                        >
                                            <FileDown className="size-4" />
                                        </button>
                                        <button
                                            title="Hapus"
                                            onClick={() => handleDelete(item.id, item.title)}
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

                    {filteredNotulensi.length === 0 && (
                        <div className="py-12 text-center">
                            <ClipboardList className="mx-auto size-8 text-slate-300" />
                            <p className="mt-2 text-xs font-semibold text-slate-500">Tidak ada notulensi yang cocok dengan pencarian.</p>
                        </div>
                    )}
                </div>
            </div>

            <AnimatePresence>
                {selectedNotulensi && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedNotulensi(null)}
                            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.98, y: 12 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.98, y: 12 }}
                            className="relative z-10 w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-xl"
                        >
                            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                <div>
                                    <span className="font-mono text-[10px] font-bold text-blue-600">{selectedNotulensi.id}</span>
                                    <h3 className="text-base font-bold text-slate-900">{selectedNotulensi.title}</h3>
                                </div>
                                <button
                                    onClick={() => setSelectedNotulensi(null)}
                                    className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition cursor-pointer"
                                >
                                    <X className="size-4.5" />
                                </button>
                            </div>

                            <div className="mt-4 space-y-3 text-xs">
                                <div className="flex justify-between py-1 border-b border-slate-100">
                                    <span className="text-slate-400 font-medium">Jenis Rapat:</span>
                                    <span className="font-bold text-slate-900">{selectedNotulensi.category}</span>
                                </div>
                                <div className="flex justify-between py-1 border-b border-slate-100">
                                    <span className="text-slate-400 font-medium">Pimpinan Rapat:</span>
                                    <span className="font-bold text-slate-900">{selectedNotulensi.leader}</span>
                                </div>
                                <div className="flex justify-between py-1 border-b border-slate-100">
                                    <span className="text-slate-400 font-medium">Tanggal Pelaksanaan:</span>
                                    <span className="font-bold text-slate-900">{selectedNotulensi.date}</span>
                                </div>
                                <div className="flex justify-between py-1 border-b border-slate-100">
                                    <span className="text-slate-400 font-medium">Jumlah Peserta Hadir:</span>
                                    <span className="font-bold text-emerald-600">{selectedNotulensi.attendeesCount} Pengurus</span>
                                </div>
                                <div className="py-1">
                                    <span className="text-slate-400 font-medium block mb-1">Poin Ringkasan Hasil Rapat:</span>
                                    <p className="rounded-xl bg-slate-50 p-3 text-slate-700 border border-slate-100 leading-relaxed font-medium">
                                        {selectedNotulensi.summary}
                                    </p>
                                </div>

                                <div className="pt-4 flex gap-2">
                                    <button
                                        onClick={() => {
                                            showToast(`Mengunduh notulensi ${selectedNotulensi.id}...`, 'info')
                                            setSelectedNotulensi(null)
                                        }}
                                        className="w-full rounded-xl bg-blue-600 py-2.5 text-xs font-semibold text-white hover:bg-blue-500 transition cursor-pointer"
                                    >
                                        Unduh Berkas Notulensi (.PDF)
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isAddModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsAddModalOpen(false)}
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
                                    <span>Catat Notulensi Rapat Baru</span>
                                </div>
                                <button
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition cursor-pointer"
                                >
                                    <X className="size-4.5" />
                                </button>
                            </div>

                            <div className="mt-5 space-y-4">
                                <div>
                                    <label className="mb-1 block text-xs font-semibold text-slate-700">
                                        Judul / Topik Utama Rapat <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formTitle}
                                        onChange={(e) => setFormTitle(e.target.value)}
                                        placeholder="Contoh: Rapat Pleno Evaluasi Proker VIBRANUM 2026"
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 px-3.5 text-xs font-medium text-slate-900 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/10"
                                    />
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="mb-1 block text-xs font-semibold text-slate-700">
                                            Jenis Rapat
                                        </label>
                                        <select
                                            value={formCategory}
                                            onChange={(e) => setFormCategory(e.target.value as NotulensiCategory)}
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 px-3.5 text-xs font-semibold text-slate-900 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/10 cursor-pointer"
                                        >
                                            <option value="Rapat Pleno">Rapat Pleno</option>
                                            <option value="Rapat BPH">Rapat BPH</option>
                                            <option value="Rapat Evaluasi">Rapat Evaluasi</option>
                                            <option value="Rapat Koordinasi">Rapat Koordinasi</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="mb-1 block text-xs font-semibold text-slate-700">
                                            Jumlah Peserta Hadir <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            value={formAttendees}
                                            onChange={(e) => setFormAttendees(e.target.value)}
                                            placeholder="Contoh: 30"
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 px-3.5 text-xs font-bold text-slate-900 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/10"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="mb-1 block text-xs font-semibold text-slate-700">
                                        Pimpinan Rapat <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formLeader}
                                        onChange={(e) => setFormLeader(e.target.value)}
                                        placeholder="Contoh: Muhammad Arya (Ketum)"
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 px-3.5 text-xs font-medium text-slate-900 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/10"
                                    />
                                </div>

                                <div>
                                    <label className="mb-1 block text-xs font-semibold text-slate-700">
                                        Poin Hasil Rapat / Kesimpulan <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        rows={4}
                                        value={formSummary}
                                        onChange={(e) => setFormSummary(e.target.value)}
                                        placeholder="Tuliskan poin-poin keputusan utama hasil rapat..."
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50/70 p-3 text-xs font-medium text-slate-900 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/10 resize-none"
                                    />
                                </div>

                                <div className="mt-6 flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
                                    <button
                                        type="button"
                                        onClick={() => setIsAddModalOpen(false)}
                                        className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleAddNotulensi}
                                        className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-blue-600/10 transition hover:bg-blue-500 active:scale-[0.98] cursor-pointer"
                                    >
                                        <CheckCircle2 className="size-4" />
                                        <span>Simpan Notulensi</span>
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