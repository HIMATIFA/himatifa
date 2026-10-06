'use client'

import { useState } from 'react'
import {
    Save,
    Globe,
    Share2,
    Sliders,
    Upload,
    ShieldCheck,
    Mail,
    Phone,
    MapPin,
    Image as ImageIcon
} from 'lucide-react'

export default function AdminPengaturanPage() {
    const [activeTab, setActiveTab] = useState<'umum' | 'branding' | 'sosial' | 'sistem'>('umum')
    const [isSaved, setIsSaved] = useState(false)

    const [generalSettings, setGeneralSettings] = useState({
        siteName: 'HIMATIFA UMSURA',
        tagline: 'Himpunan Mahasiswa Teknik Informatika',
        description: 'Website resmi Himpunan Mahasiswa S1 Teknik Informatika Universitas Muhammadiyah Surabaya.',
        email: 'himatifa@um-surabaya.ac.id',
        phone: '+62 812-3456-7890',
        address: 'Jl. Sutorejo No.59, Dukuh Sutorejo, Kec. Mulyorejo, Surabaya, Jawa Timur 60113',
    })

    const [socialSettings, setSocialSettings] = useState({
        instagram: 'https://instagram.com/himatifa.umsurabaya',
        linkedin: 'https://linkedin.com/company/himatifa-umsurabaya',
        github: 'https://github.com/himatifa-umsurabaya',
        youtube: 'https://youtube.com/@himatifaumsurabaya',
    })

    const [systemSettings, setSystemSettings] = useState({
        maintenanceMode: false,
        allowOprecRegistration: true,
        allowEventRegistration: true,
        metaKeywords: 'HIMATIFA, Teknik Informatika, UMSurabaya, IT Surabaya, Himpunan Mahasiswa',
    })

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault()
        setIsSaved(true)
        setTimeout(() => setIsSaved(false), 3000)
    }

    return (
        <div className="mx-auto max-w-7xl animate-in fade-in duration-300">
            <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
                <div>
                    <h2 className="text-2xl font-black tracking-tight text-slate-900">Pengaturan Website</h2>
                    <p className="mt-1 text-sm font-medium text-slate-500">Kelola identitas organisasi, kontak, media sosial, dan konfigurasi sistem.</p>
                </div>
                <button
                    onClick={handleSave}
                    className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-600/20 transition-all hover:bg-blue-700 hover:shadow-blue-600/30 active:scale-95"
                >
                    <Save className="size-4" />
                    {isSaved ? 'Tersimpan!' : 'Simpan Perubahan'}
                </button>
            </div>

            {isSaved && (
                <div className="mb-6 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700 animate-in slide-in-from-top-2">
                    <ShieldCheck className="size-5 shrink-0" />
                    Pengaturan berhasil diperbarui dan diterapkan ke portal publik.
                </div>
            )}

            <div className="mb-6 flex overflow-x-auto rounded-xl border border-slate-200 bg-white p-1.5 shadow-sm">
                {[
                    { id: 'umum', label: 'Profil & Kontak', icon: Globe },
                    { id: 'branding', label: 'Logo & Branding', icon: ImageIcon },
                    { id: 'sosial', label: 'Media Sosial', icon: Share2 },
                    { id: 'sistem', label: 'Sistem & SEO', icon: Sliders },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-bold transition-all ${
                            activeTab === tab.id
                                ? 'bg-slate-100 text-slate-900 shadow-sm'
                                : 'text-slate-500 hover:text-slate-900'
                        }`}
                    >
                        <tab.icon className="size-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            <form onSubmit={handleSave}>
                {activeTab === 'umum' && (
                    <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h3 className="text-base font-bold text-slate-900">Informasi Umum Organisasi</h3>

                        <div className="grid gap-6 md:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-600">Nama Website / Organisasi</label>
                                <input
                                    type="text"
                                    value={generalSettings.siteName}
                                    onChange={(e) => setGeneralSettings({ ...generalSettings, siteName: e.target.value })}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-900 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-600">Tagline Himpunan</label>
                                <input
                                    type="text"
                                    value={generalSettings.tagline}
                                    onChange={(e) => setGeneralSettings({ ...generalSettings, tagline: e.target.value })}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-900 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-600">Deskripsi Singkat</label>
                            <textarea
                                rows={3}
                                value={generalSettings.description}
                                onChange={(e) => setGeneralSettings({ ...generalSettings, description: e.target.value })}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm font-medium text-slate-900 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                            />
                        </div>

                        <hr className="border-slate-100" />
                        <h3 className="text-base font-bold text-slate-900">Informasi Kontak & Sekretariat</h3>

                        <div className="grid gap-6 md:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-600">Email Resmi</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="email"
                                        value={generalSettings.email}
                                        onChange={(e) => setGeneralSettings({ ...generalSettings, email: e.target.value })}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-11 pr-4 text-sm font-medium text-slate-900 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-600">Nomor Telepon / WhatsApp Hubin</label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="text"
                                        value={generalSettings.phone}
                                        onChange={(e) => setGeneralSettings({ ...generalSettings, phone: e.target.value })}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-11 pr-4 text-sm font-medium text-slate-900 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-600">Alamat Sekretariat</label>
                            <div className="relative">
                                <MapPin className="absolute left-4 top-3 size-4 text-slate-400" />
                                <textarea
                                    rows={2}
                                    value={generalSettings.address}
                                    onChange={(e) => setGeneralSettings({ ...generalSettings, address: e.target.value })}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-11 pr-4 text-sm font-medium text-slate-900 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'branding' && (
                    <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div>
                            <h3 className="text-base font-bold text-slate-900">Identitas Visual & Aset Media</h3>
                            <p className="text-xs text-slate-500">Unggah logo dan ikon resmi HIMATIFA untuk kebutuhan tampilan portal.</p>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="rounded-xl border border-dashed border-slate-300 p-6 text-center">
                                <div className="mx-auto mb-3 grid size-16 place-items-center rounded-2xl bg-blue-50 text-blue-600">
                                    <ImageIcon className="size-8" />
                                </div>
                                <p className="text-sm font-bold text-slate-900">Logo Utama HIMATIFA</p>
                                <p className="mt-1 text-xs text-slate-500">Format PNG transparan. Maksimal 2MB.</p>
                                <button type="button" className="mt-4 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50">
                                    <Upload className="size-3.5" /> Pilih File Logo
                                </button>
                            </div>

                            <div className="rounded-xl border border-dashed border-slate-300 p-6 text-center">
                                <div className="mx-auto mb-3 grid size-16 place-items-center rounded-2xl bg-slate-100 text-slate-600">
                                    <Globe className="size-8" />
                                </div>
                                <p className="text-sm font-bold text-slate-900">Ikon Tab Browser (Favicon)</p>
                                <p className="mt-1 text-xs text-slate-500">Format ICO atau PNG rasio 1:1 (32x32px).</p>
                                <button type="button" className="mt-4 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50">
                                    <Upload className="size-3.5" /> Pilih Favicon
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'sosial' && (
                    <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div>
                            <h3 className="text-base font-bold text-slate-900">Tautan Media Sosial</h3>
                            <p className="text-xs text-slate-500">Tautan ini akan ditampilkan di bagian footer dan halaman kontak portal.</p>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-600">Instagram</label>
                                <div className="relative">
                                    <svg className="absolute left-4 top-1/2 size-4 -translate-y-1/2 fill-none stroke-pink-600 stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                                        <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                                        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                                    </svg>
                                    <input
                                        type="url"
                                        value={socialSettings.instagram}
                                        onChange={(e) => setSocialSettings({ ...socialSettings, instagram: e.target.value })}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-11 pr-4 text-sm font-medium text-slate-900 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-600">LinkedIn</label>
                                <div className="relative">
                                    <svg className="absolute left-4 top-1/2 size-4 -translate-y-1/2 fill-blue-600" viewBox="0 0 24 24">
                                        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                                    </svg>
                                    <input
                                        type="url"
                                        value={socialSettings.linkedin}
                                        onChange={(e) => setSocialSettings({ ...socialSettings, linkedin: e.target.value })}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-11 pr-4 text-sm font-medium text-slate-900 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-600">GitHub</label>
                                <div className="relative">
                                    <svg className="absolute left-4 top-1/2 size-4 -translate-y-1/2 fill-slate-800" viewBox="0 0 24 24">
                                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                                    </svg>
                                    <input
                                        type="url"
                                        value={socialSettings.github}
                                        onChange={(e) => setSocialSettings({ ...socialSettings, github: e.target.value })}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-11 pr-4 text-sm font-medium text-slate-900 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-600">YouTube</label>
                                <div className="relative">
                                    <svg className="absolute left-4 top-1/2 size-4 -translate-y-1/2 fill-red-600" viewBox="0 0 24 24">
                                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                                    </svg>
                                    <input
                                        type="url"
                                        value={socialSettings.youtube}
                                        onChange={(e) => setSocialSettings({ ...socialSettings, youtube: e.target.value })}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-11 pr-4 text-sm font-medium text-slate-900 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'sistem' && (
                    <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h3 className="text-base font-bold text-slate-900">Aksesibilitas & Fitur Website</h3>

                        <div className="space-y-4 divide-y divide-slate-100">
                            <div className="flex items-center justify-between pt-2">
                                <div>
                                    <p className="text-sm font-bold text-slate-900">Mode Pemeliharaan (Maintenance Mode)</p>
                                    <p className="text-xs text-slate-500">Nonaktifkan akses publik sementara waktu untuk perbaikan sistem.</p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={systemSettings.maintenanceMode}
                                    onChange={(e) => setSystemSettings({ ...systemSettings, maintenanceMode: e.target.checked })}
                                    className="size-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                />
                            </div>

                            <div className="flex items-center justify-between pt-4">
                                <div>
                                    <p className="text-sm font-bold text-slate-900">Buka Pendaftaran Open Recruitment</p>
                                    <p className="text-xs text-slate-500">Tampilkan formulir pendaftaran calon pengurus baru di portal.</p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={systemSettings.allowOprecRegistration}
                                    onChange={(e) => setSystemSettings({ ...systemSettings, allowOprecRegistration: e.target.checked })}
                                    className="size-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        <hr className="border-slate-100" />
                        <h3 className="text-base font-bold text-slate-900">Mesin Pencari (SEO)</h3>

                        <div>
                            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-600">Kata Kunci Utama (Meta Keywords)</label>
                            <input
                                type="text"
                                value={systemSettings.metaKeywords}
                                onChange={(e) => setSystemSettings({ ...systemSettings, metaKeywords: e.target.value })}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-900 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                            />
                        </div>
                    </div>
                )}
            </form>
        </div>
    )
}