import { useEffect, useState } from 'react';
import api from '@/services/api';
import { Map, Loader2, Zap, CheckCircle, Circle, ChevronRight, BookOpen, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RoadmapPage() {
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [targetRole, setTargetRole] = useState('');

  useEffect(() => { loadRoadmap(); }, []);

  const loadRoadmap = async () => {
    try {
      const { data } = await api.get('/roadmap');
      setRoadmap(data.roadmap);
    } catch {} finally { setLoading(false); }
  };

  const generate = async () => {
    setGenerating(true);
    try {
      const { data } = await api.post('/roadmap/generate', { targetRole });
      setRoadmap(data.roadmap);
      toast.success('Learning roadmap generated! 🗺️');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to generate roadmap');
    } finally { setGenerating(false); }
  };

  const toggleWeek = async (weekNumber, completed) => {
    try {
      const { data } = await api.put(`/roadmap/${roadmap._id}/week`, { weekNumber, completed });
      setRoadmap(data.roadmap);
    } catch {}
  };

  const progress = roadmap ? Math.round((roadmap.weeklyPlan.filter(w => w.completed).length / roadmap.weeklyPlan.length) * 100) : 0;

  if (loading) return <div className="flex items-center justify-center h-96"><Loader2 size={32} className="animate-spin text-brand-400" /></div>;

  return (
    <div className="max-w-4xl mx-auto animate-fade-in space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Learning Roadmap</h1>
          <p className="text-slate-400">AI-generated personalized study plan based on your performance</p>
        </div>
        <button onClick={generate} disabled={generating} className="btn-primary flex items-center gap-2 text-sm">
          {generating ? <><Loader2 size={16} className="animate-spin" /> Generating...</> : <><Zap size={16} /> {roadmap ? 'Regenerate' : 'Generate Roadmap'}</>}
        </button>
      </div>

      {!roadmap ? (
        <div className="glass-card p-12 text-center">
          <Map size={48} className="text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-3">No Roadmap Yet</h3>
          <p className="text-slate-400 mb-6 max-w-md mx-auto">Generate a personalized learning roadmap based on your interview performance and resume analysis.</p>
          <div className="flex items-center gap-3 max-w-sm mx-auto mb-6">
            <input type="text" placeholder="Target role (optional)" value={targetRole} onChange={e => setTargetRole(e.target.value)} className="input-dark flex-1 text-sm" />
          </div>
          <button onClick={generate} disabled={generating} className="btn-primary flex items-center gap-2 mx-auto">
            {generating ? <Loader2 size={16} className="animate-spin" /> : <Zap size={16} />}
            Generate My Roadmap
          </button>
        </div>
      ) : (
        <>
          {/* Overview Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Target Role', value: roadmap.targetRole || 'General', icon: Map },
              { label: 'Duration', value: roadmap.estimatedDuration, icon: Clock },
              { label: 'Weeks', value: roadmap.weeklyPlan.length, icon: BookOpen },
              { label: 'Progress', value: `${progress}%`, icon: CheckCircle },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="glass-card p-4 text-center">
                <div className="text-xl font-bold gradient-text mb-1">{value}</div>
                <div className="text-slate-500 text-xs">{label}</div>
              </div>
            ))}
          </div>

          {/* Progress Bar */}
          <div className="glass-card p-5">
            <div className="flex justify-between text-sm mb-3">
              <span className="text-slate-300 font-medium">Overall Progress</span>
              <span className="text-brand-400 font-bold">{progress}%</span>
            </div>
            <div className="h-2 bg-dark-600 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-brand-500 to-purple-500 rounded-full transition-all duration-700" style={{ width: `${progress}%` }} />
            </div>
            <p className="text-slate-500 text-xs mt-2">{roadmap.weeklyPlan.filter(w => w.completed).length} of {roadmap.weeklyPlan.length} weeks completed</p>
          </div>

          {/* Weak Topics */}
          {roadmap.weakTopics?.length > 0 && (
            <div className="glass-card p-5">
              <h3 className="text-sm font-semibold text-red-400 mb-3">Focus Areas (Identified Weaknesses)</h3>
              <div className="flex flex-wrap gap-2">
                {roadmap.weakTopics.map(t => <span key={t} className="px-3 py-1.5 bg-red-500/10 text-red-300 rounded-lg text-xs border border-red-500/20">{t}</span>)}
              </div>
            </div>
          )}

          {/* Weekly Plan */}
          <div>
            <h2 className="text-lg font-semibold text-white mb-4">Weekly Study Plan</h2>
            <div className="space-y-3">
              {roadmap.weeklyPlan.map((week, i) => (
                <div key={i} className={`glass-card p-5 transition-all duration-200 ${week.completed ? 'border-green-500/20' : 'hover:border-brand-500/20'}`}>
                  <div className="flex items-start gap-4">
                    <button onClick={() => toggleWeek(week.week, !week.completed)} className="mt-1 flex-shrink-0">
                      {week.completed ? <CheckCircle size={22} className="text-green-400" /> : <Circle size={22} className="text-slate-600 hover:text-brand-400 transition-colors" />}
                    </button>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-brand-400 uppercase tracking-wide">Week {week.week}</span>
                        {week.completed && <span className="badge bg-green-500/10 text-green-400 border border-green-500/20 text-xs">Done ✓</span>}
                      </div>
                      <h3 className={`font-semibold mb-1 ${week.completed ? 'text-slate-500 line-through' : 'text-white'}`}>{week.topic}</h3>
                      <p className="text-slate-400 text-sm mb-3">{week.description}</p>
                      {week.resources?.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {week.resources.map((r, ri) => (
                            <span key={ri} className="px-2 py-1 bg-brand-500/10 text-brand-300 rounded text-xs border border-brand-500/15">{r}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Suggestions */}
          {roadmap.suggestions?.length > 0 && (
            <div className="glass-card p-5">
              <h3 className="text-sm font-semibold text-brand-400 mb-3">AI Study Tips</h3>
              <div className="space-y-2">
                {roadmap.suggestions.map((s, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <ChevronRight size={14} className="text-brand-400 mt-1 flex-shrink-0" />
                    <p className="text-slate-300 text-sm">{s}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
