'use client';
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getAdminUsers, updateAdminUser, deleteAdminUser } from '@/lib/api';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { FiSearch, FiUser, FiShield, FiTrash2, FiToggleLeft, FiToggleRight, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const ROLE_STYLE  = { admin: { bg:'#FFF3E6', color:'#D4760A', border:'rgba(212,118,10,0.18)' }, user:  { bg:'#FFF5EC', color:'#C68B2C', border:'#FFECD6' } };
const STATUS_STYLE = { true: { label:'Active', bg:'#F0FDF8', color:'#10B981', border:'#99F5D9' }, false: { label:'Inactive', bg:'#FFF5EC', color:'#E89830', border:'rgba(212,118,10,0.18)' } };

export default function AdminUsersPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [users,    setUsers]    = useState([]);
  const [total,    setTotal]    = useState(0);
  const [pages,    setPages]    = useState(1);
  const [page,     setPage]     = useState(1);
  const [search,   setSearch]   = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [loading,  setLoading]  = useState(true);
  const [actionId, setActionId] = useState(null);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) router.push('/');
  }, [user, authLoading, router]);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAdminUsers({ page, limit: 15, search: search || undefined, role: roleFilter || undefined });
      setUsers(res.data.users);
      setTotal(res.data.total);
      setPages(res.data.pages);
    } catch {}
    finally { setLoading(false); }
  }, [page, search, roleFilter]);

  useEffect(() => {
    if (user?.role === 'admin') fetchUsers();
  }, [user, fetchUsers]);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => { setPage(1); fetchUsers(); }, 400);
    return () => clearTimeout(t);
  }, [search]);

  const handleToggleRole = async (u) => {
    if (u._id === user._id) { toast.error("Can't change your own role"); return; }
    setActionId(u._id);
    try {
      const newRole = u.role === 'admin' ? 'user' : 'admin';
      await updateAdminUser(u._id, { role: newRole });
      toast.success(`Role updated to ${newRole} ✦`);
      fetchUsers();
    } catch { toast.error('Update failed'); }
    finally { setActionId(null); }
  };

  const handleToggleActive = async (u) => {
    if (u._id === user._id) { toast.error("Can't deactivate yourself"); return; }
    setActionId(u._id);
    try {
      await updateAdminUser(u._id, { isActive: !u.isActive });
      toast.success(`User ${u.isActive ? 'deactivated' : 'activated'} ✦`);
      fetchUsers();
    } catch { toast.error('Update failed'); }
    finally { setActionId(null); }
  };

  const handleDelete = async (u) => {
    if (u._id === user._id) { toast.error("Can't delete yourself"); return; }
    if (!confirm(`Delete ${u.name}? This cannot be undone.`)) return;
    setActionId(u._id);
    try {
      await deleteAdminUser(u._id);
      toast.success('User deleted');
      fetchUsers();
    } catch { toast.error('Delete failed'); }
    finally { setActionId(null); }
  };

  if (authLoading) return <div className="min-h-screen flex items-center justify-center" style={{background:'#FFF9F2'}}><div className="w-8 h-8 border-2 border-[rgba(212,118,10,0.15)] border-t-[#D4760A] rounded-full animate-spin"/></div>;

  return (
    <div className="min-h-screen pb-20" style={{ background: '#FFF9F2' }}>

      {/* Header */}
      <div className="py-10 px-6 border-b" style={{ background: 'white', borderColor: 'rgba(212,118,10,0.12)' }}>
        <p className="font-dm text-[10px] tracking-[0.3em] uppercase mb-1" style={{ color: '#B8862C' }}>Admin</p>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <h1 className="font-playfair text-3xl text-[#2D1810] italic" style={{ fontFamily: 'Playfair Display,serif' }}>
            User Management 👥
          </h1>
          <span className="font-dm text-xs px-3 py-1.5 rounded-full font-bold" style={{ background: '#FFF3E6', color: '#D4760A', border: '1px solid rgba(212,118,10,0.18)' }}>
            {total} total users
          </span>
        </div>

        {/* Search + Filter bar */}
        <div className="flex flex-wrap gap-3 mt-6">
          <div className="flex-1 min-w-48 relative">
            <FiSearch size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#C4A0A8' }} />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by name or email…"
              className="input-soft w-full pl-9 pr-4 py-2.5 text-xs" />
          </div>
          <select value={roleFilter} onChange={e => { setRoleFilter(e.target.value); setPage(1); }}
            className="input-soft px-4 py-2.5 text-xs rounded-xl">
            <option value="">All Roles</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-8">
        {loading ? (
          <div className="grid gap-3">
            {[...Array(5)].map((_,i) => <div key={i} className="h-16 skeleton rounded-2xl"/>)}
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-24 rounded-3xl border" style={{ background: 'white', borderColor: 'rgba(212,118,10,0.12)' }}>
            <FiUser size={40} className="mx-auto mb-4" style={{ color: '#F5C6D0' }}/>
            <p className="font-playfair text-2xl text-[#2D1810]/40 italic">No users found</p>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block rounded-3xl border overflow-hidden shadow-soft" style={{ background: 'white', borderColor: 'rgba(212,118,10,0.12)' }}>
              <table className="w-full">
                <thead>
                  <tr style={{ background: 'linear-gradient(135deg,#FFF5EC,#FFF9F2)', borderBottom: '1px solid rgba(212,118,10,0.12)' }}>
                    {['User', 'Email', 'Role', 'Status', 'Joined', 'Actions'].map(h => (
                      <th key={h} className="text-left px-5 py-3.5 font-dm text-[10px] tracking-[0.25em] uppercase font-bold" style={{ color: '#8A6A58' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.map((u, i) => {
                    const rs = ROLE_STYLE[u.role] || ROLE_STYLE.user;
                    const ss = STATUS_STYLE[String(u.isActive !== false)];
                    const isMe = u._id === user._id;
                    return (
                      <tr key={u._id} className="border-b transition-colors hover:bg-[rgba(212,118,10,0.04)]/30" style={{ borderColor: '#FFF5EC' }}>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                              style={{ background: 'linear-gradient(135deg,#F5C97A,#FFECD6)' }}>
                              {u.name?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-dm text-sm text-[#2D1810] font-semibold">{u.name} {isMe && <span className="text-[9px] text-[#A8907E]">(you)</span>}</p>
                              <p className="font-dm text-[10px] md:hidden" style={{ color: '#8A6A58' }}>{u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 font-dm text-xs" style={{ color: '#8A6A58' }}>{u.email}</td>
                        <td className="px-5 py-3.5">
                          <span className="font-dm text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full border"
                            style={{ background: rs.bg, color: rs.color, borderColor: rs.border }}>{u.role}</span>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="font-dm text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full border"
                            style={{ background: ss.bg, color: ss.color, borderColor: ss.border }}>{ss.label}</span>
                        </td>
                        <td className="px-5 py-3.5 font-dm text-xs" style={{ color: '#8A6A58' }}>
                          {new Date(u.createdAt).toLocaleDateString('en-PK', { day:'numeric', month:'short', year:'numeric' })}
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-1.5">
                            {/* Role toggle */}
                            <button onClick={() => handleToggleRole(u)} disabled={!!actionId || isMe} title={`Make ${u.role === 'admin' ? 'User' : 'Admin'}`}
                              className="w-8 h-8 rounded-xl border flex items-center justify-center transition-colors disabled:opacity-30 hover:bg-[rgba(212,118,10,0.04)]"
                              style={{ borderColor: 'rgba(212,118,10,0.12)', color: '#C68B2C' }}>
                              <FiShield size={13}/>
                            </button>
                            {/* Active toggle */}
                            <button onClick={() => handleToggleActive(u)} disabled={!!actionId || isMe} title={u.isActive !== false ? 'Deactivate' : 'Activate'}
                              className="w-8 h-8 rounded-xl border flex items-center justify-center transition-colors disabled:opacity-30 hover:bg-[rgba(212,118,10,0.04)]"
                              style={{ borderColor: 'rgba(212,118,10,0.12)', color: '#10B981' }}>
                              {u.isActive !== false ? <FiToggleRight size={15}/> : <FiToggleLeft size={15}/>}
                            </button>
                            {/* Delete */}
                            <button onClick={() => handleDelete(u)} disabled={!!actionId || isMe} title="Delete user"
                              className="w-8 h-8 rounded-xl border flex items-center justify-center transition-colors disabled:opacity-30 hover:bg-red-50"
                              style={{ borderColor: 'rgba(212,118,10,0.12)', color: '#E89830' }}>
                              <FiTrash2 size={13}/>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden space-y-3">
              {users.map(u => {
                const rs = ROLE_STYLE[u.role] || ROLE_STYLE.user;
                const isMe = u._id === user._id;
                return (
                  <div key={u._id} className="rounded-2xl border p-4" style={{ background:'white', borderColor:'rgba(212,118,10,0.12)' }}>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold"
                        style={{ background: 'linear-gradient(135deg,#F5C97A,#FFECD6)' }}>
                        {u.name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-dm text-sm text-[#2D1810] font-bold truncate">{u.name}</p>
                        <p className="font-dm text-[10px] truncate" style={{ color:'#8A6A58' }}>{u.email}</p>
                      </div>
                      <span className="font-dm text-[9px] font-bold px-2 py-0.5 rounded-full border" style={{ background:rs.bg, color:rs.color, borderColor:rs.border }}>{u.role}</span>
                    </div>
                    {!isMe && (
                      <div className="flex gap-2">
                        <button onClick={() => handleToggleRole(u)} className="flex-1 py-2 rounded-xl border text-xs font-dm font-semibold transition-colors hover:bg-[rgba(212,118,10,0.04)]" style={{ borderColor:'rgba(212,118,10,0.12)', color:'#C68B2C' }}>
                          {u.role === 'admin' ? '→ User' : '→ Admin'}
                        </button>
                        <button onClick={() => handleDelete(u)} className="px-3 py-2 rounded-xl border text-xs font-dm transition-colors hover:bg-red-50" style={{ borderColor:'rgba(212,118,10,0.12)', color:'#E89830' }}>
                          <FiTrash2 size={13}/>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {pages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page===1}
                  className="w-9 h-9 rounded-full border flex items-center justify-center disabled:opacity-30 transition-colors hover:bg-[rgba(212,118,10,0.04)]"
                  style={{ borderColor:'rgba(212,118,10,0.12)', color:'#D4760A' }}>
                  <FiChevronLeft size={14}/>
                </button>
                {[...Array(pages)].map((_,i) => (
                  <button key={i} onClick={() => setPage(i+1)}
                    className="w-9 h-9 text-xs font-dm font-bold rounded-full transition-all"
                    style={ page===i+1
                      ? { background:'linear-gradient(135deg,#D4760A,#C68B2C)', color:'white' }
                      : { border:'1.5px solid rgba(212,118,10,0.12)', color:'#8A6A58' }}>
                    {i+1}
                  </button>
                ))}
                <button onClick={() => setPage(p => Math.min(pages, p+1))} disabled={page===pages}
                  className="w-9 h-9 rounded-full border flex items-center justify-center disabled:opacity-30 transition-colors hover:bg-[rgba(212,118,10,0.04)]"
                  style={{ borderColor:'rgba(212,118,10,0.12)', color:'#D4760A' }}>
                  <FiChevronRight size={14}/>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
