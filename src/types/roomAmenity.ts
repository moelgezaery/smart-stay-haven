import { Room } from './room';
import { RoomType } from './roomType';

export interface RoomAmenity {
    id: number;
    name: string;
    description?: string;
    icon?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt?: string;
    roomTypes?: RoomType[];
    roomId: number;
    category: string;
    isAvailable: boolean;
    room?: Room;
}

export interface RoomAmenityCreate {
    name: string;
    description?: string;
    icon?: string;
    roomId: number;
    category: string;
    isAvailable?: boolean;
}

export type RoomAmenityUpdate = Partial<RoomAmenityCreate> & {
    isActive?: boolean;
}; 