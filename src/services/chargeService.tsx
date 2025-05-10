import { Charge } from '../types/charge';
import { api } from './api';

export const chargeService = {
    getAllCharges: async (): Promise<Charge[]> => {
        const response = await api.get('/api/Charge');
        return response.data;
    },

    getChargeById: async (id: number): Promise<Charge> => {
        const response = await api.get(`/api/Charge/${id}`);
        return response.data;
    },

    getBookingCharges: async (bookingId: number): Promise<Charge[]> => {
        const response = await api.get(`/api/Charge/booking/${bookingId}`);
        return response.data;
    },

    getChargesByCategory: async (category: string): Promise<Charge[]> => {
        const response = await api.get(`/api/Charge/category/${category}`);
        return response.data;
    },

    getUnpaidCharges: async (): Promise<Charge[]> => {
        const response = await api.get('/api/Charge/unpaid');
        return response.data;
    },

    createCharge: async (charge: Omit<Charge, 'id' | 'createdAt' | 'lastUpdated'>): Promise<Charge> => {
        const response = await api.post('/api/Charge', charge);
        return response.data;
    },

    updateCharge: async (id: number, charge: Partial<Charge>): Promise<void> => {
        await api.put(`/api/Charge/${id}`, charge);
    },

    deleteCharge: async (id: number): Promise<void> => {
        await api.delete(`/api/Charge/${id}`);
    },

    markAsPaid: async (id: number): Promise<Charge> => {
        const response = await api.post(`/api/Charge/${id}/mark-paid`);
        return response.data;
    }
}; 