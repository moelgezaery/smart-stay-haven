
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Setup from "./pages/Setup";
import HotelDetails from "./pages/HotelDetails";
import Rooms from "./pages/Rooms";
import Guests from "./pages/Guests";
import CheckIn from "./pages/CheckIn";
import CheckOut from "./pages/CheckOut";
import Payments from "./pages/Payments";
import Charges from "./pages/Charges";
import Housekeeping from "./pages/Housekeeping";
import Employees from "./pages/Employees";
import Companies from "./pages/Companies";
import Maintenance from "./pages/Maintenance";
import Reports from "./pages/Reports";
import Login from "./pages/Login";
import Reservations from "./pages/Reservations";

// Setup pages
import RoomTypes from "./pages/setup/RoomTypes";
import Floors from "./pages/setup/Floors";
import Users from "./pages/setup/Users";
import Currencies from "./pages/setup/Currencies";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Index />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/guests" element={<Guests />} />
          <Route path="/reservations" element={<Reservations />} />
          <Route path="/checkin" element={<CheckIn />} />
          <Route path="/checkout" element={<CheckOut />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/charges" element={<Charges />} />
          <Route path="/housekeeping" element={<Housekeeping />} />
          <Route path="/employees" element={<Employees />} />
          <Route path="/companies" element={<Companies />} />
          <Route path="/maintenance" element={<Maintenance />} />
          <Route path="/reports" element={<Reports />} />
          
          {/* Setup Routes */}
          <Route path="/setup" element={<Setup />} />
          <Route path="/setup/hotel-details" element={<HotelDetails />} />
          <Route path="/setup/room-types" element={<RoomTypes />} />
          <Route path="/setup/rooms-floors" element={<Floors />} />
          <Route path="/setup/users" element={<Users />} />
          <Route path="/setup/currencies" element={<Currencies />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
