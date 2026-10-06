'use client'

import { useState, useMemo } from 'react'
import { Plus, Edit3, Trash2, Download, CheckSquare, Search, User, Shield, ShieldAlert, GraduationCap } from 'lucide-react'

interface Pengurus {
    id: number
    name: string
    nim: string
    role: string
    division: string
    period: string
    status: 'Aktif' | 'Demisioner' | 'Cuti'
    img: boolean
}

export default function AdminBPHPage() {
    const [searchQuery, setSearchQuery] = useState('')
    const [activeTab, setActiveTab] = useState<string>('semua')
    const [selectedItems, setSelectedItems] = useState<number[]>([])

    const [members] = useState<Pengurus[]>([
        { id: 1, name: 'Muhammad Arya', nim: '20230140001', role: 'Ketua Umum', division: 'BPH Inti', period: '2026/2027', status: 'Aktif', img: true },
        { id: 2, name: 'Nadia Salsabila', nim: '20230140024', role: 'Sekretaris Umum', division: 'BPH Inti', period: '2026/2027', status: 'Aktif', img: false },
        { id: 3, name: 'Budi Santoso', nim: '20220140105', role: 'Kepala Divisi', division: 'Divisi Keilmuan', period: '2025/2026', status: 'Demisioner', img: true },
        { id: 4, name: 'Siti Rahma', nim: '20240140056', role: 'Staff', division: 'Divisi Kominfo', period: '2026/2027', status: 'Aktif', img: true },
        { id: 5, name: 'Ahmad Fauzi', nim: '20230140088', role: 'Staff', division: 'Divisi Event', period: '2026/2027', status: 'Cuti', img: false },
    ])

    const filteredMembers = useMemo(() => {
        return members.filter((item) => {
            const matchesTab = activeTab === 'semua' || item.status.toLowerCase() === activeTab
            const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.nim.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.division.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.role.toLowerCase().includes(searchQuery.toLowerCase())

            return matchesTab && matchesSearch
        })
    }, [members, activeTab, searchQuery])

    const toggleSelect = (id: number) => {
        setSelectedItems((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id])
    }

    const toggleSelectAll = () => {
        const currentFilteredIds = filteredMembers.map((a) => a.id)
        const isAllSelected = currentFilteredIds.length > 0 && currentFilteredIds.every((id) => selectedItems.includes(id))

        if (isAllSelected) {
            setSelectedItems((prev) => prev.filter((id) => !currentFilteredIds.includes(id)))
        } else {
            setSelectedItems((prev) => Array.from(new Set([...prev, ...currentFilteredIds])))
        }
    }

    return (
        <div className="mx-auto max-w-7xl animate-in fade-in duration-300">
            <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
                <div>
                    <h2 className="text-2xl font-black tracking-tight text-slate-900">Struktur BPH</h2>
                    <p className="mt-1 text-sm font-medium text-slate-500">Kelola data keanggotaan Badan Pengurus Harian HIMATIFA.</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50">
                        <Download className="size-4" /> Export Data
                    </button>
                    <button className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-600/20 transition-all hover:bg-blue-700 hover:shadow-blue-600/30 active:scale-95">
                        <Plus className="size-4" /> Tambah Pengurus
                    </button>
                </div>
            </div>

            <div className="mb-6 flex flex-col justify-between gap-4 rounded-xl border border-slate-200 bg-white p-2 shadow-sm md:flex-row md:items-center">
                <div className="flex gap-1 overflow-x-auto p-1">
                    {['Semua', 'Aktif', 'Cuti', 'Demisioner'].map((tab) => {
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

                <div className="relative px-2 pb-2 md:w-72 md:pb-0 md:pr-2">
                    <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400 md:top-1/2" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Cari nama, NIM, divisi..."
                        className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-4 text-sm font-medium outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                    />
                </div>
            </div>

            {selectedItems.length > 0 && (
                <div className="mb-4 flex items-center justify-between rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 animate-in slide-in-from-top-2">
                    <span className="text-sm font-bold text-blue-700">{selectedItems.length} pengurus dipilih</span>
                    <div className="flex gap-2">
                        <button className="rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50">Ubah Divisi</button>
                        <button className="rounded-lg bg-red-100 px-3 py-1.5 text-xs font-bold text-red-600 shadow-sm hover:bg-red-200">Keluarkan</button>
                    </div>
                </div>
            )}

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600">
                        <thead className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-extrabold uppercase tracking-widest text-slate-500">
                        <tr>
                            <th className="w-12 px-6 py-4">
                                <button onClick={toggleSelectAll} className="outline-none">
                                    <CheckSquare className={`size-[18px] transition-colors ${
                                        filteredMembers.length > 0 && filteredMembers.every((a) => selectedItems.includes(a.id))
                                            ? 'text-blue-600'
                                            : 'text-slate-400 hover:text-slate-600'
                                    }`} />
                                </button>
                            </th>
                            <th className="px-4 py-4">Profil Pengurus</th>
                            <th className="px-4 py-4">Status</th>
                            <th className="px-4 py-4">Jabatan & Divisi</th>
                            <th className="px-4 py-4">Periode</th>
                            <th className="px-6 py-4 text-right">Aksi</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                        {filteredMembers.length > 0 ? (
                            filteredMembers.map((item) => (
                                <tr
                                    key={item.id}
                                    className={`group transition-colors hover:bg-slate-50/80 ${selectedItems.includes(item.id) ? 'bg-blue-50/30' : ''}`}
                                >
                                    <td className="px-6 py-4">
                                        <button onClick={() => toggleSelect(item.id)} className="outline-none">
                                            <CheckSquare className={`size-[18px] transition-colors ${
                                                selectedItems.includes(item.id)
                                                    ? 'text-blue-600'
                                                    : 'text-slate-300 group-hover:text-slate-400'
                                            }`} />
                                        </button>
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="grid size-10 shrink-0 place-items-center overflow-hidden rounded-full border border-slate-200 bg-slate-100">
                                                {item.img ? (
                                                    <img
                                                        src={`https://api.dicebear.com/7.x/notionists/svg?seed=${item.name.replace(' ', '')}`}
                                                        alt={item.name}
                                                        className="size-full object-cover"
                                                    />
                                                ) : (
                                                    <User className="size-5 text-slate-400" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900">{item.name}</p>
                                                <p className="mt-0.5 font-mono text-[11px] font-medium text-slate-500">{item.nim}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4">
                                            <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ${
                                                item.status === 'Aktif' ? 'bg-emerald-100 text-emerald-700' :
                                                    item.status === 'Cuti' ? 'bg-amber-100 text-amber-700' :
                                                        'bg-slate-100 text-slate-600'
                                            }`}>
                                                {item.status}
                                            </span>
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-1.5 font-semibold text-slate-900">
                                                {item.division === 'BPH Inti' ? <Shield className="size-3.5 text-blue-600" /> : <ShieldAlert className="size-3.5 text-slate-400" />}
                                                {item.role}
                                            </div>
                                            <span className="text-xs text-slate-500">{item.division}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                                            <GraduationCap className="size-4 text-slate-400" />
                                            {item.period}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                                            <button className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-blue-50 hover:text-blue-600" title="Edit Profil">
                                                <Edit3 className="size-4" />
                                            </button>
                                            <button className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600" title="Hapus Pengurus">
                                                <Trash2 className="size-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                                    <div className="flex flex-col items-center justify-center">
                                        <User className="mb-3 size-10 text-slate-300" />
                                        <p className="font-medium text-slate-900">Data pengurus tidak ditemukan.</p>
                                        <p className="mt-1 text-xs text-slate-500">Coba ubah kata kunci atau filter status aktif.</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
