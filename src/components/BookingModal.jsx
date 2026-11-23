import React, { useState, useEffect } from 'react';
import { X, Sparkles, AlertTriangle, CheckCircle } from 'lucide-react';

const TypewriterText = ({ text, speed = 20 }) => {
  const [displayedText, setDisplayedText] = useState('');
  useEffect(() => {
    setDisplayedText(''); 
    let i = 0;
    const typingInterval = setInterval(() => {
      if (i < text.length) { setDisplayedText(text.substring(0, i + 1)); i++; } else { clearInterval(typingInterval); }
    }, speed);
    return () => clearInterval(typingInterval);
  }, [text, speed]);
  return <span>{displayedText}</span>;
};

export default function BookingModal({ selectedItem, setSelectedItem, isAiResolving, setIsAiResolving, aiRecommendation, setAiRecommendation, addBooking, selectedTime, setSelectedTime, simulateGenAI }) {
  const [justification, setJustification] = useState('');
  const [deadline, setDeadline] = useState(() => {
    const d = new Date(); d.setDate(d.getDate() + 7); return d.toISOString().split('T')[0];
  });

  // Accessibility: Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') { setSelectedItem(null); setAiRecommendation(null); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setSelectedItem, setAiRecommendation]);

  if (!selectedItem) return null;

  const handleBookAttempt = async () => {
    setIsAiResolving(true); setAiRecommendation(null);
    const result = await simulateGenAI(selectedItem, selectedTime, justification || "General lab work", deadline);
    setIsAiResolving(false); setAiRecommendation(result);

    if (!result.conflict) {
      const daysUntilDeadline = Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24));
      addBooking({
        id: Date.now(), equipment: selectedItem.name, date: deadline, time: selectedTime,
        status: 'Pending Faculty Approval', justification: justification || "General lab work",
        urgency: daysUntilDeadline <= 3 ? 'High' : 'Medium'
      });
    }
  };

  const handleAcceptAlternative = () => {
    const daysUntilDeadline = Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24));
    addBooking({
      id: Date.now(), equipment: "Prusa MK3S+ FDM Printer (Alternative)", date: deadline, time: selectedTime,
      status: 'Pending Faculty Approval', justification: justification ? `${justification} (AI suggested alternative)` : "AI suggested alternative",
      urgency: daysUntilDeadline <= 3 ? 'High' : 'Medium'
    });
    setSelectedItem(null); setAiRecommendation(null);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#0F0F11] border border-white/10 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-200">
        <div className="h-32 relative">
          <img src={selectedItem.image} alt={selectedItem.name} className="w-full h-full object-cover opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F11] to-transparent"></div>
          <button aria-label="Close modal" onClick={() => { setSelectedItem(null); setAiRecommendation(null); }} className="absolute top-4 right-4 p-2 bg-black/40 hover:bg-black/60 rounded-full text-white transition-colors focus-visible:ring-2 focus-visible:ring-white outline-none"><X size={20} /></button>
        </div>
        
        <div className="p-6 relative pt-2">
          <div className="mb-6">
            <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">{selectedItem.dept}</span>
            <h2 className="text-xl font-bold text-white mt-1">{selectedItem.name}</h2>
          </div>

          {!aiRecommendation && !isAiResolving && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-2">Time Slot</label>
                  <div className="grid gap-2">
                    {['09:00 - 11:00', '11:00 - 13:00', '14:00 - 16:00', '16:00 - 18:00'].map(time => (
                      <button key={time} onClick={() => setSelectedTime(time)} className={`py-2 text-xs rounded-lg font-medium border transition-all ${selectedTime === time ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300' : 'bg-black/40 border-white/10 text-slate-400 hover:border-white/30'}`}>{time}</button>
                    ))}
                  </div>
                </div>
                <div>
                   <label className="block text-xs font-medium text-slate-400 mb-2">Project Deadline</label>
                   <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none [color-scheme:dark]" />
                   <p className="text-[10px] text-slate-500 mt-2 leading-tight">The GenAI engine uses this date to prioritize requests.</p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Project Requirements (GenAI Evaluates)</label>
                <textarea value={justification} onChange={(e) => setJustification(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-indigo-500 focus:outline-none h-20 resize-none text-sm" placeholder="e.g., I need to print a prototype urgently..."></textarea>
              </div>
              <button onClick={handleBookAttempt} className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 text-white font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F0F11] outline-none">
                <Sparkles size={18} /> Request Allocation
              </button>
            </div>
          )}

          {isAiResolving && (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-fuchsia-400 animate-pulse" size={24} />
              </div>
              <div>
                <h3 className="text-white font-medium">GenAI is evaluating constraints...</h3>
                <p className="text-sm text-slate-400 mt-1">Analyzing deadlines, availability, and requirements.</p>
              </div>
            </div>
          )}

          {aiRecommendation && !isAiResolving && (
            <div className={`p-4 rounded-2xl border ${aiRecommendation.conflict ? 'bg-amber-500/10 border-amber-500/20' : 'bg-emerald-500/10 border-emerald-500/20'}`}>
              <div className="flex items-start gap-3">
                {aiRecommendation.conflict ? <AlertTriangle className="text-amber-400 shrink-0" /> : <CheckCircle className="text-emerald-400 shrink-0" />}
                <div>
                  <h4 className={`font-semibold ${aiRecommendation.conflict ? 'text-amber-400' : 'text-emerald-400'}`}>{aiRecommendation.conflict ? 'Conflict Detected' : 'Allocation Optimized'}</h4>
                  <p className="text-sm text-slate-300 mt-1 leading-relaxed"><TypewriterText text={aiRecommendation.message} /></p>
                  <div className="mt-4 p-3 bg-black/40 rounded-xl border border-white/5">
                    <p className="text-xs text-indigo-300 font-medium flex items-center gap-1 mb-1"><Sparkles size={12}/> AI Recommendation</p>
                    <p className="text-sm text-slate-300"><TypewriterText text={aiRecommendation.suggestion} speed={15} /></p>
                  </div>
                  <button onClick={aiRecommendation.conflict ? handleAcceptAlternative : () => { setSelectedItem(null); setAiRecommendation(null); }} className="mt-4 w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-colors text-sm focus-visible:ring-2 focus-visible:ring-white outline-none">
                    {aiRecommendation.conflict ? 'Accept Alternative' : 'Close'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}