import { api } from './api';
import { RoomType, RoomTypeCreate, RoomTypeUpdate } from '../types/roomType';

export const roomTypeService = {
    async getRoomTypes(): Promise<RoomType[]> {
        const response = await api.get<RoomType[]>('/api/roomtype');
        return response.data;
    },

    async getRoomType(id: number): Promise<RoomType> {
        const response = await api.get<RoomType>(`/api/roomtype/${id}`);
        return response.data;
    },

    async createRoomType(roomType: RoomTypeCreate): Promise<RoomType> {
        const response = await api.post<RoomType>('/api/roomtype', roomType);
        return response.data;
    },

    async updateRoomType(id: number, roomType: RoomTypeUpdate): Promise<void> {
        await api.put(`/api/roomtype/${id}`, roomType);
    },

    async deleteRoomType(id: number): Promise<void> {
        await api.delete(`/api/roomtype/${id}`);
    },

    async getActiveRoomTypes(): Promise<RoomType[]> {
        const response = await api.get<RoomType[]>('/api/roomtype/active');
        return response.data;
    },

    async getRoomTypesByBedType(bedType: string): Promise<RoomType[]> {
        const response = await api.get<RoomType[]>(`/api/roomtype/bedtype/${encodeURIComponent(bedType)}`);
        return response.data;
    },

    async getRoomTypesByOccupancy(maxOccupancy: number): Promise<RoomType[]> {
        const response = await api.get<RoomType[]>(`/api/roomtype/occupancy/${maxOccupancy}`);
        return response.data;
    },

    async getRoomTypesByView(hasOceanView: boolean): Promise<RoomType[]> {
        const response = await api.get<RoomType[]>(`/api/roomtype/view/${hasOceanView}`);
        return response.data;
    },

    async getRoomTypeRooms(id: number): Promise<RoomType> {
        const response = await api.get<RoomType>(`/api/roomtype/${id}/rooms`);
        return response.data;
    },

    async getRoomTypeAmenities(id: number): Promise<RoomType> {
        const response = await api.get<RoomType>(`/api/roomtype/${id}/amenities`);
        return response.data;
    }
}; 