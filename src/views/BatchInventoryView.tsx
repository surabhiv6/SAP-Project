import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES_CONFIG } from '../data/initialData';
import { BatchRecord } from '../types';
import {
  Boxes,
  Search,
  Filter,
  ArrowUpDown,
  History,
  ShieldAlert,
  CheckCircle,
} from 'lucide-react';

export const BatchInventoryView: React.FC = () => {
  const { batches, chambers } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedBatch, setSelectedBatch] = useState<BatchRecord | null>(null);

  const filteredBatches = batches.filter(b => {
    const matchesSearch =
      b.batchNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.productId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = categoryFilter === 'all' || b.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  // Inventory Totals
  const totalInitial = batches.reduce((acc, b) => acc + b.initialQuantity, 0);
  const totalAvailable = batches.reduce((acc, b) => acc + b.availableQuantity, 0);
  const totalDispatched = batches.reduce((acc, b) => acc + b.dispatchedQuantity, 0);
  const totalDelivered = batches.reduce((acc, b) => acc + b.deliveredQuantity, 0);
  const totalDamaged = batches.reduce((acc, b) => acc + b.damagedQuantity, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-neutral-900 tracking-tight">
          Batch & Central Inventory Management
        </h1>
        <p className="text-xs text-neutral-500 mt-0.5">
          Unified ledger tracking received, sorted, in-stock, dispatched, delivered, and quarantined quantities
        </p>
      </div>

      {/* Primary Inventory Math Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
        <div className="bg-white p-4 rounded-xl border border-neutral-200">
          <div className="text-xs text-neutral-500 font-medium truncate">Received Initial</div>
          <div className="text-xl font-bold font-mono text-neutral-900 mt-1 tabular-nums">
            {totalInitial.toLocaleString()}
          </div>
          <div className="text-[10px] text-neutral-400 mt-0.5">Cumulative gross inbound</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-neutral-200">
          <div className="text-xs text-neutral-500 font-medium truncate">Available In Stock</div>
          <div className="text-xl font-bold font-mono text-emerald-700 mt-1 tabular-nums">
            {totalAvailable.toLocaleString()}
          </div>
          <div className="text-[10px] text-neutral-400 mt-0.5">Physical warehouse ready</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-neutral-200">
          <div className="text-xs text-neutral-500 font-medium truncate">Active In Transit</div>
          <div className="text-xl font-bold font-mono text-neutral-900 mt-1 tabular-nums">
            {totalDispatched.toLocaleString()}
          </div>
          <div className="text-[10px] text-neutral-400 mt-0.5">Dispatched to vehicles</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-neutral-200">
          <div className="text-xs text-neutral-500 font-medium truncate">Confirmed Delivered</div>
          <div className="text-xl font-bold font-mono text-sky-700 mt-1 tabular-nums">
            {totalDelivered.toLocaleString()}
          </div>
          <div className="text-[10px] text-neutral-400 mt-0.5">Client signed receipts</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-neutral-200">
          <div className="text-xs text-neutral-500 font-medium truncate">Damaged / Rejected</div>
          <div className={`text-xl font-bold font-mono mt-1 tabular-nums ${totalDamaged > 0 ? 'text-rose-600' : 'text-neutral-900'}`}>
            {totalDamaged.toLocaleString()}
          </div>
          <div className="text-[10px] text-neutral-400 mt-0.5">Quarantined losses</div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-neutral-200 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search batch #, product, supplier..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-emerald-600"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          <button
            onClick={() => setCategoryFilter('all')}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
              categoryFilter === 'all'
                ? 'bg-neutral-900 text-white'
                : 'text-neutral-600 hover:bg-neutral-100'
            }`}
          >
            All Categories ({batches.length})
          </button>
          {Object.entries(CATEGORIES_CONFIG).map(([key, config]) => (
            <button
              key={key}
              onClick={() => setCategoryFilter(key)}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                categoryFilter === key
                  ? 'bg-emerald-700 text-white'
                  : 'text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              {config.shortName}
            </button>
          ))}
        </div>
      </div>

      {/* Batches Table */}
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50/80 border-b border-neutral-200 text-neutral-500 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Batch Number</th>
                <th className="py-3 px-4">Product Name & Category</th>
                <th className="py-3 px-4">Supplier</th>
                <th className="py-3 px-4 text-right">Available</th>
                <th className="py-3 px-4 text-right">Sorted</th>
                <th className="py-3 px-4 text-right">Dispatched</th>
                <th className="py-3 px-4 text-right">Delivered</th>
                <th className="py-3 px-4 text-right">Damaged</th>
                <th className="py-3 px-4">Chamber</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredBatches.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-10 text-center text-neutral-400">
                    No batches found matching filter.
                  </td>
                </tr>
              ) : (
                filteredBatches.map(b => {
                  const chamber = chambers.find(c => c.id === b.chamberId);
                  return (
                    <tr
                      key={b.batchNumber}
                      onClick={() => setSelectedBatch(b)}
                      className="hover:bg-neutral-50/70 transition-colors cursor-pointer"
                    >
                      <td className="py-3 px-4 font-mono font-semibold text-neutral-900">
                        {b.batchNumber}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-neutral-900">{b.productName}</div>
                        <div className="text-[10px] text-neutral-400">
                          {CATEGORIES_CONFIG[b.category]?.name || b.category}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-neutral-600 truncate max-w-[150px]">
                        {b.supplier}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-emerald-700 tabular-nums">
                        {b.availableQuantity.toLocaleString()} {b.unit}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-neutral-700 tabular-nums">
                        {b.sortedQuantity.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-neutral-700 tabular-nums">
                        {b.dispatchedQuantity.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-sky-700 tabular-nums">
                        {b.deliveredQuantity.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-rose-600 tabular-nums">
                        {b.damagedQuantity.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 font-mono text-neutral-700 text-[11px]">
                        {chamber?.name.split(':')[0] || b.chamberId}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`text-[11px] font-medium capitalize ${
                            b.status === 'active'
                              ? 'text-emerald-700'
                              : b.status === 'depleted'
                              ? 'text-neutral-400'
                              : 'text-amber-600'
                          }`}
                        >
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Batch Details Card */}
      {selectedBatch && (
        <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-emerald-700" />
              <h3 className="text-sm font-semibold text-neutral-900">
                Batch Traceability Ledger: {selectedBatch.batchNumber}
              </h3>
            </div>
            <button
              onClick={() => setSelectedBatch(null)}
              className="text-xs text-neutral-500 hover:text-neutral-800"
            >
              Close Details
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-neutral-500 text-[11px]">Product / ID:</span>
              <div className="font-medium text-neutral-900">{selectedBatch.productName} ({selectedBatch.productId})</div>
            </div>
            <div>
              <span className="text-neutral-500 text-[11px]">Received Date:</span>
              <div className="font-mono text-neutral-800">{selectedBatch.receivedDate}</div>
            </div>
            <div>
              <span className="text-neutral-500 text-[11px]">Recorded Expiry:</span>
              <div className="font-mono text-neutral-800">{selectedBatch.expiryDate || 'N/A'}</div>
            </div>
            <div>
              <span className="text-neutral-500 text-[11px]">Storage Chamber:</span>
              <div className="font-medium text-neutral-900">{selectedBatch.chamberId}</div>
            </div>
          </div>

          <div className="text-[11px] text-neutral-500 pt-2 border-t border-neutral-200">
            *Mathematical conservation check: Initial ({selectedBatch.initialQuantity}) = Available ({selectedBatch.availableQuantity}) + Dispatched ({selectedBatch.dispatchedQuantity}) + Damaged ({selectedBatch.damagedQuantity}). No negative balances permitted.
          </div>
        </div>
      )}
    </div>
  );
};
