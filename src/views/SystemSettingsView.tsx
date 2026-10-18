import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Sliders,
  RotateCcw,
  Cpu,
  Brain,
  HardDrive,
  Info,
  ShieldCheck,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';

export const SystemSettingsView: React.FC = () => {
  const { resetDemoData, setShowLimitationsModal } = useApp();
  const [resetSuccess, setResetSuccess] = useState(false);
  const [telemetryInterval, setTelemetryInterval] = useState('30');

  const handleReset = () => {
    if (confirm('Reset all demonstration data to factory default prototype state? Any unsaved edits will be cleared.')) {
      resetDemoData();
      setResetSuccess(true);
      setTimeout(() => setResetSuccess(false), 3000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-neutral-900 tracking-tight">
          System Settings & Continuous Improvement Architecture
        </h1>
        <p className="text-xs text-neutral-500 mt-0.5">
          Configuration parameters, ML pipeline training readiness, and IoT hardware pinout specifications
        </p>
      </div>

      {/* Module 15: Continuous Improvement & Machine Learning Readiness */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-emerald-700" />
          <h2 className="text-sm font-semibold text-neutral-900">
            Future Machine-Learning Training & Evaluation Pipeline
          </h2>
        </div>

        {/* Academic / Scientific Rigor Note */}
        <div className="p-3.5 bg-neutral-50 rounded-lg border border-neutral-200 text-xs text-neutral-600 space-y-1.5">
          <span className="font-semibold text-neutral-900">
            Scientific Truth Disclosure:
          </span>
          <p className="text-[11px] leading-relaxed">
            The current system utilizes deterministic heuristic algorithms and physical limits. It does <em>not</em> claim to automatically self-learn or improve without a structured retraining pipeline. Instead, every operational session logs verified ground-truth data points designed to feed future supervised learning workflows:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs pt-1">
          <div className="p-4 rounded-lg border border-neutral-200 bg-white space-y-2">
            <span className="font-bold text-neutral-900 block">1. Computer Vision Retraining</span>
            <p className="text-[11px] text-neutral-500 leading-relaxed">
              Manual inspection verdicts and blemish observations create labeled training bounding boxes (<code className="text-emerald-700">YOLOv8 / ResNet</code>) to replace the current experimental visual screening heuristic.
            </p>
          </div>

          <div className="p-4 rounded-lg border border-neutral-200 bg-white space-y-2">
            <span className="font-bold text-neutral-900 block">2. Dynamic ETA & Spoilage Regression</span>
            <p className="text-[11px] text-neutral-500 leading-relaxed">
              Historical delivery timestamps and reefer temperature integration log files form feature matrices for gradient-boosted trees (<code className="text-emerald-700">XGBoost</code>) to estimate perishable shelf-life decay with empirical confidence intervals.
            </p>
          </div>

          <div className="p-4 rounded-lg border border-neutral-200 bg-white space-y-2">
            <span className="font-bold text-neutral-900 block">3. Reinforcement Fleet Dispatch</span>
            <p className="text-[11px] text-neutral-500 leading-relaxed">
              Operator recovery authorizations and subsequent delivery successes yield reward signals for Q-learning route rerouting agents under simulated traffic disruptions.
            </p>
          </div>
        </div>
      </div>

      {/* IoT Hardware Interface Specifications */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Cpu className="w-5 h-5 text-emerald-700" />
          <h2 className="text-sm font-semibold text-neutral-900">
            Microcontroller (ESP32-S3) GPIO Pinout Architecture
          </h2>
        </div>
        <p className="text-xs text-neutral-500">
          Standard pin mappings for prototype physical sorting & cold chamber instrumentation:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-neutral-50 border border-neutral-200 space-y-1">
            <div className="font-mono font-bold text-emerald-800">GPIO 21 (SDA) / 22 (SCL)</div>
            <div className="font-medium text-neutral-800">I2C Environmental Bus</div>
            <p className="text-[11px] text-neutral-500">SHT31 / BME280 Chamber Temperature & Humidity Sensors</p>
          </div>

          <div className="p-3 rounded-lg bg-neutral-50 border border-neutral-200 space-y-1">
            <div className="font-mono font-bold text-emerald-800">GPIO 34 (Interrupt)</div>
            <div className="font-medium text-neutral-800">Throat Proximity Switch</div>
            <p className="text-[11px] text-neutral-500">TCRT5000 Infrared Singulation Counter (Zero Double-Count)</p>
          </div>

          <div className="p-3 rounded-lg bg-neutral-50 border border-neutral-200 space-y-1">
            <div className="font-mono font-bold text-emerald-800">GPIO 16 / 17 / 18</div>
            <div className="font-medium text-neutral-800">Pneumatic Diverters</div>
            <p className="text-[11px] text-neutral-500">ULN2803 Darlington Driver for 12V High-Speed Air Valves</p>
          </div>

          <div className="p-3 rounded-lg bg-neutral-50 border border-neutral-200 space-y-1">
            <div className="font-mono font-bold text-emerald-800">GPIO 4 (PWM) / 5 (DIR)</div>
            <div className="font-medium text-neutral-800">Conveyor Motor Drive</div>
            <p className="text-[11px] text-neutral-500">TMC2209 Silent Stepper Driver for Constant Belt Velocity</p>
          </div>
        </div>
      </div>

      {/* Prototype Operations & Local Data Controls */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-xs space-y-4">
        <h2 className="text-sm font-semibold text-neutral-900">
          Demonstration Environment Management
        </h2>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg bg-neutral-50 border border-neutral-200">
          <div>
            <div className="font-semibold text-neutral-900 text-xs">Reset Demonstration Database</div>
            <p className="text-neutral-500 text-[11px] mt-0.5">
              Revert all products, chambers, batches, and shipments to factory demonstration baseline.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {resetSuccess && (
              <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                <CheckCircle className="w-4 h-4" />
                <span>Reset Complete!</span>
              </span>
            )}
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-rose-600 text-white rounded-lg text-xs font-semibold hover:bg-rose-700 shadow-xs transition-colors shrink-0"
            >
              Reset Demo Records
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <button
            onClick={() => setShowLimitationsModal(true)}
            className="text-xs text-emerald-800 hover:underline font-medium"
          >
            Review Prototype Architecture & Disclosures Modal &rarr;
          </button>
          <span className="text-[11px] text-neutral-400 font-mono">Build v2026.10.18</span>
        </div>
      </div>
    </div>
  );
};
