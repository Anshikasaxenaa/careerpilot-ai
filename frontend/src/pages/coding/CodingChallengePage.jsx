import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import api from '@/services/api';
import { ArrowLeft, Play, Loader2, CheckCircle, XCircle, Brain, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

const LANGUAGES = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
];

export default function CodingChallengePage() {
  const { slug } = useParams();
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState('javascript');
  const [code, setCode] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    api.get(`/coding/${slug}`).then(({ data }) => {
      setChallenge(data.challenge);
      setCode(data.challenge.starterCode?.javascript || '');
    }).catch(() => {}).finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (challenge) setCode(challenge.starterCode?.[lang] || '// Write your solution here\n');
  }, [lang, challenge]);

  const submit = async () => {
    if (!code.trim()) { toast.error('Write some code first!'); return; }
    setSubmitting(true);
    try {
      const { data } = await api.post(`/coding/${slug}/submit`, { code, language: lang });
      setResult(data.submission);
      setActiveTab('result');
      if (data.submission.status === 'accepted') toast.success('All test cases passed! 🎉');
      else toast.error('Some test cases failed');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submission failed');
    } finally { setSubmitting(false); }
  };

  if (loading) return <div className="flex items-center justify-center h-96"><Loader2 size={32} className="animate-spin text-brand-400" /></div>;
  if (!challenge) return <div className="text-center text-slate-400 py-20">Challenge not found.</div>;

  return (
    <div className="h-[calc(100vh-112px)] flex flex-col animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4 mb-4 flex-shrink-0">
        <Link to="/coding" className="text-slate-400 hover:text-white transition-colors"><ArrowLeft size={20} /></Link>
        <h1 className="text-xl font-bold text-white">{challenge.title}</h1>
        <span className={`badge ${challenge.difficulty === 'easy' ? 'badge-easy' : challenge.difficulty === 'hard' ? 'badge-hard' : 'badge-medium'}`}>{challenge.difficulty}</span>
        <span className="text-slate-500 text-sm">{challenge.category}</span>
      </div>

      <div className="flex-1 flex gap-4 overflow-hidden">
        {/* Left panel - Problem */}
        <div className="w-2/5 flex flex-col glass-card overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-white/5 flex-shrink-0">
            {['description', 'result'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 text-sm font-medium capitalize transition-colors ${activeTab === tab ? 'text-white border-b-2 border-brand-500' : 'text-slate-500 hover:text-white'}`}>
                {tab === 'result' && result ? (result.status === 'accepted' ? '✅ ' : '❌ ') : ''}{tab}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-5">
            {activeTab === 'description' ? (
              <div>
                <p className="text-slate-300 text-sm leading-relaxed mb-5 whitespace-pre-wrap">{challenge.description}</p>

                {challenge.examples?.length > 0 && (
                  <div className="mb-5">
                    <h3 className="text-white font-semibold text-sm mb-3">Examples</h3>
                    {challenge.examples.map((ex, i) => (
                      <div key={i} className="bg-dark-600 rounded-lg p-3 mb-3 border border-white/5">
                        <div className="text-xs text-slate-500 mb-1">Input:</div>
                        <div className="font-mono text-xs text-green-300 mb-2">{ex.input}</div>
                        <div className="text-xs text-slate-500 mb-1">Output:</div>
                        <div className="font-mono text-xs text-blue-300 mb-2">{ex.output}</div>
                        {ex.explanation && <div className="text-slate-400 text-xs">💡 {ex.explanation}</div>}
                      </div>
                    ))}
                  </div>
                )}

                {challenge.constraints?.length > 0 && (
                  <div>
                    <h3 className="text-white font-semibold text-sm mb-2">Constraints</h3>
                    {challenge.constraints.map((c, i) => <div key={i} className="text-slate-400 text-xs mb-1 font-mono">• {c}</div>)}
                  </div>
                )}

                <div className="mt-4 flex flex-wrap gap-2">
                  {challenge.tags?.map(t => <span key={t} className="px-2 py-1 bg-brand-500/10 text-brand-400 rounded text-xs border border-brand-500/20">{t}</span>)}
                </div>
              </div>
            ) : result ? (
              <div>
                <div className={`flex items-center gap-3 p-4 rounded-xl mb-4 ${result.status === 'accepted' ? 'bg-green-500/10 border border-green-500/20' : 'bg-red-500/10 border border-red-500/20'}`}>
                  {result.status === 'accepted' ? <CheckCircle size={24} className="text-green-400" /> : <XCircle size={24} className="text-red-400" />}
                  <div>
                    <div className={`font-bold capitalize ${result.status === 'accepted' ? 'text-green-400' : 'text-red-400'}`}>{result.status.replace('_', ' ')}</div>
                    <div className="text-slate-400 text-xs">{result.passedTests}/{result.totalTests} test cases passed</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-dark-600 rounded-lg p-3 text-center">
                    <div className="text-white font-semibold">{result.runtime}</div>
                    <div className="text-slate-500 text-xs">Runtime</div>
                  </div>
                  <div className="bg-dark-600 rounded-lg p-3 text-center">
                    <div className="text-white font-semibold">{result.memory}</div>
                    <div className="text-slate-500 text-xs">Memory</div>
                  </div>
                </div>

                {result.aiDetails && (
                  <div>
                    <h3 className="text-brand-400 text-sm font-semibold mb-2 flex items-center gap-1.5"><Brain size={14} /> AI Code Review</h3>
                    <p className="text-slate-300 text-xs leading-relaxed mb-3">{result.aiReview}</p>
                    {result.aiDetails.timeComplexity && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs"><span className="text-slate-500">Time Complexity</span><span className="text-yellow-400 font-mono">{result.aiDetails.timeComplexity}</span></div>
                        <div className="flex justify-between text-xs"><span className="text-slate-500">Space Complexity</span><span className="text-blue-400 font-mono">{result.aiDetails.spaceComplexity}</span></div>
                        <div className="flex justify-between text-xs"><span className="text-slate-500">Code Quality</span><span className="text-green-400">{result.aiDetails.codeQuality}/10</span></div>
                      </div>
                    )}
                    {result.aiDetails.suggestions?.length > 0 && (
                      <div className="mt-3">
                        <p className="text-slate-500 text-xs mb-1">Suggestions:</p>
                        {result.aiDetails.suggestions.map((s, i) => <p key={i} className="text-slate-400 text-xs mb-1">• {s}</p>)}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : <div className="text-center text-slate-500 py-10 text-sm">Submit your solution to see results</div>}
          </div>
        </div>

        {/* Right panel - Editor */}
        <div className="flex-1 flex flex-col glass-card overflow-hidden">
          {/* Editor Toolbar */}
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/5 flex-shrink-0">
            <select value={lang} onChange={e => setLang(e.target.value)} className="bg-dark-600 text-white text-sm rounded-lg px-3 py-1.5 border border-white/10 outline-none">
              {LANGUAGES.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
            </select>
            <button onClick={submit} disabled={submitting} className="btn-primary flex items-center gap-2 text-sm px-5 py-2">
              {submitting ? <><Loader2 size={14} className="animate-spin" /> Running...</> : <><Play size={14} /> Submit</>}
            </button>
          </div>

          {/* Monaco Editor */}
          <div className="flex-1 overflow-hidden">
            <Editor
              height="100%"
              language={lang === 'cpp' ? 'cpp' : lang}
              value={code}
              onChange={v => setCode(v || '')}
              theme="vs-dark"
              options={{
                fontSize: 13,
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                fontLigatures: true,
                lineNumbers: 'on',
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                padding: { top: 16, bottom: 16 },
                automaticLayout: true,
                tabSize: 2,
                wordWrap: 'on',
                renderLineHighlight: 'all',
                cursorBlinking: 'smooth',
                smoothScrolling: true,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
