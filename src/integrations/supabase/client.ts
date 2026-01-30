import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

// These will be set when Supabase is connected
// For now, use placeholder values that will be replaced
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Debug: log config status (remove after debugging)
console.log('[Supabase Config]', {
  hasUrl: Boolean(SUPABASE_URL),
  hasKey: Boolean(SUPABASE_ANON_KEY),
  urlPrefix: SUPABASE_URL ? SUPABASE_URL.substring(0, 30) + '...' : 'empty',
});

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn('Supabase credentials not configured. Please connect Supabase or set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.');
}

export const supabase = createClient<Database>(
  SUPABASE_URL || 'https://placeholder.supabase.co',
  SUPABASE_ANON_KEY || 'placeholder-key',
  {
    auth: {
      storage: localStorage,
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);
