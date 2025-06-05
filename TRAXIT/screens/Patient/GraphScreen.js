import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

export default function GraphScreen() {
  const dummyData = [
    { time: '10AM', temp: 98.4 },
    { time: '12PM', temp: 99.1 },
    { time: '2PM', temp: 99.5 },
    { time: '4PM', temp: 98.9 },
    { time: '6PM', temp: 99.3 },
  ];

  const patientInfo = {
    name: 'John Doe',
    age: 28,
    gender: 'Male',
    lastUpdated: '31 May 2025, 2:00 PM',
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Patient Temperature Chart</Text>
      <LineChart
        data={{
          labels: dummyData.map((d) => d.time),
          datasets: [{ data: dummyData.map((d) => d.temp) }],
        }}
        width={screenWidth - 40}
        height={260}
        yAxisSuffix="°F"
        yAxisInterval={1}
        chartConfig={{
          backgroundGradientFrom: '#e0f7fa',
          backgroundGradientTo: '#e1bee7',
          color: (opacity = 1) => `rgba(51, 102, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          propsForDots: {
            r: '6',
            strokeWidth: '2',
            stroke: '#3366FF',
          },
        }}
        bezier
        style={styles.chart}
      />

      <View style={styles.infoCard}>
        <Text style={styles.infoHeader}>Patient Details</Text>
        <Text style={styles.infoItem}>👤 Name: {patientInfo.name}</Text>
        <Text style={styles.infoItem}>🎂 Age: {patientInfo.age}</Text>
        <Text style={styles.infoItem}>🚻 Gender: {patientInfo.gender}</Text>
        <Text style={styles.infoItem}>🕒 Last Updated: {patientInfo.lastUpdated}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA', padding: 20 },
  title: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  chart: {
    borderRadius: 16,
    marginBottom: 30,
    elevation: 3,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  infoHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#222',
  },
  infoItem: {
    fontSize: 16,
    marginBottom: 6,
    color: '#555',
  },
});
