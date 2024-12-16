import { RegionCode } from '../constants/regions';

export interface User {
  id: string | number;
  name: string;
  email: string;
  region: RegionCode | '';
  isActive: boolean;
  createdAt: string;
}

export interface DashboardData {
  users: User[];
  lastUpdated: string;
  // ... other dashboard properties
} 