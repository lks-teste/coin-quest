import { ShoppingCart, Check, Clock } from 'lucide-react';
import { CoinDisplay } from './CoinDisplay';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useCoupons } from '@/hooks/useCoupons';
import { useProfile } from '@/hooks/useProfile';

interface Coupon {
  id: string;
  title: string;
  description: string | null;
  cost: number;
  discount: string | null;
}

interface CouponCardProps {
  coupon: Coupon;
  variant?: 'shop' | 'owned';
  onRedeem?: () => void;
  isUsed?: boolean;
  code?: string;
  purchasedAt?: string;
}

export function CouponCard({ 
  coupon, 
  variant = 'shop',
  onRedeem,
  isUsed = false,
  code,
  purchasedAt
}: CouponCardProps) {
  const { purchaseCoupon } = useCoupons();
  const { balance } = useProfile();
  const canAfford = balance >= coupon.cost;

  const handlePurchase = async () => {
    if (!canAfford) {
      toast.error('Moedas insuficientes!');
      return;
    }
    
    const { error } = await purchaseCoupon(coupon.id);
    if (error) {
      toast.error('Erro ao comprar cupom');
    } else {
      toast.success(`Cupom comprado! Veja em "Meus Cupons"`, {
        icon: '🎟️',
      });
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <Card className={cn(
      'shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden',
      isUsed && 'opacity-60'
    )}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{coupon.title}</p>
            <h3 className="text-2xl font-bold text-foreground">{coupon.discount}</h3>
          </div>
          {variant === 'shop' && (
            <CoinDisplay amount={coupon.cost} size="md" />
          )}
          {variant === 'owned' && isUsed && (
            <div className="flex items-center gap-1 text-sm text-success bg-success/10 px-2 py-1 rounded-full">
              <Check className="h-4 w-4" />
              Usado
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="text-sm text-muted-foreground">{coupon.description}</p>
        
        {variant === 'owned' && code && (
          <div className="mt-4 p-3 bg-muted rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Código do Cupom</p>
            <p className="font-mono text-sm font-bold tracking-wider">{code}</p>
          </div>
        )}
        
        {variant === 'owned' && purchasedAt && (
          <div className="flex items-center gap-1.5 mt-3 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Comprado em {formatDate(purchasedAt)}</span>
          </div>
        )}
      </CardContent>
      
      <CardFooter>
        {variant === 'shop' ? (
          <Button 
            onClick={handlePurchase}
            disabled={!canAfford}
            className={cn(
              'w-full',
              canAfford 
                ? 'gradient-gold text-primary-foreground hover:opacity-90' 
                : 'bg-muted text-muted-foreground'
            )}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {canAfford ? 'Comprar' : 'Moedas insuficientes'}
          </Button>
        ) : (
          <Button
            onClick={onRedeem}
            disabled={isUsed}
            variant={isUsed ? 'outline' : 'default'}
            className={cn(
              'w-full',
              !isUsed && 'gradient-success text-success-foreground hover:opacity-90'
            )}
          >
            {isUsed ? 'Já Utilizado' : 'Mostrar para usar'}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
