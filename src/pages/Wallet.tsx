import { ArrowDownLeft, ArrowUpRight, Coins, TrendingUp } from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useProfile } from '@/hooks/useProfile';
import { useTransactions } from '@/hooks/useTransactions';

export default function WalletPage() {
  const { balance } = useProfile();
  const { transactions, totalEarned, totalSpent, loading } = useTransactions();

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Carteira</h1>
          <p className="text-muted-foreground">Acompanhe seus ganhos e gastos</p>
        </div>
        
        {/* Balance Card */}
        <Card className="mb-6 gradient-gold shadow-coin overflow-hidden">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between text-primary-foreground">
              <div>
                <p className="text-sm opacity-90">Saldo Atual</p>
                <div className="flex items-center gap-3 mt-1">
                  <Coins className="h-10 w-10" />
                  <span className="text-5xl font-bold">{balance}</span>
                </div>
              </div>
              <div className="h-16 w-16 rounded-full bg-white/20 flex items-center justify-center">
                <Coins className="h-8 w-8" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <Card className="shadow-card">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Ganho</p>
                  <p className="text-xl font-bold text-success">+{totalEarned}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-card">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                  <ArrowUpRight className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Gasto</p>
                  <p className="text-xl font-bold text-destructive">-{totalSpent}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Transaction History */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Histórico de Transações</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
              </div>
            ) : transactions.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Nenhuma transação ainda. Complete tarefas para ganhar moedas!
              </p>
            ) : (
              <div className="space-y-3">
                {transactions.map((transaction) => (
                  <div 
                    key={transaction.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        'h-8 w-8 rounded-full flex items-center justify-center',
                        transaction.amount > 0 
                          ? 'bg-success/10 text-success'
                          : 'bg-destructive/10 text-destructive'
                      )}>
                        {transaction.amount > 0 
                          ? <ArrowDownLeft className="h-4 w-4" />
                          : <ArrowUpRight className="h-4 w-4" />
                        }
                      </div>
                      <div>
                        <p className="font-medium text-sm">{transaction.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(transaction.created_at)}
                        </p>
                      </div>
                    </div>
                    <span className={cn(
                      'font-bold',
                      transaction.amount > 0 ? 'text-success' : 'text-destructive'
                    )}>
                      {transaction.amount > 0 ? '+' : ''}{transaction.amount}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
