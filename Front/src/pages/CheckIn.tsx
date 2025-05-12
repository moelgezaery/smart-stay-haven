
import { useState } from 'react';
import { Layout } from "@/components/layout/Layout";
import { PaymentDetails } from "@/components/payment/PaymentDetails";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function CheckIn() {
  const [paymentDetails, setPaymentDetails] = useState<any>(null);
  const { toast } = useToast();
  
  const handlePaymentUpdate = (details: any) => {
    console.log("Payment details updated:", details);
    setPaymentDetails(details);
  };
  
  const handleCheckIn = () => {
    toast({
      title: "Check-in Complete",
      description: "Guest has been successfully checked in."
    });
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Check-In Management</h1>
          <Button
            className="px-8 h-9" 
            onClick={handleCheckIn}
          >
            Complete Check-In
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Guest Information */}
          <div className="space-y-6">
            <div className="border p-4 rounded-md">
              <h2 className="text-xl font-semibold mb-4">Guest Information</h2>
              <div className="space-y-2">
                <p><span className="font-medium">Name:</span> John Smith</p>
                <p><span className="font-medium">Email:</span> john.smith@example.com</p>
                <p><span className="font-medium">Phone:</span> +1 (555) 123-4567</p>
                <p><span className="font-medium">Arrival:</span> May 12, 2025</p>
                <p><span className="font-medium">Departure:</span> May 15, 2025</p>
              </div>
            </div>
            
            <div className="border p-4 rounded-md">
              <h2 className="text-xl font-semibold mb-4">Room Details</h2>
              <div className="space-y-2">
                <p><span className="font-medium">Room:</span> 101 - Deluxe King</p>
                <p><span className="font-medium">Floor:</span> 1</p>
                <p><span className="font-medium">Rate:</span> $150.00 / night</p>
                <p><span className="font-medium">Total Nights:</span> 3</p>
                <p><span className="font-medium">Total Amount:</span> $450.00</p>
              </div>
            </div>
          </div>
          
          {/* Payment Details */}
          <div>
            <PaymentDetails totalAmount={450} onPaymentUpdate={handlePaymentUpdate} />
          </div>
        </div>
      </div>
    </Layout>
  );
}
