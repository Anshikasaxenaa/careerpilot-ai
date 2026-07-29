import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { loginUser } from "@/store/slices/authSlice";
import { Eye, EyeOff, Loader2, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((s) => s.auth);
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await dispatch(loginUser(data)).unwrap();
      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch (err) {
      const msg = (err && err.message) || err || "Login failed";
      toast.error(msg);
    }
  };

  return (
    <motion.div
      className="glass-card p-10 sm:p-12"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-display font-bold text-white mb-3 tracking-tight">Welcome Back</h2>
        <p className="text-zinc-400">
          Sign in to access your dashboard and continue your preparation.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-zinc-300 mb-2">
            Email Address
          </label>
          <input
            {...register("email", {
              required: "Email is required",
              pattern: { value: /^\S+@\S+$/i, message: "Invalid email format" },
            })}
            type="email"
            placeholder="you@company.com"
            className="w-full bg-zinc-900/50 border border-zinc-800 text-white rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500/50 transition-all placeholder:text-zinc-600 shadow-inner"
          />
          {errors.email && (
            <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="text-red-400 text-xs mt-2 font-medium">
              {errors.email.message}
            </motion.p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-zinc-300 mb-2">
            Password
          </label>
          <div className="relative">
            <input
              {...register("password", { required: "Password is required" })}
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="w-full bg-zinc-900/50 border border-zinc-800 text-white rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500/50 transition-all placeholder:text-zinc-600 shadow-inner pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors p-1"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && (
            <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="text-red-400 text-xs mt-2 font-medium">
              {errors.password.message}
            </motion.p>
          )}
        </div>

        <div className="flex justify-between items-center pt-2">
          <label className="flex items-center gap-2 cursor-pointer group">
            <div className="relative flex items-center justify-center">
              <input type="checkbox" className="peer appearance-none w-5 h-5 border border-zinc-700 rounded bg-zinc-900/50 checked:bg-brand-500 checked:border-brand-500 transition-colors cursor-pointer" />
              <svg className="absolute w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" viewBox="0 0 14 10" fill="none">
                <path d="M1 5L4.5 8.5L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-sm font-medium text-zinc-400 group-hover:text-zinc-300 transition-colors">Remember me</span>
          </label>

          <Link
            to="/forgot-password"
            className="text-sm font-semibold text-brand-400 hover:text-brand-300 transition-colors"
          >
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full flex items-center justify-center gap-2 py-4 mt-8 group"
        >
          {loading ? (
            <>
              <Loader2 size={20} className="animate-spin" /> Authenticating...
            </>
          ) : (
            <>
              Sign In <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </form>

      <div className="mt-8 text-center pt-6 border-t border-zinc-800">
        <span className="text-zinc-400 text-sm">Don't have an account? </span>
        <Link
          to="/register"
          className="text-white hover:text-brand-400 text-sm font-bold transition-colors ml-1 border-b border-transparent hover:border-brand-400 pb-0.5"
        >
          Create account
        </Link>
      </div>
    </motion.div>
  );
}
