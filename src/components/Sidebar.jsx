import React from 'react';
import { LayoutDashboard, Search, Calendar, FlaskConical, ShieldCheck } from 'lucide-react';

export const NavItem = ({ icon: Icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none ${
      active ? 'bg-indigo-500/10 text-indigo-400 font-medium' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
    }`}
  >
    <Icon size={20} className={active ? 'text-indigo-400' : 'text-slate-500'} />
    <span className="text-sm">{label}</span>
    {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-400"></div>}
  </button>
);

export default function Sidebar({ currentView, setCurrentView, role, setRole }) {
  return (
    <aside className="w-64 border-r border-white/5 bg-[#0F0F11] flex flex-col">
      <div className="p-6 flex items-center gap-3 border-b border-white/5">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-fuchsia-500/20">
          <FlaskConical size={18} className="text-white" />
        </div>
        <div>
          <h1 className="font-bold text-white tracking-wide">LabLink</h1>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Campus Resource</p>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        <NavItem icon={LayoutDashboard} label="Overview" active={currentView === 'dashboard'} onClick={() => setCurrentView('dashboard')} />
        <NavItem icon={Search} label="Explore Equipment" active={currentView === 'explore'} onClick={() => setCurrentView('explore')} />
        <NavItem icon={Calendar} label="My Bookings" active={currentView === 'bookings'} onClick={() => setCurrentView('bookings')} />
        {role === 'faculty' && (
          <NavItem icon={ShieldCheck} label="Approvals" active={currentView === 'approvals'} onClick={() => setCurrentView('approvals')} />
        )}
      </nav>

      <div className="p-4 border-t border-white/5">
        <div className="bg-white/5 rounded-xl p-3 border border-white/5">
          <p className="text-xs text-slate-400 mb-2 font-medium">Demo Role View</p>
          <div className="flex bg-black/40 rounded-lg p-1">
            <button aria-label="Switch to Student View" onClick={() => { setRole('student'); setCurrentView('dashboard'); }} className={`flex-1 text-xs py-1.5 rounded-md transition-all focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none ${role === 'student' ? 'bg-indigo-500/20 text-indigo-300 shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}>Student</button>
            <button aria-label="Switch to Faculty View" onClick={() => { setRole('faculty'); setCurrentView('approvals'); }} className={`flex-1 text-xs py-1.5 rounded-md transition-all focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none ${role === 'faculty' ? 'bg-fuchsia-500/20 text-fuchsia-300 shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}>Faculty</button>
          </div>
        </div>
      </div>
    </aside>
  );
}