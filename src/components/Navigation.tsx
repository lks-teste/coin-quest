import { Link, useLocation } from 'react-router-dom';
import { Home, Wallet, ShoppingBag, Ticket, Shield, Coins } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/lib/store';

const navItems = [
  { path: '/', icon: Home, label: 'Tasks' },
  { path: '/wallet', icon: Wallet, label: 'Wallet' },
  { path: '/shop', icon: ShoppingBag, label: 'Shop' },
  { path: '/my-coupons', icon: Ticket, label: 'Coupons' },
  { path: '/admin', icon: Shield, label: 'Admin' },
];

export function Navigation() {
  const location = useLocation();
  const balance = useAppStore((state) => state.balance);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-gold shadow-coin">
            <Coins className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold">RewardHub</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navItems.map(({ path, icon: Icon, label }) => (
            <Link
              key={path}
              to={path}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                location.pathname === path
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent">
          <Coins className="h-5 w-5 text-coin" />
          <span className="font-bold text-accent-foreground">{balance}</span>
        </div>
      </div>
      
      {/* Mobile navigation */}
      <nav className="md:hidden flex justify-around border-t border-border py-2 bg-card">
        {navItems.slice(0, 4).map(({ path, icon: Icon, label }) => (
          <Link
            key={path}
            to={path}
            className={cn(
              'flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
              location.pathname === path
                ? 'text-primary'
                : 'text-muted-foreground'
            )}
          >
            <Icon className="h-5 w-5" />
            {label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
