import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, StatusBar, SafeAreaView, TouchableOpacity,
  ActivityIndicator, Alert, Linking, TextInput, Keyboard, Platform
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { RFValue } from 'react-native-responsive-fontsize';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function PatientDetail({ route, navigation }) {
  const { id } = route.params;

  const [patientInfo, setPatientInfo] = useState(null);
  const [tempData, setTempData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [threshold, setThreshold] = useState('');
  const [storedThreshold, setStoredThreshold] = useState(null);
  const [temphgh, setTemhgh] = useState('');
  const [availableDates, setAvailableDates] = useState([]);
  const [notifiedToday, setNotifiedToday] = useState(false);

  const formatDate = date => date.toISOString().split('T')[0];
  const isToday = date => date.toDateString() === new Date().toDateString();

  // 📣 Local notification function
  const triggerHighTempNotification = async (temp, threshold) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🌡️ High Temperature Alert!',
        body: `Temperature ${temp}°F of ${patientInfo.name} exceeded high Temperature ${threshold}°F`,
        sound: 'default',
      },
      trigger: null, // trigger immediately
    });
  };

  // const notifyHighTemp = async (thresholdValue) => {
  //   // Alert.alert('🚨 High Temperature Alert', `Today's temperature exceeded the threshold of ${thresholdValue}°F!`);

  //   try {
  //     await axios.post('http://192.168.0.106:8000/notifyDoctor', {
  //       patientId: id,
  //       threshold: thresholdValue,
  //       date: formatDate(new Date()),
  //     });
  //     console.log('Doctor notified successfully');
  //   } catch (error) {
  //     console.error('Notification failed:', error);
  //     Alert.alert('❌ Notification Error', 'Failed to notify the doctor.');
  //   }
  // };

  const registerForPushNotificationsAsync = async () => {
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        Alert.alert('Permission Denied', 'Notification permission is required.');
        return;
      }

      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
        });
      }
    } else {
      Alert.alert('Physical device required for notifications');
    }
  };

  const saveThreshold = async () => {
    const num = parseFloat(threshold);
    if (isNaN(num)) {
      return Alert.alert('Invalid input', 'Please enter a numeric value.');
    }
    try {
      await AsyncStorage.setItem(`threshold_${id}`, num.toString());
      setStoredThreshold(num);
      Alert.alert('✅ Threshold saved', `${num}°F`);
      Keyboard.dismiss();
    } catch (e) {
      console.error('Threshold save failed:', e);
      Alert.alert('❌ Error', 'Could not save threshold.');
    }
  };

  const loadThreshold = async () => {
    try {
      const stored = await AsyncStorage.getItem(`threshold_${id}`);
      setTemhgh(stored);
      if (stored) {
        setStoredThreshold(parseFloat(stored));
        setThreshold(stored); // 👈 Show in input field
      }
    } catch (e) {
      console.error('Threshold load failed:', e);
    }
  };


  const changeDate = days => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    const formatted = newDate.toDateString();

    if (availableDates.includes(formatted)) {
      setSelectedDate(newDate);
      setNotifiedToday(false); // Reset notification for new date
    } else {
      Alert.alert('⛔ No data', 'No temperature data available for this date.');
    }
  };

  useEffect(() => {
    registerForPushNotificationsAsync();
    loadThreshold();
    axios
      .get(`http://192.168.0.106:8000/getavailabledates/${id}`)
      .then(res => {
        if (res.data.success) {
          setAvailableDates(res.data.dates.map(d => new Date(d).toDateString()));
        }
      })
      .catch(err => console.error('Available dates fetch failed:', err));
  }, [id]);

  useEffect(() => {
    const fetchTempData = async () => {
      try {
        const dateStr = formatDate(selectedDate);
        const res = await axios.get(`http://192.168.0.106:8000/gettempdata/${id}?date=${dateStr}`);
        const raw = res.data.data || [];
        const processed = raw.map(e => ({
          time: new Date(e.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
          temp: parseFloat(e.temprature),
        }));

        setTempData(processed);

        if (isToday(selectedDate) && storedThreshold != null && !notifiedToday) {
          const exceeded = processed.find(d => d.temp > storedThreshold);
          if (exceeded) {
            setNotifiedToday(true);
            triggerHighTempNotification(exceeded.temp, storedThreshold);
            notifyHighTemp(storedThreshold);
          }
        }
      } catch (err) {
        console.error('Temperature fetch failed:', err);
        Alert.alert('❌ Error', 'Could not load temperature data.');
      }
    };

    fetchTempData();
  }, [selectedDate, id, storedThreshold]);

  useEffect(() => {
    axios
      .get(`http://192.168.0.106:8000/patient/${id}`)
      .then(res => setPatientInfo(res.data.patient))
      .catch(err => console.error('Patient fetch failed:', err))
      .finally(() => setLoading(false));
  }, [id]);

  // ... your render code below remains unchanged ...

  if (loading || !patientInfo) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#007ACC" />
      </View>
    );
  }

  const temps = tempData.map(d => d.temp);
  const avg = temps.length ? (temps.reduce((a, b) => a + b, 0) / temps.length).toFixed(1) : 'N/A';
  const max = temps.length ? Math.max(...temps) : 'N/A';
  const min = temps.length ? Math.min(...temps) : 'N/A';

  const prevDisabled = !availableDates.includes(
    new Date(new Date(selectedDate).setDate(selectedDate.getDate() - 1)).toDateString()
  );

  const nextDisabled = !availableDates.includes(
    new Date(new Date(selectedDate).setDate(selectedDate.getDate() + 1)).toDateString()
  );

  return (
    <LinearGradient colors={['#4facfe', '#00f2fe']} style={styles.safeArea}>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />

        <View style={styles.header}>
          <Text style={styles.headerText}>Patient Report</Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.sectionTitle}>👤 Patient</Text>
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
          <View style={styles.infoRow}>
            <Text style={styles.label}>High Temp (°F):</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 100.4"
              keyboardType="numeric"
              value={threshold} // 👈 This shows the current threshold in the input
              onChangeText={setThreshold}
              onSubmitEditing={saveThreshold}
            />

          </View>
          <TouchableOpacity style={styles.saveBtn} onPress={saveThreshold}>
            <Text style={styles.saveText}>Save High Temerature</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.chartBox}>
          <Text style={styles.sectionTitle}>🩺 Temperature Chart</Text>

          <View style={styles.navRow}>
            <TouchableOpacity onPress={() => changeDate(-1)} disabled={prevDisabled}>
              <Text style={[styles.navArrow, prevDisabled && styles.disabled]}>←</Text>
            </TouchableOpacity>
            <Text style={styles.dateText}>{selectedDate.toDateString()}</Text>
            <TouchableOpacity onPress={() => changeDate(1)} disabled={nextDisabled}>
              <Text style={[styles.navArrow, nextDisabled && styles.disabled]}>→</Text>
            </TouchableOpacity>
          </View>

          <LineChart
            data={{
              labels: tempData.map(d => d.time),
              datasets: [{ data: temps }],
            }}
            width={wp('90%')}
            height={hp('35%')}
            yAxisSuffix="°F"
            fromZero
            chartConfig={{
              backgroundGradientFrom: '#fff',
              backgroundGradientTo: '#f2f2f2',
              decimalPlaces: 1,
              color: (opacity = 1) => `rgba(0, 122, 204, ${opacity})`,
              labelColor: () => '#333',
              propsForDots: { r: '6', strokeWidth: '2', stroke: '#007ACC' },
            }}
            bezier
            style={styles.chart}
          />

          <View style={styles.summaryRow}>
            <Text style={styles.summary}>Avg: {avg}°F</Text>
            <Text style={styles.summary}>Max: {max}°F</Text>
            <Text style={styles.summary}>Min: {min}°F</Text>
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => {
              if (patientInfo.phone) Linking.openURL(`tel:${patientInfo.phone}`);
              else Alert.alert('📵 No phone number');
            }}
          >
            <Text style={styles.actionIcon}>📞</Text>
            <Text style={styles.actionLabel}>Call</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => navigation.navigate('PrescriptionScreen', { id })}
          >
            <Text style={styles.actionIcon}>💊</Text>
            <Text style={styles.actionLabel}>Presc</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => navigation.navigate('NotesScreen', { id })}
          >
            <Text style={styles.actionIcon}>📝</Text>
            <Text style={styles.actionLabel}>Notes</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1 },
  header: { paddingVertical: hp('1.5%'), backgroundColor: '#007ACC' },
  headerText: { color: '#fff', fontSize: RFValue(18), fontWeight: 'bold', textAlign: 'center' },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  infoBox: {
    backgroundColor: '#fff',
    margin: wp('2%'),
    padding: wp('3%'),
    borderRadius: 10,
  },
  sectionTitle: { fontSize: RFValue(16), fontWeight: 'bold', marginBottom: hp('1%') },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: hp('1%') },
  label: { fontWeight: '600', fontSize: RFValue(14) },
  value: { fontSize: RFValue(14) },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    width: wp('20%'),
    padding: wp('1%'),
    textAlign: 'center',
    borderRadius: 6,
  },
  saveBtn: {
    marginTop: hp('1%'),
    backgroundColor: '#007ACC',
    paddingVertical: hp('1%'),
    borderRadius: 8,
    alignItems: 'center',
  },
  saveText: { color: '#fff', fontWeight: '600' },
  chartBox: {
    backgroundColor: '#fff',
    margin: wp('2%'),
    padding: wp('3%'),
    borderRadius: 10,
  },
  navRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: hp('1%') },
  navArrow: { fontSize: RFValue(22), marginHorizontal: wp('5%') },
  disabled: { opacity: 0.3 },
  dateText: { fontSize: RFValue(14), fontWeight: '600' },
  chart: { marginVertical: hp('1%'), borderRadius: 8 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: hp('1%') },
  summary: { fontSize: RFValue(12), fontWeight: '600' },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: hp('1%'),
    paddingBottom: hp('2%'),
  },
  actionBtn: { alignItems: 'center' },
  actionIcon: { fontSize: RFValue(24), backgroundColor: '#fff', padding: '20', borderRadius: '50%' },
  actionLabel: { fontSize: RFValue(12), marginTop: hp('0.5%') },
});
