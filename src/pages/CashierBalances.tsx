
import { Layout } from "@/components/layout/Layout";
import { useState } from "react";
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
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Search, Coins, DollarSign, CreditCard, ChevronDown, PlusCircle, Printer } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
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
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data for cashier balances
const cashierShifts = [
  {
    id: "CS001",
    cashier: "Emily Johnson",
    shiftStart: new Date(2025, 4, 9, 7, 0),
    shiftEnd: new Date(2025, 4, 9, 15, 0),
    openingBalance: 500.00,
    cashReceived: 2350.75,
    cardPayments: 4125.50,
    otherPayments: 500.00,
    refunds: 175.50,
    expectedClosingBalance: 2675.25,
    actualClosingBalance: 2675.25,
    status: "closed",
    notes: ""
  },
  {
    id: "CS002",
    cashier: "Michael Torres",
    shiftStart: new Date(2025, 4, 9, 15, 0),
    shiftEnd: new Date(2025, 4, 9, 23, 0),
    openingBalance: 500.00,
    cashReceived: 1850.25,
    cardPayments: 3200.75,
    otherPayments: 350.00,
    refunds: 125.00,
    expectedClosingBalance: 2225.25,
    actualClosingBalance: 2200.00,
    status: "closed",
    notes: "Discrepancy of $25.25, investigation ongoing"
  },
  {
    id: "CS003",
    cashier: "Sarah Davis",
    shiftStart: new Date(2025, 4, 10, 7, 0),
    shiftEnd: new Date(2025, 4, 10, 15, 0), 
    openingBalance: 500.00,
    cashReceived: 1975.50,
    cardPayments: 3580.25,
    otherPayments: 425.00,
    refunds: 150.00,
    expectedClosingBalance: 2325.50,
    actualClosingBalance: 2325.50,
    status: "closed",
    notes: ""
  },
  {
    id: "CS004",
    cashier: "James Wilson",
    shiftStart: new Date(2025, 4, 10, 15, 0),
    shiftEnd: null, // Active shift
    openingBalance: 500.00,
    cashReceived: 1250.75,
    cardPayments: 2175.25,
    otherPayments: 175.00,
    refunds: 50.00,
    expectedClosingBalance: 1700.75,
    actualClosingBalance: null,
    status: "active",
    notes: ""
  }
];

