import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Memuat env file berdasarkan mode (development/production)
  // '' sebagai argumen ketiga berarti memuat semua variabel tanpa peduli prefix, 
  // tapi kita akan fokus memetakan yang kamu butuhkan.
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    define: {
      // Polyfill untuk process.env agar library seperti Google GenAI tidak error
      'process.env': env,
      // Memastikan variabel dengan prefix NEXT_PUBLIC tetap bisa dibaca
      'process.env.NEXT_PUBLIC_SUPABASE_URL': JSON.stringify(env.NEXT_PUBLIC_SUPABASE_URL),
      'process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY': JSON.stringify(env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
      'process.env.NEXT_PUBLIC_API_BASE_URL': JSON.stringify(env.NEXT_PUBLIC_API_BASE_URL),
      'process.env.API_KEY': JSON.stringify(env.API_KEY),
    },
    build: {
      // Memastikan sourcemap aktif untuk memudahkan debugging di Vercel jika terjadi error
      sourcemap: true,
    }
  };
});
