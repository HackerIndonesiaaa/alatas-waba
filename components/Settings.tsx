
import React, { useState } from 'react';
import { WabaAccount, QuickReply } from '../types';

interface SettingsProps {
  accounts: WabaAccount[];
  onUpdateAccount: (acc: WabaAccount) => void;
  quickReplies: QuickReply[];
  setQuickReplies: (replies: QuickReply[]) => void;
  autoGreetingEnabled: boolean;
  setAutoGreetingEnabled: (val: boolean) => void;
}

const Settings: React.FC<SettingsProps> = ({ accounts, onUpdateAccount, quickReplies, setQuickReplies, autoGreetingEnabled, setAutoGreetingEnabled }) => {
  const [activeTab, setActiveTab] = useState<'slots' | 'templates' | 'automation'>('slots');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempAcc, setTempAcc] = useState<Partial<WabaAccount>>({});
  
  // Template States
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<QuickReply | null>(null);
  const [customCategoryInput, setCustomCategoryInput] = useState('');
  const [templateForm, setTemplateForm] = useState({
    title: '',
    category: 'opening',
    content: ''
  });

  const slots = Array.from({ length: 5 }).map((_, i) => {
    return accounts[i] || { id: `slot-${i}`, name: `Slot Kosong ${i+1}`, status: 'disconnected', connectionType: 'QR', phoneNumber: '-' };
  });

  const uniqueCategories = Array.from(new Set(quickReplies.map(qr => qr.category.toLowerCase())));
  const defaultCategories = ['opening', 'pricing', 'payment', 'closing'];
  const allSuggestedCategories = Array.from(new Set([...defaultCategories, ...uniqueCategories]));

  const handleSaveAccount = () => {
    if (tempAcc.id) {
      onUpdateAccount(tempAcc as WabaAccount);
      setEditingId(null);
    }
  };

  const handleSaveTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    const finalCategory = templateForm.category === 'custom' ? customCategoryInput : templateForm.category;
    
    if (editingTemplate) {
      setQuickReplies(quickReplies.map(qr => qr.id === editingTemplate.id ? { ...editingTemplate, ...templateForm, category: finalCategory } : qr));
    } else {
      const newTemplate: QuickReply = {
        id: Date.now().toString(),
        ...templateForm,
        category: finalCategory
      };
      setQuickReplies([...quickReplies, newTemplate]);
    }
    setShowTemplateModal(false);
    setEditingTemplate(null);
    setTemplateForm({ title: '', category: 'opening', content: '' });
    setCustomCategoryInput('');
  };

  const deleteTemplate = (id: string) => {
    if (confirm('Hapus template pesan ini?')) {
      setQuickReplies(quickReplies.filter(qr => qr.id !== id));
    }
  };

  return (
    <div className="space-y-8 pb-20 max-w-6xl mx-auto animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 bg-white p-8 rounded-[3rem] border shadow-sm">
        <div className="space-y-1">
          <h2 className="text-3xl font-black uppercase tracking-tighter text-slate-800">System Configuration</h2>
          <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">Alatas Management Engine</p>
        </div>
        <div className="flex bg-slate-100 p-1.5 rounded-2xl overflow-x-auto scrollbar-hide">
           <button 
            onClick={() => setActiveTab('slots')}
            className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'slots' ? 'bg-white shadow-lg text-emerald-600' : 'text-slate-400 hover:text-slate-600'}`}
           >
             WhatsApp Slots
           </button>
           <button 
            onClick={() => setActiveTab('templates')}
            className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'templates' ? 'bg-white shadow-lg text-emerald-600' : 'text-slate-400 hover:text-slate-600'}`}
           >
             Templates
           </button>
           <button 
            onClick={() => setActiveTab('automation')}
            className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'automation' ? 'bg-white shadow-lg text-emerald-600' : 'text-slate-400 hover:text-slate-600'}`}
           >
             Automation
           </button>
        </div>
      </div>

      {activeTab === 'slots' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {slots.map((acc, idx) => (
            <div key={acc.id} className={`bg-white p-6 rounded-[2.5rem] border-2 transition-all ${acc.status === 'connected' ? 'border-emerald-500 shadow-emerald-50' : 'border-slate-100 hover:border-emerald-500 shadow-sm'}`}>
              <div className="flex justify-between items-start mb-6">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black shadow-lg ${acc.status === 'connected' ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                  {idx + 1}
                </div>
                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${acc.status === 'connected' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                  {acc.status}
                </span>
              </div>
              
              <h3 className="font-black text-slate-800 uppercase tracking-tight truncate">{acc.name}</h3>
              <p className="text-xs font-mono text-slate-400 mt-1">{acc.phoneNumber}</p>
              
              <div className="mt-6 pt-6 border-t border-dashed flex gap-2">
                <button 
                  onClick={() => { setEditingId(acc.id); setTempAcc(acc); }}
                  className="flex-1 bg-slate-900 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg"
                >
                  Konfigurasi
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'templates' && (
        <div className="space-y-6">
           <div className="flex justify-between items-center bg-white p-6 rounded-[2rem] border shadow-sm">
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest ml-2">Total Templates: {quickReplies.length}</p>
              <button 
                onClick={() => { setShowTemplateModal(true); setEditingTemplate(null); setTemplateForm({ title: '', category: 'opening', content: '' }); }}
                className="bg-emerald-500 text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-emerald-600 transition-all"
              >
                + New Template
              </button>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quickReplies.map(qr => (
                <div key={qr.id} className="bg-white p-6 rounded-3xl border shadow-sm hover:border-emerald-500 transition-all group relative">
                   <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-emerald-500">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                         </div>
                         <div>
                            <h4 className="font-black text-slate-800 text-sm uppercase tracking-tight leading-none">{qr.title}</h4>
                            <span className="text-[8px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100 mt-1 inline-block">{qr.category}</span>
                         </div>
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button 
                          onClick={() => { 
                            setEditingTemplate(qr); 
                            setTemplateForm({ title: qr.title, category: qr.category, content: qr.content }); 
                            setShowTemplateModal(true); 
                          }}
                          className="p-2 bg-slate-50 text-slate-400 hover:text-emerald-500 rounded-lg"
                         >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                         </button>
                         <button onClick={() => deleteTemplate(qr.id)} className="p-2 bg-slate-50 text-slate-400 hover:text-red-500 rounded-lg">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                         </button>
                      </div>
                   </div>
                   <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed font-medium bg-slate-50/50 p-4 rounded-2xl border border-slate-100">{qr.content}</p>
                </div>
              ))}
           </div>
        </div>
      )}

      {activeTab === 'automation' && (
        <div className="space-y-6 max-w-2xl">
           <div className="bg-white p-8 rounded-[3rem] border shadow-sm space-y-8">
              <div className="flex items-center justify-between">
                 <div className="space-y-1">
                    <h3 className="font-black text-slate-800 uppercase tracking-tight">Auto-Greeting Responder</h3>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Kirim pesan otomatis ke kontak baru</p>
                 </div>
                 <button 
                  onClick={() => setAutoGreetingEnabled(!autoGreetingEnabled)}
                  className={`w-14 h-8 rounded-full relative transition-all shadow-inner ${autoGreetingEnabled ? 'bg-emerald-500' : 'bg-slate-200'}`}
                 >
                    <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-all ${autoGreetingEnabled ? 'left-7' : 'left-1'}`}></div>
                 </button>
              </div>

              <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-[2rem] space-y-4">
                 <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-emerald-500 text-white rounded-lg flex items-center justify-center">
                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <span className="text-[10px] font-black text-emerald-800 uppercase tracking-widest">Cara Kerja:</span>
                 </div>
                 <p className="text-xs text-emerald-700 leading-relaxed font-medium">
                    Sistem akan mendeteksi pesan masuk dari kontak baru (nomor yang belum pernah dibalas). 
                    Sistem akan mengambil template dengan kategori <strong>"Opening"</strong> pertama dan mengirimkannya secara otomatis.
                 </p>
              </div>

              {!autoGreetingEnabled && (
                <p className="text-[10px] text-center font-black text-slate-400 uppercase tracking-widest py-4">Status: Automation is Disabled</p>
              )}
           </div>
        </div>
      )}

      {/* TEMPLATE MODAL */}
      {showTemplateModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden animate-slideUp">
            <div className="p-8 border-b bg-slate-50 flex justify-between items-center">
               <h3 className="font-black text-slate-800 uppercase tracking-tight">{editingTemplate ? 'Edit Template' : 'New Template'}</h3>
               <button onClick={() => setShowTemplateModal(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
               </button>
            </div>
            <form onSubmit={handleSaveTemplate} className="p-8 space-y-6">
               <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Template Title</label>
                  <input required type="text" value={templateForm.title} onChange={(e) => setTemplateForm({...templateForm, title: e.target.value})} placeholder="Contoh: Sapaan Awal" className="w-full px-5 py-4 bg-slate-50 border rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 font-bold" />
               </div>
               
               <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Kategori Pesan</label>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                     {allSuggestedCategories.map(cat => (
                        <button 
                          key={cat}
                          type="button"
                          onClick={() => setTemplateForm({...templateForm, category: cat})}
                          className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${templateForm.category === cat ? 'bg-emerald-500 text-white border-emerald-600' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
                        >
                           {cat}
                        </button>
                     ))}
                     <button 
                       type="button"
                       onClick={() => setTemplateForm({...templateForm, category: 'custom'})}
                       className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${templateForm.category === 'custom' ? 'bg-indigo-500 text-white border-indigo-600' : 'bg-indigo-50 text-indigo-500'}`}
                     >
                        + Create Custom
                     </button>
                  </div>
                  
                  {templateForm.category === 'custom' && (
                    <input 
                      required 
                      type="text" 
                      value={customCategoryInput}
                      onChange={(e) => setCustomCategoryInput(e.target.value)}
                      placeholder="Ketik nama kategori baru..." 
                      className="w-full px-5 py-3 bg-indigo-50 border border-indigo-200 rounded-2xl outline-none font-bold text-xs"
                    />
                  )}
               </div>

               <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Message Content</label>
                  <textarea required rows={5} value={templateForm.content} onChange={(e) => setTemplateForm({...templateForm, content: e.target.value})} placeholder="Hi Kak! Ada yang bisa kami bantu? 😊" className="w-full px-5 py-4 bg-slate-50 border rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-sm leading-relaxed" />
               </div>
               <button type="submit" className="w-full bg-emerald-500 text-white py-5 rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-xs shadow-xl hover:bg-emerald-600 transition-all">
                 {editingTemplate ? 'Update Template' : 'Save & Activate Now'}
               </button>
            </form>
          </div>
        </div>
      )}

      {/* Existing SLOT MODAL omitted for brevity but remains in code */}
      {editingId && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden animate-slideUp">
            <div className="p-8 border-b bg-slate-50 flex justify-between items-center">
               <h3 className="font-black text-slate-800 uppercase tracking-tight">Setup WhatsApp Number</h3>
               <button onClick={() => setEditingId(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
               </button>
            </div>
            <div className="p-8 space-y-5">
               <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-2xl">
                  <button onClick={() => setTempAcc({...tempAcc, connectionType: 'META'})} className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${tempAcc.connectionType === 'META' ? 'bg-white shadow-md text-emerald-600' : 'text-slate-400'}`}>Cloud API</button>
                  <button onClick={() => setTempAcc({...tempAcc, connectionType: 'QR'})} className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${tempAcc.connectionType === 'QR' ? 'bg-white shadow-md text-emerald-600' : 'text-slate-400'}`}>Scan QR</button>
               </div>
               <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Account Label</label>
                  <input type="text" value={tempAcc.name || ''} onChange={(e) => setTempAcc({...tempAcc, name: e.target.value})} className="w-full px-5 py-3 bg-slate-50 border rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 font-bold" />
               </div>
               <button onClick={handleSaveAccount} className="w-full bg-slate-900 text-white py-5 rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-xs shadow-xl hover:bg-emerald-600 transition-all mt-4">Save Configuration</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
