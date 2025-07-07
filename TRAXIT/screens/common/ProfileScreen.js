import React, { useEffect, useState } from 'react';
import { CommonActions } from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Platform,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { backendUrl } from '@env'; 

export default function ProfileScreen({ navigation }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState('');


  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const id = await AsyncStorage.getItem('userid');
        const role = await AsyncStorage.getItem('Role');
        setRole(role);
        if (!id || !role) {
          console.warn('Missing user ID or role in storage');
          return;
        }

        const url =
          role === 'patient'
            ? `${backendUrl}/getpat/${id}`
            : `${backendUrl}/getdoc/${id}`;

        const response = await axios.get(url);

        if (response.data.success) {
          const baseData = { ...response.data.data, role };

          if (role === 'patient' && baseData.drid) {
            const doctorRes = await axios.get(`${backendUrl}/getdoc/${baseData.drid}`);
            baseData.doctorName = doctorRes.data.success
              ? doctorRes.data.data.name
              : 'Unknown Doctor';
          }

          setData(baseData);
        } else {
          console.warn('Profile fetch unsuccessful:', response.data.message);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const gradients = {
    patient: ['#11998e', '#38ef7d'],
    doctor: ['#4facfe', '#00f2fe'],
  };
  function getInitials(name = '') {
    const parts = name.trim().split(' ');
    if (parts.length === 1) {
      return parts[0][0].toUpperCase();
    }
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }

  const logout = async () => {
    await AsyncStorage.multiRemove(['Role', 'userid']);
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'RoleSelection' }],
      })
    );
  };

  if (loading || !data) {
    return (
      <LinearGradient colors={role == "patient" ? ['#11998e', '#38ef7d'] : ['#4facfe', '#00f2fe']} style={styles.container}>
        <StatusBar barStyle="light-content" />
        <ActivityIndicator size="large" color="#fff" style={{ marginTop: 100 }} />
        <Text style={{ color: '#fff', textAlign: 'center', marginTop: 20 }}>
          Loading profile...
        </Text>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={gradients[role]} style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <View style={[
            styles.initialsCircle,
            { backgroundColor: role === 'patient' ? '#2e7d32' : '#1565c0' } 
          ]}>

            <Text style={styles.initialsText}>{getInitials(data.name)}</Text>
          </View>

          <Text style={styles.name}>{data.name}</Text>
          <Text style={styles.role}>{data.role}</Text>

          <View style={styles.infoCard}>
            <InfoRow icon="📞" label="Phone" value={`${data.phone}`} role={role} />
            <InfoRow icon="🎂" label="Age" value={data.age} role={role} />
            {data.role === 'patient' ? (
              <>
                <InfoRow icon="🩺" label="Disease" value={data.disease} role={role} />
                <InfoRow icon="👨‍⚕️" label="Doctor" value={data.doctorName || data.drid} role={role} />
              </>
            ) : (
              <InfoRow icon="🩺" label="Specialization" value={data.specialization} role={role} />
            )}
          </View>

          <TouchableOpacity
            style={[
              styles.button,
              role === 'patient' && { backgroundColor: '#11998e' },
            ]}
            onPress={logout}
          >
            <Text
              style={[
                styles.buttonText,
                role === 'patient' && { color: '#fff' },
              ]}
            >
              Logout
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

function InfoRow({ icon, label, value, role }) {
  const isPatient = role === 'patient';

  return (
    <View style={styles.infoRow}>
      <Text style={[styles.icon, isPatient && { color: '#11998e' }]}>{icon}</Text>
      <View>
        <Text style={[styles.label, isPatient && { color: '#00695c' }]}>{label}</Text>
        <Text style={[styles.value, isPatient && { color: '#004d40' }]}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 25,
    padding: 28,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 10,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    marginBottom: 18,
    borderWidth: 3,
    borderColor: '#00bcd4',
  },
  name: {
    fontSize: 28,
    fontWeight: '700',
    color: '#007c91',
    marginBottom: 4,
  },
  role: {
    fontSize: 18,
    color: '#0099a8',
    marginBottom: 22,
    fontWeight: '600',
  },
  infoCard: {
    width: '100%',
    backgroundColor: '#ffffff',
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#b2ebf2',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  icon: {
    fontSize: 28,
    marginRight: 16,
    color: '#00acc1',
  },
  label: {
    fontWeight: '700',
    color: '#006064',
    fontSize: 15,
  },
  value: {
    color: '#004d40',
    fontSize: 17,
    marginTop: 2,
  },
  button: {
    marginTop: 28,
    backgroundColor: '#007c91',
    paddingVertical: 16,
    paddingHorizontal: 38,
    borderRadius: 12,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: '#e0f7fa',
    fontWeight: '700',
    fontSize: 16,
  },
  initialsCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    marginBottom: 18,
    backgroundColor: '#00bcd4',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#ffffff',
  },
  initialsText: {
    fontSize: 36,
    color: '#ffffff',
    fontWeight: 'bold',
  },

});
