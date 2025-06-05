import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function AddPatient({ navigation }) {
  const [code, setCode] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isCodeSent, setIsCodeSent] = useState(false);

  const generateCode = () => {
    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    setCode(newCode);
    setIsCodeSent(false); 
  };

  const confirmAndSendCode = () => {
  if (!code) return;

  Alert.alert(
    'Confirm Code Delivery',
    'Have you already shared this code with your patient?',
    [
      {
        text: 'No',
        onPress: () => {
          setCode(null);
          Alert.alert('Cancelled', 'Code discarded. Please generate a new one.');
        },
        style: 'destructive',
      },
      {
        text: 'Yes',
        onPress: async () => {
          setLoading(true);
          try {
            const doctorId = await AsyncStorage.getItem('userid');
            const response = await axios.post('http://192.168.0.124:8000/adddrcode', {
              doctorId,
              code,
            });

            if (response.data.success) {
              setIsCodeSent(true);
              Alert.alert('Success', `Code stored successfully. Share this with your patient: ${code}`);
            } else {
              Alert.alert('Failed', response.data.message || 'Could not register code.');
            }
          } catch (err) {
            console.error(err);
            Alert.alert('Error', 'Could not store the code. Please try again.');
          } finally {
            setLoading(false);
          }
        },
        style: 'default',
      },
    ]
  );
};

  return (
    <LinearGradient colors={['#4facfe', '#00f2fe']} style={styles.container}>
      <Text style={styles.heading}>Add Patient</Text>
      <Text style={styles.info}>
        Generate a secure code, share it with your patient, and confirm to register it for use.
      </Text>

      <TouchableOpacity style={styles.button} onPress={generateCode}>
        <Ionicons name="key-outline" size={22} color="#fff" />
        <Text style={styles.buttonText}>Generate Code</Text>
      </TouchableOpacity>

      {code && (
        <>
          <View style={styles.codeContainer}>
            <Text style={styles.code}>{code}</Text>
            <Ionicons name="copy-outline" size={22} color="#fff" />
          </View>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#1abc9c' }]}
            onPress={confirmAndSendCode}
            disabled={loading || isCodeSent}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Ionicons name="checkmark-done-outline" size={22} color="#fff" />
                <Text style={styles.buttonText}>
                  {isCodeSent ? 'Code Confirmed' : 'Confirm and Send'}
                </Text>
              </>
            )}
          </TouchableOpacity>
        </>
      )}

      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#34495e' }]}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back-outline" size={22} color="#fff" />
        <Text style={styles.buttonText}>Back to Dashboard</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  heading: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  info: {
    fontSize: 16,
    color: '#ecf0f1',
    textAlign: 'center',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#2980b9',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderRadius: 10,
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    marginLeft: 10,
  },
  codeContainer: {
    backgroundColor: '#2c3e50',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginBottom: 16,
  },
  code: {
    fontSize: 22,
    color: '#fff',
    fontWeight: 'bold',
  },
});
// import React, { useState } from 'react';
// import {
//   View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator,
// } from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient';
// import { Ionicons } from '@expo/vector-icons';

// export default function AddPatient({ navigation }) {
//   const [code, setCode] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [isCodeSent, setIsCodeSent] = useState(false);

//   const generateCode = () => {
//     const newCode = Math.floor(100000 + Math.random() * 900000).toString();
//     setCode(newCode);
//     setIsCodeSent(false);
//   };

//   const confirmAndSimulateSend = () => {
//     if (!code) return;

//     setLoading(true);

//     setTimeout(() => {
//       setIsCodeSent(true);
//       Alert.alert('Simulated Success', `Code "${code}" ready to be shared with patient.`);
//       setLoading(false);
//     }, 1000); // Simulate network delay
//   };

//   return (
//     <LinearGradient colors={['#4facfe', '#00f2fe']} style={styles.container}>
//       <Text style={styles.heading}>Add Patient</Text>
//       <Text style={styles.info}>
//         Generate a secure code, share it with your patient, and confirm it's ready.
//       </Text>

//       <TouchableOpacity style={styles.button} onPress={generateCode}>
//         <Ionicons name="key-outline" size={22} color="#fff" />
//         <Text style={styles.buttonText}>Generate Code</Text>
//       </TouchableOpacity>

//       {code && (
//         <>
//           <View style={styles.codeContainer}>
//             <Text style={styles.code}>{code}</Text>
//             <Ionicons name="copy-outline" size={22} color="#fff" />
//           </View>

//           <TouchableOpacity
//             style={[styles.button, { backgroundColor: '#1abc9c' }]}
//             onPress={confirmAndSimulateSend}
//             disabled={loading || isCodeSent}
//           >
//             {loading ? (
//               <ActivityIndicator color="#fff" />
//             ) : (
//               <>
//                 <Ionicons name="checkmark-done-outline" size={22} color="#fff" />
//                 <Text style={styles.buttonText}>
//                   {isCodeSent ? 'Code Confirmed' : 'Confirm Code Ready'}
//                 </Text>
//               </>
//             )}
//           </TouchableOpacity>
//         </>
//       )}

//       <TouchableOpacity
//         style={[styles.button, { backgroundColor: '#34495e' }]}
//         onPress={() => navigation.goBack()}
//       >
//         <Ionicons name="arrow-back-outline" size={22} color="#fff" />
//         <Text style={styles.buttonText}>Back to Dashboard</Text>
//       </TouchableOpacity>
//     </LinearGradient>
//   );
// }

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     padding: 24,
// //     justifyContent: 'center',
// //   },
// //   heading: {
// //     fontSize: 26,
// //     fontWeight: 'bold',
// //     color: '#fff',
// //     marginBottom: 20,
// //     textAlign: 'center',
// //   },
// //   info: {
// //     fontSize: 16,
// //     color: '#ecf0f1',
// //     textAlign: 'center',
// //     marginBottom: 30,
// //   },
// //   button: {
// //     backgroundColor: '#2980b9',
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     padding: 14,
// //     borderRadius: 10,
// //     marginBottom: 16,
// //   },
// //   buttonText: {
// //     color: '#fff',
// //     fontSize: 18,
// //     marginLeft: 10,
// //   },
// //   codeContainer: {
// //     backgroundColor: '#2c3e50',
// //     padding: 16,
// //     borderRadius: 8,
// //     alignItems: 'center',
// //     justifyContent: 'space-between',
// //     flexDirection: 'row',
// //     marginBottom: 16,
// //   },
// //   code: {
// //     fontSize: 22,
// //     color: '#fff',
// //     fontWeight: 'bold',
// //   },
// // });
