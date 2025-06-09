import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform,
  ScrollView, StatusBar, Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function PatientRegisterScreen({ navigation }) {
  const [form, setForm] = useState({
    name: '', phone: '', age: '', password: '',
    disease: '', drcode: ''
  });

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleRegister = async () => {
    try {
      const res = await axios.post('http://192.168.0.107:8000/patreg', form);
      console.log(res.data);
      if (res.data.success) {
        // await AsyncStorage.setItem('userRole', 'Patient');
        Alert.alert('Success', 'Patient Registered Successfully!');
        navigation.replace('PatientLogin');
      } else {
        Alert.alert('Error', 'Registration failed');
      }
    } catch (err) {
      console.log(err);
      Alert.alert('Error', 'Something went wrong');
    }
  };

  return (
    <LinearGradient colors={['#11998e', '#38ef7d']} style={styles.container}>
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.scrollContainer}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.card}>
            <Text style={styles.title}>Patient Registration</Text>

            {[
              { key: 'name', placeholder: 'Full Name' },
              { key: 'phone', placeholder: 'Phone', keyboardType: 'phone-pad' },
              { key: 'age', placeholder: 'Age', keyboardType: 'numeric' },
              { key: 'password', placeholder: 'Password', secure: true },
              { key: 'disease', placeholder: 'Disease' },
              { key: 'drcode', placeholder: "Doctor's Code" }
            ].map(({ key, placeholder, keyboardType, secure }) => (
              <TextInput
                key={key}
                placeholder={placeholder}
                value={form[key]}
                onChangeText={(value) => handleChange(key, value)}
                style={styles.input}
                placeholderTextColor="#ccc"
                secureTextEntry={secure}
                keyboardType={keyboardType || 'default'}
              />
            ))}

            <TouchableOpacity style={styles.button} onPress={handleRegister}>
              <Text style={styles.buttonText}>Register as Patient</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('PatientLogin')}>
              <Text style={styles.registerLink}>
                Already a Patient? <Text style={styles.linkBold}>Login</Text>
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
