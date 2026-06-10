import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { updateProfile } from '@/store/slices/authSlice';
import api from '@/services/api';
import {
  User, Mail, Phone, MapPin, Briefcase, Github, Linkedin,
  Lock, Save, Loader2, CheckCircle, Eye, EyeOff, Shield
} from 'lucide-react';
import toast from 'react-hot-toast';

const EXPERIENCE_OPTIONS = ['0-1', '1-3', '3-5', '5-10', '10+'];
const COMMON_SKILLS = ['JavaScript', 'Python', 'React', 'Node.js', 'TypeScript', 'Java', 'C++', 'SQL', 'MongoDB', 'AWS', 'Docker', 'Git', 'System Design', 'Data Structures', 'Algorithms'];

export default function ProfilePage() {
  const dispatch = useDispatch();
  const { user } = useSelector(s => s.auth);
  const [activeTab, setActiveTab] = useState('profile');
  const [saving, setSaving] = useState(false);
  const [changingPass, setChangingPass] = useState(false);
  const [showPass, setShowPass] = useState({ current: false, new: false, confirm: false });
  const [selectedSkills, setSelectedSkills] = useState(user?.skills || []);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: user?.name || '',
      'profile.bio': user?.profile?.bio || '',
      'profile.phone': user?.profile?.phone || '',
      'profile.location': user?.profile?.location || '',
      'profile.targetRole': user?.profile?.targetRole || '',
      'profile.experience': user?.profile?.experience || '0-1',
      'profile.linkedin': user?.profile?.linkedin || '',
      'profile.github': user?.profile?.github || '',
    },
  });

  const { register: regPass, handleSubmit: handlePass, reset: resetPass, watch, formState: { errors: passErrors } } = useForm();

  const toggleSkill = (skill) => {
    setSelectedSkills(prev => prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]);
  };

  const onSaveProfile = async (data) => {
    setSaving(true);
    try {
      await dispatch(updateProfile({
        name: data.name,
        skills: selectedSkills,
        profile: {
          bio: data['profile.bio'],
          phone: data['profile.phone'],
          location: data['profile.location'],
          targetRole: data['profile.targetRole'],
          experience: data['profile.experience'],
          linkedin: data['profile.linkedin'],
          github: data['profile.github'],
        },
      }));
      toast.success('Profile updated!');
    } catch { toast.error('Failed to update profile'); }
    finally { setSaving(false); }
  };

  const onChangePassword = async (data) => {
    setChangingPass(true);
    try {
      await api.put('/auth/change-password', { currentPassword: data.current, newPassword: data.newPass });
      toast.success('Password changed successfully!');
      resetPass();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally { setChangingPass(false); }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'skills', label: 'Skills', icon: CheckCircle },
    { id: 'security', label: 'Security', icon: Shield },
  ];

  return (
    <div className="max-w-3xl mx-auto animate-fade-in space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-1">My Profile</h1>
        <p className="text-slate-400">Manage your account information and preferences</p>
      </div>

      {/* Avatar Card */}
      <div className="glass-card p-6 flex items-center gap-5">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-500 to-purple-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-brand-500/30 flex-shrink-0">
          {user?.name?.[0]?.toUpperCase()}
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">{user?.name}</h2>
          <p className="text-slate-400 text-sm">{user?.email}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className={`badge ${user?.role === 'admin' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-brand-500/10 text-brand-400 border border-brand-500/20'} capitalize`}>
              {user?.role}
            </span>
            {user?.isEmailVerified && (
              <span className="badge bg-green-500/10 text-green-400 border border-green-500/20 flex items-center gap-1">
                <CheckCircle size={10} /> Verified
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-dark-500 rounded-xl border border-white/5">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setActiveTab(id)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === id ? 'bg-brand-500/20 text-white border border-brand-500/30' : 'text-slate-400 hover:text-white'}`}>
            <Icon size={15} />{label}
          </button>
        ))}
      </div>

      {/* ── PROFILE TAB ── */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSubmit(onSaveProfile)} className="space-y-5">
          <div className="glass-card p-6 space-y-5">
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Personal Info</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
                <div className="relative">
                  <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input {...register('name', { required: 'Name required' })} className="input-dark pl-10 text-sm" placeholder="Your full name" />
                </div>
                {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Phone</label>
                <div className="relative">
                  <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input {...register('profile.phone')} className="input-dark pl-10 text-sm" placeholder="+1 234 567 8900" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Location</label>
                <div className="relative">
                  <MapPin size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input {...register('profile.location')} className="input-dark pl-10 text-sm" placeholder="City, Country" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Target Role</label>
                <div className="relative">
                  <Briefcase size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input {...register('profile.targetRole')} className="input-dark pl-10 text-sm" placeholder="e.g. Frontend Developer" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Bio</label>
              <textarea {...register('profile.bio')} rows={3} className="w-full px-4 py-3 bg-dark-600 border border-white/8 text-white rounded-xl resize-none outline-none focus:border-brand-500/50 focus:ring-2 focus:ring-brand-500/10 text-sm placeholder-slate-600 transition-all" placeholder="Tell us about yourself..." />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Years of Experience</label>
              <div className="flex flex-wrap gap-2">
                {EXPERIENCE_OPTIONS.map(exp => (
                  <label key={exp} className="cursor-pointer">
                    <input type="radio" {...register('profile.experience')} value={exp} className="sr-only" />
                    <span className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all cursor-pointer inline-block ${exp === (user?.profile?.experience || '0-1') ? 'bg-brand-500/20 border-brand-500/40 text-brand-300' : 'border-white/8 text-slate-400 hover:border-white/20 hover:text-white'}`}>
                      {exp} yrs
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="glass-card p-6 space-y-4">
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Social Links</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">LinkedIn</label>
                <div className="relative">
                  <Linkedin size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input {...register('profile.linkedin')} className="input-dark pl-10 text-sm" placeholder="linkedin.com/in/username" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">GitHub</label>
                <div className="relative">
                  <Github size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input {...register('profile.github')} className="input-dark pl-10 text-sm" placeholder="github.com/username" />
                </div>
              </div>
            </div>
          </div>

          <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2 w-full justify-center py-3.5">
            {saving ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : <><Save size={16} /> Save Profile</>}
          </button>
        </form>
      )}

      {/* ── SKILLS TAB ── */}
      {activeTab === 'skills' && (
        <div className="space-y-5">
          <div className="glass-card p-6">
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">Select Your Skills</h3>
            <p className="text-slate-400 text-sm mb-4">These help us personalize your interview questions and roadmap.</p>
            <div className="flex flex-wrap gap-2 mb-6">
              {COMMON_SKILLS.map(skill => (
                <button key={skill} type="button" onClick={() => toggleSkill(skill)}
                  className={`px-3 py-1.5 rounded-xl text-sm font-medium border transition-all ${selectedSkills.includes(skill)
                    ? 'bg-brand-500/20 border-brand-500/40 text-brand-300'
                    : 'border-white/8 text-slate-400 hover:border-white/20 hover:text-white'}`}>
                  {selectedSkills.includes(skill) && '✓ '}{skill}
                </button>
              ))}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Add Custom Skill</label>
              <div className="flex gap-2">
                <input id="customSkill" type="text" placeholder="e.g. Kubernetes" className="input-dark text-sm flex-1"
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const val = e.target.value.trim();
                      if (val && !selectedSkills.includes(val)) { setSelectedSkills(prev => [...prev, val]); e.target.value = ''; }
                    }
                  }} />
                <button type="button" onClick={() => {
                  const inp = document.getElementById('customSkill');
                  const val = inp.value.trim();
                  if (val && !selectedSkills.includes(val)) { setSelectedSkills(prev => [...prev, val]); inp.value = ''; }
                }} className="btn-ghost px-4 py-2 text-sm">Add</button>
              </div>
              <p className="text-slate-600 text-xs mt-1">Press Enter or click Add</p>
            </div>
          </div>

          {selectedSkills.length > 0 && (
            <div className="glass-card p-5">
              <h4 className="text-sm font-medium text-white mb-3">Selected ({selectedSkills.length})</h4>
              <div className="flex flex-wrap gap-2">
                {selectedSkills.map(s => (
                  <span key={s} className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-500/10 text-brand-300 rounded-xl text-sm border border-brand-500/20">
                    {s}
                    <button onClick={() => toggleSkill(s)} className="text-brand-400/60 hover:text-red-400 transition-colors ml-1 text-xs">✕</button>
                  </span>
                ))}
              </div>
            </div>
          )}

          <button type="button" disabled={saving}
            onClick={() => {
              setSaving(true);
              dispatch(updateProfile({ skills: selectedSkills }))
                .then(() => toast.success('Skills saved!'))
                .catch(() => toast.error('Failed'))
                .finally(() => setSaving(false));
            }}
            className="btn-primary flex items-center gap-2 w-full justify-center py-3.5">
            {saving ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : <><Save size={16} /> Save Skills</>}
          </button>
        </div>
      )}

      {/* ── SECURITY TAB ── */}
      {activeTab === 'security' && (
        <div className="space-y-5">
          {/* Account Info */}
          <div className="glass-card p-6 space-y-3">
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-2">Account Info</h3>
            {[
              { label: 'Email', value: user?.email, icon: Mail },
              { label: 'Role', value: user?.role, icon: Shield },
              { label: 'Member since', value: user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '—', icon: User },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
                <Icon size={15} className="text-slate-500 flex-shrink-0" />
                <span className="text-slate-400 text-sm w-32">{label}</span>
                <span className="text-white text-sm capitalize">{value}</span>
              </div>
            ))}
          </div>

          {/* Change Password */}
          {!user?.googleId && (
            <form onSubmit={handlePass(onChangePassword)} className="glass-card p-6 space-y-4">
              <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Change Password</h3>

              {[
                { id: 'current', label: 'Current Password', placeholder: 'Your current password', rules: { required: 'Required' } },
                { id: 'newPass', label: 'New Password', placeholder: 'Min. 8 characters', rules: { required: 'Required', minLength: { value: 8, message: 'Min 8 chars' } } },
                { id: 'confirmPass', label: 'Confirm New Password', placeholder: 'Repeat new password', rules: { validate: v => v === watch('newPass') || 'Passwords do not match' } },
              ].map(({ id, label, placeholder, rules }) => (
                <div key={id}>
                  <label className="block text-sm font-medium text-slate-300 mb-2">{label}</label>
                  <div className="relative">
                    <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      {...regPass(id, rules)}
                      type={showPass[id] ? 'text' : 'password'}
                      placeholder={placeholder}
                      className="input-dark pl-10 pr-10 text-sm"
                    />
                    <button type="button" onClick={() => setShowPass(prev => ({ ...prev, [id]: !prev[id] }))}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors">
                      {showPass[id] ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  {passErrors[id] && <p className="text-red-400 text-xs mt-1">{passErrors[id].message}</p>}
                </div>
              ))}

              <button type="submit" disabled={changingPass} className="btn-primary flex items-center gap-2 w-full justify-center py-3.5">
                {changingPass ? <><Loader2 size={16} className="animate-spin" /> Changing...</> : <><Lock size={16} /> Change Password</>}
              </button>
            </form>
          )}

          {user?.googleId && (
            <div className="glass-card p-5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
              </div>
              <div>
                <p className="text-white text-sm font-medium">Signed in with Google</p>
                <p className="text-slate-500 text-xs">Password management is handled by Google</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
