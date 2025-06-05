import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Platform,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function DoctorStack({ navigation }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getProfile = async () => {
      try {
        const id = await AsyncStorage.getItem('userid');
        if (!id) {
          Alert.alert('Error', 'User ID not found');
          return;
        }
        const result = await axios.get(`http://192.168.0.124:8000/getdoc/${id}`);
        if (result.data.success) {
          setData(result.data.data);
        } else {
          Alert.alert('Error', 'Failed to fetch doctor profile');
        }
      } catch (err) {
        console.error('❌ Error fetching doctor profile:', err);
        Alert.alert('Error', 'Unable to load profile');
      } finally {
        setLoading(false);
      }
    };

    getProfile();
  }, []);

  const CardButton = ({ icon, label, onPress }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      accessibilityLabel={label}
    >
      <Ionicons name={icon} size={30} color="#4facfe" />
      <Text style={styles.cardText}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <LinearGradient colors={['#4facfe', '#00f2fe']} style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Profile Icon */}
        <TouchableOpacity
          style={styles.profileIcon}
          onPress={() => navigation.navigate('Profile')}
          accessibilityLabel="Doctor Profile"
        >
          <Ionicons name="person-circle-outline" size={44} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.heading}>Welcome Back</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#fff" style={{ marginTop: 20 }} />
        ) : (
          <Text style={styles.name}>{`Dr. ${data?.name}`}</Text>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Access</Text>
          <View style={styles.grid}>
            <CardButton
              icon="people-outline"
              label="Current Patients"
              onPress={() => navigation.navigate('PatientList')}
            />
            <CardButton
              icon="archive-outline"
              label="Archived Patients"
              onPress={() => navigation.navigate('ArchivedPatient')}
            />
            <CardButton
              icon="person-add-outline"
              label="Add Patient"
              onPress={() => navigation.navigate('AddPatient')}
            />
            {/* Optional Feature */}
            {/* <CardButton
              icon="bar-chart-outline"
              label="Health Graphs"
              onPress={() => navigation.navigate('Graph')}
            /> */}
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
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginTop: 80,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginTop: 5,
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
