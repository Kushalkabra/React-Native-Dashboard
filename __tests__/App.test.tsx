/**
 * @format
 */

import 'react-native';
import React from 'react';
import App from '../App';

// Note: import explicitly to use the types shipped with jest.
import {it, describe, expect} from '@jest/globals';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

import { updateUsersOnServer } from '../src/services/dashboardService';
import { dashboardService } from '../src/services/dashboardService';

it('renders correctly', () => {
  renderer.create(<App />);
});

// Add new tests for user editing
describe('User Dashboard', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    // Mock AsyncStorage
    jest.mock('@react-native-async-storage/async-storage', () => ({
      getItem: jest.fn(() => Promise.resolve('fake-token')),
    }));
  });

  it('should handle user editing correctly', () => {
    // Add test implementation once you share the dashboard code
  });

  it('should display error messages when user editing fails', () => {
    // Add test implementation once you share the error handling code
  });

  it('should handle user editing errors correctly', async () => {
    // Mock fetch to simulate a 404 error
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        status: 404,
        text: () => Promise.resolve('Not Found'),
      })
    );

    try {
      await updateUsersOnServer({ id: 1, name: 'Test User' });
      fail('Should have thrown an error');
    } catch (error) {
      expect(error.message).toContain('Update failed: 404');
    }
  });

  it('should handle network errors correctly', async () => {
    // Mock fetch to simulate a network error
    global.fetch = jest.fn(() => 
      Promise.reject(new TypeError('Network request failed'))
    );

    try {
      await dashboardService.updateUsersOnServer([{ id: 1, name: 'Test User' }]);
      fail('Should have thrown an error');
    } catch (error) {
      expect(error.message).toContain('Network connection failed');
    }
  });

  it('should handle server errors correctly', async () => {
    // Mock fetch to simulate a 500 error
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        status: 500,
        text: () => Promise.resolve('Internal Server Error'),
      })
    );

    try {
      await dashboardService.updateUsersOnServer([{ id: 1, name: 'Test User' }]);
      fail('Should have thrown an error');
    } catch (error) {
      expect(error.message).toContain('Update failed: 500');
    }
  });
});
