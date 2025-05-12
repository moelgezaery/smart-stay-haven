import { Layout } from "@/components/layout/Layout";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { KeyRound, Search, UserPlus, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";

// Mock data for available rooms
const availableRooms = [
  { 
    roomNumber: "101", 
    type: "Standard Single", 
    floor: "1", 
    rate: 89.00,
    status: "Vacant",
    features: ["Wi-Fi", "TV", "AC"]
  },
  { 
    roomNumber: "201", 
    type: "Standard Single", 
    floor: "2", 
    rate: 89.00,
    status: "Vacant",
    features: ["Wi-Fi", "TV", "AC"]
  },
  { 
    roomNumber: "203", 
    type: "Standard Double", 
    floor: "2", 
    rate: 129.00,
    status: "Vacant",
    features: ["Wi-Fi", "TV", "AC", "Mini-bar"]
  },
  { 
    roomNumber: "205", 
    type: "Deluxe Double", 
    floor: "2", 
    rate: 159.00,
    status: "Vacant",
    features: ["Wi-Fi", "TV", "AC", "Mini-bar", "Bathtub"]
  },
  { 
    roomNumber: "301", 
    type: "Deluxe Single", 
    floor: "3", 
    rate: 119.00,
    status: "Vacant",
    features: ["Wi-Fi", "TV", "AC", "City View"]
  },
  { 
    roomNumber: "304", 
    type: "Presidential Suite", 
    floor: "3", 
    rate: 359.00,
    status: "Vacant",
    features: ["Wi-Fi", "TV", "AC", "Mini-bar", "Jacuzzi", "City View", "Lounge"]
  },
];

// Mock data for upcoming reservations
const upcomingReservations = [
  {
    reservationId: "R001",
    guestName: "Sarah Williams",
    email: "sarah@example.com",
    phone: "234-567-8901",
    rooms: [
      { roomType: "Standard Double", roomNumber: "204" },
      { roomType: "Standard Double", roomNumber: "206" }
    ],
    checkIn: "May 5, 2025",
    checkOut: "May 8, 2025",
    adults: 4,
    children: 0,
    status: "Confirmed"
  },
  {
    reservationId: "R002",
    guestName: "David Wilson",
    email: "david@example.com",
    phone: "567-890-1234",
    rooms: [
      { roomType: "Junior Suite", roomNumber: "401" }
    ],
    checkIn: "May 7, 2025",
    checkOut: "May 12, 2025",
    adults: 2,
    children: 1,
    status: "Confirmed"
  },
  {
    reservationId: "R003",
    guestName: "Robert Martinez",
    email: "robert@example.com",
    phone: "789-012-3456",
    rooms: [
      { roomType: "Executive Suite", roomNumber: "501" },
      { roomType: "Deluxe Double", roomNumber: "402" },
    ],
    checkIn: "May 8, 2025",
    checkOut: "May 15, 2025",
    adults: 3,
    children: 2,
    status: "Confirmed"
  }
];

export default function CheckIn() {
  const [searchReservation, setSearchReservation] = useState("");
  const [searchRoom, setSearchRoom] = useState("");
  const [selectedRooms, setSelectedRooms] = useState<string[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState(() => {
    // Check if we have a reservation ID in the URL params
    const params = new URLSearchParams(location.search);
    return params.get("reservation") ? "reservation" : "walkin";
  });
  const [selectedReservation, setSelectedReservation] = useState<string | null>(
    () => {
      const params = new URLSearchParams(location.search);
      return params.get("reservation");
    }
  );
  const [paymentMethod, setPaymentMethod] = useState("credit");
  const [splitPayment, setSplitPayment] = useState(false);
  const [sendReceipt, setSendReceipt] = useState({ email: true, print: false });
  const [amountDue, setAmountDue] = useState(159.99);
  const [tip, setTip] = useState(0);
  const [paymentNote, setPaymentNote] = useState("");

  // Filter rooms based on search
  const filteredRooms = availableRooms.filter(room =>
    room.roomNumber.toLowerCase().includes(searchRoom.toLowerCase()) ||
    room.type.toLowerCase().includes(searchRoom.toLowerCase())
  );
  
  // Filter reservations based on search
  const filteredReservations = upcomingReservations.filter(reservation =>
    reservation.reservationId.toLowerCase().includes(searchReservation.toLowerCase()) ||
    reservation.guestName.toLowerCase().includes(searchReservation.toLowerCase()) ||
    reservation.email.toLowerCase().includes(searchReservation.toLowerCase())
  );
  
  // Toggle room selection
  const toggleRoomSelection = (roomNumber: string) => {
    if (selectedRooms.includes(roomNumber)) {
      setSelectedRooms(selectedRooms.filter(r => r !== roomNumber));
    } else {
      setSelectedRooms([...selectedRooms, roomNumber]);
    }
  };
  
  const handleReservationCheckIn = (reservationId: string) => {
    setSelectedReservation(reservationId);
    setActiveTab("reservation");
    
    // Find the reservation details to pre-fill the form
    const reservation = upcomingReservations.find(r => r.reservationId === reservationId);
    if (reservation) {
      toast({
        title: "Reservation selected",
        description: `Preparing check-in for ${reservation.guestName} (${reservation.rooms.length} ${reservation.rooms.length === 1 ? 'room' : 'rooms'})`
      });
    }
  };
  
  const handleCompleteCheckIn = () => {
    if (selectedRooms.length === 0) {
      toast({
        variant: "destructive",
        title: "No rooms selected",
        description: "Please select at least one room to check in"
      });
      return;
    }
    
    toast({
      title: "Check-in completed",
      description: `${selectedRooms.length} ${selectedRooms.length === 1 ? 'room' : 'rooms'} have been successfully checked in`
    });
  };

  // Handle amount due updates when tip changes
  const handleTipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tipValue = parseFloat(e.target.value) || 0;
    setTip(tipValue);
  };
  
  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Check-In</h1>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="walkin">Check-In Management</TabsTrigger>
          <TabsTrigger value="reservation">Check-In Reservation</TabsTrigger>
        </TabsList>
        
        <TabsContent value="walkin">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Guest Information */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Guest Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" placeholder="Guest's first name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" placeholder="Guest's last name" />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" placeholder="guest@example.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" placeholder="123-456-7890" />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="idType">ID Type</Label>
                    <Select>
                      <SelectTrigger id="idType">
                        <SelectValue placeholder="Select ID type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="passport">Passport</SelectItem>
                        <SelectItem value="driverLicense">Driver's License</SelectItem>
                        <SelectItem value="nationalId">National ID</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="idNumber">ID Number</Label>
                    <Input id="idNumber" placeholder="ID number" />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="checkInDate">Check-In Date</Label>
                    <Input id="checkInDate" type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="checkOutDate">Check-Out Date</Label>
                    <Input id="checkOutDate" type="date" />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="adults">Adults</Label>
                    <Input id="adults" type="number" min="1" defaultValue="1" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="children">Children</Label>
                    <Input id="children" type="number" min="0" defaultValue="0" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="notes">Special Requests</Label>
                  <Textarea id="notes" placeholder="Any special requests or notes?" />
                </div>
              </CardContent>
            </Card>
            
            {/* Room Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Room Selection</CardTitle>
                <CardDescription>Select one or more rooms for check-in</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search rooms..."
                    className="pl-10"
                    value={searchRoom}
                    onChange={(e) => setSearchRoom(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="roomType">Room Type</Label>
                  <Select>
                    <SelectTrigger id="roomType">
                      <SelectValue placeholder="All room types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All room types</SelectItem>
                      <SelectItem value="standard-single">Standard Single</SelectItem>
                      <SelectItem value="standard-double">Standard Double</SelectItem>
                      <SelectItem value="standard-twin">Standard Twin</SelectItem>
                      <SelectItem value="deluxe-single">Deluxe Single</SelectItem>
                      <SelectItem value="deluxe-double">Deluxe Double</SelectItem>
                      <SelectItem value="junior-suite">Junior Suite</SelectItem>
                      <SelectItem value="executive-suite">Executive Suite</SelectItem>
                      <SelectItem value="presidential-suite">Presidential Suite</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="floor">Floor</Label>
                  <Select>
                    <SelectTrigger id="floor">
                      <SelectValue placeholder="All floors" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All floors</SelectItem>
                      <SelectItem value="1">Floor 1</SelectItem>
                      <SelectItem value="2">Floor 2</SelectItem>
                      <SelectItem value="3">Floor 3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="border rounded-md max-h-64 overflow-y-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12"></TableHead>
                        <TableHead>Room</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Rate</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRooms.map((room) => (
                        <TableRow 
                          key={room.roomNumber} 
                          className={`cursor-pointer hover:bg-muted ${
                            selectedRooms.includes(room.roomNumber) ? "bg-blue-50" : ""
                          }`}
                          onClick={() => toggleRoomSelection(room.roomNumber)}
                        >
                          <TableCell>
                            <Checkbox 
                              checked={selectedRooms.includes(room.roomNumber)}
                              onCheckedChange={() => toggleRoomSelection(room.roomNumber)}
                            />
                          </TableCell>
                          <TableCell className="font-medium">{room.roomNumber}</TableCell>
                          <TableCell>{room.type}</TableCell>
                          <TableCell>${room.rate.toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                
                <div className="pt-2">
                  <p className="text-sm text-muted-foreground">
                    {selectedRooms.length} {selectedRooms.length === 1 ? 'room' : 'rooms'} selected
                  </p>
                </div>
              </CardContent>
            </Card>
            
            {/* Payment Details - New Enhanced Version */}
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Payment Details</CardTitle>
                <CardDescription>Collect payment method and billing information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-base">Payment Method</Label>
                      <RadioGroup 
                        defaultValue="credit" 
                        className="grid grid-cols-2 gap-4 pt-2"
                        value={paymentMethod}
                        onValueChange={setPaymentMethod}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="credit" id="credit" />
                          <Label htmlFor="credit">Credit Card</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="debit" id="debit" />
                          <Label htmlFor="debit">Debit Card</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="cash" id="cash" />
                          <Label htmlFor="cash">Cash</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="corporate" id="corporate" />
                          <Label htmlFor="corporate">Corporate</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    {(paymentMethod === "credit" || paymentMethod === "debit") && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 gap-2">
                          <Label htmlFor="cardNumber">Card Number</Label>
                          <Input id="cardNumber" placeholder="**** **** **** ****" />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="expiryDate">Expiry Date</Label>
                            <Input id="expiryDate" placeholder="MM/YY" />
                          </div>
                          <div>
                            <Label htmlFor="cvv">CVV</Label>
                            <Input id="cvv" placeholder="***" type="password" />
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="cardName">Name on Card</Label>
                          <Input id="cardName" placeholder="Cardholder name" />
                        </div>
                      </div>
                    )}
                    
                    <div className="pt-2">
                      <div className="flex items-center space-x-2">
                        <Switch 
                          id="splitPayment" 
                          checked={splitPayment} 
                          onCheckedChange={setSplitPayment}
                        />
                        <Label htmlFor="splitPayment">Split Payment</Label>
                      </div>
                      {splitPayment && (
                        <div className="pt-4 space-y-2">
                          <div className="grid grid-cols-2 gap-2 items-center">
                            <Select defaultValue="credit">
                              <SelectTrigger>
                                <SelectValue placeholder="Payment method" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="credit">Credit Card</SelectItem>
                                <SelectItem value="cash">Cash</SelectItem>
                              </SelectContent>
                            </Select>
                            <Input type="number" placeholder="Amount" defaultValue="100.00" />
                          </div>
                          <div className="grid grid-cols-2 gap-2 items-center">
                            <Select defaultValue="cash">
                              <SelectTrigger>
                                <SelectValue placeholder="Payment method" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="credit">Credit Card</SelectItem>
                                <SelectItem value="cash">Cash</SelectItem>
                              </SelectContent>
                            </Select>
                            <Input type="number" placeholder="Amount" defaultValue="59.99" />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-4 border-l pl-6">
                    <div>
                      <Label className="text-base">Amount Summary</Label>
                      <div className="pt-3 space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Room charge</span>
                          <span>${amountDue.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Tip / Gratuity</span>
                          <div className="w-24">
                            <Input 
                              type="number" 
                              min="0" 
                              step="0.01" 
                              value={tip} 
                              onChange={handleTipChange} 
                            />
                          </div>
                        </div>
                        <div className="border-t pt-2 mt-2">
                          <div className="flex justify-between font-medium">
                            <span>Total amount due</span>
                            <span>${(amountDue + tip).toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-4">
                      <Label htmlFor="paymentNote">Payment Notes</Label>
                      <Textarea 
                        id="paymentNote" 
                        placeholder="Any special billing instructions"
                        value={paymentNote}
                        onChange={(e) => setPaymentNote(e.target.value)}
                        className="mt-2"
                      />
                    </div>
                    
                    <div className="pt-4">
                      <Label className="text-base">Receipt Options</Label>
                      <div className="flex flex-col space-y-2 pt-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="emailReceipt" 
                            checked={sendReceipt.email}
                            onCheckedChange={(checked) => 
                              setSendReceipt({...sendReceipt, email: checked as boolean})
                            }
                          />
                          <Label htmlFor="emailReceipt">Email receipt</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="printReceipt"
                            checked={sendReceipt.print}
                            onCheckedChange={(checked) => 
                              setSendReceipt({...sendReceipt, print: checked as boolean})
                            }
                          />
                          <Label htmlFor="printReceipt">Print receipt</Label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-6">
                <Button variant="outline">Cancel</Button>
                <Button onClick={handleCompleteCheckIn}>
                  <KeyRound className="mr-2 h-4 w-4" />
                  Complete Check-In ({selectedRooms.length} {selectedRooms.length === 1 ? 'room' : 'rooms'})
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="reservation">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Reservations</CardTitle>
              <CardDescription>Check-in guests with existing reservations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative mb-4">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by reservation ID, guest name or email..."
                  className="pl-10"
                  value={searchReservation}
                  onChange={(e) => setSearchReservation(e.target.value)}
                />
              </div>
              
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Reservation ID</TableHead>
                      <TableHead>Guest Name</TableHead>
                      <TableHead>Rooms</TableHead>
                      <TableHead>Check-in</TableHead>
                      <TableHead>Check-out</TableHead>
                      <TableHead>Total Guests</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReservations.map((reservation) => (
                      <TableRow key={reservation.reservationId}>
                        <TableCell className="font-medium">{reservation.reservationId}</TableCell>
                        <TableCell>{reservation.guestName}</TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            {reservation.rooms.map((room, index) => (
                              <Badge key={index} variant="outline" className="max-w-fit">
                                {room.roomNumber} - {room.roomType}
                              </Badge>
                            ))}
                            <span className="text-xs text-muted-foreground mt-1">
                              {reservation.rooms.length} {reservation.rooms.length === 1 ? 'room' : 'rooms'}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{reservation.checkIn}</TableCell>
                        <TableCell>{reservation.checkOut}</TableCell>
                        <TableCell>{reservation.adults + reservation.children}</TableCell>
                        <TableCell>
                          <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                            {reservation.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            size="sm"
                            onClick={() => handleReservationCheckIn(reservation.reservationId)}
                          >
                            <KeyRound className="mr-2 h-4 w-4" />
                            Check-In
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Layout>
  );
}