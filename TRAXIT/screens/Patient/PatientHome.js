import React from 'react';
import { View, Button, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function PatientHome({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to TRAXIT (Patient)</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('CaptureScreen')}
      >
        <Text style={styles.buttonText}>Capture Temperature</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Graph')}
      >
        <Text style={styles.buttonText}>View Graph</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('ReminderScreen')}
      >
        <Text style={styles.buttonText}>Set Reminder</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f9fc',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#3366FF',
    paddingVertical: 15,
    borderRadius: 12,
    marginVertical: 12,
    alignItems: 'center',
    shadowColor: '#3366FF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6, // for android shadow
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
