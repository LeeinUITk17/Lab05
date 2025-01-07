import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Image, Text, Modal, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-paper';
import { getPlaces } from '../../service/placeService';
import { useRouter } from 'expo-router';
import MapView, { Marker } from 'react-native-maps';

interface Place {
  id: string;
  title: string;
  Upload: string;
  latitude: string;
  longitude: string;
}

const PlaceScreen = () => {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  
  const router = useRouter();

  useEffect(() => {
    fetchPlaces();
  }, []);

  const fetchPlaces = async () => {
    setLoading(true);
    try {
      const data = await getPlaces();
      console.log('Places:', data);
      setPlaces(data);
    } catch (error) {
      console.error('Error fetching places:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPlace = (place: Place) => {
    setSelectedPlace(place);
    setModalVisible(true);
  };

  const renderPlaceMarker = (place: Place) => (
    <Marker
      coordinate={{
        latitude: parseFloat(place.latitude),
        longitude: parseFloat(place.longitude),
      }}
      key={place.id}
      title={place.title}
      description={place.title}
      onPress={() => handleSelectPlace(place)}
    >
      <Image source={{ uri: place.Upload }} style={styles.markerImage} />
    </Marker>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <Text style={styles.loadingText}>Loading...</Text>
      ) : (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 10.8231, 
            longitude: 106.6297,  
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          {places.map(renderPlaceMarker)}
        </MapView>
      )}
      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          {selectedPlace && (
            <View style={styles.modalContent}>
              <Image source={{ uri: selectedPlace.Upload }} style={styles.modalImage} />
              <Text style={styles.modalTitle}>{selectedPlace.title}</Text>
              <Text style={styles.modalInfo}>Latitude: {selectedPlace.latitude}</Text>
              <Text style={styles.modalInfo}>Longitude: {selectedPlace.longitude}</Text>
                <Button
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
                labelStyle={styles.closeButtonLabel}
                mode="contained"
                >
                X
                </Button>
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
  map: {
    flex: 1,
  },
  markerImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
    width: '80%',
  },
  modalImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalInfo: {
    fontSize: 16,
    marginBottom: 8,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#f44336', 
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: '80%',
    alignSelf: 'center', 
  },
  closeButtonLabel: {
    color: '#fff',  
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PlaceScreen;
