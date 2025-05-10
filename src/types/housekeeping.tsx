import { Room } from './room';
import { Employee } from './employee';

export interface Housekeeping {
    id: number;
    roomId: number;
    employeeId: number;
    status: string;
    scheduledDate: string;
    completedDate?: string;
    notes?: string;
    cleaningType?: string;
    isUrgent: boolean;
    priority?: string;
    createdAt: string;
    lastUpdated?: string;
    room?: Room;
    employee?: Employee;
}

export type CleaningType = 'Regular' | 'Deep' | 'Turnover';
export type Priority = 'Low' | 'Medium' | 'High';
export type HousekeepingStatus = 'Pending' | 'InProgress' | 'Completed' | 'Skipped'; 