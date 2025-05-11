
import { supabase } from "@/integrations/supabase/client";
import { RoomType, RoomTypeCreate, RoomTypeUpdate } from "@/types/roomType";

// Convert from our app types to Supabase database types
const mapToSupabase = (roomType: RoomTypeCreate | RoomTypeUpdate) => {
  const mappedData: any = {};
  
  if ('name' in roomType) mappedData.name = roomType.name;
  if ('description' in roomType) mappedData.description = roomType.description;
  if ('baseRate' in roomType) mappedData.base_rate = roomType.baseRate;
  if ('maxOccupancy' in roomType) mappedData.max_occupancy = roomType.maxOccupancy;
  if ('bedCount' in roomType) mappedData.bed_count = roomType.bedCount;
  if ('bedType' in roomType) mappedData.bed_type = roomType.bedType;
  if ('hasBalcony' in roomType) mappedData.has_balcony = roomType.hasBalcony;
  if ('hasOceanView' in roomType) mappedData.has_ocean_view = roomType.hasOceanView;
  if ('isActive' in roomType) mappedData.is_active = roomType.isActive;
  
  return mappedData;
};

// Convert from Supabase database types to our app types
const mapFromSupabase = (data: any): RoomType => {
  return {
    id: data.id,
    name: data.name,
    description: data.description,
    baseRate: data.base_rate,
    maxOccupancy: data.max_occupancy,
    bedCount: data.bed_count,
    bedType: data.bed_type,
    hasBalcony: data.has_balcony,
    hasOceanView: data.has_ocean_view,
    isActive: data.is_active,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    rooms: data.rooms || [],
    amenities: data.amenities || []
  };
};

export const roomTypeSupabaseService = {
  async getRoomTypes(): Promise<RoomType[]> {
    const { data, error } = await supabase
      .from('room_types')
      .select('*');
      
    if (error) throw error;
    
    return data.map(mapFromSupabase);
  },

  async getRoomType(id: number): Promise<RoomType> {
    const { data, error } = await supabase
      .from('room_types')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) throw error;
    
    return mapFromSupabase(data);
  },

  async createRoomType(roomType: RoomTypeCreate): Promise<RoomType> {
    const { data, error } = await supabase
      .from('room_types')
      .insert(mapToSupabase(roomType))
      .select()
      .single();
      
    if (error) throw error;
    
    return mapFromSupabase(data);
  },

  async updateRoomType(id: number, roomType: RoomTypeUpdate): Promise<void> {
    const { error } = await supabase
      .from('room_types')
      .update(mapToSupabase(roomType))
      .eq('id', id);
      
    if (error) throw error;
  },

  async deleteRoomType(id: number): Promise<void> {
    const { error } = await supabase
      .from('room_types')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
  },

  async getActiveRoomTypes(): Promise<RoomType[]> {
    const { data, error } = await supabase
      .from('room_types')
      .select('*')
      .eq('is_active', true);
      
    if (error) throw error;
    
    return data.map(mapFromSupabase);
  },

  async getRoomTypeWithRooms(id: number): Promise<RoomType> {
    const { data, error } = await supabase
      .from('room_types')
      .select('*, rooms(*)')
      .eq('id', id)
      .single();
      
    if (error) throw error;
    
    return mapFromSupabase(data);
  }
};
