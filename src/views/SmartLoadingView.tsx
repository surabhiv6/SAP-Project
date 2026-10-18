import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ProductCategory, Shipment, ShipmentCargo } from '../types';
import { CATEGORIES_CONFIG } from '../data/initialData';
import {
  Truck,
  Plus,
  Send,
  AlertTriangle,
  CheckCircle2,
  Package,
  Layers,
  ArrowRight,
  ShieldCheck,
  X,
} from 'lucide-react';

export const SmartLoadingView: React.FC = () => {
  const {
    shipments,
    vehicles,
    destinations,
    batches,
    createShipment,
    dispatchShipment,
    setActiveTab,
  } = useApp();

  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form State for creating a new shipment
  const [selectedVehicleId, setSelectedVehicleId] = useState(vehicles[0]?.id || '');
  const [selectedDestinationId, setSelectedDestinationId] = useState(destinations[0]?.id || '');
  const [origin, setOrigin] = useState('Central Green Resilience Sorting Hub');
  const [plannedDeparture, setPlannedDeparture] = useState('2026-10-18 09:00');
  const [estimatedArrival, setEstimatedArrival] = useState('2026-10-18 11:30');
  const [packagingReqs, setPackagingReqs] = useState('Insulated temperature-controlled crates');
  const [storageReqs, setStorageReqs] = useState('Strict cold chain 2°C to 4°C');

  // Selected cargo items
  const [selectedBatchNumber, setSelectedBatchNumber] = useState(batches[0]?.batchNumber || '');
  const [loadQuantity, setLoadQuantity] = useState(100);
  const [cargoList, setCargoList] = useState<ShipmentCargo[]>([]);

  const selectedVehicle = vehicles.find(v => v.id === selectedVehicleId);
  const selectedDest = destinations.find(d => d.id === selectedDestinationId);

  // Add cargo item to draft list
  const handleAddCargo = () => {
    const batch = batches.find(b => b.batchNumber === selectedBatchNumber);
    if (!batch) return;

    if (loadQuantity <= 0 || loadQuantity > batch.availableQuantity) {
      alert(`Invalid quantity. Maximum available stock in this batch is ${batch.availableQuantity} ${batch.unit}.`);
      return;
    }

    // Check if already in cargo
    if (cargoList.some(c => c.batchNumber === batch.batchNumber)) {
      alert('Batch is already in cargo list. Adjust quantity or select another batch.');
      return;
    }

    setCargoList(prev => [
      ...prev,
      {
        productId: batch.productId,
        batchNumber: batch.batchNumber,
        productName: batch.productName,
        category: batch.category,
        quantity: loadQuantity,
        unit: batch.unit,
      },
    ]);
  };

  const handleRemoveCargo = (batchNum: string) => {
    setCargoList(prev => prev.filter(c => c.batchNumber !== batchNum));
  };

  // Compatibility Validation Engine
  const validateCompatibility = () => {
    const issues: string[] = [];
    const categoriesInCargo = new Set(cargoList.map(c => c.category));

    // Rule 1: Cold chain goods in non-reefer vehicle
    const hasPerishable =
      categoriesInCargo.has('dairy') ||
      categoriesInCargo.has('meat_seafood') ||
      categoriesInCargo.has('vegetables_fruits');

    if (hasPerishable && selectedVehicle && !selectedVehicle.coldChainSupport) {
      issues.push(
        `Critical: Vehicle ${selectedVehicle.name} lacks active refrigeration and cannot transport chilled perishables.`
      );
    }

    // Rule 2: Chemical cleaner / hazardous with food
    if (categoriesInCargo.has('other') && (categoriesInCargo.has('dairy') || categoriesInCargo.has('meat_seafood') || categoriesInCargo.has('vegetables_fruits') || categoriesInCargo.has('packaged_foods'))) {
      issues.push(
        `Cross-Contamination Hazard: Industrial chemical / cleaning cargo cannot be co-loaded in same compartment with edible foodstuffs.`
      );
    }

    // Rule 3: Destination compatibility
    if (selectedDest) {
      for (const cat of Array.from(categoriesInCargo)) {
        if (!selectedDest.acceptedCategories.includes(cat)) {
          issues.push(
            `Destination Incompatibility: ${selectedDest.name} does not accept category ${CATEGORIES_CONFIG[cat]?.name}.`
          );
        }
      }
    }

    return issues;
  };

  const compatibilityIssues = validateCompatibility();
  const isCompatible = compatibilityIssues.length === 0;

  const handleCreateShipment = (e: React.FormEvent) => {
    e.preventDefault();
    if (cargoList.length === 0) {
      alert('Please add at least one product batch to the cargo.');
      return;
    }
    if (!isCompatible) {
      alert('Cannot create shipment with critical cargo compatibility violations. Please resolve warnings.');
      return;
    }

    createShipment({
      vehicleId: selectedVehicle?.id || 'TRK-01',
      vehicleName: selectedVehicle?.name || 'Reefer Truck',
      origin,
      destinationId: selectedDest?.id || 'DST-01',
      destinationName: selectedDest?.name || 'Metro Hypermarket',
      cargo: cargoList,
      plannedDeparture,
      estimatedArrival,
      packagingRequirements: packagingReqs,
      storageRequirements: storageReqs,
      requiresReefer: selectedVehicle?.coldChainSupport || false,
      currentSimulatedLat: 37.77,
      currentSimulatedLng: -122.41,
    });

    setShowCreateModal(false);
    setCargoList([]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-neutral-900 tracking-tight">
            Smart Loading & Shipment Dispatch
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Cross-category cargo co-loading validator, fleet assignment, and automated stock reservation
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-700 text-white hover:bg-emerald-800 shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Plan New Shipment</span>
        </button>
      </div>

      {/* Active & Planned Shipments Grid */}
      <div className="space-y-4">
        <h2 className="text-sm font-semibold text-neutral-900">Shipments Manifest Overview</h2>

        <div className="grid grid-cols-1 gap-4">
          {shipments.map(s => {
            return (
              <div
                key={s.id}
                className="bg-white rounded-xl border border-neutral-200 p-5 shadow-xs space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-100 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-neutral-900 bg-neutral-100 px-2 py-0.5 rounded">
                      {s.id}
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-neutral-900">{s.destinationName}</h3>
                      <div className="text-[11px] text-neutral-500 font-mono">
                        Assigned: {s.vehicleName} · Origin: {s.origin}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs font-mono font-semibold uppercase px-2.5 py-0.5 rounded ${
                        s.status === 'in_transit'
                          ? 'bg-sky-100 text-sky-800'
                          : s.status === 'delayed'
                          ? 'bg-amber-100 text-amber-800'
                          : s.status === 'delivered'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-neutral-100 text-neutral-700'
                      }`}
                    >
                      {s.status.replace('_', ' ')}
                    </span>

                    {s.status === 'planned' && (
                      <button
                        onClick={() => dispatchShipment(s.id)}
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-700 text-white hover:bg-emerald-800 shadow-xs transition-colors flex items-center gap-1.5"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Confirm Dispatch</span>
                      </button>
                    )}

                    {s.status === 'in_transit' && (
                      <button
                        onClick={() => setActiveTab('trucks')}
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-neutral-900 text-white hover:bg-neutral-800 transition-colors flex items-center gap-1.5"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        <span>Live Telemetry &rarr;</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Cargo Details */}
                <div>
                  <div className="text-xs font-semibold text-neutral-700 mb-2">
                    Manifest Cargo ({s.cargo.length} batches loaded):
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                    {s.cargo.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-lg bg-neutral-50 border border-neutral-200 text-xs flex items-center justify-between"
                      >
                        <div>
                          <div className="font-semibold text-neutral-900">{item.productName}</div>
                          <div className="text-[10px] text-neutral-500 font-mono">
                            {item.batchNumber} · {CATEGORIES_CONFIG[item.category]?.shortName}
                          </div>
                        </div>
                        <div className="font-mono font-bold text-neutral-800 tabular-nums">
                          {item.quantity.toLocaleString()} {item.unit}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Logistics Timings & Requirements Strip */}
                <div className="flex flex-wrap items-center justify-between text-[11px] text-neutral-500 pt-2 border-t border-neutral-100">
                  <div className="flex items-center gap-4">
                    <span>Departure: <strong className="font-mono text-neutral-800">{s.plannedDeparture}</strong></span>
                    <span>ETA: <strong className="font-mono text-neutral-800">{s.estimatedArrival}</strong></span>
                  </div>
                  <div className="text-neutral-400">
                    Storage Requirement: <span className="text-neutral-600">{s.storageRequirements}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Create Shipment Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-xl border border-neutral-200 shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200">
              <h3 className="text-base font-bold text-neutral-900">
                Plan New Outbound Shipment
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 text-neutral-400 hover:text-neutral-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateShipment} className="p-6 overflow-y-auto space-y-5 text-xs">
              {/* Destination & Fleet selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Assigned Vehicle *</label>
                  <select
                    value={selectedVehicleId}
                    onChange={e => setSelectedVehicleId(e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-xs"
                  >
                    {vehicles.map(v => (
                      <option key={v.id} value={v.id}>
                        {v.name} ({v.type.replace('_', ' ')}) — Cap: {v.capacityKg}kg {v.coldChainSupport ? '❄️ Reefer' : '📦 Dry'}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Target Destination *</label>
                  <select
                    value={selectedDestinationId}
                    onChange={e => setSelectedDestinationId(e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-xs"
                  >
                    {destinations.map(d => (
                      <option key={d.id} value={d.id}>
                        {d.name} ({d.city} · {d.distanceKm}km)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Planned Departure Time</label>
                  <input
                    type="text"
                    value={plannedDeparture}
                    onChange={e => setPlannedDeparture(e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Estimated Arrival Time</label>
                  <input
                    type="text"
                    value={estimatedArrival}
                    onChange={e => setEstimatedArrival(e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-xs font-mono"
                  />
                </div>
              </div>

              {/* Add Cargo Row */}
              <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 space-y-3">
                <span className="font-semibold text-neutral-900 block">Add Inventory Batches to Cargo:</span>
                <div className="flex flex-col sm:flex-row gap-3 items-end">
                  <div className="flex-1 w-full">
                    <label className="block text-[11px] text-neutral-500 mb-1">Available Batch</label>
                    <select
                      value={selectedBatchNumber}
                      onChange={e => setSelectedBatchNumber(e.target.value)}
                      className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-xs bg-white font-mono"
                    >
                      {batches.filter(b => b.availableQuantity > 0).map(b => (
                        <option key={b.batchNumber} value={b.batchNumber}>
                          {b.batchNumber} — {b.productName} ({b.availableQuantity} {b.unit} avail)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="w-full sm:w-32">
                    <label className="block text-[11px] text-neutral-500 mb-1">Quantity</label>
                    <input
                      type="number"
                      min={1}
                      value={loadQuantity}
                      onChange={e => setLoadQuantity(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-xs font-mono bg-white"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleAddCargo}
                    className="px-4 py-2 bg-neutral-900 text-white rounded-lg text-xs font-medium hover:bg-neutral-800 transition-colors shrink-0"
                  >
                    + Add to Manifest
                  </button>
                </div>

                {/* Cargo List Table */}
                {cargoList.length > 0 && (
                  <div className="border border-neutral-200 rounded-lg overflow-hidden bg-white mt-3">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-neutral-100 text-neutral-500 uppercase text-[10px]">
                        <tr>
                          <th className="py-2 px-3">Batch Number</th>
                          <th className="py-2 px-3">Product Name</th>
                          <th className="py-2 px-3">Category</th>
                          <th className="py-2 px-3 text-right">Quantity</th>
                          <th className="py-2 px-3 text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-100">
                        {cargoList.map(c => (
                          <tr key={c.batchNumber}>
                            <td className="py-2 px-3 font-mono font-medium">{c.batchNumber}</td>
                            <td className="py-2 px-3">{c.productName}</td>
                            <td className="py-2 px-3">{CATEGORIES_CONFIG[c.category]?.shortName}</td>
                            <td className="py-2 px-3 text-right font-mono font-bold">
                              {c.quantity} {c.unit}
                            </td>
                            <td className="py-2 px-3 text-center">
                              <button
                                type="button"
                                onClick={() => handleRemoveCargo(c.batchNumber)}
                                className="text-rose-600 hover:text-rose-800 font-bold"
                              >
                                &times;
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Real-time Compatibility Alerts */}
              {compatibilityIssues.length > 0 ? (
                <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 space-y-1.5">
                  <div className="flex items-center gap-2 text-rose-900 font-semibold text-xs">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    <span>Incompatible Cargo / Storage Warning</span>
                  </div>
                  {compatibilityIssues.map((issue, idx) => (
                    <p key={idx} className="text-rose-800 text-[11px] leading-snug">
                      • {issue}
                    </p>
                  ))}
                </div>
              ) : cargoList.length > 0 ? (
                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Cargo combinations and thermal requirements verified compatible.</span>
                </div>
              ) : null}

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-neutral-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-xs font-medium text-neutral-600 hover:bg-neutral-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!isCompatible || cargoList.length === 0}
                  className="px-5 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 rounded-lg shadow-xs transition-colors"
                >
                  Create Shipment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
