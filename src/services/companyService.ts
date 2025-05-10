import { api } from './api';
import { Company, CompanyCreate, CompanyUpdate } from '../types/company';

export const companyService = {
    async getCompanies(): Promise<Company[]> {
        const response = await api.get<Company[]>('/api/company');
        return response.data;
    },

    async getCompany(id: number): Promise<Company> {
        const response = await api.get<Company>(`/api/company/${id}`);
        return response.data;
    },

    async createCompany(company: CompanyCreate): Promise<Company> {
        const response = await api.post<Company>('/api/company', company);
        return response.data;
    },

    async updateCompany(id: number, company: CompanyUpdate): Promise<void> {
        await api.put(`/api/company/${id}`, company);
    },

    async deleteCompany(id: number): Promise<void> {
        await api.delete(`/api/company/${id}`);
    },

    async getActiveCompanies(): Promise<Company[]> {
        const response = await api.get<Company[]>('/api/company/active');
        return response.data;
    },

    async searchCompanies(query: string): Promise<Company[]> {
        const response = await api.get<Company[]>(`/api/company/search?query=${encodeURIComponent(query)}`);
        return response.data;
    },

    async getCompanyBookings(id: number): Promise<Company> {
        const response = await api.get<Company>(`/api/company/${id}/bookings`);
        return response.data;
    },

    async getCompanyEmployees(id: number): Promise<Company> {
        const response = await api.get<Company>(`/api/company/${id}/employees`);
        return response.data;
    }
}; 