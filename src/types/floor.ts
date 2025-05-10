import { Room } from './room';

export interface Floor {
    id: number;
    number: number;
    name: string;
    description: string;
    totalRooms: number;
    isActive: boolean;
    createdAt: string;
    updatedAt?: string;
    rooms?: Room[];
}

export interface FloorCreate {
    number: number;
    name: string;
    description: string;
    totalRooms: number;
}

export interface FloorUpdate extends Partial<FloorCreate> {
    isActive?: boolean;
} 