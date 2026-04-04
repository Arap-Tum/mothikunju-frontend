// User Roles
export type UserRole = 
  | 'Warehouse Manager'
  | 'Inventory Manager'
  | 'Picker'
  | 'Packer'
  | 'Dispatch Officer'
  | 'Receiving Officer'
  | 'Sales Staff';

export type Department = 'Warehouse' | 'Sales' | 'Logistics';

// User
export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  department: Department;
  isActive: boolean;
  lastLogin?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AuthResponse {
  token: string;
  user: User;
  expiresIn?: number;
}

// Order Models
export interface OrderItem {
  sku: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  status?: string;
}

export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
}

export type OrderStatus = 'pending' | 'picking' | 'picked' | 'packing' | 'packed' | 'shipped' | 'delivered' | 'cancelled';

export interface Order {
  _id: string;
  orderNumber: string;
  customer: CustomerInfo;
  items: OrderItem[];
  orderStatus: OrderStatus;
  totalAmount: number;
  pickingAssignedTo?: string;
  packingAssignedTo?: string;
  dispatchedBy?: string;
  createdBy: string;
  trackingNumber?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateOrderRequest {
  orderNumber: string;
  customer: CustomerInfo;
  items: OrderItem[];
  totalAmount: number;
  notes?: string;
}

export interface UpdateOrderRequest {
  customer?: CustomerInfo;
  items?: OrderItem[];
  totalAmount?: number;
  notes?: string;
}

// Picking Models
export interface PickedItem {
  sku: string;
  quantity: number;
  batchNumber: string;
}

export interface UpdatePickingStatusRequest {
  skus: string[];
  pickingStatus: 'pending' | 'picked' | 'not_picked';
}

export interface AssignPickingRequest {
  orderId: string;
  pickerId: string;
}

// Packing Models
export interface PackedItem {
  sku: string;
}

export interface UpdatePackingStatusRequest {
  skus: string[];
  packingStatus: 'pending' | 'packed' | 'not_packed';
}

export interface AssignPackingRequest {
  orderId: string;
  packerId: string;
}

// Dispatch Models
export interface ShipmentRequest {
  trackingNumber: string;
}

export interface BulkDispatchRequest {
  orderIds: string[];
  trackingNumbers: string[];
}

// Receiving Models
export interface ReceivingItem {
  sku: string;
  productName?: string;
  expectedQuantity: number;
  receivedQuantity?: number;
  batchNumber: string;
  manufactureDate: Date;
  expiryDate: Date;
  storageLocationCode: string;
  status?: string;
  notes?: string;
}

export interface SupplierInfo {
  name: string;
  contact: string;
  email: string;
}

export type ReceivingStatus = 'pending' | 'in_progress' | 'completed' | 'rejected';

export interface Receiving {
  _id: string;
  receivingNumber: string;
  supplier: SupplierInfo;
  purchaseOrder: string;
  items: ReceivingItem[];
  receivingStatus: ReceivingStatus;
  receivedBy?: string;
  inspectedBy?: string;
  approvedBy?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateReceivingRequest {
  receivingNumber: string;
  supplier: SupplierInfo;
  purchaseOrder: string;
  items: ReceivingItem[];
}

export interface UpdateReceivingQuantitiesRequest {
  items: Array<{
    sku: string;
    receivedQuantity: number;
    notes?: string;
  }>;
}

export interface InspectReceivingRequest {
  inspectionNotes: string;
}

export interface RejectReceivingRequest {
  rejectionReason: string;
}

// Inventory Models
export interface Inventory {
  _id: string;
  sku: string;
  productName: string;
  quantity: number;
  reorderLevel: number;
  batchNumber?: string;
  expiryDate?: Date;
  storageLocation?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UpdateInventoryRequest {
  quantity?: number;
  reorderLevel?: number;
  storagLocation?: string;
}

// Stock Models
export interface StockData {
  totalItems: number;
  lowStockItems: number;
  expiredItems: number;
  expiringItems: number;
}

// Audit & Movement Models
export type MovementType = 'RECEIVE' | 'DISPATCH' | 'TRANSFER';

export interface StockMovement {
  _id: string;
  sku: string;
  movementType: MovementType;
  quantity: number;
  user: string;
  batchNumber?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface StockMovementQuery {
  sku?: string;
  startDate?: Date;
  endDate?: Date;
  movementType?: MovementType;
  limit?: number;
  skip?: number;
}

export interface StockMovementResponse {
  movements: StockMovement[];
  pagination: {
    total: number;
    limit: number;
    skip: number;
  };
}

export interface AuditItem {
  sku: string;
  physicalCount: number;
  notes?: string;
}

export interface AuditResponse {
  auditResults: Array<{
    sku: string;
    systemQuantity: number;
    physicalCount: number;
    discrepancy: number;
    notes?: string;
  }>;
}

export interface InventoryAccuracyReport {
  totalSKUs: number;
  accurateItems: number;
  discrepancies: number;
  accuracy: number;
  items: Array<{
    sku: string;
    systemQuantity: number;
    lastPhysicalCount: number;
    accuracy: number;
  }>;
}

export interface CriticalItemsReport {
  lowStockItems: Inventory[];
  expiredItems: Inventory[];
  expiringItems: Inventory[];
  summary: {
    totalLowStock: number;
    totalExpired: number;
    totalExpiring: number;
  };
}

// Dashboard
export interface DashboardData {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  totalInventory: number;
  lowStockCount: number;
  expiredItemsCount: number;
  recentOrders?: Order[];
  recentMovements?: StockMovement[];
}

// API Response Wrapper
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Array<{
    param: string;
    msg: string;
  }>;
}

// Pagination
export interface PaginationParams {
  limit?: number;
  skip?: number;
}

export interface PaginationMeta {
  total: number;
  limit: number;
  skip: number;
  page: number;
  pages: number;
}
