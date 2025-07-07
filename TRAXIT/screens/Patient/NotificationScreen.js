import React, { useEffect, useState, useCallback } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    StatusBar,
    Dimensions,
    Platform,
    SafeAreaView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
 import { backendUrl } from '@env'; 

const NotificationScreen = () => {
    const [prescriptions, setPrescriptions] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    const fetchPrescriptions = async () => {
        const id = await AsyncStorage.getItem('userid');
        try {
            const res = await fetch(`${backendUrl}/getprescriptions/${id}`);
            const data = await res.json();
            if (data.success) {
                setPrescriptions(data.prescriptions);
            }
        } catch (error) {
            console.error('❌ Error fetching prescriptions:', error);
        }
    };

    useEffect(() => {
        fetchPrescriptions();
    }, []);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await fetchPrescriptions();
        setRefreshing(false);
    }, []);

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <Text style={styles.prescriptionText}>💊 {item.text}</Text>
            <Text style={styles.timestamp}>
                🕒 {new Date(item.timestamp).toLocaleString()}
            </Text>
        </View>
    );

    return (
        <LinearGradient colors={['#11998e', '#38ef7d']} style={styles.gradient}>
            <SafeAreaView style={styles.safeArea}>
                <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
                <View style={styles.container}>
                    <Text style={styles.heading}>🩺 Your Prescriptions</Text>
                    {prescriptions.length === 0 ? (
                        <Text style={styles.noDataText}>No prescriptions yet</Text>
                    ) : (
                        <FlatList
                            data={prescriptions}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={renderItem}
                            contentContainerStyle={styles.listContent}
                            showsVerticalScrollIndicator={false}
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />
                    )}
                </View>
            </SafeAreaView>
        </LinearGradient>
    );
};

export default NotificationScreen;

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    gradient: {
        flex: 1
    },
    safeArea: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
    },
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 10
    },
    heading: {
        fontSize: width * 0.06,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 20,
        textAlign: 'center',
        textShadowColor: '#000',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 4
    },
    card: {
        backgroundColor: '#ffffffcc',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5
    },
    prescriptionText: {
        fontSize: 16,
        color: '#333',
        fontWeight: '500'
    },
    timestamp: {
        marginTop: 6,
        fontSize: 12,
        color: '#555'
    },
    noDataText: {
        fontSize: 16,
        color: '#fff',
        textAlign: 'center',
        marginTop: 40
    },
    listContent: {
        paddingBottom: 20
    }
});
