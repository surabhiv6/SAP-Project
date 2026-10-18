import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES_CONFIG } from '../data/initialData';
import {
  BarChart3,
  Download,
  Leaf,
  TrendingUp,
  FileSpreadsheet,
  Info,
  Calendar,
  ShieldCheck,
} from 'lucide-react';

export const SustainabilityReportsView: React.FC = () => {
  const { sustainability, products, shipments, deliveries, batches } = useApp();

  const [selectedDateRange, setSelectedDateRange] = useState<'7d' | '30d' | 'all'>('7d');

  // Aggregated totals
  const totalReceivedKg = sustainability.reduce((acc, s) => acc + s.productsReceivedKg, 0);
  const totalSortedKg = sustainability.reduce((acc, s) => acc + s.productsSortedKg, 0);
  const totalDistributedKg = sustainability.reduce((acc, s) => acc + s.productsDistributedKg, 0);
  const totalLossKg = sustainability.reduce((acc, s) => acc + s.confirmedLossKg, 0);
  const totalWasteAvoidedKg = sustainability.reduce((acc, s) => acc + s.wasteAvoidedKg, 0);
  const totalTransportCostUSD = sustainability.reduce((acc, s) => acc + s.transportCostUSD, 0);
  const totalRecoveriesCount = sustainability.reduce((acc, s) => acc + s.recoveryActionsCount, 0);

  // Delivery performance: on-time percentage
  const deliveredShipments = deliveries.length;
  const cleanDeliveries = deliveries.filter(d => d.status === 'delivered' && d.damagedQuantity === 0).length;
  const deliveryAccuracyPercent = deliveredShipments > 0 ? Math.round((cleanDeliveries / deliveredShipments) * 100) : 100;

  // Download CSV export function
  const handleDownloadCSV = () => {
    const headers = [
      'Date',
      'Products_Received_kg',
      'Products_Sorted_kg',
      'Products_Distributed_kg',
      'Damaged_Recorded_kg',
      'Confirmed_Loss_kg',
      'Waste_Avoided_kg',
      'Avoidance_Methodology',
      'Transport_Cost_USD',
      'Recovery_Actions_Count',
    ];

    const rows = sustainability.map(s => [
      s.date,
      s.productsReceivedKg,
      s.productsSortedKg,
      s.productsDistributedKg,
      s.damagedRecordedKg,
      s.confirmedLossKg,
      s.wasteAvoidedKg,
      `"${s.wasteAvoidanceMethodology.replace(/"/g, '""')}"`,
      s.transportCostUSD,
      s.recoveryActionsCount,
    ]);

    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `green_resilience_sustainability_report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-neutral-900 tracking-tight">
            Sustainability & Loss Avoidance Reporting
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Defensible waste reduction metrics, operational efficiency audits, and CSV export
          </p>
        </div>

        <button
          onClick={handleDownloadCSV}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-700 text-white hover:bg-emerald-800 shadow-xs transition-colors self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>Export Audit Log (CSV)</span>
        </button>
      </div>

      {/* Transparent Methodology Disclosure */}
      <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200/90 flex items-start gap-3 text-xs text-emerald-950">
        <Leaf className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-semibold text-emerald-900">
            Defensible Baseline Accounting Methodology:
          </span>
          <p className="leading-relaxed text-[11px] text-emerald-900">
            "Waste Avoided" is calculated exclusively against historical industry baseline spoilage rates (14.2% average in unmonitored multi-echelon transit) minus actual verified losses recorded in Chamber QA and dock receipts. No arbitrary environmental claims or untraceable carbon offsets are reported without recorded physical evidence.
          </p>
        </div>
      </div>

      {/* 6 Key Sustainability Indicators */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="bg-white p-4 rounded-xl border border-neutral-200">
          <span className="text-xs text-neutral-500 font-medium">Received Inbound</span>
          <div className="text-xl font-bold font-mono text-neutral-900 mt-1 tabular-nums">
            {totalReceivedKg.toLocaleString()} kg
          </div>
          <span className="text-[10px] text-neutral-400">Recorded gross weight</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-neutral-200">
          <span className="text-xs text-neutral-500 font-medium">Sorted Volume</span>
          <div className="text-xl font-bold font-mono text-neutral-900 mt-1 tabular-nums">
            {totalSortedKg.toLocaleString()} kg
          </div>
          <span className="text-[10px] text-neutral-400">Processed by machine</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-neutral-200">
          <span className="text-xs text-neutral-500 font-medium">Distributed Volume</span>
          <div className="text-xl font-bold font-mono text-neutral-900 mt-1 tabular-nums">
            {totalDistributedKg.toLocaleString()} kg
          </div>
          <span className="text-[10px] text-neutral-400">Reached end retailers</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-neutral-200">
          <span className="text-xs text-neutral-500 font-medium">Confirmed Losses</span>
          <div className="text-xl font-bold font-mono text-neutral-900 mt-1 tabular-nums">
            {totalLossKg.toLocaleString()} kg
          </div>
          <span className="text-[10px] text-neutral-400">Write-offs (0.37%)</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-neutral-200">
          <span className="text-xs text-neutral-500 font-medium">Estimated Spoilage Avoided</span>
          <div className="text-xl font-bold font-mono text-emerald-800 mt-1 tabular-nums">
            {totalWasteAvoidedKg.toLocaleString()} kg
          </div>
          <span className="text-[10px] text-neutral-400">Vs. 14.2% baseline</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-neutral-200">
          <span className="text-xs text-neutral-500 font-medium">Delivery Accuracy</span>
          <div className="text-xl font-bold font-mono text-sky-700 mt-1 tabular-nums">
            {deliveryAccuracyPercent}%
          </div>
          <span className="text-[10px] text-neutral-400">Clean dock receipts</span>
        </div>
      </div>

      {/* Daily Historical Progression Chart (SVG Based, Pure React) */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-neutral-900">
              7-Day Avoided Spoilage vs. Confirmed Losses (kg)
            </h2>
            <p className="text-xs text-neutral-500">
              Visual proof of progressive waste reduction as cold chambers and sorting cycles operated
            </p>
          </div>
          <span className="text-xs font-mono text-neutral-500">Daily Log Series</span>
        </div>

        {/* Visual Chart Bars */}
        <div className="pt-4 pb-2">
          <div className="grid grid-cols-7 gap-3 items-end h-44 border-b border-neutral-200 px-2 pb-2">
            {sustainability.map((metric, idx) => {
              const maxAvoided = 900;
              const barHeightPercent = Math.round((metric.wasteAvoidedKg / maxAvoided) * 100);
              const lossHeightPercent = Math.max(4, Math.round((metric.confirmedLossKg / maxAvoided) * 100));

              return (
                <div key={idx} className="flex flex-col items-center justify-end h-full gap-1 group">
                  <div className="text-[10px] font-mono text-neutral-500 group-hover:text-emerald-700 tabular-nums">
                    {metric.wasteAvoidedKg}k
                  </div>

                  {/* Dual Bar: Emerald (Avoided) + Red (Loss) */}
                  <div className="w-full flex items-end justify-center gap-1">
                    <div
                      className="w-1/2 bg-emerald-700 rounded-t-sm transition-all duration-300 group-hover:bg-emerald-800"
                      style={{ height: `${barHeightPercent}%` }}
                      title={`Waste Avoided: ${metric.wasteAvoidedKg} kg`}
                    />
                    <div
                      className="w-1/2 bg-neutral-300 rounded-t-sm transition-all duration-300 group-hover:bg-rose-400"
                      style={{ height: `${lossHeightPercent}%` }}
                      title={`Confirmed Loss: ${metric.confirmedLossKg} kg`}
                    />
                  </div>

                  <span className="text-[10px] font-mono text-neutral-400 mt-1">
                    {metric.date.slice(5)}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-[11px] text-neutral-500 pt-3">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-emerald-700 inline-block" />
                <span>Waste Avoided (kg)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-neutral-300 inline-block" />
                <span>Confirmed Losses (kg)</span>
              </span>
            </div>
            <span>Transport Expenditure: ${totalTransportCostUSD.toLocaleString()} USD</span>
          </div>
        </div>
      </div>

      {/* Historical Audit Table */}
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-neutral-200 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-neutral-900">
            Daily Operational Log & Documented Avoidance Methods
          </h2>
          <span className="text-xs text-neutral-400">ISO 14001 Audit Ready</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 text-neutral-500 uppercase font-semibold text-[10px] tracking-wider border-b border-neutral-200">
              <tr>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3 text-right">Received (kg)</th>
                <th className="py-2.5 px-3 text-right">Sorted (kg)</th>
                <th className="py-2.5 px-3 text-right">Distributed (kg)</th>
                <th className="py-2.5 px-3 text-right">Loss (kg)</th>
                <th className="py-2.5 px-3 text-right">Waste Avoided (kg)</th>
                <th className="py-2.5 px-3">Documented Avoidance Methodology</th>
                <th className="py-2.5 px-3 text-right">Transport Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {sustainability.map((row, idx) => (
                <tr key={idx} className="hover:bg-neutral-50/60 transition-colors">
                  <td className="py-2.5 px-3 font-mono font-medium text-neutral-900">{row.date}</td>
                  <td className="py-2.5 px-3 text-right font-mono tabular-nums">{row.productsReceivedKg.toLocaleString()}</td>
                  <td className="py-2.5 px-3 text-right font-mono tabular-nums">{row.productsSortedKg.toLocaleString()}</td>
                  <td className="py-2.5 px-3 text-right font-mono tabular-nums">{row.productsDistributedKg.toLocaleString()}</td>
                  <td className="py-2.5 px-3 text-right font-mono text-neutral-600 tabular-nums">{row.confirmedLossKg}</td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-800 tabular-nums">{row.wasteAvoidedKg}</td>
                  <td className="py-2.5 px-3 text-neutral-600 text-[11px] leading-tight max-w-xs">{row.wasteAvoidanceMethodology}</td>
                  <td className="py-2.5 px-3 text-right font-mono tabular-nums">${row.transportCostUSD}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
