
import { Layout } from "@/components/layout/Layout";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { format } from "date-fns";

// Mock data for guest requests
const mockGuestRequests = [
  {
    id: "REQ-001",
    guest: "John Smith",
    room: "101",
    type: "Housekeeping",
    status: "pending",
    description: "Extra towels needed",
    createdAt: new Date(),
    priority: "normal",
  },
  {
    id: "REQ-002",
    guest: "Sarah Johnson",
    room: "205",
    type: "Maintenance",
    status: "in-progress",
    description: "TV not working properly",
    createdAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    priority: "high",
  },
  {
    id: "REQ-003",
    guest: "Robert Chen",
    room: "310",
    type: "Room Service",
    status: "completed",
    description: "Breakfast order for tomorrow morning at 7:30 AM",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    priority: "normal",
  },
];

// Special request options
const specialRequestOptions = [
  { id: "1", label: "Late Checkout" },
  { id: "2", label: "Early Check-in" },
  { id: "3", label: "Airport Transfer" },
  { id: "4", label: "Wake-up Call" },
  { id: "5", label: "Room with a View" },
  { id: "6", label: "Quiet Room" },
  { id: "7", label: "Connecting Rooms" },
  { id: "8", label: "Crib/Baby Cot" },
  { id: "9", label: "Anniversary Decoration" },
  { id: "10", label: "Birthday Surprise" },
];

// In-room service options
const inRoomServiceOptions = [
  { value: "extra-towels", label: "Extra Towels" },
  { value: "breakfast-delivery", label: "Breakfast Delivery" },
  { value: "housekeeping", label: "Housekeeping" },
  { value: "minibar-restock", label: "Minibar Restock" },
  { value: "turndown-service", label: "Turndown Service" },
  { value: "laundry-pickup", label: "Laundry Pickup" },
  { value: "pillow-menu", label: "Pillow Menu" },
  { value: "tech-support", label: "Tech Support" },
];

interface RequestFormState {
  guest: string;
  room: string;
  type: string;
  priority: string;
  description: string;
  specialRequests: string[];
  inRoomService: string;
  otherRequest: string;
}

