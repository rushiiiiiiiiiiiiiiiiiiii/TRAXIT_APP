import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function DoctorHome({ navigation }) {
  const dummyPatients = [
    { id: '1', name: 'John Doe' },
    { id: '2', name: 'Jane Smith' },
    { id: '3', name: 'David Johnson' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Patients</Text>
      {dummyPatients.map((p) => (
        <TouchableOpacity key={p.id} style={styles.patientItem}>
          <Text style={styles.patientText}>{p.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  patientItem: {
    padding: 15,
    backgroundColor: '#f1f1f1',
    marginBottom: 10,
    borderRadius: 8,
  },
  patientText: { fontSize: 16 },
});
