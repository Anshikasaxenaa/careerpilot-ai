import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import api from '@/services/api';
import { Loader2, ArrowLeft, Mail } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', data);
      setSent(true);
      toast.success('Reset link sent to your email!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send reset link');
    } finally { setLoading(false); }
  };

  if (sent) return (
    <div className="text-center">
      <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
        <Mail size={28} className="text-green-400" />
      </div>
      <h2 className="text-2xl font-bold text-white mb-3">Check your email</h2>
      <p className="text-slate-400 mb-6">We've sent a password reset link to your email address.</p>
      <Link to="/login" className="btn-ghost inline-flex items-center gap-2"><ArrowLeft size={16} /> Back to Login</Link>
    </div>
  );

  return (
    <div>
      <Link to="/login" className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-8 transition-colors">
        <ArrowLeft size={16} /> Back to login
      </Link>
      <h2 className="text-3xl font-bold text-white mb-2">Forgot password?</h2>
      <p className="text-slate-400 mb-8">Enter your email and we'll send you a reset link.</p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
          <input {...register('email', { required: 'Email required' })} type="email" placeholder="you@example.com" className="input-dark" />
          {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 py-3.5">
          {loading ? <><Loader2 size={18} className="animate-spin" /> Sending...</> : 'Send Reset Link'}
        </button>
      </form>
    </div>
  );
}
