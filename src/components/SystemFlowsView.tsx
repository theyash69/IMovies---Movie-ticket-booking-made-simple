import React, { useState } from 'react';
import { SYSTEM_SEQUENCES } from '../data/architectureData';
import { GitCommit, ShieldAlert, ArrowRight, Zap, CheckCircle, RefreshCw } from 'lucide-react';

export const SystemFlowsView: React.FC = () => {
  const [activeSequenceId, setActiveSequenceId] = useState<string>('booking-flow');
  const [highlightStep, setHighlightStep] = useState<number | null>(null);

  const currentSequence =
    SYSTEM_SEQUENCES.find((s) => s.id === activeSequenceId) || SYSTEM_SEQUENCES[0];

  return (
    <div className="space-y-10 pb-16">
      {/* Header */}
      <div className="border-b border-slate-800 pb-6">
        <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 mb-1">
          <GitCommit className="w-4 h-4" />
          <span>Execution Flows & State Transitions</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          System Flows & Concurrency Sequences
        </h1>
        <p className="text-sm text-slate-400 mt-2 max-w-3xl leading-relaxed">
          Explore the exact transactional sequences governing real-time seat locks, race-condition mitigation,
          and ticket issuance across the distributed client-server ecosystem.
        </p>
      </div>

      {/* Flow Switcher Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        {SYSTEM_SEQUENCES.map((seq) => (
          <button
            key={seq.id}
            onClick={() => {
              setActiveSequenceId(seq.id);
              setHighlightStep(null);
            }}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              activeSequenceId === seq.id
                ? 'bg-cyan-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            {seq.title}
          </button>
        ))}
      </div>

      {/* Sequence Diagram Body */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Step-by-Step Interactive Flow Timeline (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
            <span>Protocol Sequence Steps</span>
            <span className="text-cyan-400 font-normal">Hover or click step to spotlight</span>
          </div>

          <div className="space-y-3">
            {currentSequence.steps.map((st) => {
              const isHighlighted = highlightStep === st.step;
              return (
                <div
                  key={st.step}
                  onMouseEnter={() => setHighlightStep(st.step)}
                  onClick={() => setHighlightStep(st.step)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isHighlighted
                      ? 'bg-cyan-500/15 border-cyan-400 shadow-md shadow-cyan-500/10'
                      : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-bold flex items-center justify-center font-mono">
                        {st.step}
                      </span>
                      <span className="text-xs font-bold text-white">
                        {st.from} ➔ {st.to}
                      </span>
                    </div>

                    <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-950 text-cyan-300 border border-slate-800">
                      {st.status}
                    </span>
                  </div>

                  <div className="text-xs font-mono text-cyan-400 font-semibold mb-1">
                    {st.action}
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">{st.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Concurrency Deep-Dive Callout Box (5 cols) */}
        <div className="lg:col-span-5 sticky top-24 space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <ShieldAlert className="w-4 h-4" />
              <span>Concurrency Guarantee Engine</span>
            </div>

            <h3 className="text-lg font-bold text-white">
              Preventing The "Double Booking" Race Condition
            </h3>

            <p className="text-xs text-slate-300 leading-relaxed">
              When high-demand tickets go on sale (e.g. blockbuster premiere), thousands of moviegoers may
              attempt to click the identical seat (e.g. Center Row E7) within the same 50-millisecond window.
            </p>

            <div className="space-y-3 pt-2 text-xs">
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
                <div className="font-bold text-cyan-400">1. Atomic Mutation Guard</div>
                <div className="text-slate-400">
                  We use MongoDB’s atomic <code className="text-white">findOneAndUpdate</code> with a strict query condition ensuring <code className="text-white">occupiedSeats: &#123; $nin: [seat] &#125;</code> and lock expiration validation.
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
                <div className="font-bold text-amber-400">2. 300-Second Mutex Lease (TTL)</div>
                <div className="text-slate-400">
                  A transient lease timestamp is written to the document. If the user abandons checkout or closes the tab, background cleanup immediately re-opens the seat with zero orphaned locks.
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
                <div className="font-bold text-emerald-400">3. Conflict Resolution (409 Conflict)</div>
                <div className="text-slate-400">
                  If another process secured the lock by a millisecond, the losing request receives an immediate 409 Conflict with an updated auditorium seat map.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
