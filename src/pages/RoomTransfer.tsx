
import { Layout } from "@/components/layout/Layout";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon, Check, Loader2, Search } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { Switch } from "@/components/ui/switch";
import { roomService } from "@/services/roomService";
import { bookingService } from "@/services/bookingService";
import { Room } from "@/types/room";

export default function RoomTransfer() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [availableRooms, setAvailableRooms] = useState<Room[]>([]);
  const [newRoomId, setNewRoomId] = useState<number | null>(null);
  const [transferDate, setTransferDate] = useState<Date | undefined>(new Date());
  const [transferReason, setTransferReason] = useState("guest_request");
  const [additionalCharge, setAdditionalCharge] = useState(false);
  const [transferNotes, setTransferNotes] = useState("");

  // Load available rooms
  useEffect(() => {
    const fetchAvailableRooms = async () => {
      try {
        const rooms = await roomService.getRoomsByStatus("vacant");
        setAvailableRooms(rooms);
      } catch (error) {
        console.error("Error loading available rooms:", error);
        toast({
          title: "Error",
          description: "Failed to load available rooms. Please try again.",
          variant: "destructive"
        });
      }
    };

    fetchAvailableRooms();
  }, [toast]);

  // Search for bookings
  const handleSearch = async () => {
    if (!searchTerm) return;
    
    setIsLoading(true);
    try {
      // This is a mock implementation as we don't have a specific search endpoint
      // In a real application, you would have a search endpoint in your API
      const bookings = await bookingService.getBookings();
      const results = bookings.filter(booking => 
        booking.guest?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.guest?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.id.toString() === searchTerm ||
        booking.room?.roomNumber?.includes(searchTerm)
      );
      
      setSearchResults(results);
    } catch (error) {
      console.error("Error searching bookings:", error);
      toast({
        title: "Search Error",
        description: "Failed to search bookings. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Select a booking for transfer
  const handleSelectBooking = (booking: any) => {
    setSelectedBooking(booking);
    setSearchResults([]);
    setSearchTerm("");
  };

  // Handle room transfer
  const handleTransfer = async () => {
    if (!selectedBooking || !newRoomId || !transferDate) {
      toast({
        title: "Missing Information",
        description: "Please provide all required information for the room transfer.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    try {
      // In a real application, you would implement the actual room transfer logic here
      // This would include updating the booking in the database, creating a transfer record, etc.
      
      // Mock implementation - just showing a success message
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Room Transfer Successful",
        description: `Guest ${selectedBooking.guest?.firstName} ${selectedBooking.guest?.lastName} has been transferred to the new room.`,
        variant: "default"
      });
      
      // Reset the form
      setSelectedBooking(null);
      setNewRoomId(null);
      setTransferDate(new Date());
      setTransferReason("guest_request");
      setAdditionalCharge(false);
      setTransferNotes("");
    } catch (error) {
      console.error("Error transferring room:", error);
      toast({
        title: "Transfer Error",
        description: "Failed to transfer the room. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const reasons = [
    { value: "guest_request", label: "Guest Request" },
    { value: "maintenance_issue", label: "Maintenance Issue" },
    { value: "upgrade", label: "Upgrade" },
    { value: "downgrade", label: "Downgrade" },
    { value: "other", label: "Other" }
  ];

  return (
    <Layout>
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">Room Transfer</h1>
        
        {/* Guest Search */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Search Guest or Booking</CardTitle>
            <CardDescription>
              Search by guest name, reservation number, or room number
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <div className="flex-grow">
                <Input
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <Button onClick={handleSearch} disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Search className="h-4 w-4 mr-2" />
                )}
                Search
              </Button>
            </div>
            
            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="mt-4 border rounded-md overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Booking #</TableHead>
                      <TableHead>Guest</TableHead>
                      <TableHead>Room</TableHead>
                      <TableHead>Check-in</TableHead>
                      <TableHead>Check-out</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {searchResults.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell className="font-medium">{booking.id}</TableCell>
                        <TableCell>
                          {booking.guest?.firstName} {booking.guest?.lastName}
                        </TableCell>
                        <TableCell>{booking.room?.roomNumber}</TableCell>
                        <TableCell>{new Date(booking.checkInDate).toLocaleDateString()}</TableCell>
                        <TableCell>{new Date(booking.checkOutDate).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <StatusBadge status={booking.status} />
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleSelectBooking(booking)}
                          >
                            Select
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Guest Information */}
        {selectedBooking && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Guest Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <span className="font-semibold">Name:</span>
                    <span className="ml-2">{selectedBooking.guest?.firstName} {selectedBooking.guest?.lastName}</span>
                  </div>
                  <div>
                    <span className="font-semibold">Booking #:</span>
                    <span className="ml-2">{selectedBooking.id}</span>
                  </div>
                  <div>
                    <span className="font-semibold">Status:</span>
                    <span className="ml-2">
                      <StatusBadge status={selectedBooking.status} />
                    </span>
                  </div>
                  {selectedBooking.guest?.phoneNumber && (
                    <div>
                      <span className="font-semibold">Phone:</span>
                      <span className="ml-2">{selectedBooking.guest.phoneNumber}</span>
                    </div>
                  )}
                  {selectedBooking.guest?.email && (
                    <div>
                      <span className="font-semibold">Email:</span>
                      <span className="ml-2">{selectedBooking.guest.email}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Current Room</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <span className="font-semibold">Room #:</span>
                    <span className="ml-2">{selectedBooking.room?.roomNumber}</span>
                  </div>
                  <div>
                    <span className="font-semibold">Room Type:</span>
                    <span className="ml-2">{selectedBooking.room?.roomType?.name || "Standard"}</span>
                  </div>
                  <div>
                    <span className="font-semibold">Floor:</span>
                    <span className="ml-2">{selectedBooking.room?.floor}</span>
                  </div>
                  <div>
                    <span className="font-semibold">Status:</span>
                    <span className="ml-2">
                      <StatusBadge status={selectedBooking.room?.status || "occupied"} />
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Booking Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <span className="font-semibold">Check-in:</span>
                    <span className="ml-2">{new Date(selectedBooking.checkInDate).toLocaleDateString()}</span>
                  </div>
                  <div>
                    <span className="font-semibold">Check-out:</span>
                    <span className="ml-2">{new Date(selectedBooking.checkOutDate).toLocaleDateString()}</span>
                  </div>
                  <div>
                    <span className="font-semibold">Nights:</span>
                    <span className="ml-2">
                      {Math.ceil((new Date(selectedBooking.checkOutDate).getTime() - 
                      new Date(selectedBooking.checkInDate).getTime()) / (1000 * 60 * 60 * 24))}
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold">Guests:</span>
                    <span className="ml-2">{selectedBooking.numberOfGuests || 1}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        
        {/* Transfer Form */}
        {selectedBooking && (
          <Card>
            <CardHeader>
              <CardTitle>Transfer Room</CardTitle>
              <CardDescription>Complete the form to transfer the guest to a new room</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="newRoom">New Room</Label>
                    <Select
                      value={newRoomId?.toString() || ""}
                      onValueChange={(value) => setNewRoomId(Number(value))}
                    >
                      <SelectTrigger id="newRoom">
                        <SelectValue placeholder="Select a room" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableRooms.map((room) => (
                          <SelectItem key={room.id} value={room.id.toString()}>
                            Room {room.roomNumber} - {room.roomType?.name || "Standard"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="transferDate">Transfer Date/Time</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          id="transferDate"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !transferDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {transferDate ? format(transferDate, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 z-50">
                        <Calendar
                          mode="single"
                          selected={transferDate}
                          onSelect={setTransferDate}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="transferReason">Reason for Transfer</Label>
                    <Select
                      value={transferReason}
                      onValueChange={setTransferReason}
                    >
                      <SelectTrigger id="transferReason">
                        <SelectValue placeholder="Select reason" />
                      </SelectTrigger>
                      <SelectContent>
                        {reasons.map((reason) => (
                          <SelectItem key={reason.value} value={reason.value}>
                            {reason.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="additionalCharge">Additional Charge</Label>
                      <p className="text-sm text-muted-foreground">
                        Apply an additional charge for this room transfer
                      </p>
                    </div>
                    <Switch
                      id="additionalCharge"
                      checked={additionalCharge}
                      onCheckedChange={setAdditionalCharge}
                    />
                  </div>
                </div>
                
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="transferNotes">Notes</Label>
                  <Textarea
                    id="transferNotes"
                    placeholder="Enter any additional notes about this transfer"
                    value={transferNotes}
                    onChange={(e) => setTransferNotes(e.target.value)}
                    rows={3}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <div className="flex justify-end gap-4 w-full">
                <Button
                  variant="outline"
                  onClick={() => setSelectedBooking(null)}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button onClick={handleTransfer} disabled={isLoading || !newRoomId}>
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Check className="h-4 w-4 mr-2" />
                  )}
                  Confirm Transfer
                </Button>
              </div>
            </CardFooter>
          </Card>
        )}
      </div>
    </Layout>
  );
}
