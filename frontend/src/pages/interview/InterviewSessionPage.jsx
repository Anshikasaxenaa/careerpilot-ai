import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '@/services/api';
import { Clock, ChevronRight, ChevronLeft, CheckCircle, Loader2, Brain, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

function Timer({ seconds }) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const isLow = seconds < 60;
  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${isLow ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-dark-600 text-slate-300 border border-white/8'}`}>
      <Clock size={14} />
      <span className="font-mono text-sm font-semibold">{String(mins).padStart(2,'0')}:{String(secs).padStart(2,'0')}</span>
    </div>
  );
}

export default function InterviewSessionPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [interview, setInterview] = useState(null);
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [evaluations, setEvaluations] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [timer, setTimer] = useState(120);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());

  useEffect(() => {
    api.get(`/interview/${id}`).then(({ data }) => {
      setInterview(data.interview);
      setLoading(false);
    }).catch(() => { toast.error('Interview not found'); navigate('/interview'); });
  }, [id]);

  useEffect(() => {
    setTimer(120);
    setQuestionStartTime(Date.now());
  }, [qIndex]);

  useEffect(() => {
    const t = setInterval(() => setTimer(p => Math.max(0, p - 1)), 1000);
    return () => clearInterval(t);
  }, [qIndex]);

  const submitAnswer = async () => {
    if (submitting) return;
    setSubmitting(true);
    const timeSpent = Math.round((Date.now() - questionStartTime) / 1000);
    try {
      const { data } = await api.post(`/interview/${id}/answer`, {
        questionIndex: qIndex,
        answer: answers[qIndex] || '',
        timeSpent,
      });
      setEvaluations(prev => ({ ...prev, [qIndex]: data.evaluation }));
      toast.success(`Scored ${data.evaluation.score}/10`, { icon: '🎯' });
    } catch (err) {
      toast.error('Failed to submit answer');
    } finally { setSubmitting(false); }
  };

  const completeInterview = async () => {
    setCompleting(true);
    try {
      await api.post(`/interview/${id}/complete`);
      toast.success('Interview complete! View your results 🎉');
      navigate(`/interview/${id}/result`);
    } catch {
      toast.error('Failed to complete interview');
      setCompleting(false);
    }
  };

  const goNext = async () => {
    if (!evaluations[qIndex]) await submitAnswer();
    if (qIndex < interview.questions.length - 1) setQIndex(q => q + 1);
  };

  if (loading) return (
    <div className="flex items-center justify-center h-96">
      <Loader2 size={32} className="animate-spin text-brand-400" />
    </div>
  );

  const q = interview.questions[qIndex];
  const totalQ = interview.questions.length;
  const progress = ((qIndex + 1) / totalQ) * 100;
  const allAnswered = Object.keys(evaluations).length === totalQ;

  return (
    <div className="max-w-4xl mx-auto animate-fade-in space-y-6">
      {/* Header */}
      <div className="glass-card p-4 flex items-center justify-between">
        <div>
          <div className="text-white font-semibold">{interview.title}</div>
          <div className="text-slate-500 text-xs capitalize">{interview.role} · {interview.difficulty}</div>
        </div>
        <div className="flex items-center gap-3">
          <Timer seconds={timer} />
          <div className="text-slate-400 text-sm">{qIndex + 1} / {totalQ}</div>
        </div>
      </div>

      {/* Progress */}
      <div className="h-1.5 bg-dark-600 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-brand-500 to-purple-500 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
      </div>

      {/* Question */}
      <div className="glass-card p-6">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-brand-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
            <Brain size={16} className="text-brand-400" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className={`badge ${q.difficulty === 'easy' ? 'badge-easy' : q.difficulty === 'hard' ? 'badge-hard' : 'badge-medium'}`}>{q.difficulty}</span>
              <span className="badge bg-brand-500/10 text-brand-400 border border-brand-500/20 capitalize">{q.type}</span>
              {q.topic && <span className="text-slate-500 text-xs">{q.topic}</span>}
            </div>
            <p className="text-white text-base leading-relaxed">{q.question}</p>
          </div>
        </div>

        {/* Follow-up questions hint */}
        {q.followUpQuestions?.length > 0 && (
          <div className="ml-11 mb-4 p-3 rounded-lg bg-brand-500/5 border border-brand-500/15">
            <p className="text-xs text-slate-500 mb-1">Possible follow-ups:</p>
            {q.followUpQuestions.slice(0,2).map((fq, i) => <p key={i} className="text-slate-400 text-xs">• {fq}</p>)}
          </div>
        )}

        {/* Answer */}
        <div className="ml-11">
          <textarea
            value={answers[qIndex] || ''}
            onChange={e => setAnswers(prev => ({ ...prev, [qIndex]: e.target.value }))}
            disabled={!!evaluations[qIndex]}
            placeholder="Type your answer here... Be thorough and explain your thought process."
            rows={6}
            className="w-full px-4 py-3 bg-dark-600 border border-white/8 text-white rounded-xl resize-none outline-none focus:border-brand-500/50 focus:ring-2 focus:ring-brand-500/10 transition-all text-sm placeholder-slate-600 disabled:opacity-60 disabled:cursor-not-allowed"
          />
        </div>
      </div>

      {/* AI Feedback */}
      {evaluations[qIndex] && (
        <div className="glass-card p-5 border-brand-500/20 animate-slide-up">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle size={16} className="text-green-400" />
            <span className="text-sm font-semibold text-white">AI Feedback</span>
            <span className="ml-auto text-2xl font-bold gradient-text">{evaluations[qIndex].score}/10</span>
          </div>
          <p className="text-slate-300 text-sm leading-relaxed mb-3">{evaluations[qIndex].feedback}</p>
          {evaluations[qIndex].improvements?.length > 0 && (
            <div>
              <p className="text-xs text-slate-500 mb-2">Areas to improve:</p>
              {evaluations[qIndex].improvements.map((imp, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-slate-400 mb-1">
                  <AlertCircle size={12} className="text-yellow-500 mt-0.5 flex-shrink-0" />
                  <span>{imp}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button onClick={() => setQIndex(q => q - 1)} disabled={qIndex === 0}
          className="btn-ghost flex items-center gap-2 text-sm disabled:opacity-40">
          <ChevronLeft size={16} /> Previous
        </button>

        <div className="flex items-center gap-3">
          {!evaluations[qIndex] && (
            <button onClick={submitAnswer} disabled={submitting || !answers[qIndex]?.trim()}
              className="btn-ghost flex items-center gap-2 text-sm disabled:opacity-40">
              {submitting ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
              Evaluate Answer
            </button>
          )}

          {qIndex === totalQ - 1 ? (
            <button onClick={completeInterview} disabled={completing}
              className="btn-primary flex items-center gap-2 text-sm px-6 py-2.5">
              {completing ? <><Loader2 size={16} className="animate-spin" /> Finishing...</> : <><CheckCircle size={16} /> Finish Interview</>}
            </button>
          ) : (
            <button onClick={goNext} disabled={submitting}
              className="btn-primary flex items-center gap-2 text-sm px-6 py-2.5">
              Next <ChevronRight size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Question Map */}
      <div className="glass-card p-4">
        <p className="text-slate-500 text-xs mb-3">Question Navigator</p>
        <div className="flex flex-wrap gap-2">
          {interview.questions.map((_, i) => (
            <button key={i} onClick={() => setQIndex(i)}
              className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all ${
                i === qIndex ? 'bg-brand-500 text-white' :
                evaluations[i] ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                answers[i] ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                'bg-dark-600 text-slate-500 border border-white/8'
              }`}>
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
