import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import api from '@/services/api';
import { Brain, FileText, Code2, Map, TrendingUp, Target, Zap, ArrowRight, Play, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

const StatCard = ({ label, value, icon: Icon, color, shadow, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className="glass-card p-6 hover:-translate-y-1 transition-all duration-300 group cursor-default"
  >
    <div className="flex items-start justify-between mb-4">
      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg ${shadow} group-hover:scale-110 transition-transform`}>
        <Icon size={24} className="text-white" />
      </div>
      <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <ArrowRight size={14} className="text-white/50 -rotate-45" />
      </div>
    </div>
    <div className="text-3xl font-display font-bold text-white mb-1">{value}</div>
    <div className="text-slate-400 font-medium text-sm tracking-wide">{label}</div>
  </motion.div>
);

const QuickAction = ({ to, icon: Icon, title, desc, gradient, delay }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.4, delay }}
  >
    <Link to={to} className="glass-card p-5 flex items-center gap-5 hover:border-brand-500/30 hover:bg-white/[0.02] transition-all duration-300 group relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-700" />
      
      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all`}>
        <Icon size={26} className="text-white" />
      </div>
      <div className="flex-1">
        <div className="font-display font-bold text-slate-100 text-lg mb-0.5">{title}</div>
        <div className="text-slate-400 text-sm font-medium">{desc}</div>
      </div>
      <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-brand-500/20 transition-colors">
        <ArrowRight size={18} className="text-slate-500 group-hover:text-brand-400 group-hover:translate-x-1 transition-all" />
      </div>
    </Link>
  </motion.div>
);

export default function DashboardPage() {
  const { user } = useSelector(s => s.auth);
  const [analytics, setAnalytics] = useState(null);
  const [recentInterviews, setRecentInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/analytics/performance').catch(() => ({ data: null })),
      api.get('/interview?limit=3').catch(() => ({ data: { interviews: [] } })),
    ]).then(([analyticsRes, interviewRes]) => {
      setAnalytics(analyticsRes.data?.analytics);
      setRecentInterviews(interviewRes.data?.interviews || []);
    }).finally(() => setLoading(false));
  }, []);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="space-y-10 animate-fade-in relative">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-display font-bold text-white mb-2 tracking-tight">
            {greeting()}, <span className="gradient-text">{user?.name?.split(' ')[0]}</span> <span className="inline-block animate-blob origin-bottom">👋</span>
          </h1>
          <p className="text-slate-400 text-lg">Let's continue building your tech career.</p>
        </div>
        <Link to="/interview" className="btn-primary shadow-glow hover:shadow-glow-cyan w-full md:w-auto">
          <Play size={18} fill="currentColor" /> Start Quick Session
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard delay={0.1} label="Interviews Done" value={analytics?.overview?.totalInterviews ?? 0} icon={Brain} color="from-brand-400 to-brand-600" shadow="shadow-brand-500/20" />
        <StatCard delay={0.2} label="Average Score" value={`${analytics?.overview?.avgScore ?? 0}%`} icon={Target} color="from-cyan-400 to-blue-600" shadow="shadow-cyan-500/20" />
        <StatCard delay={0.3} label="Questions Solved" value={analytics?.overview?.totalQuestions ?? 0} icon={Zap} color="from-green-400 to-emerald-600" shadow="shadow-emerald-500/20" />
        <StatCard delay={0.4} label="ATS Match Rate" value={`${analytics?.resumeAtsScore ?? 0}%`} icon={FileText} color="from-orange-400 to-red-500" shadow="shadow-orange-500/20" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions Array */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <Activity size={20} className="text-brand-400" />
            <h2 className="text-xl font-display font-bold text-white">Suggested Next Steps</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <QuickAction delay={0.2} to="/interview" icon={Brain} title="Mock Interview" desc="Practice with AI interviewer" gradient="from-brand-500 to-purple-600" />
            <QuickAction delay={0.3} to="/resume" icon={FileText} title="Resume Review" desc="Get ATS score & feedback" gradient="from-cyan-500 to-blue-600" />
            <QuickAction delay={0.4} to="/coding" icon={Code2} title="Algorithm Practice" desc="Solve technical challenges" gradient="from-green-500 to-emerald-600" />
            <QuickAction delay={0.5} to="/roadmap" icon={Map} title="My Roadmap" desc="View learning trajectory" gradient="from-orange-500 to-red-600" />
          </div>
        </div>

        {/* Recent Activity / Interviews */}
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
               Recent Sessions
            </h2>
            <Link to="/interview" className="text-accent-cyan text-sm font-semibold hover:text-cyan-300 transition-colors">View all</Link>
          </div>
          
          <div className="space-y-4">
            {recentInterviews.length === 0 && !loading ? (
              <div className="glass-card p-10 text-center border-dashed border-white/10">
                <Brain size={40} className="text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400 font-medium">No sessions yet</p>
                <Link to="/interview" className="text-brand-400 text-sm hover:text-brand-300 mt-3 inline-block font-semibold">Start your first interview →</Link>
              </div>
            ) : recentInterviews.map((iv, i) => (
              <motion.div
                key={iv._id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.3 + (i * 0.1) }}
              >
                <Link to={`/interview/${iv._id}/result`} className="glass-card p-5 flex items-center gap-4 hover:border-brand-500/30 transition-all group">
                  <div className="w-12 h-12 rounded-xl bg-brand-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-brand-500/20 transition-colors">
                    <Brain size={22} className="text-brand-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white font-semibold truncate text-base">{iv.role}</div>
                    <div className="text-slate-400 text-sm capitalize font-medium">{iv.difficulty} · {new Date(iv.createdAt).toLocaleDateString()}</div>
                  </div>
                  {iv.status === 'completed' && (
                    <div className="text-right pl-4 border-l border-white/5">
                      <div className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Score</div>
                      <div className="text-2xl font-display font-bold text-green-400">{iv.overallScore}<span className="text-sm text-green-500/50">%</span></div>
                    </div>
                  )}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Skill Analysis (Strengths / Weaknesses) */}
      {analytics && (analytics.strengths?.length > 0 || analytics.weaknesses?.length > 0) && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6"
        >
          <div className="glass-card p-6 border-t-4 border-t-green-500">
            <h3 className="text-lg font-display font-bold text-white mb-4 flex items-center gap-2">
              <TrendingUp size={20} className="text-green-400" /> AI Identified Strengths
            </h3>
            <div className="flex flex-wrap gap-2.5">
              {analytics.strengths.slice(0, 6).map(s => (
                <span key={s} className="px-3.5 py-1.5 bg-green-500/10 text-green-400 rounded-lg text-sm font-medium border border-green-500/20 hover:bg-green-500/20 transition-colors cursor-default">{s}</span>
              ))}
            </div>
          </div>
          
          <div className="glass-card p-6 border-t-4 border-t-red-500">
            <h3 className="text-lg font-display font-bold text-white mb-4 flex items-center gap-2">
              <Target size={20} className="text-red-400" /> Focus Areas
            </h3>
            <div className="flex flex-wrap gap-2.5">
              {analytics.weaknesses.slice(0, 6).map(s => (
                <span key={s} className="px-3.5 py-1.5 bg-red-500/10 text-red-400 rounded-lg text-sm font-medium border border-red-500/20 hover:bg-red-500/20 transition-colors cursor-default">{s}</span>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
