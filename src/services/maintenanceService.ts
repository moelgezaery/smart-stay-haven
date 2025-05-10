import { api } from './api';
import { Maintenance, MaintenanceCreate, MaintenanceUpdate, MaintenanceStatus, MaintenanceCategory, MaintenancePriority } from '../types/maintenance';

export const maintenanceService = {
    async getMaintenanceTasks(): Promise<Maintenance[]> {
        const response = await api.get<Maintenance[]>('/api/maintenance');
        return response.data;
    },

    async getMaintenanceTask(id: number): Promise<Maintenance> {
        const response = await api.get<Maintenance>(`/api/maintenance/${id}`);
        return response.data;
    },

    async createMaintenanceTask(task: MaintenanceCreate): Promise<Maintenance> {
        const response = await api.post<Maintenance>('/api/maintenance', task);
        return response.data;
    },

    async updateMaintenanceTask(id: number, task: MaintenanceUpdate): Promise<void> {
        await api.put(`/api/maintenance/${id}`, task);
    },

    async deleteMaintenanceTask(id: number): Promise<void> {
        await api.delete(`/api/maintenance/${id}`);
    },

    async getTasksByStatus(status: MaintenanceStatus): Promise<Maintenance[]> {
        const response = await api.get<Maintenance[]>(`/api/maintenance/status/${status}`);
        return response.data;
    },

    async getTasksByCategory(category: MaintenanceCategory): Promise<Maintenance[]> {
        const response = await api.get<Maintenance[]>(`/api/maintenance/category/${category}`);
        return response.data;
    },

    async getTasksByPriority(priority: MaintenancePriority): Promise<Maintenance[]> {
        const response = await api.get<Maintenance[]>(`/api/maintenance/priority/${priority}`);
        return response.data;
    },

    async getTasksByRoom(roomId: number): Promise<Maintenance[]> {
        const response = await api.get<Maintenance[]>(`/api/maintenance/room/${roomId}`);
        return response.data;
    },

    async getTasksByEmployee(employeeId: number): Promise<Maintenance[]> {
        const response = await api.get<Maintenance[]>(`/api/maintenance/employee/${employeeId}`);
        return response.data;
    },

    async getUrgentTasks(): Promise<Maintenance[]> {
        const response = await api.get<Maintenance[]>('/api/maintenance/urgent');
        return response.data;
    }
}; 