import React from 'react';
import { CheckCircle, Clock } from 'lucide-react';

export default function Bookings({ bookings }) {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-[#121214] border border-white/5 rounded-2xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 bg-white/[0.02]">
              <th className="p-4 text-sm font-medium text-slate-400">Equipment</th>
              <th className="p-4 text-sm font-medium text-slate-400">Date</th>
              <th className="p-4 text-sm font-medium text-slate-400">Time Slot</th>
              <th className="p-4 text-sm font-medium text-slate-400">Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                <td className="p-4 text-white font-medium">{booking.equipment}</td>
                <td className="p-4 text-slate-300">{booking.date}</td>
                <td className="p-4 text-slate-300">{booking.time}</td>
                <td className="p-4">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                    booking.status.includes('Approved') ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
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