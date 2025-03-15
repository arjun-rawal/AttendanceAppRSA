// TeacherDashboard.jsx
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TextInput, Alert, TouchableOpacity, Modal } from 'react-native';
import { Text, Button } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import { collection, query, where, onSnapshot, addDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { Calendar, ExpandableCalendar } from 'react-native-calendars';
import HomeNavBar from '../components/HomeNavBar';
import { useNavigation } from '@react-navigation/native';

export default function TeacherDashboard({ user }) {
  const [classes, setClasses] = useState([]);
  const [loadingClasses, setLoadingClasses] = useState(true);
  const [newClassName, setNewClassName] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const navigation = useNavigation();

  console.log(user)
  useEffect(() => {
    const q = query(
      collection(db, 'Classes'),
      where('teacherId', '==', user.uid)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const classData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      console.log("HERE", classData)
      setClasses(classData);
      setLoadingClasses(false);
    }, (error) => {
      console.error("Error fetching classes:", error);
      setLoadingClasses(false);
    });
    return unsubscribe;
  }, [user.uid]);

  // Add a new class to Firestore
  const addClass = async () => {
    if (!newClassName.trim()) {
      Alert.alert("Error", "Class name cannot be empty.");
      return;
    }
    try {
      await addDoc(collection(db, 'classes'), {
        teacherId: user.uid,
        name: newClassName.trim(),
        createdAt: new Date()
      });
      setNewClassName('');
      setShowAddModal(false);
    } catch (error) {
      console.error("Error adding class:", error);
      Alert.alert("Error", "Could not add class.");
    }
  };

  // When a day is pressed on the calendar, navigate to EditContent screen
  const onDayPress = (day) => {
    if (selectedClass) {
      navigation.navigate("EditContent", { className: selectedClass.name, selectedDate: day.dateString });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text h3 style={styles.header}>Teacher Dashboard</Text>
      <Button 
        title="Add Class" 
        onPress={() => setShowAddModal(true)} 
        buttonStyle={styles.addButton} 
      />

      {loadingClasses ? (
        <Text>Loading classes...</Text>
      ) : (
        <FlatList
          data={classes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.classItem} 
              onPress={() => setSelectedClass(item)}
            >
              <Text style={styles.className}>{item.Name}</Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={<Text>No classes found.</Text>}
        />
      )}

      {selectedClass && (
        <View style={styles.calendarContainer}>
          <Text style={styles.calendarHeader}>Calendar for {selectedClass.Name}</Text>
          <Button 
            title="Close Calendar" 
            onPress={() => setSelectedClass(null)} 
            buttonStyle={styles.closeCalendarButton} 
          />
          <Calendar
              hideExtraDays={false}
              firstDay={1}
              style={styles.calendar}
            //   markedDates={markedDates}
            />

        </View>
      )}

      {/* Modal to add a new class */}
      <Modal visible={showAddModal} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text h4>Add a New Class</Text>
            <TextInput
              placeholder="Enter class name"
              value={newClassName}
              onChangeText={setNewClassName}
              style={styles.input}
            />
            <View style={styles.modalButtons}>
              <Button 
                title="Cancel" 
                onPress={() => setShowAddModal(false)} 
                buttonStyle={styles.modalButton} 
              />
              <Button 
                title="Add" 
                onPress={addClass} 
                buttonStyle={styles.modalButton} 
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Optionally include a bottom navigation bar */}
      <HomeNavBar initialIndex={1} navigation={navigation} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    backgroundColor: "#fff" 
  },
  header: { 
    textAlign: "center", 
    marginBottom: 20 
  },
  addButton: { 
    backgroundColor: "#f4511e", 
    marginBottom: 20 
  },
  classItem: { 
    padding: 15, 
    backgroundColor: "#f0f0f0", 
    borderRadius: 8, 
    marginBottom: 10 
  },
  className: { 
    fontSize: 18, 
    fontWeight: "bold" 
  },

  calendarContainer: { 
    marginTop: 20, 
    borderTopWidth: 1, 
    borderColor: "#ccc", 
    paddingTop: 20 
  },
  calendarHeader: { 
    fontSize: 16, 
    fontWeight: "bold", 
    marginBottom: 10, 
    textAlign: "center" 
  },
  closeCalendarButton: { 
    backgroundColor: "#888", 
    marginTop: 10 
  },
  modalContainer: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center", 
    backgroundColor: "rgba(0,0,0,0.5)" 
  },
  modalContent: { 
    backgroundColor: "#fff", 
    padding: 20, 
    borderRadius: 8, 
    width: "80%" 
  },
  input: { 
    borderWidth: 1, 
    borderColor: "#ccc", 
    borderRadius: 5, 
    padding: 10, 
    marginTop: 10 
  },
  modalButtons: { 
    flexDirection: "row", 
    justifyContent: "space-around", 
    marginTop: 20 
  },
  modalButton: { 
    backgroundColor: "#f4511e", 
    paddingHorizontal: 20 
  },
});
