import {useMutation} from '@tanstack/react-query';
import React, {useState} from 'react';
import {Pressable, Text, TextInput, View} from 'react-native';
import {loginUser} from './authService';
import Toast from 'react-native-toast-message';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../types/navigation';
import {useUserStore} from '../../stores/useUserStore';

type LoginScreenNavigationProps = NativeStackScreenProps<
  RootStackParamList,
  'Journal'
>;

const LoginScreen = ({navigation}: LoginScreenNavigationProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const setUser = useUserStore(state => state.setUser);

  const {mutate: loginMutation} = useMutation({
    // eslint-disable-next-line @typescript-eslint/no-shadow
    mutationFn: ({email, password}: {email: string; password: string}) =>
      loginUser({email, password}),
    onSuccess: data => {
      setUser(data);
      navigation.replace('Home');
    },
    onError: err => {
      Toast.show({type: 'error', text1: err.message});
    },
  });

  const handleLoginPress = () => {
    if (!email || !password) {
      Toast.show({type: 'error', text1: 'Email and password are required'});
      return;
    }
    loginMutation({email, password});
  };

  return (
    <View className="flex-1 justify-center  bg-black p-4">
      <View className="gap-4">
        <TextInput
          className="bg-white text-black rounded-md p-4"
          placeholderTextColor="#ccc"
          placeholder="Enter your email"
          autoCapitalize="none"
          onChangeText={setEmail}
        />
        <TextInput
          className="bg-white text-black rounded-md p-4"
          placeholderTextColor="#ccc"
          autoCapitalize="none"
          placeholder="Enter your password"
          onChangeText={setPassword}
        />
        <Pressable
          className="bg-sky-400 p-4 rounded-md"
          onPress={handleLoginPress}>
          <Text className="text-black text-center">Login</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default LoginScreen;
