import { RegionCode } from '../constants/regions';

export interface User {
  id: string;
  name: string;
  email: string;
  region: RegionCode | '';
  isActive: boolean;
  createdAt: string;
} 