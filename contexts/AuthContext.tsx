import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserData {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  country?: string;
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, userData?: UserData) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  updateProfile: (userData: Record<string, any>) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  loading: true,
  signUp: async () => ({ error: null }),
  signIn: async () => ({ error: null }),
  signOut: async () => {},
  updateProfile: async () => ({ error: null }),
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const handleAuthStateChange = useCallback(async (event: string, session: Session | null) => {
    setSession(session);
    setUser(session?.user ?? null);

    if (session?.access_token) {
      await AsyncStorage.setItem('userToken', session.access_token);
    } else {
      await AsyncStorage.removeItem('userToken');
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);

          if (session?.access_token) {
            await AsyncStorage.setItem('userToken', session.access_token);
          } else {
            await AsyncStorage.removeItem('userToken');
          }
          setLoading(false);
        }
      } catch (error) {
        console.error('Error getting session:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthStateChange);

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [handleAuthStateChange]);

  // Helper function to convert DD/MM/YYYY to YYYY-MM-DD
  const convertDateFormat = useCallback((dateString: string): string | null => {
    if (!dateString) return null;

    // Check if it's already in YYYY-MM-DD format
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return dateString;
    }

    // Convert DD/MM/YYYY to YYYY-MM-DD
    const match = dateString.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (match) {
      const [, day, month, year] = match;
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }

    return null;
  }, []);

  const signUp = useCallback(async (email: string, password: string, userData?: UserData) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (!error && data.user && userData) {
        // Wait a moment for the trigger to create the profile record
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Convert date format
        const formattedDate = convertDateFormat(userData.dateOfBirth || '');

        // Update the profile with additional user data
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            first_name: userData.firstName,
            last_name: userData.lastName,
            date_of_birth: formattedDate,
            country: userData.country,
          })
          .eq('id', data.user.id);

        if (profileError) {
          console.error('Profile update error:', profileError);
        }
      }

      return { error };
    } catch (err) {
      console.error('SignUp error:', err);
      return { error: err };
    }
  }, [convertDateFormat]);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { error };
    } catch (err) {
      console.error('SignIn error:', err);
      return { error: err };
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      await Promise.all([
        supabase.auth.signOut(),
        AsyncStorage.removeItem('userToken')
      ]);
    } catch (err) {
      console.error('SignOut error:', err);
    }
  }, []);

  const updateProfile = useCallback(async (userData: Record<string, any>) => {
    if (!user?.id) return { error: { message: 'No user logged in' } };

    try {
      const { error } = await supabase
        .from('profiles')
        .update(userData)
        .eq('id', user.id);

      return { error };
    } catch (err) {
      console.error('UpdateProfile error:', err);
      return { error: err };
    }
  }, [user?.id]);

  const value = useMemo(() => ({
    session,
    user,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
  }), [session, user, loading, signUp, signIn, signOut, updateProfile]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};