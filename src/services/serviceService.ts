import { api } from './api';
import { Service, ServiceCreate, ServiceUpdate } from '../types/service';

export const serviceService = {
    async getServices(): Promise<Service[]> {
        const response = await api.get<Service[]>('/api/service');
        return response.data;
    },

    async getService(id: number): Promise<Service> {
        const response = await api.get<Service>(`/api/service/${id}`);
        return response.data;
    },

    async createService(service: ServiceCreate): Promise<Service> {
        const response = await api.post<Service>('/api/service', service);
        return response.data;
    },

    async updateService(id: number, service: ServiceUpdate): Promise<void> {
        await api.put(`/api/service/${id}`, service);
    },

    async deleteService(id: number): Promise<void> {
        await api.delete(`/api/service/${id}`);
    },

    async getServicesByCategory(category: string): Promise<Service[]> {
        const response = await api.get<Service[]>(`/api/service/category/${category}`);
        return response.data;
    },

    async getAvailableServices(): Promise<Service[]> {
        const response = await api.get<Service[]>('/api/service/available');
        return response.data;
    }
}; 