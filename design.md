# Design System — HIMATIFA UMSURA

Dokumen ini menjadi acuan tunggal untuk seluruh antarmuka web **HIMATIFA UMSURA** (Himpunan Mahasiswa Informatika Universitas Muhammadiyah Surabaya), mencakup halaman publik, portal layanan (Akademik & Showcase), Ekraf Store, hingga dashboard internal (Kas & LPJ).

Prinsip utama: **bersih, teknis, mudah dipindai, dan konsisten**. Tanpa gradasi ungu/lavender generik, tanpa dekorasi berlebihan yang mengganggu keterbacaan, dan setiap komponen memiliki ritme ruang yang seimbang.

---

## 1. Palet Warna (Color Palette)

Menggunakan fondasi **Light Technical Canvas** dengan aksen **Cobalt Blue** dan **Cyan** yang selaras dengan identitas Informatika UMSURA, serta tinta **Deep Navy** untuk kontras tinggi (WCAG AA/AAA).

### A. Token Warna Utama (`globals.css` / `:root`)

| Token | Hex | OKLCH | Penggunaan |
| :--- | :--- | :--- | :--- |
| `--background` | `#F4F8FC` | `oklch(0.975 0.01 240)` | Kanvas utama halaman |
| `--surface` | `#FFFFFF` | `oklch(1 0 0)` | Kartu utama, modal, panel form |
| `--surface-subtle` | `#EAF1FA` | `oklch(0.945 0.018 245)` | Panel sekunder, hover row, badge netral |
| `--surface-glass` | `rgba(255, 255, 255, 0.72)` | — | Navbar sticky, floating card (`backdrop-blur-md`) |
| `--foreground` | `#0A192F` | `oklch(0.18 0.04 245)` | Heading & teks utama |
| `--muted-foreground` | `#475569` | `oklch(0.45 0.03 250)` | Deskripsi, metadata, label sekunder |
| `--primary` | `#2563EB` | `oklch(0.55 0.22 255)` | Tombol aksi utama, link aktif, aksen judul |
| `--primary-hover` | `#1D4ED8` | `oklch(0.49 0.22 255)` | State hover tombol utama |
| `--primary-foreground` | `#FFFFFF` | `oklch(1 0 0)` | Teks di atas warna `--primary` |
| `--accent-cyan` | `#0891B2` | `oklch(0.60 0.14 215)` | Aksen teknis sekunder, highlight data/kode |
| `--border` | `#DCE6F2` | `oklch(0.90 0.02 240)` | Garis batas kartu, divider, input border |

### B. Warna Kontras Gelap (Dark Band / Footer / Terminal Showcase)

| Token | Hex | Penggunaan |
| :--- | :--- | :--- |
| `--dark-bg` | `#0A192F` | Footer, section kontras tinggi, preview kode/CLI |
| `--dark-surface` | `#112240` | Kartu di atas section gelap |
| `--dark-border` | `#1E3A5F` | Garis pemisah pada mode/section gelap |
| `--dark-ink` | `#F1F5F9` | Teks utama di atas `--dark-bg` |
| `--dark-muted` | `#94A3B8` | Teks sekunder di atas `--dark-bg` |

### C. Warna Semantik (Status LPJ, Kas, Agenda & Form)

| Status | Background | Text / Icon | Border | Penggunaan |
| :--- | :--- | :--- | :--- | :--- |
| **Success** | `#ECFDF5` | `#047857` | `#A7F3D0` | LPJ Disetujui, Kas Masuk (`income`), Lunas |
| **Warning** | `#FFFBEB` | `#B45309` | `#FDE68A` | Menunggu Verifikasi, Revisi |
| **Danger** | `#FEF2F2` | `#B91C1C` | `#FECACA` | LPJ Ditolak, Kas Keluar (`expense`), Error Form |
| **Info** | `#EFF6FF` | `#1D4ED8` | `#BFDBFE` | Agenda Terjadwal, Informasi Akademik |

> **Aturan Warna:** Jangan pernah menggunakan warna ungu/violet/lavender sebagai warna aksen, background, maupun glow. Pertahankan rasio kontras teks minimal `4.5:1` untuk teks normal dan `3:1` untuk teks besar.

