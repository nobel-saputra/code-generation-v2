Buatkan project Next.js baru untuk Web 2 — AI Code Analyzer & Converter dengan detail berikut:
Konteks Project:

Ini adalah project terpisah dari Web 1. Merupakan bagian dari tugas NLP (Natural Language Processing) — Kasus 4: Code Generation.

Link materi tugas: https://rococo-fox-20c006.netlify.app/#pendahuluan
Referensi Web 1 yang sudah dibuat (jangan duplikasi, jadikan acuan style saja):

Web 1 sudah mengimplementasikan 6 use case berikut:

Autocomplete fungsi dari komentar (fixed input Fibonacci memoization)
Generate fungsi Python dari deskripsi Bahasa Indonesia
Natural Language → SQL
Refactoring & Debugging
Generate Unit Test otomatis
Dokumentasi kode (tambah docstring & komentar)

Web 2 ini harus berbeda total dari sisi use case tapi menggunakan style UI yang sama (dark theme, glassmorphism, Tailwind v4, framer-motion, lucide-react).
Tech Stack:

Next.js App Router + TypeScript + Tailwind CSS v4
Groq API model llama-3.3-70b-versatile, temperature 0.2
framer-motion, lucide-react, clsx

6 Use Cases (tab navigation):

Code Converter — User paste kode, pilih bahasa asal (dropdown) dan bahasa tujuan (dropdown), AI konversi kode ke bahasa tujuan. Bahasa yang tersedia: Python, JavaScript, TypeScript, Java, Go, PHP, C++, Rust, Swift, Kotlin
Code Explainer — User paste kode, AI jelaskan kode tersebut baris per baris dalam Bahasa Indonesia yang mudah dipahami
Complexity Analyzer — User paste kode, AI analisis time complexity dan space complexity dalam notasi Big O, serta berikan penjelasan singkat
Code Review — User paste kode, AI review kualitas kode dan berikan: skor 1-10, list kelebihan, list kelemahan, dan saran perbaikan
Security Audit — User paste kode, AI identifikasi potensi bug, vulnerability, dan security issue, serta berikan rekomendasi perbaikan
Code Translator — User paste kode + pilih bahasa output (Indonesia/English), AI jelaskan apa yang dilakukan kode tersebut dalam bentuk pseudocode / penjelasan naratif sesuai bahasa yang dipilih

File yang harus dibuat:

app/api/analyze/route.ts — API route dengan prompt engineering spesifik per use case. Untuk Code Converter, prompt harus menyertakan bahasa asal dan tujuan yang dipilih user. Tambahkan error handling if (!res.ok). Sanitasi output dengan regex untuk hapus markdown fences.
app/page.tsx — Halaman utama dengan:

Header badge "Studi Kasus Text Generation — Kasus 4"
Tab navigation 6 use case dengan icon lucide-react
Untuk tab Code Converter: tambahkan 2 dropdown pilih bahasa (from/to)
Untuk tab Code Translator: tambahkan dropdown pilih bahasa output (Indonesia/English)
Textarea input + button Generate
Animasi framer-motion (AnimatePresence tab transition, output fade-in)
Copy button di output
Keyboard shortcut Ctrl+Enter
Char counter + validasi minimal 5 karakter
Clear button
Response time indicator (tampilkan berapa detik AI merespons, contoh: "Generated in 1.2s")
Output ditampilkan dengan react-syntax-highlighter tema VS Code Dark
Ambient background blobs (violet/indigo/fuchsia) dengan animasi CSS keyframes


app/layout.tsx — title: "AI Code Analyzer — NLP Project", description: "Analisis, konversi, dan review kode menggunakan AI", lang="id"
app/globals.css — dark theme + custom scrollbar, sama dengan Web 1
.env.local — GROQ_API_KEY=your_groq_api_key_here
README.md — dokumentasi lengkap project

UX Features yang harus ada:

Response time indicator ("Generated in 1.2s")
Copy button di output
Ctrl+Enter shortcut
Clear button
Char counter + validasi minimal 5 karakter
Toast notification sukses/error
Disabled button state saat input kosong

Catatan penting:

Jangan gunakan <form> tag, pakai onClick handler
Semua prompt di backend instruksikan "Hanya tulis output, tanpa penjelasan tambahan" kecuali use case yang memang butuh penjelasan (Explainer, Review, Security Audit, Complexity)
Background blob animasi pakai CSS keyframes @keyframes blob, bukan JavaScript
Jangan duplikasi use case dari Web 1 (web yang sudah di gitclone saat ini, UI boleh sama tapi jangan duplikasi use case nya)