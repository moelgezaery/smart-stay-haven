import { api } from './api';
import { Payment, PaymentCreate, PaymentUpdate, PaymentStatus, PaymentMethod } from '../types/payment';

export const paymentService = {
    async getPayments(): Promise<Payment[]> {
        const response = await api.get<Payment[]>('/api/payment');
        return response.data;
    },

    async getPayment(id: number): Promise<Payment> {
        const response = await api.get<Payment>(`/api/payment/${id}`);
        return response.data;
    },

    async createPayment(payment: PaymentCreate): Promise<Payment> {
        const response = await api.post<Payment>('/api/payment', payment);
        return response.data;
    },

    async updatePayment(id: number, payment: PaymentUpdate): Promise<void> {
        await api.put(`/api/payment/${id}`, payment);
    },

    async deletePayment(id: number): Promise<void> {
        await api.delete(`/api/payment/${id}`);
    },

    async getPaymentsByStatus(status: PaymentStatus): Promise<Payment[]> {
        const response = await api.get<Payment[]>(`/api/payment/status/${status}`);
        return response.data;
    },

    async getPaymentsByMethod(method: PaymentMethod): Promise<Payment[]> {
        const response = await api.get<Payment[]>(`/api/payment/method/${method}`);
        return response.data;
    },

    async getPaymentsByBooking(bookingId: number): Promise<Payment[]> {
        const response = await api.get<Payment[]>(`/api/payment/booking/${bookingId}`);
        return response.data;
    },

    async getPaymentsByDateRange(startDate: string, endDate: string): Promise<Payment[]> {
        const response = await api.get<Payment[]>(`/api/payment/date-range?startDate=${startDate}&endDate=${endDate}`);
        return response.data;
    },

    async processRefund(id: number, amount: number): Promise<Payment> {
        const response = await api.post<Payment>(`/api/payment/${id}/refund`, { amount });
        return response.data;
    }
}; 