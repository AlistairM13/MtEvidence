import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Toast from 'react-native-toast-message';

import HomeScreen from './features/home/HomeScreen';
import {RootStackParamList} from './types/navigation';
import JournalScreen from './features/journal/JournalScreen';
import HistoryScreen from './features/history/HistoryScreen';
import {useSkillStore} from './stores/useSkillStore';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
} from '@tanstack/react-query';
import {syncAllSkills} from './features/skillSyncService';
import {Skill} from './types/appData';
import LoginScreen from './features/auth/LoginScreen';

dayjs.extend(relativeTime);

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  const skills = useSkillStore(state => state.skills);

  const {mutate: syncSkillsMutation} = useMutation({
    // eslint-disable-next-line @typescript-eslint/no-shadow
    mutationFn: (skills: Skill[]) => syncAllSkills(skills),
    onSuccess: data => {
      console.log(data);
    },
    onError: err => {
      console.log(err);
    },
  });

  const handleSkillSync = () => {
    syncSkillsMutation(skills.filter((_, index) => index !== 0));
  };

  return (
    <>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerStyle: {backgroundColor: 'black'},
            headerTintColor: 'white',
          }}>
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{
              // eslint-disable-next-line react/no-unstable-nested-components
              headerRight: () => (
                <MaterialIcons
                  name="cloud-upload"
                  size={24}
                  onPress={handleSkillSync}
                />
              ),
            }}
          />
          <Stack.Screen name="Journal" component={JournalScreen} />
          <Stack.Screen name="History" component={HistoryScreen} />
        </Stack.Navigator>
      </NavigationContainer>
      <Toast />
    </>
  );
};

const queryClient = new QueryClient();

const WrappedApp = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  );
};

export default WrappedApp;
