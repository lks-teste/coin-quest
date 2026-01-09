import { ShoppingBag } from 'lucide-react';
import { SEED_COUPONS } from '@/lib/store';
import { Navigation } from '@/components/Navigation';
import { CouponCard } from '@/components/CouponCard';

export default function ShopPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container py-8">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <ShoppingBag className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold">Coupon Shop</h1>
          </div>
          <p className="text-muted-foreground">
            Spend your hard-earned coins on exclusive discounts!
          </p>
        </div>
        
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 fade-in">
          {SEED_COUPONS.map((coupon) => (
            <CouponCard key={coupon.id} coupon={coupon} variant="shop" />
          ))}
        </div>
      </main>
    </div>
  );
}
