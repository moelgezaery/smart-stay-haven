
import { Layout } from "@/components/layout/Layout";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Search, Plus, ClipboardPen, Wrench } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Sample data for maintenance staff
const maintenanceStaff = [
  { id: "1", name: "Robert Johnson", position: "Chief Engineer", phone: "555-1234" },
  { id: "2", name: "Maria Garcia", position: "Maintenance Technician", phone: "555-2345" },
  { id: "3", name: "David Kim", position: "HVAC Specialist", phone: "555-3456" },
  { id: "4", name: "Sarah Patel", position: "Electrician", phone: "555-4567" },
  { id: "5", name: "James Wilson", position: "Plumber", phone: "555-5678" },
];

// Sample data for maintenance requests
const maintenanceRequests = [
  {
    id: "M001",
    room: "102",
    reportedBy: "Guest - Alex Johnson",
    description: "AC not cooling properly",
    priority: "High",
    status: "Open",
    dateReported: "May 3, 2025",
    assignedTo: "2",
    notes: "Guest complained room temperature is above 78°F despite AC set to 65°F"
  },
  {
    id: "M002",
    room: "204",
    reportedBy: "Housekeeping",
    description: "Leaking shower head",
    priority: "Medium",
    status: "In Progress",
    dateReported: "May 3, 2025",
    assignedTo: "5",
    notes: "Water leaking onto bathroom floor causing slippery conditions"
  },
  {
    id: "M003",
    room: "301",
    reportedBy: "Front Desk",
    description: "TV not turning on",
    priority: "Low",
    status: "Open",
    dateReported: "May 4, 2025",
    assignedTo: null,
    notes: "Guest reported TV unresponsive to remote and manual power button"
  },
  {
    id: "M004",
    room: "Lobby",
    reportedBy: "Manager",
    description: "Light fixtures flickering",
    priority: "Medium",
    status: "In Progress",
    dateReported: "May 2, 2025",
    assignedTo: "4",
    notes: "Multiple guests have mentioned the issue"
  },
  {
    id: "M005",
    room: "Restaurant",
    reportedBy: "Restaurant Manager",
    description: "Refrigerator not maintaining temperature",
    priority: "High",
    status: "Completed",
    dateReported: "May 1, 2025",
    assignedTo: "3",
    notes: "Thermostat replaced and unit is now functioning properly"
  },
];

export default function Maintenance() {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  
  // Filter maintenance requests based on search
  const filteredRequests = maintenanceRequests.filter(request =>
    request.room.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.reportedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.priority.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.status.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleCreateRequest = () => {
    toast({
      title: "Maintenance Request Created",
      description: "New maintenance request has been created successfully.",
    });
  };

  const handleAssignStaff = (requestId: string, staffId: string) => {
    toast({
      title: "Staff Assigned",
      description: "Maintenance staff has been assigned to the request.",
    });
  };
  
  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Maintenance</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <ClipboardPen className="mr-2 h-4 w-4" />
              New Maintenance Request
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create Maintenance Request</DialogTitle>
              <DialogDescription>
                Enter details for the new maintenance request
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="room" className="text-right text-sm font-medium">
                  Room/Location
                </label>
                <Input id="room" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="reportedBy" className="text-right text-sm font-medium">
                  Reported By
                </label>
                <Input id="reportedBy" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="priority" className="text-right text-sm font-medium">
                  Priority
                </label>
                <Select>
                  <SelectTrigger id="priority" className="col-span-3">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="description" className="text-right text-sm font-medium">
                  Description
                </label>
                <Textarea id="description" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="notes" className="text-right text-sm font-medium">
                  Notes
                </label>
                <Textarea id="notes" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="assignedTo" className="text-right text-sm font-medium">
                  Assign to
                </label>
                <Select>
                  <SelectTrigger id="assignedTo" className="col-span-3">
                    <SelectValue placeholder="Assign maintenance staff" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unassigned">Unassigned</SelectItem>
                    {maintenanceStaff.map(staff => (
                      <SelectItem key={staff.id} value={staff.id}>{staff.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreateRequest}>Create Request</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Maintenance Requests</CardTitle>
          <CardDescription>View and manage maintenance tasks</CardDescription>
          <div className="flex items-center gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search requests..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Select>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-priorities">All Priorities</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>
            
            <Select>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-statuses">All Statuses</SelectItem>
                <SelectItem value="Open">Open</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Room</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Reported By</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.map((request) => {
                  const assignedStaff = maintenanceStaff.find(staff => staff.id === request.assignedTo);
                  
                  return (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">{request.id}</TableCell>
                      <TableCell>{request.room}</TableCell>
                      <TableCell>{request.description}</TableCell>
                      <TableCell>{request.reportedBy}</TableCell>
                      <TableCell>{request.dateReported}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            request.priority === "High" 
                              ? "bg-red-100 text-red-800" 
                              : request.priority === "Medium"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-green-100 text-green-800"
                          }`}
                        >
                          {request.priority}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            request.status === "Open" 
                              ? "bg-blue-100 text-blue-800" 
                              : request.status === "In Progress"
                                ? "bg-purple-100 text-purple-800"
                                : "bg-green-100 text-green-800"
                          }`}
                        >
                          {request.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2 justify-end">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="outline">
                                <Wrench className="h-4 w-4 mr-2" />
                                Details
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Maintenance Request Details</DialogTitle>
                                <DialogDescription>
                                  Request ID: {request.id}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <label className="text-right text-sm font-medium">
                                    Room/Location
                                  </label>
                                  <div className="col-span-3">{request.room}</div>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <label className="text-right text-sm font-medium">
                                    Reported By
                                  </label>
                                  <div className="col-span-3">{request.reportedBy}</div>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <label className="text-right text-sm font-medium">
                                    Description
                                  </label>
                                  <div className="col-span-3">{request.description}</div>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <label className="text-right text-sm font-medium">
                                    Notes
                                  </label>
                                  <div className="col-span-3">{request.notes}</div>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <label className="text-right text-sm font-medium">
                                    Assigned To
                                  </label>
                                  <Select defaultValue={request.assignedTo || "unassigned"}>
                                    <SelectTrigger className="col-span-3">
                                      <SelectValue placeholder="Assign maintenance staff" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="unassigned">Unassigned</SelectItem>
                                      {maintenanceStaff.map(staff => (
                                        <SelectItem key={staff.id} value={staff.id}>{staff.name}</SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <label className="text-right text-sm font-medium">
                                    Status
                                  </label>
                                  <Select defaultValue={request.status}>
                                    <SelectTrigger className="col-span-3">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="Open">Open</SelectItem>
                                      <SelectItem value="In Progress">In Progress</SelectItem>
                                      <SelectItem value="Completed">Completed</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                              <DialogFooter>
                                <Button 
                                  onClick={() => {
                                    toast({
                                      title: "Request Updated",
                                      description: "Maintenance request has been updated."
                                    });
                                  }}
                                >
                                  Update Request
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Maintenance Staff</CardTitle>
            <CardDescription>Staff available for maintenance tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {maintenanceStaff.map((staff) => (
                    <TableRow key={staff.id}>
                      <TableCell className="font-medium">{staff.name}</TableCell>
                      <TableCell>{staff.position}</TableCell>
                      <TableCell>{staff.phone}</TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="outline">View Schedule</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
