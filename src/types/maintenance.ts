import { Room } from './room';
import { Employee } from './employee';

export type MaintenanceStatus = 'Pending' | 'InProgress' | 'Completed' | 'Cancelled';
export type MaintenancePriority = 'Low' | 'Medium' | 'High' | 'Emergency';
export type MaintenanceCategory = 'Plumbing' | 'Electrical' | 'HVAC' | 'General' | 'Structural' | 'Furniture' | 'Appliance' | 'Other';

export interface Maintenance {
    id: number;
    roomId: number;
    employeeId: number;
    title: string;
    description: string;
    status: MaintenanceStatus;
    priority: MaintenancePriority;
    category: MaintenanceCategory;
    scheduledDate?: string;
    completedDate?: string;
    resolution?: string;
    cost?: number;
    isUrgent: boolean;
    createdAt: string;
    lastUpdated?: string;
    room?: Room;
    employee?: Employee;
}

export interface MaintenanceCreate {
    roomId: number;
    employeeId: number;
    title: string;
    description: string;
    priority: MaintenancePriority;
    category: MaintenanceCategory;
    scheduledDate?: string;
    isUrgent: boolean;
}

export type MaintenanceUpdate = Partial<MaintenanceCreate> & {
    status?: MaintenanceStatus;
    completedDate?: string;
    resolution?: string;
    cost?: number;
}; 