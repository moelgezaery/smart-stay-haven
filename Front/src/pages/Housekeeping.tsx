import { Layout } from "@/components/layout/Layout";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { 
  Plus, 
  Search, 
  Calendar, 
  Filter, 
  FileText, 
  Check,
  Clock,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

// Mock room data for housekeeping
const rooms = [
  { 
    id: 1,
    room: "101", 
    floor: "1",
    type: "Standard Single", 
    status: "vacant" as const, 
    cleaning: "Required",
    priority: "Normal",
    assignedTo: "",
    notes: "",
    taskType: "Cleaning",
    scheduledTime: "09:00 - 10:00",
  },
  { 
    id: 2,
    room: "102", 
    floor: "1",
    type: "Standard Double", 
    status: "occupied" as const, 
    cleaning: "Scheduled",
    priority: "Normal",
    assignedTo: "Maria Garcia",
    notes: "Guest requested extra towels",
    taskType: "Linen Change",
    scheduledTime: "10:00 - 10:30",
  },
  { 
    id: 3,
    room: "103", 
    floor: "1",
    type: "Standard Double", 
    status: "reserved" as const, 
    cleaning: "Required",
    priority: "High",
    assignedTo: "",
    notes: "Guest arriving today, VIP",
    taskType: "Deep Clean",
    scheduledTime: "11:00 - 12:30",
  },
  { 
    id: 4,
    room: "104", 
    floor: "1",
    type: "Standard Twin", 
    status: "cleaning" as const, 
    cleaning: "In Progress",
    priority: "Normal",
    assignedTo: "Carlos Rodriguez",
    notes: "",
    taskType: "Cleaning",
    scheduledTime: "09:30 - 10:30",
  },
  { 
    id: 5,
    room: "105", 
    floor: "1",
    type: "Deluxe Double", 
    status: "maintenance" as const, 
    cleaning: "Pending Maintenance",
    priority: "Normal",
    assignedTo: "",
    notes: "Bathtub repair needed",
    taskType: "Maintenance Check",
    scheduledTime: "14:00 - 15:00",
  },
  { 
    id: 6,
    room: "106", 
    floor: "1",
    type: "Junior Suite", 
    status: "checkout" as const, 
    cleaning: "Required",
    priority: "High",
    assignedTo: "",
    notes: "Deep cleaning required",
    taskType: "Deep Clean",
    scheduledTime: "10:30 - 12:00",
  },
  { 
    id: 7,
    room: "201", 
    floor: "2",
    type: "Standard Single", 
    status: "vacant" as const, 
    cleaning: "Completed",
    priority: "Normal",
    assignedTo: "Maria Garcia",
    notes: "",
    taskType: "Cleaning",
    scheduledTime: "08:00 - 08:45",
  },
  { 
    id: 8,
    room: "202", 
    floor: "2",
    type: "Standard Double", 
    status: "occupied" as const, 
    cleaning: "Scheduled",
    priority: "Normal",
    assignedTo: "John Smith",
    notes: "",
    taskType: "Refill Amenities",
    scheduledTime: "13:00 - 13:30",
  },
];

// Mock staff data
const staff = [
  { id: 1, name: "Maria Garcia", role: "Housekeeping" },
  { id: 2, name: "John Smith", role: "Housekeeping" },
  { id: 3, name: "Carlos Rodriguez", role: "Housekeeping" },
  { id: 4, name: "Aisha Johnson", role: "Housekeeping Supervisor" },
];

// Chart data
const statusData = [
  { name: "Required", value: 3, color: "#f97316" },
  { name: "Scheduled", value: 2, color: "#eab308" },
  { name: "In Progress", value: 1, color: "#3b82f6" },
  { name: "Completed", value: 1, color: "#22c55e" },
  { name: "Pending Maintenance", value: 1, color: "#ef4444" },
];

// Task types for dropdown
const taskTypes = [
  "Cleaning",
  "Deep Clean",
  "Linen Change",
  "Turndown Service",
  "Refill Amenities",
  "Maintenance Check",
];

export default function Housekeeping() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const { toast } = useToast();
  
  // Filter rooms based on search term and filters
  const filteredRooms = rooms.filter(room => 
    (searchTerm === "" || 
      room.room.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.assignedTo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.notes.toLowerCase().includes(searchTerm.toLowerCase())
    ) &&
    (filterStatus.length === 0 || filterStatus.includes(room.cleaning))
  );

  const handleNewTask = () => {
    setSelectedTask(null);
    setShowNewTaskModal(true);
  };

  const handleEditTask = (task: any) => {
    setSelectedTask(task);
    setShowNewTaskModal(true);
  };

  const handleCloseModal = () => {
    setShowNewTaskModal(false);
    setSelectedTask(null);
  };

  const handleSaveTask = () => {
    toast({
      title: selectedTask ? "Task Updated" : "Task Created",
      description: selectedTask 
        ? `Task for Room ${selectedTask.room} has been updated.` 
        : "New housekeeping task has been created.",
    });
    setShowNewTaskModal(false);
  };

  const handleCompleteTask = (taskId: number) => {
    toast({
      title: "Task Completed",
      description: `Task for Room ${rooms.find(r => r.id === taskId)?.room} has been marked as completed.`,
    });
  };

  const handleExportTasks = () => {
    toast({
      title: "Export Started",
      description: "Housekeeping task list is being exported.",
    });
  };

  // Count of rooms by cleaning status for dashboard metrics
  const requiredCount = rooms.filter(r => r.cleaning === "Required").length;
  const inProgressCount = rooms.filter(r => r.cleaning === "In Progress").length;
  const completedCount = rooms.filter(r => r.cleaning === "Completed").length;
  const totalRooms = rooms.length;
  
  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Assign Housekeeping Tasks</h1>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleExportTasks}>
            <FileText className="h-4 w-4 mr-2" />
            Export Task List
          </Button>
          <Button onClick={handleNewTask}>
            <Plus className="h-4 w-4 mr-2" />
            New Task
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Rooms</p>
            <p className="text-2xl font-semibold">{totalRooms}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Cleaning Required</p>
            <p className="text-2xl font-semibold text-orange-600">{requiredCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">In Progress</p>
            <p className="text-2xl font-semibold text-blue-600">{inProgressCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Completed Today</p>
            <p className="text-2xl font-semibold text-green-600">{completedCount}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Task Assignment Overview</CardTitle>
            <CardDescription>Daily housekeeping tasks assignment status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-4">
              <div className="flex space-x-4">
                <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && setViewMode(value as "list" | "calendar")}>
                  <ToggleGroupItem value="list" aria-label="List View">
                    List
                  </ToggleGroupItem>
                  <ToggleGroupItem value="calendar" aria-label="Calendar View">
                    <Calendar className="h-4 w-4 mr-2" />
                    Calendar
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
              <div className="flex space-x-2">
                <Select>
                  <SelectTrigger className="w-[180px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by room" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Rooms</SelectLabel>
                      {rooms.map((room) => (
                        <SelectItem key={room.id} value={room.room}>
                          Room {room.room}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="w-[180px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by staff" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Staff</SelectLabel>
                      {staff.map((s) => (
                        <SelectItem key={s.id} value={s.name}>
                          {s.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="bg-muted/20 p-4 rounded-lg text-center text-muted-foreground">
              {viewMode === "calendar" ? (
                <div className="h-64 flex items-center justify-center">
                  <p>Calendar view coming soon. This will display a day/week view of all scheduled tasks.</p>
                </div>
              ) : null}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Cleaning Status</CardTitle>
            <CardDescription>Room cleaning status overview</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="mb-4 flex flex-col md:flex-row justify-between gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search rooms..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <ToggleGroup type="multiple" value={filterStatus} onValueChange={setFilterStatus}>
            <ToggleGroupItem value="Required" className="data-[state=on]:bg-orange-100 data-[state=on]:text-orange-900">
              Required
            </ToggleGroupItem>
            <ToggleGroupItem value="Scheduled" className="data-[state=on]:bg-yellow-100 data-[state=on]:text-yellow-900">
              Scheduled
            </ToggleGroupItem>
            <ToggleGroupItem value="In Progress" className="data-[state=on]:bg-blue-100 data-[state=on]:text-blue-900">
              In Progress
            </ToggleGroupItem>
            <ToggleGroupItem value="Completed" className="data-[state=on]:bg-green-100 data-[state=on]:text-green-900">
              Completed
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>
      
      {viewMode === "list" && (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <Checkbox />
                  </TableHead>
                  <TableHead>Room</TableHead>
                  <TableHead>Task Type</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Schedule Time</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRooms.map((room) => (
                  <TableRow key={room.id}>
                    <TableCell>
                      <Checkbox checked={room.cleaning === "Completed"} />
                    </TableCell>
                    <TableCell className="font-medium">{room.room}</TableCell>
                    <TableCell>{room.taskType}</TableCell>
                    <TableCell>{room.assignedTo || "-"}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        room.cleaning === "Required" ? "bg-orange-100 text-orange-800" : 
                        room.cleaning === "Scheduled" ? "bg-yellow-100 text-yellow-800" : 
                        room.cleaning === "In Progress" ? "bg-blue-100 text-blue-800" :
                        room.cleaning === "Completed" ? "bg-green-100 text-green-800" :
                        "bg-red-100 text-red-800"
                      }`}>
                        {room.cleaning}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                        {room.scheduledTime}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        room.priority === "High" ? "bg-red-100 text-red-800" : "bg-gray-100 text-gray-800"
                      }`}>
                        {room.priority}
                      </span>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">{room.notes || "-"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleCompleteTask(room.id)}
                          className="text-green-600"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleEditTask(room)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-edit">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Task Add/Edit Modal */}
      {showNewTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Card className="w-full max-w-lg">
            <CardHeader>
              <CardTitle>{selectedTask ? 'Edit Housekeeping Task' : 'New Housekeeping Task'}</CardTitle>
              <CardDescription>
                {selectedTask 
                  ? `Update housekeeping task for Room ${selectedTask.room}` 
                  : 'Create a new housekeeping task'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="room" className="text-sm font-medium">Room Number</label>
                  <Select defaultValue={selectedTask?.room || ""}>
                    <SelectTrigger id="room">
                      <SelectValue placeholder="Select room" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Rooms</SelectLabel>
                        {rooms.map((room) => (
                          <SelectItem key={room.id} value={room.room}>
                            Room {room.room}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="taskType" className="text-sm font-medium">Task Type</label>
                  <Select defaultValue={selectedTask?.taskType || ""}>
                    <SelectTrigger id="taskType">
                      <SelectValue placeholder="Select task type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Task Types</SelectLabel>
                        {taskTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="assignedTo" className="text-sm font-medium">Assigned To</label>
                  <Select defaultValue={selectedTask?.assignedTo || ""}>
                    <SelectTrigger id="assignedTo">
                      <SelectValue placeholder="Select staff member" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Staff Members</SelectLabel>
                        {staff.map((staffMember) => (
                          <SelectItem key={staffMember.id} value={staffMember.name}>
                            {staffMember.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="priority" className="text-sm font-medium">Priority</label>
                  <Select defaultValue={selectedTask?.priority || "Normal"}>
                    <SelectTrigger id="priority">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Priority Levels</SelectLabel>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Normal">Normal</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="date" className="text-sm font-medium">Date</label>
                  <Input id="date" type="date" defaultValue={new Date().toISOString().split('T')[0]} />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="time" className="text-sm font-medium">Start Time</label>
                  <Input id="time" type="time" defaultValue="09:00" />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="duration" className="text-sm font-medium">Expected Duration (minutes)</label>
                <Input id="duration" type="number" placeholder="60" defaultValue={selectedTask ? "60" : ""} />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="status" className="text-sm font-medium">Status</label>
                <Select defaultValue={selectedTask?.cleaning || "Pending"}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Task Status</SelectLabel>
                      <SelectItem value="Required">Required</SelectItem>
                      <SelectItem value="Scheduled">Scheduled</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="notes" className="text-sm font-medium">Notes / Instructions</label>
                <Textarea 
                  id="notes" 
                  placeholder="Special instructions or notes about the task"
                  defaultValue={selectedTask?.notes || ""}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-6">
              <Button variant="outline" onClick={handleCloseModal}>Cancel</Button>
              <Button onClick={handleSaveTask}>{selectedTask ? 'Update' : 'Create'} Task</Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </Layout>
  );
}
