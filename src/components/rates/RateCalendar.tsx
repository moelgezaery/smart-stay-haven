
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { DollarSign } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";

interface RateCalendarProps {
  selectedMonth: number;
}

export const RateCalendar = ({ selectedMonth }: RateCalendarProps) => {
  const { t } = useTranslation();
  const [calendarDays, setCalendarDays] = useState<Date[]>([]);
  const [rates, setRates] = useState<Record<string, number>>({});
  
  // Initialize with sample rates
  useEffect(() => {
    const year = 2025;
    // Get days in month
    const daysInMonth = new Date(year, selectedMonth + 1, 0).getDate();
    const days = Array.from({ length: daysInMonth }, (_, i) => new Date(year, selectedMonth, i + 1));
    setCalendarDays(days);
    
    // Create sample rates
    const initialRates: Record<string, number> = {};
    days.forEach(day => {
      const dateStr = day.toISOString().split('T')[0];
      const isWeekend = day.getDay() === 0 || day.getDay() === 6;
      // Higher rates for weekends
      initialRates[dateStr] = isWeekend ? 120 : 100;
    });
    setRates(initialRates);
  }, [selectedMonth]);
  
  const handleRateChange = (date: Date, newValue: string) => {
    const dateStr = date.toISOString().split('T')[0];
    const value = parseInt(newValue) || 0;
    setRates(prev => ({
      ...prev,
      [dateStr]: value
    }));
  };
  
  const isWeekend = (date: Date) => {
    return date.getDay() === 0 || date.getDay() === 6;
  };
  
  if (calendarDays.length === 0) {
    return <div>Loading calendar...</div>;
  }
  
  return (
    <div className="space-y-6">
      <div className="flex gap-2 mb-3">
        <Badge className="bg-zinc-100 text-zinc-700 hover:bg-zinc-200">{t("standardRate")}: $100</Badge>
        <Badge className="bg-zinc-100 text-zinc-700 hover:bg-zinc-200">{t("weekendRate")}: $120</Badge>
      </div>
      
      <div className="grid grid-cols-7 gap-2">
        {/* Day labels */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center font-medium text-sm p-2">
            {day}
          </div>
        ))}
        
        {/* Empty cells for days before the month starts */}
        {Array.from({ length: calendarDays[0].getDay() }, (_, i) => (
          <div key={`empty-${i}`} className="p-2"></div>
        ))}
        
        {/* Calendar days */}
        {calendarDays.map(day => {
          const dateStr = day.toISOString().split('T')[0];
          return (
            <Card 
              key={dateStr} 
              className={`p-2 ${isWeekend(day) ? 'bg-muted/50' : ''}`}
            >
              <div className="text-center font-medium text-sm mb-2">
                {day.getDate()}
              </div>
              <div className="flex items-center justify-center">
                <DollarSign className="h-3 w-3 text-muted-foreground" />
                <Input
                  type="number"
                  value={rates[dateStr] || 0}
                  onChange={(e) => handleRateChange(day, e.target.value)}
                  className="h-7 w-16 text-center"
                />
              </div>
            </Card>
          );
        })}
      </div>
      
      <div className="mt-6 p-4 border rounded-md bg-muted/20">
        <h3 className="font-medium mb-2">Booking Engine Preview</h3>
        <div className="border p-3 rounded-md bg-white">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm font-medium">Standard Room</p>
              <p className="text-xs text-muted-foreground">May 15-18, 2025 (3 nights)</p>
            </div>
            <div>
              <p className="text-sm">2 Adults, 1 Child (10)</p>
              <p className="text-xs text-muted-foreground">Base occupancy: 2 adults</p>
            </div>
            <div className="text-right">
              <p className="font-semibold">$320.00</p>
              <p className="text-xs text-muted-foreground">$100 x 3 nights + $20 extra person</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
