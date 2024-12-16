import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DashboardData, User } from '../types/dashboard';
import authService from './authService';

const API_URL = Platform.OS === 'android' 
  ? 'http://10.0.2.2:3000/api'
  : 'http://localhost:3000/api';

console.log('API_URL configured as:', API_URL);

export const dashboardService = {
  fetchDashboardData: async (): Promise<DashboardData> => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        throw new Error('No authentication token');
      }

      console.log('Attempting to fetch dashboard data...');
      const response = await fetch(`${API_URL}/dashboard`, {
        method: 'GET',
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          await AsyncStorage.removeItem('userToken');
          throw new Error('Authentication failed');
        }
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch dashboard data');
      }

      console.log('Dashboard data fetched successfully');
      return data.data;
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('Network request failed')) {
        throw new Error('Network connection failed. Please check your internet connection.');
      }
      throw error;
    }
  },

  // Add a test method to verify connectivity
  testConnection: async (): Promise<void> => {
    try {
      const response = await fetch(`${API_URL}/test`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Server test failed: ${response.status}`);
      }

      const data = await response.json();
      console.log('Server test response:', data);
    } catch (error) {
      console.error('Connection test failed:', error);
      throw error;
    }
  },

  addUser: async (userData: Omit<User, 'id'>): Promise<User> => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        throw new Error('No authentication token');
      }

      console.log('Adding user with data:', userData);
      const response = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const text = await response.text();
        console.error('Add user failed:', {
          status: response.status,
          response: text
        });
        throw new Error(text || 'Failed to add user');
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || 'Failed to add user');
      }

      console.log('User added successfully:', data.user);
      return data.user;
    } catch (error) {
      console.error('Add user error:', error);
      throw error;
    }
  },
}; 