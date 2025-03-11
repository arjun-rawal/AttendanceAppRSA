import React from 'react';
import { SafeAreaView, View, Text, StyleSheet } from 'react-native';

export default function ClassesScreen({ route }) {
  const { selectedDate } = route.params;

  // hardcoded data, but ideally we would fetch assignments based on the date
  const classes = [
    { name: 'Math', task: '4 digit addition' },
    { name: 'History', task: 'Native Americans in Popular Culture Handout' },
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
      <View style={styles.content}>
        <Text style={styles.header}>Classes for {selectedDate}</Text>
        {classes.map((classItem, index) => (
          <View key={index} style={styles.classItem}>
            <Text style={styles.className}>{classItem.name}</Text>
            <Text style={styles.task}>{classItem.task}</Text>
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 80,
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
    fontSize: 18,
    fontWeight: '600',
  },
  task: {
    fontSize: 16,
    color: '#555',
  },
});
