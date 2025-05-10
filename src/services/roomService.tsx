// src/services/roomService.ts
import axios from 'axios';
import { Room } from '../types/room';   

const API_URL = 'http://localhost:5039/api';

export const roomService = {
  // Get all rooms with optional filtering
  async getRooms(filters?: { 
    roomType?: string; 
    status?: string; 
    minPrice?: number; 
    maxPrice?: number 
  }): Promise<Room[]> {
    const params = new URLSearchParams();
    if (filters?.roomType) params.append('roomType', filters.roomType);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.minPrice) params.append('minPrice', filters.minPrice.toString());
    if (filters?.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
    
    const response = await axios.get(`${API_URL}/Room`, { params });
    return response.data;
  },
  
  // Get a specific room by ID
  async getRoom(id: number): Promise<Room> {
    const response = await axios.get(`${API_URL}/Room/${id}`);
    return response.data;
  },
  
  // Create a new room
  async createRoom(room: Omit<Room, 'id' | 'createdAt' | 'lastUpdated'>): Promise<Room> {
    const response = await axios.post(`${API_URL}/Room`, room);
    return response.data;
  },
  
  // Update an existing room
  async updateRoom(id: number, room: Room): Promise<void> {
    await axios.put(`${API_URL}/Room/${id}`, room);
  },
  
  // Delete a room
  async deleteRoom(id: number): Promise<void> {
    await axios.delete(`${API_URL}/Room/${id}`);
  }
};