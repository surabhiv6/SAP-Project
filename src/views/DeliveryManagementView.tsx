import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DeliveryRecord, InspectionOutcome, ShipmentStatus } from '../types';
import {
  ClipboardCheck,
  CheckCircle2,
  AlertCircle,
  Truck,
  Plus,
  FileText,
  UserCheck,
  PackageCheck,
  X,
} from 'lucide-react';

export const DeliveryManagementView: React.FC = () => {
  const { shipments, deliveries, confirmDelivery } = useApp();

  const [showSignModal, setShowSignModal] = useState(false);
  const [selectedShipmentId, setSelectedShipmentId] = useState(
    shipments.find(s => s.status === 'in_transit' || s.status === 'delayed')?.id || shipments[0]?.id || ''
  );

  const selectedShipment = shipments.find(s => s.id === selectedShipmentId);

  // Form State
  const expectedQty = selectedShipment?.cargo.reduce((sum, c) => sum + c.quantity, 0) || 100;
  const [receivedQty, setReceivedQty] = useState(expectedQty);
  const [damagedQty, setDamagedQty] = useState(0);
  const [missingQty, setMissingQty] = useState(0);
  const [inspectionStatus, setInspectionStatus] = useState<InspectionOutcome>('acceptable');
  const [deliveryStatus, setDeliveryStatus] = useState<ShipmentStatus>('delivered');
  const [recipientRemarks, setRecipientRemarks] = useState('All seals intact, temp checked on dock receipt.');
  const [confirmedBy, setConfirmedBy] = useState('Receiving Officer K. Patel');

  const handleOpenSignModal = (shpId: string) => {
    setSelectedShipmentId(shpId);
    const shp = shipments.find(s => s.id === shpId);
    const total = shp?.cargo.reduce((sum, c) => sum + c.quantity, 0) || 100;
    setReceivedQty(total);
    setDamagedQty(0);
    setMissingQty(0);
    setInspectionStatus('acceptable');
    setDeliveryStatus('delivered');
    setShowSignModal(true);
  };

  const handleSubmitDelivery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedShipment) return;

    // Auto mark discrepancy if quantities differ
    let finalStatus = deliveryStatus;
    if (damagedQty > 0 || missingQty > 0 || receivedQty < expectedQty) {
      finalStatus = 'delivered_with_discrepancy';
    }

    confirmDelivery({
      shipmentId: selectedShipment.id,
      destinationName: selectedShipment.destinationName,
      arrivalTime: new Date().toISOString().replace('T', ' ').slice(0, 16),
      expectedQuantity: expectedQty,
      receivedQuantity: receivedQty,
      damagedQuantity: damagedQty,
      missingQuantity: missingQty,
      finalInspectionStatus: inspectionStatus,
      status: finalStatus,
      recipientRemarks,
      confirmedBy,
    });

    setShowSignModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-neutral-900 tracking-tight">
            Proof of Delivery & Receiving QA Management
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Final destination inspection sign-off, discrepancy accounting, and ledger reconciliation
          </p>
        </div>

        <button
          onClick={() => setShowSignModal(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-700 text-white hover:bg-emerald-800 shadow-xs transition-colors self-start sm:self-auto"
        >
          <ClipboardCheck className="w-4 h-4" />
          <span>Record Delivery Sign-Off</span>
        </button>
      </div>

      {/* Deliveries Audit Ledger Table */}
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-neutral-200 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-neutral-900">
            Recorded Delivery Receipts ({deliveries.length})
          </h2>
          <span className="text-xs text-neutral-400">Traceable receiving dock logs</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 text-neutral-500 uppercase font-semibold text-[10px] tracking-wider border-b border-neutral-200">
              <tr>
                <th className="py-3 px-4">Receipt ID</th>
                <th className="py-3 px-4">Shipment & Destination</th>
                <th className="py-3 px-4">Arrival Timestamp</th>
                <th className="py-3 px-4 text-right">Expected</th>
                <th className="py-3 px-4 text-right">Received</th>
                <th className="py-3 px-4 text-right">Damaged</th>
                <th className="py-3 px-4 text-right">Missing</th>
                <th className="py-3 px-4">QA Status</th>
                <th className="py-3 px-4">Delivery State</th>
                <th className="py-3 px-4">Confirmed By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {deliveries.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-10 text-center text-neutral-400">
                    No completed delivery receipts recorded yet.
                  </td>
                </tr>
              ) : (
                deliveries.map(d => (
                  <tr key={d.id} className="hover:bg-neutral-50/60 transition-colors">
                    <td className="py-3 px-4 font-mono font-semibold text-neutral-900">{d.id}</td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-neutral-900">{d.destinationName}</div>
                      <div className="text-[10px] text-neutral-400 font-mono">{d.shipmentId}</div>
                    </td>
                    <td className="py-3 px-4 font-mono text-neutral-700">{d.arrivalTime}</td>
                    <td className="py-3 px-4 text-right font-mono font-medium text-neutral-900 tabular-nums">
                      {d.expectedQuantity.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-emerald-700 tabular-nums">
                      {d.receivedQuantity.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-rose-600 tabular-nums">
                      {d.damagedQuantity.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-amber-600 tabular-nums">
                      {d.missingQuantity.toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-[11px] font-medium capitalize ${
                          d.finalInspectionStatus === 'acceptable'
                            ? 'text-emerald-700'
                            : 'text-rose-600'
                        }`}
                      >
                        {d.finalInspectionStatus.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded ${
                          d.status === 'delivered'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {d.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-neutral-600 text-[11px] truncate max-w-[140px]">
                      {d.confirmedBy}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pending Delivery Check-In List */}
      <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-xs space-y-4">
        <h2 className="text-sm font-semibold text-neutral-900">
          In-Transit Fleet Awaiting Final Destination Sign-Off
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {shipments.filter(s => s.status === 'in_transit' || s.status === 'delayed').map(s => (
            <div
              key={s.id}
              className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/50 flex items-center justify-between gap-4"
            >
              <div>
                <span className="font-mono text-xs font-bold text-neutral-800">{s.id}</span>
                <div className="font-semibold text-sm text-neutral-900 mt-0.5">{s.destinationName}</div>
                <div className="text-[11px] text-neutral-500 font-mono mt-0.5">
                  Cargo: {s.cargo.reduce((sum, c) => sum + c.quantity, 0)} units · Vehicle: {s.vehicleName}
                </div>
              </div>

              <button
                onClick={() => handleOpenSignModal(s.id)}
                className="px-3.5 py-2 text-xs font-semibold bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 shadow-xs transition-colors shrink-0"
              >
                Sign & Confirm Receipt
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Sign Delivery Modal */}
      {showSignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-xl border border-neutral-200 shadow-2xl max-w-xl w-full max-h-[90vh] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200">
              <h3 className="text-base font-bold text-neutral-900">
                Confirm Destination Delivery & Final QA
              </h3>
              <button
                onClick={() => setShowSignModal(false)}
                className="p-1 text-neutral-400 hover:text-neutral-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitDelivery} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div>
                <label className="block font-medium text-neutral-700 mb-1">Select Shipment *</label>
                <select
                  value={selectedShipmentId}
                  onChange={e => {
                    setSelectedShipmentId(e.target.value);
                    const shp = shipments.find(s => s.id === e.target.value);
                    const total = shp?.cargo.reduce((sum, c) => sum + c.quantity, 0) || 100;
                    setReceivedQty(total);
                  }}
                  className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-xs"
                >
                  {shipments.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.id} — {s.destinationName} ({s.status})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Received Qty *</label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={receivedQty}
                    onChange={e => setReceivedQty(Number(e.target.value))}
                    className="w-full px-3 py-1.5 border border-neutral-200 rounded-lg text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Damaged Qty</label>
                  <input
                    type="number"
                    min={0}
                    value={damagedQty}
                    onChange={e => setDamagedQty(Number(e.target.value))}
                    className="w-full px-3 py-1.5 border border-neutral-200 rounded-lg text-xs font-mono text-rose-600 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Missing Qty</label>
                  <input
                    type="number"
                    min={0}
                    value={missingQty}
                    onChange={e => setMissingQty(Number(e.target.value))}
                    className="w-full px-3 py-1.5 border border-neutral-200 rounded-lg text-xs font-mono text-amber-600 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Final Dock QA Status</label>
                  <select
                    value={inspectionStatus}
                    onChange={e => setInspectionStatus(e.target.value as InspectionOutcome)}
                    className="w-full px-3 py-1.5 border border-neutral-200 rounded-lg text-xs"
                  >
                    <option value="acceptable">Acceptable (Clean Receipt)</option>
                    <option value="needs_manual_inspection">Needs Manual Quarantine</option>
                    <option value="damaged">Damaged in Transit</option>
                    <option value="storage_compliance_concern">Temperature Excursion Suspected</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Confirmed By Officer *</label>
                  <input
                    type="text"
                    required
                    value={confirmedBy}
                    onChange={e => setConfirmedBy(e.target.value)}
                    className="w-full px-3 py-1.5 border border-neutral-200 rounded-lg text-xs"
                    placeholder="e.g. Inspector R. Vance"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-neutral-700 mb-1">Recipient Dock Remarks</label>
                <textarea
                  rows={2}
                  value={recipientRemarks}
                  onChange={e => setRecipientRemarks(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-xs"
                />
              </div>

              <div className="pt-4 border-t border-neutral-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowSignModal(false)}
                  className="px-4 py-2 text-xs font-medium text-neutral-600 hover:bg-neutral-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs transition-colors"
                >
                  Submit & Reconcile Inventory
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
