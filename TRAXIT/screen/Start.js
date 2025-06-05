import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AntDesign } from '@expo/vector-icons';

export default function Start({ navigation }) {
  return (
    <LinearGradient colors={['#0f2027', '#203a43', '#2c5364']} style={styles.container}>
      <Text style={styles.title}>TRAXIT</Text>
      {/* <Text style={styles.subtitle}>Track, Snap & Go</Text> */}

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('TRAXITCAM')}
      >
        <AntDesign name="camera" size={24} color="#fff" style={styles.icon} />
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 42, fontWeight: 'bold', color: '#fff', marginBottom: 15 },
  subtitle: { fontSize: 18, color: '#ddd', marginBottom: 40 },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e90ff',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 12,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
  },
  icon: { marginRight: 10 },
  buttonText: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
});
