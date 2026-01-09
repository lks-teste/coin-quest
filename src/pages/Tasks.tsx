import { SEED_TASKS } from '@/lib/store';
import { TaskCard } from '@/components/TaskCard';
import { Navigation } from '@/components/Navigation';
import { Sparkles } from 'lucide-react';

export default function TasksPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container py-8">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold">Daily Tasks</h1>
          </div>
          <p className="text-muted-foreground">
            Complete tasks to earn coins and unlock rewards!
          </p>
        </div>
        
        <div className="space-y-4 fade-in">
          {SEED_TASKS.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      </main>
    </div>
  );
}
