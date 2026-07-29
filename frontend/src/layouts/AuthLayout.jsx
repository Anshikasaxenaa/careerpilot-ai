import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";

export default function AuthLayout() {
  const { isAuthenticated } = useSelector((s) => s.auth);
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  const leftAnim = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };
  const rightAnim = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.1 } },
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full aurora-bg opacity-10 pointer-events-none z-0" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] bg-brand-500/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />

      {/* Left Branding Panel */}
      <motion.div
        className="hidden lg:flex w-[45%] relative flex-col items-center justify-center p-12 overflow-hidden border-r border-zinc-800/50 bg-zinc-900/40 backdrop-blur-3xl z-10"
        initial="hidden"
        animate="visible"
        variants={leftAnim}
      >
        <div className="absolute top-0 left-0 w-full h-full mesh-bg opacity-20" />
        <div className="orb w-[500px] h-[500px] bg-brand-500/20 top-[-10%] left-[-10%] mix-blend-screen blur-[100px]" />
        <div className="orb w-[400px] h-[400px] bg-cyan-500/15 bottom-[10%] right-[-10%] mix-blend-screen blur-[100px]" />
        
        <motion.div
          className="relative z-10 max-w-lg w-full"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <div className="flex items-center gap-3 mb-14">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white font-bold text-2xl shadow-glow">
              P
            </div>
            <span className="text-3xl font-display font-bold text-white tracking-tight">PrepAI</span>
          </div>
          
          <h1 className="text-5xl font-display font-bold text-white leading-[1.15] mb-8">
            Elevate your <br/>
            <span className="gradient-text text-glow">tech career</span> with <br/>
            intelligent prep.
          </h1>
          
          <p className="text-zinc-400 text-lg leading-relaxed mb-12 max-w-md">
            Master rigorous interviews with personalized AI feedback, elite coding challenges, and deep performance analytics.
          </p>
          
          <div className="space-y-6 mb-16">
            {[
              { icon: "🎯", text: "AI Mock Interviews with real-time feedback" },
              { icon: "📄", text: "Resume analysis with ATS scoring" },
              { icon: "💻", text: "Coding challenges with AI code review" },
              { icon: "🗺️", text: "Personalized learning roadmaps" },
            ].map(({ icon, text }) => (
              <div key={text} className="flex items-center gap-4 bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800/50 backdrop-blur-sm">
                <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-xl shadow-inner border border-zinc-700/50">{icon}</div>
                <span className="text-zinc-300 font-medium text-sm">{text}</span>
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-3 gap-6 pt-10 border-t border-zinc-800/80">
            {[
              ["50K+", "Interviews"],
              ["98%", "Success Rate"],
              ["200+", "Hiring Partners"],
            ].map(([n, l]) => (
              <div key={l}>
                <div className="text-3xl font-display font-bold text-white mb-1">{n}</div>
                <div className="text-brand-500 text-xs font-semibold uppercase tracking-wider">{l}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Right Content / Forms */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 z-10 relative">
        <motion.div
          className="w-full max-w-[440px]"
          initial="hidden"
          animate="visible"
          variants={rightAnim}
        >
          <div className="flex items-center gap-3 mb-10 lg:hidden justify-center">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white font-bold text-xl shadow-glow">
              P
            </div>
            <span className="text-2xl font-display font-bold text-white tracking-tight">PrepAI</span>
          </div>
          <Outlet />
        </motion.div>
      </div>
    </div>
  );
}
