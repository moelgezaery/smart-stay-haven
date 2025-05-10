export interface Report {
    id: number;
    title: string;
    type: string;
    startDate: string;
    endDate: string;
    format: string;
    parameters: string;
    generatedBy: string;
    filePath: string;
    status: string;
    errorMessage: string;
    createdAt: string;
    lastUpdated: string;
    generatedAt: string;
}

export interface ReportGenerationRequest {
    title: string;
    type: string;
    startDate: string;
    endDate: string;
    format: string;
    parameters?: Record<string, string | number | boolean | null>;
}

export type ReportType = 
    | 'occupancy'
    | 'revenue'
    | 'maintenance'
    | 'housekeeping'
    | 'guest'
    | 'inventory'
    | 'custom';

export type ReportFormat = 'PDF' | 'Excel' | 'CSV';

export interface ReportFilter {
    type?: ReportType;
    startDate?: string;
    endDate?: string;
    status?: string;
} 