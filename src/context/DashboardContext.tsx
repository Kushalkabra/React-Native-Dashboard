import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DashboardData, User } from '../types/dashboard';
import { dashboardService } from '../services/dashboardService';
import { NavigationProp } from '@react-navigation/native';

interface DashboardContextType {
  dashboardData: DashboardData | null;
  isLoading: boolean;
  error: string | null;
  updateUsers: (users: User[]) => Promise<void>;
  addUser: (user: Omit<User, 'id'>) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  refreshDashboard: () => Promise<void>;
}

const DASHBOARD_STORAGE_KEY = 'dashboard_data';

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load saved data on startup
  useEffect(() => {
    loadSavedData();
  }, []);

  const loadSavedData = async () => {
    try {
      const savedData = await AsyncStorage.getItem(DASHBOARD_STORAGE_KEY);
      if (savedData) {
        setDashboardData(JSON.parse(savedData));
      }
      await refreshDashboard(); // Get fresh data from server
    } catch (err) {
      console.error('Error loading saved data:', err);
    }
  };

  const saveDashboardData = async (data: DashboardData) => {
    try {
      await AsyncStorage.setItem(DASHBOARD_STORAGE_KEY, JSON.stringify(data));
    } catch (err) {
      console.error('Error saving dashboard data:', err);
    }
  };

  const updateUsers = async (users: User[]) => {
    try {
      console.log('Updating users:', users);
      const response = await dashboardService.updateUsersOnServer(users);
      
      const updatedData = {
        ...dashboardData!,
        users: response.users,
        lastUpdated: new Date().toISOString()
      };
      
      setDashboardData(updatedData);
      await saveDashboardData(updatedData);
      
      console.log('Users updated successfully');
    } catch (err) {
      console.error('Error updating users:', err);
      setError('Failed to update users');
      throw err;
    }
  };

  const addUser = async (user: Omit<User, 'id'>): Promise<void> => {
    try {
      console.log('Adding new user:', user);
      
      // Call the service to add the user
      const newUser = await dashboardService.addUser(user);
      console.log('User added successfully:', newUser);

      // Update local state with the new user
      const updatedData = {
        ...dashboardData!,
        users: [...(dashboardData?.users || []), newUser],
        lastUpdated: new Date().toISOString()
      };
      
      setDashboardData(updatedData);
      await saveDashboardData(updatedData);
    } catch (err) {
      console.error('Error adding user:', err);
      setError('Failed to add user');
      throw err;
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      const updatedUsers = dashboardData?.users.filter(u => u.id !== userId) || [];
      await updateUsers(updatedUsers);
    } catch (err) {
      console.error('Error deleting user:', err);
      setError('Failed to delete user');
    }
  };

  const refreshDashboard = async (retryCount = 0): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        throw new Error('No authentication token');
      }

      try {
        const freshData = await dashboardService.fetchDashboardData();
        setDashboardData(freshData);
        await saveDashboardData(freshData);
      } catch (fetchError) {
        if (fetchError instanceof Error && fetchError.message.includes('Network')) {
          if (retryCount < 3) {
            console.log(`Retrying (${retryCount + 1}/3)...`);
            await new Promise(resolve => setTimeout(resolve, 1000));
            return refreshDashboard(retryCount + 1);
          }
          throw new Error('Network connection failed after multiple retries');
        }
        throw fetchError;
      }
    } catch (err) {
      console.error('Dashboard refresh error:', err);
      setError(err instanceof Error ? err.message : 'Failed to refresh dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardContext.Provider
      value={{
        dashboardData,
        isLoading,
        error,
        updateUsers,
        addUser,
        deleteUser,
        refreshDashboard,
      }}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
}; 