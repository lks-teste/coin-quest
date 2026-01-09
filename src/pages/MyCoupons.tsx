import { Ticket } from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import { CouponCard } from '@/components/CouponCard';
import { useCoupons } from '@/hooks/useCoupons';

export default function MyCouponsPage() {
  const { userCoupons, loading } = useCoupons();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container py-8">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Ticket className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold">Meus Cupons</h1>
          </div>
          <p className="text-muted-foreground">
            Seus cupons comprados e o código para usar na loja
          </p>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : userCoupons.length === 0 ? (
          <div className="text-center py-16">
            <Ticket className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Nenhum cupom ainda</h2>
            <p className="text-muted-foreground">
              Visite a loja para comprar cupons com suas moedas!
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 fade-in">
            {userCoupons.map((userCoupon) => (
              <CouponCard
                key={userCoupon.id}
                coupon={userCoupon.coupon!}
                variant="owned"
                code={userCoupon.code}
                purchasedAt={userCoupon.purchased_at}
                isUsed={userCoupon.is_used}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
