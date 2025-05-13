
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { GuestForm } from './GuestForm';
import { GuestCreate } from '@/types/guest';
import { guestService } from '@/services/guestService';
import { useToast } from '@/hooks/use-toast';

interface AddGuestModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGuestAdded?: (guest: any) => void;
}

export function AddGuestModal({ open, onOpenChange, onGuestAdded }: AddGuestModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (data: GuestCreate) => {
    setIsLoading(true);
    try {
      const newGuest = await guestService.createGuest(data);
      toast({
        title: "Success",
        description: "Guest has been successfully added",
      });
      
      if (onGuestAdded) {
        onGuestAdded(newGuest);
      }
      
      onOpenChange(false);
    } catch (error) {
      console.error("Error adding guest:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add guest. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Add New Guest</DialogTitle>
        </DialogHeader>
        <GuestForm 
          onSubmit={handleSubmit} 
          onCancel={handleCancel} 
          isLoading={isLoading} 
        />
      </DialogContent>
    </Dialog>
  );
}
