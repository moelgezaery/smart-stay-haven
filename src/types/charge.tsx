import { Booking } from './guest';

export interface Charge {
    id: number;
    bookingId: number;
    description: string;
    amount: number;
    category: string;
    notes?: string;
    isPaid: boolean;
    chargeDate: string;
    createdAt: string;
    lastUpdated?: string;
    booking?: Booking;
}

export type ChargeCategory = 'Room' | 'Food' | 'Service' | 'Amenity' | 'Other'; 