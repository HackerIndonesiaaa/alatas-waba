
import { createClient } from '@supabase/supabase-js';

// Ganti dengan URL dan Anon Key dari Dashboard Supabase Anda
const supabaseUrl = 'https://your-project-id.supabase.co';
const supabaseAnonKey = 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const saveMessageToDb = async (message: any) => {
  const { data, error } = await supabase
    .from('messages')
    .insert([
      {
        id: message.id,
        account_id: message.accountId,
        sender_name: message.senderName,
        text_body: message.text,
        is_me: message.isMe,
        created_at: message.timestamp
      }
    ]);
  if (error) console.error('Error saving message:', error);
  return data;
};
