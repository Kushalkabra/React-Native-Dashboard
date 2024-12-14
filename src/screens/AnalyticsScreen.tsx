import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Analytics: {
    totalUsers: number;
    activeUsers: number;
    inactiveUsers: number;
    deletedUsersCount: number;
  };
};

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Analytics'>;
  route: RouteProp<RootStackParamList, 'Analytics'>;
};

const AnalyticsScreen: React.FC<Props> = ({ route, navigation }) => {
  const { totalUsers, activeUsers, inactiveUsers, deletedUsersCount } = route.params;

  const calculatePercentage = (value: number) => {
    if (totalUsers === 0) return 0;
    return ((value / totalUsers) * 100).toFixed(1);
  };

  const StatCard = ({ title, value, percentage, color }) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statPercentage}>{percentage}%</Text>
      <Text style={styles.statTitle}>{title}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Analytics</Text>
        <Text style={styles.headerSubtitle}>User Statistics Overview</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.statsGrid}>
          <StatCard
            title="Total Users"
            value={totalUsers}
            percentage={100}
            color="#3949AB"
          />
          <StatCard
            title="Active Users"
            value={activeUsers}
            percentage={calculatePercentage(activeUsers)}
            color="#43A047"
          />
          <StatCard
            title="Inactive Users"
            value={inactiveUsers}
            percentage={calculatePercentage(inactiveUsers)}
            color="#E53935"
          />
          <StatCard
            title="Deleted Users"
            value={deletedUsersCount}
            percentage={calculatePercentage(deletedUsersCount)}
            color="#FF9800"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Detailed Analytics</Text>
          <View style={styles.navigationButtons}>
            <TouchableOpacity
              style={styles.navButton}
              onPress={() => navigation.navigate('RegistrationTrend')}
            >
              <Text style={styles.navButtonTitle}>Registration Trend</Text>
              <Text style={styles.navButtonSubtitle}>View user registration patterns</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.navButton}
              onPress={() => navigation.navigate('RegionalDistribution')}
            >
              <Text style={styles.navButtonTitle}>Regional Distribution</Text>
              <Text style={styles.navButtonSubtitle}>View user distribution by region</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FD',
  },
  header: {
    padding: 20,
    paddingTop: 40,
    backgroundColor: '#FFFFFF',
    shadowColor: '#2C3E50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1A237E',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 15,
    color: '#5C6BC0',
    marginTop: 2,
    fontWeight: '500',
  },
  content: {
    flex: 1,
  },
  statsGrid: {
    padding: 16,
    gap: 16,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statValue: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1A237E',
    marginBottom: 4,
  },
  statPercentage: {
    fontSize: 18,
    fontWeight: '600',
    color: '#5C6BC0',
    marginBottom: 8,
  },
  statTitle: {
    fontSize: 14,
    color: '#757575',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  section: {
    padding: 16,
    paddingTop: 8,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A237E',
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  navigationButtons: {
    gap: 12,
  },
  navButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  navButtonTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A237E',
    marginBottom: 4,
  },
  navButtonSubtitle: {
    fontSize: 14,
    color: '#5C6BC0',
    fontWeight: '500',
  },
});

export default AnalyticsScreen; 