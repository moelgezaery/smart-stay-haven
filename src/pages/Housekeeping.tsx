import { useState, useEffect } from 'react';
import { Layout } from "@/components/layout/Layout";
import { HousekeepingCalendar } from "@/components/housekeeping/HousekeepingCalendar";
import { housekeepingService } from "@/services/housekeepingService";
import { HousekeepingTask } from "@/types/housekeeping";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Housekeeping() {
  const [tasks, setTasks] = useState<HousekeepingTask[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const tasksData = await housekeepingService.getTasks();
      setTasks(tasksData);
    } catch (error) {
      console.error("Error fetching housekeeping tasks:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load housekeeping tasks. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAddTask = () => {
    toast({
      title: "Coming Soon",
      description: "Add task functionality will be available soon.",
    });
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Housekeeping</h1>
          <Button onClick={handleAddTask}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Task
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4">Loading housekeeping tasks...</p>
            </div>
          </div>
        ) : (
          <HousekeepingCalendar tasks={tasks} />
        )}
        
        {/* Keep any existing content below the calendar */}
      </div>
    </Layout>
  );
}
