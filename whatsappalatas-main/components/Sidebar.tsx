
import React, { useState } from 'react';
import { User, UserRole, WabaAccount } from '../types';
import Logo from './Logo';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: User;
  onLogout: () => void;
  accounts: WabaAccount[];
  selectedAccount?: WabaAccount;
  setSelectedAccount: (acc: WabaAccount) => void;
  onUpdateUser?: (user: User) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, setActiveTab, currentUser, onLogout, 
  accounts, selectedAccount, setSelectedAccount, onUpdateUser 
}) => {
  const [showAccountMenu, setShowAccountMenu] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Overview', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
    { id: 'chat', label: 'Conversations', icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z' },
    { id: 'crm', label: 'CRM Contacts', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
    { id: 'marketing', label: 'Broadcasts', icon: 'M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z' },
    { id: 'finance', label: 'Invoices', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
  ];

  const adminItems = [
    { id: 'team', label: 'Team Members', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
    { id: 'settings', label: 'Settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924-1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
    { id: 'golive', label: 'Go Live!', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
  ];

  return (
    <div className="flex flex-col h-full p-4">
      <div className="mb-6 px-2">
         <Logo className="mb-6" />
      </div>

      <div className="relative mb-6">
        <button 
          onClick={() => setShowAccountMenu(!showAccountMenu)}
          className="w-full flex items-center justify-between gap-3 px-4 py-4 bg-slate-900 text-white rounded-2xl shadow-xl hover:bg-slate-800 transition-all border border-slate-700"
        >
          <div className="flex items-center gap-3 overflow-hidden">
             <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center font-bold flex-shrink-0">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.767 5.767 0 3.181 2.586 5.767 5.767 5.767 3.181 0 5.767-2.586 5.767-5.767 0-3.181-2.586-5.767-5.767-5.767zm0 1.5c2.356 0 4.267 1.911 4.267 4.267s-1.911 4.267-4.267 4.267-4.267-1.911-4.267-4.267 1.911-4.267 4.267-4.267z"/></svg>
             </div>
             <div className="text-left overflow-hidden">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest truncate">Account Slot</p>
                <p className="text-sm font-bold truncate">{selectedAccount?.name || 'No Accounts'}</p>
             </div>
          </div>
          <svg className={`w-4 h-4 text-slate-400 transition-transform ${showAccountMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
        </button>

        {showAccountMenu && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border rounded-2xl shadow-2xl z-50 overflow-hidden animate-slideUp">
            <div className="px-4 py-2 bg-slate-50 border-b text-[10px] font-black text-slate-400 uppercase tracking-widest">Ganti Slot Nomor</div>
            {accounts.map((acc) => (
              <button
                key={acc.id}
                onClick={() => { setSelectedAccount(acc); setShowAccountMenu(false); }}
                className={`w-full flex items-center justify-between gap-3 p-4 text-left hover:bg-slate-50 border-b last:border-0 ${selectedAccount?.id === acc.id ? 'bg-emerald-50' : ''}`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${acc.status === 'connected' ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                  <div className="overflow-hidden">
                    <p className="text-sm font-black text-slate-800 truncate">{acc.name}</p>
                    <p className="text-[10px] text-slate-500 font-mono">{acc.phoneNumber}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto scrollbar-hide">
        <p className="px-4 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">Main Dashboard</p>
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`
              w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all
              ${activeTab === item.id 
                ? 'bg-emerald-50 text-emerald-600 font-bold shadow-sm' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}
            `}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
            </svg>
            <span className="text-sm">{item.label}</span>
          </button>
        ))}

        {currentUser.role === UserRole.ADMIN && (
          <>
            <p className="px-4 py-2 mt-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Super Control</p>
            {adminItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                  ${activeTab === item.id 
                    ? item.id === 'golive' ? 'bg-slate-900 text-white shadow-xl' : 'bg-emerald-50 text-emerald-600 font-bold shadow-sm' 
                    : item.id === 'golive' ? 'bg-emerald-500 text-white font-bold hover:bg-emerald-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}
                `}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
                </svg>
                <span className="text-sm">{item.label}</span>
              </button>
            ))}
          </>
        )}
      </nav>

      <div className="pt-4 mt-2 border-t border-slate-100">
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-all font-black uppercase text-[11px] tracking-widest"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          Keluar Sesi
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
