import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, Image, Text, PermissionsAndroid, Platform, Alert, ScrollView } from 'react-native';
import { Button } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import Geolocation from 'react-native-geolocation-service';
import MapView, { Marker } from 'react-native-maps';
import { addPlace } from '../../service/placeService';

const AddPlaceScreen = ({ navigation }: { navigation: any }) => {
  const [title, setTitle] = useState('');
  const [imageUri, setImageUri] = useState('');
  const [latitude, setLatitude] = useState(10.762622); 
  const [longitude, setLongitude] = useState(106.682199); 

  useEffect(() => {
    const requestLocationPermission = async () => {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          alert('Location permission denied');
          return;
        }
      }
      Geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to get your location. Please enable location services.');
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    };
    requestLocationPermission();
  }, []);

  const handleImagePick = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert('Permission to access camera roll is required!');
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (pickerResult.assets && pickerResult.assets.length > 0) {
      setImageUri(pickerResult.assets[0].uri || '');
    }
  };

  const handleSubmit = async () => {
    if (!title || !imageUri) {
      alert('Please provide a title and select an image.');
      return;
    }
  
    const formData = new FormData();
    formData.append('file', {
      uri: imageUri,
      name: 'image.jpg', 
      type: 'image/jpeg', 
    });
    formData.append('title', title);
    formData.append('latitude', latitude.toString());
    formData.append('longitude', longitude.toString());
  
    try {
      await addPlace(formData);
      alert('Place added successfully!');
    } catch (error) {
      console.error('Error adding place:', error);
      alert('Failed to add the place.');
    }
  };
  

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude,
          longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        onPress={(event) => {
          const { latitude, longitude } = event.nativeEvent.coordinate;
          console.log(`Latitude: ${latitude}, Longitude: ${longitude}`); 
          setLatitude(latitude);
          setLongitude(longitude);
        }}
      >
        {latitude !== 0 && longitude !== 0 && (
          <Marker coordinate={{ latitude, longitude }} />
        )}
      </MapView>

      <Text style={styles.infoText}>
        Selected Location: {latitude.toFixed(6)}, {longitude.toFixed(6)}
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Enter Title"
        value={title}
        onChangeText={setTitle}
      />

      <Button mode="outlined" onPress={handleImagePick} style={styles.button}>
        Select Image
      </Button>

      {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.imagePreview} />
      ) : (
        <Text style={styles.infoText}>No image selected</Text>
      )}

      <Button mode="contained" onPress={handleSubmit} style={styles.button}>
        Save Place
      </Button>
    </View>
    </ScrollView>

  );
};

const styles = StyleSheet.create({
    scrollViewContainer: {
        flexGrow: 1,
        backgroundColor: '#fff',
      },
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  map: {
    height: 300,
    marginBottom: 20,
  },
  infoText: {
    textAlign: 'center',
    marginVertical: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  button: {
    marginTop: 10,
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginTop: 10,
  },
});

export default AddPlaceScreen;
