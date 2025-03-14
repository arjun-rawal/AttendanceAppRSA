import React, { useState } from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { Agenda } from "react-native-calendars";
import { Button, Text } from "react-native-elements";
import { SafeAreaView } from "react-native-safe-area-context";
import { signOut } from "firebase/auth";
import { auth } from "../firebaseConfig";
import HomeNavBar from "../components/HomeNavBar";
import { styled } from "nativewind";


export default function HomeScreen({ navigation, user }) {
  // Sample events for different days.
  // Each event includes its date so we know which date to navigate with.
  const StyledText = styled(Text);
  const StyledView = styled(View);
  const StyledButton = styled(Button);
  const StyledTouchableOpacity = styled(TouchableOpacity);

  const [items, setItems] = useState({
    "2025-03-12": [
      { date: "2025-03-12", name: "History" },
      { date: "2025-03-12", name: "Mathematics" },
      { date: "2025-03-12", name: "Science" }

    ],
    "2025-03-15": [
      { date: "2025-03-15", name: "Science", time: "2:00 PM - 4:00 PM" },
      { date: "2025-03-15", name: "Social Studies", time: "2:00 PM - 4:00 PM" }
    ],
    "2025-03-18": [
      { date: "2025-03-18", name: "English", time: "All Day" },
    ],
  });

 

  return (
    <SafeAreaView style={styles.container}>
      {/* Example welcome text */}
      <StyledText className="text-center font-bold  shadow text-2xl mb-5 ml-2 mr-2">Welcome {user.email}!</StyledText>
      <StyledText className="text-center font-bold border rounded-full shadow text-xl border-solid mt-1 ml-2 mr-2">Absence Count: 3</StyledText>

      <StyledText className="text-center font-bold mt-3 mb-3 text-xl">Calendar: </StyledText>

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
              className="mb-0"
              style={styles.item}
              onPress={() =>
                navigation.navigate("AIChat", { selectedDate: item.date })
              }
            >
              <StyledText style={styles.itemTitle}>{item.name}</StyledText>
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
    backgroundColor: "#fff",
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
    backgroundColor: "white",
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
