import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import api from '@/services/api';
import { Brain, FileText, Code2, Map, TrendingUp, Clock, Target, Zap, ArrowRight, Play } from 'lucide-react';

const StatCard = ({ label, value, icon: Icon, color, sub }) => (
  <div className="glass-card p-5 hover:-translate-y-0.5 transition-all duration-200">
    <div className="flex items-start justify-between mb-3">
      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center`}>
        <Icon size={18} className="text-white" />
      </div>
    </div>
    <div className="text-2xl font-bold text-white mb-1">{value}</div>
    <div className="text-slate-400 text-sm">{label}</div>
    {sub && <div className="text-xs text-slate-500 mt-1">{sub}</div>}
  </div>
);

const QuickAction = ({ to, icon: Icon, title, desc, gradient }) => (
  <Link to={to} className="glass-card p-5 flex items-center gap-4 hover:border-brand-500/20 hover:-translate-y-0.5 transition-all duration-200 group">
    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
      <Icon size={22} className="text-white" />
    </div>
    <div className="flex-1">
      <div className="font-semibold text-white text-sm">{title}</div>
      <div className="text-slate-500 text-xs mt-0.5">{desc}</div>
    </div>
    <ArrowRight size={16} className="text-slate-600 group-hover:text-brand-400 group-hover:translate-x-1 transition-all" />
  </Link>
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
    <div className="space-y-8 max-w-6xl animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">
            {greeting()}, <span className="gradient-text">{user?.name?.split(' ')[0]}</span> 👋
          </h1>
          <p className="text-slate-400">Ready to level up your interview skills today?</p>
        </div>
        <Link to="/interview" className="btn-primary flex items-center gap-2 text-sm">
          <Play size={16} /> Start Interview
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Interviews Done" value={analytics?.overview?.totalInterviews ?? 0} icon={Brain} color="from-brand-500 to-purple-500" />
        <StatCard label="Avg Score" value={`${analytics?.overview?.avgScore ?? 0}%`} icon={Target} color="from-cyan-500 to-blue-500" />
        <StatCard label="Questions Answered" value={analytics?.overview?.totalQuestions ?? 0} icon={Zap} color="from-green-500 to-emerald-500" />
        <StatCard label="Resume ATS Score" value={`${analytics?.resumeAtsScore ?? 0}%`} icon={FileText} color="from-orange-500 to-red-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-semibold text-white">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <QuickAction to="/interview" icon={Brain} title="Mock Interview" desc="Practice with AI interviewer" gradient="from-brand-500 to-purple-500" />
            <QuickAction to="/resume" icon={FileText} title="Analyze Resume" desc="Get ATS score & tips" gradient="from-cyan-500 to-blue-500" />
            <QuickAction to="/coding" icon={Code2} title="Coding Practice" desc="Solve algorithm challenges" gradient="from-green-500 to-emerald-500" />
            <QuickAction to="/roadmap" icon={Map} title="My Roadmap" desc="View personalized study plan" gradient="from-orange-500 to-red-500" />
          </div>
        </div>

        {/* Recent Interviews */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Recent Interviews</h2>
            <Link to="/interview" className="text-brand-400 text-sm hover:text-brand-300 transition-colors">View all</Link>
          </div>
          <div className="space-y-3">
            {recentInterviews.length === 0 ? (
              <div className="glass-card p-6 text-center">
                <Brain size={32} className="text-slate-600 mx-auto mb-3" />
                <p className="text-slate-500 text-sm">No interviews yet</p>
                <Link to="/interview" className="text-brand-400 text-sm hover:text-brand-300 mt-2 inline-block">Start your first →</Link>
              </div>
            ) : recentInterviews.map(iv => (
              <Link key={iv._id} to={`/interview/${iv._id}/result`} className="glass-card p-4 flex items-center gap-3 hover:border-brand-500/20 transition-all">
                <div className="w-10 h-10 rounded-lg bg-brand-500/10 flex items-center justify-center flex-shrink-0">
                  <Brain size={18} className="text-brand-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-white text-sm font-medium truncate">{iv.role}</div>
                  <div className="text-slate-500 text-xs capitalize">{iv.difficulty} · {iv.status}</div>
                </div>
                {iv.status === 'completed' && (
                  <div className="text-right">
                    <div className="text-lg font-bold gradient-text">{iv.overallScore}%</div>
                  </div>
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Skill Summary */}
      {analytics && (analytics.strengths?.length > 0 || analytics.weaknesses?.length > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold text-green-400 mb-3 flex items-center gap-2"><TrendingUp size={14} /> Strengths</h3>
            <div className="flex flex-wrap gap-2">
              {analytics.strengths.slice(0, 6).map(s => (
                <span key={s} className="px-3 py-1 bg-green-500/10 text-green-400 rounded-lg text-xs border border-green-500/20">{s}</span>
              ))}
            </div>
          </div>
          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold text-red-400 mb-3 flex items-center gap-2"><Target size={14} /> Needs Improvement</h3>
            <div className="flex flex-wrap gap-2">
              {analytics.weaknesses.slice(0, 6).map(s => (
                <span key={s} className="px-3 py-1 bg-red-500/10 text-red-400 rounded-lg text-xs border border-red-500/20">{s}</span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
