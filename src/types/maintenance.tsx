import { Room } from './room';
import { Employee } from './employee';

export interface Maintenance {
    id: number;
    roomId: number;
    employeeId: number;
    title: string;
    description: string;
    status: string;
    priority: string;
    category: string;
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

export type MaintenanceStatus = 'Pending' | 'InProgress' | 'Completed' | 'Cancelled';
export type MaintenancePriority = 'Low' | 'Medium' | 'High' | 'Emergency';
export type MaintenanceCategory = 'Plumbing' | 'Electrical' | 'HVAC' | 'General' | 'Structural' | 'Appliance' | 'Other'; 