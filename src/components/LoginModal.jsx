import { useEffect, useMemo, useState } from "react";

const defaultTags = ["fashion", "beauty", "tech", "fitness", "food", "travel", "gaming"];

export default function LoginModal({ onClose, onSuccess }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    role: "Influencer",
    tags: [],
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const canContinue = useMemo(() => {
    if (!form.name || !form.email || !form.role) return false;
    return true;
  }, [form]);

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose?.();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const validate = () => {
    const errs = {};
    if (!form.name) errs.name = "Name is required";
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Valid email required";
    if (!form.role) errs.role = "Select a type";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const submit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      // Simulate API signup and session persist
      // Real integration: POST /api/auth/signup → returns JWT + user
      await new Promise((r) => setTimeout(r, 900));
      const profile = {
        id: "u_" + Math.random().toString(36).slice(2, 8),
        name: form.name,
        email: form.email,
        role: form.role,
        location: form.location,
        tags: form.tags,
        onboardingComplete: true,
        bankAdded: false,
      };
      onSuccess?.(profile);
    } catch (e) {
      setErrors({ submit: "Signup failed. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-slate-900/50" onClick={onClose} />
      <div className="absolute inset-x-0 top-8 sm:top-16 mx-auto w-[92%] sm:w-[560px] bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Quick Onboard</h2>
          <button onClick={onClose} aria-label="Close" className="text-slate-500 hover:text-slate-900">×</button>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Full name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-slate-300"
                placeholder="Jane Doe"
              />
              {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-slate-300"
                placeholder="you@example.com"
              />
              {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Location</label>
              <input
                type="text"
                value={form.location}
                onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-slate-300"
                placeholder="City, State, Country"
              />
            </div>
            <div>
              <span className="block text-sm font-medium mb-1">Type</span>
              <div className="flex gap-4">
                {[
                  { label: "Influencer", value: "Influencer" },
                  { label: "Brand/Business", value: "Brand" },
                ].map((opt) => (
                  <label key={opt.value} className="flex items-center gap-2 text-sm">
                    <input
                      type="radio"
                      name="role"
                      value={opt.value}
                      checked={form.role === opt.value}
                      onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
              {errors.role && <p className="text-sm text-red-600 mt-1">{errors.role}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tags</label>
              <div className="flex flex-wrap gap-2">
                {defaultTags.map((t) => {
                  const selected = form.tags.includes(t);
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() =>
                        setForm((f) => ({
                          ...f,
                          tags: selected ? f.tags.filter((x) => x !== t) : [...f.tags, t],
                        }))
                      }
                      className={`px-3 py-1 rounded-full border text-sm ${
                        selected ? "bg-slate-900 text-white border-slate-900" : "border-slate-300"
                      }`}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Password (or use magic link)</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-slate-300"
                placeholder="••••••••"
              />
            </div>
          </div>
          {errors.submit && <p className="text-sm text-red-600">{errors.submit}</p>}
        </div>

        <div className="px-6 pb-6 flex items-center justify-between gap-3">
          <p className="text-xs text-slate-500">By continuing, you agree to our Terms & Privacy Policy.</p>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-200 text-sm hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              onClick={submit}
              disabled={!canContinue || submitting}
              className="px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-medium disabled:opacity-50 hover:bg-slate-800"
            >
              {submitting ? "Creating..." : "Continue"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
