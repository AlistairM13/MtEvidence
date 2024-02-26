import React, {useState} from 'react';
import {Modal, Pressable, Text, TextInput, View} from 'react-native';
import {useSkillStore} from '../../../stores/useSkillStore';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Skill} from '../../../types/appData';
import {useMutation} from '@tanstack/react-query';
import {
  SkillPayload,
  addNewSkillService,
  updateSkillService,
} from '../services/skillsServices';
import Toast from 'react-native-toast-message';

type ModalProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  skill?: Skill;
};

export const AddNewSkillModal = ({isOpen, setIsOpen, skill}: ModalProps) => {
  const [addSkill, updateSkill] = useSkillStore(state => [
    state.addSkill,
    state.updateSkill,
  ]);

  const {mutate: addSkillMutation} = useMutation({
    // eslint-disable-next-line @typescript-eslint/no-shadow
    mutationFn: (skill: SkillPayload) => addNewSkillService(skill),
    onSuccess: data => {
      console.log(data);
      addSkill(data);
    },
    onError: err => {
      Toast.show({type: 'error', text1: err.message});
    },
  });
  const {mutate: updateSkillMutation} = useMutation({
    // eslint-disable-next-line @typescript-eslint/no-shadow
    mutationFn: (skillToUpdate: Skill) => updateSkillService(skillToUpdate),
    onSuccess: () => {
      updateSkill({...skill!, name: skillName, imageInHead: imageText});
      setIsOpen(false);
    },
    onError: err => {
      Toast.show({type: 'error', text1: err.message});
    },
  });

  const [skillName, setSkillName] = useState(skill ? skill.name : '');
  const [imageText, setImageText] = useState(skill ? skill.imageInHead : '');

  const addNewSkillHandler = () => {
    if (skillName && imageText) {
      addSkillMutation({name: skillName, imageInHead: imageText});
      setIsOpen(false);
    }
  };
  const editSkillHandler = () => {
    if (
      skill &&
      skillName &&
      imageText &&
      skillName.length < 20 &&
      imageText.length < 40
    ) {
      updateSkillMutation({
        ...skill,
        name: skillName,
        imageInHead: imageText,
      });
    }
  };
  const addOrEditSkill = () => {
    if (skill) {
      editSkillHandler();
    } else {
      addNewSkillHandler();
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent
      visible={isOpen}
      onRequestClose={() => setIsOpen(false)}>
      <View className="flex-1 justify-center items-center bg-black opacity-95">
        <View className="border border-[#555] rounded-lg px-8 pb-8 pt-4 w-[70%] gap-4">
          <Pressable className="items-end" onPress={() => setIsOpen(false)}>
            <MaterialIcons name="close" size={22} />
          </Pressable>
          <Text className="text-lg text-white">Enter the skill details</Text>
          <TextInput
            className="border border-white rounded-md p-2 px-4"
            placeholder="Enter skill name"
            value={skillName}
            onChangeText={setSkillName}
          />
          <TextInput
            className="border border-white rounded-md p-2 px-4"
            placeholder="Image in your head"
            value={imageText}
            onChangeText={setImageText}
          />
          <Pressable
            onPress={addOrEditSkill}
            className="text-xl p-3 rounded-md items-center bg-green-500 active:bg-green-600">
            <Text>{skill ? 'Edit skill' : 'Add new Skill'}</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};
