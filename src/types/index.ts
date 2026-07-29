export type Role = "Admin" | "Customer" | "Provider";
export type ActiveStatus = "Active" | "Inactive";
export type RentalOrderStatus =
  "PLACED" | "CONFIRMED" | "PAID" | "PICKED_UP" | "RETURNED" | "CANCELLED";
export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  active_status: ActiveStatus;
  profile_image?: string;
  bio?: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GearItem {
  id: string;
  name: string;
  description: string;
  brand: string;
  pricePerDay: number;
  stock: number;
  imageUrl?: string;
  categoryId: string;
  category?: Category;
  providerId: string;
  provider?: User;
  createdAt: string;
  updatedAt: string;
}

export interface RentalOrder {
  id: string;
  customerId: string;
  customer?: User;
  gearItemId: string;
  gearItem?: GearItem;
  startDate: string;
  endDate: string;
  totalCost: number;
  status: RentalOrderStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  transactionId: string;
  rentalOrderId: string;
  rentalOrder?: RentalOrder;
  amount: number;
  method: string;
  status: PaymentStatus;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  customerId: string;
  customer?: User;
  gearItemId: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  status_code: number;
  message: string;
  data: T;
}
