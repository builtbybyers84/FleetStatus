import React from 'react';
import { VehicleCard } from '../components/VehicleCard';
import { vehicles } from '../data';

export function FleetOverview() {
  const handleStatusChange = (id: string, status: string) => {
    console.log(`Vehicle ${id} status changed to ${status}`);
  };

  const handleUpdateDetails = (vehicle: any) => {
    console.log(`Update details for vehicle ${vehicle.id}`);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Fleet Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {vehicles.map((vehicle) => (
          <VehicleCard
            key={vehicle.id}
            vehicle={vehicle}
            onStatusChange={handleStatusChange}
            onUpdateDetails={handleUpdateDetails}
          />
        ))}
      </div>
    </div>
  );
}
