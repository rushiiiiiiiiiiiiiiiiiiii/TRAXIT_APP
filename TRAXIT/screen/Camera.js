import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { WebView } from 'react-native-webview';
import { Ionicons, FontAwesome } from '@expo/vector-icons';

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [mediaPermissionResponse, requestMediaPermission] =
    MediaLibrary.usePermissions();
  const [photo, setPhoto] = useState(null);
  const [showWeb, setShowWeb] = useState(false);
  const [webLoading, setWebLoading] = useState(true);
  const cameraRef = useRef(null);

  useEffect(() => {
    if (!mediaPermissionResponse) {
      requestMediaPermission();
    }
  }, []);

  if (!permission) return <Text>Checking permissions...</Text>;

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Ionicons name="camera-reverse-outline" size={60} color="#ccc" />
        <Text style={styles.permissionText}>Camera access is required</Text>
        <TouchableOpacity
          onPress={requestPermission}
          style={styles.permissionButton}
        >
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photoData = await cameraRef.current.takePictureAsync();
        setPhoto(photoData.uri);
        const asset = await MediaLibrary.createAssetAsync(photoData.uri);
        if (asset) {
          Alert.alert('✅ Saved', 'Photo saved to gallery.');
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to take picture.');
        console.error(error);
      }
    }
  };

  if (showWeb) {
    return (
      <View style={{ flex: 1 }}>
        {/* Navbar */}
        <View style={styles.webHeader}>
          <TouchableOpacity onPress={() => setShowWeb(false)}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.webTitle}>TRAXIT</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Loading Indicator */}
        {webLoading && (
          <View style={styles.webLoader}>
            <Text style={{ color: '#fff', marginBottom: 10 }}>Loading...</Text>
            <ActivityIndicator size="large" color="#1e90ff" />
          </View>
        )}

        <WebView
          source={{ uri: 'http://118.139.164.222:3030/' }}
          onLoadStart={() => setWebLoading(true)}
          onLoad={() => setWebLoading(false)}
          onError={() =>
            Alert.alert('Error', 'Failed to load the website. Please try again.')
          }
          style={{ flex: 1 }}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {!photo ? (
        <CameraView style={styles.camera} ref={cameraRef} />
      ) : (
        <Image source={{ uri: photo }} style={styles.camera} />
      )}

      <View style={styles.buttonRow}>
        {!photo ? (
          <>
            <TouchableOpacity style={styles.retakeButton} onPress={takePicture}>
              <FontAwesome name="camera" size={20} color="#fff" style={{ marginRight: 10 }} />
              <Text style={styles.buttonText}>Capture</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.nextButton} onPress={() => setShowWeb(true)}>
              <Ionicons name="arrow-forward-circle" size={18} color="#fff" />
              <Text style={styles.buttonText}> Next</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity style={styles.retakeButton} onPress={() => setPhoto(null)}>
              <Ionicons name="refresh" size={18} color="#fff" />
              <Text style={styles.buttonText}> Retake</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.nextButton} onPress={() => setShowWeb(true)}>
              <Ionicons name="arrow-forward-circle" size={18} color="#fff" />
              <Text style={styles.buttonText}> Next</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  buttonRow: {
    position: 'absolute',
    bottom: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    alignSelf: 'center',
  },
  retakeButton: {
    flexDirection: 'row',
    backgroundColor: '#ff5c5c',
    paddingVertical: 14,
    paddingHorizontal: 25,
    borderRadius: 100,
    elevation: 6,
  },
  nextButton: {
    flexDirection: 'row',
    backgroundColor: '#32cd32',
    paddingVertical: 14,
    paddingHorizontal: 25,
    borderRadius: 100,
    elevation: 6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#111',
    paddingHorizontal: 20,
  },
  permissionText: {
    color: '#ccc',
    fontSize: 18,
    marginVertical: 20,
    textAlign: 'center',
  },
  permissionButton: {
    backgroundColor: '#1e90ff',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 10,
  },
  webLoader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000000cc',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  webHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#1e90ff',
  },
  webTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
