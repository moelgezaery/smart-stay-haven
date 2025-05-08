
import React, { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, DollarSign, Percent, Users, Tag, LineChart, Building2, User, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RateCalendar } from "@/components/rates/RateCalendar";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";

// Mock data for room types
const roomTypes = [
  { id: 1, name: "Standard Room", baseRate: 100, maxAdults: 2, maxChildren: 1, extraAdultCharge: 20, extraChildCharge: 0, childrenAgeLimit: 12 },
  { id: 2, name: "Deluxe Room", baseRate: 150, maxAdults: 2, maxChildren: 2, extraAdultCharge: 25, extraChildCharge: 0, childrenAgeLimit: 12 },
  { id: 3, name: "Executive Suite", baseRate: 250, maxAdults: 3, maxChildren: 2, extraAdultCharge: 30, extraChildCharge: 15, childrenAgeLimit: 12 },
  { id: 4, name: "Presidential Suite", baseRate: 500, maxAdults: 4, maxChildren: 3, extraAdultCharge: 50, extraChildCharge: 25, childrenAgeLimit: 12 },
];

// Mock data for seasonal adjustments
const seasonalAdjustments = [
  { id: 1, name: "Summer Season", adjustment: 15, startDate: "2025-06-01", endDate: "2025-08-31" },
  { id: 2, name: "Winter Holiday", adjustment: 25, startDate: "2025-12-20", endDate: "2026-01-05" },
  { id: 3, name: "Spring Break", adjustment: 10, startDate: "2025-03-01", endDate: "2025-04-15" },
];

// Mock data for promotions and discounts
const promotions = [
  { id: 1, name: "Early Bird Discount", type: "percentage", value: 15, conditions: "Book 30 days in advance" },
  { id: 2, name: "Last Minute Deal", type: "percentage", value: 20, conditions: "Book within 48 hours of stay" },
  { id: 3, name: "Corporate Rate", type: "fixed", value: 85, conditions: "Valid corporate ID required" },
  { id: 4, name: "Romance Package", type: "package", value: 50, conditions: "Includes dinner and champagne" }
];

