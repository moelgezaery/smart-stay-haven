import { api } from './api';
import { Housekeeping, HousekeepingCreate, HousekeepingUpdate, HousekeepingStatus } from '../types/housekeeping';

export const housekeepingService = {
    async getHousekeepingTasks(): Promise<Housekeeping[]> {
        const response = await api.get<Housekeeping[]>('/api/housekeeping');
        return response.data;
    },

    async getHousekeepingTask(id: number): Promise<Housekeeping> {
        const response = await api.get<Housekeeping>(`/api/housekeeping/${id}`);
        return response.data;
    },

    async createHousekeepingTask(task: HousekeepingCreate): Promise<Housekeeping> {
        const response = await api.post<Housekeeping>('/api/housekeeping', task);
        return response.data;
    },

    async updateHousekeepingTask(id: number, task: HousekeepingUpdate): Promise<void> {
        await api.put(`/api/housekeeping/${id}`, task);
    },

    async deleteHousekeepingTask(id: number): Promise<void> {
        await api.delete(`/api/housekeeping/${id}`);
    },

    async getTasksByStatus(status: HousekeepingStatus): Promise<Housekeeping[]> {
        const response = await api.get<Housekeeping[]>(`/api/housekeeping/status/${status}`);
        return response.data;
    },

    async getTasksByRoom(roomId: number): Promise<Housekeeping[]> {
        const response = await api.get<Housekeeping[]>(`/api/housekeeping/room/${roomId}`);
        return response.data;
    },

    async getTasksByEmployee(employeeId: number): Promise<Housekeeping[]> {
        const response = await api.get<Housekeeping[]>(`/api/housekeeping/employee/${employeeId}`);
        return response.data;
    },

    async getTasksByDate(date: string): Promise<Housekeeping[]> {
        const response = await api.get<Housekeeping[]>(`/api/housekeeping/date/${date}`);
        return response.data;
    },

    async getUrgentTasks(): Promise<Housekeeping[]> {
        const response = await api.get<Housekeeping[]>('/api/housekeeping/urgent');
        return response.data;
    }
}; 