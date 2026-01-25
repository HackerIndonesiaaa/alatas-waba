
import React, { useState } from 'react';
import { MOCK_CONTACTS, LABELS } from '../constants';
import { BroadcastLog } from '../types';

const Marketing: React.FC = () => {
  const [view, setView] = useState<'history' | 'create' | 'templates'>('history');
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [broadcastName, setBroadcastName] = useState('');
  const [message, setMessage] = useState('');
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduleTime, setScheduleTime] = useState('');

  const [logs, setLogs] = useState<BroadcastLog[]>([
    { id: 'BC-001', name: 'Promo Akhir Tahun', target: 'Customers', sent: 2540, openRate: '74.5%', status: 'SENT', date: '2023-10-20' },
    { id: 'BC-002', name: 'Follow-up Leads Hot', target: 'Segmented Labels', sent: 0, openRate: '0%', status: 'SCHEDULED', date: '2025-01-01', scheduledAt: '2025-01-01 10:00 AM' },
  ]);

  const toggleLabelSelection = (label: string) => {
    setSelectedLabels(prev => 
      prev.includes(label) ? prev.filter(l => l !== label) : [...prev, label]
    );
  };

  const getTargetCount = () => {
    if (selectedLabels.length === 0) return MOCK_CONTACTS.length;
    return MOCK_CONTACTS.filter(c => c.labels.some(l => selectedLabels.includes(l))).length;
  };

  const handleFireBroadcast = () => {
    if (!broadcastName || !message) {
      alert("Mohon isi nama kampanye dan pesan.");
      return;
    }

    const newLog: BroadcastLog = {
      id: `BC-00${logs.length + 1}`,
      name: broadcastName,
      target: selectedLabels.length > 0 ? `Labels: ${selectedLabels.join(', ')}` : 'All Contacts',
      sent: isScheduled ? 0 : getTargetCount(),
      openRate: '0%',
      status: isScheduled ? 'SCHEDULED' : 'SENT',
      date: new Date().toISOString().split('T')[0],
      scheduledAt: isScheduled ? scheduleTime : undefined
    };

    setLogs([newLog, ...logs]);
    setView('history');
    setBroadcastName('');
    setMessage('');
    setSelectedLabels([]);
    setIsScheduled(false);
  };

  if (view === 'create') {
    return (
      <div className="space-y-6 max-w-4xl animate-fadeIn">
        <div className="flex items-center gap-4">
          <button onClick={() => setView('history')} className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">New Marketing Campaign</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-8 rounded-[2rem] border shadow-sm space-y-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Campaign Name</label>
                <input type="text" value={broadcastName} onChange={(e) => setBroadcastName(e.target.value)} placeholder="e.g., Flash Sale VIP" className="w-full px-5 py-4 bg-slate-50 border rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 font-bold" />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Target Audience (Select Labels)</label>
                <div className="flex flex-wrap gap-2">
                   {LABELS.map(l => (
                     <button 
                      key={l}
                      onClick={() => toggleLabelSelection(l)}
                      className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${selectedLabels.includes(l) ? 'bg-emerald-500 text-white border-emerald-600 shadow-md' : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'}`}
                     >
                       {l}
                     </button>
                   ))}
                </div>
                <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center justify-between">
                   <span className="text-[10px] font-black text-emerald-600 uppercase">Estimated Reach:</span>
                   <span className="text-sm font-black text-emerald-700">{getTargetCount()} Contacts</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Message Body</label>
                <textarea rows={5} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Hi {{name}}, we have a special offer for you!" className="w-full px-5 py-4 bg-slate-50 border rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-sm" />
              </div>

              <div className="p-6 bg-slate-900 rounded-3xl text-white">
                 <div className="flex items-center justify-between mb-4">
                    <span className="font-black text-xs uppercase tracking-widest">Schedule for Later</span>
                    <button 
                      onClick={() => setIsScheduled(!isScheduled)}
                      className={`w-12 h-6 rounded-full relative transition-colors ${isScheduled ? 'bg-emerald-500' : 'bg-slate-700'}`}
                    >
                       <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isScheduled ? 'left-7' : 'left-1'}`}></div>
                    </button>
                 </div>
                 {isScheduled && (
                    <input 
                      type="datetime-local" 
                      value={scheduleTime}
                      onChange={(e) => setScheduleTime(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white"
                    />
                 )}
              </div>
            </div>

            <button onClick={handleFireBroadcast} className="w-full bg-emerald-500 text-white py-5 rounded-3xl font-black shadow-xl hover:bg-emerald-600 transition-all uppercase tracking-widest text-xs">
              {isScheduled ? 'Schedule Campaign' : 'Confirm & Fire Now'}
            </button>
          </div>

          <div className="bg-white p-8 rounded-[2rem] border shadow-sm h-fit sticky top-4">
              <h3 className="font-black text-xs uppercase tracking-widest mb-6 text-slate-400">Live Preview</h3>
              <div className="bg-[#E5DDD5] rounded-3xl p-4 min-h-[250px] shadow-inner">
                 <div className="bg-white p-3 rounded-2xl rounded-tl-none text-sm text-slate-700 shadow-sm leading-relaxed">
                    {message || 'Type message to see preview...'}
                    <p className="text-[9px] text-slate-400 text-right mt-2 font-black">10:00 AM ✓✓</p>
                 </div>
              </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Marketing Center</h2>
          <p className="text-sm text-slate-500 font-medium">Smart segmented broadcast campaigns.</p>
        </div>
        <button onClick={() => setView('create')} className="bg-emerald-500 text-white px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-emerald-600 transition-all">+ New Campaign</button>
      </div>

      <div className="bg-white rounded-[2rem] border shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Campaign Name</th>
              <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sent To</th>
              <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
              <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {logs.map(log => (
              <tr key={log.id} className="hover:bg-slate-50 transition-all">
                <td className="px-8 py-6 font-black text-slate-800 uppercase text-sm">{log.name}</td>
                <td className="px-8 py-6 text-[10px] font-bold text-slate-500 uppercase">{log.target}</td>
                <td className="px-8 py-6">
                  <span className={`text-[9px] font-black px-2 py-1 rounded-full uppercase tracking-widest ${log.status === 'SENT' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                    {log.status}
                  </span>
                </td>
                <td className="px-8 py-6 text-right text-xs font-black text-slate-400">{log.scheduledAt || log.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Marketing;
