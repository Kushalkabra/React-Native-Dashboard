import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

interface LoginResponse {
  success: boolean;
  message?: string;
  token?: string;
}

const API_URL = Platform.OS === 'android' 
  ? 'http://10.0.2.2:3000/api'  // Android emulator localhost
  : 'http://localhost:3000/api'; // iOS simulator localhost
const TOKEN_KEY = 'userToken';

interface SignupData {
  name: string;
  email: string;
  password: string;
}

const authService = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    try {
      console.log('Login attempt:', { email, url: `${API_URL}/login` });

      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      }).catch(error => {
        console.error('Network error:', error);
        throw new Error('Network request failed');
      });

      console.log('Login response status:', response.status);
      const data = await response.json();
      console.log('Login response data:', data);

      if (data.success && data.token) {
        const formattedToken = `Bearer ${data.token}`;
        await AsyncStorage.setItem(TOKEN_KEY, formattedToken);
        console.log('Token stored successfully');
        return {
          success: true,
          token: formattedToken,
          message: 'Login successful'
        };
      }

      return {
        success: false,
        message: data.message || 'Login failed'
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Network error',
      };
    }
  },

  logout: async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(TOKEN_KEY);
      console.log('Token removed successfully');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  },

  getToken: async (): Promise<string | null> => {
    try {
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      console.log('Retrieved token:', token ? `${token.substring(0, 20)}...` : 'No token found');
      return token;
    } catch (error) {
      console.error('Get token error:', error);
      return null;
    }
  },

  isAuthenticated: async (): Promise<boolean> => {
    try {
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      return !!token;
    } catch (error) {
      console.error('Auth check error:', error);
      return false;
    }
  },

  signup: async (data: SignupData): Promise<LoginResponse> => {
    try {
      console.log('Signup attempt:', { email: data.email });

      const response = await fetch(`${API_URL}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();
      console.log('Signup response:', responseData);

      return responseData;
    } catch (error) {
      console.error('Signup error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Network error',
      };
    }
  },

  testConnection: async (): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URL}/health`);
      const data = await response.json();
      return data.success === true;
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  },
};

export default authService; 