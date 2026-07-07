import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import type { AppUser } from '@/types';

interface AuthState {
  user: AppUser | null;
  initializing: boolean;
  loading: boolean;
  error: string | null;
  /** Subscribes to Supabase auth state; call once on app boot */
  init: () => void;
  signUp: (email: string, password: string, displayName: string) => Promise<boolean>;
  signIn: (email: string, password: string, rememberMe: boolean) => Promise<boolean>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

const REMEMBER_KEY = 'assignmate-remember-me';

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  initializing: true,
  loading: false,
  error: null,

  init: () => {
    // Restore any existing session on app load
    supabase.auth.getSession().then(({ data }) => {
      const session = data.session;
      set({
        user: session?.user
          ? {
              id: session.user.id,
              email: session.user.email ?? '',
              displayName: session.user.user_metadata?.display_name,
            }
          : null,
        initializing: false,
      });
    });

    // Keep store in sync with auth changes (login/logout in any tab)
    supabase.auth.onAuthStateChange((_event, session) => {
      set({
        user: session?.user
          ? {
              id: session.user.id,
              email: session.user.email ?? '',
              displayName: session.user.user_metadata?.display_name,
            }
          : null,
        initializing: false,
      });
    });
  },

  signUp: async (email, password, displayName) => {
    set({ loading: true, error: null });
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { display_name: displayName } },
    });
    set({ loading: false });
    if (error) {
      set({ error: error.message });
      return false;
    }
    return true;
  },

  signIn: async (email, password, rememberMe) => {
    set({ loading: true, error: null });
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    set({ loading: false });
    if (error) {
      set({ error: error.message });
      return false;
    }
    // "Remember me" toggles whether we proactively restore the session;
    // Supabase persists the session in localStorage either way, this flag
    // is used by the app shell to decide whether to auto-redirect on revisit.
    localStorage.setItem(REMEMBER_KEY, rememberMe ? 'true' : 'false');
    return true;
  },

  signOut: async () => {
    await supabase.auth.signOut();
    localStorage.removeItem(REMEMBER_KEY);
    set({ user: null });
  },

  clearError: () => set({ error: null }),
}));
