export default function Header({ user, onSignInClick, onSignOut }) {
  return (
    <header className="sticky top-0 z-30 backdrop-blur bg-white/75 border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-slate-900 text-white grid place-items-center font-bold">IB</div>
          <span className="font-semibold tracking-tight">InfluenceBridge</span>
        </div>
        <nav className="hidden sm:flex items-center gap-2">
          <a
            href="#brands"
            className="px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            For Brands
          </a>
          {!user ? (
            <button
              onClick={onSignInClick}
              className="px-4 py-2 rounded-md bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400"
            >
              Sign In
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600">Hi, {user.name}</span>
              <button
                onClick={onSignOut}
                className="px-3 py-2 rounded-md border border-slate-200 text-sm font-medium hover:bg-slate-50"
              >
                Sign Out
              </button>
            </div>
          )}
        </nav>
        <div className="sm:hidden">
          {!user ? (
            <button
              aria-label="Sign in"
              onClick={onSignInClick}
              className="px-3 py-2 rounded-md bg-slate-900 text-white text-sm font-medium"
            >
              Sign In
            </button>
          ) : (
            <button
              aria-label="Sign out"
              onClick={onSignOut}
              className="px-3 py-2 rounded-md border border-slate-200 text-sm"
            >
              Sign Out
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
