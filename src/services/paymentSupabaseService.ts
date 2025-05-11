
import { supabase } from "@/integrations/supabase/client";

export type PaymentMethod = 'Cash' | 'CreditCard' | 'BankTransfer' | 'PayPal' | 'Other';
export type PaymentStatus = 'Pending' | 'Completed' | 'Failed' | 'Refunded';

export interface Payment {
  id: number;
  bookingId: number;
  booking?: any;
  amount: number;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  transactionId?: string;
  paymentDate: string;
  notes?: string;
  refundAmount?: number;
  refundDate?: string;
  refundReason?: string;
  createdAt: string;
  processedById?: number;
  processedBy?: any;
}

export interface PaymentCreate {
  bookingId: number;
  amount: number;
  paymentMethod: PaymentMethod;
  status?: PaymentStatus;
  transactionId?: string;
  paymentDate?: string;
  notes?: string;
  processedById?: number;
}

export interface PaymentUpdate {
  status?: PaymentStatus;
  notes?: string;
  refundAmount?: number;
  refundDate?: string;
  refundReason?: string;
}

const mapToSupabase = (payment: PaymentCreate | PaymentUpdate) => {
  const mappedData: any = {};
  
  if ('bookingId' in payment) mappedData.booking_id = payment.bookingId;
  if ('amount' in payment) mappedData.amount = payment.amount;
  if ('paymentMethod' in payment) mappedData.payment_method = payment.paymentMethod;
  if ('status' in payment) mappedData.status = payment.status;
  if ('transactionId' in payment) mappedData.transaction_id = payment.transactionId;
  if ('paymentDate' in payment) mappedData.payment_date = payment.paymentDate || new Date().toISOString();
  if ('notes' in payment) mappedData.notes = payment.notes;
  if ('refundAmount' in payment) mappedData.refund_amount = payment.refundAmount;
  if ('refundDate' in payment) mappedData.refund_date = payment.refundDate;
  if ('refundReason' in payment) mappedData.refund_reason = payment.refundReason;
  if ('processedById' in payment) mappedData.processed_by_id = payment.processedById;
  
  return mappedData;
};

const mapFromSupabase = (data: any): Payment => {
  return {
    id: data.id,
    bookingId: data.booking_id,
    booking: data.booking,
    amount: data.amount,
    paymentMethod: data.payment_method as PaymentMethod,
    status: data.status as PaymentStatus,
    transactionId: data.transaction_id,
    paymentDate: data.payment_date,
    notes: data.notes,
    refundAmount: data.refund_amount,
    refundDate: data.refund_date,
    refundReason: data.refund_reason,
    createdAt: data.created_at,
    processedById: data.processed_by_id,
    processedBy: data.processed_by
  };
};

export const paymentSupabaseService = {
  async getPayments(): Promise<Payment[]> {
    const { data, error } = await supabase
      .from('payments')
      .select('*, booking:bookings(*)');
      
    if (error) throw error;
    
    return data.map(mapFromSupabase);
  },

  async getPayment(id: number): Promise<Payment> {
    const { data, error } = await supabase
      .from('payments')
      .select('*, booking:bookings(*)')
      .eq('id', id)
      .single();
      
    if (error) throw error;
    
    return mapFromSupabase(data);
  },

  async createPayment(payment: PaymentCreate): Promise<Payment> {
    const { data, error } = await supabase
      .from('payments')
      .insert(mapToSupabase(payment))
      .select('*, booking:bookings(*)')
      .single();
      
    if (error) throw error;
    
    return mapFromSupabase(data);
  },

  async updatePayment(id: number, payment: PaymentUpdate): Promise<void> {
    const { error } = await supabase
      .from('payments')
      .update(mapToSupabase(payment))
      .eq('id', id);
      
    if (error) throw error;
  },

  async deletePayment(id: number): Promise<void> {
    const { error } = await supabase
      .from('payments')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
  },

  async getBookingPayments(bookingId: number): Promise<Payment[]> {
    const { data, error } = await supabase
      .from('payments')
      .select('*, booking:bookings(*)')
      .eq('booking_id', bookingId);
      
    if (error) throw error;
    
    return data.map(mapFromSupabase);
  },

  async getPaymentsByStatus(status: PaymentStatus): Promise<Payment[]> {
    const { data, error } = await supabase
      .from('payments')
      .select('*, booking:bookings(*)')
      .eq('status', status);
      
    if (error) throw error;
    
    return data.map(mapFromSupabase);
  },
  
  async refundPayment(id: number, refundDetails: { amount: number, reason: string }): Promise<void> {
    const { data: payment, error: fetchError } = await supabase
      .from('payments')
      .select('*')
      .eq('id', id)
      .single();
    
    if (fetchError) throw fetchError;
    
    // Check if payment can be refunded
    if (payment.status !== 'Completed') {
      throw new Error('Only completed payments can be refunded');
    }
    
    const { error } = await supabase
      .from('payments')
      .update({
        status: 'Refunded',
        refund_amount: refundDetails.amount,
        refund_date: new Date().toISOString(),
        refund_reason: refundDetails.reason
      })
      .eq('id', id);
      
    if (error) throw error;
  }
};
