import React from 'react';
import { Button } from '@/components/ui/button';
import { User } from '../../types';
import { LogOut, LayoutDashboard, ShieldCheck, User as UserIcon } from 'lucide-react';

interface NavbarProps {
  user: User | null;
  view: string;
  setView: (view: any) => void;
  onLogout: () => void;
}

export default function Navbar({ user, view, setView, onLogout }: NavbarProps) {
  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div 
            className="flex items-center gap-2 cursor-pointer" 
            onClick={() => setView(user?.isAdmin ? 'ADMIN' : 'DASHBOARD')}
          >
            <div className="w-8 h-8 rounded bg-blue-900 flex items-center justify-center text-white font-bold text-xs">
              MS
            </div>
            <span className="font-black text-xl text-blue-900 hidden sm:inline-block">Midnight Savings 💯</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {user?.isAdmin && (
            <Button 
              variant={view === 'ADMIN' ? 'default' : 'ghost'} 
              size="sm"
              onClick={() => setView('ADMIN')}
              className={view === 'ADMIN' ? 'bg-blue-900' : 'text-slate-600'}
            >
              <ShieldCheck className="h-4 w-4 mr-1" /> <span className="hidden md:inline">Admin</span>
            </Button>
          )}
          
          <Button 
            variant={view === 'DASHBOARD' ? 'default' : 'ghost'} 
            size="sm"
            onClick={() => setView('DASHBOARD')}
            className={view === 'DASHBOARD' ? 'bg-blue-900' : 'text-slate-600'}
          >
            <LayoutDashboard className="h-4 w-4 mr-1" /> <span className="hidden md:inline">Portal</span>
          </Button>

          <div className="h-8 w-[1px] bg-slate-200 mx-2 hidden sm:block" />

          <div className="flex items-center gap-2 pl-2">
            <div className="hidden lg:block text-right">
              <p className="text-xs font-bold text-slate-900 leading-none">{user?.name}</p>
              <p className="text-[10px] text-slate-500 font-mono">{user?.phone}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={onLogout} className="text-slate-500 hover:text-red-600">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}