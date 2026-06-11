import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sun, Moon, Star, ArrowRight, PlayCircle, CheckCircle2, BookOpen, Users, MonitorPlay, Layers } from "lucide-react";
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
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] font-sans transition-colors duration-300 overflow-x-hidden">
      
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 md:px-12 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2 cursor-pointer">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center font-bold text-lg text-white shadow-glow">
            P
          </div>
          <span className="text-2xl font-display font-bold tracking-tight text-[var(--text-h)]">PrepAI</span>
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
            className="p-2 rounded-full hover:bg-[var(--border)] transition-colors"
          >
            {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
          </button>
          <Link to="/login" className="hidden sm:block font-semibold hover:text-brand-500 transition-colors">
            Sign in
          </Link>
          <Link to="/register" className="bg-brand-500 hover:bg-brand-600 text-white px-5 py-2.5 rounded-lg font-semibold transition-colors shadow-glow">
            Create free account
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 pt-12 pb-24 flex flex-col lg:flex-row items-center gap-12 relative">
        <div className="absolute top-20 left-10 w-3 h-3 bg-brand-500 rounded-full" />
        <div className="absolute bottom-20 right-20 w-4 h-4 bg-purple-500 rounded-full" />
        <div className="absolute top-40 right-1/3 w-2 h-2 bg-accent-yellow rounded-full" />

        <motion.div className="flex-1 z-10" initial="hidden" animate="visible" variants={container}>
          <motion.h1 className="text-5xl lg:text-7xl font-display font-bold text-[var(--text-h)] leading-[1.1] mb-6" variants={item}>
            Up Your <span className="text-accent-yellow">Skills</span> <br />
            To <span className="text-brand-500">Advance</span> Your <br />
            Career <span className="text-slate-400">Path</span>
          </motion.h1>
          <motion.p className="text-lg md:text-xl text-[var(--text)] mb-8 max-w-lg leading-relaxed" variants={item}>
            Learn UI/UX Design skills with immersive AI. The ideal online learning system and material that help your knowledge growing.
          </motion.p>
          <motion.div className="flex flex-wrap items-center gap-4 mb-12" variants={item}>
            <Link to="/register" className="bg-brand-500 hover:bg-brand-600 text-white px-8 py-3.5 rounded-lg font-semibold transition-colors shadow-glow">
              Get Started
            </Link>
            <Link to="/login" className="flex items-center gap-2 border-2 border-[var(--border)] hover:border-brand-500 hover:text-brand-500 px-8 py-3 rounded-lg font-semibold transition-colors">
              Get free trial
            </Link>
          </motion.div>

          <motion.div className="flex items-center gap-6 text-sm font-medium" variants={item}>
            <span className="flex items-center gap-2"><CheckCircle2 className="text-accent-yellow" size={18}/> Public Speaking</span>
            <span className="flex items-center gap-2"><CheckCircle2 className="text-brand-500" size={18}/> Career-Oriented</span>
            <span className="flex items-center gap-2"><CheckCircle2 className="text-purple-500" size={18}/> Creative Thinking</span>
          </motion.div>
        </motion.div>

        <motion.div 
          className="flex-1 relative w-full flex justify-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          {/* Main Image Blob Background */}
          <div className="absolute inset-0 bg-gradient-to-tr from-brand-100 to-yellow-100 dark:from-brand-900/40 dark:to-yellow-900/20 rounded-full blur-[60px] -z-10" />
          
          <div className="relative z-10 w-[400px] h-[500px] rounded-[100px] overflow-hidden border-[12px] border-white dark:border-[var(--bg)] shadow-2xl">
            <img 
              src="https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
              alt="Student" 
              className="w-full h-full object-cover"
            />
          </div>

          {/* Floating Badges */}
          <motion.div 
            className="absolute top-10 right-10 bg-white dark:bg-[var(--code-bg)] p-4 rounded-2xl shadow-xl flex items-center gap-3"
            animate={{ y: [-10, 10, -10] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="w-10 h-10 bg-orange-100 dark:bg-orange-500/20 rounded-full flex items-center justify-center text-brand-500">
              <MonitorPlay size={20} />
            </div>
            <div>
              <p className="font-bold text-[var(--text-h)]">5K+</p>
              <p className="text-xs text-[var(--text)]">Online Courses</p>
            </div>
          </motion.div>

          <motion.div 
            className="absolute bottom-20 -left-10 bg-white dark:bg-[var(--code-bg)] p-4 rounded-2xl shadow-xl flex items-center gap-3"
            animate={{ y: [10, -10, 10] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-500/20 rounded-full flex items-center justify-center text-purple-500">
              <BookOpen size={20} />
            </div>
            <div>
              <p className="font-bold text-[var(--text-h)]">2K+</p>
              <p className="text-xs text-[var(--text)]">Video Courses</p>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Partners Section */}
      <section className="border-y border-[var(--border)] py-8">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-wrap items-center justify-between gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
          <div className="text-2xl font-bold font-display">250+ <span className="text-sm font-normal block">Collaboration</span></div>
          <div className="text-xl font-bold tracking-widest">duolingo</div>
          <div className="text-xl font-bold flex items-center gap-2"><Layers size={24}/> Codecov</div>
          <div className="text-xl font-bold flex items-center gap-2"><MonitorPlay size={24}/> UserTesting</div>
          <div className="text-xl font-bold">magic leap</div>
        </div>
      </section>

      {/* Services Section */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-24 text-center">
        <h3 className="text-accent-yellow font-bold mb-4 uppercase tracking-wider text-sm">Our Services</h3>
        <h2 className="text-3xl md:text-5xl font-display font-bold text-[var(--text-h)] mb-16 max-w-2xl mx-auto leading-tight">
          Fostering a playful & engaging learning environment
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { title: "Interaction Design", desc: "Lessons on design that cover the most recent developments.", icon: PlayCircle, bg: "bg-brand-500", text: "text-white" },
            { title: "UX Design Course", desc: "Classes in development that cover the most recent advancements in web.", icon: MonitorPlay, bg: "bg-[var(--code-bg)] border border-[var(--border)]", text: "text-[var(--text-h)]" },
            { title: "User Interface Design", desc: "User Interface Design courses that cover the most recent trends.", icon: Layers, bg: "bg-[var(--code-bg)] border border-[var(--border)]", text: "text-[var(--text-h)]" },
          ].map((s, i) => (
            <motion.div 
              key={i}
              className={`p-8 rounded-3xl text-left ${s.bg} feature-card transition-transform`}
              whileHover={{ y: -10 }}
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-white/20 dark:bg-white/5`}>
                <s.icon size={28} className={s.bg === 'bg-brand-500' ? 'text-white' : 'text-brand-500'} />
              </div>
              <h4 className={`text-2xl font-bold mb-4 ${s.text}`}>{s.title}</h4>
              <p className={s.bg === 'bg-brand-500' ? 'text-white/80' : 'text-[var(--text)]'}>{s.desc}</p>
              <button className={`mt-8 font-semibold flex items-center gap-2 ${s.bg === 'bg-brand-500' ? 'text-white' : 'text-[var(--text-h)]'}`}>
                Learn More <ArrowRight size={16} />
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Popular Class Section */}
      <section className="bg-[var(--code-bg)] py-24 border-y border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <h3 className="text-accent-yellow font-bold mb-2 uppercase tracking-wider text-sm">Explore Programs</h3>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-[var(--text-h)] mb-4">Our Most Popular Class</h2>
          <p className="text-[var(--text)] mb-12">Let's join our famous class, the knowledge provided will definitely be useful for you.</p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { img: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", tag: "Design", title: "Figma UI UX Design..", desc: "Use Figma to get a job in UI Design, User Interface, User Experience design.", rating: "4.5", reviews: "(120)", author: "Jane Cooper", price: "$17.84" },
              { img: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", tag: "Design", title: "Learn With Shoaib", desc: "Design Web, UI/UX and Mobile Apps that help users solve problems gracefully.", rating: "4.8", reviews: "(340)", author: "Jenny Wilson", price: "$8.99" },
              { img: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", tag: "Design", title: "Building User Interface..", desc: "Learn how to apply User Experience (UX) principles to your website designs.", rating: "4.2", reviews: "(15)", author: "Esther Howard", price: "$11.70" },
            ].map((course, i) => (
              <motion.div key={i} className="bg-[var(--bg)] border border-[var(--border)] rounded-2xl overflow-hidden hover:shadow-xl transition-all" whileHover={{ y: -5 }}>
                <div className="h-48 overflow-hidden relative">
                  <img src={course.img} alt={course.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-6">
                  <span className="text-brand-500 text-xs font-bold uppercase tracking-wider mb-2 block">{course.tag}</span>
                  <h4 className="text-xl font-bold text-[var(--text-h)] mb-2">{course.title}</h4>
                  <p className="text-[var(--text)] text-sm mb-4 line-clamp-2">{course.desc}</p>
                  <div className="flex items-center gap-2 mb-6">
                    <span className="text-sm font-bold text-[var(--text-h)]">{course.rating}</span>
                    <div className="flex text-accent-yellow"><Star size={14} fill="currentColor"/><Star size={14} fill="currentColor"/><Star size={14} fill="currentColor"/><Star size={14} fill="currentColor"/><Star size={14}/></div>
                    <span className="text-xs text-[var(--text)]">{course.reviews}</span>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-slate-300 overflow-hidden"><img src={`https://i.pravatar.cc/100?img=${i+1}`} alt="Avatar" /></div>
                      <div>
                        <p className="text-sm font-bold text-[var(--text-h)]">{course.author}</p>
                        <p className="text-xs text-[var(--text)]">2001 Enrolled</p>
                      </div>
                    </div>
                    <span className="text-xl font-bold text-brand-500">{course.price}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-12">
            <button className="bg-[var(--bg)] border border-[var(--border)] text-[var(--text-h)] px-6 py-2 rounded-lg font-semibold hover:bg-[var(--border)] transition-colors">
              Explore All Programs
            </button>
          </div>
        </div>
      </section>

      {/* Meet the Heroes */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-24 text-center">
        <h3 className="text-accent-yellow font-bold mb-4 uppercase tracking-wider text-sm">Tutors</h3>
        <h2 className="text-3xl md:text-5xl font-display font-bold text-[var(--text-h)] mb-6">Meet the Heroes</h2>
        <p className="text-[var(--text)] mb-16 max-w-2xl mx-auto">
          On Weekend UX, instructors from all over the world instruct millions of students. We offer the knowledge and abilities.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { name: "Theresa Webb", role: "Application Support Analyst", img: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" },
            { name: "Courtney Henry", role: "Director, Undergraduate Analytics", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" },
            { name: "Albert Flores", role: "Career Educator", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" },
            { name: "Marvin McKinney", role: "Co-op & Internships Program Manager", img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" },
          ].map((hero, i) => (
            <div key={i} className="bg-[var(--code-bg)] p-8 rounded-2xl border border-[var(--border)] flex flex-col items-center text-center hover:border-brand-500 transition-colors">
              <img src={hero.img} alt={hero.name} className="w-24 h-24 rounded-full object-cover mb-4 border-4 border-[var(--bg)] shadow-lg" />
              <h4 className="text-lg font-bold text-[var(--text-h)] mb-1">{hero.name}</h4>
              <p className="text-accent-yellow text-xs font-bold uppercase tracking-wider mb-4">{hero.role}</p>
              <p className="text-sm text-[var(--text)] mb-6">Former co-founder of Opendoor. Early staff at Spotify and Clearbit.</p>
              <div className="flex gap-3 text-brand-500 mt-auto">
                <a href="#" className="hover:text-brand-600"><span className="sr-only">Twitter</span> 𝕏</a>
                <a href="#" className="hover:text-brand-600">in</a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonial */}
      <section className="bg-[#fff9e6] dark:bg-yellow-900/20 py-24 border-y border-yellow-200 dark:border-yellow-900/50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="w-16 h-16 mx-auto bg-brand-500 rounded-full flex items-center justify-center text-white font-bold text-2xl mb-8">
            P
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 dark:text-yellow-100 mb-8 leading-snug">
            "Courses was fantastic! It is Master platform for those looking to start a new career, or need a refresher."
          </h2>
          <div className="flex flex-col items-center">
            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80" alt="Jacob Jones" className="w-12 h-12 rounded-full mb-3" />
            <p className="font-bold text-gray-900 dark:text-yellow-100">Jacob Jones</p>
            <p className="text-sm text-gray-600 dark:text-yellow-200/70">Student, National University</p>
          </div>
        </div>
      </section>

      {/* Blogs */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-24">
        <h2 className="text-2xl font-bold text-[var(--text-h)] mb-8">Our recent blogs</h2>
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="flex flex-col gap-8">
            {[
              { img: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80", date: "November 16, 2024", title: "Three Pillars of User Delight", desc: "Delight can be experienced viscerally, behaviorally, and reflectively." },
              { img: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80", date: "September 24, 2024", title: "UX Mapping Methods", desc: "Visual-design principles can be applied consistently throughout the process of creating a polished UX map." }
            ].map((blog, i) => (
              <div key={i} className="flex gap-6 group cursor-pointer">
                <img src={blog.img} alt={blog.title} className="w-48 h-32 object-cover rounded-xl group-hover:opacity-90 transition-opacity" />
                <div>
                  <p className="text-accent-yellow text-xs font-bold mb-2">{blog.date}</p>
                  <h4 className="text-lg font-bold text-[var(--text-h)] mb-2 group-hover:text-brand-500 transition-colors">{blog.title}</h4>
                  <p className="text-sm text-[var(--text)] line-clamp-2">{blog.desc}</p>
                  <div className="flex gap-2 mt-3">
                    <span className="text-xs bg-brand-500/10 text-brand-500 px-2 py-1 rounded-full font-semibold">Research</span>
                    <span className="text-xs bg-brand-500/10 text-brand-500 px-2 py-1 rounded-full font-semibold">UI UX</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="group cursor-pointer">
            <img src="https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Agile" className="w-full h-64 object-cover rounded-2xl mb-6 group-hover:opacity-90 transition-opacity" />
            <p className="text-accent-yellow text-xs font-bold mb-2">March 13, 2014</p>
            <h4 className="text-2xl font-bold text-[var(--text-h)] mb-3 group-hover:text-brand-500 transition-colors">Agile Development Projects and Usability</h4>
            <p className="text-[var(--text)] mb-4">Agile methods aim to overcome usability barriers in traditional development, but post new threats to user experience quality.</p>
            <div className="flex gap-2 mt-3">
              <span className="text-xs bg-brand-500/10 text-brand-500 px-2 py-1 rounded-full font-semibold">Programming</span>
              <span className="text-xs bg-brand-500/10 text-brand-500 px-2 py-1 rounded-full font-semibold">Research</span>
              <span className="text-xs bg-brand-500/10 text-brand-500 px-2 py-1 rounded-full font-semibold">Developments</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-16 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center font-bold text-white">P</div>
              <span className="text-xl font-display font-bold text-white">PrepAI</span>
            </div>
            <p className="text-sm text-slate-400 max-w-xs mb-8">Top learning experiences that create more talent in the world.</p>
            <div className="flex gap-4">
              <a href="#" className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-brand-500 hover:text-white transition-colors">𝕏</a>
              <a href="#" className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-brand-500 hover:text-white transition-colors">in</a>
              <a href="#" className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-brand-500 hover:text-white transition-colors">f</a>
            </div>
          </div>
          <div>
            <h5 className="text-white font-bold mb-4">Product</h5>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-brand-500">Overview</a></li>
              <li><a href="#" className="hover:text-brand-500">Features</a></li>
              <li><a href="#" className="hover:text-brand-500">Solutions</a></li>
              <li><a href="#" className="hover:text-brand-500">Tutorials</a></li>
              <li><a href="#" className="hover:text-brand-500">Pricing</a></li>
            </ul>
          </div>
          <div>
            <h5 className="text-white font-bold mb-4">Company</h5>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-brand-500">About us</a></li>
              <li><a href="#" className="hover:text-brand-500">Careers</a></li>
              <li><a href="#" className="flex items-center gap-2 hover:text-brand-500">Press <span className="text-[10px] bg-white text-slate-900 px-1.5 py-0.5 rounded font-bold">NEW</span></a></li>
              <li><a href="#" className="hover:text-brand-500">News</a></li>
            </ul>
          </div>
          <div>
            <h5 className="text-white font-bold mb-4">Social</h5>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-brand-500">Twitter</a></li>
              <li><a href="#" className="hover:text-brand-500">LinkedIn</a></li>
              <li><a href="#" className="hover:text-brand-500">GitHub</a></li>
              <li><a href="#" className="hover:text-brand-500">Dribbble</a></li>
            </ul>
          </div>
        </div>
      </footer>

    </div>
  );
}
