import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { registerUser } from "@/store/slices/authSlice";
import { Eye, EyeOff, Loader2, UserPlus, Mail, Lock, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

export default function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((s) => s.auth);
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm({ mode: "onChange" });

  const onSubmit = async (data) => {
    try {
      await dispatch(
        registerUser({
          name: data.name,
          email: data.email,
          password: data.password,
        })
      ).unwrap();
      toast.success("Account created successfully!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err || "Registration failed");
    }
  };

  const passwordValue = watch("password");

  return (
    <div className="min-h-[85vh] w-full flex items-center justify-center py-12 px-4 sm:px-6 relative overflow-hidden">
      {/* Background Animated Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-brand-500/20 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-500/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: "2s" }} />

      <motion.div
        className="w-full max-w-md relative z-10"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="bg-black/40 backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl overflow-hidden">
          
          {/* Header Section */}
          <div className="bg-gradient-to-br from-brand-500/20 to-purple-500/20 p-8 text-center border-b border-white/5 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            <motion.div 
              initial={{ scale: 0 }} 
              animate={{ scale: 1 }} 
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-16 h-16 bg-gradient-to-br from-brand-400 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-brand-500/30"
            >
              <UserPlus className="text-white w-8 h-8" />
            </motion.div>
            <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Join Us Today</h2>
            <p className="text-zinc-300 text-sm">Create an account to unlock your potential.</p>
          </div>

          {/* Form Section */}
          <div className="p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Name Field */}
              <div className="relative group">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1 block">Full Name</label>
                <div className="relative flex items-center">
                  <div className="absolute left-3 text-zinc-500 group-focus-within:text-brand-400 transition-colors">
                    <UserPlus size={18} />
                  </div>
                  <input
                    {...register("name", {
                      required: "Name is required",
                      minLength: { value: 2, message: "Name must be at least 2 characters" },
                    })}
                    type="text"
                    placeholder="John Doe"
                    className="w-full bg-zinc-900/50 border border-zinc-700/50 text-white rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500/50 transition-all placeholder:text-zinc-600"
                  />
                </div>
                <AnimatePresence>
                  {errors.name && (
                    <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="text-red-400 text-xs mt-1.5 font-medium ml-1">
                      {errors.name.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Email Field */}
              <div className="relative group">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1 block">Email Address</label>
                <div className="relative flex items-center">
                  <div className="absolute left-3 text-zinc-500 group-focus-within:text-brand-400 transition-colors">
                    <Mail size={18} />
                  </div>
                  <input
                    {...register("email", {
                      required: "Email is required",
                      pattern: { value: /^\S+@\S+$/i, message: "Please enter a valid email" },
                    })}
                    type="email"
                    placeholder="john@example.com"
                    className="w-full bg-zinc-900/50 border border-zinc-700/50 text-white rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500/50 transition-all placeholder:text-zinc-600"
                  />
                </div>
                <AnimatePresence>
                  {errors.email && (
                    <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="text-red-400 text-xs mt-1.5 font-medium ml-1">
                      {errors.email.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Password Field */}
              <div className="relative group">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1 block">Password</label>
                <div className="relative flex items-center">
                  <div className="absolute left-3 text-zinc-500 group-focus-within:text-brand-400 transition-colors">
                    <Lock size={18} />
                  </div>
                  <input
                    {...register("password", {
                      required: "Password is required",
                      minLength: { value: 8, message: "Must be at least 8 characters" },
                    })}
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="w-full bg-zinc-900/50 border border-zinc-700/50 text-white rounded-xl pl-10 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500/50 transition-all placeholder:text-zinc-600"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-zinc-500 hover:text-white transition-colors p-1"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <AnimatePresence>
                  {errors.password && (
                    <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="text-red-400 text-xs mt-1.5 font-medium ml-1">
                      {errors.password.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Confirm Password Field */}
              <div className="relative group">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1 block">Confirm Password</label>
                <div className="relative flex items-center">
                  <div className="absolute left-3 text-zinc-500 group-focus-within:text-brand-400 transition-colors">
                    <CheckCircle2 size={18} />
                  </div>
                  <input
                    {...register("confirm", {
                      required: "Please confirm your password",
                      validate: (val) => val === passwordValue || "Passwords do not match",
                    })}
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className={`w-full bg-zinc-900/50 border text-white rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all placeholder:text-zinc-600 ${
                      watch("confirm") && watch("confirm") === passwordValue
                        ? "border-green-500/50 focus:border-green-500/50 focus:ring-green-500/30"
                        : "border-zinc-700/50 focus:border-brand-500/50"
                    }`}
                  />
                </div>
                <AnimatePresence>
                  {errors.confirm && (
                    <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="text-red-400 text-xs mt-1.5 font-medium ml-1">
                      {errors.confirm.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              <motion.button
                type="submit"
                disabled={loading || !isValid}
                whileHover={isValid && !loading ? { scale: 1.02 } : {}}
                whileTap={isValid && !loading ? { scale: 0.98 } : {}}
                className={`w-full flex items-center justify-center gap-2 py-3.5 mt-4 rounded-xl font-semibold text-white shadow-lg transition-all duration-300 ${
                  isValid && !loading
                    ? "bg-gradient-to-r from-brand-500 to-purple-600 hover:from-brand-400 hover:to-purple-500 shadow-brand-500/25"
                    : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                }`}
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" /> Processing...
                  </>
                ) : (
                  "Create Account"
                )}
              </motion.button>
            </form>

            <div className="mt-8 pt-6 border-t border-white/5 text-center">
              <p className="text-zinc-400 text-sm">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-white hover:text-brand-400 font-semibold transition-colors relative group inline-block"
                >
                  Sign in here
                  <span className="absolute -bottom-0.5 left-0 w-0 h-[2px] bg-brand-400 transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
