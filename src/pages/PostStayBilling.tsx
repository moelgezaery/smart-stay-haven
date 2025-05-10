
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
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Edit, CreditCard, Mail, Download, FileText, Plus, User } from "lucide-react";
import { format, parseISO } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
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
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

// Mock data for post-stay charges
const postStayCharges = [
  {
    id: "PSC-001",
    guestName: "Thomas Anderson",
    email: "thomas.anderson@example.com",
    checkOut: "2025-05-05",
    roomNumber: "301",
    chargeType: "Minibar",
    description: "Items consumed but not charged during stay",
    amount: 45.50,
    status: "pending",
    notes: "Found after checkout"
  },
  {
    id: "PSC-002",
    guestName: "Sarah Miller",
    email: "sarah.miller@example.com",
    checkOut: "2025-05-03",
    roomNumber: "422",
    chargeType: "Room Damage",
    description: "Damage to bathroom sink",
    amount: 180.00,
    status: "invoiced",
    notes: "Discovered during housekeeping check"
  },
  {
    id: "PSC-003",
    guestName: "James Wilson",
    email: "james.wilson@example.com",
    checkOut: "2025-05-02",
    roomNumber: "105",
    chargeType: "Late Checkout",
    description: "3 hours after checkout time",
    amount: 75.00,
    status: "paid",
    notes: "Charge approved by guest at checkout"
  },
  {
    id: "PSC-004",
    guestName: "Emily Johnson",
    email: "emily.johnson@example.com",
    checkOut: "2025-04-30",
    roomNumber: "217",
    chargeType: "Missing Items",
    description: "Bath robes not returned",
    amount: 120.00,
    status: "disputed",
    notes: "Guest claims items were not used"
  },
  {
    id: "PSC-005",
    guestName: "Michael Brown",
    email: "michael.brown@example.com",
    checkOut: "2025-04-28",
    roomNumber: "510",
    chargeType: "Room Service",
    description: "Late night room service not charged",
    amount: 55.25,
    status: "pending",
    notes: "Order found in system but not billed"
  }
];

// Mock data for post-stay payments
const postStayPayments = [
  {
    id: "PSP-001",
    guestName: "Sarah Miller",
    chargeId: "PSC-002",
    paymentDate: "2025-05-10",
    amount: 180.00,
    method: "Credit Card",
    reference: "TXN-57892"
  },
  {
    id: "PSP-002",
    guestName: "James Wilson",
    chargeId: "PSC-003",
    paymentDate: "2025-05-02",
    amount: 75.00,
    method: "Cash",
    reference: "CASH-3245"
  }
];

