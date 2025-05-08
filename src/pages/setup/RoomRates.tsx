
import React, { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, DollarSign, Percent, Users, Tag, LineChart, Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Mock data for room types
const roomTypes = [
  { id: 1, name: "Standard Room", baseRate: 100 },
  { id: 2, name: "Deluxe Room", baseRate: 150 },
  { id: 3, name: "Executive Suite", baseRate: 250 },
  { id: 4, name: "Presidential Suite", baseRate: 500 },
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
        <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
          <TabsTrigger value="baseRates" className="flex gap-2 items-center">
            <DollarSign className="h-4 w-4" /> {t("baseRates")}
          </TabsTrigger>
          <TabsTrigger value="seasonal" className="flex gap-2 items-center">
            <Calendar className="h-4 w-4" /> {t("seasonal")}
          </TabsTrigger>
          <TabsTrigger value="promotions" className="flex gap-2 items-center">
            <Percent className="h-4 w-4" /> {t("promotions")}
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
