import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

let client: SupabaseClient | null = null

// Built on first use rather than at module scope. createClient() throws when the
// env vars are missing, and at module scope that error runs during prerendering
// and fails the whole build instead of just the booking form.
export function getSupabase(): SupabaseClient | null {
  if (!supabaseUrl || !supabaseAnonKey) return null
  if (!client) {
    client = createClient(supabaseUrl, supabaseAnonKey)
  }
  return client
}
