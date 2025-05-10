import { Guest } from './guest';
import { Room } from './room';
import { Charge } from './charge';
import { Payment } from './payment';

export type BookingStatus = 'Pending' | 'Confirmed' | 'CheckedIn' | 'CheckedOut' | 'Cancelled';
export type PaymentStatus = 'Pending' | 'Paid' | 'PartiallyPaid' | 'Refunded';

export interface Booking {
    id: number;
    guestId: number;
    roomId: number;
    checkInDate: string;
    checkOutDate: string;
    status: BookingStatus;
    totalAmount: number;
    specialRequests?: string;
    numberOfGuests?: number;
    paymentStatus?: PaymentStatus;
    createdAt: string;
    lastUpdated?: string;
    guest?: Guest;
    room?: Room;
    charges?: Charge[];
    payments?: Payment[];
}

export interface BookingCreate {
    guestId: number;
    roomId: number;
    checkInDate: string;
    checkOutDate: string;
    specialRequests?: string;
    numberOfGuests?: number;
}

export type BookingUpdate = Partial<BookingCreate> & {
    status?: BookingStatus;
    paymentStatus?: PaymentStatus;
}; 