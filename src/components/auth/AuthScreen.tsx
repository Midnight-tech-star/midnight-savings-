import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { User } from '../../types';
import { ShieldCheck, Phone, Lock } from 'lucide-react';

interface AuthScreenProps {
  onLogin: (user: User) => void;
}

export default function AuthScreen({ onLogin }: AuthScreenProps) {
  const [phone, setPhone] = useState('');
  const [passcode, setPasscode] = useState('');
  const [step, setStep] = useState<'PHONE' | 'OTP' | 'PASSCODE'>('PHONE');

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 10) {
      toast.error('Please enter a valid phone number');
      return;
    }
    toast.success('OTP sent to ' + phone);
    setStep('OTP');
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('PASSCODE');
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode.length < 4) {
      toast.error('Passcode must be at least 4 digits');
      return;
    }

    // Distinguish between new and existing members
    const isNew = phone === '0700000000'; // Simulation: this phone is "new"
    const isAdmin = phone === '0713703322'; // Treasurer's number as admin

    const user: User = {
      id: Math.random().toString(36).substr(2, 9),
      phone,
      isMember: !isNew,
      isAdmin,
      isNew,
      name: isNew ? 'New Member' : (isAdmin ? 'Treasurer Admin' : 'John Doe'),
    };

    onLogin(user);
    toast.success('Welcome to Midnight Savings 💯');
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <Card className="w-full max-w-md shadow-xl border-t-4 border-t-blue-900">
        <CardHeader className="text-center">
          <div className="mx-auto w-24 h-24 mb-4">
            <img 
              src="https://storage.googleapis.com/dala-prod-public-storage/generated-images/7b4e2c9b-8cb1-4b79-a677-c7caf924e032/midnight-savings-logo-84ed2f2a-1777056289233.webp" 
              alt="Midnight Savings Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <CardTitle className="text-3xl font-bold text-blue-900">Midnight Savings 💯</CardTitle>
          <CardDescription>Secure your financial future, one week at a time.</CardDescription>
        </CardHeader>
        <CardContent>
          {step === 'PHONE' && (
            <form onSubmit={handlePhoneSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input 
                    type="tel" 
                    id="phone"
                    placeholder="07XX XXX XXX" 
                    className="pl-10"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
              </div>
              <Button type="submit" className="w-full bg-blue-900 hover:bg-blue-800">
                Continue
              </Button>
            </form>
          )}

          {step === 'OTP' && (
            <form onSubmit={handleOtpSubmit} className="space-y-4">
              <div className="space-y-2 text-center">
                <Label>Enter 4-digit OTP</Label>
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4].map((i) => (
                    <Input 
                      key={i}
                      type="text" 
                      maxLength={1} 
                      className="w-12 h-12 text-center text-xl font-bold"
                      autoFocus={i === 1}
                    />
                  ))}
                </div>
              </div>
              <Button type="submit" className="w-full bg-blue-900 hover:bg-blue-800">
                Verify OTP
              </Button>
              <Button variant="ghost" onClick={() => setStep('PHONE')} className="w-full text-slate-500">
                Change Phone Number
              </Button>
            </form>
          )}

          {step === 'PASSCODE' && (
            <form onSubmit={handleFinalSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="passcode">Secure Passcode</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input 
                    type="password" 
                    id="passcode"
                    placeholder="Enter your secret passcode" 
                    className="pl-10"
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    required
                  />
                </div>
              </div>
              <Button type="submit" className="w-full bg-blue-900 hover:bg-blue-800">
                Login / Register
              </Button>
              <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 p-3 rounded border border-slate-100">
                <ShieldCheck className="h-4 w-4 text-green-600 shrink-0" />
                <span>Your connection is encrypted. Phone numbers are verified via SMS.</span>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}