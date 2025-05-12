
import { housekeepingSupabaseService } from "./housekeepingSupabaseService";
import { HousekeepingTask, HousekeepingTaskCreate, HousekeepingTaskUpdate } from "@/types/housekeeping";

export const housekeepingService = {
  getTasks: async (): Promise<HousekeepingTask[]> => {
    return housekeepingSupabaseService.getTasks();
  },

  getTask: async (id: number): Promise<HousekeepingTask> => {
    return housekeepingSupabaseService.getTask(id);
  },

  createTask: async (task: HousekeepingTaskCreate): Promise<HousekeepingTask> => {
    return housekeepingSupabaseService.createTask(task);
  },

  updateTask: async (id: number, task: HousekeepingTaskUpdate): Promise<void> => {
    return housekeepingSupabaseService.updateTask(id, task);
  },

  deleteTask: async (id: number): Promise<void> => {
    return housekeepingSupabaseService.deleteTask(id);
  },

  getTasksByRoom: async (roomId: number): Promise<HousekeepingTask[]> => {
    return housekeepingSupabaseService.getTasksByRoom(roomId);
  },

  getTasksByStatus: async (status: string): Promise<HousekeepingTask[]> => {
    return housekeepingSupabaseService.getTasksByStatus(status);
  },

  getTasksByDate: async (date: string): Promise<HousekeepingTask[]> => {
    return housekeepingSupabaseService.getTasksByDate(date);
  },

  getPendingTasks: async (): Promise<HousekeepingTask[]> => {
    return housekeepingSupabaseService.getPendingTasks();
  }
};
