import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import type { User, Session, AuthError } from "@supabase/supabase-js";
import {
  getSupabaseClient,
  getSupabaseCredentials,
  saveCustomSupabaseCredentials,
  clearCustomSupabaseCredentials,
} from "../lib/supabase";

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isConfigured: boolean;
  credentialSource: "env" | "local" | "default" | "none";
  signUp: (email: string, password: string) => Promise<{ error: AuthError | Error | null; user: User | null }>;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | Error | null; session: Session | null }>;
  signOut: () => Promise<{ error: AuthError | Error | null }>;
  resetPassword: (email: string) => Promise<{ error: AuthError | Error | null }>;
  setCustomCredentials: (url: string, anonKey: string) => void;
  removeCustomCredentials: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [configState, setConfigState] = useState(getSupabaseCredentials);

  const initAuth = useCallback(async () => {
    setLoading(true);
    const creds = getSupabaseCredentials();
    setConfigState(creds);

    const client = getSupabaseClient();
    if (!client) {
      setUser(null);
      setSession(null);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await client.auth.getSession();
      if (error) {
        console.warn("Session retrieval error:", error.message);
        setUser(null);
        setSession(null);
      } else {
        setSession(data.session);
        setUser(data.session?.user ?? null);
      }
    } catch (err) {
      console.error("Auth init exception:", err);
      setUser(null);
      setSession(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    initAuth();

    const client = getSupabaseClient();
    if (!client) return;

    const { data: authListener } = client.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      setLoading(false);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [initAuth]);

  const signUp = async (email: string, password: string) => {
    const client = getSupabaseClient();
    if (!client) {
      return { error: new Error("Supabase is not configured. Please add your project credentials."), user: null };
    }
    try {
      const { data, error } = await client.auth.signUp({
        email: email.trim(),
        password,
      });
      return { error, user: data.user };
    } catch (err) {
      return { error: err as Error, user: null };
    }
  };

  const signIn = async (email: string, password: string) => {
    const client = getSupabaseClient();
    if (!client) {
      return { error: new Error("Supabase is not configured. Please add your project credentials."), session: null };
    }
    try {
      const { data, error } = await client.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      return { error, session: data.session };
    } catch (err) {
      return { error: err as Error, session: null };
    }
  };

  const signOut = async () => {
    const client = getSupabaseClient();
    if (!client) {
      setUser(null);
      setSession(null);
      return { error: null };
    }
    try {
      const { error } = await client.auth.signOut();
      setUser(null);
      setSession(null);
      return { error };
    } catch (err) {
      setUser(null);
      setSession(null);
      return { error: err as Error };
    }
  };

  const resetPassword = async (email: string) => {
    const client = getSupabaseClient();
    if (!client) {
      return { error: new Error("Supabase is not configured. Please add your project credentials.") };
    }
    try {
      const { error } = await client.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/`,
      });
      return { error };
    } catch (err) {
      return { error: err as Error };
    }
  };

  const setCustomCredentials = (url: string, anonKey: string) => {
    saveCustomSupabaseCredentials(url, anonKey);
    initAuth();
  };

  const removeCustomCredentials = () => {
    clearCustomSupabaseCredentials();
    initAuth();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        isConfigured: configState.isConfigured,
        credentialSource: configState.source,
        signUp,
        signIn,
        signOut,
        resetPassword,
        setCustomCredentials,
        removeCustomCredentials,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
