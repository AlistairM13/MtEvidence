import React, {useEffect, useState} from 'react';
import {FlatList, Pressable, StyleSheet, View} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import {SkillCard} from './components/SkillCard';
import {useSkillStore} from '../../stores/useSkillStore';
import {AddNewSkillModal} from './components/AddNewSkillModal';
import {useMutation} from '@tanstack/react-query';
import {getAllSkillsService} from './services/skillsServices';
import Toast from 'react-native-toast-message';

const HomeScreen = () => {
  const [skills, setSkills] = useSkillStore(state => [
    state.skills,
    state.setSkills,
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {mutate: getSkillsMutation} = useMutation({
    mutationFn: () => getAllSkillsService(),
    onSuccess: data => {
      setSkills(data);
    },
    onError: error => Toast.show({type: 'error', text1: error.message}),
  });

  useEffect(() => {
    getSkillsMutation();
  }, [getSkillsMutation]);

  return (
    <View className="flex-1 bg-black p-4">
      <FlatList
        data={skills}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={styles.contentContainerStyle}
        columnWrapperStyle={styles.columnWrapperStyle}
        renderItem={({item: skill}) => {
          if (skill.id === 'dummy') {
            return (
              <Pressable
                onPress={() => setIsModalOpen(true)}
                className="relative h-40 w-40 p-4 rounded-lg border border-neutral-600 justify-center items-center">
                <MaterialIcons name="add" size={56} />
              </Pressable>
            );
          }
          return <SkillCard skill={skill} />;
        }}
      />
      <AddNewSkillModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} />
    </View>
  );
};

export default HomeScreen;
const styles = StyleSheet.create({
  columnWrapperStyle: {justifyContent: 'space-between'},
  contentContainerStyle: {gap: 32},
});
