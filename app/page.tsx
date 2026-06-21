"use client";

import { useState, useEffect, useRef } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Loader2,
  Copy,
  Check,
  Trash2,
  Code,
  Terminal,
  Database,
  Wrench,
  FlaskConical,
  BookOpen,
} from "lucide-react";

// Types
type Toast = { id: string; message: string; type: "success" | "error" };

const USECASES = [
  {
    id: "autocomplete",
    label: "Autocomplete",
    icon: Code,
    title: "Autocomplete dari Komentar",
    description: "AI melanjutkan kode Python dari komentar yang sudah tersedia.",
    placeholder: null,
    fixed: "# Fungsi untuk menghitung Fibonacci ke-n dengan memoization\n",
    chips: [],
  },
  {
    id: "generate",
    label: "Generate",
    icon: Sparkles,
    title: "Generate Code",
    description: "Tulis deskripsi dalam Bahasa Indonesia, AI generate kode-nya.",
    placeholder: "contoh: buat fungsi cek bilangan prima",
    fixed: null,
    chips: ["Buat fungsi cek bilangan prima", "Fungsi untuk reverse string", "Fungsi untuk hitung faktorial"],
  },
  {
    id: "sql",
    label: "NL → SQL",
    icon: Database,
    title: "Natural Language → SQL",
    description: "Deskripsikan query yang kamu mau, AI tulis SQL-nya.",
    placeholder: "contoh: tampilkan semua user yang mendaftar bulan ini",
    fixed: null,
    chips: ["Tampilkan user yang mendaftar bulan ini", "Hitung total pendapatan tahun lalu"],
  },
  {
    id: "refactor",
    label: "Refactor",
    icon: Wrench,
    title: "Refactoring & Debugging",
    description: "Paste kode yang berantakan atau buggy, AI rapikan dan perbaiki.",
    placeholder: "paste kode Python yang mau di-refactor...",
    fixed: null,
    chips: ["def hitung(a,b):\n  return a+b\n  print('selesai')", "for i in range(10):\n print(i)"],
  },
  {
    id: "unittest",
    label: "Unit Test",
    icon: FlaskConical,
    title: "Generate Unit Test",
    description: "Paste fungsi Python, AI buatkan unit test lengkap.",
    placeholder: "paste fungsi Python yang mau dibuatkan unit test-nya...",
    fixed: null,
    chips: ["def add(a, b): return a + b", "def is_even(n): return n % 2 == 0"],
  },
  {
    id: "docs",
    label: "Dokumentasi",
    icon: BookOpen,
    title: "Dokumentasi Kode",
    description: "Paste kode tanpa dokumentasi, AI tambahkan docstring & komentar.",
    placeholder: "paste kode Python yang mau didokumentasikan...",
    fixed: null,
    chips: ["def fib(n):\n    if n<=1: return n\n    return fib(n-1)+fib(n-2)"],
  },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState(0);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const active = USECASES[activeTab];
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Helper to add toast
  const addToast = (message: string, type: "success" | "error" = "success") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  async function handleGenerate() {
    if (!active.fixed && input.trim().length < 5) return;

    setLoading(true);
    setError("");
    setOutput("");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          usecase: active.id,
          input: active.fixed ?? input,
        }),
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);
      
      setOutput(data.result);
      addToast("Berhasil digenerate!");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Terjadi kesalahan.");
      addToast("Gagal generate", "error");
    } finally {
      setLoading(false);
    }
  }

  function handleTabChange(i: number) {
    setActiveTab(i);
    setInput("");
    setOutput("");
    setError("");
  }

  function handleClear() {
    setInput("");
    setOutput("");
    setError("");
  }

  async function handleCopy() {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    addToast("Kode disalin ke clipboard!");
    setTimeout(() => setCopied(false), 2000);
  }

  // Keyboard shortcut Ctrl+Enter
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        if (!loading && (active.fixed || input.trim().length >= 5)) {
          handleGenerate();
        }
      }
    };
    
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [input, activeTab, loading, active.fixed]);

  const isValidInput = active.fixed ? true : input.trim().length >= 5;

  return (
    <main className="min-h-screen relative overflow-hidden bg-[#0a0a0a] text-slate-200">
      <div className="relative z-10 px-4 py-16 max-w-4xl mx-auto flex flex-col min-h-screen">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 flex flex-col items-center text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            AI Code <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">Generation</span>
          </h1>
          <p className="text-slate-400 text-sm md:text-base max-w-lg">
            Eksplorasi kemampuan AI untuk menulis, memperbaiki, dan mendokumentasikan kode secara otomatis.
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap gap-2 mb-8 justify-center"
        >
          {USECASES.map((uc, i) => {
            const Icon = uc.icon;
            const isActive = activeTab === i;
            return (
              <button
                key={uc.id}
                onClick={() => handleTabChange(i)}
                className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? "bg-violet-600 text-white shadow-[0_0_15px_rgba(139,92,246,0.4)]"
                    : "bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10"
                }`}
              >
                <Icon className={`w-4 h-4 mr-2 ${isActive ? "text-white" : "text-slate-500"}`} />
                {uc.label}
              </button>
            );
          })}
        </motion.div>

        {/* Main Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-white mb-2">{active.title}</h2>
                  <p className="text-slate-400 text-sm">{active.description}</p>
                </div>
                {(input || output) && (
                  <button 
                    onClick={handleClear}
                    className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                    title="Clear All"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Input Section */}
              <div className="mb-6 relative">
                {active.fixed ? (
                  <div className="opacity-80 select-none rounded-xl overflow-hidden border border-white/10 text-sm shadow-inner">
                    <SyntaxHighlighter
                      language={active.id === "sql" ? "sql" : "python"}
                      style={vscDarkPlus}
                      customStyle={{ margin: 0, padding: "1.25rem", background: "rgba(0,0,0,0.3)" }}
                      wrapLongLines={true}
                    >
                      {active.fixed}
                    </SyntaxHighlighter>
                  </div>
                ) : (
                  <div className="relative group">
                    <textarea
                      ref={textareaRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder={active.placeholder ?? ""}
                      rows={5}
                      className="w-full bg-black/20 border border-white/10 rounded-xl p-4 pb-10 text-sm text-slate-200 placeholder-slate-600 font-mono focus:outline-none focus:border-violet-500 focus:bg-black/40 resize-none transition-all shadow-inner"
                    />
                    <div className="absolute bottom-3 right-4 text-xs font-mono text-slate-500 pointer-events-none flex items-center gap-3">
                      <span className="hidden md:inline-block border border-slate-700 bg-slate-800/50 rounded px-1.5 py-0.5">Ctrl+Enter</span>
                      <span className={input.length < 5 && input.length > 0 ? "text-red-400" : ""}>
                        {input.length} chars
                      </span>
                    </div>
                  </div>
                )}

                {/* Chips */}
                {!active.fixed && active.chips && active.chips.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {active.chips.map((chip, idx) => (
                      <button
                        key={idx}
                        onClick={() => setInput(chip)}
                        className="px-3 py-1 text-xs rounded-full bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10 hover:text-slate-200 transition-colors text-left truncate max-w-full"
                      >
                        {chip.length > 50 ? chip.substring(0, 50) + "..." : chip}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Button */}
              <button
                onClick={handleGenerate}
                disabled={loading || !isValidInput}
                className={`w-full py-3.5 rounded-xl flex items-center justify-center font-semibold text-sm transition-all duration-300 ${
                  loading || !isValidInput
                    ? "bg-white/5 text-slate-500 cursor-not-allowed border border-white/5"
                    : "bg-violet-600 hover:bg-violet-500 text-white shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] border border-violet-500/50"
                }`}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Generating Magic...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Generate
                  </>
                )}
              </button>

              {/* Output Section */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-6 overflow-hidden"
                  >
                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-mono flex items-start">
                      <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5 mr-3 flex-shrink-0" />
                      {error}
                    </div>
                  </motion.div>
                )}

                {output && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, y: 10 }}
                    animate={{ opacity: 1, height: "auto", y: 0 }}
                    className="mt-8 overflow-hidden"
                  >
                    <div className="flex justify-between items-center mb-3 px-1">
                      <div className="flex items-center text-xs font-mono text-emerald-400/80">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                        // output generated
                      </div>
                      <button
                        onClick={handleCopy}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-white/10 transition-colors border border-transparent hover:border-white/10"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        {copied ? "Copied" : "Copy"}
                      </button>
                    </div>
                    <div className="rounded-xl overflow-hidden border border-white/10 text-sm shadow-2xl relative group">
                      <SyntaxHighlighter
                        language={active.id === "sql" ? "sql" : "python"}
                        style={vscDarkPlus}
                        customStyle={{ margin: 0, padding: "1.5rem", background: "rgba(0,0,0,0.4)" }}
                        wrapLongLines={true}
                      >
                        {output}
                      </SyntaxHighlighter>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Custom Toasts */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl border shadow-xl text-sm font-medium backdrop-blur-md ${
                toast.type === "success" 
                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-100" 
                  : "bg-red-500/10 border-red-500/20 text-red-100"
              }`}
            >
              {toast.type === "success" ? (
                <Check className="w-4 h-4 text-emerald-400" />
              ) : (
                <div className="w-2 h-2 rounded-full bg-red-400" />
              )}
              {toast.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </main>
  );
}