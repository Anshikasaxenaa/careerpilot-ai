import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import api from '@/services/api';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await api.post(`/auth/reset-password/${token}`, { password: data.password });
      toast.success('Password reset! Please login.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Reset failed');
    } finally { setLoading(false); }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-white mb-2">Reset password</h2>
      <p className="text-slate-400 mb-8">Choose a new strong password.</p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">New Password</label>
          <div className="relative">
            <input {...register('password', { required: true, minLength: { value: 8, message: 'Min 8 chars' } })} type={showPass ? 'text' : 'password'} placeholder="New password" className="input-dark pr-12" />
            <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
              {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Confirm Password</label>
          <input {...register('confirm', { validate: v => v === watch('password') || 'Passwords do not match' })} type="password" placeholder="Confirm" className="input-dark" />
          {errors.confirm && <p className="text-red-400 text-xs mt-1">{errors.confirm.message}</p>}
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 py-3.5">
          {loading ? <><Loader2 size={18} className="animate-spin" /> Resetting...</> : 'Reset Password'}
        </button>
      </form>
    </div>
  );
}
