// Backend Model Types (synced from NestJS schemas)
export interface Guest {
  _id: string;
  tableName: string;
  guestName: string;
  guestPhone?: string;
  isPaid: boolean;
  orders: string[]; // ObjectId array as strings
  payment: string | null; // ObjectId as string
  joinedAt: string;
  createdAt: string;
  updatedAt: string;
  isDeleted?: boolean;
  deletedAt?: string;
}

export interface IMenuItem {
  _id: string;
  name: string;
  description?: string;
  images?: string[]; // URLs as strings
  price: number;
  available: boolean;
  category: string;
  preparationTime?: number;
  tag?: string[];
  isVegetarian?: boolean;
  isVegan?: boolean;
  createdBy?: {
    _id: string;
    email: string;
  };
  updatedBy?: {
    _id: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
  isDeleted?: boolean;
  deletedAt?: string;
}

export interface Order {
  _id: string;
  guest?: string; // ObjectId as string
  user?: string; // ObjectId as string
  items: {
    item: string; // ObjectId as string
    quantity: number;
    note?: string;
    unitPrice: number;
    subtotal: number;
  }[];
  status: "pending" | "preparing" | "served" | "cancelled";
  totalPrice: number;
  isPaid: boolean;
  specialInstructions?: string;
  estimatedReadyTime?: string;
  table?: string; // ObjectId as string
  orderType: OrderType;
  deliveryAddress?: string;
  customerPhone?: string;
  createdBy?: {
    _id: string;
    email: string;
  };
  updatedBy?: {
    _id: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
  isDeleted?: boolean;
  deletedAt?: string;
}

export interface User {
  _id: string;
  name?: string;
  email: string;
  role: string | Role; // Can be ObjectId string or populated Role object
  isMember: boolean;
  phone?: string;
  address?: string;
  avatarUrl?: string;
  transactions: string[]; // ObjectId array as strings
  createdBy?: {
    _id: string;
    email: string;
  };
  updatedBy?: {
    _id: string;
    email: string;
  };
  deletedBy?: {
    _id: string;
    email: string;
  };
  refreshToken?: string;
  createdAt: string;
  updatedAt: string;
  isDeleted?: boolean;
  deletedAt?: string;
}

// Matches the backend DTO
export enum OrderType {
  DINE_IN = "DINE_IN",
  DELIVERY = "DELIVERY",
  PICKUP = "PICKUP",
}
export enum RoleName {
  ADMIN = 'ADMIN',
  STAFF = 'STAFF'
}
class OrderItemDto {
  item!: string; // MenuItem ID
  quantity!: number;
  note?: string;
}

export class CreateOnlineOrderDto {
  items!: OrderItemDto[];
  customerName!: string;
  customerPhone!: string;
  orderType!: OrderType;
  deliveryAddress?: string;
  specialInstructions?: string;
  user?: string; // Optional: if the user is logged in
}

export interface Payment {
  _id: string;
  guest: string | Guest;
  amount: number;
  method: "cash" | "QR" | "card";
  status?: "pending" | "completed" | "failed";
  createdAt: string;
  updatedAt: string;
}

export interface Table {
  _id: string;
  tableName: string;
  status: "available" | "occupied";
  qrCode?: string;
  createdAt: string;
  updatedAt: string;
}

// Legacy User interface for auth context - keep for backward compatibility
export interface AuthUser {
  id?: string;
  _id?: string;
  email: string;
  name: string;
  avatarUrl?: string;
  role: "ADMIN" | "STAFF" | "USER" | "admin" | "staff" | "user";
  createdAt?: string;
  updatedAt?: string;
}

// Frontend Types
export interface OrderItem {
  menuItem: IMenuItem;
  quantity: number;
}

export interface CartItem extends OrderItem {
  _tempId?: string;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  loginAdmin: (credentials: {
    email: string;
    password: string;
  }) => Promise<boolean>;
  loginStaff: (credentials: {
    email: string;
    password: string;
  }) => Promise<boolean>;
  logoutUser: () => Promise<void>;
  refreshToken: () => Promise<boolean>;
}

export interface GuestOrderContextType {
  cart: CartItem[];
  addToCart: (item: IMenuItem, quantity: number) => void;
  removeFromCart: (menuItemId: string) => void;
  updateQuantity: (menuItemId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalAmount: () => number;
  submitOrder: (guestId: string) => Promise<boolean>;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedOrder {
  items: Order[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Revenue Analytics Types
export interface RevenueStats {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  growth: {
    revenue: number;
    orders: number;
  };
  periodComparison: {
    current: number;
    previous: number;
    change: number;
  };
}

export interface RevenueChartData {
  date: string;
  revenue: number;
  orders: number;
}

export interface TopSellingItem {
  _id: string;
  name: string;
  category: string;
  totalSold: number;
  totalRevenue: number;
  image?: string;
}

export interface OrderAnalytics {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  statusDistribution: {
    status: string;
    count: number;
    percentage: number;
  }[];
  dailyOrders: {
    date: string;
    count: number;
  }[];
}

export interface CustomerAnalytics {
  totalCustomers: number;
  newCustomers: number;
  returningCustomers: number;
  customerGrowth: {
    current: number;
    previous: number;
    change: number;
  };
}

// User Role interface
export interface Role {
  _id: string;
  name: string;
  permissions: string[];
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Form Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface GuestFormData {
  tableName: string;
  guestName: string;
}

export interface MenuItemFormData {
  name: string;
  price: number;
  description: string;
  available: boolean;
  category?: string;
}

export interface TableFormData {
  tableName: string;
  status: "available" | "occupied";
}

export interface PaymentFormData {
  guest: string;
  amount: number;
  method: "cash" | "QR" | "card";
}

export type UserRole = "ADMIN" | "STAFF" | "GUEST";

export type Section =
  | {
    type: "text";
    title: string;
    content: string;
    order: number;
  }
  | {
    type: "image";
    title: string;
    url: string;
    order: number;
  }
  | {
    type: "team";
    title: string;
    teamMembers: { name: string; role: string; photo: string }[];
    order: number;
  }
  | {
    type: "quote";
    quote: string;
    order: number;
  }
  | {
    type: "video";
    title: string;
    url: string;
    order: number;
  };

export interface PaginatedMenuItem {
  items: IMenuItem[];
  total: number;
  page: number;
  limit: number;
}
export interface PaginatedUser {
  items: User[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ============================
// Voucher Types
// ============================
export type VoucherDiscountType = 'percentage' | 'fixed';

export interface Voucher {
  _id: string;
  code: string;
  discountType: VoucherDiscountType;
  discountValue: number;
  startDate?: string;
  endDate?: string;
  usageLimit?: number;
  usedCount: number;
  isActive: boolean;
  minOrderTotal?: number;
  maxDiscount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedVoucher {
  items: Voucher[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApplyVoucherPayload {
  code: string;
  orderTotal: number;
  items?: { itemId: string; quantity: number; price?: number }[];
}

export interface ApplyVoucherResponse {
  code: string;
  discountAmount: number;
  finalTotal: number;
  voucherId: string;
}
export type OrdersResponse = 
  | {
      statusCode: number;
      message: string;
      data: {
        orders: Order[];
        total: number;
        totalPages: number;
      };
      timestamp: string;
    }
  | Order[];
