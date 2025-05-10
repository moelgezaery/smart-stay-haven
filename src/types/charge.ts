import { Booking } from './booking';

export type ChargeCategory = 'Room' | 'Food' | 'Service' | 'Amenity' | 'Other';

export interface Charge {
    id: number;
    bookingId: number;
    description: string;
    amount: number;
    unitPrice: number;
    category: ChargeCategory;
    notes?: string;
    isPaid: boolean;
    chargeDate: string;
    createdAt: string;
    lastUpdated?: string;
    booking?: Booking;
}

export interface ChargeCreate {
    bookingId: number;
    description: string;
    amount: number;
    unitPrice: number;
    category: ChargeCategory;
    notes?: string;
}

export type ChargeUpdate = Partial<ChargeCreate> & {
    isPaid?: boolean;
}; 