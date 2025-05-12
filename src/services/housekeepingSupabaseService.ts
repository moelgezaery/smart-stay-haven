
import { supabase } from "@/integrations/supabase/client";
import { HousekeepingTask, HousekeepingTaskCreate, HousekeepingTaskUpdate } from "@/types/housekeeping";

// Convert from our app types to Supabase database types
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

// Convert from Supabase database types to our app types
const mapFromSupabase = (data: any): HousekeepingTask => {
  return {
    id: data.id,
    roomId: data.room_id,
    assignedToId: data.assigned_to_id,
    status: data.status,
    cleaningType: data.cleaning_type,
    notes: data.notes,
    scheduledDate: data.scheduled_date,
    completedAt: data.completed_at,
    createdAt: data.created_at,
    verifiedById: data.verified_by_id,
    verificationNotes: data.verification_notes,
    room: data.room ? {
      id: data.room.id,
      roomNumber: data.room.room_number,
      status: data.room.status,
      description: data.room.description,
      floor: data.room.floor,
      capacity: data.room.capacity,
      hasBalcony: data.room.has_balcony,
      hasOceanView: data.room.has_ocean_view,
      roomTypeId: data.room.room_type_id,
      createdAt: data.room.created_at,
      lastUpdated: data.room.last_updated
    } : undefined
  };
};

export const housekeepingSupabaseService = {
  async getTasks(): Promise<HousekeepingTask[]> {
    const { data, error } = await supabase
      .from('housekeeping_tasks')
      .select('*, room:rooms(*)');
    
    if (error) throw error;
    
    return data.map(mapFromSupabase);
  },

  async getTask(id: number): Promise<HousekeepingTask> {
    const { data, error } = await supabase
      .from('housekeeping_tasks')
      .select('*, room:rooms(*)')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    return mapFromSupabase(data);
  },

  async createTask(task: HousekeepingTaskCreate): Promise<HousekeepingTask> {
    const { data, error } = await supabase
      .from('housekeeping_tasks')
      .insert(mapToSupabase(task))
      .select('*, room:rooms(*)')
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
      .select('*, room:rooms(*)')
      .eq('room_id', roomId);
    
    if (error) throw error;
    
    return data.map(mapFromSupabase);
  },

  async getTasksByStatus(status: string): Promise<HousekeepingTask[]> {
    const { data, error } = await supabase
      .from('housekeeping_tasks')
      .select('*, room:rooms(*)')
      .eq('status', status);
    
    if (error) throw error;
    
    return data.map(mapFromSupabase);
  },

  async getTasksByDate(date: string): Promise<HousekeepingTask[]> {
    const startOfDay = new Date(date);
    startOfDay.setUTCHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setUTCHours(23, 59, 59, 999);
    
    const { data, error } = await supabase
      .from('housekeeping_tasks')
      .select('*, room:rooms(*)')
      .gte('scheduled_date', startOfDay.toISOString())
      .lte('scheduled_date', endOfDay.toISOString());
    
    if (error) throw error;
    
    return data.map(mapFromSupabase);
  },

  async getPendingTasks(): Promise<HousekeepingTask[]> {
    const { data, error } = await supabase
      .from('housekeeping_tasks')
      .select('*, room:rooms(*)')
      .eq('status', 'Pending');
    
    if (error) throw error;
    
    return data.map(mapFromSupabase);
  }
};
