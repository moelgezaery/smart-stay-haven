import { Payment } from '../types/payment';
import { api } from './api';

export const paymentService = {
    getAllPayments: async (): Promise<Payment[]> => {
        const response = await api.get('/api/Payment');
        return response.data;
    },

    getPaymentById: async (id: number): Promise<Payment> => {
        const response = await api.get(`/api/Payment/${id}`);
        return response.data;
    },

    getBookingPayments: async (bookingId: number): Promise<Payment[]> => {
        const response = await api.get(`/api/Payment/booking/${bookingId}`);
        return response.data;
    },

    getPaymentsByStatus: async (status: string): Promise<Payment[]> => {
        const response = await api.get(`/api/Payment/status/${status}`);
        return response.data;
    },

    createPayment: async (payment: Omit<Payment, 'id' | 'createdAt' | 'lastUpdated'>): Promise<Payment> => {
        const response = await api.post('/api/Payment', payment);
        return response.data;
    },

    updatePayment: async (id: number, payment: Partial<Payment>): Promise<void> => {
        await api.put(`/api/Payment/${id}`, payment);
    },

    deletePayment: async (id: number): Promise<void> => {
        await api.delete(`/api/Payment/${id}`);
    },

    refundPayment: async (id: number, reason: string): Promise<Payment> => {
        const response = await api.post(`/api/Payment/${id}/refund`, { reason });
        return response.data;
    }
}; 