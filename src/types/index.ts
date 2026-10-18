export type ProductCategory =
  | 'vegetables_fruits'
  | 'dairy'
  | 'meat_seafood'
  | 'medicines'
  | 'packaged_foods'
  | 'manufactured'
  | 'other';

export interface CategoryInfo {
  id: ProductCategory;
  name: string;
  shortName: string;
  defaultUnit: string;
  defaultStorage: string;
  tempRange: string;
  humidityRange: string;
  color: string;
}

export type StorageChamberType =
  | 'produce_cold'
  | 'dairy_cold'
  | 'meat_cold'
  | 'pharma_controlled'
  | 'dry_ambient'
  | 'general_depot';

export interface StorageChamber {
  id: string;
  name: string;
  type: StorageChamberType;
  allowedCategories: ProductCategory[];
  currentTemp: number;
  minTemp: number;
  maxTemp: number;
  currentHumidity: number;
  minHumidity: number;
  maxHumidity: number;
  sensorStatus: 'nominal' | 'warning' | 'critical' | 'disconnected';
  simulationMode: 'normal' | 'high_temp' | 'low_temp' | 'high_humidity' | 'sensor_disconnected';
  lastUpdated: string;
  capacityMax: number;
  capacityUsed: number;
  unit: string;
  activeAlerts: string[];
}

export type InspectionOutcome =
  | 'acceptable'
  | 'needs_manual_inspection'
  | 'damaged'
  | 'storage_compliance_concern'
  | 'incomplete_information';

export interface ProductItem {
  id: string; // e.g., PRD-101
  name: string;
  category: ProductCategory;
  supplier: string;
  batchNumber: string;
  quantity: number;
  unit: 'kg' | 'litres' | 'packets' | 'boxes' | 'pieces' | 'units';
  manufacturingDate?: string;
  expiryDate?: string;
  storageRequirements: string;
  targetChamberId: string;
  destination: string;
  productCondition: 'fresh' | 'good' | 'minor_blemish' | 'needs_testing' | 'damaged';
  packagingCondition: 'intact' | 'sealed' | 'compromised' | 'dented' | 'torn';
  dateReceived: string;
  sortedStatus: 'unsorted' | 'in_feeder' | 'sorted' | 'flagged';
  sortedBin?: string;
  inspectionStatus: InspectionOutcome;
  inspectionNotes?: string;
  inspectedAt?: string;
  remainingDays?: number;
  estimatedRemainingLifeDays?: number; // Perishable model estimate (clearly distinguished from recorded expiry)
}

export interface BatchRecord {
  batchNumber: string;
  productId: string;
  productName: string;
  category: ProductCategory;
  supplier: string;
  initialQuantity: number;
  availableQuantity: number;
  sortedQuantity: number;
  dispatchedQuantity: number;
  deliveredQuantity: number;
  damagedQuantity: number;
  unit: string;
  chamberId: string;
  receivedDate: string;
  expiryDate?: string;
  status: 'active' | 'quarantine' | 'depleted' | 'expired';
}

export interface FeederState {
  status: 'idle' | 'feeding' | 'paused' | 'stopped' | 'error';
  queue: string[]; // Product IDs in hopper
  currentProductId: string | null;
  itemsProcessed: number;
  totalInHopper: number;
  speedRate: number; // items per minute
  lastTransferTime?: string;
  errorMessage?: string;
}

export interface SortingHistoryItem {
  id: string;
  productId: string;
  productName: string;
  category: ProductCategory;
  assignedBin: string;
  timestamp: string;
  inspectionOutcome: InspectionOutcome;
  confidenceScore?: number; // prototype visual tag identifier simulation
}

export interface Destination {
  id: string;
  name: string;
  city: string;
  type: 'hypermarket' | 'regional_hub' | 'pharmacy_network' | 'community_depot' | 'export_terminal';
  distanceKm: number;
  travelTimeHours: number;
  transportCostPerUnit: number;
  demandLevel: 'high' | 'medium' | 'low';
  coldChainCapable: boolean;
  acceptedCategories: ProductCategory[];
  deliveryDeadlineHours: number;
}

