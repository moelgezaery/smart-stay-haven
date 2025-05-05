import { Layout } from "@/components/layout/Layout";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { Trash, UserPlus, Check, User, Search } from "lucide-react";

// Mock room data for housekeeping
const rooms = [
  { 
    room: "101", 
    floor: "1",
    type: "Standard Single", 
    status: "vacant" as const, 
    cleaning: "Required",
    priority: "Normal",
    assignedTo: "",
    notes: "",
  },
  { 
    room: "102", 
    floor: "1",
    type: "Standard Double", 
    status: "occupied" as const, 
    cleaning: "Scheduled",
    priority: "Normal",
    assignedTo: "Maria Garcia",
    notes: "Guest requested extra towels",
  },
  { 
    room: "103", 
    floor: "1",
    type: "Standard Double", 
    status: "reserved" as const, 
    cleaning: "Required",
    priority: "High",
    assignedTo: "",
    notes: "Guest arriving today, VIP",
  },
  { 
    room: "104", 
    floor: "1",
    type: "Standard Twin", 
    status: "cleaning" as const, 
    cleaning: "In Progress",
    priority: "Normal",
    assignedTo: "Carlos Rodriguez",
    notes: "",
  },
  { 
    room: "105", 
    floor: "1",
    type: "Deluxe Double", 
    status: "maintenance" as const, 
    cleaning: "Pending Maintenance",
    priority: "Normal",
    assignedTo: "",
    notes: "Bathtub repair needed",
  },
  { 
    room: "106", 
    floor: "1",
    type: "Junior Suite", 
    status: "checkout" as const, 
    cleaning: "Required",
    priority: "High",
    assignedTo: "",
    notes: "Deep cleaning required",
  },
  { 
    room: "201", 
    floor: "2",
    type: "Standard Single", 
    status: "vacant" as const, 
    cleaning: "Completed",
    priority: "Normal",
    assignedTo: "Maria Garcia",
    notes: "",
  },
  { 
    room: "202", 
    floor: "2",
    type: "Standard Double", 
    status: "occupied" as const, 
    cleaning: "Scheduled",
    priority: "Normal",
    assignedTo: "John Smith",
    notes: "",
  },
];

// Mock housekeeping staff
const staff = [
  { id: 1, name: "Maria Garcia", role: "Housekeeping", status: "Available", assignedRooms: 2 },
  { id: 2, name: "John Smith", role: "Housekeeping", status: "Available", assignedRooms: 1 },
  { id: 3, name: "Carlos Rodriguez", role: "Housekeeping", status: "Busy", assignedRooms: 1 },
  { id: 4, name: "Aisha Johnson", role: "Housekeeping Supervisor", status: "Available", assignedRooms: 0 },
  { id: 5, name: "Robert Chen", role: "Housekeeping", status: "Off Duty", assignedRooms: 0 },
];

