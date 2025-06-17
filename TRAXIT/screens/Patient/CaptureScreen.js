import { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CaptureScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [mediaPermission, requestMediaPermission] = MediaLibrary.usePermissions();
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [zoom, setZoom] = useState(0);
  const cameraRef = useRef(null);
  const [temperature, setTemperature] = useState('')

  useEffect(() => {
    const getPermissions = async () => {
      if (!mediaPermission || mediaPermission.status !== 'granted') {
        const { status } = await requestMediaPermission();
        if (status !== 'granted') {
          Alert.alert('Permission Required', 'Media library access is needed to save photos.');
        }
      }
    };
    getPermissions();
  }, [mediaPermission]);

  if (!permission) {
    return (
      <View style={styles.permissionContainer}>
        <ActivityIndicator size="large" color="#1e90ff" />
        <Text style={styles.permissionText}>Checking camera permissions...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Ionicons name="camera-reverse-outline" size={60} color="#ccc" />
        <Text style={styles.permissionText}>Camera access is required to use this feature.</Text>
        <TouchableOpacity onPress={requestPermission} style={styles.permissionButton}>
          <Text style={styles.buttonText}>Grant Camera Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photoData = await cameraRef.current.takePictureAsync({ quality: 1 });

        // Commented out resizing for now
        // const resizedPhoto = await ImageManipulator.manipulateAsync(
        //   photoData.uri,
        //   [{ resize: { width: 400, height: 800 } }],
        //   { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
        // );

        setPhoto(photoData.uri);

        if (mediaPermission?.status === 'granted') {
          await MediaLibrary.createAssetAsync(photoData.uri);
          Alert.alert('✅ Saved', 'Photo saved to gallery.');
        } else {
          Alert.alert('Note', 'Photo captured but not saved to gallery.');
        }
      } catch (error) {
        console.error('Failed to capture photo:', error);
        Alert.alert('Error', 'Failed to capture picture.');
      }
    }
  };

  const uploadFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Permission is needed to access your gallery.');
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });

      if (!result.canceled && result.assets.length > 0) {
        setPhoto(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Gallery image selection failed:', error);
      Alert.alert('Error', 'Could not select image.');
    }
  };

  const uploadImage = async (imageUri) => {
    setLoading(true);

    if (!imageUri) {
      setLoading(false);
      Alert.alert('Error', 'No image selected for upload.');
      return;
    }

    try {
      const formData = new FormData();

      if (Platform.OS === 'web') {
        const response = await fetch(imageUri);
        const blob = await response.blob();
        formData.append('file', blob, 'photo.jpg');
      } else {
        formData.append('file', {
          uri: imageUri,
          name: 'photo.jpg',
          type: 'image/jpeg',
        });
      }

      const response = await fetch('http://118.139.164.222:5002', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      setLoading(false);
      const numericTemp = parseFloat(result.temperature?.match(/[\d.]+/)?.[0]) || 0;
      setTemperature(numericTemp);

      const message = `
       🌡️ Temperature: ${result.temperature ?? 'N/A'}
       🌀 Blur: ${result.blur ?? 'N/A'}
       ⚠️ Error: ${result.error ?? 'None'}
      `;

      Alert.alert('📋 Analysis Result', message.trim());
      console.log('Server Response:', message.trim());
    } catch (error) {
      setLoading(false);
      console.error('Upload failed:', error);
      Alert.alert('Upload Error', `Failed to upload image:\n${error.message}`);
    }
  };

  const sendtodb = async () => {
    const userid = await AsyncStorage.getItem('userid')
    try {
      const result = await axios.post('http://192.168.0.106:8000/addtemp', { userid, temperature })
      console.log(result.data)
      Alert.alert("Temperature Sended Succsesully")
    }
    catch (err) {
      console.log(err)
      Alert.alert(err)
    }
  }

  return (
    <View style={styles.container}>
      {!photo ? (
        <CameraView ref={cameraRef} style={styles.camera} zoom={zoom} />
      ) : (
        <Image source={{ uri: photo }} style={styles.camera} />
      )}

      {loading && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.overlayText}>Processing image...</Text>
        </View>
      )}

      {!photo && (
        <View style={styles.zoomContainer}>
          <Text style={styles.zoomLabel}>Zoom</Text>
          <Slider
            style={{ width: 200, height: 40 }}
            minimumValue={0}
            maximumValue={1}
            onValueChange={value => setZoom(value)}
          />
        </View>
      )}

      <View style={styles.buttonRow}>
        {!photo ? (
          <>
            <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
              <FontAwesome name="camera" size={20} color="#fff" style={{ marginRight: 10 }} />
              <Text style={styles.buttonText}>Capture Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.submitButton} onPress={uploadFromGallery}>
              <Ionicons name="images-outline" size={20} color="#fff" style={{ marginRight: 10 }} />
              <Text style={styles.buttonText}>Upload from Gallery</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity style={styles.retakeButton} onPress={() => {
              setPhoto(null);
              setTemperature('');
            }}>
              <Ionicons name="refresh" size={18} color="#fff" />
              <Text style={styles.buttonText}> Retake</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.submitButton} onPress={() => uploadImage(photo)}>
              <Ionicons name="cloud-upload-outline" size={18} color="#fff" />
              <Text style={styles.buttonText}> Submit</Text>
            </TouchableOpacity>

            {temperature !== '' && (
              <TouchableOpacity style={styles.submitButton} onPress={sendtodb}>
                <Ionicons name="cloud-upload-outline" size={18} color="#fff" />
                <Text style={styles.buttonText}> Send to DB</Text>
              </TouchableOpacity>
            )}
          </>
        )}

      </View>
    </View>
  );
}

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
    justifyContent: 'space-around',
    width: '90%',
    alignSelf: 'center',
    flexWrap: 'wrap',
  },
  captureButton: {
    flexDirection: 'row',
    backgroundColor: '#1e90ff',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 100,
    margin: 5,
  },
  retakeButton: {
    flexDirection: 'row',
    backgroundColor: '#ff5c5c',
    paddingVertical: 14,
    paddingHorizontal: 25,
    borderRadius: 100,
    margin: 5,
  },
  submitButton: {
    flexDirection: 'row',
    backgroundColor: '#32cd32',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 100,
    margin: 5,
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
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  overlayText: {
    color: '#fff',
    marginTop: 10,
    fontSize: 16,
  },
  zoomContainer: {
    position: 'absolute',
    bottom: 180, // increased from 120 to 180
    left: 20,
    right: 20,
    alignItems: 'center',
  },

  zoomLabel: {
    color: '#fff',
    marginBottom: 5,
    fontSize: 14,
    textAlign: 'center',
  },
});
