import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/services/api';
import { Brain, Loader2, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

const ROLES = ['Software Engineer', 'Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'Data Scientist', 'Machine Learning Engineer', 'DevOps Engineer', 'Product Manager', 'UI/UX Designer', 'System Design'];
const DIFFICULTIES = [
  { value: 'beginner', label: 'Beginner', desc: 'Entry level, basics', color: 'border-green-500/40 bg-green-500/5 text-green-400' },
  { value: 'intermediate', label: 'Intermediate', desc: '1-3 years experience', color: 'border-yellow-500/40 bg-yellow-500/5 text-yellow-400' },
  { value: 'advanced', label: 'Advanced', desc: 'Senior level', color: 'border-red-500/40 bg-red-500/5 text-red-400' },
];
const TYPES = [
  { value: 'technical', label: 'Technical', desc: 'DSA, System Design, CS concepts' },
  { value: 'hr', label: 'HR', desc: 'Behavioral & HR questions' },
  { value: 'behavioral', label: 'Behavioral', desc: 'STAR method scenarios' },
  { value: 'mixed', label: 'Mixed', desc: 'Technical + HR combined' },
];

export default function InterviewSetupPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState({ role: 'Software Engineer', difficulty: 'intermediate', type: 'mixed', questionCount: 8, targetCompany: '' });

  const startInterview = async () => {
    setLoading(true);
    try {
      const { data } = await api.post('/interview/start', config);
      toast.success('Interview ready! Good luck 🎯');
      navigate(`/interview/${data.interview._id}/session`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to start interview');
    } finally { setLoading(false); }
  };

  const set = (key, val) => setConfig(prev => ({ ...prev, [key]: val }));

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Set Up Your Interview</h1>
        <p className="text-slate-400">Configure your AI mock interview session</p>
      </div>

      <div className="space-y-6">
        {/* Role */}
        <div className="glass-card p-6">
          <h2 className="text-base font-semibold text-white mb-4">Target Role</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {ROLES.map(role => (
              <button key={role} onClick={() => set('role', role)}
                className={`px-3 py-2 rounded-xl text-sm font-medium border transition-all ${config.role === role ? 'bg-brand-500/20 border-brand-500/50 text-brand-300' : 'border-white/8 text-slate-400 hover:text-white hover:border-white/20'}`}>
                {role}
              </button>
            ))}
          </div>
          <div className="mt-3">
            <input
              type="text"
              placeholder="Or type a custom role..."
              value={ROLES.includes(config.role) ? '' : config.role}
              onChange={e => set('role', e.target.value)}
              className="input-dark text-sm"
            />
          </div>
        </div>

        {/* Target Company */}
        <div className="glass-card p-6">
          <h2 className="text-base font-semibold text-white mb-2">Target Company <span className="text-slate-500 font-normal">(Optional)</span></h2>
          <p className="text-slate-400 text-sm mb-4">Get questions tailored to a specific company's interview style.</p>
          <input
            type="text"
            placeholder="e.g. Google, Meta, Stripe..."
            value={config.targetCompany}
            onChange={e => set('targetCompany', e.target.value)}
            className="input-dark text-sm w-full"
          />
        </div>

        {/* Difficulty */}
        <div className="glass-card p-6">
          <h2 className="text-base font-semibold text-white mb-4">Difficulty Level</h2>
          <div className="grid grid-cols-3 gap-3">
            {DIFFICULTIES.map(({ value, label, desc, color }) => (
              <button key={value} onClick={() => set('difficulty', value)}
                className={`p-4 rounded-xl border text-left transition-all ${config.difficulty === value ? `${color} border-opacity-100` : 'border-white/8 hover:border-white/20'}`}>
                <div className={`font-semibold text-sm mb-1 ${config.difficulty === value ? '' : 'text-white'}`}>{label}</div>
                <div className="text-xs text-slate-500">{desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Type */}
        <div className="glass-card p-6">
          <h2 className="text-base font-semibold text-white mb-4">Interview Type</h2>
          <div className="grid grid-cols-2 gap-3">
            {TYPES.map(({ value, label, desc }) => (
              <button key={value} onClick={() => set('type', value)}
                className={`p-4 rounded-xl border text-left transition-all ${config.type === value ? 'bg-brand-500/20 border-brand-500/50' : 'border-white/8 hover:border-white/20'}`}>
                <div className={`font-semibold text-sm mb-1 ${config.type === value ? 'text-brand-300' : 'text-white'}`}>{label}</div>
                <div className="text-xs text-slate-500">{desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Question Count */}
        <div className="glass-card p-6">
          <h2 className="text-base font-semibold text-white mb-2">Number of Questions</h2>
          <p className="text-slate-400 text-sm mb-4">Current: <span className="text-brand-400 font-semibold">{config.questionCount} questions</span></p>
          <input type="range" min="5" max="20" step="1" value={config.questionCount}
            onChange={e => set('questionCount', parseInt(e.target.value))}
            className="w-full accent-brand-500" />
          <div className="flex justify-between text-xs text-slate-500 mt-2"><span>5</span><span>20</span></div>
        </div>

        {/* Summary & Start */}
        <div className="glass-card p-6 border-brand-500/20">
          <h3 className="text-sm font-semibold text-slate-300 mb-3">Session Summary</h3>
          <div className="grid grid-cols-2 gap-3 mb-6 text-sm">
            {[['Role', config.role], ['Company', config.targetCompany || 'Any'], ['Difficulty', config.difficulty], ['Type', config.type], ['Questions', config.questionCount]].map(([k, v]) => (
              <div key={k} className="flex justify-between">
                <span className="text-slate-500">{k}</span>
                <span className="text-white font-medium capitalize">{v}</span>
              </div>
            ))}
          </div>
          <button onClick={startInterview} disabled={loading || !config.role}
            className="btn-primary w-full flex items-center justify-center gap-2 py-4 text-base">
            {loading ? <><Loader2 size={20} className="animate-spin" /> Generating questions...</> : <><Brain size={20} /> Start AI Interview <ChevronRight size={18} /></>}
          </button>
          <p className="text-slate-600 text-xs text-center mt-3">AI will generate personalized questions for your setup</p>
        </div>
      </div>
    </div>
  );
}
