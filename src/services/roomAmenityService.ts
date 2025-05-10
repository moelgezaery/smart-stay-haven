import { api } from './api';
import { RoomAmenity, RoomAmenityCreate, RoomAmenityUpdate } from '../types/roomAmenity';

export const roomAmenityService = {
    async getRoomAmenities(): Promise<RoomAmenity[]> {
        const response = await api.get<RoomAmenity[]>('/api/roomamenity');
        return response.data;
    },

    async getRoomAmenity(id: number): Promise<RoomAmenity> {
        const response = await api.get<RoomAmenity>(`/api/roomamenity/${id}`);
        return response.data;
    },

    async createRoomAmenity(roomAmenity: RoomAmenityCreate): Promise<RoomAmenity> {
        const response = await api.post<RoomAmenity>('/api/roomamenity', roomAmenity);
        return response.data;
    },

    async updateRoomAmenity(id: number, roomAmenity: RoomAmenityUpdate): Promise<void> {
        await api.put(`/api/roomamenity/${id}`, roomAmenity);
    },

    async deleteRoomAmenity(id: number): Promise<void> {
        await api.delete(`/api/roomamenity/${id}`);
    },

    async getActiveRoomAmenities(): Promise<RoomAmenity[]> {
        const response = await api.get<RoomAmenity[]>('/api/roomamenity/active');
        return response.data;
    },

    async getRoomAmenitiesByRoom(roomId: number): Promise<RoomAmenity[]> {
        const response = await api.get<RoomAmenity[]>(`/api/roomamenity/room/${roomId}`);
        return response.data;
    },

    async getRoomAmenitiesByCategory(category: string): Promise<RoomAmenity[]> {
        const response = await api.get<RoomAmenity[]>(`/api/roomamenity/category/${encodeURIComponent(category)}`);
        return response.data;
    },

    async getAvailableRoomAmenities(): Promise<RoomAmenity[]> {
        const response = await api.get<RoomAmenity[]>('/api/roomamenity/available');
        return response.data;
    }
}; 