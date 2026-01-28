import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    define: {
      // Polyfill agar process.env tidak undefined
      'process.env': env,
      // Mapping fleksibel: Mencari VITE_ dulu, kalau tidak ada baru cari NEXT_PUBLIC_
      'process.env.NEXT_PUBLIC_SUPABASE_URL': JSON.stringify(env.VITE_SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL),
      'process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY': JSON.stringify(env.VITE_SUPABASE_ANON_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
      'process.env.API_KEY': JSON.stringify(env.API_KEY || env.VITE_API_KEY),
      'process.env.NEXT_PUBLIC_API_BASE_URL': JSON.stringify(env.VITE_API_BASE_URL || env.NEXT_PUBLIC_API_BASE_URL),
    },
    build: {
      sourcemap: true,
    }
  };
});
