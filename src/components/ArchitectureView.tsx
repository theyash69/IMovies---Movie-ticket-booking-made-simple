import React, { useState } from 'react';
import { ARCHITECTURE_LAYERS } from '../data/architectureData';
import { Layers, Server, Database, Shield, Zap, Terminal, ArrowDown, Code2, Cpu } from 'lucide-react';

export const ArchitectureView: React.FC = () => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('seat-lock-service');

  const allNodes = ARCHITECTURE_LAYERS.flatMap((l) => l.nodes);
  const activeNode = allNodes.find((n) => n.id === selectedNodeId) || allNodes[0];

  return (
    <div className="space-y-10 pb-16">
      {/* Hero Header */}
      <div className="border-b border-slate-800 pb-6">
        <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 mb-1">
          <Layers className="w-4 h-4" />
          <span>Technical Architecture & Client-Server Topology</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          System Architecture & Concurrency Blueprint
        </h1>
        <p className="text-sm text-slate-400 mt-2 max-w-3xl leading-relaxed">
          The IMovies leverages an Express.js and MongoDB client-server architecture engineered for high-throughput
          seat reservations, optimistic mutex locking, and sub-100ms query performance.
        </p>
      </div>

      {/* Interactive System Architecture Layers Diagram */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Architecture Topology Diagram (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>Tiered Architecture Pipeline</span>
            <span className="text-cyan-400 text-[11px] font-normal">Click any node to inspect</span>
          </div>

          <div className="space-y-4">
            {ARCHITECTURE_LAYERS.map((layer, lIdx) => (
              <div key={layer.id} className="relative">
                <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-cyan-400" />
                      {layer.name}
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono">Tier 0{lIdx + 1}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {layer.nodes.map((node) => {
                      const isSelected = selectedNodeId === node.id;
                      return (
                        <button
                          key={node.id}
                          onClick={() => setSelectedNodeId(node.id)}
                          className={`p-3.5 rounded-lg border text-left transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-cyan-500/15 border-cyan-500 text-white shadow-md shadow-cyan-500/10'
                              : 'bg-slate-950/80 border-slate-800/90 text-slate-400 hover:text-white hover:border-slate-700'
                          }`}
                        >
                          <div className="text-xs font-bold text-white mb-0.5">{node.name}</div>
                          <div className="text-[11px] font-mono text-cyan-400 truncate">
                            {node.tech}
                          </div>
                          {node.metrics && (
                            <div className="text-[10px] text-slate-500 mt-2 font-mono">
                              ⚡ {node.metrics}
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Downward connecting pipeline arrow */}
                {lIdx < ARCHITECTURE_LAYERS.length - 1 && (
                  <div className="flex justify-center my-1">
                    <div className="w-0.5 h-4 bg-slate-800 relative flex items-center justify-center">
                      <ArrowDown className="w-3 h-3 text-slate-600 -bottom-1 absolute" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Selected Node Deep-Dive Inspector (5 cols) */}
        <div className="lg:col-span-5 sticky top-24">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-5">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] uppercase font-mono font-bold text-cyan-400">
                  Node Inspector
                </span>
                <h3 className="text-xl font-bold text-white mt-0.5">{activeNode.name}</h3>
                <div className="text-xs font-mono text-cyan-300 mt-1">{activeNode.tech}</div>
              </div>

              <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400">
                <Cpu className="w-5 h-5" />
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">{activeNode.description}</p>

            <div className="space-y-2 pt-2 border-t border-slate-800">
              <div className="text-xs font-bold text-white uppercase tracking-wider">
                Core Architectural Responsibilities
              </div>
              <ul className="space-y-2">
                {activeNode.responsibilities.map((resp, rIdx) => (
                  <li key={rIdx} className="text-xs text-slate-400 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </div>

            {activeNode.metrics && (
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-400">Target SLA / Latency:</span>
                <span className="font-mono font-bold text-emerald-400">{activeNode.metrics}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tech Stack Matrix */}
      <section className="space-y-4 pt-6 border-t border-slate-800">
        <h3 className="text-lg font-bold text-white">Full-Stack Technology Matrix</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="font-bold text-cyan-400">Frontend Layer</div>
            <p className="text-slate-400 leading-relaxed">
              React 19 SPA, Tailwind CSS v4, Motion engine, Canvas Confetti, Lucide icons.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="font-bold text-amber-400">Backend Gateway</div>
            <p className="text-slate-400 leading-relaxed">
              Express.js 4.21, Node.js 22 LTS, JSON body parsers, CORS, Helmet security headers.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="font-bold text-emerald-400">Persistence & ODM</div>
            <p className="text-slate-400 leading-relaxed">
              MongoDB 7 Replica Set, Mongoose 8 ODM, compound indexes, TTL eviction timers.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="font-bold text-purple-400">Security & Concurrency</div>
            <p className="text-slate-400 leading-relaxed">
              Atomic findOneAndUpdate seat mutex, JWT Bearer tokens, bcrypt salt hashing, rate limiters.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
