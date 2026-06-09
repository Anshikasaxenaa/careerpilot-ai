import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '@/services/api';
import { Code2, Search, Filter, Loader2, ChevronRight, CheckCircle } from 'lucide-react';

const DiffBadge = ({ d }) => (
  <span className={`badge ${d === 'easy' ? 'badge-easy' : d === 'hard' ? 'badge-hard' : 'badge-medium'}`}>{d}</span>
);

export default function CodingPage() {
  const [challenges, setChallenges] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [diff, setDiff] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    api.get('/coding').then(({ data }) => {
      setChallenges(data.challenges);
      setFiltered(data.challenges);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let list = challenges;
    if (search) list = list.filter(c => c.title.toLowerCase().includes(search.toLowerCase()) || c.tags?.some(t => t.toLowerCase().includes(search.toLowerCase())));
    if (diff) list = list.filter(c => c.difficulty === diff);
    if (category) list = list.filter(c => c.category === category);
    setFiltered(list);
  }, [search, diff, category, challenges]);

  const categories = [...new Set(challenges.map(c => c.category))];

  if (loading) return <div className="flex items-center justify-center h-96"><Loader2 size={32} className="animate-spin text-brand-400" /></div>;

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Coding Lab</h1>
        <p className="text-slate-400">Practice with AI-reviewed coding challenges</p>
      </div>

      {/* Filters */}
      <div className="glass-card p-4 mb-6 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input type="text" placeholder="Search challenges..." value={search} onChange={e => setSearch(e.target.value)} className="input-dark pl-9 text-sm py-2.5" />
        </div>
        <select value={diff} onChange={e => setDiff(e.target.value)} className="input-dark text-sm py-2.5 w-auto">
          <option value="">All Difficulties</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
        <select value={category} onChange={e => setCategory(e.target.value)} className="input-dark text-sm py-2.5 w-auto">
          <option value="">All Categories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[['Total', challenges.length], ['Easy', challenges.filter(c => c.difficulty === 'easy').length], ['Medium', challenges.filter(c => c.difficulty === 'medium').length]].map(([l, v]) => (
          <div key={l} className="glass-card p-3 text-center">
            <div className="text-xl font-bold text-white">{v}</div>
            <div className="text-slate-500 text-xs">{l}</div>
          </div>
        ))}
      </div>

      {/* Challenge List */}
      {filtered.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <Code2 size={40} className="text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400">No challenges found. Try different filters.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((c, i) => (
            <Link key={c._id} to={`/coding/${c.slug}`}
              className="glass-card p-5 flex items-center gap-4 hover:border-brand-500/20 hover:-translate-y-0.5 transition-all duration-200 group">
              <div className="w-10 h-10 rounded-lg bg-dark-600 border border-white/8 flex items-center justify-center text-slate-400 font-mono text-sm flex-shrink-0">
                {i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-white font-medium text-sm">{c.title}</h3>
                  {c.acceptanceRate > 0 && c.acceptanceRate >= 50 && <CheckCircle size={12} className="text-green-400" />}
                </div>
                <div className="flex items-center gap-2">
                  <DiffBadge d={c.difficulty} />
                  <span className="text-slate-500 text-xs">{c.category}</span>
                  {c.tags?.slice(0, 2).map(t => <span key={t} className="text-slate-600 text-xs">· {t}</span>)}
                </div>
              </div>
              <div className="flex items-center gap-3 text-right">
                {c.acceptanceRate > 0 && <div className="hidden sm:block text-xs text-slate-500">{c.acceptanceRate}% acceptance</div>}
                <ChevronRight size={16} className="text-slate-600 group-hover:text-brand-400 group-hover:translate-x-1 transition-all" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
