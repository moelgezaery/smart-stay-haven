import { api } from './api';
import { Room, RoomCreate, RoomUpdate } from '../types/room';

export const roomService = {
    async getRooms(): Promise<Room[]> {
        const response = await api.get<Room[]>('/api/room');
        return response.data;
    },

    async getRoom(id: number): Promise<Room> {
        const response = await api.get<Room>(`/api/room/${id}`);
        return response.data;
    },

    async createRoom(room: RoomCreate): Promise<Room> {
        const response = await api.post<Room>('/api/room', room);
        return response.data;
    },

    async updateRoom(id: number, room: RoomUpdate): Promise<void> {
        await api.put(`/api/room/${id}`, room);
    },

    async deleteRoom(id: number): Promise<void> {
        await api.delete(`/api/room/${id}`);
    },

    async getRoomsByFloor(floor: number): Promise<Room[]> {
        const response = await api.get<Room[]>(`/api/room/floor/${floor}`);
        return response.data;
    },

    async getRoomsByStatus(status: string): Promise<Room[]> {
        const response = await api.get<Room[]>(`/api/room/status/${status}`);
        return response.data;
    },

    async getAvailableRooms(): Promise<Room[]> {
        const response = await api.get<Room[]>('/api/room/available');
        return response.data;
    }
}; 