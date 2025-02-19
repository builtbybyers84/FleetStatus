import { Vehicle } from './types';

export const vehicles: Vehicle[] = Array.from({ length: 50 }, (_, index) => ({
  id: `car-${index + 1}`,
  number: `PD-${(index + 1).toString().padStart(3, '0')}`,
  status: Math.random() > 0.7 
    ? 'out-of-service' 
    : Math.random() > 0.5 
      ? 'in-use' 
      : 'available',
  location: 'Police HQ',
  notes: '',
  lastUpdated: new Date().toISOString(),
}));
