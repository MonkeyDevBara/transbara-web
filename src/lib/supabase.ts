import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const url = import.meta.env.PUBLIC_SUPABASE_URL;
const key = import.meta.env.PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!url || !key) {
  throw new Error(
    'PUBLIC_SUPABASE_URL dan PUBLIC_SUPABASE_PUBLISHABLE_KEY belum diatur. Isi di file .env (lihat .env.example) lalu build ulang.',
  );
}

// Klien publik (anon): hanya membaca konten publik dan mengirim formulir; semuanya dibatasi RLS.
export const supabase = createClient<Database>(url, key, {
  auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  // Produksi: biarkan retry bawaan (1s, 2s, 4s) untuk gangguan jaringan sesaat.
  // Dev: matikan, supaya tanpa Supabase lokal halaman tidak menunggu ~7 detik per query.
  db: { retry: !import.meta.env.DEV },
});
