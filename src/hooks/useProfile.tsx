import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  avatar_url: string | null;
  balance: number;
  created_at: string;
  updated_at: string;
}

export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProfile();
    } else {
      setProfile(null);
      setLoading(false);
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (!error && data) {
      setProfile(data);
    }
    setLoading(false);
  };

  const updateBalance = async (newBalance: number) => {
    if (!user) return;

    const { error } = await supabase
      .from('profiles')
      .update({ balance: newBalance })
      .eq('user_id', user.id);

    if (!error) {
      setProfile(prev => prev ? { ...prev, balance: newBalance } : null);
    }

    return { error };
  };

  return {
    profile,
    loading,
    refetch: fetchProfile,
    updateBalance,
    balance: profile?.balance ?? 0,
  };
}
