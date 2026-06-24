"use client";

import { useState, useEffect, useRef } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRightLeft,
  BookOpen,
  Bug,
  ClipboardCheck,
  ShieldAlert,
  Sparkles,
  Loader2,
  Copy,
  Check,
  Trash2,
  Timer,
} from "lucide-react";

// Types
type Toast = { id: string; message: string; type: "success" | "error" };

const LANGUAGES = [
  "Python",
  "JavaScript",
  "TypeScript",
  "Java",
  "Go",
  "PHP",
  "C++",
  "Rust",
  "Swift",
  "Kotlin",
];

const USECASES = [
  {
    id: "converter",
    label: "Converter",
    icon: ArrowRightLeft,
    title: "Code Converter",
    description:
      "Paste kode dan pilih bahasa asal & tujuan, AI konversi kode secara otomatis.",
    placeholder: "Paste kode yang ingin dikonversi...",
    hasLanguageSelect: true,
    hasOutputLang: false,
  },
  {
    id: "explainer",
    label: "Explainer",
    icon: BookOpen,
    title: "Code Explainer",
    description:
      "Paste kode, AI jelaskan baris per baris dalam Bahasa Indonesia yang mudah dipahami.",
    placeholder: "Paste kode yang ingin dijelaskan...",
    hasLanguageSelect: false,
    hasOutputLang: false,
  },
  {
    id: "bugfinder",
    label: "Bug Finder",
    icon: Bug,
    title: "Bug Finder",
    description:
      "Paste kode kamu, AI akan mendeteksi bug dan memberikan solusi perbaikannya.",
    placeholder: "paste kode yang mau dicari bug-nya...",
    hasLanguageSelect: false,
    hasOutputLang: false,
  },
  {
    id: "review",
    label: "Review",
    icon: ClipboardCheck,
    title: "Code Review",
    description:
      "Paste kode, AI review kualitas dan berikan skor, kelebihan, kelemahan, serta saran.",
    placeholder: "Paste kode yang ingin di-review...",
    hasLanguageSelect: false,
    hasOutputLang: false,
  },
  {
    id: "security",
    label: "Security",
    icon: ShieldAlert,
    title: "Security Audit",
    description:
      "Paste kode, AI identifikasi potensi bug, vulnerability, dan security issue.",
    placeholder: "Paste kode yang ingin di-audit keamanannya...",
    hasLanguageSelect: false,
    hasOutputLang: false,
  },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CodeBlock = ({ inline, className, children, ...props }: any) => {
  const match = /language-(\w+)/.exec(className || "");
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(String(children).replace(/\n$/, ""));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!inline && match) {
    return (
      <div className="relative group mt-4 mb-4">
        <button
          onClick={handleCopy}
          className="absolute right-2 top-2 p-1.5 rounded-md bg-white/10 hover:bg-white/20 text-slate-300 opacity-0 group-hover:opacity-100 transition-all flex items-center gap-1.5 text-xs z-10"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? "Copied" : "Copy"}
        </button>
        <SyntaxHighlighter
          {...props}
          style={vscDarkPlus}
          language={match[1]}
          PreTag="div"
          customStyle={{ margin: 0, borderRadius: "0.5rem" }}
        >
          {String(children).replace(/\n$/, "")}
        </SyntaxHighlighter>
      </div>
    );
  }

  return (
    <code
      {...props}
      className="bg-white/10 rounded px-1.5 py-0.5 text-violet-300 before:content-none after:content-none font-mono text-sm"
    >
      {children}
    </code>
  );
};

