import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { RFValue } from 'react-native-responsive-fontsize';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';

export default function PatientDetail({ route }) {
  const { id } = route.params;

  const [patientInfo, setPatientInfo] = useState(null);
  const [tempData, setTempData] = useState([]);
  const [loading, setLoading] = useState(true);

  const dummyData = [
    { time: '10AM', temp: 98.6 },
    { time: '12PM', temp: 90.1 },
    { time: '2PM', temp: 80.7 },
    { time: '4PM', temp: 93.3 },
    { time: '6PM', temp: 85.9 }
  ];

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const response = await axios.get(`http://192.168.0.124:8000/patient/${id}`);
        const data = response.data;

        setPatientInfo(data.patient);
        setTempData(data.temperatures || []);
      } catch (error) {
        console.error('❌ Error fetching patient details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatientData();
  }, [id]);

  const displayData = tempData.length > 0 ? tempData : dummyData;
  const temps = displayData.map(d => d.temp);
  const avg = temps.length > 0 ? (temps.reduce((a, b) => a + b, 0) / temps.length).toFixed(1) : 'N/A';
  const max = temps.length > 0 ? Math.max(...temps) : 'N/A';
  const min = temps.length > 0 ? Math.min(...temps) : 'N/A';

  if (loading || !patientInfo) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007ACC" />
      </View>
    );
  }

  return (
    <LinearGradient colors={['#4facfe', '#00f2fe']} style={styles.safeArea}>
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar backgroundColor="#007ACC" barStyle="light-content" />
        <View style={styles.header}>
          <Text style={styles.headerText}>Patient Report</Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>👤 Patient Details</Text>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.value}>{patientInfo.name}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Age:</Text>
            <Text style={styles.value}>{patientInfo.age}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Disease:</Text>
            <Text style={styles.value}>{patientInfo.disease}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>🩺 Temperature Chart</Text>

          <LineChart
            data={{
              labels: displayData.map(d => d.time),
              datasets: [{ data: temps }]
            }}
            width={wp('90%')}
            height={hp('35%')}
            yAxisSuffix="°F"
            fromZero
            chartConfig={{
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#f2f2f2',
              decimalPlaces: 1,
              color: (opacity = 1) => `rgba(0, 122, 204, ${opacity})`,
              labelColor: () => '#333',
              propsForDots: {
                r: '6',
                strokeWidth: '2',
                stroke: '#007ACC'
              }
            }}
            bezier
            style={styles.chart}
          />

          <View style={styles.summaryRow}>
            <Text style={styles.summaryText}>Avg: {avg}°F</Text>
            <Text style={styles.summaryText}>Max: {max}°F</Text>
            <Text style={styles.summaryText}>Min: {min}°F</Text>
          </View>
        </View>

        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionIcon}>📞</Text>
            <Text style={styles.actionLabel}>Call</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionIcon}>💊</Text>
            <Text style={styles.actionLabel}>Presc</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionIcon}>📝</Text>
            <Text style={styles.actionLabel}>Notes</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  header: {
    backgroundColor: '#007ACC',
    paddingVertical: hp('2.5%'),
    alignItems: 'center',
    elevation: 4
  },
  headerText: {
    color: '#fff',
    fontSize: RFValue(18),
    fontWeight: 'bold'
  },
  sectionTitle: {
    fontSize: RFValue(16),
    fontWeight: '700',
    marginBottom: hp('2%'),
    color: '#007ACC'
  },
  card: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: wp('5%'),
    marginTop: hp('2%'),
    padding: wp('4%'),
    borderRadius: 12,
    elevation: 3,
    alignItems: 'center'
  },
  chart: {
    borderRadius: 12
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: wp('80%'),
    marginTop: hp('2%')
  },
  summaryText: {
    fontSize: RFValue(14),
    fontWeight: '600',
    color: '#444'
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: wp('5%'),
    padding: wp('4%'),
    borderRadius: 12,
    elevation: 2,
    marginTop: hp('2%')
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: hp('1%')
  },
  label: {
    fontWeight: '600',
    color: '#333',
    width: wp('35%'),
    fontSize: RFValue(14)
  },
  value: {
    color: '#444',
    fontSize: RFValue(14)
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: hp('3%'),
    width: wp('85%'),
    alignSelf: 'center'
  },
  actionButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: wp('18%'),
    height: wp('18%'),
    borderRadius: wp('9%'),
    backgroundColor: '#e6f2ff',
    elevation: 3
  },
  actionIcon: {
    fontSize: RFValue(20)
  },
  actionLabel: {
    fontSize: RFValue(10),
    marginTop: 4,
    color: '#007ACC',
    fontWeight: '600'
  }
});
