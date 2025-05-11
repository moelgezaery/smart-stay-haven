
import { Room } from './room';
import { User } from './user';

export type MaintenancePriority = 'Low' | 'Medium' | 'High' | 'Emergency';
export type MaintenanceStatus = 'Pending' | 'InProgress' | 'Completed' | 'Cancelled';

export interface MaintenanceRequest {
    id: number;
    roomId: number;
    room: Room;
    title: string;
    description: string;
    priority: MaintenancePriority;
    status: MaintenanceStatus;
    assignedToId?: number;
    assignedTo?: User;
    createdAt: string;
    lastUpdated?: string;
    completedAt?: string;
    resolutionNotes?: string;
    estimatedCost?: number;
    actualCost?: number;
}

export interface MaintenanceRequestCreate {
    roomId: number;
    title: string;
    description: string;
    priority: MaintenancePriority;
    assignedToId?: number;
    estimatedCost?: number;
}

export type MaintenanceRequestUpdate = Partial<Omit<MaintenanceRequestCreate, 'roomId'>> & {
    status?: MaintenanceStatus;
    resolutionNotes?: string;
    actualCost?: number;
}; 
