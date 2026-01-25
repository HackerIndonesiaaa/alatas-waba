
import { UserRole, WabaAccount, Contact, QuickReply } from './types';

export const API_BASE_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:3001' 
  : 'https://backend-waba-anda.up.railway.app';

export const COLORS = {
  primary: '#25D366',
  secondary: '#128C7E',
  dark: '#075E54',
  light: '#DCF8C6',
  accent: '#34B7F1'
};

export const LABELS = ['New Lead', 'Hot', 'Invoice Sent', 'Customer', 'VIP', 'Follow Up'];

export const MOCK_QUICK_REPLIES: QuickReply[] = [
  { id: '1', title: 'Sapaan Awal', category: 'opening', content: 'Halo Kak! Terima kasih sudah menghubungi ALATAS. Ada yang bisa kami bantu hari ini? 😊' },
  { id: '2', title: 'Metode Pembayaran', category: 'payment', content: 'Silakan lakukan pembayaran melalui:\nBCA: 1234567890 a/n ALATAS DIGITAL\nMandiri: 0987654321 a/n ALATAS DIGITAL\nKonfirmasi jika sudah ya Kak!' },
  { id: '3', title: 'Pricelist Platinum', category: 'pricing', content: 'Paket Platinum ALATAS:\n- Multi-Device 5 Slot\n- AI Smart Reply Unlimitied\n- CRM Advanced\nHanya Rp 1.500.000/bulan.' },
  { id: '4', title: 'Penutup Ramah', category: 'closing', content: 'Terima kasih kembali Kak! Jika ada pertanyaan lain, jangan sungkan hubungi kami lagi ya. Selamat beraktivitas!' },
];

export const INITIAL_SYSTEM_USERS = [
  { 
    id: 'admin-001', 
    name: 'Happy Firmansyah', 
    email: 'happyfirmansyah88@gmail.com', 
    password: '@Bandung2025', 
    role: UserRole.ADMIN, 
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Happy',
    status: 'online',
    leadsHandled: 45,
    avgResponseTime: '2m 10s',
    isAcceptingLeads: true
  },
  { 
    id: 'agent-001', 
    name: 'Siti Aminah', 
    email: 'agent@waba.pro', 
    password: 'password123', 
    role: UserRole.AGENT, 
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Support',
    status: 'online',
    leadsHandled: 38,
    avgResponseTime: '4m 45s',
    isAcceptingLeads: true
  }
];

export const MOCK_ACCOUNTS: WabaAccount[] = [
  { 
    id: 'acc-1', 
    name: 'CS Utama (Sales)', 
    phoneNumber: '+628123456789', 
    status: 'connected',
    connectionType: 'META',
    credentials: { phoneNumberId: '1029384756', wabaId: '55667788', token: 'EAAG...' }
  },
  { 
    id: 'acc-2', 
    name: 'Support Billing', 
    phoneNumber: '+628987654321', 
    status: 'disconnected',
    connectionType: 'QR'
  }
];

export const MOCK_CONTACTS: Contact[] = [
  { id: '1', accountId: 'acc-1', name: 'Budi Santoso', phone: '+628123456789', lastMessage: 'Halo, saya mau tanya harga paket...', timestamp: '10:45 AM', unreadCount: 2, labels: ['New Lead'], status: 'online', assignedTo: 'admin-001', assignedName: 'Happy' },
  { id: '2', accountId: 'acc-1', name: 'Siti Aminah', phone: '+628987654321', lastMessage: 'Sudah saya bayar ya min', timestamp: 'Yesterday', unreadCount: 0, labels: ['Customer', 'Invoice Sent'], status: 'offline', assignedTo: 'agent-001', assignedName: 'Siti' },
];
