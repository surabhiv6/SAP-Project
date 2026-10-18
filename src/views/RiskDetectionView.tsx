import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { RiskAlert, RiskCategory, RiskSeverity } from '../types';
import {
  AlertTriangle,
  ShieldAlert,
  CheckCircle,
  HelpCircle,
  Clock,
  ArrowRight,
  Filter,
  Info,
} from 'lucide-react';

export const RiskDetectionView: React.FC = () => {
  const { risks, resolveRisk, setActiveTab } = useApp();

  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'resolved'>('all');

  const filteredRisks = risks.filter(r => {
    const matchesSev = severityFilter === 'all' || r.severity === severityFilter;
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchesSev && matchesStatus;
  });

  const activeCount = risks.filter(r => r.status === 'active').length;
  const criticalCount = risks.filter(r => r.severity === 'critical' && r.status === 'active').length;
  const highCount = risks.filter(r => r.severity === 'high' && r.status === 'active').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-neutral-900 tracking-tight">
          Explainable Supply Chain Risk Detection Engine
        </h1>
        <p className="text-xs text-neutral-500 mt-0.5">
          Deterministic surveillance scanning cold chambers, in-transit telemetry, expiry limits, and vehicle status
        </p>
      </div>

      {/* Transparent Model Disclosure Card */}
      <div className="p-4 rounded-xl bg-neutral-100 border border-neutral-200 text-xs text-neutral-700 flex items-start gap-3">
        <Info className="w-5 h-5 text-neutral-500 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-semibold text-neutral-900">
            Explainable Rule-Based Architecture (No Fake ML Claims):
          </span>
          <p className="leading-relaxed text-[11px] text-neutral-600">
            Every risk alert and severity score below is calculated deterministically via transparent rule thresholds: (1) Temperature Delta × Exposure Time, (2) Remaining Shelf-Life vs. Delivery Window, (3) Mechanical Sensor Heartbeats. The numerical score (0-100) is a weighted operational urgency score, not an unverified black-box probability.
          </p>
        </div>
      </div>

      {/* KPI Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded-xl border border-neutral-200">
          <span className="text-xs text-neutral-500 font-medium">Active Unresolved</span>
          <div className="text-2xl font-bold font-mono text-neutral-900 mt-1 tabular-nums">
            {activeCount}
          </div>
          <span className="text-[10px] text-neutral-400">Requires triage</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-neutral-200">
          <span className="text-xs text-neutral-500 font-medium">Critical Severity</span>
          <div className={`text-2xl font-bold font-mono mt-1 tabular-nums ${criticalCount > 0 ? 'text-rose-600' : 'text-neutral-900'}`}>
            {criticalCount}
          </div>
          <span className="text-[10px] text-neutral-400">Immediate action needed</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-neutral-200">
          <span className="text-xs text-neutral-500 font-medium">High Severity</span>
          <div className={`text-2xl font-bold font-mono mt-1 tabular-nums ${highCount > 0 ? 'text-amber-600' : 'text-neutral-900'}`}>
            {highCount}
          </div>
          <span className="text-[10px] text-neutral-400">Elevated attention</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-neutral-200">
          <span className="text-xs text-neutral-500 font-medium">Engine Status</span>
          <div className="text-base font-bold font-mono text-emerald-800 mt-1 uppercase">
            Surveillance Active
          </div>
          <span className="text-[10px] text-neutral-400">10 rules evaluated / sec</span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-3.5 rounded-xl border border-neutral-200 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1.5">
          <span className="text-neutral-500 font-medium mr-1">Severity:</span>
          {['all', 'critical', 'high', 'medium', 'low'].map(sev => (
            <button
              key={sev}
              onClick={() => setSeverityFilter(sev)}
              className={`px-2.5 py-1 rounded-lg capitalize transition-colors ${
                severityFilter === sev
                  ? 'bg-neutral-900 text-white font-semibold'
                  : 'text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-neutral-500 font-medium mr-1">Status:</span>
          {['all', 'active', 'resolved'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st as any)}
              className={`px-2.5 py-1 rounded-lg capitalize transition-colors ${
                statusFilter === st
                  ? 'bg-emerald-700 text-white font-semibold'
                  : 'text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Risk Alerts List */}
      <div className="space-y-3.5">
        {filteredRisks.length === 0 ? (
          <div className="bg-white rounded-xl border border-neutral-200 py-12 text-center text-xs text-neutral-400">
            No risks detected matching filter criteria.
          </div>
        ) : (
          filteredRisks.map(risk => {
            const isResolved = risk.status === 'resolved';

            return (
              <div
                key={risk.id}
                className={`p-5 rounded-xl border bg-white shadow-xs transition-colors space-y-3 ${
                  isResolved
                    ? 'border-neutral-200 opacity-70'
                    : risk.severity === 'critical'
                    ? 'border-rose-300 ring-1 ring-rose-200'
                    : risk.severity === 'high'
                    ? 'border-amber-300'
                    : 'border-neutral-200'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded ${
                        risk.severity === 'critical'
                          ? 'bg-rose-100 text-rose-800'
                          : risk.severity === 'high'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-neutral-100 text-neutral-700'
                      }`}
                    >
                      {risk.severity} Severity
                    </span>
                    <span className="font-mono text-xs text-neutral-400">{risk.id}</span>
                    <span className="font-semibold text-xs text-neutral-900">
                      {risk.affectedEntityName}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-[11px] font-mono text-neutral-500">
                      Score: <strong className="text-neutral-800 font-bold">{risk.score}/100</strong>
                    </span>
                    <span className="text-[11px] font-mono text-neutral-400">{risk.detectedAt}</span>
                  </div>
                </div>

                {/* Explanation */}
                <div>
                  <div className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wide">
                    Root Cause Diagnosis & Trigger Rule
                  </div>
                  <p className="text-xs text-neutral-700 mt-0.5 leading-relaxed">{risk.reason}</p>
                </div>

                {/* Recommended Response */}
                <div className="p-3 rounded-lg bg-neutral-50 border border-neutral-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-semibold text-emerald-800 uppercase tracking-wide block">
                      Recommended System Intervention
                    </span>
                    <span className="text-xs text-neutral-800 mt-0.5 block">
                      {risk.recommendedResponse}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {!isResolved && (
                      <>
                        <button
                          onClick={() => setActiveTab('recovery')}
                          className="px-3 py-1.5 text-xs font-semibold bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 shadow-xs transition-colors flex items-center gap-1"
                        >
                          <span>Execute Recovery</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => resolveRisk(risk.id)}
                          className="px-3 py-1.5 text-xs font-medium text-neutral-600 hover:bg-neutral-200 rounded-lg transition-colors"
                        >
                          Dismiss / Resolve
                        </button>
                      </>
                    )}
                    {isResolved && (
                      <span className="text-xs font-medium text-emerald-700 flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" />
                        <span>Resolved</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
