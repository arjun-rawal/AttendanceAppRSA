// ContentScreen.jsx
import React, { useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export default function ContentScreen({ route }) {
  // Expect route.params to include { className, selectedDate }
  const { className, selectedDate } = route.params;
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const docRef = doc(db, "classes", className, "lessons", selectedDate);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setContent(docSnap.data().content);
        } else {
          setContent("No content available for this class on this day.");
        }
      } catch (error) {
        setContent("Error loading content.");
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, [className, selectedDate]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#f4511e" />
        ) : (
          <Text style={styles.contentText}>{content}</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  contentContainer: { padding: 20 },
  contentText: { fontSize: 16 },
});
