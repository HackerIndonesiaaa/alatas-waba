
import React, { useState, useEffect, useRef } from 'react';
import { MOCK_CONTACTS, INITIAL_SYSTEM_USERS, API_BASE_URL } from '../constants';
import { Contact, Message, User, QuickReply } from '../types';
import { GoogleGenAI } from "@google/genai";
import { saveMessageToDb } from '../supabase';

interface ChatWindowProps {
  currentUser: User;
  activeAccountId: string;
  globalLabels: string[];
  setGlobalLabels: (labels: string[]) => void;
  externalMessages?: Message[];
  quickReplies: QuickReply[];
}

const ChatWindow: React.FC<ChatWindowProps> = ({ currentUser, activeAccountId, globalLabels, setGlobalLabels, externalMessages = [], quickReplies }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [contacts, setContacts] = useState<Contact[]>(MOCK_CONTACTS);
  const [isPrivateMode, setIsPrivateMode] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showLabelDropdown, setShowLabelDropdown] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(false);
  const [qrSearch, setQrSearch] = useState('');
  
  const [activeViewers] = useState<User[]>(
    INITIAL_SYSTEM_USERS.filter(u => u.id !== currentUser.id).slice(0, 1)
  );

  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const accountContacts = contacts.filter(c => 
    c.accountId === activeAccountId && 
    (c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.phone.includes(searchTerm))
  );
  
  const [selectedContact, setSelectedContact] = useState<Contact>(accountContacts[0] || MOCK_CONTACTS[0]);
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: 'm1', 
      text: 'Halo, saya mau tanya harga paket platinum?', 
      senderId: '1', 
      senderName: 'Budi Santoso', 
      timestamp: new Date(Date.now() - 3600000), 
      isMe: false 
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  useEffect(() => {
    if (externalMessages.length > 0) {
      const lastMsg = externalMessages[externalMessages.length - 1];
      if (lastMsg.senderId.includes(selectedContact.phone.replace('+', ''))) {
        setMessages(prev => [...prev, lastMsg]);
      }
    }
  }, [externalMessages, selectedContact]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const toggleContactLabel = (label: string) => {
    const updatedContacts = contacts.map(c => {
      if (c.id === selectedContact.id) {
        const hasLabel = c.labels.includes(label);
        const newLabels = hasLabel 
          ? c.labels.filter(l => l !== label) 
          : [...c.labels, label];
        return { ...c, labels: newLabels };
      }
      return c;
    });
    setContacts(updatedContacts);
    const updated = updatedContacts.find(c => c.id === selectedContact.id);
    if (updated) setSelectedContact(updated);
  };

  const handleSendMessage = async (text: string, attachment?: Message['attachment'], forcePrivate = false) => {
    if (!text.trim() && !attachment) return;
    
    const now = new Date();
    let calculatedResponseTime: number | undefined = undefined;

    const lastCustomerMsg = [...messages].reverse().find(m => !m.isMe);
    if (lastCustomerMsg) {
      const diffInMs = now.getTime() - new Date(lastCustomerMsg.timestamp).getTime();
      calculatedResponseTime = Math.floor(diffInMs / 1000);
    }
    
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      senderId: currentUser.id,
      senderName: currentUser.name,
      timestamp: now,
      isMe: true,
      repliedBy: currentUser.name,
      isPrivate: forcePrivate || isPrivateMode,
      responseTime: calculatedResponseTime,
      attachment
    };

    setMessages(prev => [...prev, newMessage]);
    if (!forcePrivate) setInputText('');

    await saveMessageToDb({ ...newMessage, accountId: activeAccountId });

    if (!isPrivateMode && !forcePrivate) {
      try {
        await fetch(`${API_BASE_URL}/api/send-message`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jid: selectedContact.phone.replace('+', '') + '@s.whatsapp.net',
            text: text
          })
        });
      } catch (err) {
        console.error("WhatsApp API Error:", err);
      }
    }

    if (isPrivateMode) setIsPrivateMode(false);
  };

  const useQuickReply = (reply: QuickReply) => {
    setInputText(reply.content);
    setShowQuickReplies(false);
  };

  const filteredQuickReplies = quickReplies.filter(qr => 
    qr.title.toLowerCase().includes(qrSearch.toLowerCase()) || 
    qr.content.toLowerCase().includes(qrSearch.toLowerCase())
  );

  const handleTransfer = (targetAgent: User) => {
    const updatedContacts = contacts.map(c => 
      c.id === selectedContact.id 
        ? { ...c, assignedTo: targetAgent.id, assignedName: targetAgent.name.split(' ')[0] } 
        : c
    );
    setContacts(updatedContacts);
    setSelectedContact({ ...selectedContact, assignedTo: targetAgent.id, assignedName: targetAgent.name.split(' ')[0] });

    const transferNote = `🔄 TRANSFER LOG: Chat dialihkan dari ${currentUser.name} ke ${targetAgent.name}.`;
    handleSendMessage(transferNote, undefined, true);
    setShowTransferModal(false);
  };

  const generateSmartReply = async () => {
    setIsAiLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const lastCustMsg = [...messages].reverse().find(m => !m.isMe)?.text || "";
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Kamu adalah CS profesional ALATAS WHATSAPP. Berikan balasan singkat dan ramah untuk pelanggan: "${lastCustMsg}"`,
      });
      if (response.text) setInputText(response.text.trim());
    } catch (e) { console.error(e); } finally { setIsAiLoading(false); }
  };

  return (
    <div className="flex h-[calc(100vh-140px)] bg-white rounded-2xl border overflow-hidden shadow-sm animate-fadeIn relative">
      <div className="w-full md:w-80 border-r flex flex-col bg-white">
        <div className="p-4 border-b">
          <input 
            type="text" 
            placeholder="Search leads..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 bg-slate-50 border rounded-xl text-xs outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
          />
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          {accountContacts.map((contact) => (
            <button
              key={contact.id}
              onClick={() => setSelectedContact(contact)}
              className={`w-full p-4 flex items-center gap-3 border-b hover:bg-slate-50 text-left transition-all ${selectedContact.id === contact.id ? 'bg-emerald-50' : ''}`}
            >
              <div className="relative">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${contact.name}`} className="w-10 h-10 rounded-full border border-slate-200" alt="" />
                {contact.status === 'online' && <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white shadow-sm"></div>}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-800 text-sm truncate">{contact.name}</span>
                  <span className="text-[9px] text-slate-400 font-bold uppercase">{contact.timestamp}</span>
                </div>
                <div className="flex items-center gap-1 mt-1 overflow-hidden">
                   {contact.labels.slice(0, 2).map(l => (
                     <span key={l} className="text-[7px] font-black uppercase px-1 bg-slate-100 text-slate-500 rounded border border-slate-200 whitespace-nowrap">{l}</span>
                   ))}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="hidden md:flex flex-1 flex-col bg-[#F8FAFC] relative">
        <header className="h-20 bg-white border-b px-6 flex items-center justify-between shadow-sm z-30 relative">
          <div className="flex items-center gap-4">
            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedContact.name}`} className="w-10 h-10 rounded-full" alt="" />
            <div>
              <div className="flex items-center gap-3">
                <h3 className="font-black text-slate-800 leading-none uppercase tracking-tighter">{selectedContact.name}</h3>
                <div className="flex flex-wrap gap-1">
                   {selectedContact.labels.map(l => (
                     <span key={l} className="text-[8px] font-black uppercase px-1.5 py-0.5 bg-emerald-50 text-emerald-600 rounded border border-emerald-100">{l}</span>
                   ))}
                   <div className="relative">
                      <button 
                        onClick={() => setShowLabelDropdown(!showLabelDropdown)}
                        className="p-0.5 bg-slate-100 text-slate-400 rounded hover:bg-slate-200 transition-colors"
                      >
                         <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                      </button>
                      
                      {showLabelDropdown && (
                        <div className="absolute left-0 top-full mt-2 w-48 bg-white border rounded-xl shadow-xl z-50 p-2 animate-slideUp">
                           <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest p-2 border-b mb-1">Tag Customer</p>
                           {globalLabels.map(l => (
                             <button 
                              key={l}
                              onClick={() => toggleContactLabel(l)}
                              className={`w-full text-left px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase flex items-center justify-between ${selectedContact.labels.includes(l) ? 'bg-emerald-50 text-emerald-600' : 'hover:bg-slate-50 text-slate-600'}`}
                             >
                               {l}
                             </button>
                           ))}
                        </div>
                      )}
                   </div>
                </div>
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">CS: {selectedContact.assignedName || 'Unassigned'}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
             <button 
                onClick={() => setShowTransferModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg active:scale-95"
             >
                Transfer Agent
             </button>
          </div>
        </header>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-emerald-50/10">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
              <div className="max-w-[75%]">
                <div className={`px-4 py-3 rounded-2xl shadow-sm text-sm relative transition-all ${
                  msg.isPrivate ? 'bg-amber-100/90 text-amber-900 border-2 border-dashed border-amber-400 rounded-tr-none' :
                  msg.isMe ? 'bg-emerald-500 text-white rounded-tr-none' : 
                  'bg-white text-slate-700 rounded-tl-none border border-slate-100'
                }`}>
                  <div className="leading-relaxed">{msg.text}</div>
                </div>
                <div className={`flex items-center gap-2 mt-1 px-1 ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
                  <span className="text-[8px] font-bold text-slate-400">{msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className={`p-4 border-t relative transition-all duration-300 ${isPrivateMode ? 'bg-amber-50' : 'bg-white'}`}>
          {showQuickReplies && (
            <div className="absolute bottom-full left-4 right-4 bg-white border rounded-[2rem] shadow-2xl mb-4 p-6 animate-slideUp z-50">
               <div className="flex items-center justify-between mb-4">
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest">⚡ Quick Replies & Templates</h4>
                  <button onClick={() => setShowQuickReplies(false)} className="text-slate-400 hover:text-slate-600 p-2">
                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
               </div>
               <input 
                type="text" 
                placeholder="Search templates..." 
                value={qrSearch}
                onChange={(e) => setQrSearch(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs outline-none focus:ring-2 focus:ring-emerald-500 font-medium mb-4"
               />
               <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-2 scrollbar-hide">
                  {filteredQuickReplies.map(qr => (
                    <button 
                      key={qr.id}
                      onClick={() => useQuickReply(qr)}
                      className="text-left p-4 rounded-2xl border border-slate-100 hover:border-emerald-500 hover:bg-emerald-50 transition-all group"
                    >
                       <div className="flex justify-between items-center mb-1">
                          <span className="text-[10px] font-black text-slate-800 uppercase truncate">{qr.title}</span>
                          <span className="text-[7px] font-black px-1.5 py-0.5 bg-slate-100 text-slate-400 rounded uppercase tracking-tighter group-hover:bg-emerald-500 group-hover:text-white">{qr.category}</span>
                       </div>
                       <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">{qr.content}</p>
                    </button>
                  ))}
                  {filteredQuickReplies.length === 0 && <p className="text-center py-10 text-[10px] font-black text-slate-400 uppercase tracking-widest">No templates found.</p>}
               </div>
            </div>
          )}

          <div className="flex gap-2 mb-3">
             <button onClick={() => setShowQuickReplies(!showQuickReplies)} className="px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-black uppercase flex items-center gap-2 shadow-sm transition-all hover:bg-emerald-100 border border-emerald-100">
               ⚡ Pesan Cepat
             </button>
             <button onClick={generateSmartReply} disabled={isAiLoading} className="px-3 py-1.5 bg-violet-50 text-violet-600 rounded-xl text-[10px] font-black uppercase flex items-center gap-2 shadow-sm transition-all hover:bg-violet-100 disabled:opacity-50 border border-violet-100">
               <svg className={`w-3 h-3 ${isAiLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
               AI Suggestion
             </button>
             <button 
              onClick={() => setIsPrivateMode(!isPrivateMode)} 
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-[10px] font-black uppercase transition-all shadow-md border ${isPrivateMode ? 'bg-amber-500 text-white border-amber-600' : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'}`}
             >
               Internal Note
             </button>
          </div>
          
          <div className="flex items-center gap-3">
            <input type="file" ref={fileInputRef} className="hidden" />
            <button onClick={() => fileInputRef.current?.click()} className="p-4 rounded-2xl bg-slate-100 text-slate-500 hover:text-emerald-600 transition-all border border-slate-200">
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
            </button>

            <div className={`flex-1 flex items-center px-5 rounded-3xl border-2 transition-all ${isPrivateMode ? 'bg-amber-100/30 border-amber-400' : 'bg-slate-50 border-slate-100 focus-within:border-emerald-500'}`}>
              <input 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(inputText)}
                placeholder={isPrivateMode ? "Type internal note..." : "Type message atau ketik / untuk pesan cepat..."} 
                className="flex-1 bg-transparent py-4 text-sm outline-none font-medium"
              />
            </div>
            <button onClick={() => handleSendMessage(inputText)} className={`p-4 rounded-3xl shadow-xl active:scale-95 transition-all ${isPrivateMode ? 'bg-amber-600 shadow-amber-200' : 'bg-emerald-500 shadow-emerald-200'}`}>
              <svg className="w-6 h-6 text-white rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
            </button>
          </div>
        </div>
      </div>

      {showTransferModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[200] flex items-center justify-center p-4">
           <div className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl overflow-hidden animate-slideUp border-4 border-slate-900">
              <div className="p-8 border-b bg-slate-50 flex justify-between items-center">
                 <h3 className="font-black text-slate-800 uppercase tracking-tight text-xl">Transfer Agent</h3>
                 <button onClick={() => setShowTransferModal(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                 </button>
              </div>
              <div className="p-6 max-h-[400px] overflow-y-auto space-y-3">
                 {INITIAL_SYSTEM_USERS.filter(u => u.id !== currentUser.id).map(agent => (
                    <button 
                       key={agent.id}
                       onClick={() => handleTransfer(agent as User)}
                       className="w-full flex items-center justify-between p-4 rounded-3xl border border-slate-100 hover:border-emerald-500 hover:bg-emerald-50 transition-all"
                    >
                       <div className="flex items-center gap-4">
                          <img src={agent.avatar} className="w-12 h-12 rounded-2xl" alt="" />
                          <div className="text-left">
                             <p className="font-black text-slate-800 uppercase text-sm tracking-tight">{agent.name}</p>
                             <p className="text-[10px] font-bold text-slate-400 uppercase">{agent.role}</p>
                          </div>
                       </div>
                    </button>
                 ))}
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default ChatWindow;
