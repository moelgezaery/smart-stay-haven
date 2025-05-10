import { RoomServiceOrder } from './roomServiceOrder';

export interface Service {
    id: number;
    name: string;
    description: string;
    price: number;
    category: string;
    isAvailable: boolean;
    isActive: boolean;
    createdAt: string;
    updatedAt?: string;
    orders?: RoomServiceOrder[];
}

export interface ServiceCreate {
    name: string;
    description: string;
    price: number;
    category: string;
    isAvailable: boolean;
}

export interface ServiceUpdate extends Partial<ServiceCreate> {
    isActive?: boolean;
} 