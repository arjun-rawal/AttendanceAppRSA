// ContentScreen.jsx
import React, { useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import ClassBar from '../components/ClassBar';
export default function ContentScreen({ route, navigation }) {
  // Expect route.params to include { className, selectedDate }
  const { name, date } = route.params.item;
  const className = name;
  const selectedDate = date;
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        console.log(route.params);
        const docRef = doc(db, "classes", className, "lessons", selectedDate);
        
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setContent(docSnap.data().content);
        } else {
          setContent("No content available for this class on this day.");
        }
      } catch (error) {
        console.error(error);
        setContent("Error loading content.");
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, [className, selectedDate]);

  return (
    <SafeAreaView style={styles.container} edges={["left","right"]}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#f4511e" />
        ) : (
          <Text style={styles.contentText}>{content}</Text>
        )}
      </ScrollView>
      <ClassBar
        initialIndex={1}
        navigation={navigation}
        selectedInfo={route.params}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  contentContainer: { padding: 20 },
  contentText: { fontSize: 16 },
});
