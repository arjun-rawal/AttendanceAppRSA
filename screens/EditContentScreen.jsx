import React, { useState, useEffect } from 'react';
import { SafeAreaView, TextInput, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { Button, Text } from 'react-native-elements';

export default function EditContentScreen({ route, navigation }) {
  const { className, selectedDate } = route.params;
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const docRef = doc(db, "classes", className, "lessons", selectedDate);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setContent(docSnap.data().content || "");
        }
      } catch (error) {
        console.error("Error fetching content: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, [className, selectedDate]);

  const saveContent = async () => {
    try {
      const docRef = doc(db, "classes", className, "lessons", selectedDate);
      await setDoc(docRef, { content }, { merge: true });
      Alert.alert("Success", "Content updated successfully.");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", "Failed to update content.");
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#f4511e" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text h4 style={styles.header}>
        Edit Content for {className} on {selectedDate}
      </Text>
      <TextInput
        style={styles.textInput}
        multiline
        placeholder="Enter content..."
        value={content}
        onChangeText={setContent}
      />
      <Button title="Save" onPress={saveContent} buttonStyle={styles.button} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  header: { textAlign: "center", marginBottom: 20 },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    textAlignVertical: "top",
    marginBottom: 20,
  },
  button: { backgroundColor: "#f4511e", borderRadius: 8 },
});
