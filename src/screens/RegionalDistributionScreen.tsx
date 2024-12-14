import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { useDashboard } from '../context/DashboardContext';
import { REGION_NAMES, REGION_COLORS } from '../constants/regions';

const RegionalDistributionScreen = () => {
  const { dashboardData } = useDashboard();

  const chartData = useMemo(() => {
    if (!dashboardData?.users) return [];

    // Count users by region
    const regionCounts = dashboardData.users.reduce((acc, user) => {
      if (user.region) {
        acc[user.region] = (acc[user.region] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    // Convert to chart data format
    return Object.entries(regionCounts)
      .map(([region, count]) => ({
        name: REGION_NAMES[region as keyof typeof REGION_NAMES] || region,
        population: count,
        color: REGION_COLORS[region as keyof typeof REGION_COLORS] || '#CCCCCC',
        legendFontColor: '#7F7F7F',
        legendFontSize: 12,
      }))
      .sort((a, b) => b.population - a.population); // Sort by count descending
  }, [dashboardData?.users]);

  const totalUsers = dashboardData?.users.length || 0;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Regional Distribution</Text>

      {chartData.length > 0 ? (
        <>
          <View style={styles.chartCard}>
            <PieChart
              data={chartData}
              width={Dimensions.get('window').width - 32}
              height={220}
              chartConfig={{
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              }}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
            />
          </View>

          <View style={styles.statsContainer}>
            {chartData.map((region) => (
              <View key={region.name} style={styles.statRow}>
                <View style={styles.labelContainer}>
                  <View style={[styles.colorDot, { backgroundColor: region.color }]} />
                  <Text style={styles.regionName}>{region.name}</Text>
                </View>
                <View style={styles.statsRight}>
                  <Text style={styles.userCount}>{region.population}</Text>
                  <Text style={styles.percentage}>
                    {((region.population / totalUsers) * 100).toFixed(1)}%
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </>
      ) : (
        <Text style={styles.noDataText}>No regional data available</Text>
      )}
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
  statsContainer: {
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
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  regionName: {
    fontSize: 16,
    color: '#1C1C1E',
  },
  statsRight: {
    alignItems: 'flex-end',
  },
  userCount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
  percentage: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 2,
  },
  noDataText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#8E8E93',
    marginTop: 50,
  },
});

export default RegionalDistributionScreen; 