'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { collection, getDocs, query, orderBy, doc, updateDoc, limit } from 'firebase/firestore';
import { getFirebaseDb } from '@/lib/firebase-client';
import { type UserProfile, type UserRole } from '@/contexts/AuthContext';
import { Search, ShieldCheck, UserX, Users } from 'lucide-react';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | UserRole>('all');
  const [actionMsg, setActionMsg] = useState('');

  useEffect(() => {
    const load = async () => {
      const db = getFirebaseDb();
      const snap = await getDocs(query(collection(db, 'users'), orderBy('createdAt', 'desc'), limit(200)));
      setUsers(snap.docs.map((d) => ({ uid: d.id, ...d.data() }) as UserProfile));
      setLoading(false);
    };
    load();
  }, []);

  const setRole = async (uid: string, role: UserRole) => {
    const db = getFirebaseDb();
    await updateDoc(doc(db, 'users', uid), { role });
    setUsers((prev) => prev.map((u) => (u.uid === uid ? { ...u, role } : u)));
    setActionMsg(`Role updated to "${role}".`);
    setTimeout(() => setActionMsg(''), 3000);
  };

  const filtered = users.filter((u) => {
    const matchSearch = !search || u.displayName?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  return (
    <div>
      <div className='mb-8'>
        <h1 className='font-display text-4xl text-cream'>Users</h1>
        <p className='text-mist text-sm mt-1'>
          {users.length} registered user{users.length !== 1 ? 's' : ''}
        </p>
      </div>

      {actionMsg && <p className='mb-4 text-xs text-lime bg-lime/10 border border-lime/20 rounded-lg px-4 py-3'>{actionMsg}</p>}

      {/* Filters */}
      <div className='flex flex-wrap gap-3 mb-6'>
        <div className='relative flex-1 min-w-48'>
          <Search size={14} className='absolute left-3 top-1/2 -translate-y-1/2 text-mist' />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder='Search by name or email…'
            className='w-full pl-9 pr-4 py-2.5 rounded-lg bg-canopy border border-smoke text-cream text-sm focus:outline-none focus:border-lime transition-colors'
          />
        </div>
        {(['all', 'customer', 'admin'] as const).map((r) => (
          <button
            key={r}
            onClick={() => setRoleFilter(r)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold tracking-widest uppercase transition-colors ${
              roleFilter === r ? 'bg-lime text-forest' : 'bg-canopy border border-smoke text-mist hover:text-cream'
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className='bg-canopy border border-smoke rounded-xl overflow-hidden'>
        {loading ? (
          <div className='p-8 space-y-3'>
            {[...Array(6)].map((_, i) => (
              <div key={i} className='h-14 bg-smoke rounded animate-pulse' />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className='p-12 text-center'>
            <Users size={32} className='text-mist mx-auto mb-3' />
            <p className='text-mist text-sm'>No users match your search.</p>
          </div>
        ) : (
          <table className='w-full text-sm'>
            <thead className='border-b border-smoke'>
              <tr>
                {['User', 'Email', 'Role', 'Joined', 'Actions'].map((h) => (
                  <th key={h} className='px-5 py-3 text-left text-[10px] font-bold tracking-widest uppercase text-mist'>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className='divide-y divide-smoke'>
              {filtered.map((user) => (
                <tr key={user.uid} className='hover:bg-grove transition-colors'>
                  <td className='px-5 py-4'>
                    <div className='flex items-center gap-3'>
                      <div className='w-8 h-8 rounded-full bg-smoke flex items-center justify-center text-xs font-bold text-cream flex-shrink-0'>{user.displayName?.[0]?.toUpperCase() ?? '?'}</div>
                      <span className='text-cream font-medium'>{user.displayName || '—'}</span>
                    </div>
                  </td>
                  <td className='px-5 py-4 text-mist text-xs'>{user.email}</td>
                  <td className='px-5 py-4'>
                    <span className={`text-[10px] font-bold tracking-widest uppercase px-2 py-1 rounded-full ${user.role === 'admin' ? 'bg-gold/10 text-gold' : 'bg-smoke text-mist'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className='px-5 py-4 text-mist text-xs'>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}</td>
                  <td className='px-5 py-4'>
                    <div className='flex items-center gap-2'>
                      {user.role !== 'admin' ? (
                        <button
                          onClick={() => setRole(user.uid, 'admin')}
                          title='Promote to Admin'
                          className='flex items-center gap-1 px-2.5 py-1 rounded text-xs text-mist hover:text-gold hover:bg-gold/10 transition-colors'
                        >
                          <ShieldCheck size={13} />
                          Make Admin
                        </button>
                      ) : (
                        <button
                          onClick={() => setRole(user.uid, 'customer')}
                          title='Remove Admin'
                          className='flex items-center gap-1 px-2.5 py-1 rounded text-xs text-mist hover:text-coral hover:bg-coral/10 transition-colors'
                        >
                          <UserX size={13} />
                          Remove Admin
                        </button>
                      )}
                      <Link href={`/admin/users/${user.uid}`} className='px-2.5 py-1 rounded text-xs text-mist hover:text-lime hover:bg-lime/10 transition-colors'>
                        View
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
