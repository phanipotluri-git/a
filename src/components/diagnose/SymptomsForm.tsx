"use client";

import { useState } from "react";

interface Props {
  onSubmit: (symptoms: string) => void;
  disabled?: boolean;
}

const EXAMPLES = [
  "White spots on the shell, shrimp are lethargic and dying rapidly",
  "Shrimp have red coloration on legs and body, reduced feeding",
  "Black gills, shrimp near surface, poor water appearance",
  "Soft shell, shrimp not growing well, very low survival",
];

export default function SymptomsForm({ onSubmit, disabled }: Props) {
  const [value, setValue] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (value.trim().length >= 10) onSubmit(value.trim());
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Describe the symptoms you are observing
        </label>
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          rows={5}
          disabled={disabled}
          placeholder="Describe what you see: appearance of shrimp, behavior changes, mortality rate, how long it's been happening, pond size, days of culture..."
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-300 disabled:opacity-50"
        />
        {value.length > 0 && value.trim().length < 10 && (
          <p className="mt-1 text-xs text-red-500">Please provide more detail (at least 10 characters)</p>
        )}
      </div>

      <div>
        <p className="mb-2 text-xs font-medium text-gray-500">Quick examples:</p>
        <div className="flex flex-wrap gap-2">
          {EXAMPLES.map((ex) => (
            <button
              key={ex}
              type="button"
              onClick={() => setValue(ex)}
              className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs text-gray-600 hover:border-teal-300 hover:text-teal-700"
            >
              {ex.slice(0, 40)}…
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={disabled || value.trim().length < 10}
        className="w-full rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-teal-700 disabled:opacity-50"
      >
        {disabled ? "Diagnosing..." : "Get Diagnosis"}
      </button>
    </form>
  );
}