const RoomRates = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("baseRates");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth().toString());
  
  return (
    <Layout>
      <div className="flex items-center mb-6">
        <Button 
          variant="outline" 
          size="icon" 
          className="mr-4" 
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-navy-500">{t("roomRates")}</h1>
          <p className="text-muted-foreground mt-1">{t("roomRatesDescription")}</p>
        </div>
      </div>
      
      <Tabs defaultValue="baseRates" className="space-y-4" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-8 gap-2">
          <TabsTrigger value="baseRates" className="flex gap-2 items-center">
            <DollarSign className="h-4 w-4" /> {t("baseRates")}
          </TabsTrigger>
          <TabsTrigger value="seasonal" className="flex gap-2 items-center">
            <Calendar className="h-4 w-4" /> {t("seasonal")}
          </TabsTrigger>
          <TabsTrigger value="promotions" className="flex gap-2 items-center">
            <Percent className="h-4 w-4" /> {t("promotions")}
          </TabsTrigger>
          <TabsTrigger value="rateCalendar" className="flex gap-2 items-center">
            <Calendar className="h-4 w-4" /> {t("rateCalendar")}
          </TabsTrigger>
          <TabsTrigger value="occupancyRules" className="flex gap-2 items-center">
            <User className="h-4 w-4" /> {t("occupancyRules")}
          </TabsTrigger>
          <TabsTrigger value="channel" className="flex gap-2 items-center">
            <Building2 className="h-4 w-4" /> {t("channels")}
          </TabsTrigger>
          <TabsTrigger value="reporting" className="flex gap-2 items-center">
            <LineChart className="h-4 w-4" /> {t("reporting")}
          </TabsTrigger>
          <TabsTrigger value="segments" className="flex gap-2 items-center">
            <Users className="h-4 w-4" /> {t("segments")}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="baseRates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("baseRates")}</CardTitle>
              <CardDescription>{t("baseRatesDescription")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {roomTypes.map((roomType) => (
                <div key={roomType.id} className="border-b pb-4 last:border-0">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold">{roomType.name}</h3>
                    <div className="flex items-center gap-2">
                      <Label htmlFor={`rate-${roomType.id}`}>{t("baseRate")}:</Label>
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 text-muted-foreground mr-1" />
                        <Input 
                          id={`rate-${roomType.id}`}
                          type="number" 
                          defaultValue={roomType.baseRate} 
                          className="w-24" 
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{t("breakfast")}</span>
                      <div className="flex items-center">
                        <DollarSign className="h-3 w-3 text-muted-foreground mr-1" />
                        <Input type="number" defaultValue="25" className="w-20 h-7" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{t("lateCheckout")}</span>
                      <div className="flex items-center">
                        <DollarSign className="h-3 w-3 text-muted-foreground mr-1" />
                        <Input type="number" defaultValue="30" className="w-20 h-7" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{t("extraBed")}</span>
                      <div className="flex items-center">
                        <DollarSign className="h-3 w-3 text-muted-foreground mr-1" />
                        <Input type="number" defaultValue="40" className="w-20 h-7" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              <Button variant="outline">{t("saveChanges")}</Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="seasonal" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>{t("seasonal")}</CardTitle>
                <CardDescription>{t("seasonalDescription")}</CardDescription>
              </div>
              <Button size="sm">{t("addSeasonal")}</Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {seasonalAdjustments.map((season) => (
                  <div key={season.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                    <div>
                      <h3 className="font-semibold">{season.name}</h3>
                      <div className="text-sm text-muted-foreground">
                        {season.startDate} - {season.endDate}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center">
                        <Label htmlFor={`adjustment-${season.id}`} className="mr-2">{t("adjustment")}</Label>
                        <div className="flex items-center">
                          <Input 
                            id={`adjustment-${season.id}`}
                            type="number" 
                            defaultValue={season.adjustment} 
                            className="w-16 text-right" 
                          />
                          <span className="ml-1">%</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">{t("edit")}</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="promotions" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>{t("promotions")}</CardTitle>
                <CardDescription>{t("promotionsDescription")}</CardDescription>
              </div>
              <Button size="sm">{t("addPromotion")}</Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {promotions.map((promo) => (
                  <div key={promo.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{promo.name}</h3>
                        <Tag className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <p className="text-sm text-muted-foreground">{promo.conditions}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        {promo.type === 'percentage' && <span>{promo.value}%</span>}
                        {promo.type === 'fixed' && <span>${promo.value}</span>}
                        {promo.type === 'package' && <span>+${promo.value}</span>}
                      </div>
                      <Button variant="outline" size="sm">{t("edit")}</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="rateCalendar">
          <Card>
            <CardHeader>
              <CardTitle>{t("rateCalendar")}</CardTitle>
              <CardDescription>{t("rateCalendarDescription")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4 mb-6 items-end">
                <div className="space-y-2">
                  <Label>{t("selectMonth")}</Label>
                  <Select defaultValue={selectedMonth} onValueChange={setSelectedMonth}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select month" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 12 }, (_, i) => (
                        <SelectItem key={i} value={i.toString()}>
                          {new Date(2025, i, 1).toLocaleString('default', { month: 'long' })}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>{t("roomTypes")}</Label>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Select room type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Room Types</SelectItem>
                      {roomTypes.map(room => (
                        <SelectItem key={room.id} value={room.id.toString()}>{room.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <Button variant="outline">{t("applyToAllRooms")}</Button>
                <Button>{t("bulkUpdate")}</Button>
              </div>
              
              <RateCalendar selectedMonth={parseInt(selectedMonth)} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="occupancyRules" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("occupancyRules")}</CardTitle>
              <CardDescription>{t("occupancyRulesDescription")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {roomTypes.map((roomType) => (
                  <div key={roomType.id} className="border-b pb-6 last:border-0">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold">{roomType.name}</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <Label className="text-base">{t("maxAdults")}</Label>
                          <span className="font-medium">{roomType.maxAdults}</span>
                        </div>
                        <div className="pl-4">
                          <Slider 
                            defaultValue={[roomType.maxAdults]} 
                            max={6} 
                            step={1} 
                            className="mb-2"
                          />
                        </div>
                        
                        <div className="flex justify-between mt-4">
                          <Label className="text-base">{t("maxChildren")}</Label>
                          <span className="font-medium">{roomType.maxChildren}</span>
                        </div>
                        <div className="pl-4">
                          <Slider 
                            defaultValue={[roomType.maxChildren]} 
                            max={4} 
                            step={1} 
                            className="mb-2"
                          />
                        </div>
                        
                        <div className="flex items-center justify-between mt-4">
                          <Label className="text-base">{t("childrenAgeLimit")}</Label>
                          <div className="flex items-center">
                            <Input 
                              type="number" 
                              defaultValue={roomType.childrenAgeLimit} 
                              className="w-16 text-right" 
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <Label className="text-base">{t("extraAdultCharge")}</Label>
                          <div className="flex items-center mt-1">
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                            <Input 
                              type="number" 
                              defaultValue={roomType.extraAdultCharge} 
                              className="w-24" 
                            />
                            <span className="ml-2 text-muted-foreground text-sm">per night</span>
                          </div>
                        </div>
                        
                        <div className="mt-4">
                          <Label className="text-base">{t("extraChildCharge")}</Label>
                          <div className="flex items-center mt-1">
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                            <Input 
                              type="number" 
                              defaultValue={roomType.extraChildCharge} 
                              className="w-24" 
                            />
                            <span className="ml-2 text-muted-foreground text-sm">per night</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between mt-4">
                          <div>
                            <Label className="text-base mb-1 block">{t("includeBreakfast")}</Label>
                            <p className="text-sm text-muted-foreground">For all guests including extra guests</p>
                          </div>
                          <Switch defaultChecked={true} />
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 bg-muted/50 p-4 rounded-md flex items-start gap-3">
                      <Info className="h-5 w-5 text-blue-500 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-medium mb-1">{t("occupancyPolicies")}:</p>
                        <p>Children under {roomType.childrenAgeLimit} stay free when using existing bedding. Extra bed charges may apply.</p>
                      </div>
                    </div>
                  </div>
                ))}
                
                <Button>{t("saveChanges")}</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="channel">
          <Card>
            <CardHeader>
              <CardTitle>{t("channels")}</CardTitle>
              <CardDescription>{t("channelsDescription")}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{t("comingSoon")}</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reporting">
          <Card>
            <CardHeader>
              <CardTitle>{t("reporting")}</CardTitle>
              <CardDescription>{t("reportingDescription")}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{t("comingSoon")}</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="segments">
          <Card>
            <CardHeader>
              <CardTitle>{t("segments")}</CardTitle>
              <CardDescription>{t("segmentsDescription")}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{t("comingSoon")}</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default RoomRates;
