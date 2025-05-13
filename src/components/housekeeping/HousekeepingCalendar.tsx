
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { HousekeepingTask, HousekeepingStatus, CleaningType } from '@/types/housekeeping';

interface HousekeepingCalendarProps {
  tasks: HousekeepingTask[];
}

export function HousekeepingCalendar({ tasks }: HousekeepingCalendarProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [view, setView] = useState<'day' | 'week'>('day');
  const [filterStatus, setFilterStatus] = useState<HousekeepingStatus | 'All'>('All');
  const [filterType, setFilterType] = useState<CleaningType | 'All'>('All');

  const filteredTasks = tasks.filter(task => {
    const taskDate = new Date(task.scheduledDate);
    const isDateMatch = date ? 
      taskDate.getFullYear() === date.getFullYear() && 
      taskDate.getMonth() === date.getMonth() && 
      taskDate.getDate() === date.getDate() 
      : true;

    const isStatusMatch = filterStatus === 'All' || task.status === filterStatus;
    const isTypeMatch = filterType === 'All' || task.cleaningType === filterType;

    return isDateMatch && isStatusMatch && isTypeMatch;
  });

  const getStatusColor = (status: HousekeepingStatus) => {
    switch (status) {
      case 'Pending': return 'bg-amber-100 text-amber-800';
      case 'InProgress': return 'bg-blue-100 text-blue-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Verified': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCleaningTypeColor = (type: CleaningType) => {
    switch (type) {
      case 'Standard': return 'bg-gray-100 text-gray-800';
      case 'Deep': return 'bg-indigo-100 text-indigo-800';
      case 'Turndown': return 'bg-pink-100 text-pink-800';
      case 'Checkout': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle>Housekeeping Schedule</CardTitle>
          <div className="flex gap-2">
            <Button 
              variant={view === 'day' ? 'default' : 'outline'} 
              onClick={() => setView('day')}
              size="sm"
            >
              Day
            </Button>
            <Button 
              variant={view === 'week' ? 'default' : 'outline'} 
              onClick={() => setView('week')}
              size="sm"
            >
              Week
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-1">
            <div className="mb-4">
              <label className="text-sm font-medium mb-1 block">Date</label>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="border p-3 rounded-md w-full"
              />
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Status</label>
                <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Statuses</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="InProgress">In Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Verified">Verified</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Type</label>
                <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Types</SelectItem>
                    <SelectItem value="Standard">Standard</SelectItem>
                    <SelectItem value="Deep">Deep</SelectItem>
                    <SelectItem value="Turndown">Turndown</SelectItem>
                    <SelectItem value="Checkout">Checkout</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <div className="col-span-1 md:col-span-2">
            <div className="border rounded-md p-4">
              <h3 className="font-medium text-lg mb-4">
                {date ? format(date, 'EEEE, MMMM d, yyyy') : 'All Tasks'}
              </h3>
              
              {filteredTasks.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No housekeeping tasks scheduled for this date with the selected filters.
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredTasks.map((task) => (
                    <div key={task.id} className="border rounded-md p-3 hover:bg-muted/50">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium">
                            Room {task.room?.roomNumber || task.roomId}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            Scheduled: {format(new Date(task.scheduledDate), 'h:mm a')}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Badge className={getStatusColor(task.status)}>
                            {task.status}
                          </Badge>
                          <Badge className={getCleaningTypeColor(task.cleaningType)}>
                            {task.cleaningType}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="text-sm">
                        <p>
                          <span className="font-medium">Assigned to:</span>{" "}
                          {task.assignedTo ? `${task.assignedTo}` : "Unassigned"}
                        </p>
                        {task.notes && (
                          <p className="mt-1">
                            <span className="font-medium">Notes:</span> {task.notes}
                          </p>
                        )}
                      </div>
                      
                      <div className="flex justify-end mt-3 gap-2">
                        <Button variant="outline" size="sm">View Details</Button>
                        <Button size="sm">Update Status</Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