export default function Home() {
  const [activeTab, setActiveTab] = useState(0);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [responseTime, setResponseTime] = useState<number | null>(null);

  // Language selectors
  const [fromLang, setFromLang] = useState("Python");
  const [toLang, setToLang] = useState("JavaScript");

  const active = USECASES[activeTab];
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Helper to add toast
  const addToast = (
    message: string,
    type: "success" | "error" = "success"
  ) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  async function handleGenerate() {
    if (input.trim().length < 5) return;

    setLoading(true);
    setError("");
    setOutput("");
    setResponseTime(null);

    const startTime = performance.now();

    try {
      const body: Record<string, string> = {
        usecase: active.id,
        input: input,
      };

      if (active.id === "converter") {
        body.fromLang = fromLang;
        body.toLang = toLang;
      }

      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      const elapsed = (performance.now() - startTime) / 1000;
      setResponseTime(parseFloat(elapsed.toFixed(1)));
      setOutput(data.result);
      addToast("Berhasil dianalisis!");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Terjadi kesalahan.");
      addToast("Gagal memproses", "error");
    } finally {
      setLoading(false);
    }
  }

  function handleTabChange(i: number) {
    setActiveTab(i);
    setInput("");
    setOutput("");
    setError("");
    setResponseTime(null);
  }

  function handleClear() {
    setInput("");
    setOutput("");
    setError("");
    setResponseTime(null);
  }

  async function handleCopy() {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    addToast("Output disalin ke clipboard!");
    setTimeout(() => setCopied(false), 2000);
  }

  // Keyboard shortcut Ctrl+Enter
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        if (!loading && input.trim().length >= 5) {
          handleGenerate();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input, activeTab, loading]);

  const isValidInput = input.trim().length >= 5;

  // Determine syntax highlighting language for output
  const getOutputLanguage = () => {
    if (active.id === "converter") {
      const lang = toLang.toLowerCase();
      if (lang === "c++") return "cpp";
      return lang;
    }
    // For explainer, bugfinder, review, security
    if (["explainer", "bugfinder", "review", "security"].includes(active.id)) return "markdown";
    return "python";
  };

  return (
    <main className="min-h-screen relative overflow-hidden bg-[#0a0a0a] text-slate-200">
      <div className="relative z-10 px-4 py-12 md:py-16 max-w-4xl mx-auto flex flex-col min-h-screen">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 flex flex-col items-center text-center"
        >
        

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            AI Code{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-violet-400 via-fuchsia-400 to-indigo-400">
              Analyzer
            </span>
          </h1>
          <p className="text-slate-400 text-sm md:text-base max-w-lg">
            Analisis, konversi, review, dan audit kode secara otomatis
            menggunakan kecerdasan buatan.
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
                id={`tab-${uc.id}`}
                onClick={() => handleTabChange(i)}
                className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer ${
                  isActive
                    ? "bg-violet-600 text-white shadow-[0_0_15px_rgba(139,92,246,0.4)]"
                    : "bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10"
                }`}
              >
                <Icon
                  className={`w-4 h-4 mr-2 ${
                    isActive ? "text-white" : "text-slate-500"
                  }`}
                />
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
                  <h2 className="text-xl font-semibold text-white mb-2">
                    {active.title}
                  </h2>
                  <p className="text-slate-400 text-sm">
                    {active.description}
                  </p>
                </div>
                {(input || output) && (
                  <button
                    id="btn-clear"
                    onClick={handleClear}
                    className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors cursor-pointer"
                    title="Clear All"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Language Selectors for Code Converter */}
              {active.hasLanguageSelect && (
                <div className="mb-4 flex flex-wrap gap-3">
                  <div className="flex-1 min-w-[140px]">
                    <label className="text-xs text-slate-400 mb-1.5 block font-medium">
                      Bahasa Asal
                    </label>
                    <select
                      id="select-from-lang"
                      value={fromLang}
                      onChange={(e) => setFromLang(e.target.value)}
                      className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-violet-500 transition-colors cursor-pointer appearance-none"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236366f1' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "right 12px center",
                      }}
                    >
                      {LANGUAGES.map((lang) => (
                        <option key={lang} value={lang} className="bg-[#1a1a2e]">
                          {lang}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-end pb-2.5 text-violet-400">
                    <ArrowRightLeft className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-[140px]">
                    <label className="text-xs text-slate-400 mb-1.5 block font-medium">
                      Bahasa Tujuan
                    </label>
                    <select
                      id="select-to-lang"
                      value={toLang}
                      onChange={(e) => setToLang(e.target.value)}
                      className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-violet-500 transition-colors cursor-pointer appearance-none"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236366f1' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "right 12px center",
                      }}
                    >
                      {LANGUAGES.map((lang) => (
                        <option key={lang} value={lang} className="bg-[#1a1a2e]">
                          {lang}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Input Section */}
              <div className="mb-6 relative">
                <div className="relative group">
                  <textarea
                    ref={textareaRef}
                    id="input-code"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={active.placeholder}
                    rows={8}
                    className="w-full bg-black/20 border border-white/10 rounded-xl p-4 pb-10 text-sm text-slate-200 placeholder-slate-600 font-mono focus:outline-none focus:border-violet-500 focus:bg-black/40 resize-none transition-all shadow-inner"
                  />
                  <div className="absolute bottom-3 right-4 text-xs font-mono text-slate-500 pointer-events-none flex items-center gap-3">
                    <span className="hidden md:inline-block border border-slate-700 bg-slate-800/50 rounded px-1.5 py-0.5">
                      Ctrl+Enter
                    </span>
                    <span
                      className={
                        input.length < 5 && input.length > 0
                          ? "text-red-400"
                          : ""
                      }
                    >
                      {input.length} chars
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                id="btn-generate"
                onClick={handleGenerate}
                disabled={loading || !isValidInput}
                className={`w-full py-3.5 rounded-xl flex items-center justify-center font-semibold text-sm transition-all duration-300 cursor-pointer ${
                  loading || !isValidInput
                    ? "bg-white/5 text-slate-500 cursor-not-allowed border border-white/5"
                    : "bg-violet-600 hover:bg-violet-500 text-white shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] border border-violet-500/50"
                }`}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Analyze
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
                      <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5 mr-3 shrink-0" />
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
                      <div className="flex items-center gap-3 text-xs font-mono">
                        <span className="flex items-center text-emerald-400/80">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                          {"// output generated"}
                        </span>
                        {responseTime !== null && (
                          <span className="flex items-center gap-1 text-slate-500">
                            <Timer className="w-3 h-3" />
                            Generated in {responseTime}s
                          </span>
                        )}
                      </div>
                      <button
                        id="btn-copy"
                        onClick={handleCopy}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-white/10 transition-colors border border-transparent hover:border-white/10 cursor-pointer"
                      >
                        {copied ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                        {copied ? "Copied" : "Copy"}
                      </button>
                    </div>
                    <div className="rounded-xl overflow-hidden border border-white/10 text-sm shadow-2xl relative group">
                      {active.id === "converter" ? (
                        <SyntaxHighlighter
                          language={getOutputLanguage()}
                          style={vscDarkPlus}
                          customStyle={{
                            margin: 0,
                            padding: "1.5rem",
                            background: "rgba(0,0,0,0.4)",
                            wordBreak: "break-word",
                            whiteSpace: "pre-wrap",
                          }}
                          wrapLines={true}
                          wrapLongLines={true}
                          lineProps={{ style: { wordBreak: 'break-word', whiteSpace: 'pre-wrap' } }}
                        >
                          {output}
                        </SyntaxHighlighter>
                      ) : (
                        <div className="p-6 bg-black/40 text-slate-200 prose prose-invert prose-violet max-w-none prose-pre:p-0 prose-pre:bg-transparent">
                          <ReactMarkdown 
                            remarkPlugins={[remarkGfm, remarkBreaks]}
                            components={{
                              code: CodeBlock
                            }}
                          >
                            {output}
                          </ReactMarkdown>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-auto pt-8 pb-4 text-center text-xs text-slate-600"
        >
          AI Code Analyzer — Tugas NLP Kasus 4: Code Generation
        </motion.footer>
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