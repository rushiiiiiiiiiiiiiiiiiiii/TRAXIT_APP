import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Platform,
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AntDesign } from '@expo/vector-icons';

export default function ArchivedPatient({ navigation }) {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    const dummyData = [
      { id: 1, name: 'Ravi Kumar', disease: 'Diabetes' },
      { id: 2, name: 'Sneha Sharma', disease: 'Hypertension' },
      { id: 3, name: 'Arjun Patel', disease: 'Asthma' },
      { id: 4, name: 'Priya Joshi', disease: 'Arthritis' },
      { id: 5, name: 'Kabir Das', disease: 'Heart Disease' },
    ];

    setData(dummyData);
    setFiltered(dummyData);
  }, []);

  const handleSearch = (text) => {
    setSearch(text);
    const filteredData = data.filter((item) =>
      item.name.toLowerCase().includes(text.toLowerCase())
    );
    setFiltered(filteredData);
  };

  const renderAvatar = (name) => {
    const initials = name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
    return (
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{initials}</Text>
      </View>
    );
  };

  return (
    <LinearGradient colors={['#4facfe', '#00f2fe']} style={styles.gradientContainer}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

        <View style={styles.container}>
          <Text style={styles.title}>🗃️ Archived Patients</Text>

          <View style={styles.searchContainer}>
            <AntDesign name="search1" size={18} color="#666" style={styles.searchIcon} />
            <TextInput
              placeholder="Search archived patient..."
              placeholderTextColor="#999"
              style={styles.searchInput}
              value={search}
              onChangeText={handleSearch}
            />
          </View>

          <FlatList
            data={filtered}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.card}
                onPress={() => navigation.navigate('PatientDetail', { id: item.id, archived: true })}
              >
                {renderAvatar(item.name)}
                <View style={styles.cardTextContainer}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.disease}>🗂️ {item.disease}</Text>
                </View>
                <AntDesign name="right" size={16} color="#007ACC" />
              </TouchableOpacity>
            )}
          />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  listContent: {
    paddingBottom: 30,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    marginVertical: 20,
    textAlign: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffffdd',
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 16,
    height: 45,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  searchIcon: {
    marginRight: 8,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffffee',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  avatar: {
    backgroundColor: '#007ACC33',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  avatarText: {
    color: '#007ACC',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardTextContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  disease: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
});
