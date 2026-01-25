
import React, { useState, useEffect } from 'react';
import { Invoice, InvoiceItem } from '../types';

const Finance: React.FC = () => {
  const [view, setView] = useState<'list' | 'editor'>('list');
  const [invoices, setInvoices] = useState<Invoice[]>([
    { 
      id: 'INV-2025-001', 
      from: 'ALATAS WHATSAPP SOLUTIONS\nJl. Teknologi No. 88, Bandung', 
      to: 'Budi Santoso\nCV Maju Jaya', 
      date: '2025-01-20', 
      dueDate: '2025-01-27',
      items: [
        { id: '1', description: 'Paket Platinum 1 Bulan', quantity: 1, rate: 1500000, amount: 1500000 }
      ],
      taxPercent: 11,
      discountAmount: 0,
      status: 'PAID'
    }
  ]);

  const [currentInvoice, setCurrentInvoice] = useState<Invoice>({
    id: `INV-${new Date().getFullYear()}-00${invoices.length + 1}`,
    from: 'ALATAS WHATSAPP SOLUTIONS\nBandung, Indonesia',
    to: '',
    date: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    items: [{ id: '1', description: '', quantity: 1, rate: 0, amount: 0 }],
    taxPercent: 0,
    discountAmount: 0,
    status: 'UNPAID',
    logo: ''
  });

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setCurrentInvoice({ ...currentInvoice, logo: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  const addItem = () => {
    const newItem = { id: Date.now().toString(), description: '', quantity: 1, rate: 0, amount: 0 };
    setCurrentInvoice({ ...currentInvoice, items: [...currentInvoice.items, newItem] });
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: any) => {
    const updatedItems = currentInvoice.items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        if (field === 'quantity' || field === 'rate') {
          updatedItem.amount = updatedItem.quantity * updatedItem.rate;
        }
        return updatedItem;
      }
      return item;
    });
    setCurrentInvoice({ ...currentInvoice, items: updatedItems });
  };

  const removeItem = (id: string) => {
    setCurrentInvoice({ ...currentInvoice, items: currentInvoice.items.filter(i => i.id !== id) });
  };

  const subtotal = currentInvoice.items.reduce((sum, item) => sum + item.amount, 0);
  const taxAmount = (subtotal * currentInvoice.taxPercent) / 100;
  const total = subtotal + taxAmount - currentInvoice.discountAmount;

  const saveInvoice = () => {
    setInvoices([currentInvoice, ...invoices]);
    setView('list');
  };

  const printInvoice = () => {
    window.print();
  };

  if (view === 'editor') {
    return (
      <div className="max-w-5xl mx-auto pb-20 animate-fadeIn">
        <div className="flex justify-between items-center mb-8 no-print">
          <button onClick={() => setView('list')} className="text-slate-500 font-black uppercase text-[10px] tracking-widest flex items-center gap-2 hover:text-slate-800 transition-all">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
            Back to List
          </button>
          <div className="flex gap-3">
             <button onClick={printInvoice} className="bg-slate-900 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-slate-800 transition-all flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
                Generate PDF
             </button>
             <button onClick={saveInvoice} className="bg-emerald-500 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-emerald-600 transition-all">
                Save & Send WA
             </button>
          </div>
        </div>

        <div id="invoice-paper" className="bg-white p-12 rounded-[2rem] border shadow-2xl min-h-[1000px] text-slate-800">
           <div className="flex justify-between items-start mb-16">
              <div className="space-y-6">
                 <div className="relative group w-48 h-24 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center overflow-hidden bg-slate-50 cursor-pointer no-print">
                    {currentInvoice.logo ? (
                      <img src={currentInvoice.logo} className="max-w-full max-h-full object-contain" alt="Logo" />
                    ) : (
                      <div className="text-center">
                        <svg className="w-8 h-8 text-slate-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                        <span className="text-[9px] font-black text-slate-400 uppercase mt-2 block">Upload Logo</span>
                      </div>
                    )}
                    <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleLogoUpload} />
                 </div>
                 {/* Logo for Print Only */}
                 {currentInvoice.logo && <img src={currentInvoice.logo} className="hidden print:block w-48 h-24 object-contain mb-8" alt="Logo" />}
                 
                 <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 no-print">Who is this from?</label>
                    <textarea 
                      value={currentInvoice.from} 
                      onChange={(e) => setCurrentInvoice({...currentInvoice, from: e.target.value})}
                      className="w-full bg-transparent font-bold text-lg outline-none resize-none" 
                      rows={2} 
                    />
                 </div>
              </div>
              <div className="text-right">
                 <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase mb-4">INVOICE</h1>
                 <div className="flex flex-col gap-2 items-end">
                    <div className="flex items-center gap-2">
                       <span className="text-[10px] font-black text-slate-400 uppercase">#</span>
                       <input 
                         type="text" 
                         value={currentInvoice.id} 
                         onChange={(e) => setCurrentInvoice({...currentInvoice, id: e.target.value})}
                         className="text-right font-black text-lg outline-none bg-slate-50 px-2 rounded no-print" 
                       />
                       <span className="hidden print:block font-black text-lg">{currentInvoice.id}</span>
                    </div>
                 </div>
              </div>
           </div>

           <div className="grid grid-cols-2 gap-16 mb-16">
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-emerald-500 uppercase tracking-widest ml-1">Bill To:</label>
                 <textarea 
                   placeholder="Customer Name & Address"
                   value={currentInvoice.to} 
                   onChange={(e) => setCurrentInvoice({...currentInvoice, to: e.target.value})}
                   className="w-full bg-slate-50 border-0 p-4 rounded-2xl font-bold text-sm outline-none focus:ring-2 focus:ring-emerald-500 min-h-[100px] resize-none no-print" 
                 />
                 <div className="hidden print:block whitespace-pre-line font-bold text-sm bg-slate-50 p-4 rounded-2xl min-h-[100px]">
                    {currentInvoice.to || 'No customer info provided'}
                 </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</label>
                    <input type="date" value={currentInvoice.date} onChange={(e) => setCurrentInvoice({...currentInvoice, date: e.target.value})} className="w-full bg-slate-50 p-3 rounded-xl text-xs font-bold no-print" />
                    <span className="hidden print:block font-bold text-sm">{currentInvoice.date}</span>
                 </div>
                 <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Due Date</label>
                    <input type="date" value={currentInvoice.dueDate} onChange={(e) => setCurrentInvoice({...currentInvoice, dueDate: e.target.value})} className="w-full bg-slate-50 p-3 rounded-xl text-xs font-bold no-print" />
                    <span className="hidden print:block font-bold text-sm">{currentInvoice.dueDate}</span>
                 </div>
              </div>
           </div>

           <table className="w-full mb-12">
              <thead className="bg-slate-900 text-white">
                 <tr>
                    <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest rounded-tl-2xl">Description</th>
                    <th className="px-6 py-4 text-center text-[10px] font-black uppercase tracking-widest">Quantity</th>
                    <th className="px-6 py-4 text-center text-[10px] font-black uppercase tracking-widest">Rate (IDR)</th>
                    <th className="px-6 py-4 text-right text-[10px] font-black uppercase tracking-widest rounded-tr-2xl">Amount</th>
                 </tr>
              </thead>
              <tbody className="divide-y border-x border-b">
                 {currentInvoice.items.map((item) => (
                    <tr key={item.id} className="group relative">
                       <td className="px-6 py-4">
                          <input 
                            type="text" 
                            placeholder="Description of service/product"
                            value={item.description} 
                            onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                            className="w-full bg-transparent font-bold text-sm outline-none no-print" 
                          />
                          <span className="hidden print:block font-bold text-sm">{item.description}</span>
                          {currentInvoice.items.length > 1 && (
                            <button onClick={() => removeItem(item.id)} className="absolute -left-10 top-1/2 -translate-y-1/2 p-2 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity no-print">
                               <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" /></svg>
                            </button>
                          )}
                       </td>
                       <td className="px-6 py-4 text-center">
                          <input 
                            type="number" 
                            value={item.quantity} 
                            onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                            className="w-20 bg-slate-50 px-3 py-1 rounded text-center font-bold text-sm no-print" 
                          />
                          <span className="hidden print:block font-bold text-sm">{item.quantity}</span>
                       </td>
                       <td className="px-6 py-4 text-center">
                          <input 
                            type="number" 
                            value={item.rate} 
                            onChange={(e) => updateItem(item.id, 'rate', parseInt(e.target.value) || 0)}
                            className="w-32 bg-slate-50 px-3 py-1 rounded text-center font-bold text-sm no-print" 
                          />
                          <span className="hidden print:block font-bold text-sm">{item.rate.toLocaleString()}</span>
                       </td>
                       <td className="px-6 py-4 text-right font-black text-sm">
                          {item.amount.toLocaleString()}
                       </td>
                    </tr>
                 ))}
              </tbody>
           </table>

           <div className="flex justify-between items-start no-print">
              <button onClick={addItem} className="flex items-center gap-2 text-emerald-500 font-black text-[10px] uppercase tracking-widest hover:text-emerald-600 transition-all no-print">
                 <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" /></svg>
                 Add Line Item
              </button>
           </div>

           <div className="flex justify-end mt-12">
              <div className="w-full max-w-xs space-y-4">
                 <div className="flex justify-between items-center px-4">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Subtotal</span>
                    <span className="font-bold">Rp {subtotal.toLocaleString()}</span>
                 </div>
                 <div className="flex justify-between items-center px-4">
                    <div className="flex items-center gap-2 no-print">
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tax (%)</span>
                       <input 
                         type="number" 
                         value={currentInvoice.taxPercent} 
                         onChange={(e) => setCurrentInvoice({...currentInvoice, taxPercent: parseInt(e.target.value) || 0})}
                         className="w-12 bg-slate-50 px-2 py-1 rounded text-center font-bold text-[10px] outline-none" 
                       />
                    </div>
                    <span className="hidden print:block text-[10px] font-black text-slate-400 uppercase tracking-widest">Tax ({currentInvoice.taxPercent}%)</span>
                    <span className="font-bold">Rp {taxAmount.toLocaleString()}</span>
                 </div>
                 <div className="flex justify-between items-center px-4 no-print">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Discount (IDR)</span>
                    <input 
                       type="number" 
                       value={currentInvoice.discountAmount} 
                       onChange={(e) => setCurrentInvoice({...currentInvoice, discountAmount: parseInt(e.target.value) || 0})}
                       className="w-24 bg-slate-50 px-2 py-1 rounded text-right font-bold text-[10px] outline-none" 
                    />
                 </div>
                 <div className="pt-4 border-t-2 border-slate-900 flex justify-between items-center px-4 bg-slate-900 text-white rounded-2xl py-6 shadow-xl">
                    <span className="text-sm font-black uppercase tracking-widest">Balance Due</span>
                    <span className="text-xl font-black">Rp {total.toLocaleString()}</span>
                 </div>
              </div>
           </div>

           <div className="mt-24 pt-12 border-t space-y-4">
              <div className="space-y-1">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest no-print">Notes / Terms</label>
                 <textarea 
                   placeholder="Transfer to BCA 1234567 a/n Alatas"
                   value={currentInvoice.notes} 
                   onChange={(e) => setCurrentInvoice({...currentInvoice, notes: e.target.value})}
                   className="w-full bg-transparent font-medium text-xs outline-none resize-none no-print" 
                   rows={3} 
                 />
                 <div className="hidden print:block whitespace-pre-line text-xs italic opacity-70">
                    {currentInvoice.notes || 'No notes provided.'}
                 </div>
              </div>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn no-print">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Billing Center</h2>
          <p className="text-sm text-slate-500">Manage and generate professional invoices for WhatsApp.</p>
        </div>
        <button onClick={() => setView('editor')} className="bg-emerald-500 text-white px-8 py-3 rounded-2xl font-black shadow-xl shadow-emerald-100 hover:bg-emerald-600 transition-all uppercase tracking-widest text-xs">
          + New Invoice
        </button>
      </div>

      <div className="bg-white rounded-[2rem] border shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">ID</th>
              <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Customer</th>
              <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Amount</th>
              <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
              <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Due Date</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {invoices.map((inv) => (
              <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-8 py-6 font-mono text-xs font-black text-slate-400">{inv.id}</td>
                <td className="px-8 py-6">
                   <p className="font-black text-slate-800 text-sm truncate max-w-[200px] whitespace-pre-line leading-tight">{inv.to.split('\n')[0]}</p>
                </td>
                <td className="px-8 py-6 font-black text-slate-600">Rp {inv.items.reduce((a,b)=>a+b.amount,0).toLocaleString()}</td>
                <td className="px-8 py-6">
                  <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${inv.status === 'PAID' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                    {inv.status}
                  </span>
                </td>
                <td className="px-8 py-6 text-right text-xs font-black text-slate-400">{inv.dueDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style>{`
        @media print {
          body * { visibility: hidden; }
          #invoice-paper, #invoice-paper * { visibility: visible; }
          #invoice-paper { 
            position: absolute; 
            left: 0; 
            top: 0; 
            width: 100%; 
            border: none !important;
            box-shadow: none !important;
          }
          .no-print { display: none !important; }
        }
      `}</style>
    </div>
  );
};

export default Finance;
