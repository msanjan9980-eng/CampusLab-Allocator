import React, { useState, useMemo } from 'react';
import { CheckCircle, AlertTriangle, Bell, UserCircle2, Microscope, Box, Cpu, Activity, FlaskConical, Clock } from 'lucide-react';

// Component Imports
import Sidebar from './components/Sidebar';
import BookingModal from './components/BookingModal';
import Dashboard from './views/Dashboard';
import Explore from './views/Explore';
import Bookings from './views/Bookings';
import Approvals from './views/Approvals';

// --- MOCK DATA ---
const EQUIPMENT = [
  { id: 1, name: 'High-Res Fluorescence Microscope', dept: 'Biology', type: 'Microscope', status: 'Available', icon: Microscope, image: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80&w=400' },
  { id: 2, name: 'Industrial 3D Printer (Resin)', dept: 'Engineering', type: '3D Printing', status: 'In Use', icon: Box, image: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?auto=format&fit=crop&q=80&w=400' },
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

export default function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [role, setRole] = useState('student');
  const [requests, setRequests] = useState(INITIAL_REQUESTS);
  const [bookings, setBookings] = useState(INITIAL_BOOKINGS);
  
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  // Modal State
  const [selectedItem, setSelectedItem] = useState(null);
  const [isAiResolving, setIsAiResolving] = useState(false);
  const [aiRecommendation, setAiRecommendation] = useState(null);
  const [selectedTime, setSelectedTime] = useState('10:00 - 12:00');

  // Toast State
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // GenAI Logic
  const handleBookAttempt = () => {
    setIsAiResolving(true);
    setAiRecommendation(null);

    setTimeout(() => {
      setIsAiResolving(false);
      if (selectedItem.status === 'In Use' || selectedItem.id === 2) {
        setAiRecommendation({
          conflict: true,
          message: "I detected a scheduling conflict for this equipment at your requested time.",
          suggestion: "I recommend booking the 'Prusa MK3S+ FDM Printer' instead. It has the same capabilities for your project requirements and is available at your requested slot.",
        });
      } else {
        setAiRecommendation({
          conflict: false,
          message: "Resource allocated successfully. I've cross-referenced your project deadline and optimized the slot.",
          suggestion: "Booking confirmed. Please arrive 10 minutes early for equipment calibration."
        });
        setBookings([...bookings, {
          id: Date.now(),
          equipment: selectedItem.name,
          date: new Date().toISOString().split('T')[0],
          time: selectedTime,
          status: 'Pending Faculty Approval'
        }]);
        showToast('Booking request submitted successfully!');
      }
    }, 1500);
  };

  const handleApproval = (id, status) => {
    setRequests(requests.map(req => req.id === id ? { ...req, status } : req));
    showToast(`Request ${status.toLowerCase()} successfully.`, status === 'Approved' ? 'success' : 'error');
  };

  // Derived Data
  const stats = useMemo(() => [
    { label: 'Available Equipment', value: EQUIPMENT.filter(e => e.status === 'Available').length.toString(), icon: Box, color: 'text-emerald-400' },
    { label: 'Active Projects', value: '18', icon: Activity, color: 'text-fuchsia-400' },
    { label: 'Pending Approvals', value: requests.filter(r => r.status === 'Pending').length.toString(), icon: Clock, color: 'text-amber-400' },
    { label: 'Resource Utilization', value: '78%', icon: Cpu, color: 'text-indigo-400' },
  ], [requests]);

  const filteredEquipment = useMemo(() => {
    return EQUIPMENT.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.dept.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = activeFilter === 'All' || item.dept === activeFilter || item.status === activeFilter;
      return matchesSearch && matchesFilter;
    });
  }, [searchQuery, activeFilter]);

  return (
    <div className="flex h-screen bg-[#0A0A0B] text-slate-200 font-sans selection:bg-fuchsia-500/30">
      
      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-top-4 fade-in duration-300">
          <div className={`flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl border backdrop-blur-md ${
            toast.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
          }`}>
            {toast.type === 'success' ? <CheckCircle size={18} /> : <AlertTriangle size={18} />}
            <span className="font-medium text-sm">{toast.message}</span>
          </div>
        </div>
      )}

      <Sidebar currentView={currentView} setCurrentView={setCurrentView} role={role} setRole={setRole} />

      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-[#0A0A0B]/80 backdrop-blur-md sticky top-0 z-10">
          <h2 className="text-lg font-semibold text-white">
            {currentView === 'dashboard' && 'Welcome back, ' + (role === 'student' ? 'Alex' : 'Dr. Smith')}
            {currentView === 'explore' && 'Equipment Discovery'}
            {currentView === 'bookings' && (role === 'student' ? 'My Reservations' : 'Department Bookings')}
            {currentView === 'approvals' && 'Project Access Requests'}
          </h2>
          <div className="flex items-center gap-4">
            <button aria-label="Notifications" className="p-2 text-slate-400 hover:text-white transition-colors relative focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-full outline-none">
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
            <Dashboard stats={stats} EQUIPMENT={EQUIPMENT} setCurrentView={setCurrentView} setSelectedItem={setSelectedItem} setAiRecommendation={setAiRecommendation} />
          )}
          
          {currentView === 'explore' && (
            <Explore searchQuery={searchQuery} setSearchQuery={setSearchQuery} activeFilter={activeFilter} setActiveFilter={setActiveFilter} filteredEquipment={filteredEquipment} setSelectedItem={setSelectedItem} setAiRecommendation={setAiRecommendation} />
          )}

          {currentView === 'bookings' && <Bookings bookings={bookings} />}

          {currentView === 'approvals' && role === 'faculty' && <Approvals requests={requests} handleApproval={handleApproval} />}
        </div>
      </main>

      <BookingModal selectedItem={selectedItem} setSelectedItem={setSelectedItem} isAiResolving={isAiResolving} aiRecommendation={aiRecommendation} setAiRecommendation={setAiRecommendation} handleBookAttempt={handleBookAttempt} selectedTime={selectedTime} setSelectedTime={setSelectedTime} />
    </div>
  );
}