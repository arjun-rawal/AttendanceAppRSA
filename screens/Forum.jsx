import React, { useState, useEffect } from "react";
import { 
  View, Text, TextInput, FlatList, TouchableOpacity, 
  StyleSheet, Image, KeyboardAvoidingView, Platform, Modal, ScrollView
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { collection, doc, updateDoc, addDoc, query, orderBy, onSnapshot, arrayUnion, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import * as ImagePicker from "expo-image-picker";
import ClassBar from "../components/ClassBar";

const ForumScreen = ({ route, navigation }) => { 
  const { name, date } = route.params.item;
  const username = route.params.username;
  const [posts, setPosts] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [expandedImage, setExpandedImage] = useState(null);
  const [commentInput, setCommentInput] = useState("");
  const [commentingPostId, setCommentingPostId] = useState(null);

  useEffect(() => {
    if (!name || !date) return;
    const forumRef = collection(db, "forums", name, "lessons", date, "messages"); 
    const q = query(forumRef, orderBy("timestamp", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loadedPosts = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setPosts(loadedPosts);
    });

    return () => unsubscribe();
  }, [name, date]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const sendPost = async () => {
    if (userInput.trim() === "" && !selectedImage) return;

    try {
      const forumRef = collection(db, "forums", name, "lessons", date, "messages");
      await addDoc(forumRef, {
        text: userInput,
        user: username || auth.currentUser?.email || "Anonymous",
        imageUrl: selectedImage || null,
        timestamp: serverTimestamp(),
        comments: []
      });

      setUserInput("");
      setSelectedImage(null);
      setModalVisible(false);
    } catch (error) {
      console.error("Error posting message:", error);
    }
  };

  const addComment = async (postId) => {
    if (commentInput.trim() === "") return;
    const postRef = doc(db, "forums", name, "lessons", date, "messages", postId);
    
    await updateDoc(postRef, {
      comments: arrayUnion({ user: username || "Anonymous", text: commentInput })
    });
    
    setCommentInput("");
    setCommentingPostId(null);
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"} 
      style={{ flex: 1 }}
    >
      <SafeAreaView style={styles.container}>
        <FlatList
          data={posts}
          renderItem={({ item }) => (
            <View style={styles.postContainer}>
              <Text style={styles.userText}>{item.user}</Text>
              <Text style={styles.messageText}>{item.text}</Text>
              {item.imageUrl && (
                <TouchableOpacity onPress={() => setExpandedImage(item.imageUrl)}>
                  <Image source={{ uri: item.imageUrl }} style={styles.postImage} />
                </TouchableOpacity>
              )}
              <FlatList
                data={item.comments}
                renderItem={({ item }) => (
                  <Text style={styles.commentText}><Text style={{ fontWeight: "bold" }}>{item.user}:</Text> {item.text}</Text>
                )}
                keyExtractor={(comment, index) => index.toString()}
              />
              <TextInput
                style={styles.input}
                placeholder="Write a comment..."
                value={commentingPostId === item.id ? commentInput : ""}
                onChangeText={setCommentInput}
                onFocus={() => setCommentingPostId(item.id)}
              />
              <TouchableOpacity style={styles.commentButton} onPress={() => addComment(item.id)}>
                <Text style={styles.commentText}>Comment</Text>
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 10 }}
        />

        <ClassBar initialIndex={2} navigation={navigation} selectedInfo={route.params} />

        <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)} >
          <Text style={styles.fabText}>New</Text>
        </TouchableOpacity>

        <Modal visible={modalVisible} animationType="slide">
          <SafeAreaView style={styles.modalContainer}>
            <ScrollView>
              <Text style={styles.modalTitle}>Create a Post</Text>

              <TextInput
                style={styles.textArea}
                placeholder="Write something..."
                multiline
                value={userInput}
                onChangeText={setUserInput}
              />

              {selectedImage && (
                <Image source={{ uri: selectedImage }} style={styles.previewImage} />
              )}

              <View style={styles.modalButtons}>
                <TouchableOpacity onPress={pickImage} style={styles.imageButton}>
                  <Text style={styles.imageButtonText}>📷 Add Image</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.sendButton} onPress={sendPost}>
                  <Text style={styles.sendText}>Post</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelButton}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </ScrollView>
          </SafeAreaView>
        </Modal>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

  

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  postContainer: { 
    padding: 10, margin: 5, backgroundColor: "#f9f9f9", 
    borderRadius: 8, shadowOpacity: 0.1, shadowOffset: { width: 0, height: 2 } 
  },
  userText: { fontWeight: "bold", fontSize: 14 },
  messageText: { fontSize: 16, marginVertical: 5 },
  postImage: { width: "100%", height: 200, borderRadius: 8, marginTop: 5 },
  commentButton: { marginTop: 5, padding: 5, backgroundColor: "#ddd", borderRadius: 5 },
  commentText: { fontSize: 14, color: "#333" },
  
  // Floating Action Button
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#007bff",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    marginBottom: 70,
    padding: 10,
  },
  fabText: { fontSize: 15, color: "#fff", fontWeight: 'bold' },

  // Modal Styles
  modalContainer: { flex: 1, padding: 20, backgroundColor: "#fff" },
  modalTitle: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  textArea: { 
    borderWidth: 1, borderColor: "#ccc", borderRadius: 5, 
    padding: 10, height: 150, textAlignVertical: "top" 
  },
  previewImage: { width: "100%", height: 200, borderRadius: 8, marginTop: 10 },
  modalButtons: { flexDirection: "row", justifyContent: "space-between", marginTop: 20 },
  imageButton: { padding: 10, borderRadius: 5, backgroundColor: "#ccc" },
  imageButtonText: { fontSize: 16 },
  sendButton: { backgroundColor: "#007bff", padding: 10, borderRadius: 5 },
  sendText: { color: "#fff", fontWeight: "bold" },
  cancelButton: { marginTop: 20, alignSelf: "center" },
  cancelText: { fontSize: 16, color: "red" },
});

export default ForumScreen;
