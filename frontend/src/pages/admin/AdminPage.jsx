import { useEffect, useState } from 'react';
import api from '@/services/api';
import {
  Users, BarChart3, Brain, FileText, ShieldCheck, ShieldOff,
  Search, Loader2, TrendingUp, Activity, RefreshCw
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar
} from 'recharts';
import toast from 'react-hot-toast';

const StatCard = ({ label, value, icon: Icon, color, sub }) => (
  <div className="glass-card p-5">
    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-3`}>
      <Icon size={18} className="text-white" />
    </div>
    <div className="text-2xl font-bold text-white mb-1">{value ?? '—'}</div>
    <div className="text-slate-400 text-sm">{label}</div>
    {sub && <div className="text-xs text-slate-500 mt-0.5">{sub}</div>}
  </div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card p-3 text-sm border-brand-500/30">
      <p className="text-slate-400 mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className="font-semibold">{p.name}: {p.value}</p>
      ))}
    </div>
  );
};

export default function AdminPage() {
  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => { loadAnalytics(); }, []);
  useEffect(() => { loadUsers(); }, [search, roleFilter, page]);

  const loadAnalytics = async () => {
    try {
      const { data } = await api.get('/admin/analytics');
      setAnalytics(data.analytics);
    } catch { toast.error('Failed to load analytics'); }
    finally { setLoading(false); }
  };

  const loadUsers = async () => {
    setUsersLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 15 });
      if (search) params.append('search', search);
      if (roleFilter) params.append('role', roleFilter);
      const { data } = await api.get(`/admin/users?${params}`);
      setUsers(data.users);
      setPagination(data.pagination);
    } catch {}
    finally { setUsersLoading(false); }
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      const { data } = await api.put(`/admin/users/${id}/toggle`);
      setUsers(prev => prev.map(u => u._id === id ? { ...u, isActive: data.user.isActive } : u));
      toast.success(`User ${data.user.isActive ? 'activated' : 'deactivated'}`);
    } catch { toast.error('Action failed'); }
  };

  const changeRole = async (id, role) => {
    try {
      const { data } = await api.put(`/admin/users/${id}/role`, { role });
      setUsers(prev => prev.map(u => u._id === id ? { ...u, role: data.user.role } : u));
      toast.success('Role updated');
    } catch { toast.error('Failed to update role'); }
  };

  const trendData = analytics?.newUsersTrend?.slice(-14).map(d => ({
    date: d._id?.slice(5),
    users: d.count,
  })) || [];

  return (
    <div className="max-w-7xl mx-auto animate-fade-in space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Admin Dashboard</h1>
          <p className="text-slate-400 text-sm">Platform overview and user management</p>
        </div>
        <button onClick={() => { loadAnalytics(); loadUsers(); }}
          className="btn-ghost flex items-center gap-2 text-sm py-2">
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-dark-500 rounded-xl w-fit border border-white/5">
        {['overview', 'users'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-lg text-sm font-medium capitalize transition-all ${activeTab === tab ? 'bg-brand-500/20 text-white border border-brand-500/30' : 'text-slate-400 hover:text-white'}`}>
            {tab === 'overview' ? <span className="flex items-center gap-2"><BarChart3 size={14} /> Overview</span>
              : <span className="flex items-center gap-2"><Users size={14} /> Users</span>}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW TAB ── */}
      {activeTab === 'overview' && (
        <>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 size={32} className="animate-spin text-brand-400" />
            </div>
          ) : (
            <>
              {/* KPI Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label="Total Users" value={analytics?.totalUsers?.toLocaleString()} icon={Users} color="from-brand-500 to-purple-500" />
                <StatCard label="Total Interviews" value={analytics?.totalInterviews?.toLocaleString()} icon={Brain} color="from-cyan-500 to-blue-500" />
                <StatCard label="Completed Interviews" value={analytics?.completedInterviews?.toLocaleString()} icon={Activity} color="from-green-500 to-emerald-500" sub={`Avg score: ${analytics?.avgInterviewScore}%`} />
                <StatCard label="Active This Week" value={analytics?.activeUsers?.toLocaleString()} icon={TrendingUp} color="from-orange-500 to-red-500" sub="Last 7 days" />
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* New Users Trend */}
                <div className="glass-card p-6">
                  <h3 className="text-base font-semibold text-white mb-5">New Users (Last 14 Days)</h3>
                  {trendData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={220}>
                      <BarChart data={trendData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3e" />
                        <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} />
                        <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="users" fill="#6c3fff" radius={[4, 4, 0, 0]} name="New Users" />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-52 text-slate-500 text-sm">No trend data yet</div>
                  )}
                </div>

                {/* Platform Stats Summary */}
                <div className="glass-card p-6">
                  <h3 className="text-base font-semibold text-white mb-5">Platform Health</h3>
                  <div className="space-y-4">
                    {[
                      { label: 'Interview Completion Rate', value: analytics?.totalInterviews ? Math.round((analytics.completedInterviews / analytics.totalInterviews) * 100) : 0, color: 'from-green-500 to-emerald-500' },
                      { label: 'Average Interview Score', value: analytics?.avgInterviewScore || 0, color: 'from-brand-500 to-purple-500' },
                      { label: 'Weekly Active Users', value: analytics?.totalUsers ? Math.round((analytics.activeUsers / analytics.totalUsers) * 100) : 0, color: 'from-cyan-500 to-blue-500' },
                    ].map(({ label, value, color }) => (
                      <div key={label}>
                        <div className="flex justify-between text-sm mb-1.5">
                          <span className="text-slate-400">{label}</span>
                          <span className="text-white font-semibold">{value}%</span>
                        </div>
                        <div className="h-2 bg-dark-600 rounded-full overflow-hidden">
                          <div className={`h-full bg-gradient-to-r ${color} rounded-full transition-all duration-700`} style={{ width: `${Math.min(value, 100)}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 pt-5 border-t border-white/5 grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold gradient-text">{analytics?.totalResumes ?? 0}</div>
                      <div className="text-slate-500 text-xs mt-1">Total Resumes</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold gradient-text">{analytics?.avgInterviewScore ?? 0}%</div>
                      <div className="text-slate-500 text-xs mt-1">Avg Score</div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      )}

      {/* ── USERS TAB ── */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          {/* Search & Filter */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-60">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input type="text" placeholder="Search by name or email..."
                value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
                className="input-dark pl-9 text-sm py-2.5" />
            </div>
            <select value={roleFilter} onChange={e => { setRoleFilter(e.target.value); setPage(1); }}
              className="input-dark text-sm py-2.5 w-auto">
              <option value="">All Roles</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="recruiter">Recruiter</option>
            </select>
          </div>

          {/* Users Table */}
          <div className="glass-card overflow-hidden">
            {usersLoading ? (
              <div className="flex items-center justify-center h-48">
                <Loader2 size={24} className="animate-spin text-brand-400" />
              </div>
            ) : users.length === 0 ? (
              <div className="flex items-center justify-center h-48 text-slate-500">No users found</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/5">
                      {['User', 'Role', 'Status', 'Joined', 'Last Login', 'Actions'].map(h => (
                        <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {users.map(user => (
                      <tr key={user._id} className="hover:bg-white/2 transition-colors">
                        {/* User Info */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-500 to-purple-500 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                              {user.name?.[0]?.toUpperCase()}
                            </div>
                            <div>
                              <div className="text-white text-sm font-medium">{user.name}</div>
                              <div className="text-slate-500 text-xs">{user.email}</div>
                            </div>
                          </div>
                        </td>

                        {/* Role */}
                        <td className="px-5 py-4">
                          <select
                            value={user.role}
                            onChange={e => changeRole(user._id, e.target.value)}
                            className="bg-dark-600 text-white text-xs rounded-lg px-2.5 py-1.5 border border-white/10 outline-none capitalize cursor-pointer hover:border-brand-500/40 transition-colors"
                          >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                            <option value="recruiter">Recruiter</option>
                          </select>
                        </td>

                        {/* Status */}
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${user.isActive ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${user.isActive ? 'bg-green-400' : 'bg-red-400'}`} />
                            {user.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>

                        {/* Joined */}
                        <td className="px-5 py-4 text-slate-400 text-xs">
                          {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>

                        {/* Last Login */}
                        <td className="px-5 py-4 text-slate-400 text-xs">
                          {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'}
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-4">
                          <button
                            onClick={() => toggleStatus(user._id, user.isActive)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${user.isActive
                              ? 'border-red-500/20 text-red-400 hover:bg-red-500/10'
                              : 'border-green-500/20 text-green-400 hover:bg-green-500/10'}`}
                          >
                            {user.isActive ? <><ShieldOff size={12} /> Deactivate</> : <><ShieldCheck size={12} /> Activate</>}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Pagination */}
          {pagination && pagination.pages > 1 && (
            <div className="flex items-center justify-between">
              <span className="text-slate-500 text-sm">
                Showing {(page - 1) * 15 + 1}–{Math.min(page * 15, pagination.total)} of {pagination.total} users
              </span>
              <div className="flex items-center gap-2">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                  className="btn-ghost text-sm py-1.5 px-3 disabled:opacity-40">← Prev</button>
                {Array.from({ length: Math.min(pagination.pages, 5) }, (_, i) => i + 1).map(p => (
                  <button key={p} onClick={() => setPage(p)}
                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${page === p ? 'bg-brand-500/20 text-white border border-brand-500/30' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
                    {p}
                  </button>
                ))}
                <button onClick={() => setPage(p => Math.min(pagination.pages, p + 1))} disabled={page === pagination.pages}
                  className="btn-ghost text-sm py-1.5 px-3 disabled:opacity-40">Next →</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
