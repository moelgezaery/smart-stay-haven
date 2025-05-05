
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { CalendarIcon, Download, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import { DateRange } from "react-day-picker";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

// Mock data for occupancy report
const occupancyData = [
  { date: '05/01', occupancyRate: 72, availableRooms: 28 },
  { date: '05/02', occupancyRate: 78, availableRooms: 22 },
  { date: '05/03', occupancyRate: 85, availableRooms: 15 },
  { date: '05/04', occupancyRate: 90, availableRooms: 10 },
  { date: '05/05', occupancyRate: 87, availableRooms: 13 },
  { date: '05/06', occupancyRate: 75, availableRooms: 25 },
  { date: '05/07', occupancyRate: 68, availableRooms: 32 },
];

// Mock data for revenue report
const revenueData = [
  { date: '05/01', roomRevenue: 5200, fbRevenue: 1800, otherRevenue: 500 },
  { date: '05/02', roomRevenue: 5800, fbRevenue: 2100, otherRevenue: 600 },
  { date: '05/03', roomRevenue: 6300, fbRevenue: 2500, otherRevenue: 700 },
  { date: '05/04', roomRevenue: 6800, fbRevenue: 2700, otherRevenue: 800 },
  { date: '05/05', roomRevenue: 6500, fbRevenue: 2400, otherRevenue: 750 },
  { date: '05/06', roomRevenue: 5600, fbRevenue: 2000, otherRevenue: 550 },
  { date: '05/07', roomRevenue: 4900, fbRevenue: 1700, otherRevenue: 480 },
];

// Mock data for room type distribution
const roomTypeData = [
  { name: 'Standard Single', value: 15 },
  { name: 'Standard Double', value: 25 },
  { name: 'Deluxe Double', value: 20 },
  { name: 'Junior Suite', value: 15 },
  { name: 'Executive Suite', value: 5 },
  { name: 'Presidential Suite', value: 2 },
];

// Colors for the pie chart
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export default function Reports() {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(2025, 4, 1), // May 1, 2025
    to: new Date(2025, 4, 7),   // May 7, 2025
  });
  
  const [reportName, setReportName] = useState("");
  const [reportCategory, setReportCategory] = useState("");
  const [reportFormat, setReportFormat] = useState("");
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [activeReport, setActiveReport] = useState<{
    name: string;
    category: string;
    format: string;
    data: any[];
  } | null>(null);
  
  const handleFieldToggle = (field: string) => {
    setSelectedFields(prev => 
      prev.includes(field) 
        ? prev.filter(f => f !== field)
        : [...prev, field]
    );
  };
  
  const handlePreviewReport = () => {
    if (!reportName || !reportCategory || !reportFormat || selectedFields.length === 0) {
      toast.error("Please fill all required fields and select at least one data field");
      return;
    }
    
    let previewData;
    
    switch (reportCategory) {
      case "occupancy":
        previewData = occupancyData;
        break;
      case "revenue":
        previewData = revenueData;
        break;
      case "guests":
        previewData = [
          { date: '05/01', businessGuests: 45, leisureGuests: 35, groupGuests: 15, others: 5 },
          { date: '05/02', businessGuests: 50, leisureGuests: 30, groupGuests: 10, others: 10 },
          { date: '05/03', businessGuests: 40, leisureGuests: 45, groupGuests: 10, others: 5 },
          { date: '05/04', businessGuests: 35, leisureGuests: 50, groupGuests: 10, others: 5 },
        ];
        break;
      case "operations":
        previewData = [
          { date: '05/01', maintenanceIssues: 5, cleaningTasks: 25, guestRequests: 15 },
          { date: '05/02', maintenanceIssues: 3, cleaningTasks: 28, guestRequests: 12 },
          { date: '05/03', maintenanceIssues: 7, cleaningTasks: 22, guestRequests: 18 },
          { date: '05/04', maintenanceIssues: 4, cleaningTasks: 26, guestRequests: 10 },
        ];
        break;
      default:
        previewData = [];
    }
    
    setActiveReport({
      name: reportName,
      category: reportCategory,
      format: reportFormat,
      data: previewData
    });
    
    setShowPreview(true);
    toast.success("Report preview generated");
  };
  
  const handleSaveReport = () => {
    if (!reportName || !reportCategory || !reportFormat || selectedFields.length === 0) {
      toast.error("Please fill all required fields and select at least one data field");
      return;
    }
    
    toast.success(`Report "${reportName}" saved successfully`);
  };
  
  const handleRunSavedReport = (report: { name: string; category: string; lastRun: string }) => {
    let reportData;
    
    switch (report.category) {
      case "Revenue":
        reportData = revenueData;
        break;
      case "Occupancy":
        reportData = occupancyData;
        break;
      case "Guest Analytics":
        reportData = [
          { date: '05/01', businessGuests: 45, leisureGuests: 35, groupGuests: 15, others: 5 },
          { date: '05/02', businessGuests: 50, leisureGuests: 30, groupGuests: 10, others: 10 },
          { date: '05/03', businessGuests: 40, leisureGuests: 45, groupGuests: 10, others: 5 },
          { date: '05/04', businessGuests: 35, leisureGuests: 50, groupGuests: 10, others: 5 },
        ];
        break;
      default:
        reportData = [];
    }
    
    setActiveReport({
      name: report.name,
      category: report.category,
      format: "table", // Default to table for saved reports
      data: reportData
    });
    
    setShowPreview(true);
    toast.success(`Report "${report.name}" generated`);
  };
  
  const renderReportPreview = () => {
    if (!activeReport) return null;
    
    const { format: reportFormat, data, name } = activeReport;
    
    switch (reportFormat) {
      case "table":
        return (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>{name}</CardTitle>
              <CardDescription>Generated on {format(new Date(), "PPP")}</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    {Object.keys(data[0] || {}).map((key) => (
                      <TableHead key={key}>{key}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((row, rowIndex) => (
                    <TableRow key={rowIndex}>
                      {Object.values(row).map((value, valueIndex) => (
                        <TableCell key={valueIndex}>{value as React.ReactNode}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        );
      
      case "bar":
        return (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>{name}</CardTitle>
              <CardDescription>Generated on {format(new Date(), "PPP")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {Object.keys(data[0] || {})
                      .filter(key => key !== "date")
                      .map((key, index) => (
                        <Bar 
                          key={key}
                          dataKey={key} 
                          fill={COLORS[index % COLORS.length]} 
                          name={key}
                        />
                      ))}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        );
        
      case "line":
        return (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>{name}</CardTitle>
              <CardDescription>Generated on {format(new Date(), "PPP")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {Object.keys(data[0] || {})
                      .filter(key => key !== "date")
                      .map((key, index) => (
                        <Line 
                          key={key}
                          type="monotone" 
                          dataKey={key} 
                          stroke={COLORS[index % COLORS.length]} 
                          name={key}
                        />
                      ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        );
        
      case "pie":
        return (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>{name}</CardTitle>
              <CardDescription>Generated on {format(new Date(), "PPP")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.map((item: any) => ({
                        name: item.name || item.date,
                        value: Object.values(item)[1] as number
                      }))}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {data.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        );
        
      default:
        return (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>{name}</CardTitle>
              <CardDescription>Unable to render this report format</CardDescription>
            </CardHeader>
          </Card>
        );
    }
  };
  
  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Reports & Analytics</h1>
        
        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[300px] justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(dateRange.from, "LLL dd, y")
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
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={setDateRange}
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
          
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col">
              <p className="text-sm text-muted-foreground">Average Occupancy</p>
              <p className="text-3xl font-semibold">79.3%</p>
              <p className="text-sm text-green-600">+5.2% from last week</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col">
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <p className="text-3xl font-semibold">$41,130</p>
              <p className="text-sm text-green-600">+12.5% from last week</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col">
              <p className="text-sm text-muted-foreground">Average Daily Rate</p>
              <p className="text-3xl font-semibold">$142.50</p>
              <p className="text-sm text-green-600">+3.8% from last week</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="occupancy" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="occupancy">Occupancy</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="guestAnalytics">Guest Analytics</TabsTrigger>
          <TabsTrigger value="custom">Custom Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="occupancy" className="mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Occupancy Rate</CardTitle>
                <CardDescription>Daily occupancy percentage over selected period</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={occupancyData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="occupancyRate" name="Occupancy Rate (%)" stroke="#8884d8" activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Room Type Distribution</CardTitle>
                <CardDescription>Occupied rooms by room type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={roomTypeData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {roomTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Room Availability</CardTitle>
                <CardDescription>Number of available rooms per day</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={occupancyData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="availableRooms" name="Available Rooms" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="revenue" className="mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Revenue Breakdown</CardTitle>
                <CardDescription>Daily revenue by category over selected period</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={revenueData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip formatter={(value) => `$${value}`} />
                      <Legend />
                      <Bar dataKey="roomRevenue" name="Room Revenue" stackId="a" fill="#8884d8" />
                      <Bar dataKey="fbRevenue" name="F&B Revenue" stackId="a" fill="#82ca9d" />
                      <Bar dataKey="otherRevenue" name="Other Revenue" stackId="a" fill="#ffc658" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Revenue Trends</CardTitle>
                <CardDescription>Daily total revenue trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={revenueData.map(item => ({
                        date: item.date,
                        totalRevenue: item.roomRevenue + item.fbRevenue + item.otherRevenue
                      }))}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip formatter={(value) => `$${value}`} />
                      <Legend />
                      <Line type="monotone" dataKey="totalRevenue" name="Total Revenue" stroke="#8884d8" activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Revenue Sources</CardTitle>
                <CardDescription>Revenue breakdown by source</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Room Revenue', value: revenueData.reduce((sum, item) => sum + item.roomRevenue, 0) },
                          { name: 'F&B Revenue', value: revenueData.reduce((sum, item) => sum + item.fbRevenue, 0) },
                          { name: 'Other Revenue', value: revenueData.reduce((sum, item) => sum + item.otherRevenue, 0) },
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        <Cell fill="#8884d8" />
                        <Cell fill="#82ca9d" />
                        <Cell fill="#ffc658" />
                      </Pie>
                      <Tooltip formatter={(value) => `$${value}`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="guestAnalytics" className="mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Guest Demographics</CardTitle>
                <CardDescription>Breakdown of guest demographics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Business', value: 45 },
                          { name: 'Leisure', value: 35 },
                          { name: 'Group', value: 15 },
                          { name: 'Others', value: 5 },
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {COLORS.map((color, index) => (
                          <Cell key={`cell-${index}`} fill={color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Booking Sources</CardTitle>
                <CardDescription>Where bookings are coming from</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Direct Website', value: 30 },
                          { name: 'OTAs', value: 40 },
                          { name: 'Phone/Email', value: 15 },
                          { name: 'Travel Agents', value: 10 },
                          { name: 'Walk-in', value: 5 },
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {COLORS.map((color, index) => (
                          <Cell key={`cell-${index}`} fill={color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Guest Satisfaction</CardTitle>
                <CardDescription>Average ratings by category (out of 5)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { category: 'Room Cleanliness', rating: 4.7 },
                        { category: 'Staff Friendliness', rating: 4.8 },
                        { category: 'Location', rating: 4.5 },
                        { category: 'Food & Beverage', rating: 4.3 },
                        { category: 'Value for Money', rating: 4.2 },
                        { category: 'Overall Experience', rating: 4.6 },
                      ]}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 40,
                        bottom: 5,
                      }}
                      layout="vertical"
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" domain={[0, 5]} />
                      <YAxis dataKey="category" type="category" width={150} />
                      <Tooltip />
                      <Bar dataKey="rating" name="Rating" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="custom" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Custom Report Builder</CardTitle>
              <CardDescription>Create and save custom reports</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label htmlFor="reportName" className="text-sm font-medium">Report Name</label>
                  <Input 
                    id="reportName" 
                    placeholder="Enter report name" 
                    value={reportName}
                    onChange={(e) => setReportName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="reportCategory" className="text-sm font-medium">Category</label>
                  <Select value={reportCategory} onValueChange={setReportCategory}>
                    <SelectTrigger id="reportCategory">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="occupancy">Occupancy</SelectItem>
                      <SelectItem value="revenue">Revenue</SelectItem>
                      <SelectItem value="guests">Guest Analytics</SelectItem>
                      <SelectItem value="operations">Operations</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="reportFormat" className="text-sm font-medium">Format</label>
                  <Select value={reportFormat} onValueChange={setReportFormat}>
                    <SelectTrigger id="reportFormat">
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="table">Table</SelectItem>
                      <SelectItem value="bar">Bar Chart</SelectItem>
                      <SelectItem value="line">Line Chart</SelectItem>
                      <SelectItem value="pie">Pie Chart</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">Data Fields</label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mt-2">
                  {[
                    "Date", "Room Number", "Guest Name", "Room Type", 
                    "Rate", "Check-in Date", "Check-out Date", "Payment Method",
                    "Revenue", "Occupancy", "ADR", "RevPAR",
                    "Source", "Guest Type", "Length of Stay", "Nationality"
                  ].map((field) => (
                    <div key={field} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`field-${field}`}
                        checked={selectedFields.includes(field)}
                        onCheckedChange={() => handleFieldToggle(field)}
                      />
                      <label
                        htmlFor={`field-${field}`}
                        className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {field}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row gap-4">
                <Button className="w-full md:w-auto" onClick={handlePreviewReport}>Preview Report</Button>
                <Button className="w-full md:w-auto" variant="outline" onClick={handleSaveReport}>Save Report</Button>
                <Button 
                  className="w-full md:w-auto" 
                  variant="outline" 
                  onClick={() => toast.success("Report scheduled for daily delivery")}
                >
                  Schedule Automated Report
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {showPreview && renderReportPreview()}
          
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Saved Reports</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { name: "Monthly Revenue Summary", category: "Revenue", lastRun: "May 1, 2025" },
                { name: "Weekly Occupancy Trends", category: "Occupancy", lastRun: "April 28, 2025" },
                { name: "Guest Source Analysis", category: "Guest Analytics", lastRun: "April 30, 2025" },
              ].map((report, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <h4 className="font-semibold">{report.name}</h4>
                    <p className="text-sm text-muted-foreground">Category: {report.category}</p>
                    <p className="text-sm text-muted-foreground">Last Run: {report.lastRun}</p>
                    <div className="mt-4 flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="w-full"
                        onClick={() => handleRunSavedReport(report)}
                      >
                        Run
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="w-full"
                        onClick={() => toast.success(`Editing report: ${report.name}`)}
                      >
                        Edit
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Layout>
  );
}
