
import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { MOCK_ACCOUNTS } from '../constants';

interface UserManagementProps {
  users: User[];
  setUsers: (users: User[]) => void;
}

const UserManagement: React.FC<UserManagementProps> = ({ users, setUsers }) => {
  const [showModal, setShowModal] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: UserRole.AGENT,
    assignedAccounts: [] as string[]
  });

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleAccountSelection = (accId: string) => {
    setFormData(prev => ({
      ...prev,
      assignedAccounts: prev.assignedAccounts.includes(accId)
        ? prev.assignedAccounts.filter(id => id !== accId)
        : [...prev.assignedAccounts, accId]
    }));
  };

  const openAddModal = () => {
    setEditingUserId(null);
    setFormData({
      name: '',
      email: '',
      password: '',
      role: UserRole.AGENT,
      assignedAccounts: []
    });
    setShowModal(true);
  };

  const openEditModal = (user: User) => {
    setEditingUserId(user.id);
    setFormData({
      name: user.name,
      email: user.email,
      password: '', // Kosongkan password saat edit, isi hanya jika mau reset
      role: user.role,
      assignedAccounts: user.assignedAccounts || []
    });
    setShowModal(true);
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingUserId) {
      // Logic Update User
      const updatedUsers = users.map(u => {
        if (u.id === editingUserId) {
          const updated: any = {
            ...u,
            name: formData.name,
            email: formData.email,
            role: formData.role,
            assignedAccounts: formData.assignedAccounts,
          };
          // Jika password diisi, maka update password (Reset Password)
          if (formData.password) {
            updated.password = formData.password;
          }
          return updated;
        }
        return u;
      });
      setUsers(updatedUsers);
    } else {
      // Logic Add User
      const newUser: User & { password?: string } = {
        id: `user-${Date.now()}`,
        name: formData.name,
        email: formData.email,
        password: formData.password || 'password123', // default password jika kosong
        role: formData.role,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.name.replace(/\s/g, '')}`,
        status: 'offline',
        leadsHandled: 0,
        avgResponseTime: '0s',
        isAcceptingLeads: true,
        assignedAccounts: formData.assignedAccounts
      };
      setUsers([...users, newUser]);
    }
    
    setShowModal(false);
  };

  const removeUser = (id: string) => {
    if (confirm('Hapus anggota tim ini secara permanen?')) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Access Control & Team</h2>
          <p className="text-sm text-slate-500 font-medium">Map WhatsApp numbers to specific agents and monitor their performance.</p>
        </div>
        <button 
          onClick={openAddModal}
          className="w-full md:w-auto bg-emerald-500 text-white px-8 py-3 rounded-2xl font-black shadow-xl shadow-emerald-100 hover:bg-emerald-600 transform active:scale-95 transition-all text-sm uppercase tracking-widest"
        >
          + Create New Account
        </button>
      </div>

      <div className="bg-white p-4 rounded-2xl border shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <input 
            type="text" 
            placeholder="Search team member..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
          />
          <svg className="w-5 h-5 text-slate-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredUsers.map((user) => (
          <div key={user.id} className="bg-white rounded-3xl border shadow-sm overflow-hidden group hover:border-emerald-300 transition-all flex flex-col">
            <div className="p-6 flex-1">
              <div className="flex justify-between items-start mb-6">
                <div className="relative">
                  <img src={user.avatar} className="w-20 h-20 rounded-2xl bg-slate-100 border-4 border-white shadow-lg" alt={user.name} />
                  <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-4 border-white ${user.status === 'online' ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                </div>
                <span className={`text-[10px] font-black px-2 py-1 rounded-full tracking-widest uppercase shadow-sm ${user.role === UserRole.ADMIN ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'}`}>
                  {user.role}
                </span>
              </div>
              
              <h3 className="font-black text-slate-800 text-lg uppercase tracking-tight leading-none">{user.name}</h3>
              <p className="text-xs text-slate-500 font-medium mt-1">{user.email}</p>

              <div className="mt-6">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">WhatsApp Access</p>
                <div className="flex flex-wrap gap-1.5 min-h-[40px]">
                  {user.role === UserRole.ADMIN ? (
                    <span className="px-2.5 py-1 bg-slate-900 text-white text-[9px] font-black rounded-lg uppercase tracking-widest border border-slate-700">All Accounts Access</span>
                  ) : user.assignedAccounts?.length ? (
                    user.assignedAccounts.map(id => {
                      const acc = MOCK_ACCOUNTS.find(a => a.id === id);
                      return (
                        <span key={id} className="px-2.5 py-1 bg-emerald-50 text-emerald-600 text-[9px] font-black rounded-lg border border-emerald-100 uppercase tracking-widest">
                          {acc?.name.split(' ')[0]}
                        </span>
                      );
                    })
                  ) : (
                    <span className="px-2.5 py-1 bg-red-50 text-red-500 text-[9px] font-black rounded-lg border border-red-100 uppercase tracking-widest">No Numbers Assigned</span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-6">
                 <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Response Speed</p>
                    <p className="text-xs font-black text-slate-800">{user.avgResponseTime || '0s'}</p>
                 </div>
                 <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Leads Handled</p>
                    <p className="text-xs font-black text-slate-800">{user.leadsHandled || '0'}</p>
                 </div>
              </div>
            </div>
            
            <div className="p-4 bg-slate-50/50 border-t flex items-center justify-between">
               <button 
                onClick={() => openEditModal(user)}
                className="text-[10px] font-black text-emerald-600 uppercase tracking-widest px-4 py-2 hover:bg-emerald-50 rounded-xl transition-all"
               >
                 Edit Access / Role
               </button>
               <button 
                onClick={() => removeUser(user.id)} 
                className="p-2.5 bg-white text-slate-300 hover:text-red-500 rounded-xl shadow-sm border border-slate-100 transition-all active:scale-90"
               >
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
               </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL USER (CREATE/EDIT) */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden animate-slideUp border-4 border-white">
            <div className="p-8 border-b flex justify-between items-center bg-slate-50">
              <h3 className="font-black text-slate-800 text-lg uppercase tracking-tight">
                {editingUserId ? 'Edit Account Permissions' : 'Create New Team Member'}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-200 rounded-xl text-slate-400 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <form onSubmit={handleSaveUser} className="p-8 space-y-5 max-h-[70vh] overflow-y-auto scrollbar-hide">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nama Lengkap</label>
                  <input required type="text" className="w-full px-5 py-4 bg-slate-50 border rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 font-bold" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">User Role</label>
                  <select className="w-full px-5 py-4 bg-slate-50 border rounded-2xl outline-none font-bold" value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value as UserRole})}>
                    <option value={UserRole.AGENT}>Agent (Operator)</option>
                    <option value={UserRole.SUPERVISOR}>Supervisor</option>
                    <option value={UserRole.ADMIN}>Administrator</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                <input required type="email" className="w-full px-5 py-4 bg-slate-50 border rounded-2xl outline-none font-bold" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
              </div>

              <div className="space-y-1.5 p-5 bg-amber-50 border border-amber-100 rounded-[2rem]">
                <label className="text-[10px] font-black text-amber-600 uppercase tracking-widest ml-1">
                  {editingUserId ? '🔑 Reset Password (Opsional)' : '🔑 Set Password'}
                </label>
                <input 
                  type="password" 
                  className="w-full px-5 py-3 bg-white border border-amber-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 font-bold" 
                  placeholder={editingUserId ? "Biarkan kosong jika tidak ganti" : "Password baru"}
                  value={formData.password} 
                  onChange={(e) => setFormData({...formData, password: e.target.value})} 
                />
                {editingUserId && <p className="text-[9px] text-amber-400 font-bold uppercase mt-2">* Isi untuk me-reset password akun ini.</p>}
              </div>

              <div className="space-y-3 pt-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Assign WhatsApp Slots</label>
                <div className="grid grid-cols-1 gap-2">
                  {MOCK_ACCOUNTS.map(acc => (
                    <button 
                      key={acc.id}
                      type="button"
                      onClick={() => toggleAccountSelection(acc.id)}
                      disabled={formData.role === UserRole.ADMIN}
                      className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${formData.role === UserRole.ADMIN ? 'opacity-50 cursor-not-allowed bg-slate-100' : formData.assignedAccounts.includes(acc.id) ? 'bg-emerald-50 border-emerald-500 ring-1 ring-emerald-500 shadow-lg shadow-emerald-50' : 'bg-slate-50 border-slate-100 hover:bg-slate-100'}`}
                    >
                      <div className="flex items-center gap-4 text-left">
                        <div className={`w-3 h-3 rounded-full ${acc.status === 'connected' ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                        <div>
                          <p className="text-xs font-black text-slate-800 uppercase tracking-tight">{acc.name}</p>
                          <p className="text-[10px] text-slate-400 font-mono mt-1">{acc.phoneNumber}</p>
                        </div>
                      </div>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${formData.assignedAccounts.includes(acc.id) || formData.role === UserRole.ADMIN ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-white border-slate-200'}`}>
                         {(formData.assignedAccounts.includes(acc.id) || formData.role === UserRole.ADMIN) && <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/></svg>}
                      </div>
                    </button>
                  ))}
                  {formData.role === UserRole.ADMIN && (
                    <p className="text-[9px] text-slate-400 italic px-2">Administrator memiliki akses otomatis ke semua nomor.</p>
                  )}
                </div>
              </div>

              <div className="pt-4">
                <button type="submit" className="w-full bg-slate-900 text-white py-5 rounded-[2rem] font-black shadow-2xl hover:bg-emerald-600 transition-all uppercase tracking-[0.2em] text-xs">
                  {editingUserId ? 'Save Account Changes' : 'Confirm & Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
