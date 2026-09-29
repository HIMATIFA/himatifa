import Link from 'next/link'
import { ArrowLeft, CheckCircle2, Clock, Copy, Download, MapPin, MessageCircle, Package, Receipt } from 'lucide-react'

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const orderId = params.id.toUpperCase()

  return (
    <main className="min-h-screen bg-[#f4f8fc] px-4 py-8 text-[#0a192f] sm:px-6 lg:px-10 lg:py-12">
      <div className="absolute left-[-10%] top-[-5%] -z-10 h-125 w-125 rounded-full bg-blue-400/20 blur-[120px]" />
      
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center justify-between">
          <Link href="/ekrafstore" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 transition-colors hover:text-[#2563eb]">
            <ArrowLeft className="size-4" /> Kembali ke Toko
          </Link>
          <button className="flex items-center gap-2 rounded-full border border-slate-200 bg-white/50 px-4 py-2 text-xs font-bold text-slate-600 shadow-sm backdrop-blur-sm transition-hover hover:bg-white hover:text-[#2563eb]">
            <Download className="size-3.5" /> Unduh Invoice
          </button>
        </div>

        {/* Status Banner */}
        <div className="mb-8 overflow-hidden rounded-[2rem] border border-white/80 bg-white/60 p-6 shadow-lg shadow-blue-900/5 backdrop-blur-xl sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="mb-1 text-xs font-bold uppercase tracking-wider text-slate-500">ID Pesanan: HMTF-{orderId}</p>
              <h1 className="text-2xl font-black tracking-tight sm:text-3xl">Menunggu Pembayaran</h1>
              <p className="mt-2 text-sm text-slate-500">Selesaikan pembayaran sebelum 27 Sep 2026, 14:00 WIB.</p>
            </div>
            <div className="grid size-16 place-items-center rounded-2xl bg-yellow-100 text-yellow-600 shadow-inner">
              <Clock className="size-8" />
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
          
          <div className="flex flex-col gap-6">
            {/* Rincian Pesanan */}
            <div className="rounded-[2rem] border border-white/80 bg-white/60 p-6 shadow-lg shadow-blue-900/5 backdrop-blur-xl sm:p-8">
              <h2 className="mb-6 flex items-center gap-2 text-lg font-extrabold"><Package className="size-5 text-[#2563eb]" /> Rincian Produk</h2>
              
              <div className="flex flex-col gap-4 border-b border-slate-200/60 pb-6">
                {[
                  { name: 'Jaket Himatifa 2026', price: 185000, qty: 1, category: 'Apparel' },
                  { name: 'Lanyard Premium', price: 25000, qty: 2, category: 'Aksesoris' },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="size-16 rounded-xl bg-slate-200" />
                      <div>
                        <p className="font-extrabold text-[#0a192f]">{item.name}</p>
                        <p className="text-xs font-bold text-slate-500">{item.qty} x Rp {item.price.toLocaleString('id-ID')}</p>
                      </div>
                    </div>
                    <span className="font-bold text-[#0a192f]">Rp {(item.qty * item.price).toLocaleString('id-ID')}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-col gap-3 text-sm">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal Produk</span>
                  <span className="font-bold text-[#0a192f]">Rp 235.000</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Biaya Layanan</span>
                  <span className="font-bold text-[#0a192f]">Gratis</span>
                </div>
                <div className="mt-4 flex items-end justify-between border-t border-slate-200/60 pt-4">
                  <span className="font-bold text-slate-500">Total Tagihan</span>
                  <span className="text-2xl font-black text-[#2563eb]">Rp 235.000</span>
                </div>
              </div>
            </div>

            {/* Data Pengambilan */}
            <div className="rounded-[2rem] border border-white/80 bg-white/60 p-6 shadow-lg shadow-blue-900/5 backdrop-blur-xl sm:p-8">
              <h2 className="mb-6 flex items-center gap-2 text-lg font-extrabold"><MapPin className="size-5 text-[#2563eb]" /> Informasi Pengambilan</h2>
              <div className="grid gap-4 sm:grid-cols-2 text-sm">
                <div>
                  <p className="text-xs font-bold uppercase text-slate-500">Nama Penerima</p>
                  <p className="mt-1 font-bold text-[#0a192f]">Muhammad Arya (20261337001)</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase text-slate-500">Kontak</p>
                  <p className="mt-1 font-bold text-[#0a192f]">0812-3456-7890</p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-xs font-bold uppercase text-slate-500">Lokasi Pengambilan</p>
                  <p className="mt-1 font-bold text-[#0a192f]">Sekretariat HIMATIFA UMSurabaya, Gedung G Lantai 2.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Instruksi Pembayaran (Dark Card) */}
          <div className="h-fit rounded-[2rem] bg-[#071426] p-6 text-white shadow-xl sm:p-8">
            <h3 className="mb-6 flex items-center gap-2 text-lg font-extrabold text-white"><Receipt className="size-5" /> Instruksi Pembayaran</h3>
            
            <p className="text-sm leading-6 text-blue-100/70">
              Silakan lakukan transfer sesuai dengan nominal total tagihan ke rekening berikut:
            </p>

            <div className="mt-6 rounded-2xl bg-white/10 p-5 backdrop-blur-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-blue-200">Bank BSI (Bank Syariah Indonesia)</p>
              <div className="mt-2 flex items-center justify-between">
                <p className="text-2xl font-black text-white">7123 4567 89</p>
                <button className="text-blue-300 transition-colors hover:text-white" title="Salin No. Rekening">
                  <Copy className="size-5" />
                </button>
              </div>
              <p className="mt-2 text-sm text-blue-100/70">a.n. HIMATIFA UMSurabaya</p>
            </div>

            <div className="mt-8 border-t border-white/10 pt-6">
              <p className="mb-4 text-sm text-blue-100/70">Sudah melakukan pembayaran?</p>
              <button className="flex w-full items-center justify-center gap-2 rounded-full bg-[#2563eb] py-4 text-sm font-bold text-white shadow-xl shadow-blue-600/20 transition-all hover:-translate-y-0.5 hover:bg-blue-600">
                <MessageCircle className="size-4" /> Konfirmasi via WhatsApp
              </button>
            </div>
          </div>
          
        </div>
      </div>
    </main>
  )
}