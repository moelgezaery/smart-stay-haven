
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
import { Search, ArrowDownUp, FileText, Mail, PhoneCall, Printer, ArrowDownUp as Filter } from "lucide-react";
import { format, addDays, isPast, differenceInDays } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";

// Mock data for outstanding invoices
const invoices = [
  {
    id: "INV-2025-001",
    guestName: "Robert Miller",
    email: "robert.miller@example.com",
    phone: "+1 (555) 123-4567",
    roomNumber: "304",
    checkOut: new Date(2025, 4, 2),
    amount: 1250.75,
    paid: 250.00,
    due: 1000.75,
    status: "partial",
    dueDate: addDays(new Date(2025, 4, 2), 30),
    notes: "Promised to pay by end of month"
  },
  {
    id: "INV-2025-002",
    guestName: "Jennifer Davis",
    email: "jennifer.davis@example.com",
    phone: "+1 (555) 234-5678",
    roomNumber: "412",
    checkOut: new Date(2025, 4, 3),
    amount: 875.50,
    paid: 0,
    due: 875.50,
    status: "unpaid",
    dueDate: addDays(new Date(2025, 4, 3), 30),
    notes: "Corporate account, will be paid by company"
  },
  {
    id: "INV-2025-003",
    guestName: "David Wilson",
    email: "david.wilson@example.com",
    phone: "+1 (555) 345-6789",
    roomNumber: "201",
    checkOut: new Date(2025, 3, 28),
    amount: 475.25,
    paid: 0,
    due: 475.25,
    status: "unpaid",
    dueDate: addDays(new Date(2025, 3, 28), 30),
    notes: "Card declined, following up"
  },
  {
    id: "INV-2025-004",
    guestName: "Sophia Johnson",
    email: "sophia.j@example.com",
    phone: "+1 (555) 456-7890",
    roomNumber: "105",
    checkOut: new Date(2025, 3, 15),
    amount: 925.75,
    paid: 925.75,
    due: 0,
    status: "paid",
    dueDate: addDays(new Date(2025, 3, 15), 30),
    notes: "Paid in full on checkout"
  },
  {
    id: "INV-2025-005",
    guestName: "Thomas Brown",
    email: "thomas.brown@example.com",
    phone: "+1 (555) 567-8901",
    roomNumber: "508",
    checkOut: new Date(2025, 3, 5),
    amount: 1580.00,
    paid: 0,
    due: 1580.00,
    status: "overdue",
    dueDate: addDays(new Date(2025, 3, 5), 30),
    notes: "Multiple attempts to contact, no response"
  }
];

