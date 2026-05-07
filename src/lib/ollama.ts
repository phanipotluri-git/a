import type { OllamaMessage } from "./types";

const BASE_URL = process.env.OLLAMA_BASE_URL ?? "http://localhost:11434";
const MODEL = process.env.OLLAMA_MODEL ?? "llama3.2";

export async function checkHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${BASE_URL}/api/tags`, {
      signal: AbortSignal.timeout(5000),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function streamChat(
  messages: OllamaMessage[],
  systemPrompt: string
): Promise<Response> {
  const allMessages = [
    { role: "system", content: systemPrompt },
    ...messages,
  ];

  const ollamaRes = await fetch(`${BASE_URL}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: MODEL,
      messages: allMessages,
      stream: true,
    }),
    signal: AbortSignal.timeout(60000),
  });

  if (!ollamaRes.ok) {
    const text = await ollamaRes.text();
    throw new Error(`Ollama error ${ollamaRes.status}: ${text}`);
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const reader = ollamaRes.body!.getReader();
      const decoder = new TextDecoder();
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const lines = decoder.decode(value, { stream: true }).split("\n").filter(Boolean);
          for (const line of lines) {
            try {
              const parsed = JSON.parse(line);
              const chunk = parsed?.message?.content;
              if (chunk) {
                controller.enqueue(encoder.encode(chunk));
              }
            } catch {
              // skip malformed lines
            }
          }
        }
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

export function ollamaUnavailableResponse(hint?: string): Response {
  return Response.json(
    {
      error:
        hint ??
        "Ollama is not running. Start it with: ollama serve — then load a model: ollama pull llama3.2",
      code: "OLLAMA_UNAVAILABLE",
    },
    { status: 503 }
  );
}
