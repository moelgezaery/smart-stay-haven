
import React from 'react';

type RoomStatus = 'vacant' | 'occupied' | 'reserved' | 'cleaning' | 'maintenance' | 'checkout';

interface StatusBadgeProps {
  status: RoomStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const getStatusColor = () => {
    switch (status) {
      case 'vacant':
        return 'bg-green-100 text-green-800';
      case 'occupied':
        return 'bg-blue-100 text-blue-800';
      case 'reserved':
        return 'bg-purple-100 text-purple-800';
      case 'cleaning':
        return 'bg-yellow-100 text-yellow-800';
      case 'maintenance':
        return 'bg-red-100 text-red-800';
      case 'checkout':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = () => {
    switch (status) {
      case 'vacant':
        return 'Available';
      case 'occupied':
        return 'Occupied';
      case 'reserved':
        return 'Reserved';
      case 'cleaning':
        return 'Cleaning';
      case 'maintenance':
        return 'Maintenance';
      case 'checkout':
        return 'Checkout';
      default:
        return status;
    }
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor()}`}>
      {getStatusLabel()}
    </span>
  );
}
