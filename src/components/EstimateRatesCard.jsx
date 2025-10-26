function Stat({ label, value }) {
  return (
    <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
      <div className="text-xs text-slate-500">{label}</div>
      <div className="text-lg font-semibold mt-1">{value}</div>
    </div>
  );
}

export default function EstimateRatesCard({ user, data, commission, onDownloadPDF, onAutoApply }) {
  const { handle, followers, avg_likes, engagement_rate, tags, top_location, estimated_rates, confidence } = data;
  const disabledAutoApply = !user || !user.onboardingComplete;
  const disabledReason = !user
    ? "Login to enable Auto-Apply"
    : !user.onboardingComplete
    ? "Complete onboarding to enable Auto-Apply"
    : "";

  const feePost = commission.calc(estimated_rates.post);
  const feeStory = commission.calc(estimated_rates.story);
  const feeReel = commission.calc(estimated_rates.reel);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold">@{handle} — Rate Card Preview</h3>
          <p className="text-sm text-slate-500">Confidence: {(confidence * 100).toFixed(0)}% • Top location: {top_location}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onDownloadPDF}
            className="px-3 py-2 rounded-lg border border-slate-200 text-sm hover:bg-slate-50"
          >
            Download rate-card PDF
          </button>
          <button
            onClick={onAutoApply}
            disabled={disabledAutoApply}
            title={disabledReason}
            className="px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-medium disabled:opacity-50 hover:bg-slate-800"
          >
            Auto-Apply
          </button>
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <Stat label="Followers" value={followers.toLocaleString()} />
        <Stat label="Avg likes" value={avg_likes.toLocaleString()} />
        <Stat label="Engagement" value={`${engagement_rate}%`} />
        <Stat label="Tags" value={tags?.slice(0, 3).join(", ") || "—"} />
      </div>

      <div className="px-6 pb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-slate-200">
          <div className="text-sm font-medium">Instagram Post</div>
          <div className="mt-1 text-2xl font-bold">₹{estimated_rates.post.toLocaleString()}</div>
          <p className="text-xs text-slate-500 mt-1">
            Platform fee {commission.feePct}%: ₹{feePost.fee.toLocaleString()} • Net to creator: ₹{feePost.net.toLocaleString()}
          </p>
        </div>
        <div className="p-4 rounded-xl border border-slate-200">
          <div className="text-sm font-medium">Story</div>
          <div className="mt-1 text-2xl font-bold">₹{estimated_rates.story.toLocaleString()}</div>
          <p className="text-xs text-slate-500 mt-1">
            Platform fee {commission.feePct}%: ₹{feeStory.fee.toLocaleString()} • Net to creator: ₹{feeStory.net.toLocaleString()}
          </p>
        </div>
        <div className="p-4 rounded-xl border border-slate-200">
          <div className="text-sm font-medium">Reel</div>
          <div className="mt-1 text-2xl font-bold">₹{estimated_rates.reel.toLocaleString()}</div>
          <p className="text-xs text-slate-500 mt-1">
            Platform fee {commission.feePct}%: ₹{feeReel.fee.toLocaleString()} • Net to creator: ₹{feeReel.net.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="px-6 pb-6">
        <div className="rounded-lg bg-slate-50 border border-slate-200 p-4 text-sm text-slate-600">
          Note: Payments use escrow to protect both sides. Commission shown here is indicative and will be finalized in the Offer flow.
        </div>
      </div>
    </div>
  );
}
