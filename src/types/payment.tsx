import { Booking } from './guest';

export interface Payment {
    id: number;
    bookingId: number;
    amount: number;
    paymentMethod: string;
    status: string;
    transactionId?: string;
    cardLastFour?: string;
    cardType?: string;
    notes?: string;
    paymentDate: string;
    createdAt: string;
    lastUpdated?: string;
    booking?: Booking;
}

export type PaymentMethod = 'Cash' | 'CreditCard' | 'DebitCard' | 'BankTransfer';
export type PaymentStatus = 'Pending' | 'Completed' | 'Failed' | 'Refunded'; 