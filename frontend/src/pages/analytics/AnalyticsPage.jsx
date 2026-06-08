import { useEffect, useState } from 'react';
import api from '@/services/api';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, Legend
} from 'recharts';
import { TrendingUp, Target, Brain, Zap, Loader2 } from 'lucide-react';

const COLORS = ['#6c3fff', '#00d4ff', '#00e599', '#ffb800', '#ff2d9b', '#f87171'];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card p-3 border-brand-500/30 text-sm">
      <p className="text-slate-400 mb-1">{label}</p>
      {payload.map((p, i) => <p key={i} style={{ color: p.color }} className="font-semibold">{p.name}: {p.value}{p.unit || ''}</p>)}
    </div>
  );
};

export default function AnalyticsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/analytics/performance').then(({ data }) => { setData(data.analytics); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center h-96"><Loader2 size={32} className="animate-spin text-brand-400" /></div>;

  if (!data || data.overview.totalInterviews === 0) return (
    <div className="max-w-2xl mx-auto text-center py-20">
      <Brain size={48} className="text-slate-600 mx-auto mb-4" />
      <h2 className="text-2xl font-bold text-white mb-3">No Analytics Yet</h2>
      <p className="text-slate-400">Complete some interviews to see your performance analytics.</p>
    </div>
  );

  const scoreData = data.scoreTrend.map((d, i) => ({ ...d, name: `#${i+1}`, score: d.score }));
  const diffData = [
    { name: 'Beginner', value: data.difficultyBreakdown.beginner },
    { name: 'Intermediate', value: data.difficultyBreakdown.intermediate },
    { name: 'Advanced', value: data.difficultyBreakdown.advanced },
  ].filter(d => d.value > 0);

  const radarData = [
    { subject: 'Technical', score: data.technicalAvg },
    { subject: 'Communication', score: data.communicationAvg },
    { subject: 'Accuracy', score: data.overview.avgScore },
  ];

  return (
    <div className="max-w-6xl mx-auto animate-fade-in space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Performance Analytics</h1>
        <p className="text-slate-400">Track your progress and identify growth areas</p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Interviews', value: data.overview.totalInterviews, icon: Brain, color: 'from-brand-500 to-purple-500' },
          { label: 'Avg Score', value: `${data.overview.avgScore}%`, icon: Target, color: 'from-green-500 to-emerald-500' },
          { label: 'Questions Done', value: data.overview.totalQuestions, icon: Zap, color: 'from-cyan-500 to-blue-500' },
          { label: 'Hours Practiced', value: `${data.overview.totalHours}h`, icon: TrendingUp, color: 'from-orange-500 to-red-500' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="glass-card p-5">
            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-3`}>
              <Icon size={16} className="text-white" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">{value}</div>
            <div className="text-slate-500 text-xs">{label}</div>
          </div>
        ))}
      </div>

      {/* Score Trend */}
      {scoreData.length > 1 && (
        <div className="glass-card p-6">
          <h3 className="text-base font-semibold text-white mb-5">Score Trend</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={scoreData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3e" />
              <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} />
              <YAxis domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="score" stroke="#6c3fff" strokeWidth={2.5} dot={{ fill: '#6c3fff', strokeWidth: 2, r: 4 }} name="Score" unit="%" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Topic Performance */}
        {data.topicAnalytics?.length > 0 && (
          <div className="glass-card p-6">
            <h3 className="text-base font-semibold text-white mb-5">Topic Performance</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={data.topicAnalytics.slice(0, 8)} layout="vertical" margin={{ left: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3e" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} />
                <YAxis type="category" dataKey="topic" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} width={60} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="avgScore" fill="#6c3fff" radius={[0, 4, 4, 0]} name="Avg Score" unit="%" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        <div className="space-y-4">
          {/* Radar */}
          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold text-white mb-3">Skills Radar</h3>
            <ResponsiveContainer width="100%" height={160}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#2a2a3e" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 11 }} />
                <Radar dataKey="score" stroke="#6c3fff" fill="#6c3fff" fillOpacity={0.25} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Difficulty Distribution */}
          {diffData.length > 0 && (
            <div className="glass-card p-5">
              <h3 className="text-sm font-semibold text-white mb-3">Difficulty Breakdown</h3>
              <div className="flex items-center gap-4">
                <PieChart width={120} height={120}>
                  <Pie data={diffData} cx={55} cy={55} innerRadius={30} outerRadius={55} dataKey="value" strokeWidth={0}>
                    {diffData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                  </Pie>
                </PieChart>
                <div className="space-y-2">
                  {diffData.map((d, i) => (
                    <div key={d.name} className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i] }} />
                      <span className="text-slate-400 text-xs">{d.name}</span>
                      <span className="text-white text-xs font-semibold ml-auto">{d.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Strength/Weakness Heatmap */}
      {(data.strengths?.length > 0 || data.weaknesses?.length > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold text-green-400 mb-3">✅ Strengths</h3>
            <div className="flex flex-wrap gap-2">
              {data.strengths.map(s => <span key={s} className="px-3 py-1.5 bg-green-500/10 text-green-300 rounded-lg text-xs border border-green-500/20">{s}</span>)}
            </div>
          </div>
          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold text-red-400 mb-3">🎯 Needs Work</h3>
            <div className="flex flex-wrap gap-2">
              {data.weaknesses.map(s => <span key={s} className="px-3 py-1.5 bg-red-500/10 text-red-300 rounded-lg text-xs border border-red-500/20">{s}</span>)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
