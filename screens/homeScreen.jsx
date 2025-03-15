import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Calendar } from "react-native-calendars";
import { AgendaList } from "react-native-calendars";
import { Text } from "react-native-elements";
import HomeNavBar from "../components/HomeNavBar";
import {LinearGradient} from "expo-linear-gradient";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  where
} from "firebase/firestore";
import { db } from "../firebaseConfig";

/**
 * Compare two Firestore Timestamps by day, month, and year (ignoring time).
 */
function isSameDay(ts1, ts2) {
  const d1 = ts1.toDate();
  const d2 = ts2.toDate();
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

/**
 * Convert a Firestore Timestamp -> "YYYY-MM-DD" for Calendar / Agenda.
 */
function timestampToDateString(timestamp) {
  const dateObj = timestamp.toDate();
  const year = dateObj.getFullYear();
  const month = (`0${dateObj.getMonth() + 1}`).slice(-2);
  const day = (`0${dateObj.getDate()}`).slice(-2);
  return `${year}-${month}-${day}`;
}

export default function HomeScreen({ navigation, user }) {
  const [markedDates, setMarkedDates] = useState({});
  const [agendaItems, setAgendaItems] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        if (!user?.uid) {
          setLoading(false);
          return;
        }

        // 1) Load the user's doc
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (!userSnap.exists()) {
          console.log("User doc not found");
          setLoading(false);
          return;
        } 

        const userData = userSnap.data();
        // daysMissed: an array of Timestamps
        const daysMissed = userData.daysMissed || [];
        // classes: an array of class IDs
        const userClassIds = userData.Classes || [];
        console.log(userClassIds) 
        // If user has no missed days, we can stop early
        if (daysMissed.length === 0) {
          setLoading(false);
          return;
        }

        // 2) Fetch each relevant class doc from "Classes"
        //    We assume each doc has: { Id: "abc123", name: "Math 101", Content: [ { Day: Timestamp, title?: string, ...}, ... ] }
        if (userClassIds.length === 0) {
          // user has missed days but no classes? We'll show them as "No classes"
          setLoading(false);
          return;
        }

        // Firestore "in" queries can handle up to 10 items at once.
        const classesRef = collection(db, "Classes");
        console.log(userClassIds)
        const q = query(classesRef, where("Id", "in", userClassIds));
        const classSnap = await getDocs(q);
 
        // Build an array of { className, contentArray }
        const classesData = [];
        classSnap.forEach((docSnap) => {

          const cData = docSnap.data();
          classesData.push({
            className: cData.Name,
            content: cData.Content || []
          });
        });
        console.log("MM", classesData)

        // 3) Build newMarkedDates & newAgendaItems by matching each day in daysMissed
        //    with each class's Content item if the day matches
        const newMarkedDates = {};
        const newAgendaItems = {};

        daysMissed.forEach((missedDayTS) => {
          // Mark the date on the calendar
          const dateString = timestampToDateString(missedDayTS);
          newMarkedDates[dateString] = {
            selected: true,
            selectedColor: "red"
          };

          if (!newAgendaItems[dateString]) {
            newAgendaItems[dateString] = [];
          }

          // Check each class for matching content
          classesData.forEach(({ className, content }) => {
            // e.g. content might be [ { Day: Timestamp, title: "Ch 1" }, ...]
            content.forEach((item) => {
              if (item.Day && isSameDay(missedDayTS, item.Day)) {
                // Found a match: user missed this class on this day
                const itemTitle = item.Material
                  ? `Missed ${className} - ${item.Material}`
                  : `Missed ${className}`;
                newAgendaItems[dateString].push({
                  date: dateString,
                  name: itemTitle
                });
              }
            });
          });
        });

        // 4) Store them in state
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
   * Convert our agendaItems object -> an array of { title, data: []}
   * for <AgendaList>.
   */
  const convertToSections = (items) => {
    const sections = [];
    Object.keys(items).forEach((date) => {
      sections.push({
        title: date,
        data: items[date]
      });
    });
    return sections;
  };

  const sections = convertToSections(agendaItems);

  // Renders each item in the AgendaList
  const renderItem = useCallback(({ item }) => {
    // item: { date: "YYYY-MM-DD", name: "Missed Math 101 - Chapter 1" }
    return (
      
      <View style={styles.item}>
        <Text style={styles.itemTitle}>{item.name}</Text>
      </View>
    );
  }, []);

  return (
    <SafeAreaView style={styles.safeArea} edges={['left', 'right']}>
       <LinearGradient colors={['rgba(255, 122, 43, 0.8)', 'rgba(255, 184, 77, 0.8)', 'rgba(255, 122, 43, 0.8)']}

      className="w-full flex-1">
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text className="font-extrabold text-left text-3xl text-white mt-5 ml-5">
          Welcome 
        </Text>
        <Text className="font-extrabold text-left text-2xl text-white ml-5 mb-2">
        {user?.email}!
        </Text>

        {loading ? (
          <Text style={{ textAlign: "center", marginVertical: 20 }}>
            Loading...
          </Text>
        ) : (
          <>
            {/* Show a non-expandable calendar that always shows the full month */}
            <Calendar className="border-[5px] border-white rounded-md width ml-3 mr-3"
              hideExtraDays={false}
              firstDay={1}
              markedDates={markedDates}

              theme={{
                // Selected Day
                selectedDayBackgroundColor: '#4A90E2', // Soft blue background for selected day
                selectedDayTextColor: 'white', // White text on selected day
                
                // Today
                todayTextColor: '#FF7F50', // Coral color for today's text
                todayBackgroundColor: 'transparent', // Transparent background for today
                
                // Arrows
                arrowColor: '#f4511e', // Dark gray for arrows (previous/next month)
                
                // Month Title
                monthTextColor: '#f4311e', // Dark gray for month title
          
                
                // Fonts
                textDayFontFamily: 'Poppins', // Modern sans-serif font for the day text
                textMonthFontFamily: 'Poppins', // Modern sans-serif font for the month title
                textDayHeaderFontFamily: 'Poppins', // Consistent font for day headers
                
                // Font Weight
                textDayFontWeight: '700', // Semi-bold weight for day text for better readability
                textMonthFontWeight: '800', // Semi-bold weight for month text
                textDayHeaderFontWeight: '400', // Lighter weight for day headers (Mon, Tue, etc.)
                
                // Font Size
                textDayFontSize: 16, // Smaller, more refined day font size
                textMonthFontSize: 22, // Slightly larger month text
                textDayHeaderFontSize: 14, // Smaller header font size for day headers (Mon, Tue, etc.)
              }}
            />

            {/* If no missed days => show "No missed days" */}
            {Object.keys(agendaItems).length === 0 ? (
              <Text style={{ textAlign: "center", marginTop: 20 }}>
                No missed days
              </Text>
            ) : (
              <AgendaList
                sections={sections}
                renderItem={renderItem}
                sectionStyle={styles.sectionStyle}
                showsVerticalScrollIndicator
              />
            )}
          </>
        )}
      </ScrollView>
      </LinearGradient>
      <HomeNavBar initialIndex={0} navigation={navigation} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f0f0f0"
  },
  scrollContent: {
    paddingBottom: 100,
  },
  welcomeText: {
    textAlign: "center",
    marginVertical: 10
  },
  calendar: {
    minHeight: 370,
    marginHorizontal: 10,
    marginBottom: 10,
    borderRadius: 10,
    borderColor: "teal",
    borderWidth: 2,
  },
  sectionStyle: {
    backgroundColor: "#ddd",
    padding: 5,
    marginHorizontal: 10,
    marginTop: 10,
    borderRadius: 5
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
    elevation: 2
  },
  itemTitle: {
    fontWeight: "bold",
    fontSize: 16
  }
});
