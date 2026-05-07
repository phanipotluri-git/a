import { streamChat, ollamaUnavailableResponse } from "@/lib/ollama";
import { WATER_SYSTEM_PROMPT } from "@/lib/prompts";
import type { WaterParams } from "@/lib/types";

export async function POST(req: Request) {
  const { params } = (await req.json()) as { params: WaterParams };
  if (!params) {
    return Response.json({ error: "params required", code: "INVALID_INPUT" }, { status: 400 });
  }

  const prompt = `Water quality reading from my shrimp pond:
- pH: ${params.ph}
- Salinity: ${params.salinity} ppt
- Dissolved Oxygen (DO): ${params.dissolvedOxygen} mg/L
- Temperature: ${params.temperature} °C
- Ammonia (TAN): ${params.ammonia} mg/L

Please analyze these values and give me recommendations.`;

  try {
    return await streamChat([{ role: "user", content: prompt }], WATER_SYSTEM_PROMPT);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes("ECONNREFUSED") || msg.includes("TimeoutError") || msg.includes("fetch failed")) {
      return ollamaUnavailableResponse();
    }
    return Response.json({ error: msg, code: "STREAM_ERROR" }, { status: 500 });
  }
}
