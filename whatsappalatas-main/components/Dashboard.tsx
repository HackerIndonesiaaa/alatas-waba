
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { User } from '../types';

const data = [
  { name: '08:00', inbound: 120, outbound: 80 },
  { name: '10:00', inbound: 450, outbound: 200 },
  { name: '12:00', inbound: 890, outbound: 450 },
  { name: '14:00', inbound: 1200, outbound: 600 },
  { name: '16:00', inbound: 980, outbound: 500 },
  { name: '18:00', inbound: 600, outbound: 300 },
  { name: '20:00', inbound: 200, outbound: 150 },
];

const slaData = [
  { name: 'Happy', speed: 130, color: '#10b981' },
  { name: 'Siti', speed: 285, color: '#f59e0b' },
  { name: 'Andi', speed: 450, color: '#ef4444' },
];

interface DashboardProps {
  systemUsers?: User[];
}

const Dashboard: React.FC<DashboardProps> = ({ systemUsers }) => {
  const displayUsers = systemUsers || [];

  const getSLAHealthLabel = (avgTimeStr: string) => {
    if (!avgTimeStr) return { label: 'Unknown', color: 'bg-slate-100 text-slate-400' };
    const minsMatch = avgTimeStr.match(/(\d+)m/);
    const secsMatch = avgTimeStr.match(/(\d+)s/);
    
    const mins = minsMatch ? parseInt(minsMatch[1]) : 0;
    const secs = secsMatch ? parseInt(secsMatch[1]) : 0;
    const totalSecs = (mins * 60) + secs;

    if (totalSecs < 60) return { label: '⚡ FAST', color: 'bg-emerald-50 text-emerald-600 border-emerald-100' };
    if (totalSecs < 300) return { label: '⚖️ STANDARD', color: 'bg-amber-50 text-amber-600 border-amber-100' };
    return { label: '🐢 DELAYED', color: 'bg-red-50 text-red-600 border-red-100' };
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {[
          { label: 'Total Messages', value: '12,842', change: '+12.5%', icon: 'M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z' },
          { label: 'Avg System SLA', value: '3.2 Min', change: '-1.4%', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
          { label: 'Conversion Rate', value: '24.2%', change: '+4.3%', icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' },
          { label: 'Unassigned Leads', value: '12', change: '-5', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border shadow-sm group hover:border-emerald-500 transition-all cursor-default relative overflow-hidden">
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-emerald-50 text-slate-400 group-hover:text-emerald-500 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={stat.icon} /></svg>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${stat.change.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                {stat.change}
              </span>
            </div>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest relative z-10">{stat.label}</p>
            <p className="text-2xl font-black text-slate-800 relative z-10">{stat.value}</p>
            <div className="absolute -bottom-2 -right-2 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
               <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d={stat.icon} /></svg>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-white rounded-[2rem] border shadow-sm overflow-hidden">
            <div className="p-6 border-b flex justify-between items-center bg-slate-50/30">
              <div>
                <h3 className="font-black text-slate-800 flex items-center gap-2 text-lg uppercase tracking-tight">
                  <svg className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" /></svg>
                  Agent Performance Audit
                </h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Detailed real-time response & intake tracking</p>
              </div>
              <button className="text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100 hover:bg-emerald-100 transition-all">Export Audit Report</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b">
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Team Member</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Leads Handled</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Efficiency Score</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">SLA Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {displayUsers.map((agent) => {
                    const slaHealth = getSLAHealthLabel(agent.avgResponseTime || "0s");
                    return (
                      <tr key={agent.id} className="hover:bg-slate-50 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <img src={agent.avatar} className="w-10 h-10 rounded-xl border-2 border-white shadow-sm" alt="" />
                              <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${agent.status === 'online' ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-sm font-black text-slate-800 leading-tight truncate max-w-[120px]">{agent.name}</span>
                              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{agent.role}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                           <div className="flex flex-col">
                              <span className="text-sm text-slate-700 font-mono font-black">{agent.leadsHandled || 0}</span>
                              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Total Conversations</span>
                           </div>
                        </td>
                        <td className="px-6 py-4">
                           <div className="flex flex-col items-center">
                              <span className="text-xs font-black text-slate-800 mb-1.5">{agent.avgResponseTime || '0s'}</span>
                              <div className="w-24 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                 <div className={`h-full transition-all duration-1000 ${slaHealth.label === '⚡ FAST' ? 'bg-emerald-500' : slaHealth.label === '⚖️ STANDARD' ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: slaHealth.label === '⚡ FAST' ? '90%' : slaHealth.label === '⚖️ STANDARD' ? '60%' : '30%' }}></div>
                              </div>
                           </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className={`text-[9px] font-black px-2.5 py-1.5 rounded-lg uppercase tracking-widest border inline-block ${slaHealth.color}`}>
                            {slaHealth.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl">
              <div className="flex items-center justify-between relative z-10 mb-8">
                 <div>
                    <h4 className="text-xl font-black uppercase tracking-tight">Peak Traffic Heatmap</h4>
                    <p className="text-xs text-slate-400 mt-1 font-medium">Hourly Inbound Message Density</p>
                 </div>
                 <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-[10px] font-black uppercase tracking-widest">Live Feed</span>
                 </div>
              </div>
              <div className="h-[250px] relative z-10">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data}>
                    <defs>
                      <linearGradient id="colorInbound" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10}} />
                    <Tooltip 
                      contentStyle={{borderRadius: '16px', border: 'none', backgroundColor: '#0f172a', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontSize: '12px', fontWeight: 'bold', color: '#fff'}}
                      itemStyle={{color: '#10b981'}}
                    />
                    <Area type="monotone" dataKey="inbound" stroke="#10b981" fillOpacity={1} fill="url(#colorInbound)" strokeWidth={4} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[2rem] border shadow-sm relative overflow-hidden">
            <h3 className="font-black text-slate-800 text-lg uppercase tracking-tight mb-2">Team SLA Rank</h3>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-8">Fastest Response (Seconds)</p>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={slaData}>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                   <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                   <YAxis axisLine={false} tickLine={false} hide />
                   <Tooltip cursor={{fill: 'transparent'}} />
                   <Bar dataKey="speed" radius={[10, 10, 10, 10]} barSize={40}>
                      {slaData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                   </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-6 space-y-3">
               <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white font-black text-[10px]">#1</div>
                    <span className="text-xs font-black text-slate-800 uppercase">Happy Firmansyah</span>
                  </div>
                  <span className="text-[10px] font-black text-emerald-600">130s AVG</span>
               </div>
               <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-white font-black text-[10px]">#2</div>
                    <span className="text-xs font-black text-slate-800 uppercase">Siti Aminah</span>
                  </div>
                  <span className="text-[10px] font-black text-amber-600">285s AVG</span>
               </div>
            </div>
          </div>

          <div className="bg-emerald-500 p-8 rounded-[2rem] text-white shadow-xl shadow-emerald-100 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10">
                <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
             </div>
             <h4 className="font-black uppercase tracking-widest text-xs opacity-80 mb-2">Automated Optimization</h4>
             <p className="text-lg font-black leading-tight mb-6">AI detected high traffic on Support Account.</p>
             <button className="w-full bg-white text-emerald-600 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-emerald-50 transition-all">Route to 2 Agents</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
