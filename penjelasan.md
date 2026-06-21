# Penjelasan Lengkap: Aplikasi AI Code Generation (Kasus 4)

Dokumen ini disusun agar kamu paham 100% tentang aplikasi yang telah dibangun. Silakan gunakan dokumen ini sebagai panduan atau naskah (contekan) saat presentasi demo besok.

---

## 1. Konsep Utama (Apa itu Aplikasi ini?)
Aplikasi ini adalah sebuah **AI Developer Assistant** (Asisten Pemrograman berbasis AI) yang diakses melalui antarmuka web modern. Tujuannya adalah membantu programmer mengotomatisasi berbagai pekerjaan *coding* harian yang biasanya memakan waktu, seperti menulis kode, memperbaiki bug, dan membuat dokumentasi.

Ide dasarnya mirip dengan **GitHub Copilot** atau **Claude Code**, di mana kita memberikan instruksi (atau teks) dan AI akan merespons dengan kode yang sudah matang dan siap pakai.

---

## 2. Tech Stack (Teknologi yang Digunakan)
Untuk presentasi, kamu bisa menyebutkan bahwa aplikasi ini dibangun dengan *stack* modern:
*   **Next.js (App Router)**: Framework React terbaru untuk menangani tampilan (Frontend) dan server lokal (Backend API) secara bersamaan.
*   **Tailwind CSS v4**: Digunakan untuk *styling* antarmuka (UI) agar desainnya minimalis, responsif, dan menggunakan tema *Glassmorphism* (efek transparan/kaca).
*   **TypeScript**: Membuat kode JavaScript lebih aman dan terstruktur dengan sistem pengetikan (typing).
*   **Framer Motion**: Library untuk membuat animasi UI yang super mulus (seperti efek transisi pindah tab dan notifikasi *toast*).
*   **Groq API (Model Llama-3.3-70b-versatile)**: Ini adalah "otak" AI-nya. Groq dipilih karena kecepatan *inference*-nya yang sangat tinggi. Kita mensetting **temperature di angka 0.2** agar jawaban AI tidak berhalusinasi, melainkan sangat logis, pasti, dan fokus pada kode teknis.

---

## 3. Fitur Utama (6 Use Cases)
Aplikasi ini memiliki 6 mode (Use Cases) yang masing-masing punya *prompt engineering* spesifik di belakang layar:

1.  **Autocomplete**: AI membaca komentar kode (contoh: `# Fungsi hitung Fibonacci`) lalu secara otomatis menuliskan algoritma Python-nya secara lengkap.
2.  **Generate**: Pengguna cukup mendeskripsikan apa yang ingin dibuat dalam bahasa Indonesia sehari-hari (misal: "buat fungsi cek bilangan prima"), dan AI akan menerjemahkannya menjadi kode Python.
3.  **NL → SQL (Natural Language to SQL)**: Mengubah bahasa manusia menjadi Query Database (SQL). Sangat berguna bagi orang yang tidak hafal *syntax* SQL.
4.  **Refactor**: Memperbaiki kode yang berantakan, kurang efisien, atau *buggy*. Pengguna menempelkan kode jelek, AI akan merapikannya menjadi kode yang *clean* dan sesuai standar.
5.  **Unit Test**: Fitur krusial bagi *Software Engineer*. Hanya dengan menempelkan sebuah fungsi, AI akan membuatkan skenario pengujiannya secara otomatis (menggunakan library `unittest` Python).
6.  **Dokumentasi**: Otomatis menambahkan komentar dan *docstring* pada kode yang polos, agar mudah dipahami oleh programmer lain.

---

## 4. Alur Kerja Aplikasi (Under the Hood)
Jika dosen/audiens bertanya, **"Bagaimana cara kerjanya dari depan sampai belakang?"**, ini jawabannya:

1.  **Interaksi Frontend (`app/page.tsx`)**: 
    Pengguna memilih salah satu tab (misal: *Refactor*), lalu memasukkan teks ke dalam kotak input. Terdapat validasi UI (minimal 5 karakter) untuk memastikan pengguna tidak mengirimkan input kosong.
2.  **Mengirim Data (Fetch Request)**: 
    Saat tombol "Generate" ditekan (atau *shortcut* `Ctrl+Enter`), Frontend akan mengemas input pengguna beserta "tipe kasus/usecase" yang sedang aktif, lalu mengirimkannya ke Backend lokal lewat jalur `/api/generate`.
3.  **Prompt Engineering di Backend (`app/api/generate/route.ts`)**:
    Di Backend, input mentah dari pengguna tidak langsung dikirim ke AI. Aplikasi akan "membungkusnya" dengan **System Prompt** rahasia. 
    *Contoh:* Jika mode SQL dipilih, Backend menambahkan prompt rahasia: *"Kamu adalah asisten SQL. Ubah kalimat berikut menjadi query SQL. Hanya tulis query SQL, tanpa penjelasan."* (Ini yang membuat AI hanya membalas dengan kode tanpa bertele-tele).
4.  **Eksekusi ke Groq API**:
    Backend yang sudah memegang instruksi utuh akan mengirimkan HTTP POST Request ke server Groq menggunakan *API Key*. Groq memprosesnya dengan model Llama-3.3 dan mengembalikan respon berisikan kode.
5.  **Pembersihan Data (Sanitasi)**:
    Seringkali AI mengembalikan kode dengan format Markdown (seperti \`\`\`python ... \`\`\`). Di file `route.ts`, kita memiliki *Regex* (Regular Expression) untuk menghapus tanda tersebut agar hasil kodenya bersih murni.
6.  **Menampilkan Hasil**:
    Teks kode bersih dikirim kembali ke Frontend, lalu dirender dengan cantik menggunakan *syntax highlighter* (tema VS Code Dark Plus) agar terlihat berwarna-warni sesuai bahasanya (SQL atau Python). Notifikasi *toast* "Berhasil digenerate!" akan muncul di pojok kanan.

---

## 5. Keunggulan UX (User Experience)
Jangan lupa pamerkan fitur-fitur UX kecil tapi sangat pro ini saat demo:
*   **One-Click Copy**: Tombol 'Copy' praktis di sudut blok kode.
*   **Keyboard Shortcut**: Tidak usah geser mouse, cukup tekan `Ctrl+Enter` untuk memanggil AI.
*   **Example Prompt Chips**: Tombol kecil di bawah input teks yang otomatis mengisi form dengan contoh valid (cocok banget dipakai kalau grogi pas demo, tinggal klik!).
*   **Animasi Mulus**: Berkat Framer Motion, semua transisi UI (notifikasi, error box, perpindahan tab) memiliki efek *fade* dan *slide* yang memanjakan mata, persis aplikasi kelas dunia.

---
*Semoga sukses presentasinya! Kuasai 5 poin di atas, dan kamu pasti bisa menjawab semua pertanyaan dengan yakin.*
