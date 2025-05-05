
import {
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Link, useLocation } from "react-router-dom";
import { 
  Home, 
  HotelIcon, 
  Users,
  LogIn,
  LogOut,
  CreditCard,
  ReceiptText,
  ClipboardCheck,
  Building2,
  Cog,
  Wrench,
  BarChartBig,
  CalendarRange,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function SidebarNav() {
  const location = useLocation();
  const { toast } = useToast();
  
  const handleUnimplementedFeature = (feature: string) => {
    toast({
      title: "Coming Soon",
      description: `The ${feature} feature will be available in a future update.`
    });
  };
  
  return (
    <>
      <div className="py-4 px-6 border-b">
        <h2 className="text-lg font-semibold">HMS</h2>
        <p className="text-xs text-muted-foreground">Hotel Management System</p>
      </div>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location.pathname === "/"}>
                  <Link to="/">
                    <Home className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location.pathname === "/rooms"}>
                  <Link to="/rooms">
                    <HotelIcon className="h-4 w-4" />
                    <span>Rooms</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location.pathname === "/reservations"}>
                  <Link to="/reservations">
                    <CalendarRange className="h-4 w-4" />
                    <span>Reservations</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location.pathname === "/guests"}>
                  <Link to="/guests">
                    <Users className="h-4 w-4" />
                    <span>Guests</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location.pathname === "/checkin"}>
                  <Link to="/checkin">
                    <LogIn className="h-4 w-4" />
                    <span>Check In</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location.pathname === "/checkout"}>
                  <Link to="/checkout">
                    <LogOut className="h-4 w-4" />
                    <span>Check Out</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location.pathname === "/payments"}>
                  <Link to="/payments">
                    <CreditCard className="h-4 w-4" />
                    <span>Payments</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location.pathname === "/charges"}>
                  <Link to="/charges">
                    <ReceiptText className="h-4 w-4" />
                    <span>Charges</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location.pathname === "/housekeeping"}>
                  <Link to="/housekeeping">
                    <ClipboardCheck className="h-4 w-4" />
                    <span>Housekeeping</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location.pathname === "/employees"}>
                  <Link to="/employees">
                    <Users className="h-4 w-4" />
                    <span>Employees</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location.pathname === "/companies"}>
                  <Link to="/companies">
                    <Building2 className="h-4 w-4" />
                    <span>Companies</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location.pathname === "/maintenance"}>
                  <Link to="/maintenance">
                    <Wrench className="h-4 w-4" />
                    <span>Maintenance</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location.pathname === "/reports"}>
                  <Link to="/reports">
                    <BarChartBig className="h-4 w-4" />
                    <span>Reports</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel>Configuration</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location.pathname.startsWith("/setup")}>
                  <Link to="/setup">
                    <Cog className="h-4 w-4" />
                    <span>Setup</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <Link to="/login" className="w-full">
          <div className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent transition-colors">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary text-primary-foreground">JS</AvatarFallback>
            </Avatar>
            <div className="text-left">
              <p className="text-sm font-medium">John Smith</p>
              <p className="text-xs text-muted-foreground">Logout</p>
            </div>
          </div>
        </Link>
      </SidebarFooter>
    </>
  );
}
