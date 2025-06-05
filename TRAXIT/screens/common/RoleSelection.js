import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';

export default function RoleSelection({ navigation }) {
  
  const pat = async () =>{
    await AsyncStorage.setItem('Role', 'patient')
    navigation.replace('PatientLogin')
  }
  
  const doc = async () =>{
    await AsyncStorage.setItem('Role', 'doctor')
    navigation.replace('DoctorLogin')
  }
  return (
    <LinearGradient colors={['#4facfe', '#00f2fe']} style={styles.container}>
      <StatusBar barStyle="light-content" />

      <Text style={styles.title}>Welcome to Traxit</Text>
      <Text style={styles.subtitle}>Select your role to continue</Text>

      {/* <TouchableOpacity style={styles.card} onPress={() =>navigation.navigate('PatientLogin')}> */}
      <TouchableOpacity style={styles.card} onPress={pat}>
        <Text style={styles.roleText}>👤 Patient</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card} onPress={doc}>
        <Text style={styles.roleText}>🩺 Doctor</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  title: { fontSize: 28, fontWeight: '800', color: '#fff', marginBottom: 10 },
  subtitle: { fontSize: 16, color: '#f0f0f0', marginBottom: 40 },
  card: {
    width: width * 0.8,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 20,
    paddingVertical: 20,
    marginBottom: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  roleText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});
