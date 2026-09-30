import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl.startsWith('https://') &&
  supabaseAnonKey.length > 20
);

let client: SupabaseClient | null = null;

if (isSupabaseConfigured) {
  try {
    client = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  } catch (err) {
    console.warn('Error initializing Supabase client:', err);
  }
}

export const supabase = client;

export interface SupabaseConfigStatus {
  isConfigured: boolean;
  url: string;
  hasAnonKey: boolean;
  mode: 'connected' | 'demo_local';
}

export const getSupabaseStatus = (): SupabaseConfigStatus => {
  return {
    isConfigured: isSupabaseConfigured,
    url: supabaseUrl ? supabaseUrl.replace(/(https?:\/\/)(.{4}).+(.{4}\.)/, '$1$2***$3') : 'No configurado',
    hasAnonKey: Boolean(supabaseAnonKey),
    mode: isSupabaseConfigured ? 'connected' : 'demo_local',
  };
};
