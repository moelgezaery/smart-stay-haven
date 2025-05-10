import { api } from './api';
import { Currency, CurrencyCreate, CurrencyUpdate } from '../types/currency';

export const currencyService = {
    async getCurrencies(): Promise<Currency[]> {
        const response = await api.get<Currency[]>('/api/currency');
        return response.data;
    },

    async getCurrency(id: number): Promise<Currency> {
        const response = await api.get<Currency>(`/api/currency/${id}`);
        return response.data;
    },

    async createCurrency(currency: CurrencyCreate): Promise<Currency> {
        const response = await api.post<Currency>('/api/currency', currency);
        return response.data;
    },

    async updateCurrency(id: number, currency: CurrencyUpdate): Promise<void> {
        await api.put(`/api/currency/${id}`, currency);
    },

    async deleteCurrency(id: number): Promise<void> {
        await api.delete(`/api/currency/${id}`);
    },

    async getDefaultCurrency(): Promise<Currency> {
        const response = await api.get<Currency>('/api/currency/default');
        return response.data;
    }
}; 