export default function GuestRequests() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [guestRequests, setGuestRequests] = useState(mockGuestRequests);
  const [formState, setFormState] = useState<RequestFormState>({
    guest: "",
    room: "",
    type: "Housekeeping",
    priority: "normal",
    description: "",
    specialRequests: [],
    inRoomService: "",
    otherRequest: "",
  });

  const { toast } = useToast();

  const filteredRequests = guestRequests.filter(
    (request) =>
      request.guest.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.room.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFormChange = (field: keyof RequestFormState, value: any) => {
    setFormState((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSpecialRequestToggle = (requestId: string) => {
    setFormState((prev) => {
      const currentRequests = prev.specialRequests || [];
      return {
        ...prev,
        specialRequests: currentRequests.includes(requestId)
          ? currentRequests.filter((id) => id !== requestId)
          : [...currentRequests, requestId],
      };
    });
  };

  const handleSubmitRequest = () => {
    // Create description based on form inputs
    let fullDescription = formState.description;
    
    // Add selected special requests
    if (formState.specialRequests.length > 0) {
      const selectedLabels = specialRequestOptions
        .filter((option) => formState.specialRequests.includes(option.id))
        .map((option) => option.label);
      fullDescription += `\nSpecial Requests: ${selectedLabels.join(", ")}`;
    }
    
    // Add in-room service if selected
    if (formState.inRoomService) {
      const serviceLabel = inRoomServiceOptions.find(opt => opt.value === formState.inRoomService)?.label;
      fullDescription += `\nIn-Room Service: ${serviceLabel}`;
    }
    
    // Add other requests if any
    if (formState.otherRequest) {
      fullDescription += `\nOther Requests: ${formState.otherRequest}`;
    }

    const newRequest = {
      id: `REQ-${String(guestRequests.length + 1).padStart(3, "0")}`,
      guest: formState.guest,
      room: formState.room,
      type: formState.type,
      status: "pending",
      description: fullDescription,
      createdAt: new Date(),
      priority: formState.priority,
    };

    setGuestRequests([newRequest, ...guestRequests]);
    setIsDialogOpen(false);
    toast({
      title: "Request Created",
      description: `New request has been created for ${formState.guest} in room ${formState.room}.`,
    });

    // Reset form
    setFormState({
      guest: "",
      room: "",
      type: "Housekeeping",
      priority: "normal",
      description: "",
      specialRequests: [],
      inRoomService: "",
      otherRequest: "",
    });
  };

  const handleStatusUpdate = (id: string, newStatus: string) => {
    setGuestRequests(
      guestRequests.map((request) =>
        request.id === id ? { ...request, status: newStatus } : request
      )
    );
    toast({
      title: "Status Updated",
      description: `Request ${id} status has been updated to ${newStatus}.`,
    });
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Guest Requests</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Request
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px]">
              <DialogHeader>
                <DialogTitle>Create New Guest Request</DialogTitle>
                <DialogDescription>
                  Enter the details for the new guest request.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-6 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="guest">Guest Name</Label>
                    <Input
                      id="guest"
                      value={formState.guest}
                      onChange={(e) => handleFormChange("guest", e.target.value)}
                      placeholder="Enter guest name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="room">Room Number</Label>
                    <Input
                      id="room"
                      value={formState.room}
                      onChange={(e) => handleFormChange("room", e.target.value)}
                      placeholder="Enter room number"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Request Type</Label>
                    <Select
                      value={formState.type}
                      onValueChange={(value) => handleFormChange("type", value)}
                    >
                      <SelectTrigger id="type">
                        <SelectValue placeholder="Select request type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Housekeeping">Housekeeping</SelectItem>
                        <SelectItem value="Maintenance">Maintenance</SelectItem>
                        <SelectItem value="Room Service">Room Service</SelectItem>
                        <SelectItem value="Front Desk">Front Desk</SelectItem>
                        <SelectItem value="Concierge">Concierge</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select
                      value={formState.priority}
                      onValueChange={(value) => handleFormChange("priority", value)}
                    >
                      <SelectTrigger id="priority">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formState.description}
                    onChange={(e) => handleFormChange("description", e.target.value)}
                    placeholder="Enter request details"
                    rows={3}
                  />
                </div>
                
                <div className="space-y-4">
                  <Label>Special Requests</Label>
                  <div className="grid grid-cols-2 gap-4">
                    {specialRequestOptions.map((option) => (
                      <div key={option.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`special-${option.id}`}
                          checked={formState.specialRequests.includes(option.id)}
                          onCheckedChange={() => handleSpecialRequestToggle(option.id)}
                        />
                        <label
                          htmlFor={`special-${option.id}`}
                          className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {option.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="inRoomService">In-Room Services</Label>
                  <Select
                    value={formState.inRoomService}
                    onValueChange={(value) => handleFormChange("inRoomService", value)}
                  >
                    <SelectTrigger id="inRoomService">
                      <SelectValue placeholder="Select in-room service" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Room Services</SelectLabel>
                        {inRoomServiceOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="otherRequest">Other Request</Label>
                  <Textarea
                    id="otherRequest"
                    value={formState.otherRequest}
                    onChange={(e) => handleFormChange("otherRequest", e.target.value)}
                    placeholder="Any other requests..."
                    rows={2}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSubmitRequest}>Create Request</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Active Requests</CardTitle>
            <CardDescription>
              Manage and track all guest requests and services
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by guest, room, or request details..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Guest</TableHead>
                    <TableHead>Room</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>{request.id}</TableCell>
                      <TableCell>{request.guest}</TableCell>
                      <TableCell>{request.room}</TableCell>
                      <TableCell>{request.type}</TableCell>
                      <TableCell>
                        <div className="max-w-[200px] truncate" title={request.description}>
                          {request.description}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            request.status === "pending"
                              ? "bg-yellow-500"
                              : request.status === "in-progress"
                              ? "bg-blue-500"
                              : "bg-green-500"
                          }
                        >
                          {request.status === "pending"
                            ? "Pending"
                            : request.status === "in-progress"
                            ? "In Progress"
                            : "Completed"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                          {format(request.createdAt, "HH:mm")}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          {request.status === "pending" && (
                            <Button
                              size="sm"
                              onClick={() => handleStatusUpdate(request.id, "in-progress")}
                            >
                              Start
                            </Button>
                          )}
                          {request.status === "in-progress" && (
                            <Button
                              size="sm"
                              onClick={() => handleStatusUpdate(request.id, "completed")}
                            >
                              Complete
                            </Button>
                          )}
                          {request.status === "completed" && (
                            <Button size="sm" variant="outline" disabled>
                              Done
                            </Button>
                          )}
                        </div>
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