export default function OutstandingInvoices() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [activeTab, setActiveTab] = useState("all");
  const { toast } = useToast();
  
  // Filter invoices based on search term and active tab
  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = 
      invoice.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.roomNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === "all") return matchesSearch;
    return matchesSearch && invoice.status === activeTab;
  });
  
  // Sort invoices by due date
  const sortedInvoices = [...filteredInvoices].sort((a, b) => {
    if (sortOrder === "asc") {
      return a.dueDate.getTime() - b.dueDate.getTime();
    } else {
      return b.dueDate.getTime() - a.dueDate.getTime();
    }
  });
  
  // Toggle sorting order
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };
  
  // Calculate totals
  const totalOutstanding = invoices
    .filter(inv => inv.status !== "paid")
    .reduce((sum, inv) => sum + inv.due, 0);
    
  const totalOverdue = invoices
    .filter(inv => inv.status === "overdue")
    .reduce((sum, inv) => sum + inv.due, 0);
  
  // Handle invoice selection
  const toggleInvoiceSelection = (invoiceId: string) => {
    setSelectedInvoices(prev => 
      prev.includes(invoiceId)
        ? prev.filter(id => id !== invoiceId)
        : [...prev, invoiceId]
    );
  };
  
  // Check if all visible invoices are selected
  const allSelected = filteredInvoices.length > 0 && 
    filteredInvoices.every(invoice => selectedInvoices.includes(invoice.id));
  
  // Handle "select all" checkbox
  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedInvoices([]);
    } else {
      setSelectedInvoices(filteredInvoices.map(invoice => invoice.id));
    }
  };
  
  // Send payment reminder
  const sendReminder = (invoiceId: string, guestName: string) => {
    toast({
      title: "Payment Reminder Sent",
      description: `Payment reminder sent to ${guestName}.`
    });
  };
  
  // Send multiple reminders
  const sendMultipleReminders = () => {
    if (selectedInvoices.length > 0) {
      toast({
        title: "Multiple Reminders Sent",
        description: `Payment reminders sent to ${selectedInvoices.length} guests.`
      });
      setSelectedInvoices([]);
    }
  };
  
  // Get status badge based on invoice status
  const getStatusBadge = (status: string, dueDate: Date) => {
    switch(status) {
      case "paid":
        return <Badge className="bg-green-500">Paid</Badge>;
      case "partial":
        return <Badge className="bg-blue-500">Partially Paid</Badge>;
      case "unpaid":
        return isPast(dueDate) 
          ? <Badge variant="destructive">Overdue</Badge>
          : <Badge variant="outline">Unpaid</Badge>;
      case "overdue":
        return <Badge variant="destructive">Overdue</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  // Get days remaining/overdue text
  const getDaysText = (dueDate: Date) => {
    const today = new Date();
    const days = differenceInDays(dueDate, today);
    
    if (days > 0) {
      return `${days} days remaining`;
    } else if (days < 0) {
      return `${Math.abs(days)} days overdue`;
    } else {
      return "Due today";
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Outstanding Invoices</h1>
          <div className="flex gap-2">
            <Button 
              variant="outline"
              onClick={sendMultipleReminders}
              disabled={selectedInvoices.length === 0}
            >
              <Mail className="mr-2 h-4 w-4" />
              Send Reminders ({selectedInvoices.length})
            </Button>
            <Button>
              <FileText className="mr-2 h-4 w-4" />
              Generate Report
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">Total Outstanding</p>
                  <p className="text-2xl font-semibold">${totalOutstanding.toFixed(2)}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">Overdue Amount</p>
                  <p className="text-2xl font-semibold text-destructive">${totalOverdue.toFixed(2)}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">Invoices Pending</p>
                  <p className="text-2xl font-semibold">{invoices.filter(inv => inv.status !== "paid").length}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Invoice Management</CardTitle>
            <CardDescription>
              Manage and track outstanding guest invoices
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
              <div className="flex justify-between items-center mb-6">
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="unpaid">Unpaid</TabsTrigger>
                  <TabsTrigger value="partial">Partially Paid</TabsTrigger>
                  <TabsTrigger value="overdue">Overdue</TabsTrigger>
                  <TabsTrigger value="paid">Paid</TabsTrigger>
                </TabsList>
                
                <div className="relative w-[280px]">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by guest, ID, or room..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[40px]">
                        <Checkbox 
                          checked={allSelected}
                          onCheckedChange={toggleSelectAll}
                        />
                      </TableHead>
                      <TableHead>Invoice</TableHead>
                      <TableHead>Guest</TableHead>
                      <TableHead>Room</TableHead>
                      <TableHead>Amount Due</TableHead>
                      <TableHead onClick={toggleSortOrder} className="cursor-pointer">
                        <div className="flex items-center">
                          Due Date
                          <ArrowDownUp className="ml-2 h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedInvoices.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell>
                          <Checkbox 
                            checked={selectedInvoices.includes(invoice.id)}
                            onCheckedChange={() => toggleInvoiceSelection(invoice.id)}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{invoice.id}</div>
                          <div className="text-xs text-muted-foreground">
                            Checkout: {format(invoice.checkOut, "MMM d, yyyy")}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>{invoice.guestName}</div>
                          <div className="text-xs text-muted-foreground">{invoice.email}</div>
                        </TableCell>
                        <TableCell>{invoice.roomNumber}</TableCell>
                        <TableCell>
                          <div className={invoice.status === "overdue" ? "text-destructive font-medium" : "font-medium"}>
                            ${invoice.due.toFixed(2)}
                          </div>
                          {invoice.paid > 0 && (
                            <div className="text-xs text-muted-foreground">
                              Of ${invoice.amount.toFixed(2)}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div>{format(invoice.dueDate, "MMM d, yyyy")}</div>
                          <div className={`text-xs ${isPast(invoice.dueDate) && invoice.status !== "paid" ? "text-destructive" : "text-muted-foreground"}`}>
                            {getDaysText(invoice.dueDate)}
                          </div>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(invoice.status, invoice.dueDate)}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm">Actions</Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuItem onClick={() => sendReminder(invoice.id, invoice.guestName)}>
                                  <Mail className="mr-2 h-4 w-4" />
                                  Send Reminder
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <PhoneCall className="mr-2 h-4 w-4" />
                                  Call Guest
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Printer className="mr-2 h-4 w-4" />
                                  Print Invoice
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <FileText className="mr-2 h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
