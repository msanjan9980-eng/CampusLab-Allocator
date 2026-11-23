import React, { useState } from 'react';
import { Calendar, Image as ImageIcon, Star } from 'lucide-react';

export default function EquipmentCard({ item, onBook, isFavorite, toggleFavorite }) {
  const Icon = item.icon;
  const [imgError, setImgError] = useState(false);

  return (
    <div className="bg-[#0F0F11] border border-white/[0.06] rounded-2xl overflow-hidden group hover:border-white/[0.15] transition-all duration-300 flex flex-col hover:shadow-2xl hover:shadow-black/50 hover:-translate-y-1 relative">
      <button 
        onClick={(e) => { e.stopPropagation(); toggleFavorite(item.id); }}
        className={`absolute top-3 left-3 z-20 p-2 rounded-full backdrop-blur-md transition-all ${isFavorite ? 'bg-amber-500/20 text-amber-400' : 'bg-black/40 text-white/50 hover:text-white opacity-0 group-hover:opacity-100'}`}
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      >
        <Star size={14} fill={isFavorite ? "currentColor" : "none"} />
      </button>

      <div className="h-44 relative overflow-hidden bg-[#18181B]">
        {!imgError ? (
          <img src={item.image} alt={item.name} onError={() => setImgError(true)} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-600 bg-[#18181B]">
            <ImageIcon size={32} strokeWidth={1} className="mb-2" />
            <span className="text-[10px] uppercase tracking-wider font-medium">Image Unavailable</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F11] via-transparent to-transparent"></div>
        <div className="absolute top-3 right-3">
          <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider backdrop-blur-md border ${
            item.status === 'Available' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
            item.status === 'In Use' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 
            'bg-rose-500/10 text-rose-400 border-rose-500/20'
          }`}>
            {item.status}
          </span>
        </div>
      </div>
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-start gap-3 mb-4">
          <div className="p-2 bg-white/[0.04] rounded-lg text-slate-300 border border-white/[0.04]">
            <Icon size={16} strokeWidth={2} />
          </div>
          <div>
            <h3 className="text-sm font-medium text-white leading-tight line-clamp-1 group-hover:text-indigo-300 transition-colors">{item.name}</h3>
            <p className="text-xs text-slate-500 mt-1 font-medium">{item.dept}</p>
          </div>
        </div>
        <div className="mt-auto pt-4">
          <button onClick={onBook} className="w-full py-2 rounded-lg bg-white/[0.04] hover:bg-indigo-500 text-slate-300 hover:text-white text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 border border-white/[0.06] hover:border-indigo-400">
            <Calendar size={14} strokeWidth={2} /> Book Slot
          </button>
        </div>
      </div>
    </div>
  );
}