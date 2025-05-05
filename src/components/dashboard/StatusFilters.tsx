
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "./StatusBadge";
import { Search } from "lucide-react";

interface StatusFiltersProps {
  onFilterChange: (filters: any) => void;
}

export function StatusFilters({ onFilterChange }: StatusFiltersProps) {
  return (
    <div className="mb-6 space-y-4">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <h1 className="text-3xl font-bold text-navy-500">Room Status</h1>
        
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" size="sm" className="gap-2">
            <StatusBadge status="vacant" /> 
            <span className="ml-1">12</span>
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <StatusBadge status="occupied" /> 
            <span className="ml-1">8</span>
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <StatusBadge status="reserved" /> 
            <span className="ml-1">3</span>
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <StatusBadge status="maintenance" /> 
            <span className="ml-1">1</span>
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <StatusBadge status="cleaning" /> 
            <span className="ml-1">2</span>
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <StatusBadge status="checkout" /> 
            <span className="ml-1">2</span>
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 items-end justify-between">
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative max-w-xs w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search rooms..." className="pl-8" />
          </div>
          
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="vacant">Vacant</SelectItem>
              <SelectItem value="occupied">Occupied</SelectItem>
              <SelectItem value="reserved">Reserved</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
              <SelectItem value="cleaning">Cleaning</SelectItem>
              <SelectItem value="checkout">Checkout</SelectItem>
            </SelectContent>
          </Select>
          
          <Select defaultValue="all-types">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-types">All Types</SelectItem>
              <SelectItem value="standard">Standard</SelectItem>
              <SelectItem value="deluxe">Deluxe</SelectItem>
              <SelectItem value="suite">Suite</SelectItem>
              <SelectItem value="executive">Executive</SelectItem>
              <SelectItem value="presidential">Presidential</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Button>+ Check In</Button>
        </div>
      </div>
    </div>
  );
}
