import { Housekeeping } from '../types/housekeeping';
import { api } from './api';

export const housekeepingService = {
    getAllTasks: async (): Promise<Housekeeping[]> => {
        const response = await api.get('/api/Housekeeping');
        return response.data;
    },

    getTaskById: async (id: number): Promise<Housekeeping> => {
        const response = await api.get(`/api/Housekeeping/${id}`);
        return response.data;
    },

    getRoomTasks: async (roomId: number): Promise<Housekeeping[]> => {
        const response = await api.get(`/api/Housekeeping/room/${roomId}`);
        return response.data;
    },

    getEmployeeTasks: async (employeeId: number): Promise<Housekeeping[]> => {
        const response = await api.get(`/api/Housekeeping/employee/${employeeId}`);
        return response.data;
    },

    getTasksByStatus: async (status: string): Promise<Housekeeping[]> => {
        const response = await api.get(`/api/Housekeeping/status/${status}`);
        return response.data;
    },

    createTask: async (task: Omit<Housekeeping, 'id' | 'createdAt' | 'lastUpdated'>): Promise<Housekeeping> => {
        const response = await api.post('/api/Housekeeping', task);
        return response.data;
    },

    updateTask: async (id: number, task: Partial<Housekeeping>): Promise<void> => {
        await api.put(`/api/Housekeeping/${id}`, task);
    },

    deleteTask: async (id: number): Promise<void> => {
        await api.delete(`/api/Housekeeping/${id}`);
    }
}; 