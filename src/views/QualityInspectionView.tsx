import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { InspectionOutcome, ProductItem } from '../types';
import { CATEGORIES_CONFIG } from '../data/initialData';
import {
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  HelpCircle,
  Save,
  Search,
  SlidersHorizontal,
  Info,
  ShieldCheck,
} from 'lucide-react';

export const QualityInspectionView: React.FC = () => {
  const { products, updateInspection } = useApp();

  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || '');
  const [outcome, setOutcome] = useState<InspectionOutcome>('acceptable');
  const [notes, setNotes] = useState<string>('');
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  // Category specific inspection criteria fields state
  const [vegColor, setVegColor] = useState('Uniform normal pigmentation');
  const [vegSpots, setVegSpots] = useState('No visible fungal/black spots detected');
  const [vegSurfaceDamage, setVegSurfaceDamage] = useState('Zero mechanical abrasions');
  const [vegRipeness, setVegRipeness] = useState('Optimal commercial harvest stage');

  const [dairyTempHistory, setDairyTempHistory] = useState('Nominal 3.1°C inbound (Compliant with 1-4°C rule)');
  const [dairySealIntegrity, setDairySealIntegrity] = useState('Hermetic seal intact, zero leakage');

  const [meatTempHistory, setMeatTempHistory] = useState('Sub-zero 0.2°C maintained');
  const [meatVetCheck, setMeatVetCheck] = useState('USDA / HACCP certified inspection stamp verified');

  const [medBarcodeStatus, setMedBarcodeStatus] = useState('GS1 2D Datamatrix verified against central registry');
  const [medCoACheck, setMedCoACheck] = useState('Certificate of Analysis batch match confirmed');
  const [medStorageHistory, setMedStorageHistory] = useState('Controlled RH 48% (Target < 60%)');

  const [packAirtight, setPackAirtight] = useState('Foil barrier seal undamaged, no moisture ingress');
  const [mfgDefects, setMfgDefects] = useState('Zero structural deformation or denting in outer packaging');

  const selectedProduct = products.find(p => p.id === selectedProductId) || products[0];

  const handleSelectProduct = (p: ProductItem) => {
    setSelectedProductId(p.id);
    setOutcome(p.inspectionStatus);
    setNotes(p.inspectionNotes || '');
    setSavedSuccess(false);
  };

  const handleSaveInspection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    // Compose comprehensive audit note based on category criteria
    let combinedNote = notes;
    if (selectedProduct.category === 'vegetables_fruits') {
      combinedNote = `Produce check: ${vegColor}; ${vegSpots}; ${vegSurfaceDamage}; ${vegRipeness}. ${notes}`;
    } else if (selectedProduct.category === 'dairy') {
      combinedNote = `Dairy check: ${dairyTempHistory}; ${dairySealIntegrity}. ${notes}`;
    } else if (selectedProduct.category === 'meat_seafood') {
      combinedNote = `Meat/Seafood check: ${meatTempHistory}; ${meatVetCheck}. ${notes}`;
    } else if (selectedProduct.category === 'medicines') {
      combinedNote = `Pharmaceutical check: ${medBarcodeStatus}; ${medCoACheck}; ${medStorageHistory}. ${notes}`;
    } else if (selectedProduct.category === 'packaged_foods') {
      combinedNote = `Packaged foods check: ${packAirtight}. ${notes}`;
    } else if (selectedProduct.category === 'manufactured' || selectedProduct.category === 'other') {
      combinedNote = `Manufactured check: ${mfgDefects}. ${notes}`;
    }

    updateInspection(selectedProduct.id, outcome, combinedNote);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-neutral-900 tracking-tight">
          Product-Specific Quality Inspection Interface
        </h1>
        <p className="text-xs text-neutral-500 mt-0.5">
          Standardized criteria for perishables, dairy, cold meats, pharmaceuticals, and packaged goods
        </p>
      </div>

      {/* Mandatory Safety Rigor Notice */}
      <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200/90 flex items-start gap-3 text-xs text-amber-900">
        <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-semibold text-amber-950">
            Regulated Quality Assurance Principle:
          </span>
          <p className="leading-relaxed">
            Food microbiological safety and pharmaceutical active potency cannot be certified solely by camera images or printed dates. Automated visual classifiers serve strictly as an initial screening tool. Products failing criteria or displaying packaging anomalies require physical lab examination.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Product Selector Table */}
        <div className="bg-white rounded-xl border border-neutral-200 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-900">Select Item to Inspect</span>
            <span className="text-[11px] font-mono text-neutral-400">{products.length} registered</span>
          </div>

          <div className="space-y-1.5 max-h-[550px] overflow-y-auto pr-1">
            {products.map(p => {
              const isSelected = p.id === selectedProductId;
              return (
                <button
                  key={p.id}
                  onClick={() => handleSelectProduct(p)}
                  className={`w-full text-left p-3 rounded-lg border text-xs transition-colors flex flex-col justify-between ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/60 shadow-xs'
                      : 'border-neutral-200 bg-white hover:bg-neutral-50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-semibold text-neutral-900">{p.name}</div>
                      <div className="text-[10px] text-neutral-400 font-mono mt-0.5">
                        {p.id} · {p.batchNumber}
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-medium capitalize px-1.5 py-0.5 rounded ${
                        p.inspectionStatus === 'acceptable'
                          ? 'bg-emerald-100 text-emerald-800'
                          : p.inspectionStatus === 'damaged'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {p.inspectionStatus.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-2 text-[11px] text-neutral-500">
                    <span>{CATEGORIES_CONFIG[p.category]?.shortName}</span>
                    <span className="font-mono tabular-nums">{p.quantity} {p.unit}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Col: Category Specific Inspection Form */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-neutral-200 p-6 space-y-6">
          {selectedProduct ? (
            <form onSubmit={handleSaveInspection} className="space-y-5">
              <div className="flex items-start justify-between border-b border-neutral-200 pb-4">
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-700">
                    Category: {CATEGORIES_CONFIG[selectedProduct.category]?.name}
                  </span>
                  <h2 className="text-lg font-bold text-neutral-900 mt-0.5">
                    {selectedProduct.name}
                  </h2>
                  <div className="text-xs text-neutral-500 font-mono mt-1">
                    Batch: {selectedProduct.batchNumber} · Supplier: {selectedProduct.supplier} · Stored in {selectedProduct.targetChamberId}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs text-neutral-500">Recorded Quantity</div>
                  <div className="text-lg font-bold font-mono text-neutral-900 tabular-nums">
                    {selectedProduct.quantity.toLocaleString()} {selectedProduct.unit}
                  </div>
                </div>
              </div>

              {/* Dynamic Category Specific Checkpoints */}
              <div className="space-y-4">
                <h3 className="text-xs font-semibold text-neutral-900 uppercase tracking-wide">
                  Category Quality Checkpoints
                </h3>

                {selectedProduct.category === 'vegetables_fruits' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block font-medium text-neutral-700 mb-1">Visible Color & Pigmentation</label>
                      <input
                        type="text"
                        value={vegColor}
                        onChange={e => setVegColor(e.target.value)}
                        className="w-full px-3 py-1.5 border border-neutral-200 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-neutral-700 mb-1">Visible Spots / Fungal Blemishes</label>
                      <input
                        type="text"
                        value={vegSpots}
                        onChange={e => setVegSpots(e.target.value)}
                        className="w-full px-3 py-1.5 border border-neutral-200 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-neutral-700 mb-1">Surface Mechanical Damage</label>
                      <input
                        type="text"
                        value={vegSurfaceDamage}
                        onChange={e => setVegSurfaceDamage(e.target.value)}
                        className="w-full px-3 py-1.5 border border-neutral-200 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-neutral-700 mb-1">Ripeness & Firmness Observations</label>
                      <input
                        type="text"
                        value={vegRipeness}
                        onChange={e => setVegRipeness(e.target.value)}
                        className="w-full px-3 py-1.5 border border-neutral-200 rounded-lg text-xs"
                      />
                    </div>
                  </div>
                )}

                {selectedProduct.category === 'dairy' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block font-medium text-neutral-700 mb-1">Inbound Temperature History</label>
                      <input
                        type="text"
                        value={dairyTempHistory}
                        onChange={e => setDairyTempHistory(e.target.value)}
                        className="w-full px-3 py-1.5 border border-neutral-200 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-neutral-700 mb-1">Packaging Barrier & Hermetic Seal</label>
                      <input
                        type="text"
                        value={dairySealIntegrity}
                        onChange={e => setDairySealIntegrity(e.target.value)}
                        className="w-full px-3 py-1.5 border border-neutral-200 rounded-lg text-xs"
                      />
                    </div>
                    <div className="sm:col-span-2 p-3 bg-neutral-50 rounded-lg text-[11px] text-neutral-600">
                      Recorded Expiry: <strong className="font-mono text-neutral-900">{selectedProduct.expiryDate}</strong> ({selectedProduct.remainingDays} days remaining). Must be maintained at 1°C to 4°C.
                    </div>
                  </div>
                )}

                {selectedProduct.category === 'meat_seafood' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block font-medium text-neutral-700 mb-1">Deep Chill Temperature Logger</label>
                      <input
                        type="text"
                        value={meatTempHistory}
                        onChange={e => setMeatTempHistory(e.target.value)}
                        className="w-full px-3 py-1.5 border border-neutral-200 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-neutral-700 mb-1">Veterinary / HACCP Certification</label>
                      <input
                        type="text"
                        value={meatVetCheck}
                        onChange={e => setMeatVetCheck(e.target.value)}
                        className="w-full px-3 py-1.5 border border-neutral-200 rounded-lg text-xs"
                      />
                    </div>
                  </div>
                )}

                {selectedProduct.category === 'medicines' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block font-medium text-neutral-700 mb-1">Barcode & GS1 2D Datamatrix</label>
                      <input
                        type="text"
                        value={medBarcodeStatus}
                        onChange={e => setMedBarcodeStatus(e.target.value)}
                        className="w-full px-3 py-1.5 border border-neutral-200 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-neutral-700 mb-1">Certificate of Analysis (CoA)</label>
                      <input
                        type="text"
                        value={medCoACheck}
                        onChange={e => setMedCoACheck(e.target.value)}
                        className="w-full px-3 py-1.5 border border-neutral-200 rounded-lg text-xs"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block font-medium text-neutral-700 mb-1">Controlled Room Temperature & RH Log</label>
                      <input
                        type="text"
                        value={medStorageHistory}
                        onChange={e => setMedStorageHistory(e.target.value)}
                        className="w-full px-3 py-1.5 border border-neutral-200 rounded-lg text-xs"
                      />
                    </div>
                  </div>
                )}

                {(selectedProduct.category === 'packaged_foods' || selectedProduct.category === 'manufactured' || selectedProduct.category === 'other') && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block font-medium text-neutral-700 mb-1">Package Integrity & Seals</label>
                      <input
                        type="text"
                        value={packAirtight}
                        onChange={e => setPackAirtight(e.target.value)}
                        className="w-full px-3 py-1.5 border border-neutral-200 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-neutral-700 mb-1">Physical / Carton Damage</label>
                      <input
                        type="text"
                        value={mfgDefects}
                        onChange={e => setMfgDefects(e.target.value)}
                        className="w-full px-3 py-1.5 border border-neutral-200 rounded-lg text-xs"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Inspection Outcome Selector */}
              <div className="pt-3 border-t border-neutral-200 space-y-2">
                <label className="block font-medium text-xs text-neutral-900">
                  Inspection Outcome Verdict *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <label
                    className={`flex items-center gap-2.5 p-3 rounded-lg border cursor-pointer transition-colors ${
                      outcome === 'acceptable'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-semibold'
                        : 'border-neutral-200 bg-white hover:bg-neutral-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="outcome"
                      value="acceptable"
                      checked={outcome === 'acceptable'}
                      onChange={() => setOutcome('acceptable')}
                      className="accent-emerald-700"
                    />
                    <span>Acceptable (Meets standard criteria)</span>
                  </label>

                  <label
                    className={`flex items-center gap-2.5 p-3 rounded-lg border cursor-pointer transition-colors ${
                      outcome === 'needs_manual_inspection'
                        ? 'border-amber-600 bg-amber-50 text-amber-950 font-semibold'
                        : 'border-neutral-200 bg-white hover:bg-neutral-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="outcome"
                      value="needs_manual_inspection"
                      checked={outcome === 'needs_manual_inspection'}
                      onChange={() => setOutcome('needs_manual_inspection')}
                      className="accent-amber-600"
                    />
                    <span>Needs Manual Lab Inspection</span>
                  </label>

                  <label
                    className={`flex items-center gap-2.5 p-3 rounded-lg border cursor-pointer transition-colors ${
                      outcome === 'damaged'
                        ? 'border-rose-600 bg-rose-50 text-rose-950 font-semibold'
                        : 'border-neutral-200 bg-white hover:bg-neutral-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="outcome"
                      value="damaged"
                      checked={outcome === 'damaged'}
                      onChange={() => setOutcome('damaged')}
                      className="accent-rose-600"
                    />
                    <span>Damaged / Rejected (Quarantine)</span>
                  </label>

                  <label
                    className={`flex items-center gap-2.5 p-3 rounded-lg border cursor-pointer transition-colors ${
                      outcome === 'storage_compliance_concern'
                        ? 'border-purple-600 bg-purple-50 text-purple-950 font-semibold'
                        : 'border-neutral-200 bg-white hover:bg-neutral-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="outcome"
                      value="storage_compliance_concern"
                      checked={outcome === 'storage_compliance_concern'}
                      onChange={() => setOutcome('storage_compliance_concern')}
                      className="accent-purple-600"
                    />
                    <span>Storage Compliance Concern</span>
                  </label>
                </div>
              </div>

              {/* Inspector Remarks & Save Button */}
              <div>
                <label className="block font-medium text-xs text-neutral-700 mb-1">
                  Additional Inspector Notes
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Record specific observations, lot certifications, or physical anomalies..."
                  className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-xs focus:ring-1 focus:ring-emerald-600"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                {savedSuccess ? (
                  <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Inspection verdict recorded into batch ledger.</span>
                  </span>
                ) : (
                  <span className="text-[11px] text-neutral-400">
                    Saves to browser audit ledger with timestamp.
                  </span>
                )}

                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-700 text-white hover:bg-emerald-800 shadow-xs transition-colors"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Inspection Result</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="py-20 text-center text-xs text-neutral-400">
              Select a product on the left to begin quality inspection.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
