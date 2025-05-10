import { api } from './api';
import { Booking, BookingCreate, BookingUpdate, BookingStatus } from '../types/booking';

export const bookingService = {
    async getBookings(): Promise<Booking[]> {
        const response = await api.get<Booking[]>('/api/booking');
        return response.data;
    },

    async getBooking(id: number): Promise<Booking> {
        const response = await api.get<Booking>(`/api/booking/${id}`);
        return response.data;
    },

    async createBooking(booking: BookingCreate): Promise<Booking> {
        const response = await api.post<Booking>('/api/booking', booking);
        return response.data;
    },

    async updateBooking(id: number, booking: BookingUpdate): Promise<void> {
        await api.put(`/api/booking/${id}`, booking);
    },

    async deleteBooking(id: number): Promise<void> {
        await api.delete(`/api/booking/${id}`);
    },

    async getBookingsByStatus(status: BookingStatus): Promise<Booking[]> {
        const response = await api.get<Booking[]>(`/api/booking/status/${status}`);
        return response.data;
    },

    async getBookingsByGuest(guestId: number): Promise<Booking[]> {
        const response = await api.get<Booking[]>(`/api/booking/guest/${guestId}`);
        return response.data;
    },

    async getBookingsByRoom(roomId: number): Promise<Booking[]> {
        const response = await api.get<Booking[]>(`/api/booking/room/${roomId}`);
        return response.data;
    },

    async getBookingsByDateRange(startDate: string, endDate: string): Promise<Booking[]> {
        const response = await api.get<Booking[]>(`/api/booking/date-range?startDate=${startDate}&endDate=${endDate}`);
        return response.data;
    }
}; 