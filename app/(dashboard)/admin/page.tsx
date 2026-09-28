'use client'

import { useState, useMemo } from 'react'
import { 
  LayoutDashboard, Newspaper, CalendarDays, Users, 
  Settings, Image as ImageIcon, Plus, Edit3, Trash2, 
  Search, Bell, ChevronRight, Filter, Download, 
  ArrowUpRight, CheckSquare, ImageOff, BarChart3, 
  Folders, ShieldAlert, CheckCircle2, Clock, LogOut,
  X
} from 'lucide-react'

interface Article {
  id: number
  title: string
  slug: string
  cat: string
  author: string
  status: 'Published' | 'Draft' | 'Archived'
  date: string
  views: string
  img: boolean
}

export default function AdminPage() {
  const [activeMenu, setActiveMenu] = useState<string>('berita')
  const [activeTab, setActiveTab] = useState<string>('semua')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [selectedItems, setSelectedItems] = useState<number[]>([])

  // Data Simulasi Artikel
  const [articles] = useState<Article[]>([
    { id: 1, title: 'HIMATIFA Sukses Gelar OSCAR 2026', slug: 'himatifa-sukses-gelar-oscar-2026', cat: 'Event', author: 'Divisi Kominfo', status: 'Published', date: '25 Sep 2026', views: '1.2k', img: true },
    { id: 2, title: 'Pendelegasian KMHE 2026 Siap Berangkat', slug: 'kmhe-2026-pendelegasian', cat: 'Prestasi', author: 'Arya Putra', status: 'Draft', date: '22 Sep 2026', views: '-', img: false },
    { id: 3, title: 'Open Recruitment Pengurus Baru Periode 2027', slug: 'oprec-pengurus-2027', cat: 'Info Kampus', author: 'Sekretaris Umum', status: 'Published', date: '18 Sep 2026', views: '3.4k', img: true },
    { id: 4, title: 'Workshop AI & Web3 Development', slug: 'workshop-ai-web3', cat: 'Event', author: 'Divisi Keilmuan', status: 'Archived', date: '10 Sep 2026', views: '856', img: true },
  ])

  // Logic Filtering Real-time berdasarkan tab dan query pencarian
  const filteredArticles = useMemo(() => {
    return articles.filter((item) => {
      const matchesTab = activeTab === 'semua' || item.status.toLowerCase() === activeTab
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.author.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesTab && matchesSearch
    })
  }, [articles, activeTab, searchQuery])

  // Select / Deselect Individual Item
  const toggleSelect = (id: number) => {
    setSelectedItems((prev) => 
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  // Select / Deselect All Items yang sedang difilter
  const toggleSelectAll = () => {
    const currentFilteredIds = filteredArticles.map((a) => a.id)
    const isAllSelected = currentFilteredIds.every((id) => selectedItems.includes(id))

    if (isAllSelected) {
      setSelectedItems((prev) => prev.filter((id) => !currentFilteredIds.includes(id)))
    } else {
      setSelectedItems((prev) => Array.from(new Set([...prev, ...currentFilteredIds])))
    }
  }

  return (
    <div className="flex h-screen w-full bg-[#f8fafc] font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      
      {/* SIDEBAR NAVIGATION */}
      <aside className="flex w-[280px] shrink-0 flex-col border-r border-slate-200 bg-white transition-all duration-300">
        {/* Brand Logo */}
        <div className="flex h-20 shrink-0 items-center gap-3 px-6 border-b border-slate-100">
          <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 shadow-inner">
            <span className="text-lg font-black text-white">H</span>
          </div>
          <div>
            <h1 className="text-sm font-black tracking-tight text-slate-900">HIMATIFA CMS</h1>
            <p className="text-[10px] font-bold text-slate-400">Workspace Management</p>
          </div>
        </div>
        
        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <div className="mb-6">
            <p className="mb-2 px-3 text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Overview</p>
            <button 
              onClick={() => setActiveMenu('dashboard')} 
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-all ${activeMenu === 'dashboard' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
            >
              <LayoutDashboard className="size-[18px]" /> Dashboard
            </button>
            <button 
              onClick={() => setActiveMenu('analytics')} 
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-all ${activeMenu === 'analytics' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
            >
              <BarChart3 className="size-[18px]" /> Site Analytics
            </button>
          </div>

          <div className="mb-6">
            <p className="mb-2 px-3 text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Content Management</p>
            {[
              { id: 'berita', label: 'Artikel & Berita', icon: Newspaper, count: articles.length },
              { id: 'agenda', label: 'Agenda Kegiatan', icon: CalendarDays, count: 4 },
              { id: 'bph', label: 'Struktur BPH', icon: Users },
              { id: 'kategori', label: 'Kategori Modul', icon: Folders },
            ].map((item) => (
              <button 
                key={item.id} 
                onClick={() => setActiveMenu(item.id)} 
                className={`group/btn flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-semibold transition-all ${activeMenu === item.id ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
              >
                <div className="flex items-center gap-3">
                  <item.icon className={`size-[18px] ${activeMenu === item.id ? 'text-blue-700' : 'text-slate-400 group-hover/btn:text-slate-600'}`} />
                  {item.label}
                </div>
                {item.count !== undefined && (
                  <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${activeMenu === item.id ? 'bg-blue-200/50 text-blue-800' : 'bg-slate-100 text-slate-500'}`}>
                    {item.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div>
            <p className="mb-2 px-3 text-[10px] font-extrabold uppercase tracking-widest text-slate-400">System</p>
            <button 
              onClick={() => setActiveMenu('media')} 
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-all ${activeMenu === 'media' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
            >
              <ImageIcon className="size-[18px]" /> Media Library
            </button>
            <button 
              onClick={() => setActiveMenu('pengaturan')} 
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-all ${activeMenu === 'pengaturan' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
            >
              <Settings className="size-[18px]" /> Pengaturan Web
            </button>
          </div>
        </div>

        {/* User Profile Footer */}
        <div className="border-t border-slate-200 p-4">
          <div className="flex cursor-pointer items-center gap-3 rounded-xl p-2 transition-colors hover:bg-slate-50">
            <div className="size-10 overflow-hidden rounded-full bg-slate-200 border border-slate-300">
              <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Arya" alt="User Avatar" className="size-full object-cover" />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-sm font-bold text-slate-900">Muhammad Arya</p>
              <p className="truncate text-xs font-medium text-slate-500">Super Administrator</p>
            </div>
            <LogOut className="size-5 text-slate-400 transition-colors hover:text-red-500" />
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header Panel */}
        <header className="sticky top-0 z-10 flex h-20 shrink-0 items-center justify-between border-b border-slate-200 bg-white/80 px-8 backdrop-blur-xl">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
            <span>Workspace</span>
            <ChevronRight className="size-4 text-slate-400" />
            <span className="font-bold capitalize text-slate-900">{activeMenu.replace('-', ' ')}</span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari artikel, slug, penulis..." 
                className="w-64 rounded-full border border-slate-200 bg-slate-50 py-2 pl-9 pr-8 text-sm font-medium outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10" 
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>

            <button className="relative rounded-full border border-slate-200 p-2 text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors">
              <Bell className="size-[18px]" />
              <span className="absolute right-1 top-1 size-2.5 rounded-full bg-red-500 ring-2 ring-white"></span>
            </button>

            <button className="rounded-full bg-slate-900 px-5 py-2 text-sm font-bold text-white transition-all hover:bg-slate-800 hover:shadow-lg hover:shadow-slate-900/20 active:scale-95">
              Live Preview
            </button>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <div className="flex-1 overflow-y-auto p-8">
          
          {/* MODULE: KELOLA BERITA & ARTIKEL */}
          {activeMenu === 'berita' && (
            <div className="mx-auto max-w-7xl animate-in fade-in duration-300">
              
              {/* Page Title & Main Actions */}
              <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
                <div>
                  <h2 className="text-2xl font-black tracking-tight text-slate-900">Artikel & Berita</h2>
                  <p className="mt-1 text-sm font-medium text-slate-500">Kelola publikasi, press release, dan pengumuman himpunan.</p>
                </div>
                <div className="flex gap-3">
                  <button className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:border-slate-300">
                    <Download className="size-4" /> Export CSV
                  </button>
                  <button className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-600/20 transition-all hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/30 active:scale-95">
                    <Plus className="size-4" /> Tulis Artikel Baru
                  </button>
                </div>
              </div>

              {/* Status Tabs & Filter Bar */}
              <div className="mb-6 flex flex-col justify-between gap-4 rounded-xl border border-slate-200 bg-white p-2 shadow-sm md:flex-row md:items-center">
                <div className="flex gap-1 overflow-x-auto p-1">
                  {['Semua', 'Published', 'Draft', 'Archived'].map((tab) => {
                    const tabKey = tab.toLowerCase()
                    const isActive = activeTab === tabKey
                    return (
                      <button 
                        key={tab} 
                        onClick={() => setActiveTab(tabKey)}
                        className={`rounded-lg px-4 py-2 text-sm font-bold transition-all ${
                          isActive 
                            ? 'bg-slate-100 text-slate-900 shadow-sm' 
                            : 'text-slate-500 hover:text-slate-900'
                        }`}
                      >
                        {tab}
                      </button>
                    )
                  })}
                </div>
                
                <div className="flex items-center gap-3 px-2 md:px-0">
                  <div className="h-6 w-px bg-slate-200 hidden md:block"></div>
                  <button className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900">
                    <Filter className="size-4" /> Filter
                  </button>
                  <select className="cursor-pointer border-none bg-transparent text-sm font-semibold text-slate-500 outline-none hover:text-slate-900 focus:ring-0">
                    <option>Urutkan: Terbaru</option>
                    <option>Urutkan: Terlama</option>
                    <option>Urutkan: Views Terbanyak</option>
                  </select>
                </div>
              </div>

              {/* Bulk Actions Panel */}
              {selectedItems.length > 0 && (
                <div className="mb-4 flex items-center justify-between rounded-xl border border-blue-200 bg-blue-50 px-4 py-3">
                  <span className="text-sm font-bold text-blue-700">{selectedItems.length} artikel dipilih</span>
                  <div className="flex gap-2">
                    <button className="rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50">Ubah Kategori</button>
                    <button className="rounded-lg bg-red-100 px-3 py-1.5 text-xs font-bold text-red-600 shadow-sm hover:bg-red-200">Hapus Terpilih</button>
                  </div>
                </div>
              )}

              {/* Data Table */}
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-50/50 text-[11px] font-extrabold uppercase tracking-widest text-slate-500 border-b border-slate-100">
                      <tr>
                        <th className="px-6 py-4 w-12">
                          <button onClick={toggleSelectAll} className="text-slate-400 hover:text-slate-900 transition-colors">
                            <CheckSquare 
                              className={`size-[18px] ${
                                filteredArticles.length > 0 && 
                                filteredArticles.every((a) => selectedItems.includes(a.id)) 
                                  ? 'text-blue-600' 
                                  : ''
                              }`} 
                            />
                          </button>
                        </th>
                        <th className="px-4 py-4">Judul Artikel & Media</th>
                        <th className="px-4 py-4">Status</th>
                        <th className="px-4 py-4">Kategori / Penulis</th>
                        <th className="px-4 py-4">Statistik</th>
                        <th className="px-6 py-4 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredArticles.length > 0 ? (
                        filteredArticles.map((item) => {
                          const isSelected = selectedItems.includes(item.id)
                          return (
                            <tr key={item.id} className={`group transition-colors hover:bg-slate-50/80 ${isSelected ? 'bg-blue-50/30' : ''}`}>
                              <td className="px-6 py-4">
                                <button onClick={() => toggleSelect(item.id)} className="text-slate-300 hover:text-slate-900 transition-colors">
                                  <CheckSquare className={`size-[18px] ${isSelected ? 'text-blue-600' : ''}`} />
                                </button>
                              </td>
                              <td className="px-4 py-4">
                                <div className="flex items-center gap-4">
                                  <div className="grid size-12 shrink-0 place-items-center rounded-xl border border-slate-100 bg-slate-50 text-slate-400">
                                    {item.img ? <ImageIcon className="size-5" /> : <ImageOff className="size-5 opacity-50" />}
                                  </div>
                                  <div>
                                    <p className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{item.title}</p>
                                    <p className="mt-0.5 text-[11px] font-medium text-slate-400">/{item.slug}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-4">
                                <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ${
                                  item.status === 'Published' ? 'bg-emerald-100 text-emerald-700' : 
                                  item.status === 'Draft' ? 'bg-amber-100 text-amber-700' : 
                                  'bg-slate-100 text-slate-600'
                                }`}>
                                  {item.status === 'Published' && <CheckCircle2 className="size-3" />}
                                  {item.status === 'Draft' && <Clock className="size-3" />}
                                  {item.status === 'Archived' && <Folders className="size-3" />}
                                  {item.status}
                                </span>
                              </td>
                              <td className="px-4 py-4">
                                <p className="font-semibold text-slate-900">{item.cat}</p>
                                <p className="mt-0.5 text-xs text-slate-500">{item.author}</p>
                              </td>
                              <td className="px-4 py-4">
                                <p className="font-semibold text-slate-900">{item.date}</p>
                                <p className="mt-0.5 text-xs text-slate-500">{item.views} views</p>
                              </td>
                              <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                                  <button className="rounded-lg p-2 text-slate-400 hover:bg-white hover:text-blue-600 hover:shadow-sm transition-all" title="Pratinjau">
                                    <ArrowUpRight className="size-4" />
                                  </button>
                                  <button className="rounded-lg p-2 text-slate-400 hover:bg-white hover:text-amber-600 hover:shadow-sm transition-all" title="Edit Konten">
                                    <Edit3 className="size-4" />
                                  </button>
                                  <button className="rounded-lg p-2 text-slate-400 hover:bg-white hover:text-red-600 hover:shadow-sm transition-all" title="Hapus">
                                    <Trash2 className="size-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          )
                        })
                      ) : (
                        <tr>
                          <td colSpan={6} className="px-6 py-12 text-center text-slate-500 font-medium">
                            Tidak ada artikel yang cocok dengan filter atau kriteria pencarian.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                
                {/* Pagination */}
                <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-4">
                  <p className="text-xs font-semibold text-slate-500">
                    Menampilkan <span className="font-bold text-slate-900">{filteredArticles.length}</span> dari <span className="font-bold text-slate-900">{articles.length}</span> hasil
                  </p>
                  <div className="flex gap-2">
                    <button className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-600 shadow-sm hover:bg-slate-50 disabled:opacity-50" disabled>
                      Sebelumnya
                    </button>
                    <button className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-600 shadow-sm hover:bg-slate-50">
                      Selanjutnya
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* MODULE PLACEHOLDER FOR OTHER MENUS */}
          {activeMenu !== 'berita' && (
            <div className="flex h-[70vh] flex-col items-center justify-center animate-in fade-in duration-300">
              <div className="grid size-24 place-items-center rounded-full bg-slate-50 border-8 border-white shadow-sm mb-6">
                <ShieldAlert className="size-8 text-slate-300" />
              </div>
              <h3 className="text-xl font-black text-slate-900 capitalize">Modul {activeMenu.replace('-', ' ')}</h3>
              <p className="mt-2 text-sm text-slate-500 max-w-md text-center">
                Modul ini siap dikembangkan. Desain UI/UX dapat mereplikasi struktur komponen dari modul Artikel & Berita.
              </p>
            </div>
          )}

        </div>
      </main>
    </div>
  )
}