export default function CashierBalances() {
  const [searchTerm, setSearchTerm] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [shiftData, setShiftData] = useState(cashierShifts);
  const { toast } = useToast();
  
  // Filter cashier shifts based on search term
  const filteredShifts = shiftData.filter(shift => 
    shift.cashier.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shift.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate total payments for today
  const todaysPayments = cashierShifts
    .filter(shift => {
      const shiftDate = new Date(shift.shiftStart);
      const today = new Date();
      return shiftDate.getDate() === today.getDate() &&
             shiftDate.getMonth() === today.getMonth() &&
             shiftDate.getFullYear() === today.getFullYear();
    })
    .reduce((total, shift) => total + shift.cashReceived + shift.cardPayments + shift.otherPayments, 0);

  // Start a new shift
  const handleStartShift = () => {
    const newShift = {
      id: `CS00${shiftData.length + 1}`,
      cashier: "Current User",
      shiftStart: new Date(),
      shiftEnd: null,
      openingBalance: 500.00,
      cashReceived: 0,
      cardPayments: 0,
      otherPayments: 0,
      refunds: 0,
      expectedClosingBalance: 500.00,
      actualClosingBalance: null,
      status: "active" as const,
      notes: ""
    };
    
    setShiftData([newShift, ...shiftData]);
    
    toast({
      title: "Shift Started",
      description: `New shift started with ID ${newShift.id}`
    });
  };

  // End current shift
  const handleEndShift = () => {
    const updatedShifts = shiftData.map(shift => {
      if (shift.status === "active") {
        return {
          ...shift,
          shiftEnd: new Date(),
          actualClosingBalance: shift.expectedClosingBalance,
          status: "closed" as const
        };
      }
      return shift;
    });
    
    setShiftData(updatedShifts);
    
    toast({
      title: "Shift Ended",
      description: "Your shift has been closed successfully"
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Active</Badge>;
      case "closed":
        return <Badge variant="outline">Closed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const hasActiveShift = shiftData.some(shift => shift.status === "active");

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Cashier Balances</h1>
          <div className="flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, 'PPP') : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            
            {hasActiveShift ? (
              <Dialog>
                <DialogTrigger asChild>
                  <Button>End Shift</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>End Cashier Shift</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium mb-1">Expected Closing Balance</p>
                        <p className="text-xl font-semibold">$1,700.75</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-1">Actual Closing Balance</p>
                        <Input placeholder="Enter actual cash count" defaultValue="1700.75" />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-1">Notes</p>
                      <Input placeholder="Any notes about this shift?" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline">Cancel</Button>
                    <Button onClick={handleEndShift}>End Shift</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            ) : (
              <Button onClick={handleStartShift}>Start Shift</Button>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <Coins className="h-10 w-10 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Cash on Hand</p>
                <p className="text-2xl font-semibold">$2,500.00</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <DollarSign className="h-10 w-10 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Today's Payments</p>
                <p className="text-2xl font-semibold">${todaysPayments.toFixed(2)}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <CreditCard className="h-10 w-10 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Card Transactions</p>
                <p className="text-2xl font-semibold">38</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <ChevronDown className="h-10 w-10 text-destructive" />
              <div>
                <p className="text-sm text-muted-foreground">Refunds</p>
                <p className="text-2xl font-semibold">$325.50</p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Cashier Shifts</CardTitle>
            <CardDescription>View and manage current and past cashier shifts</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <div className="flex justify-between items-center mb-4">
                <TabsList>
                  <TabsTrigger value="all">All Shifts</TabsTrigger>
                  <TabsTrigger value="active">Active</TabsTrigger>
                  <TabsTrigger value="closed">Closed</TabsTrigger>
                </TabsList>
                <div className="relative w-[250px]">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by cashier or ID..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              <TabsContent value="all">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Shift ID</TableHead>
                        <TableHead>Cashier</TableHead>
                        <TableHead>Start Time</TableHead>
                        <TableHead>End Time</TableHead>
                        <TableHead>Opening Balance</TableHead>
                        <TableHead>Expected Closing</TableHead>
                        <TableHead>Actual Closing</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredShifts.map((shift) => (
                        <TableRow key={shift.id}>
                          <TableCell className="font-medium">{shift.id}</TableCell>
                          <TableCell>{shift.cashier}</TableCell>
                          <TableCell>{format(shift.shiftStart, "MMM d, yyyy HH:mm")}</TableCell>
                          <TableCell>
                            {shift.shiftEnd 
                              ? format(shift.shiftEnd, "MMM d, yyyy HH:mm") 
                              : "In Progress"}
                          </TableCell>
                          <TableCell>${shift.openingBalance.toFixed(2)}</TableCell>
                          <TableCell>${shift.expectedClosingBalance.toFixed(2)}</TableCell>
                          <TableCell>
                            {shift.actualClosingBalance !== null 
                              ? `$${shift.actualClosingBalance.toFixed(2)}` 
                              : "-"}
                          </TableCell>
                          <TableCell>{getStatusBadge(shift.status)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" size="sm">
                                <Printer className="h-4 w-4 mr-1" />
                                Report
                              </Button>
                              <Button variant="outline" size="sm">Details</Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
              
              <TabsContent value="active">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Shift ID</TableHead>
                        <TableHead>Cashier</TableHead>
                        <TableHead>Start Time</TableHead>
                        <TableHead>Opening Balance</TableHead>
                        <TableHead>Current Balance</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredShifts
                        .filter(shift => shift.status === "active")
                        .map((shift) => (
                          <TableRow key={shift.id}>
                            <TableCell className="font-medium">{shift.id}</TableCell>
                            <TableCell>{shift.cashier}</TableCell>
                            <TableCell>{format(shift.shiftStart, "MMM d, yyyy HH:mm")}</TableCell>
                            <TableCell>${shift.openingBalance.toFixed(2)}</TableCell>
                            <TableCell>${shift.expectedClosingBalance.toFixed(2)}</TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button size="sm">Close Shift</Button>
                                <Button variant="outline" size="sm">Details</Button>
                              </div>
                            </TableCell>
                          </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
              
              <TabsContent value="closed">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Shift ID</TableHead>
                        <TableHead>Cashier</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Cash Received</TableHead>
                        <TableHead>Variance</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredShifts
                        .filter(shift => shift.status === "closed")
                        .map((shift) => {
                          const variance = shift.actualClosingBalance !== null
                            ? shift.actualClosingBalance - shift.expectedClosingBalance
                            : 0;
                            
                          return (
                            <TableRow key={shift.id}>
                              <TableCell className="font-medium">{shift.id}</TableCell>
                              <TableCell>{shift.cashier}</TableCell>
                              <TableCell>{format(shift.shiftStart, "MMM d, yyyy")}</TableCell>
                              <TableCell>
                                {shift.shiftEnd ? 
                                  `${Math.round((shift.shiftEnd.getTime() - shift.shiftStart.getTime()) / 3600000)} hrs` 
                                  : "-"}
                              </TableCell>
                              <TableCell>${shift.cashReceived.toFixed(2)}</TableCell>
                              <TableCell>
                                <span className={cn(
                                  "px-2 py-1 rounded-full text-xs",
                                  variance === 0 
                                    ? "bg-green-100 text-green-800"
                                    : variance < 0 
                                      ? "bg-red-100 text-red-800" 
                                      : "bg-yellow-100 text-yellow-800"
                                )}>
                                  {variance === 0 
                                    ? "Balanced" 
                                    : variance < 0 
                                      ? `-$${Math.abs(variance).toFixed(2)}` 
                                      : `+$${variance.toFixed(2)}`}
                                </span>
                              </TableCell>
                              <TableCell>
                                <Button variant="outline" size="sm">
                                  <Printer className="h-4 w-4 mr-1" />
                                  Report
                                </Button>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
