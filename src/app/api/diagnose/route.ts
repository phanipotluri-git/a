import { streamChat, ollamaUnavailableResponse } from "@/lib/ollama";
import { DIAGNOSE_SYSTEM_PROMPT } from "@/lib/prompts";

export async function POST(req: Request) {
  const { symptoms } = (await req.json()) as { symptoms: string };
  if (!symptoms || symptoms.trim().length < 5) {
    return Response.json({ error: "symptoms required", code: "INVALID_INPUT" }, { status: 400 });
  }
  try {
    return await streamChat(
      [{ role: "user", content: `Farmer reports: ${symptoms.trim()}` }],
      DIAGNOSE_SYSTEM_PROMPT
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes("ECONNREFUSED") || msg.includes("TimeoutError") || msg.includes("fetch failed")) {
      return ollamaUnavailableResponse();
    }
    return Response.json({ error: msg, code: "STREAM_ERROR" }, { status: 500 });
  }
}
