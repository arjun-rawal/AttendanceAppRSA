import React, { useState, useEffect } from "react";
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet , KeyboardAvoidingView, Platform} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { collection, addDoc, query, orderBy, onSnapshot } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import ClassBar from "../components/ClassBar";

const ForumScreen = ({ route, navigation }) => { //use the route.params variable to get class info for the document screen
  const { name, date } = route.params.item;
  console.log("Information the forum got: ",route.params);
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");

  useEffect(() => {
    if (!name || !date) return; // Ensure valid IDs
    console.log(db);
    const forumRef = collection(db, "forums", name, "lessons", date, "messages"); 
    const q = query(forumRef, orderBy("timestamp", "asc"));
  
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loadedMessages = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setMessages(loadedMessages);
    });
  
    return () => unsubscribe();
  }, [name, date]);
  
  const sendMessage = async () => {
    if (userInput.trim() === "") return;
  
    const forumRef = collection(db, "forums", name, "lessons", date, "messages");
    await addDoc(forumRef, {
      text: userInput,
      user: auth.currentUser?.email || "Anonymous",
      timestamp: new Date(),
    });
  
    setUserInput("");
  };
  

  return (
<KeyboardAvoidingView 
  behavior={Platform.OS === "ios" ? "padding" : "height"} 
  style={{ flex: 1 }}
>
  <SafeAreaView style={styles.container}>
    <FlatList
      data={messages}
      renderItem={({ item }) => (
        <View style={styles.messageContainer}>
          <Text style={styles.userText}>{item.user}</Text>
          <Text style={styles.messageText}>{item.text}</Text>
        </View>
      )}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ paddingBottom: 0 }}
    />
    <ClassBar initialIndex={2} navigation={navigation} selectedInfo={route.params} style={{marginBottom:80}}/>
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        placeholder="Type a message"
        value={userInput}
        onChangeText={setUserInput}
        onSubmitEditing={sendMessage}
      />
      <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
        <Text style={styles.sendText}>Send</Text>
      </TouchableOpacity>
    </View>
  </SafeAreaView>

  
</KeyboardAvoidingView>

  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  messageContainer: { padding: 10, borderBottomWidth: 1, borderBottomColor: "#ddd" },
  userText: { fontWeight: "bold" },
  messageText: { fontSize: 16 },
  inputContainer: { flexDirection: "row", padding: 50, alignItems: "center" },
  input: { flex: 1, borderWidth: 1, borderColor: "#ccc", borderRadius: 5, padding: 10 },
  sendButton: { marginLeft: 10, backgroundColor: "#007bff", padding: 10, borderRadius: 5 },
  sendText: { color: "#fff", fontWeight: "bold" },
});

export default ForumScreen;
