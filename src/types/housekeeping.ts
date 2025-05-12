
export interface HousekeepingTask {
  id: number;
  roomId: number;
  assignedToId?: number;
  status: string;
  cleaningType: string;
  notes?: string;
  scheduledDate: string;
  completedAt?: string;
  createdAt: string;
  verifiedById?: number;
  verificationNotes?: string;
  room?: any;
}

export interface HousekeepingTaskCreate {
  roomId: number;
  assignedToId?: number;
  status?: string;
  cleaningType: string;
  notes?: string;
  scheduledDate: string;
  completedAt?: string;
  verifiedById?: number;
  verificationNotes?: string;
}

export interface HousekeepingTaskUpdate {
  roomId?: number;
  assignedToId?: number;
  status?: string;
  cleaningType?: string;
  notes?: string;
  scheduledDate?: string;
  completedAt?: string;
  verifiedById?: number;
  verificationNotes?: string;
}
