import React from 'react';
import { CheckCircle, Clock, CalendarX } from 'lucide-react';

export default function Bookings({ bookings }) {
  if (bookings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center animate-in fade-in duration-500">
        <div className="w-20 h-20 bg-white/[0.02] border border-white/[0.06] rounded-full flex items-center justify-center mb-6">
          <CalendarX size={32} className="text-slate-500" strokeWidth={1.5} />
        </div>
        <h3 className="text-xl font-medium text-white mb-2">No Reservations Yet</h3>
        <p className="text-slate-400 text-sm max-w-sm">You haven't booked any equipment. Head over to the Explore tab to discover available resources.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-300">
      <div className="bg-[#0F0F11] border border-white/[0.06] rounded-2xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/[0.06] bg-white/[0.02]">
              <th className="p-4 text-sm font-medium text-slate-400">Equipment</th>
              <th className="p-4 text-sm font-medium text-slate-400">Date</th>
              <th className="p-4 text-sm font-medium text-slate-400">Time Slot</th>
              <th className="p-4 text-sm font-medium text-slate-400">Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id} className="border-b border-white/[0.06] hover:bg-white/[0.02] transition-colors">
                <td className="p-4 text-white font-medium">{booking.equipment}</td>
                <td className="p-4 text-slate-300">{booking.date}</td>
                <td className="p-4 text-slate-300">{booking.time}</td>
                <td className="p-4">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                    booking.status.includes('Approved') ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}>
                    {booking.status.includes('Approved') ? <CheckCircle size={12} /> : <Clock size={12} />}
                    {booking.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}