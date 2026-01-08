import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Task {
  id: string;
  title: string;
  description: string;
  type: 'single' | 'recurring';
  reward_coins: number;
  verification_required: boolean;
  cooldown_hours: number;
  icon: string;
}

export interface Completion {
  id: string;
  user_id: string;
  task_id: string;
  proof_url?: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  change: number;
  type: 'earn' | 'spend' | 'refund';
  reference_id: string;
  description: string;
  created_at: string;
}

export interface Coupon {
  id: string;
  merchant: string;
  value: string;
  cost_coins: number;
  description: string;
  image?: string;
}

export interface UserCoupon {
  id: string;
  coupon_id: string;
  hash: string;
  created_at: string;
  expires_at: string;
  redeemed: boolean;
  coupon: Coupon;
}

export interface RedemptionRequest {
  id: string;
  coupon_hash: string;
  user_coupon: UserCoupon;
  proof_url?: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  processed_at?: string;
}

interface AppState {
  userId: string;
  balance: number;
  transactions: Transaction[];
  completions: Completion[];
  userCoupons: UserCoupon[];
  redemptionRequests: RedemptionRequest[];
  
  // Actions
  completeTask: (task: Task, proofUrl?: string) => void;
  purchaseCoupon: (coupon: Coupon) => UserCoupon | null;
  requestRedemption: (userCoupon: UserCoupon) => void;
  approveRedemption: (requestId: string) => void;
  rejectRedemption: (requestId: string) => void;
  approveCompletion: (completionId: string) => void;
  rejectCompletion: (completionId: string) => void;
  getLastCompletion: (taskId: string) => Completion | undefined;
  canCompleteTask: (task: Task) => boolean;
}

const generateId = () => crypto.randomUUID();
const generateHash = () => crypto.randomUUID().replace(/-/g, '').toUpperCase();

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      userId: generateId(),
      balance: 50,
      transactions: [],
      completions: [],
      userCoupons: [],
      redemptionRequests: [],

      completeTask: (task, proofUrl) => {
        const state = get();
        if (!state.canCompleteTask(task)) return;

        const completion: Completion = {
          id: generateId(),
          user_id: state.userId,
          task_id: task.id,
          proof_url: proofUrl,
          status: task.verification_required ? 'pending' : 'approved',
          created_at: new Date().toISOString(),
        };

        const transaction: Transaction = {
          id: generateId(),
          user_id: state.userId,
          change: task.reward_coins,
          type: 'earn',
          reference_id: completion.id,
          description: `Completed: ${task.title}`,
          created_at: new Date().toISOString(),
        };

        set({
          completions: [...state.completions, completion],
          transactions: task.verification_required 
            ? state.transactions 
            : [...state.transactions, transaction],
          balance: task.verification_required 
            ? state.balance 
            : state.balance + task.reward_coins,
        });
      },

      purchaseCoupon: (coupon) => {
        const state = get();
        if (state.balance < coupon.cost_coins) return null;

        const userCoupon: UserCoupon = {
          id: generateId(),
          coupon_id: coupon.id,
          hash: generateHash(),
          created_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          redeemed: false,
          coupon,
        };

        const transaction: Transaction = {
          id: generateId(),
          user_id: state.userId,
          change: -coupon.cost_coins,
          type: 'spend',
          reference_id: userCoupon.id,
          description: `Purchased: ${coupon.merchant} ${coupon.value}`,
          created_at: new Date().toISOString(),
        };

        set({
          balance: state.balance - coupon.cost_coins,
          userCoupons: [...state.userCoupons, userCoupon],
          transactions: [...state.transactions, transaction],
        });

        return userCoupon;
      },

      requestRedemption: (userCoupon) => {
        const state = get();
        const request: RedemptionRequest = {
          id: generateId(),
          coupon_hash: userCoupon.hash,
          user_coupon: userCoupon,
          status: 'pending',
          created_at: new Date().toISOString(),
        };

        set({
          redemptionRequests: [...state.redemptionRequests, request],
        });
      },

      approveRedemption: (requestId) => {
        const state = get();
        const request = state.redemptionRequests.find(r => r.id === requestId);
        if (!request) return;

        set({
          redemptionRequests: state.redemptionRequests.map(r =>
            r.id === requestId
              ? { ...r, status: 'approved', processed_at: new Date().toISOString() }
              : r
          ),
          userCoupons: state.userCoupons.map(c =>
            c.hash === request.coupon_hash
              ? { ...c, redeemed: true }
              : c
          ),
        });
      },

      rejectRedemption: (requestId) => {
        set(state => ({
          redemptionRequests: state.redemptionRequests.map(r =>
            r.id === requestId
              ? { ...r, status: 'rejected', processed_at: new Date().toISOString() }
              : r
          ),
        }));
      },

      approveCompletion: (completionId) => {
        const state = get();
        const completion = state.completions.find(c => c.id === completionId);
        if (!completion) return;

        const task = SEED_TASKS.find(t => t.id === completion.task_id);
        if (!task) return;

        const transaction: Transaction = {
          id: generateId(),
          user_id: state.userId,
          change: task.reward_coins,
          type: 'earn',
          reference_id: completionId,
          description: `Approved: ${task.title}`,
          created_at: new Date().toISOString(),
        };

        set({
          completions: state.completions.map(c =>
            c.id === completionId ? { ...c, status: 'approved' } : c
          ),
          transactions: [...state.transactions, transaction],
          balance: state.balance + task.reward_coins,
        });
      },

      rejectCompletion: (completionId) => {
        set(state => ({
          completions: state.completions.map(c =>
            c.id === completionId ? { ...c, status: 'rejected' } : c
          ),
        }));
      },

      getLastCompletion: (taskId) => {
        const state = get();
        return state.completions
          .filter(c => c.task_id === taskId)
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];
      },

      canCompleteTask: (task) => {
        const state = get();
        const lastCompletion = state.getLastCompletion(task.id);
        
        if (!lastCompletion) return true;
        if (task.type === 'single' && lastCompletion.status === 'approved') return false;
        
        const cooldownMs = task.cooldown_hours * 60 * 60 * 1000;
        const timeSinceCompletion = Date.now() - new Date(lastCompletion.created_at).getTime();
        
        return timeSinceCompletion >= cooldownMs;
      },
    }),
    {
      name: 'rewards-app-storage',
    }
  )
);

