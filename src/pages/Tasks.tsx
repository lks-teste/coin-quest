import { Navigation } from '@/components/Navigation';
import { TaskCard } from '@/components/TaskCard';
import { Sparkles } from 'lucide-react';
import { useTasks } from '@/hooks/useTasks';

export default function TasksPage() {
  const { tasks, loading } = useTasks();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container py-8">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold">Tarefas Diárias</h1>
          </div>
          <p className="text-muted-foreground">
            Complete tarefas para ganhar moedas e desbloquear recompensas!
          </p>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-16">
            <Sparkles className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Nenhuma tarefa disponível</h2>
            <p className="text-muted-foreground">
              Aguarde o administrador criar novas tarefas.
            </p>
          </div>
        ) : (
          <div className="space-y-4 fade-in">
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
