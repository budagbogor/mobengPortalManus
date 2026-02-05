/**
 * Authentication Service
 * Handles user authentication, session management, and RBAC
 */

import { supabase } from './supabaseClient';

export interface User {
  id: string;
  email: string;
  role: 'recruiter' | 'admin';
  createdAt: string;
}

export interface AuthSession {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

/**
 * Sign up a new recruiter
 */
export const signUp = async (email: string, password: string, role: 'recruiter' | 'admin' = 'recruiter') => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role: role
        }
      }
    });

    if (error) throw error;

    return { success: true, user: data.user };
  } catch (error) {
    console.error('Sign up error:', error);
    throw new Error('Gagal mendaftar. Silakan coba lagi.');
  }
};

/**
 * Sign in with email and password
 */
export const signIn = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;

    // Get user role from metadata
    const role = (data.user?.user_metadata?.role || 'recruiter') as 'recruiter' | 'admin';

    return {
      success: true,
      user: {
        id: data.user!.id,
        email: data.user!.email!,
        role: role,
        createdAt: data.user!.created_at!
      }
    };
  } catch (error) {
    console.error('Sign in error:', error);
    throw new Error('Email atau password salah.');
  }
};

/**
 * Sign out current user
 */
export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Sign out error:', error);
    throw new Error('Gagal logout.');
  }
};

/**
 * Get current session
 */
export const getSession = async (): Promise<AuthSession> => {
  try {
    const { data, error } = await supabase.auth.getSession();

    if (error) throw error;

    if (!data.session) {
      return {
        user: null,
        isAuthenticated: false,
        isLoading: false
      };
    }

    const role = (data.session.user.user_metadata?.role || 'recruiter') as 'recruiter' | 'admin';

    return {
      user: {
        id: data.session.user.id,
        email: data.session.user.email!,
        role: role,
        createdAt: data.session.user.created_at!
      },
      isAuthenticated: true,
      isLoading: false
    };
  } catch (error) {
    console.error('Get session error:', error);
    return {
      user: null,
      isAuthenticated: false,
      isLoading: false
    };
  }
};

/**
 * Get current user
 */
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const { data, error } = await supabase.auth.getUser();

    if (error || !data.user) {
      return null;
    }

    const role = (data.user.user_metadata?.role || 'recruiter') as 'recruiter' | 'admin';

    return {
      id: data.user.id,
      email: data.user.email!,
      role: role,
      createdAt: data.user.created_at!
    };
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
};

/**
 * Reset password
 */
export const resetPassword = async (email: string) => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    });

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error('Reset password error:', error);
    throw new Error('Gagal mengirim email reset password.');
  }
};

/**
 * Update password
 */
export const updatePassword = async (newPassword: string) => {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error('Update password error:', error);
    throw new Error('Gagal memperbarui password.');
  }
};

/**
 * Check if user has permission
 */
export const hasPermission = (userRole: 'recruiter' | 'admin', requiredRole: 'recruiter' | 'admin'): boolean => {
  // Admin has all permissions
  if (userRole === 'admin') return true;
  
  // Recruiter can only access recruiter features
  if (requiredRole === 'recruiter') return true;
  
  return false;
};

/**
 * Subscribe to auth state changes
 */
export const onAuthStateChange = (callback: (session: AuthSession) => void) => {
  const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
    if (session) {
      const role = (session.user.user_metadata?.role || 'recruiter') as 'recruiter' | 'admin';
      callback({
        user: {
          id: session.user.id,
          email: session.user.email!,
          role: role,
          createdAt: session.user.created_at!
        },
        isAuthenticated: true,
        isLoading: false
      });
    } else {
      callback({
        user: null,
        isAuthenticated: false,
        isLoading: false
      });
    }
  });

  // Return unsubscribe function
  return () => {
    data?.subscription?.unsubscribe();
  };
};
