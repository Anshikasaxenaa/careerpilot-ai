import { Outlet, NavLink, useNavigate, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/store/slices/authSlice";
import { toggleSidebar } from "@/store/slices/uiSlice";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  FileText,
  Brain,
  BarChart3,
  Map,
  Code2,
  Settings,
  LogOut,
  Menu,
  ShieldCheck,
} from "lucide-react";

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/interview", icon: Brain, label: "Mock Interview" },
  { to: "/resume", icon: FileText, label: "Resume Analysis" },
  { to: "/coding", icon: Code2, label: "Coding" },
  { to: "/analytics", icon: BarChart3, label: "Analytics" },
  { to: "/roadmap", icon: Map, label: "Roadmap" },
];

export default function DashboardLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((s) => s.auth);
  const { sidebarOpen } = useSelector((s) => s.ui);

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <div className="flex h-screen bg-[#060609] text-white overflow-hidden font-sans selection:bg-brand-500/30">
      {/* Sidebar Overlay for Mobile */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => dispatch(toggleSidebar())}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ 
          width: sidebarOpen ? 260 : 88,
          x: sidebarOpen ? 0 : (window.innerWidth < 1024 ? -88 : 0) // Hide entirely on mobile when closed
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed lg:static inset-y-0 left-0 z-50 flex-shrink-0 flex flex-col bg-[#0b0a10] border-r border-white/5 shadow-2xl lg:shadow-none"
      >
        {/* Logo Area */}
        <div className="flex items-center gap-4 px-6 py-6 h-20 border-b border-white/5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-glow">
            P
          </div>
          <AnimatePresence mode="popLayout">
            {sidebarOpen && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="font-display font-bold text-xl tracking-tight whitespace-nowrap"
              >
                PrepAI
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto hide-scrollbar">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `relative flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group ${isActive ? 'text-white' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'}`}
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.div
                      layoutId="active-nav"
                      className="absolute inset-0 bg-brand-500/10 border border-brand-500/20 rounded-xl"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <Icon size={20} className={`flex-shrink-0 relative z-10 transition-colors ${isActive ? 'text-brand-400' : 'group-hover:text-slate-300'}`} />
                  
                  <AnimatePresence mode="popLayout">
                    {sidebarOpen && (
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2 }}
                        className="relative z-10 font-medium whitespace-nowrap"
                      >
                        {label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </>
              )}
            </NavLink>
          ))}
          
          {user?.role === "admin" && (
            <div className="pt-4 mt-4 border-t border-white/5">
              <NavLink
                to="/admin"
                className={({ isActive }) => `relative flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group ${isActive ? 'text-white' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'}`}
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.div
                        layoutId="active-nav"
                        className="absolute inset-0 bg-red-500/10 border border-red-500/20 rounded-xl"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      />
                    )}
                    <ShieldCheck size={20} className={`flex-shrink-0 relative z-10 ${isActive ? 'text-red-400' : ''}`} />
                    <AnimatePresence>
                      {sidebarOpen && (
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="relative z-10 font-medium whitespace-nowrap"
                        >
                          Admin Panel
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </>
                )}
              </NavLink>
            </div>
          )}
        </nav>

        {/* Footer Actions */}
        <div className="px-4 py-6 border-t border-white/5 space-y-2 bg-[#0b0a10]">
          <NavLink
            to="/profile"
            className={({ isActive }) => `flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 ${isActive ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
          >
            <Settings size={20} />
            <AnimatePresence mode="popLayout">
              {sidebarOpen && (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="font-medium whitespace-nowrap">
                  Settings
                </motion.span>
              )}
            </AnimatePresence>
          </NavLink>
          <button
            onClick={() => {
              dispatch(logout());
              navigate("/login");
            }}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-all duration-300"
          >
            <LogOut size={20} />
            <AnimatePresence mode="popLayout">
              {sidebarOpen && (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="font-medium whitespace-nowrap">
                  Sign Out
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#060609] relative">
        {/* Subtle Background Glows */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-600/10 rounded-full blur-[120px] pointer-events-none" />
        
        {/* Top Header */}
        <header className="h-20 flex-shrink-0 flex items-center justify-between px-6 lg:px-10 border-b border-white/5 bg-[#0b0a10]/80 backdrop-blur-xl sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => dispatch(toggleSidebar())}
              className="p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all active:scale-95"
            >
              <Menu size={22} />
            </button>
            <h2 className="text-xl font-display font-semibold hidden sm:block text-slate-200">
              Welcome back, {user?.name?.split(' ')[0]}
            </h2>
          </div>
          
          <div className="flex items-center gap-5">
            <div className="hidden sm:flex flex-col items-end mr-2">
              <span className="text-sm font-medium text-slate-200">{user?.name}</span>
              <span className="text-xs text-brand-400 font-medium tracking-wide">PRO PLAN</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-500 to-cyan-400 p-[2px] shadow-glow cursor-pointer hover:scale-105 transition-transform">
              <div className="w-full h-full rounded-full bg-[#0b0a10] flex items-center justify-center border border-transparent">
                <span className="text-white font-bold text-sm">{user?.name?.[0]?.toUpperCase()}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-10 hide-scrollbar relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mx-auto w-full max-w-7xl"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
}
