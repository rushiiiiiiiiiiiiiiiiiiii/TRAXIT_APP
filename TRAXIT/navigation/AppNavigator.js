import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, ActivityIndicator } from 'react-native';

import RoleSelection from '../screens/common/RoleSelection';
import PatientLoginScreen from '../screens/common/PatientLoginScreen';
import DoctorLoginScreen from '../screens/common/DoctorLoginScreen';
import PatientRegisterScreen from '../screens/common/PatientRegister';
import DoctorRegisterScreen from '../screens/common/DoctorRegisterScreen';
import ProfileScreen from '../screens/common/ProfileScreen';
import PatientList from '../screens/Doctor/PatientList';
import GraphScreen from '../screens/Patient/GraphScreen';
import CaptureScreen from '../screens/Patient/CaptureScreen';
import ReminderScreen from '../screens/Patient/ReminderScreen';
import PatientStack from '../navigation/PatientStack';
import DoctorStack from '../navigation/DoctorStack';
import PatientDetail from '../screens/Doctor/PatientDetail';
import AddPatient from '../screens/Doctor/AddPatient';
import WebPortalScreen from '../screens/Patient/WebPortalScreen';

const Stack = createNativeStackNavigator();
const PERSISTENCE_KEY = 'NAVIGATION_STATE';

export default function AppNavigator() {
  const [initialState, setInitialState] = useState();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const restoreState = async () => {
      try {
        const savedStateString = await AsyncStorage.getItem(PERSISTENCE_KEY);
        const state = savedStateString ? JSON.parse(savedStateString) : undefined;

        if (state !== undefined) {
          setInitialState(state);
        }
      } catch (e) {
        console.error('Failed to load navigation state', e);
      } finally {
        setIsReady(true);
      }
    };

    restoreState();
  }, []);

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#00bcd4" />
      </View>
    );
  }

  return (
    <NavigationContainer
      initialState={initialState}
      onStateChange={async (state) => {
        await AsyncStorage.setItem(PERSISTENCE_KEY, JSON.stringify(state));
      }}
    >
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="RoleSelection" component={RoleSelection} />
        <Stack.Screen name="PatientLogin" component={PatientLoginScreen} />
        <Stack.Screen name="DoctorLogin" component={DoctorLoginScreen} />
        <Stack.Screen name="PatientRegister" component={PatientRegisterScreen} />
        <Stack.Screen name="DoctorRegister" component={DoctorRegisterScreen} />
        <Stack.Screen name="PatientStack" component={PatientStack} />
        <Stack.Screen name="DoctorStack" component={DoctorStack} />
        <Stack.Screen name="Capture" component={CaptureScreen} />
        <Stack.Screen name="Graph" component={GraphScreen} />
        <Stack.Screen name="Reminder" component={ReminderScreen} />
        <Stack.Screen name="Web" component={WebPortalScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="PatientList" component={PatientList} />
        <Stack.Screen name="PatientDetail" component={PatientDetail} />
        <Stack.Screen name="AddPatient" component={AddPatient} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
