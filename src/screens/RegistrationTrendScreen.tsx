import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useDashboard } from '../context/DashboardContext';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const RegistrationTrendScreen = () => {
  const { dashboardData } = useDashboard();

  const trendData = useMemo(() => {
    if (!dashboardData?.users) return { labels: [], data: [], cumulative: [] };

    // Sort users by creation date
    const sortedUsers = [...dashboardData.users].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    // Group users by month
    const monthlyData = sortedUsers.reduce((acc, user) => {
      const date = new Date(user.createdAt);
      const monthYear = `${MONTHS[date.getMonth()]} ${date.getFullYear().toString().slice(2)}`;
      
      if (!acc[monthYear]) {
        acc[monthYear] = 0;
      }
      acc[monthYear]++;
      return acc;
    }, {} as Record<string, number>);

    // Get last 6 months of data
    const months = Object.keys(monthlyData).slice(-6);
    const counts = months.map(month => monthlyData[month]);

    // Calculate cumulative data
    let sum = 0;
    const cumulative = counts.map(count => sum += count);

    return {
      labels: months,
      data: counts,
      cumulative
    };
  }, [dashboardData?.users]);

  const getGrowthRate = () => {
    if (trendData.data.length < 2) return 0;
    const lastMonth = trendData.data[trendData.data.length - 1];
    const previousMonth = trendData.data[trendData.data.length - 2];
    if (previousMonth === 0) return 100;
    return Math.round(((lastMonth - previousMonth) / previousMonth) * 100);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Registration Trend</Text>

      <View style={styles.chartCard}>
        <LineChart
          data={{
            labels: trendData.labels,
            datasets: [
              {
                data: trendData.data,
                color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
                strokeWidth: 2
              },
              {
                data: trendData.cumulative,
                color: (opacity = 1) => `rgba(88, 86, 214, ${opacity})`,
                strokeWidth: 2
              }
            ],
            legend: ['Monthly', 'Cumulative']
          }}
          width={Dimensions.get('window').width - 32}
          height={220}
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 16
            },
            propsForDots: {
              r: '6',
              strokeWidth: '2',
              stroke: '#fafafa'
            }
          }}
          bezier
          style={styles.chart}
          fromZero
        />
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>
            {trendData.data[trendData.data.length - 1] || 0}
          </Text>
          <Text style={styles.statLabel}>Last Month</Text>
        </View>

        <View style={[styles.statCard, { borderLeftColor: getGrowthRate() >= 0 ? '#34C759' : '#FF3B30' }]}>
          <Text style={[styles.statValue, { color: getGrowthRate() >= 0 ? '#34C759' : '#FF3B30' }]}>
            {getGrowthRate()}%
          </Text>
          <Text style={styles.statLabel}>Growth Rate</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statValue}>
            {trendData.cumulative[trendData.cumulative.length - 1] || 0}
          </Text>
          <Text style={styles.statLabel}>Total Users</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1C1C1E',
    padding: 16,
  },
  chartCard: {
    margin: 16,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  statsGrid: {
    padding: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    minWidth: '30%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#8E8E93',
  },
});

export default RegistrationTrendScreen; 