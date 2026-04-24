import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { CreditCard, ShieldCheck, ArrowRight } from 'lucide-react';

interface InitialPaymentProps {
  onComplete: () => void;
}

export default function InitialPayment({ onComplete }: InitialPaymentProps) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate payment gateway transaction
    setTimeout(() => {
      setLoading(false);
      toast.success('Initial payment of KSh 100 successful!');
      onComplete();
    }, 2000);
  };

  return (
    <div className="max-w-xl mx-auto py-12">
      <Card className="border-t-8 border-t-green-600 shadow-2xl overflow-hidden">
        <div className="bg-green-600 text-white p-6 text-center">
          <ShieldCheck className="h-16 w-16 mx-auto mb-4 opacity-90" />
          <h2 className="text-2xl font-black uppercase tracking-tight">Activate Your Account</h2>
          <p className="text-green-100 text-sm mt-2 opacity-80">Finalize your registration to start saving.</p>
        </div>
        
        <CardContent className="pt-8 space-y-8">
          <div className="text-center space-y-2">
            <h3 className="text-lg font-bold text-slate-900">New Member Activation Fee</h3>
            <p className="text-slate-500 text-sm max-w-sm mx-auto">
              A one-time payment of 100 KSh is required to verify your phone number and activate your "Midnight Savings 💯" account.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <Label htmlFor="initialContributionInput" className="text-xs font-black uppercase text-slate-400 mb-2 block tracking-widest">
                Amount to Pay
              </Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">KSh</span>
                <Input 
                  type="number" 
                  id="initialContributionInput" 
                  value="100" 
                  min="100" 
                  readOnly 
                  className="pl-12 h-16 text-3xl font-black bg-white border-slate-200 text-blue-900 focus-visible:ring-green-500"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-blue-50/50 rounded-xl border border-blue-100">
                <div className="bg-blue-600 text-white p-2 rounded-lg">
                  <CreditCard className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] text-blue-700 font-black uppercase">Payment Method</p>
                  <p className="text-sm font-bold text-blue-900">M-PESA Till: 3344034</p>
                </div>
              </div>

              <Button 
                type="submit" 
                id="submitInitialPaymentBtn"
                disabled={loading}
                className="w-full h-16 bg-slate-900 hover:bg-black text-white rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all"
              >
                {loading ? 'Processing Transaction...' : 'Initiate Payment (KSh 100)'}
                {!loading && <ArrowRight className="ml-2 h-5 w-5" />}
              </Button>
            </div>
          </form>
        </CardContent>
        
        <CardFooter className="bg-slate-50 border-t border-slate-100 py-4 justify-center">
          <p className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-2">
            <ShieldCheck className="h-3 w-3" /> Secure Payment Gateway Integration
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}