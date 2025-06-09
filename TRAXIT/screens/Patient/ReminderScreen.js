import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
  Alert,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const intervals = [
  { label: '1/2 Minute', seconds: 30 },
  { label: '10 Minutes', seconds: 600 },
  { label: '20 Minutes', seconds: 1200 },
  { label: '30 Minutes', seconds: 1800 },
  { label: '40 Minutes', seconds: 2400 },
  { label: '50 Minutes', seconds: 3000 },
  { label: '1 Hour', seconds: 3600 },
];

export default function ReminderScreen() {
  const [intervalSeconds, setIntervalSeconds] = useState(1800);
  const [showIntervalModal, setShowIntervalModal] = useState(false);
  const [key, setKey] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    (async () => {
      const savedInterval = await AsyncStorage.getItem('traxit_interval');
      if (savedInterval) setIntervalSeconds(parseInt(savedInterval));

      await registerForPushNotificationsAsync();
    })();
  }, []);

  const scheduleNotification = async () => {
    const triggerTime = Date.now() + intervalSeconds * 1000;
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '⏰ Reminder!',
        body: 'Time to scan your Traxit temperature sticker.',
        sound: 'default',
      },
      trigger: { seconds: intervalSeconds },
    });
  };

  const onTimerComplete = async () => {
    await scheduleNotification();
    setIsPlaying(false);
    return { shouldRepeat: false };
  };

  const startReminder = async () => {
    await AsyncStorage.setItem('traxit_interval', intervalSeconds.toString());
    setKey(prev => prev + 1);
    setIsPlaying(true);
  };

  const cancelReminder = async () => {
    await Notifications.cancelAllScheduledNotificationsAsync();
    await AsyncStorage.removeItem('traxit_interval');
    setIsPlaying(false);
    setKey(prev => prev + 1);
    Alert.alert('Reminder Cancelled');
  };

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

  return (
    <LinearGradient colors={['#11998e', '#38ef7d']} style={styles.container}>
      <Text style={styles.title}>Traxit Temperature Reminder</Text>

      <CountdownCircleTimer
        key={key}
        isPlaying={isPlaying}
        duration={intervalSeconds}
        colors={["#fff"]}
        trailColor="rgba(255,255,255,0.2)"
        strokeWidth={12}
        size={220}
        onComplete={onTimerComplete}
      >
        {({ remainingTime }) => {
          const minutes = Math.floor(remainingTime / 60);
          const seconds = remainingTime % 60;
          return (
            <Text style={styles.timerText}>
              {`${minutes.toString().padStart(2, '0')}:${seconds
                .toString()
                .padStart(2, '0')}`}
            </Text>
          );
        }}
      </CountdownCircleTimer>

      <TouchableOpacity style={styles.intervalButton} onPress={() => setShowIntervalModal(true)}>
        <Text style={styles.intervalText}>
          Interval: {intervals.find((i) => i.seconds === intervalSeconds)?.label || 'Custom'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.startButton]} onPress={startReminder}>
        <Text style={styles.buttonText}>Start Reminder</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.resetButton]} onPress={cancelReminder}>
        <Text style={styles.buttonText}>Cancel Reminder</Text>
      </TouchableOpacity>

      <Modal visible={showIntervalModal} transparent animationType="slide">
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Select Reminder Interval</Text>
            <FlatList
              data={intervals}
              keyExtractor={(item) => item.seconds.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => {
                    setIntervalSeconds(item.seconds);
                    setShowIntervalModal(false);
                    setKey(prev => prev + 1);
                    setIsPlaying(false);
                  }}
                >
                  <Text style={styles.modalItemText}>{item.label}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity onPress={() => setShowIntervalModal(false)} style={styles.modalCloseBtn}>
              <Text style={styles.modalCloseText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 40,
  },
  timerText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
  },
  button: {
    marginVertical: 10,
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 30,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    alignItems: 'center',
  },
  startButton: {
    backgroundColor: '#4ade80',
  },
  resetButton: {
    backgroundColor: '#f87171',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  intervalButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
    marginBottom: 20,
    marginTop: 20,
  },
  intervalText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 15,
    width: '100%',
    maxHeight: 300,
    paddingVertical: 20,
    paddingHorizontal: 15,
    elevation: 12,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 15,
    color: '#333',
  },
  modalItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  modalItemText: {
    fontSize: 18,
    color: '#555',
  },
  modalCloseBtn: {
    marginTop: 15,
    alignItems: 'center',
  },
  modalCloseText: {
    fontSize: 18,
    color: '#888',
  },
});
