'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FileText,
  Archive,
  Hash,
  Calendar,
  FileDown,
  PlusCircle,
  Copy,
  Check,
  Search,
  ArrowLeft,
  X,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  FolderKanban,
  Clock,
  Filter
} from 'lucide-react'
import Link from 'next/link'

// --- Tipe Data ---
interface LetterCode {
  code: string
  desc: string
  lastNumber: number
}

interface ArchiveLog {
  id: string
  letterNumber: string
  subject: string
  recipient: string
  date: string
  category: string
  status: 'Tersimpan (PDF)' | 'Draft' | 'Ditinjau'
  fileSize?: string
}

// --- Helper Romawi Bulan ---
const getRomanMonth = (monthIndex: number): string => {
  const romanMonths = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII']
  return romanMonths[monthIndex] || 'I'
}

// --- Initial Data ---
const initialLetterCodes: LetterCode[] = [
  { code: 'A', desc: 'Surat Internal / BPH', lastNumber: 45 },
  { code: 'B', desc: 'Surat Eksternal / Undangan', lastNumber: 112 },
  { code: 'SK', desc: 'Surat Keputusan', lastNumber: 12 },
  { code: 'OSC', desc: 'Kepanitiaan OSCAR', lastNumber: 24 }
]

const initialLogs: ArchiveLog[] = [
  {
    id: '1',
    letterNumber: '112/B/HIMATIFA/FT-UMSurabaya/IX/2026',
    subject: 'Permohonan Pemateri Seminar Nasional',
    recipient: 'BEM FT UM Surabaya',
    date: '24 Sep 2026',
    category: 'B',
    status: 'Tersimpan (PDF)',
    fileSize: '1.2 MB'
  },
  {
    id: '2',
    letterNumber: '045/A/HIMATIFA/FT-UMSurabaya/IX/2026',
    subject: 'Undangan Rapat Pleno BPH II',
    recipient: 'Pengurus HIMATIFA',
    date: '20 Sep 2026',
    category: 'A',
    status: 'Tersimpan (PDF)',
    fileSize: '850 KB'
  },
  {
    id: '3',
    letterNumber: '012/SK/HIMATIFA/FT-UMSurabaya/VIII/2026',
    subject: 'SK Pengangkatan Panitia VIBRANUM 2026',
    recipient: 'Internal Organisasi',
    date: '15 Ags 2026',
    category: 'SK',
    status: 'Tersimpan (PDF)',
    fileSize: '2.4 MB'
  }
]

