'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { createBrowserClient } from '@supabase/ssr'
import {
    ArrowUpRight,
    ArrowDownRight,
    History,
    Download,
    Plus,
    Search,
    X,
    TrendingUp,
    CheckCircle2,
    PieChart,
    Coins,
    Receipt,
    ChevronRight,
    Loader2,
    ShieldAlert,
    Trash2,
    Pencil
} from 'lucide-react'

export type TransactionType = 'income' | 'expense'
export type TransactionCategory = 'Kas' | 'Danus' | 'Proker' | 'Operasional'

export interface KasTransaction {
    id: string
    transaction_date: string
    description: string
    type: TransactionType
    category: TransactionCategory
    amount: number
    created_at: string
}

const formatRupiah = (val: number): string => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0
    }).format(val)
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

export default function BendumKasPage() {
    const router = useRouter()

    const [isCheckingAuth, setIsCheckingAuth] = useState(true)
    const [isAuthorized, setIsAuthorized] = useState(false)
    const [currentUserId, setCurrentUserId] = useState<string | null>(null)

    const [transactions, setTransactions] = useState<KasTransaction[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)

    const [searchQuery, setSearchQuery] = useState('')
    const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all')

    const [isRecordModalOpen, setIsRecordModalOpen] = useState(false)
    const [editingTx, setEditingTx] = useState<KasTransaction | null>(null)
    const [formDate, setFormDate] = useState(() => new Date().toISOString().split('T')[0])
    const [formDescription, setFormDescription] = useState('')
    const [formType, setFormType] = useState<TransactionType>('income')
    const [formCategory, setFormCategory] = useState<TransactionCategory>('Kas')
    const [formAmount, setFormAmount] = useState('')
    const [formError, setFormError] = useState<string | null>(null)

    const supabase = useMemo(
        () =>
            createBrowserClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
            ),
        []
    )

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
                .select('role')
                .eq('id', user.id)
                .single()

            const role = profile?.role || user.user_metadata?.role

            if (role !== 'bendum' && role !== 'admin') {
                setIsAuthorized(false)
                setIsCheckingAuth(false)
                return
            }

            setIsAuthorized(true)
            setIsCheckingAuth(false)
        }

        checkAccess()
    }, [supabase, router])

    const fetchTransactions = async () => {
        setIsLoading(true)
        const { data, error } = await supabase
            .from('kas_transactions')
            .select('*')
            .order('transaction_date', { ascending: false })
            .order('created_at', { ascending: false })

        if (!error && data) {
            setTransactions(
                data.map((row) => ({
                    ...row,
                    amount: Number(row.amount) || 0
                })) as KasTransaction[]
            )
        }
        setIsLoading(false)
    }

    useEffect(() => {
        if (!isAuthorized) return

        fetchTransactions()

        const channel = supabase
            .channel('kas-transactions-realtime')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'kas_transactions' },
                () => fetchTransactions()
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [isAuthorized, supabase])

    const { totalIncome, totalExpense, currentKas, currentDanus, totalBalance } = useMemo(() => {
        let incomeSum = 0
        let expenseSum = 0
        let kasBalance = 0
        let danusBalance = 0

        transactions.forEach((tx) => {
            const nominal = Number(tx.amount) || 0
            if (tx.type === 'income') {
                incomeSum += nominal
                if (tx.category === 'Danus') {
                    danusBalance += nominal
                } else {
                    kasBalance += nominal
                }
            } else {
                expenseSum += nominal
                if (tx.category === 'Danus') {
                    danusBalance -= nominal
                } else {
                    kasBalance -= nominal
                }
            }
        })

        return {
            totalIncome: incomeSum,
            totalExpense: expenseSum,
            currentKas: kasBalance,
            currentDanus: danusBalance,
            totalBalance: kasBalance + danusBalance
        }
    }, [transactions])

    const openCreateModal = () => {
        setEditingTx(null)
        setFormError(null)
        setFormDate(new Date().toISOString().split('T')[0])
        setFormDescription('')
        setFormType('income')
        setFormCategory('Kas')
        setFormAmount('')
        setIsRecordModalOpen(true)
    }

    const openEditModal = (tx: KasTransaction) => {
        setEditingTx(tx)
        setFormError(null)
        setFormDate(tx.transaction_date || new Date().toISOString().split('T')[0])
        setFormDescription(tx.description)
        setFormType(tx.type)
        setFormCategory(tx.category)
        setFormAmount(String(tx.amount))
        setIsRecordModalOpen(true)
    }

    const handleSaveTransaction = async (e: React.FormEvent) => {
        e.preventDefault()
        setFormError(null)

        const numAmount = Math.round(parseFloat(formAmount))
        if (!formDescription.trim() || isNaN(numAmount) || numAmount <= 0) {
            setFormError('Mohon isi keterangan dan nominal transaksi yang valid (lebih dari 0).')
            return
        }

        setIsSaving(true)

        if (editingTx) {
            const { error } = await supabase
                .from('kas_transactions')
                .update({
                    transaction_date: formDate,
                    description: formDescription.trim(),
                    type: formType,
                    category: formCategory,
                    amount: numAmount
                })
                .eq('id', editingTx.id)

            if (error) {
                setFormError(`Gagal memperbarui transaksi: ${error.message}`)
                setIsSaving(false)
                return
            }
        } else {
            const { error } = await supabase.from('kas_transactions').insert({
                transaction_date: formDate,
                description: formDescription.trim(),
                type: formType,
                category: formCategory,
                amount: numAmount,
                created_by: currentUserId
            })

            if (error) {
                setFormError(`Gagal menyimpan transaksi: ${error.message}`)
                setIsSaving(false)
                return
            }
        }

        setIsSaving(false)
        setIsRecordModalOpen(false)
        await fetchTransactions()
    }

    const handleDeleteTransaction = async (tx: KasTransaction) => {
        if (!confirm(`Hapus mutasi "${tx.description}" (${formatRupiah(tx.amount)})?`)) return

        const { error } = await supabase.from('kas_transactions').delete().eq('id', tx.id)
        if (error) {
            alert(`Gagal menghapus transaksi: ${error.message}`)
        } else {
            await fetchTransactions()
        }
    }

    // Export CSV
    const handleExportData = () => {
        const csvContent =
            'data:text/csv;charset=utf-8,' +
            'Tanggal,Deskripsi,Kategori,Tipe,Nominal\n' +
            transactions
                .map(
                    (t) =>
                        `"${t.transaction_date}","${t.description.replace(/"/g, '""')}","${t.category}","${
                            t.type === 'income' ? 'Pemasukan' : 'Pengeluaran'
                        }",${t.amount}`
                )
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

    if (isCheckingAuth) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-slate-500">
                <Loader2 className="size-7 animate-spin text-blue-600" />
                <p className="text-xs font-semibold">Memverifikasi hak akses Bendahara Umum...</p>
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
                    Modul <strong>Kas Organisasi</strong> hanya dapat diakses oleh <strong>Bendahara Umum (Bendum)</strong> dan <strong>Administrator</strong>.
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
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center border-b border-slate-200 pb-5">
                <div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 mb-1">
                        <span>SIM HIMATIFA</span>
                        <ChevronRight className="size-3 text-slate-400" />
                        <span className="text-slate-500">Bendahara Umum (Bendum)</span>
                    </div>
                    <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                        Manajemen Kas <span className="text-blue-600">Organisasi</span>
                    </h1>
                    <p className="mt-1 text-xs sm:text-sm text-slate-500">
                        Pantau arus kas, alokasi dana usaha, dan transparansi anggaran kegiatan secara real-time.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                    <button
                        type="button"
                        onClick={handleExportData}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-xs transition hover:border-slate-300 hover:bg-slate-50 active:scale-[0.98] cursor-pointer"
                    >
                        <Download className="size-3.5 text-slate-400" />
                        <span>Export CSV</span>
                    </button>
                    <button
                        type="button"
                        onClick={openCreateModal}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-blue-600/10 transition hover:bg-blue-500 active:scale-[0.98] cursor-pointer"
                    >
                        <Plus className="size-4" />
                        <span>Catat Transaksi</span>
                    </button>
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-2xl border border-slate-900 bg-slate-900 p-5 text-white shadow-xs flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
                            <div className="flex items-center gap-2 text-blue-400">
                                <Coins className="size-4" />
                                <span className="text-[10px] font-extrabold uppercase tracking-wider">Total Saldo Aktif</span>
                            </div>
                            <span className="rounded-full bg-blue-500/10 border border-blue-400/20 px-2 py-0.5 text-[10px] font-bold text-blue-400">
                                Real-time
                            </span>
                        </div>

                        <p className="font-mono text-2xl font-extrabold text-white">
                            {formatRupiah(totalBalance)}
                        </p>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-2 rounded-xl bg-slate-800/80 p-3 text-xs border border-slate-800">
                        <div>
                            <p className="text-[10px] font-semibold text-slate-400">Kas Organisasi</p>
                            <p className="mt-0.5 font-bold text-emerald-400">{formatRupiah(currentKas)}</p>
                        </div>
                        <div className="border-l border-slate-700 pl-2.5">
                            <p className="text-[10px] font-semibold text-slate-400">Dana Usaha</p>
                            <p className="mt-0.5 font-bold text-cyan-400">{formatRupiah(currentDanus)}</p>
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between">
                            <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Pemasukan (Tercatat)</p>
                            <div className="grid size-9 place-items-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                                <ArrowUpRight className="size-4.5" />
                            </div>
                        </div>
                        <p className="mt-2 font-mono text-2xl font-extrabold text-emerald-600">
                            +{formatRupiah(totalIncome)}
                        </p>
                    </div>

                    <div className="mt-4 flex items-center gap-1.5 rounded-lg bg-emerald-50/80 px-2.5 py-1.5 text-[11px] font-semibold text-emerald-700 border border-emerald-100">
                        <TrendingUp className="size-3.5" />
                        <span>Termasuk Saldo Awal, Iuran Kas & Danus</span>
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between">
                            <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Pengeluaran (Tercatat)</p>
                            <div className="grid size-9 place-items-center rounded-xl bg-red-50 text-red-600 border border-red-100">
                                <ArrowDownRight className="size-4.5" />
                            </div>
                        </div>
                        <p className="mt-2 font-mono text-2xl font-extrabold text-red-600">
                            -{formatRupiah(totalExpense)}
                        </p>
                    </div>

                    <div className="mt-4 flex items-center gap-1.5 rounded-lg bg-red-50/80 px-2.5 py-1.5 text-[11px] font-semibold text-red-700 border border-red-100">
                        <Receipt className="size-3.5" />
                        <span>Alokasi Proker & Operasional Sekre</span>
                    </div>
                </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-2.5">
                        <div className="grid size-9 place-items-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
                            <History className="size-4.5" />
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-slate-900">Riwayat Mutasi Transaksi</h2>
                            <p className="text-[11px] text-slate-400 font-medium">Log mutasi keuangan kas himpunan dari Supabase</p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <div className="flex rounded-xl bg-slate-100 p-1 text-xs font-semibold">
                            <button
                                onClick={() => setFilterType('all')}
                                className={`rounded-lg px-3 py-1 transition cursor-pointer ${
                                    filterType === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                                }`}
                            >
                                Semua
                            </button>
                            <button
                                onClick={() => setFilterType('income')}
                                className={`rounded-lg px-3 py-1 transition cursor-pointer ${
                                    filterType === 'income' ? 'bg-white text-emerald-600 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                                }`}
                            >
                                Masuk
                            </button>
                            <button
                                onClick={() => setFilterType('expense')}
                                className={`rounded-lg px-3 py-1 transition cursor-pointer ${
                                    filterType === 'expense' ? 'bg-white text-red-600 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                                }`}
                            >
                                Keluar
                            </button>
                        </div>

                        <div className="relative flex-1 sm:w-52">
                            <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Cari deskripsi / kategori..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-1.5 pl-8 pr-3 text-xs font-medium text-slate-900 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/10"
                            />
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-600">
                        <thead className="border-b border-slate-200 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 bg-slate-50/50">
                        <tr>
                            <th className="py-3 px-3">Tanggal</th>
                            <th className="py-3 px-3">Keterangan Transaksi</th>
                            <th className="py-3 px-3">Kategori & Tipe</th>
                            <th className="py-3 px-3 text-right">Nominal</th>
                            <th className="py-3 px-3 text-right">Aksi</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                        {isLoading ? (
                            <tr>
                                <td colSpan={5} className="py-12 text-center">
                                    <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-500">
                                        <Loader2 className="size-4 animate-spin text-blue-600" />
                                        <span>Memuat data mutasi kas...</span>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            filteredTransactions.map((tx) => (
                                <tr key={tx.id} className="group transition hover:bg-slate-50/80">
                                    <td className="py-3.5 px-3 whitespace-nowrap text-slate-400 font-medium">
                                        {formatTanggalID(tx.transaction_date)}
                                    </td>
                                    <td className="py-3.5 px-3">
                                        <p className="font-bold text-slate-900 group-hover:text-blue-600 transition">
                                            {tx.description}
                                        </p>
                                    </td>
                                    <td className="py-3.5 px-3 whitespace-nowrap">
                                            <span
                                                className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold ${
                                                    tx.type === 'income'
                                                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                        : 'bg-red-50 text-red-700 border border-red-200'
                                                }`}
                                            >
                                                {tx.type === 'income' ? 'Pemasukan' : 'Pengeluaran'} ({tx.category})
                                            </span>
                                    </td>
                                    <td
                                        className={`py-3.5 px-3 text-right whitespace-nowrap font-mono font-bold ${
                                            tx.type === 'income' ? 'text-emerald-600' : 'text-red-600'
                                        }`}
                                    >
                                        {tx.type === 'income' ? '+' : '-'} {formatRupiah(tx.amount)}
                                    </td>
                                    <td className="py-3.5 px-3 text-right whitespace-nowrap">
                                        <div className="inline-flex items-center gap-1">
                                            <button
                                                type="button"
                                                onClick={() => openEditModal(tx)}
                                                title="Edit Transaksi"
                                                className="rounded-lg p-1.5 text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition cursor-pointer"
                                            >
                                                <Pencil className="size-3.5" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteTransaction(tx)}
                                                title="Hapus Transaksi"
                                                className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 transition cursor-pointer"
                                            >
                                                <Trash2 className="size-3.5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>

                    {!isLoading && filteredTransactions.length === 0 && (
                        <div className="py-12 text-center">
                            <PieChart className="mx-auto size-8 text-slate-300" />
                            <p className="mt-2 text-xs font-semibold text-slate-500">
                                Belum ada riwayat transaksi yang tercatat.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <AnimatePresence>
                {isRecordModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsRecordModalOpen(false)}
                            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.98, y: 12 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.98, y: 12 }}
                            className="relative z-10 w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-xl sm:p-8"
                        >
                            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                                <div className="flex items-center gap-2 font-bold text-slate-900 text-base">
                                    <div className="grid size-8 place-items-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
                                        {editingTx ? <Pencil className="size-4" /> : <Plus className="size-4" />}
                                    </div>
                                    <span>{editingTx ? 'Edit Mutasi Transaksi' : 'Catat Mutasi Transaksi Baru'}</span>
                                </div>
                                <button
                                    onClick={() => setIsRecordModalOpen(false)}
                                    className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition cursor-pointer"
                                >
                                    <X className="size-4.5" />
                                </button>
                            </div>

                            {formError && (
                                <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-xs font-semibold text-red-700">
                                    {formError}
                                </div>
                            )}

                            <form onSubmit={handleSaveTransaction} className="mt-5 space-y-4">
                                <div>
                                    <label className="mb-1 block text-xs font-semibold text-slate-700">
                                        Tipe Transaksi
                                    </label>
                                    <div className="grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1 text-xs font-semibold">
                                        <button
                                            type="button"
                                            onClick={() => setFormType('income')}
                                            className={`rounded-lg py-2 transition cursor-pointer ${
                                                formType === 'income'
                                                    ? 'bg-emerald-600 text-white shadow-xs'
                                                    : 'text-slate-600 hover:text-slate-900'
                                            }`}
                                        >
                                            + Pemasukan
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setFormType('expense')}
                                            className={`rounded-lg py-2 transition cursor-pointer ${
                                                formType === 'expense'
                                                    ? 'bg-red-600 text-white shadow-xs'
                                                    : 'text-slate-600 hover:text-slate-900'
                                            }`}
                                        >
                                            - Pengeluaran
                                        </button>
                                    </div>
                                </div>

                                <div className="grid gap-4 sm:grid-cols-3">
                                    <div>
                                        <label className="mb-1 block text-xs font-semibold text-slate-700">
                                            Tanggal
                                        </label>
                                        <input
                                            type="date"
                                            required
                                            value={formDate}
                                            onChange={(e) => setFormDate(e.target.value)}
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 px-3 text-xs font-medium text-slate-900 outline-none transition focus:border-blue-600 focus:bg-white"
                                        />
                                    </div>

                                    <div className="sm:col-span-2">
                                        <label className="mb-1 block text-xs font-semibold text-slate-700">
                                            Keterangan Transaksi <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formDescription}
                                            onChange={(e) => setFormDescription(e.target.value)}
                                            placeholder="Contoh: Saldo Awal Kas Periode 2026/2027"
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 px-3.5 text-xs font-medium text-slate-900 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/10"
                                        />
                                    </div>
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="mb-1 block text-xs font-semibold text-slate-700">
                                            Kategori Alokasi
                                        </label>
                                        <select
                                            value={formCategory}
                                            onChange={(e) => setFormCategory(e.target.value as TransactionCategory)}
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 px-3.5 text-xs font-semibold text-slate-900 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/10 cursor-pointer"
                                        >
                                            <option value="Kas">Kas Organisasi</option>
                                            <option value="Danus">Dana Usaha</option>
                                            <option value="Proker">Program Kerja</option>
                                            <option value="Operasional">Operasional Sekre</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="mb-1 block text-xs font-semibold text-slate-700">
                                            Nominal (Rp) <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            required
                                            min={1}
                                            value={formAmount}
                                            onChange={(e) => setFormAmount(e.target.value)}
                                            placeholder="Contoh: 250000"
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 px-3.5 text-xs font-mono font-bold text-slate-900 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/10"
                                        />
                                    </div>
                                </div>

                                <div className="mt-6 flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
                                    <button
                                        type="button"
                                        onClick={() => setIsRecordModalOpen(false)}
                                        className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition cursor-pointer"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSaving}
                                        className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-blue-600/10 transition hover:bg-blue-500 active:scale-[0.98] disabled:opacity-50 cursor-pointer"
                                    >
                                        {isSaving ? (
                                            <Loader2 className="size-4 animate-spin" />
                                        ) : (
                                            <CheckCircle2 className="size-4" />
                                        )}
                                        <span>{editingTx ? 'Simpan Perubahan' : 'Simpan Transaksi'}</span>
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