import { useState } from "react";

export default function HeroPasteWidget({ placeholder, onAnalyze, value, onChange, loading, error }) {
  const [focused, setFocused] = useState(false);

  return (
    <div className="w-full">
      <label htmlFor="ig-link" className="sr-only">
        Instagram link or handle
      </label>
      <div
        className={`flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-2 rounded-xl border ${
          focused ? "border-slate-400 ring-2 ring-slate-200" : "border-slate-200"
        } bg-white shadow-sm`}
      >
        <input
          id="ig-link"
          name="ig-link"
          type="text"
          inputMode="url"
          placeholder={placeholder}
          value={value}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={(e) => onChange?.(e.target.value)}
          className="flex-1 min-w-0 rounded-lg px-3 py-3 outline-none text-slate-900 placeholder:text-slate-400"
          aria-describedby={error ? "ig-error" : undefined}
        />
        <button
          onClick={() => onAnalyze?.(value)}
          disabled={!value || loading}
          className="whitespace-nowrap rounded-lg bg-slate-900 text-white px-4 py-3 font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-800"
        >
          {loading ? "Analyzing..." : "Analyze profile"}
        </button>
      </div>
      <p className="mt-2 text-sm text-slate-500">No account required — paste link to get a free rate-card. Login required to apply.</p>
      {error ? (
        <p id="ig-error" className="mt-2 text-sm text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}
