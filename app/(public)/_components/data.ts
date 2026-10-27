import { Variants } from 'framer-motion'
import { FaInstagram, FaGithub, FaYoutube } from 'react-icons/fa6'

export type DepartmentKey = 'PSDM' | 'Deplu' | 'Kepsos' | 'Ekraf' | 'Medkominfo'

export interface DepartmentDetail {
    label: string
    desc: string
    programs: string[]
}

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

export const navLinks = [
    { name: 'Beranda', path: '/' },
    { name: 'Profil', path: '/about' },
    { name: 'Berita', path: '/news' },
    { name: 'Agenda', path: '/events' },
    { name: 'Kontak', path: '/contact' },
]

export const newsData = [
    {
        id: 1,
        title: "Orientasi Studi & Cinta Almamater (OSCAR) 2026",
        date: "19 - 20 September 2026",
        category: "Organisasi",
        summary: "Fakultas Teknik menyelenggarakan kegiatan OSCAR (Orientasi Studi Cinta Akademik dan Almamater) Fakultas Teknik 2026 sebagai rangkaian kegiatan pengenalan bagi mahasiswa.",
        link: "https://www.kompasiana.com/himatifaumsurabaya/6ab2271434777c6eb9130687/orientasi-studi-cinta-almamater-oscar-2026#goog_rewarded",
        image: "https://assets-a2.kompasiana.com/items/album/2026/09/22/whatsapp-image-2026-09-22-at-13-48-58-6ab225e034777c689b74ed35.jpeg?t=o&v=770"
    },
    {
        id: 2,
        title: "Sokong visi Literasi Digital, S1 Informatika UMSURA Gelar AI Ambasador Workshop Di SpInS Interactional School",
        date: "13 Juli 2026",
        category: "Kegiatan",
        summary: "Kolaborasi apik di sektor pendidikan digital kembali ditunjukkan oleh akademisi muda kota Pahlawan. Mahasiswa Program Studi (Prodi) S1 Informatika Universitas Muhammadiyah Surabaya (UMSURA) sukses menyelenggarakan kegiatan pengabdian masyarakat berupa \"AI Ambassador Workshop\" yang bertempat di SpInS Interactional School Surabaya yang diadakan pada tanggal 13 Juli 2026.",
        link: "https://www.kompasiana.com/himatifaumsurabaya/6a577a9cc925c442882752e2/sokong-visi-literasi-digital-s1-informatika-umsura-gelar-ai-ambasador-workshop-di-spins-interactional-school#goog_rewarded",
        image: "https://assets-a2.kompasiana.com/items/album/2026/07/15/whatsapp-image-2026-07-14-at-19-54-41-6a577a32ed64157f6144eea2.jpeg?t=o&v=770"
    },
    {
        id: 3,
        title: "Program Studi Informatika UMSURA Sukses Selenggarakan Seminar Etika Profesi Bersama Alumni Yang Bekerja Di Pemkot Surabaya",
        date: "24 Juni 2026",
        category: "Prestasi",
        summary: "Menghadapi dinamika dunia kerja profesional yang semakin kompleks, Program Studi Informatika Universitas Muhammadiyah Surabaya (Umsura) sukses menyelenggarakan acara \"Seminar Etika Profesi dan Profesionalisme dalam Dunia Informatika\".",
        link: "https://www.kompasiana.com/himatifaumsurabaya/6a3ca800c925c473a8367832/program-studi-informatika-umsura-sukses-selenggarakan-seminar-etika-profesi-bersama-alumni-yang-bekerja-di-pemkot-surabaya#goog_rewarded",
        image: "https://assets-a2.kompasiana.com/items/album/2026/06/25/gemini-generated-image-9x3znf9x3znf9x3z-6a3ca37bed64154f96160e82.png?t=o&v=770"
    }
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

export const agenda = [
    { date: '21', month: 'SEP', title: 'OSCAR 2026', desc: 'Opening Student Collaboration & Achievement Recognition', place: 'Auditorium UMSurabaya' },
    { date: '04', month: 'OKT', title: 'Study Club GitHub', desc: 'Level up your workflow, one commit at a time.', place: 'Lab Informatika 2' },
    { date: '18', month: 'OKT', title: 'HIMATIFA Care', desc: 'Berbagi langkah kecil, memberi dampak yang besar.', place: 'Kampung Nelayan Kenjeran' },
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
