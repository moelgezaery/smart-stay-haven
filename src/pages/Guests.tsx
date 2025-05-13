
import { Layout } from "@/components/layout/Layout";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
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
import { GuestProfileModal } from "@/components/guests/GuestProfileModal";
import { Search, Plus, UserCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { guestService } from "@/services/guestService";
import { Guest } from "@/types/guest";

export default function Guests() {
  const [searchTerm, setSearchTerm] = useState("");
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchGuests = async () => {
      try {
        setLoading(true);
        const guestsData = await guestService.getGuests();
        setGuests(guestsData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching guests:", err);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load guest data. Please try again later.",
        });
        setLoading(false);
      }
    };

    fetchGuests();
  }, [toast]);

  const filteredGuests = guests.filter(
    (guest) =>
      guest.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guest.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guest.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (guest.phoneNumber &&
        guest.phoneNumber.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleViewProfile = (guest: Guest) => {
    setSelectedGuest(guest);
    setProfileModalOpen(true);
  };

  const handleAddGuest = () => {
    // In a real application, this would open a form to add a new guest
    toast({
      title: "Add Guest",
      description: "This functionality is coming soon.",
    });
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Guests</h1>
          <Button onClick={handleAddGuest}>
            <Plus className="mr-2 h-4 w-4" />
            Add Guest
          </Button>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Guest Directory</CardTitle>
            <CardDescription>
              Manage and view information for all guests
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, or phone..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-4">Loading guests...</p>
                </div>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Country</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredGuests.length > 0 ? (
                      filteredGuests.map((guest) => (
                        <TableRow key={guest.id}>
                          <TableCell>
                            {guest.firstName} {guest.lastName}
                          </TableCell>
                          <TableCell>{guest.email}</TableCell>
                          <TableCell>{guest.phoneNumber || "N/A"}</TableCell>
                          <TableCell>{guest.country || "N/A"}</TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewProfile(guest)}
                            >
                              <UserCircle className="mr-2 h-4 w-4" />
                              View Profile
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8">
                          No guests found matching your search criteria.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <GuestProfileModal
        open={profileModalOpen}
        onOpenChange={setProfileModalOpen}
        guest={selectedGuest}
      />
    </Layout>
  );
}
