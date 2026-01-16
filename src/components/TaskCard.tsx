import { useState } from 'react';
import { CheckCircle2, Clock, Upload, Camera, AlertCircle } from 'lucide-react';
import { CoinDisplay } from './CoinDisplay';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useTasks } from '@/hooks/useTasks';

interface Task {
  id: string;
  title: string;
  description: string | null;
  coins: number;
  icon: string | null;
  cooldown_hours: number | null;
  created_at: string;
}

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  const [showProofDialog, setShowProofDialog] = useState(false);
  const [proofUploaded, setProofUploaded] = useState(false);
  const { completeTask, canCompleteTask, getLastCompletion } = useTasks();
  
  const canComplete = canCompleteTask(task);
  const lastCompletion = getLastCompletion(task.id);
  const isPending = lastCompletion?.status === 'pending';

  const handleComplete = () => {
    if (!canComplete) return;
    setShowProofDialog(true);
  };

  const handleSubmitProof = async () => {
    const { error } = await completeTask(task.id);
    setShowProofDialog(false);
    setProofUploaded(false);
    
    if (error) {
      toast.error('Erro ao completar tarefa');
    } else {
      toast.success('Prova enviada! Aguardando aprovação.', {
        icon: '📤',
      });
    }
  };

  const getTimeRemaining = () => {
    if (!lastCompletion || canComplete) return null;
    
    const cooldownMs = (task.cooldown_hours ?? 24) * 60 * 60 * 1000;
    const completedAt = new Date(lastCompletion.created_at).getTime();
    const availableAt = completedAt + cooldownMs;
    const remaining = availableAt - Date.now();
    
    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };

  const timeRemaining = getTimeRemaining();

  return (
    <>
      <Card className={cn(
        'shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden',
        !canComplete && 'opacity-75'
      )}>
        <CardContent className="p-0">
          <div className="flex items-stretch">
            <div className="flex items-center justify-center w-20 bg-accent text-4xl">
              {task.icon || '⭐'}
            </div>
            
            <div className="flex-1 p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{task.title}</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">{task.description}</p>
                  
                  <div className="flex items-center gap-3 mt-3">
                    <CoinDisplay amount={task.coins} size="sm" />
                    
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                      <Camera className="h-3 w-3" />
                      Prova necessária
                    </span>
                    
                    <span className="text-xs text-muted-foreground">
                      Diária
                    </span>
                  </div>
                </div>
                
                <div className="flex flex-col items-end gap-2">
                  {isPending ? (
                    <div className="flex items-center gap-1.5 text-sm text-warning bg-warning/10 px-3 py-1.5 rounded-lg">
                      <Clock className="h-4 w-4" />
                      <span>Pendente</span>
                    </div>
                  ) : canComplete ? (
                    <Button
                      onClick={handleComplete}
                      className="gradient-gold text-primary-foreground hover:opacity-90 transition-opacity"
                    >
                      <CheckCircle2 className="h-4 w-4 mr-1.5" />
                      Completar
                    </Button>
                  ) : (
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{timeRemaining}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showProofDialog} onOpenChange={setShowProofDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enviar Prova</DialogTitle>
            <DialogDescription>
              Envie uma foto ou screenshot para verificar que você completou esta tarefa.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div 
              className={cn(
                'border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors',
                proofUploaded 
                  ? 'border-success bg-success/5' 
                  : 'border-border hover:border-primary'
              )}
              onClick={() => setProofUploaded(!proofUploaded)}
            >
              {proofUploaded ? (
                <div className="flex flex-col items-center gap-2 text-success">
                  <CheckCircle2 className="h-12 w-12" />
                  <span className="font-medium">Prova enviada</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <Upload className="h-12 w-12" />
                  <span>Clique para enviar prova</span>
                  <span className="text-xs">(Demo: clique para simular upload)</span>
                </div>
              )}
            </div>
            
            <div className="flex items-start gap-2 text-sm text-muted-foreground bg-muted p-3 rounded-lg">
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
              <p>Sua submissão será revisada por um administrador. As moedas serão creditadas após aprovação.</p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowProofDialog(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleSubmitProof}
              className="gradient-gold text-primary-foreground"
            >
              Enviar Prova
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
