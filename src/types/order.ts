/**
 * Domain & Backend Order Status Types
 * Aligned with backend schema & controllers
 */

export type ServiceStatus = 'waiting' | 'in_service' | 'completed' | 'cancelled';
export type PaymentStatus = 'unpaid' | 'paid';

export type OrderStatus =
  | 'WAITING'
  | 'IN_SERVICE'
  | 'COMPLETED_UNPAID'
  | 'PAID';

export type QuickFilterTab = 'ALL' | 'WAITING' | 'IN_SERVICE' | 'COMPLETED';

export interface Customer {
  id: number;
  name: string;
  phone: string;
}

export interface Kapster {
  id: number;
  name: string;
  phone?: string;
}

export interface Service {
  id: number;
  name: string;
  duration: number;
  price: number;
}

export interface OrderItem {
  id: number;
  orderId: number;
  serviceId: number;
  duration: number;
  price: number;
  qty: number;
  subtotal: number;
  service?: Service;
}

export interface Order {
  id: number;
  customerId: number;
  kapsterId: number;
  serviceStatus: ServiceStatus;
  paymentStatus: PaymentStatus;
  checkInTime: string;
  notes?: string;
  createdAt: string;
  customer?: Customer;
  kapster?: Kapster;
  services?: Service[];
  totalPrice?: number;
}
