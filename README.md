# AI Code Generation — NLP Project

Aplikasi web **AI Developer Assistant** yang membantu programmer mengotomatisasi berbagai pekerjaan coding harian menggunakan kecerdasan buatan. Dibangun sebagai tugas **Kasus 4 — Code Generation** pada mata kuliah Natural Language Processing.

## Tech Stack

- **Next.js** (App Router) + **TypeScript** — Framework fullstack React
- **Tailwind CSS v4** — Styling dengan tema dark glassmorphism
- **Groq API** — LLM backend dengan model `llama-3.3-70b-versatile` (temperature 0.2)
- **Framer Motion** — Animasi transisi UI
- **Lucide React** — Icon library
- **React Syntax Highlighter** — Syntax highlighting tema VS Code Dark Plus

## 6 Use Cases

| # | Use Case | Deskripsi |
|---|----------|-----------|
| 1 | **Autocomplete** | AI melanjutkan kode Python dari komentar yang tersedia |
| 2 | **Generate** | Deskripsi Bahasa Indonesia → kode Python |
| 3 | **NL → SQL** | Kalimat biasa → query SQL |
| 4 | **Refactor** | Kode buggy/berantakan → AI rapikan & perbaiki |
| 5 | **Unit Test** | Fungsi Python → AI generate unittest lengkap |
| 6 | **Dokumentasi** | Kode polos → AI tambahkan docstring & komentar |

## Setup & Menjalankan

```bash
# 1. Clone repository
git clone <repo-url>
cd code-generator

# 2. Install dependencies
pnpm install

# 3. Buat file .env.local di root project
#    Isi dengan API key Groq:
#    GROQ_API_KEY="gsk_xxxxxxxxxxxxxxxxxxxx"

# 4. Jalankan development server
pnpm dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

## Fitur UI/UX

- Glassmorphism card dengan backdrop-blur
- Tab navigation dengan icon per use case
- Animasi transisi antar tab (Framer Motion)
- Syntax highlighted output (tema VS Code Dark)
- Copy button (one-click copy ke clipboard)
- Keyboard shortcut `Ctrl+Enter` untuk generate
- Example prompt chips
- Toast notification sukses/error
- Char counter + validasi input
- Loading spinner & disabled state
