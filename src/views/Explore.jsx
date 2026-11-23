import React from 'react';
import { Search, X } from 'lucide-react';
import EquipmentCard from '../components/EquipmentCard';

export default function Explore({ searchQuery, setSearchQuery, activeFilter, setActiveFilter, filteredEquipment, setSelectedItem, setAiRecommendation }) {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search equipment, departments..." 
            className="w-full bg-[#121214] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
              <X size={16} />
            </button>
          )}
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
          {['All', 'Available', 'Engineering', 'Computer Science', 'Biology'].map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors border ${
                activeFilter === filter ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300' : 'bg-[#121214] border-white/10 text-slate-400 hover:text-white hover:border-white/20'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>
      
      {filteredEquipment.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEquipment.map(item => (
            <EquipmentCard key={item.id} item={item} onBook={() => { setSelectedItem(item); setAiRecommendation(null); }} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-[#121214] border border-white/5 rounded-2xl">
          <Search className="mx-auto text-slate-500 mb-4" size={48} />
          <h3 className="text-lg font-medium text-white mb-1">No equipment found</h3>
          <p className="text-slate-400 text-sm">Try adjusting your search query or filters.</p>
        </div>
      )}
    </div>
  );
}