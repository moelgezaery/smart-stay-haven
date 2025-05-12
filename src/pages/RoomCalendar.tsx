import { Layout } from "@/components/layout/Layout";
import { useState, useEffect, useMemo } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import { Calendar } from "@/components/ui/calendar";
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, subDays, startOfMonth, endOfMonth, differenceInDays } from "date-fns";
import { cn } from "@/lib/utils";
import { 
  CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Edit, 
  Eye, 
  Loader2,
  Plus,
  FileEdit,
  Trash2,
  ClipboardEdit,
  Bell,
  HardHat,
  FileText,
  CalendarClock
} from "lucide-react";
import { roomService } from "@/services/roomService";
import { bookingService } from "@/services/bookingService";
import { housekeepingService } from "@/services/housekeepingService";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

type ViewMode = "day" | "week" | "month";
type BookingWithRoom = any; // In a real app, this would be properly typed

export default function RoomCalendar() {
  const { toast } = useToast();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("week");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [visibleDates, setVisibleDates] = useState<Date[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [bookings, setBookings] = useState<BookingWithRoom[]>([]);
  const [housekeepingTasks, setHousekeepingTasks] = useState<any[]>([]);
  const [filterRoomType, setFilterRoomType] = useState<string | null>(null);
  const [filterFloor, setFilterFloor] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const [groupBy, setGroupBy] = useState<"roomType" | "floor">("roomType");
  
  // Get unique room types and floors for filtering
  const roomTypes = Array.from(new Set(rooms.map(room => room.roomType?.name)))
    .filter(Boolean) as string[];
  
  const floors = Array.from(new Set(rooms.map(room => room.floor)))
    .sort((a, b) => a - b) as number[];

  // Calculate all groups based on groupBy selection
  const groupedRooms = useMemo(() => {
    const groups: {[key: string]: any[]} = {};
    
    if (groupBy === "roomType") {
      roomTypes.forEach(type => {
        groups[type] = filteredRooms.filter(room => room.roomType?.name === type);
      });
    } else {
      floors.forEach(floor => {
        groups[`Floor ${floor}`] = filteredRooms.filter(room => room.floor === floor);
      });
    }
    
    return groups;
  }, [rooms, filteredRooms, groupBy, roomTypes, floors]);

  // Update visible dates when the selected date or view mode changes
  useEffect(() => {
    let dates: Date[] = [];
    
    switch (viewMode) {
      case 'day':
        dates = [selectedDate];
        break;
      case 'week':
        const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 }); // Monday
        const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 }); // Sunday
        dates = eachDayOfInterval({ start: weekStart, end: weekEnd });
        break;
      case 'month':
        const monthStart = startOfMonth(selectedDate);
        const monthEnd = endOfMonth(selectedDate);
        dates = eachDayOfInterval({ start: monthStart, end: monthEnd });
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
        const allHousekeepingTasks = await housekeepingService.getTasks();
        
        setRooms(allRooms);
        setBookings(allBookings);
        setHousekeepingTasks(allHousekeepingTasks);
      } catch (error) {
        console.error("Error loading data:", error);
        toast({
          title: t("error"),
          description: t("failedToLoadRoomAndBookingData"),
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [toast, t]);

  // Filter rooms based on selected filters
  const filteredRooms = rooms.filter(room => {
    return (
      (!filterRoomType || room.roomType?.name === filterRoomType) &&
      (!filterFloor || room.floor === Number(filterFloor)) &&
      (!filterStatus || room.status === filterStatus)
    );
  });

  // Navigate to previous/next period
  const navigatePeriod = (direction: 'prev' | 'next') => {
    let daysToShift: number;
    
    switch (viewMode) {
      case 'day':
        daysToShift = 1;
        break;
      case 'week':
        daysToShift = 7;
        break;
      case 'month':
        daysToShift = 30;
        break;
      default:
        daysToShift = 1;
    }
    
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

  // Check if a room has a housekeeping task on a specific date
  const getHousekeepingTaskForRoomOnDate = (roomId: number, date: Date) => {
    return housekeepingTasks.find(task => {
      const scheduledDate = new Date(task.scheduledDate);
      return task.roomId === roomId && isSameDay(scheduledDate, date);
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

  // Handle booking click
  const handleBookingClick = (booking: any) => {
    setSelectedBooking(booking);
    setBookingDialogOpen(true);
  };

  // Handle action click
  const handleActionClick = (action: string) => {
    setActiveAction(action);
    
    if (action === 'new-booking') {
      navigate('/reservations');
      return;
    }
    
    if (!selectedBooking) return;
    
    switch (action) {
      case 'view-booking':
        // Navigate to booking details page
        toast({
          title: t("viewingBooking"),
          description: `${t("booking")} #${selectedBooking.id}`,
        });
        break;
      case 'edit-booking':
        navigate(`/reservations?edit=${selectedBooking.id}`);
        break;
      case 'assign-housekeeping':
        navigate(`/housekeeping?room=${selectedBooking.roomId}`);
        break;
      case 'mark-maintenance':
        navigate(`/maintenance?room=${selectedBooking.roomId}`);
        break;
      default:
        break;
    }
    
    setBookingDialogOpen(false);
    setActiveAction(null);
  };

  // Generate the timeline display for a room
  const renderRoomTimeline = (room: any) => {
    return visibleDates.map((date) => {
      const booking = getBookingForRoomOnDate(room.id, date);
      const housekeepingTask = getHousekeepingTaskForRoomOnDate(room.id, date);
      
      return (
        <td 
          key={date.toISOString()} 
          className={cn(
            "border p-1 h-16 min-w-[120px]",
            room.status === 'maintenance' && 'bg-orange-50',
            room.status === 'cleaning' && 'bg-blue-50',
            isSameDay(date, new Date()) && 'bg-blue-50/30',
          )}
        >
          {booking ? (
            <div 
              className={cn(
                "h-full p-1 rounded-md border text-xs cursor-pointer hover:shadow-md transition-shadow",
                getStatusColorClass(booking.status)
              )}
              onClick={() => handleBookingClick(booking)}
            >
              <div className="flex justify-between mb-1">
                <span className="font-bold">#{booking.id}</span>
                <div className="flex gap-1">
                  <button className="hover:text-blue-700">
                    <Eye className="h-3.5 w-3.5" />
                  </button>
                  <button className="hover:text-blue-700">
                    <Edit className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
              <div className="truncate">
                {booking.guest?.firstName} {booking.guest?.lastName}
              </div>
              <div className="text-[10px] mt-1 flex items-center justify-between">
                <div>
                  {format(new Date(booking.checkInDate), 'MM/dd')} - {format(new Date(booking.checkOutDate), 'MM/dd')}
                </div>
                <Badge variant="outline" className="text-[9px] h-4 px-1">
                  {differenceInDays(new Date(booking.checkOutDate), new Date(booking.checkInDate))} {t("nights")}
                </Badge>
              </div>
            </div>
          ) : housekeepingTask ? (
            <div className="h-full flex flex-col p-1 rounded-md border text-xs bg-yellow-50 text-yellow-800 border-yellow-200 cursor-pointer hover:shadow-md transition-shadow">
              <div className="font-semibold">{t("housekeeping")}</div>
              <div className="text-[10px]">{housekeepingTask.status}</div>
              <div className="text-[10px] mt-auto">{housekeepingTask.cleaningType}</div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground text-xs">
              {room.status === 'vacant' && t("available")}
              {room.status === 'maintenance' && t("maintenance")}
              {room.status === 'cleaning' && t("cleaning")}
              {room.status === 'occupied' && t("occupied")}
            </div>
          )}
        </td>
      );
    });
  };

  return (
    <Layout>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-3xl font-bold">{t("roomCalendar")}</h1>
          
          <div className="flex flex-wrap items-center gap-2">
            <Button onClick={() => handleActionClick('new-booking')} size="sm" className="h-9">
              <Plus className="h-4 w-4 mr-1" />
              {t("newBooking")}
            </Button>
          </div>
        </div>
        
        {/* Calendar Controls */}
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <CardTitle>{t("roomOccupancyCalendar")}</CardTitle>
                <CardDescription>{t("viewAndManageRoomBookings")}</CardDescription>
              </div>
              
              <div className="flex flex-wrap items-center gap-2">
                {/* Date Picker */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2 h-9">
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
                  <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => navigatePeriod('prev')}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => navigatePeriod('next')}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                
                {/* View Mode */}
                <Select
                  value={viewMode}
                  onValueChange={(value) => setViewMode(value as ViewMode)}
                >
                  <SelectTrigger className="w-[100px] h-9">
                    <SelectValue placeholder={t("view")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="day">{t("day")}</SelectItem>
                    <SelectItem value="week">{t("week")}</SelectItem>
                    <SelectItem value="month">{t("month")}</SelectItem>
                  </SelectContent>
                </Select>

                {/* Group By */}
                <Select
                  value={groupBy}
                  onValueChange={(value) => setGroupBy(value as "roomType" | "floor")}
                >
                  <SelectTrigger className="w-[120px] h-9">
                    <SelectValue placeholder={t("groupBy")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="roomType">{t("roomType")}</SelectItem>
                    <SelectItem value="floor">{t("floor")}</SelectItem>
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
                  <SelectValue placeholder={t("allRoomTypes")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">{t("allRoomTypes")}</SelectItem>
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
                  <SelectValue placeholder={t("allFloors")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">{t("allFloors")}</SelectItem>
                  {floors.map((floor) => (
                    <SelectItem key={floor} value={floor.toString()}>{t("floor")} {floor}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {/* Status Filter */}
              <Select
                value={filterStatus || ""}
                onValueChange={(value) => setFilterStatus(value || null)}
              >
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder={t("allStatuses")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">{t("allStatuses")}</SelectItem>
                  <SelectItem value="vacant">{t("available")}</SelectItem>
                  <SelectItem value="occupied">{t("occupied")}</SelectItem>
                  <SelectItem value="maintenance">{t("maintenance")}</SelectItem>
                  <SelectItem value="cleaning">{t("cleaning")}</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="flex-grow"></div>
              
              {/* Legend */}
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">{t("booked")}</Badge>
                <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">{t("checkedIn")}</Badge>
                <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">{t("cancelled")}</Badge>
                <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200">{t("noShow")}</Badge>
                <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">{t("housekeeping")}</Badge>
                <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-200">{t("maintenance")}</Badge>
              </div>
            </div>
            
            {/* Calendar Grid */}
            <div className="overflow-x-auto">
              {isLoading ? (
                <div className="text-center p-8">
                  <div className="flex justify-center">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                  <div className="mt-2">{t("loadingRoomData")}</div>
                </div>
              ) : filteredRooms.length === 0 ? (
                <div className="text-center p-8">
                  <div className="text-muted-foreground">{t("noRoomsMatchFilters")}</div>
                </div>
              ) : (
                <div className="space-y-8">
                  {/* Render each group separately */}
                  {Object.entries(groupedRooms).map(([groupName, roomsInGroup]) => (
                    <div key={groupName} className="space-y-2">
                      <h3 className="text-lg font-semibold">{groupName}</h3>
                      
                      <table className="w-full border-collapse min-w-[800px]">
                        {/* Date Headers */}
                        <thead>
                          <tr>
                            <th className="border bg-muted/50 p-2 w-36">{t("room")}</th>
                            {visibleDates.map((date) => (
                              <th key={date.toISOString()} className="border bg-muted/50 p-2 whitespace-nowrap">
                                <div className="font-medium">{format(date, 'EEEE')}</div>
                                <div>{format(date, 'MMM d')}</div>
                              </th>
                            ))}
                          </tr>
                        </thead>
                        
                        <tbody>
                          {roomsInGroup.map((room) => (
                            <tr key={room.id}>
                              {/* Room Info */}
                              <td className="border p-2">
                                <div className="flex flex-col">
                                  <span className="font-medium">{room.roomNumber}</span>
                                  <span className="text-sm text-muted-foreground">
                                    {room.roomType?.name || t("standard")} 
                                    {room.floor && ` • ${t("floor")} ${room.floor}`}
                                  </span>
                                </div>
                              </td>
                              
                              {/* Days/Bookings */}
                              {renderRoomTimeline(room)}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Booking Details Dialog */}
        <Dialog open={bookingDialogOpen} onOpenChange={setBookingDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            {selectedBooking && (
              <>
                <DialogHeader>
                  <DialogTitle>{t("booking")} #{selectedBooking.id}</DialogTitle>
                  <DialogDescription>
                    {t("bookingDetailsFor")} {selectedBooking.guest?.firstName} {selectedBooking.guest?.lastName}
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid grid-cols-2 gap-4 py-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{t("guest")}</p>
                    <p className="text-sm">{selectedBooking.guest?.firstName} {selectedBooking.guest?.lastName}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{t("room")}</p>
                    <p className="text-sm">{selectedBooking.room?.roomNumber} - {selectedBooking.room?.roomType?.name}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{t("checkIn")}</p>
                    <p className="text-sm">{format(new Date(selectedBooking.checkInDate), 'PP')}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{t("checkOut")}</p>
                    <p className="text-sm">{format(new Date(selectedBooking.checkOutDate), 'PP')}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{t("status")}</p>
                    <p className="text-sm">
                      <StatusBadge status={selectedBooking.status} />
                    </p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{t("amount")}</p>
                    <p className="text-sm">${selectedBooking.totalAmount?.toFixed(2)}</p>
                  </div>
                </div>
                
                <Tabs defaultValue="actions">
                  <TabsList className="grid grid-cols-2">
                    <TabsTrigger value="actions">{t("actions")}</TabsTrigger>
                    <TabsTrigger value="details">{t("details")}</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="actions" className="py-2">
                    <div className="grid grid-cols-2 gap-2">
                      <Button 
                        variant="outline"
                        size="sm" 
                        onClick={() => handleActionClick('view-booking')}
                        className="justify-start"
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        {t("viewDetails")}
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleActionClick('edit-booking')}
                        className="justify-start"
                      >
                        <FileEdit className="h-4 w-4 mr-2" />
                        {t("editBooking")}
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleActionClick('assign-housekeeping')}
                        className="justify-start"
                      >
                        <ClipboardEdit className="h-4 w-4 mr-2" />
                        {t("assignHousekeeping")}
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleActionClick('mark-maintenance')}
                        className="justify-start"
                      >
                        <HardHat className="h-4 w-4 mr-2" />
                        {t("markMaintenance")}
                      </Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="details" className="py-2">
                    <div className="space-y-2">
                      <div>
                        <p className="text-sm font-medium">{t("guestContact")}</p>
                        <p className="text-xs text-muted-foreground">{selectedBooking.guest?.email}</p>
                        <p className="text-xs text-muted-foreground">{selectedBooking.guest?.phoneNumber}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium">{t("specialRequests")}</p>
                        <p className="text-xs text-muted-foreground">
                          {selectedBooking.specialRequests || t("noSpecialRequests")}
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium">{t("paymentStatus")}</p>
                        <p className="text-xs">
                          <Badge variant="outline" className={
                            selectedBooking.paymentStatus === "Paid" 
                              ? "bg-green-100 text-green-800 border-green-200"
                              : "bg-yellow-100 text-yellow-800 border-yellow-200"
                          }>
                            {selectedBooking.paymentStatus || t("pending")}
                          </Badge>
                        </p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
                
                <DialogFooter>
                  <Button onClick={() => setBookingDialogOpen(false)} variant="outline">
                    {t("close")}
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
