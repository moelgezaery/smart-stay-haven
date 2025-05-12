
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { DollarSign, CreditCard, Wallet } from "lucide-react";

interface PaymentDetailsProps {
  totalAmount?: number;
  onPaymentUpdate?: (paymentDetails: any) => void;
}

export function PaymentDetails({ totalAmount = 0, onPaymentUpdate }: PaymentDetailsProps) {
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [splitPayment, setSplitPayment] = useState(false);
  const [amountPrimary, setAmountPrimary] = useState(totalAmount);
  const [amountSecondary, setAmountSecondary] = useState(0);
  const [secondaryMethod, setSecondaryMethod] = useState("cash");
  const [tipAmount, setTipAmount] = useState(0);
  const [notes, setNotes] = useState("");
  const [emailReceipt, setEmailReceipt] = useState(true);
  const [printReceipt, setPrintReceipt] = useState(false);

  const handleSplitToggle = (checked: boolean) => {
    setSplitPayment(checked);
    if (checked) {
      setAmountPrimary(totalAmount / 2);
      setAmountSecondary(totalAmount / 2);
    } else {
      setAmountPrimary(totalAmount);
      setAmountSecondary(0);
    }
  };

  const handlePrimaryAmountChange = (value: string) => {
    const amount = parseFloat(value) || 0;
    setAmountPrimary(amount);
    if (splitPayment) {
      setAmountSecondary(Math.max(totalAmount - amount, 0));
    }
  };

  const handleSecondaryAmountChange = (value: string) => {
    const amount = parseFloat(value) || 0;
    setAmountSecondary(amount);
    if (splitPayment) {
      setAmountPrimary(Math.max(totalAmount - amount, 0));
    }
  };

  const updatePaymentDetails = () => {
    if (onPaymentUpdate) {
      onPaymentUpdate({
        paymentMethod,
        splitPayment,
        amountPrimary,
        amountSecondary,
        secondaryMethod,
        tipAmount,
        notes,
        emailReceipt,
        printReceipt,
        totalPaid: amountPrimary + amountSecondary + tipAmount,
      });
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Payment Details
        </CardTitle>
        <CardDescription>
          Manage guest payment information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="payment-method">Payment Method</Label>
            <Select
              value={paymentMethod}
              onValueChange={(value) => {
                setPaymentMethod(value);
                updatePaymentDetails();
              }}
            >
              <SelectTrigger id="payment-method" className="w-full">
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">
                  <div className="flex items-center">
                    <Wallet className="mr-2 h-4 w-4" />
                    Cash
                  </div>
                </SelectItem>
                <SelectItem value="card">
                  <div className="flex items-center">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Card
                  </div>
                </SelectItem>
                <SelectItem value="mobile-wallet">Mobile Wallet</SelectItem>
                <SelectItem value="corporate">Corporate Account</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="amount-due">Amount Due Today</Label>
            <div className="text-xl font-bold">{formatCurrency(totalAmount)}</div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch 
              id="split-payment" 
              checked={splitPayment}
              onCheckedChange={(checked) => {
                handleSplitToggle(checked);
                updatePaymentDetails();
              }}
            />
            <Label htmlFor="split-payment">Split Payment</Label>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="amount-primary">
                {splitPayment ? "Primary Payment Amount" : "Payment Amount"}
              </Label>
              <div className="relative mt-1">
                <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                <Input
                  id="amount-primary"
                  type="number"
                  className="pl-7"
                  value={amountPrimary}
                  onChange={(e) => {
                    handlePrimaryAmountChange(e.target.value);
                    updatePaymentDetails();
                  }}
                />
              </div>
            </div>

            {splitPayment && (
              <div className="space-y-2">
                <Label htmlFor="secondary-method">Secondary Payment Method</Label>
                <Select
                  value={secondaryMethod}
                  onValueChange={(value) => {
                    setSecondaryMethod(value);
                    updatePaymentDetails();
                  }}
                >
                  <SelectTrigger id="secondary-method">
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="card">Card</SelectItem>
                    <SelectItem value="mobile-wallet">Mobile Wallet</SelectItem>
                    <SelectItem value="corporate">Corporate Account</SelectItem>
                  </SelectContent>
                </Select>

                <Label htmlFor="amount-secondary">Secondary Payment Amount</Label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                  <Input
                    id="amount-secondary"
                    type="number"
                    className="pl-7"
                    value={amountSecondary}
                    onChange={(e) => {
                      handleSecondaryAmountChange(e.target.value);
                      updatePaymentDetails();
                    }}
                  />
                </div>
              </div>
            )}

            <div>
              <Label htmlFor="tip-amount">Tip / Gratuity (Optional)</Label>
              <div className="relative mt-1">
                <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                <Input
                  id="tip-amount"
                  type="number"
                  className="pl-7"
                  value={tipAmount}
                  onChange={(e) => {
                    setTipAmount(parseFloat(e.target.value) || 0);
                    updatePaymentDetails();
                  }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="payment-notes">Payment Notes</Label>
              <Textarea
                id="payment-notes"
                placeholder="Enter any special billing instructions or notes..."
                value={notes}
                onChange={(e) => {
                  setNotes(e.target.value);
                  updatePaymentDetails();
                }}
              />
            </div>

            <div className="space-y-2">
              <Label>Receipt Options</Label>
              <div className="flex flex-col space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="email-receipt" 
                    checked={emailReceipt}
                    onCheckedChange={(checked) => {
                      setEmailReceipt(!!checked);
                      updatePaymentDetails();
                    }}
                  />
                  <label
                    htmlFor="email-receipt"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Email receipt to guest
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="print-receipt" 
                    checked={printReceipt}
                    onCheckedChange={(checked) => {
                      setPrintReceipt(!!checked);
                      updatePaymentDetails();
                    }}
                  />
                  <label
                    htmlFor="print-receipt"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Print receipt
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
