import React, { useState, useEffect } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { WebView } from "react-native-webview"; // <-- Use react-native-webview
import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "../firebaseConfig";
import ClassBar from "../components/ClassBar";

export default function ContentScreen({ navigation, route }) {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  // Hardcode your desired PDF reference
  const fileRef = ref(storage, "grade-3-meaning-of-multiplication-sentences-a.pdf");

  useEffect(() => {
    const fetchPdfUrl = async () => {
      try {
        // 1) Get direct download URL from Firebase
        const directDownloadUrl = await getDownloadURL(fileRef);

        // 2) Embed that URL in Google Docs Viewer
        const googleDocsUrl = `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(
          directDownloadUrl
        )}`;

        setPdfUrl(googleDocsUrl);
      } catch (error) {
        console.error("Failed to get PDF URL:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPdfUrl();
  }, []);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#f4511e" />
      </View>
    );
  }

  return (
    <>
      {/* Render the PDF within a WebView */}
      <View style={styles.webviewContainer}>
        <WebView
          source={{ uri: pdfUrl }}
          onError={error => console.log("WebView error:", error)}
          style={{ flex: 1 }}
        />
      </View>

      {/* Include ClassBar at bottom */}
      <ClassBar
        initialIndex={1}
        navigation={navigation}
        selectedInfo={route?.params}
      />
    </>
  );
}

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  webviewContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
