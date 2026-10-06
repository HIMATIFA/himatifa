'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Wallet,
    ArrowUpRight,
    ArrowDownRight,
    History,
    Download,
    Plus,
    Search,
    ArrowLeft,
    X,
    TrendingUp,
    CheckCircle2,
    PieChart,
    Coins,
    Receipt
} from 'lucide-react'
import Link from 'next/link'

type TransactionType = 'income' | 'expense'
type CategoryType = 'Kas' | 'Danus' | 'Proker' | 'Operasional'

interface Transaction {
    id: string
    date: string
    description: string
    type: TransactionType
    category: CategoryType
    amount: number
}

const formatRupiah = (val: number): string => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0
    }).format(val)
}

const initialTransactions: Transaction[] = [
    {
        id: 'tx-1',
        date: '24 Sep 2026',
        description: 'Pembayaran DP Jaket Himpunan',
        type: 'expense',
        category: 'Proker',
        amount: 500000
    },
    {
        id: 'tx-2',
        date: '22 Sep 2026',
        description: 'Iuran Kas Pengurus (Periode September)',
        type: 'income',
        category: 'Kas',
        amount: 150000
    },
    {
        id: 'tx-3',
        date: '18 Sep 2026',
        description: 'Penjualan Lanyard Ekraf Store (5 Pcs)',
        type: 'income',
        category: 'Danus',
        amount: 175000
    },
    {
        id: 'tx-4',
        date: '12 Sep 2026',
        description: 'Pembelian ATK & Konsumsi Rapat Pleno',
        type: 'expense',
        category: 'Operasional',
        amount: 350000
    },
    {
        id: 'tx-5',
        date: '05 Sep 2026',
        description: 'Sponsor & Dana Hibah Mitra Kerja Sama',
        type: 'income',
        category: 'Danus',
        amount: 1775000
    }
]

