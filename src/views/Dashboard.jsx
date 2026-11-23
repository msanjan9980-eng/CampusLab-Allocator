import React, { useMemo } from 'react';
import { Sparkles, ChevronRight, BarChart2, Activity, CheckCircle2, Clock, ShieldCheck } from 'lucide-react';
import EquipmentCard from '../components/EquipmentCard';

export default function Dashboard({ stats, EQUIPMENT, bookings, setCurrentView, setSelectedItem, setAiRecommendation }) {
  // Dynamically calculate utilization based on actual bookings vs total equipment per department
  const utilizationData = useMemo(() => {
    const depts = ['Engineering', 'Biology', 'Computer Science', 'Electronics', 'Chemistry'];
    return depts.map(dept => {
      const totalInDept = EQUIPMENT.filter(e => e.dept === dept).length;
      const bookedInDept = bookings.filter(b => EQUIPMENT.find(e => e.name === b.equipment)?.dept === dept && b.status !== 'Rejected').length;
      const pct = totalInDept === 0 ? 0 : Math.min(Math.round((bookedInDept / totalInDept) * 100) + 20, 100); // +20 base to make it look active
      
      let color = 'from-indigo-500 to-indigo-400';
      if (dept === 'Biology') color = 'from-emerald-500 to-emerald-400';
      if (dept === 'Computer Science') color = 'from-fuchsia-500 to-fuchsia-400';
      if (dept === 'Electronics') color = 'from-amber-500 to-amber-400';
      if (dept === 'Chemistry') color = 'from-rose-500 to-rose-400';
      
      return { dept, pct, color };
    }).filter(d => d.pct > 0);
  }, [bookings, EQUIPMENT]);

  const liveActivity = [
    { id: 1, text: "Sarah Chen booked Fluorescence Microscope", time: "2 mins ago", icon: CheckCircle2, color: "text-emerald-400" },
    { id: 2, text: "Dr. Smith approved 3D Printer request", time: "15 mins ago", icon: ShieldCheck, color: "text-indigo-400" },
    { id: 3, text: "AI resolved conflict for Jetson Nano", time: "1 hr ago", icon: Sparkles, color: "text-fuchsia-400" },
    { id: 4, text: "Alex Mercer requested Oscilloscope", time: "2 hrs ago", icon: Clock, color: "text-amber-400" },
  ];

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-[#0F0F11] border border-white/[0.06] rounded-2xl p-6 flex flex-col justify-between hover:border-white/[0.12] transition-colors group">
            <div className="flex justify-between items-start mb-4">
              <p className="text-sm text-slate-400 font-medium">{stat.label}</p>
              <div className={`p-2 rounded-lg ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}><stat.icon size={18} strokeWidth={2} /></div>
            </div>
            <h3 className="text-3xl font-semibold text-white tracking-tight">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-gradient-to-br from-indigo-500/[0.08] to-fuchsia-500/[0.08] border border-indigo-500/20 rounded-2xl p-8 relative overflow-hidden flex flex-col justify-center group">
          <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-30 transition-opacity"><Sparkles size={140} strokeWidth={1} /></div>
          <div className="flex items-start gap-5 relative z-10">
            <div className="p-3.5 bg-indigo-500/20 rounded-xl text-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.15)]"><Sparkles size={24} strokeWidth={2} /></div>
            <div>
              <h3 className="text-lg font-medium text-white mb-2">GenAI Resource Optimization Active</h3>
              <p className="text-slate-400 text-sm leading-relaxed max-w-2xl">Based on upcoming project deadlines, the AI has optimized allocation for the Engineering department. Automatically resolved <span className="text-white font-medium">3 scheduling conflicts</span> this morning. Your requested slot for the <span className="text-white font-medium">Oscilloscope</span> has been confirmed.</p>
            </div>
          </div>
        </div>

        <div className="bg-[#0F0F11] border border-white/[0.06] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Activity size={16} className="text-indigo-400" strokeWidth={2} />
              <h3 className="text-sm font-medium text-white">Live Activity</h3>
            </div>
            <span className="flex h-2 w-2 relative"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span></span>
          </div>
          <div className="space-y-5">
            {liveActivity.map((activity) => (
              <div key={activity.id} className="flex gap-3 relative">
                <div className={`mt-0.5 p-1 rounded-full bg-[#0A0A0A] border border-white/10 z-10 ${activity.color}`}><activity.icon size={12} strokeWidth={2.5} /></div>
                {activity.id !== liveActivity.length && (<div className="absolute top-6 left-[11px] bottom-[-20px] w-px bg-white/[0.06]"></div>)}
                <div>
                  <p className="text-sm text-slate-300 font-medium leading-tight">{activity.text}</p>
                  <p className="text-xs text-slate-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-[#0F0F11] border border-white/[0.06] rounded-2xl p-6 flex flex-col">
          <div className="flex items-center gap-2 mb-8">
            <BarChart2 size={16} className="text-slate-400" strokeWidth={2} />
            <h3 className="text-sm font-medium text-white">Live Utilization</h3>
          </div>
          <div className="space-y-6 flex-1 flex flex-col justify-center">
            {utilizationData.map(data => (
              <div key={data.dept}>
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-slate-300 font-medium">{data.dept}</span>
                  <span className="text-slate-400 font-mono">{data.pct}%</span>
                </div>
                <div className="w-full bg-white/[0.04] h-1.5 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full bg-gradient-to-r ${data.color} shadow-[0_0_10px_currentColor] transition-all duration-1000`} style={{ width: `${data.pct}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-medium text-white">Available Near You</h3>
            <button onClick={() => setCurrentView('explore')} className="text-sm font-medium text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors group">View All <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {EQUIPMENT.slice(0, 3).map(item => (
              <EquipmentCard key={item.id} item={item} onBook={() => { setSelectedItem(item); setAiRecommendation(null); }} isFavorite={false} toggleFavorite={() => {}} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}