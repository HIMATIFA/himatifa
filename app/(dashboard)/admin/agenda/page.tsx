'use client'

import { useState, useMemo } from 'react'
import { Plus, Edit3, Trash2, Download, CheckSquare, Calendar, MapPin, Clock, Search, CalendarDays } from 'lucide-react'

interface Agenda {
    id: number
    title: string
    division: string
    date: string
    time: string
    location: string
    status: 'Akan Datang' | 'Selesai' | 'Berlangsung' | 'Draft'
    type: 'Event' | 'Rapat' | 'Workshop'
}

export default function AdminAgendaPage() {
    const [searchQuery, setSearchQuery] = useState('')
    const [activeTab, setActiveTab] = useState<string>('semua')
    const [selectedItems, setSelectedItems] = useState<number[]>([])

    const [agendas] = useState<Agenda[]>([
        { id: 1, title: 'OSCAR (Olimpiade Siswa Cerdas) 2026', division: 'Divisi Event', date: '15 Okt 2026', time: '08:00 - Selesai', location: 'Gedung At-Tauhid Tower', status: 'Akan Datang', type: 'Event' },
        { id: 2, title: 'Rapat Evaluasi BPH Bulanan', division: 'Sekretaris Umum', date: '08 Okt 2026', time: '19:00 - 21:00', location: 'Google Meet', status: 'Selesai', type: 'Rapat' },
        { id: 3, title: 'Workshop UI/UX & Web3 Development', division: 'Divisi Keilmuan', date: '20 Okt 2026', time: '09:00 - 15:00', location: 'Lab Komputer Terpadu', status: 'Akan Datang', type: 'Workshop' },
        { id: 4, title: 'Makrab Mahasiswa Baru Informatika', division: 'Divisi Humas', date: '25 Nov 2026', time: 'TBA', location: 'Villa Trawas, Mojokerto', status: 'Draft', type: 'Event' },
        { id: 5, title: 'Pendelegasian Lomba KMHE', division: 'BPH', date: '06 Okt 2026', time: '07:00 - Selesai', location: 'Sirkuit Mandalika', status: 'Berlangsung', type: 'Event' },
    ])

    const filteredAgendas = useMemo(() => {
        return agendas.filter((item) => {
            const matchesTab = activeTab === 'semua' || item.status.toLowerCase() === activeTab.replace('-', ' ')
            const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.division.toLowerCase().includes(searchQuery.toLowerCase())

            return matchesTab && matchesSearch
        })
    }, [agendas, activeTab, searchQuery])

    const toggleSelect = (id: number) => {
        setSelectedItems((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id])
    }

    const toggleSelectAll = () => {
        const currentFilteredIds = filteredAgendas.map((a) => a.id)
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
                    <h2 className="text-2xl font-black tracking-tight text-slate-900">Agenda & Kegiatan</h2>
                    <p className="mt-1 text-sm font-medium text-slate-500">Kelola jadwal acara, rapat koordinasi, dan kegiatan HIMATIFA.</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50">
                        <Download className="size-4" /> Export Kalender
                    </button>
                    <button className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-600/20 transition-all hover:bg-blue-700 hover:shadow-blue-600/30 active:scale-95">
                        <Plus className="size-4" /> Tambah Agenda
                    </button>
                </div>
            </div>

            <div className="mb-6 flex flex-col justify-between gap-4 rounded-xl border border-slate-200 bg-white p-2 shadow-sm md:flex-row md:items-center">
                <div className="flex gap-1 overflow-x-auto p-1">
                    {['Semua', 'Akan Datang', 'Berlangsung', 'Selesai', 'Draft'].map((tab) => {
                        const tabKey = tab.toLowerCase().replace(' ', '-')
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
                        placeholder="Cari acara, lokasi, divisi..."
                        className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-4 text-sm font-medium outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                    />
                </div>
            </div>

            {selectedItems.length > 0 && (
                <div className="mb-4 flex items-center justify-between rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 animate-in slide-in-from-top-2">
                    <span className="text-sm font-bold text-blue-700">{selectedItems.length} agenda dipilih</span>
                    <div className="flex gap-2">
                        <button className="rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50">Ubah Status</button>
                        <button className="rounded-lg bg-red-100 px-3 py-1.5 text-xs font-bold text-red-600 shadow-sm hover:bg-red-200">Hapus Terpilih</button>
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
                                        filteredAgendas.length > 0 && filteredAgendas.every((a) => selectedItems.includes(a.id))
                                            ? 'text-blue-600'
                                            : 'text-slate-400 hover:text-slate-600'
                                    }`} />
                                </button>
                            </th>
                            <th className="px-4 py-4">Nama Agenda</th>
                            <th className="px-4 py-4">Status</th>
                            <th className="px-4 py-4">Jadwal & Lokasi</th>
                            <th className="px-4 py-4">Pelaksana</th>
                            <th className="px-6 py-4 text-right">Aksi</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                        {filteredAgendas.length > 0 ? (
                            filteredAgendas.map((item) => (
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
                                            <div className="grid size-12 shrink-0 place-items-center rounded-xl border border-slate-100 bg-slate-50 text-slate-400">
                                                <CalendarDays className="size-5" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900">{item.title}</p>
                                                <p className="mt-0.5 text-[11px] font-medium text-slate-400">{item.type}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4">
                                            <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ${
                                                item.status === 'Selesai' ? 'bg-emerald-100 text-emerald-700' :
                                                    item.status === 'Berlangsung' ? 'bg-rose-100 text-rose-700' :
                                                        item.status === 'Akan Datang' ? 'bg-blue-100 text-blue-700' :
                                                            'bg-slate-100 text-slate-600'
                                            }`}>
                                                {item.status}
                                            </span>
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="flex flex-col gap-1.5">
                                            <div className="flex items-center gap-2 text-xs font-semibold text-slate-900">
                                                <Calendar className="size-3.5 text-slate-400" /> {item.date}
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                                <Clock className="size-3.5 text-slate-400" /> {item.time}
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                                <MapPin className="size-3.5 text-slate-400" /> {item.location}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4">
                                            <span className="inline-flex rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                                                {item.division}
                                            </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                                            <button className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-blue-50 hover:text-blue-600">
                                                <Edit3 className="size-4" />
                                            </button>
                                            <button className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600">
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
                                        <Calendar className="mb-3 size-10 text-slate-300" />
                                        <p className="font-medium text-slate-900">Tidak ada agenda ditemukan.</p>
                                        <p className="mt-1 text-xs text-slate-500">Coba ubah kata kunci atau filter status.</p>
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