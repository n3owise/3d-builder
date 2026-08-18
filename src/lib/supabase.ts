import { createClient, SupabaseClient } from "@supabase/supabase-js";

const DEFAULT_URL = "https://bbyiguyyxuvlwfckjhdn.supabase.co";
const DEFAULT_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJieWlndXl5eHV2bHdmY2tqaGRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcwMzUxNTUsImV4cCI6MjEwMjYxMTE1NX0.YGZPlVIm4vROTv5SYZ06-x7JBwunLoVCnpBjnyujQRk";

export function getSupabaseCredentials(): { url: string; anonKey: string; isConfigured: boolean; source: "env" | "default" | "none" } {
  const envUrl = import.meta.env.VITE_SUPABASE_URL?.trim() || "";
  const envKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY)?.trim() || "";

  if (envUrl && envKey) {
    return { url: envUrl, anonKey: envKey, isConfigured: true, source: "env" };
  }

  if (DEFAULT_URL && DEFAULT_ANON_KEY) {
    return { url: DEFAULT_URL, anonKey: DEFAULT_ANON_KEY, isConfigured: true, source: "default" };
  }

  return { url: "", anonKey: "", isConfigured: false, source: "none" };
}

let supabaseInstance: SupabaseClient | null = null;
let currentCredentialsSignature = "";

export function getSupabaseClient(): SupabaseClient | null {
  const creds = getSupabaseCredentials();
  const signature = `${creds.url}:::${creds.anonKey}`;

  if (!creds.isConfigured) {
    supabaseInstance = null;
    currentCredentialsSignature = "";
    return null;
  }

  if (supabaseInstance && currentCredentialsSignature === signature) {
    return supabaseInstance;
  }

  try {
    supabaseInstance = createClient(creds.url, creds.anonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    });
    currentCredentialsSignature = signature;
    return supabaseInstance;
  } catch (err) {
    console.error("Failed to initialize Supabase client:", err);
    supabaseInstance = null;
    return null;
  }
}
