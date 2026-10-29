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
    Image as ImageIcon,
    ChevronRight,
    Check,
    Sparkles,
    AlertCircle
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

    const handleSave = (e?: React.FormEvent) => {
        if (e) e.preventDefault()
        setIsSaved(true)
        setTimeout(() => setIsSaved(false), 3000)
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-5">
                <div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 mb-1">
                        <span>SIM HIMATIFA</span>
                        <ChevronRight className="size-3 text-slate-400" />
                        <span className="text-slate-500">Konfigurasi Sistem</span>
                    </div>
                    <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                        Pengaturan Website
                    </h1>
                    <p className="mt-1 text-xs sm:text-sm text-slate-500">
                        Kelola identitas organisasi, kontak sekretariat, tautan media sosial, dan fitur sistem.
                    </p>
                </div>

                <button
                    onClick={() => handleSave()}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md shadow-blue-600/10 transition hover:bg-blue-500 active:scale-[0.98]"
                >
                    <Save className="size-4" />
                    <span>{isSaved ? 'Tersimpan!' : 'Simpan Perubahan'}</span>
                </button>
            </div>

            {isSaved && (
                <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/80 px-4 py-3 text-xs font-semibold text-emerald-800 shadow-xs">
                    <div className="grid size-6 place-items-center rounded-full bg-emerald-600 text-white shrink-0">
                        <Check className="size-3.5 stroke-[3]" />
                    </div>
                    <span>Pengaturan berhasil diperbarui dan diterapkan ke seluruh sistem portal.</span>
                </div>
            )}

            <div className="flex items-center gap-1 overflow-x-auto rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xs scrollbar-none">
                {[
                    { id: 'umum', label: 'Profil & Kontak', icon: Globe },
                    { id: 'branding', label: 'Logo & Branding', icon: ImageIcon },
                    { id: 'sosial', label: 'Media Sosial', icon: Share2 },
                    { id: 'sistem', label: 'Sistem & SEO', icon: Sliders },
                ].map((tab) => {
                    const isActive = activeTab === tab.id
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
                                isActive
                                    ? 'bg-slate-900 text-white shadow-xs'
                                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                            }`}
                        >
                            <tab.icon className="size-4" />
                            <span>{tab.label}</span>
                        </button>
                    )
                })}
            </div>

            <form onSubmit={handleSave}>
                {activeTab === 'umum' && (
                    <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs">
                        <div className="border-b border-slate-100 pb-4">
                            <h2 className="text-base font-bold text-slate-900">Informasi Umum Organisasi</h2>
                            <p className="text-xs text-slate-500">Identitas utama yang akan ditampilkan di header dan footer portal.</p>
                        </div>

                        <div className="grid gap-5 md:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-xs font-semibold text-slate-700">
                                    Nama Website / Organisasi
                                </label>
                                <input
                                    type="text"
                                    value={generalSettings.siteName}
                                    onChange={(e) => setGeneralSettings({ ...generalSettings, siteName: e.target.value })}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 px-4 text-xs font-medium text-slate-900 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/10"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-xs font-semibold text-slate-700">
                                    Tagline Himpunan
                                </label>
                                <input
                                    type="text"
                                    value={generalSettings.tagline}
                                    onChange={(e) => setGeneralSettings({ ...generalSettings, tagline: e.target.value })}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 px-4 text-xs font-medium text-slate-900 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/10"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="mb-2 block text-xs font-semibold text-slate-700">
                                Deskripsi Singkat Profil
                            </label>
                            <textarea
                                rows={3}
                                value={generalSettings.description}
                                onChange={(e) => setGeneralSettings({ ...generalSettings, description: e.target.value })}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 text-xs font-medium text-slate-900 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/10"
                            />
                        </div>

                        <div className="border-b border-slate-100 pt-2 pb-4">
                            <h2 className="text-base font-bold text-slate-900">Kontak & Sekretariat</h2>
                            <p className="text-xs text-slate-500">Informasi kontak publik untuk pertanyaan dan kerjasama.</p>
                        </div>

                        <div className="grid gap-5 md:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-xs font-semibold text-slate-700">Email Resmi</label>
                                <div className="relative">
                                    <Mail className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="email"
                                        value={generalSettings.email}
                                        onChange={(e) => setGeneralSettings({ ...generalSettings, email: e.target.value })}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 pl-10 pr-4 text-xs font-medium text-slate-900 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/10"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="mb-2 block text-xs font-semibold text-slate-700">Nomor Telepon / WhatsApp Hubin</label>
                                <div className="relative">
                                    <Phone className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="text"
                                        value={generalSettings.phone}
                                        onChange={(e) => setGeneralSettings({ ...generalSettings, phone: e.target.value })}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 pl-10 pr-4 text-xs font-medium text-slate-900 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/10"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="mb-2 block text-xs font-semibold text-slate-700">Alamat Sekretariat</label>
                            <div className="relative">
                                <MapPin className="absolute left-3.5 top-3.5 size-4 text-slate-400" />
                                <textarea
                                    rows={2}
                                    value={generalSettings.address}
                                    onChange={(e) => setGeneralSettings({ ...generalSettings, address: e.target.value })}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 pl-10 pr-4 text-xs font-medium text-slate-900 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/10"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'branding' && (
                    <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs">
                        <div className="border-b border-slate-100 pb-4">
                            <h2 className="text-base font-bold text-slate-900">Identitas Visual & Branding</h2>
                            <p className="text-xs text-slate-500">Unggah logo resmi dan favicon untuk identitas visual website.</p>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 p-6 text-center hover:bg-slate-50 transition">
                                <div className="mx-auto mb-3 grid size-14 place-items-center rounded-2xl bg-blue-50 text-blue-600 border border-blue-100">
                                    <ImageIcon className="size-7" />
                                </div>
                                <p className="text-sm font-bold text-slate-900">Logo Utama HIMATIFA</p>
                                <p className="mt-1 text-xs text-slate-500">Format PNG transparan. Ukuran maks. 2MB.</p>
                                <button
                                    type="button"
                                    className="mt-4 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 active:scale-[0.98] transition"
                                >
                                    <Upload className="size-3.5 text-slate-500" />
                                    <span>Pilih File Logo</span>
                                </button>
                            </div>

                            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 p-6 text-center hover:bg-slate-50 transition">
                                <div className="mx-auto mb-3 grid size-14 place-items-center rounded-2xl bg-slate-100 text-slate-600 border border-slate-200">
                                    <Globe className="size-7" />
                                </div>
                                <p className="text-sm font-bold text-slate-900">Favicon Browser</p>
                                <p className="mt-1 text-xs text-slate-500">Format ICO / PNG persegi 1:1 (32x32px).</p>
                                <button
                                    type="button"
                                    className="mt-4 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 active:scale-[0.98] transition"
                                >
                                    <Upload className="size-3.5 text-slate-500" />
                                    <span>Pilih Favicon</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'sosial' && (
                    <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs">
                        <div className="border-b border-slate-100 pb-4">
                            <h2 className="text-base font-bold text-slate-900">Tautan Media Sosial</h2>
                            <p className="text-xs text-slate-500">Tautan ini akan ditampilkan di bagian footer dan modul kontak portal.</p>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="mb-2 block text-xs font-semibold text-slate-700">Instagram</label>
                                <input
                                    type="url"
                                    value={socialSettings.instagram}
                                    onChange={(e) => setSocialSettings({ ...socialSettings, instagram: e.target.value })}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 px-4 text-xs font-medium text-slate-900 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/10"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-xs font-semibold text-slate-700">LinkedIn</label>
                                <input
                                    type="url"
                                    value={socialSettings.linkedin}
                                    onChange={(e) => setSocialSettings({ ...socialSettings, linkedin: e.target.value })}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 px-4 text-xs font-medium text-slate-900 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/10"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-xs font-semibold text-slate-700">GitHub Organization</label>
                                <input
                                    type="url"
                                    value={socialSettings.github}
                                    onChange={(e) => setSocialSettings({ ...socialSettings, github: e.target.value })}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 px-4 text-xs font-medium text-slate-900 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/10"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-xs font-semibold text-slate-700">YouTube Channel</label>
                                <input
                                    type="url"
                                    value={socialSettings.youtube}
                                    onChange={(e) => setSocialSettings({ ...socialSettings, youtube: e.target.value })}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 px-4 text-xs font-medium text-slate-900 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/10"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'sistem' && (
                    <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs">
                        <div className="border-b border-slate-100 pb-4">
                            <h2 className="text-base font-bold text-slate-900">Aksesibilitas & Fitur Website</h2>
                            <p className="text-xs text-slate-500">Atur ketersediaan pendaftaran dan mode pemeliharaan portal.</p>
                        </div>

                        <div className="space-y-4 divide-y divide-slate-100">
                            <div className="flex items-center justify-between pt-2">
                                <div>
                                    <p className="text-xs font-bold text-slate-900">Mode Pemeliharaan (Maintenance Mode)</p>
                                    <p className="text-[11px] text-slate-500">Nonaktifkan akses publik sementara waktu untuk pembaruan sistem.</p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={systemSettings.maintenanceMode}
                                    onChange={(e) => setSystemSettings({ ...systemSettings, maintenanceMode: e.target.checked })}
                                    className="size-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                />
                            </div>

                            <div className="flex items-center justify-between pt-4">
                                <div>
                                    <p className="text-xs font-bold text-slate-900">Buka Formulir Open Recruitment</p>
                                    <p className="text-[11px] text-slate-500">Tampilkan pendaftaran calon pengurus baru di portal utama.</p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={systemSettings.allowOprecRegistration}
                                    onChange={(e) => setSystemSettings({ ...systemSettings, allowOprecRegistration: e.target.checked })}
                                    className="size-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                />
                            </div>
                        </div>

                        <div className="border-b border-slate-100 pt-2 pb-4">
                            <h2 className="text-base font-bold text-slate-900">Optimasi Mesin Pencari (SEO)</h2>
                            <p className="text-xs text-slate-500">Kata kunci pencarian untuk membantu indeksasi Google.</p>
                        </div>

                        <div>
                            <label className="mb-2 block text-xs font-semibold text-slate-700">Kata Kunci Utama (Meta Keywords)</label>
                            <input
                                type="text"
                                value={systemSettings.metaKeywords}
                                onChange={(e) => setSystemSettings({ ...systemSettings, metaKeywords: e.target.value })}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 px-4 text-xs font-medium text-slate-900 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/10"
                            />
                        </div>
                    </div>
                )}
            </form>
        </div>
    )
}