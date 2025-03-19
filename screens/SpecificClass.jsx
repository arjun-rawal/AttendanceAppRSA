import React from 'react';
import { SafeAreaView, View, Text, StyleSheet } from 'react-native';
import { Button } from '@rneui/themed';
import Icon from 'react-native-vector-icons/FontAwesome';


export default function ClassesScreen({ route, navigation }) {
  const { selectedDate } = route.params;
  const myIcon = <Icon name="rocket" size={30} color="#900" />;
  const classes = [
    { name: 'Math', task: '- 4 digit addition' },
    { name: 'History', task: '- Native Americans in Popular Culture Handout' },
  ];


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.header}>Classes for {selectedDate}</Text>
        {classes.map((classItem, index) => (
          <View key={index} style={styles.classItem}>
            <Button title = {classItem.name} titleStyle= {styles.className} color='white' radius={15}  />
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
