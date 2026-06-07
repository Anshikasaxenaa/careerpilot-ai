import { useState, useRef, useEffect } from 'react';
import api from '@/services/api';
import { Upload, FileText, Trash2, Loader2, RefreshCw, CheckCircle, AlertCircle, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';

const AtsRing = ({ score }) => {
  const r = 54, circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  const color = score >= 70 ? '#00e599' : score >= 50 ? '#ffb800' : '#f87171';
  return (
    <svg width="140" height="140" viewBox="0 0 120 120">
      <circle cx="60" cy="60" r={r} fill="none" stroke="#1e1e2e" strokeWidth="10" />
      <circle cx="60" cy="60" r={r} fill="none" stroke={color} strokeWidth="10"
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        transform="rotate(-90 60 60)" style={{ transition: 'stroke-dasharray 1s ease' }} />
      <text x="60" y="55" textAnchor="middle" fill="white" fontSize="24" fontWeight="700">{score}</text>
      <text x="60" y="72" textAnchor="middle" fill="#64748b" fontSize="10">ATS Score</text>
    </svg>
  );
};

export default function ResumePage() {
  const [resumes, setResumes] = useState([]);
  const [selected, setSelected] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [targetRole, setTargetRole] = useState('');
  const [polling, setPolling] = useState(false);
  const fileRef = useRef();

  useEffect(() => {
    loadResumes();
  }, []);

  const loadResumes = async () => {
    try {
      const { data } = await api.get('/resume');
      setResumes(data.resumes);
      if (data.resumes.length > 0 && !selected) setSelected(data.resumes[0]);
    } catch {}
  };

  const handleUpload = async (file) => {
    if (!file || file.type !== 'application/pdf') { toast.error('Only PDF files allowed'); return; }
    setUploading(true);
    const formData = new FormData();
    formData.append('resume', file);
    formData.append('targetRole', targetRole);
    try {
      const { data } = await api.post('/resume/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Resume uploaded! Analyzing...');
      setResumes(prev => [data.resume, ...prev]);
      setSelected(data.resume);
      // Poll for analysis completion
      pollForResults(data.resume._id);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally { setUploading(false); }
  };

  const pollForResults = async (resumeId) => {
    setPolling(true);
    let attempts = 0;
    const poll = async () => {
      try {
        const { data } = await api.get(`/resume/${resumeId}`);
        if (data.resume.isProcessed) {
          setSelected(data.resume);
          setResumes(prev => prev.map(r => r._id === resumeId ? data.resume : r));
          setPolling(false);
          toast.success('AI analysis complete!', { icon: '🎯' });
        } else if (attempts++ < 15) {
          setTimeout(poll, 3000);
        } else { setPolling(false); }
      } catch { setPolling(false); }
    };
    poll();
  };

  const reAnalyze = async () => {
    if (!selected) return;
    setAnalyzing(true);
    try {
      const { data } = await api.post(`/resume/${selected._id}/analyze`, { targetRole });
      setSelected(data.resume);
      setResumes(prev => prev.map(r => r._id === data.resume._id ? data.resume : r));
      toast.success('Re-analysis complete!');
    } catch { toast.error('Analysis failed'); } finally { setAnalyzing(false); }
  };

  const deleteResume = async (id) => {
    if (!confirm('Delete this resume?')) return;
    try {
      await api.delete(`/resume/${id}`);
      setResumes(prev => prev.filter(r => r._id !== id));
      if (selected?._id === id) setSelected(resumes.find(r => r._id !== id) || null);
      toast.success('Resume deleted');
    } catch { toast.error('Failed to delete'); }
  };

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Resume Analysis</h1>
        <p className="text-slate-400">AI-powered ATS scoring, skill gap analysis, and improvement suggestions</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left - Upload & List */}
        <div className="space-y-4">
          {/* Upload zone */}
          <div
            className="glass-card p-6 border-dashed border-2 border-white/10 hover:border-brand-500/40 transition-all cursor-pointer text-center group"
            onClick={() => fileRef.current?.click()}
            onDragOver={e => e.preventDefault()}
            onDrop={e => { e.preventDefault(); handleUpload(e.dataTransfer.files[0]); }}
          >
            {uploading ? (
              <><Loader2 size={36} className="animate-spin text-brand-400 mx-auto mb-3" /><p className="text-slate-400 text-sm">Uploading...</p></>
            ) : (
              <>
                <div className="w-14 h-14 rounded-2xl bg-brand-500/10 flex items-center justify-center mx-auto mb-3 group-hover:bg-brand-500/20 transition-colors">
                  <Upload size={24} className="text-brand-400" />
                </div>
                <p className="text-white font-medium text-sm mb-1">Drop PDF or click to upload</p>
                <p className="text-slate-500 text-xs">Max 5MB · PDF only</p>
              </>
            )}
            <input ref={fileRef} type="file" accept=".pdf" className="hidden" onChange={e => handleUpload(e.target.files[0])} />
          </div>

          {/* Target role */}
          <input
            type="text"
            placeholder="Target role (optional, e.g. Frontend Dev)"
            value={targetRole}
            onChange={e => setTargetRole(e.target.value)}
            className="input-dark text-sm"
          />

          {/* Resume list */}
          {resumes.length > 0 && (
            <div className="space-y-2">
              <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">Your Resumes</p>
              {resumes.map(r => (
                <div key={r._id}
                  onClick={() => setSelected(r)}
                  className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border ${selected?._id === r._id ? 'bg-brand-500/10 border-brand-500/30' : 'border-white/5 hover:border-white/10 hover:bg-white/2'}`}>
                  <FileText size={16} className={selected?._id === r._id ? 'text-brand-400' : 'text-slate-500'} />
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-xs font-medium truncate">{r.fileName}</p>
                    <p className="text-slate-500 text-xs">{r.isProcessed ? `ATS: ${r.atsScore}%` : 'Analyzing...'}</p>
                  </div>
                  <button onClick={e => { e.stopPropagation(); deleteResume(r._id); }} className="text-slate-600 hover:text-red-400 transition-colors p-1">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right - Analysis */}
        <div className="lg:col-span-2">
          {!selected ? (
            <div className="glass-card p-12 text-center h-full flex flex-col items-center justify-center">
              <FileText size={48} className="text-slate-600 mb-4" />
              <h3 className="text-white font-semibold mb-2">Upload your resume to get started</h3>
              <p className="text-slate-500 text-sm">Get ATS score, skill gap analysis, and AI suggestions</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* ATS Score Card */}
              <div className="glass-card p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-bold text-white mb-1">Analysis Report</h2>
                    <p className="text-slate-500 text-sm truncate">{selected.fileName}</p>
                  </div>
                  <button onClick={reAnalyze} disabled={analyzing || polling}
                    className="btn-ghost flex items-center gap-2 text-sm py-2">
                    {analyzing || polling ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
                    {polling ? 'Analyzing...' : 'Re-analyze'}
                  </button>
                </div>

                {polling && !selected.isProcessed ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-center">
                      <Loader2 size={32} className="animate-spin text-brand-400 mx-auto mb-3" />
                      <p className="text-slate-400 text-sm">AI is analyzing your resume...</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-8">
                    <AtsRing score={selected.atsScore || 0} />
                    <div className="flex-1">
                      {selected.summary && <p className="text-slate-300 text-sm leading-relaxed mb-3">{selected.summary}</p>}
                      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium ${selected.atsScore >= 70 ? 'bg-green-500/10 text-green-400' : selected.atsScore >= 50 ? 'bg-yellow-500/10 text-yellow-400' : 'bg-red-500/10 text-red-400'}`}>
                        {selected.atsScore >= 70 ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
                        {selected.atsScore >= 70 ? 'Strong ATS compatibility' : selected.atsScore >= 50 ? 'Moderate ATS score' : 'Needs improvement'}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {selected.isProcessed && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Extracted Skills */}
                    <div className="glass-card p-5">
                      <h3 className="text-sm font-semibold text-green-400 mb-3 flex items-center gap-2"><CheckCircle size={14} /> Detected Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {selected.extractedSkills?.slice(0,12).map(s => (
                          <span key={s} className="px-2.5 py-1 bg-green-500/10 text-green-300 rounded-lg text-xs border border-green-500/20">{s}</span>
                        ))}
                        {!selected.extractedSkills?.length && <p className="text-slate-500 text-sm">None detected</p>}
                      </div>
                    </div>

                    {/* Missing Skills */}
                    <div className="glass-card p-5">
                      <h3 className="text-sm font-semibold text-red-400 mb-3 flex items-center gap-2"><AlertCircle size={14} /> Missing Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {selected.missingSkills?.slice(0,12).map(s => (
                          <span key={s} className="px-2.5 py-1 bg-red-500/10 text-red-300 rounded-lg text-xs border border-red-500/20">{s}</span>
                        ))}
                        {!selected.missingSkills?.length && <p className="text-slate-500 text-sm">None identified</p>}
                      </div>
                    </div>
                  </div>

                  {/* Suggestions */}
                  {selected.suggestions?.length > 0 && (
                    <div className="glass-card p-5">
                      <h3 className="text-sm font-semibold text-brand-400 mb-3 flex items-center gap-2"><TrendingUp size={14} /> AI Suggestions</h3>
                      <div className="space-y-2">
                        {selected.suggestions.map((s, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <div className="w-5 h-5 rounded bg-brand-500/20 flex items-center justify-center text-brand-400 text-xs flex-shrink-0 mt-0.5">{i+1}</div>
                            <p className="text-slate-300 text-sm">{s}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Career Recommendations */}
                  {selected.careerRecommendations?.length > 0 && (
                    <div className="glass-card p-5">
                      <h3 className="text-sm font-semibold text-cyan-400 mb-3">Career Recommendations</h3>
                      <div className="space-y-2">
                        {selected.careerRecommendations.map((r, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <span className="text-cyan-400">→</span>
                            <p className="text-slate-300 text-sm">{r}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
