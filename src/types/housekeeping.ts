import { Room } from './room';
import { Employee } from './employee';

export type HousekeepingStatus = 'Pending' | 'InProgress' | 'Completed' | 'Skipped';
export type CleaningType = 'Regular' | 'Deep' | 'Turnover';
export type Priority = 'Low' | 'Medium' | 'High';

export interface Housekeeping {
    id: number;
    roomId: number;
    employeeId: number;
    status: HousekeepingStatus;
    scheduledDate: string;
    completedDate?: string;
    notes?: string;
    cleaningType?: CleaningType;
    isUrgent: boolean;
    priority?: Priority;
    createdAt: string;
    lastUpdated?: string;
    room?: Room;
    employee?: Employee;
}

export interface HousekeepingCreate {
    roomId: number;
    employeeId: number;
    scheduledDate: string;
    notes?: string;
    cleaningType?: CleaningType;
    isUrgent: boolean;
    priority?: Priority;
}

export type HousekeepingUpdate = Partial<HousekeepingCreate> & {
    status?: HousekeepingStatus;
    completedDate?: string;
}; 