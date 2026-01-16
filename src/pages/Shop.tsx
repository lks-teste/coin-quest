import { ShoppingBag } from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import { CouponCard } from '@/components/CouponCard';
import { useCoupons } from '@/hooks/useCoupons';

export default function ShopPage() {
  const { coupons, loading } = useCoupons();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container py-8">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <ShoppingBag className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold">Loja de Cupons</h1>
          </div>
          <p className="text-muted-foreground">
            Gaste suas moedas em descontos exclusivos!
          </p>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : coupons.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Nenhum cupom disponível</h2>
            <p className="text-muted-foreground">
              Aguarde o administrador adicionar novos cupons.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 fade-in">
            {coupons.map((coupon) => (
              <CouponCard key={coupon.id} coupon={coupon} variant="shop" />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
