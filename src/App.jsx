import { useEffect, useMemo, useState } from "react";
import Header from "./components/Header";
import HeroPasteWidget from "./components/HeroPasteWidget";
import LoginModal from "./components/LoginModal";
import EstimateRatesCard from "./components/EstimateRatesCard";

// Utility to extract IG handle from a URL or raw handle string
const extractHandle = (input) => {
  if (!input) return "";
  try {
    // If user pasted a URL
    if (input.includes("instagram.com")) {
      const url = new URL(input.startsWith("http") ? input : `https://${input}`);
      const parts = url.pathname.split("/").filter(Boolean);
      return parts[0] || "";
    }
  } catch (_) {
    // fall back to raw parsing
  }
  // Remove @ and spaces
  return input.replace(/^@/, "").trim();
};

const mockAnalyze = async (handle) => {
  // Simulate API latency
  await new Promise((r) => setTimeout(r, 900));
  // Mock response as per spec
  return {
    handle: handle || "clean_eating_2406",
    followers: 42000,
    avg_likes: 2300,
    engagement_rate: 5.5,
    top_location: "Hyderabad, India",
    tags: ["health", "food", "recipes"],
    estimated_rates: { post: 7000, story: 1800, reel: 12000 },
    confidence: 0.86,
  };
};

export default function App() {
  const [user, setUser] = useState(null); // {id, name, email, role, onboardingComplete, bankAdded}
  const [showLogin, setShowLogin] = useState(false);
  const [analyzeInput, setAnalyzeInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const isLoggedIn = !!user;

  const handleAnalyze = async (raw) => {
    setError("");
    const handle = extractHandle(raw);
    if (!handle) {
      setError("Please paste a valid Instagram link or handle.");
      return;
    }

    if (!isLoggedIn) {
      setShowLogin(true);
      // Continue flow after login via onSuccess
      return;
    }

    setLoading(true);
    setResult(null);
    try {
      // In real app: await fetch('/api/analyze', { method: 'POST', body: JSON.stringify({ handle }) })
      const data = await mockAnalyze(handle);
      setResult(data);
    } catch (e) {
      setError("Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const continueAnalyzeAfterLogin = async () => {
    const handle = extractHandle(analyzeInput);
    if (!handle) return;
    setLoading(true);
    setResult(null);
    try {
      const data = await mockAnalyze(handle);
      setResult(data);
    } catch (e) {
      setError("Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const commission = useMemo(() => {
    // Example platform fee breakdown used in EstimateRatesCard
    return {
      feePct: 10,
      calc: (amount) => {
        const fee = Math.round((amount * 10) / 100);
        const net = amount - fee;
        return { fee, net };
      },
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 text-slate-900">
      <Header
        user={user}
        onSignInClick={() => setShowLogin(true)}
        onSignOut={() => {
          setUser(null);
          setResult(null);
        }}
      />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <section className="pt-16 sm:pt-20 md:pt-28">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
              Paste your Instagram link — get brands, earn with one click
            </h1>
            <p className="mt-4 text-slate-600 text-base sm:text-lg">
              No account required — paste link to get a free rate-card. Login required to apply.
            </p>
          </div>
          <div className="mt-8 max-w-2xl mx-auto">
            <HeroPasteWidget
              placeholder="https://instagram.com/your_handle"
              value={analyzeInput}
              onChange={setAnalyzeInput}
              onAnalyze={(val) => {
                setAnalyzeInput(val);
                handleAnalyze(val);
              }}
              loading={loading}
              error={error}
            />
          </div>

          {/* Results */}
          <div className="mt-10 grid grid-cols-1 gap-6">
            {loading && (
              <div className="animate-pulse rounded-xl border border-slate-200 bg-white p-6">
                <div className="h-4 w-40 bg-slate-200 rounded" />
                <div className="mt-4 grid grid-cols-3 gap-4">
                  <div className="h-24 bg-slate-100 rounded" />
                  <div className="h-24 bg-slate-100 rounded" />
                  <div className="h-24 bg-slate-100 rounded" />
                </div>
              </div>
            )}

            {result && (
              <EstimateRatesCard
                user={user}
                data={result}
                commission={commission}
                onDownloadPDF={() => alert("PDF download will be implemented in backend integration.")}
                onAutoApply={() => {
                  if (!user) return;
                  // In real app: POST /api/applications/bulk
                  alert(
                    `Auto-Apply started for @${result.handle}. This will send templated pitches to matching brands.\n\n(Mock)`
                  );
                }}
              />
            )}
          </div>
        </section>
      </main>

      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onSuccess={(profile) => {
            setUser(profile);
            setShowLogin(false);
            if (analyzeInput) {
              continueAnalyzeAfterLogin();
            }
          }}
        />
      )}

      {/* Floating context CTA example */}
      {result && (
        <div className="fixed bottom-5 right-5">
          <button
            className="rounded-full bg-slate-900 text-white px-5 py-3 shadow-lg hover:bg-slate-800 active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400"
            onClick={() => {
              if (!user) {
                setShowLogin(true);
                return;
              }
              alert("Your preferences and auto-apply settings will be available in the dashboard in the full app.");
            }}
          >
            Save & Auto-Apply
          </button>
        </div>
      )}
    </div>
  );
}