export default function Housekeeping() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string[]>([]);
  
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
  
  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Housekeeping Management</h1>
      </div>
      
      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
          <TabsTrigger value="staff">Staff</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Total Rooms</p>
                <p className="text-2xl font-semibold">16</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Cleaning Required</p>
                <p className="text-2xl font-semibold text-orange-600">4</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">In Progress</p>
                <p className="text-2xl font-semibold text-blue-600">1</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Completed Today</p>
                <p className="text-2xl font-semibold text-green-600">1</p>
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
                <ToggleGroupItem value="Pending Maintenance" className="data-[state=on]:bg-red-100 data-[state=on]:text-red-900">
                  Pending Maintenance
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
          </div>
          
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <Checkbox />
                    </TableHead>
                    <TableHead>Room</TableHead>
                    <TableHead>Floor</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Cleaning Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRooms.map((room) => (
                    <TableRow key={room.room}>
                      <TableCell>
                        <Checkbox />
                      </TableCell>
                      <TableCell className="font-medium">{room.room}</TableCell>
                      <TableCell>{room.floor}</TableCell>
                      <TableCell>{room.type}</TableCell>
                      <TableCell>
                        <StatusBadge status={room.status} />
                      </TableCell>
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
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          room.priority === "High" ? "bg-red-100 text-red-800" : "bg-gray-100 text-gray-800"
                        }`}>
                          {room.priority}
                        </span>
                      </TableCell>
                      <TableCell>{room.assignedTo || "-"}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{room.notes || "-"}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon">
                            <UserPlus className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Check className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="assignments" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Room Assignments</CardTitle>
              <CardDescription>Assign staff to rooms</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Available Staff</h3>
                  <div className="border rounded-md p-2 space-y-2">
                    {staff
                      .filter(s => s.status !== "Off Duty")
                      .map((staffMember) => (
                        <div key={staffMember.id} className="flex justify-between items-center p-2 border rounded hover:bg-muted cursor-pointer">
                          <div className="flex items-center gap-2">
                            <User className="h-5 w-5" />
                            <div>
                              <p className="font-medium">{staffMember.name}</p>
                              <p className="text-xs text-muted-foreground">{staffMember.role}</p>
                            </div>
                          </div>
                          <div>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              staffMember.status === "Available" ? "bg-green-100 text-green-800" : 
                              "bg-yellow-100 text-yellow-800"
                            }`}>
                              {staffMember.status}
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Rooms Requiring Cleaning</h3>
                  <div className="border rounded-md p-2 space-y-2">
                    {rooms
                      .filter(r => r.cleaning === "Required" || r.cleaning === "Scheduled")
                      .map((room) => (
                        <div key={room.room} className="flex justify-between items-center p-2 border rounded hover:bg-muted cursor-pointer">
                          <div>
                            <p className="font-medium">Room {room.room}</p>
                            <p className="text-xs text-muted-foreground">{room.type}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              room.cleaning === "Required" ? "bg-orange-100 text-orange-800" : 
                              "bg-yellow-100 text-yellow-800"
                            }`}>
                              {room.cleaning}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              room.priority === "High" ? "bg-red-100 text-red-800" : "bg-gray-100 text-gray-800"
                            }`}>
                              {room.priority}
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="staff" className="mt-0">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Housekeeping Staff</CardTitle>
                <CardDescription>Manage housekeeping personnel</CardDescription>
              </div>
              <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                Add Staff
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Assigned Rooms</TableHead>
                    <TableHead>Schedule</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {staff.map((staffMember) => (
                    <TableRow key={staffMember.id}>
                      <TableCell>
                        <div className="font-medium">{staffMember.name}</div>
                      </TableCell>
                      <TableCell>{staffMember.role}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          staffMember.status === "Available" ? "bg-green-100 text-green-800" : 
                          staffMember.status === "Busy" ? "bg-yellow-100 text-yellow-800" : 
                          "bg-gray-100 text-gray-800"
                        }`}>
                          {staffMember.status}
                        </span>
                      </TableCell>
                      <TableCell>{staffMember.assignedRooms}</TableCell>
                      <TableCell>8:00 AM - 4:00 PM</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm">Edit</Button>
                          <Button variant="ghost" size="sm">View</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="inventory" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Housekeeping Inventory</CardTitle>
              <CardDescription>Track supplies and inventory levels</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Current Stock</TableHead>
                    <TableHead>Min. Level</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Bath Towels</TableCell>
                    <TableCell>Linens</TableCell>
                    <TableCell>120</TableCell>
                    <TableCell>50</TableCell>
                    <TableCell><span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">In Stock</span></TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">Update</Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Hand Towels</TableCell>
                    <TableCell>Linens</TableCell>
                    <TableCell>80</TableCell>
                    <TableCell>40</TableCell>
                    <TableCell><span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">In Stock</span></TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">Update</Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Bed Sheets (Queen)</TableCell>
                    <TableCell>Linens</TableCell>
                    <TableCell>45</TableCell>
                    <TableCell>30</TableCell>
                    <TableCell><span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">In Stock</span></TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">Update</Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Shampoo</TableCell>
                    <TableCell>Toiletries</TableCell>
                    <TableCell>35</TableCell>
                    <TableCell>50</TableCell>
                    <TableCell><span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">Low Stock</span></TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">Update</Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Soap Bars</TableCell>
                    <TableCell>Toiletries</TableCell>
                    <TableCell>150</TableCell>
                    <TableCell>100</TableCell>
                    <TableCell><span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">In Stock</span></TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">Update</Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Cleaning Solution</TableCell>
                    <TableCell>Cleaning Supplies</TableCell>
                    <TableCell>10</TableCell>
                    <TableCell>15</TableCell>
                    <TableCell><span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">Low Stock</span></TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">Update</Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Toilet Paper</TableCell>
                    <TableCell>Toiletries</TableCell>
                    <TableCell>200</TableCell>
                    <TableCell>150</TableCell>
                    <TableCell><span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">In Stock</span></TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">Update</Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Layout>
  );
}
