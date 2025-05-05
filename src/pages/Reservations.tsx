
import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Search, Plus, User, Users } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

// Mock reservation data
const reservations = [
  {
    id: "RES-001",
    guestName: "John Smith",
    room: "101 - Deluxe King",
    checkIn: new Date("2025-06-01"),
    checkOut: new Date("2025-06-03"),
    status: "confirmed",
    guests: 2,
    price: "$420",
    email: "john.smith@example.com",
    phone: "+1 (555) 123-4567"
  },
  {
    id: "RES-002",
    guestName: "Sarah Johnson",
    room: "205 - Executive Suite",
    checkIn: new Date("2025-06-02"),
    checkOut: new Date("2025-06-05"),
    status: "checked-in",
    guests: 1,
    price: "$750",
    email: "sarah.j@example.com",
    phone: "+1 (555) 987-6543"
  },
  {
    id: "RES-003",
    guestName: "Michael Brown",
    room: "310 - Standard Twin",
    checkIn: new Date("2025-06-05"),
    checkOut: new Date("2025-06-07"),
    status: "confirmed",
    guests: 2,
    price: "$320",
    email: "m.brown@example.com",
    phone: "+1 (555) 456-7890"
  },
  {
    id: "RES-004",
    guestName: "Emily Davis",
    room: "402 - Family Suite",
    checkIn: new Date("2025-06-10"),
    checkOut: new Date("2025-06-15"),
    status: "pending",
    guests: 4,
    price: "$1,200",
    email: "emily.davis@example.com",
    phone: "+1 (555) 789-0123"
  },
  {
    id: "RES-005",
    guestName: "Robert Wilson",
    room: "118 - Deluxe Queen",
    checkIn: new Date("2025-05-28"),
    checkOut: new Date("2025-05-30"),
    status: "checked-out",
    guests: 2,
    price: "$380",
    email: "r.wilson@example.com",
    phone: "+1 (555) 234-5678"
  }
];

// Available rooms for new reservations
const availableRooms = [
  { id: "101", name: "101 - Deluxe King", type: "Deluxe King", price: "$210/night" },
  { id: "102", name: "102 - Deluxe King", type: "Deluxe King", price: "$210/night" },
  { id: "103", name: "103 - Deluxe Twin", type: "Deluxe Twin", price: "$180/night" },
  { id: "201", name: "201 - Executive Suite", type: "Executive Suite", price: "$350/night" },
  { id: "205", name: "205 - Executive Suite", type: "Executive Suite", price: "$350/night" },
  { id: "302", name: "302 - Standard Queen", type: "Standard Queen", price: "$150/night" },
  { id: "310", name: "310 - Standard Twin", type: "Standard Twin", price: "$160/night" },
];

type ReservationStatus = "confirmed" | "checked-in" | "checked-out" | "cancelled" | "pending";

interface DateRange {
  from: Date;
  to?: Date;
}

