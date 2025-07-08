import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform,
  ScrollView, StatusBar,
  Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
  import { backendUrl } from '@env'; 

export default function DoctorRegisterScreen({ navigation }) {
  const [form, setForm] = useState({
    name: '', phone: '', age: '',
    password: '', specialization: '',
  });

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  console.log(backendUrl                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                )
  const handleRegister = async () => {
    try {
      const res = await axios.post(`${backendUrl}/docreg`, form);
      console.log(res.data);
      if (res.data.success) {
        // await AsyncStorage.setItem('userRole', 'Doctor');
        Alert.alert('Success', 'Doctor Registered Successfully!');
        navigation.replace('DoctorLogin');
      } else {
        Alert.alert('Error', 'Registration failed');
      }
    } catch (err) {
      console.log(err);
      Alert.alert('Error', 'Something went wrong');
    }
  };

  return (
    <LinearGradient colors={['#4facfe', '#00f2fe']} style={styles.container}>
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.scrollContainer}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.card}>
            <Text style={styles.title}>Doctor Registration</Text>
            {['name', 'phone', 'age', 'password', 'specialization'].map((field, index) => (
              <TextInput
                key={index}
                placeholder={
                  field === 'specialization'
                    ? 'Specialization'
                    : field.charAt(0).toUpperCase() + field.slice(1)
                }
                value={form[field]}
                onChangeText={(val) => handleChange(field, val)}
                style={styles.input}
                placeholderTextColor="#ccc"
                secureTextEntry={field === 'password'}
                keyboardType={
                  field === 'phone' ? 'phone-pad' :
                  field === 'age' ? 'numeric' : 'default'
                }
              />
            ))}

            <TouchableOpacity style={styles.button} onPress={handleRegister}>
              <Text style={styles.buttonText}>Register as Doctor</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('DoctorLogin')}>
              <Text style={styles.registerLink}>
                Already a Doctor? <Text style={styles.linkBold}>Login</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#fff',
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  button: {
    backgroundColor: '#fff',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 20,
  },
  buttonText: {
    color: '#00bcd4',
    fontWeight: '700',
    fontSize: 16,
  },
  registerLink: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 14,
  },
  linkBold: {
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
});
