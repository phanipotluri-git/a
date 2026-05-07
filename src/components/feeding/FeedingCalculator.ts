import type { FeedingInputs, FeedingResult } from "@/lib/types";

const SUGGESTED_RATES: Record<FeedingInputs["growthStage"], number> = {
  juvenile:     9,
  intermediate: 6,
  adult:        3.5,
};

const MEALS_PER_DAY: Record<FeedingInputs["growthStage"], number> = {
  juvenile:     4,
  intermediate: 3,
  adult:        2,
};

export function getSuggestedRate(stage: FeedingInputs["growthStage"]): number {
  return SUGGESTED_RATES[stage];
}

export function calculate(inputs: FeedingInputs): FeedingResult {
  const totalBiomassKg = (inputs.shrimpCount * inputs.avgWeightG) / 1000;
  const dailyFeedKg = (totalBiomassKg * inputs.feedingRatePercent) / 100;
  const mealsPerDay = MEALS_PER_DAY[inputs.growthStage];
  const feedPerMealG = (dailyFeedKg * 1000) / mealsPerDay;

  return {
    totalBiomassKg: Math.round(totalBiomassKg * 100) / 100,
    dailyFeedKg:    Math.round(dailyFeedKg * 1000) / 1000,
    feedPerMealG:   Math.round(feedPerMealG * 10) / 10,
    mealsPerDay,
    suggestedFeedingRate: getSuggestedRate(inputs.growthStage),
  };
}
