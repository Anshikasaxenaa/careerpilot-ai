import { useState, useRef, useEffect } from 'react';
import api from '@/services/api';
import { X, Send, Loader2, MessageSquare, Bot } from 'lucide-react';

const SUGGESTED = [
  'How do I prepare for a system design interview?',
  'Tips to improve my ATS score?',
  'How to answer behavioral questions?',
  'What topics should I study for DSA?',
];

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi! I'm PrepAI Assistant 🎯 I can help with interview prep, resume tips, career guidance, and more. What would you like to work on?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async (text) => {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: msg }]);
    setLoading(true);
    try {
      const history = messages.slice(-8);
      const { data } = await api.post('/chatbot/message', { message: msg, history });
      setMessages(prev => [...prev, { role: 'assistant', content: data.message }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I couldn't connect. Please try again." }]);
    } finally { setLoading(false); }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {open && (
        <div className="mb-4 w-80 sm:w-96 rounded-2xl overflow-hidden shadow-2xl shadow-black/50 border border-white/10 animate-slide-up"
          style={{ background: 'rgba(18,18,28,0.97)', backdropFilter: 'blur(20px)' }}>

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-white/8"
            style={{ background: 'linear-gradient(135deg, rgba(108,63,255,0.2), rgba(168,85,247,0.1))' }}>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500 to-purple-500 flex items-center justify-center">
                <Bot size={16} className="text-white" />
              </div>
              <div>
                <div className="text-white text-sm font-semibold">PrepAI Assistant</div>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-green-400 text-xs">Online</span>
                </div>
              </div>
            </div>
            <button onClick={() => setOpen(false)}
              className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10">
              <X size={16} />
            </button>
          </div>

          {/* Messages */}
          <div className="h-80 overflow-y-auto p-4 space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {m.role === 'assistant' && (
                  <div className="w-6 h-6 rounded-lg bg-brand-500/20 flex items-center justify-center flex-shrink-0 mt-1 mr-2">
                    <Bot size={12} className="text-brand-400" />
                  </div>
                )}
                <div className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${m.role === 'user'
                  ? 'bg-gradient-to-br from-brand-500 to-purple-500 text-white rounded-tr-sm'
                  : 'bg-dark-600 text-slate-300 border border-white/5 rounded-tl-sm'}`}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-brand-500/20 flex items-center justify-center flex-shrink-0">
                  <Bot size={12} className="text-brand-400" />
                </div>
                <div className="bg-dark-600 border border-white/5 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Suggestions */}
          {messages.length === 1 && (
            <div className="px-4 pb-3 flex flex-wrap gap-1.5">
              {SUGGESTED.map(s => (
                <button key={s} onClick={() => send(s)}
                  className="px-2.5 py-1 bg-brand-500/10 text-brand-300 rounded-lg text-xs border border-brand-500/20 hover:bg-brand-500/20 transition-colors text-left">
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="px-3 pb-3 border-t border-white/5 pt-3">
            <div className="flex items-center gap-2 bg-dark-600 rounded-xl border border-white/8 focus-within:border-brand-500/40 transition-colors px-3 py-2">
              <input type="text" value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
                placeholder="Ask anything about interviews..."
                className="flex-1 bg-transparent text-white text-sm outline-none placeholder-slate-600"
                disabled={loading} />
              <button onClick={() => send()} disabled={!input.trim() || loading}
                className={`p-1.5 rounded-lg transition-all ${input.trim() && !loading
                  ? 'bg-brand-500 text-white hover:bg-brand-600'
                  : 'text-slate-600'}`}>
                {loading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FAB */}
      <button onClick={() => setOpen(!open)}
        className="w-14 h-14 rounded-2xl shadow-2xl shadow-brand-500/30 flex items-center justify-center transition-all duration-300 hover:scale-110 relative"
        style={{ background: 'linear-gradient(135deg, #6c3fff, #a855f7)' }}>
        {open ? <X size={22} className="text-white" /> : <MessageSquare size={22} className="text-white" />}
        {!open && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-[#0a0a0f] animate-pulse" />
        )}
      </button>
    </div>
  );
}