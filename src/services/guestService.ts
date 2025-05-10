import { api } from './api';
import { Guest, GuestCreate, GuestUpdate } from '../types/guest';

export const guestService = {
    async getGuests(): Promise<Guest[]> {
        const response = await api.get<Guest[]>('/api/guest');
        return response.data;
    },

    async getGuest(id: number): Promise<Guest> {
        const response = await api.get<Guest>(`/api/guest/${id}`);
        return response.data;
    },

    async createGuest(guest: GuestCreate): Promise<Guest> {
        const response = await api.post<Guest>('/api/guest', guest);
        return response.data;
    },

    async updateGuest(id: number, guest: GuestUpdate): Promise<void> {
        await api.put(`/api/guest/${id}`, guest);
    },

    async deleteGuest(id: number): Promise<void> {
        await api.delete(`/api/guest/${id}`);
    },

    async searchGuests(query: string): Promise<Guest[]> {
        const response = await api.get<Guest[]>(`/api/guest/search?query=${encodeURIComponent(query)}`);
        return response.data;
    },

    async getGuestBookings(id: number): Promise<Guest> {
        const response = await api.get<Guest>(`/api/guest/${id}/bookings`);
        return response.data;
    }
}; 