export default function SekumPage() {
  // --- States ---
  const [letterCodes, setLetterCodes] = useState<LetterCode[]>(initialLetterCodes)
  const [selectedCategory, setSelectedCategory] = useState<string>('A')
  const [subjectInput, setSubjectInput] = useState<string>('')
  const [recipientInput, setRecipientInput] = useState<string>('')
  const [logs, setLogs] = useState<ArchiveLog[]>(initialLogs)
  
  // Controls
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [copied, setCopied] = useState<boolean>(false)
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false)
  
  // Form Upload Modal State
  const [uploadSubject, setUploadSubject] = useState('')
  const [uploadCategory, setUploadCategory] = useState('Proposal')

  // --- Calculations ---
  const activeTracker = useMemo(() => {
    return letterCodes.find((c) => c.code === selectedCategory) || letterCodes[0]
  }, [letterCodes, selectedCategory])

  const currentDate = new Date()
  const currentMonthRoman = getRomanMonth(currentDate.getMonth())
  const currentYear = currentDate.getFullYear().toString()

  const nextNumberFormatted = String(activeTracker.lastNumber + 1).padStart(3, '0')
  const generatedLetterNumber = `${nextNumberFormatted}/${activeTracker.code}/HIMATIFA/FT-UMSurabaya/${currentMonthRoman}/${currentYear}`

  // Total Statistics
  const totalLettersOut = useMemo(() => {
    return letterCodes.reduce((acc, curr) => acc + curr.lastNumber, 0)
  }, [letterCodes])

  // --- Handlers ---
  const handleCopyNumber = () => {
    navigator.clipboard.writeText(generatedLetterNumber)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleLockNumber = () => {
    if (!subjectInput.trim()) {
      alert('Mohon isi perihal surat terlebih dahulu!')
      return
    }

    // 1. Lock and create log item
    const newLog: ArchiveLog = {
      id: Date.now().toString(),
      letterNumber: generatedLetterNumber,
      subject: subjectInput,
      recipient: recipientInput || 'Internal / Eksternal',
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
      category: activeTracker.code,
      status: 'Tersimpan (PDF)',
      fileSize: 'Pending'
    }

    setLogs([newLog, ...logs])

    // 2. Increment counter in tracker
    setLetterCodes((prev) =>
      prev.map((item) =>
        item.code === activeTracker.code
          ? { ...item, lastNumber: item.lastNumber + 1 }
          : item
      )
    )

    // 3. Reset Inputs
    setSubjectInput('')
    setRecipientInput('')
  }

  // Filtered Logs
  const filteredLogs = useMemo(() => {
    return logs.filter(
      (log) =>
        log.letterNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.recipient.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [logs, searchQuery])

  return (
    <main className="min-h-screen bg-[#f4f8fc] text-[#0a192f] selection:bg-blue-200">
      {/* Background Meshes */}
      <div className="fixed left-0 top-0 -z-10 h-full w-full overflow-hidden">
        <div className="absolute -left-20 -top-20 h-[450px] w-[450px] rounded-full bg-blue-300/20 blur-[120px]" />
        <div className="absolute right-0 top-1/3 h-[500px] w-[500px] rounded-full bg-cyan-200/20 blur-[140px]" />
      </div>

      {/* Header Navigation */}
      <header className="fixed inset-x-0 top-0 z-40 px-4 pt-4 sm:px-6 lg:px-10">
        <nav className="mx-auto flex max-w-7xl items-center justify-between rounded-full border border-white/80 bg-white/70 px-5 py-3 shadow-lg shadow-blue-900/5 backdrop-blur-xl">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-black tracking-tight text-[#0a192f] transition hover:text-[#2563eb]"
          >
            <ArrowLeft className="size-4" /> Kembali Dashboard
          </Link>
          <div className="flex items-center gap-2 text-sm font-black text-[#2563eb]">
            <Sparkles className="size-4" />
            <span>SEKRETARIAT HIMATIFA</span>
          </div>
        </nav>
      </header>

      <div className="mx-auto max-w-7xl px-6 pb-24 pt-32 lg:px-10">
        {/* Page Title */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/80 px-3.5 py-1 backdrop-blur">
              <ShieldCheck className="size-3.5 text-[#2563eb]" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#2563eb]">Pusat Tata Kelola Surat & Arsip</span>
            </div>
            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
              Sekretariat <span className="text-[#2563eb]">HIMATIFA.</span>
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Generator penomoran otomatis & repositori dokumen digital terstandarisasi.
            </p>
          </div>
        </div>

        {/* Top Grid: Generator & Stats */}
        <div className="grid gap-6 lg:grid-cols-[1.2fr_.8fr]">
          {/* Main Card: Generator Nomor Surat */}
          <div className="rounded-[2.5rem] border border-white/80 bg-white/80 p-6 shadow-xl shadow-blue-900/5 backdrop-blur-xl sm:p-8">
            <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="grid size-10 place-items-center rounded-2xl bg-blue-50 text-[#2563eb]">
                  <Hash className="size-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-[#0a192f]">Generator Nomor Surat</h2>
                  <p className="text-xs font-medium text-slate-400">Pilih format & kunci penomoran resmi</p>
                </div>
              </div>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-bold text-emerald-600 border border-emerald-200/60 flex items-center gap-1">
                <CheckCircle2 className="size-3" /> Auto-Increment
              </span>
            </div>

            {/* Form Inputs */}
            <div className="mb-6 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                  Kategori / Kode Surat
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200/80 bg-slate-50/50 p-3.5 text-sm font-bold text-[#0a192f] outline-none transition focus:border-[#2563eb] focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                >
                  {letterCodes.map((c) => (
                    <option key={c.code} value={c.code}>
                      [{c.code}] — {c.desc} (Terakhir: #{String(c.lastNumber).padStart(3, '0')})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                  Perihal Surat <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={subjectInput}
                  onChange={(e) => setSubjectInput(e.target.value)}
                  placeholder="Cth: Peminjaman Gedung Laut"
                  className="w-full rounded-2xl border border-slate-200/80 bg-slate-50/50 p-3.5 text-sm font-medium text-[#0a192f] outline-none transition focus:border-[#2563eb] focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                  Tujuan / Penerima
                </label>
                <input
                  type="text"
                  value={recipientInput}
                  onChange={(e) => setRecipientInput(e.target.value)}
                  placeholder="Cth: Dekanat FT UM Surabaya"
                  className="w-full rounded-2xl border border-slate-200/80 bg-slate-50/50 p-3.5 text-sm font-medium text-[#0a192f] outline-none transition focus:border-[#2563eb] focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>

            {/* Preview Box */}
            <div className="relative overflow-hidden rounded-2xl border border-blue-200/80 bg-gradient-to-br from-blue-50/80 to-cyan-50/30 p-5 backdrop-blur">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                  Pratinjau Format Surat
                </span>
                <button
                  onClick={handleCopyNumber}
                  className="flex items-center gap-1.5 rounded-xl bg-white px-3 py-1.5 text-xs font-bold text-blue-600 shadow-sm border border-blue-100 transition hover:bg-blue-50"
                >
                  {copied ? (
                    <>
                      <Check className="size-3.5 text-green-600" /> <span className="text-green-600">Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="size-3.5" /> Salin Nomor
                    </>
                  )}
                </button>
              </div>
              <p className="mt-3 font-mono text-lg font-black tracking-tight text-[#0a192f] sm:text-xl">
                {generatedLetterNumber}
              </p>
            </div>

            <button
              onClick={handleLockNumber}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0a192f] py-4 text-sm font-bold text-white shadow-xl shadow-slate-900/10 transition hover:-translate-y-0.5 hover:bg-[#112240]"
            >
              <Hash className="size-4 text-blue-400" /> Kunci & Simpan Nomor Surat Ini
            </button>
          </div>

          {/* Right Column: Metrik & Ringkasan */}
          <div className="flex flex-col gap-5">
            {/* Metric 1 */}
            <div className="flex-1 rounded-[2.5rem] border border-white/80 bg-white/80 p-6 shadow-xl shadow-blue-900/5 backdrop-blur-xl flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div className="grid size-12 place-items-center rounded-2xl bg-blue-100/80 text-[#2563eb]">
                  <FileText className="size-6" />
                </div>
                <span className="rounded-full bg-blue-50 px-3 py-1 text-[11px] font-bold text-[#2563eb]">
                  Tahun {currentYear}
                </span>
              </div>
              <div className="mt-6">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Surat Keluar</p>
                <p className="mt-1 text-4xl font-black text-[#0a192f]">{totalLettersOut}</p>
                <p className="mt-2 text-xs font-semibold text-slate-500">
                  Akumulasi dari seluruh kode surat aktif.
                </p>
              </div>
            </div>

            {/* Metric 2 */}
            <div className="flex-1 rounded-[2.5rem] border border-white/80 bg-white/80 p-6 shadow-xl shadow-blue-900/5 backdrop-blur-xl flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div className="grid size-12 place-items-center rounded-2xl bg-cyan-100/80 text-cyan-700">
                  <Archive className="size-6" />
                </div>
                <span className="rounded-full bg-cyan-50 px-3 py-1 text-[11px] font-bold text-cyan-700">
                  Digital Archive
                </span>
              </div>
              <div className="mt-6">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Arsip Proposal & LPJ</p>
                <p className="mt-1 text-4xl font-black text-[#0a192f]">{logs.length}</p>
                <p className="mt-2 text-xs font-semibold text-slate-500">
                  Dokumen terverifikasi tersimpan aman.
                </p>
              </div>
            </div>

            {/* Active Code Summary */}
            <div className="rounded-3xl border border-blue-100 bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white shadow-lg shadow-blue-600/20">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-wider text-blue-200">Kategori Aktif</p>
                <FolderKanban className="size-5 text-blue-200" />
              </div>
              <p className="mt-2 text-2xl font-black">Kode [{activeTracker.code}]</p>
              <p className="mt-0.5 text-xs text-blue-100">{activeTracker.desc}</p>
            </div>
          </div>
        </div>

        {/* Bottom Section: Log Table */}
        <section className="mt-10 rounded-[2.5rem] border border-white/80 bg-white/80 p-6 shadow-xl shadow-blue-900/5 backdrop-blur-xl sm:p-8">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-black text-[#0a192f]">Log Surat & Arsip Terbaru</h2>
              <p className="text-xs font-medium text-slate-400">Daftar penomoran surat resmi dan arsip terverifikasi</p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari perihal atau nomor..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-slate-200/80 bg-slate-50/50 pl-10 pr-4 py-2 text-xs font-medium outline-none transition focus:border-[#2563eb] focus:bg-white focus:ring-2 focus:ring-blue-500/20 sm:w-60"
                />
              </div>

              {/* Upload Button */}
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#2563eb] px-4 py-2 text-xs font-bold text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-700"
              >
                <PlusCircle className="size-4" /> Unggah Arsip
              </button>
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="border-b border-slate-100 text-[11px] uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="pb-3.5 font-extrabold">Nomor Surat</th>
                  <th className="pb-3.5 font-extrabold">Perihal & Tujuan</th>
                  <th className="pb-3.5 font-extrabold">Tanggal</th>
                  <th className="pb-3.5 font-extrabold">Status Arsip</th>
                  <th className="pb-3.5 font-extrabold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="group transition hover:bg-slate-50/80">
                    <td className="py-4 font-mono text-xs font-bold text-[#0a192f]">
                      {log.letterNumber}
                    </td>
                    <td className="py-4">
                      <p className="font-bold text-[#0a192f]">{log.subject}</p>
                      <p className="text-xs font-medium text-slate-400">{log.recipient}</p>
                    </td>
                    <td className="py-4 whitespace-nowrap text-xs font-semibold text-slate-500">
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="size-3.5 text-slate-400" /> {log.date}
                      </span>
                    </td>
                    <td className="py-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700 border border-emerald-200/50">
                        <CheckCircle2 className="size-3" /> {log.status}
                      </span>
                    </td>
                    <td className="py-4 text-right whitespace-nowrap">
                      <button
                        title="Unduh Berkas"
                        onClick={() => alert(`Mengunduh arsip: ${log.subject}`)}
                        className="rounded-lg p-2 text-slate-400 transition hover:bg-blue-50 hover:text-[#2563eb]"
                      >
                        <FileDown className="size-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredLogs.length === 0 && (
              <div className="py-12 text-center">
                <p className="text-sm font-bold text-slate-400">Tidak ada log surat yang sesuai pencarian.</p>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Modal Unggah Arsip */}
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
                  <PlusCircle className="size-5 text-[#2563eb]" /> Unggah Dokumen Arsip
                </div>
                <button
                  onClick={() => setIsUploadModalOpen(false)}
                  className="rounded-full bg-slate-100 p-2 text-slate-500 hover:bg-slate-200"
                >
                  <X className="size-4" />
                </button>
              </div>

              <div className="mt-6 space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-slate-700">Judul / Perihal Dokumen</label>
                  <input
                    type="text"
                    value={uploadSubject}
                    onChange={(e) => setUploadSubject(e.target.value)}
                    placeholder="Masukkan nama proposal / LPJ / surat"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold text-slate-700">Kategori Dokumen</label>
                  <select
                    value={uploadCategory}
                    onChange={(e) => setUploadCategory(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold outline-none transition focus:border-blue-500 focus:bg-white"
                  >
                    <option value="Proposal">Proposal Kegiatan</option>
                    <option value="LPJ">Laporan Pertanggungjawaban (LPJ)</option>
                    <option value="Surat Keluar">Arsip Surat Keluar</option>
                    <option value="Surat Masuk">Arsip Surat Masuk</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold text-slate-700">Pilih Berkas (PDF)</label>
                  <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-6 text-center transition hover:border-blue-400">
                    <FileText className="size-8 text-blue-500" />
                    <p className="mt-2 text-xs font-bold text-slate-700">Klik atau seret berkas ke sini</p>
                    <p className="mt-0.5 text-[10px] text-slate-400">Maksimal ukuran berkas 10 MB (.pdf)</p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    alert('Dokumen berhasil diunggah ke arsip!')
                    setIsUploadModalOpen(false)
                  }}
                  className="mt-4 w-full rounded-xl bg-[#2563eb] py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
                >
                  Simpan ke Repositori Digital
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  )
}