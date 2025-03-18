import React, { useState, useEffect } from "react";
import { KeyboardAvoidingView, Platform} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as GoogleGenerativeAI from "@google/generative-ai";
import ClassBar from "../components/ClassBar";
import { useNavigation } from "@react-navigation/native";
import {Markdown} from 'react-native-markdown-display';
import { Image } from 'react-native';
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
import { LinearGradient } from 'expo-linear-gradient';

export default function GeminiChat({ navigation, route }) {
  console.log("Information the assistant got: ", route.params);

  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showStopIcon, setShowStopIcon] = useState(false);

  const API_KEY = "AIzaSyCjcxVUf3QKFfOkpcYaNTWRwmhAtJuSFkU";
  const StyledView = styled(View);
  const StyledText = styled(Text);
  useEffect(() => {
    const startChat = async () => {
      try {
        const genAI = new GoogleGenerativeAI.GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
        const prompt =  "You are Ketchup, an AI assistant designed to help parents and students understand what was covered in class today. Your goal is to provide a clear and supportive experience by summarizing key lessons, explaining concepts in an easy-to-understand way, and guiding students on any missed assignments or materials. \n\n" +
        "If specific details are unavailable, do not speculate—politely suggest checking the teacher’s online portal or asking the student for clarification. \n\n" +
        "Keep responses concise, structured, and engaging. Break down complex topics into simple explanations, using relevant examples when needed to improve understanding. \n\n" +
        "Stay focused on the class topics, assignments, and educational content. If asked unrelated questions, gently redirect the conversation back to coursework. \n\n" +
        "Use a warm and encouraging tone, reassuring parents and students that catching up is manageable. Acknowledge that parents may be unfamiliar with the subject matter and provide guidance in a way that is accessible to all. \n\n" +
        "For example, if a student missed a math lesson on biology, provide a simple explanation of biology, summarize key lesson points, and highlight any assigned homework. If no information is available, say something like: \n\n" +
        "\"I don’t have details on that lesson right now, but checking the teacher’s online portal or asking your student might help!\" \n\n" +
        "Your priority is to be a reliable and understanding guide for parents and students as they catch up on class material. Start this conversation by saying: \n\n" +
        "Never generate your responses in markup language. NO ASTERISKS, ITALICS, BOLD ARE ALLOWED IN YOUR RESPONSE. \n\n" +
        "Heres what you currently know, in JSON format. By no means will you give this as a raw JSON to the user, but use this as a reference to mention the subject name: subject " + (route.params.item.name) +
        " date: "+ route.params.item.date + " Your priority is to be a reliable and understanding guide for parents as they support their child’s learning. Start this conversation by saying Hello "+ route.params.username + "! I'm Ketchup.";



        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text().replace(/\*/g, '');
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
    if (!userInput.trim()) return; // Prevent sending empty messages
  
    setLoading(true);
  
    // Add the user's message to the chat
    const userMessage = { text: userInput, user: true };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
  
    try {
      // Build the conversation context
      const conversationContext = messages
        .map((msg) => (msg.user ? `Parent: ${msg.text}` : `Catchup: ${msg.text}`))
        .join("\n");
  
      // Add the user's current input to the context
      const prompt = `${conversationContext}\nParent: ${userInput}\nCatchup:`;
  
      const genAI = new GoogleGenerativeAI.GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
      const result = await model.generateContent(prompt);
      const response = result.response;
      let text = response.text();
  
      // Remove "Catchup:" from the start of the response, if present
      if (text.startsWith("Catchup:")) {
        text = text.replace("Catchup:", "").trim();
      }
  
      // Add Gemini's response to the chat
      const aiMessage = { text, user: false };
      setMessages((prevMessages) => [...prevMessages, aiMessage]);
  
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
      setUserInput(""); // Clear the input box
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
  <View
    style={[
      styles.messageContainer,
      item.user ? styles.userMessageContainer : styles.aiMessageContainer,
    ]}
  >
    {/* Bubble container with AI logo */}
    <View style={styles.bubbleContainer}>
      {!item.user && (
        <Image
          source={require("../assets/ketchup_head.png")} // Replace with your logo path
          style={styles.aiLogo}
          className="ml-1 mt-2 border rounded-full border-3 pd-2 border-white w-10 h-10"
        />
      )}
      <View
        style={[
          styles.chatBubble,
          item.user ? styles.userBubble : styles.aiBubble,
        ]}
      >
        <Text className={`text-lg font-semibold ${item.user ? "text-white" : "text-black"}`}>{item.text}</Text>
      </View>
    </View>
  </View>
);
  return (
    <SafeAreaView style={styles.container} edges={["left", "right"]}>
      <View style={styles.container}>
      <LinearGradient
                colors={[
                  "rgba(255, 122, 43, 0.8)",
                  "rgba(255, 184, 77, 0.8)",
                  "rgba(255, 122, 43, 0.8)",
                ]}
                className="w-full flex-1"
              >
        <FlatList
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item, index) => `${item.text}-${index}`}
        />
         </LinearGradient>
         </View>
        <KeyboardAvoidingView style={styles.inputContainer}
          className="mb-2">
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
      <ClassBar
        initialIndex={0}
        navigation={navigation}
        selectedInfo={route.params}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ffff"},
  messageContainer: { padding: 10, marginVertical: 5 },
  messageText: { fontSize: 16, textColor: "black", fontWeight: "extra-bold"},
  inputContainer: { flexDirection: "row", alignItems: "center", padding: 10, marginBottom: 80, backgroundColor: "#f4511e"},
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
  userMessageContainer: { alignItems: "flex-end" },
  aiMessageContainer: { alignItems: "flex-start" },
  chatBubble: {
    padding: 10,
    borderRadius: 10,
    maxWidth: "80%",
  },
  userBubble: {
    backgroundColor: "#007AFF",
  },
  aiBubble: {
    backgroundColor: "#F7F7F8",
    marginLeft: 40,

  },
  aiLogo: {
    width: 40, // Adjust size as needed
    height: 40,
    borderRadius: 15,
    position: "absolute", // Position the logo in the top-left corner
    top: -10, // Adjust to position above the bubble
    left: -10, // Adjust to position to the left of the bubble
  },
  
});