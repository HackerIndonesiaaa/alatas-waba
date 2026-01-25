
import React, { useState } from 'react';
import { MOCK_CONTACTS } from '../constants';

interface CRMProps {
  globalLabels: string[];
  setGlobalLabels: (labels: string[]) => void;
}

const CRM: React.FC<CRMProps> = ({ globalLabels, setGlobalLabels }) => {
  const [contacts, setContacts] = useState(MOCK_CONTACTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLabelFilter, setSelectedLabelFilter] = useState<string>('All');
  
  // States for Modals
  const [showLabelManager, setShowLabelManager] = useState(false);
  const [contactToDelete, setContactToDelete] = useState<string | null>(null);
  const [newLabelInput, setNewLabelInput] = useState('');
  
  // State for Label Selection Dropdown
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const filteredContacts = contacts.filter(c => {
    const matchesSearch = 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      c.phone.includes(searchTerm);
    
    const matchesLabel = 
      selectedLabelFilter === 'All' || 
      c.labels.some(l => l.toLowerCase() === selectedLabelFilter.toLowerCase());

    return matchesSearch && matchesLabel;
  });

  const toggleContactLabel = (contactId: string, label: string) => {
    setContacts(prev => prev.map(c => {
      if (c.id === contactId) {
        const hasLabel = c.labels.includes(label);
        return {
          ...c,
          labels: hasLabel 
            ? c.labels.filter(l => l !== label) 
            : [...c.labels, label]
        };
      }
      return c;
    }));
  };

  const createAndAssignLabel = (contactId: string) => {
    if (!newLabelInput.trim()) return;
    const label = newLabelInput.trim();
    
    // Add to global if not exists
    if (!globalLabels.includes(label)) {
      setGlobalLabels([...globalLabels, label]);
    }
    
    // Assign to contact
    toggleContactLabel(contactId, label);
    setNewLabelInput('');
    setActiveDropdown(null);
  };

  const deleteGlobalLabel = (label: string) => {
    if (confirm(`Hapus kategori label "${label}" secara permanen? Label ini juga akan dihapus dari semua kontak.`)) {
      setGlobalLabels(globalLabels.filter(l => l !== label));
      setContacts(contacts.map(c => ({
        ...c,
        labels: c.labels.filter(l => l !== label)
      })));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Customer Intelligence</h2>
          <p className="text-sm text-slate-500 font-medium">Manage segments and monitor engagement across your lead pipeline.</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <button 
            onClick={() => setShowLabelManager(true)}
            className="flex-1 md:flex-none bg-slate-900 text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-xl"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
            Manage Categories
          </button>
          <button className="flex-1 md:flex-none bg-emerald-500 text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-emerald-100 hover:bg-emerald-600 transition-all">Add Contact</button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-[2rem] border shadow-sm space-y-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <input 
              type="text" 
              placeholder="Search by name or phone number..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-emerald-500 font-medium transition-all"
            />
            <svg className="w-6 h-6 text-slate-400 absolute left-4 top-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2">Filter by Category:</span>
           {['All', ...globalLabels].map((label) => (
             <button
               key={label}
               onClick={() => setSelectedLabelFilter(label)}
               className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                 selectedLabelFilter === label 
                 ? 'bg-slate-900 text-white border-slate-900 shadow-lg' 
                 : 'bg-white text-slate-500 border-slate-200 hover:border-emerald-500 hover:text-emerald-600'
               }`}
             >
               {label}
             </button>
           ))}
        </div>
      </div>

      <div className="bg-white rounded-[2rem] border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Customer Identity</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Connectivity</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Segment Labels</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredContacts.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <img src={`https://picsum.photos/seed/${c.id}/48/48`} className="w-12 h-12 rounded-2xl border-2 border-white shadow-sm" alt="" />
                      <div className="min-w-0">
                        <div className="font-black text-slate-800 text-sm truncate uppercase tracking-tight">{c.name}</div>
                        <div className="text-xs text-slate-400 font-mono font-medium">{c.phone}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                       <div className={`w-2 h-2 rounded-full ${c.status === 'online' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}></div>
                       <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{c.status}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex flex-wrap gap-2 items-center">
                      {c.labels.map((l, idx) => (
                        <span key={idx} className="px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600 border border-emerald-100">
                          {l}
                        </span>
                      ))}
                      
                      <div className="relative">
                        <button 
                          onClick={() => setActiveDropdown(activeDropdown === c.id ? null : c.id)}
                          className="w-7 h-7 flex items-center justify-center rounded-xl bg-slate-100 text-slate-400 hover:bg-slate-900 hover:text-white transition-all border border-slate-200"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                        </button>

                        {activeDropdown === c.id && (
                          <div className="absolute left-0 bottom-full mb-2 w-56 bg-white rounded-2xl shadow-2xl border z-[100] p-2 animate-slideUp">
                             <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-3 py-2">Quick Assign Label</p>
                             <div className="max-h-40 overflow-y-auto px-1">
                                {globalLabels.map(l => (
                                  <button 
                                    key={l}
                                    onClick={() => toggleContactLabel(c.id, l)}
                                    className={`w-full text-left px-3 py-2 rounded-xl text-[10px] font-bold uppercase transition-all mb-1 flex items-center justify-between ${c.labels.includes(l) ? 'bg-emerald-50 text-emerald-600' : 'hover:bg-slate-50 text-slate-600'}`}
                                  >
                                    {l}
                                    {c.labels.includes(l) && <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}
                                  </button>
                                ))}
                             </div>
                             <div className="mt-2 pt-2 border-t px-1">
                                <input 
                                  type="text" 
                                  placeholder="+ Create New Label"
                                  value={newLabelInput}
                                  onChange={(e) => setNewLabelInput(e.target.value)}
                                  onKeyDown={(e) => e.key === 'Enter' && createAndAssignLabel(c.id)}
                                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl text-[10px] outline-none focus:ring-1 focus:ring-emerald-500"
                                />
                             </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                     <button onClick={() => setContactToDelete(c.id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                     </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Global Label Manager Modal */}
      {showLabelManager && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl overflow-hidden animate-slideUp">
            <div className="p-8 border-b flex justify-between items-center bg-slate-50">
              <h3 className="font-black text-slate-800 text-lg uppercase tracking-tight">Kategori Label Lead</h3>
              <button onClick={() => setShowLabelManager(false)} className="p-2 hover:bg-slate-200 rounded-xl transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-8 space-y-6">
               <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Buat Kategori Baru</label>
                  <div className="flex gap-2">
                     <input 
                      type="text" 
                      placeholder="Contoh: Reseller, Komplain, VIP"
                      value={newLabelInput}
                      onChange={(e) => setNewLabelInput(e.target.value)}
                      className="flex-1 px-5 py-4 bg-slate-50 border rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-sm"
                     />
                     <button 
                      onClick={() => {
                        if (newLabelInput.trim()) {
                          setGlobalLabels([...globalLabels, newLabelInput.trim()]);
                          setNewLabelInput('');
                        }
                      }}
                      className="bg-emerald-500 text-white px-6 rounded-2xl font-black uppercase text-[10px] shadow-lg shadow-emerald-100"
                     >
                       Add
                     </button>
                  </div>
               </div>

               <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Kategori Saat Ini</label>
                  <div className="grid grid-cols-1 gap-2">
                     {globalLabels.map(l => (
                       <div key={l} className="flex items-center justify-between p-4 bg-slate-50 border rounded-2xl group hover:border-emerald-200 transition-all">
                          <span className="text-sm font-black text-slate-700 uppercase tracking-tight">{l}</span>
                          <button onClick={() => deleteGlobalLabel(l)} className="text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                       </div>
                     ))}
                  </div>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CRM;
