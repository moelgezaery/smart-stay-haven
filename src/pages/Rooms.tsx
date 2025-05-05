
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
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Badge } from "@/components/ui/badge";
import { FloorSection } from "@/components/dashboard/FloorSection";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Plus, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Mock rooms data
const mockRooms = [
  {
    floorNumber: "1",
    rooms: [
      { roomNumber: "101", type: "Standard Single", status: "vacant" as const },
      { roomNumber: "102", type: "Standard Double", status: "occupied" as const, guest: "Alex Johnson", checkIn: "May 2, 2025", checkOut: "May 5, 2025" },
      { roomNumber: "103", type: "Standard Double", status: "reserved" as const, guest: "Sarah Williams", checkIn: "May 5, 2025", checkOut: "May 8, 2025" },
      { roomNumber: "104", type: "Standard Twin", status: "cleaning" as const },
      { roomNumber: "105", type: "Deluxe Double", status: "maintenance" as const },
      { roomNumber: "106", type: "Junior Suite", status: "checkout" as const },
    ]
  },
  {
    floorNumber: "2",
    rooms: [
      { roomNumber: "201", type: "Standard Single", status: "vacant" as const },
      { roomNumber: "202", type: "Standard Double", status: "occupied" as const, guest: "Michael Brown", checkIn: "May 1, 2025", checkOut: "May 4, 2025" },
      { roomNumber: "203", type: "Standard Double", status: "vacant" as const },
      { roomNumber: "204", type: "Standard Twin", status: "occupied" as const, guest: "Emily Davis", checkIn: "May 3, 2025", checkOut: "May 10, 2025" },
      { roomNumber: "205", type: "Deluxe Double", status: "vacant" as const },
      { roomNumber: "206", type: "Junior Suite", status: "reserved" as const, guest: "David Wilson", checkIn: "May 7, 2025", checkOut: "May 12, 2025" },
    ]
  },
  {
    floorNumber: "3",
    rooms: [
      { roomNumber: "301", type: "Deluxe Single", status: "vacant" as const },
      { roomNumber: "302", type: "Deluxe Double", status: "occupied" as const, guest: "Jennifer Taylor", checkIn: "May 2, 2025", checkOut: "May 6, 2025" },
      { roomNumber: "303", type: "Executive Suite", status: "reserved" as const, guest: "Robert Martinez", checkIn: "May 8, 2025", checkOut: "May 15, 2025" },
      { roomNumber: "304", type: "Presidential Suite", status: "vacant" as const },
    ]
  },
];

