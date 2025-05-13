
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Plus, ChevronLeft, Pencil, Trash, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/dashboard/StatusBadge";

// Mock floors data
const floors = [
  {
    id: 1,
    name: "Ground Floor",
    description: "Lobby, Reception, Restaurant, and Conference Rooms",
    roomsCount: 4
  },
  {
    id: 2,
    name: "First Floor",
    description: "Standard and Deluxe rooms",
    roomsCount: 15
  },
  {
    id: 3,
    name: "Second Floor",
    description: "Premium rooms with city view",
    roomsCount: 12
  },
  {
    id: 4,
    name: "Third Floor",
    description: "Executive suites and Presidential suite",
    roomsCount: 8
  }
];

// Mock room types for dropdown
const roomTypes = [
  { id: 1, name: "Standard Single" },
  { id: 2, name: "Standard Double" },
  { id: 3, name: "Deluxe King" },
  { id: 4, name: "Junior Suite" },
  { id: 5, name: "Executive Suite" },
  { id: 6, name: "Presidential Suite" },
];

// Mock rooms data
const rooms = [
  { id: 101, number: "101", type: "Standard Single", floor: 1, status: "vacant" },
  { id: 102, number: "102", type: "Standard Double", floor: 1, status: "occupied" },
  { id: 103, number: "103", type: "Deluxe King", floor: 1, status: "maintenance" },
  { id: 201, number: "201", type: "Standard Single", floor: 2, status: "vacant" },
  { id: 202, number: "202", type: "Junior Suite", floor: 2, status: "cleaning" },
  { id: 203, number: "203", type: "Executive Suite", floor: 2, status: "occupied" },
  { id: 301, number: "301", type: "Presidential Suite", floor: 3, status: "reserved" },
];

