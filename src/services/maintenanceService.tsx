import { Maintenance } from '../types/maintenance';
import { api } from './api';

export const maintenanceService = {
    getAllTasks: async (): Promise<Maintenance[]> => {
        const response = await api.get('/api/Maintenance');
        return response.data;
    },

    getTaskById: async (id: number): Promise<Maintenance> => {
        const response = await api.get(`/api/Maintenance/${id}`);
        return response.data;
    },

    getRoomTasks: async (roomId: number): Promise<Maintenance[]> => {
        const response = await api.get(`/api/Maintenance/room/${roomId}`);
        return response.data;
    },

    getEmployeeTasks: async (employeeId: number): Promise<Maintenance[]> => {
        const response = await api.get(`/api/Maintenance/employee/${employeeId}`);
        return response.data;
    },

    getTasksByStatus: async (status: string): Promise<Maintenance[]> => {
        const response = await api.get(`/api/Maintenance/status/${status}`);
        return response.data;
    },

    getTasksByCategory: async (category: string): Promise<Maintenance[]> => {
        const response = await api.get(`/api/Maintenance/category/${category}`);
        return response.data;
    },

    createTask: async (task: Omit<Maintenance, 'id' | 'createdAt' | 'lastUpdated'>): Promise<Maintenance> => {
        const response = await api.post('/api/Maintenance', task);
        return response.data;
    },

    updateTask: async (id: number, task: Partial<Maintenance>): Promise<void> => {
        await api.put(`/api/Maintenance/${id}`, task);
    },

    deleteTask: async (id: number): Promise<void> => {
        await api.delete(`/api/Maintenance/${id}`);
    }
}; 