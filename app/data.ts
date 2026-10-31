import { Variants } from 'framer-motion'
import { FaInstagram, FaGithub, FaYoutube } from 'react-icons/fa6'

export type UserRole = 'admin' | 'sekum' | 'bendum' | 'ekraf'

export interface UserProfile {
    name: string
    role: UserRole
    roleLabel: string
    avatar: string
}

export type TransactionType = 'income' | 'expense'
export type TransactionCategory = 'Kas' | 'Danus' | 'Proker' | 'Operasional'

export interface Transaction {
    id: string
    date: string
    description: string
    type: TransactionType
    category: TransactionCategory
    amount: number
}

export const initialTransactions: Transaction[] = [
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

export type LpjStatus = 'Menunggu Verifikasi' | 'Disetujui' | 'Revisi' | 'Ditolak'

export interface LpjItem {
    id: string
    title: string
    division: string
    submittedDate: string
    budgetPlanned: number
    budgetUsed: number
    status: LpjStatus
    documentUrl?: string
    notes?: string
}

export const initialLpjData: LpjItem[] = [
    {
        id: 'LPJ-2026-001',
        title: 'LPJ Makrab MIDNIGHT 2025',
        division: 'Departemen PSDM',
        submittedDate: '18 Mei 2026',
        budgetPlanned: 4500000,
        budgetUsed: 4320000,
        status: 'Disetujui',
        notes: 'Sisa dana kas telah dikembalikan ke Bendahara sebesar Rp 180.000.'
    },
    {
        id: 'LPJ-2026-002',
        title: 'Pengajuan Anggaran Workshop AI Ambassador',
        division: 'Departemen Luar Negeri',
        submittedDate: '02 Juli 2026',
        budgetPlanned: 2800000,
        budgetUsed: 2750000,
        status: 'Disetujui',
        notes: 'Nota dan kuitansi konsumsi terlampir lengkap.'
    },
    {
        id: 'LPJ-2026-003',
        title: 'LPJ Seminar Etika Profesi Informatika',
        division: 'Departemen PSDM',
        submittedDate: '28 Juni 2026',
        budgetPlanned: 3500000,
        budgetUsed: 3500000,
        status: 'Menunggu Verifikasi',
        notes: 'Menunggu pengecekan kelengkapan stempel kuitansi tempat.'
    },
    {
        id: 'LPJ-2026-004',
        title: 'Proposal & Anggaran Pembelian Inventaris Sekre',
        division: 'Internal / Sekum',
        submittedDate: '10 September 2026',
        budgetPlanned: 1200000,
        budgetUsed: 0,
        status: 'Revisi',
        notes: 'Mohon cantumkan minimal 2 pembanding harga toko ATK.'
    }
]

export type SuratCategory = 'Proposal' | 'LPJ' | 'Surat Keluar' | 'Surat Masuk' | 'SK'
export type SuratStatus = 'Terverifikasi' | 'Menunggu' | 'Ditolak'

export interface ArchiveDocument {
    id: string
    title: string
    category: SuratCategory
    uploader: string
    date: string
    size: string
    status: SuratStatus
}

export const initialArchiveDocuments: ArchiveDocument[] = [
    { id: 'DOC-001', title: 'Proposal VIBRANUM 2026', category: 'Proposal', uploader: 'Arya Putra', date: '12 Okt 2026', size: '2.4 MB', status: 'Terverifikasi' },
    { id: 'DOC-002', title: 'LPJ Seminar Nasional AI', category: 'LPJ', uploader: 'Divisi Keilmuan', date: '05 Okt 2026', size: '4.1 MB', status: 'Terverifikasi' },
    { id: 'DOC-003', title: '112/B/HIMA/IX/2026 - Undangan BEM', category: 'Surat Keluar', uploader: 'Sekretaris', date: '24 Sep 2026', size: '850 KB', status: 'Terverifikasi' },
    { id: 'DOC-004', title: '012/SK/HIMA/VIII/2026 - Susunan BPH', category: 'SK', uploader: 'Ketua Umum', date: '15 Ags 2026', size: '1.2 MB', status: 'Terverifikasi' },
    { id: 'DOC-005', title: 'Surat Peminjaman Gedung Teater', category: 'Surat Masuk', uploader: 'Sekretaris', date: '10 Ags 2026', size: '500 KB', status: 'Menunggu' },
]

export type NotulensiCategory = 'Rapat Pleno' | 'Rapat BPH' | 'Rapat Evaluasi' | 'Rapat Koordinasi'

export interface NotulensiItem {
    id: string
    title: string
    category: NotulensiCategory
    date: string
    leader: string
    attendeesCount: number
    summary: string
    fileSize?: string
}

export const initialNotulensiData: NotulensiItem[] = [
    {
        id: 'NOT-001',
        title: 'Rapat Pleno Awal Semester Ganjil 2026/2027',
        category: 'Rapat Pleno',
        date: '18 Sep 2026',
        leader: 'Muhammad Arya (Ketum)',
        attendeesCount: 34,
        summary: 'Pembahasan timeline proker utama semester ganjil, penyelarasan kalender akademik, dan pengesahan RAB awal tiap departemen.',
        fileSize: '1.2 MB'
    },
    {
        id: 'NOT-002',
        title: 'Rapat BPH Mingguan #4 - Evaluasi Ekraf',
        category: 'Rapat BPH',
        date: '22 Sep 2026',
        leader: 'Siti Nurhaliza (Sekum)',
        attendeesCount: 12,
        summary: 'Evaluasi penjualan merchandise Lanyard, pencatatan kas masuk, dan alokasi modal awal untuk pembuatan PDH 2026.',
        fileSize: '850 KB'
    },
    {
        id: 'NOT-003',
        title: 'Rapat Koordinasi Panitia VIBRANUM 2026',
        category: 'Rapat Koordinasi',
        date: '01 Okt 2026',
        leader: 'Rizky Febrian (Ketua Panitia)',
        attendeesCount: 25,
        summary: 'Finalisasi konsep venue, penetapan skema sponsorship mitra kerja sama, dan penentuan timeline pendaftaran peserta.',
        fileSize: '2.1 MB'
    },
    {
        id: 'NOT-004',
        title: 'Rapat Evaluasi Tengah Periode Kepengurusan',
        category: 'Rapat Evaluasi',
        date: '15 Okt 2026',
        leader: 'Muhammad Arya (Ketum)',
        attendeesCount: 40,
        summary: 'Review kinerjabebas tiap departemen, pembahasan kendala presensi rapat pengurus, serta penetapan rekomendasi perbaikan.',
        fileSize: '1.8 MB'
    }
]

export type AttendanceSessionStatus = 'Selesai' | 'Berlangsung'

export interface AttendanceRecord {
    id: string
    eventName: string
    date: string
    totalMembers: number
    presentCount: number
    permissionCount: number
    sickCount: number
    absentCount: number
    status: AttendanceSessionStatus
}

export const initialAttendanceData: AttendanceRecord[] = [
    {
        id: 'PRES-001',
        eventName: 'Rapat Pleno Awal Semester Ganjil 2026/2027',
        date: '18 Sep 2026',
        totalMembers: 40,
        presentCount: 34,
        permissionCount: 4,
        sickCount: 2,
        absentCount: 0,
        status: 'Selesai'
    },
    {
        id: 'PRES-002',
        eventName: 'Rapat BPH Mingguan #4',
        date: '22 Sep 2026',
        totalMembers: 15,
        presentCount: 12,
        permissionCount: 2,
        sickCount: 0,
        absentCount: 1,
        status: 'Selesai'
    },
    {
        id: 'PRES-003',
        eventName: 'Rapat Koordinasi Panitia VIBRANUM 2026',
        date: '01 Okt 2026',
        totalMembers: 30,
        presentCount: 25,
        permissionCount: 3,
        sickCount: 1,
        absentCount: 1,
        status: 'Selesai'
    },
    {
        id: 'PRES-004',
        eventName: 'Rapat Pleno Evaluasi Tengah Periode',
        date: '28 Okt 2026',
        totalMembers: 40,
        presentCount: 28,
        permissionCount: 5,
        sickCount: 2,
        absentCount: 5,
        status: 'Berlangsung'
    }
]

export interface IdentityItem {
    label: string
    value: string
    iconType: 'building' | 'award' | 'graduation' | 'calendar' | 'shield'
}

export interface MissionItem {
    number: string
    category: string
    title: string
    desc: string
    iconType: 'shield' | 'graduation' | 'handshake' | 'wallet' | 'globe' | 'megaphone' | 'lightbulb'
}

export interface FilosofiLogoItem {
    image: string
    title: string
    badge: string
    description: string
}

export const identitiesData: IdentityItem[] = [
    { label: "Nama Resmi", value: "Himpunan Mahasiswa Informatika", iconType: "building" },
    { label: "Nama Singkat", value: "HIMATIFA", iconType: "award" },
    { label: "Institusi", value: "Universitas Muhammadiyah Surabaya", iconType: "building" },
    { label: "Program Studi", value: "S1 Informatika", iconType: "graduation" },
    { label: "Tanggal Berdiri", value: "10 Oktober 2020", iconType: "calendar" },
    { label: "Periode Kepengurusan", value: "2026 / 2027", iconType: "shield" },
]

export const missionsData: MissionItem[] = [
    {
        number: "01",
        category: "Tata Kelola Internal",
        title: "Fondasi Organisasi Kokoh",
        desc: "Memperkuat soliditas dan manajemen internal organisasi sebagai fondasi keberlanjutan roda kepengurusan HIMATIFA.",
        iconType: "shield",
    },
    {
        number: "02",
        category: "Kapasitas Mahasiswa",
        title: "Pengembangan Kompetensi",
        desc: "Meningkatkan kemampuan teknikal dan soft skills mahasiswa Informatika melalui program pelatihan, bootcamp, dan study club terstruktur.",
        iconType: "graduation",
    },
    {
        number: "03",
        category: "Kemitraan Akademik",
        title: "Sinergi Dosen & Kampus",
        desc: "Membangun komunikasi konstruktif dengan jajaran dosen dan program studi sebagai mitra strategis dalam pengembangan akademik.",
        iconType: "handshake",
    },
    {
        number: "04",
        category: "Kemandirian Finansial",
        title: "Pengelolaan Produktif",
        desc: "Mengelola keuangan secara mandiri, transparan, dan produktif melalui divisi ekonomi kreatif untuk menopang agenda kerja.",
        iconType: "wallet",
    },
    {
        number: "05",
        category: "Jejaring Eksternal",
        title: "Relasi & Kolaborasi Industri",
        desc: "Memperluas kemitraan strategis dengan organisasi kemahasiswaan lain, komunitas teknologi, dan mitra industri profesional.",
        iconType: "globe",
    },
    {
        number: "06",
        category: "Komunikasi Publik",
        title: "Penguatan Citra & Branding",
        desc: "Membangun citra positif HIMATIFA sebagai wadah mahasiswa yang progresif, relevan, dan terpercaya di ranah digital.",
        iconType: "megaphone",
    },
    {
        number: "07",
        category: "Pemberdayaan Mahasiswa",
        title: "Inkubasi Aspirasi & Karya",
        desc: "Menjadikan himpunan sebagai rumah yang responsif terhadap aspirasi, kreativitas, inovasi, serta peluang bagi seluruh anggota.",
        iconType: "lightbulb",
    },
]

export const filosofiLogoData: FilosofiLogoItem[] = [
    {
        image: "/logo_1.png",
        title: "Microchip Processor",
        badge: "Pola Pikir & Inovasi",
        description: "Melambangkan pola pikir dan gerak mahasiswa Informatika yang selalu berada di garda terdepan dalam inovasi, adaptasi teknologi, dan pemecahan masalah secara logis."
    },
    {
        image: "/logo_2.png",
        title: "Lingkaran & Dua Garis",
        badge: "Fondasi & Integritas",
        description: "Lingkaran luar bermakna awal kelahiran himpunan yang bersih dan tulus. Lingkaran dalam melambangkan ranah Informatika, diapit dua garis yang mencerminkan keteguhan memegang dua kalimat syahadat."
    },
    {
        image: "/logo_3.png",
        title: "10 Cabang Sirkuit",
        badge: "Sejarah & Keberagaman",
        description: "Sepuluh cabang merepresentasikan tanggal berdirinya HIMATIFA pada 10 Oktober 2020, sekaligus mengilustrasikan keberagaman latar belakang mahasiswa yang terintegrasi dalam satu harmoni gerak."
    },
    {
        image: "/logo_4.png",
        title: "Tipografi Melingkar",
        badge: "Solidaritas Bersatu",
        description: "Tulisan yang melingkar secara utuh menggambarkan komitmen seluruh fungsionaris dan anggota untuk senantiasa bergandengan tangan, saling mendukung, dan kuat menghadapi dinamika zaman."
    },
    {
        image: "/logo_5.png",
        title: "Matahari Muhammadiyah",
        badge: "Identitas & Nilai Luhur",
        description: "Terletak di poros tengah lambang, menegaskan bahwa HIMATIFA tumbuh dan bernaung di bawah naungan Universitas Muhammadiyah Surabaya dengan membawa misi pencerahan dan kemaslahatan."
    }
]

export const inquiryCategories: string[] = [
    'Kerja Sama / Sponsor',
    'Undangan Kegiatan / Delegasi',
    'Kunjungan Industri / Media',
    'Pertanyaan Akademik / Umum'
]

export interface EventItem {
    id: number
    title: string
    date: string
    month: string
    year: string
    time: string
    location: string
    category: 'Akademik' | 'Sosial' | 'Kreatif' | 'Organisasi'
    status: 'Pendaftaran Dibuka' | 'Segera Hadir' | 'Selesai'
    capacity?: string
    speaker?: string
    desc: string
}

export const eventsData: EventItem[] = [
    {
        id: 1,
        title: 'Orientasi Studi & Cinta Almamater (OSCAR) 2026',
        date: '19',
        month: 'SEP',
        year: '2026',
        time: '07:00 - 16:00 WIB',
        location: 'Gedung F & Hall UMSURA',
        category: 'Organisasi',
        status: 'Pendaftaran Dibuka',
        capacity: 'Seluruh Maba FT',
        speaker: 'Panitia OSCAR FT UMSURA',
        desc: 'Rangkaian acara orientasi akademik dan pengenalan lingkungan kampus bagi mahasiswa baru Fakultas Teknik.'
    },
    {
        id: 2,
        title: 'AI Ambassador Workshop: S1 Informatika UMSURA',
        date: '13',
        month: 'JUL',
        year: '2026',
        time: '08:00 - 12:00 WIB',
        location: 'SpInS Interactional School, Surabaya',
        category: 'Akademik',
        status: 'Selesai',
        capacity: '100 Peserta',
        speaker: 'Tim Research Informatika UMSURA',
        desc: 'Workshop edukasi literasi digital dan pengenalan kecerdasan buatan bagi siswa-siswi sekolah menengah.'
    },
    {
        id: 3,
        title: 'Seminar Etika Profesi & Dunia Kerja Informatika',
        date: '24',
        month: 'JUN',
        year: '2026',
        time: '09:00 - 12:30 WIB',
        location: 'Auditorium At-Tawhid Lnt. 13 UMSURA',
        category: 'Akademik',
        status: 'Selesai',
        capacity: '150 Peserta',
        speaker: 'Alumni S1 Informatika & Pemkot Surabaya',
        desc: 'Diskusi interaktif mengenai etika profesi, ekspektasi industri IT, dan kesiapan berkarier di pemerintahan maupun swasta.'
    },
    {
        id: 4,
        title: 'Kuliah Tamu Telkomsat Collaboration 2026',
        date: '06',
        month: 'JUN',
        year: '2026',
        time: '08:30 - 11:30 WIB',
        location: 'Ruang Seminar FT UMSURA Lnt. 3',
        category: 'Akademik',
        status: 'Selesai',
        capacity: '120 Peserta',
        speaker: 'Tim Ahli Telkom Satellite',
        desc: 'Eksplorasi wawasan teknologi telekomunikasi satelit dan peluang karier bagi mahasiswa komputasi.'
    },
    {
        id: 5,
        title: 'Informatics Skill Upgrade: Next.js & Tailwind CSS',
        date: '15',
        month: 'NOV',
        year: '2026',
        time: '09:00 - 15:00 WIB',
        location: 'Lab Komputer Lnt. 4 UMSURA',
        category: 'Kreatif',
        status: 'Pendaftaran Dibuka',
        capacity: '40 Peserta',
        speaker: 'Departemen RnD HIMATIFA',
        desc: 'Bootcamp intensif pemrograman web modern dengan Next.js App Router dan Tailwind CSS untuk pemula.'
    }
]

export type OrderStatus = 'Diproses' | 'Selesai' | 'Batal'

export interface EkrafProduct {
    id: string
    sku: string
    name: string
    category: string
    stock: number
    price: number
    salesCount: number
}

export interface EkrafOrder {
    id: string
    customerName: string
    productName: string
    qty: number
    totalPrice: number
    date: string
    status: OrderStatus
}

export const ekrafCategories: string[] = ['Semua', 'Merchandise', 'Pakaian', 'Aksesoris', 'Tas']

export const initialEkrafProducts: EkrafProduct[] = [
    { id: 'p-1', sku: 'EKR-001', name: 'Lanyard HIMATIFA Eksklusif', category: 'Merchandise', stock: 45, price: 35000, salesCount: 112 },
    { id: 'p-2', sku: 'EKR-002', name: 'PDH Resmi HIMATIFA 2026', category: 'Pakaian', stock: 8, price: 165000, salesCount: 88 },
    { id: 'p-3', sku: 'EKR-003', name: 'Gantungan Kunci Acrylic Logo', category: 'Merchandise', stock: 80, price: 12000, salesCount: 150 },
    { id: 'p-4', sku: 'EKR-004', name: 'Sticker Pack Informatika (5 Pcs)', category: 'Aksesoris', stock: 120, price: 15000, salesCount: 210 },
    { id: 'p-5', sku: 'EKR-005', name: 'Tote Bag Kanvas Premium HIMATIFA', category: 'Tas', stock: 0, price: 55000, salesCount: 40 }
]

export const initialEkrafOrders: EkrafOrder[] = [
    { id: 'ORD-1001', customerName: 'Rizky Febrian', productName: 'Lanyard HIMATIFA Eksklusif', qty: 2, totalPrice: 70000, date: '25 Sep 2026', status: 'Diproses' },
    { id: 'ORD-1002', customerName: 'Siti Nurhaliza', productName: 'PDH Resmi HIMATIFA 2026', qty: 1, totalPrice: 165000, date: '24 Sep 2026', status: 'Selesai' },
    { id: 'ORD-1003', customerName: 'Ahmad Dahlan', productName: 'Sticker Pack Informatika (5 Pcs)', qty: 3, totalPrice: 45000, date: '24 Sep 2026', status: 'Selesai' },
    { id: 'ORD-1004', customerName: 'Budi Santoso', productName: 'Tote Bag Kanvas Premium HIMATIFA', qty: 1, totalPrice: 55000, date: '22 Sep 2026', status: 'Batal' }
]

export type DepartmentKey = 'PSDM' | 'Deplu' | 'Kepsos' | 'Ekraf' | 'Medkominfo'

export interface DepartmentDetail {
    label: string
    desc: string
    programs: string[]
}

export interface AgendaItem {
    id: number
    title: string
    desc: string
    division: string
    date: string
    month: string
    time: string
    location: string
    place?: string
    status: 'Akan Datang' | 'Selesai' | 'Berlangsung' | 'Draft'
    type: 'Event' | 'Rapat' | 'Workshop'
}

export interface NewsItem {
    id: number
    title: string
    date: string
    category: string
    summary: string
    link?: string
    image?: string
    slug: string
    author: string
    status: 'Published' | 'Draft' | 'Archived'
    views: string
}

export interface PengurusItem {
    id: number
    name: string
    nim: string
    role: string
    division: string
    period: string
    status: 'Aktif' | 'Demisioner' | 'Cuti'
    image?: string
    img?: boolean
}

export interface CategoryItem {
    id: number
    name: string
    slug: string
    type: 'Berita' | 'Agenda' | 'Umum'
    itemCount: number
    description: string
    color: string
}

export interface MediaItem {
    id: number
    name: string
    type: 'Gambar' | 'Dokumen' | 'Video'
    size: string
    date: string
    url?: string
}

export interface DashboardStat {
    title: string
    value: string
    trend: string
    isPositive: boolean
    subtext: string
}

export interface ActivityItem {
    id: number
    user: string
    role: string
    action: string
    target: string
    time: string
    avatar: string
}

export interface DiscussionItem {
    id: number
    author: string
    targetTitle: string
    content: string
    time: string
}

export interface AcademicLink {
    label: string
    href: string
    isDownload?: boolean
    isCheck?: boolean
}

export interface AcademicContact {
    name: string
    role: string
}

export interface AcademicServiceItem {
    id: number
    title: string
    description: string
    iconType: 'calendar' | 'briefcase' | 'graduation' | 'fileText'
    iconBg: string
    isHighlight?: boolean
    links: AcademicLink[]
    contacts?: AcademicContact[]
}

export const academicServices: AcademicServiceItem[] = [
    {
        id: 1,
        title: 'KRS & Perkuliahan',
        description: 'Informasi jadwal kuliah, panduan pengisian Kartu Rencana Studi (KRS), dan kalender akademik semester berjalan.',
        iconType: 'calendar',
        iconBg: 'bg-blue-50 text-blue-600 border border-blue-100',
        isHighlight: false,
        links: [
            { label: 'Kalender Akademik 2026/2027', href: '#', isDownload: true },
            { label: 'SOP Pengisian KRS Online', href: '#', isDownload: false }
        ]
    },
    {
        id: 2,
        title: 'Kerja Praktik & Magang',
        description: 'Panduan pelaksanaan magang, syarat penyusunan laporan, dan kebijakan konversi SKS untuk kegiatan magang mandiri saat libur semester.',
        iconType: 'briefcase',
        iconBg: 'bg-blue-600 text-white shadow-xs',
        isHighlight: true,
        links: [
            { label: 'Panduan Konversi Magang Mandiri', href: '#', isCheck: true },
            { label: 'Form Pengajuan Kerja Praktik', href: '#', isDownload: true }
        ],
        contacts: [
            { name: 'Bu Tining', role: 'Administrasi & Persetujuan' },
            { name: 'Pak Ashr', role: 'Konversi SKS & Kurikulum' }
        ]
    },
    {
        id: 3,
        title: 'Tugas Akhir / Skripsi',
        description: 'Prosedur pendaftaran proposal, format penulisan skripsi terbaru, dan alur pendaftaran sidang pendadaran.',
        iconType: 'graduation',
        iconBg: 'bg-indigo-50 text-indigo-600 border border-indigo-100',
        isHighlight: false,
        links: [
            { label: 'Template Penulisan Proposal', href: '#', isDownload: true },
            { label: 'Alur Pendaftaran Sidang', href: '#', isDownload: false }
        ]
    },
    {
        id: 4,
        title: 'Administrasi Surat',
        description: 'Layanan pengajuan surat pengantar observasi, surat izin penelitian, dan dokumen kebutuhan akademik lainnya.',
        iconType: 'fileText',
        iconBg: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
        isHighlight: false,
        links: [
            { label: 'Form Surat Pengantar Observasi', href: '#', isDownload: false },
            { label: 'Form Surat Izin Penelitian', href: '#', isDownload: false }
        ]
    }
]

export interface AspirasiCategory {
    value: string
    label: string
}

export const aspirasiCategories: AspirasiCategory[] = [
    { value: 'akademik', label: 'Layanan Akademik & Perkuliahan' },
    { value: 'fasilitas', label: 'Fasilitas Kampus & Laboratorium' },
    { value: 'organisasi', label: 'Kegiatan Organisasi & Acara' },
    { value: 'lainnya', label: 'Topik & Masukan Lainnya' },
]

export interface ProjectItem {
    id: number
    title: string
    developer: string
    desc: string
    tags: string[]
    link: string
    repo: string
    image: string
}

export const showcaseProjects: ProjectItem[] = [
    {
        id: 1,
        title: 'Kerjakarsa',
        developer: 'Tim Gemastik XIX',
        desc: 'Platform cerdas yang menghubungkan klien dengan pekerja lepas, dilengkapi fitur escrow payment dan live location tracking.',
        tags: ['Next.js', 'Supabase', 'Tailwind'],
        link: '#',
        repo: 'https://github.com/muhammadarya-ums/kerjakarsa',
        image: '/showcase-1.jpg'
    },
    {
        id: 2,
        title: 'NusAR',
        developer: 'Divisi RnD HIMATIFA',
        desc: 'Aplikasi edukasi interaktif berbasis mobile yang mengintegrasikan animasi dan sistem pemindaian cerdas untuk materi pembelajaran.',
        tags: ['Capacitor', 'Mobile', 'Education'],
        link: '#',
        repo: 'https://github.com/muhammadarya-ums/NusAR',
        image: '/showcase-2.jpg'
    },
    {
        id: 3,
        title: 'Smart Medical IoT',
        developer: 'Study Club Hardware',
        desc: 'Purwarupa sistem pemantauan medis menggunakan mikrokontroler dengan integrasi sensor oksimetri dan tekanan presisi tinggi.',
        tags: ['ESP32', 'C++', 'I2C Sensors'],
        link: '#',
        repo: '#',
        image: '/showcase-3.jpg'
    }
]

export const navLinks = [
    { name: 'Beranda', path: '/' },
    { name: 'Profil', path: '/about' },
    { name: 'Berita', path: '/news' },
    { name: 'Agenda', path: '/events' },
    { name: 'Kontak', path: '/contact' },
]

export const departments: Record<DepartmentKey, DepartmentDetail> = {
    PSDM: {
        label: 'Pengembangan Sumber Daya Mahasiswa',
        desc: 'Membangun ekosistem belajar yang inklusif melalui pengembangan kapasitas, kompetensi, dan karakter mahasiswa Informatika.',
        programs: ['Study Club', 'Mentoring Akademik', 'Upgrading']
    },
    Deplu: {
        label: 'Luar Negeri',
        desc: 'Membuka jejaring kolaborasi strategis antara HIMATIFA, organisasi mahasiswa, dan mitra profesional di luar kampus.',
        programs: ['Company Visit', 'Collaboration', 'Networking']
    },
    Kepsos: {
        label: 'Kepedulian Sosial',
        desc: 'Menghadirkan dampak positif melalui aksi sosial dan kepedulian yang berkelanjutan bagi civitas dan masyarakat.',
        programs: ['HIMATIFA Care', 'Donasi Digital', 'Volunteer']
    },
    Ekraf: {
        label: 'Ekonomi Kreatif',
        desc: 'Mengembangkan potensi wirausaha mahasiswa melalui produk kreatif, strategi bisnis, dan ruang apresiasi karya.',
        programs: ['Ekraf Store', 'Creative Class', 'Market Day']
    },
    Medkominfo: {
        label: 'Media, Komunikasi, dan Informasi',
        desc: 'Menghidupkan cerita dan identitas HIMATIFA lewat komunikasi visual yang relevan, jujur, dan berdampak.',
        programs: ['Content Lab', 'HIMATIFA TV', 'Design Sprint']
    },
}

export const people = [
    { role: 'Ketua Himpunan', name: 'Vichras Mazcheranou Hafizh', image: '/bpi/vice.png' },
    { role: 'Wakil Ketua', name: 'Andy Bagus Oesmady', image: '/bpi/andi.png' },
    { role: 'Sekretaris', name: 'Aura Rizky Inayah Fadhilah', image: '/bpi/aura.png' },
    { role: 'Bendahara', name: 'Maulidya Dliyaun Najah', image: '/bpi/mau.png' },
]

export const misi = [
    {
        title: 'Kolaborasi Lintas Minat',
        desc: 'Menghubungkan mahasiswa lintas bidang untuk proyek, riset, dan eksplorasi teknologi bersama.',
        tag: 'Sinergi & Komunitas'
    },
    {
        title: 'Kompetensi Relevan Industri',
        desc: 'Bootcamp, study club terarah, dan mentoring profesional yang adaptif terhadap tren teknologi terkini.',
        tag: 'Technical Mastery'
    },
    {
        title: 'Dampak Nyata & Berkelanjutan',
        desc: 'Program kerja inovatif dan aksi sosial yang memberi kontribusi konkret bagi civitas dan masyarakat.',
        tag: 'Sosial & Kontribusi'
    },
]

export const stats = [
    { val: 2020, label: 'Tahun Berdiri', suffix: '', isYear: true, subtext: 'Dedikasi membangun talenta' },
    { val: 5, label: 'Departemen', suffix: '', subtext: 'Fokus pilar pergerakan' },
    { val: 15, label: 'Program Kerja', suffix: '+', subtext: 'Aktif berkelanjutan' },
    { val: 500, label: 'Mahasiswa Aktif', suffix: '+', subtext: 'Komunitas solid & suportif' },
]

export const socials = [
    { label: 'Instagram', href: 'https://instagram.com/himatifa_umsurabaya', icon: FaInstagram },
    { label: 'GitHub', href: 'https://github.com/himatifa', icon: FaGithub },
    { label: 'YouTube', href: 'https://youtube.com/@himatifa', icon: FaYoutube },
]

export const faqData = [
    {
        id: 1,
        question: "Apa itu HIMATIFA UMSURA?",
        answer: "HIMATIFA (Himpunan Mahasiswa Teknik Informatika) UMSURA adalah organisasi mahasiswa yang berfokus pada pengembangan potensi akademik, non-akademik, serta penampung aspirasi seluruh mahasiswa Teknik Informatika Universitas Muhammadiyah Surabaya.",
        hasLink: false
    },
    {
        id: 2,
        question: "Bagaimana cara bergabung menjadi pengurus HIMATIFA?",
        answer: "Pendaftaran pengurus (Open Recruitment) biasanya dibuka pada awal periode kepengurusan baru. Informasi pendaftaran, persyaratan, dan alur seleksi akan diumumkan secara resmi melalui website ini dan akun Instagram HIMATIFA.",
        hasLink: false
    },
    {
        id: 3,
        question: "Apakah mahasiswa non-pengurus bisa mengikuti kegiatan HIMATIFA?",
        answer: "Tentu saja! Sebagian besar kegiatan seperti workshop, seminar teknologi, kompetisi, dan program pengabdian masyarakat terbuka untuk seluruh mahasiswa Teknik Informatika maupun umum.",
        hasLink: false
    },
    {
        id: 4,
        question: "Bagaimana cara menyalurkan keluhan atau saran terkait akademik/fasilitas?",
        answer: "Kamu bisa menyampaikannya secara langsung melalui menu 'Aspirasi' di website ini. Kamu juga dapat memilih untuk mengirimkannya secara anonim demi kenyamanan dan kerahasiaan identitas.",
        hasLink: true
    },
    {
        id: 5,
        question: "Di mana saya bisa melihat jadwal kegiatan dan berita terbaru?",
        answer: "Seluruh update kegiatan, agenda mendatang, dan berita resmi dapat kamu akses secara berkala melalui bagian 'Kabar Terbaru' di beranda atau halaman 'News'.",
        hasLink: false
    }
]

export const agenda: AgendaItem[] = [
    {
        id: 1,
        title: 'OSCAR (Orientasi Studi & Cinta Almamater) 2026',
        desc: 'Opening Student Collaboration & Achievement Recognition',
        division: 'Divisi Event',
        date: '21 Sep 2026',
        month: 'SEP',
        time: '08:00 - Selesai',
        location: 'Auditorium UMSURA',
        place: 'Auditorium UMSURA',
        status: 'Akan Datang',
        type: 'Event'
    },
    {
        id: 2,
        title: 'Study Club GitHub & Workflow',
        desc: 'Level up your workflow, one commit at a time.',
        division: 'Divisi Keilmuan',
        date: '04 Okt 2026',
        month: 'OKT',
        time: '13:00 - 15:30',
        location: 'Lab Informatika 2',
        place: 'Lab Informatika 2',
        status: 'Akan Datang',
        type: 'Workshop'
    },
    {
        id: 3,
        title: 'HIMATIFA Care (Pengabdian Masyarakat)',
        desc: 'Berbagi langkah kecil, memberi dampak yang besar.',
        division: 'Kepedulian Sosial',
        date: '18 Okt 2026',
        month: 'OKT',
        time: '07:00 - Selesai',
        location: 'Kampung Nelayan Kenjeran',
        place: 'Kampung Nelayan Kenjeran',
        status: 'Akan Datang',
        type: 'Event'
    },
    {
        id: 4,
        title: 'Rapat Evaluasi BPH Bulanan',
        desc: 'Evaluasi program kerja dan koordinasi pengurus harian.',
        division: 'Sekretaris Umum',
        date: '08 Okt 2026',
        month: 'OKT',
        time: '19:00 - 21:00',
        location: 'Google Meet',
        place: 'Google Meet',
        status: 'Selesai',
        type: 'Rapat'
    },
    {
        id: 5,
        title: 'Makrab Mahasiswa Baru Informatika',
        desc: 'Malam keakraban untuk mempererat solidaritas angkatan.',
        division: 'Divisi Humas',
        date: '25 Nov 2026',
        month: 'NOV',
        time: 'TBA',
        location: 'Villa Trawas, Mojokerto',
        place: 'Villa Trawas, Mojokerto',
        status: 'Draft',
        type: 'Event'
    }
]

export const newsData: NewsItem[] = [
    {
        id: 1,
        title: "Orientasi Studi & Cinta Almamater (OSCAR) 2026",
        date: "19 Sep 2026",
        category: "Organisasi",
        summary: "Fakultas Teknik menyelenggarakan kegiatan OSCAR 2026 sebagai pengenalan lingkungan kampus.",
        link: "https://www.kompasiana.com/himatifaumsurabaya/6ab2271434777c6eb9130687/orientasi-studi-cinta-almamater-oscar-2026",
        image: "https://assets-a2.kompasiana.com/items/album/2026/09/22/whatsapp-image-2026-09-22-at-13-48-58-6ab225e034777c689b74ed35.jpeg",
        slug: "orientasi-studi-cinta-almamater-oscar-2026",
        author: "Divisi Kominfo",
        status: "Published",
        views: "1.2k"
    },
    {
        id: 2,
        title: "Sokong Visi Literasi Digital, S1 Informatika UMSURA Gelar AI Ambassador Workshop",
        date: "13 Jul 2026",
        category: "Kegiatan",
        summary: "Mahasiswa S1 Informatika UMSURA sukses menggelar AI Ambassador Workshop di SpInS Interactional School.",
        link: "https://www.kompasiana.com/himatifaumsurabaya/6a577a9cc925c442882752e2/sokong-visi-literasi-digital-s1-informatika-umsura-gelar-ai-ambasador-workshop-di-spins-interactional-school",
        image: "https://assets-a2.kompasiana.com/items/album/2026/07/15/whatsapp-image-2026-07-14-at-19-54-41-6a577a32ed64157f6144eea2.jpeg",
        slug: "ai-ambassador-workshop-spins",
        author: "Divisi Keilmuan",
        status: "Published",
        views: "2.8k"
    },
    {
        id: 3,
        title: "Pendelegasian Kontingen KMHE 2026 Siap Berangkat",
        date: "22 Sep 2026",
        category: "Prestasi",
        summary: "Tim Kompetisi Mobil Hemat Energi siap mengharumkan nama almamater.",
        slug: "kmhe-2026-pendelegasian",
        author: "Arya Putra",
        status: "Draft",
        views: "-"
    },
    {
        id: 4,
        title: "Open Recruitment Pengurus Baru Periode 2027",
        date: "18 Sep 2026",
        category: "Info Kampus",
        summary: "Pendaftaran pengurus dibuka secara resmi bagi mahasiswa aktif Informatika.",
        slug: "oprec-pengurus-2027",
        author: "Sekretaris Umum",
        status: "Archived",
        views: "3.4k"
    }
]

export const bphMembers: PengurusItem[] = [
    {
        id: 1,
        name: 'Vichras Mazcheranou Hafizh',
        nim: '20230140001',
        role: 'Ketua Himpunan',
        division: 'BPH Inti',
        period: '2026/2027',
        status: 'Aktif',
        image: '/bpi/vice.png',
        img: true
    },
    {
        id: 2,
        name: 'Andy Bagus Oesmady',
        nim: '20230140002',
        role: 'Wakil Ketua',
        division: 'BPH Inti',
        period: '2026/2027',
        status: 'Aktif',
        image: '/bpi/andi.png',
        img: true
    },
    {
        id: 3,
        name: 'Aura Rizky Inayah Fadhilah',
        nim: '20230140024',
        role: 'Sekretaris Umum',
        division: 'BPH Inti',
        period: '2026/2027',
        status: 'Aktif',
        image: '/bpi/aura.png',
        img: true
    },
    {
        id: 4,
        name: 'Maulidya Dliyaun Najah',
        nim: '20230140025',
        role: 'Bendahara Umum',
        division: 'BPH Inti',
        period: '2026/2027',
        status: 'Aktif',
        image: '/bpi/mau.png',
        img: true
    },
    {
        id: 5,
        name: 'Budi Santoso',
        nim: '20220140105',
        role: 'Kepala Divisi',
        division: 'Divisi Keilmuan',
        period: '2025/2026',
        status: 'Demisioner',
        img: false
    },
    {
        id: 6,
        name: 'Siti Rahma',
        nim: '20240140056',
        role: 'Staff',
        division: 'Divisi Kominfo',
        period: '2026/2027',
        status: 'Aktif',
        img: false
    },
    {
        id: 7,
        name: 'Ahmad Fauzi',
        nim: '20230140088',
        role: 'Staff',
        division: 'Divisi Event',
        period: '2026/2027',
        status: 'Cuti',
        img: false
    }
]

export const categoriesData: CategoryItem[] = [
    {
        id: 1,
        name: 'Event & Acara',
        slug: 'event-acara',
        type: 'Agenda',
        itemCount: 18,
        description: 'Kegiatan seminar, workshop, dan kompetisi himpunan.',
        color: 'bg-blue-50 text-blue-700 border-blue-200'
    },
    {
        id: 2,
        name: 'Prestasi',
        slug: 'prestasi',
        type: 'Berita',
        itemCount: 12,
        description: 'Pencapaian dan kejuaraan mahasiswa Informatika.',
        color: 'bg-amber-50 text-amber-700 border-amber-200'
    },
    {
        id: 3,
        name: 'Info Kampus',
        slug: 'info-kampus',
        type: 'Umum',
        itemCount: 25,
        description: 'Pengumuman resmi akademik dan fakultas.',
        color: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    },
    {
        id: 4,
        name: 'Rapat Internal',
        slug: 'rapat-internal',
        type: 'Agenda',
        itemCount: 9,
        description: 'Agenda konsolidasi BPH dan pengurus divisi.',
        color: 'bg-purple-50 text-purple-700 border-purple-200'
    },
    {
        id: 5,
        name: 'Pers Release',
        slug: 'press-release',
        type: 'Berita',
        itemCount: 14,
        description: 'Publikasi resmi liputan kegiatan HIMATIFA.',
        color: 'bg-rose-50 text-rose-700 border-rose-200'
    }
]

export const mediaFiles: MediaItem[] = [
    { id: 1, name: 'poster-oscar-2026.jpg', type: 'Gambar', size: '2.4 MB', date: '04 Okt 2026', url: 'https://images.unsplash.com/photo-1540317580384-e5d43616b9aa?w=500&q=80' },
    { id: 2, name: 'logo-himatifa-utama.png', type: 'Gambar', size: '450 KB', date: '01 Okt 2026', url: 'https://images.unsplash.com/photo-1614332287897-cdc485fa562d?w=500&q=80' },
    { id: 3, name: 'pedoman-organisasi-2026.pdf', type: 'Dokumen', size: '5.1 MB', date: '28 Sep 2026' },
    { id: 4, name: 'dokumentasi-makrab-maba.jpg', type: 'Gambar', size: '3.2 MB', date: '25 Sep 2026', url: 'https://images.unsplash.com/photo-1523580494112-071d192c9e1d?w=500&q=80' },
    { id: 5, name: 'teaser-pendelegasian-kmhe.mp4', type: 'Video', size: '18.5 MB', date: '20 Sep 2026' },
    { id: 6, name: 'surat-undangan-bph-inti.pdf', type: 'Dokumen', size: '800 KB', date: '15 Sep 2026' },
]

export const dashboardStats: DashboardStat[] = [
    {
        title: 'Total Artikel',
        value: '142',
        trend: '+12%',
        isPositive: true,
        subtext: 'vs bulan lalu'
    },
    {
        title: 'Total Kunjungan',
        value: '24.5K',
        trend: '+18%',
        isPositive: true,
        subtext: 'pageviews unik'
    },
    {
        title: 'Pengurus Aktif',
        value: '42',
        trend: 'BPH & Divisi',
        isPositive: true,
        subtext: 'periode 2026/2027'
    },
    {
        title: 'Menunggu Review',
        value: '12',
        trend: 'Perlu dicek',
        isPositive: false,
        subtext: 'dokumen & draft'
    }
]

export const recentActivities: ActivityItem[] = [
    {
        id: 1,
        user: 'Vichras Mazcheranou',
        role: 'Ketua Umum',
        action: 'mengunggah proposal baru',
        target: 'Proposal VIBRANUM 2026',
        time: '10 menit lalu',
        avatar: 'VM'
    },
    {
        id: 2,
        user: 'Aura Rizky',
        role: 'Sekretaris',
        action: 'menerbitkan artikel',
        target: 'Tech Talk 2026: Agentic AI',
        time: '1 jam lalu',
        avatar: 'AR'
    },
    {
        id: 3,
        user: 'Maulidya Dliyaun',
        role: 'Bendahara',
        action: 'memperbarui laporan',
        target: 'Laporan Keuangan Oktober',
        time: '3 jam lalu',
        avatar: 'MD'
    },
    {
        id: 4,
        user: 'Sistem SIM',
        role: 'Auto-Backup',
        action: 'menyelesaikan',
        target: 'Backup Database Mingguan',
        time: 'Kemarin, 23:00',
        avatar: 'SI'
    }
]

export const recentDiscussions: DiscussionItem[] = [
    {
        id: 1,
        author: 'Bima Pratama',
        targetTitle: 'Tech Talk AI 2026',
        content: 'Wah materinya sangat insightful, ditunggu event selanjutnya kak!',
        time: '20 menit lalu'
    },
    {
        id: 2,
        author: 'Rina Kartika',
        targetTitle: 'Open Recruitment Pengurus',
        content: 'Untuk formulir pendaftarannya bisa diakses di mana ya kak?',
        time: '2 jam lalu'
    }
]

export const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
}

export const heroContainer: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
}

export const revealStagger: Variants = {
    hidden: { opacity: 0, y: 30, filter: 'blur(4px)' },
    show: {
        opacity: 1, y: 0, filter: 'blur(0px)',
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
}

export const heroItem: Variants = {
    hidden: { opacity: 0, y: 32 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
}

export const reveal = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.65 } }
}