import { api } from './api';
import { Charge, ChargeCreate, ChargeUpdate, ChargeCategory } from '../types/charge';

export const chargeService = {
    async getCharges(): Promise<Charge[]> {
        const response = await api.get<Charge[]>('/api/charge');
        return response.data;
    },

    async getCharge(id: number): Promise<Charge> {
        const response = await api.get<Charge>(`/api/charge/${id}`);
        return response.data;
    },

    async createCharge(charge: ChargeCreate): Promise<Charge> {
        const response = await api.post<Charge>('/api/charge', charge);
        return response.data;
    },

    async updateCharge(id: number, charge: ChargeUpdate): Promise<void> {
        await api.put(`/api/charge/${id}`, charge);
    },

    async deleteCharge(id: number): Promise<void> {
        await api.delete(`/api/charge/${id}`);
    },

    async getChargesByCategory(category: ChargeCategory): Promise<Charge[]> {
        const response = await api.get<Charge[]>(`/api/charge/category/${category}`);
        return response.data;
    },

    async getChargesByBooking(bookingId: number): Promise<Charge[]> {
        const response = await api.get<Charge[]>(`/api/charge/booking/${bookingId}`);
        return response.data;
    },

    async getUnpaidCharges(): Promise<Charge[]> {
        const response = await api.get<Charge[]>('/api/charge/unpaid');
        return response.data;
    },

    async getChargesByDateRange(startDate: string, endDate: string): Promise<Charge[]> {
        const response = await api.get<Charge[]>(`/api/charge/date-range?startDate=${startDate}&endDate=${endDate}`);
        return response.data;
    },

    async markAsPaid(id: number): Promise<Charge> {
        const response = await api.put<Charge>(`/api/charge/${id}/mark-paid`);
        return response.data;
    }
}; 