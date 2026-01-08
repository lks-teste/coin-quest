import { useState } from 'react';
import { Shield, CheckCircle, XCircle, Clock, Image as ImageIcon, Ticket } from 'lucide-react';
import { useAppStore, SEED_TASKS } from '@/lib/store';
import { Navigation } from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('completions');
  const {
    completions,
    redemptionRequests,
    approveCompletion,
    rejectCompletion,
    approveRedemption,
    rejectRedemption,
  } = useAppStore();

  const pendingCompletions = completions.filter(c => c.status === 'pending');
  const pendingRedemptions = redemptionRequests.filter(r => r.status === 'pending');

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTaskTitle = (taskId: string) => {
    return SEED_TASKS.find(t => t.id === taskId)?.title || 'Unknown Task';
  };

  const handleApproveCompletion = (id: string) => {
    approveCompletion(id);
    toast.success('Completion approved! Coins awarded.');
  };

  const handleRejectCompletion = (id: string) => {
    rejectCompletion(id);
    toast.error('Completion rejected.');
  };

  const handleApproveRedemption = (id: string) => {
    approveRedemption(id);
    toast.success('Redemption approved! Coupon marked as used.');
  };

  const handleRejectRedemption = (id: string) => {
    rejectRedemption(id);
    toast.error('Redemption rejected.');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container py-8">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          </div>
          <p className="text-muted-foreground">
            Review and validate user submissions
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <Card className="shadow-card">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending Tasks</p>
                  <p className="text-2xl font-bold">{pendingCompletions.length}</p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-warning/10 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-warning" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-card">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending Redemptions</p>
                  <p className="text-2xl font-bold">{pendingRedemptions.length}</p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                  <Ticket className="h-5 w-5 text-secondary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full mb-6">
            <TabsTrigger value="completions" className="flex-1">
              Task Completions
              {pendingCompletions.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {pendingCompletions.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="redemptions" className="flex-1">
              Redemptions
              {pendingRedemptions.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {pendingRedemptions.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="completions">
            {pendingCompletions.length === 0 ? (
              <Card className="shadow-card">
                <CardContent className="py-12 text-center">
                  <CheckCircle className="h-12 w-12 mx-auto text-success mb-4" />
                  <p className="text-lg font-medium">All caught up!</p>
                  <p className="text-muted-foreground">No pending completions to review.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {pendingCompletions.map((completion) => (
                  <Card key={completion.id} className="shadow-card">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="bg-warning/10 text-warning border-warning/30">
                              <Clock className="h-3 w-3 mr-1" />
                              Pending Review
                            </Badge>
                          </div>
                          <h3 className="font-semibold">{getTaskTitle(completion.task_id)}</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            Submitted: {formatDate(completion.created_at)}
                          </p>
                          
                          {completion.proof_url && (
                            <div className="flex items-center gap-2 mt-3 p-2 bg-muted rounded-lg">
                              <ImageIcon className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">Proof uploaded</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRejectCompletion(completion.id)}
                            className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleApproveCompletion(completion.id)}
                            className="gradient-success text-success-foreground"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="redemptions">
            {pendingRedemptions.length === 0 ? (
              <Card className="shadow-card">
                <CardContent className="py-12 text-center">
                  <CheckCircle className="h-12 w-12 mx-auto text-success mb-4" />
                  <p className="text-lg font-medium">All caught up!</p>
                  <p className="text-muted-foreground">No pending redemptions to review.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {pendingRedemptions.map((request) => (
                  <Card key={request.id} className="shadow-card">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="bg-warning/10 text-warning border-warning/30">
                              <Clock className="h-3 w-3 mr-1" />
                              Pending Validation
                            </Badge>
                          </div>
                          <h3 className="font-semibold">
                            {request.user_coupon.coupon.merchant} - {request.user_coupon.coupon.value}
                          </h3>
                          <div className="mt-2 p-2 bg-muted rounded-lg">
                            <p className="text-xs text-muted-foreground">Coupon Hash</p>
                            <p className="font-mono text-sm">{request.coupon_hash}</p>
                          </div>
                          <p className="text-sm text-muted-foreground mt-2">
                            Requested: {formatDate(request.created_at)}
                          </p>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRejectRedemption(request.id)}
                            className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleApproveRedemption(request.id)}
                            className="gradient-success text-success-foreground"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* All Completions History */}
        <Card className="mt-8 shadow-card">
          <CardHeader>
            <CardTitle>All Completions History</CardTitle>
          </CardHeader>
          <CardContent>
            {completions.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">No completions yet.</p>
            ) : (
              <div className="space-y-2">
                {[...completions]
                  .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                  .map((completion) => (
                    <div 
                      key={completion.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                    >
                      <div>
                        <p className="font-medium text-sm">{getTaskTitle(completion.task_id)}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(completion.created_at)}
                        </p>
                      </div>
                      <Badge 
                        variant="outline"
                        className={cn(
                          completion.status === 'approved' && 'bg-success/10 text-success border-success/30',
                          completion.status === 'rejected' && 'bg-destructive/10 text-destructive border-destructive/30',
                          completion.status === 'pending' && 'bg-warning/10 text-warning border-warning/30'
                        )}
                      >
                        {completion.status}
                      </Badge>
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
