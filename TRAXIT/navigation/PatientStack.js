import React, { useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, StatusBar, Platform, ScrollView
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function PatientDashboard({ navigation }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    const getProfile = async () => {
      const id = await AsyncStorage.getItem('userid');
      try {
        const result = await axios.get(`http://192.168.0.107:8000/getpat/${id}`);
        if (result.data.success) {
          setData(result.data.data);
          console.log(result.data?.data)
        }
      } catch (err) {
        console.log(err);
      }
    };
    getProfile();
  }, []);

  return (
    <LinearGradient colors={['#11998e', '#38ef7d']} style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Profile Icon */}
        <TouchableOpacity
          style={styles.profileIcon}
          onPress={() => navigation.navigate('Profile')}
        >
          <Ionicons name="person-circle-outline" size={44} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.heading}>Welcome Back</Text>
        <Text style={styles.name}>{data?.name}</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Access</Text>

          <View style={styles.grid}>
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate('Capture')}
            >
              <Ionicons name="camera-outline" size={30} color="#4facfe" />
              <Text style={styles.cardText}>Capture</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate('Web')}
            >
              <Ionicons name="globe-outline" size={30} color="#4facfe" />
              <Text style={styles.cardText}>Health Portal</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate('NotificationScreen')}
            >
              <Ionicons name="notifications-outline" size={30} color="#4facfe" />
              <Text style={styles.cardText}>Notifications</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate('Reminder')}
            >
              <Ionicons name="hourglass-outline" size={30} color="#4facfe" />
              <Text style={styles.cardText}>Reminders</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 50,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  profileIcon: {
    position: 'absolute',
    top: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 10,
    right: 20,
    zIndex: 1,
  },
  heading: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginTop: 80,
  },
  name: {
    fontSize: 22,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 30,
  },
  section: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 1, height: 2 },
    shadowRadius: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 15,
  },
  card: {
    backgroundColor: '#fff',
    width: '47%',
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    marginBottom: 15,
  },
  cardText: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
});
