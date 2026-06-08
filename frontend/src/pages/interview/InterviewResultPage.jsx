import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '@/services/api';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Brain, TrendingUp, AlertCircle, CheckCircle, ArrowLeft, RotateCcw, Loader2 } from 'lucide-react';

const ScoreRing = ({ score, size = 120 }) => {
  const r = 45;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  const color = score >= 70 ? '#00e599' : score >= 50 ? '#ffb800' : '#f87171';
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <circle cx="50" cy="50" r={r} fill="none" stroke="#1e1e2e" strokeWidth="8" />
      <circle cx="50" cy="50" r={r} fill="none" stroke={color} strokeWidth="8"
        strokeDasharray={`${dash} ${circ - dash}`} strokeLinecap="round"
        transform="rotate(-90 50 50)" style={{ transition: 'stroke-dasharray 1s ease' }} />
      <text x="50" y="46" textAnchor="middle" fill="white" fontSize="18" fontWeight="700">{score}</text>
      <text x="50" y="60" textAnchor="middle" fill="#64748b" fontSize="9">/ 100</text>
    </svg>
  );
};

export default function InterviewResultPage() {
  const { id } = useParams();
  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/interview/${id}`).then(({ data }) => {
      setInterview(data.interview);
      setLoading(false);
    });
  }, [id]);

  if (loading) return (
    <div className="flex items-center justify-center h-96">
      <Loader2 size={32} className="animate-spin text-brand-400" />
    </div>
  );

  if (!interview) return <div className="text-center text-slate-400">Interview not found.</div>;

  const fb = interview.aiFeedback;
  const radarData = [
    { subject: 'Technical', score: fb?.technicalScore || 0 },
    { subject: 'Communication', score: fb?.communicationScore || 0 },
    { subject: 'Confidence', score: fb?.confidenceScore || 0 },
    { subject: 'Accuracy', score: interview.overallScore || 0 },
  ];

  return (
    <div className="max-w-5xl mx-auto animate-fade-in space-y-6">
      {/* Back */}
      <Link to="/interview" className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors">
        <ArrowLeft size={16} /> Back to Interviews
      </Link>

      {/* Hero Score Card */}
      <div className="glass-card p-8 relative overflow-hidden">
        <div className="orb w-64 h-64 bg-brand-500/10 -top-10 -right-10" />
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className="flex flex-col items-center">
            <ScoreRing score={interview.overallScore} size={140} />
            <div className="mt-3 text-center">
              <div className="text-white font-semibold">Overall Score</div>
              <div className={`text-sm mt-1 font-medium ${interview.overallScore >= 70 ? 'text-green-400' : interview.overallScore >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                {interview.overallScore >= 70 ? '🎉 Excellent!' : interview.overallScore >= 50 ? '👍 Good effort' : '📚 Keep practicing'}
              </div>
            </div>
          </div>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl font-bold text-white mb-1">{interview.title}</h1>
            <p className="text-slate-400 mb-4 capitalize">{interview.role} · {interview.difficulty} · {interview.type}</p>
            <div className="grid grid-cols-3 gap-4">
              {[['Questions', `${interview.completedQuestions}/${interview.totalQuestions}`], ['Duration', `${interview.duration}m`], ['Date', new Date(interview.createdAt).toLocaleDateString()]].map(([l, v]) => (
                <div key={l} className="text-center">
                  <div className="text-xl font-bold text-white">{v}</div>
                  <div className="text-slate-500 text-xs">{l}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="w-full md:w-52 h-48">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#2a2a3e" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 11 }} />
                <Radar name="Score" dataKey="score" stroke="#6c3fff" fill="#6c3fff" fillOpacity={0.2} />
                <Tooltip contentStyle={{ background: '#1e1e2e', border: '1px solid #2a2a3e', borderRadius: 8 }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Skill Scores */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Score Breakdown</h3>
          {[['Technical', fb?.technicalScore], ['Communication', fb?.communicationScore], ['Confidence', fb?.confidenceScore]].map(([label, score]) => (
            <div key={label} className="mb-3">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400">{label}</span>
                <span className="text-white font-medium">{score || 0}%</span>
              </div>
              <div className="h-1.5 bg-dark-600 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-brand-500 to-purple-500 rounded-full transition-all duration-700" style={{ width: `${score || 0}%` }} />
              </div>
            </div>
          ))}
        </div>

        {/* Strengths */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-green-400 mb-3 flex items-center gap-2"><CheckCircle size={14} /> Strengths</h3>
          {fb?.strengths?.length > 0 ? fb.strengths.map((s, i) => (
            <div key={i} className="flex items-start gap-2 mb-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-1.5 flex-shrink-0" />
              <p className="text-slate-300 text-sm">{s}</p>
            </div>
          )) : <p className="text-slate-500 text-sm">No strengths data</p>}
        </div>

        {/* Improvements */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-orange-400 mb-3 flex items-center gap-2"><TrendingUp size={14} /> Improvements</h3>
          {fb?.improvementSuggestions?.length > 0 ? fb.improvementSuggestions.map((s, i) => (
            <div key={i} className="flex items-start gap-2 mb-2">
              <AlertCircle size={12} className="text-orange-400 mt-1 flex-shrink-0" />
              <p className="text-slate-300 text-sm">{s}</p>
            </div>
          )) : <p className="text-slate-500 text-sm">No suggestions</p>}
        </div>
      </div>

      {/* AI Overall Feedback */}
      {fb?.overall && (
        <div className="glass-card p-6 border-brand-500/20">
          <h3 className="text-base font-semibold text-white mb-3 flex items-center gap-2"><Brain size={16} className="text-brand-400" /> AI Overall Assessment</h3>
          <p className="text-slate-300 leading-relaxed">{fb.overall}</p>
        </div>
      )}

      {/* Q&A Breakdown */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Question-by-Question Breakdown</h2>
        <div className="space-y-3">
          {interview.questions.map((q, i) => (
            <div key={i} className="glass-card p-5">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-slate-500 text-xs font-mono">Q{i + 1}</span>
                    <span className={`badge ${q.difficulty === 'easy' ? 'badge-easy' : q.difficulty === 'hard' ? 'badge-hard' : 'badge-medium'}`}>{q.difficulty}</span>
                    <span className="badge bg-slate-500/10 text-slate-400 border border-slate-500/20 capitalize">{q.type}</span>
                  </div>
                  <p className="text-white text-sm font-medium">{q.question}</p>
                </div>
                <div className="text-center flex-shrink-0">
                  <div className={`text-2xl font-bold ${q.score >= 7 ? 'text-green-400' : q.score >= 5 ? 'text-yellow-400' : 'text-red-400'}`}>{q.score}<span className="text-sm text-slate-500">/10</span></div>
                </div>
              </div>
              {q.userAnswer && <div className="bg-dark-600 rounded-lg p-3 mb-2"><p className="text-slate-400 text-xs mb-1">Your answer:</p><p className="text-slate-300 text-sm">{q.userAnswer}</p></div>}
              {q.aiFeedback && <div className="text-slate-400 text-sm"><span className="text-brand-400 text-xs font-semibold">AI: </span>{q.aiFeedback}</div>}
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 pb-8">
        <Link to="/interview" className="btn-primary flex items-center gap-2"><RotateCcw size={16} /> New Interview</Link>
        <Link to="/roadmap" className="btn-ghost">Generate Roadmap →</Link>
        <Link to="/analytics" className="btn-ghost">View Analytics →</Link>
      </div>
    </div>
  );
}
