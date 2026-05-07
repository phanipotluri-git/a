export interface Message {
  role: "user" | "assistant";
  content: string;
  id: string;
}

export interface WaterParams {
  ph: number;
  salinity: number;
  dissolvedOxygen: number;
  temperature: number;
  ammonia: number;
}

export interface FeedingInputs {
  shrimpCount: number;
  avgWeightG: number;
  growthStage: "juvenile" | "intermediate" | "adult";
  feedingRatePercent: number;
}

export interface FeedingResult {
  totalBiomassKg: number;
  dailyFeedKg: number;
  feedPerMealG: number;
  mealsPerDay: number;
  suggestedFeedingRate: number;
}

export interface ApiError {
  error: string;
  code: "OLLAMA_UNAVAILABLE" | "INVALID_INPUT" | "STREAM_ERROR";
}

export interface OllamaMessage {
  role: string;
  content: string;
}
