import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useProfile } from './useProfile';

interface Coupon {
  id: string;
  title: string;
  description: string | null;
  cost: number;
  discount: string | null;
  image_url: string | null;
  created_at: string;
}

interface UserCoupon {
  id: string;
  user_id: string;
  coupon_id: string;
  code: string;
  is_used: boolean;
  purchased_at: string;
  used_at: string | null;
  coupon?: Coupon;
}

export function useCoupons() {
  const { user } = useAuth();
  const { balance, updateBalance, refetch: refetchProfile } = useProfile();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [userCoupons, setUserCoupons] = useState<UserCoupon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCoupons();
    if (user) {
      fetchUserCoupons();
    }
  }, [user]);

  const fetchCoupons = async () => {
    const { data, error } = await supabase
      .from('coupons')
      .select('*')
      .order('cost', { ascending: true });

    if (!error && data) {
      setCoupons(data);
    }
    setLoading(false);
  };

  const fetchUserCoupons = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('user_coupons')
      .select('*, coupon:coupons(*)')
      .eq('user_id', user.id)
      .order('purchased_at', { ascending: false });

    if (!error && data) {
      setUserCoupons(data as UserCoupon[]);
    }
  };

  const generateCode = () => {
    return crypto.randomUUID().replace(/-/g, '').toUpperCase().slice(0, 12);
  };

  const purchaseCoupon = async (couponId: string) => {
    if (!user) return { error: new Error('Usuário não autenticado') };

    const coupon = coupons.find(c => c.id === couponId);
    if (!coupon) return { error: new Error('Cupom não encontrado') };

    if (balance < coupon.cost) {
      return { error: new Error('Moedas insuficientes') };
    }

    const code = generateCode();

    const { data: userCouponData, error: couponError } = await supabase
      .from('user_coupons')
      .insert({
        user_id: user.id,
        coupon_id: couponId,
        code,
      })
      .select('*, coupon:coupons(*)')
      .single();

    if (couponError) return { error: couponError };

    // Deduct balance
    const newBalance = balance - coupon.cost;
    await updateBalance(newBalance);

    // Record transaction
    await supabase.from('transactions').insert({
      user_id: user.id,
      amount: -coupon.cost,
      type: 'spend',
      description: `Compra: ${coupon.title}`,
    });

    setUserCoupons(prev => [userCouponData as UserCoupon, ...prev]);
    refetchProfile();

    return { data: userCouponData };
  };

  return {
    coupons,
    userCoupons,
    loading,
    purchaseCoupon,
    refetch: () => {
      fetchCoupons();
      fetchUserCoupons();
    },
  };
}
