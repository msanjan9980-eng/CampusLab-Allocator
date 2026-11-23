import React from 'react';
import { Calendar } from 'lucide-react';

export default function EquipmentCard({ item, onBook }) {
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
            aria-label={`Book slot for ${item.name}`}
            className="w-full py-2 rounded-xl bg-white/5 hover:bg-indigo-500 text-slate-300 hover:text-white text-sm font-medium transition-all flex items-center justify-center gap-2 group/btn focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none"
          >
            <Calendar size={16} className="text-slate-500 group-hover/btn:text-white transition-colors" />
            Book Slot
          </button>
        </div>
      </div>
    </div>
  );
}