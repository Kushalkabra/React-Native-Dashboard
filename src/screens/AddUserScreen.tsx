import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useDashboard } from '../context/DashboardContext';
import { REGIONS } from '../constants/regions';

type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  Dashboard: { newUser?: { id: string; name: string; email: string; isActive: boolean; } };
  AddUser: undefined;
};

type AddUserScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'AddUser'>;
};

const AddUserScreen: React.FC<AddUserScreenProps> = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [region, setRegion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { addUser, refreshDashboard } = useDashboard();

  const handleAddUser = async () => {
    if (!name || !email || !region) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      setIsLoading(true);
      
      const newUser = {
        name,
        email,
        region,
        isActive: true,
        createdAt: new Date().toISOString(),
        password: 'defaultPassword123'
      };

      console.log('Attempting to add user:', { ...newUser, password: '***' });
      await addUser(newUser);

      Alert.alert(
        'Success',
        'User added successfully',
        [
          {
            text: 'OK',
            onPress: () => {
              navigation.goBack();
              refreshDashboard();
            }
          }
        ]
      );
    } catch (error) {
      console.error('Add user error:', error);
      Alert.alert(
        'Error',
        error instanceof Error ? error.message : 'Failed to add user'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add New User</Text>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
          editable={!isLoading}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!isLoading}
        />
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={region}
            onValueChange={(itemValue) => setRegion(itemValue)}
            enabled={!isLoading}
            style={styles.picker}
          >
            {REGIONS.map((region) => (
              <Picker.Item 
                key={region.value} 
                label={region.label} 
                value={region.value}
                color={region.value === '' ? '#999' : '#000'}
              />
            ))}
          </Picker>
        </View>
        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleAddUser}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>Add User</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  form: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginBottom: 15,
    overflow: 'hidden', // This helps maintain border radius on iOS
  },
  picker: {
    height: 50,
    width: '100%',
    marginVertical: -10, // Adjust this value to align the picker content
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
});

export default AddUserScreen; 