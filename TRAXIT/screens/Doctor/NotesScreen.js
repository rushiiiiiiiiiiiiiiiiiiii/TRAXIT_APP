import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Alert,
  FlatList,
  TouchableOpacity,
  Keyboard,
  Animated,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RFValue } from 'react-native-responsive-fontsize';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { LinearGradient } from 'expo-linear-gradient';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
 import { backendUrl } from '@env'; 

export default function NotesScreen() {
  const [note, setNote] = useState('');
  const [notesList, setNotesList] = useState([]);
  const [patientId, setPatientId] = useState(null);
  const [showInput, setShowInput] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const loadPatientId = async () => {
      const id = await AsyncStorage.getItem('userid');
      setPatientId(id);
      if (id) fetchNotes(id);
    };
    loadPatientId();
  }, []);

  const fetchNotes = async (id) => {
    try {
      const response = await fetch(`${backendUrl}/getnotes/${id}`);
      const data = await response.json();
      if (data.success) {
        setNotesList(data.notes);
      }
    } catch (error) {
      console.error('❌ Error fetching notes:', error);
    }
  };
  const onRefresh = async () => {
    if (!patientId) return;
    setRefreshing(true);
    await fetchNotes(patientId);
    setRefreshing(false);
  };

  const handleNoteSubmit = async () => {
    if (note.trim() === '') {
      Alert.alert('⚠️ Empty Note', 'Please enter a note.');
      return;
    }

    try {
      const payload = {
        patientId,
        note: note.trim(),
      };

      await fetch(`${backendUrl}/savenote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const newNote = { text: note.trim() };
      setNotesList([newNote, ...notesList]);
      setNote('');
      Keyboard.dismiss();
      setShowInput(false);
    } catch (error) {
      Alert.alert('❌ Error', 'Failed to save note.');
    }
  };


  const renderNoteItem = ({ item }) => (
    <View style={styles.noteCard}>
      <Text style={styles.noteText}>📝 {item.text}</Text>
    </View>
  );

  return (
    <LinearGradient colors={['#4facfe', '#00f2fe']} style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <Text style={styles.header}>🩺 Doctor's Notes</Text>

        <TouchableOpacity
          style={styles.toggleInputButton}
          onPress={() => setShowInput((prev) => !prev)}
        >
          <AntDesign name={showInput ? 'closecircleo' : 'pluscircleo'} size={20} color="#fff" />
          <Text style={styles.toggleInputText}>
            {showInput ? 'Cancel' : 'Add New Note'}
          </Text>
        </TouchableOpacity>

        {showInput && (
          <>
            <TextInput
              style={styles.input}
              placeholder="Write your note here..."
              placeholderTextColor="#999"
              multiline
              value={note}
              onChangeText={setNote}
            />
            <TouchableOpacity style={styles.addButton} onPress={handleNoteSubmit}>
              <MaterialIcons name="note-add" size={20} color="#fff" />
              <Text style={styles.addButtonText}>Add Note</Text>
            </TouchableOpacity>
          </>
        )}

        <Text style={styles.subHeader}>📋 Notes History</Text>
        {notesList ? <FlatList
          data={notesList}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderNoteItem}
          contentContainerStyle={{ paddingBottom: hp('5%') }}
          refreshing={refreshing}
          onRefresh={onRefresh}
        /> : <Text>No notes</Text>}

      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: wp('5%'),
  },
  header: {
    fontSize: RFValue(22),
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: hp('2%'),
  },
  toggleInputButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e90ff',
    paddingVertical: hp('1.5%'),
    paddingHorizontal: wp('5%'),
    borderRadius: 30,
    alignSelf: 'center',
    marginBottom: hp('2%'),
    elevation: 3,
  },
  toggleInputText: {
    color: '#fff',
    fontSize: RFValue(14),
    fontWeight: 'bold',
    marginLeft: wp('2%'),
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: wp('4%'),
    height: hp('18%'),
    textAlignVertical: 'top',
    fontSize: RFValue(14),
    marginBottom: hp('1.5%'),
    elevation: 2,
  },
  addButton: {
    flexDirection: 'row',
    backgroundColor: '#34c759',
    paddingVertical: hp('1.6%'),
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    width: wp('40%'),
    alignSelf: 'center',
    marginBottom: hp('3%'),
    elevation: 3,
  },
  addButtonText: {
    color: '#fff',
    fontSize: RFValue(15),
    fontWeight: 'bold',
    marginLeft: wp('2%'),
  },
  subHeader: {
    fontSize: RFValue(16),
    fontWeight: '600',
    color: '#fff',
    marginBottom: hp('1.5%'),
    marginTop: hp('1%'),
  },
  noteCard: {
    backgroundColor: '#ffffffdd',
    borderRadius: 12,
    padding: wp('4%'),
    marginBottom: hp('1.2%'),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  noteText: {
    fontSize: RFValue(14),
    color: '#333',
    lineHeight: 22,
  },
});
