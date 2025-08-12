import { createClient } from "@supabase/supabase-js"

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Check if Supabase environment variables are available
export const isSupabaseConfigured =
  typeof supabaseUrl === "string" &&
  supabaseUrl.length > 0 &&
  typeof supabaseAnonKey === "string" &&
  supabaseAnonKey.length > 0

// Create a singleton instance of the Supabase client
export const supabase = isSupabaseConfigured ? createClient(supabaseUrl, supabaseAnonKey) : null

// Helper function to get Supabase client with error handling
export const getSupabaseClient = () => {
  if (!supabase) {
    console.warn("Supabase is not configured. Some features may not work.")
    return null
  }
  return supabase
}
