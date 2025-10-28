# CryptoTrackr

UTS Pemrograman Web ReactJS Application – Digit 2 Cryptocurrency Tracker  
Author: Nashrullah Fathul Qoriib (NIM: 122140162)

## Deskripsi

CryptoTrackr merupakan aplikasi ReactJS untuk memantau harga cryptocurrency menggunakan CoinGecko API. Aplikasi ini menyediakan tabel market interaktif, filter berbasis rentang harga, kartu detail lengkap dengan grafik harga 7 hari, serta kalkulator portofolio untuk menghitung nilai aset kripto yang dimiliki.

## Fitur Utama

- Tabel dinamis dengan kolom harga, market cap, dan perubahan 24 jam.
- Form filter (minimal 5 input) dengan validasi HTML5: kata kunci, rentang harga, mata uang, dan filter performa.
- Detail coin lengkap (deskripsi, harga, supply, volume) beserta grafik harga 7 hari.
- Kalkulator portofolio untuk menghitung total nilai aset berdasarkan harga terbaru.
- Tombol refresh data dengan indikator loading untuk memperbarui informasi secara instan.
- Desain responsif berbasis Bootstrap standar.
- Dukungan multi-currency (USD, EUR, IDR, SOL) mengikuti dokumentasi CoinGecko.

## Tech Stack

- **React + Vite**
- **React Hooks**: `useState`, `useEffect`, `useMemo`
- **Axios** sebagai HTTP client untuk CoinGecko API
- **Bootstrap 5** untuk komponen UI responsif
- **react-chartjs-2 + Chart.js** untuk visualisasi grafik harga

## Struktur Proyek

```
├── public/
│   └── index.html
├── src/
│   ├── api/
│   │   └── client.js
│   ├── components/
│   │   ├── DataTable.jsx
│   │   ├── DetailCard.jsx
│   │   ├── Header.jsx
│   │   ├── PortfolioCalculator.jsx
│   │   └── SearchForm.jsx
│   ├── App.jsx
│   ├── index.js
│   ├── index.css
│   └── utils/
│       └── formatters.js
├── package.json
└── README.md
```

## Persiapan & Instalasi

1. **Clone repository**

   ```bash
   git clone https://github.com/qoriib/uts-pemweb-122140162.git
   cd uts-pemweb-122140162
   ```

2. **Install dependency**

   ```bash
   npm install
   ```

3. **Konfigurasi environment (opsional, untuk API key CoinGecko)**

   ```bash
   cp .env.example .env
   ```

   | Variabel                      | Default                            | Deskripsi                                                                |
   | ----------------------------- | ---------------------------------- | ------------------------------------------------------------------------ |
   | `VITE_COINGECKO_API_BASE_URL` | `https://api.coingecko.com/api/v3` | Ubah ke `https://pro-api.coingecko.com/api/v3` jika menggunakan Pro API. |
   | `VITE_COINGECKO_API_KEY`      | _(kosong)_                         | API key Pro/Demo yang akan dikirim melalui header sesuai domain.         |

4. **Jalankan aplikasi dalam mode pengembangan**

   ```bash
   npm run dev
   ```

   Aplikasi dapat diakses melalui URL yang ditampilkan di terminal (default: `http://localhost:5173`).

5. **Build untuk produksi**
   ```bash
   npm run build
   npm run preview
   ```

## Deployment

Proyek siap dideploy ke **Vercel**.

1. Push kode ke repository GitHub (pastikan minimal 10 commit dengan pesan yang jelas).
2. Hubungkan repository ke Vercel dan deploy.
3. Tambahkan link deployment ke bagian berikut:

- **Link Vercel**: https://uts-pemweb-122140162.vercel.app

## Dokumentasi Tambahan

- **API**: [CoinGecko API](https://www.coingecko.com/en/api/documentation)
- **Screenshot Aplikasi**: ![Screenshot](./docs/screenshot.png)
  > Perbarui gambar ini setelah mengambil tangkapan layar dari aplikasi yang sudah dijalankan.

## Checklist Pengumpulan

- [x] Kode berjalan tanpa error di console.
- [x] Semua fitur wajib (tabel, filter harga, detail dengan chart, kalkulator portofolio, refresh) tersedia.
- [x] Validasi form menggunakan atribut HTML5.
- [x] Integrasi CoinGecko berhasil dengan state loading dan error.
- [x] Desain responsif di mobile dan desktop.
- [ ] Deployment Vercel aktif dan link tercantum di README.

## Lisensi

Proyek ini dibuat untuk memenuhi tugas UTS Pemrograman Web. Silakan kembangkan lebih lanjut sesuai kebutuhan.
