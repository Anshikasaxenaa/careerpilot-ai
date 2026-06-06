import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { registerUser } from '@/store/slices/authSlice';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector(s => s.auth);
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    const result = await dispatch(registerUser({ name: data.name, email: data.email, password: data.password }));
    if (registerUser.fulfilled.match(result)) {
      toast.success('Account created! Check your email to verify.');
      navigate('/dashboard');
    } else {
      toast.error(result.payload || 'Registration failed');
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-white mb-2">Create your account</h2>
      <p className="text-slate-400 mb-8">Start your AI-powered interview prep today</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
          <input
            {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'Name too short' } })}
            type="text"
            placeholder="Alex Johnson"
            className="input-dark"
          />
          {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
          <input
            {...register('email', { required: 'Email required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' } })}
            type="email"
            placeholder="you@example.com"
            className="input-dark"
          />
          {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
          <div className="relative">
            <input
              {...register('password', { required: 'Password required', minLength: { value: 8, message: 'Min 8 characters' } })}
              type={showPassword ? 'text' : 'password'}
              placeholder="Min. 8 characters"
              className="input-dark pr-12"
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Confirm Password</label>
          <input
            {...register('confirm', { required: 'Please confirm', validate: v => v === watch('password') || 'Passwords do not match' })}
            type="password"
            placeholder="Repeat password"
            className="input-dark"
          />
          {errors.confirm && <p className="text-red-400 text-xs mt-1">{errors.confirm.message}</p>}
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 py-3.5">
          {loading ? <><Loader2 size={18} className="animate-spin" /> Creating account...</> : 'Create Account'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <span className="text-slate-400 text-sm">Already have an account? </span>
        <Link to="/login" className="text-brand-400 hover:text-brand-300 text-sm font-medium">Sign in</Link>
      </div>
    </div>
  );
}
