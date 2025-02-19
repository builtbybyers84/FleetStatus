import { clsx } from 'clsx';
import { VehicleStatus } from '../types';

interface StatusBadgeProps {
  status: VehicleStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={clsx(
        'px-2 py-1 rounded-full text-sm font-medium',
        {
          'bg-green-100 text-green-800': status === 'available',
          'bg-blue-100 text-blue-800': status === 'in-use',
          'bg-red-100 text-red-800': status === 'out-of-service',
        }
      )}
    >
      {status.replace('-', ' ')}
    </span>
  );
}
