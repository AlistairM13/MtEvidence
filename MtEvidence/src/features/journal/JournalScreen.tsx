import React, {useEffect, useState} from 'react';
import {Pressable, Text, TextInput, View} from 'react-native';
import {RootStackParamList} from '../../types/navigation';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useSkillStore} from '../../stores/useSkillStore';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

type JournalScreenNavigationProps = NativeStackScreenProps<
  RootStackParamList,
  'Journal'
>;

const JournalScreen = ({navigation, route}: JournalScreenNavigationProps) => {
  const {skillId} = route.params;
  const [entry, setEntry] = useState('');
  const selectedSkill = useSkillStore(state => state.getSkillById(skillId));
  const addJournalEntry = useSkillStore(state => state.addJournalEntry);

  const addJournalEntryHandler = () => {
    addJournalEntry(skillId, entry);
    setEntry('');
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <MaterialIcons
          name="history"
          size={24}
          onPress={() => navigation.navigate('History', {skillId})}
        />
      ),
    });
  }, [navigation, skillId]);

  return (
    <View className="flex-1 bg-black p-8 gap-2">
      <View className="pb-4 gap-2">
        <Text className="text-lg">{selectedSkill?.name}</Text>

        <Text className="text-md">{selectedSkill?.imageInHead}</Text>
      </View>

      <TextInput
        className="border border-neutral-500 flex-1 p-4 rounded-lg"
        textAlignVertical="top"
        multiline
        placeholderTextColor={'#777'}
        value={entry}
        onChangeText={setEntry}
        placeholder="How did you imagine it to go? What actually happened? How do you feel?? The more detailed the better!"
      />
      {entry.length && (
        <Pressable
          onPress={addJournalEntryHandler}
          className="bg-green-400 p-4 items-center rounded-lg">
          <Text className="text-black">Save</Text>
        </Pressable>
      )}
    </View>
  );
};
export default JournalScreen;
