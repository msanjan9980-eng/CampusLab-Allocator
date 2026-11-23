import React from 'react';
import { Sparkles, ChevronRight, BarChart2, Activity, CheckCircle2, Clock, ShieldCheck } from 'lucide-react';
import EquipmentCard from '../components/EquipmentCard';

export default function Dashboard({ stats, EQUIPMENT, setCurrentView, setSelectedItem, setAiRecommendation }) {
  const utilizationData = [
    { dept: 'Engineering', pct: 85, color: 'bg-indigo-500' },
    { dept: 'Biology', pct: 45, color: 'bg-emerald-500' },
    { dept: 'Computer Science', pct: 65, color: 'bg-fuchsia-500' },
    { dept: 'Electronics', pct: 30, color: 'bg-amber-500' },
  ];

  const liveActivity = [
    { id: 1, text: "Sarah Chen booked Fluorescence Microscope", time: "2 mins ago", icon: CheckCircle2, color: "text-emerald-400" },
    { id: 2, text: "Dr. Smith approved 3D Printer request", time: "15 mins ago", icon: ShieldCheck, color: "text-indigo-400" },
    { id: 3, text: "AI resolved conflict for Jetson Nano", time: "1 hr ago", icon: Sparkles, color: "text-fuchsia-400" },
    { id: 4, text: "Alex Mercer requested Oscilloscope", time: "2 hrs ago", icon: Clock, color: "text-amber-400" },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-[#121214] border border-white/5 rounded-2xl p-5 flex items-start justify-between hover:bg-white/[0.02] transition-colors">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* GenAI Banner */}
        <div className="lg:col-span-2 bg-gradient-to-r from-indigo-500/10 to-fuchsia-500/10 border border-indigo-500/20 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-center">
          <div className="absolute top-0 right-0 p-4 opacity-10"><Sparkles size={120} /></div>
          <div className="flex items-start gap-4 relative z-10">
            <div className="p-3 bg-indigo-500/20 rounded-xl text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.2)]"><Sparkles size={24} /></div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">GenAI Resource Optimization Active</h3>
              <p className="text-slate-400 text-sm max-w-xl">
                Based on your upcoming project deadlines, I've optimized the allocation for the Engineering department. 
                I've automatically resolved 3 scheduling conflicts this morning. Your requested slot for the <span className="text-white font-medium">Oscilloscope</span> has been confirmed.
              </p>
            </div>
          </div>
        </div>

        {/* Live Activity Feed */}
        <div className="bg-[#121214] border border-white/5 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Activity size={18} className="text-indigo-400" />
            <h3 className="text-sm font-semibold text-white">Live Campus Activity</h3>
          </div>
          <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
            {liveActivity.map((activity) => (
              <div key={activity.id} className="relative flex items-center gap-3">
                <div className={`p-1.5 rounded-full bg-[#0A0A0B] border border-white/10 z-10 ${activity.color}`}>
                  <activity.icon size={12} />
                </div>
                <div>
                  <p className="text-xs text-slate-300">{activity.text}</p>
                  <p className="text-[10px] text-slate-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Analytics Chart */}
        <div className="bg-[#121214] border border-white/5 rounded-2xl p-6 lg:col-span-1">
          <div className="flex items-center gap-2 mb-6">
            <BarChart2 size={18} className="text-slate-400" />
            <h3 className="text-sm font-semibold text-white">Utilization Rate</h3>
          </div>
          <div className="space-y-4">
            {utilizationData.map(data => (
              <div key={data.dept}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-300 font-medium">{data.dept}</span>
                  <span className="text-slate-500">{data.pct}%</span>
                </div>
                <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${data.color} shadow-[0_0_10px_currentColor]`} style={{ width: `${data.pct}%`, opacity: 0.8 }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Available Equipment */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Available Near You</h3>
            <button onClick={() => setCurrentView('explore')} className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1 focus-visible:ring-2 focus-visible:ring-indigo-500 rounded px-1 outline-none">
              View All <ChevronRight size={16} />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {EQUIPMENT.slice(0, 2).map(item => (
              <EquipmentCard key={item.id} item={item} onBook={() => { setSelectedItem(item); setAiRecommendation(null); }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}