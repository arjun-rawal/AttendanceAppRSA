import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, View, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Calendar, AgendaList } from "react-native-calendars";
import { Text } from "react-native-elements";
import HomeNavBar from "../components/HomeNavBar";
import { LinearGradient } from "expo-linear-gradient";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  where,
  Timestamp,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import { DateTime } from "luxon";

function isSameDay(ts1, ts2) {
  if (!ts1 || !ts2) return false;
  console.log("TS2", ts2);
  const d1 =
    ts1 instanceof Timestamp ? ts1.toDate() : DateTime.fromISO(ts1).toJSDate();
  console.log("D1:", d1);

  console.log("D2BEFORE", ts2);
  const d2 = DateTime.fromISO(ts2.substring(1, ts2.length - 1)).toJSDate();
  console.log("D2", d2);
  console.log("DATES:", d1, d2);
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

function timestampToDateString(timestamp) {
  console.log("TIMESTAMP", timestamp);
  const dateObj = timestamp.toDate();
  const year = dateObj.getFullYear();
  const month = `0${dateObj.getMonth() + 1}`.slice(-2);
  const day = `0${dateObj.getDate()}`.slice(-2);
  return `${year}-${month}-${day}`;
}

export default function HomeScreen({ navigation, user,role }) {
  console.log("USER",role)
  if (role=="teacher"){
    navigation.replace("TeacherDashboard")
  }
  const [markedDates, setMarkedDates] = useState({});
  const [agendaItems, setAgendaItems] = useState({});
  const [loading, setLoading] = useState(true);
  const [username, setName] = useState("Parent name unknown");
  // Fetch user info and build marked dates and agenda items.
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        if (!user?.uid) {
          setLoading(false);
          return;
        }

        // 1) Load the user's document
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (!userSnap.exists()) {
          console.log("User doc not found");
          setLoading(false);
          return;
        }
        const userData = userSnap.data();
        setName(userData.name);
        // daysMissed: an array of Timestamps
        const daysMissed = userData.daysMissed || [];
        const userClassIds = userData.Classes || [];
        console.log(userClassIds);
        if (daysMissed.length === 0) {
          setLoading(false);
          return;
        }

        // 2) Fetch each relevant class doc from "Classes"
        if (userClassIds.length === 0) {
          setLoading(false);
          return;
        }
        const classesRef = collection(db, "Classes");
        console.log(userClassIds);
        const q = query(classesRef, where("Id", "in", userClassIds));
        const classSnap = await getDocs(q);
        // Build an array of { className, content }
        const classesData = [];
        classSnap.forEach((docSnap) => {
          const cData = docSnap.data();
          classesData.push({
            className: cData.Name,
            content: cData.Content || [],
          });
        });

        // 3) Build newMarkedDates & newAgendaItems
        const newMarkedDates = {};
        const newAgendaItems = {};

        daysMissed.forEach((missedDayTS) => {
          const dateString = timestampToDateString(missedDayTS);
          newMarkedDates[dateString] = {
            selected: true,
            selectedColor: "red",
          };

          if (!newAgendaItems[dateString]) {
            newAgendaItems[dateString] = [];
          }

          classesData.forEach(({ className, content }) => {
            content.forEach((item) => {
              console.log("MISSEDDAYS", missedDayTS);
              console.log(item.Day);
              if (item.Day && isSameDay(missedDayTS, item.Day)) {
                const itemTitle = `Missed ${className}`;
                newAgendaItems[dateString].push({
                  date: dateString,
                  name: itemTitle,
                });
              }
            });
          });
        });

        setMarkedDates(newMarkedDates);
        setAgendaItems(newAgendaItems);
      } catch (error) {
        console.error("Error fetching user data for missed days:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [user]);

  /**
   * Convert our agendaItems object -> an array of { title, data: [] }
   * for <AgendaList>.
   */
  const convertToSections = (items) => {
    const sections = [];
    Object.keys(items).forEach((date) => {
      sections.push({
        title: date,
        data: items[date],
      });
    });
    return sections;
  };

  const sections = convertToSections(agendaItems);

  // Define handleNavigate before using it.
  const handleNavigate = (item) => {
    navigation.navigate("Assistant", {  item: item, username:username });
  };

  // Renders each agenda item.
  const renderItem = useCallback(
    ({ item }) => {
      return (
        <TouchableOpacity
          style={styles.item}
          onPress={() => handleNavigate(item)}
        >
          <Text style={styles.itemTitle}>{item.name}</Text>
        </TouchableOpacity>
      );
    },
    [handleNavigate]
  );

  // ChatBubble component (as before)
  const ChatBubble = ({ message }) => {
    return (
      <View style={styles.chatBubble}>
        <Text style={styles.chatBubbleText}>{message}</Text>
        <View style={styles.chatBubbleTip} />
      </View>
    );
  };

  // HeaderContent for AgendaList, containing the welcome text, chat bubble, image, and Calendar.
  const HeaderContent = () => (
    <>
      <Text className="font-extrabold text-left text-3xl text-white mt-5 ml-5">
        Welcome
      </Text>
      <Text className="font-extrabold text-left text-2xl text-white ml-5 mb-2">
        {user?.email}!
      </Text>
      <View className="flex-row items-center mb-2 ml-2 mr-8">
        <ChatBubble message="Hey there! You currently have x absences. Don't worry, we're going to get you all caught up!" />
        <Image
          source={require("../assets/ketchup_bot.png")}
          className="w-24 h-28 rounded-full border-4 border-white ml-2 mr-4 mt-2 mb-2 p-2"
        />
      </View>
      <Calendar
        className="border-[5px] border-white rounded-md ml-3 mr-3"
        hideExtraDays={false}
        firstDay={1}
        markedDates={markedDates}
        theme={{
          selectedDayBackgroundColor: "#4A90E2",
          selectedDayTextColor: "white",
          todayTextColor: "#FF7F50",
          todayBackgroundColor: "transparent",
          arrowColor: "#f4511e",
          monthTextColor: "#f4311e",
          textDayFontFamily: "Poppins",
          textMonthFontFamily: "Poppins",
          textDayHeaderFontFamily: "Poppins",
          textDayFontWeight: "700",
          textMonthFontWeight: "800",
          textDayHeaderFontWeight: "400",
          textDayFontSize: 16,
          textMonthFontSize: 22,
          textDayHeaderFontSize: 14,
        }}
      />
      {Object.keys(agendaItems).length === 0 && (
        <Text style={{ textAlign: "center", marginTop: 20 }}>
          No missed days
        </Text>
      )}
    </>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["left", "right"]}>
        <LinearGradient
          colors={[
            "rgba(255, 122, 43, 0.8)",
            "rgba(255, 184, 77, 0.8)",
            "rgba(255, 122, 43, 0.8)",
          ]}
          className="w-full flex-1"
        >
          <Text
            style={{ textAlign: "center", marginVertical: 20, color: "white" }}
          >
            Loading...
          </Text>
        </LinearGradient>
        <HomeNavBar initialIndex={0} navigation={navigation} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["left", "right"]}>
      <LinearGradient
        colors={[
          "rgba(255, 122, 43, 0.8)",
          "rgba(255, 184, 77, 0.8)",
          "rgba(255, 122, 43, 0.8)",
        ]}
        style={styles.linearGradient}
      >
        <AgendaList
          sections={sections}
          renderItem={renderItem}
          sectionStyle={styles.sectionStyle}
          showsVerticalScrollIndicator
          ListHeaderComponent={HeaderContent}
          contentContainerStyle={styles.agendaListContainer}
        />
      </LinearGradient>
      <HomeNavBar initialIndex={0} navigation={navigation} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  linearGradient: {
    flex: 1,
  },
  agendaListContainer: {
    paddingBottom: 100,
  },
  sectionStyle: {
    backgroundColor: "#ddd",
    padding: 5,
    marginHorizontal: 10,
    marginTop: 10,
    borderRadius: 5,
  },
  item: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 15,
    marginHorizontal: 10,
    marginVertical: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  itemTitle: {
    fontWeight: "bold",
    fontSize: 16,
  },
  chatBubble: {
    position: "relative",
    backgroundColor: "white",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 10,
    maxWidth: "80%",
  },
  chatBubbleText: {
    color: "black",
    fontWeight: "600",
  },
  chatBubbleTip: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 8,
    borderStyle: "solid",
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "white",
  },
});
