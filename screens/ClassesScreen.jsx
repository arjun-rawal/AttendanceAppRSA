import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, ScrollView } from 'react-native';
import { Button } from '@rneui/themed';
import {format} from 'date-fns';
import {styled} from 'nativewind';

export default function ClassesScreen({ route }) {
  const { selectedDate } = route.params;
  const formattedDate = format(new Date(selectedDate), "MMMM do, yyyy");
   //Creates icons to display on the buttons
  // hardcoded data, but ideally we would fetch assignments based on the date
  const StyledText = styled(Text);
  const StyledView = styled(View);
  const classes = [
    { name: 'Math', task: '- 4 digit addition' },
    { name: 'History', task: '- Native Americans in Popular Culture Handout' },
    { name: 'Science', task: '- Read pages 100-110' },
    { name: 'English', task: '- Write a 3 page essay on the book "To Kill a Mockingbird"' },
    { name: 'Spanish', task: '- Study for quiz on vocabulary' },
    { name: 'PE', task: '- Run 1 mile' },
    { name: 'Art', task: '- Draw a self portrait' },
    { name: 'Music', task: '- Practice the piano for 30 minutes' },
    { name: 'Computer Science', task: '- Finish coding project' },
    { name: 'Drama', task: '- Memorize lines for the play' },
    { name: 'Health', task: '- Read chapter 5 in the textbook' },
    { name: 'Home Economics', task: '- Bake cookies' },
    { name: 'Woodshop', task: '- Build a birdhouse' },
    { name: 'Gym', task: '- Play basketball' },
    { name: 'Band', task: '- Practice the trumpet for 30 minutes' },
    { name: 'Choir', task: '- Practice singing for 30 minutes' },
    { name: 'Math', task: '- 4 digit addition' },
    { name: 'History', task: '- Native Americans in Popular Culture Handout' },
    { name: 'Science', task: '- Read pages 100-110' },
    { name: 'English', task: '- Write a 3 page essay on the book "To Kill a Mockingbird"' },
    { name: 'Spanish', task: '- Study for quiz on vocabulary' },
    { name: 'PE', task: '- Run 1 mile' },
    { name: 'Art', task: '- Draw a self portrait' },
    { name: 'Music', task: '- Practice the piano for 30 minutes' },
    { name: 'Computer Science', task: '- Finish coding project' },
    { name: 'Drama', task: '- Memorize lines for the play' },
    { name: 'Health', task: '- Read chapter 5 in the textbook' },
    { name: 'Home Economics', task: '- Bake cookies' },
    { name: 'Woodshop', task: '- Build a birdhouse' },
    { name: 'Gym', task: '- Play basketball' },
    { name: 'Band', task: '- Practice the trumpet for' }
  ];
  /*example of how we would select based on date:
  const missed_days = ['2025-03-12': [
    { name: 'Math', task: '4 digit addition' },
    { name: 'History', task: 'Native Americans in Popular Culture Handout' },
  ], etc for each missed day...
  ]
  const classes = missed_days[selected_date]; + some way to check if the day wasnt missed
   */

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.content}>
          <StyledText className="text-center font-bold border rounded-full shadow text-2xl border-solid mt-3">Assignments on {formattedDate}</StyledText>
          {classes.map((classItem, index) => (
            <View key={index} style={styles.classItem}>
              <Button title={classItem.name} titleStyle={styles.className} color='white' radius={15} />
              <Text style={styles.task}>{classItem.task}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 80,
  },
  scrollViewContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    width: '100%',
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  classItem: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  className: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
  },
  task: {
    fontSize: 14,
    color: '#555',
    marginTop: 5,
    fontWeight: 'bold',
    fontFamily: 'Roboto',
  },
});