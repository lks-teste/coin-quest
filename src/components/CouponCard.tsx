import { ShoppingCart, Check, Clock } from 'lucide-react';
import { Coupon, useAppStore } from '@/lib/store';
import { CoinDisplay } from './CoinDisplay';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface CouponCardProps {
  coupon: Coupon;
  variant?: 'shop' | 'owned';
  onRedeem?: () => void;
  isRedeemed?: boolean;
  hash?: string;
  expiresAt?: string;
}

export function CouponCard({ 
  coupon, 
  variant = 'shop',
  onRedeem,
  isRedeemed = false,
  hash,
  expiresAt
}: CouponCardProps) {
  const { balance, purchaseCoupon } = useAppStore();
  const canAfford = balance >= coupon.cost_coins;

  const handlePurchase = () => {
    if (!canAfford) {
      toast.error('Not enough coins!');
      return;
    }
    
    const userCoupon = purchaseCoupon(coupon);
    if (userCoupon) {
      toast.success(`Coupon purchased! Check "My Coupons"`, {
        icon: '🎟️',
      });
    }
  };

  const formatExpiry = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <Card className={cn(
      'shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden',
      isRedeemed && 'opacity-60'
    )}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{coupon.merchant}</p>
            <h3 className="text-2xl font-bold text-foreground">{coupon.value}</h3>
          </div>
          {variant === 'shop' && (
            <CoinDisplay amount={coupon.cost_coins} size="md" />
          )}
          {variant === 'owned' && isRedeemed && (
            <div className="flex items-center gap-1 text-sm text-success bg-success/10 px-2 py-1 rounded-full">
              <Check className="h-4 w-4" />
              Redeemed
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="text-sm text-muted-foreground">{coupon.description}</p>
        
        {variant === 'owned' && hash && (
          <div className="mt-4 p-3 bg-muted rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Coupon Code</p>
            <p className="font-mono text-sm font-bold tracking-wider">{hash}</p>
          </div>
        )}
        
        {variant === 'owned' && expiresAt && (
          <div className="flex items-center gap-1.5 mt-3 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Expires {formatExpiry(expiresAt)}</span>
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
            {canAfford ? 'Purchase' : 'Not enough coins'}
          </Button>
        ) : (
          <Button
            onClick={onRedeem}
            disabled={isRedeemed}
            variant={isRedeemed ? 'outline' : 'default'}
            className={cn(
              'w-full',
              !isRedeemed && 'gradient-success text-success-foreground hover:opacity-90'
            )}
          >
            {isRedeemed ? 'Already Redeemed' : 'Request Redemption'}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
