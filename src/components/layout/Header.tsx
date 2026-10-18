import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Menu,
  Info,
  RotateCcw,
  PlusCircle,
  Play,
} from 'lucide-react';

interface HeaderProps {
  onToggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const {
    activeTab,
    setActiveTab,
    setShowLimitationsModal,
    processSingleSortingStep,
    feederState,
  } = useApp();

  const getBreadcrumb = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'System Overview / Dashboard';
      case 'receiving':
        return 'Operations / Inbound Product Registration';
      case 'sorting':
        return 'Sorting / Automated Multi-Bin Machine';
      case 'feeder':
        return 'Sorting / Hopper & Feeder Simulation';
      case 'inspection':
        return 'Quality / Multi-Category Inspection';
      case 'inventory':
        return 'Inventory / Batch & Chamber Ledger';
      case 'expiry':
        return 'Quality / Expiry & Perishable Life';
      case 'storage':
        return 'Storage / Climate Chamber Surveillance';
      case 'destination':
        return 'Logistics / Smart Destination Planner';
      case 'loading':
        return 'Logistics / Smart Loading & Dispatch';
      case 'trucks':
        return 'Logistics / Active Truck Telemetry';
      case 'risks':
        return 'Resilience / Explainable Risk Engine';
      case 'recovery':
        return 'Resilience / Recovery Decision Centre';
      case 'delivery':
        return 'Logistics / Proof of Delivery & QA';
      case 'sustainability':
        return 'Reports / Sustainability & Loss Avoidance';
      case 'settings':
        return 'System / Configuration & Hardware Architecture';
      default:
        return 'Green Resilience AI';
    }
  };

  return (
    <header className="h-16 bg-white border-b border-neutral-200/90 px-4 sm:px-6 flex items-center justify-between gap-4 sticky top-0 z-30">
      {/* Zone 1: Mobile toggle & Breadcrumb */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-lg text-neutral-600 hover:bg-neutral-100 transition-colors"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs font-medium text-neutral-500 truncate">
          <span className="font-semibold text-neutral-900 truncate">GREEN RESILIENCE AI</span>
          <span className="text-neutral-300">/</span>
          <span className="text-neutral-600 truncate">{getBreadcrumb()}</span>
        </div>
      </div>

      {/* Zone 2: Informational / Sample data marker */}
      <div className="hidden md:flex items-center gap-3 text-xs text-neutral-500 whitespace-nowrap shrink-0">
        <span className="text-neutral-400">Simulation Data</span>
        <span aria-hidden="true">·</span>
        <span className="font-mono text-neutral-700">7 Categories Active</span>
      </div>

      {/* Zone 3: Functional CTA Actions */}
      <div className="flex items-center gap-2.5 shrink-0">
        {feederState.queue.length > 0 && (
          <button
            onClick={() => {
              processSingleSortingStep();
            }}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 transition-colors whitespace-nowrap shrink-0"
            title="Transfer next product from hopper to sorter"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Sort Next ({feederState.queue.length})</span>
          </button>
        )}

        {activeTab !== 'receiving' && (
          <button
            onClick={() => setActiveTab('receiving')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-emerald-700 text-white hover:bg-emerald-800 shadow-xs transition-colors whitespace-nowrap shrink-0"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Receive Product</span>
          </button>
        )}

        <button
          onClick={() => setShowLimitationsModal(true)}
          className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100 transition-colors"
          title="View Prototype Architecture & Limitations"
        >
          <Info className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