---

## 2. Tipografi (Font Design)

Kombinasi **Plus Jakarta Sans** untuk kejelasan editorial dan antarmuka modern, dipadukan dengan **Geist Mono** untuk angka keuangan, kode program, NIM, tanggal agenda, dan kicker teknis.

### A. Konfigurasi Font (`next/font/google`)

- **Display & UI Sans:** `Plus Jakarta Sans` — Weight: `400`, `500`, `600`, `700`, `800` (`--font-jakarta`)
- **Monospace / Technical:** `Geist Mono` — Weight: `400`, `500`, `600` (`--font-geist-mono`)

### B. Skala Tipografi (Type Scale)

| Peran | Ukuran (Desktop -> Mobile) | Weight | Line Height | Letter Spacing | Font Family |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Hero H1** | `clamp(2.5rem, 5.5vw, 4.5rem)` (`40px–72px`) | `800` | `1.05` | `-0.04em` | Sans |
| **Section H2** | `clamp(2rem, 4vw, 3.25rem)` (`32px–52px`) | `800` | `1.08` | `-0.035em` | Sans |
| **Card Title H3** | `1.25rem – 1.5rem` (`20px–24px`) | `700` | `1.25` | `-0.02em` | Sans |
| **Body Lead** | `1.125rem` (`18px`) | `400` | `1.6` | `-0.01em` | Sans |
| **Body Default** | `1rem` (`16px`) | `400` | `1.6` | `0` | Sans |
| **Kicker / Eyebrow** | `0.75rem` (`12px`) | `700` | `1.2` | `0.16em` | Mono (Uppercase) |
| **Data / Nominal / Kode** | `0.875rem – 1rem` (`14px–16px`) | `500` | `1.4` | `0` | Mono (`tabular-nums`) |

> **Catatan:** Seluruh angka nominal rupiah (Kas, LPJ, Ekraf Store) dan tanggal wajib menggunakan `font-mono tabular-nums` agar kolom tabel sejajar sempurna.

---

## 3. Tata Letak & Grid (Layout System)

Mengikuti disiplin **Equal Edges** dan **One Section Per Screen** agar halaman terasa lapang, terstruktur, dan rapi di semua ukuran layar.

### A. Container & Breakpoints

- **Max Width Container (`.wrap`):** `1280px` (`max-w-7xl`)
- **Horizontal Padding:**
  - Desktop (`>= 1024px`): `px-8` (`32px`) atau `px-12` (`48px`)
  - Tablet (`768px – 1023px`): `px-6` (`24px`)
  - Mobile (`<= 767px`): `px-4` (`16px`)
- **Target Viewport Pengujian:** `1440px`, `1024px`, `768px`, `390px`, `320px`.

### B. Sistem Grid & Ritme Section

