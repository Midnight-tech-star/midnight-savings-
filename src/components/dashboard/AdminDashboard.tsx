import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { 
  User, GroupData, Transaction, Member, MembershipRequest 
} from '../../types';
import { 
  Users, TrendingUp, Settings, FileText, CheckCircle2, XCircle, Trash2, 
  Calendar, CreditCard, ChevronDown, ChevronUp, Clock, LogOut, Info
} from 'lucide-react';
import { 
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, 
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, 
  AlertDialogTrigger 
} from "@/components/ui/alert-dialog";

interface AdminDashboardProps {
  groupData: GroupData;
  setGroupData: React.Dispatch<React.SetStateAction<GroupData>>;
  requests: MembershipRequest[];
  setRequests: React.Dispatch<React.SetStateAction<MembershipRequest[]>>;
  members: Member[];
  setMembers: React.Dispatch<React.SetStateAction<Member[]>>;
  transactions: Transaction[];
}

export default function AdminDashboard({ 
  groupData, setGroupData, requests, setRequests, members, setMembers, transactions 
}: AdminDashboardProps) {
  const [localGroupName, setLocalGroupName] = useState(groupData.name);
  const [localAmount, setLocalAmount] = useState(groupData.contributionAmount.toString());

  const handleUpdateGroup = () => {
    setGroupData({
      ...groupData,
      name: localGroupName,
      contributionAmount: parseInt(localAmount) || 0,
    });
    toast.success('Group settings updated');
  };

  const handleRequest = (id: string, action: 'accept' | 'reject') => {
    setRequests(requests.map(req => 
      req.id === id ? { ...req, status: action === 'accept' ? 'accepted' : 'rejected' as any } : req
    ));
    toast.success(`Request ${action === 'accept' ? 'accepted' : 'rejected'}`);
  };

  const handleDismissMember = (id: string) => {
    setMembers(members.filter(m => m.id !== id));
    toast.success('Member dismissed successfully');
  };

  const togglePayout = (memberId: string) => {
    setMembers(members.map(m => 
      m.id === memberId ? { ...m, payoutReceived: !m.payoutReceived, paymentTimestamp: new Date().toLocaleString() } : m
    ));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-blue-900 flex items-center gap-2">
            Admin Dashboard <Badge variant="outline" className="text-blue-700 border-blue-200 bg-blue-50">Treasurer View</Badge>
          </h1>
          <p className="text-slate-500">Manage members, requests, and group settings.</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs text-slate-500 uppercase font-semibold">Weekly Goal</p>
            <p className="text-xl font-bold text-blue-900">KSh {members.length * groupData.contributionAmount}</p>
          </div>
          <TrendingUp className="text-blue-600 h-8 w-8" />
        </div>
      </div>

      <Tabs defaultValue="management" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-6">
          <TabsTrigger value="management">Management</TabsTrigger>
          <TabsTrigger value="requests">Requests ({requests.filter(r => r.status === 'pending').length})</TabsTrigger>
          <TabsTrigger value="payouts">Payout Checklist</TabsTrigger>
          <TabsTrigger value="ledger">Paid Ledger</TabsTrigger>
        </TabsList>

        <TabsContent value="management" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" /> Group Setup
                </CardTitle>
                <CardDescription>Configure group identity and savings rules.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="groupNameInput" className="text-sm font-medium">Group Name</label>
                  <Input 
                    id="groupNameInput" 
                    value={localGroupName} 
                    onChange={(e) => setLocalGroupName(e.target.value)}
                  />
                  <p className="current-group-name text-xs text-slate-500 italic mt-1" aria-live="polite">
                    Live Display: {localGroupName}
                  </p>
                </div>
                <div className="space-y-2">
                  <label htmlFor="contributionAmountInput" className="text-sm font-medium">Weekly Contribution (KSh)</label>
                  <div className="relative">
                    <Input 
                      type="number" 
                      id="contributionAmountInput" 
                      min="0" 
                      value={localAmount}
                      onChange={(e) => setLocalAmount(e.target.value)}
                      className="pr-12"
                    />
                    <span className="absolute right-3 top-2.5 text-slate-400 text-sm font-medium">KSh</span>
                  </div>
                </div>
                <Button 
                  id="updateContributionBtn" 
                  onClick={handleUpdateGroup}
                  className="w-full bg-blue-900"
                >
                  Update Group Settings
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" /> Member List
                </CardTitle>
                <CardDescription>View and manage active members.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="member-list-scroll-container h-[260px] overflow-y-auto pr-2 space-y-3">
                  {members.map(member => (
                    <div key={member.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                          {member.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{member.name}</p>
                          <p className="text-xs text-slate-500">{member.phone}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={member.status === 'Paid' ? 'default' : 'secondary'} className={member.status === 'Paid' ? 'bg-green-600' : 'bg-amber-100 text-amber-700'}>
                          {member.status}
                        </Badge>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Dismiss Member?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to remove {member.name} from the group? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDismissMember(member.id)} className="bg-red-600 text-white">Dismiss</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" /> Weekly Report
              </CardTitle>
              <CardDescription>Summarized view of funds flow.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-green-50 border border-green-100 rounded-xl text-center">
                  <p className="text-xs text-green-700 font-bold uppercase mb-1">Total Inflow</p>
                  <p className="text-2xl font-black text-green-900">KSh 14,800</p>
                </div>
                <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-center">
                  <p className="text-xs text-red-700 font-bold uppercase mb-1">Total Payouts</p>
                  <p className="text-2xl font-black text-red-900">KSh 10,000</p>
                </div>
                <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl text-center">
                  <p className="text-xs text-blue-700 font-bold uppercase mb-1">Group Balance</p>
                  <p className="text-2xl font-black text-blue-900">KSh 4,800</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="requests">
          <Card>
            <CardHeader>
              <CardTitle>Pending Membership Requests</CardTitle>
              <CardDescription>New users waiting for approval to join.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests.filter(r => r.status === 'pending').map(req => (
                    <TableRow key={req.id}>
                      <TableCell className="font-medium">{req.name}</TableCell>
                      <TableCell>{req.phone}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="animate-pulse">Pending</Badge>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="border-green-200 text-green-700 hover:bg-green-50"
                          onClick={() => handleRequest(req.id, 'accept')}
                          data-request-id={req.id}
                        >
                          <CheckCircle2 className="h-4 w-4 mr-1" /> Accept
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="border-red-200 text-red-700 hover:bg-red-50"
                          onClick={() => handleRequest(req.id, 'reject')}
                          data-request-id={req.id}
                        >
                          <XCircle className="h-4 w-4 mr-1" /> Reject
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {requests.filter(r => r.status === 'pending').length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-slate-500 italic">
                        No pending requests.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payouts">
          <Card>
            <CardHeader>
              <CardTitle>Sunday Distribution Checklist</CardTitle>
              <CardDescription>Mark members who have received their payout.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg flex items-start gap-3 border border-blue-100">
                  <Info className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-blue-800">
                    Payouts are calculated based on the number of shares. Sunday mornings are the designated distribution time.
                  </p>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Eligible Member</TableHead>
                      <TableHead>Shares</TableHead>
                      <TableHead>Payout Amount</TableHead>
                      <TableHead>Confirmed</TableHead>
                      <TableHead>Timestamp</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {members.filter(m => m.eligible).map(m => (
                      <TableRow key={m.id}>
                        <TableCell className="font-medium">{m.name}</TableCell>
                        <TableCell>{m.shares}</TableCell>
                        <TableCell>KSh {m.shares * 5000}</TableCell>
                        <TableCell>
                          <input 
                            type="checkbox" 
                            className="w-5 h-5 accent-blue-900 cursor-pointer"
                            checked={m.payoutReceived || false}
                            onChange={() => togglePayout(m.id)}
                            data-member-id={m.id}
                          />
                        </TableCell>
                        <TableCell>
                          <span className="text-xs text-slate-500 font-mono">
                            {m.payoutReceived ? m.paymentTimestamp : '--'}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ledger">
          <Card>
            <CardHeader>
              <CardTitle>Paid Members Ledger</CardTitle>
              <CardDescription>Records of contributions received before the Saturday deadline.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member Name</TableHead>
                    <TableHead>Amount Contributed</TableHead>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Evidence</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {members.filter(m => m.status === 'Paid').map(m => (
                    <TableRow key={m.id}>
                      <TableCell className="font-medium">{m.name}</TableCell>
                      <TableCell>KSh {groupData.contributionAmount}</TableCell>
                      <TableCell className="text-slate-500">{m.paymentTimestamp}</TableCell>
                      <TableCell>
                        <Button size="sm" variant="ghost" className="text-blue-600 hover:bg-blue-50 underline text-xs">
                          View Receipt
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="mt-8 pt-8 border-t">
                <h4 className="font-bold mb-4 flex items-center gap-2">
                  <CreditCard className="h-4 w-4" /> Proof of Payout Storage
                </h4>
                <div className="grid md:grid-cols-4 gap-4">
                  {[1, 2].map(i => (
                    <div key={i} className="aspect-video bg-slate-100 rounded border-2 border-dashed border-slate-300 flex items-center justify-center flex-col p-4 text-center cursor-pointer hover:bg-slate-50 transition-colors">
                      <FileText className="h-6 w-6 text-slate-400 mb-2" />
                      <span className="text-xs text-slate-500">Upload payout evidence for auditing</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}