export default function Floors() {
  const [editMode, setEditMode] = useState(false);
  const [currentFloor, setCurrentFloor] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("floors");
  const [searchTerm, setSearchTerm] = useState("");
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [currentRoom, setCurrentRoom] = useState<any>(null);
  
  const handleEditFloor = (floor: any) => {
    setCurrentFloor(floor);
    setEditMode(true);
  };
  
  const handleCancelEdit = () => {
    setCurrentFloor(null);
    setEditMode(false);
  };

  const handleAddRoom = () => {
    setCurrentRoom(null);
    setShowRoomModal(true);
  };

  const handleEditRoom = (room: any) => {
    setCurrentRoom(room);
    setShowRoomModal(true);
  };

  const handleCloseRoomModal = () => {
    setShowRoomModal(false);
    setCurrentRoom(null);
  };

  // Filter rooms based on search term
  const filteredRooms = rooms.filter(room => 
    room.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.type.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <Layout>
      <div className="mb-6 flex items-center">
        <Button variant="ghost" size="sm" asChild className="mr-4">
          <Link to="/setup">
            <ChevronLeft size={16} className="mr-1" />
            Back to Setup
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Floors & Rooms Setup</h1>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="floors">Floors</TabsTrigger>
          <TabsTrigger value="rooms">Rooms</TabsTrigger>
        </TabsList>
        
        <TabsContent value="floors">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Hotel Floors</CardTitle>
                    <CardDescription>Manage your hotel floors and their details</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Floor Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Rooms</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {floors.map((floor) => (
                        <TableRow key={floor.id}>
                          <TableCell className="font-medium">{floor.id}</TableCell>
                          <TableCell>{floor.name}</TableCell>
                          <TableCell>{floor.description}</TableCell>
                          <TableCell>{floor.roomsCount}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="icon" onClick={() => handleEditFloor(floor)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Trash className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>{editMode ? `Edit ${currentFloor?.name}` : 'Add New Floor'}</CardTitle>
                  <CardDescription>
                    {editMode ? 'Update floor information' : 'Define a new floor for your hotel'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="floorName" className="text-sm font-medium">Floor Name</label>
                    <Input 
                      id="floorName" 
                      placeholder="e.g. First Floor" 
                      defaultValue={editMode ? currentFloor?.name : ''}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="floorNumber" className="text-sm font-medium">Floor Number</label>
                      <Input 
                        id="floorNumber" 
                        type="number" 
                        placeholder="e.g. 1" 
                        defaultValue={editMode ? currentFloor?.id : ''}
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="roomNumberPrefix" className="text-sm font-medium">Room Number Prefix</label>
                      <Input 
                        id="roomNumberPrefix" 
                        placeholder="e.g. 1 for rooms 101, 102..." 
                        defaultValue={editMode ? currentFloor?.id : ''}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="floorDescription" className="text-sm font-medium">Description</label>
                    <Textarea 
                      id="floorDescription" 
                      placeholder="Brief description of the floor" 
                      defaultValue={editMode ? currentFloor?.description : ''}
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between border-t pt-6">
                  <Button variant="outline" onClick={handleCancelEdit}>Cancel</Button>
                  <Button>{editMode ? 'Update' : 'Save'} Floor</Button>
                </CardFooter>
              </Card>
              
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Floor Map</CardTitle>
                  <CardDescription>
                    Upload a visual map of the floor layout
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center h-40 bg-muted/50 rounded-md">
                    <label htmlFor="floor-map-upload" className="cursor-pointer text-center p-4">
                      <div className="flex flex-col items-center gap-2">
                        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-upload">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="17 8 12 3 7 8" />
                            <line x1="12" y1="3" x2="12" y2="15" />
                          </svg>
                        </div>
                        <span className="text-sm font-medium">Click to upload</span>
                        <span className="text-xs text-muted-foreground">SVG, PNG, JPG (max. 5MB)</span>
                      </div>
                      <Input id="floor-map-upload" type="file" className="sr-only" />
                    </label>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="rooms">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="relative w-64">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search rooms..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button onClick={handleAddRoom}>
                <Plus className="h-4 w-4 mr-2" />
                Add New Room
              </Button>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Room Management</CardTitle>
                <CardDescription>Manage your hotel rooms and their details</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Room Number</TableHead>
                      <TableHead>Room Type</TableHead>
                      <TableHead>Floor</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRooms.map((room) => (
                      <TableRow key={room.id}>
                        <TableCell className="font-medium">{room.number}</TableCell>
                        <TableCell>{room.type}</TableCell>
                        <TableCell>{floors.find(f => f.id === room.floor)?.name || room.floor}</TableCell>
                        <TableCell>
                          <StatusBadge status={room.status} />
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => handleEditRoom(room)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Trash className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            
            {showRoomModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                <Card className="w-full max-w-md">
                  <CardHeader>
                    <CardTitle>{currentRoom ? 'Edit Room' : 'Add New Room'}</CardTitle>
                    <CardDescription>
                      {currentRoom ? 'Update room details' : 'Add a new room to your hotel'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="roomNumber" className="text-sm font-medium">Room Number / Name</label>
                      <Input 
                        id="roomNumber" 
                        placeholder="e.g. 101" 
                        defaultValue={currentRoom?.number || ''}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="roomType" className="text-sm font-medium">Room Type</label>
                      <Select defaultValue={currentRoom?.type || ""}>
                        <SelectTrigger id="roomType">
                          <SelectValue placeholder="Select a room type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Room Types</SelectLabel>
                            {roomTypes.map((type) => (
                              <SelectItem key={type.id} value={type.name}>
                                {type.name}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="floor" className="text-sm font-medium">Floor</label>
                      <Select defaultValue={currentRoom?.floor.toString() || ""}>
                        <SelectTrigger id="floor">
                          <SelectValue placeholder="Select a floor" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Floors</SelectLabel>
                            {floors.map((floor) => (
                              <SelectItem key={floor.id} value={floor.id.toString()}>
                                {floor.name}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="status" className="text-sm font-medium">Room Status</label>
                      <Select defaultValue={currentRoom?.status || "vacant"}>
                        <SelectTrigger id="status">
                          <SelectValue placeholder="Select room status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Status</SelectLabel>
                            <SelectItem value="vacant">Available</SelectItem>
                            <SelectItem value="occupied">Occupied</SelectItem>
                            <SelectItem value="reserved">Reserved</SelectItem>
                            <SelectItem value="cleaning">Cleaning</SelectItem>
                            <SelectItem value="maintenance">Maintenance</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between border-t pt-6">
                    <Button variant="outline" onClick={handleCloseRoomModal}>Cancel</Button>
                    <Button>{currentRoom ? 'Update' : 'Save'} Room</Button>
                  </CardFooter>
                </Card>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </Layout>
  );
}
