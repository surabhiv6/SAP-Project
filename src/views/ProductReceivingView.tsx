import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ProductCategory, ProductItem } from '../types';
import { CATEGORIES_CONFIG } from '../data/initialData';
import {
  PackagePlus,
  Search,
  SlidersHorizontal,
  Edit2,
  Trash2,
  CheckCircle,
  AlertCircle,
  X,
  Plus,
} from 'lucide-react';

export const ProductReceivingView: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct, chambers, destinations } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: 'vegetables_fruits' as ProductCategory,
    supplier: '',
    batchNumber: '',
    quantity: 100,
    unit: 'kg' as ProductItem['unit'],
    manufacturingDate: '',
    expiryDate: '',
    storageRequirements: '',
    targetChamberId: 'CH-01',
    destination: destinations[0]?.name || 'Metro Hypermarket Central',
    productCondition: 'fresh' as ProductItem['productCondition'],
    packagingCondition: 'intact' as ProductItem['packagingCondition'],
    dateReceived: new Date().toISOString().split('T')[0],
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      category: 'vegetables_fruits',
      supplier: '',
      batchNumber: `BAT-2026-${Date.now().toString().slice(-4)}`,
      quantity: 100,
      unit: 'kg',
      manufacturingDate: '2026-10-15',
      expiryDate: '2026-10-25',
      storageRequirements: 'Cool produce storage (4-8°C)',
      targetChamberId: 'CH-01',
      destination: destinations[0]?.name || 'Metro Hypermarket Central',
      productCondition: 'fresh',
      packagingCondition: 'intact',
      dateReceived: '2026-10-17',
    });
    setFormErrors({});
    setShowFormModal(true);
  };

  const handleOpenEdit = (p: ProductItem) => {
    setEditingProduct(p);
    setFormData({
      name: p.name,
      category: p.category,
      supplier: p.supplier,
      batchNumber: p.batchNumber,
      quantity: p.quantity,
      unit: p.unit,
      manufacturingDate: p.manufacturingDate || '',
      expiryDate: p.expiryDate || '',
      storageRequirements: p.storageRequirements,
      targetChamberId: p.targetChamberId,
      destination: p.destination,
      productCondition: p.productCondition,
      packagingCondition: p.packagingCondition,
      dateReceived: p.dateReceived,
    });
    setFormErrors({});
    setShowFormModal(true);
  };

  const handleCategoryChange = (cat: ProductCategory) => {
    const config = CATEGORIES_CONFIG[cat];
    let chamberId = 'CH-01';
    if (cat === 'dairy') chamberId = 'CH-02';
    else if (cat === 'meat_seafood') chamberId = 'CH-03';
    else if (cat === 'medicines') chamberId = 'CH-04';
    else if (cat === 'packaged_foods') chamberId = 'CH-05';
    else if (cat === 'manufactured' || cat === 'other') chamberId = 'CH-06';

    setFormData(prev => ({
      ...prev,
      category: cat,
      unit: config.defaultUnit as ProductItem['unit'],
      storageRequirements: config.defaultStorage,
      targetChamberId: chamberId,
    }));
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = 'Product name is required';
    if (!formData.supplier.trim()) errors.supplier = 'Supplier name is required';
    if (!formData.batchNumber.trim()) errors.batchNumber = 'Batch number is required';
    if (formData.quantity <= 0) errors.quantity = 'Quantity must be greater than zero';
    
    // Perishable categories require expiry date
    if (['vegetables_fruits', 'dairy', 'meat_seafood', 'medicines'].includes(formData.category)) {
      if (!formData.expiryDate) {
        errors.expiryDate = 'Expiry date is mandatory for perishable and medical products';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        name: formData.name,
        category: formData.category,
        supplier: formData.supplier,
        batchNumber: formData.batchNumber,
        quantity: formData.quantity,
        unit: formData.unit,
        manufacturingDate: formData.manufacturingDate || undefined,
        expiryDate: formData.expiryDate || undefined,
        storageRequirements: formData.storageRequirements,
        targetChamberId: formData.targetChamberId,
        destination: formData.destination,
        productCondition: formData.productCondition,
        packagingCondition: formData.packagingCondition,
        dateReceived: formData.dateReceived,
      });
    } else {
      addProduct({
        name: formData.name,
        category: formData.category,
        supplier: formData.supplier,
        batchNumber: formData.batchNumber,
        quantity: formData.quantity,
        unit: formData.unit,
        manufacturingDate: formData.manufacturingDate || undefined,
        expiryDate: formData.expiryDate || undefined,
        storageRequirements: formData.storageRequirements,
        targetChamberId: formData.targetChamberId,
        destination: formData.destination,
        productCondition: formData.productCondition,
        packagingCondition: formData.packagingCondition,
        dateReceived: formData.dateReceived,
      });
    }

    setShowFormModal(false);
  };

  // Filtered Products
  const filteredProducts = products.filter(p => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.batchNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Top Action & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-neutral-900 tracking-tight">Product Receiving</h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Register and categorize inbound multi-product shipments with condition validation
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-700 text-white hover:bg-emerald-800 shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Register Inbound Product</span>
        </button>
      </div>

      {/* Filter and Search controls */}
      <div className="bg-white p-4 rounded-xl border border-neutral-200 flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by ID, name, batch, supplier..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-emerald-600"
          />
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-2.5 py-1 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
              selectedCategory === 'all'
                ? 'bg-neutral-900 text-white'
                : 'text-neutral-600 hover:bg-neutral-100'
            }`}
          >
            All ({products.length})
          </button>
          {Object.entries(CATEGORIES_CONFIG).map(([key, config]) => {
            const count = products.filter(p => p.category === key).length;
            return (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className={`px-2.5 py-1 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                  selectedCategory === key
                    ? 'bg-emerald-700 text-white'
                    : 'text-neutral-600 hover:bg-neutral-100'
                }`}
              >
                {config.shortName} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50/80 border-b border-neutral-200 text-neutral-500 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Product ID & Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Batch / Supplier</th>
                <th className="py-3 px-4 text-right">Quantity</th>
                <th className="py-3 px-4">Condition</th>
                <th className="py-3 px-4">Expiry Date</th>
                <th className="py-3 px-4">Assigned Chamber</th>
                <th className="py-3 px-4">Sorting Status</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-neutral-400">
                    No registered products match the selected filter.
                  </td>
                </tr>
              ) : (
                filteredProducts.map(p => {
                  const catConfig = CATEGORIES_CONFIG[p.category];
                  const chamber = chambers.find(c => c.id === p.targetChamberId);

                  return (
                    <tr key={p.id} className="hover:bg-neutral-50/60 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-semibold text-neutral-900">{p.name}</div>
                        <div className="text-[11px] font-mono text-neutral-400">{p.id}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-neutral-700 font-medium">
                          {catConfig?.name || p.category}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-mono text-neutral-800">{p.batchNumber}</div>
                        <div className="text-[11px] text-neutral-500 truncate max-w-[140px]">
                          {p.supplier}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-medium text-neutral-900 tabular-nums">
                        {p.quantity.toLocaleString()} {p.unit}
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-neutral-700 capitalize">
                          {p.productCondition.replace('_', ' ')}
                        </div>
                        <div className="text-[11px] text-neutral-400 capitalize">
                          Pack: {p.packagingCondition}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {p.expiryDate ? (
                          <div>
                            <div className="font-mono text-neutral-800">{p.expiryDate}</div>
                            {p.remainingDays !== undefined && (
                              <div
                                className={`text-[10px] font-medium ${
                                  p.remainingDays <= 5 ? 'text-rose-600 font-bold' : 'text-neutral-400'
                                }`}
                              >
                                {p.remainingDays} days left
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-neutral-400">Non-expiring</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-neutral-800 font-medium">{chamber?.name.split(':')[0] || p.targetChamberId}</div>
                        <div className="text-[10px] text-neutral-400">{chamber?.minTemp}°C - {chamber?.maxTemp}°C</div>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block text-[11px] font-medium ${
                            p.sortedStatus === 'sorted'
                              ? 'text-emerald-700'
                              : p.sortedStatus === 'flagged'
                              ? 'text-rose-600'
                              : 'text-amber-600'
                          }`}
                        >
                          {p.sortedStatus === 'sorted'
                            ? 'Sorted'
                            : p.sortedStatus === 'flagged'
                            ? 'Inspection Flag'
                            : 'Unsorted (Hopper)'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(p)}
                            className="p-1 rounded text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
                            title="Edit Product"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteProduct(p.id)}
                            className="p-1 rounded text-neutral-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Registration / Edit Modal */}
      {showFormModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl border border-neutral-200 shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200">
              <h3 className="text-base font-semibold text-neutral-900">
                {editingProduct ? 'Edit Registered Product' : 'Register Inbound Inflow'}
              </h3>
              <button
                onClick={() => setShowFormModal(false)}
                className="p-1 text-neutral-400 hover:text-neutral-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-1.5 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600 text-xs"
                    placeholder="e.g. Organic Tomatoes"
                  />
                  {formErrors.name && <p className="text-rose-600 text-[10px] mt-0.5">{formErrors.name}</p>}
                </div>

                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Product Category *</label>
                  <select
                    value={formData.category}
                    onChange={e => handleCategoryChange(e.target.value as ProductCategory)}
                    className="w-full px-3 py-1.5 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600 text-xs"
                  >
                    {Object.entries(CATEGORIES_CONFIG).map(([key, config]) => (
                      <option key={key} value={key}>
                        {config.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Supplier Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.supplier}
                    onChange={e => setFormData(prev => ({ ...prev, supplier: e.target.value }))}
                    className="w-full px-3 py-1.5 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600 text-xs"
                    placeholder="e.g. Green Valley Agro Co-op"
                  />
                  {formErrors.supplier && (
                    <p className="text-rose-600 text-[10px] mt-0.5">{formErrors.supplier}</p>
                  )}
                </div>

                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Batch Number *</label>
                  <input
                    type="text"
                    required
                    value={formData.batchNumber}
                    onChange={e => setFormData(prev => ({ ...prev, batchNumber: e.target.value }))}
                    className="w-full px-3 py-1.5 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600 text-xs font-mono"
                  />
                  {formErrors.batchNumber && (
                    <p className="text-rose-600 text-[10px] mt-0.5">{formErrors.batchNumber}</p>
                  )}
                </div>

                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Quantity *</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      min={1}
                      required
                      value={formData.quantity}
                      onChange={e => setFormData(prev => ({ ...prev, quantity: Number(e.target.value) }))}
                      className="w-full px-3 py-1.5 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600 text-xs font-mono"
                    />
                    <select
                      value={formData.unit}
                      onChange={e => setFormData(prev => ({ ...prev, unit: e.target.value as ProductItem['unit'] }))}
                      className="px-3 py-1.5 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600 text-xs"
                    >
                      <option value="kg">kg</option>
                      <option value="litres">litres</option>
                      <option value="packets">packets</option>
                      <option value="boxes">boxes</option>
                      <option value="pieces">pieces</option>
                      <option value="units">units</option>
                    </select>
                  </div>
                  {formErrors.quantity && (
                    <p className="text-rose-600 text-[10px] mt-0.5">{formErrors.quantity}</p>
                  )}
                </div>

                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Assigned Storage Chamber *</label>
                  <select
                    value={formData.targetChamberId}
                    onChange={e => setFormData(prev => ({ ...prev, targetChamberId: e.target.value }))}
                    className="w-full px-3 py-1.5 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600 text-xs"
                  >
                    {chambers.map(ch => (
                      <option key={ch.id} value={ch.id}>
                        {ch.name} ({ch.minTemp}°C to {ch.maxTemp}°C)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-neutral-700 mb-1">
                    Manufacturing / Harvest Date
                  </label>
                  <input
                    type="date"
                    value={formData.manufacturingDate}
                    onChange={e => setFormData(prev => ({ ...prev, manufacturingDate: e.target.value }))}
                    className="w-full px-3 py-1.5 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-medium text-neutral-700 mb-1">
                    Expiry / Best-Before Date {['vegetables_fruits', 'dairy', 'meat_seafood', 'medicines'].includes(formData.category) && '*'}
                  </label>
                  <input
                    type="date"
                    value={formData.expiryDate}
                    onChange={e => setFormData(prev => ({ ...prev, expiryDate: e.target.value }))}
                    className="w-full px-3 py-1.5 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600 text-xs"
                  />
                  {formErrors.expiryDate && (
                    <p className="text-rose-600 text-[10px] mt-0.5">{formErrors.expiryDate}</p>
                  )}
                </div>

                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Product Condition</label>
                  <select
                    value={formData.productCondition}
                    onChange={e => setFormData(prev => ({ ...prev, productCondition: e.target.value as ProductItem['productCondition'] }))}
                    className="w-full px-3 py-1.5 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600 text-xs"
                  >
                    <option value="fresh">Fresh (Nominal state)</option>
                    <option value="good">Good (Normal quality)</option>
                    <option value="minor_blemish">Minor Blemish (Visual flaw)</option>
                    <option value="needs_testing">Needs Laboratory Testing</option>
                    <option value="damaged">Damaged (Quarantine)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Packaging Condition</label>
                  <select
                    value={formData.packagingCondition}
                    onChange={e => setFormData(prev => ({ ...prev, packagingCondition: e.target.value as ProductItem['packagingCondition'] }))}
                    className="w-full px-3 py-1.5 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600 text-xs"
                  >
                    <option value="intact">Intact</option>
                    <option value="sealed">Hermetically Sealed</option>
                    <option value="dented">Dented / Crushed</option>
                    <option value="torn">Torn Wrapper</option>
                    <option value="compromised">Seal Compromised</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block font-medium text-neutral-700 mb-1">Intended Destination</label>
                  <select
                    value={formData.destination}
                    onChange={e => setFormData(prev => ({ ...prev, destination: e.target.value }))}
                    className="w-full px-3 py-1.5 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600 text-xs"
                  >
                    {destinations.map(d => (
                      <option key={d.id} value={d.name}>
                        {d.name} ({d.city} · {d.distanceKm} km)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block font-medium text-neutral-700 mb-1">Storage & Handling Requirements</label>
                  <input
                    type="text"
                    value={formData.storageRequirements}
                    onChange={e => setFormData(prev => ({ ...prev, storageRequirements: e.target.value }))}
                    className="w-full px-3 py-1.5 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600 text-xs"
                    placeholder="e.g. Maintain cold chain 2-4°C"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowFormModal(false)}
                  className="px-4 py-2 text-xs font-medium text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors shadow-xs"
                >
                  {editingProduct ? 'Save Changes' : 'Confirm Registration'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