export default function Reservations() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [date, setDate] = useState<DateRange>({ 
    from: new Date(),
    to: new Date(new Date().setDate(new Date().getDate() + 3))
  });
  const [selectedRoom, setSelectedRoom] = useState("");
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [guestCount, setGuestCount] = useState("1");
  const [openDialog, setOpenDialog] = useState(false);
  const { toast } = useToast();

  const handleCreateReservation = () => {
    if (!guestName || !guestEmail || !guestPhone || !selectedRoom || !date.from || !date.to) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please fill in all required fields"
      });
      return;
    }

    toast({
      title: "Reservation created",
      description: `Reservation for ${guestName} has been created`
    });
    setOpenDialog(false);
    // Reset form - would usually update the reservation list here
    setGuestName("");
    setGuestEmail("");
    setGuestPhone("");
    setSelectedRoom("");
    setGuestCount("1");
  };
  
  const getStatusBadge = (status: ReservationStatus) => {
    switch(status) {
      case "confirmed":
        return <Badge className="bg-green-500">Confirmed</Badge>;
      case "checked-in":
        return <Badge className="bg-blue-500">Checked In</Badge>;
      case "checked-out":
        return <Badge className="bg-gray-500">Checked Out</Badge>;
      case "cancelled":
        return <Badge className="bg-red-500">Cancelled</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500">Pending</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };
  
  // Filter reservations based on search and status
  const filteredReservations = reservations.filter(res => {
    const matchesSearch = res.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           res.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           res.room.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || res.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <h1 className="text-3xl font-bold text-navy-500">Reservations</h1>
          
          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Reservation
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Create New Reservation</DialogTitle>
                <DialogDescription>
                  Enter the details for the new guest reservation
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-6 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="guestName">Guest Name</Label>
                    <Input 
                      id="guestName" 
                      placeholder="Enter guest name" 
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="guestEmail">Email</Label>
                    <Input 
                      id="guestEmail" 
                      type="email" 
                      placeholder="guest@example.com"
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="guestPhone">Phone Number</Label>
                    <Input 
                      id="guestPhone" 
                      placeholder="+1 (555) 000-0000"
                      value={guestPhone}
                      onChange={(e) => setGuestPhone(e.target.value)} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="guests">Number of Guests</Label>
                    <Select value={guestCount} onValueChange={setGuestCount}>
                      <SelectTrigger id="guests">
                        <SelectValue placeholder="Select number of guests" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 Guest</SelectItem>
                        <SelectItem value="2">2 Guests</SelectItem>
                        <SelectItem value="3">3 Guests</SelectItem>
                        <SelectItem value="4">4 Guests</SelectItem>
                        <SelectItem value="5">5+ Guests</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Check-In / Check-Out Dates</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date?.from ? (
                          date.to ? (
                            <>
                              {format(date.from, "LLL dd, y")} -{" "}
                              {format(date.to, "LLL dd, y")}
                            </>
                          ) : (
                            format(date.from, "LLL dd, y")
                          )
                        ) : (
                          <span>Select date range</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={date?.from}
                        selected={date}
                        onSelect={(range) => {
                          if (range) setDate(range);
                        }}
                        numberOfMonths={2}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="room">Select Room</Label>
                  <Select value={selectedRoom} onValueChange={setSelectedRoom}>
                    <SelectTrigger id="room">
                      <SelectValue placeholder="Select a room" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableRooms.map(room => (
                        <SelectItem key={room.id} value={room.id}>
                          {room.name} - {room.price}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpenDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateReservation}>
                  Create Reservation
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Manage Reservations</CardTitle>
            <CardDescription>
              View and manage all hotel reservations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6 flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by guest name, reservation ID or room..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select
                value={filterStatus}
                onValueChange={setFilterStatus}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="checked-in">Checked In</SelectItem>
                  <SelectItem value="checked-out">Checked Out</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Reservation ID</TableHead>
                    <TableHead>Guest</TableHead>
                    <TableHead>Room</TableHead>
                    <TableHead>Check In</TableHead>
                    <TableHead>Check Out</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReservations.length > 0 ? (
                    filteredReservations.map((reservation) => (
                      <TableRow key={reservation.id}>
                        <TableCell className="font-medium">{reservation.id}</TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span>{reservation.guestName}</span>
                            <span className="text-xs text-muted-foreground">{reservation.email}</span>
                          </div>
                        </TableCell>
                        <TableCell>{reservation.room}</TableCell>
                        <TableCell>{format(reservation.checkIn, "MMM dd, yyyy")}</TableCell>
                        <TableCell>{format(reservation.checkOut, "MMM dd, yyyy")}</TableCell>
                        <TableCell>{getStatusBadge(reservation.status as ReservationStatus)}</TableCell>
                        <TableCell>{reservation.price}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">View</Button>
                            <Button variant="outline" size="sm">Edit</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        No reservations found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
