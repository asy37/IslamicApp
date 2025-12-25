/**
 * Authentication Hook
 * Manages authentication state and session
 */

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import type { User, Session } from '@supabase/supabase-js';
import { isAnonymousUser, isEmailConfirmed } from '@/lib/api/services/auth';

export interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAnonymous: boolean;
  isEmailConfirmed: boolean;
}

/**
 * Hook: Get current authentication state
 */
export function useAuth(): AuthState {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const isAnonymous = isAnonymousUser(user);
  const isEmailConfirmedValue = isEmailConfirmed(user);

  return {
    user,
    session,
    isLoading,
    isAnonymous,
    isEmailConfirmed: isEmailConfirmedValue,
  };
}

/**
 * Hook: Check if user should see registration screen
 */
export function useAuthFlow() {
  const { user, session, isLoading, isAnonymous, isEmailConfirmed } = useAuth();

  // Determine what screen to show
  const shouldShowRegister = !isLoading && !session;
  const shouldShowConfirmation = !isLoading && session && user && !isAnonymous && !isEmailConfirmed;
  const canAccessApp = !isLoading && session && (isAnonymous || isEmailConfirmed);

  return {
    shouldShowRegister,
    shouldShowConfirmation,
    canAccessApp,
    isLoading,
    user,
    session,
    isAnonymous,
    isEmailConfirmed,
  };
}

