export interface Guest {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
    address?: string;
    city?: string;
    country?: string;
    passportNumber?: string;
    dateOfBirth?: string;
    specialRequests?: string;
    createdAt: string;
    lastUpdated?: string;
    bookings?: Booking[];
}

export interface Booking {
    id: number;
    guestId: number;
    roomId: number;
    checkInDate: string;
    checkOutDate: string;
    status: string;
    totalAmount: number;
    createdAt: string;
    lastUpdated?: string;
} 