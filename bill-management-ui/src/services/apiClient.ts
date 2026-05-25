import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import { API_BASE_URL } from '@/config/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  validateStatus: () => true, // never throw on HTTP errors — handle them manually
});

// Attach the JWT to every outgoing request if one is stored
apiClient.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
