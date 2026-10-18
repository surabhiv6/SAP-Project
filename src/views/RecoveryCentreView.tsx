import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { RecoveryAction } from '../types';
import {
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  DollarSign,
  Truck,
  Boxes,
  HelpCircle,
} from 'lucide-react';

export const RecoveryCentreView: React.FC = () => {
  const { recoveries, confirmRecoveryAction, vehicles, shipments, batches } = useApp();

  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  const pendingRecoveries = recoveries.filter(r => !r.confirmed);
  const completedRecoveries = recoveries.filter(r => r.confirmed);

  const handleConfirm = (id: string) => {
    confirmRecoveryAction(id);
    setConfirmingId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-neutral-900 tracking-tight">
          Smart Recovery & Mitigation Centre
        </h1>
        <p className="text-xs text-neutral-500 mt-0.5">
          Automated contingency workflows: dynamic fleet rerouting, cold chamber quarantine, and emergency supplier orders
        </p>
      </div>

      {/* Human-in-the-Loop Governance Notice */}
      <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200/90 flex items-start gap-3 text-xs text-emerald-950">
        <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-semibold text-emerald-900">
            Mandatory Operator Confirmation Safeguard:
          </span>
          <p className="leading-relaxed text-[11px] text-emerald-900">
            To prevent accidental inventory write-downs or costly unauthorized rerouting, all recovery recommendations require explicit human operator authorization before modifying shipment manifests or deducting batch ledger balances.
          </p>
        </div>
      </div>

      {/* Pending Recoveries */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-neutral-900">
            Recommended Actions Awaiting Authorization ({pendingRecoveries.length})
          </h2>
          <span className="text-xs text-neutral-400">Review estimated cost & reasoning</span>
        </div>

        {pendingRecoveries.length === 0 ? (
          <div className="bg-white rounded-xl border border-neutral-200 p-8 text-center text-xs text-neutral-400">
            All active disruptions have been mitigated. No pending recovery authorizations.
          </div>
        ) : (
          <div className="space-y-4">
            {pendingRecoveries.map(rec => {
              const isConfirming = confirmingId === rec.id;

              return (
                <div
                  key={rec.id}
                  className="bg-white rounded-xl border border-neutral-200 p-5 shadow-xs space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-neutral-100 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-neutral-800 bg-neutral-100 px-2 py-0.5 rounded">
                          {rec.id}
                        </span>
                        <h3 className="text-base font-bold text-neutral-900">{rec.title}</h3>
                      </div>
                      <div className="text-xs text-neutral-500 font-mono mt-1">
                        Trigger: {rec.triggerEvent} · Target: {rec.affectedItem}
                      </div>
                    </div>

                    <div className="text-left sm:text-right">
                      <span className="text-[10px] text-neutral-400 uppercase font-semibold">
                        Estimated Additional Cost
                      </span>
                      <div className="text-base font-bold font-mono text-neutral-900 tabular-nums">
                        ${rec.estimatedCostAddition.toFixed(2)} USD
                      </div>
                    </div>
                  </div>

                  {/* Reasoning & Proposed Action */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="p-3 rounded-lg bg-neutral-50 border border-neutral-200/80 space-y-1">
                      <span className="font-semibold text-neutral-800 text-[11px] uppercase tracking-wide">
                        1. System Reasoning & Cause Analysis
                      </span>
                      <p className="text-neutral-600 leading-relaxed text-[11px]">{rec.reasoning}</p>
                    </div>

                    <div className="p-3 rounded-lg bg-emerald-50/50 border border-emerald-200/80 space-y-1">
                      <span className="font-semibold text-emerald-900 text-[11px] uppercase tracking-wide">
                        2. Proposed Automated Mitigation Step
                      </span>
                      <p className="text-emerald-950 leading-relaxed text-[11px]">{rec.proposedAction}</p>
                    </div>
                  </div>

                  {/* Action Confirmation Strip */}
                  <div className="pt-2 flex items-center justify-between">
                    <span className="text-[11px] text-neutral-400">
                      Requires supervisor authorization
                    </span>

                    {isConfirming ? (
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-neutral-800">
                          Confirm execution?
                        </span>
                        <button
                          onClick={() => handleConfirm(rec.id)}
                          className="px-3.5 py-1.5 text-xs font-semibold bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 transition-colors shadow-xs"
                        >
                          Yes, Authorize & Dispatch
                        </button>
                        <button
                          onClick={() => setConfirmingId(null)}
                          className="px-3 py-1.5 text-xs font-medium text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmingId(rec.id)}
                        className="px-4 py-2 text-xs font-semibold bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 transition-colors shadow-xs flex items-center gap-1.5"
                      >
                        <span>Authorize Recovery Action</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Completed Recoveries Audit Log */}
      <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-xs space-y-3">
        <h2 className="text-sm font-semibold text-neutral-900">
          Authorized & Completed Recovery Executions ({completedRecoveries.length})
        </h2>

        {completedRecoveries.length === 0 ? (
          <div className="py-6 text-center text-xs text-neutral-400">
            No recovery actions executed yet.
          </div>
        ) : (
          <div className="divide-y divide-neutral-100">
            {completedRecoveries.map(rec => (
              <div key={rec.id} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <div className="font-semibold text-neutral-900">{rec.title}</div>
                  <div className="text-[11px] text-neutral-500 font-mono">
                    {rec.affectedItem} · Authorized at {rec.confirmedAt}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-emerald-800 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Executed (${rec.estimatedCostAddition.toFixed(2)})</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
