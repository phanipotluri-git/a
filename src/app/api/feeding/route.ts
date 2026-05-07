import { streamChat, ollamaUnavailableResponse } from "@/lib/ollama";
import { FEEDING_SYSTEM_PROMPT } from "@/lib/prompts";
import type { FeedingInputs, FeedingResult } from "@/lib/types";

export async function POST(req: Request) {
  const { inputs, calculated } = (await req.json()) as {
    inputs: FeedingInputs;
    calculated: FeedingResult;
  };
  if (!inputs || !calculated) {
    return Response.json({ error: "inputs and calculated required", code: "INVALID_INPUT" }, { status: 400 });
  }

  const stageLabel = { juvenile: "Juvenile (<2g)", intermediate: "Intermediate (2–10g)", adult: "Adult (>10g)" }[inputs.growthStage];

  const prompt = `Farmer details:
- Total shrimp: ${inputs.shrimpCount.toLocaleString()}
- Average weight: ${inputs.avgWeightG}g per shrimp
- Growth stage: ${stageLabel}
- Feeding rate used: ${inputs.feedingRatePercent}% of body weight per day
- Calculated total biomass: ${calculated.totalBiomassKg} kg
- Calculated daily feed: ${calculated.dailyFeedKg} kg/day
- Recommended: ${calculated.mealsPerDay} meals/day, ${calculated.feedPerMealG}g per meal

Please review this feeding plan and provide advice.`;

  try {
    return await streamChat([{ role: "user", content: prompt }], FEEDING_SYSTEM_PROMPT);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes("ECONNREFUSED") || msg.includes("TimeoutError") || msg.includes("fetch failed")) {
      return ollamaUnavailableResponse();
    }
    return Response.json({ error: msg, code: "STREAM_ERROR" }, { status: 500 });
  }
}
