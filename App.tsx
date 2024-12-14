/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {MD3LightTheme, PaperProvider} from 'react-native-paper';
import type {RootStackParamList} from './src/types/navigation';

// Screens
import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import AddUserScreen from './src/screens/AddUserScreen';
import SelectRegionScreen from './src/screens/SelectRegionScreen';
import AnalyticsScreen from './src/screens/AnalyticsScreen';
import RegistrationTrendScreen from './src/screens/RegistrationTrendScreen';
import RegionalDistributionScreen from './src/screens/RegionalDistributionScreen';
import EditUserScreen from './src/screens/EditUserScreen';

import {AnalyticsProvider} from './src/context/AnalyticsContext';
import {AuthProvider} from './src/context/AuthContext';
import {DashboardProvider} from './src/context/DashboardContext';

const Stack = createNativeStackNavigator<RootStackParamList>();

const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#007AFF',
    secondary: '#5856D6',
  },
};

function App(): React.JSX.Element {
  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <AuthProvider>
          <DashboardProvider>
            <AnalyticsProvider>
              <Stack.Navigator initialRouteName="Login">
                <Stack.Screen 
                  name="Login" 
                  component={LoginScreen} 
                  options={{headerShown: false}}
                />
                <Stack.Screen 
                  name="Signup" 
                  component={SignupScreen} 
                  options={{headerShown: false}}
                />
                <Stack.Screen 
                  name="Dashboard" 
                  component={DashboardScreen}
                  options={{
                    headerShown: false,
                    gestureEnabled: false
                  }}
                />
                <Stack.Screen 
                  name="AddUser" 
                  component={AddUserScreen}
                  options={{
                    title: 'Add User',
                    headerShown: true
                  }}
                />
                <Stack.Screen 
                  name="SelectRegion" 
                  component={SelectRegionScreen}
                  options={{
                    headerShown: false,
                    presentation: 'modal'
                  }}
                />
                <Stack.Screen 
                  name="Analytics" 
                  component={AnalyticsScreen}
                  options={{
                    headerShown: false,
                    presentation: 'card'
                  }}
                />
                <Stack.Screen 
                  name="RegistrationTrend" 
                  component={RegistrationTrendScreen}
                  options={{
                    headerShown: false,
                    presentation: 'card'
                  }}
                />
                <Stack.Screen 
                  name="RegionalDistribution" 
                  component={RegionalDistributionScreen}
                  options={{
                    headerShown: false,
                    presentation: 'card'
                  }}
                />
                <Stack.Screen 
                  name="EditUser" 
                  component={EditUserScreen}
                  options={{
                    title: 'Edit User',
                    headerShown: true
                  }}
                />
              </Stack.Navigator>
            </AnalyticsProvider>
          </DashboardProvider>
        </AuthProvider>
      </NavigationContainer>
    </PaperProvider>
  );
}

export default App;
