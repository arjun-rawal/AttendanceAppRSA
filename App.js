import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Button } from '@rneui/themed';
import { ActivityIndicator } from 'react-native';
const { GoogleGenerativeAI } = require("@google/generative-ai");


export default function App() {
  const [story, setStory] = useState('');
  const [loading, setLoading] = useState(false);



  const genAI = new GoogleGenerativeAI("AIzaSyAjy3vPGUqy5KObrgOubwE0ZWPbXz0oJbA");

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
const prompt = "tell me a story in 100 words";


  const handleTellStory = async () => {
    setLoading(true);
    setStory('');
    try {
      const result = await model.generateContent(prompt);
      setStory(result.response.text());
    } catch (error) {
      console.error('Error fetching story:', error);
      setStory('There was an error fetching the story.');
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Button
        title="Tell Me A Story"
        onPress={handleTellStory}
        buttonStyle={styles.button}
        disabled={loading}
      />
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" style={styles.loading} />
      ) : (
        <Text style={styles.storyText}>{story}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#2089dc',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  loading: {
    marginTop: 20,
  },
  storyText: {
    marginTop: 20,
    fontSize: 16,
    textAlign: 'center',
  },
});
