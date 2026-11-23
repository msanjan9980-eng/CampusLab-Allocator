import React from 'react';
import { LayoutDashboard, Search, Calendar, FlaskConical, ShieldCheck, RefreshCcw, X } from 'lucide-react';

export const NavItem = ({ icon: Icon, label, active, onClick }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium ${active ? 'bg-white/10 text-white shadow-sm' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'}`}>
    <Icon size={18} strokeWidth={active ? 2 : 1.5} className={active ? 'text-white' : 'text-slate-500'} />
    <span>{label}</span>
    {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]"></div>}
  </button>
);

export default function Sidebar({ currentView, setCurrentView, role, setRole, isOpen, setIsOpen }) {
  const resetData = () => {
    localStorage.removeItem('lablink_requests');
    localStorage.removeItem('lablink_bookings');
    window.location.reload();
  };

  const handleNav = (view) => {
    setCurrentView(view);
    setIsOpen(false); // Close sidebar on mobile after clicking
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden" 
          onClick={() => setIsOpen(false)}
        />
      )}
      
      <aside className={`fixed md:relative inset-y-0 left-0 w-[260px] border-r border-white/[0.06] bg-[#0A0A0A] flex flex-col z-50 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="h-20 flex items-center justify-between px-6 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <FlaskConical size={16} className="text-white" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="font-semibold text-white tracking-tight text-[15px]">LabLink</h1>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-medium">Campus Resource</p>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="md:hidden text-slate-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
          <p className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Menu</p>
          <NavItem icon={LayoutDashboard} label="Overview" active={currentView === 'dashboard'} onClick={() => handleNav('dashboard')} />
          <NavItem icon={Search} label="Explore Equipment" active={currentView === 'explore'} onClick={() => handleNav('explore')} />
          <NavItem icon={Calendar} label="My Bookings" active={currentView === 'bookings'} onClick={() => handleNav('bookings')} />
          {role === 'faculty' && (
            <NavItem icon={ShieldCheck} label="Approvals" active={currentView === 'approvals'} onClick={() => handleNav('approvals')} />
          )}
        </nav>

        <div className="p-4 border-t border-white/[0.06] space-y-3">
          <div className="bg-[#121214] rounded-xl p-3 border border-white/[0.06]">
            <p className="text-xs text-slate-400 mb-3 font-medium">Demo Role View</p>
            <div className="flex bg-black/40 rounded-lg p-1">
              <button onClick={() => { setRole('student'); setCurrentView('dashboard'); }} className={`flex-1 text-xs py-1.5 rounded-md transition-all font-medium ${role === 'student' ? 'bg-white/10 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}>Student</button>
              <button onClick={() => { setRole('faculty'); setCurrentView('approvals'); }} className={`flex-1 text-xs py-1.5 rounded-md transition-all font-medium ${role === 'faculty' ? 'bg-white/10 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}>Faculty</button>
            </div>
          </div>
          
          <button onClick={resetData} className="w-full py-2 flex items-center justify-center gap-2 text-xs font-medium text-slate-400 hover:text-white transition-colors bg-white/[0.02] hover:bg-white/[0.05] rounded-lg border border-white/5">
            <RefreshCcw size={14} /> Reset Demo Data
          </button>
        </div>
      </aside>
    </>
  );
}