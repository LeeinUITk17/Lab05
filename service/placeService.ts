import axios from 'axios';

const API_BASE_URL = 'http://192.168.88.116:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const getPlaces = async () => {
  try {
    const response = await api.get('/item');
    return response.data;
  } catch (error) {
    console.error('Error fetching places:', error);
    throw error;
  }
};

export const addPlace = async (formData: FormData) => {
  try {
    const response = await api.post('/item/upload-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error adding place:', error.response?.data || error.message);
    throw error;
  }
};

