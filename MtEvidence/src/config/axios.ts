import Toast from 'react-native-toast-message';
import axios, {AxiosError} from 'axios';
import {useUserStore} from '../stores/useUserStore';

const instance = axios.create();
instance.interceptors.request.use(config => {
  const originalRequest = config;
  const {user} = useUserStore.getState();
  originalRequest.baseURL = 'http://192.168.0.123:5000/api';
  if (user && user.token) {
    originalRequest.headers.Authorization = `Bearer ${user.token}`;
  }
  return originalRequest;
});

instance.interceptors.response.use(
  response => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      Toast.show({
        swipeable: true,
        type: 'error',
        text1: 'Session duration expired',
      });
    }
    return Promise.reject(error);
  },
);

export default instance;
