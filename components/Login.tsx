
import React, { useState } from 'react';
import { User } from '../types';
import Logo from './Logo';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('happyfirmansyah88@gmail.com');
  const [password, setPassword] = useState('@Bandung2025');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const savedUsers = localStorage.getItem('waba_system_users');
    const users = savedUsers ? JSON.parse(savedUsers) : [];

    const foundUser = users.find((u: any) => u.email === email && u.password === password);

    if (foundUser) {
      const userSession: User = {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        role: foundUser.role,
        avatar: foundUser.avatar
      };
      onLogin(userSession);
    } else {
      setError('Email atau password salah. Silakan coba lagi.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-[3rem] shadow-2xl border overflow-hidden">
        <div className="bg-slate-900 p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
             <svg className="w-full h-full" fill="none" viewBox="0 0 100 100" preserveAspectRatio="none">
               <path d="M0 100 L100 0 L100 100 Z" fill="url(#grad)" />
               <defs>
                 <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                   <stop offset="0%" style={{ stopColor: '#10b981', stopOpacity: 1 }} />
                   <stop offset="100%" style={{ stopColor: '#059669', stopOpacity: 1 }} />
                 </linearGradient>
               </defs>
             </svg>
          </div>
          <div className="relative z-10 flex flex-col items-center">
            <div className="bg-white p-4 rounded-3xl shadow-xl mb-6 border-4 border-emerald-500/20">
              <Logo iconOnly className="w-12 h-12" />
            </div>
            <h1 className="text-white text-3xl font-black tracking-tighter uppercase">ALATAS</h1>
            <p className="text-emerald-400 text-xs font-black tracking-[0.3em] uppercase mt-1">WHATSAPP PORTAL</p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-10 space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-xs font-bold border border-red-100 animate-shake">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
            <input 
              required
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-bold"
              placeholder="nama@email.com"
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
            </div>
            <input 
              required
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-bold"
              placeholder="••••••••"
            />
          </div>
          
          <button 
            type="submit"
            className="w-full bg-emerald-500 text-white py-5 rounded-2xl font-black shadow-xl shadow-emerald-100 hover:bg-emerald-600 active:scale-[0.98] transition-all text-xs uppercase tracking-widest"
          >
            Masuk Sekarang
          </button>
        </form>
        
        <div className="px-10 pb-10 text-center text-[10px] text-slate-400 font-bold uppercase tracking-tight">
           © 2025 ALATAS WHATSAPP. All Rights Reserved.
        </div>
      </div>
    </div>
  );
};

export default Login;
