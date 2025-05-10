export interface RoomServiceOrder {
    id: number;
    roomId: number;
    serviceId: number;
    quantity: number;
    status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
    notes?: string;
    createdAt: string;
    updatedAt?: string;
} 