import { streamChat, ollamaUnavailableResponse } from "@/lib/ollama";
import { CHAT_SYSTEM_PROMPT } from "@/lib/prompts";
import type { OllamaMessage } from "@/lib/types";

export async function POST(req: Request) {
  const { messages } = (await req.json()) as { messages: OllamaMessage[] };
  if (!messages?.length) {
    return Response.json({ error: "messages required", code: "INVALID_INPUT" }, { status: 400 });
  }
  try {
    return await streamChat(messages, CHAT_SYSTEM_PROMPT);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes("ECONNREFUSED") || msg.includes("TimeoutError") || msg.includes("fetch failed")) {
      return ollamaUnavailableResponse();
    }
    return Response.json({ error: msg, code: "STREAM_ERROR" }, { status: 500 });
  }
}
