import type { FeedingResult as FR } from "@/lib/types";

interface Props {
  result: FR;
}

export default function FeedingResult({ result }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {[
        { label: "Total Biomass",  value: `${result.totalBiomassKg} kg`,    icon: "⚖️" },
        { label: "Daily Feed",     value: `${result.dailyFeedKg} kg/day`,   icon: "📦" },
        { label: "Per Meal",       value: `${result.feedPerMealG} g`,       icon: "🥄" },
        { label: "Meals Per Day",  value: `${result.mealsPerDay} meals`,    icon: "🕐" },
      ].map(({ label, value, icon }) => (
        <div key={label} className="rounded-lg border border-teal-100 bg-teal-50 p-3 text-center">
          <div className="text-xl">{icon}</div>
          <div className="mt-1 text-lg font-bold text-teal-700">{value}</div>
          <div className="text-xs text-gray-500">{label}</div>
        </div>
      ))}
    </div>
  );
}
