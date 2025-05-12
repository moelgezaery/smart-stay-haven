
export type PaymentMethod = 'CreditCard' | 'DebitCard' | 'Cash' | 'BankTransfer' | 'MobilePayment';
export type PaymentStatus = 'Pending' | 'Completed' | 'Failed' | 'Refunded' | 'Cancelled';

export interface Payment {
  id: number;
  bookingId: number;
  booking?: any;
  amount: number;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  transactionId?: string;
  paymentDate: string;
  notes?: string;
  refundAmount?: number;
  refundDate?: string;
  refundReason?: string;
  cardType?: string;
  cardLastFour?: string;
  reference?: string;
  processedById?: number;
  processedBy?: any;
  createdAt: string;
  updatedAt?: string;
}

export interface PaymentCreate {
  bookingId: number;
  amount: number;
  paymentMethod: PaymentMethod;
  status?: PaymentStatus;
  transactionId?: string;
  paymentDate?: string;
  notes?: string;
  cardType?: string;
  cardLastFour?: string;
  reference?: string;
  processedById?: number;
}

export interface PaymentUpdate {
  amount?: number;
  paymentMethod?: PaymentMethod;
  status?: PaymentStatus;
  transactionId?: string;
  notes?: string;
  refundAmount?: number;
  refundDate?: string;
  refundReason?: string;
  cardType?: string;
  cardLastFour?: string;
  reference?: string;
  processedById?: number;
}
