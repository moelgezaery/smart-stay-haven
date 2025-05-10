import { Report, ReportGenerationRequest, ReportFilter } from '../types/report';
import { api } from './api';

export const reportService = {
    async getReports(filter?: ReportFilter): Promise<Report[]> {
        const params = new URLSearchParams();
        if (filter?.type) params.append('type', filter.type);
        if (filter?.startDate) params.append('startDate', filter.startDate);
        if (filter?.endDate) params.append('endDate', filter.endDate);
        if (filter?.status) params.append('status', filter.status);

        const response = await api.get<Report[]>(`/api/Report${params.toString() ? `?${params.toString()}` : ''}`);
        return response.data;
    },

    async getReport(id: number): Promise<Report> {
        const response = await api.get<Report>(`/api/Report/${id}`);
        return response.data;
    },

    async generateReport(request: ReportGenerationRequest): Promise<Report> {
        const response = await api.post<Report>('/api/Report/generate', request);
        return response.data;
    },

    async deleteReport(id: number): Promise<void> {
        await api.delete(`/api/Report/${id}`);
    },

    async downloadReport(id: number): Promise<Blob> {
        const response = await api.get(`/api/Report/${id}/download`, {
            responseType: 'blob'
        });
        return response.data;
    }
}; 