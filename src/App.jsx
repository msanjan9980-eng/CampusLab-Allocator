import React, { useState, useMemo, useEffect } from 'react';
import { CheckCircle, AlertTriangle, Bell, UserCircle2, Microscope, Box, Cpu, Activity, FlaskConical, Clock, Search } from 'lucide-react';

import Sidebar from './components/Sidebar';
import BookingModal from './components/BookingModal';
import Dashboard from './views/Dashboard';
import Explore from './views/Explore';
import Bookings from './views/Bookings';
import Approvals from './views/Approvals';

// High-Quality, Reliable Images
const EQUIPMENT = [
  { id: 1, name: 'High-Res Fluorescence Microscope', dept: 'Biology', type: 'Microscope', status: 'Available', icon: Microscope, image: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?q=80&w=800&auto=format&fit=crop' },
  { id: 2, name: 'Industrial 3D Printer (Resin)', dept: 'Engineering', type: '3D Printing', status: 'In Use', icon: Box, image: 'https://images.unsplash.com/photo-1615870216519-2f9fa575fa5c?q=80&w=800&auto=format&fit=crop' },
  { id: 3, name: 'NVIDIA Jetson Nano Kit', dept: 'Computer Science', type: 'Dev Kit', status: 'Available', icon: Cpu, image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop' },
  { id: 4, name: 'Digital Oscilloscope 200MHz', dept: 'Electronics', type: 'Measurement', status: 'Available', icon: Activity, image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=800&auto=format&fit=crop' },
  { id: 5, name: 'Chemical Fume Hood', dept: 'Chemistry', type: 'Safety', status: 'Maintenance', icon: FlaskConical, image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=800&auto=format&fit=crop' },
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
  
  const [requests, setRequests] = useState(() => {
    const saved = localStorage.getItem('lablink_requests');
    return saved ? JSON.parse(saved) : INITIAL_REQUESTS;
  });
  const [bookings, setBookings] = useState(() => {
    const saved = localStorage.getItem('lablink_bookings');
    return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
  });

  useEffect(() => {
    localStorage.setItem('lablink_requests', JSON.stringify(requests));
    localStorage.setItem('lablink_bookings', JSON.stringify(bookings));
  }, [requests, bookings]);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedItem, setSelectedItem] = useState(null);
  const [isAiResolving, setIsAiResolving] = useState(false);
  const [aiRecommendation, setAiRecommendation] = useState(null);
  const [selectedTime, setSelectedTime] = useState('10:00 - 12:00');
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleApproval = (id, status) => {
    setRequests(requests.map(req => req.id === id ? { ...req, status } : req));
    showToast(`Request ${status.toLowerCase()} successfully.`, status === 'Approved' ? 'success' : 'error');
  };

  const addBooking = (newBooking) => {
    setBookings(prev => [...prev, newBooking]);
    showToast('Booking request submitted successfully!');
  };

  const simulateGenAI = (item, time, justification) => {
    return new Promise(resolve => setTimeout(() => {
      let conflict = false;
      let message = "Resource allocated successfully. I've cross-referenced your project deadline and optimized the slot.";
      let suggestion = "Booking confirmed. Please arrive 10 minutes early for equipment calibration.";

      if (item.status === 'In Use' || item.status === 'Maintenance') {
        conflict = true;
        message = `I detected a scheduling conflict. The ${item.name} is currently marked as ${item.status}.`;
        suggestion = `I recommend booking the 'Prusa MK3S+ FDM Printer' instead. It has the same capabilities for your project "${justification}" and is available at your requested slot.`;
      } 
      else if (time === '14:00 - 16:00' && item.id === 4) {
        conflict = true;
        message = "High demand detected for this equipment at 14:00. A faculty lab session is already scheduled.";
        suggestion = "I suggest moving your request to the 16:00 - 18:00 slot, which is currently empty, or using the secondary Oscilloscope in Lab B.";
      }
      else if (justification.toLowerCase().includes('print') && item.id !== 2) {
        message = "Resource allocated. However, I noticed your project mentions 'printing'. Are you sure you don't need the Engineering 3D Printer?";
      } 
      else if (justification.toLowerCase().includes('urgent') || justification.toLowerCase().includes('deadline')) {
        message = "Priority flag applied. Based on your justification, I have escalated this request to the Department Head for immediate approval.";
        suggestion = "Booking confirmed. Fast-tracked calibration will be ready for you.";
      }

      resolve({ conflict, message, suggestion });
    }, 1800));
  };

  const stats = useMemo(() => [
    { label: 'Available Equipment', value: EQUIPMENT.filter(e => e.status === 'Available').length.toString(), icon: Box, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
    { label: 'Active Projects', value: '18', icon: Activity, color: 'text-fuchsia-400', bg: 'bg-fuchsia-400/10' },
    { label: 'Pending Approvals', value: requests.filter(r => r.status === 'Pending').length.toString(), icon: Clock, color: 'text-amber-400', bg: 'bg-amber-400/10' },
    { label: 'Resource Utilization', value: '78%', icon: Cpu, color: 'text-indigo-400', bg: 'bg-indigo-400/10' },
  ], [requests]);

  const filteredEquipment = useMemo(() => {
    return EQUIPMENT.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.dept.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = activeFilter === 'All' || item.dept === activeFilter || item.status === activeFilter;
      return matchesSearch && matchesFilter;
    });
  }, [searchQuery, activeFilter]);

  return (
    <div className="flex h-screen bg-[#050505] text-slate-200 font-sans selection:bg-indigo-500/30 antialiased">
      
      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-top-4 fade-in duration-300">
          <div className={`flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl border backdrop-blur-md ${
            toast.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
          }`}>
            {toast.type === 'success' ? <CheckCircle size={18} /> : <AlertTriangle size={18} />}
            <span className="font-medium text-sm tracking-wide">{toast.message}</span>
          </div>
        </div>
      )}

      <Sidebar currentView={currentView} setCurrentView={setCurrentView} role={role} setRole={setRole} />

      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-20 border-b border-white/[0.06] flex items-center justify-between px-10 bg-[#050505]/80 backdrop-blur-xl sticky top-0 z-10">
          <h2 className="text-xl font-medium tracking-tight text-white">
            {currentView === 'dashboard' && 'Overview'}
            {currentView === 'explore' && 'Equipment Discovery'}
            {currentView === 'bookings' && (role === 'student' ? 'My Reservations' : 'Department Bookings')}
            {currentView === 'approvals' && 'Project Access Requests'}
          </h2>
          <div className="flex items-center gap-6">
            <button aria-label="Notifications" className="p-2 text-slate-400 hover:text-white transition-colors relative outline-none">
              <Bell size={20} strokeWidth={1.5} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-fuchsia-500 rounded-full border-2 border-[#050505]"></span>
            </button>
            <div className="flex items-center gap-4 pl-6 border-l border-white/10">
              <div className="text-right hidden md:block">
                <p className="text-sm font-medium text-white">{role === 'student' ? 'Alex Mercer' : 'Dr. Smith'}</p>
                <p className="text-xs text-slate-500">{role === 'student' ? 'Computer Science' : 'Faculty - Engineering'}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500/20 to-fuchsia-500/20 border border-white/10 flex items-center justify-center">
                <UserCircle2 size={24} className="text-slate-300" strokeWidth={1.5} />
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-10 scroll-smooth">
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

      <BookingModal selectedItem={selectedItem} setSelectedItem={setSelectedItem} isAiResolving={isAiResolving} setIsAiResolving={setIsAiResolving} aiRecommendation={aiRecommendation} setAiRecommendation={setAiRecommendation} addBooking={addBooking} selectedTime={selectedTime} setSelectedTime={setSelectedTime} simulateGenAI={simulateGenAI} />
    </div>
  );
}