import { NextRequest, NextResponse } from "next/server";

const LANGUAGES = [
  "Python", "JavaScript", "TypeScript", "Java", "Go", "PHP", "C++", "Rust", "Swift", "Kotlin",
];

const PROMPTS: Record<string, (input: string, options?: Record<string, string>) => string> = {
  converter: (input, opts) => {
    const from = opts?.fromLang ?? "Python";
    const to = opts?.toLang ?? "JavaScript";
    return `Kamu adalah asisten code converter profesional. Konversi kode berikut dari ${from} ke ${to}. Hanya tulis kode hasil konversi, tanpa penjelasan tambahan.\n\nKode ${from}:\n${input}`;
  },
  explainer: (input) =>
    `Kamu adalah asisten code explainer. Jelaskan kode berikut baris per baris dalam Bahasa Indonesia yang mudah dipahami. Gunakan format yang rapi dengan penomoran baris.\n\nKode:\n${input}`,
  bugfinder: (input) =>
    `Kamu adalah asisten debugging. Analisis kode berikut dan cari bug yang ada. Jika tidak ada bug sama sekali, cukup jawab "✅ Code looks good! Tidak ditemukan bug pada kode ini." Jika ada bug, jelaskan: (1) apa bug-nya, (2) di baris mana, (3) kenapa itu bug, dan (4) berikan kode perbaikannya. Jawab dalam Bahasa Indonesia.\n\nKode:\n${input}`,
  review: (input) =>
    `Kamu adalah asisten code reviewer profesional. Review kode berikut dan berikan:\n1. Skor kualitas (1-10)\n2. Kelebihan kode (dalam bentuk list)\n3. Kelemahan kode (dalam bentuk list)\n4. Saran perbaikan (dalam bentuk list)\n\nGunakan Bahasa Indonesia dan format yang rapi.\n\nKode:\n${input}`,
  security: (input) =>
    `Kamu adalah asisten security auditor. Identifikasi potensi bug, vulnerability, dan security issue pada kode berikut. Berikan:\n1. Daftar issue yang ditemukan beserta severity (Critical/High/Medium/Low)\n2. Penjelasan mengapa itu berbahaya\n3. Rekomendasi perbaikan untuk setiap issue\n\nGunakan Bahasa Indonesia dan format yang rapi.\n\nKode:\n${input}`,
};

export async function POST(req: NextRequest) {
  const { usecase, input, fromLang, toLang } = await req.json();

  const promptFn = PROMPTS[usecase];
  if (!promptFn) {
    return NextResponse.json({ error: "Invalid usecase" }, { status: 400 });
  }

  if (!input || typeof input !== "string" || input.trim().length < 5) {
    return NextResponse.json({ error: "Input terlalu pendek (minimal 5 karakter)" }, { status: 400 });
  }

  // Validate languages for converter
  if (usecase === "converter") {
    if (fromLang && !LANGUAGES.includes(fromLang)) {
      return NextResponse.json({ error: `Bahasa asal tidak valid: ${fromLang}` }, { status: 400 });
    }
    if (toLang && !LANGUAGES.includes(toLang)) {
      return NextResponse.json({ error: `Bahasa tujuan tidak valid: ${toLang}` }, { status: 400 });
    }
  }

  const prompt = promptFn(input, { fromLang, toLang });

  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        temperature: 0.2,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!res.ok) {
      const errorText = await res.text().catch(() => res.statusText);
      return NextResponse.json(
        { error: `API Error (${res.status}): ${errorText}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    const raw: string = data.choices?.[0]?.message?.content ?? "";

    // Sanitize: remove markdown fences only for converter
    let clean = raw;
    if (usecase === "converter") {
      clean = raw.replace(/```[a-zA-Z0-9+-]*\n?|```/g, "").trim();
    } else {
      clean = raw.trim();
    }

    return NextResponse.json({ result: clean });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: `Server Error: ${message}` }, { status: 500 });
  }
}
