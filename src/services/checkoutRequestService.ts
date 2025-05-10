import { api } from './api';
import { CheckoutRequest, CheckoutRequestCreate, CheckoutRequestUpdate } from '../types/checkoutRequest';

export const checkoutRequestService = {
    async getCheckoutRequests(): Promise<CheckoutRequest[]> {
        const response = await api.get<CheckoutRequest[]>('/api/checkoutrequest');
        return response.data;
    },

    async getCheckoutRequest(id: number): Promise<CheckoutRequest> {
        const response = await api.get<CheckoutRequest>(`/api/checkoutrequest/${id}`);
        return response.data;
    },

    async createCheckoutRequest(request: CheckoutRequestCreate): Promise<CheckoutRequest> {
        const response = await api.post<CheckoutRequest>('/api/checkoutrequest', request);
        return response.data;
    },

    async updateCheckoutRequest(id: number, request: CheckoutRequestUpdate): Promise<void> {
        await api.put(`/api/checkoutrequest/${id}`, request);
    },

    async deleteCheckoutRequest(id: number): Promise<void> {
        await api.delete(`/api/checkoutrequest/${id}`);
    },

    async getEarlyCheckouts(): Promise<CheckoutRequest[]> {
        const response = await api.get<CheckoutRequest[]>('/api/checkoutrequest/early');
        return response.data;
    },

    async getCheckoutsByDateRange(startDate: string, endDate: string): Promise<CheckoutRequest[]> {
        const response = await api.get<CheckoutRequest[]>(`/api/checkoutrequest/range?startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`);
        return response.data;
    },

    async getCheckoutsByPaymentMethod(paymentMethod: string): Promise<CheckoutRequest[]> {
        const response = await api.get<CheckoutRequest[]>(`/api/checkoutrequest/payment/${encodeURIComponent(paymentMethod)}`);
        return response.data;
    }
}; 