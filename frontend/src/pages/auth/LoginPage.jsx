import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { loginUser } from "@/store/slices/authSlice";
import { Eye, EyeOff, Loader2 } from "lucide-react";
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
      className="bg-card p-8 rounded-xl shadow-lg"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
    >
      <h2 className="text-3xl font-bold text-white mb-2">Welcome back</h2>
      <p className="text-slate-400 mb-8">
        Sign in to continue your prep journey
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Email
          </label>
          <input
            {...register("email", {
              required: "Email required",
              pattern: { value: /^\S+@\S+$/i, message: "Invalid email" },
            })}
            type="email"
            placeholder="you@example.com"
            className="input-dark"
          />
          {errors.email && (
            <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Password
          </label>
          <div className="relative">
            <input
              {...register("password", { required: "Password required" })}
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="input-dark pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-400 text-xs mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="flex justify-end">
          <Link
            to="/forgot-password"
            className="text-sm text-brand-400 hover:text-brand-300 transition-colors"
          >
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full flex items-center justify-center gap-2 py-3.5"
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" /> Signing in...
            </>
          ) : (
            "Sign In"
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <span className="text-slate-400 text-sm">Don't have an account? </span>
        <Link
          to="/register"
          className="text-brand-400 hover:text-brand-300 text-sm font-medium transition-colors"
        >
          Create one free
        </Link>
      </div>
    </motion.div>
  );
}
