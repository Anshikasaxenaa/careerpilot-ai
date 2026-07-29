import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sun, Moon, Star, ArrowRight, PlayCircle, CheckCircle2, BookOpen, Users, MonitorPlay, Layers, Brain, FileText, Code2 } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export default function LandingPage() {
  const { theme, toggleTheme } = useTheme();

  const container = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] font-sans transition-colors duration-300 overflow-x-hidden relative">
      
      {/* Absolute Ambient Background */}
      <div className="absolute top-0 left-0 w-full h-[600px] aurora-bg opacity-20 dark:opacity-10 pointer-events-none z-0 [mask-image:linear-gradient(to_bottom,white,transparent)]" style={{ WebkitMaskImage: 'linear-gradient(to bottom, black, transparent)' }} />

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-6 md:px-12 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2 cursor-pointer group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center font-bold text-lg text-white shadow-glow transition-transform group-hover:scale-105">
            P
          </div>
          <span className="text-2xl font-display font-bold tracking-tight text-[var(--text-h)] group-hover:text-brand-500 transition-colors">PrepAI</span>
        </div>
        
        <div className="hidden lg:flex items-center gap-8 font-medium text-sm">
          <a href="#" className="text-brand-500 font-semibold">Home</a>
          <a href="#" className="hover:text-brand-500 transition-colors">About us</a>
          <a href="#" className="hover:text-brand-500 transition-colors">Courses</a>
          <a href="#" className="hover:text-brand-500 transition-colors">Contact us</a>
          <a href="#" className="hover:text-brand-500 transition-colors">FAQs</a>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={toggleTheme} 
            className="p-2.5 rounded-full bg-[var(--code-bg)] border border-[var(--border)] hover:bg-[var(--border)] transition-colors shadow-sm"
          >
            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          <Link to="/login" className="hidden sm:block font-semibold hover:text-brand-500 transition-colors px-2">
            Sign in
          </Link>
          <Link to="/register" className="btn-primary">
            Create free account
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 pt-16 pb-28 flex flex-col lg:flex-row items-center gap-12 relative z-10">
        <div className="absolute top-20 left-10 w-3 h-3 bg-brand-500 rounded-full animate-pulse-slow" />
        <div className="absolute bottom-20 right-20 w-4 h-4 bg-cyan-400 rounded-full animate-pulse-slow" style={{ animationDelay: '1s' }} />
        <div className="absolute top-40 right-1/3 w-2 h-2 bg-accent-yellow rounded-full animate-pulse-slow" style={{ animationDelay: '2s' }} />

        <motion.div className="flex-1 z-10" initial="hidden" animate="visible" variants={container}>
          <motion.h1 className="text-5xl lg:text-7xl font-display font-bold text-[var(--text-h)] leading-[1.1] mb-6" variants={item}>
            Accelerate Your <br/>
            <span className="gradient-text text-glow">Tech Career</span> <br />
            With <span className="text-brand-500">PrepAI</span>
          </motion.h1>
          <motion.p className="text-lg md:text-xl text-[var(--text)] mb-10 max-w-lg leading-relaxed" variants={item}>
            Master coding interviews, refine your resume, and upskill with an immersive AI learning ecosystem designed for modern developers.
          </motion.p>
          <motion.div className="flex flex-wrap items-center gap-5 mb-12" variants={item}>
            <Link to="/register" className="btn-primary shadow-glow">
              Get Started Free <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="btn-ghost">
              View Demo
            </Link>
          </motion.div>

          <motion.div className="flex items-center gap-6 text-sm font-semibold" variants={item}>
            <span className="flex items-center gap-2"><CheckCircle2 className="text-accent-yellow" size={18}/> AI Interviews</span>
            <span className="flex items-center gap-2"><CheckCircle2 className="text-brand-500" size={18}/> Code Analysis</span>
            <span className="flex items-center gap-2"><CheckCircle2 className="text-cyan-400" size={18}/> Smart Roadmap</span>
          </motion.div>
        </motion.div>

        <motion.div 
          className="flex-1 relative w-full flex justify-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Main Image Background Glow */}
          <div className="absolute inset-0 bg-brand-500/20 dark:bg-brand-500/30 rounded-full blur-[80px] -z-10 animate-pulse-slow" />
          
          <div className="relative z-10 w-[420px] h-[520px] rounded-[40px] overflow-hidden border-[8px] border-white/50 dark:border-zinc-800/50 shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-sm">
            <img 
              src="https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
              alt="Student" 
              className="w-full h-full object-cover"
            />
            {/* Inner Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>

          {/* Floating Badges */}
          <motion.div 
            className="absolute top-16 -right-4 glass-card p-4 flex items-center gap-4 border-l-4 border-l-cyan-400"
            animate={{ y: [-10, 10, -10] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="w-12 h-12 bg-cyan-400/20 rounded-full flex items-center justify-center text-cyan-500 dark:text-cyan-400">
              <MonitorPlay size={24} />
            </div>
            <div>
              <p className="font-bold text-[var(--text-h)] text-lg">98%</p>
              <p className="text-xs font-semibold text-[var(--text)] uppercase tracking-wider">Success Rate</p>
            </div>
          </motion.div>

          <motion.div 
            className="absolute bottom-24 -left-8 glass-card p-4 flex items-center gap-4 border-l-4 border-l-brand-500"
            animate={{ y: [10, -10, 10] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="w-12 h-12 bg-brand-500/20 rounded-full flex items-center justify-center text-brand-500">
              <Brain size={24} />
            </div>
            <div>
              <p className="font-bold text-[var(--text-h)] text-lg">AI Driven</p>
              <p className="text-xs font-semibold text-[var(--text)] uppercase tracking-wider">Mock Interviews</p>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Partners Section */}
      <section className="border-y border-[var(--border)] py-10 bg-[var(--code-bg)]">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-wrap items-center justify-between gap-8 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
          <div className="text-2xl font-bold font-display">250+ <span className="text-sm font-normal block">Partnerships</span></div>
          <div className="text-xl font-bold tracking-widest">Google</div>
          <div className="text-xl font-bold flex items-center gap-2"><Layers size={24}/> Codecov</div>
          <div className="text-xl font-bold flex items-center gap-2"><MonitorPlay size={24}/> Meta</div>
          <div className="text-xl font-bold">Netflix</div>
        </div>
      </section>

      {/* Services Section */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-24 text-center">
        <h3 className="gradient-text font-bold mb-4 uppercase tracking-wider text-sm">Platform Features</h3>
        <h2 className="text-3xl md:text-5xl font-display font-bold text-[var(--text-h)] mb-16 max-w-3xl mx-auto leading-tight">
          An ecosystem designed to <span className="text-brand-500">supercharge</span> your tech career
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { title: "AI Mock Interviews", desc: "Experience realistic technical and behavioral interviews with instant AI feedback.", icon: Brain, bg: "bg-brand-500 text-white shadow-glow border-none" },
            { title: "Smart Resume Analysis", desc: "Get actionable insights to tailor your resume for top ATS systems and recruiters.", icon: FileText, bg: "glass-card text-[var(--text-h)]" },
            { title: "Coding Environment", desc: "Practice Data Structures & Algorithms in a fully-featured browser IDE.", icon: Code2, bg: "glass-card text-[var(--text-h)]" },
          ].map((s, i) => (
            <motion.div 
              key={i}
              className={`p-8 rounded-3xl text-left feature-card transition-transform ${s.bg}`}
              whileHover={{ y: -10 }}
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${s.bg.includes('bg-brand-500') ? 'bg-white/20' : 'bg-brand-500/10'}`}>
                <s.icon size={28} className={s.bg.includes('bg-brand-500') ? 'text-white' : 'text-brand-500'} />
              </div>
              <h4 className={`text-2xl font-bold mb-4 ${s.bg.includes('bg-brand-500') ? 'text-white' : 'text-[var(--text-h)]'}`}>{s.title}</h4>
              <p className={s.bg.includes('bg-brand-500') ? 'text-white/90' : 'text-[var(--text)]'}>{s.desc}</p>
              <button className={`mt-8 font-semibold flex items-center gap-2 transition-colors ${s.bg.includes('bg-brand-500') ? 'text-white hover:text-white/80' : 'text-brand-500 hover:text-brand-600'}`}>
                Learn More <ArrowRight size={16} />
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Popular Class Section */}
      <section className="bg-[var(--code-bg)] py-24 border-y border-[var(--border)] relative overflow-hidden">
        <div className="absolute inset-0 mesh-bg opacity-30 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <h3 className="gradient-text font-bold mb-2 uppercase tracking-wider text-sm">Learning Paths</h3>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-[var(--text-h)]">Trending Roadmaps</h2>
              <p className="text-[var(--text)] mt-4 max-w-xl">Follow structured learning paths curated by industry experts to master modern technologies.</p>
            </div>
            <button className="btn-ghost">
              Explore All Paths
            </button>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { img: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", tag: "Engineering", title: "Frontend Masterclass", desc: "Master React, Next.js, and modern CSS frameworks.", rating: "4.9", reviews: "(2.1k)", author: "Sarah Drasner", price: "$49.00" },
              { img: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", tag: "Backend", title: "Node.js & Microservices", desc: "Build scalable distributed systems with Node and Docker.", rating: "4.8", reviews: "(1.5k)", author: "Addy Osmani", price: "$59.00" },
              { img: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", tag: "System Design", title: "Cracking System Design", desc: "Prepare for high-level technical interviews at FAANG.", rating: "4.9", reviews: "(3.4k)", author: "Alex Xu", price: "$39.00" },
            ].map((course, i) => (
              <motion.div key={i} className="glass-card hover:shadow-2xl transition-all duration-500 group" whileHover={{ y: -8 }}>
                <div className="h-48 overflow-hidden relative">
                  <img src={course.img} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-4 right-4 bg-white/90 dark:bg-black/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-[var(--text-h)]">
                    {course.tag}
                  </div>
                </div>
                <div className="p-6">
                  <h4 className="text-xl font-bold text-[var(--text-h)] mb-2 group-hover:text-brand-500 transition-colors">{course.title}</h4>
                  <p className="text-[var(--text)] text-sm mb-6 line-clamp-2">{course.desc}</p>
                  
                  <div className="flex items-center gap-2 mb-6">
                    <span className="text-sm font-bold text-[var(--text-h)]">{course.rating}</span>
                    <div className="flex text-accent-yellow"><Star size={14} fill="currentColor"/><Star size={14} fill="currentColor"/><Star size={14} fill="currentColor"/><Star size={14} fill="currentColor"/><Star size={14} fill="currentColor"/></div>
                    <span className="text-xs text-[var(--text)]">{course.reviews}</span>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-300 overflow-hidden border border-brand-500/30"><img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="Avatar" /></div>
                      <div>
                        <p className="text-sm font-bold text-[var(--text-h)] leading-none">{course.author}</p>
                      </div>
                    </div>
                    <span className="text-lg font-bold gradient-text">{course.price}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="bg-brand-500/5 dark:bg-brand-500/10 py-24 border-y border-[var(--border)] relative">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="w-16 h-16 mx-auto bg-brand-500 rounded-2xl flex items-center justify-center text-white shadow-glow mb-8 transform rotate-3">
            <Users size={32} />
          </div>
          <h2 className="text-3xl md:text-5xl font-display font-bold text-[var(--text-h)] mb-10 leading-snug">
            "PrepAI completely changed how I prepare for interviews. The AI feedback was exactly what I needed to land my role at Google."
          </h2>
          <div className="flex flex-col items-center">
            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80" alt="Jacob Jones" className="w-14 h-14 rounded-full mb-4 border-2 border-brand-500 shadow-md" />
            <p className="font-bold text-[var(--text-h)] text-lg">Elena Rodriguez</p>
            <p className="text-sm text-brand-500 font-semibold uppercase tracking-wider">Software Engineer II, Google</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-zinc-950 text-zinc-400 py-16 border-t border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center font-bold text-white shadow-glow">P</div>
              <span className="text-xl font-display font-bold text-white">PrepAI</span>
            </div>
            <p className="text-sm text-zinc-500 max-w-xs mb-8">Empowering developers to achieve their career goals with AI-driven insights.</p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center hover:bg-brand-500 hover:text-white transition-all hover:scale-110">𝕏</a>
              <a href="#" className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center hover:bg-brand-500 hover:text-white transition-all hover:scale-110">in</a>
              <a href="#" className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center hover:bg-brand-500 hover:text-white transition-all hover:scale-110">f</a>
            </div>
          </div>
          <div>
            <h5 className="text-white font-bold mb-6 tracking-wider text-sm uppercase">Product</h5>
            <ul className="space-y-4 text-sm">
              <li><a href="#" className="hover:text-brand-400 transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-brand-400 transition-colors">Mock Interviews</a></li>
              <li><a href="#" className="hover:text-brand-400 transition-colors">Resume Analysis</a></li>
              <li><a href="#" className="hover:text-brand-400 transition-colors">Pricing</a></li>
            </ul>
          </div>
          <div>
            <h5 className="text-white font-bold mb-6 tracking-wider text-sm uppercase">Company</h5>
            <ul className="space-y-4 text-sm">
              <li><a href="#" className="hover:text-brand-400 transition-colors">About us</a></li>
              <li><a href="#" className="hover:text-brand-400 transition-colors">Careers</a></li>
              <li><a href="#" className="flex items-center gap-2 hover:text-brand-400 transition-colors">Press <span className="text-[10px] bg-brand-500 text-white px-1.5 py-0.5 rounded font-bold">NEW</span></a></li>
              <li><a href="#" className="hover:text-brand-400 transition-colors">Contact</a></li>
            </ul>
          </div>
          <div>
            <h5 className="text-white font-bold mb-6 tracking-wider text-sm uppercase">Legal</h5>
            <ul className="space-y-4 text-sm">
              <li><a href="#" className="hover:text-brand-400 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-brand-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-brand-400 transition-colors">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 md:px-12 mt-16 pt-8 border-t border-zinc-800 text-sm text-zinc-500 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© 2026 PrepAI. All rights reserved.</p>
          <p>Designed with precision.</p>
        </div>
      </footer>

    </div>
  );
}
