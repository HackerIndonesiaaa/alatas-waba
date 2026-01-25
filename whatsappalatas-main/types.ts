
export enum UserRole {
  ADMIN = 'ADMIN',
  AGENT = 'AGENT',
  SUPERVISOR = 'SUPERVISOR'
}

export interface CallEvent {
  id: string;
  accountId: string;
  from: string;
  fromName: string;
  timestamp: Date;
  status: 'incoming' | 'rejected' | 'missed';
  type: 'voice' | 'video';
}

export interface WabaAccount {
  id: string;
  phoneNumber: string;
  name: string;
  status: 'connected' | 'error' | 'disconnected' | 'configuring';
  connectionType: 'META' | 'QR'; 
  credentials?: {
    token?: string;
    phoneNumberId?: string;
    wabaId?: string;
    appId?: string;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  password?: string;
  status?: 'online' | 'offline';
  leadsHandled?: number;
  avgResponseTime?: string;
  isAcceptingLeads?: boolean;
  assignedAccounts?: string[];
}

export interface Contact {
  id: string;
  accountId: string;
  name: string;
  phone: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  labels: string[];
  status: 'online' | 'offline';
  assignedTo?: string;
  assignedName?: string;
}

export interface Message {
  id: string;
  text: string;
  senderId: string;
  senderName: string;
  timestamp: Date;
  isMe: boolean;
  repliedBy?: string;
  responseTime?: number;
  isPrivate?: boolean;
  attachment?: {
    name: string;
    url: string;
    type: 'image' | 'document' | 'audio' | 'video';
    size?: string;
  };
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface Invoice {
  id: string;
  logo?: string;
  from: string;
  to: string;
  items: InvoiceItem[];
  notes?: string;
  taxPercent: number;
  discountAmount: number;
  status: 'PAID' | 'UNPAID';
  date: string;
  dueDate: string;
}

export interface QuickReply {
  id: string;
  title: string;
  content: string;
  category: string;
}

export interface BroadcastLog {
  id: string;
  name: string;
  target: string;
  sent: number;
  openRate: string;
  status: 'SENT' | 'SCHEDULED';
  date: string;
  scheduledAt?: string;
}
