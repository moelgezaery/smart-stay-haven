import { api } from './api';
import { MaintenanceRequest, MaintenanceRequestCreate, MaintenanceRequestUpdate, MaintenancePriority, MaintenanceStatus } from '../types/maintenanceRequest';

export const maintenanceRequestService = {
    async getMaintenanceRequests(): Promise<MaintenanceRequest[]> {
        const response = await api.get<MaintenanceRequest[]>('/api/maintenancerequest');
        return response.data;
    },

    async getMaintenanceRequest(id: number): Promise<MaintenanceRequest> {
        const response = await api.get<MaintenanceRequest>(`/api/maintenancerequest/${id}`);
        return response.data;
    },

    async createMaintenanceRequest(request: MaintenanceRequestCreate): Promise<MaintenanceRequest> {
        const response = await api.post<MaintenanceRequest>('/api/maintenancerequest', request);
        return response.data;
    },

    async updateMaintenanceRequest(id: number, request: MaintenanceRequestUpdate): Promise<void> {
        await api.put(`/api/maintenancerequest/${id}`, request);
    },

    async deleteMaintenanceRequest(id: number): Promise<void> {
        await api.delete(`/api/maintenancerequest/${id}`);
    },

    async getMaintenanceRequestsByRoom(roomId: number): Promise<MaintenanceRequest[]> {
        const response = await api.get<MaintenanceRequest[]>(`/api/maintenancerequest/room/${roomId}`);
        return response.data;
    },

    async getMaintenanceRequestsByStatus(status: MaintenanceStatus): Promise<MaintenanceRequest[]> {
        const response = await api.get<MaintenanceRequest[]>(`/api/maintenancerequest/status/${status}`);
        return response.data;
    },

    async getMaintenanceRequestsByPriority(priority: MaintenancePriority): Promise<MaintenanceRequest[]> {
        const response = await api.get<MaintenanceRequest[]>(`/api/maintenancerequest/priority/${priority}`);
        return response.data;
    },

    async getMaintenanceRequestsByAssignee(assignedToId: number): Promise<MaintenanceRequest[]> {
        const response = await api.get<MaintenanceRequest[]>(`/api/maintenancerequest/assignee/${assignedToId}`);
        return response.data;
    },

    async getPendingMaintenanceRequests(): Promise<MaintenanceRequest[]> {
        const response = await api.get<MaintenanceRequest[]>('/api/maintenancerequest/pending');
        return response.data;
    }
}; 