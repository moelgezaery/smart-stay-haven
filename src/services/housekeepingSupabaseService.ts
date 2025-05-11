import { supabase } from "@/integrations/supabase/client";

// Define types for housekeeping service
export type HousekeepingStatus = 'Pending' | 'InProgress' | 'Completed' | 'Verified';
export type CleaningType = 'Standard' | 'Deep' | 'Turndown' | 'Checkout';

export interface HousekeepingTask {
  id: number;
  roomId: number;
  room?: any;
  assignedToId?: number;
  assignedTo?: any;
  status: HousekeepingStatus;
  cleaningType: CleaningType;
  notes?: string;
  scheduledDate: string;
  completedAt?: string;
  createdAt: string;
  verifiedById?: number;
  verifiedBy?: any;
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

const mapToSupabase = (task: HousekeepingTaskCreate | HousekeepingTaskUpdate) => {
  const mappedData: any = {};
  
  if ('roomId' in task) mappedData.room_id = task.roomId;
  if ('assignedToId' in task) mappedData.assigned_to_id = task.assignedToId;
  if ('status' in task) mappedData.status = task.status;
  if ('cleaningType' in task) mappedData.cleaning_type = task.cleaningType;
  if ('notes' in task) mappedData.notes = task.notes;
  if ('scheduledDate' in task) mappedData.scheduled_date = task.scheduledDate;
  if ('completedAt' in task) mappedData.completed_at = task.completedAt;
  if ('verifiedById' in task) mappedData.verified_by_id = task.verifiedById;
  if ('verificationNotes' in task) mappedData.verification_notes = task.verificationNotes;
  
  return mappedData;
};

const mapFromSupabase = (data: any): HousekeepingTask => {
  return {
    id: data.id,
    roomId: data.room_id,
    room: data.room,
    assignedToId: data.assigned_to_id,
    assignedTo: data.assigned_to,
    status: data.status as HousekeepingStatus,
    cleaningType: data.cleaning_type as CleaningType,
    notes: data.notes,
    scheduledDate: data.scheduled_date,
    completedAt: data.completed_at,
    createdAt: data.created_at,
    verifiedById: data.verified_by_id,
    verifiedBy: data.verified_by,
    verificationNotes: data.verification_notes
  };
};

export const housekeepingSupabaseService = {
  async getTasks(): Promise<HousekeepingTask[]> {
    const { data, error } = await supabase
      .from('housekeeping_tasks')
      .select('*, room:rooms(*), assigned_to:employees(*)');
      
    if (error) throw error;
    
    return data.map(mapFromSupabase);
  },

  async getTask(id: number): Promise<HousekeepingTask> {
    const { data, error } = await supabase
      .from('housekeeping_tasks')
      .select('*, room:rooms(*), assigned_to:employees(*)')
      .eq('id', id)
      .single();
      
    if (error) throw error;
    
    return mapFromSupabase(data);
  },

  async createTask(task: HousekeepingTaskCreate): Promise<HousekeepingTask> {
    const { data, error } = await supabase
      .from('housekeeping_tasks')
      .insert(mapToSupabase(task))
      .select('*, room:rooms(*), assigned_to:employees(*)')
      .single();
      
    if (error) throw error;
    
    return mapFromSupabase(data);
  },

  async updateTask(id: number, task: HousekeepingTaskUpdate): Promise<void> {
    const { error } = await supabase
      .from('housekeeping_tasks')
      .update(mapToSupabase(task))
      .eq('id', id);
      
    if (error) throw error;
  },

  async deleteTask(id: number): Promise<void> {
    const { error } = await supabase
      .from('housekeeping_tasks')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
  },

  async getTasksByRoom(roomId: number): Promise<HousekeepingTask[]> {
    const { data, error } = await supabase
      .from('housekeeping_tasks')
      .select('*, room:rooms(*), assigned_to:employees(*)')
      .eq('room_id', roomId);
      
    if (error) throw error;
    
    return data.map(mapFromSupabase);
  },

  async getTasksByStatus(status: HousekeepingStatus): Promise<HousekeepingTask[]> {
    const { data, error } = await supabase
      .from('housekeeping_tasks')
      .select('*, room:rooms(*), assigned_to:employees(*)')
      .eq('status', status);
      
    if (error) throw error;
    
    return data.map(mapFromSupabase);
  },

  async getTasksByEmployee(employeeId: number): Promise<HousekeepingTask[]> {
    const { data, error } = await supabase
      .from('housekeeping_tasks')
      .select('*, room:rooms(*), assigned_to:employees(*)')
      .eq('assigned_to_id', employeeId);
      
    if (error) throw error;
    
    return data.map(mapFromSupabase);
  },

  async getTasksForToday(): Promise<HousekeepingTask[]> {
    // Get today's date in ISO format (YYYY-MM-DD)
    const today = new Date().toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from('housekeeping_tasks')
      .select('*, room:rooms(*), assigned_to:employees(*)')
      .eq('scheduled_date', today);
      
    if (error) throw error;
    
    return data.map(mapFromSupabase);
  }
};
