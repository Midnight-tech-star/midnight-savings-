import React, { useState, useEffect } from 'react';
import { Toaster } from 'sonner';
import AuthScreen from './components/auth/AuthScreen';
import MemberDashboard from './components/dashboard/MemberDashboard';
import AdminDashboard from './components/dashboard/AdminDashboard';
import InitialPayment from './components/payment/InitialPayment';
import Navbar from './components/layout/Navbar';
import { User, GroupData, Member, Transaction, MembershipRequest } from './types';
import { initialMembers, initialRequests, initialTransactions } from './lib/mockData';

export default function App() {
  const [view, setView] = useState<'AUTH' | 'DASHBOARD' | 'ADMIN' | 'PAYMENT'>('AUTH');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [groupData, setGroupData] = useState<GroupData>({
    name: 'Midnight Savings 💯',
    contributionAmount: 740,
    roundActive: true,
  });
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [requests, setRequests] = useState<MembershipRequest[]>(initialRequests);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    if (user.isNew) {
      setView('PAYMENT');
    } else if (user.isAdmin) {
      setView('ADMIN');
    } else {
      setView('DASHBOARD');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setView('AUTH');
  };

  const handleInitialPaymentComplete = () => {
    if (currentUser) {
      setCurrentUser({ ...currentUser, isNew: false, isMember: true });
      setView('DASHBOARD');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100">
      <Toaster position="top-center" />
      
      {view !== 'AUTH' && (
        <Navbar 
          user={currentUser} 
          view={view} 
          setView={setView} 
          onLogout={handleLogout} 
        />
      )}

      <main className="container mx-auto px-4 py-8">
        {view === 'AUTH' && <AuthScreen onLogin={handleLogin} />}
        
        {view === 'PAYMENT' && currentUser && (
          <InitialPayment onComplete={handleInitialPaymentComplete} />
        )}

        {view === 'DASHBOARD' && currentUser && (
          <MemberDashboard 
            user={currentUser} 
            groupData={groupData}
            transactions={transactions}
            members={members}
          />
        )}

        {view === 'ADMIN' && currentUser && currentUser.isAdmin && (
          <AdminDashboard 
            groupData={groupData}
            setGroupData={setGroupData}
            requests={requests}
            setRequests={setRequests}
            members={members}
            setMembers={setMembers}
            transactions={transactions}
          />
        )}
      </main>
    </div>
  );
}