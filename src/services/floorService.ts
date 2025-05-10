import { api } from './api';
import { Floor, FloorCreate, FloorUpdate } from '../types/floor';
import { Room } from '../types/room';

export const floorService = {
    async getFloors(): Promise<Floor[]> {
        const response = await api.get<Floor[]>('/api/floor');
        return response.data;
    },

    async getFloor(id: number): Promise<Floor> {
        const response = await api.get<Floor>(`/api/floor/${id}`);
        return response.data;
    },

    async getFloorByNumber(number: number): Promise<Floor> {
        const response = await api.get<Floor>(`/api/floor/number/${number}`);
        return response.data;
    },

    async createFloor(floor: FloorCreate): Promise<Floor> {
        const response = await api.post<Floor>('/api/floor', floor);
        return response.data;
    },

    async updateFloor(id: number, floor: FloorUpdate): Promise<void> {
        await api.put(`/api/floor/${id}`, floor);
    },

    async deleteFloor(id: number): Promise<void> {
        await api.delete(`/api/floor/${id}`);
    },

    async getFloorRooms(id: number): Promise<Room[]> {
        const response = await api.get<Room[]>(`/api/floor/${id}/rooms`);
        return response.data;
    }
}; 