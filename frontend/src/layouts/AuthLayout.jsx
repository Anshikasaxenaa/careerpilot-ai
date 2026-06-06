import { Outlet, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function AuthLayout() {
  const { isAuthenticated } = useSelector(s => s.auth);
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex">
      <div className="hidden lg:flex w-1/2 relative flex-col items-center justify-center p-12 overflow-hidden">
        <div className="orb w-96 h-96 bg-brand-600/20 top-0 left-0" />
        <div className="orb w-72 h-72 bg-purple-600/15 bottom-20 right-10" />
        <div className="relative z-10 max-w-md">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-brand-500/30">P</div>
            <span className="text-2xl font-bold text-white">PrepAI</span>
          </div>
          <h1 className="text-4xl font-bold text-white leading-tight mb-6">
            Land your <span className="gradient-text">dream job</span> with AI-powered prep
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed mb-10">
            Master interviews with personalized AI feedback, real-time coding challenges, and intelligent performance analytics.
          </p>
          {[
            { icon: '🎯', text: 'AI Mock Interviews with real-time feedback' },
            { icon: '📄', text: 'Resume analysis with ATS scoring' },
            { icon: '💻', text: 'Coding challenges with AI code review' },
            { icon: '🗺️', text: 'Personalized learning roadmaps' },
          ].map(({ icon, text }) => (
            <div key={text} className="flex items-center gap-3 mb-4">
              <span className="text-xl">{icon}</span>
              <span className="text-slate-300 text-sm">{text}</span>
            </div>
          ))}
          <div className="grid grid-cols-3 gap-4 mt-10 pt-10 border-t border-white/10">
            {[['50K+', 'Interviews'], ['94%', 'Success Rate'], ['200+', 'Companies']].map(([n, l]) => (
              <div key={l} className="text-center">
                <div className="text-2xl font-bold gradient-text">{n}</div>
                <div className="text-slate-500 text-xs mt-1">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-purple-500 flex items-center justify-center text-white font-bold">P</div>
            <span className="text-xl font-bold text-white">PrepAI</span>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
