import React, { useState } from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { Agenda } from "react-native-calendars";
import { Button, Text } from "react-native-elements";
import { SafeAreaView } from "react-native-safe-area-context";
import { signOut } from "firebase/auth";
import { auth } from "../firebaseConfig";
import HomeNavBar from "../components/HomeNavBar";

export default function HomeScreen({ navigation, user }) {
  // Sample events for different days.
  // Each event includes its date so we know which date to navigate with.
  const [items, setItems] = useState({
    "2025-03-12": [
      { date: "2025-03-12", name: "Calc 1" },
      { date: "2025-03-12", name: "Biology 1" },

    ],
    "2025-03-15": [
      { date: "2025-03-15", name: "Science Fair", time: "2:00 PM - 4:00 PM" },
    ],
    "2025-03-18": [
      { date: "2025-03-18", name: "History Project Due", time: "All Day" },
    ],
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Example welcome text */}
      <Text h4 style={styles.title}>Welcome {user.email}!</Text>
      <Text h4 style={styles.title}>Absence Count: 3</Text>

      <View style={styles.agendaContainer}>
        <Agenda
          items={items}


          markedDates={{
            "2025-03-12": {
              selected: true,
              selectedColor: "red",
            },
            "2025-03-15": {
              selected: true,
              selectedColor: "red",
            },
            "2025-03-18": {
              selected: true,
              selectedColor: "red",
            },
          }}

          renderItem={(item) => (
            <TouchableOpacity
              style={styles.item}
              onPress={() =>
                navigation.navigate("Classes", { selectedDate: item.date })
              }
            >
              <Text style={styles.itemTitle}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Bottom nav bar */}
      <HomeNavBar initialIndex={0} navigation={navigation} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    textAlign: "center",
    marginBottom: 10,
  },
  button: {
    marginBottom: 10,
  },
  agendaContainer: {
    flex: 1,
  },
  item: {
    backgroundColor: "#f9f9f9",
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 6,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  itemTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 3,
  },
  itemTime: {
    fontSize: 14,
    color: "#666",
  },
});