// Seed data
export const SEED_TASKS: Task[] = [
  {
    id: '1',
    title: 'Follow your diet plan',
    description: 'Stick to your nutrition goals for the day',
    type: 'recurring',
    reward_coins: 15,
    verification_required: true,
    cooldown_hours: 24,
    icon: '🥗',
  },
  {
    id: '2',
    title: 'Take a 30-min walk',
    description: 'Get moving with a brisk walk outdoors',
    type: 'recurring',
    reward_coins: 20,
    verification_required: true,
    cooldown_hours: 24,
    icon: '🚶',
  },
  {
    id: '3',
    title: 'Drink 8 glasses of water',
    description: 'Stay hydrated throughout the day',
    type: 'recurring',
    reward_coins: 10,
    verification_required: false,
    cooldown_hours: 24,
    icon: '💧',
  },
  {
    id: '4',
    title: 'Meditate for 10 minutes',
    description: 'Take time to relax and clear your mind',
    type: 'recurring',
    reward_coins: 12,
    verification_required: false,
    cooldown_hours: 24,
    icon: '🧘',
  },
  {
    id: '5',
    title: 'Get 7+ hours of sleep',
    description: 'Rest well for a productive day',
    type: 'recurring',
    reward_coins: 15,
    verification_required: false,
    cooldown_hours: 24,
    icon: '😴',
  },
  {
    id: '6',
    title: 'Complete a workout',
    description: 'Finish a gym session or home workout',
    type: 'recurring',
    reward_coins: 25,
    verification_required: true,
    cooldown_hours: 24,
    icon: '💪',
  },
];

export const SEED_COUPONS: Coupon[] = [
  {
    id: '1',
    merchant: 'Healthy Eats',
    value: '20% Off',
    cost_coins: 50,
    description: 'Valid on any order over $25',
  },
  {
    id: '2',
    merchant: 'FitGear Pro',
    value: '$10 Off',
    cost_coins: 75,
    description: 'Discount on workout equipment',
  },
  {
    id: '3',
    merchant: 'Zen Spa',
    value: '15% Off',
    cost_coins: 60,
    description: 'Relaxation and wellness services',
  },
  {
    id: '4',
    merchant: 'Organic Market',
    value: '$5 Off',
    cost_coins: 35,
    description: 'Fresh produce and healthy snacks',
  },
  {
    id: '5',
    merchant: 'Yoga Studio',
    value: 'Free Class',
    cost_coins: 100,
    description: 'One complimentary yoga session',
  },
  {
    id: '6',
    merchant: 'Smoothie Bar',
    value: 'Buy 1 Get 1',
    cost_coins: 45,
    description: 'Any smoothie or acai bowl',
  },
];
