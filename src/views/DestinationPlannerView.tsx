import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BatchRecord, Destination, ProductCategory } from '../types';
import { CATEGORIES_CONFIG } from '../data/initialData';
import {
  MapPin,
  TrendingUp,
  Clock,
  DollarSign,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  Layers,
  Sparkles,
} from 'lucide-react';

interface RankedDestination {
  destination: Destination;
  suitabilityScore: number; // 0 - 100
  isCompatible: boolean;
  transitRisk: 'low' | 'medium' | 'high' | 'prohibited';
  reasoning: string;
  estimatedCost: number;
  deliveryMarginHours: number;
}

export const DestinationPlannerView: React.FC = () => {
  const { batches, destinations, setActiveTab } = useApp();

  const [selectedBatchNumber, setSelectedBatchNumber] = useState<string>(
    batches.find(b => b.availableQuantity > 0)?.batchNumber || batches[0]?.batchNumber || ''
  );

  const selectedBatch = batches.find(b => b.batchNumber === selectedBatchNumber) || batches[0];

  // Evaluate and rank all destinations for the chosen batch
  const rankedDestinations: RankedDestination[] = destinations.map((dest): RankedDestination => {
    if (!selectedBatch) {
      return {
        destination: dest,
        suitabilityScore: 0,
        isCompatible: false,
        transitRisk: 'high',
        reasoning: 'No batch selected',
        estimatedCost: 0,
        deliveryMarginHours: 0,
      };
    }

    const isCategoryAccepted = dest.acceptedCategories.includes(selectedBatch.category);
    const requiresColdChain = ['dairy', 'meat_seafood'].includes(selectedBatch.category);
    const coldChainMatch = !requiresColdChain || dest.coldChainCapable;

    // Is compatible?
    const isCompatible = isCategoryAccepted && coldChainMatch;

    // Delivery margin: deadline vs travel time
    const deliveryMarginHours = dest.deliveryDeadlineHours - dest.travelTimeHours;
    const estimatedCost = Math.round(dest.distanceKm * dest.transportCostPerUnit * 10) / 10;

    let score = 50;
    const reasoningParts: string[] = [];
    let transitRisk: 'low' | 'medium' | 'high' | 'prohibited' = 'low';

    if (!isCompatible) {
      if (!isCategoryAccepted) {
        reasoningParts.push(`Destination facility is not licensed/configured for category: ${CATEGORIES_CONFIG[selectedBatch.category]?.name}.`);
      }
      if (requiresColdChain && !dest.coldChainCapable) {
        reasoningParts.push(`Destination lacks cold-chain reefer receiving docks for temperature-sensitive cargo.`);
      }
      return {
        destination: dest,
        suitabilityScore: 10,
        isCompatible: false,
        transitRisk: 'prohibited',
        reasoning: reasoningParts.join(' '),
        estimatedCost,
        deliveryMarginHours,
      };
    }

    // Demand bonus
    if (dest.demandLevel === 'high') {
      score += 25;
      reasoningParts.push('High retail demand velocity ensures rapid product turnover.');
    } else if (dest.demandLevel === 'medium') {
      score += 15;
      reasoningParts.push('Moderate demand profile.');
    }

    // Distance & Travel Time factor
    if (dest.travelTimeHours <= 1.5) {
      score += 20;
      reasoningParts.push(`Short transit time (${dest.travelTimeHours}h) maximizes residual shelf-life.`);
    } else if (dest.travelTimeHours > 3.0) {
      score -= 15;
      transitRisk = 'medium';
      reasoningParts.push(`Extended haul distance (${dest.distanceKm}km) increases thermal exposure vulnerability.`);
    }

    // Near expiry bonus for high velocity stores
    const isShortLife = selectedBatch.expiryDate && selectedBatch.category === 'meat_seafood';
    if (isShortLife && dest.demandLevel === 'high' && dest.travelTimeHours <= 2.0) {
      score += 10;
      reasoningParts.push('Optimal for urgent perishable dispatch to prevent inventory expiration.');
    }

    const finalScore = Math.min(98, Math.max(20, score));

    return {
      destination: dest,
      suitabilityScore: finalScore,
      isCompatible: true,
      transitRisk,
      reasoning: reasoningParts.join(' '),
      estimatedCost,
      deliveryMarginHours,
    };
  }).sort((a, b) => b.suitabilityScore - a.suitabilityScore);

  const topDestination = rankedDestinations.find(d => d.isCompatible);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-neutral-900 tracking-tight">
          Smart Destination & Route Planner
        </h1>
        <p className="text-xs text-neutral-500 mt-0.5">
          Multi-criteria decision matrix matching batch shelf-life, cargo compatibility, transit times, and demand
        </p>
      </div>

      {/* Batch Selector Bar */}
      <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1 w-full md:w-auto">
          <label className="text-xs font-semibold text-neutral-800">
            Select Active Inventory Batch for Destination Planning:
          </label>
          <div className="flex items-center gap-3">
            <select
              value={selectedBatchNumber}
              onChange={e => setSelectedBatchNumber(e.target.value)}
              className="px-3 py-2 border border-neutral-200 rounded-lg text-xs font-mono font-medium focus:ring-1 focus:ring-emerald-600 bg-white"
            >
              {batches.map(b => (
                <option key={b.batchNumber} value={b.batchNumber}>
                  {b.batchNumber} — {b.productName} ({b.availableQuantity} {b.unit} avail)
                </option>
              ))}
            </select>
          </div>
        </div>

        {selectedBatch && (
          <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-600 border-t md:border-t-0 pt-3 md:pt-0 w-full md:w-auto justify-end">
            <div>
              <span className="text-neutral-400 text-[11px]">Category:</span>{' '}
              <strong className="text-neutral-800">{CATEGORIES_CONFIG[selectedBatch.category]?.name}</strong>
            </div>
            <div>
              <span className="text-neutral-400 text-[11px]">Stock:</span>{' '}
              <strong className="font-mono text-emerald-800">{selectedBatch.availableQuantity} {selectedBatch.unit}</strong>
            </div>
            <div>
              <span className="text-neutral-400 text-[11px]">Expiry:</span>{' '}
              <strong className="font-mono text-neutral-800">{selectedBatch.expiryDate || 'N/A'}</strong>
            </div>
          </div>
        )}
      </div>

      {/* Ranked Destinations Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-neutral-900">
            Ranked Destination Options (Algorithm Score 0–100)
          </h2>
          <span className="text-xs text-neutral-400">Deterministic multi-factor evaluation</span>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {rankedDestinations.map((item, index) => {
            const isRank1 = index === 0 && item.isCompatible;
            return (
              <div
                key={item.destination.id}
                className={`p-5 rounded-xl border bg-white transition-all shadow-xs ${
                  isRank1
                    ? 'border-emerald-600 ring-1 ring-emerald-500/30'
                    : item.isCompatible
                    ? 'border-neutral-200 hover:border-neutral-300'
                    : 'border-neutral-200 bg-neutral-50/70 opacity-75'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left: Info & Rank */}
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                          isRank1
                            ? 'bg-emerald-700 text-white'
                            : item.isCompatible
                            ? 'bg-neutral-100 text-neutral-800'
                            : 'bg-neutral-200 text-neutral-500'
                        }`}
                      >
                        Rank #{index + 1}
                      </span>
                      <h3 className="text-base font-bold text-neutral-900">
                        {item.destination.name}
                      </h3>
                      <span className="text-xs text-neutral-400 font-mono">
                        ({item.destination.city})
                      </span>
                    </div>

                    <p className="text-xs text-neutral-600 leading-relaxed max-w-2xl">
                      <strong>Reasoning:</strong> {item.reasoning}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-neutral-500 pt-1">
                      <span>Distance: <strong className="font-mono text-neutral-800">{item.destination.distanceKm} km</strong></span>
                      <span>·</span>
                      <span>Estimated Transit: <strong className="font-mono text-neutral-800">{item.destination.travelTimeHours} hrs</strong></span>
                      <span>·</span>
                      <span>Delivery Deadline Margin: <strong className="font-mono text-neutral-800">+{item.deliveryMarginHours} hrs</strong></span>
                      <span>·</span>
                      <span>Demand: <strong className="text-neutral-800 uppercase">{item.destination.demandLevel}</strong></span>
                    </div>
                  </div>

                  {/* Right: Score & Action */}
                  <div className="flex lg:flex-col items-center lg:items-end justify-between lg:justify-center gap-3 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-neutral-100">
                    <div className="text-left lg:text-right">
                      <div className="text-[10px] text-neutral-400 uppercase font-semibold">Suitability Score</div>
                      <div
                        className={`text-2xl font-bold font-mono tabular-nums ${
                          isRank1
                            ? 'text-emerald-800'
                            : item.isCompatible
                            ? 'text-neutral-900'
                            : 'text-neutral-400'
                        }`}
                      >
                        {item.suitabilityScore}
                        <span className="text-xs font-normal text-neutral-400">/100</span>
                      </div>
                    </div>

                    {item.isCompatible ? (
                      <button
                        onClick={() => setActiveTab('loading')}
                        className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                          isRank1
                            ? 'bg-emerald-700 text-white hover:bg-emerald-800 shadow-xs'
                            : 'bg-neutral-900 text-white hover:bg-neutral-800'
                        }`}
                      >
                        <span>Select & Load Cargo</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <span className="text-xs font-medium text-rose-700 bg-rose-50 px-2.5 py-1 rounded">
                        Incompatible Destination
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
