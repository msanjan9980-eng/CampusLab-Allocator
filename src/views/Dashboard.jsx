import React from 'react';
import { Sparkles, ChevronRight } from 'lucide-react';
import EquipmentCard from '../components/EquipmentCard';

export default function Dashboard({ stats, EQUIPMENT, setCurrentView, setSelectedItem, setAiRecommendation }) {
  return (
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
        <div className="absolute top-0 right-0 p-4 opacity-10"><Sparkles size={120} /></div>
        <div className="flex items-start gap-4 relative z-10">
          <div className="p-3 bg-indigo-500/20 rounded-xl text-indigo-400"><Sparkles size={24} /></div>
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
          <button onClick={() => setCurrentView('explore')} className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1 focus-visible:ring-2 focus-visible:ring-indigo-500 rounded px-1 outline-none">
            View All <ChevronRight size={16} />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {EQUIPMENT.slice(0, 3).map(item => (
            <EquipmentCard key={item.id} item={item} onBook={() => { setSelectedItem(item); setAiRecommendation(null); }} />
          ))}
        </div>
      </div>
    </div>
  );
}