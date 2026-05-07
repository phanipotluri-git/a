import { checkHealth } from "@/lib/ollama";

export async function GET() {
  const ok = await checkHealth();
  if (ok) {
    return Response.json({ status: "ok" });
  }
  return Response.json({ status: "offline" }, { status: 503 });
}
