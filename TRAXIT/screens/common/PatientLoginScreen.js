import React, { useEffect, useState } from "react";
import { CommonActions } from '@react-navigation/native';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Dimensions,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export default function PatientLoginScreen({ navigation }) {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  useEffect(() => {
    const getAsync = async () => {
      await AsyncStorage.removeItem("userRole");
    };
    getAsync();
  }, []);
  const handleLogin = async () => {
    const role = await AsyncStorage.getItem('Role')
    try {
      const result = await axios.post("http://192.168.0.107:8000/patlog", {
        phone,
        password,
      });
      console.log(result.data);
      if (result.data.success) {
        await AsyncStorage.setItem("userid", result.data.id.toString());
        Alert.alert("Success", "Patient Logined Successfully!");
        if(role=='patient'){
        navigation.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [{ name: 'PatientStack' }],
    })
  );
        return
        }
      } else {
        Alert.alert("Error", "Login failed");
      }
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Something went wrong");
    }
  };

  return (
    <LinearGradient colors={['#11998e', '#38ef7d']} style={styles.container}>
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.innerContainer}
      >
        <View style={styles.card}>
          <Text style={styles.title}>Patient Login</Text>

          <TextInput
            placeholder="Phone"
            placeholderTextColor="#aaa"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
            style={styles.input}
          />

          <TextInput
            placeholder="Password"
            placeholderTextColor="#aaa"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            style={styles.input}
          />

          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("PatientRegister")}
          >
            <Text style={styles.registerLink}>
              Don’t have an account?{" "}
              <Text style={styles.linkBold}>Sign Up</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const { width } = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 20,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
    backdropFilter: "blur(10px)", // optional for iOS
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 24,
    textAlign: "center",
  },
  input: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: "#fff",
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  button: {
    backgroundColor: "#ffffff",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 5,
    marginBottom: 20,
  },
  buttonText: {
    color: "#00bcd4",
    fontWeight: "700",
    fontSize: 16,
  },
  registerLink: {
    textAlign: "center",
    color: "#fff",
    fontSize: 14,
  },
  linkBold: {
    fontWeight: "700",
    textDecorationLine: "underline",
  },
});
