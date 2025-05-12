
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { 
  CalendarIcon, 
  Check, 
  Loader2, 
  Search,
  X,
  Filter,
  ListFilter
} from "lucide-react";
import { format, addDays } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { roomService } from "@/services/roomService";
import { bookingService } from "@/services/bookingService";
import { Room } from "@/types/room";
import { useTranslation } from "react-i18next";

export default function RoomTransfer() {
  const { toast } = useToast();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [availableRooms, setAvailableRooms] = useState<Room[]>([]);
  const [roomsLoading, setRoomsLoading] = useState(false);
  const [newRoomId, setNewRoomId] = useState<number | null>(null);
  const [transferDate, setTransferDate] = useState<Date | undefined>(new Date());
  const [transferTime, setTransferTime] = useState("12:00");
  const [transferReason, setTransferReason] = useState("guest_request");
  const [additionalCharge, setAdditionalCharge] = useState(false);
  const [chargeAmount, setChargeAmount] = useState<number | null>(null);
  const [transferNotes, setTransferNotes] = useState("");
  const [activeTab, setActiveTab] = useState("search");
  
  // Room list filters
  const [filterRoomType, setFilterRoomType] = useState<string>("");
  const [filterFloor, setFilterFloor] = useState<string>("");
  const [filterFeatures, setFilterFeatures] = useState<string[]>([]);
  const [showUnavailableRooms, setShowUnavailableRooms] = useState(false);

  // Get unique room types and floors for filtering
  const roomTypes = Array.from(new Set(availableRooms.map(room => room.roomType?.name)))
    .filter(Boolean) as string[];
  
  const floors = Array.from(new Set(availableRooms.map(room => room.floor)))
    .sort((a, b) => a - b) as number[];

  // Load available rooms
  useEffect(() => {
    const fetchRooms = async () => {
      setRoomsLoading(true);
      try {
        // In a real implementation, this would filter by date range as well
        let rooms;
        if (showUnavailableRooms) {
          rooms = await roomService.getRooms();
        } else {
          rooms = await roomService.getRoomsByStatus("vacant");
        }
        setAvailableRooms(rooms);
      } catch (error) {
        console.error("Error loading rooms:", error);
        toast({
          title: "Error",
          description: "Failed to load available rooms. Please try again.",
          variant: "destructive"
        });
      } finally {
        setRoomsLoading(false);
      }
    };

    fetchRooms();
  }, [toast, showUnavailableRooms]);

  // Search for bookings
  const handleSearch = async () => {
    if (!searchTerm) return;
    
    setIsLoading(true);
    try {
      // This is a mock implementation as we don't have a specific search endpoint
      const bookings = await bookingService.getBookings();
      const results = bookings.filter(booking => 
        booking.guest?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.guest?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.id.toString() === searchTerm ||
        booking.room?.roomNumber?.includes(searchTerm)
      );
      
      setSearchResults(results.filter(b => b.status === "CheckedIn"));
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
    setActiveTab("room-selection");
  };

  // Calculate price difference between rooms
  const calculatePriceDifference = () => {
    if (!selectedBooking || !newRoomId) return 0;
    
    const currentRoom = selectedBooking.room;
    const newRoom = availableRooms.find(room => room.id === newRoomId);
    
    if (!currentRoom || !newRoom) return 0;
    
    const currentPrice = currentRoom.basePrice || 0;
    const newPrice = newRoom.basePrice || 0;
    
    return newPrice > currentPrice ? newPrice - currentPrice : 0;
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
      setChargeAmount(null);
      setTransferNotes("");
      setActiveTab("search");
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

  // Filter available rooms
  const filteredRooms = availableRooms.filter(room => {
    return (
      (!filterRoomType || room.roomType?.name === filterRoomType) &&
      (!filterFloor || room.floor === Number(filterFloor))
    );
  });

  const reasons = [
    { value: "guest_request", label: t("guestRequest") },
    { value: "maintenance_issue", label: t("maintenanceIssue") },
    { value: "noise_complaint", label: t("noiseComplaint") },
    { value: "upgrade", label: t("upgrade") },
    { value: "downgrade", label: t("downgrade") },
    { value: "other", label: t("other") }
  ];

  return (
    <Layout>
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">{t("roomTransfer")}</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="search">{t("searchGuest")}</TabsTrigger>
            <TabsTrigger value="room-selection" disabled={!selectedBooking}>{t("selectRoom")}</TabsTrigger>
          </TabsList>

          {/* Search Tab */}
          <TabsContent value="search">
            <Card>
              <CardHeader>
                <CardTitle>{t("searchGuestOrBooking")}</CardTitle>
                <CardDescription>
                  {t("searchByGuestNameReservationNumberOrRoom")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <div className="flex-grow">
                    <Input
                      placeholder={t("searchPlaceholder")}
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
                    {t("search")}
                  </Button>
                </div>
                
                {/* Search Results */}
                {searchResults.length > 0 ? (
                  <div className="mt-4 border rounded-md overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>{t("booking")} #</TableHead>
                          <TableHead>{t("guest")}</TableHead>
                          <TableHead>{t("room")}</TableHead>
                          <TableHead>{t("checkIn")}</TableHead>
                          <TableHead>{t("checkOut")}</TableHead>
                          <TableHead>{t("status")}</TableHead>
                          <TableHead>{t("actions")}</TableHead>
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
                                variant="outline" 
                                size="sm"
                                onClick={() => handleSelectBooking(booking)}
                              >
                                {t("select")}
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : searchTerm && !isLoading ? (
                  <div className="mt-4 p-4 border rounded-md text-center text-muted-foreground">
                    {t("noCheckedInGuestsFound")}
                  </div>
                ) : null}
              </CardContent>
            </Card>
            
            {/* Guest Information - Even in search tab once selected */}
            {selectedBooking && (
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="bg-muted/30">
                    <CardTitle>{t("guestInformation")}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-semibold">{t("name")}:</span>
                        <span>{selectedBooking.guest?.firstName} {selectedBooking.guest?.lastName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-semibold">{t("booking")} #:</span>
                        <span>{selectedBooking.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-semibold">{t("status")}:</span>
                        <StatusBadge status={selectedBooking.status} />
                      </div>
                      {selectedBooking.guest?.phoneNumber && (
                        <div className="flex justify-between">
                          <span className="font-semibold">{t("phone")}:</span>
                          <span>{selectedBooking.guest.phoneNumber}</span>
                        </div>
                      )}
                      {selectedBooking.guest?.email && (
                        <div className="flex justify-between">
                          <span className="font-semibold">{t("email")}:</span>
                          <span className="truncate max-w-40">{selectedBooking.guest.email}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="bg-muted/30">
                    <CardTitle>{t("currentRoom")}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-semibold">{t("room")} #:</span>
                        <span>{selectedBooking.room?.roomNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-semibold">{t("roomType")}:</span>
                        <span>{selectedBooking.room?.roomType?.name || t("standard")}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-semibold">{t("floor")}:</span>
                        <span>{selectedBooking.room?.floor}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-semibold">{t("status")}:</span>
                        <StatusBadge status={selectedBooking.room?.status || "occupied"} />
                      </div>
                      <div className="flex justify-between">
                        <span className="font-semibold">{t("pricePerNight")}:</span>
                        <span>${selectedBooking.room?.basePrice?.toFixed(2)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="bg-muted/30">
                    <CardTitle>{t("bookingDetails")}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-semibold">{t("checkIn")}:</span>
                        <span>{new Date(selectedBooking.checkInDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-semibold">{t("checkOut")}:</span>
                        <span>{new Date(selectedBooking.checkOutDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-semibold">{t("nights")}:</span>
                        <span>
                          {Math.ceil((new Date(selectedBooking.checkOutDate).getTime() - 
                          new Date(selectedBooking.checkInDate).getTime()) / (1000 * 60 * 60 * 24))}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-semibold">{t("guests")}:</span>
                        <span>{selectedBooking.numberOfGuests || 1}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-semibold">{t("totalAmount")}:</span>
                        <span>${selectedBooking.totalAmount?.toFixed(2)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
          
          {/* Room Selection Tab */}
          <TabsContent value="room-selection">
            {selectedBooking && (
              <div className="space-y-6">
                {/* Room Filter Card */}
                <Card>
                  <CardHeader>
                    <CardTitle>{t("roomAvailability")}</CardTitle>
                    <CardDescription>{t("filterToFindAvailableRooms")}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <Label htmlFor="roomType" className="mb-1 block">{t("roomType")}</Label>
                        <Select
                          value={filterRoomType}
                          onValueChange={setFilterRoomType}
                        >
                          <SelectTrigger id="roomType">
                            <SelectValue placeholder={t("allRoomTypes")} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">{t("allRoomTypes")}</SelectItem>
                            {roomTypes.map((type) => (
                              <SelectItem key={type} value={type}>{type}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="floor" className="mb-1 block">{t("floor")}</Label>
                        <Select
                          value={filterFloor}
                          onValueChange={setFilterFloor}
                        >
                          <SelectTrigger id="floor">
                            <SelectValue placeholder={t("allFloors")} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">{t("allFloors")}</SelectItem>
                            {floors.map((floor) => (
                              <SelectItem key={floor} value={floor.toString()}>{t("floor")} {floor}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="transferDate" className="mb-1 block">{t("transferDate")}</Label>
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
                              {transferDate ? format(transferDate, "PPP") : <span>{t("pickDate")}</span>}
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
                      
                      <div className="flex flex-col space-y-2">
                        <Label className="mb-1">{t("showUnavailableRooms")}</Label>
                        <div className="flex items-center space-x-2 h-10">
                          <Switch
                            checked={showUnavailableRooms}
                            onCheckedChange={setShowUnavailableRooms}
                          />
                          <span>{showUnavailableRooms ? t("yes") : t("no")}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Available Rooms */}
                <Card>
                  <CardHeader>
                    <CardTitle>{t("selectNewRoom")}</CardTitle>
                    <CardDescription>{t("chooseRoomToTransferGuest")}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {roomsLoading ? (
                      <div className="flex justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                      </div>
                    ) : filteredRooms.length > 0 ? (
                      <div className="border rounded-md overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>{t("room")} #</TableHead>
                              <TableHead>{t("roomType")}</TableHead>
                              <TableHead>{t("floor")}</TableHead>
                              <TableHead>{t("status")}</TableHead>
                              <TableHead>{t("pricePerNight")}</TableHead>
                              <TableHead>{t("features")}</TableHead>
                              <TableHead>{t("actions")}</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filteredRooms.map((room) => {
                              const isAvailable = room.status === 'vacant';
                              return (
                                <TableRow key={room.id} className={!isAvailable ? "bg-muted/20" : ""}>
                                  <TableCell className="font-medium">{room.roomNumber}</TableCell>
                                  <TableCell>{room.roomType?.name || t("standard")}</TableCell>
                                  <TableCell>{room.floor}</TableCell>
                                  <TableCell>
                                    <StatusBadge status={room.status} />
                                  </TableCell>
                                  <TableCell>${room.basePrice?.toFixed(2)}</TableCell>
                                  <TableCell>
                                    <div className="flex flex-wrap gap-1">
                                      {room.hasOceanView && <Badge variant="outline">{t("oceanView")}</Badge>}
                                      {room.hasBalcony && <Badge variant="outline">{t("balcony")}</Badge>}
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <Button
                                      variant={newRoomId === room.id ? "default" : "outline"}
                                      size="sm"
                                      onClick={() => setNewRoomId(room.id)}
                                      disabled={!isAvailable && !showUnavailableRooms}
                                    >
                                      {newRoomId === room.id ? t("selected") : t("select")}
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        {t("noRoomsMatchFilters")}
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                {/* Transfer Form */}
                {selectedBooking && newRoomId && (
                  <Card>
                    <CardHeader>
                      <CardTitle>{t("transferDetails")}</CardTitle>
                      <CardDescription>{t("completeFormToTransfer")}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="transferTime">{t("transferTime")}</Label>
                            <Input
                              id="transferTime"
                              type="time"
                              value={transferTime}
                              onChange={(e) => setTransferTime(e.target.value)}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="transferReason">{t("reasonForTransfer")}</Label>
                            <Select
                              value={transferReason}
                              onValueChange={setTransferReason}
                            >
                              <SelectTrigger id="transferReason">
                                <SelectValue placeholder={t("selectReason")} />
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
                        </div>
                        
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label htmlFor="additionalCharge">{t("additionalCharge")}</Label>
                              <p className="text-sm text-muted-foreground">
                                {t("applyAdditionalChargeForTransfer")}
                              </p>
                            </div>
                            <Switch
                              id="additionalCharge"
                              checked={additionalCharge}
                              onCheckedChange={setAdditionalCharge}
                            />
                          </div>
                          
                          {additionalCharge && (
                            <div className="space-y-2">
                              <Label htmlFor="chargeAmount">{t("chargeAmount")}</Label>
                              <div className="flex items-center">
                                <span className="mr-2">$</span>
                                <Input
                                  id="chargeAmount"
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  value={chargeAmount?.toString() || calculatePriceDifference().toFixed(2)}
                                  onChange={(e) => setChargeAmount(parseFloat(e.target.value) || 0)}
                                />
                              </div>
                              <p className="text-xs text-muted-foreground">
                                {t("suggestedAmount")}: ${calculatePriceDifference().toFixed(2)} ({t("priceDifference")})
                              </p>
                            </div>
                          )}
                        </div>
                        
                        <div className="md:col-span-2 space-y-2">
                          <Label htmlFor="transferNotes">{t("notes")}</Label>
                          <Textarea
                            id="transferNotes"
                            placeholder={t("enterAdditionalNotesAboutTransfer")}
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
                          onClick={() => setActiveTab("search")}
                          disabled={isLoading}
                        >
                          <X className="h-4 w-4 mr-2" />
                          {t("cancel")}
                        </Button>
                        <Button onClick={handleTransfer} disabled={isLoading || !newRoomId}>
                          {isLoading ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <Check className="h-4 w-4 mr-2" />
                          )}
                          {t("confirmTransfer")}
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
