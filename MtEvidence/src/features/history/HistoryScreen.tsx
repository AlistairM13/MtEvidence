import React, {useEffect, useState} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import {RootStackParamList} from '../../types/navigation';
import {useSkillStore} from '../../stores/useSkillStore';
import {JournalEntry, Skill} from '../../types/appData';
import dayjs from 'dayjs';
import {Calendar, DateData} from 'react-native-calendars';

type HistoryScreenNavigationProps = NativeStackScreenProps<
  RootStackParamList,
  'History'
>;

const HistoryScreen = ({route}: HistoryScreenNavigationProps) => {
  const {skillId} = route.params;

  const {
    selectedSkill,
    entryDates,
  }: {selectedSkill?: Skill; entryDates: {[date: string]: any}} = useSkillStore(
    state => {
      // eslint-disable-next-line @typescript-eslint/no-shadow
      const selectedSkill = state.getSkillById(skillId);
      // eslint-disable-next-line @typescript-eslint/no-shadow
      let entryDates: {[date: string]: any} = {};
      if (selectedSkill) {
        entryDates = selectedSkill.journal.reduce((markedDates, entry) => {
          markedDates[dayjs(entry.timestamp).format('YYYY-MM-DD')] = {
            customStyles: {
              container: {
                borderWidth: 1,
                borderColor: '#00adf5',
              },
            },
          };
          return markedDates;
        }, {} as {[date: string]: any});
      }
      return {selectedSkill, entryDates};
    },
  );

  const [markedDates, setMarkedDates] = useState<{[date: string]: any}>(
    entryDates,
  );
  const [selectedDate, setSelectedDate] = useState<number>(
    new Date().getTime(),
  );

  useEffect(() => {
    if (selectedDate) {
      const selected = {
        customStyles: {
          container: {
            backgroundColor: '#00adf5',
          },
          text: {
            color: 'black',
            fontWeight: 'bold',
          },
        },
      };
      setMarkedDates({
        ...entryDates,
        [dayjs(selectedDate).format('YYYY-MM-DD')]: selected,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);

  console.log('re-rendered');

  const onDayPressHandler = (date: DateData) => {
    setSelectedDate(date.timestamp);
  };

  return (
    <View className="flex-1 bg-black">
      <Calendar
        markingType="custom"
        markedDates={markedDates}
        onDayPress={onDayPressHandler}
        theme={{
          calendarBackground: '#000',
          textSectionTitleColor: '#ddd',
          todayTextColor: '#00adf5',
          dayTextColor: '#fff',
          textDisabledColor: '#555',
          monthTextColor: '#eee',
          textDayFontFamily: 'monospace',
          textMonthFontFamily: 'monospace',
          textDayHeaderFontFamily: 'monospace',
          textDayFontWeight: '300',
          textMonthFontWeight: 'bold',
          textDayHeaderFontWeight: '300',
          textDayFontSize: 16,
          textMonthFontSize: 16,
          textDayHeaderFontSize: 16,
        }}
      />
      <View className="p-4">
        <Text className="text-xl text-white font-bold">
          {dayjs(selectedDate).format('D MMM')}
        </Text>
        {selectedSkill ? (
          <FlatList
            extraData={selectedSkill.journal.filter(entry =>
              dayjs(entry.timestamp).isSame(selectedDate, 'date'),
            )}
            data={selectedSkill.journal.filter(entry =>
              dayjs(entry.timestamp).isSame(selectedDate, 'date'),
            )}
            contentContainerStyle={styles.contentContainerStyle}
            keyExtractor={item => item.timestamp.toString()}
            ListEmptyComponent={
              <View className="flex-1 justify-center items-center">
                <Text>No entries found</Text>
              </View>
            }
            renderItem={({item: journalEntry}) => (
              <JournalEntryDisplay journalEntry={journalEntry} />
            )}
          />
        ) : (
          <Text className="text-white">Skill not selected</Text>
        )}
      </View>
    </View>
  );
};
export default HistoryScreen;

const styles = StyleSheet.create({
  contentContainerStyle: {gap: 8, paddingVertical: 8},
});

const JournalEntryDisplay = ({journalEntry}: {journalEntry: JournalEntry}) => {
  return (
    <View className="p-4 bg-[#2d4150] rounded-md">
      <Text>{dayjs(journalEntry.timestamp).format('h:mm A')}</Text>
      <Text>{journalEntry.entry.substring(0, 40)}</Text>
    </View>
  );
};