export default function Rooms() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentView, setCurrentView] = useState("grid");
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [roomDialog, setRoomDialog] = useState(false);
  const [newRoom, setNewRoom] = useState({
    roomNumber: "",
    type: "standard-single",
    floor: "1"
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleAddRoom = () => {
    if (!newRoom.roomNumber || !newRoom.type || !newRoom.floor) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please fill in all required fields"
      });
      return;
    }

    toast({
      title: "Room added",
      description: `Room ${newRoom.roomNumber} has been added successfully.`
    });
    
    setRoomDialog(false);
    setNewRoom({
      roomNumber: "",
      type: "standard-single",
      floor: "1"
    });
  };
  
  const handleRoomDetailClick = (roomNumber: string) => {
    // Navigate to room details page with the room number as a parameter
    navigate(`/rooms?room=${roomNumber}`);
  };

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Room Management</h1>
        <Dialog open={roomDialog} onOpenChange={setRoomDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Room
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Room</DialogTitle>
              <DialogDescription>
                Enter the details for the new room.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="roomNumber" className="text-right">
                  Room Number
                </Label>
                <Input
                  id="roomNumber"
                  className="col-span-3"
                  value={newRoom.roomNumber}
                  onChange={(e) => setNewRoom({...newRoom, roomNumber: e.target.value})}
                  placeholder="101"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right">
                  Room Type
                </Label>
                <Select
                  value={newRoom.type}
                  onValueChange={(value) => setNewRoom({...newRoom, type: value})}
                >
                  <SelectTrigger className="col-span-3" id="type">
                    <SelectValue placeholder="Select room type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard-single">Standard Single</SelectItem>
                    <SelectItem value="standard-double">Standard Double</SelectItem>
                    <SelectItem value="standard-twin">Standard Twin</SelectItem>
                    <SelectItem value="deluxe-double">Deluxe Double</SelectItem>
                    <SelectItem value="junior-suite">Junior Suite</SelectItem>
                    <SelectItem value="executive-suite">Executive Suite</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="floor" className="text-right">
                  Floor
                </Label>
                <Select
                  value={newRoom.floor}
                  onValueChange={(value) => setNewRoom({...newRoom, floor: value})}
                >
                  <SelectTrigger className="col-span-3" id="floor">
                    <SelectValue placeholder="Select floor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Floor 1</SelectItem>
                    <SelectItem value="2">Floor 2</SelectItem>
                    <SelectItem value="3">Floor 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setRoomDialog(false)}>Cancel</Button>
              <Button onClick={handleAddRoom}>Add Room</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <Card className="flex-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Rooms</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">16</div>
          </CardContent>
        </Card>
        <Card className="flex-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Occupied</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">5</div>
          </CardContent>
        </Card>
        <Card className="flex-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Vacant</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">7</div>
          </CardContent>
        </Card>
        <Card className="flex-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Reserved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">3</div>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex gap-2">
            <ToggleGroup type="multiple" value={statusFilter} onValueChange={setStatusFilter} className="flex flex-wrap gap-2">
              <ToggleGroupItem value="vacant" className="data-[state=on]:bg-green-100 data-[state=on]:text-green-900">
                <Badge className="bg-green-500">Vacant</Badge>
              </ToggleGroupItem>
              <ToggleGroupItem value="occupied" className="data-[state=on]:bg-blue-100 data-[state=on]:text-blue-900">
                <Badge className="bg-blue-500">Occupied</Badge>
              </ToggleGroupItem>
              <ToggleGroupItem value="reserved" className="data-[state=on]:bg-orange-100 data-[state=on]:text-orange-900">
                <Badge className="bg-orange-500">Reserved</Badge>
              </ToggleGroupItem>
              <ToggleGroupItem value="maintenance" className="data-[state=on]:bg-red-100 data-[state=on]:text-red-900">
                <Badge className="bg-red-500">Maintenance</Badge>
              </ToggleGroupItem>
              <ToggleGroupItem value="cleaning" className="data-[state=on]:bg-purple-100 data-[state=on]:text-purple-900">
                <Badge className="bg-purple-500">Cleaning</Badge>
              </ToggleGroupItem>
              <ToggleGroupItem value="checkout" className="data-[state=on]:bg-gray-100 data-[state=on]:text-gray-900">
                <Badge className="bg-gray-500">Checkout</Badge>
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
          
          <div className="flex gap-2 w-full md:w-auto">
            <div className="relative flex-grow md:flex-grow-0">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search rooms..."
                className="pl-10 w-full md:w-80"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <ToggleGroup type="single" value={currentView} onValueChange={(value) => value && setCurrentView(value)}>
              <ToggleGroupItem value="grid" aria-label="Grid View">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="7" x="3" y="3" rx="1" /><rect width="7" height="7" x="14" y="3" rx="1" /><rect width="7" height="7" x="14" y="14" rx="1" /><rect width="7" height="7" x="3" y="14" rx="1" /></svg>
              </ToggleGroupItem>
              <ToggleGroupItem value="list" aria-label="List View">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></svg>
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>
      </div>
      
      <Tabs defaultValue="allFloors" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="allFloors">All Floors</TabsTrigger>
          <TabsTrigger value="floor1">Floor 1</TabsTrigger>
          <TabsTrigger value="floor2">Floor 2</TabsTrigger>
          <TabsTrigger value="floor3">Floor 3</TabsTrigger>
        </TabsList>
        
        <TabsContent value="allFloors" className="mt-0">
          {mockRooms.map((floor) => (
            <FloorSection 
              key={floor.floorNumber} 
              floorNumber={floor.floorNumber} 
              rooms={floor.rooms.filter(room => 
                (statusFilter.length === 0 || statusFilter.includes(room.status)) &&
                (searchTerm === "" || 
                  room.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  room.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  (room.guest && room.guest.toLowerCase().includes(searchTerm.toLowerCase()))
                )
              )}
              onRoomClick={handleRoomDetailClick}
            />
          ))}
        </TabsContent>
        
        {mockRooms.map((floor, index) => (
          <TabsContent key={index} value={`floor${floor.floorNumber}`} className="mt-0">
            <FloorSection 
              floorNumber={floor.floorNumber} 
              rooms={floor.rooms.filter(room => 
                (statusFilter.length === 0 || statusFilter.includes(room.status)) &&
                (searchTerm === "" || 
                  room.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  room.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  (room.guest && room.guest.toLowerCase().includes(searchTerm.toLowerCase()))
                )
              )}
              onRoomClick={handleRoomDetailClick}
            />
          </TabsContent>
        ))}
      </Tabs>
    </Layout>
  );
}
