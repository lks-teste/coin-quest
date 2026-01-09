import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Wallet, ShoppingBag, Ticket, Shield, Coins, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isStaff, signOut } = useAuth();
  const { balance } = useProfile();

  const navItems = [
    { path: '/', icon: Home, label: 'Tarefas' },
    { path: '/wallet', icon: Wallet, label: 'Carteira' },
    { path: '/shop', icon: ShoppingBag, label: 'Loja' },
    { path: '/my-coupons', icon: Ticket, label: 'Cupons' },
  ];

  if (isStaff) {
    navItems.push({ path: '/admin', icon: Shield, label: 'Admin' });
  }

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast.error('Erro ao sair');
    } else {
      navigate('/auth');
      toast.success('Até logo!');
    }
  };

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

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent">
            <Coins className="h-5 w-5 text-coin" />
            <span className="font-bold text-accent-foreground">{balance}</span>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSignOut}
            className="text-muted-foreground hover:text-foreground"
          >
            <LogOut className="h-5 w-5" />
          </Button>
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
