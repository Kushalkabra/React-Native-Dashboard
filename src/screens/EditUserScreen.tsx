import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useDashboard } from '../context/DashboardContext';
import { REGIONS } from '../constants/regions';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { User } from '../types/dashboard';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'EditUser'>;
  route: RouteProp<RootStackParamList, 'EditUser'>;
};

const EditUserScreen: React.FC<Props> = ({ navigation, route }) => {
  const { user } = route.params;
  const { updateUsers } = useDashboard();
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [region, setRegion] = useState(user.region);
  const [isActive, setIsActive] = useState(user.isActive);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!name || !email || !region) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      setIsLoading(true);
      
      const updatedUser: User = {
        ...user,
        name,
        email,
        region,
        isActive,
      };

      await updateUsers([updatedUser]);

      Alert.alert(
        'Success',
        'User updated successfully',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      console.error('Update user error:', error);
      Alert.alert(
        'Error',
        error instanceof Error ? error.message : 'Failed to update user'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Edit User</Text>
      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Enter name"
            editable={!isLoading}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Enter email"
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!isLoading}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Region</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={region}
              onValueChange={setRegion}
              enabled={!isLoading}
            >
              {REGIONS.map((region) => (
                <Picker.Item
                  key={region.value}
                  label={region.label}
                  value={region.value}
                />
              ))}
            </Picker>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Status</Text>
          <View style={styles.statusButtons}>
            <TouchableOpacity
              style={[
                styles.statusButton,
                isActive && styles.statusButtonActive,
              ]}
              onPress={() => setIsActive(true)}
            >
              <Text
                style={[
                  styles.statusButtonText,
                  isActive && styles.statusButtonTextActive,
                ]}
              >
                Active
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.statusButton,
                !isActive && styles.statusButtonInactive,
              ]}
              onPress={() => setIsActive(false)}
            >
              <Text
                style={[
                  styles.statusButtonText,
                  !isActive && styles.statusButtonTextInactive,
                ]}
              >
                Inactive
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={isLoading}
        >
          <Text style={styles.saveButtonText}>
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FD',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1A237E',
    padding: 20,
    paddingBottom: 10,
  },
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A237E',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  pickerContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    overflow: 'hidden',
  },
  statusButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  statusButton: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
  },
  statusButtonActive: {
    backgroundColor: '#E8F5E9',
    borderColor: '#81C784',
  },
  statusButtonInactive: {
    backgroundColor: '#FFEBEE',
    borderColor: '#E57373',
  },
  statusButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#757575',
  },
  statusButtonTextActive: {
    color: '#2E7D32',
  },
  statusButtonTextInactive: {
    color: '#C62828',
  },
  saveButton: {
    backgroundColor: '#1976D2',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  saveButtonDisabled: {
    backgroundColor: '#BDBDBD',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default EditUserScreen; 