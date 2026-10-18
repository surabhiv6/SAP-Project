import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  ProductItem,
  BatchRecord,
  StorageChamber,
  Destination,
  Vehicle,
  Shipment,
  RiskAlert,
  RecoveryAction,
  DeliveryRecord,
  SustainabilityMetric,
  InspectionOutcome,
  SortingHistoryItem,
  FeederState,
  ProductCategory,
} from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_BATCHES,
  INITIAL_STORAGE_CHAMBERS,
  INITIAL_DESTINATIONS,
  INITIAL_VEHICLES,
  INITIAL_SHIPMENTS,
  INITIAL_RISKS,
  INITIAL_RECOVERIES,
  INITIAL_DELIVERIES,
  INITIAL_SUSTAINABILITY,
} from '../data/initialData';

const LOCAL_STORAGE_KEY = 'green_resilience_ai_state_v1';

export type NavTab =
  | 'dashboard'
  | 'receiving'
  | 'sorting'
  | 'feeder'
  | 'inspection'
  | 'inventory'
  | 'expiry'
  | 'storage'
  | 'destination'
  | 'loading'
  | 'trucks'
  | 'risks'
  | 'recovery'
  | 'delivery'
  | 'sustainability'
  | 'settings';

interface AppContextType {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  products: ProductItem[];
  batches: BatchRecord[];
  chambers: StorageChamber[];
  destinations: Destination[];
  vehicles: Vehicle[];
  shipments: Shipment[];
  risks: RiskAlert[];
  recoveries: RecoveryAction[];
  deliveries: DeliveryRecord[];
  sustainability: SustainabilityMetric[];
  sortingHistory: SortingHistoryItem[];
  feederState: FeederState;
  
  // Actions
  addProduct: (product: Omit<ProductItem, 'id' | 'sortedStatus' | 'inspectionStatus'>) => void;
  updateProduct: (id: string, updates: Partial<ProductItem>) => void;
  deleteProduct: (id: string) => void;
  updateInspection: (productId: string, outcome: InspectionOutcome, notes: string) => void;
  
  // Sorting & Feeder Actions
  startFeeding: () => void;
  pauseFeeding: () => void;
  stopFeeding: () => void;
  processSingleSortingStep: () => boolean;
  loadProductToHopper: (productId: string) => void;
  loadAllUnsortedToHopper: () => void;
  
  // Storage Chamber Actions
  setChamberSimulation: (chamberId: string, mode: StorageChamber['simulationMode']) => void;
  resetAllChambers: () => void;
  
  // Shipment & Vehicle Actions
  createShipment: (newShipment: Omit<Shipment, 'id' | 'status' | 'simulatedProgressPercent' | 'simulatedEvent'>) => void;
  dispatchShipment: (shipmentId: string) => void;
  updateShipmentSimulation: (shipmentId: string, event: Shipment['simulatedEvent']) => void;
  
  // Risk & Recovery Actions
  resolveRisk: (riskId: string) => void;
  confirmRecoveryAction: (recoveryId: string) => void;
  
  // Delivery Actions
  confirmDelivery: (delivery: Omit<DeliveryRecord, 'id'>) => void;
  
