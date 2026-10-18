import React from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES_CONFIG } from '../data/initialData';
import {
  Package,
  Layers,
  GitFork,
  AlertCircle,
  Clock,
  ThermometerSnowflake,
  Truck,
  RotateCcw,
  TrendingDown,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const {
    products,
    batches,
    chambers,
    shipments,
    risks,
    recoveries,
    sustainability,
    setActiveTab,
  } = useApp();

  // Computations for live metrics
  const totalProductsCount = products.length;
  const totalInventoryQuantity = batches.reduce((acc, b) => acc + b.availableQuantity, 0);
  const productsSortedCount = products.filter(p => p.sortedStatus === 'sorted').length;
  const productsNeedsInspection = products.filter(
    p => p.inspectionStatus === 'needs_manual_inspection' || p.sortedStatus === 'flagged'
  ).length;

  const productsApproachingExpiry = products.filter(
    p => p.remainingDays !== undefined && p.remainingDays <= 5 && p.remainingDays > 0
  ).length;

  const storageConditionAlerts = chambers.reduce((acc, c) => acc + c.activeAlerts.length, 0);
  const activeShipmentsCount = shipments.filter(s => s.status === 'in_transit').length;
  const delayedDeliveriesCount = shipments.filter(s => s.status === 'delayed').length;
  const highRiskShipmentsCount = shipments.filter(s => s.tempAlert || s.simulatedEvent === 'breakdown').length;
  const recordedLossesKg = sustainability.reduce((acc, s) => acc + s.confirmedLossKg, 0);
  const recoveryRecommendedCount = recoveries.filter(r => !r.confirmed).length;
  const totalWasteAvoidedKg = sustainability.reduce((acc, s) => acc + s.wasteAvoidedKg, 0);

  // Category breakdown
  const categoryCounts = Object.keys(CATEGORIES_CONFIG).map(catKey => {
    const prods = products.filter(p => p.category === catKey);
    const qty = prods.reduce((sum, p) => sum + p.quantity, 0);
    return {
      category: catKey,
      config: CATEGORIES_CONFIG[catKey as keyof typeof CATEGORIES_CONFIG],
      count: prods.length,
      quantity: qty,
    };
  });

  // Inspection stats
  const inspectionStats = {
    acceptable: products.filter(p => p.inspectionStatus === 'acceptable').length,
    needs_manual_inspection: products.filter(p => p.inspectionStatus === 'needs_manual_inspection').length,
    damaged: products.filter(p => p.inspectionStatus === 'damaged').length,
    storage_compliance_concern: products.filter(p => p.inspectionStatus === 'storage_compliance_concern').length,
  };

  // Active risk items
  const activeRisks = risks.filter(r => r.status === 'active');

  return (
    <div className="space-y-6">
      {/* Hero Welcome & Tagline */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>Central Operations Dashboard</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-neutral-900 tracking-tight">
            GREEN RESILIENCE AI
          </h1>
          <p className="text-sm text-neutral-600 mt-1">
            Smart Sorting. Safer Storage. Resilient Supply Chains.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab('sorting')}
            className="px-3.5 py-2 text-xs font-medium rounded-lg bg-emerald-700 text-white hover:bg-emerald-800 transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <span>Open Sorting Line</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setActiveTab('trucks')}
            className="px-3.5 py-2 text-xs font-medium rounded-lg bg-neutral-100 text-neutral-700 hover:bg-neutral-200 transition-colors"
          >
            Track Active Fleet
          </button>
        </div>
      </div>

      {/* Primary KPI Grid (12 core metrics from specs) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3.5">
        {/* Metric 1 */}
        <div className="bg-white p-4 rounded-xl border border-neutral-200">
          <div className="text-xs text-neutral-500 font-medium truncate">Total Products</div>
          <div className="text-2xl font-bold text-neutral-900 mt-1 tabular-nums font-mono">
            {totalProductsCount}
          </div>
          <div className="text-[11px] text-neutral-400 mt-0.5">Across 7 categories</div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-4 rounded-xl border border-neutral-200">
          <div className="text-xs text-neutral-500 font-medium truncate">Available Stock</div>
          <div className="text-2xl font-bold text-neutral-900 mt-1 tabular-nums font-mono">
            {totalInventoryQuantity.toLocaleString()}
          </div>
          <div className="text-[11px] text-neutral-400 mt-0.5">Units / kg / L combined</div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-4 rounded-xl border border-neutral-200">
          <div className="text-xs text-neutral-500 font-medium truncate">Products Sorted</div>
          <div className="text-2xl font-bold text-emerald-700 mt-1 tabular-nums font-mono">
            {productsSortedCount}
          </div>
          <div className="text-[11px] text-neutral-400 mt-0.5">
            {Math.round((productsSortedCount / Math.max(1, totalProductsCount)) * 100)}% categorized
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white p-4 rounded-xl border border-neutral-200">
          <div className="text-xs text-neutral-500 font-medium truncate">Needs Inspection</div>
          <div className={`text-2xl font-bold mt-1 tabular-nums font-mono ${productsNeedsInspection > 0 ? 'text-amber-600' : 'text-neutral-900'}`}>
            {productsNeedsInspection}
          </div>
          <div className="text-[11px] text-neutral-400 mt-0.5">Manual check pending</div>
        </div>

        {/* Metric 5 */}
        <div className="bg-white p-4 rounded-xl border border-neutral-200">
          <div className="text-xs text-neutral-500 font-medium truncate">Near Expiry (&le;5d)</div>
          <div className={`text-2xl font-bold mt-1 tabular-nums font-mono ${productsApproachingExpiry > 0 ? 'text-rose-600' : 'text-neutral-900'}`}>
            {productsApproachingExpiry}
          </div>
          <div className="text-[11px] text-neutral-400 mt-0.5">Perishable items priority</div>
        </div>

        {/* Metric 6 */}
        <div className="bg-white p-4 rounded-xl border border-neutral-200">
          <div className="text-xs text-neutral-500 font-medium truncate">Chamber Alerts</div>
          <div className={`text-2xl font-bold mt-1 tabular-nums font-mono ${storageConditionAlerts > 0 ? 'text-rose-600' : 'text-emerald-700'}`}>
            {storageConditionAlerts}
          </div>
          <div className="text-[11px] text-neutral-400 mt-0.5">Climate violations</div>
        </div>

        {/* Metric 7 */}
        <div className="bg-white p-4 rounded-xl border border-neutral-200">
          <div className="text-xs text-neutral-500 font-medium truncate">Active Shipments</div>
          <div className="text-2xl font-bold text-neutral-900 mt-1 tabular-nums font-mono">
            {activeShipmentsCount}
          </div>
          <div className="text-[11px] text-neutral-400 mt-0.5">En route with telemetry</div>
        </div>

        {/* Metric 8 */}
        <div className="bg-white p-4 rounded-xl border border-neutral-200">
          <div className="text-xs text-neutral-500 font-medium truncate">Delayed Deliveries</div>
          <div className={`text-2xl font-bold mt-1 tabular-nums font-mono ${delayedDeliveriesCount > 0 ? 'text-amber-600' : 'text-neutral-900'}`}>
            {delayedDeliveriesCount}
          </div>
          <div className="text-[11px] text-neutral-400 mt-0.5">Transit delay flagged</div>
        </div>

        {/* Metric 9 */}
        <div className="bg-white p-4 rounded-xl border border-neutral-200">
          <div className="text-xs text-neutral-500 font-medium truncate">High-Risk Transit</div>
          <div className={`text-2xl font-bold mt-1 tabular-nums font-mono ${highRiskShipmentsCount > 0 ? 'text-rose-600' : 'text-neutral-900'}`}>
            {highRiskShipmentsCount}
          </div>
          <div className="text-[11px] text-neutral-400 mt-0.5">Reefer / engine risk</div>
        </div>

        {/* Metric 10 */}
        <div className="bg-white p-4 rounded-xl border border-neutral-200">
          <div className="text-xs text-neutral-500 font-medium truncate">Recorded Losses</div>
          <div className="text-2xl font-bold text-neutral-900 mt-1 tabular-nums font-mono">
            {recordedLossesKg} kg
          </div>
          <div className="text-[11px] text-neutral-400 mt-0.5">Confirmed write-offs</div>
        </div>

        {/* Metric 11 */}
        <div className="bg-white p-4 rounded-xl border border-neutral-200">
          <div className="text-xs text-neutral-500 font-medium truncate">Recovery Actions</div>
          <div className={`text-2xl font-bold mt-1 tabular-nums font-mono ${recoveryRecommendedCount > 0 ? 'text-emerald-700' : 'text-neutral-900'}`}>
            {recoveryRecommendedCount}
          </div>
          <div className="text-[11px] text-neutral-400 mt-0.5">Recommended interventions</div>
        </div>

        {/* Metric 12 */}
        <div className="bg-white p-4 rounded-xl border border-neutral-200">
          <div className="text-xs text-neutral-500 font-medium truncate">Avoided Waste</div>
          <div className="text-2xl font-bold text-emerald-800 mt-1 tabular-nums font-mono">
            {totalWasteAvoidedKg.toLocaleString()} kg
          </div>
          <div className="text-[11px] text-neutral-400 mt-0.5">Documented baseline saves</div>
        </div>
      </div>

      {/* Multi-Category Breakdown & Inspection Results */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Categories Breakdown */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-neutral-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-neutral-900">Multi-Product Inventory Allocation</h2>
              <p className="text-xs text-neutral-500 mt-0.5">Real-time stock balance across all 7 supported classifications</p>
            </div>
            <button
              onClick={() => setActiveTab('inventory')}
              className="text-xs text-emerald-800 hover:text-emerald-900 font-medium"
            >
              Full Ledger &rarr;
            </button>
          </div>

          <div className="space-y-3">
            {categoryCounts.map(cat => {
              const maxQty = 3500;
              const percent = Math.min(100, Math.round((cat.quantity / maxQty) * 100));
              return (
                <div key={cat.category} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-neutral-800">{cat.config.name}</span>
                    <span className="font-mono text-neutral-500 tabular-nums">
                      {cat.quantity.toLocaleString()} {cat.config.defaultUnit} ({cat.count} batches)
                    </span>
                  </div>
                  <div className="w-full bg-neutral-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quality Inspection Overview */}
        <div className="bg-white rounded-xl border border-neutral-200 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-neutral-900">Quality Inspection State</h2>
              <button
                onClick={() => setActiveTab('inspection')}
                className="text-xs text-emerald-800 hover:text-emerald-900 font-medium"
              >
                Inspect &rarr;
              </button>
            </div>
            <p className="text-xs text-neutral-500 mb-4">
              Category-tailored quality standards & visual defect screenings.
            </p>

            <div className="space-y-2.5">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-neutral-50 border border-neutral-100 text-xs">
                <span className="text-neutral-700">Acceptable / Cleared</span>
                <span className="font-mono font-bold text-emerald-700 tabular-nums">
                  {inspectionStats.acceptable}
                </span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-neutral-50 border border-neutral-100 text-xs">
                <span className="text-neutral-700">Needs Manual Inspection</span>
                <span className="font-mono font-bold text-amber-600 tabular-nums">
                  {inspectionStats.needs_manual_inspection}
                </span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-neutral-50 border border-neutral-100 text-xs">
                <span className="text-neutral-700">Damaged / Rejected</span>
                <span className="font-mono font-bold text-rose-600 tabular-nums">
                  {inspectionStats.damaged}
                </span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-neutral-50 border border-neutral-100 text-xs">
                <span className="text-neutral-700">Storage Compliance Flags</span>
                <span className="font-mono font-bold text-purple-600 tabular-nums">
                  {inspectionStats.storage_compliance_concern}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-neutral-100 text-[11px] text-neutral-400">
            *Experimental optical classifier outputs are validated through physical manual inspection protocols.
          </div>
        </div>
      </div>

      {/* Active Operational Risks & Storage Health Strip */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Risks */}
        <div className="bg-white rounded-xl border border-neutral-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <h2 className="text-sm font-semibold text-neutral-900">Active Supply Chain Risks</h2>
            </div>
            <button
              onClick={() => setActiveTab('risks')}
              className="text-xs text-emerald-800 hover:text-emerald-900 font-medium"
            >
              Risk Engine ({activeRisks.length}) &rarr;
            </button>
          </div>

          {activeRisks.length === 0 ? (
            <div className="py-8 text-center text-xs text-neutral-400">
              No active operational risks detected. All sensor boundaries nominal.
            </div>
          ) : (
            <div className="space-y-3">
              {activeRisks.slice(0, 3).map(risk => (
                <div
                  key={risk.id}
                  className="p-3 rounded-lg border border-neutral-200 bg-neutral-50/50 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-neutral-900">{risk.affectedEntityName}</span>
                    <span className="text-[11px] font-mono font-medium text-rose-700">
                      Score: {risk.score}/100 ({risk.severity})
                    </span>
                  </div>
                  <p className="text-xs text-neutral-600 leading-snug">{risk.reason}</p>
                  <div className="pt-1 flex items-center justify-between text-[11px]">
                    <span className="text-neutral-400 font-mono">{risk.detectedAt}</span>
                    <button
                      onClick={() => setActiveTab('recovery')}
                      className="text-emerald-800 hover:underline font-medium"
                    >
                      View Recommended Recovery &rarr;
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Climate Chambers Summary */}
        <div className="bg-white rounded-xl border border-neutral-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <ThermometerSnowflake className="w-4 h-4 text-sky-600" />
              <h2 className="text-sm font-semibold text-neutral-900">Smart Storage Chambers (6 Zones)</h2>
            </div>
            <button
              onClick={() => setActiveTab('storage')}
              className="text-xs text-emerald-800 hover:text-emerald-900 font-medium"
            >
              Chamber Monitor &rarr;
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {chambers.map(ch => {
              const hasAlert = ch.activeAlerts.length > 0;
              return (
                <div
                  key={ch.id}
                  className={`p-2.5 rounded-lg border transition-colors ${
                    hasAlert
                      ? 'border-rose-300 bg-rose-50/50'
                      : 'border-neutral-200 bg-white hover:border-neutral-300'
                  }`}
                >
                  <div className="text-[11px] font-semibold text-neutral-800 truncate">{ch.name.split(':')[0]}</div>
                  <div className="mt-1 flex items-baseline justify-between">
                    <span className="text-base font-bold font-mono text-neutral-900 tabular-nums">
                      {ch.sensorStatus === 'disconnected' ? '--' : `${ch.currentTemp.toFixed(1)}°C`}
                    </span>
                    <span className="text-[10px] font-mono text-neutral-500 tabular-nums">
                      {ch.sensorStatus === 'disconnected' ? '--' : `${ch.currentHumidity}% RH`}
                    </span>
                  </div>
                  <div className="mt-1 text-[10px] text-neutral-500 truncate">
                    Cap: {Math.round((ch.capacityUsed / ch.capacityMax) * 100)}%
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
            <span>Real-time Modbus/MQTT Telemetry</span>
            <span className="font-mono text-emerald-700">Active Cycle</span>
          </div>
        </div>
      </div>
    </div>
  );
};
