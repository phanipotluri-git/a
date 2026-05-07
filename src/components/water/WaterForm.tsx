"use client";

import { useState } from "react";
import type { WaterParams } from "@/lib/types";

interface Props {
  onSubmit: (params: WaterParams) => void;
  disabled?: boolean;
}

const OPTIMAL: Record<keyof WaterParams, [number, number]> = {
  ph:              [7.5, 8.5],
  salinity:        [10, 30],
  dissolvedOxygen: [4, 20],
  temperature:     [23, 30],
  ammonia:         [0, 0.1],
};

const FIELDS: { key: keyof WaterParams; label: string; unit: string; hint: string; min: number; max: number; step: number }[] = [
  { key: "ph",              label: "pH",                  unit: "",       hint: "7.5–8.5 optimal",   min: 0,  max: 14,  step: 0.1  },
  { key: "salinity",        label: "Salinity",            unit: "ppt",    hint: "10–30 optimal",     min: 0,  max: 50,  step: 0.5  },
  { key: "dissolvedOxygen", label: "Dissolved Oxygen",    unit: "mg/L",   hint: ">4 optimal",        min: 0,  max: 20,  step: 0.1  },
  { key: "temperature",     label: "Temperature",         unit: "°C",     hint: "23–30 optimal",     min: 0,  max: 45,  step: 0.1  },
  { key: "ammonia",         label: "Ammonia (TAN)",       unit: "mg/L",   hint: "<0.1 optimal",      min: 0,  max: 5,   step: 0.01 },
];

const DEFAULT: WaterParams = { ph: 7.8, salinity: 20, dissolvedOxygen: 5, temperature: 27, ammonia: 0.05 };

function isOutOfRange(key: keyof WaterParams, value: number): boolean {
  const [lo, hi] = OPTIMAL[key];
  return value < lo || value > hi;
}

export default function WaterForm({ onSubmit, disabled }: Props) {
  const [values, setValues] = useState<WaterParams>(DEFAULT);

  function set(key: keyof WaterParams, raw: string) {
    setValues((prev) => ({ ...prev, [key]: parseFloat(raw) || 0 }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit(values);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        {FIELDS.map(({ key, label, unit, hint, min, max, step }) => {
          const outOfRange = isOutOfRange(key, values[key]);
          return (
            <div key={key}>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                {label} {unit && <span className="text-gray-400">({unit})</span>}
              </label>
              <input
                type="number"
                value={values[key]}
                onChange={(e) => set(key, e.target.value)}
                min={min}
                max={max}
                step={step}
                className={`w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 ${
                  outOfRange
                    ? "border-red-400 bg-red-50 focus:ring-red-300"
                    : "border-gray-300 bg-white focus:ring-teal-300"
                }`}
              />
              <p className={`mt-0.5 text-xs ${outOfRange ? "text-red-500 font-medium" : "text-gray-400"}`}>
                {outOfRange ? `⚠ Out of range — ` : ""}{hint}
              </p>
            </div>
          );
        })}
      </div>
      <button
        type="submit"
        disabled={disabled}
        className="w-full rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-teal-700 disabled:opacity-50"
      >
        {disabled ? "Analyzing..." : "Analyze Water Quality"}
      </button>
    </form>
  );
}
