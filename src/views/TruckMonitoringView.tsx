import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Shipment, Vehicle } from '../types';
import {
  Navigation,
  ThermometerSnowflake,
  Droplets,
  Clock,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  WifiOff,
  Truck,
  MapPin,
  ArrowRight,
  Info,
} from 'lucide-react';

export const TruckMonitoringView: React.FC = () => {
  const { shipments, vehicles, updateShipmentSimulation, setActiveTab } = useApp();

  const [selectedShipmentId, setSelectedShipmentId] = useState<string>(
    shipments.find(s => s.status === 'in_transit')?.id || shipments[0]?.id || ''
  );

  const selectedShipment = shipments.find(s => s.id === selectedShipmentId) || shipments[0];
  const assignedVehicle = vehicles.find(v => v.id === selectedShipment?.vehicleId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-neutral-900 tracking-tight">
          Smart Truck & Fleet Transit Telemetry
        </h1>
        <p className="text-xs text-neutral-500 mt-0.5">
          Simulated real-time in-transit telemetry: reefer temperature monitoring, simulated GPS breadcrumbs, and exception handling
        </p>
      </div>

      {/* Prominent Simulated GPS Disclosure */}
      <div className="p-3.5 rounded-xl bg-neutral-100 border border-neutral-200 flex items-start gap-2.5 text-xs text-neutral-600">
        <Info className="w-4 h-4 text-neutral-500 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-neutral-800">Simulated Telemetry Disclosure:</span>
          <p className="text-[11px] text-neutral-500 mt-0.5">
            All geographic coordinates, reefer temperature sensor records, and traffic delay indicators displayed in this module are generated through software simulation routines to demonstrate automated resilience protocols.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Vehicle & Shipment Selector */}
        <div className="bg-white rounded-xl border border-neutral-200 p-4 space-y-3">
          <span className="text-xs font-semibold text-neutral-900">Active Transit Corridor</span>

          <div className="space-y-2 max-h-[500px] overflow-y-auto">
            {shipments.map(s => {
              const isSelected = s.id === selectedShipmentId;
              const hasAlert = s.tempAlert || s.simulatedEvent === 'breakdown';

              return (
                <button
                  key={s.id}
                  onClick={() => setSelectedShipmentId(s.id)}
                  className={`w-full text-left p-3 rounded-lg border text-xs transition-colors flex flex-col justify-between ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/50 shadow-xs'
                      : hasAlert
                      ? 'border-rose-300 bg-rose-50/40'
                      : 'border-neutral-200 bg-white hover:bg-neutral-50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-semibold text-neutral-900">{s.destinationName}</div>
                      <div className="text-[10px] text-neutral-500 font-mono mt-0.5">
                        {s.id} · {s.vehicleName.split(' ')[0]}
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-mono font-bold uppercase px-1.5 py-0.5 rounded ${
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
                  </div>

                  <div className="mt-3 flex items-center justify-between text-[11px]">
                    <span className="text-neutral-500">{s.cargo.length} cargo batches</span>
                    <span className="font-mono text-neutral-700 font-medium">
                      {s.simulatedProgressPercent}% complete
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Col: Live Transit Monitor & Simulation Triggers */}
        {selectedShipment ? (
          <div className="lg:col-span-2 space-y-6">
            {/* Live Telemetry Card */}
            <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-100 pb-4">
                <div>
                  <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase">
                    Shipment ID: {selectedShipment.id}
                  </span>
                  <h2 className="text-base font-bold text-neutral-900 mt-0.5">
                    {selectedShipment.destinationName}
                  </h2>
                  <div className="text-xs text-neutral-500 font-mono mt-0.5">
                    Vehicle: {selectedShipment.vehicleName} · Plate: {assignedVehicle?.licensePlate || 'N/A'}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[10px] text-neutral-400 uppercase font-medium">ETA Target</div>
                  <div className="text-sm font-bold font-mono text-neutral-900">
                    {selectedShipment.estimatedArrival}
                  </div>
                  {selectedShipment.delayHours ? (
                    <div className="text-[11px] font-mono text-amber-600 font-semibold">
                      +{selectedShipment.delayHours}h Traffic Delay
                    </div>
                  ) : null}
                </div>
              </div>

              {/* Sensor Readings Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-lg bg-neutral-50 border border-neutral-200">
                  <span className="text-[10px] text-neutral-500 font-medium">Reefer Temperature</span>
                  <div className="text-xl font-bold font-mono text-neutral-900 mt-1 tabular-nums">
                    {selectedShipment.currentCargoTemp !== undefined ? (
                      <span className={selectedShipment.tempAlert ? 'text-rose-600' : 'text-emerald-700'}>
                        {selectedShipment.currentCargoTemp.toFixed(1)}°C
                      </span>
                    ) : (
                      'Ambient'
                    )}
                  </div>
                  <span className="text-[10px] text-neutral-400">Limit: 1°C to 4°C</span>
                </div>

                <div className="p-3 rounded-lg bg-neutral-50 border border-neutral-200">
                  <span className="text-[10px] text-neutral-500 font-medium">Cargo Compartment RH</span>
                  <div className="text-xl font-bold font-mono text-neutral-900 mt-1 tabular-nums">
                    74% RH
                  </div>
                  <span className="text-[10px] text-neutral-400">Target: 70-80%</span>
                </div>

                <div className="p-3 rounded-lg bg-neutral-50 border border-neutral-200">
                  <span className="text-[10px] text-neutral-500 font-medium">Simulated GPS Fix</span>
                  <div className="text-xs font-bold font-mono text-neutral-900 mt-1">
                    {selectedShipment.simulatedEvent === 'gps_loss' ? (
                      <span className="text-rose-600">LOST SIGNAL</span>
                    ) : (
                      `${selectedShipment.currentSimulatedLat.toFixed(4)}, ${selectedShipment.currentSimulatedLng.toFixed(4)}`
                    )}
                  </div>
                  <span className="text-[10px] text-neutral-400">Cellular / GNSS</span>
                </div>

                <div className="p-3 rounded-lg bg-neutral-50 border border-neutral-200">
                  <span className="text-[10px] text-neutral-500 font-medium">Vehicle Status</span>
                  <div className="text-xs font-bold font-mono uppercase text-neutral-900 mt-1">
                    <span className={assignedVehicle?.status === 'breakdown' ? 'text-rose-600' : 'text-emerald-700'}>
                      {assignedVehicle?.status || 'nominal'}
                    </span>
                  </div>
                  <span className="text-[10px] text-neutral-400">Battery: 84%</span>
                </div>
              </div>

              {/* Simulated Route Progress Diagram */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-neutral-700">Transit Route Milestones</span>
                  <span className="font-mono text-neutral-500 font-medium">
                    {selectedShipment.simulatedProgressPercent}% complete
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-neutral-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`h-2.5 rounded-full transition-all duration-500 ${
                      selectedShipment.tempAlert || selectedShipment.simulatedEvent === 'breakdown'
                        ? 'bg-rose-500'
                        : 'bg-emerald-600'
                    }`}
                    style={{ width: `${selectedShipment.simulatedProgressPercent}%` }}
                  />
                </div>

                {/* Milestones */}
                <div className="flex items-center justify-between text-[10px] text-neutral-400 font-mono pt-1">
                  <span>01. Sorting Hub (Departure)</span>
                  <span>02. Highway 4 Checkpoint</span>
                  <span>03. Metro Ring Road</span>
                  <span>04. Receiving Dock</span>
                </div>
              </div>
            </div>

            {/* Interactive Transit Scenario Simulator (Required by Section 14) */}
            <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-xs space-y-3">
              <div>
                <h3 className="text-xs font-semibold text-neutral-900 uppercase tracking-wide">
                  Interactive Route Event Simulator
                </h3>
                <p className="text-xs text-neutral-500">
                  Trigger supply chain disturbances to test the automated resilience and recovery engine:
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                <button
                  onClick={() => updateShipmentSimulation(selectedShipment.id, 'normal')}
                  className="p-2.5 rounded-lg border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 text-left font-medium text-neutral-800 transition-colors"
                >
                  <div className="font-semibold text-emerald-700">Nominal En Route</div>
                  <div className="text-[10px] text-neutral-500 mt-0.5">Smooth transit, on-time ETA</div>
                </button>

                <button
                  onClick={() => updateShipmentSimulation(selectedShipment.id, 'temp_excursion')}
                  className="p-2.5 rounded-lg border border-rose-200 bg-rose-50/60 hover:bg-rose-100 text-left font-medium text-rose-900 transition-colors"
                >
                  <div className="font-semibold text-rose-700">+ Temp Excursion</div>
                  <div className="text-[10px] text-rose-600 mt-0.5">Jump to 11.2°C reefer alarm</div>
                </button>

                <button
                  onClick={() => updateShipmentSimulation(selectedShipment.id, 'delay')}
                  className="p-2.5 rounded-lg border border-amber-200 bg-amber-50/60 hover:bg-amber-100 text-left font-medium text-amber-900 transition-colors"
                >
                  <div className="font-semibold text-amber-700">+ Traffic Jam Delay</div>
                  <div className="text-[10px] text-amber-600 mt-0.5">+2.5 hour arrival delay</div>
                </button>

                <button
                  onClick={() => updateShipmentSimulation(selectedShipment.id, 'breakdown')}
                  className="p-2.5 rounded-lg border border-rose-300 bg-rose-100 hover:bg-rose-200 text-left font-medium text-rose-950 transition-colors"
                >
                  <div className="font-semibold text-rose-800">Vehicle Breakdown</div>
                  <div className="text-[10px] text-rose-700 mt-0.5">Transmission failure alert</div>
                </button>

                <button
                  onClick={() => updateShipmentSimulation(selectedShipment.id, 'gps_loss')}
                  className="p-2.5 rounded-lg border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 text-left font-medium text-neutral-800 transition-colors"
                >
                  <div className="font-semibold text-neutral-700">GPS Signal Blackout</div>
                  <div className="text-[10px] text-neutral-500 mt-0.5">Tunnel / gateway dropout</div>
                </button>

                <button
                  onClick={() => {
                    updateShipmentSimulation(selectedShipment.id, 'delivered');
                    setActiveTab('delivery');
                  }}
                  className="p-2.5 rounded-lg border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-left font-medium text-emerald-900 transition-colors"
                >
                  <div className="font-semibold text-emerald-800">Arrival at Dock</div>
                  <div className="text-[10px] text-emerald-700 mt-0.5">Open delivery sign-off &rarr;</div>
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
