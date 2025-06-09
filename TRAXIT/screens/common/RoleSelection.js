import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';

export default function RoleSelection({ navigation }) {
  const setPatientRole = async () => {
    await AsyncStorage.setItem('Role', 'patient');
    navigation.replace('PatientLogin');
  };

  const setDoctorRole = async () => {
    await AsyncStorage.setItem('Role', 'doctor');
    navigation.replace('DoctorLogin');
  };

  return (
    <LinearGradient
      colors={['#11998e', '#38ef7d', '#4facfe', '#00f2fe']}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" />

      <Text style={styles.title}>Welcome to Traxit</Text>
      <Text style={styles.subtitle}>Select your role to continue</Text>

      <TouchableOpacity style={styles.card} onPress={setPatientRole}>
        <Text style={styles.roleText}>👤 Patient</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card} onPress={setDoctorRole}>
        <Text style={styles.roleText}>🩺 Doctor</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#e0f7fa',
    marginBottom: 40,
    textAlign: 'center',
  },
  card: {
    width: width * 0.75,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    paddingVertical: 16,
    marginBottom: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  roleText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#ffffff',
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
});
