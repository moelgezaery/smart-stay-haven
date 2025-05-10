import { Booking } from '../types/booking';
import { api } from './api';

export const bookingService = {
    getAllBookings: async (): Promise<Booking[]> => {
        const response = await api.get('/api/Booking');
        return response.data;
    },

    getBookingById: async (id: number): Promise<Booking> => {
        const response = await api.get(`/api/Booking/${id}`);
        return response.data;
    },

    getGuestBookings: async (guestId: number): Promise<Booking[]> => {
        const response = await api.get(`/api/Booking/guest/${guestId}`);
        return response.data;
    },

    getBookingsByStatus: async (status: string): Promise<Booking[]> => {
        const response = await api.get(`/api/Booking/status/${status}`);
        return response.data;
    },

    createBooking: async (booking: Omit<Booking, 'id' | 'createdAt' | 'lastUpdated'>): Promise<Booking> => {
        const response = await api.post('/api/Booking', booking);
        return response.data;
    },

    updateBooking: async (id: number, booking: Partial<Booking>): Promise<void> => {
        await api.put(`/api/Booking/${id}`, booking);
    },

    deleteBooking: async (id: number): Promise<void> => {
        await api.delete(`/api/Booking/${id}`);
    }
}; 