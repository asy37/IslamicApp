/**
 * Authentication Hook
 * Manages authentication state and session
 *
 * getSession() çağrısına 5sn timeout eklendi.
 * Ağ yavaş veya offline olduğunda splash screen'de takılmayı önler.
 */

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import type { User, Session } from '@supabase/supabase-js';
import { isAnonymousUser, isEmailConfirmed } from '@/lib/api/services/auth';
import { debugLog } from '@/lib/utils/debugLog';

/**
 * Auth timeout süresi (ms). Ağ yavaş/offline olduğunda splash'ı bloklamayı önler.
 * getSession() süresi dolmuş bir access token'ı network üzerinden refresh
 * edebildiği için (özellikle uygulama uzun süre kapalı kaldıktan sonra),
 * gerçekçi bir round-trip süresine izin verecek kadar yüksek tutulmalı.
 * Düşük tutulursa yavaş network = "session yok" (yanlış logout) sonucu doğar.
 */
const AUTH_TIMEOUT_MS = 12000;

export interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAnonymous: boolean;
  isEmailConfirmed: boolean;
}

/**
 * getSession() çağrısını timeout ile sarmalayan yardımcı fonksiyon.
 * Timeout durumunda null session döner, uygulama yine de açılır.
 */
function getSessionWithTimeout(
  timeoutMs: number = AUTH_TIMEOUT_MS
): Promise<{ session: Session | null }> {
  return new Promise((resolve) => {
    const timer = setTimeout(() => {
      debugLog('useAuth.ts', 'getSession TIMEOUT', { timeoutMs });
      resolve({ session: null });
    }, timeoutMs);

    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        clearTimeout(timer);
        resolve({ session });
      })
      .catch((err) => {
        clearTimeout(timer);
        debugLog('useAuth.ts', 'getSession error', { error: String(err) });
        resolve({ session: null });
      });
  });
}

/**
 * Hook: Get current authentication state
 */
export function useAuth(): AuthState {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    debugLog('useAuth.ts', 'before getSession', {});

    getSessionWithTimeout().then(({ session }) => {
      debugLog('useAuth.ts', 'getSession resolved', { hasSession: !!session });
      if (!mounted) return;
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      
      // For SIGNED_IN, SIGNED_UP and TOKEN_REFRESHED events, ensure we have the latest session
      if (['SIGNED_IN', 'SIGNED_UP', 'TOKEN_REFRESHED'].includes(event)) {
        // Timeout ile sarmalıyoruz — bu event handler'da da asılı kalabilir
        const { session: latestSession } = await getSessionWithTimeout(3000);
        if (!mounted) return;
        setSession(latestSession ?? session);
        setUser((latestSession ?? session)?.user ?? null);
      } else {
        setSession(session);
        setUser(session?.user ?? null);
      }
      
      setIsLoading(false);
    });

    return () => {
      mounted = false;
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
 * Email confirmation is no longer required - users can access app immediately after registration
 */
export function useAuthFlow() {
  const { user, session, isLoading, isAnonymous, isEmailConfirmed } = useAuth();

  // Determine what screen to show
  const shouldShowRegister = !isLoading && !user && !session;
  // Email confirmation is optional - users can access app without confirming email
  // Allow access if user exists (even if session is null due to email confirmation)
  const canAccessApp = !isLoading && (!!session || !!user);

  return {
    shouldShowRegister,
    shouldShowConfirmation: false, // Deprecated - no longer blocking
    canAccessApp,
    isLoading,
    user,
    session,
    isAnonymous,
    isEmailConfirmed,
  };
}

