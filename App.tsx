
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { io } from 'socket.io-client';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ChatWindow from './components/ChatWindow';
import CRM from './components/CRM';
import Marketing from './components/Marketing';
import Finance from './components/Finance';
import Settings from './components/Settings';
import Login from './components/Login';
import UserManagement from './components/UserManagement';
import GoLive from './components/GoLive';
import { User, UserRole, WabaAccount, CallEvent, Message, QuickReply } from './types';
import { INITIAL_SYSTEM_USERS, MOCK_ACCOUNTS, API_BASE_URL, LABELS, MOCK_QUICK_REPLIES } from './constants';
import { supabase } from './supabase';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [systemUsers, setSystemUsers] = useState<User[]>([]);
  const [backendStatus, setBackendStatus] = useState<'connected' | 'offline'>('offline');
  const [incomingCall, setIncomingCall] = useState<CallEvent | null>(null);
  const [realtimeMessages, setRealtimeMessages] = useState<Message[]>([]);
  
  const [globalLabels, setGlobalLabels] = useState<string[]>(() => {
    const saved = localStorage.getItem('waba_global_labels');
    return saved ? JSON.parse(saved) : LABELS;
  });

  const [quickReplies, setQuickReplies] = useState<QuickReply[]>(() => {
    const saved = localStorage.getItem('waba_quick_replies');
    return saved ? JSON.parse(saved) : MOCK_QUICK_REPLIES;
  });

  const [accounts, setAccounts] = useState<WabaAccount[]>(() => {
    const saved = localStorage.getItem('waba_accounts');
    return saved ? JSON.parse(saved) : MOCK_ACCOUNTS;
  });

  const [autoGreetingEnabled, setAutoGreetingEnabled] = useState(() => {
    return localStorage.getItem('waba_auto_greeting') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('waba_quick_replies', JSON.stringify(quickReplies));
  }, [quickReplies]);

  useEffect(() => {
    localStorage.setItem('waba_auto_greeting', autoGreetingEnabled.toString());
  }, [autoGreetingEnabled]);

  // Logic Auto-Reply: Trigger send message via Backend API
  const sendAutoGreeting = async (jid: string) => {
    const greetingTemplate = quickReplies.find(qr => qr.category.toLowerCase() === 'opening');
    if (!greetingTemplate) return;

    try {
      await fetch(`${API_BASE_URL}/api/send-message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jid: jid,
          text: greetingTemplate.content
        })
      });
      console.log("Auto-Greeting Sent to:", jid);
    } catch (e) {
      console.error("Auto-Greeting Failed", e);
    }
  };

  useEffect(() => {
    const socket = io(API_BASE_URL);
    socket.on('connect', () => setBackendStatus('connected'));
    socket.on('disconnect', () => setBackendStatus('offline'));
    socket.on('new_message', (data: any) => {
      const newMessage: Message = {
        id: data.id,
        text: data.text,
        senderId: data.senderJid,
        senderName: data.sender,
        timestamp: new Date(data.timestamp),
        isMe: false,
      };
      setRealtimeMessages(prev => [...prev, newMessage]);

      // Simple Auto-Reply Logic for new contacts
      if (autoGreetingEnabled && !data.isMe) {
        // Here we'd ideally check if we have a chat history with this sender
        // For simulation, we'll assume new message triggers it
        sendAutoGreeting(data.senderJid);
      }

      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2354/2354-preview.mp3');
      audio.play().catch(() => {});
    });
    socket.on('incoming_call', (data: CallEvent) => {
      setIncomingCall(data);
    });
    return () => { socket.disconnect(); };
  }, [autoGreetingEnabled, quickReplies]);

  useEffect(() => {
    localStorage.setItem('waba_global_labels', JSON.stringify(globalLabels));
  }, [globalLabels]);

  useEffect(() => {
    if (systemUsers.length > 0) {
      localStorage.setItem('waba_system_users', JSON.stringify(systemUsers));
    }
  }, [systemUsers]);

  const accessibleAccounts = useMemo(() => {
    if (!currentUser) return [];
    if (currentUser.role === UserRole.ADMIN) return accounts;
    // Agent hanya bisa lihat akun yang ada di assignedAccounts mereka
    return accounts.filter(acc => currentUser.assignedAccounts?.includes(acc.id));
  }, [currentUser, accounts]);

  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);

  const selectedAccount = useMemo(() => 
    accounts.find(a => a.id === selectedAccountId) || (accessibleAccounts.length > 0 ? accessibleAccounts[0] : null)
  , [accounts, selectedAccountId, accessibleAccounts]);

  const handleUpdateAccount = (updatedAcc: WabaAccount) => {
    setAccounts(prev => prev.map(a => a.id === updatedAcc.id ? updatedAcc : a));
  };

  useEffect(() => {
    localStorage.setItem('waba_accounts', JSON.stringify(accounts));
  }, [accounts]);

  useEffect(() => {
    const savedUsers = localStorage.getItem('waba_system_users');
    if (!savedUsers) {
      localStorage.setItem('waba_system_users', JSON.stringify(INITIAL_SYSTEM_USERS));
      setSystemUsers(INITIAL_SYSTEM_USERS as User[]);
    } else {
      setSystemUsers(JSON.parse(savedUsers));
    }
    const savedSession = localStorage.getItem('waba_user');
    if (savedSession) setCurrentUser(JSON.parse(savedSession));
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('waba_user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setSelectedAccountId(null);
    localStorage.removeItem('waba_user');
    setActiveTab('dashboard');
  };

  if (!currentUser) return <Login onLogin={handleLogin} />;

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden relative font-inter">
      {incomingCall && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-md animate-fadeIn">
          <div className="bg-white w-full max-w-sm rounded-[3rem] shadow-2xl overflow-hidden p-8 text-center space-y-6 border-4 border-emerald-500 animate-slideUp">
             <div className="relative mx-auto w-24 h-24">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${incomingCall.fromName}`} className="w-full h-full rounded-full border-4 border-slate-100 shadow-lg" alt="" />
                <div className="absolute -bottom-1 -right-1 bg-emerald-500 p-2 rounded-full border-4 border-white animate-bounce">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
                </div>
             </div>
             <div>
                <h4 className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Incoming WhatsApp Call</h4>
                <p className="text-xl font-black text-slate-800">{incomingCall.fromName}</p>
             </div>
             <div className="flex gap-3">
                <button onClick={() => setIncomingCall(null)} className="flex-1 bg-red-50 text-red-600 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-red-500 hover:text-white transition-all">Reject</button>
                <button onClick={() => { setIncomingCall(null); setActiveTab('chat'); }} className="flex-1 bg-emerald-500 text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-emerald-200 hover:bg-emerald-600 transition-all">Answer</button>
             </div>
          </div>
        </div>
      )}

      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r transform transition-transform duration-200 lg:relative lg:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={(tab) => { setActiveTab(tab); setIsMobileMenuOpen(false); }} 
          currentUser={currentUser}
          onLogout={handleLogout}
          accounts={accessibleAccounts}
          selectedAccount={selectedAccount || undefined}
          setSelectedAccount={(acc) => setSelectedAccountId(acc.id)}
        />
      </div>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white border-b flex items-center justify-between px-4 lg:px-8 shadow-sm z-20">
          <div className="flex items-center gap-3">
             <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
             </button>
             <h1 className="text-base font-black text-slate-800 uppercase tracking-tight">{selectedAccount?.name || 'No Account Access'}</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest ${backendStatus === 'connected' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
               <div className={`w-1.5 h-1.5 rounded-full ${backendStatus === 'connected' ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></div>
               {backendStatus === 'connected' ? 'Backend Live' : 'Backend Offline'}
            </div>
            <img src={currentUser.avatar} alt="avatar" className="w-9 h-9 rounded-xl border-2 border-emerald-500" />
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 lg:p-8">
          {(() => {
            switch (activeTab) {
              case 'dashboard': return <Dashboard systemUsers={systemUsers} />;
              case 'chat': return <ChatWindow currentUser={currentUser} activeAccountId={selectedAccount?.id || ''} globalLabels={globalLabels} setGlobalLabels={setGlobalLabels} externalMessages={realtimeMessages} quickReplies={quickReplies} />;
              case 'crm': return <CRM globalLabels={globalLabels} setGlobalLabels={setGlobalLabels} />;
              case 'marketing': return <Marketing />;
              case 'finance': return <Finance />;
              case 'team': return <UserManagement users={systemUsers} setUsers={setSystemUsers} />;
              case 'settings': return <Settings accounts={accounts} onUpdateAccount={handleUpdateAccount} quickReplies={quickReplies} setQuickReplies={setQuickReplies} autoGreetingEnabled={autoGreetingEnabled} setAutoGreetingEnabled={setAutoGreetingEnabled} />;
              case 'golive': return <GoLive />;
              default: return <Dashboard systemUsers={systemUsers} />;
            }
          })()}
        </div>
      </main>
    </div>
  );
};

export default App;
