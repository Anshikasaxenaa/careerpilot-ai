import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { registerUser } from "@/store/slices/authSlice";
import { Eye, EyeOff, Loader2, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

export default function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((s) => s.auth);
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await dispatch(
        registerUser({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      ).unwrap();
      toast.success("Account created! Check your email to verify.");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err || "Registration failed");
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
        <h2 className="text-3xl font-display font-bold text-white mb-3 tracking-tight">
          Create Account
        </h2>
        <p className="text-zinc-400">
          Join thousands of developers leveling up their careers.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-zinc-300 mb-2">
            Full Name
          </label>
          <input
            {...register("name", {
              required: "Name is required",
              minLength: { value: 2, message: "Name too short" },
            })}
            type="text"
            placeholder="Alex Johnson"
            className="w-full bg-zinc-900/50 border border-zinc-800 text-white rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500/50 transition-all placeholder:text-zinc-600 shadow-inner"
          />
          {errors.name && (
            <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="text-red-400 text-xs mt-2 font-medium">{errors.name.message}</motion.p>
          )}
        </div>

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
            <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="text-red-400 text-xs mt-2 font-medium">{errors.email.message}</motion.p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-zinc-300 mb-2">
            Password
          </label>
          <div className="relative">
            <input
              {...register("password", {
                required: "Password is required",
                minLength: { value: 8, message: "Min 8 characters" },
              })}
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

        <div>
          <label className="block text-sm font-semibold text-zinc-300 mb-2">
            Confirm Password
          </label>
          <input
            {...register("confirm", {
              required: "Please confirm password",
              validate: (v) =>
                v === watch("password") || "Passwords do not match",
            })}
            type="password"
            placeholder="••••••••"
            className="w-full bg-zinc-900/50 border border-zinc-800 text-white rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500/50 transition-all placeholder:text-zinc-600 shadow-inner"
          />
          {errors.confirm && (
            <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="text-red-400 text-xs mt-2 font-medium">
              {errors.confirm.message}
            </motion.p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full flex items-center justify-center gap-2 py-4 mt-8 group"
        >
          {loading ? (
            <>
              <Loader2 size={20} className="animate-spin" /> Creating account...
            </>
          ) : (
            <>
              Create Account <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </form>

      <div className="mt-8 text-center pt-6 border-t border-zinc-800">
        <span className="text-zinc-400 text-sm">
          Already have an account?{" "}
        </span>
        <Link
          to="/login"
          className="text-white hover:text-brand-400 text-sm font-bold transition-colors ml-1 border-b border-transparent hover:border-brand-400 pb-0.5"
        >
          Sign in
        </Link>
      </div>
    </motion.div>
  );
}
