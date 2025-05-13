import { Layout } from "@/components/layout/Layout";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from "date-fns";
import { cn } from "@/lib/utils";
import { 
  CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Edit, 
  Eye, 
  Loader2
} from "lucide-react";
import { roomService } from "@/services/roomService";
import { bookingService } from "@/services/bookingService";
import { Badge } from "@/components/ui/badge";

type ViewMode = "day" | "week" | "month";

interface BookingWithRoom {
  id: number;
  roomId: number;
  status: string;
  checkInDate: string;
  checkOutDate: string;
  guest?: {
    firstName: string;
    lastName: string;
  };
  room?: {
    roomNumber: string;
  };
}

interface Room {
  id: number;
  roomNumber: string;
  floor: number;
  status: string;
  roomType?: {
    name: string;
  };
}

export default function RoomCalendar() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("week");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [visibleDates, setVisibleDates] = useState<Date[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [bookings, setBookings] = useState<BookingWithRoom[]>([]);
  const [filterRoomType, setFilterRoomType] = useState<string | null>(null);
  const [filterFloor, setFilterFloor] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  
  // Get unique room types and floors for filtering
  const roomTypes = Array.from(new Set(rooms.map(room => room.roomType?.name)))
    .filter(Boolean) as string[];
  
  const floors = Array.from(new Set(rooms.map(room => room.floor)))
    .sort((a, b) => a - b) as number[];

  // Update visible dates when the selected date or view mode changes
  useEffect(() => {
    let dates: Date[] = [];
    let weekStart: Date;
    let weekEnd: Date;
    
    switch (viewMode) {
      case 'day':
        dates = [selectedDate];
        break;
      case 'week':
        weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 }); // Monday
        weekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 }); // Sunday
        dates = eachDayOfInterval({ start: weekStart, end: weekEnd });
        break;
      case 'month':
        // For simplicity, we'll just show 30 days starting today
        dates = Array.from({ length: 30 }, (_, i) => addDays(selectedDate, i));
        break;
    }
    
    setVisibleDates(dates);
  }, [selectedDate, viewMode]);

  // Load rooms and bookings
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const allRooms = await roomService.getRooms();
        const allBookings = await bookingService.getBookings();
        
        setRooms(allRooms);
        setBookings(allBookings);
      } catch (error) {
        console.error("Error loading data:", error);
        toast({
          title: "Error",
          description: "Failed to load room and booking data. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  // Filter rooms based on selected filters
  const filteredRooms = rooms.filter(room => {
    return (
      (filterRoomType === "all" || !filterRoomType || room.roomType?.name === filterRoomType) &&
      (filterFloor === "all" || !filterFloor || room.floor === Number(filterFloor)) &&
      (filterStatus === "all" || !filterStatus || room.status === filterStatus)
    );
  });

  // Navigate to previous/next period
  const navigatePeriod = (direction: 'prev' | 'next') => {
    const daysToShift = viewMode === 'day' ? 1 : viewMode === 'week' ? 7 : 30;
    const days = direction === 'prev' ? -daysToShift : daysToShift;
    setSelectedDate(addDays(selectedDate, days));
  };

  // Check if a room has a booking on a specific date
  const getBookingForRoomOnDate = (roomId: number, date: Date) => {
    return bookings.find(booking => {
      const checkInDate = new Date(booking.checkInDate);
      const checkOutDate = new Date(booking.checkOutDate);
      
      return (
        booking.roomId === roomId &&
        date >= checkInDate &&
        date < checkOutDate
      );
    });
  };

  // Get status color class
  const getStatusColorClass = (status: string) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'CheckedIn':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'CheckedOut':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'NoShow':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'maintenance':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-blue-50 text-blue-800 border-blue-100';
    }
  };

  // View booking details
  const handleViewBooking = (booking: BookingWithRoom) => {
    // In a real app, this would navigate to the booking details page or open a modal
    toast({
      title: `Booking #${booking.id}`,
      description: `Guest: ${booking.guest?.firstName} ${booking.guest?.lastName}, Room: ${booking.room?.roomNumber}`,
    });
  };

  return (
    <Layout>
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">Room Calendar</h1>
        
        {/* Calendar Controls */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <CardTitle>Room Occupancy Calendar</CardTitle>
                <CardDescription>View and manage room bookings</CardDescription>
              </div>
              
              <div className="flex flex-wrap items-center gap-2">
                {/* Date Picker */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4" />
                      <span>{format(selectedDate, 'PP')}</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 z-50">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => date && setSelectedDate(date)}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                
                {/* Navigation */}
                <div className="flex items-center gap-1">
                  <Button variant="outline" size="icon" onClick={() => navigatePeriod('prev')}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => navigatePeriod('next')}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                
                {/* View Mode */}
                <Select
                  value={viewMode}
                  onValueChange={(value) => setViewMode(value as ViewMode)}
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="View" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="day">Day</SelectItem>
                    <SelectItem value="week">Week</SelectItem>
                    <SelectItem value="month">Month</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="flex flex-col md:flex-row gap-3 mb-6">
              {/* Room Type Filter */}
              <Select
                value={filterRoomType || ""}
                onValueChange={(value) => setFilterRoomType(value || null)}
              >
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="All Room Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Room Types</SelectItem>
                  {roomTypes.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {/* Floor Filter */}
              <Select
                value={filterFloor || ""}
                onValueChange={(value) => setFilterFloor(value || null)}
              >
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="All Floors" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Floors</SelectItem>
                  {floors.map((floor) => (
                    <SelectItem key={floor} value={floor.toString()}>Floor {floor}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {/* Status Filter */}
              <Select
                value={filterStatus || ""}
                onValueChange={(value) => setFilterStatus(value || null)}
              >
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="vacant">Available</SelectItem>
                  <SelectItem value="occupied">Occupied</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="cleaning">Cleaning</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="flex-grow"></div>
              
              {/* Legend */}
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">Booked</Badge>
                <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Checked-in</Badge>
                <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">Cancelled</Badge>
                <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200">No-Show</Badge>
                <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-200">Maintenance</Badge>
              </div>
            </div>
            
            {/* Calendar Grid */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse min-w-[800px]">
                {/* Date Headers */}
                <thead>
                  <tr>
                    <th className="border bg-muted/50 p-2 w-36">Room</th>
                    {visibleDates.map((date) => (
                      <th key={date.toISOString()} className="border bg-muted/50 p-2 whitespace-nowrap">
                        <div className="font-medium">{format(date, 'EEEE')}</div>
                        <div>{format(date, 'MMM d')}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={visibleDates.length + 1} className="text-center p-8">
                        <div className="flex justify-center">
                          <Loader2 className="h-6 w-6 animate-spin" />
                        </div>
                        <div className="mt-2">Loading room data...</div>
                      </td>
                    </tr>
                  ) : filteredRooms.length === 0 ? (
                    <tr>
                      <td colSpan={visibleDates.length + 1} className="text-center p-8">
                        <div className="text-muted-foreground">No rooms match the selected filters</div>
                      </td>
                    </tr>
                  ) : (
                    filteredRooms.map((room) => (
                      <tr key={room.id}>
                        {/* Room Info */}
                        <td className="border p-2">
                          <div className="flex flex-col">
                            <span className="font-medium">{room.roomNumber}</span>
                            <span className="text-sm text-muted-foreground">
                              {room.roomType?.name || "Standard"} 
                              {room.floor && ` • Floor ${room.floor}`}
                            </span>
                          </div>
                        </td>
                        
                        {/* Days/Bookings */}
                        {visibleDates.map((date) => {
                          const booking = getBookingForRoomOnDate(room.id, date);
                          
                          return (
                            <td key={date.toISOString()} className={cn(
                              "border p-1 h-16",
                              room.status === 'maintenance' && 'bg-orange-50',
                              room.status === 'cleaning' && 'bg-blue-50',
                              isSameDay(date, new Date()) && 'bg-blue-50/30',
                            )}>
                              {booking ? (
                                <div className={cn(
                                  "h-full p-1 rounded-md border text-xs",
                                  getStatusColorClass(booking.status)
                                )}>
                                  <div className="flex justify-between mb-1">
                                    <span className="font-bold">#{booking.id}</span>
                                    <div className="flex gap-1">
                                      <button onClick={() => handleViewBooking(booking)} className="hover:text-blue-700">
                                        <Eye className="h-3.5 w-3.5" />
                                      </button>
                                      <button onClick={() => handleViewBooking(booking)} className="hover:text-blue-700">
                                        <Edit className="h-3.5 w-3.5" />
                                      </button>
                                    </div>
                                  </div>
                                  <div className="truncate">
                                    {booking.guest?.firstName} {booking.guest?.lastName}
                                  </div>
                                </div>
                              ) : (
                                <div className="h-full flex items-center justify-center text-muted-foreground text-xs">
                                  {room.status === 'vacant' && 'Available'}
                                  {room.status === 'maintenance' && 'Maintenance'}
                                  {room.status === 'cleaning' && 'Cleaning'}
                                </div>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
