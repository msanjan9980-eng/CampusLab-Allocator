import React from 'react';
import { Check, ShieldCheck, Download } from 'lucide-react';

export default function Approvals({ requests, handleApproval }) {
  const sortedRequests = [...requests].sort((a, b) => {
    if (a.status === 'Pending' && b.status !== 'Pending') return -1;
    if (a.status !== 'Pending' && b.status === 'Pending') return 1;
    return 0;
  });

  const exportToCSV = () => {
    const headers = ['Student', 'Project', 'Equipment', 'Deadline', 'Urgency', 'Status'];
    const csvData = requests.map(r => [r.student, r.project, r.equipment, r.deadline || r.date, r.urgency, r.status].join(','));
    const csvContent = [headers.join(','), ...csvData].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'lablink_approvals.csv';
    link.click();
  };

  if (requests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center animate-in fade-in duration-500">
        <div className="w-20 h-20 bg-emerald-500/[0.02] border border-emerald-500/[0.06] rounded-full flex items-center justify-center mb-6">
          <ShieldCheck size={32} className="text-emerald-500/50" strokeWidth={1.5} />
        </div>
        <h3 className="text-xl font-medium text-white mb-2">All Caught Up!</h3>
        <p className="text-slate-400 text-sm max-w-sm">There are no pending access requests for the faculty to review right now.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-4 animate-in fade-in duration-300">
      <div className="flex justify-end mb-4">
        <button onClick={exportToCSV} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] text-sm text-slate-300 transition-colors">
          <Download size={16} /> Export CSV
        </button>
      </div>
      {sortedRequests.map(req => (
        <div key={req.id} className={`bg-[#0F0F11] border ${req.status === 'Pending' ? 'border-indigo-500/30' : 'border-white/[0.06]'} rounded-2xl p-6 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between hover:border-white/[0.12] transition-colors`}>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h4 className="text-lg font-semibold text-white">{req.student}</h4>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${req.urgency === 'High' ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'}`}>{req.urgency} Priority</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${req.status === 'Pending' ? 'bg-indigo-500/20 text-indigo-400 animate-pulse' : req.status === 'Approved' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>{req.status}</span>
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
              <button onClick={() => handleApproval(req.id, 'Rejected')} className="flex-1 md:flex-none px-4 py-2 rounded-xl border border-white/10 text-slate-300 hover:bg-rose-500/10 hover:text-rose-400 hover:border-rose-500/30 transition-all text-sm font-medium">Reject</button>
              <button onClick={() => handleApproval(req.id, 'Approved')} className="flex-1 md:flex-none px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white shadow-lg shadow-indigo-500/20 transition-all text-sm font-medium flex items-center justify-center gap-2"><Check size={16} /> Approve</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}