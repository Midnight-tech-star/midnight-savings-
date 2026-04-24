import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { User, GroupData, Transaction, Member } from '../../types';
import { 
  History, Shield, Info, Clock, ArrowUpRight, ArrowDownLeft, 
  HelpCircle, AlertTriangle, LogOut, CheckCircle2, XCircle, CreditCard
} from 'lucide-react';
import { 
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, 
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, 
  AlertDialogTrigger 
} from "@/components/ui/alert-dialog";

interface MemberDashboardProps {
  user: User;
  groupData: GroupData;
  transactions: Transaction[];
  members: Member[];
}

export default function MemberDashboard({ user, groupData, transactions, members }: MemberDashboardProps) {
  const [timeLeft, setTimeLeft] = useState('');
  const [activeTab, setActiveTab] = useState('summary');

  // Member-specific eligibility and status
  const myData = members.find(m => m.phone === user.phone) || { 
    status: 'Pending' as const, 
    eligible: false, 
    shares: 0 
  };

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      // Target: Next Saturday at 9:00 PM
      const target = new Date();
      target.setDate(now.getDate() + (6 - now.getDay() + 7) % 7);
      target.setHours(21, 0, 0, 0);
      
      if (now > target) {
        target.setDate(target.getDate() + 7);
      }

      const diff = target.getTime() - now.getTime();
      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(`${h}h ${m}m ${s}s`);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleExitGroup = () => {
    toast.error("Process failed. Please contact admin.");
  };

  const handleAccountClosure = () => {
    toast.success("Account closure initiated. Admin will contact you.");
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-700">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-900 via-indigo-900 to-blue-800 text-white p-8 shadow-2xl">
        <div className="relative z-10">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-blue-200 text-sm font-semibold uppercase tracking-wider mb-2">Welcome Back,</p>
              <h1 className="text-4xl font-black mb-4">{user.name} 💯</h1>
              <div className="flex gap-4">
                <Badge className="bg-blue-500/30 text-white border-blue-400 backdrop-blur-md">
                  Active Member
                </Badge>
                <Badge className="bg-white/10 text-white border-white/20 backdrop-blur-md">
                  Midnight Savings 💯
                </Badge>
              </div>
            </div>
            <div className="hidden md:block text-right">
              <p className="text-blue-300 text-xs font-bold uppercase mb-1">Weekly Payout Pool</p>
              <p className="text-4xl font-black">KSh 45,000</p>
            </div>
          </div>
        </div>
        {/* Abstract decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>Member Portal</CardTitle>
              <CardDescription>Track your savings and participation status.</CardDescription>
            </div>
            {!user.isMember && (
              <Button id="joinGroupBtn" className="bg-blue-900 hover:bg-blue-800">
                Join Group
              </Button>
            )}
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="summary" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
                <TabsTrigger value="rules" id="rulesTabButton">Rules</TabsTrigger>
              </TabsList>

              <TabsContent value="summary" className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex flex-col items-center justify-center text-center">
                    <Clock className="h-5 w-5 text-blue-600 mb-2" />
                    <p className="text-xs text-slate-500 uppercase font-bold">Deadline</p>
                    <span id="countdownTimer" className="text-sm font-black text-blue-900" aria-live="assertive">
                      {timeLeft}
                    </span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex flex-col items-center justify-center text-center">
                    <CreditCard className="h-5 w-5 text-indigo-600 mb-2" />
                    <p className="text-xs text-slate-500 uppercase font-bold">Contribution</p>
                    <p className="text-sm font-black text-slate-900">KSh {groupData.contributionAmount}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex flex-col items-center justify-center text-center">
                    {myData.status === 'Paid' ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600 mb-2" />
                    ) : (
                      <Clock className="h-5 w-5 text-amber-500 mb-2" />
                    )}
                    <p className="text-xs text-slate-500 uppercase font-bold">Your Status</p>
                    <Badge variant="outline" className={myData.status === 'Paid' ? 'border-green-200 text-green-700 status-paid' : 'border-amber-200 text-amber-700 status-pending'}>
                      {myData.status}
                    </Badge>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex flex-col items-center justify-center text-center">
                    <Shield className="h-5 w-5 text-purple-600 mb-2" />
                    <p className="text-xs text-slate-500 uppercase font-bold">Eligibility</p>
                    <Badge variant="outline" className={myData.eligible ? 'border-blue-200 text-blue-700 font-bold' : 'border-slate-200 text-slate-400'}>
                      {myData.eligible ? 'Eligible' : 'Ineligible'}
                    </Badge>
                  </div>
                </div>

                <div className="bg-slate-900 text-white rounded-xl p-6 relative overflow-hidden">
                  <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Info className="h-5 w-5 text-blue-400" /> Payout Schedule
                  </h4>
                  <p className="text-slate-400 text-sm mb-4 leading-relaxed">
                    Payouts occur every <span className="text-blue-400 font-bold underline">Sunday morning</span>. 
                    Each member receives their payout proportional to their shares. 
                    Ensure you are marked <span className="text-green-400">"Paid"</span> by Saturday 9:00 PM.
                  </p>
                  <div className="flex items-center gap-4 text-xs font-mono">
                    <span className="bg-white/10 px-2 py-1 rounded">Shares: {myData.shares}</span>
                    <span className="bg-white/10 px-2 py-1 rounded text-blue-300">EST. Payout: KSh {myData.shares * 5000}</span>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="history">
                <ScrollArea className="h-[400px]">
                  <div className="transaction-history space-y-4" style={{ overflowY: 'scroll' }}>
                    {transactions.map(tx => (
                      <div key={tx.id} className="flex items-center justify-between p-4 bg-white rounded-lg border border-slate-100 hover:shadow-sm transition-shadow">
                        <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-full ${tx.type === 'Payment' || tx.type === 'Join' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                            {tx.type === 'Payment' || tx.type === 'Join' ? <ArrowUpRight className="h-5 w-5" /> : <ArrowDownLeft className="h-5 w-5" />}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{tx.type}</p>
                            <p className="text-xs text-slate-500">{tx.date} • {tx.userName}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-black ${tx.type === 'Payment' || tx.type === 'Join' ? 'text-green-600' : 'text-red-600'}`}>
                            {tx.type === 'Payment' || tx.type === 'Join' ? '+' : '-'} KSh {tx.amount}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="rules" role="tabpanel" id="rulesTab" aria-labelledby="rulesTabButton">
                <div className="space-y-6">
                  <div className="bg-blue-50 border-l-4 border-blue-600 p-4">
                    <h4 className="text-blue-900 font-bold mb-2">Group Constitution</h4>
                    <ul className="list-disc list-inside text-sm text-blue-800 space-y-2">
                      <li>Minimum weekly contribution is KSh {groupData.contributionAmount}.</li>
                      <li>Payment deadline is strictly Saturday 9:00 PM.</li>
                      <li>Payouts are disbursed on Sunday mornings.</li>
                      <li>Members must maintain 100% attendance in contributions to stay eligible.</li>
                      <li>No refunds for early exits during an active round.</li>
                    </ul>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          id="exitGroupBtn"
                          className="w-full border-red-200 text-red-600 hover:bg-red-50"
                          disabled={groupData.roundActive}
                        >
                          Exit Group
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            {groupData.roundActive 
                              ? "Cannot exit during an active round. Please wait until the current round finishes."
                              : "This action cannot be undone. You will lose your membership status."}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          {!groupData.roundActive && <AlertDialogAction onClick={handleExitGroup} className="bg-red-600 text-white">Exit Group</AlertDialogAction>}
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" className="w-full text-slate-500">Close Account</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-red-600 flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5" /> Critical Warning
                          </AlertDialogTitle>
                          <AlertDialogDescription className="font-bold text-slate-900 py-4">
                            "No compensation will be provided before the term end"
                          </AlertDialogDescription>
                          <p className="text-sm text-slate-500">
                            By closing your account, you forfeit all pending shares and benefits. Please type "CONFIRM" to proceed.
                          </p>
                          <Input className="mt-4" placeholder="Type CONFIRM" />
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={handleAccountClosure} className="bg-slate-900 text-white">Close Account</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                  {groupData.roundActive && (
                    <p className="text-[10px] text-red-500 text-center uppercase font-bold mt-2">
                      * Exit disabled: Round is currently active
                    </p>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-t-4 border-t-green-600">
            <CardHeader>
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-green-600" /> Payment Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Treasurer Number</p>
                <p className="text-lg font-black text-slate-900">0713703322</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">M-Pesa Till No.</p>
                <p className="text-lg font-black text-slate-900">3344034</p>
              </div>
              <Button className="w-full bg-green-600 hover:bg-green-700">
                Lipa na M-Pesa
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-blue-600" /> Need Help?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-slate-500 mb-4">
                If you have any issues with payments or status updates, contact our support team.
              </p>
              <Button variant="outline" className="w-full text-xs">Contact Support</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}