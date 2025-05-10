import { Booking } from './booking';
import { Employee } from './employee';

export interface Company {
    id: number;
    name: string;
    address?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
    phone?: string;
    email?: string;
    taxId?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt?: string;
    bookings?: Booking[];
    employees?: Employee[];
}

export interface CompanyCreate {
    name: string;
    address?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
    phone?: string;
    email?: string;
    taxId?: string;
}

export type CompanyUpdate = Partial<CompanyCreate> & {
    isActive?: boolean;
}; 