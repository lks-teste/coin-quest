import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface Task {
  id: string;
  title: string;
  description: string | null;
  coins: number;
  icon: string | null;
  cooldown_hours: number | null;
  created_at: string;
}

interface TaskCompletion {
  id: string;
  user_id: string;
  task_id: string;
  status: string;
  created_at: string;
  reviewed_at: string | null;
}

export function useTasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [completions, setCompletions] = useState<TaskCompletion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
    if (user) {
      fetchCompletions();
    }
  }, [user]);

  const fetchTasks = async () => {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: true });

    if (!error && data) {
      setTasks(data);
    }
    setLoading(false);
  };

  const fetchCompletions = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('task_completions')
      .select('*')
      .eq('user_id', user.id);

    if (!error && data) {
      setCompletions(data);
    }
  };

  const completeTask = async (taskId: string) => {
    if (!user) return { error: new Error('Usuário não autenticado') };

    const { data, error } = await supabase
      .from('task_completions')
      .insert({
        user_id: user.id,
        task_id: taskId,
        status: 'pending',
      })
      .select()
      .single();

    if (!error && data) {
      setCompletions(prev => [...prev, data]);
    }

    return { data, error };
  };

  const getLastCompletion = (taskId: string) => {
    return completions
      .filter(c => c.task_id === taskId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];
  };

  const canCompleteTask = (task: Task) => {
    const lastCompletion = getLastCompletion(task.id);
    if (!lastCompletion) return true;
    
    if (lastCompletion.status === 'pending') return false;
    
    const cooldownMs = (task.cooldown_hours ?? 24) * 60 * 60 * 1000;
    const timeSinceCompletion = Date.now() - new Date(lastCompletion.created_at).getTime();
    
    return timeSinceCompletion >= cooldownMs;
  };

  return {
    tasks,
    completions,
    loading,
    completeTask,
    getLastCompletion,
    canCompleteTask,
    refetch: () => {
      fetchTasks();
      fetchCompletions();
    },
  };
}
