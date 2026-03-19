import { supabase } from '../lib/supabase';

export const authService = {
  /**
   * Complete signup flow for email & password users.
   * Passes name in metadata to trigger auto profile creation.
   */
  async signUp(email: string, password: string, firstName: string, lastName: string) {
    const formattedEmail = email.trim();
    const { data, error } = await supabase.auth.signUp({
      email: formattedEmail,
      password,
      options: {
        data: {
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          full_name: `${firstName.trim()} ${lastName.trim()}`,
        },
      },
    });
    if (error) throw error;
    return data;
  },

  /**
   * Standard login flow with email and password.
   */
  async signIn(email: string, password: string) {
    const formattedEmail = email.trim();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: formattedEmail,
      password,
    });
    if (error) throw error;
    return data;
  },

  /**
   * Initiate Google OAuth flow.
   * Supabase will handle the redirect, and our backend triggers
   * will handle profile creation if this is their first time logging in!
   */
  async signInWithGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/login-success`,
      },
    });
    if (error) throw error;
  },

  /**
   * Log out the current user, clear any relevant local storage securely.
   */
  async signOut() {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clean up Supabase auth tokens (and any custom persistent tokens)
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith('sb-')) {
          localStorage.removeItem(key);
        }
      });
    }
  },

  /**
   * Retrieve the current session gracefully.
   */
  async getSession() {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) {
      console.warn('Get session warning:', error);
    }
    return session;
  },

  /**
   * Directly get the current user.
   */
  async getUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) {
      console.warn('Get user warning:', error);
    }
    return user;
  },
  
  /**
   * Provide access to the auth state listener
   */
  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback);
  }
};
