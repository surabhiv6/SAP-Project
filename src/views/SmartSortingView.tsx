import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES_CONFIG } from '../data/initialData';
import { ProductCategory, ProductItem } from '../types';
import {
  Play,
  Pause,
  Square,
  StepForward,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Boxes,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export const SmartSortingView: React.FC = () => {
  const {
    products,
    feederState,
    startFeeding,
    pauseFeeding,
    stopFeeding,
    processSingleSortingStep,
    loadAllUnsortedToHopper,
    sortingHistory,
    setActiveTab,
  } = useApp();

  const [activeBinTab, setActiveBinTab] = useState<string>('vegetables_fruits');
  const [isAutoStepping, setIsAutoStepping] = useState<boolean>(false);

  // Auto-simulation timer when feeding is active
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (feederState.status === 'feeding' && feederState.queue.length > 0) {
      timer = setInterval(() => {
        const hasMore = processSingleSortingStep();
        if (!hasMore) {
          stopFeeding();
        }
      }, 2500); // 2.5s step interval
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [feederState.status, feederState.queue.length, processSingleSortingStep, stopFeeding]);

  // Sorting metrics
  const waitingCount = feederState.queue.length;
  const processedCount = feederState.itemsProcessed;
  const categorizedCount = products.filter(p => p.sortedStatus === 'sorted').length;
  const reviewCount = products.filter(p => p.sortedStatus === 'flagged').length;

  // Active product on conveyor
  const currentItem = products.find(p => p.id === feederState.currentProductId) || null;

  // Bins list: 6 categories + 1 inspection bin
  const bins = [
    { id: 'vegetables_fruits', name: 'Vegetables & Fruits', color: 'emerald' },
    { id: 'dairy', name: 'Dairy & Milk', color: 'sky' },
    { id: 'meat_seafood', name: 'Meat & Seafood', color: 'rose' },
    { id: 'medicines', name: 'Medicines & Medical', color: 'purple' },
    { id: 'packaged_foods', name: 'Biscuits & Packaged', color: 'amber' },
    { id: 'manufactured', name: 'Manufactured Goods', color: 'indigo' },
    { id: 'inspection_needed', name: 'Requires Manual Inspection', color: 'red' },
  ];

  // Products in currently selected bin
  const productsInSelectedBin = products.filter(p => {
    if (activeBinTab === 'inspection_needed') {
      return p.sortedStatus === 'flagged' || p.sortedBin === 'inspection_needed';
    }
    return p.sortedStatus === 'sorted' && p.sortedBin === activeBinTab;
  });

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-neutral-900 tracking-tight">
            Smart Sorting Machine Simulation
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Automated multi-product sorting simulation: hopper feeding, optical inspection, and pneumatic gate routing
          </p>
        </div>

        {/* Machine Control Buttons */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {feederState.status !== 'feeding' ? (
            <button
              onClick={() => {
                if (feederState.queue.length === 0) {
                  loadAllUnsortedToHopper();
                }
                startFeeding();
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-emerald-700 text-white hover:bg-emerald-800 transition-colors shadow-xs"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{feederState.status === 'paused' ? 'Resume Sorting' : 'Start Sorting'}</span>
            </button>
          ) : (
            <button
              onClick={pauseFeeding}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-amber-600 text-white hover:bg-amber-700 transition-colors"
            >
              <Pause className="w-3.5 h-3.5 fill-current" />
              <span>Pause</span>
            </button>
          )}

          <button
            onClick={stopFeeding}
            disabled={feederState.status === 'idle'}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border border-neutral-200 text-neutral-700 hover:bg-neutral-100 disabled:opacity-40 transition-colors"
          >
            <Square className="w-3.5 h-3.5 fill-current" />
            <span>Stop</span>
          </button>

          <button
            onClick={() => processSingleSortingStep()}
            disabled={feederState.queue.length === 0}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg bg-neutral-900 text-white hover:bg-neutral-800 disabled:opacity-40 transition-colors"
            title="Sort one single item through the conveyor"
          >
            <StepForward className="w-3.5 h-3.5" />
            <span>Step Item</span>
          </button>
        </div>
      </div>

      {/* Real-time KPI Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-neutral-200">
          <span className="text-[11px] text-neutral-500 font-medium">Waiting in Hopper</span>
          <div className="text-xl font-bold font-mono text-neutral-900 mt-0.5 tabular-nums">
            {waitingCount}
          </div>
          <span className="text-[10px] text-neutral-400">Items queued</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-neutral-200">
          <span className="text-[11px] text-neutral-500 font-medium">Total Processed</span>
          <div className="text-xl font-bold font-mono text-neutral-900 mt-0.5 tabular-nums">
            {processedCount}
          </div>
          <span className="text-[10px] text-neutral-400">Lifetime cycles</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-neutral-200">
          <span className="text-[11px] text-neutral-500 font-medium">Categorized Clean</span>
          <div className="text-xl font-bold font-mono text-emerald-700 mt-0.5 tabular-nums">
            {categorizedCount}
          </div>
          <span className="text-[10px] text-neutral-400">Passed to storage</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-neutral-200">
          <span className="text-[11px] text-neutral-500 font-medium">Flagged for Review</span>
          <div className={`text-xl font-bold font-mono mt-0.5 tabular-nums ${reviewCount > 0 ? 'text-rose-600' : 'text-neutral-900'}`}>
            {reviewCount}
          </div>
          <span className="text-[10px] text-neutral-400">Diverted to bin 7</span>
        </div>
      </div>

      {/* 6-Stage Visual Hardware Architecture Diagram & Conveyor Simulation */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-xs space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-neutral-900">
              Interactive Hardware Conveyor Simulation
            </h2>
            <p className="text-xs text-neutral-500">
              Visual path: Input Hopper &rarr; Feeder &rarr; Optical Tag &rarr; QA Camera &rarr; Diverter Gates &rarr; Bins
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-neutral-500">Machine Status:</span>
            <span
              className={`font-mono font-semibold uppercase ${
                feederState.status === 'feeding'
                  ? 'text-emerald-700'
                  : feederState.status === 'paused'
                  ? 'text-amber-600'
                  : 'text-neutral-500'
              }`}
            >
              {feederState.status}
            </span>
          </div>
        </div>

        {/* 6 Conceptual Machine Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-2 text-xs">
          {/* Station 1 */}
          <div className="p-3 rounded-lg border border-neutral-200 bg-neutral-50 flex flex-col justify-between">
            <div>
              <div className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wide">01. Input Hopper</div>
              <div className="font-semibold text-neutral-900 mt-1">Bucket Hopper</div>
              <p className="text-[11px] text-neutral-500 mt-0.5">Gravity-fed staging buffer</p>
            </div>
            <div className="mt-3 font-mono font-medium text-emerald-800 text-[11px]">
              {waitingCount} units waiting
            </div>
          </div>

          {/* Station 2 */}
          <div className={`p-3 rounded-lg border transition-colors ${feederState.status === 'feeding' ? 'border-emerald-500 bg-emerald-50/40' : 'border-neutral-200 bg-neutral-50'} flex flex-col justify-between`}>
            <div>
              <div className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wide">02. Auto Feeder</div>
              <div className="font-semibold text-neutral-900 mt-1">Vibratory Tray</div>
              <p className="text-[11px] text-neutral-500 mt-0.5">Single-item singulator</p>
            </div>
            <div className="mt-3 font-mono font-medium text-neutral-700 text-[11px]">
              18 pcs/min rate
            </div>
          </div>

          {/* Station 3 */}
          <div className="p-3 rounded-lg border border-neutral-200 bg-neutral-50 flex flex-col justify-between">
            <div>
              <div className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wide">03. Identification</div>
              <div className="font-semibold text-neutral-900 mt-1">Barcode & RFID</div>
              <p className="text-[11px] text-neutral-500 mt-0.5">Multi-format barcode reader</p>
            </div>
            <div className="mt-3 font-mono text-neutral-700 text-[11px]">
              GS1 Datamatrix
            </div>
          </div>

          {/* Station 4 */}
          <div className="p-3 rounded-lg border border-neutral-200 bg-neutral-50 flex flex-col justify-between">
            <div>
              <div className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wide">04. Inspection</div>
              <div className="font-semibold text-neutral-900 mt-1">Vision Section</div>
              <p className="text-[11px] text-neutral-500 mt-0.5">Surface flaw & seal check</p>
            </div>
            <div className="mt-3 font-mono text-neutral-700 text-[11px]">
              Prototype Visual Model
            </div>
          </div>

          {/* Station 5 */}
          <div className="p-3 rounded-lg border border-neutral-200 bg-neutral-50 flex flex-col justify-between">
            <div>
              <div className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wide">05. Sorter</div>
              <div className="font-semibold text-neutral-900 mt-1">Pneumatic Flipper</div>
              <p className="text-[11px] text-neutral-500 mt-0.5">High-speed solenoid diverter</p>
            </div>
            <div className="mt-3 font-mono text-neutral-700 text-[11px]">
              7 Directional Chutes
            </div>
          </div>

          {/* Station 6 */}
          <div className="p-3 rounded-lg border border-neutral-200 bg-neutral-50 flex flex-col justify-between">
            <div>
              <div className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wide">06. Output Bins</div>
              <div className="font-semibold text-neutral-900 mt-1">Collection Bins</div>
              <p className="text-[11px] text-neutral-500 mt-0.5">Cushioned gravity crates</p>
            </div>
            <div className="mt-3 font-mono text-emerald-800 text-[11px]">
              {categorizedCount + reviewCount} items stored
            </div>
          </div>
        </div>

        {/* Animated Active Conveyor Belt */}
        <div className="p-4 rounded-xl bg-neutral-900 text-white space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-neutral-300">Conveyor Belt Live Track</span>
            <span className="font-mono text-emerald-400 text-[11px]">
              {currentItem ? `Active Item: ${currentItem.name} (${currentItem.id})` : 'Conveyor Clear — Ready for Feed'}
            </span>
          </div>

          <div className="relative h-14 bg-neutral-800/90 rounded-lg border border-neutral-700 flex items-center px-4 overflow-hidden">
            {/* Belt Grid Texture lines */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#333_1px,transparent_1px)] bg-[size:24px_100%] opacity-40" />

            {currentItem ? (
              <div className="relative z-10 flex items-center justify-between w-full px-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-emerald-600 flex items-center justify-center font-bold font-mono text-xs shadow-md">
                    {currentItem.category.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-bold text-xs text-white">{currentItem.name}</div>
                    <div className="text-[10px] text-neutral-400 font-mono">
                      Batch: {currentItem.batchNumber} · Category: {CATEGORIES_CONFIG[currentItem.category]?.name}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-emerald-400 font-mono">
                    Routing to Bin: {CATEGORIES_CONFIG[currentItem.category]?.shortName || currentItem.category}
                  </span>
                  <ArrowRight className="w-4 h-4 text-emerald-400 animate-pulse" />
                </div>
              </div>
            ) : (
              <div className="relative z-10 text-xs text-neutral-500 text-center w-full">
                {waitingCount > 0
                  ? 'Click "Step Item" or "Start Sorting" to feed next registered product from hopper'
                  : 'All products currently sorted. Register new inbound items or reload hopper below.'}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between text-[11px] text-neutral-400 pt-1">
            <span>*Software simulation model of physical sorting hardware mechanism</span>
            {waitingCount === 0 && (
              <button
                onClick={loadAllUnsortedToHopper}
                className="text-emerald-400 hover:text-emerald-300 underline font-medium"
              >
                Reload Unsorted to Hopper
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 7 Virtual Collection Bins Section */}
      <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-xs space-y-4">
        <div>
          <h2 className="text-sm font-semibold text-neutral-900">7 Virtual Collection Bins</h2>
          <p className="text-xs text-neutral-500">
            Click any bin to review categorized items or inspect rejected items requiring manual triage.
          </p>
        </div>

        {/* Bin Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {bins.map(bin => {
            const count = products.filter(p => {
              if (bin.id === 'inspection_needed') {
                return p.sortedStatus === 'flagged' || p.sortedBin === 'inspection_needed';
              }
              return p.sortedStatus === 'sorted' && p.sortedBin === bin.id;
            }).length;

            const isSelected = activeBinTab === bin.id;

            return (
              <button
                key={bin.id}
                onClick={() => setActiveBinTab(bin.id)}
                className={`px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-2 ${
                  isSelected
                    ? 'bg-neutral-900 text-white font-semibold'
                    : 'bg-neutral-50 text-neutral-700 hover:bg-neutral-100 border border-neutral-200'
                }`}
              >
                <span>{bin.name}</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded-md ${
                    bin.id === 'inspection_needed' && count > 0
                      ? 'bg-rose-100 text-rose-800 font-bold'
                      : isSelected
                      ? 'bg-neutral-800 text-neutral-200'
                      : 'bg-neutral-200 text-neutral-700'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Products Inside Selected Bin Table */}
        <div className="border border-neutral-200 rounded-lg overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 text-neutral-500 font-semibold uppercase text-[10px] tracking-wider border-b border-neutral-200">
              <tr>
                <th className="py-2.5 px-3">Product Name & ID</th>
                <th className="py-2.5 px-3">Batch Number</th>
                <th className="py-2.5 px-3 text-right">Quantity</th>
                <th className="py-2.5 px-3">QA Inspection State</th>
                <th className="py-2.5 px-3">Condition & Notes</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {productsInSelectedBin.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-neutral-400 text-xs">
                    No items currently in this bin.
                  </td>
                </tr>
              ) : (
                productsInSelectedBin.map(p => (
                  <tr key={p.id} className="hover:bg-neutral-50/50">
                    <td className="py-2.5 px-3">
                      <div className="font-semibold text-neutral-900">{p.name}</div>
                      <div className="text-[10px] font-mono text-neutral-400">{p.id}</div>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-neutral-700">{p.batchNumber}</td>
                    <td className="py-2.5 px-3 text-right font-mono font-medium text-neutral-900">
                      {p.quantity.toLocaleString()} {p.unit}
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`text-[11px] font-medium capitalize ${
                          p.inspectionStatus === 'acceptable'
                            ? 'text-emerald-700'
                            : p.inspectionStatus === 'damaged'
                            ? 'text-rose-600'
                            : 'text-amber-600'
                        }`}
                      >
                        {p.inspectionStatus.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-neutral-500 max-w-[200px] truncate text-[11px]">
                      {p.inspectionNotes || p.productCondition}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={() => setActiveTab('inspection')}
                        className="text-emerald-800 hover:underline font-medium text-[11px]"
                      >
                        Re-inspect &rarr;
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Sorting History Log */}
      <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-xs">
        <h2 className="text-sm font-semibold text-neutral-900 mb-3">Live Sorting Cycle Audit Trail</h2>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {sortingHistory.length === 0 ? (
            <div className="text-xs text-neutral-400 py-4 text-center">No sorting events logged yet.</div>
          ) : (
            sortingHistory.map(item => (
              <div
                key={item.id}
                className="flex items-center justify-between p-2.5 rounded-lg bg-neutral-50/70 border border-neutral-100 text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[10px] text-neutral-400">{item.timestamp}</span>
                  <span className="font-semibold text-neutral-900">{item.productName}</span>
                  <span className="text-neutral-500 font-mono text-[11px]">({item.productId})</span>
                </div>
                <div className="flex items-center gap-3 font-mono">
                  <span className="text-emerald-700 text-[11px]">Bin: {item.assignedBin}</span>
                  <span className="text-neutral-400 text-[10px]">Tag: 98% conf</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
