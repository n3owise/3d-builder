import { createClient, SupabaseClient } from "@supabase/supabase-js";

const LOCAL_STORAGE_URL_KEY = "3d_builder_supabase_url";
const LOCAL_STORAGE_KEY_KEY = "3d_builder_supabase_anon_key";

const DEFAULT_URL = "https://bbyiguyyxuvlwfckjhdn.supabase.co";
const DEFAULT_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJieWlndXl5eHV2bHdmY2tqaGRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcwMzUxNTUsImV4cCI6MjEwMjYxMTE1NX0.YGZPlVIm4vROTv5SYZ06-x7JBwunLoVCnpBjnyujQRk";

export function getSupabaseCredentials(): { url: string; anonKey: string; isConfigured: boolean; source: "env" | "local" | "default" | "none" } {
  const envUrl = import.meta.env.VITE_SUPABASE_URL?.trim() || "";
  const envKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY)?.trim() || "";

  if (envUrl && envKey) {
    return { url: envUrl, anonKey: envKey, isConfigured: true, source: "env" };
  }

  const localUrl = localStorage.getItem(LOCAL_STORAGE_URL_KEY)?.trim() || "";
  const localKey = localStorage.getItem(LOCAL_STORAGE_KEY_KEY)?.trim() || "";

  if (localUrl && localKey) {
    return { url: localUrl, anonKey: localKey, isConfigured: true, source: "local" };
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

export function saveCustomSupabaseCredentials(url: string, anonKey: string) {
  const cleanUrl = url.trim();
  const cleanKey = anonKey.trim();
  if (cleanUrl && cleanKey) {
    localStorage.setItem(LOCAL_STORAGE_URL_KEY, cleanUrl);
    localStorage.setItem(LOCAL_STORAGE_KEY_KEY, cleanKey);
  } else {
    localStorage.removeItem(LOCAL_STORAGE_URL_KEY);
    localStorage.removeItem(LOCAL_STORAGE_KEY_KEY);
  }
  supabaseInstance = null;
  currentCredentialsSignature = "";
}

export function clearCustomSupabaseCredentials() {
  localStorage.removeItem(LOCAL_STORAGE_URL_KEY);
  localStorage.removeItem(LOCAL_STORAGE_KEY_KEY);
  supabaseInstance = null;
  currentCredentialsSignature = "";
}