export default function PostStayBilling() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("charges");
  const [activeChargesTab, setActiveChargesTab] = useState("all");
  const [showAddChargeDialog, setShowAddChargeDialog] = useState(false);
  const { toast } = useToast();
  
  // Filter post-stay charges based on search term and active tab
  const filteredCharges = postStayCharges.filter(charge => {
    const matchesSearch = 
      charge.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      charge.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      charge.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      charge.chargeType.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeChargesTab === "all") return matchesSearch;
    return matchesSearch && charge.status === activeChargesTab;
  });
  
  // Filter post-stay payments based on search term
  const filteredPayments = postStayPayments.filter(payment => 
    payment.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.chargeId.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Calculate totals
  const totalPendingAmount = postStayCharges
    .filter(charge => charge.status === "pending" || charge.status === "invoiced")
    .reduce((sum, charge) => sum + charge.amount, 0);
    
  const totalCollectedAmount = postStayCharges
    .filter(charge => charge.status === "paid")
    .reduce((sum, charge) => sum + charge.amount, 0);
    
  const totalDisputedAmount = postStayCharges
    .filter(charge => charge.status === "disputed")
    .reduce((sum, charge) => sum + charge.amount, 0);
  
  // Process a new charge
  const handleAddCharge = () => {
    setShowAddChargeDialog(false);
    
    toast({
      title: "Charge Added Successfully",
      description: "The new post-stay charge has been added and is ready for processing."
    });
  };
  
  // Process payment for a charge
  const handleProcessPayment = (id: string, guestName: string) => {
    toast({
      title: "Payment Processed",
      description: `Payment for ${guestName} has been successfully processed.`
    });
  };
  
  // Send invoice for a charge
  const handleSendInvoice = (id: string, guestName: string) => {
    toast({
      title: "Invoice Sent",
      description: `Invoice has been sent to ${guestName}.`
    });
  };
  
  // Get status badge based on charge status
  const getStatusBadge = (status: string) => {
    switch(status) {
      case "pending":
        return <Badge variant="outline">Pending</Badge>;
      case "invoiced":
        return <Badge className="bg-blue-500">Invoiced</Badge>;
      case "paid":
        return <Badge className="bg-green-500">Paid</Badge>;
      case "disputed":
        return <Badge variant="destructive">Disputed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Post-Stay Billing</h1>
          <div className="flex gap-2">
            <Dialog open={showAddChargeDialog} onOpenChange={setShowAddChargeDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Charge
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[550px]">
                <DialogHeader>
                  <DialogTitle>Add Post-Stay Charge</DialogTitle>
                  <DialogDescription>
                    Create a new charge for a recently checked-out guest.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="roomNumber">Room Number</Label>
                      <Input id="roomNumber" placeholder="Room number" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="guestLookup">Guest</Label>
                      <div className="flex gap-2">
                        <Input id="guestLookup" placeholder="Find guest..." className="flex-grow" />
                        <Button variant="outline" size="icon">
                          <User className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="chargeType">Charge Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select charge type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="minibar">Minibar</SelectItem>
                        <SelectItem value="damage">Room Damage</SelectItem>
                        <SelectItem value="lateCheckout">Late Checkout</SelectItem>
                        <SelectItem value="missingItems">Missing Items</SelectItem>
                        <SelectItem value="roomService">Room Service</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="amount">Amount</Label>
                      <Input id="amount" type="number" min="0" step="0.01" placeholder="0.00" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tax">Tax</Label>
                      <Input id="tax" type="number" min="0" step="0.01" placeholder="0.00" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" placeholder="Detailed description of the charge" />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox id="sendInvoice" />
                    <label
                      htmlFor="sendInvoice"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Send invoice to guest immediately
                    </label>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowAddChargeDialog(false)}>Cancel</Button>
                  <Button onClick={handleAddCharge}>Add Charge</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">Pending Amount</p>
                  <p className="text-2xl font-semibold">${totalPendingAmount.toFixed(2)}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">Collected Amount</p>
                  <p className="text-2xl font-semibold text-green-600">${totalCollectedAmount.toFixed(2)}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                  <CreditCard className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">Disputed Amount</p>
                  <p className="text-2xl font-semibold text-red-500">${totalDisputedAmount.toFixed(2)}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                  <Edit className="h-6 w-6 text-red-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Post-Stay Billing Management</CardTitle>
            <CardDescription>
              Manage charges and payments for guests after their stay
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="charges" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="charges">Charges</TabsTrigger>
                <TabsTrigger value="payments">Payments</TabsTrigger>
              </TabsList>
              
              <div className="relative mb-6">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  className="pl-10 w-[300px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <TabsContent value="charges">
                <Tabs defaultValue="all" value={activeChargesTab} onValueChange={setActiveChargesTab}>
                  <TabsList className="mb-6">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="pending">Pending</TabsTrigger>
                    <TabsTrigger value="invoiced">Invoiced</TabsTrigger>
                    <TabsTrigger value="paid">Paid</TabsTrigger>
                    <TabsTrigger value="disputed">Disputed</TabsTrigger>
                  </TabsList>
                  
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Guest</TableHead>
                          <TableHead>Room</TableHead>
                          <TableHead>Charge Type</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Checkout Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredCharges.map((charge) => (
                          <TableRow key={charge.id}>
                            <TableCell className="font-medium">{charge.id}</TableCell>
                            <TableCell>
                              <div>{charge.guestName}</div>
                              <div className="text-xs text-muted-foreground">{charge.email}</div>
                            </TableCell>
                            <TableCell>{charge.roomNumber}</TableCell>
                            <TableCell>
                              <div>{charge.chargeType}</div>
                              <div className="text-xs text-muted-foreground truncate max-w-[150px]" title={charge.description}>
                                {charge.description}
                              </div>
                            </TableCell>
                            <TableCell className="font-medium">
                              ${charge.amount.toFixed(2)}
                            </TableCell>
                            <TableCell>
                              {format(parseISO(charge.checkOut), "MMM d, yyyy")}
                            </TableCell>
                            <TableCell>
                              {getStatusBadge(charge.status)}
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                {charge.status === "pending" && (
                                  <Button size="sm" variant="outline" onClick={() => handleSendInvoice(charge.id, charge.guestName)}>
                                    <Mail className="h-4 w-4 mr-1" />
                                    Invoice
                                  </Button>
                                )}
                                
                                {(charge.status === "pending" || charge.status === "invoiced") && (
                                  <Button size="sm" onClick={() => handleProcessPayment(charge.id, charge.guestName)}>
                                    <CreditCard className="h-4 w-4 mr-1" />
                                    Payment
                                  </Button>
                                )}
                                
                                <Button size="sm" variant="ghost">Details</Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </Tabs>
              </TabsContent>
              
              <TabsContent value="payments">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Payment ID</TableHead>
                        <TableHead>Charge ID</TableHead>
                        <TableHead>Guest</TableHead>
                        <TableHead>Payment Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead>Reference</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPayments.map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell className="font-medium">{payment.id}</TableCell>
                          <TableCell>{payment.chargeId}</TableCell>
                          <TableCell>{payment.guestName}</TableCell>
                          <TableCell>
                            {format(parseISO(payment.paymentDate), "MMM d, yyyy")}
                          </TableCell>
                          <TableCell className="font-medium">
                            ${payment.amount.toFixed(2)}
                          </TableCell>
                          <TableCell>{payment.method}</TableCell>
                          <TableCell>{payment.reference}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline">
                                <Download className="h-4 w-4 mr-1" />
                                Receipt
                              </Button>
                              <Button size="sm" variant="ghost">Details</Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
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
