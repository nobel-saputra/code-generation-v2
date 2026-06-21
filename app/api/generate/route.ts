import { NextRequest, NextResponse } from "next/server";

const PROMPTS: Record<string, (input: string) => string> = {
  autocomplete: () =>
    `Kamu adalah asisten code generation. Lanjutkan kode Python berdasarkan komentar berikut. Hanya tulis kode, tanpa penjelasan.\n\n# Fungsi untuk menghitung Fibonacci ke-n dengan memoization`,
  generate: (input) =>
    `Kamu adalah asisten code generation. Tulis kode berdasarkan input berikut. Input bisa berupa kalimat biasa atau komentar kode. Hanya tulis kode, tanpa penjelasan.\n\nInput: ${input}`,
  sql: (input) =>
    `Kamu adalah asisten SQL. Ubah kalimat berikut menjadi query SQL. Hanya tulis query SQL, tanpa penjelasan.\n\nKalimat: ${input}`,
  refactor: (input) =>
    `Kamu adalah asisten refactoring. Perbaiki dan rapikan kode berikut tanpa mengubah fungsinya. Hanya tulis kode hasil refactor, tanpa penjelasan.\n\nKode: ${input}`,
  unittest: (input) =>
    `Kamu adalah asisten testing. Buatkan unit test Python menggunakan unittest untuk fungsi berikut. Hanya tulis kode unit test, tanpa penjelasan.\n\nFungsi: ${input}`,
  docs: (input) =>
    `Kamu adalah asisten dokumentasi. Tambahkan docstring dan komentar yang jelas pada kode berikut. Hanya tulis kode dengan dokumentasi, tanpa penjelasan tambahan.\n\nKode: ${input}`,
};

export async function POST(req: NextRequest) {
  const { usecase, input } = await req.json();

  const promptFn = PROMPTS[usecase];
  if (!promptFn) {
    return NextResponse.json({ error: "Invalid usecase" }, { status: 400 });
  }

  const prompt = promptFn(input ?? "");

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

  const data = await res.json();
  const raw: string = data.choices?.[0]?.message?.content ?? "";
  const clean = raw.replace(/```[a-zA-Z0-9+-]*\n?|```/g, "").trim();

  return NextResponse.json({ result: clean });
}