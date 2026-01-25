
import React, { useState } from 'react';

const GoLive: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'vercel' | 'supabase' | 'apk' | 'calls'>('vercel');

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20 animate-fadeIn">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-black text-slate-800 uppercase tracking-tighter">ALATAS WHATSAPP PRO GUIDE</h2>
        <p className="text-slate-500 font-medium">Langkah konfigurasi produksi untuk Dashboard Multi-Nomor Anda.</p>
        <div className="flex justify-center gap-2 mt-6 flex-wrap">
          {[
            { id: 'vercel', label: '1. Hosting Vercel' },
            { id: 'supabase', label: '2. Database Supabase' },
            { id: 'calls', label: '3. Integrasi Panggilan' },
            { id: 'apk', label: '4. Build File APK' }
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-slate-900 text-white shadow-xl scale-110' : 'bg-white text-slate-400 border border-slate-200'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white p-10 rounded-[3rem] border shadow-xl">
        {activeTab === 'vercel' && (
          <div className="space-y-8 animate-slideUp">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-black text-white rounded-2xl flex items-center justify-center shadow-lg"><svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 19.77h20L12 2z"/></svg></div>
              <div>
                <h3 className="text-2xl font-black uppercase tracking-tight">Deployment Frontend</h3>
                <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">Menjalankan Dashboard ALATAS Secara Global</p>
              </div>
            </div>
            <div className="bg-slate-900 p-8 rounded-3xl text-white space-y-4">
               <h4 className="text-emerald-400 font-black uppercase text-xs">Panduan Vercel:</h4>
               <ol className="list-decimal list-inside space-y-2 text-xs text-slate-300 font-medium">
                  <li>Deploy project ini ke <a href="https://vercel.com" className="text-emerald-400 underline font-bold">Vercel</a></li>
                  <li>Hubungkan dengan Github repository.</li>
                  <li>Setting <code>API_KEY</code> di Environment Variables untuk AI Smart Response.</li>
                  <li>Sekarang dashboard Anda dapat diakses dari manapun.</li>
               </ol>
            </div>
          </div>
        )}

        {activeTab === 'supabase' && (
          <div className="space-y-8 animate-slideUp">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-emerald-600 text-white rounded-2xl flex items-center justify-center shadow-lg font-black text-2xl">S</div>
              <div>
                <h3 className="text-2xl font-black uppercase tracking-tight">Database & Persistence</h3>
                <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">Penyimpanan Pesan & Log Permanen</p>
              </div>
            </div>
            <div className="bg-slate-50 p-6 rounded-2xl border">
               <h4 className="text-sm font-black text-slate-800 uppercase mb-4">Langkah Supabase:</h4>
               <ul className="space-y-4 text-xs font-medium text-slate-600">
                  <li className="flex gap-3">
                     <span className="w-5 h-5 bg-slate-900 text-white rounded flex items-center justify-center flex-shrink-0">1</span>
                     <span>Gunakan Supabase untuk sinkronisasi pesan antar agen secara real-time.</span>
                  </li>
                  <li className="flex gap-3">
                     <span className="w-5 h-5 bg-slate-900 text-white rounded flex items-center justify-center flex-shrink-0">2</span>
                     <span>Setup tabel <code>messages</code> untuk menyimpan riwayat chat dari 5 nomor.</span>
                  </li>
               </ul>
            </div>
          </div>
        )}

        {activeTab === 'calls' && (
          <div className="space-y-8 animate-slideUp">
            <div className="flex items-center gap-4">
               <div className="w-16 h-16 bg-emerald-500 text-white rounded-2xl flex items-center justify-center shadow-lg">
                  <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
               </div>
               <div>
                  <h3 className="text-2xl font-black uppercase tracking-tight">WhatsApp Call Alerts</h3>
                  <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">Pantau Telepon Masuk dari Dashboard</p>
               </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100 space-y-3">
                  <h4 className="text-blue-800 font-black uppercase text-[10px] tracking-widest">Notifikasi Panggilan:</h4>
                  <p className="text-xs text-blue-700 leading-relaxed font-medium">
                     Sistem ALATAS mendeteksi event panggilan dari backend WA dan menampilkan overlay notifikasi suara/visual di dashboard CS Anda.
                  </p>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'apk' && (
          <div className="space-y-8 animate-slideUp">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg font-black text-2xl">A</div>
              <div>
                <h3 className="text-2xl font-black uppercase tracking-tight">Build APK for Android</h3>
                <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">Install Sebagai Aplikasi Android Asli</p>
              </div>
            </div>
            <div className="bg-indigo-900 p-8 rounded-3xl text-white space-y-4">
               <h4 className="text-indigo-400 font-black uppercase text-xs">Langkah Konversi APK:</h4>
               <ol className="list-decimal list-inside space-y-3 text-xs text-slate-300 font-medium">
                  <li>Buka <a href="https://pwabuilder.com" className="text-indigo-400 underline font-bold">PWA Builder</a></li>
                  <li>Input URL dashboard ALATAS Anda yang sudah live.</li>
                  <li>Build untuk platform Android.</li>
                  <li>Download dan install file APK ke device tim Anda.</li>
               </ol>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GoLive;
