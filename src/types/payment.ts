import { Booking } from './booking';

export type PaymentMethod = 'Cash' | 'CreditCard' | 'DebitCard' | 'BankTransfer';
export type PaymentStatus = 'Pending' | 'Completed' | 'Failed' | 'Refunded';
export type CardType = 'Visa' | 'MasterCard' | 'AmericanExpress' | 'Discover' | 'Other';

export interface Payment {
    id: number;
    bookingId: number;
    amount: number;
    paymentMethod: PaymentMethod;
    status: PaymentStatus;
    transactionId?: string;
    cardLastFour?: string;
    cardType?: CardType;
    notes?: string;
    paymentDate: string;
    createdAt: string;
    lastUpdated?: string;
    booking?: Booking;
}

export interface PaymentCreate {
    bookingId: number;
    amount: number;
    paymentMethod: PaymentMethod;
    transactionId?: string;
    cardLastFour?: string;
    cardType?: CardType;
    notes?: string;
}

export type PaymentUpdate = Partial<PaymentCreate> & {
    status?: PaymentStatus;
}; 