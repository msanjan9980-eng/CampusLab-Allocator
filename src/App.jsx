import React, { useState, useMemo } from 'react';
import { 
  LayoutDashboard, Search, Calendar, FlaskConical, 
  CheckCircle, AlertTriangle, Cpu, Microscope, 
  Box, Activity, Settings, Bell, ChevronRight, 
  Sparkles, ShieldCheck, Clock, UserCircle2
} from 'lucide-react';

// --- MOCK DATA ---
const EQUIPMENT = [
  { id: 1, name: 'High-Res Fluorescence Microscope', dept: 'Biology', type: 'Microscope', status: 'Available', icon: Microscope, image: 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&q=80&w=400' },
  { id: 2, name: 'Industrial 3D Printer (Resin)', dept: 'Engineering', type: '3D Printing', status: 'In Use', icon: Box, image: 'https://images.unsplash.com/photo-1615870216519-2f9fa575fa5c?auto=format&fit=crop&q=80&w=400' },
  { id: 3, name: 'NVIDIA Jetson Nano Kit', dept: 'Computer Science', type: 'Dev Kit', status: 'Available', icon: Cpu, image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=400' },
  { id: 4, name: 'Digital Oscilloscope 200MHz', dept: 'Electronics', type: 'Measurement', status: 'Available', icon: Activity, image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=400' },
  { id: 5, name: 'Chemical Fume Hood', dept: 'Chemistry', type: 'Safety', status: 'Maintenance', icon: FlaskConical, image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=400' },
];

const INITIAL_REQUESTS = [
  { id: 101, student: 'Alex Mercer', project: 'Autonomous Drone Navigation', equipment: 'NVIDIA Jetson Nano Kit', date: '2024-05-20', status: 'Pending', urgency: 'High' },
  { id: 102, student: 'Sarah Chen', project: 'Cellular Respiration Analysis', equipment: 'High-Res Fluorescence Microscope', date: '2024-05-22', status: 'Pending', urgency: 'Medium' },
];

const INITIAL_BOOKINGS = [
  { id: 201, equipment: 'Digital Oscilloscope 200MHz', date: '2024-05-18', time: '14:00 - 16:00', status: 'Approved' }
];

export default function LabLinkApp() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [role, setRole] = useState('student');
  const [requests, setRequests] = useState(INITIAL_REQUESTS);
  const [bookings, setBookings] = useState(INITIAL_BOOKINGS);
  
  const [selectedItem, setSelectedItem] = useState(null);
  const [isAiResolving, setIsAiResolving] = useState(false);
  const [aiRecommendation, setAiRecommendation] = useState(null);

  const handleBookAttempt = (item, requestedTime) => {
    setSelectedItem(item);
    setIsAiResolving(true);
    setAiRecommendation(null);

    setTimeout(() => {
      setIsAiResolving(false);
      if (item.status === 'In Use' || item.id === 2) {
        setAiRecommendation({
          conflict: true,
          message: "I detected a scheduling conflict for this equipment at your requested time.",
          suggestion: "I recommend booking the 'Prusa MK3S+ FDM Printer' instead. It has the same capabilities for your project requirements and is available at your requested slot.",
          alternativeId: 3 
        });
      } else {
        setAiRecommendation({
          conflict: false,
          message: "Resource allocated successfully. I've cross-referenced your project deadline and optimized the slot.",
          suggestion: "Booking confirmed. Please arrive 10 minutes early for equipment calibration."
        });
        setBookings([...bookings, {
          id: Date.now(),
          equipment: item.name,
          date: new Date().toISOString().split('T')[0],
          time: requestedTime || '10:00 - 12:00',
          status: 'Pending Faculty Approval'
        }]);
      }
    }, 1500);
  };

  const handleApproval = (id, status) => {
    setRequests(requests.map(req => req.id === id ? { ...req, status } : req));
  };

  const stats = useMemo(() => [
    { label: 'Available Equipment', value: '42', icon: Box, color: 'text-emerald-400' },
    { label: 'Active Projects', value: '18', icon: Activity, color: 'text-fuchsia-400' },
    { label: 'Pending Approvals', value: requests.filter(r => r.status === 'Pending').length, icon: Clock, color: 'text-amber-400' },
    { label: 'Resource Utilization', value: '78%', icon: Cpu, color: 'text-indigo-400' },
  ], [requests]);

  return (
    <div className="flex h-screen bg-[#0A0A0B] text-slate-200 font-sans selection:bg-fuchsia-500/30">
      
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
              <button 
                onClick={() => { setRole('student'); setCurrentView('dashboard'); }}
                className={`flex-1 text-xs py-1.5 rounded-md transition-all ${role === 'student' ? 'bg-indigo-500/20 text-indigo-300 shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
              >Student</button>
              <button 
                onClick={() => { setRole('faculty'); setCurrentView('approvals'); }}
                className={`flex-1 text-xs py-1.5 rounded-md transition-all ${role === 'faculty' ? 'bg-fuchsia-500/20 text-fuchsia-300 shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
              >Faculty</button>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-[#0A0A0B]/80 backdrop-blur-md sticky top-0 z-10">
          <h2 className="text-lg font-semibold text-white">
            {currentView === 'dashboard' && 'Welcome back, ' + (role === 'student' ? 'Alex' : 'Dr. Smith')}
            {currentView === 'explore' && 'Equipment Discovery'}
            {currentView === 'bookings' && (role === 'student' ? 'My Reservations' : 'Department Bookings')}
            {currentView === 'approvals' && 'Project Access Requests'}
          </h2>
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-white transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-fuchsia-500 rounded-full border-2 border-[#0A0A0B]"></span>
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-white/10">
              <UserCircle2 size={32} className="text-slate-400" />
              <div className="text-sm">
                <p className="text-white font-medium">{role === 'student' ? 'Alex Mercer' : 'Dr. Smith'}</p>
                <p className="text-slate-500 text-xs">{role === 'student' ? 'Computer Science' : 'Faculty - Engineering'}</p>
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          {currentView === 'dashboard' && (
            <div className="space-y-6 max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                  <div key={i} className="bg-[#121214] border border-white/5 rounded-2xl p-5 flex items-start justify-between">
                    <div>
                      <p className="text-sm text-slate-400 font-medium mb-1">{stat.label}</p>
                      <h3 className="text-3xl font-bold text-white">{stat.value}</h3>
                    </div>
                    <div className={`p-2 rounded-xl bg-white/5 ${stat.color}`}>
                      <stat.icon size={20} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-gradient-to-r from-indigo-500/10 to-fuchsia-500/10 border border-indigo-500/20 rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Sparkles size={120} />
                </div>
                <div className="flex items-start gap-4 relative z-10">
                  <div className="p-3 bg-indigo-500/20 rounded-xl text-indigo-400">
                    <Sparkles size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">GenAI Resource Optimization Active</h3>
                    <p className="text-slate-400 text-sm max-w-2xl">
                      Based on your upcoming project deadlines, I've optimized the allocation for the Engineering department. 
                      I've automatically resolved 3 scheduling conflicts this morning. Your requested slot for the <span className="text-white font-medium">Oscilloscope</span> has been confirmed.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Available Near You</h3>
                  <button onClick={() => setCurrentView('explore')} className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                    View All <ChevronRight size={16} />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {EQUIPMENT.slice(0, 3).map(item => (
                    <EquipmentCard key={item.id} item={item} onBook={() => handleBookAttempt(item)} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentView === 'explore' && (
            <div className="max-w-6xl mx-auto">
              <div className="flex gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                  <input 
                    type="text" 
                    placeholder="Search equipment, departments, or capabilities..." 
                    className="w-full bg-[#121214] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
                  />
                </div>
                <button className="bg-[#121214] border border-white/10 px-4 rounded-xl flex items-center gap-2 text-sm font-medium hover:bg-white/5 transition-colors">
                  <Settings size={18} /> Filters
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {EQUIPMENT.map(item => (
                  <EquipmentCard key={item.id} item={item} onBook={() => handleBookAttempt(item)} />
                ))}
              </div>
            </div>
          )}

          {currentView === 'bookings' && (
            <div className="max-w-4xl mx-auto">
              <div className="bg-[#121214] border border-white/5 rounded-2xl overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 bg-white/[0.02]">
                      <th className="p-4 text-sm font-medium text-slate-400">Equipment</th>
                      <th className="p-4 text-sm font-medium text-slate-400">Date</th>
                      <th className="p-4 text-sm font-medium text-slate-400">Time Slot</th>
                      <th className="p-4 text-sm font-medium text-slate-400">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking) => (
                      <tr key={booking.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                        <td className="p-4 text-white font-medium">{booking.equipment}</td>
                        <td className="p-4 text-slate-300">{booking.date}</td>
                        <td className="p-4 text-slate-300">{booking.time}</td>
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                            booking.status.includes('Approved') ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                          }`}>
                            {booking.status.includes('Approved') ? <CheckCircle size={12} /> : <Clock size={12} />}
                            {booking.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {bookings.length === 0 && (
                      <tr>
                        <td colSpan="4" className="p-8 text-center text-slate-500">No bookings found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {currentView === 'approvals' && role === 'faculty' && (
            <div className="max-w-4xl mx-auto space-y-4">
              {requests.map(req => (
                <div key={req.id} className="bg-[#121214] border border-white/5 rounded-2xl p-6 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-lg font-semibold text-white">{req.student}</h4>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        req.urgency === 'High' ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'
                      }`}>
                        {req.urgency} Priority
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        req.status === 'Pending' ? 'bg-slate-500/20 text-slate-400' : 
                        req.status === 'Approved' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                      }`}>
                        {req.status}
                      </span>
                    </div>
                    <p className="text-sm text-slate-300 mb-1"><span className="text-slate-500">Project:</span> {req.project}</p>
                    <p className="text-sm text-slate-300"><span className="text-slate-500">Equipment:</span> {req.equipment} <span className="text-slate-600 mx-2">|</span> <span className="text-slate-500">Req Date:</span> {req.date}</p>
                  </div>
                  
                  {req.status === 'Pending' && (
                    <div className="flex gap-2 w-full md:w-auto">
                      <button onClick={() => handleApproval(req.id, 'Rejected')} className="flex-1 md:flex-none px-4 py-2 rounded-xl border border-white/10 text-slate-300 hover:bg-rose-500/10 hover:text-rose-400 hover:border-rose-500/30 transition-all text-sm font-medium">
                        Reject
                      </button>
                      <button onClick={() => handleApproval(req.id, 'Approved')} className="flex-1 md:flex-none px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white shadow-lg shadow-indigo-500/20 transition-all text-sm font-medium flex items-center justify-center gap-2">
                        <CheckCircle size={16} /> Approve
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {selectedItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#121214] border border-white/10 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative">
            <div className="h-32 relative">
              <img src={selectedItem.image} alt={selectedItem.name} className="w-full h-full object-cover opacity-60" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#121214] to-transparent"></div>
              <button onClick={() => { setSelectedItem(null); setAiRecommendation(null); }} className="absolute top-4 right-4 p-2 bg-black/40 hover:bg-black/60 rounded-full text-white transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>
            
            <div className="p-6 relative pt-2">
              <div className="mb-4">
                <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">{selectedItem.dept}</span>
                <h2 className="text-xl font-bold text-white mt-1">{selectedItem.name}</h2>
              </div>

              {!aiRecommendation && !isAiResolving && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Select Date & Time</label>
                    <input type="datetime-local" className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-indigo-500 focus:outline-none" defaultValue="2024-05-20T14:00" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Project Justification (GenAI Evaluates)</label>
                    <textarea className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-indigo-500 focus:outline-none h-20 resize-none" placeholder="Briefly explain what you are building and why you need this..."></textarea>
                  </div>
                  <button onClick={() => handleBookAttempt(selectedItem, '14:00 - 16:00')} className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 text-white font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                    <Sparkles size={18} /> Request Allocation
                  </button>
                </div>
              )}

              {isAiResolving && (
                <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                    <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-fuchsia-400 animate-pulse" size={24} />
                  </div>
                  <div>
                    <h3 className="text-white font-medium">GenAI is analyzing schedules...</h3>
                    <p className="text-sm text-slate-400 mt-1">Resolving conflicts and optimizing resource allocation.</p>
                  </div>
                </div>
              )}

              {aiRecommendation && !isAiResolving && (
                <div className={`p-4 rounded-2xl border ${aiRecommendation.conflict ? 'bg-amber-500/10 border-amber-500/20' : 'bg-emerald-500/10 border-emerald-500/20'}`}>
                  <div className="flex items-start gap-3">
                    {aiRecommendation.conflict ? <AlertTriangle className="text-amber-400 shrink-0" /> : <CheckCircle className="text-emerald-400 shrink-0" />}
                    <div>
                      <h4 className={`font-semibold ${aiRecommendation.conflict ? 'text-amber-400' : 'text-emerald-400'}`}>
                        {aiRecommendation.conflict ? 'Conflict Detected' : 'Booking Optimized'}
                      </h4>
                      <p className="text-sm text-slate-300 mt-1 leading-relaxed">{aiRecommendation.message}</p>
                      <div className="mt-4 p-3 bg-black/40 rounded-xl border border-white/5">
                        <p className="text-xs text-indigo-300 font-medium flex items-center gap-1 mb-1"><Sparkles size={12}/> AI Suggestion</p>
                        <p className="text-sm text-slate-300">{aiRecommendation.suggestion}</p>
                      </div>
                      <button onClick={() => { setSelectedItem(null); setAiRecommendation(null); }} className="mt-4 w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-colors text-sm">
                        {aiRecommendation.conflict ? 'Accept Alternative' : 'Close'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function NavItem({ icon: Icon, label, active, onClick }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
        active 
          ? 'bg-indigo-500/10 text-indigo-400 font-medium' 
          : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
      }`}
    >
      <Icon size={20} className={active ? 'text-indigo-400' : 'text-slate-500'} />
      <span className="text-sm">{label}</span>
      {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-400"></div>}
    </button>
  );
}

function EquipmentCard({ item, onBook }) {
  const Icon = item.icon;
  return (
    <div className="bg-[#121214] border border-white/5 rounded-2xl overflow-hidden group hover:border-white/10 transition-all flex flex-col">
      <div className="h-40 relative overflow-hidden bg-black/50">
        <img src={item.image} alt={item.name} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
        <div className="absolute top-3 right-3">
          <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider backdrop-blur-md flex items-center gap-1 ${
            item.status === 'Available' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 
            item.status === 'In Use' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 
            'bg-rose-500/20 text-rose-300 border border-rose-500/30'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${
              item.status === 'Available' ? 'bg-emerald-400' : item.status === 'In Use' ? 'bg-amber-400' : 'bg-rose-400'
            }`}></span>
            {item.status}
          </span>
        </div>
      </div>
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-start gap-3 mb-3">
          <div className="p-2 bg-white/5 rounded-lg text-slate-300">
            <Icon size={18} />
          </div>
          <div>
            <h3 className="font-semibold text-white leading-tight">{item.name}</h3>
            <p className="text-xs text-slate-500 mt-1">{item.dept} Department</p>
          </div>
        </div>
        <div className="mt-auto pt-4 border-t border-white/5">
          <button 
            onClick={onBook}
            className="w-full py-2 rounded-xl bg-white/5 hover:bg-indigo-500 text-slate-300 hover:text-white text-sm font-medium transition-all flex items-center justify-center gap-2 group/btn"
          >
            <Calendar size={16} className="text-slate-500 group-hover/btn:text-white transition-colors" />
            Book Slot
          </button>
        </div>
      </div>
    </div>
  );
}