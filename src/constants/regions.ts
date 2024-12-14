export const REGIONS = [
  { label: 'Select a region', value: '' },
  { label: 'North America', value: 'NA' },
  { label: 'South America', value: 'SA' },
  { label: 'Europe', value: 'EU' },
  { label: 'Asia', value: 'AS' },
  { label: 'Africa', value: 'AF' },
  { label: 'Oceania', value: 'OC' },
] as const;

export const REGION_COLORS = {
  NA: '#FF6384', // North America
  SA: '#36A2EB', // South America
  EU: '#FFCE56', // Europe
  AS: '#4BC0C0', // Asia
  AF: '#9966FF', // Africa
  OC: '#FF9F40', // Oceania
} as const;

export const REGION_NAMES = {
  NA: 'North America',
  SA: 'South America',
  EU: 'Europe',
  AS: 'Asia',
  AF: 'Africa',
  OC: 'Oceania',
} as const;

export type RegionCode = keyof typeof REGION_NAMES; 