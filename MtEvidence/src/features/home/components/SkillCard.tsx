import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import React, {useState} from 'react';
import {Pressable, Text, View} from 'react-native';
import {RootStackParamList} from '../../../types/navigation';
import {Skill} from '../../../types/appData';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {AddNewSkillModal} from './AddNewSkillModal';
import {Alert} from 'react-native';
import {useSkillStore} from '../../../stores/useSkillStore';
import {useMutation} from '@tanstack/react-query';
import {deleteSkillService} from '../services/skillsServices';
import Toast from 'react-native-toast-message';

type HomeScreenNavigationType = NativeStackNavigationProp<
  RootStackParamList,
  'Home',
  undefined
>;

const CARD_HEIGHT = 160;

// 100 - CARD_HEIGHT
// progress - x
const getProgressHeight = (progress: number) =>
  Math.min((progress * CARD_HEIGHT) / 100, CARD_HEIGHT);

export const SkillCard = ({skill}: {skill: Skill}) => {
  const navigation = useNavigation<HomeScreenNavigationType>();
  const [isPercentage, setIsPercentage] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const deleteSkill = useSkillStore(state => state.deleteSkill);

  const editSkillHandler = () => {
    setIsModalOpen(true);
  };
  const deleteSkillHandler = () => {
    Alert.alert(
      'Delete this skill?',
      `You have made ${skill.progress}% progress here`,
      [
        {
          text: 'Cancel',
        },
        {text: 'OK', onPress: () => deleteSelectedSkill(skill)},
      ],
    );
  };

  const {mutate: deleteSkillMutation} = useMutation({
    mutationFn: (skillToDelete: Skill) => deleteSkillService(skillToDelete),
    onSuccess: () => deleteSkill(skill),
    onError: error => Toast.show({type: 'error', text1: error.message}),
  });

  const deleteSelectedSkill = (skillToDelete: Skill) => {
    deleteSkillMutation(skillToDelete);
  };

  return (
    <>
      <Pressable
        onPress={() => navigation.navigate('Journal', {skillId: skill.id})}
        className="relative rounded-lg overflow-hidden h-40 w-40 p-4 border border-neutral-600 justify-between items-center">
        <View
          className="absolute  bottom-0  w-40 bg-green-400"
          style={{height: getProgressHeight(skill.progress)}}
        />
        <View className="w-full flex-row justify-between">
          <MaterialIcons name="edit" size={22} onPress={editSkillHandler} />
          <MaterialIcons name="delete" size={22} onPress={deleteSkillHandler} />
        </View>
        <Text className="text-center text-xl">
          {`${
            skill && skill.name && skill.name.length > 20
              ? skill.name.substring(0, 20)
              : skill.name
          }${skill && skill.name && skill.name.length > 20 ? '...' : ''}`}
        </Text>
        <Text
          onPress={() => setIsPercentage(prev => !prev)}
          className="self-end">
          {isPercentage ? `${skill.progress}%` : `${skill.progress}/100`}{' '}
        </Text>
      </Pressable>
      <AddNewSkillModal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        skill={skill}
      />
    </>
  );
};
