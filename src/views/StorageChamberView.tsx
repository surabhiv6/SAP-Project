import React from 'react';
import { useApp } from '../context/AppContext';
import { StorageChamber } from '../types';
import { CATEGORIES_CONFIG } from '../data/initialData';
import {
  ThermometerSnowflake,
  Droplets,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  WifiOff,
  Activity,
  Boxes,
} from 'lucide-react';

export const StorageChamberView: React.FC = () => {
  const { chambers, setChamberSimulation, resetAllChambers, batches } = useApp();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-neutral-900 tracking-tight">
            Smart Storage Climate Surveillance
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Isolated environmental zones with independent temperature/humidity control loops and anomaly simulation
          </p>
        </div>

        <button
          onClick={resetAllChambers}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-neutral-200 text-neutral-700 hover:bg-neutral-100 transition-colors self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset All to Nominal</span>
        </button>
      </div>

      {/* Grid of 6 Storage Chambers */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {chambers.map(ch => {
          const isAlert = ch.activeAlerts.length > 0 || ch.sensorStatus === 'critical' || ch.sensorStatus === 'warning';
          const isDisconnected = ch.sensorStatus === 'disconnected';
          const storedBatches = batches.filter(b => b.chamberId === ch.id);
          const totalStockInChamber = storedBatches.reduce((acc, b) => acc + b.availableQuantity, 0);

          return (
            <div
              key={ch.id}
              className={`rounded-xl border bg-white p-5 flex flex-col justify-between shadow-xs transition-all ${
                isDisconnected
                  ? 'border-neutral-400 bg-neutral-50/70'
                  : isAlert
                  ? 'border-rose-300 ring-1 ring-rose-200'
                  : 'border-neutral-200'
              }`}
            >
              {/* Card Header */}
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-neutral-500">{ch.id}</span>
                  <div className="flex items-center gap-1.5">
                    {isDisconnected ? (
                      <span className="text-[10px] font-mono text-neutral-500 flex items-center gap-1 bg-neutral-200 px-2 py-0.5 rounded">
                        <WifiOff className="w-3 h-3" />
                        <span>OFFLINE</span>
                      </span>
                    ) : isAlert ? (
                      <span className="text-[10px] font-mono font-bold text-rose-700 flex items-center gap-1 bg-rose-100 px-2 py-0.5 rounded">
                        <AlertTriangle className="w-3 h-3" />
                        <span>EXCURSION</span>
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono text-emerald-800 flex items-center gap-1 bg-emerald-100 px-2 py-0.5 rounded">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>NOMINAL</span>
                      </span>
                    )}
                  </div>
                </div>

                <h2 className="text-sm font-bold text-neutral-900 mt-1">{ch.name}</h2>
                <div className="text-[11px] text-neutral-500 mt-0.5 truncate">
                  Allowed: {ch.allowedCategories.map(c => CATEGORIES_CONFIG[c]?.shortName).join(', ')}
                </div>

                {/* Primary Gauges */}
                <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-neutral-100">
                  {/* Temperature */}
                  <div className="p-3 rounded-lg bg-neutral-50 border border-neutral-100 space-y-1">
                    <div className="flex items-center justify-between text-[11px] text-neutral-500">
                      <span className="flex items-center gap-1">
                        <ThermometerSnowflake className="w-3.5 h-3.5 text-sky-600" />
                        <span>Temp</span>
                      </span>
                      <span className="font-mono text-[10px] text-neutral-400">
                        {ch.minTemp}° to {ch.maxTemp}°C
                      </span>
                    </div>

                    <div className="text-xl font-bold font-mono text-neutral-900 tabular-nums">
                      {isDisconnected ? (
                        <span className="text-neutral-400 text-sm">-- NO DATA --</span>
                      ) : (
                        <span
                          className={
                            ch.currentTemp > ch.maxTemp || ch.currentTemp < ch.minTemp
                              ? 'text-rose-600'
                              : 'text-neutral-900'
                          }
                        >
                          {ch.currentTemp.toFixed(1)}°C
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Humidity */}
                  <div className="p-3 rounded-lg bg-neutral-50 border border-neutral-100 space-y-1">
                    <div className="flex items-center justify-between text-[11px] text-neutral-500">
                      <span className="flex items-center gap-1">
                        <Droplets className="w-3.5 h-3.5 text-blue-600" />
                        <span>Humidity</span>
                      </span>
                      <span className="font-mono text-[10px] text-neutral-400">
                        {ch.minHumidity}-{ch.maxHumidity}%
                      </span>
                    </div>

                    <div className="text-xl font-bold font-mono text-neutral-900 tabular-nums">
                      {isDisconnected ? (
                        <span className="text-neutral-400 text-sm">-- NO DATA --</span>
                      ) : (
                        <span
                          className={
                            ch.currentHumidity > ch.maxHumidity || ch.currentHumidity < ch.minHumidity
                              ? 'text-rose-600'
                              : 'text-neutral-900'
                          }
                        >
                          {ch.currentHumidity}% RH
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Active Alerts List */}
                {ch.activeAlerts.length > 0 && (
                  <div className="mt-3 p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800 space-y-1">
                    {ch.activeAlerts.map((a, i) => (
                      <div key={i} className="flex items-start gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                        <span className="text-[11px] leading-tight font-medium">{a}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Stored Batches Preview */}
                <div className="mt-3 pt-3 border-t border-neutral-100 text-xs">
                  <div className="flex items-center justify-between text-[11px] text-neutral-500">
                    <span>Stored Batches: {storedBatches.length}</span>
                    <span className="font-mono font-medium text-neutral-800">
                      {totalStockInChamber.toLocaleString()} {ch.unit}
                    </span>
                  </div>
                </div>
              </div>

              {/* Simulation Controls (5 Required States) */}
              <div className="mt-5 pt-3 border-t border-neutral-200 space-y-1.5">
                <div className="text-[10px] font-semibold uppercase text-neutral-400 tracking-wider">
                  Telemetry Anomaly Simulator (Interactive)
                </div>
                <div className="grid grid-cols-3 gap-1 text-[10px]">
                  <button
                    onClick={() => setChamberSimulation(ch.id, 'normal')}
                    className={`py-1 px-1.5 rounded text-center transition-colors font-medium ${
                      ch.simulationMode === 'normal'
                        ? 'bg-emerald-700 text-white font-semibold'
                        : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                    }`}
                  >
                    Normal
                  </button>
                  <button
                    onClick={() => setChamberSimulation(ch.id, 'high_temp')}
                    className={`py-1 px-1.5 rounded text-center transition-colors font-medium ${
                      ch.simulationMode === 'high_temp'
                        ? 'bg-rose-600 text-white font-semibold'
                        : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                    }`}
                  >
                    + High Temp
                  </button>
                  <button
                    onClick={() => setChamberSimulation(ch.id, 'low_temp')}
                    className={`py-1 px-1.5 rounded text-center transition-colors font-medium ${
                      ch.simulationMode === 'low_temp'
                        ? 'bg-sky-700 text-white font-semibold'
                        : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                    }`}
                  >
                    - Low Temp
                  </button>
                  <button
                    onClick={() => setChamberSimulation(ch.id, 'high_humidity')}
                    className={`py-1 px-1.5 rounded text-center transition-colors font-medium ${
                      ch.simulationMode === 'high_humidity'
                        ? 'bg-blue-700 text-white font-semibold'
                        : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                    }`}
                  >
                    High RH
                  </button>
                  <button
                    onClick={() => setChamberSimulation(ch.id, 'sensor_disconnected')}
                    className={`col-span-2 py-1 px-1.5 rounded text-center transition-colors font-medium ${
                      ch.simulationMode === 'sensor_disconnected'
                        ? 'bg-neutral-900 text-white font-semibold'
                        : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                    }`}
                  >
                    Disconnect Sensor
                  </button>
                </div>
                <div className="text-[10px] text-neutral-400 font-mono pt-1 truncate">
                  Updated: {ch.lastUpdated}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
