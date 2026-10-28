import React, { useState } from 'react';
import { ER_ENTITIES } from '../data/architectureData';
import { EREntity } from '../types';
import { Network, Database, Key, Link2, Copy, Check, FileCode2 } from 'lucide-react';

export const ERDiagramView: React.FC = () => {
  const [selectedEntityId, setSelectedEntityId] = useState<string>('Booking');
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  const activeEntity = ER_ENTITIES.find((e) => e.id === selectedEntityId) || ER_ENTITIES[0];

  const handleCopyCode = () => {
    navigator.clipboard.writeText(activeEntity.mongooseSchemaCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="space-y-10 pb-16">
      {/* Title */}
      <div className="border-b border-slate-800 pb-6">
        <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 mb-1">
          <Network className="w-4 h-4" />
          <span>Database Modeling & Relational Schema</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Entity-Relationship (ER) Diagram & Schema
        </h1>
        <p className="text-sm text-slate-400 mt-2 max-w-3xl leading-relaxed">
          The IMovies data model is normalized for consistency while optimized with embedded seat vectors for high-speed
          atomic concurrency checks. Select any entity to inspect fields, foreign keys, and production Mongoose models.
        </p>
      </div>

      {/* Visual ER Interactive Canvas / Graph */}
      <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Database className="w-4 h-4 text-cyan-400" />
            <span>Interactive Entity Graph</span>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" /> Primary Key
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block" /> Foreign Key
            </span>
          </div>
        </div>

        {/* Entities Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {ER_ENTITIES.map((entity) => {
            const isSelected = selectedEntityId === entity.id;
            return (
              <button
                key={entity.id}
                onClick={() => setSelectedEntityId(entity.id)}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-slate-900 border-cyan-400 shadow-lg shadow-cyan-500/10'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-mono font-bold text-cyan-400">
                      {entity.collection}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {entity.fields.length} attrs
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white">{entity.name}</h3>
                  <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">
                    {entity.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 mt-3 text-[10px] text-slate-400 font-mono">
                  {entity.relationships.length} relationship{entity.relationships.length > 1 ? 's' : ''}
                </div>
              </button>
            );
          })}
        </div>

        {/* Relationship Cardinality Summary Strip */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs flex flex-wrap items-center justify-around gap-4 text-slate-300">
          <div className="flex items-center gap-2">
            <span className="font-mono text-cyan-400 font-bold">User (1)</span>
            <span className="text-slate-500">─── 1:N ───</span>
            <span className="font-mono text-white font-bold">Booking (N)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-cyan-400 font-bold">Movie (1)</span>
            <span className="text-slate-500">─── 1:N ───</span>
            <span className="font-mono text-white font-bold">Showtime (N)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-cyan-400 font-bold">Auditorium (1)</span>
            <span className="text-slate-500">─── 1:N ───</span>
            <span className="font-mono text-white font-bold">Showtime (N)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-cyan-400 font-bold">Showtime (1)</span>
            <span className="text-slate-500">─── 1:N ───</span>
            <span className="font-mono text-white font-bold">Booking (N)</span>
          </div>
        </div>
      </div>

      {/* Selected Entity Deep-Dive: Fields & Mongoose Code */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Fields and Constraints Table (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span>{activeEntity.name} Attribute Specification</span>
              <span className="text-xs font-mono text-slate-500 font-normal">
                ({activeEntity.collection})
              </span>
            </h3>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Field Name</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Key / Index</th>
                  <th className="py-3 px-4">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
                {activeEntity.fields.map((field) => (
                  <tr key={field.name} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-2.5 px-4 font-bold text-white flex items-center gap-1.5">
                      {field.name}
                      {field.required && <span className="text-rose-400 font-sans">*</span>}
                    </td>
                    <td className="py-2.5 px-4 text-cyan-400">{field.type}</td>
                    <td className="py-2.5 px-4">
                      {field.isPrimary ? (
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-500/15 text-amber-400 border border-amber-500/30 font-bold">
                          PK
                        </span>
                      ) : field.isForeign ? (
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 font-bold">
                          FK ➔ {field.foreignTable}
                        </span>
                      ) : (
                        <span className="text-slate-500">-</span>
                      )}
                    </td>
                    <td className="py-2.5 px-4 font-sans text-slate-400 text-[11px]">
                      {field.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Relationships callout */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="text-xs font-bold text-white flex items-center gap-2">
              <Link2 className="w-4 h-4 text-cyan-400" />
              <span>Cardinality & Associated Entities</span>
            </div>
            {activeEntity.relationships.map((rel, idx) => (
              <div key={idx} className="text-xs text-slate-300 flex items-center gap-2">
                <span className="font-mono text-cyan-400 font-bold">[{rel.cardinality}]</span>
                <span>{rel.description}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Mongoose Schema Code Viewer (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <FileCode2 className="w-4 h-4 text-cyan-400" />
              <span>Production Mongoose Model</span>
            </h3>
            <button
              onClick={handleCopyCode}
              className="px-2.5 py-1 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              {copiedCode ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Schema</span>
                </>
              )}
            </button>
          </div>

          <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-[#070a10]">
            <div className="p-3 bg-slate-950 border-b border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
              <span>models/{activeEntity.name}.ts</span>
              <span className="text-emerald-400">Strict Validation</span>
            </div>
            <pre className="p-4 text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed">
              <code>{activeEntity.mongooseSchemaCode}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
