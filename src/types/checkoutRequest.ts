export interface CheckoutRequest {
    actualCheckOutTime: string;
    notes?: string;
    additionalCharges?: number;
    paymentMethod?: string;
    isEarlyCheckout: boolean;
    feedback?: string;
}

export interface CheckoutRequestCreate {
    notes?: string;
    additionalCharges?: number;
    paymentMethod?: string;
    isEarlyCheckout?: boolean;
    feedback?: string;
}

export type CheckoutRequestUpdate = Partial<CheckoutRequestCreate>; 