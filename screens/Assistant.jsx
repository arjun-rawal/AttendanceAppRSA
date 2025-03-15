import React, { useState, useEffect } from "react";
import { KeyboardAvoidingView, Platform} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as GoogleGenerativeAI from "@google/generative-ai";
import ClassBar from "../components/ClassBar";
import { useNavigation } from "@react-navigation/native";
import {Markdown} from 'react-native-markdown-display';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import * as Speech from "expo-speech";
import { FontAwesome } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import FlashMessage, { showMessage } from "react-native-flash-message";
import { styled } from "nativewind";

export default function GeminiChat({ navigation, route }) {
  console.log("Information the assistant got: ", route.params);

  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showStopIcon, setShowStopIcon] = useState(false);

  const API_KEY = "AIzaSyBAqZuiYF6kcFzsyN5V8CABzxELi0PTYGg";
  const StyledView = styled(View);
  const StyledText = styled(Text);
  useEffect(() => {
    const startChat = async () => {
      try {
        const genAI = new GoogleGenerativeAI.GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
        const prompt =  "You are an AI assistant designed to help parents understand what their child missed in class today. Your goal is to provide a friendly and understanding experience while explaining the concepts covered in class and guiding parents on what assignments their student needs to complete. \n\n" +
        "You should only provide information based on the assignments, notes, and materials available for that day. \n\n" +
        "If you are unsure about an answer or lack information, do not speculate—politely let the parent know and suggest checking with the teacher or student. \n\n" +
        "Keep responses concise but informative, breaking down complex topics in an accessible way for parents who may not be familiar with the subject. \n\n" +
        "Stay focused on discussing class topics, assignments, and educational content. If asked unrelated questions, gently steer the conversation back to helping with coursework. \n\n" +
        "Use a warm and supportive tone, acknowledging that parents may be busy and unfamiliar with the material, and reassure them that their student can catch up. \n\n" +
        "For example, if a student missed a math lesson on fractions, provide a simple explanation of the topic, summarize key points from the class, and highlight any assigned homework. If no information is available, say something like: \n\n" +
        "\"I don’t have details on that lesson right now, but checking the teacher’s online portal or asking your student might help!\" \n\n" +
        "Your priority is to be a reliable and understanding guide for parents as they support their child’s learning. Start this conversation by saying Hello parent! I'm Catchup.";
        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();
        console.log(text);
        showMessage({
          message: "Welcome to Gemini Chat 🤖",
          description: text,
          type: "info",
          icon: "info",
          duration: 2000,
        });
        setMessages([
          {
            text,
            user: false,
          },
        ]);
      } catch (error) {
        console.error("Error initializing chat:", error);
        showMessage({
          message: "Error",
          description: "Failed to initialize chat.",
          type: "danger",
          icon: "danger",
          duration: 2000,
        });
      }
    };

    startChat();
  }, []);

  const sendMessage = async () => {
    setLoading(true);
    const userMessage = { text: userInput, user: true };
    setMessages([...messages, userMessage]);

    try {
      const genAI = new GoogleGenerativeAI.GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
      const prompt = userMessage.text;
      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();
      setMessages([...messages, { text, user: false }]);
      if (text && !isSpeaking) {
        Speech.speak(text);
        setIsSpeaking(true);
        setShowStopIcon(true);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      showMessage({
        message: "Error",
        description: "Failed to send message.",
        type: "danger",
        icon: "danger",
        duration: 2000,
      });
    } finally {
      setLoading(false);
      setUserInput("");
    }
  };

  const toggleSpeech = () => {
    console.log("isSpeaking", isSpeaking);
    if (isSpeaking) {
      Speech.stop();
      setIsSpeaking(false);
    } else {
      Speech.speak(messages[messages.length - 1]?.text || "");
      setIsSpeaking(true);
    }
  };

  const ClearMessage = () => {
    setMessages([]);
    setIsSpeaking(false);
  };

  const renderMessage = ({ item }) => (
    <View style={styles.messageContainer}>
      <Text style={[styles.messageText, item.user && styles.userMessage]}>
        {item.text}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <FlatList
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item, index) => `${item.text}-${index}`}
          inverted
        />
        <KeyboardAvoidingView style={styles.inputContainer}>
          <TouchableOpacity style={styles.micIcon} onPress={toggleSpeech}>
            {isSpeaking ? (
              <FontAwesome
                name="microphone-slash"
                size={24}
                color="white"
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                }}
              />
            ) : (
              <FontAwesome
                name="microphone"
                size={24}
                color="white"
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                }}
              />
            )}
          </TouchableOpacity>
          <TextInput
            placeholder="Type a message"
            onChangeText={setUserInput}
            value={userInput}
            onSubmitEditing={sendMessage}
            style={styles.input}
            placeholderTextColor="#fff"
          />
          {showStopIcon && (
            <TouchableOpacity style={styles.stopIcon} onPress={ClearMessage}>
              <Entypo name="controller-stop" size={24} color="white" />
            </TouchableOpacity>
          )}
        </KeyboardAvoidingView>
      </View>
      <ClassBar
        initialIndex={0}
        navigation={navigation}
        selectedInfo={route.params}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ffff", marginTop: 50 },
  messageContainer: { padding: 10, marginVertical: 5 },
  messageText: { fontSize: 16 },
  inputContainer: { flexDirection: "row", alignItems: "center", padding: 50 },
  input: {
    flex: 1,
    padding: 10,
    backgroundColor: "#131314",
    borderRadius: 10,
    height: 50,
    color: "white",
  },
  micIcon: {
    padding: 10,
    backgroundColor: "#131314",
    borderRadius: 25,
    height: 50,
    width: 50,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 5,
  },
  stopIcon: {
    padding: 10,
    backgroundColor: "#131314",
    borderRadius: 25,
    height: 50,
    width: 50,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 3,
  },
});