1. **Grid Utama:** `12 kolom` dengan `gap-6` (`24px`) di desktop, `gap-4` (`16px`) di mobile.
   - Daftar Departemen / Berita / Produk Ekraf: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
   - BPI / Showcase Karya: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`
   - Split Hero / Tentang Kami: `grid-cols-1 lg:grid-cols-12` (7 kolom teks, 5 kolom visual/foto)
2. **Ritme Vertikal Section:**
   - Padding section standar: `py-20 lg:py-28` (`80px – 112px`).
   - Setiap `<section>` memiliki satu fokus utama dengan `<h2>` rata kiri (atau rata tengah khusus statement) di bagian atas.
3. **Border Radius & Elevation:**
   - Tombol & Input: `rounded-xl` (`12px`)
   - Kartu Standar: `rounded-2xl` (`16px`) dengan `border border-[#DCE6F2]`
   - Kartu Showcase / Hero Panel: `rounded-3xl` (`24px`)
   - Shadow halus: `0 12px 36px -8px rgba(10, 25, 47, 0.06)`

### C. Interaksi Mikro (Motion)

- **Kartu Tautan:** Naik `2px` (`hover:-translate-y-0.5`) dengan transisi `200ms ease-out` dan border berubah menjadi `#93C5FD`.
- **Foto/Thumbnail:** Zoom halus `scale(1.03)` di dalam frame `overflow-hidden`.
- **Tombol:** Sedikit menekan saat diklik (`active:scale-[0.98]`).
- **Aksesibilitas:** Wajib menghormati `@media (prefers-reduced-motion: reduce)` dan menyediakan focus ring `outline: 2px solid #2563EB; outline-offset: 2px`.

---

## 4. Dekorasi & Corak (Decor & Patterns)

Corak untuk web HIMATIFA harus mencerminkan dunia **rekayasa perangkat lunak & informatika** tanpa terlihat ramai. Gunakan corak sebagai latar belakang halus dengan opasitas rendah (`3%–8%`).

### A. Corak 1: Blueprint Dot Matrix (Untuk Hero & Latar Belakang Section)

Memberikan kesan presisi teknis seperti kanvas arsitektur sistem.

```css
.bg-pattern-dots {
  background-color: #f4f8fc;
  background-image: radial-gradient(#94a3b8 1px, transparent 1px);
  background-size: 24px 24px;
}
```

### B. Corak 2: Technical Grid Lines (Untuk Portal Akademik & Showcase)

Cocok untuk bagian yang menampilkan karya mahasiswa, modul kuliah, atau struktur organisasi.

```css
.bg-pattern-grid {
  background-size: 40px 40px;
  background-image:
    linear-gradient(to right, rgba(37, 99, 235, 0.05) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(37, 99, 235, 0.05) 1px, transparent 1px);
}
```

### C. Corak 3: Diagonal Code Stripes (Untuk Banner Ekraf Store / Highlight Card)

```css
.bg-pattern-stripes {
  background-image: repeating-linear-gradient(
    -45deg,
    rgba(37, 99, 235, 0.03),
    rgba(37, 99, 235, 0.03) 10px,
    transparent 10px,
    transparent 20px
  );
}
```

### D. Ambient Mesh Glow (Versi Terkendali)

Gunakan maksimal 2 titik cahaya lembut di belakang Hero agar tidak mengganggu keterbacaan teks:

```css
.ambient-glow-blue {
  background: radial-gradient(circle, rgba(37, 99, 235, 0.12) 0%, rgba(244, 248, 252, 0) 70%);
}
.ambient-glow-cyan {
  background: radial-gradient(circle, rgba(8, 145, 178, 0.10) 0%, rgba(244, 248, 252, 0) 70%);
}
```

---

## 5. Koleksi Ikon SVG Kustom (Custom SVG Icons)

Ikon di bawah ini dirancang khusus dengan gaya **2px stroke geometric** (`viewBox="0 0 24 24"`) agar konsisten dengan `lucide-react` yang sudah terpasang di proyek, namun membawa karakter khas HIMATIFA (kode, jaringan, organisasi, akademik, dan ekraf).

### 1. Emblem Kode / Identitas Informatika (`icon-himatifa-code`)
Cocok untuk Hero kicker, favicon alternatif, atau badge resmi HIMATIFA.
```svg
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="2" y="3" width="20" height="18" rx="4" stroke="currentColor" stroke-width="2"/>
  <path d="M8.5 9L5.5 12L8.5 15" stroke="#2563EB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M15.5 9L18.5 12L15.5 15" stroke="#2563EB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M13 8L11 16" stroke="#0891B2" stroke-width="2" stroke-linecap="round"/>
</svg>
```

### 2. Ristek & Inovasi / Node Hub (`icon-ristek-hub`)
Cocok untuk Departemen Riset & Teknologi atau section Showcase Karya.
```svg
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="12" cy="12" r="3" stroke="#2563EB" stroke-width="2"/>
  <circle cx="5" cy="6" r="2" stroke="currentColor" stroke-width="2"/>
  <circle cx="19" cy="6" r="2" stroke="currentColor" stroke-width="2"/>
  <circle cx="5" cy="18" r="2" stroke="currentColor" stroke-width="2"/>
  <circle cx="19" cy="18" r="2" stroke="currentColor" stroke-width="2"/>
  <path d="M6.5 7.5L9.8 10.2M17.5 7.5L14.2 10.2M6.5 16.5L9.8 13.8M17.5 16.5L14.2 13.8" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/>
</svg>
```

### 3. PSDM & Kaderisasi (`icon-psdm-growth`)
Cocok untuk Departemen PSDM (Pengembangan Sumber Daya Mahasiswa).
```svg
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="9" cy="8" r="3" stroke="currentColor" stroke-width="2"/>
  <path d="M3.5 19C3.5 15.9624 5.96243 13.5 9 13.5C12.0376 13.5 14.5 15.9624 14.5 19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  <path d="M17 14V7M17 7L14.5 9.5M17 7L19.5 9.5" stroke="#2563EB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M14 19H20" stroke="#0891B2" stroke-width="2" stroke-linecap="round"/>
</svg>
```

### 4. Kominfo & Media Kreatif (`icon-kominfo-broadcast`)
Cocok untuk Departemen Komunikasi & Informasi serta section Berita.
```svg
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="3" y="5" width="14" height="14" rx="3" stroke="currentColor" stroke-width="2"/>
  <path d="M8 10L12.5 12L8 14V10Z" fill="#2563EB"/>
  <path d="M19.5 8.5C20.5 9.6 21 10.75 21 12C21 13.25 20.5 14.4 19.5 15.5" stroke="#0891B2" stroke-width="2" stroke-linecap="round"/>
</svg>
```

### 5. Akademik & Bank Materi (`icon-akademik-module`)
Cocok untuk halaman `/akademik` (arsip modul, silabus, dan jadwal praktikum).
```svg
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M4 6.5C4 5.11929 5.11929 4 6.5 4H19C19.5523 4 20 4.44772 20 5V17.5C20 18.0523 19.5523 18.5 19 18.5H6.5C5.11929 18.5 4 17.3807 4 16V6.5Z" stroke="currentColor" stroke-width="2"/>
  <path d="M4 16C4 14.8954 4.89543 14 6 14H20" stroke="currentColor" stroke-width="2"/>
  <path d="M9 8.5H15M9 11.5H13" stroke="#2563EB" stroke-width="2" stroke-linecap="round"/>
</svg>
```

### 6. Ekraf Store & Merchandise (`icon-ekraf-bag`)
Cocok untuk halaman `/ekrafstore` dan katalog produk himpunan.
```svg
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M5 8H19L18 20H6L5 8Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
  <path d="M9 8V6C9 4.34315 10.3431 3 12 3C13.6569 3 15 4.34315 15 6V8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  <path d="M10 13L11.5 14.5L14.5 11.5" stroke="#2563EB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
```

### 7. Keuangan & Verifikasi LPJ (`icon-finance-ledger`)
Cocok untuk modul internal Bendahara (Kas) dan Sekretaris Umum (LPJ).
```svg
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="4" y="3" width="16" height="18" rx="2.5" stroke="currentColor" stroke-width="2"/>
  <path d="M8 8H16M8 12H12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  <circle cx="15" cy="15.5" r="2.5" stroke="#2563EB" stroke-width="2"/>
  <path d="M14 15.5L14.7 16.2L16.2 14.7" stroke="#0891B2" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
```

---

## 6. Checklist Implementasi Komponen

- [ ] Gunakan token CSS di `app/globals.css` (`--background`, `--foreground`, `--primary`, `--border`) alih-alih warna hex acak di setiap komponen.
- [ ] Pastikan `Plus Jakarta Sans` dan `Geist Mono` diterapkan konsisten pada heading, body, dan angka/tabel.
- [ ] Terapkan `.bg-pattern-dots` atau `.bg-pattern-grid` hanya pada area kanvas utama agar kartu putih (`#FFFFFF`) tetap memiliki kontras yang bersih.
- [ ] Gunakan ukuran sentuh minimal `44px x 44px` (`min-h-11`) untuk semua tombol, link navigasi, dan kontrol interaktif di tampilan mobile (`390px` & `320px`).
