export interface Room {
  id: number; // Changed from string to number to match C# model
  roomNumber: string;
  status: string;
  description?: string;
  floor: number;
  capacity: number;
  hasBalcony: boolean;
  hasOceanView: boolean;
  roomTypeId: number;
  roomType?: { // Added RoomType as an object to match the navigation property
      id: number;
      name: string;
      description: string;
      basePrice: number;
      capacity: number;
      features?: string;
      imageUrl?: string;
      isActive: boolean;
      createdAt: string;
      lastUpdated?: string;
  };
  createdAt: string;
  lastUpdated?: string;
}