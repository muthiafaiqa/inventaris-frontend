import { useAuthContext } from '../context/AuthContext';
import supabase from '../../../lib/supabaseClient';

export function useAuth() {
  const context = useAuthContext();

  // Helper method for email-and-password based sign in using Supabase Auth
  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  };

  return {
    ...context,
    signIn,
  };
}
