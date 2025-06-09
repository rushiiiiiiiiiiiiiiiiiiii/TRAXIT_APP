import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Alert,
  FlatList
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import { LinearGradient } from 'expo-linear-gradient';
import { useRoute } from '@react-navigation/native'


export default function PrescriptionScreen() {
  const [inputText, setInputText] = useState('');
  const [prescriptions, setPrescriptions] = useState([]);
  const route = useRoute()
  const { id } = route.params;

  // const id = route.id

  const handleAddPrescription = () => {
    if (inputText.trim() === '') {
      Alert.alert('⚠️ Input Required', 'Please enter a valid prescription.');
      return;
    }

    const newEntry = {
      text: inputText.trim(),
      time: new Date().toISOString()
    };

    setPrescriptions(prev => [...prev, newEntry]);
    setInputText('');
  };

  const handleSave = async () => {
    if (prescriptions.length === 0) {
      Alert.alert('⚠️ No Prescriptions', 'Add at least one prescription before saving.');
      return;
    }

    try {
      const payload = {
        prescriptions,
        patientId: id,
        savedAt: new Date().toISOString()
      };


      // Replace URL with your backend endpoint
      await fetch('http://192.168.0.107:8000/saveprescription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      Alert.alert('✅ Prescription Saved', 'Prescriptions sent to backend.');
    } catch (error) {
      Alert.alert('❌ Error', 'Failed to save prescriptions.');
    }
  };

  return (
    <LinearGradient colors={['#4facfe', '#00f2fe']} style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <Text style={styles.header}>💊 Prescriptions</Text>

        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Add the Prescription...."
            placeholderTextColor="#888"
            multiline
            value={inputText}
            onChangeText={setInputText}
          />
          <TouchableOpacity style={styles.addButton} onPress={handleAddPrescription}>
            <Text style={styles.addButtonText}>➕</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={prescriptions}
          keyExtractor={(_, index) => index.toString()}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item, index }) => (
            <View style={styles.prescriptionItem}>
              <Text style={styles.prescriptionText}>{index + 1}. {item.text}</Text>
              <Text style={styles.timeText}>🕒 {new Date(item.time).toLocaleTimeString()}</Text>
            </View>
          )}
          ListEmptyComponent={<Text style={styles.emptyText}>No prescriptions added yet.</Text>}
        />

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>💾 Save Prescription</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </LinearGradient>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: wp('5%')
  },
  header: {
    fontSize: RFValue(20),
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: hp('2%'),
    textAlign: 'center'
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('2%')
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: wp('4%'),
    fontSize: RFValue(14),
    maxHeight: hp('20%')
  },
  addButton: {
    backgroundColor: '#007ACC',
    borderRadius: 10,
    padding: wp('3%'),
    marginLeft: wp('2%'),
    justifyContent: 'center',
    alignItems: 'center'
  },
  addButtonText: {
    color: '#fff',
    fontSize: RFValue(18),
    fontWeight: 'bold'
  },
  listContainer: {
    flex: 1,
    marginBottom: hp('2%')
  },
  // Add/replace these styles
  prescriptionItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: wp('4%'),
    marginBottom: hp('1.5%'),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  timeText: {
    fontSize: RFValue(10),
    color: '#999',
    marginTop: 4,
    textAlign: 'right',
  },
  prescriptionText: {
    fontSize: RFValue(14),
    color: '#333'
  },
  emptyText: {
    color: '#eee',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: hp('2%')
  },
  saveButton: {
    backgroundColor: '#007ACC',
    paddingVertical: hp('1.8%'),
    borderRadius: 10,
    alignItems: 'center'
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: RFValue(14)
  }
});
