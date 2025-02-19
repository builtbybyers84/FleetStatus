export type VehicleStatus = 'available' | 'in-use' | 'out-of-service';

export interface Vehicle {
  id: string;
  number: string;
  status: VehicleStatus;
  location: string;
  notes: string;
  lastUpdated: string;
  assignedTo?: string;
  maintenanceIssue?: string;
}
