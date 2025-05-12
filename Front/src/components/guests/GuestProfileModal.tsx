
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Guest } from "@/types/guest";

interface GuestProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  guest: Guest | null;
}

export function GuestProfileModal({
  open,
  onOpenChange,
  guest,
}: GuestProfileModalProps) {
  const [activeTab, setActiveTab] = useState("info");

  if (!guest) return null;

  // Mock data for guest history
  const guestStays = [
    {
      id: "STAY-001",
      checkIn: new Date(2025, 1, 15),
      checkOut: new Date(2025, 1, 18),
      room: "101 - Deluxe King",
      total: 450.00,
      status: "completed"
    },
    {
      id: "STAY-002",
      checkIn: new Date(2024, 10, 5),
      checkOut: new Date(2024, 10, 7),
      room: "205 - Executive Suite",
      total: 780.00,
      status: "completed"
    },
    {
      id: "STAY-003",
      checkIn: new Date(2024, 5, 20),
      checkOut: new Date(2024, 5, 25),
      room: "110 - Standard Double",
      total: 625.00,
      status: "completed"
    }
  ];

  // Mock data for guest requests history
  const requestHistory = [
    {
      id: "REQ-001",
      date: new Date(2025, 1, 16),
      type: "Housekeeping",
      description: "Extra towels and pillows",
      status: "completed"
    },
    {
      id: "REQ-002",
      date: new Date(2025, 1, 17),
      type: "Room Service",
      description: "Breakfast delivery",
      status: "completed"
    },
    {
      id: "REQ-003",
      date: new Date(2024, 10, 6),
      type: "Maintenance",
      description: "TV not working properly",
      status: "completed"
    }
  ];

  // Mock data for guest invoices
  const guestInvoices = [
    {
      id: "INV-001",
      date: new Date(2025, 1, 18),
      amount: 550.00,
      description: "Room charges + restaurant",
      status: "paid"
    },
    {
      id: "INV-002",
      date: new Date(2024, 10, 7),
      amount: 820.00,
      description: "Room charges + spa services",
      status: "paid"
    },
    {
      id: "INV-003",
      date: new Date(2024, 5, 25),
      amount: 675.00,
      description: "Room charges + minibar",
      status: "paid"
    }
  ];

  const formatDate = (date: Date | string | null | undefined) => {
    if (!date) return "N/A";
    try {
      return format(new Date(date), "MMM d, yyyy");
    } catch (error) {
      return "Invalid Date";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Guest Profile</DialogTitle>
          <DialogDescription>
            Complete profile information and history for {guest.firstName} {guest.lastName}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="info" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="info">Personal Info</TabsTrigger>
            <TabsTrigger value="stays">Stay History</TabsTrigger>
            <TabsTrigger value="requests">Requests</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground">Name</h3>
                    <p className="text-lg">{guest.firstName} {guest.lastName}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground">Email</h3>
                    <p className="text-lg">{guest.email}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground">Phone</h3>
                    <p className="text-lg">{guest.phoneNumber || "Not provided"}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground">Date of Birth</h3>
                    <p className="text-lg">{formatDate(guest.dateOfBirth)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Address Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground">Address</h3>
                    <p className="text-lg">{guest.address || "Not provided"}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground">City</h3>
                    <p className="text-lg">{guest.city || "Not provided"}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground">Country</h3>
                    <p className="text-lg">{guest.country || "Not provided"}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground">Passport Number</h3>
                    <p className="text-lg">{guest.passportNumber || "Not provided"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Special Requests & Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{guest.specialRequests || "No special requests recorded."}</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stays">
            <Card>
              <CardHeader>
                <CardTitle>Stay History</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Reservation ID</TableHead>
                      <TableHead>Check-In</TableHead>
                      <TableHead>Check-Out</TableHead>
                      <TableHead>Room</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {guestStays.map((stay) => (
                      <TableRow key={stay.id}>
                        <TableCell>{stay.id}</TableCell>
                        <TableCell>{format(stay.checkIn, "MMM d, yyyy")}</TableCell>
                        <TableCell>{format(stay.checkOut, "MMM d, yyyy")}</TableCell>
                        <TableCell>{stay.room}</TableCell>
                        <TableCell>${stay.total.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge className="bg-green-500">
                            {stay.status === "completed" ? "Completed" : stay.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="requests">
            <Card>
              <CardHeader>
                <CardTitle>Request History</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Request ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {requestHistory.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell>{request.id}</TableCell>
                        <TableCell>{format(request.date, "MMM d, yyyy")}</TableCell>
                        <TableCell>{request.type}</TableCell>
                        <TableCell>{request.description}</TableCell>
                        <TableCell>
                          <Badge className="bg-green-500">
                            {request.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="billing">
            <Card>
              <CardHeader>
                <CardTitle>Billing History</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {guestInvoices.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell>{invoice.id}</TableCell>
                        <TableCell>{format(invoice.date, "MMM d, yyyy")}</TableCell>
                        <TableCell>{invoice.description}</TableCell>
                        <TableCell>${invoice.amount.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge className="bg-green-500">
                            {invoice.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
