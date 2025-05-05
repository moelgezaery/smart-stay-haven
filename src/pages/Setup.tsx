
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Users, KeyRound, CreditCard, BedDouble, HomeIcon, Waypoints, Settings, Wrench } from "lucide-react";
import { Link } from "react-router-dom";

interface SetupCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  to: string;
}

const SetupCard = ({ title, description, icon, to }: SetupCardProps) => {
  return (
    <Link to={to}>
      <Card className="h-full hover:border-primary/40 transition-colors cursor-pointer">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-medium">{title}</CardTitle>
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            {icon}
          </div>
        </CardHeader>
        <CardContent>
          <CardDescription>{description}</CardDescription>
        </CardContent>
      </Card>
    </Link>
  );
};

const Setup = () => {
  const setupItems = [
    {
      title: "Hotel Details",
      description: "Configure the basic information about your hotel.",
      icon: <Building2 size={20} />,
      to: "/setup/hotel-details"
    },
    {
      title: "Users & Permissions",
      description: "Manage user accounts and access rights.",
      icon: <Users size={20} />,
      to: "/setup/users"
    },
    {
      title: "Rooms & Floors",
      description: "Set up room numbers, floor plans, and extensions.",
      icon: <BedDouble size={20} />,
      to: "/setup/rooms-floors"
    },
    {
      title: "Room Types",
      description: "Define different types of rooms and their amenities.",
      icon: <HomeIcon size={20} />,
      to: "/setup/room-types"
    },
    {
      title: "Currencies",
      description: "Set up currencies and exchange rates.",
      icon: <CreditCard size={20} />,
      to: "/setup/currencies"
    },
    {
      title: "Services",
      description: "Configure room services and additional charges.",
      icon: <KeyRound size={20} />,
      to: "/setup/services"
    },
    {
      title: "Housekeeping",
      description: "Set up housekeeping schedules and procedures.",
      icon: <Waypoints size={20} />,
      to: "/setup/housekeeping"
    },
    {
      title: "Maintenance",
      description: "Configure maintenance schedules and procedures.",
      icon: <Wrench size={20} />,
      to: "/setup/maintenance"
    },
    {
      title: "General Settings",
      description: "Configure system-wide settings and preferences.",
      icon: <Settings size={20} />,
      to: "/setup/settings"
    },
  ];

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-navy-500">Hotel Setup</h1>
        <p className="text-muted-foreground mt-1">Configure all aspects of your hotel management system</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {setupItems.map((item, index) => (
          <SetupCard
            key={index}
            title={item.title}
            description={item.description}
            icon={item.icon}
            to={item.to}
          />
        ))}
      </div>
    </Layout>
  );
};

export default Setup;
