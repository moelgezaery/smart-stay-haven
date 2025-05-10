import { api } from './api';
import { RoomServiceOrder } from '../types/roomServiceOrder';

export interface RoomServiceOrderCreate {
    roomId: number;
    serviceId: number;
    quantity: number;
    notes?: string;
}

export interface RoomServiceOrderUpdate {
    quantity?: number;
    status?: 'pending' | 'in-progress' | 'completed' | 'cancelled';
    notes?: string;
}

export const roomServiceOrderService = {
    async getOrders(): Promise<RoomServiceOrder[]> {
        const response = await api.get<RoomServiceOrder[]>('/api/room-service-order');
        return response.data;
    },

    async getOrder(id: number): Promise<RoomServiceOrder> {
        const response = await api.get<RoomServiceOrder>(`/api/room-service-order/${id}`);
        return response.data;
    },

    async createOrder(order: RoomServiceOrderCreate): Promise<RoomServiceOrder> {
        const response = await api.post<RoomServiceOrder>('/api/room-service-order', order);
        return response.data;
    },

    async updateOrder(id: number, order: RoomServiceOrderUpdate): Promise<void> {
        await api.put(`/api/room-service-order/${id}`, order);
    },

    async deleteOrder(id: number): Promise<void> {
        await api.delete(`/api/room-service-order/${id}`);
    },

    async getOrdersByRoom(roomId: number): Promise<RoomServiceOrder[]> {
        const response = await api.get<RoomServiceOrder[]>(`/api/room-service-order/room/${roomId}`);
        return response.data;
    },

    async getOrdersByStatus(status: RoomServiceOrder['status']): Promise<RoomServiceOrder[]> {
        const response = await api.get<RoomServiceOrder[]>(`/api/room-service-order/status/${status}`);
        return response.data;
    }
}; 