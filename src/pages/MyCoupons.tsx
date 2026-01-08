import { Ticket } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { Navigation } from '@/components/Navigation';
import { CouponCard } from '@/components/CouponCard';
import { toast } from 'sonner';

export default function MyCouponsPage() {
  const { userCoupons, requestRedemption, redemptionRequests } = useAppStore();

  const handleRedeem = (couponId: string) => {
    const userCoupon = userCoupons.find(c => c.id === couponId);
    if (!userCoupon) return;
    
    const existingRequest = redemptionRequests.find(
      r => r.coupon_hash === userCoupon.hash && r.status === 'pending'
    );
    
    if (existingRequest) {
      toast.info('Redemption already requested');
      return;
    }
    
    requestRedemption(userCoupon);
    toast.success('Redemption requested! Awaiting admin approval.', {
      icon: '📋',
    });
  };

  const hasPendingRequest = (hash: string) => {
    return redemptionRequests.some(
      r => r.coupon_hash === hash && r.status === 'pending'
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container py-8">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Ticket className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold">My Coupons</h1>
          </div>
          <p className="text-muted-foreground">
            Your purchased coupons and their redemption status
          </p>
        </div>
        
        {userCoupons.length === 0 ? (
          <div className="text-center py-16">
            <Ticket className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
            <h2 className="text-xl font-semibold mb-2">No coupons yet</h2>
            <p className="text-muted-foreground">
              Visit the shop to purchase coupons with your coins!
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 fade-in">
            {userCoupons.map((userCoupon) => (
              <CouponCard
                key={userCoupon.id}
                coupon={userCoupon.coupon}
                variant="owned"
                hash={userCoupon.hash}
                expiresAt={userCoupon.expires_at}
                isRedeemed={userCoupon.redeemed || hasPendingRequest(userCoupon.hash)}
                onRedeem={() => handleRedeem(userCoupon.id)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
