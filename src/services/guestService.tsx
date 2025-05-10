import { Guest } from '../types/guest';
import { api } from './api';

export const guestService = {
    getAllGuests: async (): Promise<Guest[]> => {
        const response = await api.get('/api/Guest');
        return response.data;
    },

    getGuestById: async (id: number): Promise<Guest> => {
        const response = await api.get(`/api/Guest/${id}`);
        return response.data;
    },

    createGuest: async (guest: Omit<Guest, 'id' | 'createdAt' | 'lastUpdated'>): Promise<Guest> => {
        const response = await api.post('/api/Guest', guest);
        return response.data;
    },

    updateGuest: async (id: number, guest: Partial<Guest>): Promise<void> => {
        await api.put(`/api/Guest/${id}`, guest);
    },

    deleteGuest: async (id: number): Promise<void> => {
        await api.delete(`/api/Guest/${id}`);
    }
}; 