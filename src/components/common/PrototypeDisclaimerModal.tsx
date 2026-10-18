import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldAlert, Cpu, HardDrive, Eye, AlertTriangle, X } from 'lucide-react';

export const PrototypeDisclaimerModal: React.FC = () => {
  const { showLimitationsModal, setShowLimitationsModal } = useApp();

  if (!showLimitationsModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-xl border border-neutral-200 shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 bg-neutral-50/70">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-neutral-900">
                Prototype Architecture & Methodology Disclosures
              </h3>
              <p className="text-xs text-neutral-500">
                Green Resilience AI · Student Innovation Demonstration System
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowLimitationsModal(false)}
            className="p-1 rounded-md text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm text-neutral-600">
          <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-lg p-4">
            <h4 className="font-semibold text-emerald-950 text-xs tracking-wide mb-1">
              Project Statement & Purpose
            </h4>
            <p className="text-xs text-emerald-900 leading-relaxed">
              This system is an applied student innovation software prototype designed to demonstrate multi-product resilient logistics, automated sorting architectures, condition-based cold chain routing, and rule-based risk recovery. The statements below clarify the current prototype boundaries and prevent false claims.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3.5 rounded-lg border border-neutral-200 bg-white space-y-1.5">
              <div className="flex items-center gap-2 text-neutral-900 font-medium text-xs">
                <Cpu className="w-4 h-4 text-emerald-600" />
                <span>Hardware & Sensor Simulation</span>
              </div>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Physical conveyor motors, infrared proximity switches, optical sorting pneumatics, and vehicle GPS transponders are simulated within software. Telemetry cycles model real Modbus/MQTT data packets.
              </p>
            </div>

            <div className="p-3.5 rounded-lg border border-neutral-200 bg-white space-y-1.5">
              <div className="flex items-center gap-2 text-neutral-900 font-medium text-xs">
                <Eye className="w-4 h-4 text-emerald-600" />
                <span>Visual Classifier Rigor</span>
              </div>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Optical defect detection is an experimental pipeline. In accordance with food safety and GMP pharma regulations, visual inspection alone never certifies microbiological safety or chemical potency.
              </p>
            </div>

            <div className="p-3.5 rounded-lg border border-neutral-200 bg-white space-y-1.5">
              <div className="flex items-center gap-2 text-neutral-900 font-medium text-xs">
                <HardDrive className="w-4 h-4 text-emerald-600" />
                <span>Storage & Persistence</span>
              </div>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Current prototype state is preserved locally via client browser storage (<code className="text-emerald-700 bg-emerald-50 px-1 py-0.5 rounded">localStorage</code>). Production deployment requires Cloud PostgreSQL / Enterprise ERP integration.
              </p>
            </div>

            <div className="p-3.5 rounded-lg border border-neutral-200 bg-white space-y-1.5">
              <div className="flex items-center gap-2 text-neutral-900 font-medium text-xs">
                <AlertTriangle className="w-4 h-4 text-emerald-600" />
                <span>Explainable Rule-Based Logic</span>
              </div>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Risk alerts, destination scoring, and recovery recommendations execute explainable deterministic decision trees. No unverified "black-box" predictive ML claims are asserted.
              </p>
            </div>
          </div>

          <div className="border-t border-neutral-200 pt-4 text-xs text-neutral-500 space-y-1">
            <p className="font-semibold text-neutral-800">
              Medicines & Cold Chain Protocols:
            </p>
            <p>
              Expired pharmaceuticals are strictly locked for destruction/quarantine and are never recommended for secondary distribution. Temperature excursions record elapsed exposure times before flagging mandatory QA hold.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-neutral-50 border-t border-neutral-200 flex justify-end">
          <button
            onClick={() => setShowLimitationsModal(false)}
            className="px-4 py-2 bg-neutral-900 text-white rounded-lg text-xs font-medium hover:bg-neutral-800 transition-colors"
          >
            Acknowledge & Continue
          </button>
        </div>
      </div>
    </div>
  );
};
