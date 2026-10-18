import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES_CONFIG } from '../data/initialData';
import {
  ClockAlert,
  AlertTriangle,
  ShieldAlert,
  Calendar,
  Sparkles,
  Info,
  ArrowRight,
  Filter,
} from 'lucide-react';

export const ExpiryMonitoringView: React.FC = () => {
  const { products, setActiveTab } = useApp();

  const [filterMode, setFilterMode] = useState<'all' | 'urgent' | 'medium' | 'safe' | 'missing'>('all');

  // Categorize products by expiry condition
  const categorized = products.map(p => {
    let status: 'urgent' | 'medium' | 'safe' | 'missing' | 'expired' = 'safe';
    if (!p.expiryDate) {
      status = 'missing';
    } else if (p.remainingDays !== undefined) {
      if (p.remainingDays <= 0) status = 'expired';
      else if (p.remainingDays <= 3) status = 'urgent';
      else if (p.remainingDays <= 10) status = 'medium';
      else status = 'safe';
    }
    return { ...p, expiryState: status };
  });

  const filtered = categorized.filter(p => {
    if (filterMode === 'all') return true;
    if (filterMode === 'urgent') return p.expiryState === 'urgent' || p.expiryState === 'expired';
    if (filterMode === 'medium') return p.expiryState === 'medium';
    if (filterMode === 'safe') return p.expiryState === 'safe';
    if (filterMode === 'missing') return p.expiryState === 'missing';
    return true;
  });

  const urgentCount = categorized.filter(p => p.expiryState === 'urgent' || p.expiryState === 'expired').length;
  const mediumCount = categorized.filter(p => p.expiryState === 'medium').length;
  const safeCount = categorized.filter(p => p.expiryState === 'safe').length;
  const missingCount = categorized.filter(p => p.expiryState === 'missing').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-neutral-900 tracking-tight">
          Expiry & Remaining-Life Monitoring
        </h1>
        <p className="text-xs text-neutral-500 mt-0.5">
          Perishable shelf-life monitoring, transparent prediction distinction, and strict pharmaceutical safety flags
        </p>
      </div>

      {/* Critical Regulatory Disclaimer */}
      <div className="p-4 rounded-xl bg-purple-50/70 border border-purple-200/90 text-xs text-purple-950 space-y-1.5">
        <div className="flex items-center gap-2 font-semibold">
          <ShieldAlert className="w-4 h-4 text-purple-700" />
          <span>Transparent Distinction: Printed Expiry vs. AI Usable Life Estimation</span>
        </div>
        <p className="text-purple-900 leading-relaxed text-[11px]">
          1. <strong>Recorded Expiry:</strong> Legally binding manufacturer lot dates verified on packaging. Expired medicines are quarantined immediately and <em>never</em> redistributed.<br />
          2. <strong>Estimated Usable Life:</strong> Applied to produce & chilled perishables based on temperature exposure records. It represents a theoretical planning guideline, not an absolute microbiological safety guarantee.
        </p>
      </div>

      {/* Filter Tabs & Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <button
          onClick={() => setFilterMode('urgent')}
          className={`p-3.5 rounded-xl border text-left transition-colors ${
            filterMode === 'urgent'
              ? 'border-rose-400 bg-rose-50/60 shadow-xs'
              : 'border-neutral-200 bg-white hover:border-neutral-300'
          }`}
        >
          <div className="text-xs font-medium text-rose-800">Critical / Imminent (&le;3d)</div>
          <div className="text-xl font-bold font-mono text-rose-700 mt-1 tabular-nums">
            {urgentCount}
          </div>
          <div className="text-[10px] text-neutral-400 mt-0.5">Prioritize express dispatch</div>
        </button>

        <button
          onClick={() => setFilterMode('medium')}
          className={`p-3.5 rounded-xl border text-left transition-colors ${
            filterMode === 'medium'
              ? 'border-amber-400 bg-amber-50/60 shadow-xs'
              : 'border-neutral-200 bg-white hover:border-neutral-300'
          }`}
        >
          <div className="text-xs font-medium text-amber-800">Approaching (4 - 10d)</div>
          <div className="text-xl font-bold font-mono text-amber-600 mt-1 tabular-nums">
            {mediumCount}
          </div>
          <div className="text-[10px] text-neutral-400 mt-0.5">FIFO rotation review</div>
        </button>

        <button
          onClick={() => setFilterMode('safe')}
          className={`p-3.5 rounded-xl border text-left transition-colors ${
            filterMode === 'safe'
              ? 'border-emerald-400 bg-emerald-50/60 shadow-xs'
              : 'border-neutral-200 bg-white hover:border-neutral-300'
          }`}
        >
          <div className="text-xs font-medium text-emerald-800">Stable (&gt;10d)</div>
          <div className="text-xl font-bold font-mono text-emerald-700 mt-1 tabular-nums">
            {safeCount}
          </div>
          <div className="text-[10px] text-neutral-400 mt-0.5">Normal inventory life</div>
        </button>

        <button
          onClick={() => setFilterMode('missing')}
          className={`p-3.5 rounded-xl border text-left transition-colors ${
            filterMode === 'missing'
              ? 'border-neutral-400 bg-neutral-100 shadow-xs'
              : 'border-neutral-200 bg-white hover:border-neutral-300'
          }`}
        >
          <div className="text-xs font-medium text-neutral-700">Non-expiring / No Date</div>
          <div className="text-xl font-bold font-mono text-neutral-900 mt-1 tabular-nums">
            {missingCount}
          </div>
          <div className="text-[10px] text-neutral-400 mt-0.5">Manufactured & durable</div>
        </button>
      </div>

      {/* Main Expiry Table */}
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-neutral-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-neutral-900">
              Perishable Inventory Surveillance
            </span>
            <span className="text-xs text-neutral-400">· Filter: {filterMode.toUpperCase()}</span>
          </div>

          {filterMode !== 'all' && (
            <button
              onClick={() => setFilterMode('all')}
              className="text-xs text-emerald-800 hover:underline font-medium"
            >
              Clear Filter (Show All {products.length})
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50/80 border-b border-neutral-200 text-neutral-500 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Product Name & Category</th>
                <th className="py-3 px-4">Batch ID</th>
                <th className="py-3 px-4">Manufacturer Date</th>
                <th className="py-3 px-4">Recorded Expiry</th>
                <th className="py-3 px-4">Remaining Days</th>
                <th className="py-3 px-4">Estimated Usable Life</th>
                <th className="py-3 px-4">Storage Chamber</th>
                <th className="py-3 px-4 text-right">Recommended Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-neutral-400">
                    No items in this filter bracket.
                  </td>
                </tr>
              ) : (
                filtered.map(p => {
                  const isMedicine = p.category === 'medicines';
                  const isPerishable = ['vegetables_fruits', 'dairy', 'meat_seafood'].includes(p.category);

                  return (
                    <tr key={p.id} className="hover:bg-neutral-50/60 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-semibold text-neutral-900">{p.name}</div>
                        <div className="text-[10px] text-neutral-400 font-mono">
                          {CATEGORIES_CONFIG[p.category]?.name || p.category}
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono text-neutral-700">{p.batchNumber}</td>
                      <td className="py-3 px-4 font-mono text-neutral-600">
                        {p.manufacturingDate || 'N/A'}
                      </td>
                      <td className="py-3 px-4 font-mono font-medium text-neutral-900">
                        {p.expiryDate || <span className="text-neutral-400 font-normal">N/A</span>}
                      </td>
                      <td className="py-3 px-4">
                        {p.remainingDays !== undefined ? (
                          <span
                            className={`font-mono font-bold tabular-nums ${
                              p.remainingDays <= 3
                                ? 'text-rose-600'
                                : p.remainingDays <= 10
                                ? 'text-amber-600'
                                : 'text-emerald-700'
                            }`}
                          >
                            {p.remainingDays} days
                          </span>
                        ) : (
                          <span className="text-neutral-400">--</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {isPerishable && p.estimatedRemainingLifeDays !== undefined ? (
                          <div className="space-y-0.5">
                            <span className="font-mono text-neutral-800 text-[11px]">
                              ~{p.estimatedRemainingLifeDays} days (±1d)
                            </span>
                            <div className="text-[10px] text-neutral-400">
                              Chamber cold factor: nominal
                            </div>
                          </div>
                        ) : isMedicine ? (
                          <span className="text-[11px] text-neutral-400 italic">
                            Strict chemical lot date enforced
                          </span>
                        ) : (
                          <span className="text-neutral-400">--</span>
                        )}
                      </td>
                      <td className="py-3 px-4 font-mono text-neutral-700 text-[11px]">
                        {p.targetChamberId}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {p.remainingDays !== undefined && p.remainingDays <= 3 ? (
                          <button
                            onClick={() => setActiveTab('destination')}
                            className="px-2.5 py-1 text-[11px] font-semibold bg-rose-700 text-white rounded hover:bg-rose-800 transition-colors"
                          >
                            Urgent Reroute &rarr;
                          </button>
                        ) : (
                          <button
                            onClick={() => setActiveTab('destination')}
                            className="text-emerald-800 hover:underline font-medium text-[11px]"
                          >
                            Plan Destination
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