export default function BendumPage() {
    const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions)
    const [searchQuery, setSearchQuery] = useState('')
    const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all')

    const [isRecordModalOpen, setIsRecordModalOpen] = useState(false)

    const [formDescription, setFormDescription] = useState('')
    const [formType, setFormType] = useState<TransactionType>('income')
    const [formCategory, setFormCategory] = useState<CategoryType>('Kas')
    const [formAmount, setFormAmount] = useState('')

    const baseKas = 5250000
    const baseDanus = 3500000

    const { totalIncome, totalExpense, currentKas, currentDanus, totalBalance } = useMemo(() => {
        let incomeSum = 0
        let expenseSum = 0
        let kasAdjustment = 0
        let danusAdjustment = 0

        transactions.forEach((tx) => {
            if (tx.type === 'income') {
                incomeSum += tx.amount
                if (tx.category === 'Kas') kasAdjustment += tx.amount
                if (tx.category === 'Danus') danusAdjustment += tx.amount
            } else {
                expenseSum += tx.amount
                if (tx.category === 'Kas') kasAdjustment -= tx.amount
                if (tx.category === 'Danus') danusAdjustment -= tx.amount
                if (tx.category === 'Proker' || tx.category === 'Operasional') {
                    kasAdjustment -= tx.amount
                }
            }
        })

        const finalKas = baseKas + kasAdjustment
        const finalDanus = baseDanus + danusAdjustment

        return {
            totalIncome: incomeSum,
            totalExpense: expenseSum,
            currentKas: finalKas,
            currentDanus: finalDanus,
            totalBalance: finalKas + finalDanus
        }
    }, [transactions])

    const handleAddTransaction = () => {
        const numAmount = parseFloat(formAmount)
        if (!formDescription.trim() || isNaN(numAmount) || numAmount <= 0) {
            alert('Mohon isi deskripsi dan nominal transaksi dengan benar!')
            return
        }

        const newTx: Transaction = {
            id: `tx-${Date.now()}`,
            date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
            description: formDescription,
            type: formType,
            category: formCategory,
            amount: numAmount
        }

        setTransactions([newTx, ...transactions])

        setFormDescription('')
        setFormAmount('')
        setIsRecordModalOpen(false)
    }

    const handleExportData = () => {
        const csvContent =
            'data:text/csv;charset=utf-8,' +
            'Tanggal,Deskripsi,Kategori,Tipe,Nominal\n' +
            transactions
                .map((t) => `"${t.date}","${t.description}","${t.category}","${t.type}",${t.amount}`)
                .join('\n')

        const encodedUri = encodeURI(csvContent)
        const link = document.createElement('a')
        link.setAttribute('href', encodedUri)
        link.setAttribute('download', `Laporan_Keuangan_HIMATIFA_${new Date().toISOString().slice(0, 10)}.csv`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    const filteredTransactions = useMemo(() => {
        return transactions.filter((tx) => {
            const matchesSearch =
                tx.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                tx.category.toLowerCase().includes(searchQuery.toLowerCase())
            const matchesType = filterType === 'all' ? true : tx.type === filterType
            return matchesSearch && matchesType
        })
    }, [transactions, searchQuery, filterType])

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
                                placeholder="Cari transaksi..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full rounded-full border-none bg-slate-100 py-1.5 pl-9 pr-4 text-xs font-medium outline-none focus:ring-2 focus:ring-[#2563eb]/20"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-xs font-black text-[#2563eb]">
                        <Wallet className="size-4 shrink-0" />
                        <span>BENDUM HIMATIFA</span>
                    </div>
                </nav>
            </header>

            <div className="mx-auto max-w-7xl px-6 pb-24 pt-32 lg:px-10">
                <header className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                            Keuangan <span className="text-[#2563eb]">Himpunan.</span>
                        </h1>
                        <p className="mt-1 text-sm text-slate-500">
                            Pantau arus kas, alokasi dana usaha, dan akuntabilitas anggaran kegiatan secara real-time.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <button
                            onClick={handleExportData}
                            className="flex items-center gap-2 rounded-2xl border border-slate-200/80 bg-white px-4 py-3 text-xs font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:border-slate-300"
                        >
                            <Download className="size-4 text-slate-500" /> Export Laporan CSV
                        </button>
                        <button
                            onClick={() => setIsRecordModalOpen(true)}
                            className="flex items-center gap-2 rounded-2xl bg-[#2563eb] px-5 py-3 text-xs font-bold text-white shadow-xl shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700"
                        >
                            <Plus className="size-4" /> Catat Transaksi Baru
                        </button>
                    </div>
                </header>

                <div className="mb-8 grid gap-5 lg:grid-cols-3">
                    <div className="relative overflow-hidden rounded-[2.5rem] bg-[#0a192f] p-7 text-white shadow-xl shadow-slate-900/10 lg:col-span-1 flex flex-col justify-between">
                        <div className="absolute right-0 top-0 -mr-10 -mt-10 h-40 w-40 rounded-full bg-blue-500/10 blur-3xl" />

                        <div>
                            <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-4">
                                <div className="flex items-center gap-2 text-blue-300">
                                    <Coins className="size-5" />
                                    <span className="text-xs font-bold uppercase tracking-wider">Total Saldo Aktif</span>
                                </div>
                                <span className="rounded-full bg-blue-500/20 px-2.5 py-1 text-[10px] font-bold text-blue-300 border border-blue-400/30">
                                    Real-time
                                </span>
                            </div>

                            <p className="font-mono text-3xl font-black tracking-tight text-white sm:text-4xl">
                                {formatRupiah(totalBalance)}
                            </p>
                        </div>

                        <div className="mt-8 grid grid-cols-2 gap-3 rounded-2xl bg-white/5 p-4 backdrop-blur-md border border-white/10">
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Kas Organisasi</p>
                                <p className="mt-1 text-sm font-bold text-emerald-400">{formatRupiah(currentKas)}</p>
                            </div>
                            <div className="border-l border-white/10 pl-3">
                                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Dana Usaha</p>
                                <p className="mt-1 text-sm font-bold text-cyan-400">{formatRupiah(currentDanus)}</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2 lg:col-span-2">
                        <div className="rounded-[2.5rem] border border-white/80 bg-white/80 p-6 shadow-xl shadow-blue-900/5 backdrop-blur-xl flex flex-col justify-between">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Pemasukan (Tercatat)</p>
                                    <p className="mt-2 font-mono text-2xl font-black text-emerald-600 sm:text-3xl">
                                        +{formatRupiah(totalIncome)}
                                    </p>
                                </div>
                                <div className="grid size-12 place-items-center rounded-2xl bg-emerald-100 text-emerald-600 shadow-inner">
                                    <ArrowUpRight className="size-6" />
                                </div>
                            </div>
                            <div className="mt-6 flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
                                <TrendingUp className="size-4" />
                                <span>Termasuk Iuran Kas & Hasil Danus</span>
                            </div>
                        </div>

                        <div className="rounded-[2.5rem] border border-white/80 bg-white/80 p-6 shadow-xl shadow-blue-900/5 backdrop-blur-xl flex flex-col justify-between">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Pengeluaran (Tercatat)</p>
                                    <p className="mt-2 font-mono text-2xl font-black text-red-600 sm:text-3xl">
                                        -{formatRupiah(totalExpense)}
                                    </p>
                                </div>
                                <div className="grid size-12 place-items-center rounded-2xl bg-red-100 text-red-600 shadow-inner">
                                    <ArrowDownRight className="size-6" />
                                </div>
                            </div>
                            <div className="mt-6 flex items-center gap-2 rounded-xl bg-red-50 px-3 py-2 text-xs font-semibold text-red-700">
                                <Receipt className="size-4" />
                                <span>Alokasi Proker & Operasional</span>
                            </div>
                        </div>
                    </div>
                </div>

                <section className="rounded-[2.5rem] border border-white/80 bg-white/80 p-6 shadow-xl shadow-blue-900/5 backdrop-blur-xl sm:p-8">
                    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                            <div className="grid size-10 place-items-center rounded-2xl bg-blue-50 text-[#2563eb]">
                                <History className="size-5" />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-[#0a192f]">Riwayat Transaksi</h2>
                                <p className="text-xs font-medium text-slate-400">Log mutasi masuk & keluar kas himpunan</p>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                            <div className="flex rounded-xl bg-slate-100 p-1 text-xs font-bold">
                                <button
                                    onClick={() => setFilterType('all')}
                                    className={`rounded-lg px-3 py-1.5 transition ${
                                        filterType === 'all' ? 'bg-white text-[#0a192f] shadow-sm' : 'text-slate-500 hover:text-slate-800'
                                    }`}
                                >
                                    Semua
                                </button>
                                <button
                                    onClick={() => setFilterType('income')}
                                    className={`rounded-lg px-3 py-1.5 transition ${
                                        filterType === 'income' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                                    }`}
                                >
                                    Masuk
                                </button>
                                <button
                                    onClick={() => setFilterType('expense')}
                                    className={`rounded-lg px-3 py-1.5 transition ${
                                        filterType === 'expense' ? 'bg-white text-red-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                                    }`}
                                >
                                    Keluar
                                </button>
                            </div>

                            <div className="relative">
                                <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Cari transaksi..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full rounded-xl border border-slate-200/80 bg-slate-50/50 pl-10 pr-4 py-2 text-xs font-medium outline-none transition focus:border-[#2563eb] focus:bg-white focus:ring-2 focus:ring-blue-500/20 sm:w-52"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-600">
                            <thead className="border-b border-slate-100 text-[11px] uppercase tracking-wider text-slate-400">
                            <tr>
                                <th className="pb-3.5 font-extrabold">Tanggal</th>
                                <th className="pb-3.5 font-extrabold">Keterangan</th>
                                <th className="pb-3.5 font-extrabold">Kategori & Tipe</th>
                                <th className="pb-3.5 font-extrabold text-right">Nominal</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                            {filteredTransactions.map((tx) => (
                                <tr key={tx.id} className="group transition hover:bg-slate-50/80">
                                    <td className="py-4 whitespace-nowrap text-xs font-semibold text-slate-500">
                                        {tx.date}
                                    </td>
                                    <td className="py-4">
                                        <p className="font-bold text-[#0a192f]">{tx.description}</p>
                                    </td>
                                    <td className="py-4 whitespace-nowrap">
                                        <span
                                            className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-[10px] font-bold ${
                                                tx.type === 'income'
                                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                                                    : 'bg-red-50 text-red-700 border border-red-200/60'
                                            }`}
                                        >
                                            {tx.type === 'income' ? 'Pemasukan' : 'Pengeluaran'} ({tx.category})
                                        </span>
                                    </td>
                                    <td className={`py-4 text-right whitespace-nowrap font-mono font-black ${
                                        tx.type === 'income' ? 'text-emerald-600' : 'text-red-600'
                                    }`}>
                                        {tx.type === 'income' ? '+' : '-'} {formatRupiah(tx.amount)}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>

                        {filteredTransactions.length === 0 && (
                            <div className="py-12 text-center">
                                <PieChart className="mx-auto size-8 text-slate-300" />
                                <p className="mt-2 text-sm font-bold text-slate-400">Tidak ada riwayat transaksi yang cocok.</p>
                            </div>
                        )}
                    </div>
                </section>
            </div>

            <AnimatePresence>
                {isRecordModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsRecordModalOpen(false)}
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
                                    <Plus className="size-5 text-[#2563eb]" /> Catat Transaksi Baru
                                </div>
                                <button
                                    onClick={() => setIsRecordModalOpen(false)}
                                    className="rounded-full bg-slate-100 p-2 text-slate-500 hover:bg-slate-200 transition"
                                >
                                    <X className="size-4" />
                                </button>
                            </div>

                            <div className="mt-6 space-y-4">
                                <div>
                                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                                        Tipe Transaksi
                                    </label>
                                    <div className="grid grid-cols-2 gap-2 rounded-2xl bg-slate-100 p-1.5">
                                        <button
                                            type="button"
                                            onClick={() => setFormType('income')}
                                            className={`rounded-xl py-2.5 text-xs font-bold transition ${
                                                formType === 'income'
                                                    ? 'bg-emerald-600 text-white shadow-md'
                                                    : 'text-slate-600 hover:text-slate-900'
                                            }`}
                                        >
                                            + Pemasukan
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setFormType('expense')}
                                            className={`rounded-xl py-2.5 text-xs font-bold transition ${
                                                formType === 'expense'
                                                    ? 'bg-red-600 text-white shadow-md'
                                                    : 'text-slate-600 hover:text-slate-900'
                                            }`}
                                        >
                                            - Pengeluaran
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">
                                        Keterangan Transaksi <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formDescription}
                                        onChange={(e) => setFormDescription(e.target.value)}
                                        placeholder="Cth: Iuran Kas Anggota / Sewa Zoom Premium"
                                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3.5 text-sm font-medium outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                                    />
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">
                                            Kategori Alokasi
                                        </label>
                                        <select
                                            value={formCategory}
                                            onChange={(e) => setFormCategory(e.target.value as CategoryType)}
                                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3.5 text-sm font-bold outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                                        >
                                            <option value="Kas">Kas Organisasi</option>
                                            <option value="Danus">Dana Usaha</option>
                                            <option value="Proker">Program Kerja</option>
                                            <option value="Operasional">Operasional Sekre</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">
                                            Nominal (Rp) <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            value={formAmount}
                                            onChange={(e) => setFormAmount(e.target.value)}
                                            placeholder="Cth: 250000"
                                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3.5 text-sm font-mono font-bold outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                                        />
                                    </div>
                                </div>

                                <button
                                    onClick={handleAddTransaction}
                                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#2563eb] py-4 text-sm font-bold text-white shadow-xl shadow-blue-600/20 transition hover:bg-blue-700"
                                >
                                    <CheckCircle2 className="size-4" /> Simpan Mutasi Transaksi
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </main>
    )
}