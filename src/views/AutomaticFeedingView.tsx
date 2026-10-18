import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES_CONFIG } from '../data/initialData';
import {
  Play,
  Pause,
  Square,
  ArrowRightLeft,
  Cpu,
  Layers,
  Activity,
  AlertOctagon,
  CheckCircle,
  Clock,
  ArrowRight,
  Radio,
} from 'lucide-react';

export const AutomaticFeedingView: React.FC = () => {
  const {
    feederState,
    startFeeding,
    pauseFeeding,
    stopFeeding,
    processSingleSortingStep,
    loadAllUnsortedToHopper,
    products,
    setActiveTab,
  } = useApp();

  const [simulatedError, setSimulatedError] = useState<string | null>(null);

  // Products currently in hopper queue
  const hopperProducts = feederState.queue
    .map(id => products.find(p => p.id === id))
    .filter(Boolean) as typeof products;

  // Single step trigger
  const handleStep = () => {
    if (simulatedError) {
      return;
    }
    const success = processSingleSortingStep();
    if (!success) {
      stopFeeding();
    }
  };

  const toggleSimulatedJam = () => {
    if (simulatedError) {
      setSimulatedError(null);
    } else {
      setSimulatedError('Vibratory Bowl Jam: Optical proximity sensor detects obstruction at throat aperture.');
      stopFeeding();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-neutral-900 tracking-tight">
            Automatic Feeding Mechanism
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Bulk hopper metering, vibration singulation, and sensor-gated product transfer
          </p>
        </div>

        {/* Feeding Controls */}
        <div className="flex items-center gap-2">
          {feederState.status !== 'feeding' ? (
            <button
              onClick={() => {
                if (simulatedError) setSimulatedError(null);
                if (feederState.queue.length === 0) loadAllUnsortedToHopper();
                startFeeding();
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-emerald-700 text-white hover:bg-emerald-800 transition-colors shadow-xs"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{feederState.status === 'paused' ? 'Resume Feeder' : 'Start Feeder'}</span>
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
            onClick={handleStep}
            disabled={feederState.queue.length === 0 || !!simulatedError}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg bg-neutral-900 text-white hover:bg-neutral-800 disabled:opacity-40 transition-colors"
          >
            <span>Single Transfer Step</span>
          </button>

          <button
            onClick={toggleSimulatedJam}
            className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border transition-colors ${
              simulatedError
                ? 'bg-rose-100 border-rose-300 text-rose-800 font-bold'
                : 'border-neutral-200 text-neutral-600 hover:bg-neutral-100'
            }`}
          >
            <AlertOctagon className="w-3.5 h-3.5" />
            <span>{simulatedError ? 'Clear Jam' : 'Simulate Jam'}</span>
          </button>
        </div>
      </div>

      {/* Simulated Error Alert if active */}
      {simulatedError && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <AlertOctagon className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-rose-950 text-xs">FEEDER ERROR DETECTED</div>
              <p className="text-xs text-rose-800 mt-0.5">{simulatedError}</p>
              <div className="mt-2 text-[11px] text-rose-700 font-medium">
                Recommendation: Inspect throat feeder opening, clear obstruction, and press "Clear Jam" to resume.
              </div>
            </div>
          </div>
          <button
            onClick={() => setSimulatedError(null)}
            className="px-2.5 py-1 text-xs bg-rose-200 text-rose-900 rounded-lg hover:bg-rose-300 font-medium"
          >
            Reset Sensor
          </button>
        </div>
      )}

      {/* Live Feeder Telemetry Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded-xl border border-neutral-200">
          <div className="text-xs text-neutral-500 font-medium">Feeder Status</div>
          <div className="flex items-center gap-2 mt-1">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                simulatedError
                  ? 'bg-rose-500'
                  : feederState.status === 'feeding'
                  ? 'bg-emerald-500 animate-pulse'
                  : feederState.status === 'paused'
                  ? 'bg-amber-500'
                  : 'bg-neutral-300'
              }`}
            />
            <span className="text-lg font-bold font-mono uppercase text-neutral-900">
              {simulatedError ? 'ERROR' : feederState.status}
            </span>
          </div>
          <div className="text-[11px] text-neutral-400 mt-0.5">Control state</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-neutral-200">
          <div className="text-xs text-neutral-500 font-medium">Products in Hopper</div>
          <div className="text-xl font-bold font-mono text-neutral-900 mt-1 tabular-nums">
            {feederState.queue.length} units
          </div>
          <div className="text-[11px] text-neutral-400 mt-0.5">Awaiting transfer</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-neutral-200">
          <div className="text-xs text-neutral-500 font-medium">Singulated & Transferred</div>
          <div className="text-xl font-bold font-mono text-emerald-700 mt-1 tabular-nums">
            {feederState.itemsProcessed} units
          </div>
          <div className="text-[11px] text-neutral-400 mt-0.5">Transferred to vision</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-neutral-200">
          <div className="text-xs text-neutral-500 font-medium">Feeding Speed</div>
          <div className="text-xl font-bold font-mono text-neutral-900 mt-1 tabular-nums">
            {feederState.speedRate} pcs/min
          </div>
          <div className="text-[11px] text-neutral-400 mt-0.5">Vibration frequency: 50 Hz</div>
        </div>
      </div>

      {/* Hopper Queue and Singulator Transfer Display */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-neutral-900">
              Current Products in Hopper Queue (FIFO Singulator)
            </h2>
            <p className="text-xs text-neutral-500">
              Double-counting prevention active: Each product is tagged with a unique token and decremented only upon gate confirmation.
            </p>
          </div>
          {feederState.queue.length === 0 && (
            <button
              onClick={loadAllUnsortedToHopper}
              className="text-xs font-semibold text-emerald-800 hover:text-emerald-900"
            >
              + Reload All Unsorted Products
            </button>
          )}
        </div>

        <div className="border border-neutral-200 rounded-lg overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 text-neutral-500 uppercase text-[10px] tracking-wider border-b border-neutral-200 font-semibold">
              <tr>
                <th className="py-2.5 px-3">Queue Position</th>
                <th className="py-2.5 px-3">Product ID & Name</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3 text-right">Quantity</th>
                <th className="py-2.5 px-3">Packaging</th>
                <th className="py-2.5 px-3">Intended Chamber</th>
                <th className="py-2.5 px-3 text-right">Transfer Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {hopperProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-neutral-400 text-xs">
                    Hopper is currently empty. Click above to reload unsorted batches or register new products.
                  </td>
                </tr>
              ) : (
                hopperProducts.map((p, idx) => (
                  <tr
                    key={p.id}
                    className={`hover:bg-neutral-50/50 transition-colors ${
                      idx === 0 ? 'bg-emerald-50/30' : ''
                    }`}
                  >
                    <td className="py-2.5 px-3 font-mono font-bold text-neutral-700">
                      #{idx + 1} {idx === 0 && <span className="text-[10px] text-emerald-700">(Next)</span>}
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="font-semibold text-neutral-900">{p.name}</div>
                      <div className="text-[10px] font-mono text-neutral-400">{p.id}</div>
                    </td>
                    <td className="py-2.5 px-3 text-neutral-700">
                      {CATEGORIES_CONFIG[p.category]?.name || p.category}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-medium text-neutral-900 tabular-nums">
                      {p.quantity.toLocaleString()} {p.unit}
                    </td>
                    <td className="py-2.5 px-3 text-neutral-600 capitalize">
                      {p.packagingCondition}
                    </td>
                    <td className="py-2.5 px-3 text-neutral-700 font-mono text-[11px]">
                      {p.targetChamberId}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      {idx === 0 ? (
                        <button
                          onClick={handleStep}
                          disabled={!!simulatedError}
                          className="px-2.5 py-1 text-[11px] font-medium bg-emerald-700 text-white rounded hover:bg-emerald-800 disabled:opacity-40 transition-colors"
                        >
                          Transfer Now &rarr;
                        </button>
                      ) : (
                        <span className="text-[11px] text-neutral-400">In Line</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Future Hardware Integration Blueprint (Required by Section 7) */}
      <div className="bg-neutral-900 text-neutral-100 rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Cpu className="w-5 h-5 text-emerald-400" />
          <h2 className="text-sm font-semibold tracking-wide text-white">
            Future Physical Hardware Integration Architecture
          </h2>
        </div>
        <p className="text-xs text-neutral-300 leading-relaxed">
          The software simulation above implements the state-machine protocol ready for drop-in coupling with physical electromechanical hardware:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs pt-1">
          <div className="p-3 rounded-lg bg-neutral-800/80 border border-neutral-700 space-y-1">
            <span className="font-semibold text-emerald-400">1. Stepper / BLDC Motor</span>
            <p className="text-neutral-400 text-[11px]">
              Drives the vibratory singulation tray and belt motor. Controlled via PWM speed pulses from microcontroller.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-neutral-800/80 border border-neutral-700 space-y-1">
            <span className="font-semibold text-emerald-400">2. Proximity Sensor (IR / TOF)</span>
            <p className="text-neutral-400 text-[11px]">
              Mounted at feeder throat. Generates hardware interrupts when an item leaves hopper, preventing double-feed.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-neutral-800/80 border border-neutral-700 space-y-1">
            <span className="font-semibold text-emerald-400">3. Microcontroller (ESP32 / Arduino)</span>
            <p className="text-neutral-400 text-[11px]">
              Acts as edge IoT node running FreeRTOS. Exposes standard MQTT JSON telemetry topics (<code className="text-emerald-300">feeder/telemetry</code>).
            </p>
          </div>

          <div className="p-3 rounded-lg bg-neutral-800/80 border border-neutral-700 space-y-1">
            <span className="font-semibold text-emerald-400">4. Pneumatic Solenoids</span>
            <p className="text-neutral-400 text-[11px]">
              Actuates high-speed air diverter flaps triggered 250ms after camera inspection classification event.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
