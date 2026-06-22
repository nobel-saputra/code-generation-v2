# AI Code Analyzer — NLP Project

> Web 2: AI Code Analyzer & Converter — Tugas NLP Kasus 4: Code Generation

## 📋 Deskripsi

Aplikasi web berbasis AI yang dirancang untuk menjadi asisten *developer* komprehensif. Mampu menganalisis, mengkonversi, menjelaskan, mendeteksi *bug*, hingga mengaudit keamanan kode secara otomatis. Dibangun menggunakan **Next.js 16 App Router**, **TypeScript**, dan **Tailwind CSS v4** dengan tampilan *dark theme glassmorphism* yang elegan dan bersih.

Project ini merupakan **Web 2** dari tugas NLP — Kasus 4: Code Generation. Fokus pada Web 2 ini adalah **analisis mendalam dan manipulasi kode**, melengkapi Web 1 yang berfokus pada fitur-fitur Code Generation.

## 🚀 5 Use Cases Utama

| # | Use Case | Deskripsi |
|---|----------|-----------|
| 1 | **Code Converter** | Konversi kode antar 10 bahasa pemrograman (Python, JavaScript, TypeScript, Java, Go, PHP, C++, Rust, Swift, Kotlin). Otomatis menyesuaikan sintaks warna hasil konversi. |
| 2 | **Code Explainer** | Menjelaskan kode baris per baris secara naratif dalam Bahasa Indonesia yang mudah dipahami. |
| 3 | **Bug Finder** | Mendeteksi lokasi *bug* dalam kode, menjelaskan alasannya, serta menyajikan solusi berupa kode perbaikan yang relevan. Jika kode sudah bersih, AI akan mengkonfirmasi: *"✅ Code looks good! Tidak ditemukan bug pada kode ini."* |
| 4 | **Code Review** | Penilaian kualitas kode dengan skor 1-10, rincian kelebihan, identifikasi kelemahan, dan saran perbaikan komprehensif. |
| 5 | **Security Audit** | Memindai potensi *bug*, *vulnerability*, dan isu keamanan, lengkap dengan level *severity* (Critical/High/Medium/Low) dan rekomendasi perbaikan. |

## 🛠 Tech Stack & Library Pendukung

- **Framework**: Next.js 16 (App Router) + TypeScript
- **Styling**: Tailwind CSS v4 + `@tailwindcss/typography` (untuk Markdown *styling*)
- **AI Backend**: Groq API — Model `llama-3.3-70b-versatile` (Temperature 0.2 untuk akurasi tinggi)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Syntax Highlighting**: `react-syntax-highlighter` (Tema VS Code Dark)
- **Markdown Renderer**: `react-markdown`, `remark-gfm` (Tabel/GFM support), `remark-breaks` (Format spasi/enter akurat)

## ✨ Fitur UX & UI

- 🎯 **Navigasi Tab Interaktif**: Beralih antar 5 *use case* dengan mulus didukung animasi Framer Motion.
- 📝 **Markdown Rich Output**: Hasil penjelasan AI dirender menjadi Markdown yang rapi (Heading, List, Text Bold) tanpa menghilangkan *highlight* blok kode.
- ⏱️ **Performance Tracker**: Indikator waktu proses API ("Generated in X.Xs").
- 📋 **One-Click Copy**: Tombol salin hasil keseluruhan ke *clipboard* beserta *toast notification* (berubah menjadi ceklis saat berhasil). Ditambah **tombol Copy spesifik** yang hanya muncul saat melakukan *hover* pada blok kode (berguna untuk langsung menyalin kode perbaikan tanpa menyertakan teks narasi).
- ⌨️ **Keyboard Shortcut**: Tekan `Ctrl + Enter` (atau `Cmd + Enter` di Mac) untuk memicu proses analisis tanpa harus mengklik tombol.
- 📊 **Smart Validation**: Validasi input minimal 5 karakter, menonaktifkan tombol *generate* saat input kosong atau sedang memproses.
- 🖥️ **Clean Dark Interface**: Antarmuka mode gelap solid untuk mengurangi ketegangan mata, menonjolkan estetika minimalis namun *powerful*.

## 📁 Struktur File Penting

```
├── app/
│   ├── api/
│   │   └── analyze/
│   │       └── route.ts          # API Endpoint (Groq AI) dengan prompt engineering dinamis
│   ├── globals.css               # Import Tailwind, tipografi, dan custom scrollbar
│   ├── layout.tsx                # Konfigurasi metadata halaman
│   └── page.tsx                  # UI Utama (State management, Markdown, Tab navigasi)
├── .env.local                    # Environment variable (API Key)
├── package.json                  # Dependensi proyek
└── README.md                     # Dokumentasi
```

## 🏃 Cara Menjalankan Secara Lokal

1. Clone repository proyek ini.
2. Install seluruh *dependencies* yang dibutuhkan:
   ```bash
   pnpm install
   ```
3. Buat file `.env.local` di root proyek dan tambahkan API key Groq Anda:
   ```
   GROQ_API_KEY=your_groq_api_key_here
   ```
4. Mulai server pengembangan (*development server*):
   ```bash
   pnpm dev
   ```
5. Buka [http://localhost:3000](http://localhost:3000) di *browser* Anda.

## 🔗 Referensi Tambahan

- [Materi Tugas NLP: Kasus 4](https://rococo-fox-20c006.netlify.app/#pendahuluan)
- [Console API Groq](https://console.groq.com/)
- [Next.js Documentation](https://nextjs.org/docs)
