import { Car, MapPin, AlertCircle, Clock } from 'lucide-react';
import { Vehicle } from '../types';
import { StatusBadge } from './StatusBadge';

interface VehicleCardProps {
  vehicle: Vehicle;
  onStatusChange: (id: string, status: Vehicle['status']) => void;
  onUpdateDetails: (vehicle: Vehicle) => void;
}

export function VehicleCard({ vehicle, onStatusChange, onUpdateDetails }: VehicleCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          <Car className="w-5 h-5 text-gray-500" />
          <h3 className="text-lg font-semibold">{vehicle.number}</h3>
        </div>
        <StatusBadge status={vehicle.status} />
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-gray-600">
          <MapPin className="w-4 h-4" />
          <span>{vehicle.location}</span>
        </div>
        
        {vehicle.maintenanceIssue && (
          <div className="flex items-center gap-2 text-red-600">
            <AlertCircle className="w-4 h-4" />
            <span>{vehicle.maintenanceIssue}</span>
          </div>
        )}
        
        <div className="flex items-center gap-2 text-gray-500 text-sm">
          <Clock className="w-4 h-4" />
          <span>Last updated: {new Date(vehicle.lastUpdated).toLocaleString()}</span>
        </div>
      </div>
      
      <div className="mt-4 flex gap-2">
        <button
          onClick={() => onUpdateDetails(vehicle)}
          className="flex-1 bg-blue-50 text-blue-600 px-3 py-1 rounded hover:bg-blue-100 transition-colors"
        >
          Update Details
        </button>
        <select
          value={vehicle.status}
          onChange={(e) => onStatusChange(vehicle.id, e.target.value as Vehicle['status'])}
          className="flex-1 border rounded px-2 py-1 bg-white"
        >
          <option value="available">Available</option>
          <option value="in-use">In Use</option>
          <option value="out-of-service">Out of Service</option>
        </select>
      </div>
    </div>
  );
}