  // Global Actions
  resetDemoData: () => void;
  showLimitationsModal: boolean;
  setShowLimitationsModal: (show: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [showLimitationsModal, setShowLimitationsModal] = useState<boolean>(false);

  // Core Data States
  const [products, setProducts] = useState<ProductItem[]>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_products`);
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  const [batches, setBatches] = useState<BatchRecord[]>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_batches`);
      return saved ? JSON.parse(saved) : INITIAL_BATCHES;
    } catch {
      return INITIAL_BATCHES;
    }
  });

  const [chambers, setChambers] = useState<StorageChamber[]>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_chambers`);
      return saved ? JSON.parse(saved) : INITIAL_STORAGE_CHAMBERS;
    } catch {
      return INITIAL_STORAGE_CHAMBERS;
    }
  });

  const [destinations] = useState<Destination[]>(INITIAL_DESTINATIONS);
  const [vehicles, setVehicles] = useState<Vehicle[]>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_vehicles`);
      return saved ? JSON.parse(saved) : INITIAL_VEHICLES;
    } catch {
      return INITIAL_VEHICLES;
    }
  });

  const [shipments, setShipments] = useState<Shipment[]>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_shipments`);
      return saved ? JSON.parse(saved) : INITIAL_SHIPMENTS;
    } catch {
      return INITIAL_SHIPMENTS;
    }
  });

  const [risks, setRisks] = useState<RiskAlert[]>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_risks`);
      return saved ? JSON.parse(saved) : INITIAL_RISKS;
    } catch {
      return INITIAL_RISKS;
    }
  });

  const [recoveries, setRecoveries] = useState<RecoveryAction[]>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_recoveries`);
      return saved ? JSON.parse(saved) : INITIAL_RECOVERIES;
    } catch {
      return INITIAL_RECOVERIES;
    }
  });

  const [deliveries, setDeliveries] = useState<DeliveryRecord[]>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_deliveries`);
      return saved ? JSON.parse(saved) : INITIAL_DELIVERIES;
    } catch {
      return INITIAL_DELIVERIES;
    }
  });

  const [sustainability, setSustainability] = useState<SustainabilityMetric[]>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_sustainability`);
      return saved ? JSON.parse(saved) : INITIAL_SUSTAINABILITY;
    } catch {
      return INITIAL_SUSTAINABILITY;
    }
  });

  const [sortingHistory, setSortingHistory] = useState<SortingHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_sortingHistory`);
      return saved ? JSON.parse(saved) : [
        {
          id: 'SORT-001',
          productId: 'PRD-101',
          productName: 'Organic Vine Tomatoes',
          category: 'vegetables_fruits',
          assignedBin: 'vegetables_fruits',
          timestamp: '2026-10-15 08:32',
          inspectionOutcome: 'acceptable',
          confidenceScore: 0.98,
        },
        {
          id: 'SORT-002',
          productId: 'PRD-104',
          productName: 'Pasteurized Whole Milk Packets',
          category: 'dairy',
          assignedBin: 'dairy',
          timestamp: '2026-10-16 07:05',
          inspectionOutcome: 'acceptable',
          confidenceScore: 0.99,
        },
      ];
    } catch {
      return [];
    }
  });

  // Feeder Simulation State
  const [feederState, setFeederState] = useState<FeederState>({
    status: 'idle',
    queue: ['PRD-103', 'PRD-105', 'PRD-108', 'PRD-110', 'PRD-112'],
    currentProductId: null,
    itemsProcessed: 7,
    totalInHopper: 5,
    speedRate: 18,
  });

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_products`, JSON.stringify(products));
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_batches`, JSON.stringify(batches));
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_chambers`, JSON.stringify(chambers));
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_vehicles`, JSON.stringify(vehicles));
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_shipments`, JSON.stringify(shipments));
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_risks`, JSON.stringify(risks));
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_recoveries`, JSON.stringify(recoveries));
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_deliveries`, JSON.stringify(deliveries));
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_sustainability`, JSON.stringify(sustainability));
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_sortingHistory`, JSON.stringify(sortingHistory));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }, [products, batches, chambers, vehicles, shipments, risks, recoveries, deliveries, sustainability, sortingHistory]);

  // Product Actions
  const addProduct = useCallback((newProdData: Omit<ProductItem, 'id' | 'sortedStatus' | 'inspectionStatus'>) => {
    const newId = `PRD-${Date.now().toString().slice(-4)}`;
    
    // Calculate remaining days
    let remainingDays: number | undefined;
    let estimatedRemainingLifeDays: number | undefined;
    if (newProdData.expiryDate) {
      const exp = new Date(newProdData.expiryDate).getTime();
      const now = new Date('2026-10-17').getTime();
      const diff = Math.ceil((exp - now) / (1000 * 60 * 60 * 24));
      remainingDays = Math.max(0, diff);

      if (['vegetables_fruits', 'dairy', 'meat_seafood'].includes(newProdData.category)) {
        // Transparent estimation: perishable buffer adjusted for current condition
        const conditionFactor = newProdData.productCondition === 'fresh' ? 1.0 : 0.8;
        estimatedRemainingLifeDays = Math.max(1, Math.round(remainingDays * conditionFactor));
      }
    }

    const newProduct: ProductItem = {
      ...newProdData,
      id: newId,
      sortedStatus: 'unsorted',
      inspectionStatus: 'needs_manual_inspection',
      remainingDays,
      estimatedRemainingLifeDays,
    };

    setProducts(prev => [newProduct, ...prev]);

    // Also update or create batch record
    setBatches(prev => {
      const existing = prev.find(b => b.batchNumber === newProdData.batchNumber);
      if (existing) {
        return prev.map(b =>
          b.batchNumber === newProdData.batchNumber
            ? {
                ...b,
                initialQuantity: b.initialQuantity + newProdData.quantity,
                availableQuantity: b.availableQuantity + newProdData.quantity,
              }
            : b
        );
      }
      return [
        {
          batchNumber: newProdData.batchNumber,
          productId: newId,
          productName: newProdData.name,
          category: newProdData.category,
          supplier: newProdData.supplier,
          initialQuantity: newProdData.quantity,
          availableQuantity: newProdData.quantity,
          sortedQuantity: 0,
          dispatchedQuantity: 0,
          deliveredQuantity: 0,
          damagedQuantity: 0,
          unit: newProdData.unit,
          chamberId: newProdData.targetChamberId,
          receivedDate: newProdData.dateReceived,
          expiryDate: newProdData.expiryDate,
          status: 'active',
        },
        ...prev,
      ];
    });

    // Add to feeder hopper automatically if unsorted
    setFeederState(prev => ({
      ...prev,
      queue: [...prev.queue, newId],
      totalInHopper: prev.totalInHopper + 1,
    }));
  }, []);

  const updateProduct = useCallback((id: string, updates: Partial<ProductItem>) => {
    setProducts(prev => prev.map(p => (p.id === id ? { ...p, ...updates } : p)));
  }, []);

  const deleteProduct = useCallback((id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    setFeederState(prev => ({
      ...prev,
      queue: prev.queue.filter(qId => qId !== id),
      totalInHopper: Math.max(0, prev.totalInHopper - 1),
    }));
  }, []);

  const updateInspection = useCallback((productId: string, outcome: InspectionOutcome, notes: string) => {
    const timestamp = '2026-10-17 10:00';
    setProducts(prev =>
      prev.map(p =>
        p.id === productId
          ? {
              ...p,
              inspectionStatus: outcome,
              inspectionNotes: notes,
              inspectedAt: timestamp,
            }
          : p
      )
    );

    // If marked damaged, record in batch as damaged
    if (outcome === 'damaged') {
      const prod = products.find(p => p.id === productId);
      if (prod) {
        setBatches(prev =>
          prev.map(b =>
            b.batchNumber === prod.batchNumber
              ? {
                  ...b,
                  availableQuantity: Math.max(0, b.availableQuantity - prod.quantity),
                  damagedQuantity: b.damagedQuantity + prod.quantity,
                  status: b.availableQuantity - prod.quantity <= 0 ? 'depleted' : b.status,
                }
              : b
          )
        );
      }
    }
  }, [products]);

  // Feeder & Sorting simulation
  const loadProductToHopper = useCallback((productId: string) => {
    setFeederState(prev => {
      if (prev.queue.includes(productId)) return prev;
      return {
        ...prev,
        queue: [...prev.queue, productId],
        totalInHopper: prev.queue.length + 1,
      };
    });
  }, []);

  const loadAllUnsortedToHopper = useCallback(() => {
    const unsortedIds = products.filter(p => p.sortedStatus === 'unsorted').map(p => p.id);
    setFeederState(prev => {
      const combined = Array.from(new Set([...prev.queue, ...unsortedIds]));
      return {
        ...prev,
        queue: combined,
        totalInHopper: combined.length,
      };
    });
  }, [products]);

  const processSingleSortingStep = useCallback(() => {
    if (feederState.queue.length === 0) {
      setFeederState(prev => ({ ...prev, status: 'idle', currentProductId: null }));
      return false;
    }

    const nextProductId = feederState.queue[0];
    const targetProduct = products.find(p => p.id === nextProductId);

    if (!targetProduct) {
      setFeederState(prev => ({
        ...prev,
        queue: prev.queue.slice(1),
        totalInHopper: Math.max(0, prev.totalInHopper - 1),
      }));
      return false;
    }

    // Determine target bin based on category or inspection status
    let assignedBin: string = targetProduct.category;
    let inspectionOutcome: InspectionOutcome = targetProduct.inspectionStatus;

    if (targetProduct.productCondition === 'damaged' || targetProduct.packagingCondition === 'compromised') {
      assignedBin = 'inspection_needed';
      inspectionOutcome = 'needs_manual_inspection';
    } else if (inspectionOutcome === 'needs_manual_inspection') {
      // Default auto-check: if packaging is sealed/intact and not damaged, mark acceptable
      inspectionOutcome = 'acceptable';
    }

    // Update Product status
    setProducts(prev =>
      prev.map(p =>
        p.id === nextProductId
          ? {
              ...p,
              sortedStatus: assignedBin === 'inspection_needed' ? 'flagged' : 'sorted',
              sortedBin: assignedBin,
              inspectionStatus: inspectionOutcome,
            }
          : p
      )
    );

    // Update Batch sorted quantity
    setBatches(prev =>
      prev.map(b =>
        b.batchNumber === targetProduct.batchNumber
          ? {
              ...b,
              sortedQuantity: b.sortedQuantity + targetProduct.quantity,
            }
          : b
      )
    );

    // Record sorting history
    const historyItem: SortingHistoryItem = {
      id: `SORT-${Date.now().toString().slice(-4)}`,
      productId: targetProduct.id,
      productName: targetProduct.name,
      category: targetProduct.category,
      assignedBin,
      timestamp: '2026-10-17 10:15',
      inspectionOutcome,
      confidenceScore: 0.96,
    };
    setSortingHistory(prev => [historyItem, ...prev]);

    // Update Feeder state
    setFeederState(prev => ({
      ...prev,
      currentProductId: nextProductId,
      queue: prev.queue.slice(1),
      itemsProcessed: prev.itemsProcessed + 1,
      totalInHopper: Math.max(0, prev.totalInHopper - 1),
      lastTransferTime: 'Just now',
    }));

    return true;
  }, [feederState.queue, products]);

  const startFeeding = useCallback(() => {
    setFeederState(prev => ({ ...prev, status: 'feeding' }));
  }, []);

  const pauseFeeding = useCallback(() => {
    setFeederState(prev => ({ ...prev, status: 'paused' }));
  }, []);

  const stopFeeding = useCallback(() => {
    setFeederState(prev => ({ ...prev, status: 'stopped', currentProductId: null }));
  }, []);

  // Storage chamber simulation triggers
  const setChamberSimulation = useCallback((chamberId: string, mode: StorageChamber['simulationMode']) => {
    setChambers(prev =>
      prev.map(ch => {
        if (ch.id !== chamberId) return ch;

        let temp = ch.currentTemp;
        let humidity = ch.currentHumidity;
        let sensorStatus: StorageChamber['sensorStatus'] = 'nominal';
        const alerts: string[] = [];

        if (mode === 'normal') {
          temp = (ch.minTemp + ch.maxTemp) / 2;
          humidity = (ch.minHumidity + ch.maxHumidity) / 2;
          sensorStatus = 'nominal';
        } else if (mode === 'high_temp') {
          temp = ch.maxTemp + 5.5; // Exceeds upper limit
          sensorStatus = 'critical';
          alerts.push(`High Temperature Alert: ${temp.toFixed(1)}°C exceeds maximum threshold (${ch.maxTemp}°C).`);
        } else if (mode === 'low_temp') {
          temp = ch.minTemp - 4.0; // Drops below minimum
          sensorStatus = 'warning';
          alerts.push(`Low Temperature Alert: ${temp.toFixed(1)}°C dropped below minimum threshold (${ch.minTemp}°C).`);
        } else if (mode === 'high_humidity') {
          humidity = Math.min(100, ch.maxHumidity + 15);
          sensorStatus = 'warning';
          alerts.push(`Humidity Excursion: ${humidity}% exceeds permissible moisture threshold (${ch.maxHumidity}%).`);
        } else if (mode === 'sensor_disconnected') {
          sensorStatus = 'disconnected';
          alerts.push(`Telemetry Disconnect: Remote Modbus/MQTT sensor package lost handshake.`);
        }

        return {
          ...ch,
          simulationMode: mode,
          currentTemp: temp,
          currentHumidity: humidity,
          sensorStatus,
          activeAlerts: alerts,
          lastUpdated: 'Simulated just now',
        };
      })
    );

    // If an alert was generated, push to risks
    if (mode === 'high_temp' || mode === 'sensor_disconnected') {
      const targetCh = chambers.find(c => c.id === chamberId);
      if (targetCh) {
        const newRisk: RiskAlert = {
          id: `RSK-${Date.now().toString().slice(-4)}`,
          category: mode === 'high_temp' ? 'temperature_excursion' : 'sensor_offline',
          severity: mode === 'high_temp' ? 'critical' : 'high',
          affectedEntityId: targetCh.id,
          affectedEntityName: `${targetCh.name}`,
          detectedAt: '2026-10-17 10:20',
          reason:
            mode === 'high_temp'
              ? `Chamber temperature jumped to ${(targetCh.maxTemp + 5.5).toFixed(1)}°C, exceeding safe upper bound.`
              : 'Sensor package heartbeat missed for > 60 seconds.',
          score: mode === 'high_temp' ? 92 : 75,
          recommendedResponse:
            mode === 'high_temp'
              ? 'Engage secondary refrigeration compressor and prepare batch transfer to adjacent cool room.'
              : 'Dispatch facilities technician to check sensor wiring and gateway power.',
          status: 'active',
        };
        setRisks(prev => [newRisk, ...prev]);
      }
    }
  }, [chambers]);

  const resetAllChambers = useCallback(() => {
    setChambers(INITIAL_STORAGE_CHAMBERS);
  }, []);

  // Shipment & Logistics actions
  const createShipment = useCallback((newShipmentData: Omit<Shipment, 'id' | 'status' | 'simulatedProgressPercent' | 'simulatedEvent'>) => {
    const newId = `SHP-${Date.now().toString().slice(-3)}`;
    const newShipment: Shipment = {
      ...newShipmentData,
      id: newId,
      status: 'planned',
      simulatedProgressPercent: 0,
      simulatedEvent: 'normal',
    };
    setShipments(prev => [newShipment, ...prev]);
  }, []);

  const dispatchShipment = useCallback((shipmentId: string) => {
    setShipments(prev =>
      prev.map(s => {
        if (s.id !== shipmentId) return s;
        return {
          ...s,
          status: 'in_transit',
          simulatedProgressPercent: 15,
        };
      })
    );

    // Deduct cargo quantities from available batch inventory and record as dispatched
    const shipment = shipments.find(s => s.id === shipmentId);
    if (shipment) {
      shipment.cargo.forEach(item => {
        setBatches(prev =>
          prev.map(b => {
            if (b.batchNumber === item.batchNumber) {
              const newAvailable = Math.max(0, b.availableQuantity - item.quantity);
              return {
                ...b,
                availableQuantity: newAvailable,
                dispatchedQuantity: b.dispatchedQuantity + item.quantity,
              };
            }
            return b;
          })
        );
      });

      // Update vehicle status
      setVehicles(prev =>
        prev.map(v =>
          v.id === shipment.vehicleId
            ? { ...v, status: 'in_transit', assignedShipmentId: shipment.id }
            : v
        )
      );
    }
  }, [shipments]);

  const updateShipmentSimulation = useCallback((shipmentId: string, event: Shipment['simulatedEvent']) => {
    setShipments(prev =>
      prev.map(s => {
        if (s.id !== shipmentId) return s;

        let tempAlert = false;
        let cargoTemp = s.currentCargoTemp;
        let delayHours = 0;
        let progress = s.simulatedProgressPercent;
        let status = s.status;

        if (event === 'normal') {
          cargoTemp = s.requiresReefer ? 3.4 : 22.0;
          tempAlert = false;
          progress = Math.min(90, progress + 20);
        } else if (event === 'temp_excursion') {
          cargoTemp = 11.2; // Exceeds cold reefer
          tempAlert = true;
        } else if (event === 'delay') {
          delayHours = 2.5;
          status = 'delayed';
        } else if (event === 'breakdown') {
          status = 'delayed';
        } else if (event === 'delivered') {
          progress = 100;
          status = 'delivered';
        }

        return {
          ...s,
          simulatedEvent: event,
          currentCargoTemp: cargoTemp,
          tempAlert,
          delayHours,
          simulatedProgressPercent: progress,
          status,
        };
      })
    );

    // If breakdown, reflect in vehicle and add risk
    const shp = shipments.find(s => s.id === shipmentId);
    if (shp) {
      if (event === 'breakdown') {
        setVehicles(prev =>
          prev.map(v => (v.id === shp.vehicleId ? { ...v, status: 'breakdown' } : v))
        );
        const newRisk: RiskAlert = {
          id: `RSK-${Date.now().toString().slice(-4)}`,
          category: 'vehicle_breakdown',
          severity: 'critical',
          affectedEntityId: shp.id,
          affectedEntityName: `Vehicle ${shp.vehicleName} (${shp.id})`,
          detectedAt: '2026-10-17 10:25',
          reason: 'Engine transmission failure detected on transit route. Cargo cooling at risk.',
          score: 95,
          recommendedResponse: 'Dispatch nearest available standby vehicle for direct roadside cargo cross-docking.',
          recoveryActionId: 'REC-02',
          status: 'active',
        };
        setRisks(prev => [newRisk, ...prev]);
      } else if (event === 'temp_excursion') {
        const newRisk: RiskAlert = {
          id: `RSK-${Date.now().toString().slice(-4)}`,
          category: 'temperature_excursion',
          severity: 'high',
          affectedEntityId: shp.id,
          affectedEntityName: `Shipment ${shp.id} Cargo Reefer`,
          detectedAt: '2026-10-17 10:26',
          reason: 'In-transit temperature climbed to 11.2°C (limit: 4°C) for over 15 minutes.',
          score: 84,
          recommendedResponse: 'Verify condenser fan speed; if uncorrected within 20 mins, redirect to nearest cold depot.',
          status: 'active',
        };
        setRisks(prev => [newRisk, ...prev]);
      }
    }
  }, [shipments]);

  // Risk & Recovery
  const resolveRisk = useCallback((riskId: string) => {
    setRisks(prev => prev.map(r => (r.id === riskId ? { ...r, status: 'resolved' } : r)));
  }, []);

  const confirmRecoveryAction = useCallback((recoveryId: string) => {
    setRecoveries(prev =>
      prev.map(r => {
        if (r.id !== recoveryId) return r;
        return {
          ...r,
          confirmed: true,
          confirmedAt: '2026-10-17 10:30',
          resolutionOutcome: 'Action approved and executed into operational dispatch logs.',
        };
      })
    );

    // Also mark associated risk alert resolved
    const rec = recoveries.find(r => r.id === recoveryId);
    if (rec && rec.riskAlertId) {
      resolveRisk(rec.riskAlertId);
    }
  }, [recoveries, resolveRisk]);

  // Delivery confirmation
  const confirmDelivery = useCallback((deliveryData: Omit<DeliveryRecord, 'id'>) => {
    const newId = `DEL-${Date.now().toString().slice(-4)}`;
    const newDelivery: DeliveryRecord = {
      ...deliveryData,
      id: newId,
    };
    setDeliveries(prev => [newDelivery, ...prev]);

    // Update shipment status
    setShipments(prev =>
      prev.map(s => {
        if (s.id !== deliveryData.shipmentId) return s;
        return {
          ...s,
          status: deliveryData.status,
          simulatedProgressPercent: 100,
          actualArrival: deliveryData.arrivalTime,
        };
      })
    );

    // Update batches with delivered & damaged quantities
    const shipment = shipments.find(s => s.id === deliveryData.shipmentId);
    if (shipment) {
      shipment.cargo.forEach(item => {
        setBatches(prev =>
          prev.map(b => {
            if (b.batchNumber === item.batchNumber) {
              return {
                ...b,
                deliveredQuantity: b.deliveredQuantity + deliveryData.receivedQuantity,
                damagedQuantity: b.damagedQuantity + deliveryData.damagedQuantity,
                dispatchedQuantity: Math.max(0, b.dispatchedQuantity - item.quantity),
              };
            }
            return b;
          })
        );
      });

      // Free vehicle
      setVehicles(prev =>
        prev.map(v =>
          v.id === shipment.vehicleId
            ? { ...v, status: 'available', assignedShipmentId: undefined }
            : v
        )
      );
    }
  }, [shipments]);

  // Reset Demo Data
  const resetDemoData = useCallback(() => {
    setProducts(INITIAL_PRODUCTS);
    setBatches(INITIAL_BATCHES);
    setChambers(INITIAL_STORAGE_CHAMBERS);
    setVehicles(INITIAL_VEHICLES);
    setShipments(INITIAL_SHIPMENTS);
    setRisks(INITIAL_RISKS);
    setRecoveries(INITIAL_RECOVERIES);
    setDeliveries(INITIAL_DELIVERIES);
    setSustainability(INITIAL_SUSTAINABILITY);
    setSortingHistory([]);
    setFeederState({
      status: 'idle',
      queue: ['PRD-103', 'PRD-105', 'PRD-108', 'PRD-110', 'PRD-112'],
      currentProductId: null,
      itemsProcessed: 7,
      totalInHopper: 5,
      speedRate: 18,
    });
    localStorage.clear();
  }, []);

  const value = useMemo(
    () => ({
      activeTab,
      setActiveTab,
      products,
      batches,
      chambers,
      destinations,
      vehicles,
      shipments,
      risks,
      recoveries,
      deliveries,
      sustainability,
      sortingHistory,
      feederState,
      addProduct,
      updateProduct,
      deleteProduct,
      updateInspection,
      startFeeding,
      pauseFeeding,
      stopFeeding,
      processSingleSortingStep,
      loadProductToHopper,
      loadAllUnsortedToHopper,
      setChamberSimulation,
      resetAllChambers,
      createShipment,
      dispatchShipment,
      updateShipmentSimulation,
      resolveRisk,
      confirmRecoveryAction,
      confirmDelivery,
      resetDemoData,
      showLimitationsModal,
      setShowLimitationsModal,
    }),
    [
      activeTab,
      products,
      batches,
      chambers,
      destinations,
      vehicles,
      shipments,
      risks,
      recoveries,
      deliveries,
      sustainability,
      sortingHistory,
      feederState,
      addProduct,
      updateProduct,
      deleteProduct,
      updateInspection,
      startFeeding,
      pauseFeeding,
      stopFeeding,
      processSingleSortingStep,
      loadProductToHopper,
      loadAllUnsortedToHopper,
      setChamberSimulation,
      resetAllChambers,
      createShipment,
      dispatchShipment,
      updateShipmentSimulation,
      resolveRisk,
      confirmRecoveryAction,
      confirmDelivery,
      resetDemoData,
      showLimitationsModal,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
