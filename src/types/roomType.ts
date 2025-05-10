import { Room } from './room';
import { RoomAmenity } from './roomAmenity';

export interface RoomType {
    id: number;
    name: string;
    description?: string;
    baseRate: number;
    maxOccupancy: number;
    bedCount: number;
    bedType?: string;
    hasBalcony: boolean;
    hasOceanView: boolean;
    isActive: boolean;
    createdAt: string;
    updatedAt?: string;
    rooms?: Room[];
    amenities?: RoomAmenity[];
}

export interface RoomTypeCreate {
    name: string;
    description?: string;
    baseRate: number;
    maxOccupancy: number;
    bedCount: number;
    bedType?: string;
    hasBalcony?: boolean;
    hasOceanView?: boolean;
}

export type RoomTypeUpdate = Partial<RoomTypeCreate> & {
    isActive?: boolean;
}; 