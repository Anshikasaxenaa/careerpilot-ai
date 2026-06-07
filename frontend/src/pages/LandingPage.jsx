import { Link } from 'react-router-dom';
import { ArrowRight, Brain, FileText, Code2, BarChart3, Zap, Shield, Star } from 'lucide-react';

const features = [
  { icon: Brain, title: 'AI Mock Interviews', desc: 'Dynamic questions with real-time evaluation. Get scored on technical depth, communication, and confidence.', color: 'from-brand-500 to-purple-500' },
  { icon: FileText, title: 'Resume Analysis', desc: 'ATS scoring, skill gap detection, and AI-powered suggestions to make your resume stand out.', color: 'from-cyan-500 to-blue-500' },
  { icon: Code2, title: 'Coding Challenges', desc: 'LeetCode-style problems with Monaco editor, test cases, and AI code review with complexity analysis.', color: 'from-green-500 to-emerald-500' },
  { icon: BarChart3, title: 'Performance Analytics', desc: 'Track your progress with heatmaps, topic-wise scores, and improvement trends.', color: 'from-orange-500 to-red-500' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white overflow-hidden">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-white/5 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-purple-500 flex items-center justify-center font-bold text-lg shadow-lg shadow-brand-500/30">P</div>
          <span className="text-xl font-bold">PrepAI</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="btn-ghost text-sm">Login</Link>
          <Link to="/register" className="btn-primary text-sm">Get Started Free</Link>
        </div>
      </nav>

      {/* Hero */}
      <div className="relative max-w-7xl mx-auto px-8 pt-24 pb-20 text-center">
        <div className="orb w-[600px] h-[600px] bg-brand-600/10 top-0 left-1/2 -translate-x-1/2" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand-500/30 bg-brand-500/10 text-brand-400 text-sm font-medium mb-8">
            <Zap size={14} />
            <span>AI-Powered Interview Preparation</span>
          </div>
          <h1 className="text-6xl md:text-7xl font-bold leading-tight mb-6">
            Ace Every Interview<br />
            <span className="gradient-text">with AI by Your Side</span>
          </h1>
          <p className="text-slate-400 text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            From resume analysis to mock interviews and coding challenges — PrepAI prepares you for the job you deserve.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link to="/register" className="btn-primary flex items-center gap-2 text-base px-8 py-4">
              Start Preparing Free <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="btn-ghost text-base px-8 py-4">Sign In</Link>
          </div>
          {/* Stats */}
          <div className="flex items-center justify-center gap-12 mt-16 pt-12 border-t border-white/5">
            {[['50,000+', 'Mock Interviews'], ['94%', 'Placement Rate'], ['200+', 'Target Companies'], ['4.9★', 'User Rating']].map(([v, l]) => (
              <div key={l} className="text-center">
                <div className="text-3xl font-bold gradient-text">{v}</div>
                <div className="text-slate-500 text-sm mt-1">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-7xl mx-auto px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Everything you need to succeed</h2>
          <p className="text-slate-400 text-lg">A complete preparation ecosystem powered by AI</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map(({ icon: Icon, title, desc, color }) => (
            <div key={title} className="glass-card p-8 hover:border-brand-500/20 transition-all duration-300 group hover:-translate-y-1">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform`}>
                <Icon size={22} className="text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">{title}</h3>
              <p className="text-slate-400 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-4xl mx-auto px-8 py-20 text-center">
        <div className="glass-card p-12 relative overflow-hidden">
          <div className="orb w-64 h-64 bg-brand-500/20 top-0 right-0" />
          <Shield size={48} className="text-brand-400 mx-auto mb-6 relative z-10" />
          <h2 className="text-3xl font-bold mb-4 relative z-10">Ready to land your dream job?</h2>
          <p className="text-slate-400 mb-8 relative z-10">Join thousands of developers who cracked top-tier interviews with PrepAI.</p>
          <Link to="/register" className="btn-primary inline-flex items-center gap-2 text-base px-8 py-4 relative z-10">
            Get Started for Free <ArrowRight size={18} />
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-white/5 py-8 text-center text-slate-600 text-sm">
        © {new Date().getFullYear()} PrepAI. Built to get you hired.
      </div>
    </div>
  );
}