export interface Vehicle {
  id: string;
  name: string;
  licensePlate: string;
  type: 'reefer_truck' | 'multi_temp_van' | 'pharma_secure_van' | 'dry_lorry';
  capacityKg: number;
  coldChainSupport: boolean;
  currentTemp?: number;
  targetTemp?: number;
  currentHumidity?: number;
  status: 'available' | 'in_transit' | 'maintenance' | 'breakdown';
  currentLocationName: string;
  batteryOrFuelPercent: number;
  assignedShipmentId?: string;
}

export type ShipmentStatus =
  | 'planned'
  | 'ready'
  | 'in_transit'
  | 'delayed'
  | 'delivered'
  | 'delivered_with_discrepancy'
  | 'cancelled';

export interface ShipmentCargo {
  productId: string;
  batchNumber: string;
  productName: string;
  category: ProductCategory;
  quantity: number;
  unit: string;
}

export interface Shipment {
  id: string; // e.g., SHP-801
  vehicleId: string;
  vehicleName: string;
  origin: string;
  destinationId: string;
  destinationName: string;
  cargo: ShipmentCargo[];
  plannedDeparture: string;
  estimatedArrival: string;
  actualArrival?: string;
  status: ShipmentStatus;
  packagingRequirements: string;
  storageRequirements: string;
  requiresReefer: boolean;
  compatibilityFlag?: string;
  currentSimulatedLat: number;
  currentSimulatedLng: number;
  simulatedProgressPercent: number;
  simulatedEvent: 'normal' | 'temp_excursion' | 'delay' | 'breakdown' | 'gps_loss' | 'delivered';
  currentCargoTemp?: number;
  tempAlert?: boolean;
  delayHours?: number;
  remarks?: string;
}

export type RiskSeverity = 'critical' | 'high' | 'medium' | 'low';
export type RiskCategory =
  | 'temperature_excursion'
  | 'humidity_violation'
  | 'delivery_delay'
  | 'vehicle_breakdown'
  | 'expiry_risk'
  | 'stock_shortage'
  | 'product_damage'
  | 'incompatible_cargo'
  | 'sensor_offline';

export interface RiskAlert {
  id: string;
  category: RiskCategory;
  severity: RiskSeverity;
  affectedEntityId: string; // e.g. SHP-801 or CH-02 or PRD-104
  affectedEntityName: string;
  detectedAt: string;
  reason: string;
  score: number; // Rule-based prototype severity score (0-100)
  recommendedResponse: string;
  recoveryActionId?: string;
  status: 'active' | 'investigating' | 'resolved';
}

export interface RecoveryAction {
  id: string;
  riskAlertId: string;
  title: string;
  triggerEvent: string;
  affectedItem: string;
  reasoning: string;
  proposedAction: string;
  actionType: 'reroute_vehicle' | 'transfer_chamber' | 'contact_supplier' | 'adjust_eta' | 'quarantine_product';
  estimatedCostAddition: number;
  confirmed: boolean;
  confirmedAt?: string;
  resolutionOutcome?: string;
}

export interface DeliveryRecord {
  id: string;
  shipmentId: string;
  destinationName: string;
  arrivalTime: string;
  expectedQuantity: number;
  receivedQuantity: number;
  damagedQuantity: number;
  missingQuantity: number;
  finalInspectionStatus: InspectionOutcome;
  status: ShipmentStatus;
  recipientRemarks: string;
  confirmedBy: string;
}

export interface SustainabilityMetric {
  date: string;
  productsReceivedKg: number;
  productsSortedKg: number;
  productsDistributedKg: number;
  damagedRecordedKg: number;
  confirmedLossKg: number;
  wasteAvoidedKg: number; // Based on timely sorting & cold storage interventions
  wasteAvoidanceMethodology: string;
  transportCostUSD: number;
  recoveryActionsCount: number;
}
