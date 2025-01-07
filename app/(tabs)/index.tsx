import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Image, Text } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
import { Button } from 'react-native-paper';
import { getPlaces, addPlace } from '../../service/placeService';
import { useRouter } from 'expo-router';
interface Place {
  id: string;
  title: string;
  Upload: string;
}

const PlaceScreen = () => {
  // const navigation = useNavigation();
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(false);
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


  const renderPlace = ({ item }: { item: Place }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.Upload }} style={styles.image} />
      <Text style={styles.title}>{item.title}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Button mode="contained"  onPress={() => router.push('/addPlace')} style={styles.addButton}>
        Add New Place
      </Button>
      {loading ? (
        <Text style={styles.loadingText}>Loading...</Text>
      ) : (
        <FlatList
          data={places}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderPlace}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  addButton: {
    marginTop: 20,
  },
  list: {
    paddingBottom: 10,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
});

export default PlaceScreen;
