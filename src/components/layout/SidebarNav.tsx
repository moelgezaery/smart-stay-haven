
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
  ClockIcon,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

export function SidebarNav() {
  const location = useLocation();
  const { toast } = useToast();
  const { t } = useTranslation();
  
  const handleUnimplementedFeature = (feature: string) => {
    toast({
      title: t("comingSoon"),
      description: t("featureAvailable", { feature })
    });
  };
  
  return (
    <>
      <div className="py-4 px-6 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <img 
            src="/lovable-uploads/d8664fc3-262a-4828-a474-946392a103c5.png" 
            alt="Gravity Smart Stay Logo" 
            className="h-8 w-8"
          />
          <div>
            <h2 className="text-lg font-semibold">{t("appName")}</h2>
          </div>
        </div>
      </div>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location.pathname === "/"}>
                  <Link to="/">
                    <Home className="h-4 w-4" />
                    <span>{t("home")}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location.pathname === "/rooms"}>
                  <Link to="/rooms">
                    <HotelIcon className="h-4 w-4" />
                    <span>{t("rooms")}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location.pathname === "/reservations"}>
                  <Link to="/reservations">
                    <CalendarRange className="h-4 w-4" />
                    <span>{t("reservations")}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location.pathname === "/guests"}>
                  <Link to="/guests">
                    <Users className="h-4 w-4" />
                    <span>{t("guests")}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location.pathname === "/checkin"}>
                  <Link to="/checkin">
                    <LogIn className="h-4 w-4" />
                    <span>{t("checkIn")}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location.pathname === "/checkout"}>
                  <Link to="/checkout">
                    <LogOut className="h-4 w-4" />
                    <span>{t("checkOut")}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel>{t("management")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location.pathname === "/payments"}>
                  <Link to="/payments">
                    <CreditCard className="h-4 w-4" />
                    <span>{t("payments")}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location.pathname === "/charges"}>
                  <Link to="/charges">
                    <ReceiptText className="h-4 w-4" />
                    <span>{t("charges")}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location.pathname === "/housekeeping"}>
                  <Link to="/housekeeping">
                    <ClipboardCheck className="h-4 w-4" />
                    <span>{t("housekeeping")}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location.pathname === "/employees"}>
                  <Link to="/employees">
                    <Users className="h-4 w-4" />
                    <span>{t("employees")}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location.pathname === "/companies"}>
                  <Link to="/companies">
                    <Building2 className="h-4 w-4" />
                    <span>{t("companies")}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location.pathname === "/maintenance"}>
                  <Link to="/maintenance">
                    <Wrench className="h-4 w-4" />
                    <span>{t("maintenance")}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location.pathname === "/reports"}>
                  <Link to="/reports">
                    <BarChartBig className="h-4 w-4" />
                    <span>{t("reports")}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location.pathname === "/closeday"}>
                  <Link to="/closeday">
                    <ClockIcon className="h-4 w-4" />
                    <span>{t("closeDay")}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel>{t("configuration")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location.pathname.startsWith("/setup")}>
                  <Link to="/setup">
                    <Cog className="h-4 w-4" />
                    <span>{t("setup")}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <Link to="/login" className="w-full">
          <div className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-sidebar-accent transition-colors">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary text-primary-foreground">JS</AvatarFallback>
            </Avatar>
            <div className="text-left">
              <p className="text-sm font-medium">John Smith</p>
              <p className="text-xs text-muted-foreground">{t("logout")}</p>
            </div>
          </div>
        </Link>
      </SidebarFooter>
    </>
  );
}
