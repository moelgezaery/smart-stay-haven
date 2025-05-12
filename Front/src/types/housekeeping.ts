
export type HousekeepingStatus = 'Pending' | 'InProgress' | 'Completed' | 'Verified';
export type CleaningType = 'Standard' | 'Deep' | 'Turndown' | 'Checkout';

export interface HousekeepingTask {
  id: number;
  roomId: number;
  room?: unknown;
  assignedToId?: number;
  assignedTo?: unknown;
  status: HousekeepingStatus;
  cleaningType: CleaningType;
  notes?: string;
  scheduledDate: string;
  completedAt?: string;
  createdAt: string;
  verifiedById?: number;
  verifiedBy?: unknown;
  verificationNotes?: string;
}

export interface HousekeepingTaskCreate {
  roomId: number;
  assignedToId?: number;
  status?: HousekeepingStatus;
  cleaningType: CleaningType;
  notes?: string;
  scheduledDate: string;
}

export interface HousekeepingTaskUpdate {
  assignedToId?: number;
  status?: HousekeepingStatus;
  notes?: string;
  completedAt?: string;
  verifiedById?: number;
  verificationNotes?: string;
}
