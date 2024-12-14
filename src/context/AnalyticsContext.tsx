import React, { createContext, useContext, useState, useEffect } from 'react';

type User = {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  createdAt: Date;
  region: string;
};

type MonthlyData = {
  month: string;
  count: number;
};

type RegionData = {
  region: string;
  users: number;
  percentage: number;
  growth: number;
};

type AnalyticsContextType = {
  monthlyRegistrations: MonthlyData[];
  regionalData: RegionData[];
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  deletedUsers: number;
  isLoading: boolean;
  updateAnalytics: (users: User[]) => void;
};

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

export const AnalyticsProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [monthlyRegistrations, setMonthlyRegistrations] = useState<MonthlyData[]>([]);
  const [regionalData, setRegionalData] = useState<RegionData[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [activeUsers, setActiveUsers] = useState(0);
  const [inactiveUsers, setInactiveUsers] = useState(0);
  const [deletedUsers, setDeletedUsers] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const calculateMonthlyData = (users: User[]) => {
    const last6Months = new Array(6).fill(0).map((_, index) => {
      const date = new Date();
      date.setMonth(date.getMonth() - index);
      return {
        month: date.toLocaleString('default', { month: 'short' }),
        timestamp: date.getTime(),
      };
    }).reverse();

    return last6Months.map(monthData => ({
      month: monthData.month,
      count: users.filter(user => {
        const userDate = new Date(user.createdAt);
        return userDate.getMonth() === new Date(monthData.timestamp).getMonth() &&
               userDate.getFullYear() === new Date(monthData.timestamp).getFullYear();
      }).length,
    }));
  };

  const calculateRegionalData = (users: User[]) => {
    const regions = ['North', 'South', 'East', 'West', 'Central'];
    const regionalCounts = regions.reduce((acc, region) => {
      const regionUsers = users.filter(user => user.region === region);
      
      return {
        ...acc,
        [region]: {
          users: regionUsers.length,
        },
      };
    }, {} as Record<string, { users: number }>);

    const totalRegionalUsers = users.length;

    return regions.map(region => ({
      region,
      users: regionalCounts[region]?.users || 0,
      percentage: totalRegionalUsers ? Math.round((regionalCounts[region]?.users || 0) / totalRegionalUsers * 100) : 0,
      growth: 0, // Growth can be calculated if you store previous counts
    }));
  };

  const updateAnalytics = (users: User[]) => {
    setIsLoading(true);
    
    // Calculate all metrics
    const active = users.filter(user => user.isActive).length;
    const total = users.length;

    setTotalUsers(total);
    setActiveUsers(active);
    setInactiveUsers(total - active);
    setMonthlyRegistrations(calculateMonthlyData(users));
    setRegionalData(calculateRegionalData(users));
    
    setIsLoading(false);
  };

  return (
    <AnalyticsContext.Provider
      value={{
        monthlyRegistrations,
        regionalData,
        totalUsers,
        activeUsers,
        inactiveUsers,
        deletedUsers,
        isLoading,
        updateAnalytics,
      }}>
      {children}
    </AnalyticsContext.Provider>
  );
};

export const useAnalytics = () => {
  const context = useContext(AnalyticsContext);
  if (context === undefined) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
}; 