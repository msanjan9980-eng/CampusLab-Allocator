import React from 'react';
import { Check } from 'lucide-react';

export default function Approvals({ requests, handleApproval }) {
  // Sort so Pending requests are always at the top
  const sortedRequests = [...requests].sort((a, b) => {
    if (a.status === 'Pending' && b.status !== 'Pending') return -1;
    if (a.status !== 'Pending' && b.status === 'Pending') return 1;
    return 0;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {sortedRequests.map(req => (
        <div key={req.id} className={`bg-[#0F0F11] border ${req.status === 'Pending' ? 'border-indigo-500/30' : 'border-white/[0.06]'} rounded-2xl p-6 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between hover:border-white/[0.12] transition-colors`}>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h4 className="text-lg font-semibold text-white">{req.student}</h4>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                req.urgency === 'High' ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'
              }`}>
                {req.urgency} Priority
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                req.status === 'Pending' ? 'bg-indigo-500/20 text-indigo-400 animate-pulse' : 
                req.status === 'Approved' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
              }`}>
                {req.status}
              </span>
            </div>
            <p className="text-sm text-slate-300 mb-1"><span className="text-slate-500">Project:</span> {req.project}</p>
            <div className="flex items-center gap-4 text-sm text-slate-300">
              <p><span className="text-slate-500">Equipment:</span> {req.equipment}</p>
              <span className="text-slate-700">|</span>
              <p><span className="text-slate-500">Deadline:</span> <span className="text-rose-300 font-medium">{req.deadline || req.date}</span></p>
            </div>
          </div>
          
          {req.status === 'Pending' && (
            <div className="flex gap-2 w-full md:w-auto">
              <button onClick={() => handleApproval(req.id, 'Rejected')} className="flex-1 md:flex-none px-4 py-2 rounded-xl border border-white/10 text-slate-300 hover:bg-rose-500/10 hover:text-rose-400 hover:border-rose-500/30 transition-all text-sm font-medium focus-visible:ring-2 focus-visible:ring-rose-500 outline-none">
                Reject
              </button>
              <button onClick={() => handleApproval(req.id, 'Approved')} className="flex-1 md:flex-none px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white shadow-lg shadow-indigo-500/20 transition-all text-sm font-medium flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none">
                <Check size={16} /> Approve
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}